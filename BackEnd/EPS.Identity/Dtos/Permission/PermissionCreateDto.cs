﻿using System;
using System.Collections.Generic;
using System.Text;

namespace EPS.Identity.Dtos.Permission
{
    public class PermissionCreateDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Code { get; set; }
    }
}
