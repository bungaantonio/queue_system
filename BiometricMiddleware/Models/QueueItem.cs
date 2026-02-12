using System.Text.Json.Serialization;

namespace BiometricMiddleware.Models
{
    public class QueueItem
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }

        [JsonPropertyName("user_id")] // Agora virá na raiz do JSON
        public int UserId { get; set; }

        [JsonPropertyName("name")] // Agora virá na raiz do JSON
        public string Name { get; set; } = "";

        [JsonPropertyName("call_token")]
        public string? CallToken { get; set; }

        [JsonPropertyName("status")]
        public string Status { get; set; } = "";

        [JsonPropertyName("position")]
        public int Position { get; set; }

        [JsonPropertyName("timestamp")]
        public string? Timestamp { get; set; }
    }
}