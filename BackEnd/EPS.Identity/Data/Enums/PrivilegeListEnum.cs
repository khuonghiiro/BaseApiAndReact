using System.ComponentModel;

namespace EPS.Identity.Data.Enums
{
    public enum PrivilegeListEnum
    {
        [Description("Danh sách")]
        List = 0,
        [Description("Thêm mới")]
        Add = 1,
        [Description("Sửa")]
        Edit,
        [Description("Xóa")]
        Delete,
        [Description("Phê duyệt")]
        Approved,
        [Description("Quyền chức năng")]
        Permission,
        [Description("Chi tiết")]
        Detail
    }
}
