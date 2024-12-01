using EPS.Identity.Repositories.Interface;
using System.Security.Claims;

namespace EPS.Identity.Repositories
{

    public class UserIdentity : IUserIdentity<int>
    {
        private readonly ClaimsPrincipal _claimsPrincipal;

        public int UserId => Convert.ToInt32(GetClaimValue("user_id"));

        public string Username => GetClaimValue("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier");

        public List<string> Privileges => GetPrivileges("privileges");

        public bool IsAdministrator => Convert.ToBoolean(GetClaimValue("is_administrator"));

        public string UnitId => GetClaimValue("unit_id");

        public string UnitCode => GetClaimValue("unit_code");

        public string UnitName => GetClaimValue("unit_name");

        public int TaiKhoanID => Convert.ToInt32(GetClaimValue("taikhoan_id"));

        public string FullName => GetClaimValue("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname");

        public UserIdentity(ClaimsPrincipal claimsPrincipal)
        {
            _claimsPrincipal = claimsPrincipal;
        }

        private string GetClaimValue(string claimType)
        {
            string claimType2 = claimType;
            Claim claim = _claimsPrincipal.Claims.FirstOrDefault((Claim x) => x.Type == claimType2);
            if (claim != null)
            {
                return claim.Value;
            }

            return "";
        }

        private List<string> GetPrivileges(string claimType)
        {
            string claimType2 = claimType;
            List<string> result = new List<string>();
            Claim claim = _claimsPrincipal.Claims.FirstOrDefault((Claim x) => x.Type == claimType2);
            if (claim != null && !string.IsNullOrEmpty(claim.Value))
            {
                result = claim.Value.Split(new char[1] { ',' }, StringSplitOptions.RemoveEmptyEntries).ToList();
            }

            return result;
        }
    }
}
