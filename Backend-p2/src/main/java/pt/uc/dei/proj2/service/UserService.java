package pt.uc.dei.proj2.service;

import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import pt.uc.dei.proj2.beans.ActivityBean;
import pt.uc.dei.proj2.beans.UserBean;
import pt.uc.dei.proj2.dto.UserDto;

@Path("/user")
public class UserService {


    @Inject
    UserBean userBean;

    @POST
    @Path("/login")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response login(UserDto user){
        if(userBean.login(user.getUsername(), user.getPassword())){
            return Response.status(200).entity("Login Successful!").build();
        }
        return Response.status(200).entity("Wrong Username or Password !").build();
    }
    
}
