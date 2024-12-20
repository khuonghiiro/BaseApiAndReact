namespace EPS.Identity.Repositories.Interface
{
    public interface IUpdateInfo<TUserKey> where TUserKey : struct
    {
        DateTime? LastUpdatedDate { get; set; }

        TUserKey? LastUpdatedUserId { get; set; }
    }
}
