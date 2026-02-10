using System.Text.Json.Serialization;

namespace BiometricMiddleware.Models
{
    public class QueueItem
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }

        [JsonPropertyName("name")]
        public string Name { get; set; } = "";

        [JsonPropertyName("biometric_hash")]
        public string? BiometricHash { get; set; }

        [JsonPropertyName("call_token")]
        public string? CallToken { get; set; }

        [JsonPropertyName("status")]
        public string Status { get; set; } = "";

        [JsonPropertyName("document_id")]
        public string? DocumentId { get; set; }

        [JsonPropertyName("id_hint")]
        public string? IdHint { get; set; }

        [JsonPropertyName("phone")]
        public string? Phone { get; set; }

        [JsonPropertyName("birth_date")]
        public string? BirthDate { get; set; }

        [JsonPropertyName("position")]
        public int Position { get; set; }

        [JsonPropertyName("timestamp")]
        public string? Timestamp { get; set; }
    }
}
