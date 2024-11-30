using System;
using System.Collections.Generic;
using System.Text;
namespace EPS.Identity.Dtos.RoleCategory
{
    /// <summary>
    /// Dto Chi tiết Danh mục đối tượng
    /// </summary>
    ///<author>ThoNV</author>
    ///<created>15/08/2023</created>
    public class RoleCategoryDetailDto
    {
        /// <summary>
        /// ID
        /// </summary>
        public int Id { get; set; }
        /// <summary>
        /// Tên danh mục đối tượng
        /// </summary>
        public required string TieuDe { get; set; }
        /// <summary>
        /// Mô tả
        /// </summary>
        public required string MoTa { get; set; }
        /// <summary>
        /// STT
        /// </summary>
        public int STT { get; set; }
        /// <summary>
        /// Danh mục cha
        /// </summary>
        public int? ParentId { get; set; }
    }
}
