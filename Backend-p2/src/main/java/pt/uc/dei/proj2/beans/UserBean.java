package pt.uc.dei.proj2.beans;


import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import pt.uc.dei.proj2.dto.UserDto;
import pt.uc.dei.proj2.pojo.UserPojo;

import java.io.Serializable;

@RequestScoped
public class UserBean implements Serializable {

    @Inject
    StorageBean storageBean;

    @Inject
    LoginBean loginBean;

    public boolean login(String username, String password){
        UserPojo u = storageBean.findUser(username);
        if (u != null && u.getPassword().equals(password)) {
            loginBean.setCurrentUser(u);
            return true;
        }
        return false;
    }

    public boolean register(UserPojo newUser) {
        // 1. Verificar se o utilizador já existe no storage
        UserPojo existing = storageBean.findUser(newUser.getUsername());
        if (existing != null) return false;

        // 2. Adicionar ao storage e gravar no ficheiro JSON
        storageBean.addUser(newUser);
        return true;
    }

    public UserDto getLoggeduser(){
        UserPojo u = loginBean.getCurrentUser();
        if(u!= null)
            return converUserPojoToUserDto(u);
        else return null;
    }

    public UserPojo findUser(String username) {
        return storageBean.findUser(username);
    }

    public void updateUser(String username, UserPojo newData){
        storageBean.updateUserData(username, newData);
    }

    private UserDto converUserPojoToUserDto(UserPojo up){
        UserDto ud = new UserDto(up.getUsername(), up.getPassword());
        return ud;
    }

}
