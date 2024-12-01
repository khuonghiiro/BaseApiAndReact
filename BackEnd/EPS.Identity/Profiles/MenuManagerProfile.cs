using AutoMapper;
using EPS.Identity.Data.Entities;
using EPS.Identity.Dtos.MenuManager;

namespace EPS.Identity.Profiles
{
    public class MenuManagerDtoToEntity : Profile
    {
        public MenuManagerDtoToEntity()
        {
            CreateMap<MenuManagerCreateDto, MenuManager>();
            CreateMap<MenuManagerUpdateDto, MenuManager>();
        }
    }

    public class MenuManagerEntityToDto : Profile
    {
        public MenuManagerEntityToDto()
        {
            CreateMap<MenuManager, MenuManagerGridDto>()
                .ForMember(dest => dest.Parent, mo => mo.MapFrom(src => src.Parent.Title));
            CreateMap<MenuManager, MenuManagerDetailDto>()
                .ForMember(dest => dest.Parent, mo => mo.MapFrom(src => src.Parent.Title));
            CreateMap<MenuManager, MenuManagerTreeGridDto>()
               .ForMember(dest => dest.CountChild, mo => mo.MapFrom(src => src.Childrens.Count()));
        }
    }
}
