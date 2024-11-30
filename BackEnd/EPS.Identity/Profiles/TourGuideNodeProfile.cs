using AutoMapper;
using EPS.Identity.Dtos.TourGuideNode;
using EPS.Identity.Data;
namespace EPS.Identity.Profiles
{
    public class TourGuideNodeDtoToEntity : Profile
    {
        public TourGuideNodeDtoToEntity()
        {
            CreateMap<TourGuideNodeCreateDto, TourGuideNode>();
              CreateMap<TourGuideNodeUpdateDto, TourGuideNode>();
        }
    }
    public class TourGuideNodeEntityToDto : Profile
    {
        public TourGuideNodeEntityToDto()
        {
            CreateMap<TourGuideNode, TourGuideNodeDetailDto>();
            CreateMap<TourGuideNode, TourGuideNodeGridDto>();
        }
    }
}
