using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace EPS.Identity.Data.Entities
{
    public class RoleCategory
    {
        public RoleCategory()
        {
        }
        /// <summary>
        /// ID
        /// </summary>
        [Required]
        public int Id { get; set; }
        /// <summary>
        /// Tên danh mục đối tượng
        /// </summary>
        [StringLength(250)]
        [Required]
        public string TieuDe { get; set; }
        /// <summary>
        /// Mô tả
        /// </summary>
        [Required]
        public string MoTa { get; set; }
        /// <summary>
        /// STT
        /// </summary>
        [Required]
        public int STT { get; set; }
        /// <summary>
        /// Danh mục cha
        /// </summary>
        [ForeignKey("RoleCategory_ParentId")]
        public int? ParentId { get; set; }
        public virtual RoleCategory RoleCategory_ParentId { get; set; }
        public virtual ICollection<RoleCategory> ParentId_Childs { get; set; }
        [InverseProperty("Role_CategoryId")]
        public virtual ICollection<Role> Role_CategoryIds { get; set; }
        //add foreign key {4}
    }
}
