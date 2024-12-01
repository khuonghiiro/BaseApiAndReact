namespace EPS.Identity.Dtos.User
{
    public class UserCreateDto
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public List<int> GroupIds { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime ModifiedDate { get; set; }
        public int Status { get; set; }       
        public string Address { get; set; }       
        public string Avatar { get; set; }       
        public int Sex { get; set; }

        /// <summary>
        /// Thời gian login cuối cùng tài khoản
        /// </summary>
        public DateTime? LastLoginDate { get; set; }
    }
    public class UserAddDto
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public int Status { get; set; }
        public int UnitId { get; set; }
    }
}
