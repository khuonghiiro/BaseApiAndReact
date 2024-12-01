using AutoMapper;
using EPS.Identity.Data.Entities;
using EPS.Identity.Dtos.PasswordResetRequest;
namespace EPS.Identity.Profiles
{
    public class PasswordResetRequestDtoToEntity : Profile
    {
        public PasswordResetRequestDtoToEntity()
        {
            CreateMap<PasswordResetRequestCreateDto, PasswordResetRequest>();
            CreateMap<PasswordResetRequestUpdateDto, PasswordResetRequest>();
        }
    }
    public class PasswordResetRequestEntityToDto : Profile
    {
        public PasswordResetRequestEntityToDto()
        {
            CreateMap<PasswordResetRequest, PasswordResetRequestDetailDto>();
            CreateMap<PasswordResetRequest, PasswordResetRequestGridDto>();
        }
    }
}
