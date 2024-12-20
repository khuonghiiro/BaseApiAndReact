using EPS.Identity.Data.Enums;
using Microsoft.AspNetCore.Authorization;

namespace EPS.Identity.Authorize
{
    
public class BaseAuthorize : AuthorizeAttribute
{
    public BaseAuthorize(bool adminOnly)
    {
        base.Policy = "adminonly=" + adminOnly;
    }

    public BaseAuthorize(params PrivilegeListEnum[] privileges)
    {
        base.Policy = "privileges=" + string.Join(",", privileges.Select((PrivilegeListEnum x) => x.ToString()));
    }

    public BaseAuthorize(string objectCode, params PrivilegeListEnum[] privileges)
    {
        string objectCode2 = objectCode;

        base.Policy = "privileges=" + string.Join(",", privileges.Select(delegate (PrivilegeListEnum x)
        {
            string text = objectCode2;
            object obj;
            if (x <= (PrivilegeListEnum)9)
            {
                int num = (int)x;
                obj = "0" + num;
            }
            else
            {
                int num = (int)x;
                obj = num.ToString() ?? "";
            }

            return text + "-" + (string?)obj;
        }));
    }

    public BaseAuthorize(string objectCode, bool isAll)
    {
        string objectCode2 = objectCode;

        List<PrivilegeListEnum> list = new List<PrivilegeListEnum>();
        if (isAll)
        {
            list.Add(PrivilegeListEnum.Add);
            list.Add(PrivilegeListEnum.Approved);
            list.Add(PrivilegeListEnum.Delete);
            list.Add(PrivilegeListEnum.Edit);
            list.Add(PrivilegeListEnum.Permission);
        }

        base.Policy = "privileges=" + string.Join(",", list.Select(delegate (PrivilegeListEnum x)
        {
            string text = objectCode2;
            object obj;
            if (x <= (PrivilegeListEnum)9)
            {
                int num = (int)x;
                obj = "0" + num;
            }
            else
            {
                int num = (int)x;
                obj = num.ToString() ?? "";
            }

            return text + "-" + (string?)obj;
        }));
    }
}
}
