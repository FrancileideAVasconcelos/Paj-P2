package pt.uc.dei.proj2.beans;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.json.bind.Jsonb;
import jakarta.json.bind.JsonbBuilder;
import jakarta.json.bind.JsonbConfig;
import pt.uc.dei.proj2.pojo.ClientPojo;
import pt.uc.dei.proj2.pojo.LeadPojo;
import pt.uc.dei.proj2.pojo.UserPojo;

import java.io.*;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@ApplicationScoped
public class StorageBean implements Serializable {
    private final String filename = "C:\\Users\\House Vasconcelos\\Documents\\UC\\JAVA Avançado\\P2\\Paj-P2\\Backend-p2\\storage.json";
    private Root root; // Objeto que contém a lista "users" [cite: 241]

    //Para que o ficheiro tenha o formato {"users": [...]}, criamos essa classe interna
    public static class Root {
        public List<UserPojo> users = new ArrayList<>();
    }

    public StorageBean() {
        File f = new File(filename);

        if (!f.exists()) { // guard clause
            this.root = new Root();
            return;
        }

        try (FileReader reader = new FileReader(f)) {
            this.root = JsonbBuilder.create().fromJson(reader, Root.class);
            return;
        } catch (Exception e) {}

        this.root = new Root();
    }

    //<T>: Define que o método é genérico. Ele pode trabalhar com uma lista de UserPojo, ClientPojo ou qualquer outro objeto.
    //
    //Collection<T> items: É a lista onde vamos procurar o maior ID.
    //
    //ToIntFunction<T> idExtractor: É uma regra que diz ao método qual campo deve ser lido como ID (ex: UserPojo::getId ou ClientePojo::getId).
    public <T> int generateNextId(Collection<T> items, java.util.function.ToIntFunction<T> idExtractor) {
        return items.stream() //Transforma a lista em um fluxo de dados para que possamos processar um por um de forma funcional.
                .mapToInt(idExtractor) //Ele entra em cada objeto da lista e extrai apenas o valor do ID
                .max() //Percorre todos esses números e encontra o maior valor existente.
                .orElse(0) + 1; //Se a lista estiver vazia, ele assume que o maior ID atual é 0 e incrementa 1
    }

    public List<UserPojo> getUsers() {
        // Retorna a lista de utilizadores contida no objeto root
        if (this.root == null) {
            return new ArrayList<>();
        }
        return this.root.users;
    }

    public void save() {
        Jsonb jsonb = JsonbBuilder.create(new JsonbConfig().withFormatting(true));
        try (FileOutputStream out = new FileOutputStream(filename)) {
            jsonb.toJson(this.root, out);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public UserPojo findUser(String username) {
        return root.users.stream()
                .filter(u -> u.getUsername().equals(username))
                .findFirst()
                .orElse(null);
    }

    public void addUser(UserPojo u) {
        root.users.add(u);
        save();
    }

    public void updateUserData(String username, UserPojo newData) {
        UserPojo u = findUser(username);

        if (u == null)
            return;

        u.setPrimeiroNome(newData.getPrimeiroNome());
        u.setUltimoNome(newData.getUltimoNome());
        u.setEmail(newData.getEmail());
        u.setTelefone(newData.getTelefone());
        u.setFotoUrl(newData.getFotoUrl());
        u.setPassword(newData.getPassword()); // O enunciado permite editar a pass
        save(); // Grava no JSON único [cite: 237]
    }

    // ---------------- Clientes -----------------


    public void addCliente(ClientPojo cliente, String username) {
        UserPojo user = findUser(username);

        if (user != null) {
            user.getMeusClientes().add(cliente); // Adiciona na lista aninhada
        }
        save(); // Guarda a estrutura completa de volta no ficheiro
    }

    // --------------- Leads ----------------

    public void addLeads(LeadPojo lead, String username){
        UserPojo user = findUser(username);

            if (user != null){
                user.getMeusLeads().add(lead);
            }
            save();
    }


}


