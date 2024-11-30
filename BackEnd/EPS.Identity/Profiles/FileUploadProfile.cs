
using AutoMapper;
using EPS.Identity.Dtos.FileUpload;
using EPS.Identity.Data.Entities;

namespace EPS.Service.Profiles
{
    public class FileUploadDtoToEntity : Profile
    {
        public FileUploadDtoToEntity()
        {
            CreateMap<FileUploadCreateDto, FileUpload>();
            CreateMap<FileUploadUpdateDto, FileUpload>();           
        }
    }

    public class FileUploadEntityToDto : Profile
    {
        public FileUploadEntityToDto()
        {
            CreateMap<FileUpload, FileUploadCreateDto > ();
            CreateMap<FileUpload, FileUploadUpdateDto> ();
            CreateMap<FileUpload, FileUploadGridDto>();
            CreateMap<FileUpload, FileUploadDetailDto>();
        }
    }
}
