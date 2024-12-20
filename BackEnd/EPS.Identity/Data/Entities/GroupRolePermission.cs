

using Abp.Authorization;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;



using EPS.Identity.Repositories.Interface; using EPS.Identity.Pages; using EPS.Identity.Authorize;

namespace EPS.Identity.Data.Entities
{
    public partial class GroupRolePermission
    {
        public GroupRolePermission()
        {
        }
        public int Id { get; set; }
        public int GroupId { get; set; }
        [ForeignKey("GroupId")]
        [InverseProperty("GroupRolePermissions")]
        public virtual Group Group { get; set; }

        [Required]
        public int Value { get; set; }

        public int RoleId { get; set; }
        [ForeignKey("RoleId")]
        [InverseProperty("GroupRolePermissions")]
        public virtual Role Role { get; set; }
        public int PermissionId { get; set; }
        [ForeignKey("PermissionId")]
        [InverseProperty("GroupRolePermissions")]
        public virtual Permission Permission { get; set; }
    }
}
