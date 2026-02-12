using System.Text.Json.Serialization;

namespace BiometricMiddleware.Models
{
    public class QueueState
    {
        [JsonPropertyName("called")]
        public QueueItem? Called { get; set; }

        [JsonPropertyName("current")]
        public QueueItem? Current { get; set; }

        [JsonPropertyName("queue")]
        public QueueItem[]? Queue { get; set; }
    }
}
