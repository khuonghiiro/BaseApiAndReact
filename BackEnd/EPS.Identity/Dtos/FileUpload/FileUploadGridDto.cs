﻿using System;
using System.Collections.Generic;
using System.Text;

namespace EPS.Identity.Dtos.FileUpload
{
    public class FileUploadGridDto
    {
        public long Id { get; set; }
        public string Title { get; set; }
        public byte[] DataFile { get; set; }
        public string Url { get; set; }
        public DateTime Created { get; set; }
        public int? UserId { get; set; }
        public string IdGuid { get; set; }
        public int Permission { get; set; }
        public FileUploadGridDto()
        {

        }

    }
}