

using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using EPS.Identity.BaseExt;




using EPS.Identity.Repositories.Interface; using EPS.Identity.Pages; using EPS.Identity.Authorize;

namespace EPS.Identity.Data.Entities
{
    public partial class Role : ICascadeDelete
    {
        public Role()
        {
        }
        public int Id { get; set; }
        [Required]
        [StringLength(250)]
        public string Name { get; set; }
        [StringLength(2000)]
        public string Description { get; set; }

        [ForeignKey("Role_CategoryId")]
        public int? CategoryId { get; set; }
        public virtual RoleCategory Role_CategoryId { get; set; }

        [InverseProperty("Role")]
        public virtual ICollection<GroupRolePermission> GroupRolePermissions { get; set; }
        public void OnDelete()
        {
        }
    }
}
