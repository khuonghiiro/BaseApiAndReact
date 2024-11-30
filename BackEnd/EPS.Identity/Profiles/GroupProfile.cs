using AutoMapper;
using EPS.Identity.Data.Entities;
using EPS.Identity.Dtos.Group;

namespace EPS.Identity.Profiles
{
    public class GroupDtoToEntity : Profile
    {
        public GroupDtoToEntity()
        {
            CreateMap<GroupCreateDto, Group>();
            CreateMap<GroupUpdateDto, Group>();           
        }
    }

    public class GroupEntityToDto : Profile
    {
        public GroupEntityToDto()
        {
            CreateMap<Group, GroupGridDto>();
            CreateMap<Group, GroupDetailDto>();
        }
    }
}
