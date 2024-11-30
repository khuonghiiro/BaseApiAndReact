using EPS.Identity.Dtos.Role;
using System;
using System.Collections.Generic;
using System.Text;
namespace EPS.Identity.Dtos.RoleCategory
{
    /// <summary>
    /// Dto danh sách Danh mục đối tượng
    /// </summary>
    ///<author>ThoNV</author>
    ///<created>15/08/2023</created>
    public class RoleCategoryGridDto
    {
        /// <summary>
        /// ID
        /// </summary>
        public int Id { get; set; }
        /// <summary>
        /// Tên danh mục đối tượng
        /// </summary>
        public string TieuDe { get; set; }
        /// <summary>
        /// Mô tả
        /// </summary>
        public string MoTa { get; set; }
        /// <summary>
        /// STT
        /// </summary>
        public int STT { get; set; }
        /// <summary>
        /// Danh mục cha
        /// </summary>
        public int? ParentId { get; set; }
    } 
    
    public class RoleCategoryTreeGridDto
    {
        /// <summary>
        /// ID
        /// </summary>
        public int Id { get; set; }
        /// <summary>
        /// Tên danh mục đối tượng
        /// </summary>
        public string TieuDe { get; set; }
        /// <summary>
        /// Mô tả
        /// </summary>
        public string MoTa { get; set; }
        /// <summary>
        /// STT
        /// </summary>
        public int STT { get; set; }
        /// <summary>
        /// Danh mục cha
        /// </summary>
        public int? ParentId { get; set; }
        public List<RoleCategoryTreeGridDto> Children { get; set; }
        public List<RoleGridDto> LstRole { get; set; }
        public RoleCategoryTreeGridDto() {
            Children=new List<RoleCategoryTreeGridDto>();
            LstRole = new List<RoleGridDto>();
        }        
    }
    public class TreeRoleItem
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public List<TreeRoleItem> Children { get; set; }
        public bool IsRole { get; set; }
        public TreeRoleItem() {
            Children=new List<TreeRoleItem>();
        }
    }
}
