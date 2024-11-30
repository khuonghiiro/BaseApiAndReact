﻿using System;
using System.Collections.Generic;
using System.Text;

namespace EPS.Identity.Dtos.Role
{
    public class RoleDetailDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int? CategoryId { get; set; }
    }
}
