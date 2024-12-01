//namespace EPS.Service.Dtos.Log
//{
//    public class LogDetailDto
//    {
//        public int Id { get; set; }
//        public string Title { get; set; }
//        public string Content { get; set; }
//        public string Object { get; set; }
//        public int Action { get; set; }
//        public string ActionName
//        {
//            get
//            {
//                return LogEntityToDto.GetDescriptionEnumValue<ActionLogs>(Action);
//            }
//        }
//        public DateTime Created { get; set; }
//        public string CreatedBy { get; set; }
//        /// <summary>
//        /// 0: Thất bại, 1: Thành công
//        /// </summary>
//        public int Status { get; set; }
//        public string StatusName
//        {
//            get
//            {
//                return LogEntityToDto.GetDescriptionEnumValue<StatusLogs>(Status);
//            }
//        }
//    }
//}
