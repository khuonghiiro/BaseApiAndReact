

using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;



using EPS.Identity.Repositories.Interface; using EPS.Identity.Pages; using EPS.Identity.Authorize;

namespace EPS.Identity.Data.Entities
{
    public partial class Permission
    {
        public Permission()
        {
        }
        public int Id { get; set; }
        [Required]
        [StringLength(250)]
        public string Title { get; set; }
        [Required]
        [StringLength(10)]
        public string Code { get; set; }
        [InverseProperty("Permission")]
        public virtual ICollection<GroupRolePermission> GroupRolePermissions { get; set; }
    }
}
