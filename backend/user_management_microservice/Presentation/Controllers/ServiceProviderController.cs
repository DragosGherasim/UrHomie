using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using user_management_microservice.Application.DTOs.ServiceProvider;
using user_management_microservice.Application.Mappers;
using user_management_microservice.Application.Services.Interfaces;

namespace user_management_microservice.Presentation.Controllers;

[ApiController]
[Route("user-management/service-provider")]
public class ServiceProviderController(
    ILogger<ServiceProviderController> logger,
    IServiceProviderService serviceProviderService) : ControllerBase
{
    [HttpGet("{id:long}")]
    [Authorize(Policy = "SameServiceProviderOnly")]
    [ProducesResponseType(typeof(ServiceProviderDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetServiceProviderById([FromRoute] long id)
    {
        logger.LogInformation("Attempting to fetch service provider with ID: {ServiceProvider}", id);

        var serviceProvider = await serviceProviderService.GetServiceProviderAsync(id);

        if (serviceProvider == null)
        {
            logger.LogWarning("Service provider with ID {Id} not found.", id);
            return NotFound();
        }

        logger.LogInformation("Service provider with ID {ServiceProviderId} successfully retrieved.", id);

        var serviceProviderDto = ServiceProviderMapper.ServiceProviderToDto(serviceProvider);
        return Ok(serviceProviderDto);
    }
}