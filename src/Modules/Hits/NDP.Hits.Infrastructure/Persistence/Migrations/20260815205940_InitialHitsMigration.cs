using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NDP.Hits.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class InitialHitsMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "HitLogs",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    UserId = table.Column<int>(type: "INTEGER", nullable: true),
                    EntityName = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    EntityId = table.Column<int>(type: "INTEGER", nullable: false),
                    Hits = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HitLogs", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_HitLogs_UserId_EntityName_EntityId",
                table: "HitLogs",
                columns: new[] { "UserId", "EntityName", "EntityId" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "HitLogs");
        }
    }
}
