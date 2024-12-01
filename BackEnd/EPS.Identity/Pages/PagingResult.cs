namespace EPS.Identity.Pages
{
    public class PagingResult<TDto>
    {
        public int CurrentPage { get; set; }

        public int PageSize { get; set; }

        public long TotalRows { get; set; }

        public List<TDto> Data { get; set; }

        public bool Success { get; set; } = true;

    }

}
