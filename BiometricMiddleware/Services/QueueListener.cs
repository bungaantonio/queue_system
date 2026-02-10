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
                    string rawIdentifier = await _biometricProvider.CaptureIdentifierAsync(_quickEntryCts.Token);

                    if (!string.IsNullOrEmpty(rawIdentifier) && !_priorityCaptureActive)
                    {
                        _logger.LogInformation("[QUICK ENTRY] Identificador detectado, enviando para backend...");
                        await PostJson("/api/v1/queue/quick-entry", new { identifier = rawIdentifier });
                        await Task.Delay(2000, token);
                    }
                }
                catch (OperationCanceledException)
                {
                    _logger.LogDebug("[QUICK ENTRY] Captura cancelada devido a operação prioritária.");
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
                string rawIdentifier = await _biometricProvider.CaptureIdentifierAsync();
                if (!string.IsNullOrEmpty(rawIdentifier))
                {
                    await PostJson("/api/v1/credential/register-capture", new { session_id = sessionId, biometric_id = rawIdentifier });
                    _logger.LogInformation("[CADASTRO] Enviado com sucesso!");
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
            _logger.LogInformation("[CHAMADA] Usuário chamado: {UserName}", item.Name);
            _priorityCaptureActive = true;

            await _sensorLock.WaitAsync();
            try
            {
                string rawIdentifier = await _biometricProvider.CaptureIdentifierAsync();
                if (!string.IsNullOrEmpty(rawIdentifier))
                {
                    var payload = new
                    {
                        queue_item_id = item.Id,
                        biometric_hash = rawIdentifier, // valor cru
                        call_token = item.CallToken,
                        operator_id = _operatorId
                    };
                    await PostJson("/api/v1/credential/authenticate", payload);
                    _logger.LogInformation("[CHAMADA] Digital enviada para autenticação.");
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
