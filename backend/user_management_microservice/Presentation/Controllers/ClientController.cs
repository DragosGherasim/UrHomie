using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using user_management_microservice.Application.DTOs.Client;
using user_management_microservice.Application.Mappers;
using user_management_microservice.Application.Services.Interfaces;

namespace user_management_microservice.Presentation.Controllers;

[ApiController]
[Route("user-management/client")]
public class ClientController(
    ILogger<ClientController> logger,
    IClientService clientService) : ControllerBase
{
    [HttpGet("{id:long}")]
    [Authorize(Policy = "SameClientOnly")]
    [ProducesResponseType(typeof(ClientDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetClientById([FromRoute] long id)
    {
        logger.LogInformation("Attempting to fetch client with ID: {ClientId}", id);

        var client = await clientService.GetClientAsync(id);

        if (client == null)
        {
            logger.LogWarning("Client with ID {Id} not found.", id);
            return NotFound();
        }

        logger.LogInformation("Client with ID {ClientId} successfully retrieved.", id);

        var clientDto = ClientMapper.ClientToDto(client);
        return Ok(clientDto);
    }
}