using Abp.Authorization;
using EPS.Data.Entities;
using EPS.Libary.Identity;
using Microsoft.AspNetCore.DataProtection.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System.Data;
using System.Text.RegularExpressions;

namespace EPS.Identity.Data.Entities
{
    public class EPSContext : DbContext, IDataProtectionKeyContext
    {
        public EPSContext()
        {
        }
        public EPSContext(DbContextOptions<EPSContext> options)
            : base(options)
        {
        }
        public virtual DbSet<DataProtectionKey> DataProtectionKeys { get; set; }
        public virtual DbSet<IdentityClient> IdentityClients { get; set; }
        public virtual DbSet<IdentityRefreshToken> IdentityRefreshTokens { get; set; }
        public virtual DbSet<Role> Roles { get; set; }
        public virtual DbSet<User> Users { get; set; }
        public virtual DbSet<UserDetail> UserDetail { get; set; }
        public virtual DbSet<Permission> Permission { get; set; }
        public virtual DbSet<Group> Group { get; set; }
        public virtual DbSet<GroupUser> GroupUser { get; set; }
        public virtual DbSet<GroupRolePermission> GroupRolePermission { get; set; }
        public virtual DbSet<RoleCategory> RoleCategory { get; set; }
        public virtual DbSet<MenuManager> MenuManager { get; set; }
        public virtual DbSet<FileUpload> FileUpload { get; set; }
        public virtual DbSet<PasswordResetRequest> PasswordResetRequest { get; set; }
        public virtual DbSet<GroupTourGuide> GroupTourGuide { get; set; }
        public virtual DbSet<TourGuideNode> TourGuideNode { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            var mutableProperties = modelBuilder.Model.GetEntityTypes()
                .SelectMany(e => e.GetProperties().Where(p => p.ClrType == typeof(string)));

            modelBuilder.ApplyConfigurationsFromAssembly(typeof(EPSContext).Assembly);
            base.OnModelCreating(modelBuilder);
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseSqlServer("Server = 10.0.0.85; Database = HELPDESK; User Id = sa; Password = Ab@123456; Encrypt=false; TrustServerCertificate=True");
            }
        }
    }
}
