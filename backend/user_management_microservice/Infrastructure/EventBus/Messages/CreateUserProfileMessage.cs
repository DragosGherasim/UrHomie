using user_management_microservice.Infrastructure.EventBus.Messages.Data;

namespace user_management_microservice.Infrastructure.EventBus.Messages;

public class CreateUserProfileMessage
{
    
    public long UserId { get; set; }
    public string Email { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string PhoneNumber { get; set; }
    public string Country { get; set; }
    public string City { get; set; }
    public string Address { get; set; }

    public ClientData? Client { get; set; }
    public ServiceProviderData? ServiceProvider { get; set; }
}