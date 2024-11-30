using AutoMapper;
using EPS.Identity.Data.Entities;
using EPS.Identity.Dtos.GroupRolePermission;

namespace EPS.Identity.Profiles
{
    public class GroupRolePermissionDtoToEntity : Profile
    {
        public GroupRolePermissionDtoToEntity()
        {
            CreateMap<GroupRolePermissionCreateDto, GroupRolePermission>();
            CreateMap<GroupRolePermissionUpdateDto, GroupRolePermission>();
        }
    }

    public class GroupRolePermissionEntityToDto : Profile
    {
        public GroupRolePermissionEntityToDto()
        {
            CreateMap<GroupRolePermission, GroupRolePermissionDetailDto>(); ;
            CreateMap<GroupRolePermission, GroupRolePermissionGridDto>()
                .ForMember(dest => dest.PermissionCode, mo => mo.MapFrom(src => src.Permission.Code))
                ;

        }
    }
}
