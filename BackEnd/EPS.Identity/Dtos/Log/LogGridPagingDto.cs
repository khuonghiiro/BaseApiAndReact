//using EPS.Identity.Pages;
//using System.Globalization;
//using System.Linq.Expressions;

//namespace EPS.Service.Dtos.Log
//{
//    public class LogGridPaging : PagingParams<LogGridDto>
//    {
//        public string FilterText { get; set; }
//        public string startdate { get; set; }
//        public string enddate { get; set; }
//        public override List<Expression<Func<LogGridDto, bool>>> GetPredicates()
//        {
//            var predicates = base.GetPredicates();

//            if (!string.IsNullOrEmpty(FilterText))
//            {
//                predicates.Add(x => x.Title.Contains(FilterText.Trim()) || x.Content.Contains(FilterText.Trim()));
//            }
//            #region TH1: Tồn tại startdate
//            if (!String.IsNullOrWhiteSpace(startdate))
//            {
//                CultureInfo provider = CultureInfo.InvariantCulture;
//                DateTime _startdate;
//                if (DateTime.TryParseExact(startdate, "yyyy-MM-dd", provider, DateTimeStyles.None, out _startdate))
//                {
//                    predicates.Add(x => x.Created >= _startdate);
//                }
//            }
//            #endregion
//            #region TH2: Tồn tại enddate
//            if (!String.IsNullOrWhiteSpace(enddate))
//            {
//                CultureInfo provider = CultureInfo.InvariantCulture;
//                DateTime _enddate;
//                if (DateTime.TryParseExact(enddate, "yyyy-MM-dd", provider, DateTimeStyles.None, out _enddate))
//                {
//                    var nextday = _enddate.AddDays(1);
//                    predicates.Add(x => x.Created < nextday);
//                }
//            }
//            #endregion
//            return predicates;
//        }
//    }
//    //public class TSolrLogQuery : PagingParamsSolr
//    //{
//    //    public int type { get; set; }
//    //    public string FilterText { get; set; }
//    //    public string startdate { get; set; }
//    //    public string enddate { get; set; }
//    //    public int ObjectID { get; set; }
//    //    public int DoiTuong { get; set; }

//    //    public override List<ISolrQuery> GetSolrQuery()
//    //    {
//    //        List<ISolrQuery> Querys = new List<ISolrQuery>();
//    //        Querys.Add(new SolrQuery("*:*"));

//    //        if (ObjectID > 0)
//    //        {
//    //            Querys.Add(new SolrQuery("ObjectID:" + ObjectID));
//    //        }
//    //        if (DoiTuong > 0)
//    //        {
//    //            Querys.Add(new SolrQuery("Object:" + DoiTuong));
//    //        }
//    //        //Lấy login
//    //        if (type == 1)
//    //        {
//    //            Querys.Add(new SolrQuery("Object:" + (int)DOITUONG.Login));
//    //        }
//    //        //lấy truy cập trang
//    //        else if (type == 2)
//    //        {
//    //            Querys.Add(new SolrQuery("Object:" + (int)DOITUONG.Access));
//    //        }
//    //        //lấy thay đổi nội dung
//    //        else if (type == 3)
//    //        {
//    //            Querys.Add(new SolrQuery("!Object:" + (int)DOITUONG.Login));
//    //            Querys.Add(new SolrQuery("!Object:" + (int)DOITUONG.Access));
//    //        }
//    //        //không lấy bản ghi nào ra
//    //        else if (DoiTuong == 0)
//    //        {
//    //            Querys.Add(new SolrQuery("Object:" + 0));
//    //        }
//    //        if (!string.IsNullOrEmpty(FilterText))
//    //        {
//    //            //Querys.Add(new SolrQuery("_text_:*" + FilterText + "*"));
//    //            Querys.Add(new SolrQuery("_text_:" + '"' + FilterText + '"'));
//    //        }
//    //        /*
//    //        if (!string.IsNullOrWhiteSpace(startdate) && !string.IsNullOrWhiteSpace(enddate))
//    //        {
//    //            Querys.Add(new SolrQuery(Convertion.GetStringDateSolrInRange("Created", startdate, enddate)));
//    //        }
//    //        else if (!string.IsNullOrWhiteSpace(startdate))
//    //        {
//    //            Querys.Add(new SolrQuery(Convertion.GetStringDateSolrFrom("Created", startdate)));
//    //        }
//    //        else if (!string.IsNullOrWhiteSpace(enddate))
//    //        {
//    //            Querys.Add(new SolrQuery(Convertion.GetStringDateSolrTo("Created", enddate)));
//    //        }
//    //        */
//    //        return Querys;
//    //    }
//    //}
//}
