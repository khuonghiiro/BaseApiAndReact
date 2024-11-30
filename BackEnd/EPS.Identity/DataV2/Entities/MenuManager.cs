using JetBrains.Annotations;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace EPS.Data.Entities
{
    public class MenuManager
    {
        public int Id { get; set; }
        [Required]
        [StringLength(250)]
        public required string Title { get; set; }
        [Required]
        [StringLength(3000)]
        public required string Url { get; set; }
        [Required]
        public int Stt { get; set; }
        [StringLength(50)]
        [CanBeNull] public string? Icon { get; set; }
        [StringLength(100)]
        [CanBeNull] public string? Groups { get; set; }//Lưu id group
        public int? ParentId { get; set; }
        public virtual MenuManager? Parent { get; set; }
        /// <summary>
        /// false - Mặc định
        /// true - Open link mới
        /// </summary>
        public bool IsBlank { get; set; }
        /// <summary>
        /// false - Không hiển thị
        /// true - Hiển thị
        /// </summary>
        public bool IsShow { get; set; }
        public virtual ICollection<MenuManager>? Childrens { get; set; }
    }
}
