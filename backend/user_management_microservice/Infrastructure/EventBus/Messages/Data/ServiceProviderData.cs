namespace user_management_microservice.Infrastructure.EventBus.Messages.Data;

public class ServiceProviderData
{
    public string Education { get; set; }
    public string Certifications { get; set; }
    public string ExperienceDescription { get; set; }
    public string WorkSchedule { get; set; }
    public sbyte CoverageArea { get; set; }
    public List<sbyte> CategoryIds { get; set; }
}