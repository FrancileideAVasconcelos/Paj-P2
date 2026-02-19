package pt.uc.dei.proj2.beans;


import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import pt.uc.dei.proj2.dto.UserDto;
import pt.uc.dei.proj2.pojo.UserPojo;

import java.io.Serializable;
import java.util.List;

@RequestScoped
public class UserBean implements Serializable {

    @Inject
    StorageBean storageBean;

    public boolean login(String username, String password){
        UserPojo u = storageBean.findUser(username);
        if (u != null && u.getPassword().equals(password)) {
            return true;
        }
        return false;
    }

    @Inject
    public boolean register(UserPojo newUser) {
        // 1. Verificar se o utilizador já existe no storage
        UserPojo existing = storageBean.findUser(newUser.getUsername());
        if (existing != null) {
            return false;
        }

        //Gerar o ID único
        //lista total do storage e chama o método genérico
        List<UserPojo> users = storageBean.getUsers();

        int nextId = storageBean.generateNextId(users, UserPojo::getId);
        newUser.setId(nextId);

        // 2. Adicionar ao storage e gravar no ficheiro JSON
        storageBean.addUser(newUser);
        return true;
    }

    public UserPojo findUser(String username) {
        return storageBean.findUser(username);
    }

    public void updateUser(String username, UserPojo newData){
        storageBean.updateUserData(username, newData);
    }



}
