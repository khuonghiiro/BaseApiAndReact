using EPS.Libary.Utils;
using System.Linq.Expressions;
namespace EPS.Identity.Dtos.PasswordResetRequest
{
	/// <summary>
	/// GridPaging Yêu cầu đặt lại mật khẩu
	/// </summary>
	///<author>KhuongPV</author>
	///<created>04-06-2024</created>
    public class PasswordResetRequestGridPaging : PagingParams<PasswordResetRequestGridDto>
    {
        public string? FilterText { get; set; } 
        	public  int status { get; set; }
	public  int userAgreeId { get; set; }
        //rendercode{5}
        public override List<Expression<Func<PasswordResetRequestGridDto, bool>>> GetPredicates()
        {
            var predicates = base.GetPredicates();
            if (!string.IsNullOrEmpty(FilterText))
	        //predicates.Add(x => ());

            if (status>0)
            { 
                 predicates.Add(x => (x.status.Equals(status))); 
            }    

	        if (userAgreeId>0)
            { 
                 predicates.Add(x => (x.UserAgreeId.Equals(userAgreeId))); 
            }    
            //rendercode{6}
            return predicates;
        }
    }
}
