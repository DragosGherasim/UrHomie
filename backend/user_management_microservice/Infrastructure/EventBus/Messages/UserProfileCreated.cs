namespace user_management_microservice.Infrastructure.EventBus.Messages;

public class UserProfileCreated
{
    public Guid CorrelationId { get; set; }
}