using EPS.Identity.BaseExt.Interface;
using EPS.Identity.BaseExt;
using EPS.Identity.Data.Entities;
using EPS.Identity.Repositories.Interface; using EPS.Identity.Pages; using EPS.Identity.Authorize;
using EPS.Identity.Repositories;
using Microsoft.EntityFrameworkCore;
using Abp.Runtime.Session;
using Microsoft.AspNetCore.Authorization;

namespace EPS.Identity.Services
{
    public static class ServiceExtensions
    {
        /// <summary>
        /// Đăng ký các base hỗ trợ 
        /// </summary>
        /// <param name="services"></param>
        public static void AddCustomScopedServices(this IServiceCollection services)
        {
            // Đăng ký AutoMapper
            // AutoMapper sẽ tự động tìm và đăng ký tất cả các lớp kế thừa từ Profile trong các assembly được tải 
            services.AddAutoMapper(typeof(CommonService));

            // Đăng ký các service
            services.AddScoped(typeof(ICommonRepository), typeof(CommonRepository<EPS.Identity.Data.Entities.DataDbContext, EPS.Identity.Data.Entities.User, long>));
            services.AddScoped<IBaseService, BaseService>();
            services.AddScoped<CommonService>();
        }
    }


    public static class ApplicationBuilderExtensions
    {
        public static void RegisterDependencyBase(this IServiceCollection services)
        {
            services.AddSingleton<IAuthorizationHandler, CustomAuthorizationHandler>();
            services.AddSingleton<IAppSession, HttpAppSession>();
            services.AddSingleton<IDataHostedService, DataHostedService>();
            services.AddSingleton<IAuthorizationPolicyProvider, CustomAuthorizationPolicyProvider>();
            services.AddTransient(typeof(Lazy<>), typeof(Lazier<>));
            services.AddHttpContextAccessor();
            services.AddScoped((IServiceProvider s) => s.GetService<IHttpContextAccessor>().HttpContext.User);
            services.AddHostedService<DataHostedService>();
            services.AddScoped<IUserIdentity<int>, UserIdentity>();
            services.AddTransient<IDataHttpClient, DataHttpClient>();
        }

        public static IApplicationBuilder UseHttpAppSession(this IApplicationBuilder builder)
        {
            builder.UseMiddleware<HttpAppSessionMiddleware>(Array.Empty<object>());
            return builder;
        }
    }
}
