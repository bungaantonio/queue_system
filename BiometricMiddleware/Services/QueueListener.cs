using BiometricMiddleware.Models;
using LaunchDarkly.EventSource;
using Microsoft.Extensions.Logging;
using System;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace BiometricMiddleware.Services
{
    public class QueueListener
    {
        private readonly ILogger<QueueListener> _logger;
        private readonly IBiometricProvider _biometricProvider;
        private readonly HttpClient _httpClient;
        private readonly string _baseUrl;
        private readonly int _operatorId;
        private int? _lastCalledUserId;

        // Semáforo para garantir que apenas UMA parte do código use o sensor por vez
        private readonly SemaphoreSlim _sensorLock = new SemaphoreSlim(1, 1);

        // Estado atual para o loop de Quick Entry saber se deve ignorar a captura
        private volatile bool _priorityCaptureActive = false;

        public QueueListener(ILogger<QueueListener> logger, string baseUrl, int operatorId, IBiometricProvider biometricProvider, HttpClient? httpClient = null)
        {
            _biometricProvider = biometricProvider;
            _httpClient = httpClient ?? new HttpClient();
            _baseUrl = baseUrl.TrimEnd('/');
            _operatorId = operatorId;
            _logger = logger;

            _logger.LogInformation("[INIT] QueueListener criado para operador {OperatorId} com baseUrl {BaseUrl}", _operatorId, _baseUrl);
        }

        public async Task RunAsync(CancellationToken cancellationToken)
        {


            var sseUrl = $"{_baseUrl}/api/v1/sse/stream";
            var config = Configuration.Builder(new Uri(sseUrl)).Build();

            using var eventSource = new EventSource(config);

            _logger.LogInformation("[SSE] Conectando ao servidor em {Url}", _baseUrl);
            _logger.LogInformation("[SSE] EventSource iniciado e aguardando mensagens...");

            eventSource.MessageReceived += async (sender, e) =>
            {
                try
                {
                    _logger.LogInformation("[SSE RECEBIDO] Event: {Event}, Data: {Data}", e.Message.Name, e.Message.Data);

                    // 1. EVENTO: Sincronização de Fila (Autenticação de Chamada)
                    if (e.Message.Name == "queue_sync")
                    {
                        var queueState = JsonSerializer.Deserialize<QueueState>(e.Message.Data, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
                        if (queueState?.Called != null && _lastCalledUserId != queueState.Called.Id)
                        {
                            _lastCalledUserId = queueState.Called.Id;
                            // Dispara sem travar o SSE
                            _ = Task.Run(() => AuthenticateUser(queueState.Called));
                        }
                        else if (queueState?.Called == null) { _lastCalledUserId = null; }
                    }

                    // 2. EVENTO: Comando de Cadastro (Vindo do React Admin)
                    if (e.Message.Name == "command_capture")
                    {
                        var command = JsonSerializer.Deserialize<BiometricCommand>(e.Message.Data);
                        if (command?.OperatorId == _operatorId)
                        {
                            _ = Task.Run(() => HandleRegistrationCapture(command.TempSessionId));
                        }
                    }

                }
                catch (Exception ex) { _logger.LogWarning("[ERRO SENSOR] {Error}", ex.Message); }
            };


            // Inicia o loop de entrada rápida em background
            _ = Task.Run(() => QuickEntryLoop(cancellationToken));

            await eventSource.StartAsync();
        }

        private CancellationTokenSource? _quickEntryCts;
        private async Task QuickEntryLoop(CancellationToken token)
        {
            while (!token.IsCancellationRequested)
            {
                // Se houver comando de cadastro, o loop de entrada rápida dorme totalmente
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
                    // Pega o token para a captura
                    string hash = await _biometricProvider.CaptureHashAsync(_quickEntryCts.Token);

                    // VERIFICAÇÃO CRÍTICA: Se enquanto eu esperava o dedo, o modo cadastro foi ativado,
                    // eu NÃO processo essa digital como Quick Entry.
                    if (!string.IsNullOrEmpty(hash) && !_priorityCaptureActive)
                    {
                        _logger.LogInformation("[QUICK ENTRY] Digital detectada, enviando...");
                        await PostJson("/api/v1/biometrics/quick-entry", new { biometric_id = hash, operator_id = _operatorId });
                        await Task.Delay(2000, token);
                    }
                }
                catch(OperationCanceledException)
                {
                    _logger.LogDebug("[QUICK ENTRY] Captura cancelada devido a operação prioritária.");
                }
                finally { _sensorLock.Release(); }

            }
        }

        private async Task HandleRegistrationCapture(string sessionId)
        {
            _logger.LogInformation("[CADASTRO] Iniciando captura prioritária. Sessão: {SessionId}", sessionId);

            _priorityCaptureActive = true;

            // Cancela a leitura da Entrada Rápida IMEDIATAMENTE
            try { _quickEntryCts?.Cancel(); } catch { }

            await _sensorLock.WaitAsync(); // Espera o QuickEntryLoop soltar o hardware
            try
            {
                // Aqui chamamos SEM o token de cancelamento da entrada rápida
                // para que ele espere o tempo que for necessário para o cadastro.
                string hash = await _biometricProvider.CaptureHashAsync(CancellationToken.None);

                if (!string.IsNullOrEmpty(hash))
                {
                    await PostJson("/api/v1/biometrics/register-capture", new { session_id = sessionId, biometric_id = hash });
                    _logger.LogInformation("[CADASTRO] Sucesso! Enviado para o servidor.");
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
            _logger.LogInformation("[CHAMADA] Usuário chamado: {UserName}. Aguardando biometria...", item.Name);

            _priorityCaptureActive = true;

            await _sensorLock.WaitAsync();
            try
            {
                string hash = await _biometricProvider.CaptureHashAsync();
                if (!string.IsNullOrEmpty(hash))
                {
                    var payload = new
                    {
                        queue_item_id = item.Id,
                        biometric_hash = hash,
                        call_token = item.CallToken,
                        operator_id = _operatorId
                    };
                    await PostJson("/api/v1/biometrics/authenticate", payload);
                    _logger.LogInformation("[CHAMADA] Digital capturada, enviando autenticação para API...");

                }
                _logger.LogInformation("[CHAMADA] Usuário {UserName} autenticado com sucesso.", item.Name);

            }
            finally
            {
                _sensorLock.Release();
                _priorityCaptureActive = false;
                _logger.LogDebug("[CHAMADA] Sensor liberado, captura prioritária finalizada.");

            }
        }

        private async Task PostJson(string endpoint, object data)
        {

            try
            {
                _logger.LogDebug("[HTTP POST] Endpoint: {Endpoint}, Payload: {Payload}", endpoint, JsonSerializer.Serialize(data));

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

    public class BiometricCommand {

        [JsonPropertyName("operator_id")]
        public int OperatorId { get; set; }
        
        [JsonPropertyName("temp_session_id")]
        public required string TempSessionId { get; set; } }
}