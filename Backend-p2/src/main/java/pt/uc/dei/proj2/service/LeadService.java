package pt.uc.dei.proj2.service;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import pt.uc.dei.proj2.beans.LeadBean;
import pt.uc.dei.proj2.beans.StorageBean;
import pt.uc.dei.proj2.beans.UserBean;
import pt.uc.dei.proj2.dto.ClientDto;
import pt.uc.dei.proj2.dto.LeadDto;
import pt.uc.dei.proj2.pojo.ClientPojo;
import pt.uc.dei.proj2.pojo.LeadPojo;

import java.util.List;

@Path("/users/{username}/leads")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)

public class LeadService {

    @Inject
    LeadBean leadBean;

    // =============================
    // LISTAR
    // =============================
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getLeads(@HeaderParam("username") String username) {

        if (username == null || username.isEmpty()) {
            return Response.status(401).entity("Acesso negado").build();
        }

        // Retorna a lista de leads do utilizador logado
        List<LeadPojo> leads = leadBean.getLeads(username);
        return Response.status(200).entity(leads).build();
    }

    // =============================
    // CRIAR
    // =============================
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response addLead(@HeaderParam("username") String username, LeadDto leadDto) {

        // 1. Verificação de Autenticação (como fazes no login/register)
        if (username == null || username.isEmpty()) {
            return Response.status(401).entity("Utilizador não autenticado").build();
        }

        // Validação básica de campos obrigatórios do DTO
        if (leadDto.getTitulo() == null || leadDto.getDescricao() == null) {
            return Response.status(400).entity("Dados incompletos: Título e Descrição são obrigatórios").build();
        }

        try {
            // 2. Tenta registar (o Bean vai validar duplicados Nome+Empresa e gerar o ID)
            LeadPojo newLead = leadBean.createLead(username, leadDto);

            // Retorna 201 Created com o objeto criado
            return Response.status(201).entity(newLead).build();

        } catch (Exception e) {
            // 3. Se o Bean lançar exceção (ex: cliente já existe), retorna 409 Conflict
            return Response.status(409).entity(e.getMessage()).build();
        }
    }

    // =============================
    // EDITAR
    // =============================
    @PUT
    @Path("/{id}")
    public Response updateLead(@PathParam("username") String username,
                               @PathParam("id") int id,
                               @HeaderParam("password") String password,
                               LeadPojo dto) {

        if (!userBean.login(username, password)) {
            return Response.status(401).build();
        }

        LeadPojo leadPojo = userBean.updateLead(
                username,
                id,
                dto.getTitulo(),
                dto.getDescricao(),
                dto.getEstado()
        );

        if (leadPojo == null) {
            return Response.status(404).build();
        }

        return Response.ok(leadPojo).build();
    }

    // =============================
    // APAGAR
    // =============================
    @DELETE
    @Path("/{id}")
    public Response deleteLead(@PathParam("username") String username,
                               @PathParam("id") int id,
                               @HeaderParam("password") String password) {

        if (!userBean.login(username, password)) {
            return Response.status(401).build();
        }

        boolean removed = userBean.deleteLead(username, id);

        if (!removed) {
            return Response.status(404).build();
        }

        return Response.ok().build();
    }

}