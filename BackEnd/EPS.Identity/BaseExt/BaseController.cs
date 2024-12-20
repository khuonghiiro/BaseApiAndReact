using EPS.Identity.Repositories.Interface; using EPS.Identity.Pages; using EPS.Identity.Authorize;
using EPS.Identity.Services;
using Microsoft.AspNetCore.Mvc;

namespace EPS.Identity.BaseExt;

[ApiController]
public class BaseController : ControllerBase
{
    private Lazier<IUserIdentity<int>>? _userIdentity;

    //private Lazier<SolrServices<SolrLogs>> _solrLogServices;

    protected IUserIdentity<int> UserIdentity
    {
        get
        {
            if (_userIdentity == null)
            {
                _userIdentity = new Lazier<IUserIdentity<int>>(base.HttpContext.RequestServices);
            }

            return _userIdentity.Value;
        }
    }

    //protected SolrServices<SolrLogs> _SolrLogServices
    //{
    //    get
    //    {
    //        if (_solrLogServices == null)
    //        {
    //            _solrLogServices = new Lazier<SolrServices<SolrLogs>>(base.HttpContext.RequestServices);
    //        }

    //        return _solrLogServices.Value;
    //    }
    //}

    protected async Task AddLogAsync(string Content, string Object, int Action, int Status, int objectID = 0)
    {
        //string createdBy = ((!string.IsNullOrEmpty(UserIdentity.FullName)) ? (UserIdentity.FullName + " (" + UserIdentity.Username + ")") : "Người dùng ẩn danh");
        //int createdByID = ((!string.IsNullOrEmpty(UserIdentity.FullName)) ? UserIdentity.UserId : 0);
        //string remoteIpAddress = base.HttpContext.Connection.RemoteIpAddress.ToString();
        //await _SolrLogServices.AddItemAsync(new SolrLogs(Content, Object, remoteIpAddress, Action, Status, createdBy, createdByID, objectID));
    }
}