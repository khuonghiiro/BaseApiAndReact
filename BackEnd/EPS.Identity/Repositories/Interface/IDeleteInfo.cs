namespace EPS.Identity.Repositories.Interface
{
    public interface IDeleteInfo<TUserKey> where TUserKey : struct
    {
        DateTime? DeletedDate { get; set; }

        TUserKey? DeletedUserId { get; set; }

        // bool? IsDeleted { get; set; }
    }
}
