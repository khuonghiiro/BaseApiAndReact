namespace EPS.Identity.Dtos
{
    public class Audience
    {
        public string Secret { get; set; }
        public string ValidIssuer { get; set; }
        public string ValidAudience { get; set; }
    }
}
