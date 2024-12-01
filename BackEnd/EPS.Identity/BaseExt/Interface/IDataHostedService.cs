namespace EPS.Identity.BaseExt.Interface
{
    public interface IDataHostedService : IHostedService, IDisposable
    {
        new void Dispose();

        new Task StartAsync(CancellationToken cancellationToken);
    }
}
