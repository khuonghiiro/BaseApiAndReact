using AutoMapper;
using EPS.Identity.Data.Entities;
using EPS.Identity.Dtos.GroupUser;

namespace EPS.Identity.Profiles
{
    public class GroupUserDtoToEntity : Profile
    {
        public GroupUserDtoToEntity()
        {
            CreateMap<GroupUserCreateDto, GroupUser>();
            CreateMap<GroupUserUpdateDto, GroupUser>();
        }
    }

    public class GroupUserEntityToDto : Profile
    {
        public GroupUserEntityToDto()
        {
            CreateMap<GroupUser, GroupUserCreateDto>();
            CreateMap<GroupUser, GroupUserDetailDto>();
            CreateMap<GroupUser, GroupUserGridDto>();

        }
    }
}
