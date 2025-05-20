dotnet ef dbcontext scaffold \
  "Server=localhost;Database=user-management;User=user-management-manager;Password=manager-pass;Port=3307;" \
      Pomelo.EntityFrameworkCore.MySql \
      --project ../../../../user_management_microservice.csproj \
      --context UserManagementDbContext \
      --context-dir Infrastructure/Persistence/Context \
      --output-dir Domain/Entities \
      --namespace user_management_microservice.Domain.Entities.Generated \
      --context-namespace user_management_microservice.Infrastructure.Persistence.Context \
      --no-onconfiguring \
      --force
