using EPS.Data.Entities;
using EPS.Libary.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace EPS.Identity.Dtos.FileUpload
{
    public class FileUploadGridPaging : PagingParams<FileUploadDetailDto>
    {
        public string? IdGuid { get; set; }
        public override List<Expression<Func<FileUploadDetailDto, bool>>> GetPredicates()
        {
            var predicates = base.GetPredicates();
            if (!string.IsNullOrEmpty(IdGuid))
            {
                predicates.Add(x => x.GUIID.Equals(IdGuid));
            }
            return predicates;
        }
    }
}
