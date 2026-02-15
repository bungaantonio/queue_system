using BiometricMiddleware.Services;
using Microsoft.Extensions.Logging;

class Program
{
    static async Task Main(string[] args)
    {
        string baseUrl = ResolveBaseUrl(args);
        int operatorId = ResolveOperatorId(args);
        LogLevel minimumLogLevel = ResolveLogLevel(args);

        using var loggerFactory = LoggerFactory.Create(builder =>
        {
            builder
                .AddSimpleConsole(options =>
                {
                    options.SingleLine = true;
                    options.TimestampFormat = "[HH:mm:ss] ";
                })
                .SetMinimumLevel(minimumLogLevel);
        });

        var listenerLogger = loggerFactory.CreateLogger<QueueListener>();
        var biometricLogger = loggerFactory.CreateLogger<ZKBiometricProvider>();
        ICredentialProvider biometricProvider = new ZKBiometricProvider(biometricLogger);
        var listener = new QueueListener(listenerLogger, baseUrl, operatorId, biometricProvider);

        using var cts = new CancellationTokenSource();
        Console.CancelKeyPress += (s, e) =>
        {
            Console.WriteLine("\n[Middleware] Desligando...");
            e.Cancel = true;
            cts.Cancel();
        };

        Console.Title = $"Queue Middleware - Biometric Auth (Operador {operatorId})";
        Console.WriteLine("================================================");
        Console.WriteLine($"   SISTEMA DE GESTÃO DE FILA - QUIOSQUE {operatorId}");
        Console.WriteLine("================================================");
        Console.WriteLine($"Base URL: {baseUrl}");
        Console.WriteLine($"Log Level: {minimumLogLevel}");
        Console.WriteLine("Pressione Ctrl+C para encerrar o middleware.\n");

        try
        {
            await listener.RunAsync(cts.Token);
        }
        catch (OperationCanceledException)
        {
            Console.WriteLine("[Middleware] Sistema encerrado pelo usuário.");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[Middleware] Erro crítico: {ex.Message}");
        }
        finally
        {
            if (biometricProvider is IDisposable disposable)
                disposable.Dispose();

            Console.WriteLine("[Middleware] Processo finalizado.");
        }
    }

    private static string ResolveBaseUrl(string[] args)
    {
        string? argValue = GetArgValue(args, "--base-url");
        string? envValue = Environment.GetEnvironmentVariable("BIOMETRIC_BASE_URL");
        string raw = !string.IsNullOrWhiteSpace(argValue) ? argValue : envValue ?? "http://localhost:8000";
        return raw.Trim().TrimEnd('/');
    }

    private static int ResolveOperatorId(string[] args)
    {
        string? argValue = GetArgValue(args, "--operator-id");
        string? envValue = Environment.GetEnvironmentVariable("BIOMETRIC_OPERATOR_ID");
        string raw = !string.IsNullOrWhiteSpace(argValue) ? argValue : envValue ?? "42";

        if (int.TryParse(raw, out var operatorId) && operatorId > 0)
            return operatorId;

        return 42;
    }

    private static LogLevel ResolveLogLevel(string[] args)
    {
        string? argValue = GetArgValue(args, "--log-level");
        string? envValue = Environment.GetEnvironmentVariable("BIOMETRIC_LOG_LEVEL");
        string raw = !string.IsNullOrWhiteSpace(argValue) ? argValue : envValue ?? "Information";

        if (Enum.TryParse<LogLevel>(raw, true, out var level))
            return level;

        return LogLevel.Information;
    }

    private static string? GetArgValue(string[] args, string key)
    {
        for (int i = 0; i < args.Length; i++)
        {
            if (string.Equals(args[i], key, StringComparison.OrdinalIgnoreCase))
                return i + 1 < args.Length ? args[i + 1] : null;

            string prefix = key + "=";
            if (args[i].StartsWith(prefix, StringComparison.OrdinalIgnoreCase))
                return args[i][prefix.Length..];
        }

        return null;
    }
}
