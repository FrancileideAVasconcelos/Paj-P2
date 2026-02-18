package pt.uc.dei.proj2.beans;


import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import pt.uc.dei.proj2.dto.UserDto;
import pt.uc.dei.proj2.pojo.Lead;
import pt.uc.dei.proj2.pojo.UserPojo;

import java.io.Serializable;
import java.util.List;

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

    // ----LEADS-----

    // Gerar ID

    private int generateLeadId(UserPojo user) {

        int max = 0;

        for (Lead l : user.getLeadList()) {
            if (l.getId() > max) {
                max = l.getId();
            }
        }

        return max + 1;

    }

    // Criar Lead

    public Lead createLead(String username, String title, String description, int state) {

        UserPojo user = findUser(username);

        if (user == null) return null;

        Lead lead = new Lead();

        lead.setId(generateLeadId(user));
        lead.setTitulo(title);
        lead.setDescricao(description);
        lead.setEstado(state);

        user.getLeadList().add(lead);

        return lead;
    }

    // Listar Leads

    public List<Lead> getLeads(String username) {

        UserPojo user = findUser(username);

        if (user == null) return null;

        return user.getLeadList();
    }

    // Editar Lead

    public Lead updateLead(String username, int id, String title, String description, int state) {

        UserPojo user = findUser(username);

        if (user == null) return null;

        for (Lead l : user.getLeadList()) {
            if (l.getId() == id) {

                l.setTitulo(title);
                l.setDescricao(description);
                l.setEstado(state);

                return l;
            }
        }

        return null;
    }

    // Apagar Lead

    public boolean deleteLead(String username, int id) {

        UserPojo user = findUser(username);

        if (user == null) return false;

        return user.getLeadList().removeIf(l -> l.getId() == id);
    }


}
