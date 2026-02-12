using System.Security.Cryptography;
using System.Text;
using libzkfpcsharp; // Certifique-se de referenciar a DLL original
using Microsoft.Extensions.Logging;

namespace BiometricMiddleware.Services
{
    public class ZKBiometricProvider : ICredentialProvider, IDisposable
    {
        private readonly zkfp _fpInstance = new();
        private readonly ILogger<ZKBiometricProvider> _logger;
        private bool _isConnected = false;
        private int _imageWidth = 0;
        private int _imageHeight = 0;
        private byte[]? _fpBuffer;
        private byte[] _capTmp = new byte[2048];

        public ZKBiometricProvider(ILogger<ZKBiometricProvider> logger)
        {
            _logger = logger;
            _logger.LogInformation("[INIT] ZKBiometricProvider criado");
        }

        public async Task<string> CaptureIdentifierAsync(CancellationToken ct = default)
        {
            try
            {
                if (!_isConnected)
                {
                    if (!InitializeDevice()) throw new Exception("Falha ao inicializar sensor.");
                }

                _logger.LogInformation("[SENSOR] Aguardando dedo...");

                while (!ct.IsCancellationRequested)
                {
                    if (_fpBuffer == null) _fpBuffer = new byte[_imageWidth * _imageHeight];

                    int templateSize = _capTmp.Length;
                    // AcquireFingerprint é uma chamada não bloqueante no SDK da ZK
                    int ret = _fpInstance.AcquireFingerprint(_fpBuffer, _capTmp, ref templateSize);

                    if (ret == zkfp.ZKFP_ERR_OK && templateSize > 0)
                    {
                        string templateB64 = Convert.ToBase64String(_capTmp, 0, templateSize);
                        _logger.LogInformation("[SENSOR] Digital capturada com sucesso.");
                        return templateB64;
                    }

                    // Se o retorno for um erro real (não apenas "sem dedo")
                    if (ret != zkfp.ZKFP_ERR_OK && ret != zkfp.ZKFP_ERR_ADD_FINGER && ret != 0 && ret != zkfp.ZKFP_ERR_CAPTURE)
                    {
                        _logger.LogError("[SENSOR] Erro crítico no hardware: {ErrorCode}", ret);
                        _isConnected = false; // Força reinicialização na próxima chamada
                        throw new Exception($"Erro no hardware: {ret}");
                    }

                    // O Task.Delay permite que outras Tasks rodem e verifica o CancelationToken
                    await Task.Delay(100, ct);
                }
            }
            catch (OperationCanceledException)
            {
                _logger.LogDebug("[SENSOR] Captura cancelada pelo sistema.");
            }
            catch (Exception ex)
            {
                _logger.LogWarning("[SENSOR] Exceção na captura: {Error}", ex.Message);
            }
            return ""; // Retorna vazio se cancelado ou erro
        }
        private bool InitializeDevice()
        {
            try
            {
                if (_fpInstance.Initialize() != zkfp.ZKFP_ERR_OK)
                {
                    _logger.LogError("[SENSOR] Falha ao inicializar SDK");
                    return false;
                }

                // Verifica se há dispositivos
                int deviceCount = _fpInstance.GetDeviceCount();
                if (deviceCount <= 0)
                {
                    _logger.LogError("[SENSOR] Nenhum dispositivo ZKTeco encontrado");
                    return false;
                }

                if (_fpInstance.OpenDevice(0) != zkfp.ZKFP_ERR_OK)
                {
                    _logger.LogError("[SENSOR] Falha ao abrir dispositivo");
                    return false;
                }

                // Pega parâmetros da imagem
                byte[] buf = new byte[4];
                int size = buf.Length;

                if (_fpInstance.GetParameters(1, buf, ref size) != zkfp.ZKFP_ERR_OK) return false;
                _imageWidth = BitConverter.ToInt32(buf, 0);

                size = buf.Length;
                if (_fpInstance.GetParameters(2, buf, ref size) != zkfp.ZKFP_ERR_OK) return false;
                _imageHeight = BitConverter.ToInt32(buf, 0);

                _fpBuffer = new byte[_imageWidth * _imageHeight];
                _isConnected = true;

                _logger.LogInformation("[SENSOR] Dispositivo conectado. Resolução: {Width}x{Height}", _imageWidth, _imageHeight);
                return true;

            }
            catch (Exception ex)
            {

                _logger.LogError("[SENSOR] Exceção ao inicializar dispositivo: {Error}", ex.Message);
                return false;
            }

        }
        public int MatchTemplates(string template1B64, string template2B64)
        {
            byte[] t1 = Convert.FromBase64String(template1B64);
            byte[] t2 = Convert.FromBase64String(template2B64);

            // O SDK ZKTeco retorna um score de similaridade
            return _fpInstance.Match(t1, t2);
        }
        private string ComputeSha256(string input)
        {
            using var sha = SHA256.Create();
            byte[] bytes = sha.ComputeHash(Encoding.UTF8.GetBytes(input));
            StringBuilder sb = new StringBuilder();
            foreach (byte b in bytes) sb.Append(b.ToString("x2"));
            _logger.LogDebug("[SENSOR] SHA256 computado para a digital");
            return sb.ToString();
        }

        public void Dispose()
        {
            try
            {
                if (_isConnected)
                {
                    _fpInstance.CloseDevice();
                    _logger.LogInformation("[SENSOR] Dispositivo ZKTeco desconectado");
                    _isConnected = false;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "[SENSOR] Erro ao finalizar dispositivo");
            }
        }
    }
}