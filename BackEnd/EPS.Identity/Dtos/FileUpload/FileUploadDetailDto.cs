using System;
using System.Collections.Generic;
using System.Text;

namespace EPS.Identity.Dtos.FileUpload
{
    public class FileUploadDetailDto
    {
        public long Id { get; set; }
        public required string Title { get; set; }
        public required byte[] DataFile { get; set; }
        public required string Type { get; set; }
        public DateTime CreatedDate { get; set; }
        public required string GUIID { get; set; }
        public string Url
        {
            get
            {
                if (!string.IsNullOrEmpty(Title)&& !string.IsNullOrEmpty(GUIID))
                {
                    return "fileupload/"+GUIID+"/"+Title;
                }
                return "";
            }
        }

    }
    public class FileUploadReturnDto
    {
        public long Id { get; set; }
        public required string Title { get; set; }
        public required string Type { get; set; }
        public required string GUIID { get; set; }
        public string Url
        {
            get
            {
                if (!string.IsNullOrEmpty(Title)&& !string.IsNullOrEmpty(GUIID))
                {
                    return "fileupload/"+GUIID+"/"+Title;
                }
                return "";
            }
        }

    }
}
