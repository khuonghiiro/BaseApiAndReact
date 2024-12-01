using AutoMapper;
using EPS.Identity.BaseExt;
using EPS.Identity.Repositories.Interface; using EPS.Identity.Pages;
namespace EPS.Identity.Services
{
    public class CommonService : BaseService
    {
        public CommonService(ICommonRepository repository, IMapper mapper)
       : base(repository, mapper)
        {
        }

    }
}
