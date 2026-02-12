using System.Text.Json.Serialization;

namespace BiometricMiddleware.Models
{
public class CredentialCacheItem
{
    [JsonPropertyName("id")]
    public int Id { get; set; }

    [JsonPropertyName("user_id")]
    public int UserId { get; set; }

    [JsonPropertyName("template")]
    public required string Template { get; set; }
}
}
