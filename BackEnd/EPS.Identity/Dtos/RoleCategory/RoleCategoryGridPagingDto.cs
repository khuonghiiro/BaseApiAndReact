using EPS.Identity.Pages;
using System.Linq.Expressions;
namespace EPS.Identity.Dtos.RoleCategory
{
    /// <summary>
    /// GridPaging Danh mục đối tượng
    /// </summary>
    ///<author>ThoNV</author>
    ///<created>15/08/2023</created>
    public class RoleCategoryGridPaging : PagingParams<RoleCategoryGridDto>
    {
        public string? FilterText { get; set; }
        //rendercode{5}
        public override List<Expression<Func<RoleCategoryGridDto, bool>>> GetPredicates()
        {
            var predicates = base.GetPredicates();
            if (!string.IsNullOrEmpty(FilterText))
                predicates.Add(x => (x.TieuDe.Contains(FilterText.Trim()) || x.MoTa.Contains(FilterText.Trim())));
            //rendercode{6}
            return predicates;
        }
    }

    public class RoleCategoryTreeGridPaging : PagingParams<RoleCategoryTreeGridDto>
    {
        public string? FilterText { get; set; }
        public int ParentId { get; set; }
        //rendercode{5}
        public override List<Expression<Func<RoleCategoryTreeGridDto, bool>>> GetPredicates()
        {
            var predicates = base.GetPredicates();
            if (!string.IsNullOrEmpty(FilterText))
                predicates.Add(x => (x.TieuDe.Contains(FilterText.Trim()) || x.MoTa.Contains(FilterText.Trim())));
            if (ParentId > 0)
            {
                predicates.Add(x => x.ParentId.Equals(ParentId));
            }
            else if (ParentId < 0)
            {
                predicates.Add(x => !x.ParentId.HasValue);
            }
            //rendercode{6}
            return predicates;
        }
    }
}
