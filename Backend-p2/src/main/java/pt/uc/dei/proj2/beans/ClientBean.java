package pt.uc.dei.proj2.beans;


import jakarta.ejb.Stateless;
import jakarta.inject.Inject;
import pt.uc.dei.proj2.dto.ClientDto;
import pt.uc.dei.proj2.dto.UserDto;
import pt.uc.dei.proj2.pojo.ClientPojo;
import pt.uc.dei.proj2.pojo.UserPojo;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@Stateless
public class ClientBean implements Serializable {

    @Inject
    StorageBean storageBean;

    public ClientPojo registarCliente(ClientDto newClient, String usernameDono) throws Exception {

        if (existeClienteGlobal(newClient.getNome(),newClient.getEmpresa())){
            throw new Exception("Este cliente já está registado nesta empresa por outro utilizador.");
        }

        // Chama o método genérico do StorageBean para obter o ID
        // Passamos a lista de todos os clientes do sistema e a regra para ler o ID
        List<ClientPojo> todosClientes = storageBean.findUser(usernameDono).getMeusClientes();

        int nextId = storageBean.generateNextId(todosClientes, ClientPojo::getId);

        ClientPojo finalClient = new ClientPojo();

        finalClient.setId(nextId);
        finalClient.setNome(newClient.getNome());
        finalClient.setEmail(newClient.getEmail());
        finalClient.setTelefone(newClient.getTelefone());
        finalClient.setEmpresa(newClient.getEmpresa());
        finalClient.setDono(usernameDono);

        storageBean.addCliente(finalClient, usernameDono);

        return finalClient;
    }

    public boolean existeClienteGlobal(String nome, String empresa) {
        List<UserPojo> todosUsers = storageBean.getUsers();

        // Percorre todos os utilizadores e as suas listas internas de clientes
        for (UserPojo u : todosUsers) {
            for (ClientPojo c : u.getMeusClientes()) {
                if (c.getNome().equalsIgnoreCase(nome) && c.getEmpresa().equalsIgnoreCase(empresa)) {
                    return true; // Encontrou duplicado em algum utilizador
                }
            }
        }
        return false;
    }

    public List<ClientPojo> listClients(String username) {
        UserPojo user = storageBean.findUser(username);
        return (user != null) ? user.getMeusClientes() : new ArrayList<>();
    }

}
