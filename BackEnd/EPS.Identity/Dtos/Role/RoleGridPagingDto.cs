using EPS.Identity.Pages;
using System.Linq.Expressions;

namespace EPS.Identity.Dtos.Role
{
    public class RoleGridPagingDto : PagingParams<RoleGridDto>
    {
        public string? FilterText { get; set; }
        public override List<Expression<Func<RoleGridDto, bool>>> GetPredicates()
        {
            var predicates = base.GetPredicates();

            if (!string.IsNullOrEmpty(FilterText))
            {
                predicates.Add(x => x.Name.Contains(FilterText.Trim()) || x.Description.Contains(FilterText.Trim()));
            }
            return predicates;
        }
    }

}
