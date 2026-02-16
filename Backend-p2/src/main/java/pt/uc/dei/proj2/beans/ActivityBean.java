package pt.uc.dei.proj2.beans;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.json.bind.Jsonb;
import jakarta.json.bind.JsonbBuilder;
import jakarta.json.bind.JsonbConfig;
import pt.uc.dei.proj2.dto.ActivityDto;
import pt.uc.dei.proj2.pojo.UserPojo;

import java.io.*;
import java.util.ArrayList;

@ApplicationScoped
public class ActivityBean implements Serializable {

    final String filename = "activities.json";
    private ArrayList<ActivityDto> activities;
    private ArrayList<UserPojo> userPojos;

    public ActivityBean() {
        File f = new File(filename);
        if(f.exists()){
            try {
                FileReader filereader = new FileReader(f);
                activities = JsonbBuilder.create().fromJson(filereader, new ArrayList<ActivityDto>() {}.getClass().getGenericSuperclass());
            } catch (FileNotFoundException e) {
                throw new RuntimeException(e);
            }

        }else
            activities = new ArrayList<ActivityDto>();

        userPojos = new ArrayList<UserPojo>();
    }

    public void addActivity(ActivityDto a) {
        activities.add(a);
        writeIntoJsonFile();
    }

    public ActivityDto getActivity(int i) {
        for (ActivityDto a : activities) {
            if (a.getId() == i)
                return a;
        }
        return null;
    }

    public ArrayList<ActivityDto> getActivities() {
        return activities;
    }

    public boolean remoreActivity(int id) {
        for (ActivityDto a : activities) {
            if (a.getId() == id) {
                activities.remove(a);
                return true;
            }

        }
        return false;
    }

    public boolean updateActivity(int id, ActivityDto activityDto) {
        for (ActivityDto a : activities) {
            if (a.getId() == id) {
                a.setTitle(activityDto.getTitle());
                a.setDescription(activityDto.getDescription());

                writeIntoJsonFile();

                return true;
            }

        }
        return false;
    }

    private void writeIntoJsonFile(){
        Jsonb jsonb =  JsonbBuilder.create(new JsonbConfig().withFormatting(true));
        try {
            jsonb.toJson(activities, new FileOutputStream(filename));
        } catch (FileNotFoundException e) {
            throw new RuntimeException(e);
        }
    }

    public UserPojo getUser(String username, String password){
        for(UserPojo u: userPojos){
            if(u.getUsername().equals(username) && u.getPassword().equals(password))
                return u;
        }
        return null;
    }

    public void addUser(UserPojo u) {
        userPojos.add(u);
    }
}
