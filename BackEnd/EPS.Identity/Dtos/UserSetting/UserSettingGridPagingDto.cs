using EPS.Identity.Pages;
using System.Linq.Expressions;
namespace EPS.Identity.Dtos.UserSetting
{
    /// <summary>
    /// GridPaging Cấu hình truy cập hệ thống
    /// </summary>
    ///<author>KhuongPV</author>
    ///<created>07-08-2024</created>
    public class UserSettingGridPaging : PagingParams<UserSettingGridDto>
    {
        public string? FilterText { get; set; }
        //rendercode{5}
        public override List<Expression<Func<UserSettingGridDto, bool>>> GetPredicates()
        {
            var predicates = base.GetPredicates();
            if (!string.IsNullOrEmpty(FilterText))
                predicates.Add(x => (x.Key.Contains(FilterText.Trim()) || x.Key.Contains(FilterText.Trim())));

            //rendercode{6}
            return predicates;
        }
    }
}
