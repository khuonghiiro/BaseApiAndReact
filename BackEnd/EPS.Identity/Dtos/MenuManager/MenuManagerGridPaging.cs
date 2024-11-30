﻿using EPS.Data.Entities;
using EPS.Identity.Dtos.MenuManager;
using EPS.Libary.Utils;
using JetBrains.Annotations;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace EPS.Identity.Dtos.MenuManager
{
    public class MenuManagerGridPaging : PagingParams<MenuManagerGridDto>
    {
        [CanBeNull] public string? FilterText { get; set; }
        public bool IsAllShow { get; set; }
        public int ParentId { get; set; }        

        public override List<Expression<Func<MenuManagerGridDto, bool>>> GetPredicates()
        {
            var predicates = base.GetPredicates();

            if (!string.IsNullOrEmpty(FilterText))
            {
                predicates.Add(x => x.Title.Contains(FilterText));
            }
            if (ParentId > 0)
            {
                predicates.Add(x => x.ParentId.Equals(ParentId));
            }
            if (IsAllShow)
            {
                predicates.Add(x => x.IsShow.Equals(true));
            }
            
            return predicates;
        }
    }
    public class MenuManagerTreeGridPaging : PagingParams<MenuManagerTreeGridDto>
    {
        public string FilterText { get; set; }
        public int ParentId { get; set; }

        public override List<Expression<Func<MenuManagerTreeGridDto, bool>>> GetPredicates()
        {
            var predicates = base.GetPredicates();

            if (!string.IsNullOrEmpty(FilterText))
            {
                predicates.Add(x => x.Title.Contains(FilterText));
            }
            if (ParentId > 0)
            {
                predicates.Add(x => x.ParentId.Equals(ParentId));
            }
            else if (ParentId < 0)
            {
                predicates.Add(x => !x.ParentId.HasValue);
            }
            return predicates;
        }
    }
}