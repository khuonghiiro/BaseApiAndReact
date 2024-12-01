using EPS.Identity.BaseExt.Interface;

namespace EPS.Identity.Authorize
{

    public class HttpAppSessionMiddleware
    {
        private readonly RequestDelegate _next;

        private readonly IAppSession _appSession;

        public HttpAppSessionMiddleware(RequestDelegate next, IAppSession appSession)
        {
            _next = next;
            _appSession = appSession;
        }

        public async Task Invoke(HttpContext httpContext)
        {
            _appSession.SetupAppSession(httpContext);
            await _next(httpContext);
        }
    }
}
