using AutoMapper;
using EPS.Identity.Dtos.GroupTourGuide;
using EPS.Identity.Data;
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
