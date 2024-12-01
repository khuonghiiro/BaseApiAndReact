using EPS.Identity.Repositories;

namespace EPS.Identity.Dtos.GroupTourGuide
{
    /// <summary>
    /// Dto Chi tiết Các bước hướng dẫn website
    /// </summary>
    ///<author>KhuongPV</author>
    ///<created>22-07-2024</created>
    public class GroupTourGuideDetailDto : FullTableInfo<Guid>
    {
        /// <summary>
        /// ID của của các bước
        /// </summary>
        public string? EdgeIds { get; set; }
        /// <summary>
        /// Tên hướng dẫn
        /// </summary>
        public required string Name { get; set; }

        public required string KeyName { get; set; }

        public string? GroupIds { get; set; }

        /// <summary>
        /// Kích hoạt
        /// </summary>
        public bool IsActive { get; set; }

        public string? ListNodes { get; set; }

        public string? ListEdges { get; set; }

        public List<string> ListGroupCodes
        {
            get
            {
                if (!string.IsNullOrEmpty(GroupIds))
                {
                    var parts = GroupIds.Trim(',').Split(',');

                    // Chuyển đổi các phần tử sang số nguyên và tạo danh sách
                    List<string> result = parts
                        .Where(part => !string.IsNullOrEmpty(part)) // Bỏ qua các phần tử rỗng
                                                                    //.Select(int.Parse) // Chuyển đổi chuỗi sang số nguyên
                        .ToList();
                    return result;
                }
                return new List<string>();
            }
        }
    }
}
