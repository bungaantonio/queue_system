namespace BiometricMiddleware.Services
{
    public interface ICredentialProvider
    {
        /// <summary>
        /// Captura o identificador biométrico do usuário (via hardware ou simulação).
        /// A implementação deve gerar logs detalhados de eventos:
        /// - Início da captura
        /// - Sucesso ou falha
        /// - Exceções e erros do hardware
        /// </summary>
        /// <param name="expectedHash">Opcional: hash esperado para validação</param>
        /// <returns>Uma string representando o identificador da digital</returns>
        Task<string> CaptureIdentifierAsync(CancellationToken ct = default);
    }
}
