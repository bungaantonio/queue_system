using Microsoft.Extensions.Logging;
using BiometricMiddleware.Services;

class Program
{
    static async Task Main(string[] args)
    {
        string baseUrl = "http://127.0.0.1:8000";
        int operatorId = 42;

        // -------------------------------
        // 1. Configura o LoggerFactory
        // -------------------------------
        using var loggerFactory = LoggerFactory.Create(builder =>
        {
            builder
                .AddSimpleConsole(options =>
                {
                    options.SingleLine = true;
                    options.TimestampFormat = "[HH:mm:ss] ";
                })
                .SetMinimumLevel(LogLevel.Debug); // DEBUG para ver tudo
        });

        // Logger para o QueueListener
        var listenerLogger = loggerFactory.CreateLogger<QueueListener>();

        // Logger para o ZKBiometricProvider
        var biometricLogger = loggerFactory.CreateLogger<ZKBiometricProvider>();

        // -------------------------------
        // 2. Inicializa o provedor biométrico com logger
        // -------------------------------
        IBiometricProvider biometricProvider = new ZKBiometricProvider(biometricLogger);

        // -------------------------------
        // 3. Inicializa o QueueListener
        // -------------------------------
        var listener = new QueueListener(listenerLogger, baseUrl, operatorId, biometricProvider);

        // -------------------------------
        // 4. Configura cancelamento (Ctrl+C)
        // -------------------------------
        using var cts = new CancellationTokenSource();
        Console.CancelKeyPress += (s, e) =>
        {
            Console.WriteLine("\n[Middleware] Desligando...");
            e.Cancel = true;
            cts.Cancel();
        };

        // -------------------------------
        // 5. Mensagem inicial no console
        // -------------------------------
        Console.Title = $"Queue Middleware - Biometric Auth (Operador {operatorId})";
        Console.WriteLine("================================================");
        Console.WriteLine($"   SISTEMA DE GESTÃO DE FILA - QUIOSQUE {operatorId}");
        Console.WriteLine("================================================");
        Console.WriteLine("Pressione Ctrl+C para encerrar o middleware.\n");

        // -------------------------------
        // 6. Executa o listener
        // -------------------------------
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
}
