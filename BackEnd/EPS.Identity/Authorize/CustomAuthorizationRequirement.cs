using Microsoft.AspNetCore.Authorization;

namespace EPS.Identity.Authorize
{

    public class CustomAuthorizationRequirement : IAuthorizationRequirement
    {
        public string[] Privileges { get; private set; }

        public bool AdminOnly { get; private set; }

        public CustomAuthorizationRequirement(bool adminOnly)
        {
            AdminOnly = adminOnly;
        }

        public CustomAuthorizationRequirement(params string[] privileges)
        {
            Privileges = privileges;
        }
    }
}
