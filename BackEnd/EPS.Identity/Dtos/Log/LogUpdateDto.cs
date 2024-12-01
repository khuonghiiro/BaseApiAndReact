using System;
using System.Collections.Generic;
using System.Text;

namespace EPS.Service.Dtos.Log
{
    public class LogUpdateDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public string Object { get; set; }
        public int Action { get; set; }
        public DateTime Created { get; set; }
        public string CreatedBy { get; set; }
        /// <summary>
        /// 0: Thất bại, 1: Thành công
        /// </summary>
        public int Status { get; set; }
    }
}
