using EPS.Identity.Repositories;
using System.ComponentModel.DataAnnotations;
namespace EPS.Identity.Data.Entities
{
    /// <summary>
    /// Khởi tạo đối tượng Các bước hướng dẫn website
    /// </summary>
    ///<author>KhuongPV</author>
    ///<created>22-07-2024</created>
    public class GroupTourGuide : FullTableInfo<Guid>
    {
        public GroupTourGuide()
        {
        }
        /// <summary>
        /// ID của của các bước
        /// </summary>
        public string? EdgeIds { get; set; }

        /// <summary>
        /// Tên hướng dẫn
        /// </summary>
        [StringLength(255)]
        [Required]
        public required string Name { get; set; }

        /// <summary>
        /// Tên khóa để lọc lấy theo hướng dẫn
        /// </summary>
        [StringLength(255)]
        [Required]
        public required string KeyName { get; set; }

        /// <summary>
        /// ID nhóm người dùng
        /// </summary>
        public string? GroupIds { get; set; }

        public string? ListNodes { get; set; }

        public string? ListEdges { get; set; }

        /// <summary>
        /// Kích hoạt
        /// </summary>
        [Required]
        public bool IsActive { get; set; }
        //add foreign key {4}
    }
}
