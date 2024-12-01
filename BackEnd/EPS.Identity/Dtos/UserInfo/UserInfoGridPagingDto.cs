using EPS.Identity.Data.Enums;
using EPS.Identity.Pages;
using System.Linq.Expressions;
namespace EPS.Identity.Dtos.UserInfo
{
    public class UserInfoGridPagingDto : PagingParams<UserInfoGridDto>
    {
        public string? Username { get; set; }
        public string? FilterText { get; set; }
        public string? GroupCode { get; set; }
        public string? StrIds { get; set; }

        /// <summary>
        /// Loại trừ user id
        /// </summary>
        public int? ExcludeId { get; set; }

        public override List<Expression<Func<UserInfoGridDto, bool>>> GetPredicates()
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


}
