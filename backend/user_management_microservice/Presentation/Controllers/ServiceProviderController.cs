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
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetServiceProviderById([FromRoute] long id)
    {
        logger.LogInformation("GET request received for service provider with ID {ServiceProviderId}", id);

        try
        {
            var serviceProvider = await serviceProviderService.GetServiceProviderAsync(id);

            if (serviceProvider == null)
            {
                logger.LogWarning("GET failed: Service provider with ID {ServiceProviderId} not found", id);
                return NotFound();
            }

            var dto = ServiceProviderMapper.ServiceProviderToDto(serviceProvider);
            logger.LogInformation("GET succeeded: Service provider with ID {ServiceProviderId} retrieved", id);
            return Ok(dto);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "GET failed for service provider with ID {ServiceProviderId}: {Error}", id, ex.Message);
            return StatusCode(StatusCodes.Status500InternalServerError, "An unexpected error occurred.");
        }
    }
    
    [HttpPatch("{id:long}")]
    [Authorize(Policy = "SameServiceProviderOnly")]
    [ProducesResponseType(typeof(ServiceProviderDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> PatchServiceProvider([FromRoute] long id, [FromBody] UpdateServiceProviderDto dto)
    {
        logger.LogInformation("PATCH request received for service provider with ID {ServiceProviderId}", id);

        try
        {
            var updated = await serviceProviderService.UpdateServiceProviderAsync(id, dto);
            if (updated == null)
            {
                logger.LogWarning("PATCH failed: Service provider with ID {ServiceProviderId} not found", id);
                return NotFound();
            }

            var resultDto = ServiceProviderMapper.ServiceProviderToDto(updated);
            logger.LogInformation("PATCH succeeded: Service provider with ID {ServiceProviderId} updated", id);
            return Ok(resultDto);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "PATCH failed for service provider with ID {ServiceProviderId}: {Error}", id, ex.Message);
            return StatusCode(StatusCodes.Status500InternalServerError, "An unexpected error occurred.");
        }
    }
}