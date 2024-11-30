namespace EPS.Identity.Dtos.GroupTourGuide
{
	/// <summary>
	/// Dto cập nhật Các bước hướng dẫn website
	/// </summary>
	///<author>KhuongPV</author>
	///<created>22-07-2024</created>
    public class GroupTourGuideUpdateDto
    {
        /// <summary>
		/// ID
		/// </summary>
		public  Guid Id { get; set; }


        /// <summary>
        /// ID của của các bước
        /// </summary>
        public  string? EdgeIds { get; set; }
/// <summary>
		/// Tên hướng dẫn
		/// </summary>
		public  required string Name { get; set; }

        public required string KeyName { get; set; }

        /// <summary>
        /// ID nhóm người dùng
        /// </summary>
        public List<string> ListGroupCodes { get; set; }

        public string? GroupIds { get; set; }
        /// <summary>
        /// Kích hoạt
        /// </summary>
        public  bool IsActive { get; set; }

        public string? ListNodes { get; set; }

        public string? ListEdges { get; set; }
    }
}
