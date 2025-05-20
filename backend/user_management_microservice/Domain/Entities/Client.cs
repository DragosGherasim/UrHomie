namespace user_management_microservice.Domain.Entities;

public partial class Client
{
    public long Id { get; set; }

    public long UserProfileId { get; set; }

    public virtual UserProfile UserProfile { get; set; } = null!;
}
