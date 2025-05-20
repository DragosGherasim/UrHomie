namespace user_management_microservice.Domain.Entities;

public partial class ServiceProvider
{
    public long Id { get; set; }

    public long UserProfileId { get; set; }

    public string Education { get; set; } = null!;

    public string Certifications { get; set; } = null!;

    public string ExperienceDescriptions { get; set; } = null!;

    public string WorkSchedule { get; set; } = null!;

    public sbyte CoverageArea { get; set; }

    public virtual UserProfile UserProfile { get; set; } = null!;
}
