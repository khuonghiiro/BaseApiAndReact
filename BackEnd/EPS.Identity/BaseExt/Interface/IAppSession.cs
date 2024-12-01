namespace EPS.Identity.BaseExt.Interface
{
    public interface IAppSession
    {
        int? UserId { get; set; }

        string FullName { get; set; }

        void SetupAppSession(HttpContext context);
    }
}
