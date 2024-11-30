using AutoMapper;
using EPS.Identity.Data.Entities;
using EPS.Identity.Dtos.Permission;

namespace EPS.Identity.Profiles
{
    public class PermissionDtoToEntity : Profile
    {
        public PermissionDtoToEntity()
        {
            CreateMap<PermissionCreateDto, Permission>();
            CreateMap<PermissionUpdateDto, Permission>();           
        }
    }

    public class PermissionEntityToDto : Profile
    {
        public PermissionEntityToDto()
        {
            CreateMap<Permission, PermissionGridDto>();
            CreateMap<Permission, PermissionDetailDto>();
        }
    }
}
