package pt.uc.dei.proj2.service;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import pt.uc.dei.proj2.beans.ClientBean;
import pt.uc.dei.proj2.dto.ClientDto;
import pt.uc.dei.proj2.pojo.ClientPojo;
import java.util.List;

@Path("/clientes")
public class ClientService {

    @Inject
    private ClientBean clientBean;

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response addCliente(@HeaderParam("username") String username, ClientDto clienteDto) {

        // 1. Verificação de Autenticação (como fazes no login/register)
        if (username == null || username.isEmpty()) {
            return Response.status(401).entity("Utilizador não autenticado").build();
        }

        // Validação básica de campos obrigatórios do DTO
        if (clienteDto.getNome() == null || clienteDto.getEmpresa() == null) {
            return Response.status(400).entity("Dados incompletos: Nome e Empresa são obrigatórios").build();
        }

        try {
            // 2. Tenta registar (o Bean vai validar duplicados Nome+Empresa e gerar o ID)
            ClientPojo novo = clientBean.registarCliente(clienteDto, username);

            // Retorna 201 Created com o objeto criado
            return Response.status(201).entity(novo).build();

        } catch (Exception e) {
            // 3. Se o Bean lançar exceção (ex: cliente já existe), retorna 409 Conflict
            return Response.status(409).entity(e.getMessage()).build();
        }
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getClientes(@HeaderParam("username") String username) {

        if (username == null || username.isEmpty()) {
            return Response.status(401).entity("Acesso negado").build();
        }

        // Retorna a lista de clientes do utilizador logado
        List<ClientPojo> clientes = clientBean.listClients(username);
        return Response.status(200).entity(clientes).build();
    }
}