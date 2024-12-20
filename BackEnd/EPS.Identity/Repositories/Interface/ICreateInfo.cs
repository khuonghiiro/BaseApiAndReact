namespace EPS.Identity.Repositories.Interface
{
    public interface ICreateInfo<TUserKey> where TUserKey : struct
    {
        DateTime? CreatedDate { get; set; }

        TUserKey? CreatedUserId { get; set; }
    }
}
