namespace EPS.Identity.BaseExt.Interface
{
    public interface IDataHttpClient
    {
        HttpClient GetHttpClient();

        HttpClient GetHttpClient(string baseUrl);
    }
}
