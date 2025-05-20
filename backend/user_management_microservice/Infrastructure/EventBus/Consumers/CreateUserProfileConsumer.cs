using MassTransit;
using Microsoft.EntityFrameworkCore;
using MySqlConnector;
using user_management_microservice.Application.Services.Interfaces;
using user_management_microservice.Infrastructure.EventBus.Messages;

namespace user_management_microservice.Infrastructure.EventBus.Consumers;

public class CreateUserProfileConsumer(
    IClientService clientService,
    IServiceProviderService serviceProviderService,
    IPublishEndpoint publishEndpoint,
    ILogger<CreateUserProfileConsumer> logger)
    : IConsumer<CreateUserProfileMessage>
{
    public async Task Consume(ConsumeContext<CreateUserProfileMessage> context)
    {
        var message = context.Message;

        logger.LogInformation("Received CreateUserProfileMessage for UserId={UserId} | CorrelationId={CorrelationId}",
            message.UserId, context.CorrelationId!.Value);

        try
        {
            if (message.Client is not null)
            {
                logger.LogInformation("Detected user as Client. Attempting to create...");

                var client = await clientService.AddClientAsync(message);

                if (client is not null)
                {
                    logger.LogInformation("Client successfully created for UserId={UserId}", message.UserId);

                    await publishEndpoint.Publish(new UserProfileCreated
                    {
                        CorrelationId = context.CorrelationId!.Value
                    });

                    logger.LogInformation("Published UserProfileCreated for UserId={UserId}", message.UserId);
                }
                else
                {
                    logger.LogWarning("Client creation returned null for UserId={UserId}", message.UserId);

                    await publishEndpoint.Publish(new UserProfileCreationFailed
                    {
                        CorrelationId = context.CorrelationId!.Value,
                        ErrorMessage = "Client could not be created"
                    });
                }
            }
            else if (message.ServiceProvider is not null)
            {
                logger.LogInformation("Detected user as ServiceProvider. Attempting to create...");

                var serviceProvider = await serviceProviderService.AddServiceProviderAsync(message);
                
                if (serviceProvider is not null)
                {
                    logger.LogInformation("Service Provider successfully created for UserId={UserId}", message.UserId);

                    await publishEndpoint.Publish(new UserProfileCreated
                    {
                        CorrelationId = context.CorrelationId!.Value
                    });

                    logger.LogInformation("Published UserProfileCreated for UserId={UserId}", message.UserId);
                }
                else
                {
                    logger.LogWarning("Service Provider creation returned null for UserId={UserId}", message.UserId);

                    await publishEndpoint.Publish(new UserProfileCreationFailed
                    {
                        CorrelationId = context.CorrelationId!.Value,
                        ErrorMessage = "Service Provider could not be created"
                    });
                }
            }
            else
            {
                logger.LogWarning("Invalid user type: neither client nor service provider.");
                
                await publishEndpoint.Publish(new UserProfileCreationFailed
                {
                    CorrelationId = context.CorrelationId!.Value,
                    ErrorMessage = "Invalid user type: neither client nor service provider."
                });
            }
        }
        catch (DbUpdateException dbEx) when (dbEx.InnerException is MySqlException sqlEx &&
                                             sqlEx.Message.Contains("Duplicate entry") &&
                                             sqlEx.Message.Contains("phone_number"))
        {
            logger.LogError(dbEx, "Phone number already in use for UserId={UserId}", message.UserId);

            await publishEndpoint.Publish(new UserProfileCreationFailed
            {
                CorrelationId = context.CorrelationId!.Value,
                ErrorMessage = "Phone number already in use"
            });
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error while processing CreateUserProfileMessage for UserId={UserId}", message.UserId);

            await publishEndpoint.Publish(new UserProfileCreationFailed
            {
                CorrelationId = context.CorrelationId!.Value,
                ErrorMessage = ex.Message
            });
        }
    }
}
