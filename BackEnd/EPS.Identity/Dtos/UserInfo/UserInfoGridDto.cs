using EPS.Identity.BaseExt;

namespace EPS.Identity.Dtos.UserInfo
{
    public class UserInfoGridDto
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string FullName { get; set; }
        public int Status { get; set; }
        public int? DeletedUserId { get; set; }
        public List<string> GroupCodes { get; set; }
        public UserInfoGridDto()
        {
            GroupCodes = new List<string>();
        }
    }
}
