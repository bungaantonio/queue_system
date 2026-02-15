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

        // Estado do usuário chamado no momento
        private QueueItem? _currentCalledUser = null;

        private readonly SemaphoreSlim _sensorLock = new SemaphoreSlim(1, 1);
        private volatile bool _priorityCaptureActive = false;
        private List<CredentialCacheItem> _cachedCredentials = new();
        private DateTime _lastCacheRefreshUtc = DateTime.MinValue;
        private static readonly TimeSpan CacheRefreshInterval = TimeSpan.FromSeconds(10);

        private CancellationTokenSource? _loopCts;

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
            // 1. Carga inicial de templates
            await RefreshCredentialsCache();

            var sseUrl = $"{_baseUrl}/api/v1/sse/stream";
            var config = Configuration.Builder(new Uri(sseUrl)).Build();
            using var eventSource = new EventSource(config);

            eventSource.MessageReceived += (sender, e) =>
            {
                try
                {
                    if (e.Message.Name == "queue_sync")
                    {
                        var queueState = JsonSerializer.Deserialize<QueueState>(e.Message.Data, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

                        // Atualiza quem é o usuário que o sensor deve priorizar
                        if (queueState?.Called != null)
                        {
                            if (_currentCalledUser?.Id != queueState.Called.Id)
                            {
                                _currentCalledUser = queueState.Called;
                                _logger.LogInformation("[SSE] USUÁRIO CHAMADO: {Name} (User ID: {Uid}, Queue ID: {Qid})",
                                    _currentCalledUser.User?.Name, _currentCalledUser.User?.Id, _currentCalledUser.Id);
                            }
                        }
                        else
                        {
                            if (_currentCalledUser != null) _logger.LogInformation("[SSE] Chamada encerrada/limpa.");
                            _currentCalledUser = null;
                        }
                    }

                    if (e.Message.Name == "command_capture")
                    {
                        var command = JsonSerializer.Deserialize<BiometricCommand>(e.Message.Data);
                        if (command == null || string.IsNullOrWhiteSpace(command.TempSessionId))
                        {
                            _logger.LogWarning("[SSE] COMANDO DE CADASTRO inválido: payload sem temp_session_id.");
                            return;
                        }

                        // IMPORTANTE: Cancelamos a leitura atual do loop para dar prioridade ao cadastro
                        _logger.LogInformation("[SSE] COMANDO DE CADASTRO RECEBIDO. SESSÃO: {Id}", command.TempSessionId);
                        _loopCts?.Cancel();
                        _ = Task.Run(() => HandleRegistrationCapture(command.TempSessionId));
                    }
                }
                catch (Exception ex) { _logger.LogError("[SSE ERRO] Falha ao processar evento: {Error}", ex.Message); }
            };

            // Inicia o loop principal de biometria
            _ = Task.Run(() => MainBiometricLoop(cancellationToken));

            await eventSource.StartAsync();
        }

        private async Task MainBiometricLoop(CancellationToken externalToken)
        {
            while (!externalToken.IsCancellationRequested)
            {
                if (_priorityCaptureActive) { await Task.Delay(500, externalToken); continue; }

                // Criamos um token que pode ser cancelado pelo comando de cadastro
                _loopCts = CancellationTokenSource.CreateLinkedTokenSource(externalToken);

                await _sensorLock.WaitAsync(externalToken);
                try
                {
                    // Log informativo de estado
                    if (_currentCalledUser?.User != null)
                        _logger.LogInformation("[MODO EXCLUSIVO] Aguardando apenas: {Name}...", _currentCalledUser.User.Name);
                    else
                        _logger.LogInformation("[MODO LIVRE] Aguardando dedo para entrada rápida...");

                    string capturedTemplate = await _biometricProvider.CaptureIdentifierAsync(_loopCts.Token);
                    if (string.IsNullOrEmpty(capturedTemplate)) continue;

                    // Mantém o cache sincronizado sem sobrecarregar o backend.
                    await RefreshCredentialsCacheIfNeeded();

                    CredentialCacheItem? matchedUser = null;
                    int highestScore = 0;

                    foreach (var cred in _cachedCredentials)
                    {
                        int score = ((ZKBiometricProvider)_biometricProvider).MatchTemplates(capturedTemplate, cred.Template);
                        if (score > highestScore) { matchedUser = cred; highestScore = score; }
                    }

                    // --- LÓGICA DE DECISÃO ALTERADA ---

                    if (_currentCalledUser?.User != null)
                    {
                        // ESTAMOS EM MODO DE CHAMADA: Só aceita o usuário específico
                        if (matchedUser != null && matchedUser.UserId == _currentCalledUser.User.Id && highestScore > 75)
                        {
                            _logger.LogInformation("[CHAMADA] Sucesso! Digital de {Name} confirmada.", _currentCalledUser.User.Name);

                            var payload = new
                            {
                                queue_item_id = _currentCalledUser.Id,
                                credential = matchedUser.Template,
                                call_token = _currentCalledUser.CallToken ?? "token-middleware",
                                operator_id = _operatorId
                            };

                            await PostJson("/api/v1/credential/authenticate", payload);
                            _currentCalledUser = null; // Limpa para voltar ao modo livre
                        }
                        else
                        {
                            // Alguém colocou o dedo, mas não é quem foi chamado (ou a digital não foi reconhecida)
                            string nomeIdentificado = matchedUser != null ? $"Usuário {matchedUser.UserId}" : "Desconhecido";
                            _logger.LogWarning("[CHAMADA NEGADA] O dedo colocado pertence a {Quem} e não ao usuário chamado ({Esperado}).",
                                nomeIdentificado, _currentCalledUser.User.Name);

                            // Opcional: Você pode enviar um sinal para o backend avisar na tela "Dedo Incorreto"
                        }
                    }
                    else
                    {
                        // ESTAMOS EM MODO LIVRE: Entrada rápida normal
                        if (matchedUser != null && highestScore > 75)
                        {
                            _logger.LogInformation("[QUICK ENTRY] Usuário {Id} identificado. Criando senha...", matchedUser.UserId);
                            await PostJson("/api/v1/queue/quick-entry", new { identifier = matchedUser.Template });
                        }
                        else
                        {
                            _logger.LogWarning("[MATCH FAIL] Digital não reconhecida no sistema.");
                        }
                    }

                    // Delay maior em caso de erro/negação para o usuário ter tempo de ler/reagir
                    await Task.Delay(2000, externalToken);
                }
                catch (OperationCanceledException)
                {
                    _logger.LogDebug("[LOOP] Leitura interrompida para priorizar cadastro.");
                }
                catch (Exception ex)
                {
                    _logger.LogError("[LOOP] Erro: {Error}", ex.Message);
                }
                finally { _sensorLock.Release(); await Task.Delay(500, externalToken); }
            }
        }

        private async Task HandleRegistrationCapture(string sessionId)
        {
            _priorityCaptureActive = true;
            _logger.LogInformation("[CADASTRO] Iniciando processo para Sessão: {SessionId}", sessionId);

            await _sensorLock.WaitAsync(); // Aguarda o sensor ser liberado pelo loop (que acabamos de cancelar)
            try
            {
                // O cadastro exige 3 leituras para criar um template robusto
                string finalTemplate = "";
                for (int i = 1; i <= 3; i++)
                {
                    _logger.LogInformation("[CADASTRO] Leitura {I}/3. Coloque o dedo...", i);
                    string temp = await _biometricProvider.CaptureIdentifierAsync();

                    if (string.IsNullOrEmpty(temp)) { i--; continue; } // Se falhar a leitura, repete a mesma etapa
                    finalTemplate = temp;
                    await Task.Delay(800);
                }

                if (!string.IsNullOrEmpty(finalTemplate))
                {
                    _logger.LogInformation("[CADASTRO] Sucesso! Enviando template para o servidor...");
                    var captureAccepted = await PostJson("/api/v1/credential/register-capture", new { session_id = sessionId, credential_id = finalTemplate });

                    if (captureAccepted)
                    {
                        // A credencial pode ser persistida alguns segundos depois (fluxo frontend).
                        _logger.LogInformation("[CADASTRO] Finalizado. Atualizando cache local com retry...");
                        await RefreshCredentialsCacheWithRetry();
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("[CADASTRO] Erro durante o processo: {Error}", ex.Message);
            }
            finally
            {
                _sensorLock.Release();
                _priorityCaptureActive = false;
                _logger.LogInformation("[CADASTRO] Modo prioritário encerrado.");
            }
        }

        private async Task RefreshCredentialsCache()
        {
            try
            {
                var response = await _httpClient.GetAsync($"{_baseUrl}/api/v1/credential/active-templates");
                if (response.IsSuccessStatusCode)
                {
                    var json = await response.Content.ReadAsStringAsync();
                    _cachedCredentials = JsonSerializer.Deserialize<List<CredentialCacheItem>>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true }) ?? new();
                    _lastCacheRefreshUtc = DateTime.UtcNow;
                    _logger.LogInformation("[CACHE] {Count} templates carregados.", _cachedCredentials.Count);
                }
            }
            catch (Exception ex) { _logger.LogError("[CACHE ERRO] {Error}", ex.Message); }
        }

        private async Task RefreshCredentialsCacheIfNeeded()
        {
            if ((DateTime.UtcNow - _lastCacheRefreshUtc) < CacheRefreshInterval) return;
            await RefreshCredentialsCache();
        }

        private async Task RefreshCredentialsCacheWithRetry(int attempts = 5, int delayMs = 2000)
        {
            int initialCount = _cachedCredentials.Count;

            for (int i = 1; i <= attempts; i++)
            {
                await RefreshCredentialsCache();

                if (_cachedCredentials.Count > initialCount)
                {
                    _logger.LogInformation("[CACHE] Novo template detectado após cadastro (tentativa {Attempt}/{Attempts}).", i, attempts);
                    return;
                }

                if (i < attempts)
                {
                    _logger.LogInformation("[CACHE] Nenhuma alteração após cadastro (tentativa {Attempt}/{Attempts}). Aguardando...", i, attempts);
                    await Task.Delay(delayMs);
                }
            }

            _logger.LogWarning("[CACHE] Cadastro recebido, mas nenhum novo template foi encontrado no período de espera.");
        }

        private async Task<bool> PostJson(string endpoint, object data)
        {
            try
            {
                var content = new StringContent(JsonSerializer.Serialize(data), Encoding.UTF8, "application/json");
                var response = await _httpClient.PostAsync($"{_baseUrl}{endpoint}", content);

                if (response.IsSuccessStatusCode)
                {
                    _logger.LogInformation("[HTTP] Sucesso: {Endpoint}", endpoint);
                    if (endpoint == "/api/v1/credential/register-capture")
                    {
                        var payload = await response.Content.ReadAsStringAsync();
                        if (payload.Contains("\"status\":\"error\"", StringComparison.OrdinalIgnoreCase))
                        {
                            _logger.LogError("[HTTP ERRO] {Endpoint} respondeu status=error no corpo.", endpoint);
                            return false;
                        }
                    }
                    return true;
                }
                else if (response.StatusCode == System.Net.HttpStatusCode.Conflict) // Erro 409
                {
                    _logger.LogWarning("[HTTP CONFLITO] O servidor recusou a autenticação: Já existe um atendimento em curso ou pendente.");
                }
                else
                {
                    var err = await response.Content.ReadAsStringAsync();
                    _logger.LogError("[HTTP ERRO] Status {Status} em {Endpoint}: {Error}", response.StatusCode, endpoint, err);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("[HTTP EXCEÇÃO] Erro ao conectar em {Endpoint}: {Error}", endpoint, ex.Message);
            }

            return false;
        }

        public class BiometricCommand
        {
            [JsonPropertyName("operator_id")]
            public int OperatorId { get; set; }

            [JsonPropertyName("temp_session_id")]
            public required string TempSessionId { get; set; }
        }
    }
}
