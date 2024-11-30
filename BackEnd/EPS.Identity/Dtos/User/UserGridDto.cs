using EPS.Identity.Dtos.UserInfo;
using System;
using System.Collections.Generic;
using System.Text;

namespace EPS.Identity.Dtos.User
{
    public class UserGridDto
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public int Status { get; set; }
        public DateTime CreatedDate { get; set; }
        public int? DeletedUserId { get; set; }
        public bool IsCheck { get; set; }
        public List<int> LstGroupIds { get; set; }
        public UserGridDto()
        {
            LstGroupIds = new List<int>();
        }
    }

    public class UserGridInfoDto
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string FullName { get; set; }
        public int Status { get; set; }
        public int? DeletedUserId { get; set; }
        public List<string> GroupCodes { get; set; }
        public UserGridInfoDto()
        {
            GroupCodes = new List<string>();
        }
    }
}
