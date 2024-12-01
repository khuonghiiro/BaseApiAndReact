//namespace EPS.Service.Dtos.Log
//{
//    public class LogCreateDto
//    {
//        public int Id { get; set; }
//        public string Title { get; set; }
//        public string Content { get; set; }
//        public string Object { get; set; }
//        public int Action { get; set; }
//        public DateTime Created { get; set; }
//        public string CreatedBy { get; set; }
//        /// <summary>
//        /// 0: Thất bại, 1: Thành công
//        /// </summary>
//        public int Status { get; set; }
//        public LogCreateDto(string _useraction, string _noidung, DOITUONG _object, int _action, int _status)
//        {
//            Content = _noidung;
//            Title = Enum.GetName(typeof(DOITUONG), _object);
//            Object = ((int)_object).ToString();
//            Created = DateTime.Now;
//            CreatedBy = _useraction;
//            Action = _action;
//            Status = _status;
//        }
//    }
//}
