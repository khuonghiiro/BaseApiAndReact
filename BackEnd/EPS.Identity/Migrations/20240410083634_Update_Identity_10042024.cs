using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EPS.Identity.Migrations
{
    /// <inheritdoc />
    public partial class Update_Identity_10042024 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "DataProtectionKeys",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FriendlyName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Xml = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DataProtectionKeys", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "MenuManager",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Title = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: false),
                    Url = table.Column<string>(type: "nvarchar(3000)", maxLength: 3000, nullable: false),
                    Stt = table.Column<int>(type: "int", nullable: false),
                    Icon = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Groups = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    ParentId = table.Column<int>(type: "int", nullable: true),
                    IsBlank = table.Column<bool>(type: "bit", nullable: false),
                    IsShow = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MenuManager", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MenuManager_MenuManager_ParentId",
                        column: x => x.ParentId,
                        principalTable: "MenuManager",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_MenuManager_ParentId",
                table: "MenuManager",
                column: "ParentId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DataProtectionKeys");

            migrationBuilder.DropTable(
                name: "MenuManager");
        }
    }
}
