using EPS.Libary.Utils;
using System.Linq.Expressions;

namespace EPS.Identity.Dtos.GroupRolePermission
{
    public class GroupRolePermissionGridPaging : PagingParams<GroupRolePermissionGridDto>
    {
        public int GroupId { get; set; }
        public int RoleId { get; set; }
        public int PermissionId { get; set; }
        public string? PermissionCode { get; set; }

        public override List<Expression<Func<GroupRolePermissionGridDto, bool>>> GetPredicates()
        {
            var predicates = base.GetPredicates();
            if (GroupId > 0)
            {
                predicates.Add(x => x.GroupId.Equals(GroupId));
            }
            if (RoleId > 0)
            {
                predicates.Add(x => x.RoleId.Equals(RoleId));
            }
            if (PermissionId > 0)
            {
                predicates.Add(x => x.PermissionId.Equals(PermissionId));
            }
            if(!string.IsNullOrEmpty(PermissionCode))
            {
                predicates.Add(x => x.PermissionCode.Equals(PermissionCode));
            }    
            return predicates;
        }
    }
}
