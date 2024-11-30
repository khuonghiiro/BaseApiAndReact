using EPS.Libary.Utils;
using System.Linq.Expressions;

namespace EPS.Identity.Dtos.Permission
{
    public class PermissionGridPaging : PagingParams<PermissionGridDto>
    {
        public string? FilterText { get; set; }
        public string? Code { get; set; }
        public override List<Expression<Func<PermissionGridDto, bool>>> GetPredicates()
        {
            var predicates = base.GetPredicates();

            if (!string.IsNullOrEmpty(FilterText))
            {
                predicates.Add(x => x.Title.Contains(FilterText)|| x.Code.Contains(FilterText));
            }
            if (!string.IsNullOrEmpty(Code))
            {
                predicates.Add(x => x.Code.Equals(Code));
            }

            return predicates;
        }
    }
}
