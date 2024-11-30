using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EPS.Identity.Migrations
{
    /// <inheritdoc />
    public partial class AddTable_PassWordResetRequest_04062024 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "PasswordResetRequest",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    status = table.Column<int>(type: "int", nullable: false),
                    UserAgreeId = table.Column<int>(type: "int", nullable: false),
                    DeletedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DeletedUserId = table.Column<int>(type: "int", nullable: true),
                    LastUpdatedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    LastUpdatedUserId = table.Column<int>(type: "int", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedUserId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PasswordResetRequest", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PasswordResetRequest_Users_UserAgreeId",
                        column: x => x.UserAgreeId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.NoAction);
                    table.ForeignKey(
                        name: "FK_PasswordResetRequest_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.NoAction);
                });

            migrationBuilder.CreateIndex(
                name: "IX_PasswordResetRequest_UserAgreeId",
                table: "PasswordResetRequest",
                column: "UserAgreeId");

            migrationBuilder.CreateIndex(
                name: "IX_PasswordResetRequest_UserId",
                table: "PasswordResetRequest",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PasswordResetRequest");
        }
    }
}
