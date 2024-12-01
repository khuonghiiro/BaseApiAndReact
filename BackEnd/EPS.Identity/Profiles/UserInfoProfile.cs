using AutoMapper;
using EPS.Identity.Data.Entities;
using EPS.Identity.Dtos.GroupUser;
using EPS.Identity.Dtos.UserInfo;

namespace EPS.Identity.Profiles
{
    public class UserInfoDtoToEntity : Profile
    {
        public UserInfoDtoToEntity()
        {
            CreateMap<UserInfoCreateDto, UserDetail>();
            CreateMap<UserInfoUpdateDto, UserDetail>();
        }
    }

    public class UserInfoEntityToDto : Profile
    {
        public UserInfoEntityToDto()
        {
            CreateMap<UserDetail, UserInfoDetailDto>(); 

        }
    }
}
