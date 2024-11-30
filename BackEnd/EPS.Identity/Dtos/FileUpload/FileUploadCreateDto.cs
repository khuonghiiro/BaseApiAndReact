using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;

namespace EPS.Identity.Dtos.FileUpload
{
    public class FileUploadCreateDto
    {
        public long Id { get; set; }
        public string Title { get; set; }
        public byte[] DataFile { get; set; }
        public DateTime CreatedDate { get; set; }
        public string Type { get; set; }
        public string GUIID { get; set; }
        public FileUploadCreateDto(IFormFile file)
        {
            Title = file.FileName;
            using (var ms = new MemoryStream())
            {
                file.CopyTo(ms);
                DataFile = ms.ToArray();
            }
            Type = file.ContentType;
            CreatedDate = DateTime.Now;
            GUIID = Guid.NewGuid().ToString();
        }
    }
}
