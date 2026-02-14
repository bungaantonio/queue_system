using System.Text.Json.Serialization;

namespace BiometricMiddleware.Models
{
    public class UserInfo
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }

        [JsonPropertyName("name")]
        public string Name { get; set; } = "";
    }

    public class QueueItem
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }

        // O JSON do seu servidor envia o usuário aninhado
        [JsonPropertyName("user")]
        public UserInfo? User { get; set; }

        [JsonPropertyName("call_token")]
        public string? CallToken { get; set; }

        [JsonPropertyName("status")]
        public string Status { get; set; } = "";
    }
}