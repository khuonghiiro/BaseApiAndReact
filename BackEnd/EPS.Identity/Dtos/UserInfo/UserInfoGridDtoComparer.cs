namespace EPS.Identity.Dtos.UserInfo
{
    public class UserInfoGridDtoComparer : IEqualityComparer<UserInfoGridDto>
    {
        public bool Equals(UserInfoGridDto x, UserInfoGridDto y)
        {
            if (x == null || y == null)
                return false;

            // So sánh dựa trên Id (hoặc bạn có thể sử dụng các thuộc tính khác nếu cần)
            return x.Id == y.Id;
        }

        public int GetHashCode(UserInfoGridDto obj)
        {
            if (obj == null)
                return 0;

            // Sử dụng Id để tạo mã băm (hoặc bạn có thể sử dụng các thuộc tính khác nếu cần)
            return obj.Id.GetHashCode();
        }
    }
}
