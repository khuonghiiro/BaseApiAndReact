namespace EPS.Identity.Dtos.UserInfo
{
    public class UserInfoCreateDto
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Address { get; set; }       
        public string Avatar { get; set; }        
        public int Sex { get; set; }
        public int UserId { get; set; }
    }
}
