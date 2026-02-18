package pt.uc.dei.proj2.beans;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.json.bind.Jsonb;
import jakarta.json.bind.JsonbBuilder;
import jakarta.json.bind.JsonbConfig;
import pt.uc.dei.proj2.pojo.UserPojo;

import java.io.*;
import java.util.ArrayList;
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
        if (f.exists()) {
            try (FileReader reader = new FileReader(f)) {
                this.root = JsonbBuilder.create().fromJson(reader, Root.class);
            } catch (Exception e) {
                this.root = new Root();
            }
        } else {
            this.root = new Root();
        }
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
        if (u != null) {
            u.setPrimeiroNome(newData.getPrimeiroNome());
            u.setUltimoNome(newData.getUltimoNome());
            u.setEmail(newData.getEmail());
            u.setTelefone(newData.getTelefone());
            u.setFotoUrl(newData.getFotoUrl());
            u.setPassword(newData.getPassword()); // O enunciado permite editar a pass
            save(); // Grava no JSON único [cite: 237]
        }
    }

    

}