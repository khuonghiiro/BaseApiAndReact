using AutoMapper;
using EPS.Identity.Dtos.User;
using EPS.Identity.Data.Entities;
using EPS.Identity.Dtos.UserInfo;

namespace EPS.Identity.Profiles
{
    public class UserDtoToEntity : Profile
    {
        public UserDtoToEntity()
        {
            CreateMap<UserCreateDto, User>();
            CreateMap<UserUpdateDto, User>();
            CreateMap<UserAddDto, User>();
            CreateMap<UserUpdateInfoDto, User>();
            CreateMap<UserUpdateStatus, User>();
        }
    }

    public class UserEntityToDto : Profile
    {
        public UserEntityToDto()
        {
            CreateMap<User, UserCreateDto>();
            CreateMap<User, UserInfoGridDto>();
            CreateMap<User, UserInfoItem>()
                .ForMember(dest => dest.GroupIds, mo => mo.MapFrom(src => src.GroupUsers.Select(x => x.Group.Id)))
                .ForMember(dest => dest.User, mo => mo.MapFrom(src => src.UserDetails.FirstOrDefault()));
            CreateMap<User, UserGridDto>()
                .ForMember(dest => dest.Email, mo => mo.MapFrom(src => src.UserDetails.FirstOrDefault().Email))
                .ForMember(dest => dest.Phone, mo => mo.MapFrom(src => src.UserDetails.FirstOrDefault().Phone))
                .ForMember(dest => dest.LstGroupIds, mo => mo.MapFrom(src => src.GroupUsers.Select(x => x.GroupId)));
            CreateMap<User, UserDetailDto>()
                .ForMember(dest => dest.GroupIds, mo => mo.MapFrom(src => src.GroupUsers.Select(x => x.Group.Id)))
                .ForMember(dest => dest.GroupTitles, mo => mo.MapFrom(src => src.GroupUsers.Select(x => x.Group.Title)))
                .ForMember(dest => dest.Email, mo => mo.MapFrom(src => src.UserDetails.FirstOrDefault().Email))
                .ForMember(dest => dest.Sex, mo => mo.MapFrom(src => src.UserDetails.FirstOrDefault().Sex))
                .ForMember(dest => dest.Address, mo => mo.MapFrom(src => src.UserDetails.FirstOrDefault().Address))
                .ForMember(dest => dest.Avatar, mo => mo.MapFrom(src => src.UserDetails.FirstOrDefault().Avatar));
            CreateMap<User, UserInfoGridDto>()
                .ForMember(dest => dest.GroupCodes, mo => mo.MapFrom(src => src.GroupUsers.Select(x => x.Group.Code)));
        }
    }
}
