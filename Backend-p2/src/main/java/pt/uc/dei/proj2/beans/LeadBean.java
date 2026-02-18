package pt.uc.dei.proj2.beans;


import jakarta.ejb.Stateless;
import jakarta.inject.Inject;
import pt.uc.dei.proj2.pojo.LeadPojo;
import pt.uc.dei.proj2.pojo.UserPojo;

import java.io.Serializable;
import java.util.List;

@Stateless
public class LeadBean implements Serializable {

    @Inject
    StorageBean storageBean;

    // Gerar ID

    private int generateLeadId(UserPojo user) {

        int max = 0;

        for (LeadPojo l : user.getMeusLeads()) {
            if (l.getId() > max) {
                max = l.getId();
            }
        }

        return max + 1;

    }

    // Criar Lead

    public LeadPojo createLead(String username, String title, String description, int state) {

        UserPojo user = findUser(username);

        if (user == null) return null;

        LeadPojo leadPojo = new LeadPojo();

        leadPojo.setId(generateLeadId(user));
        leadPojo.setTitulo(title);
        leadPojo.setDescricao(description);
        leadPojo.setEstado(state);

        user.getMeusLeads().add(leadPojo);

        return leadPojo;
    }

    // Listar Leads

    public List<LeadPojo> getLeads(String username) {

        UserPojo user = storageBean.findUser(username);

        if (user == null) return null;

        return user.getMeusLeads();
    }

    // Editar Lead

    public LeadPojo updateLead(String username, int id, String title, String description, int state) {

        UserPojo user = storageBean.findUser(username);

        if (user == null) return null;

        for (LeadPojo l : user.getMeusLeads()) {
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

        return user.getMeusLeads().removeIf(l -> l.getId() == id);
    }


}
