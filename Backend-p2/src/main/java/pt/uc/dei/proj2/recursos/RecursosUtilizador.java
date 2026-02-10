package pt.uc.dei.proj2.recursos;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.core.Response;

@Path("/test")
public class RecursosUtilizador {

    @GET
    public Response test() {
        return Response.ok("API a funcionar").build();
    }
}
