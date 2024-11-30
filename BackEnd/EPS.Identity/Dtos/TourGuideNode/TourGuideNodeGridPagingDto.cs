using EPS.Libary.Utils;
using System.Linq.Expressions;
namespace EPS.Identity.Dtos.TourGuideNode
{
	/// <summary>
	/// GridPaging Hướng dẫn website
	/// </summary>
	///<author>KhuongPV</author>
	///<created>24-07-2024</created>
    public class TourGuideNodeGridPaging : PagingParams<TourGuideNodeGridDto>
    {
        public string? FilterText { get; set; } 
        public string? KeyDiagram { get; set; }
        public List<Guid>? Ids { get; set; }

        //rendercode{5}
        public override List<Expression<Func<TourGuideNodeGridDto, bool>>> GetPredicates()
        {
            var predicates = base.GetPredicates();

            if(Ids != null && Ids.Count > 0)
            {
                predicates.Add(s => Ids.Contains(s.Id));
            }

            if (!string.IsNullOrEmpty(KeyDiagram))
            {
                predicates.Add(s => s.KeyDiagram == KeyDiagram);
            }
            //rendercode{6}
            return predicates;
        }
    }
}
