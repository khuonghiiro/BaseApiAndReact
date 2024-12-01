using EPS.Identity.Pages;
using System.Linq.Expressions;

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
