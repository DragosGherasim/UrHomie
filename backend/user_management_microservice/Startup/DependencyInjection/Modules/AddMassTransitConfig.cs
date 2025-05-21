using MassTransit;
using Microsoft.Extensions.Options;
using RabbitMQ.Client;
using user_management_microservice.Infrastructure.EventBus.Consumers;
using user_management_microservice.Infrastructure.EventBus.Messages;
using user_management_microservice.Startup.DependencyInjection.ConfigBindings;

namespace user_management_microservice.Startup.DependencyInjection.Modules;

public static class AddMassTransitConfig
{
    public static IServiceCollection AddRabbitMq(this IServiceCollection services, IConfiguration config)
    {
        services.AddMassTransit(x =>
        {
            x.AddConsumer<CreateUserProfileConsumer>();

            x.UsingRabbitMq((context, cfg) =>
            {
                var rabbitSettings = context.GetRequiredService<IOptions<RabbitMqSettings>>().Value;

                cfg.Host(rabbitSettings.Host, "/", h =>
                {
                    h.Username(rabbitSettings.Username);
                    h.Password(rabbitSettings.Password);
                });

                cfg.Message<CreateUserProfileMessage>(x => { x.SetEntityName("create_user_profile_event"); });

                cfg.ReceiveEndpoint("create_user_profile_queue", e =>
                {
                    e.ConfigureConsumer<CreateUserProfileConsumer>(context);
                    e.Bind("create_user_profile_event", x => { x.ExchangeType = ExchangeType.Fanout; });
                });

                cfg.Message<UserProfileCreated>(x => x.SetEntityName("user_profile_created_event"));
                cfg.Message<UserProfileCreationFailed>(x => x.SetEntityName("user_profile_failed_event"));

                cfg.Publish<UserProfileCreated>(x => x.ExchangeType = ExchangeType.Fanout);
                cfg.Publish<UserProfileCreationFailed>(x => x.ExchangeType = ExchangeType.Fanout);

                cfg.ConfigureEndpoints(context);
            });
        });

        return services;
    }
}