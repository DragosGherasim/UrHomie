using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using user_management_microservice.Application.DTOs.Client;
using user_management_microservice.Application.Mappers;
using user_management_microservice.Application.Services.Interfaces;
using user_management_microservice.Utils;

namespace user_management_microservice.Presentation.Controllers;

[ApiController]
[Route("user-management/client")]
public class ClientController(
    ILogger<ClientController> logger,
    IClientService clientService) : ControllerBase
{
    [HttpGet("{id:long}")]
    [ProducesResponseType(typeof(ClientDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetClientById([FromRoute] long id)
    {
        logger.LogInformation("GET request received for client with ID {ClientId}", id);

        try
        {
            var client = await clientService.GetClientAsync(id);

            if (client == null)
            {
                logger.LogWarning("GET failed: Client with ID {ClientId} not found", id);
                return NotFound();
            }

            var clientDto = ClientMapper.ClientToDto(client);

            logger.LogInformation("GET succeeded: Client with ID {ClientId} retrieved successfully", id);
            return Ok(clientDto);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "GET failed for client with ID {ClientId}: {Error}", id, ex.Message);
            return StatusCode(StatusCodes.Status500InternalServerError, "An unexpected error occurred.");
        }
    }

    [HttpPatch("{id:long}")]
    [Authorize(Policy = "SameClientOnly")]
    [ProducesResponseType(typeof(ClientDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> PatchClient([FromRoute] long id, [FromBody] UpdateClientDto dto)
    {
        logger.LogInformation("PATCH request received for client with ID {ClientId}", id);

        var hasAtLeastOne = dto.HasAtLeastOnePopulatedField();

        if (!ModelState.IsValid || !hasAtLeastOne)
        {
            var errors = ModelState.ToErrorDictionary();

            if (!hasAtLeastOne)
                errors.TryAdd("general", ["At least one field must be provided."]);

            return UnprocessableEntity(new { errors = (Dictionary<string, string[]>)errors });
        }

        try
        {
            var updatedClient = await clientService.UpdateClientAsync(id, dto);

            if (updatedClient == null)
            {
                logger.LogWarning("PATCH failed: Client with ID {ClientId} not found", id);
                return NotFound();
            }

            var dtoResult = ClientMapper.ClientToDto(updatedClient);

            logger.LogInformation("PATCH succeeded: Client with ID {ClientId} updated", id);
            return Ok(dtoResult);
        }
        catch (DbUpdateException dbEx) when (dbEx.IsUniqueConstraintViolation())
        {
            logger.LogWarning(dbEx, "PATCH conflict: unique constraint violation for client ID {ClientId}", id);

            return Conflict(new
            {
                errors = new Dictionary<string, string[]>
                {
                    { "PhoneNumber", ["Phone number already in use."] }
                }
            });
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "PATCH failed for client with ID {ClientId}: {Error}", id, ex.Message);
            return StatusCode(StatusCodes.Status500InternalServerError, "An unexpected error occurred.");
        }
    }
}