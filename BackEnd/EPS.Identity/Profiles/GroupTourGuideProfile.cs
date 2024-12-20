using AutoMapper;
using EPS.Identity.Data.Entities;
using EPS.Identity.Dtos.GroupTourGuide;
namespace EPS.Identity.Profiles
{
    public class GroupTourGuideDtoToEntity : Profile
    {
        public GroupTourGuideDtoToEntity()
        {
            CreateMap<GroupTourGuideCreateDto, GroupTourGuide>();
            CreateMap<GroupTourGuideUpdateDto, GroupTourGuide>();
        }
    }
    public class GroupTourGuideEntityToDto : Profile
    {
        public GroupTourGuideEntityToDto()
        {
            CreateMap<GroupTourGuide, GroupTourGuideDetailDto>();
            CreateMap<GroupTourGuide, GroupTourGuideGridDto>();
        }
    }
}
