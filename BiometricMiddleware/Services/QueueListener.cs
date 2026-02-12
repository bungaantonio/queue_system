using BiometricMiddleware.Models;
using LaunchDarkly.EventSource;
using Microsoft.Extensions.Logging;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace BiometricMiddleware.Services
{
    public class QueueListener
    {
        private readonly ILogger<QueueListener> _logger;
        private readonly ICredentialProvider _biometricProvider;
        private readonly HttpClient _httpClient;
        private readonly string _baseUrl;
        private readonly int _operatorId;
        private int? _lastCalledUserId;

        private readonly SemaphoreSlim _sensorLock = new SemaphoreSlim(1, 1);
        private volatile bool _priorityCaptureActive = false;
        private CancellationTokenSource? _quickEntryCts;

        private List<CredentialCacheItem> _cachedCredentials = new();

        public QueueListener(ILogger<QueueListener> logger, string baseUrl, int operatorId, ICredentialProvider biometricProvider, HttpClient? httpClient = null)
        {
            _logger = logger;
            _baseUrl = baseUrl.TrimEnd('/');
            _operatorId = operatorId;
            _biometricProvider = biometricProvider;
            _httpClient = httpClient ?? new HttpClient();

            _logger.LogInformation("[INIT] QueueListener criado para operador {OperatorId}", _operatorId);
        }

        public async Task RunAsync(CancellationToken cancellationToken)
        {
            // 1. CARGA INICIAL: Baixa os templates do banco de dados ao iniciar
            await RefreshCredentialsCache();

            var sseUrl = $"{_baseUrl}/api/v1/sse/stream";
            var config = Configuration.Builder(new Uri(sseUrl)).Build();

            using var eventSource = new EventSource(config);
            _logger.LogInformation("[SSE] Conectando ao servidor em {Url}", _baseUrl);

            eventSource.MessageReceived += async (sender, e) =>
            {
                try
                {
                    _logger.LogInformation("[SSE RECEBIDO] Event: {Event}, Data: {Data}", e.Message.Name, e.Message.Data);

                    if (e.Message.Name == "queue_sync")
                    {
                        var queueState = JsonSerializer.Deserialize<QueueState>(e.Message.Data, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
                        if (queueState?.Called != null && _lastCalledUserId != queueState.Called.Id)
                        {
                            _lastCalledUserId = queueState.Called.Id;
                            _ = Task.Run(() => AuthenticateUser(queueState.Called));
                        }
                        else if (queueState?.Called == null) _lastCalledUserId = null;
                    }

                    if (e.Message.Name == "command_capture")
                    {
                        var command = JsonSerializer.Deserialize<BiometricCommand>(e.Message.Data);
                        if (command?.OperatorId == _operatorId)
                            _ = Task.Run(() => HandleRegistrationCapture(command.TempSessionId));
                    }
                }
                catch (Exception ex) { _logger.LogWarning("[ERRO SENSOR] {Error}", ex.Message); }
            };

            _ = Task.Run(() => QuickEntryLoop(cancellationToken));
            await eventSource.StartAsync();
        }

        private async Task<string> CaptureWithRetriesAsync(int requiredCaptures = 3)
        {
            var captures = new List<string>();

            for (int i = 0; i < requiredCaptures; i++)
            {
                _logger.LogInformation("[CAPTURE] Leitura {Current}/{Total}. Coloque o dedo...", i + 1, requiredCaptures);

                string identifier = await _biometricProvider.CaptureIdentifierAsync();

                if (string.IsNullOrEmpty(identifier))
                {
                    _logger.LogWarning("[CAPTURE] Leitura inválida. Tentando novamente...");
                    i--;
                    continue;
                }

                captures.Add(identifier);
                await Task.Delay(800);
            }

            string finalIdentifier = captures.Last();
            _logger.LogInformation("[CAPTURE] Captura robusta concluída com {Count} leituras.", captures.Count);
            return finalIdentifier;
        }

        private async Task RefreshCredentialsCache()
        {
            try
            {
                var response = await _httpClient.GetAsync($"{_baseUrl}/api/v1/credential/active-templates");

                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogWarning("[CACHE] Falha ao atualizar cache. Status: {Status}", response.StatusCode);
                    return;
                }

                var json = await response.Content.ReadAsStringAsync();
                _cachedCredentials = JsonSerializer.Deserialize<List<CredentialCacheItem>>(
                    json,
                    new JsonSerializerOptions { PropertyNameCaseInsensitive = true }
                ) ?? new List<CredentialCacheItem>();

                _logger.LogInformation("[CACHE] {Count} templates carregados do servidor.", _cachedCredentials.Count);
            }
            catch (Exception ex)
            {
                _logger.LogError("[CACHE] Erro ao conectar no servidor para carregar templates: {Error}", ex.Message);
            }
        }

        private async Task QuickEntryLoop(CancellationToken token)
        {
            while (!token.IsCancellationRequested)
            {
                if (_priorityCaptureActive)
                {
                    await Task.Delay(500, token);
                    continue;
                }

                _quickEntryCts = CancellationTokenSource.CreateLinkedTokenSource(token);
                await _sensorLock.WaitAsync(token);
                try
                {
                    _logger.LogInformation("[QUICK ENTRY] Aguardando dedo...");
                    string capturedTemplate = await _biometricProvider.CaptureIdentifierAsync(_quickEntryCts.Token);

                    if (!string.IsNullOrEmpty(capturedTemplate))
                    {
                        _logger.LogInformation("[MATCH] Comparando digital com {Count} templates em cache...", _cachedCredentials.Count);

                        CredentialCacheItem? matchedUser = null;
                        int highestScore = 0;

                        foreach (var cred in _cachedCredentials)
                        {
                            int score = ((ZKBiometricProvider)_biometricProvider).MatchTemplates(capturedTemplate, cred.Template);

                            if (score > highestScore)
                            {
                                matchedUser = cred;
                                highestScore = score;
                            }
                        }

                        // Score > 60 para teste (ZKTeco recomenda 80 para produção)
                        if (matchedUser != null && highestScore > 60)
                        {
                            _logger.LogInformation("[MATCH SUCCESS] Usuário {UserId} identificado! Score: {Score}",
                                matchedUser.UserId, highestScore);

                            await PostJson("/api/v1/queue/quick-entry",
                                new { identifier = matchedUser.Template });

                            await Task.Delay(2000, token); // Evita duplicados imediatos
                        }
                        else
                        {
                            _logger.LogWarning("[MATCH FAIL] Nenhuma correspondência. Melhor Score: {Score} com User {UserId}. (Mínimo: 60)",
                                highestScore, matchedUser?.UserId ?? 0);
                        }
                    }
                }
                catch (OperationCanceledException)
                {
                    _logger.LogDebug("[QUICK ENTRY] Captura cancelada devido a operação prioritária.");
                }
                catch (Exception ex)
                {
                    _logger.LogError("[QUICK ENTRY] Erro inesperado: {Error}", ex.Message);
                }
                finally { _sensorLock.Release(); }
            }
        }

        private async Task HandleRegistrationCapture(string sessionId)
        {
            _logger.LogInformation("[CADASTRO] Captura prioritária iniciada. Sessão: {SessionId}", sessionId);
            _priorityCaptureActive = true;
            try { _quickEntryCts?.Cancel(); } catch { }

            await _sensorLock.WaitAsync();
            try
            {
                string rawIdentifier = await CaptureWithRetriesAsync(3);
                if (!string.IsNullOrEmpty(rawIdentifier))
                {
                    await PostJson("/api/v1/credential/register-capture", new { session_id = sessionId, credential_id = rawIdentifier });
                    _logger.LogInformation("[CADASTRO] Enviado com sucesso! Atualizando cache local...");

                    // Forçar recarregar o cache até que o template apareça
                    bool loaded = false;
                    for (int i = 0; i < 5; i++)
                    {
                        await Task.Delay(800);
                        await RefreshCredentialsCache();
                        if (_cachedCredentials.Any(c => c.Template == rawIdentifier))
                        {
                            loaded = true;
                            break;
                        }
                    }

                    if (!loaded)
                        _logger.LogWarning("[CACHE] Template cadastrado não apareceu no cache após 5 tentativas.");
                }
            }
            finally
            {
                _sensorLock.Release();
                _priorityCaptureActive = false;
                _logger.LogDebug("[CADASTRO] Sensor liberado.");
            }
        }


        private async Task AuthenticateUser(QueueItem item)
        {
            _logger.LogInformation("[CHAMADA] Aguardando autenticação para: {UserName}", item.Name);
            _priorityCaptureActive = true;

            await _sensorLock.WaitAsync();
            try
            {
                // 1. Captura o dedo da pessoa que levantou
                string capturedTemplate = await CaptureWithRetriesAsync(2);
                if (!string.IsNullOrEmpty(capturedTemplate))
                {
                    // 2. O Middleware procura no cache dele quem é esse dedo
                    var match = _cachedCredentials.FirstOrDefault(c =>
                        ((ZKBiometricProvider)_biometricProvider).MatchTemplates(capturedTemplate, c.Template) > 80);

                    // 3. Verifica se o dedo é realmente da pessoa que foi chamada (item.UserId)
                    if (match != null && match.UserId == item.UserId)
                    {
                        _logger.LogInformation("[CHAMADA] Biometria confirmada para {UserName}!", item.Name);

                        var payload = new
                        {
                            queue_item_id = item.Id,
                            credential = match.Template, // Envia o template EXATO do banco
                            call_token = item.CallToken ?? "token-validacao-manual",
                            operator_id = _operatorId
                        };

                        await PostJson("/api/v1/credential/authenticate", payload);
                    }
                    else
                    {
                        _logger.LogWarning("[CHAMADA] Dedo não confere com o usuário chamado ou não reconhecido.");
                    }
                }
            }
            finally
            {
                _sensorLock.Release();
                _priorityCaptureActive = false;
            }
        }

        private async Task PostJson(string endpoint, object data)
        {
            try
            {
                var content = new StringContent(JsonSerializer.Serialize(data), Encoding.UTF8, "application/json");
                var response = await _httpClient.PostAsync($"{_baseUrl}{endpoint}", content);

                if (!response.IsSuccessStatusCode)
                {
                    var err = await response.Content.ReadAsStringAsync();
                    _logger.LogError("[HTTP POST] Falha no endpoint {Endpoint}: {Error}", endpoint, err);
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning("[HTTP POST] Exceção ao enviar POST para {Endpoint}: {Error}", endpoint, ex.Message);
            }
        }
    }

    public class BiometricCommand
    {
        [JsonPropertyName("operator_id")]
        public int OperatorId { get; set; }

        [JsonPropertyName("temp_session_id")]
        public required string TempSessionId { get; set; }
    }
}