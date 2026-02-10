using BiometricsBridge.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace BiometricsBridge.Api
{
    [ApiController]
    [Route("api/v1/capture")]
    public class CaptureController : ControllerBase
    {
        private readonly CaptureService _captureService;
        private readonly IHubContext<WebSocketHub> _hub;

        public CaptureController(CaptureService captureService, IHubContext<WebSocketHub> hub)
        {
            _captureService = captureService;
            _hub = hub;

            _captureService.OnProgress += async (s, e) =>
            {
                await _hub.Clients.All.SendAsync("progress", e.StatusMessage);
            };

            _captureService.OnCaptureComplete += async (s, e) =>
            {
                await _hub.Clients.All.SendAsync("captureComplete", new { e.TemplateHash, e.FingerIndex });
            };
        }

        [HttpPost]
        public async Task<IActionResult> StartCapture()
        {
            var cts = new CancellationTokenSource();
            _ = Task.Run(() => _captureService.StartCaptureAsync(cts.Token));
            return Ok(new { message = "Captura iniciada" });
        }

        [HttpPost("cancel")]
        public IActionResult CancelCapture()
        {
            _captureService.StopCapture();
            return Ok(new { message = "Captura cancelada" });
        }
    }
}
