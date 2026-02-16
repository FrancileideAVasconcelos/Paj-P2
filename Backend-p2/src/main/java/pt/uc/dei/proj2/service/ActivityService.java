package pt.uc.dei.proj2.service;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import pt.uc.dei.proj2.beans.ActivityBean;
import pt.uc.dei.proj2.dto.ActivityDto;

import java.util.List;


@Path("/activity")
public class ActivityService {
	
	@Inject
	ActivityBean activityBean;
	
	@GET
	@Path("/all")
	@Produces(MediaType.APPLICATION_JSON)
	public List<ActivityDto> getActivities() {
		return activityBean.getActivities();
	}
	
	
	@POST
	@Path("/add")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response addActivity(ActivityDto a) {
		activityBean.addActivity(a);
		return Response.status(200).entity("A new activity is created").build();
		
	}
	
	@GET
	@Path("/{id}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getActivity(@PathParam("id")int id) {
		ActivityDto activityDto =  activityBean.getActivity(id);

		if (activityDto ==null)
			return Response.status(200).entity("Activity with this idea is not found").build();
		
		return Response.status(200).entity(activityDto).build();
			
	}
	
	@DELETE
	@Path("/delete")
	@Produces(MediaType.APPLICATION_JSON)
	public Response removeActivity(@QueryParam("id")int id) {
		boolean deleted =  activityBean.remoreActivity(id);

		if (!deleted)
			return Response.status(200).entity("Activity with this idea is not found").build();
		
		return Response.status(200).entity("deleted").build();
	}
	
	@PUT
	@Path("/update")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response updateActivity(ActivityDto a, @HeaderParam("id") int id) {
		boolean updated = activityBean.updateActivity(id, a);
		
		if (!updated)
			return Response.status(200).entity("Activity with this idea is not found").build();
		
		return Response.status(200).entity("updated").build();
	}
}
