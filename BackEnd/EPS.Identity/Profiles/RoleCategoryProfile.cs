using AutoMapper;
using EPS.Identity.Dtos.RoleCategory;
using EPS.Identity.Data.Entities;
namespace EPS.Identity.Profiles
{
    public class RoleCategoryDtoToEntity : Profile
    {
        public RoleCategoryDtoToEntity()
        {
            CreateMap<RoleCategoryGridDto, RoleCategory>();
            CreateMap<RoleCategoryCreateDto, RoleCategory>();
              CreateMap<RoleCategoryUpdateDto, RoleCategory>();
        }
    }
    public class RoleCategoryEntityToDto : Profile
    {
        public RoleCategoryEntityToDto()
        {
            CreateMap<RoleCategory, RoleCategoryDetailDto>();
            CreateMap<RoleCategory, RoleCategoryGridDto>();
            CreateMap<RoleCategory, RoleCategoryTreeGridDto>()
                .ForMember(dest => dest.Children, mo => mo.MapFrom(src => src.ParentId_Childs))
                .ForMember(dest => dest.LstRole, mo => mo.MapFrom(src => src.Role_CategoryIds));
            CreateMap<RoleCategory, RoleCategoryCreateDto>();
              CreateMap<RoleCategory, RoleCategoryUpdateDto>();
        }
    }
}
