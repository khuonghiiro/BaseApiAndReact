using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EPS.Identity.Migrations
{
    /// <inheritdoc />
    public partial class EditColumn_PassWordResetRequest_04062024 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PasswordResetRequest_Users_UserAgreeId",
                table: "PasswordResetRequest");

            migrationBuilder.AlterColumn<int>(
                name: "UserAgreeId",
                table: "PasswordResetRequest",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_PasswordResetRequest_Users_UserAgreeId",
                table: "PasswordResetRequest",
                column: "UserAgreeId",
                principalTable: "Users",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PasswordResetRequest_Users_UserAgreeId",
                table: "PasswordResetRequest");

            migrationBuilder.AlterColumn<int>(
                name: "UserAgreeId",
                table: "PasswordResetRequest",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_PasswordResetRequest_Users_UserAgreeId",
                table: "PasswordResetRequest",
                column: "UserAgreeId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
