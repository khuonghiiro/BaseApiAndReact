using EPS.Libary.Utils;
using System.Linq.Expressions;

namespace EPS.Identity.Dtos.GroupUser
{
    public class GroupUserGridPaging : PagingParams<GroupUserGridDto>
    {
        public int GroupId { get; set; }
        public int UserId { get; set; }
        public List<int> LstGroupIds { get; set; }

        public override List<Expression<Func<GroupUserGridDto, bool>>> GetPredicates()
        {
            var predicates = base.GetPredicates();

            if (GroupId > 0)
            {
                predicates.Add(x => x.GroupId.Equals(GroupId));
            }
            if (UserId > 0)
            {
                predicates.Add(x => x.UserId.Equals(UserId));
            }
            if (LstGroupIds.Count > 0)
            {
                predicates.Add(x => LstGroupIds.Contains(x.GroupId));
            }
            return predicates;
        }
    }
}
