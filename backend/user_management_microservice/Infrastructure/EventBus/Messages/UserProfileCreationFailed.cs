namespace user_management_microservice.Infrastructure.EventBus.Messages;

public class UserProfileCreationFailed
{
    public Guid CorrelationId { get; set; }
    public string ErrorMessage { get; set; }
}