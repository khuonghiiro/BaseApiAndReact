using EPS.Identity.Dtos.UserInfo;
using System;
using System.Collections.Generic;
using System.Text;

namespace EPS.Identity.Dtos.User
{
    public class UserDetailDto
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string Address { get; set; }
        public string Avatar { get; set; }
        public int Sex { get; set; }
        public int Status { get; set; }
        public List<int> GroupIds { get; set; }
        public List<string> GroupTitles { get; set; }
    }
    public class UserInfoItem
    {
        public int Id { get; set; }        
        public UserInfoDetailDto User { get; set; }
        public List<int> GroupIds { get; set; }
        public UserInfoItem()
        {
            User = new UserInfoDetailDto();
            GroupIds = new List<int>();
        }
    }
    public class UserInfo
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string FullName { get; set; }
    }
}
