namespace EPS.Identity.Pages
{
    public class PagingResult<T>
    {
        public int CurrentPage { get; set; }
        public int PageSize { get; set; }
        public int TotalRows { get; set; }
        public List<T> Data { get; set; }

        public bool IsOK { get; set; }
        public string Message { get; set; }
        public string Code { get; set; }
    }

}
