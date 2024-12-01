using EPS.Identity.Dtos.User;
using EPS.Identity.BaseExt;

namespace EPS.Identity.Dtos.PasswordResetRequest
{
	/// <summary>
	/// Dto danh sách Yêu cầu đặt lại mật khẩu
	/// </summary>
	///<author>KhuongPV</author>
	///<created>04-06-2024</created>
    public class PasswordResetRequestGridDto : TableGridInfo<int>
    {
        /// <summary>
		/// ID
		/// </summary>
	public  int Id { get; set; }
/// <summary>
		/// ID của người dùng thuộc về
		/// </summary>
	public  int UserId { get; set; }
/// <summary>
		/// Trạng thái: accept, refuse
		/// </summary>
	public  int status { get; set; }
/// <summary>
		/// Người đồng ý đổi mật khẩu
		/// </summary>
	public  int UserAgreeId { get; set; }

        public virtual UserGridDto PasswordResetRequest_UserId { get; set; }

        public virtual UserGridDto PasswordResetRequest_UserAgreeId { get; set; }

        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
