using EPS.Identity.Data.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace EPS.Identity.Data.Helpers
{
    public class DbInitializer
    {
        public static void Initialize(IServiceProvider serviceProvider)
        {
            using var serviceScope = serviceProvider.CreateScope();
            //var jWTServices = serviceScope.ServiceProvider.GetService<IJWTServices>();
            //jWTServices.GetService();
            var context = serviceScope.ServiceProvider.GetService<DataDbContext>();

            //context.Database.Migrate();

            //if (!context.IdentityClients.Any())
            //{
            //    var sql = File.ReadAllText(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "units.sql"));
            //    context.Database.ExecuteSqlRaw(sql);
            //    context.IdentityClients.Add(new IdentityClient()
            //    {
            //        IdentityClientId = "EPS",
            //        Description = "EPS",
            //        SecretKey = "b0udcdl8k80cqiyt63uq",
            //        ClientType = 0,
            //        IsActive = true,
            //        RefreshTokenLifetime = 30,
            //        AllowedOrigin = "*"
            //    });

            //    context.SaveChanges();

            //    var passwordHasher = new PasswordHasher<User>();
            //    var adminUser = new User
            //    {
            //        UserName = "admin",
            //        Email = "admin@gmail.com",
            //        NormalizedEmail = "admin@gmail.com",
            //        FullName = "Quản trị hệ thống",
            //        NormalizedUserName = "admin",
            //        EmailConfirmed = true,
            //        SecurityStamp = Guid.NewGuid().ToString("D"),
            //        //UnitId = 1,
            //        Status = 2,
            //        CreatedDate = DateTime.Now,
            //        ModifiedDate = DateTime.Now,
            //        IsAdministrator = true,
            //        GroupUsers = new List<GroupUser>(),
            //        UserDetails = new List<UserDetail>()
            //    };

            //    adminUser.PasswordHash = passwordHasher.HashPassword(adminUser, "123456a@");
            //    context.Users.Add(adminUser);
            //    context.SaveChanges();
            //    adminUser.GroupUsers.Add(new GroupUser() { GroupId = 1, UserId = 1 });
            //    context.SaveChanges();
            //    adminUser.UserDetails.Add(new UserDetail { UserId = 1, Address = "Hà Nội", Email = "admin@gmail.com", Avatar = "123", Sex = 1, Phone = "0987654321" });
            //    context.SaveChanges();
            //}

        }
    }
}
