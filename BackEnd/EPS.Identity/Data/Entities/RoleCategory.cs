

using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;



using EPS.Identity.Repositories.Interface; using EPS.Identity.Pages; using EPS.Identity.Authorize;

namespace EPS.Identity.Data.Entities
{
    public class RoleCategory
    {
        public RoleCategory()
        {
        }
        [Required]
        public int Id { get; set; }
        [StringLength(250)]
        [Required]
        public string TieuDe { get; set; }
        [Required]
        public string MoTa { get; set; }
        [Required]
        public int STT { get; set; }
        [ForeignKey("RoleCategory_ParentId")]
        public int? ParentId { get; set; }
        public virtual RoleCategory RoleCategory_ParentId { get; set; }
        public virtual ICollection<RoleCategory> ParentId_Childs { get; set; }
        [InverseProperty("Role_CategoryId")]
        public virtual ICollection<Role> Role_CategoryIds { get; set; }
    }
}
