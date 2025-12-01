using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using BiometricsBridge.Api;

namespace BiometricsBridge
{
    public class Startup
    {
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers();
            services.AddSignalR();
        }

        public void Configure(IApplicationBuilder app)
        {
            app.UseRouting();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapHub<WebSocketHub>("/api/v1/stream");
            });
        }
    }
}
