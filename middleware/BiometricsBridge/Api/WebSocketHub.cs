using Microsoft.AspNetCore.SignalR;

namespace BiometricsBridge.Api
{
    public class WebSocketHub : Hub
    {
        public async Task SendProgress(string message)
        {
            await Clients.All.SendAsync("progress", message);
        }

        public async Task SendCaptureResult(string hash, int fingerIndex)
        {
            await Clients.All.SendAsync("captureComplete", new { hash, fingerIndex });
        }
    }
}
