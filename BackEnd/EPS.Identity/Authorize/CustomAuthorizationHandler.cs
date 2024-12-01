using EPS.Identity.Repositories;
using EPS.Identity.Repositories.Interface;
using Microsoft.AspNetCore.Authorization;

namespace EPS.Identity.Authorize
{

    public class CustomAuthorizationHandler : AuthorizationHandler<CustomAuthorizationRequirement>
    {
        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, CustomAuthorizationRequirement requirement)
        {
            CustomAuthorizationRequirement requirement2 = requirement;
            bool flag = true;
            if (!context.User.Identity.IsAuthenticated)
            {
                flag = false;
            }
            else
            {
                UserIdentity userIdentity = new UserIdentity(context.User);
                if (userIdentity.IsAdministrator)
                {
                    flag = true;
                }
                else if (requirement2.AdminOnly)
                {
                    flag = userIdentity.IsAdministrator;
                }
                else if (requirement2.Privileges.Any())
                {
                    flag = userIdentity.Privileges.Any((string x) => requirement2.Privileges.Contains(x));
                }
            }

            if (flag)
            {
                context.Succeed(requirement2);
            }

            return Task.CompletedTask;
        }
    }
}
