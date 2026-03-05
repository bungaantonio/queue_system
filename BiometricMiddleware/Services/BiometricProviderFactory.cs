using Microsoft.Extensions.Logging;

namespace BiometricMiddleware.Services
{
    public static class BiometricProviderFactory
    {
        public static ICredentialProvider Create(
            BiometricProviderType providerType,
            ILoggerFactory loggerFactory)
        {
            return providerType switch
            {
                BiometricProviderType.ZKTeco =>
                    new ZKBiometricProvider(
                        loggerFactory.CreateLogger<ZKBiometricProvider>()),

                BiometricProviderType.Suprema =>
                    throw new NotImplementedException(
                        "Provider Suprema ainda não implementado."),

                _ => throw new NotSupportedException(
                    $"Provider biométrico não suportado: {providerType}")
            };
        }
    }
}