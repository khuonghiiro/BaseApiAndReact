using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
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

        public bool LockoutEnabled { get; set; }

        public virtual dynamic UserAccountSetting_UserIds { get; set; }


        public UserGridDto()
        {
            LstGroupIds = new List<int>();
        }
    }
    public class GetListUserDto
    {
        public string? ListUserId { get; set; }
    }

}
