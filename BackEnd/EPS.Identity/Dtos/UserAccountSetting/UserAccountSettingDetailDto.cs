using EPS.Identity.Repositories;
namespace EPS.Identity.Dtos.UserAccountSetting
{
    /// <summary>
    /// Dto Chi tiết Cấu hình truy cập hệ thống
    /// </summary>
    ///<author>KhuongPV</author>
    ///<created>09-09-2024</created>
    public class UserAccountSettingDetailDto : FullTableInfo<int>
    {
        /// <summary>
        /// Thời gian tối đa không hoạt động (tính bằng phút) trước khi tài khoản bị đăng xuất.
        /// Định nghĩa khoảng thời gian không tương tác tối đa trước khi tài khoản tự động đăng xuất.
        /// </summary>
        public int? MaxInactivityTimeout { get; set; }
        /// <summary>
        /// Số lần đăng nhập sai tối đa trước khi tài khoản bị khóa.
        /// Đặt giới hạn số lần đăng nhập không thành công trước khi tài khoản bị khóa.
        /// </summary>
        public int? MaxFailedLoginAttempts { get; set; }
        /// <summary>
        /// Thời gian khóa tài khoản (tính bằng phút) khi bị khóa do vi phạm hoặc đăng nhập sai.
        /// Khoảng thời gian mà tài khoản bị khóa khi vi phạm chính sách bảo mật.
        /// </summary>
        public int? AccountLockoutDuration { get; set; }
        /// <summary>
        /// Thời gian bắt đầu được phép truy cập (Ví dụ: 13:00).
        /// Xác định khoảng thời gian cho phép truy cập hệ thống.
        /// </summary>
        public string? AccessTimeStart { get; set; }
        /// <summary>
        /// Thời gian kết thúc được phép truy cập (Ví dụ: 14:00).
        /// Xác định khoảng thời gian cho phép truy cập hệ thống.
        /// </summary>
        public string? AccessTimeEnd { get; set; }
        /// <summary>
        /// Thời gian treo tài khoản (tính bằng ngày) nếu không có hoạt động kể từ lần truy cập cuối cùng.
        /// Thời gian treo tài khoản nếu không có hoạt động sau một khoảng thời gian dài.
        /// </summary>
        public int? AccountSuspensionPeriod { get; set; }
        /// <summary>
        /// Các dịch vụ bị hạn chế (danh sách chuỗi dịch vụ).
        /// Các dịch vụ bị hạn chế cho người dùng.
        /// </summary>
        public string? ServiceAccessRestrictions { get; set; }
        /// <summary>
        /// Số ngày lưu trữ lịch sử đăng nhập sau khi tài khoản bị loại bỏ.
        /// Khoảng thời gian lưu trữ lịch sử đăng nhập khi tài khoản bị loại bỏ.
        /// </summary>
        public int? LoginHistoryRetention { get; set; }
        /// <summary>
        /// Trường cho biết tài khoản có được xóa tự động khi không hợp lệ hay không (true/false).
        /// Xác định xem tài khoản có tự động bị xóa khi không hợp lệ không.
        /// </summary>
        public bool IsAccountAutoDelete { get; set; }
        /// <summary>
        /// Số lần đăng nhập lỗi hiện tại.
        /// Đếm số lần đăng nhập lỗi hiện tại của người dùng.
        /// </summary>
        public int? AccessFailedCount { get; set; }
        /// <summary>
        /// Trường cho biết tài khoản có bị khóa khi vượt quá số lần đăng nhập sai hay không (true/false).
        /// Trường cho biết tài khoản có thể bị khóa nếu đăng nhập sai quá số lần quy định.
        /// </summary>
        public bool LockoutEnabled { get; set; }

        /// <summary>
        /// Lý do tại sao bị khóa
        /// </summary>
        public string? Reason { get; set; }

        /// <summary>
        /// Thời gian khóa tài khoản dựa vào số phút của trường AccountLockoutDuration
        /// </summary>
        public DateTime? LockoutEnd { get; set; }

        /// <summary>
        /// Thời gian login cuối cùng tài khoản
        /// </summary>
        public DateTime? LastLoginDate { get; set; }
    }
}
