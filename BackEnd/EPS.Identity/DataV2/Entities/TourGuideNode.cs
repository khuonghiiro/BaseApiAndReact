using EPS.Libary.Utils.Audit;
using System.ComponentModel.DataAnnotations;
namespace EPS.Identity.Data
{
    /// <summary>
    /// Khởi tạo đối tượng Hướng dẫn website
    /// </summary>
    ///<author>KhuongPV</author>
    ///<created>24-07-2024</created>
    public class TourGuideNode : FullTableInfo<Guid>
    {
        public TourGuideNode()
        {
        }
        /// <summary>
        /// Nút nối ban đầu
        /// </summary>
        public string? NodeId { get; set; }

        /// <summary>
        /// Dùng để xác định diagram nào
        /// </summary>
        public string? KeyDiagram { get; set; }
        /// <summary>
        /// Tên class hoặc id của thẻ html
        /// </summary>
        [StringLength(255)]
        [Required]
        public required string ClassOrId { get; set; }
        /// <summary>
        /// Tiêu đề
        /// </summary>
        public string? Title { get; set; }
        /// <summary>
        /// Nội dung
        /// </summary>
        public string? Content { get; set; }
        /// <summary>
        /// Tọa độ X
        /// </summary>
        public double? PositionX { get; set; }
        /// <summary>
        /// Tọa độ Y
        /// </summary>
        public double? PositionY { get; set; }
        /// <summary>
        /// Bước thực hiện
        /// </summary>
        public int? StepIndex { get; set; }
        /// <summary>
        /// File ảnh
        /// </summary>
        public string? attachment { get; set; }
        /// <summary>
        /// Văn bản HTML
        /// </summary>
        public string? TextHtml { get; set; }
        /// <summary>
        /// Cho phép nhấn
        /// </summary>
        public bool IsClickElem { get; set; }

        public bool IsHtml { get; set; }
        /// <summary>
        /// hiển thị 
        /// </summary>
        [Required]
        public bool IsShow { get; set; }
        //add foreign key {4}
    }
}
