namespace BiometricMiddleware.Services
{
    public interface IBiometricProvider
    {
        /// <summary>
        /// Captura o hash biométrico do usuário (via hardware ou simulação).
        /// A implementação deve gerar logs detalhados de eventos:
        /// - Início da captura
        /// - Sucesso ou falha
        /// - Exceções e erros do hardware
        /// </summary>
        /// <param name="expectedHash">Opcional: hash esperado para validação</param>
        /// <returns>Uma string representando o hash/template da digital</returns>
        Task<string> CaptureHashAsync(CancellationToken ct = default);
    }
}
