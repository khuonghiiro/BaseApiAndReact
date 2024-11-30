using System;
using System.Collections.Generic;
using System.Text;
using AutoMapper;
using EPS.Data.Entities;
using System.Linq;
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
