using System.ComponentModel.DataAnnotations;

namespace EPS.Identity.Data.Entities
{
    public partial class FileUpload
    {
        public long Id { get; set; }
        [Required]
        [StringLength(250)]
        public required string Title { get; set; }
        [Required]
        public required Byte[] DataFile { get; set; }
        [StringLength(100)]
        public required string Type { get; set; }
        public DateTime CreatedDate { get; set; }
        public required string GUIID { get; set; }
    }
}
