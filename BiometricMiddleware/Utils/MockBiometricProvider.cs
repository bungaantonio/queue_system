using System;
using System.Threading.Tasks;

namespace BiometricMiddleware.Services
{
    public class MockBiometricProvider : ICredentialProvider
    {
        public async Task<string> CaptureIdentifierAsync(CancellationToken ct = default)
        {
            // Resolve o aviso CS1998 usando Task.Delay
            await Task.Delay(100);

            Console.WriteLine("\n" + new string('=', 40));
            Console.WriteLine("     SIMULADOR DE SENSOR BIOMÉTRICO");
            Console.WriteLine(new string('=', 40));
            Console.WriteLine("1. [SUCESSO] - Simular Dedo Correto");
            Console.WriteLine("2. [FALHA]   - Simular Dedo Errado");
            Console.WriteLine("3. [ERRO]    - Simular Sensor Sujo/Erro");
            Console.WriteLine("4. [TIMEOUT] - Simular Usuário Desistiu");
            Console.Write("\nEscolha uma opção (1-4): ");

            // Usamos Task.Run para não bloquear a thread principal enquanto aguarda a tecla
            var key = await Task.Run(() => Console.ReadKey(intercept: true));
            Console.WriteLine();

            switch (key.KeyChar)
            {
                case '1':
                    Console.ForegroundColor = ConsoleColor.Green;
                    Console.WriteLine(">>> [OK] Biometria capturada com sucesso.");
                    Console.ResetColor();
                    // IMPORTANTE: Retornamos o ID Bruto para o servidor hashear
                    // Se você cadastrou o Luiz F. com "HASH_TESTE_DEDO_1", retorne isso:
                    return "HASH_TESTE_DEDO_1";

                case '2':
                    Console.ForegroundColor = ConsoleColor.Yellow;
                    Console.WriteLine(">>> [AVISO] Dedo não reconhecido.");
                    Console.ResetColor();
                    return "DIGITAL_INCORRETA_TESTE";

                case '3':
                    throw new Exception("Hardware sensor error: Clean the lens.");

                default:
                    return "";
            }
        }
    }
}