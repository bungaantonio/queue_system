using BiometricsBridge;
using BiometricsBridge.Api;
using BiometricsBridge.Services;

var builder = WebApplication.CreateBuilder(args);

// Logging
builder.Logging.ClearProviders();
builder.Logging.AddConsole();

// Serviços
builder.Services.AddSingleton<DeviceService>();
builder.Services.AddSingleton<CaptureService>();
builder.Services.AddHostedService<Worker>();

builder.Services.AddControllers();
builder.Services.AddSignalR();

var app = builder.Build();

app.UseRouting();

// Substitua UseEndpoints por registros de rotas de nível superior
app.MapControllers();
app.MapHub<WebSocketHub>("/api/v1/stream");

app.Run();
