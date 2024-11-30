using EPS.Identity.Dtos.Group;
using JetBrains.Annotations;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace EPS.Identity.Dtos.MenuManager
{
    public class MenuManagerDetailDto
    {
        public int Id { get; set; }
        public required string Title { get; set; }
        public required string Url { get; set; }
        public int Stt { get; set; }
        [CanBeNull] public string? Icon { get; set; }
        [CanBeNull] public string? Groups { get; set; }//Lưu id group
        public int? ParentId { get; set; }
        public bool IsBlank { get; set; }
        public bool IsShow { get; set; }
        public List<GroupDetailDto> LstGroups { get; set; }//Lưu id group
        public List<int> GroupIds { get; set; }
        public string Parent { get; set; }
        public MenuManagerDetailDto()
        {
            LstGroups = new List<GroupDetailDto>();
            GroupIds=new List<int>();
        }

    }
}
