namespace EPS.Identity.Dtos.GroupRolePermission
{
    public class GroupRolePermissionCreateDto
    {
        public int Id { get; set; }
        public int GroupId { get; set; }
        public int Value { get; set; }
        public int RoleId { get; set; }
        public int PermissionId { get; set; }
    }

   
    public class GroupRolePermissionAddDto
    {
        public int GroupId { get; set; }
        public int RoleId { get; set; }
        public bool Act01 { get; set; }
        public bool Act02 { get; set; }
        public bool Act03 { get; set; }
        public bool Act04 { get; set; }
        public bool Act05 { get; set; }
    }
}
