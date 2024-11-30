using System.ComponentModel.DataAnnotations;

namespace EPS.Identity.Dtos
{
    public class TokenRequestParams
    {
        [Required]
        public string grant_type { get; set; }
        public string? refresh_token { get; set; }
        [Required]
        public string client_id { get; set; }
        [Required]
        public string client_secret { get; set; }
        public string? username { get; set; }
        public string? password { get; set; }
        public string? ticket { get; set; }
        public string? serivceurl { get; set; }
    }
}
