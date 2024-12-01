using EPS.Identity.BaseExt.Interface;
using System.Net.Http.Headers;

namespace EPS.Identity.BaseExt
{
    public class DataHttpClient : IDataHttpClient
    {
        private HttpClient _httpClient;

        private readonly IHttpContextAccessor _httpContextAccessor;

        public DataHttpClient(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public HttpClient GetHttpClient()
        {
            return new HttpClient();
        }

        public HttpClient GetHttpClient(string baseUrl)
        {
            _httpClient = new HttpClient();
            _httpClient.DefaultRequestHeaders.Accept.Clear();
            _httpClient.BaseAddress = new Uri(baseUrl);
            if (_httpContextAccessor.HttpContext == null)
            {
                return _httpClient;
            }

            string text = _httpContextAccessor.HttpContext.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();
            if (string.IsNullOrEmpty(text))
            {
                return _httpClient;
            }

            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", text);
            return _httpClient;
        }
    }
}
