using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Options;

namespace EPS.Identity.Authorize
{

    public class CustomAuthorizationPolicyProvider : IAuthorizationPolicyProvider
    {
        public DefaultAuthorizationPolicyProvider FallbackPolicyProvider { get; }

        public CustomAuthorizationPolicyProvider(IOptions<AuthorizationOptions> options)
        {
            FallbackPolicyProvider = new DefaultAuthorizationPolicyProvider(options);
        }

        public Task<AuthorizationPolicy> GetDefaultPolicyAsync()
        {
            return FallbackPolicyProvider.GetDefaultPolicyAsync();
        }

        public Task<AuthorizationPolicy> GetPolicyAsync(string policyName)
        {
            if (policyName.StartsWith("adminonly"))
            {
                AuthorizationPolicyBuilder authorizationPolicyBuilder = new AuthorizationPolicyBuilder();
                bool adminOnly = Convert.ToBoolean(policyName.Substring(10));
                authorizationPolicyBuilder.AddRequirements(new CustomAuthorizationRequirement(adminOnly));
                return Task.FromResult(authorizationPolicyBuilder.Build());
            }

            if (policyName.StartsWith("privileges"))
            {
                AuthorizationPolicyBuilder authorizationPolicyBuilder2 = new AuthorizationPolicyBuilder();
                string[] privileges = policyName.Substring(11).Split(",").ToArray();
                authorizationPolicyBuilder2.AddRequirements(new CustomAuthorizationRequirement(privileges));
                return Task.FromResult(authorizationPolicyBuilder2.Build());
            }

            return FallbackPolicyProvider.GetPolicyAsync(policyName);
        }

        public Task<AuthorizationPolicy> GetFallbackPolicyAsync()
        {
            return FallbackPolicyProvider.GetFallbackPolicyAsync();
        }
    }
}
