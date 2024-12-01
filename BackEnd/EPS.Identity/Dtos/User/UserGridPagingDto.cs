using EPS.Identity.Data.Enums;
using EPS.Identity.Pages;
using System.Linq.Expressions;

namespace EPS.Identity.Dtos.User
{
    public class UserGridPagingDto : PagingParams<UserGridDto>
    {
        public string? Username { get; set; }
        public string? FilterText { get; set; }
        public int GroupId { get; set; }
        public string? StrIds { get; set; }

        /// <summary>
        /// Loại trừ user id
        /// </summary>
        public int? ExcludeId { get; set; }

        public override List<Expression<Func<UserGridDto, bool>>> GetPredicates()
        {
            var predicates = base.GetPredicates();

            if (!string.IsNullOrEmpty(FilterText))
            {
                predicates.Add(x => x.Username.Contains(FilterText.Trim()) || x.FullName.Contains(FilterText.Trim()));
            }
            if (!string.IsNullOrEmpty(Username))
            {
                predicates.Add(x => x.Username.Contains(Username));
            }

            if (ExcludeId != 0 && ExcludeId != null)
            {
                predicates.Add(x => x.Id != ExcludeId);
            }

            predicates.Add(x => x.DeletedUserId == null);
            return predicates;
        }

        public List<Expression<Func<Data.Entities.User, bool>>> GetTraversalPredicates()
        {
            var predicates = new List<Expression<Func<Data.Entities.User, bool>>>();



            return predicates;
        }
    }
    public class UserGridInfoPagingDto : PagingParams<UserGridInfoDto>
    {
        public string? Username { get; set; }
        public string? FilterText { get; set; }
        public string? GroupCode { get; set; }
        public string? StrIds { get; set; }

        /// <summary>
        /// Loại trừ user id
        /// </summary>
        public int? ExcludeId { get; set; }

        public override List<Expression<Func<UserGridInfoDto, bool>>> GetPredicates()
        {
            var predicates = base.GetPredicates();

            if (!string.IsNullOrEmpty(FilterText))
            {
                predicates.Add(x => x.Username.Contains(FilterText.Trim()) || x.FullName.Contains(FilterText.Trim()));
            }
            if (!string.IsNullOrEmpty(Username))
            {
                predicates.Add(x => x.Username.Contains(Username));
            }

            if (!string.IsNullOrEmpty(StrIds))
            {
                var parts = StrIds.Trim(',').Split(',');
                List<int> lstIds = parts.Where(part => !string.IsNullOrEmpty(part)) // Bỏ qua các phần tử rỗng
                .Select(int.Parse) // Chuyển đổi chuỗi sang số nguyên
                .ToList();
                predicates.Add(x => lstIds.Contains(x.Id));
            }
            if (!string.IsNullOrEmpty(GroupCode))
            {
                var parts = GroupCode.Replace(";", ",").Trim(',').Split(',');

                List<string> lstCodes = parts.Where(part => !string.IsNullOrEmpty(part)).ToList(); // Bỏ qua các phần tử rỗng
                predicates.Add(x => x.GroupCodes.Any(code => lstCodes.Contains(code)));
            }
            predicates.Add(x => x.DeletedUserId == null);
            predicates.Add(x => x.Status == (int)StatusUserEnum.Active);
            return predicates;
        }
    }

    // Bộ so sánh tùy chỉnh cho UserGridInfoDto
    public class UserGridInfoDtoComparer : IEqualityComparer<UserGridInfoDto>
    {
        public bool Equals(UserGridInfoDto x, UserGridInfoDto y)
        {
            if (x == null || y == null)
                return false;

            // So sánh dựa trên Id (hoặc bạn có thể sử dụng các thuộc tính khác nếu cần)
            return x.Id == y.Id;
        }

        public int GetHashCode(UserGridInfoDto obj)
        {
            if (obj == null)
                return 0;

            // Sử dụng Id để tạo mã băm (hoặc bạn có thể sử dụng các thuộc tính khác nếu cần)
            return obj.Id.GetHashCode();
        }
    }
}
