using EPS.Identity.Pages;
using System.Linq.Expressions;
namespace EPS.Identity.Dtos.GroupTourGuide
{
    /// <summary>
    /// GridPaging Các bước hướng dẫn website
    /// </summary>
    ///<author>KhuongPV</author>
    ///<created>22-07-2024</created>
    public class GroupTourGuideGridPaging : PagingParams<GroupTourGuideGridDto>
    {
        public string? FilterText { get; set; }

        public List<string> ListGroupCodes { get; set; }

        public Guid? Id { get; set; }

        public string? GroupIds { get; set; }

        public string? KeyName { get; set; }

        public GroupTourGuideGridPaging()
        {
            ListGroupCodes = new List<string>();
        }

        //rendercode{5}
        public override List<Expression<Func<GroupTourGuideGridDto, bool>>> GetPredicates()
        {
            var predicates = base.GetPredicates();

            if (Id != null && Id != Guid.Empty)
            {
                predicates.Add(x => x.Id == Id);
            }

            if (!string.IsNullOrEmpty(KeyName))
            {
                predicates.Add(x => x.KeyName == KeyName);
            }

            if (ListGroupCodes.Count > 0)
            {
                predicates.Add(x => !string.IsNullOrEmpty(x.GroupIds) && ListGroupCodes.Any(code => x.GroupIds.Contains("," + code + ",")));
            }

            if (!string.IsNullOrEmpty(GroupIds))
            {
                var listGroudIds = GroupIds.Trim().Trim(',').Split(",");

                if (listGroudIds != null && listGroudIds.Length > 0)
                {
                    predicates.Add(x => !string.IsNullOrEmpty(x.GroupIds) && listGroudIds.Any(code => x.GroupIds.Contains("," + code + ",")));
                }
            }
            //rendercode{6}
            return predicates;
        }
    }
}
