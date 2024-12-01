using System.Linq.Expressions;

namespace EPS.Identity.Pages
{

    public class PagingParams<TDto>
    {
        public static int DefaultPageSize = 10;

        public string SortExpression => (string.IsNullOrEmpty(SortBy) ? "ID" : SortBy) + " " + (SortDesc ? "desc" : "asc");

        public string SortBy { get; set; }

        public bool SortDesc { get; set; }

        public int ItemsPerPage { get; set; }

        public int Page { get; set; }

        public int StartingIndex => ItemsPerPage * (Page - 1);

        public int Start { get; set; }

        public PagingParams()
        {
            SortBy = "Id";
            SortDesc = true;
            ItemsPerPage = DefaultPageSize;
            Page = 0;
        }

        public virtual List<Expression<Func<TDto, bool>>> GetPredicates()
        {
            return new List<Expression<Func<TDto, bool>>>();
        }
    }

}
