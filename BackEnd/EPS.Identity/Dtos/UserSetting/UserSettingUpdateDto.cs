using System.ComponentModel.DataAnnotations;

namespace EPS.Identity.Dtos.UserSetting
{
	/// <summary>
	/// Dto cập nhật Cấu hình truy cập hệ thống
	/// </summary>
	///<author>KhuongPV</author>
	///<created>07-08-2024</created>
    public class UserSettingUpdateDto
    {
        /// <summary>
		/// ID
		/// </summary>
		public  int Id { get; set; }

        /// <summary>
        /// Tên cấu hình
        /// </summary>
        [StringLength(256)]
        [Required]
        public required string Name { get; set; }

        /// <summary>
        /// Khóa cấu hình
        /// </summary>
        [StringLength(100)]
        [Required]
        public required string Key { get; set; }

        /// <summary>
        /// Số lần
        /// </summary>
        public int? NumberOfTimes { get; set; }

        /// <summary>
        /// Phút
        /// </summary>
        public double? Minute { get; set; }
        /// <summary>
        /// Giờ
        /// </summary>
        public double? Hour { get; set; }
        /// <summary>
        /// Ngày
        /// </summary>
        public double? Day { get; set; }
        /// <summary>
        /// Tháng
        /// </summary>
        public int? Month { get; set; }
        /// <summary>
        /// Năm
        /// </summary>
        public int? Year { get; set; }
    }
}
