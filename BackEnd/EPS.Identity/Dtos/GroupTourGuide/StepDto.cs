namespace EPS.Identity.Dtos.GroupTourGuide
{
    public class StepDto
    {
        public Guid Id { get; set; }
        public int StepIndex { get; set; }
    }

    public class TourStepDto
    {
        public string Selector { get; set; }
        public string? Content { get; set; }
        public string? Title { get; set; }
        public bool IsClickElem { get; set; }
        public int Order { get; set; } 
        public string? Attachment { get; set; } 
}
}
