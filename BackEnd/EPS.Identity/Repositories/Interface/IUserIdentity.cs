namespace EPS.Identity.Repositories.Interface
{
    public interface IUserIdentity<TUserKey> where TUserKey : struct
    {
        TUserKey UserId { get; }

        string Username { get; }

        List<string> Privileges { get; }

        bool IsAdministrator { get; }

        string UnitId { get; }

        string UnitCode { get; }

        string FullName { get; }

        public int TaiKhoanID { get; }
    }
}
