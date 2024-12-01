namespace EPS.Identity.BaseExt.Interface
{
    public interface IIdentifier<TKey>
    {
        TKey Id { get; set; }
    }
}
