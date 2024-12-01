using EPS.Identity.Pages;
using System.Linq.Expressions;

namespace EPS.Identity.Dtos.User
{
    public class UserGridPagingDto : PagingParams<UserGridDto>
    {
        public string? Username { get; set; }
        public string? FilterText { get; set; }
        public int GroupId { get; set; }
        public string? StrIds { get; set; }

        /// <summary>
        /// Loại trừ user id
        /// </summary>
        public int? ExcludeId { get; set; }

        public override List<Expression<Func<UserGridDto, bool>>> GetPredicates()
        {
            var predicates = base.GetPredicates();

            if (!string.IsNullOrEmpty(FilterText))
            {
                predicates.Add(x => x.Username.Contains(FilterText.Trim()) || x.FullName.Contains(FilterText.Trim()));
            }
            if (!string.IsNullOrEmpty(Username))
            {
                predicates.Add(x => x.Username.Contains(Username));
            }

            if (ExcludeId != 0 && ExcludeId != null)
            {
                predicates.Add(x => x.Id != ExcludeId);
            }

            predicates.Add(x => x.DeletedUserId == null);
            return predicates;
        }

        public List<Expression<Func<Data.Entities.User, bool>>> GetTraversalPredicates()
        {
            var predicates = new List<Expression<Func<Data.Entities.User, bool>>>();



            return predicates;
        }
    }
}
