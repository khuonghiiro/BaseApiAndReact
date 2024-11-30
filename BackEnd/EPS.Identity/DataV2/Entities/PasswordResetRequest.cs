using EPS.Identity.Data.Entities;
using EPS.Libary.Utils.Audit;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace EPS.Identity.Data
{
    /// <summary>
    /// Khởi tạo đối tượng Yêu cầu đặt lại mật khẩu
    /// </summary>
    ///<author>KhuongPV</author>
    ///<created>04-06-2024</created>
    public class PasswordResetRequest : FullTableInfo<int>
    {
        public PasswordResetRequest()
        {
        }
        /// <summary>
        /// ID của người dùng thuộc về
        /// </summary>
        [Required]
        [ForeignKey("PasswordResetRequest_UserId")]
        public int UserId { get; set; }
        public virtual User PasswordResetRequest_UserId { get; set; }
        /// <summary>
        /// Trạng thái: accept, refuse
        /// </summary>
        [Required]
        public int status { get; set; }
        /// <summary>
        /// Người đồng ý đổi mật khẩu
        /// </summary>
        [ForeignKey("PasswordResetRequest_UserAgreeId")]
        public int? UserAgreeId { get; set; }
        public virtual User PasswordResetRequest_UserAgreeId { get; set; }

        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        //add foreign key {4}
    }
}
