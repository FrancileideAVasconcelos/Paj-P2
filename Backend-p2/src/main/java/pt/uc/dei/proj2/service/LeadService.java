package pt.uc.dei.proj2.service;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import pt.uc.dei.proj2.beans.UserBean;
import pt.uc.dei.proj2.pojo.LeadPojo;

@Path("/users/{username}/leads")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)

public class LeadService {

    @Inject
    UserBean userBean;

    // =============================
    // LISTAR
    // =============================
    @GET
    public Response getLeads(@PathParam("username") String username,
                             @HeaderParam("password") String password) {

        if (!userBean.login(username, password)) {
            return Response.status(401).build();
        }

        return Response.ok(userBean.getLeads(username)).build();
    }

    // =============================
    // CRIAR
    // =============================
    @POST
    public Response createLead(@PathParam("username") String username,
                               @HeaderParam("password") String password,
                               LeadPojo dto) {

        if (!userBean.login(username, password)) {
            return Response.status(401).build();
        }

        LeadPojo leadPojo = userBean.createLead(
                username,
                dto.getTitulo(),
                dto.getDescricao(),
                dto.getEstado()
        );

        return Response.status(201).entity(leadPojo).build();

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