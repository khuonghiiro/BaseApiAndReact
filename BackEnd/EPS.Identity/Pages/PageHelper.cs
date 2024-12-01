using System.Linq.Expressions;

namespace EPS.Identity.Pages
{
    public static class PageHelper
    {
        public static IQueryable<T> WhereMany<T>(this IQueryable<T> query, IEnumerable<Expression<Func<T, bool>>> predicates)
        {
            foreach (var predicate in predicates)
            {
                query = query.Where(predicate);
            }
            return query;
        }

    }
}
