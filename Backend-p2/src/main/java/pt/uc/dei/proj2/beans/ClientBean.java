package pt.uc.dei.proj2.beans;


import jakarta.ejb.Stateless;
import jakarta.inject.Inject;
import pt.uc.dei.proj2.dto.ClientDto;
import pt.uc.dei.proj2.dto.UserDto;
import pt.uc.dei.proj2.pojo.ClientPojo;
import pt.uc.dei.proj2.pojo.UserPojo;

import java.io.Serializable;
import java.util.List;

@Stateless
public class ClientBean implements Serializable {

    @Inject
    StorageBean storageBean;

    @Inject
    public Boolean registarCliente(ClientDto novoCliente, String usernameDono) throws Exception {

        boolean clienteExiste = existeClienteGlobal(novoCliente.getNome(),novoCliente.getEmpresa());

        if (clienteExiste){
            return false;
        }

        // Chama o método genérico do StorageBean para obter o ID
        // Passamos a lista de todos os clientes do sistema e a regra para ler o ID
        List<ClientPojo> todosNoSistema = storageBean.getUsers().stream()
                .flatMap(u -> u.getMeusClientes().stream())
                .toList();

        int proximoId = storageBean.generateNextId(todosNoSistema, ClientPojo::getId);
        novoCliente.setId(proximoId);

        storageBean.addCliente(novoCliente, usernameDono);
        return true;
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


}
