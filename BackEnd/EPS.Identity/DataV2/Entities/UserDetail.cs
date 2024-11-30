using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace EPS.Identity.Data.Entities
{
    public partial class UserDetail
    {
        public UserDetail()
        {
        }
        public int Id { get; set; }
        [StringLength(100)]
        public string Email { get; set; }
        [StringLength(30)]
        public string Phone { get; set; }
        [StringLength(250)]
        public string Address { get; set; }
        [StringLength(1000)]
        public string Avatar { get; set; }
        /// <summary>
        /// 0: Không xác định, 1: Nam, 2: Nữ
        /// </summary>
        public int Sex { get; set; }
        public int UserId { get; set; }
        [ForeignKey("UserId")]
        [InverseProperty("UserDetails")]
        public virtual User User { get; set; }
    }

}
