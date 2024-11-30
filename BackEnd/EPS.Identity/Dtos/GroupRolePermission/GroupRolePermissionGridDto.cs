using System;
using System.Collections.Generic;
using System.Text;

namespace EPS.Identity.Dtos.GroupRolePermission
{
    public class GroupRolePermissionGridDto
    {
        public int Id { get; set; }
        public int GroupId { get; set; }
        public int Value { get; set; }
        public int RoleId { get; set; }
        public int PermissionId { get; set; }
        public string PermissionCode { get; set; }

    }
}
