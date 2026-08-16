using System.Text;
using System.Threading.RateLimiting;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using NDP.Api.Data;
using NDP.Api.Middleware;
using NDP.Audits.Presentation;
using NDP.Books.Presentation;
using NDP.Hits.Presentation;
using NDP.Identity.Domain.Configuration;
using NDP.Identity.Presentation;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

// Serilog Configuration
Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .WriteTo.File("logs/ndp-.log", rollingInterval: RollingInterval.Day)
    .CreateLogger();

builder.Host.UseSerilog();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// Swagger Configuration
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo 
    { 
        Title = "NDP API", 
        Version = "v1",
        Description = "NDP Library Management System API"
    });
    
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: 'Bearer {token}'",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT"
    });
    
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") ?? "Data Source=ndp.db";

var jwtSettings = builder.Configuration.GetSection(JwtSettings.SectionName).Get<JwtSettings>();
var key = Encoding.UTF8.GetBytes(jwtSettings?.SecretKey ?? "default_secret_key_for_development_123456789");

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(key),
            ValidateIssuer = true,
            ValidIssuer = jwtSettings?.Issuer,
            ValidateAudience = true,
            ValidAudience = jwtSettings?.Audience,
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero
        };
    });

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("Administrator", policy => policy.RequireRole("Administrator"));
    options.AddPolicy("Manager", policy => policy.RequireRole("Manager"));
    options.AddPolicy("Operator", policy => policy.RequireRole("Operator"));
    options.AddPolicy("Member", policy => policy.RequireRole("Member"));
});

builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    
    options.AddPolicy("default", httpContext =>
        RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: httpContext.Connection.RemoteIpAddress?.ToString() ?? "anonymous",
            factory: _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = 60,
                Window = TimeSpan.FromMinutes(1),
                QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
                QueueLimit = 0
            }));
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

builder.Services.AddHttpContextAccessor();

builder.Services.AddBooksModule(builder.Configuration);
builder.Services.AddIdentityModule(builder.Configuration);
builder.Services.AddAuditsModule(builder.Configuration);
builder.Services.AddHitsModule(builder.Configuration);

var app = builder.Build();

// Swagger در root
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "NDP API V1");
    c.RoutePrefix = ""; // خالی - نمایش در root
});

app.MapGet("/", () => Results.Redirect("/swagger"));

app.UseMiddleware<ExceptionHandlingMiddleware>();

app.UseCors("AllowAll");

app.UseRateLimiter();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Database initialization with Seeder
try
{
    using var scope = app.Services.CreateScope();
    
    // ایجاد دیتابیس‌ها
    var booksDb = scope.ServiceProvider.GetRequiredService<NDP.Books.Infrastructure.Persistence.BooksDbContext>();
    booksDb.Database.EnsureCreated();
    
    var identityDb = scope.ServiceProvider.GetRequiredService<NDP.Identity.Infrastructure.Persistence.IdentityDbContext>();
    identityDb.Database.EnsureCreated();
    
    var auditsDb = scope.ServiceProvider.GetRequiredService<NDP.Audits.Infrastructure.Persistence.AuditsDbContext>();
    auditsDb.Database.EnsureCreated();
    
    var hitsDb = scope.ServiceProvider.GetRequiredService<NDP.Hits.Infrastructure.Persistence.HitsDbContext>();
    hitsDb.Database.EnsureCreated();
    
    Console.WriteLine("Database initialization completed.");
    Console.WriteLine("Running database seeder...");
    
    // اجرای DatabaseSeeder
    await DatabaseSeeder.SeedAsync(app.Services);
    
    Console.WriteLine("Database seeding completed.");
}
catch (Exception ex)
{
    Console.WriteLine($"Database initialization error: {ex.Message}");
    Console.WriteLine($"Stack trace: {ex.StackTrace}");
}

app.Run();
