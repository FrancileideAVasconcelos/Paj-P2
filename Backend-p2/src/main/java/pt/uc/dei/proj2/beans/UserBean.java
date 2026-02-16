package pt.uc.dei.proj2.beans;


import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import pt.uc.dei.proj2.dto.UserDto;
import pt.uc.dei.proj2.pojo.UserPojo;

import java.io.Serializable;

@RequestScoped
public class UserBean implements Serializable {

    @Inject
    ActivityBean activityBean;

    @Inject
    LoginBean loginBean;

    public boolean login(String username, String password){
        UserPojo u = activityBean.getUser(username,password);
        if(u!= null){
            loginBean.setCurrentUser(u);
            return true;
        }
        else
            return false;
    }

    public boolean register(String username, String password){
        UserPojo u = activityBean.getUser(username, password);
        if (u==null){
            u= new UserPojo(username,password);
            activityBean.addUser(u);
            return true;
        }else
            return false;
    }

    public UserDto getLoggeduser(){
        UserPojo u = loginBean.getCurrentUser();
        if(u!= null)
            return converUserPojoToUserDto(u);
        else return null;
    }

    private UserDto converUserPojoToUserDto(UserPojo up){
        UserDto ud = new UserDto(up.getUsername(), up.getPassword());
        return ud;
    }

}
