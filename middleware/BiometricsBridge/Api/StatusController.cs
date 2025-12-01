using Microsoft.AspNetCore.Mvc;
using BiometricsBridge.Services;

namespace BiometricsBridge.Api
{
    [ApiController]
    [Route("api/v1/status")]
    public class StatusController : ControllerBase
    {
        private readonly DeviceService _deviceService;

        public StatusController(DeviceService deviceService)
        {
            _deviceService = deviceService;
        }

        [HttpGet]
        public IActionResult GetStatus()
        {
            {
                var message = _deviceService.GetStatusMessage();
                return Ok(new { message });
        }
        }
    }
}
