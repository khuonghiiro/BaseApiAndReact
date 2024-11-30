using EPS.Libary.Utils;
using JetBrains.Annotations;
using System.Linq.Expressions;

namespace EPS.Identity.Dtos.Group
{
    public class GroupGridPaging : PagingParams<GroupGridDto>
    {
        [CanBeNull] public string? FilterText { get; set; }

        public override List<Expression<Func<GroupGridDto, bool>>> GetPredicates()
        {
            var predicates = base.GetPredicates();

            if (!string.IsNullOrEmpty(FilterText))
            {
                predicates.Add(x => x.Title.Contains(FilterText)|| x.Code.Contains(FilterText));
            }            
            return predicates;
        }
    }
}
