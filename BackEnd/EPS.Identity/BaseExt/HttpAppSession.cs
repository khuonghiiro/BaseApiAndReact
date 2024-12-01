using EPS.Identity.BaseExt.Interface;

namespace EPS.Identity.BaseExt
{

    public class HttpAppSession : IAppSession
    {
        public int? UserId { get; set; }

        public string? FullName { get; set; }

        public void SetupAppSession(HttpContext context)
        {
            string headerValue = GetHeaderValue(context, "userId");
            FullName = GetHeaderValue(context, "fullName");
            int? userId = ((headerValue != null) ? new int?(int.Parse(headerValue)) : null);
            UserId = userId;
        }

        private string GetHeaderValue(HttpContext context, string key)
        {
            try
            {
                if (context.Request.Headers.TryGetValue(key, out var value))
                {
                    string text = value.FirstOrDefault();
                    if (!string.IsNullOrEmpty(text))
                    {
                        return text;
                    }
                }
            }
            catch
            {
            }

            return null;
        }
    }
}
