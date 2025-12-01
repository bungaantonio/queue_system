using System;
using System.Security.Cryptography;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

namespace BiometricsBridge.Services
{
    public class CaptureProgressEventArgs : EventArgs
    {
        public string StatusMessage { get; set; } = string.Empty;
        public int? ProgressPercentage { get; set; }
    }

    public class CaptureResultEventArgs : EventArgs
    {
        public string TemplateHash { get; set; } = string.Empty;
        public int FingerIndex { get; set; }
    }

    public class CaptureService
    {
        private readonly DeviceService _deviceService;
        private readonly ILogger<CaptureService> _logger;

        public event EventHandler<CaptureProgressEventArgs>? OnProgress;
        public event EventHandler<CaptureResultEventArgs>? OnCaptureComplete;

        public CaptureService(DeviceService deviceService, ILogger<CaptureService> logger)
        {
            _deviceService = deviceService;
            _logger = logger;

            // Assina eventos do DeviceService
            _deviceService.OnTemplateCaptured += DeviceService_OnTemplateCaptured;
            _deviceService.OnStatusChanged += (s, msg) => OnProgress?.Invoke(this, new CaptureProgressEventArgs { StatusMessage = msg });
        }

        private void DeviceService_OnTemplateCaptured(object? sender, TemplateCapturedEventArgs e)
        {
            try
            {
                // Calcula hash seguro do template
                string hash = ComputeSha256Hash(e.TemplateBase64);

                // Dispara evento de captura completa
                OnCaptureComplete?.Invoke(this, new CaptureResultEventArgs
                {
                    TemplateHash = hash,
                    FingerIndex = 0 // Pode ser parametrizado pelo fluxo de captura
                });

                _logger.LogInformation($"Template processado e hash gerado: {hash.Substring(0, 16)}...");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao processar template");
            }
        }

        public async Task StartCaptureAsync(CancellationToken token)
        {
            OnProgress?.Invoke(this, new CaptureProgressEventArgs { StatusMessage = "Iniciando captura..." });
            await _deviceService.StartCaptureAsync(token);
        }

        public void StopCapture()
        {
            _deviceService.Dispose();
            OnProgress?.Invoke(this, new CaptureProgressEventArgs { StatusMessage = "Captura cancelada." });
        }

        private string ComputeSha256Hash(string input)
        {
            using var sha256 = SHA256.Create();
            byte[] bytes = Encoding.UTF8.GetBytes(input);
            byte[] hash = sha256.ComputeHash(bytes);
            return BitConverter.ToString(hash).Replace("-", "").ToLowerInvariant();
        }
    }
}
