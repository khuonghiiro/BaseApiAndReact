using System;
using System.Collections.Generic;
using System.Text;

namespace EPS.Identity.Dtos.Role
{
    public class RoleGridDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int? CategoryId { get; set; }
        public string Category { get; set; }
    }

    public class RolePerGridDto
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
        public bool ActAdd { get; set; }
        public bool ActEdit { get; set; }
        public bool ActDelete { get; set; }
        public bool ActApprove { get; set; }
        public bool ActPer { get; set; }
        public int GroupId { get; set; }
    }
}
