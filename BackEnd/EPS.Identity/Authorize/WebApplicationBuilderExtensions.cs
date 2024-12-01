using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
namespace EPS.Identity.Authorize
{

    public static class WebApplicationBuilderExtensions
    {
        public static WebApplicationBuilder AddAppAuthetication(this WebApplicationBuilder builder)
        {
            IConfigurationSection section = builder.Configuration.GetSection("JWT");
            string value = section.GetValue<string>("Secret");
            string issuer = section.GetValue<string>("ValidIssuer");
            string audience = section.GetValue<string>("ValidAudience");
            byte[] key = Encoding.ASCII.GetBytes(value);
            JwtBearerExtensions.AddJwtBearer(builder.Services.AddAuthentication(delegate (AuthenticationOptions x)
            {
                x.DefaultAuthenticateScheme = "Bearer";
                x.DefaultChallengeScheme = "Bearer";
                x.DefaultScheme = "Bearer";
            }), (Action<JwtBearerOptions>)delegate (JwtBearerOptions x)
            {
                x.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = true,
                    ValidIssuer = issuer,
                    ValidAudience = audience,
                    ValidateAudience = true
                };
            });
            //builder.Services.AddScoped<SolrServices<SolrLogs>>();
            //ServiceCollectionExtensions.AddSolrNet<SolrLogs>(builder.Services, builder.Configuration.GetConnectionString("URLSolrLog"), (Action<SolrNetOptions>)null);
            return builder;
        }
    }
}
