using AutoMapper;
using EPS.Identity.Data.Entities;
using EPS.Identity.Dtos.Role;

namespace EPS.Identity.Profiles
{
    public class RoleDtoToEntity : Profile
    {
        public RoleDtoToEntity()
        {
            CreateMap<RoleCreateDto, Role>();
            CreateMap<RoleUpdateDto, Role>();
        }
    }

    public class RoleEntityToDto : Profile
    {
        public RoleEntityToDto()
        {
            CreateMap<Role, RoleGridDto>()
            .ForMember(dest => dest.Category, mo => mo.MapFrom(src => src.Role_CategoryId.TieuDe));
            CreateMap<Role, RoleDetailDto>();
        }
    }
}
