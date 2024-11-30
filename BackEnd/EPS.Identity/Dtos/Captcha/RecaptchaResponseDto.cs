using Newtonsoft.Json;

namespace EPS.Identity.Dtos.Captcha
{
    public class RecaptchaResponseDto
    {
        [JsonProperty("success")]
        public bool Success { get; set; }

        [JsonProperty("challenge_ts")]
        public string ChallengeTs { get; set; }

        [JsonProperty("hostname")]
        public string Hostname { get; set; }

        [JsonProperty("error-codes")]
        public List<string> ErrorCodes { get; set; }
    }

    public class RecaptchaRequestDto
    {
        public string UserName { get; set; }
        public string Token { get; set; }
    }
}
