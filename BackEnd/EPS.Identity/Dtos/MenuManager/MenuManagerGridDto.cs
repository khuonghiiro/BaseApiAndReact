using System.Dynamic;

namespace EPS.Identity.Dtos.MenuManager
{
    public class MenuManagerGridDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public int Stt { get; set; }
        public string Url { get; set; }
        public string Icon { get; set; }
        public int? ParentId { get; set; }
        public string Parent { get; set; }
        public Object ParentJson
        {
            get
            {
                dynamic obj = new ExpandoObject();
                obj.label = Parent;
                obj.value = ParentId;
                return obj;
            }
        }
        public bool IsShow { get; set; }
        public string Groups { get; set; }//Lưu id group
        public IEnumerable<MenuManagerGridDto> Childrens { get; set; }
        public IEnumerable<MenuManagerGridDto> Children { get; set; }
        public MenuManagerGridDto()
        {

        }

    }

    public class MenuManagerTreeGridDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public int? ParentId { get; set; }
        public int PId
        {
            get { return ParentId.HasValue ? ParentId.Value : 0; }
        }
        public int Value
        {
            get { return Id; }
        }
        public int CountChild { get; set; }
        public bool IsLeaf
        {
            get
            {
                return CountChild > 0 ? false : true;
            }
        }
        public MenuManagerTreeGridDto()
        {

        }

    }
}
