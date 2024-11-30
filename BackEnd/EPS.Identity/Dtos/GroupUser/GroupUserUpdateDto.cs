using System;
using System.Collections.Generic;
using System.Text;

namespace EPS.Identity.Dtos.GroupUser
{
    public class GroupUserUpdateDto
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Address { get; set; }
        public string Avatar { get; set; }
        public int Sex { get; set; }
    }
    
}
