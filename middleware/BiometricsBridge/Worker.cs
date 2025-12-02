using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using BiometricsBridge.Services;

namespace BiometricsBridge
{
    public class Worker : BackgroundService
    {
        private readonly DeviceService _deviceService;
        private readonly ILogger<Worker> _logger;

        public Worker(DeviceService deviceService, ILogger<Worker> logger)
        {
            _deviceService = deviceService;
            _logger = logger;
        }
        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _deviceService.OnStatusChanged += (s, msg) => _logger.LogInformation($"Status: {msg}");
            _deviceService.OnTemplateCaptured += (s, e) =>
            {
                int len = Math.Min(16, e.TemplateBase64.Length);
                _logger.LogInformation($"Template capturado: {e.TemplateBase64.Substring(0, len)}...");
            };

            _logger.LogInformation("Worker iniciado. Loop de captura iniciando...");

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    await _deviceService.StartCaptureAsync(stoppingToken);
                }
                catch (TaskCanceledException)
                {
                    _logger.LogInformation("ExecuteAsync cancelado via token.");
                    break;
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Erro no loop de captura do Worker");
                    await Task.Delay(2000, stoppingToken);
                }
            }

            _logger.LogInformation("Worker finalizando...");
        }

        public override void Dispose()
        {
            _deviceService.Dispose();
            base.Dispose();
        }
    }
}
