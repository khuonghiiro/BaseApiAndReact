using EPS.Identity.Authorize;
using EPS.Identity.Data.Entities;
using EPS.Identity.Data.Helpers;
using EPS.Identity.Dtos;
using EPS.Identity.Services;
using Microsoft.EntityFrameworkCore;
using NLog;
using NLog.Web;
using System;
var logger = NLog.LogManager.Setup().LoadConfigurationFromAppSettings().GetCurrentClassLogger();
logger.Debug("init main");
try
{
    var builder = WebApplication.CreateBuilder(args);
    ConfigurationManager configuration = builder.Configuration;
    // Add services to the container.

    builder.Services.AddControllers();

    // NLog: Setup NLog for Dependency injection
    builder.Logging.ClearProviders();

    //builder.Services.AddDbContext<DataDbContext>(opt =>
    //{
    //    opt.UseLazyLoadingProxies().UseSqlServer(configuration.GetConnectionString("EPS"));

    //    opt.UseQueryTrackingBehavior(QueryTrackingBehavior.TrackAll);
    //});

    builder.Services.AddDbContext<DataDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("EPS")));


    builder.Services.RegisterDependencyBase(); // đăng ký base service
    builder.Services.AddCustomScopedServices();

    builder.Services.AddIdentityCore<User>(options =>
    {
        options.User.RequireUniqueEmail = false;
    }).AddEntityFrameworkStores<DataDbContext>();

    builder.Services.AddSingleton<EmailService>();
    builder.Services.AddScoped<AuthorizationService>();

    // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSwaggerGen();
    builder.AddAppAuthetication();
    builder.Services.Configure<Audience>(configuration.GetSection("JWT"));

    // Cấu hình session
    builder.Services.AddDistributedMemoryCache(); // Sử dụng in-memory cache để lưu session (có thể thay đổi nếu dùng Redis hoặc SQL Server)
    builder.Services.AddSession(options =>
    {
        options.IdleTimeout = TimeSpan.FromMinutes(30); // Thời gian sống của session
        options.Cookie.HttpOnly = true;
        options.Cookie.IsEssential = true;
    });

    var app = builder.Build();

    // Configure the HTTP request pipeline.
    app.UseSwagger();
    app.UseSwaggerUI();

    app.UseHttpsRedirection();
    app.UseSession(); // Đảm bảo UseSession() được gọi trước UseAuthentication và UseAuthorization
    app.UseAuthorization();
    app.UseHttpAppSession();

    app.MapControllers();
    DbInitializer.Initialize(app.Services);
    app.Run();
}
catch (Exception exception)
{
    // NLog: catch setup errors
    logger.Error(exception, "Stopped program because of exception");
    throw;
}
finally
{
    // Ensure to flush and stop internal timers/threads before application-exit (Avoid segmentation fault on Linux)
    NLog.LogManager.Shutdown();
}