using System;
using System.Security.Cryptography;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using libzkfpcsharp;
using Microsoft.Extensions.Logging;

namespace BiometricsBridge.Services
{
    public class TemplateCapturedEventArgs : EventArgs
    {
        public string TemplateBase64 { get; set; } = string.Empty;
    }

    public class DeviceService : IDisposable
    {
        private readonly zkfp _fpInstance = new zkfp();
        private bool _isConnected = false;
        private int _templateBufSize = 2048;
        private int _imageWidth = 0;
        private int _imageHeight = 0;
        private readonly ILogger<DeviceService> _logger;
        private volatile bool _disposed = false;
        private byte[]? _fpBuffer;
        private byte[]? _capTmp;

        // Para debounce/evitar duplicatas
        private string? _lastTemplateHash = null;
        private DateTime _lastCaptureTime = DateTime.MinValue;
        private readonly TimeSpan _captureCooldown = TimeSpan.FromMilliseconds(700);

        public event EventHandler<TemplateCapturedEventArgs>? OnTemplateCaptured;
        public event EventHandler<string>? OnStatusChanged;

        public DeviceService(ILogger<DeviceService> logger)
        {
            _logger = logger;
        }

        public async Task StartCaptureAsync(CancellationToken token)
        {
            OnStatusChanged?.Invoke(this, "Loop de captura iniciado");
            _logger.LogInformation("StartCaptureAsync chamado.");

            while (!token.IsCancellationRequested && !_disposed)
            {
                try
                {
                    // Inicializa se necessário
                    if (!_isConnected)
                    {
                        _logger.LogInformation("Dispositivo não conectado. Tentando inicializar...");
                        if (!InitializeAndConnect())
                        {
                            _logger.LogWarning("Falha ao inicializar. Retentando em 2s...");
                            OnStatusChanged?.Invoke(this, "Falha na conexão. Retentando...");
                            await Task.Delay(2000, token);
                            continue;
                        }
                        _logger.LogInformation("Dispositivo inicializado com sucesso.");
                        OnStatusChanged?.Invoke(this, "Dispositivo conectado. Aguardando dedo...");
                    }

                    if (_fpBuffer == null || _capTmp == null)
                    {
                        _fpBuffer = new byte[_imageWidth * _imageHeight];
                        _capTmp = new byte[_templateBufSize];
                    }

                    int templateSize = _templateBufSize;
                    int ret = _fpInstance.AcquireFingerprint(_fpBuffer, _capTmp, ref templateSize);

                    if (ret == zkfp.ZKFP_ERR_OK && templateSize > 0)
                    {
                        string templateB64 = Convert.ToBase64String(_capTmp, 0, templateSize);
                        string hash = ComputeHash(templateB64);

                        // Debounce: ignora se capturado recentemente ou duplicado
                        if ((DateTime.UtcNow - _lastCaptureTime) > _captureCooldown && hash != _lastTemplateHash)
                        {
                            _lastTemplateHash = hash;
                            _lastCaptureTime = DateTime.UtcNow;

                            OnTemplateCaptured?.Invoke(this, new TemplateCapturedEventArgs { TemplateBase64 = templateB64 });
                            OnStatusChanged?.Invoke(this, "Template capturado com sucesso");
                            _logger.LogInformation($"Template gerado. Tamanho: {templateSize}");
                        }

                        await Task.Delay(100, token); // pequeno delay para estabilizar loop
                    }
                    else if (ret == zkfp.ZKFP_ERR_ADD_FINGER || ret == 0 || ret == zkfp.ZKFP_ERR_CAPTURE)
                    {
                        // Sem dedo ou falha esperada
                        await Task.Delay(100, token);
                    }
                    else
                    {
                        _logger.LogWarning($"AcquireFingerprint erro inesperado: {ret}. Forçando reconexão...");
                        OnStatusChanged?.Invoke(this, $"Erro leitura ({ret}). Tentando reconectar...");
                        CleanupDevice();
                        _isConnected = false;
                        await Task.Delay(1000, token);
                    }
                }
                catch (TaskCanceledException)
                {
                    break;
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Erro interno no loop de captura");
                    CleanupDevice();
                    await Task.Delay(2000, token);
                }
            }

            CleanupDevice();
            _logger.LogInformation("StartCaptureAsync finalizado.");
        }

        private bool InitializeAndConnect()
        {
            try
            {
                _fpInstance.Finalize();
                if (_fpInstance.Initialize() != zkfp.ZKFP_ERR_OK) return false;

                int deviceCount = _fpInstance.GetDeviceCount();
                if (deviceCount <= 0)
                {
                    _fpInstance.Finalize();
                    return false;
                }

                if (_fpInstance.OpenDevice(0) != zkfp.ZKFP_ERR_OK)
                {
                    _fpInstance.Finalize();
                    return false;
                }

                byte[] buf = new byte[4];
                int size = buf.Length;
                _fpInstance.GetParameters(1, buf, ref size);
                _imageWidth = BitConverter.ToInt32(buf, 0);

                size = buf.Length;
                _fpInstance.GetParameters(2, buf, ref size);
                _imageHeight = BitConverter.ToInt32(buf, 0);

                _isConnected = true;
                _logger.LogInformation($"Dispositivo pronto ({_imageWidth}x{_imageHeight})");
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao inicializar/conectar dispositivo");
                _isConnected = false;
                return false;
            }
        }

        private void CleanupDevice()
        {
            try
            {
                _isConnected = false;
                if (_fpInstance != null)
                {
                    _fpInstance.CloseDevice();
                    _fpInstance.Finalize();
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao limpar dispositivo");
            }
        }

        private string ComputeHash(string base64)
        {
            using var sha = SHA256.Create();
            byte[] bytes = sha.ComputeHash(Encoding.UTF8.GetBytes(base64));
            return Convert.ToBase64String(bytes);
        }

        public string GetStatusMessage()
        {
            if (_disposed) return "Serviço desligado";
            if (!_isConnected) return "Dispositivo desconectado";
            return "Dispositivo conectado";
        }


        public void Dispose()
        {
            _disposed = true;
            CleanupDevice();
        }
    }
}
