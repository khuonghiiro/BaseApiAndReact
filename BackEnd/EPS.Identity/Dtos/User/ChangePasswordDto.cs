using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace EPS.Identity.Dtos.User
{
    public class ChangePasswordDto
    {
        [Required]
        public string OldPassword { get; set; }
        [Required]
        public string NewPassword { get; set; }
        [Required]
        [Compare("NewPassword")]
        public string NewPasswordConfirm { get; set; }
    }
    public class ResetPasswordDto
    {
        [Required]
        public string UserName { get; set; }
        [Required]
        public string NewPassword { get; set; }
    }
}
