using System.Text.Json.Serialization;

namespace QueueMiddlewareListenerApp.Models
{
    public class BiometricAuthRequest
    {
        [JsonPropertyName("queue_item_id")]
        public int UserId { get; set; }
        [JsonPropertyName("biometric_hash")]
        public string BiometricHash { get; set; } = "";
        [JsonPropertyName("call_token")]
        public string CallToken { get; set; } = "";
        [JsonPropertyName("operator_id")]
        public int OperatorId { get; set; }
    }
}
