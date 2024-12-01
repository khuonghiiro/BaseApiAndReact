using Microsoft.AspNetCore.DataProtection.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace EPS.Identity.Data.Entities
{
    // lưu trữ và quản lý các khóa bảo vệ dữ liệu một cách an toàn trong cơ sở dữ liệu, 
    // hỗ trợ tính năng bảo mật và bảo vệ dữ liệu cho ứng dụng ASP.NET Core
    // Install-Package Microsoft.AspNetCore.DataProtection.EntityFrameworkCore -Version x.x.x 
    // (x.x.x là phiên bản khớp với .net đang dùng, ví dụ: .net6.0 => 6.0.0)
    public class DataDbContext : DbContext, IDataProtectionKeyContext
    {
        public DataDbContext()
        {
        }

        public DataDbContext(DbContextOptions<DataDbContext> options)
            : base(options)
        {
        }

        // Bảng DataProtectionKeys trong cơ sở dữ liệu, nơi chứa các khóa bảo vệ dữ liệu
        public virtual DbSet<DataProtectionKey> DataProtectionKeys { get; set; }

        public virtual DbSet<EPS.Identity.Data.Entities.FileUpload> FileUploads { get; set; }
        public virtual DbSet<EPS.Identity.Data.Entities.Group> Groups { get; set; }
        public virtual DbSet<EPS.Identity.Data.Entities.GroupRolePermission> GroupRolePermissions { get; set; }
        public virtual DbSet<EPS.Identity.Data.Entities.GroupUser> GroupUsers { get; set; }
        public virtual DbSet<EPS.Identity.Data.Entities.IdentityClient> IdentityClients { get; set; }
        public virtual DbSet<EPS.Identity.Data.Entities.IdentityRefreshToken> IdentityRefreshTokens { get; set; }
        public virtual DbSet<EPS.Identity.Data.Entities.MenuManager> MenuManagers { get; set; }
        public virtual DbSet<EPS.Identity.Data.Entities.Permission> Permissions { get; set; }
        public virtual DbSet<EPS.Identity.Data.Entities.Role> Roles { get; set; }
        public virtual DbSet<EPS.Identity.Data.Entities.RoleCategory> RoleCategories { get; set; }
        public virtual DbSet<EPS.Identity.Data.Entities.User> Users { get; set; }
        public virtual DbSet<EPS.Identity.Data.Entities.UserDetail> UserDetails { get; set; }
        public virtual DbSet<EPS.Identity.Data.Entities.PasswordResetRequest> PasswordResetRequests { get; set; }
        public virtual DbSet<EPS.Identity.Data.Entities.GroupTourGuide> GroupTourGuides { get; set; }
        public virtual DbSet<EPS.Identity.Data.Entities.TourGuideNode> TourGuideNodes { get; set; }

        //{KhongXoaDoanCommentNay}

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            #region Cấu hình để nhận ánh xạ tên, ví dụ: User => Users
            var mutableProperties = modelBuilder.Model.GetEntityTypes()
            .SelectMany(e => e.GetProperties().Where(p => p.ClrType == typeof(string)));

            modelBuilder.ApplyConfigurationsFromAssembly(typeof(DataDbContext).Assembly);
            base.OnModelCreating(modelBuilder);
            #endregion
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseSqlServer("Server=localhost;Database=QLDGNS;Trusted_Connection=True;TrustServerCertificate=True;");
            }
        }
    }
}
