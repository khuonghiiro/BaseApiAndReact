using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EPS.Identity.Migrations
{
    /// <inheritdoc />
    public partial class CreateTable_GroupTourGuideANdNode_24072024 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "GroupTourGuide",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    EdgeIds = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Name = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    KeyName = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    GroupIds = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ListNodes = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ListEdges = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    DeletedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DeletedUserId = table.Column<int>(type: "int", nullable: true),
                    LastUpdatedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    LastUpdatedUserId = table.Column<int>(type: "int", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedUserId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GroupTourGuide", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "TourGuideNode",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    NodeId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    KeyDiagram = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ClassOrId = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Content = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PositionX = table.Column<double>(type: "float", nullable: true),
                    PositionY = table.Column<double>(type: "float", nullable: true),
                    StepIndex = table.Column<int>(type: "int", nullable: true),
                    attachment = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TextHtml = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsClickElem = table.Column<bool>(type: "bit", nullable: false),
                    IsShow = table.Column<bool>(type: "bit", nullable: false),
                    DeletedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DeletedUserId = table.Column<int>(type: "int", nullable: true),
                    LastUpdatedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    LastUpdatedUserId = table.Column<int>(type: "int", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedUserId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TourGuideNode", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "GroupTourGuide");

            migrationBuilder.DropTable(
                name: "TourGuideNode");
        }
    }
}
