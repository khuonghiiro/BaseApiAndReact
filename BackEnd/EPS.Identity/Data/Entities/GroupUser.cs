

using System.ComponentModel.DataAnnotations.Schema;
using System.Text.RegularExpressions;



using EPS.Identity.Repositories.Interface; using EPS.Identity.Pages; using EPS.Identity.Authorize;

namespace EPS.Identity.Data.Entities
{
    public partial class GroupUser
    {
        public GroupUser()
        {
        }
        public int Id { get; set; }
        public int GroupId { get; set; }
        [ForeignKey("GroupId")]
        [InverseProperty("GroupUsers")]
        public virtual Group Group { get; set; }
        public int UserId { get; set; }
        [ForeignKey("UserId")]
        [InverseProperty("GroupUsers")]
        public virtual User User { get; set; }
    }
}
