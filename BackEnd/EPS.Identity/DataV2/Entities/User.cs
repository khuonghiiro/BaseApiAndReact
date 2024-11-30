using Microsoft.AspNetCore.Identity;
using static System.Net.Mime.MediaTypeNames;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;
using EPS.Libary.Identity;
using EPS.Libary.Utils.Audit;

namespace EPS.Identity.Data.Entities
{
    public partial class User : IdentityUser<int>, IDeleteInfo<int>, ICascadeDelete
    {
        public User()
        {

        }
        [StringLength(250)]
        public string FullName { get; set; }
        public bool IsAdministrator { get; set; }
        public int Status { get; set; }
        public DateTime? DeletedDate { get; set; }
        public int? DeletedUserId { get; set; }
        public virtual User DeletedUser { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime ModifiedDate { get; set; }
        [InverseProperty("User")]
        public virtual ICollection<GroupUser> GroupUsers { get; set; }
        [InverseProperty("User")]
        public virtual ICollection<UserDetail> UserDetails { get; set; }

        [InverseProperty("PasswordResetRequest_UserId")]
        public virtual ICollection<PasswordResetRequest> PasswordResetRequest_UserIds { get; set; }


        [InverseProperty("PasswordResetRequest_UserAgreeId")]
        public virtual ICollection<PasswordResetRequest> PasswordResetRequest_UserAgreeIds { get; set; }

        //add foreign key {4}

        public void OnDelete()
        {

        }
    }
    public enum StatusUser
    {
        [Description("Deactive")]
        Deactive = 1,
        [Description("Active")]
        Active = 2,
    }


}