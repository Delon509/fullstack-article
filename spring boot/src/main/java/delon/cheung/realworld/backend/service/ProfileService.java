package delon.cheung.realworld.backend.service;

import delon.cheung.realworld.backend.model.Profile;
import delon.cheung.realworld.backend.model.User;
import delon.cheung.realworld.backend.repository.ProfileRepository;
import delon.cheung.realworld.backend.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProfileService {
    @Autowired
    UserRepository userRepository;
    @Autowired
    ProfileRepository profileRepository;

    public Object getProfile(String username, String currentUserEmail){
        System.out.println("getProfile function:");
        System.out.println("the value for currentUserEmail:"+ currentUserEmail);
        System.out.println("the value for username:"+ username);
        var targetUser = userRepository.findByUsername(username).orElseThrow(() ->new EntityNotFoundException("Username not exist"));
        //System.out.println("Found TargetUser");
        var targetProfile = profileRepository.findByUser(targetUser).orElseThrow(() ->new EntityNotFoundException("User profile not exist"));
        //System.out.println("Found TargetProfile");
        boolean following = false;
        //System.out.println("currentUserEmail is" + currentUserEmail);
        if(!currentUserEmail.equals("anonymousUser")){
            var currentUser = userRepository.findByEmail(currentUserEmail).orElseThrow(() ->new EntityNotFoundException("Current user not exist"));
            for(User temp : targetUser.getFollowers()){
                if(Objects.equals(temp.getId(), currentUser.getId())){
                    following = true;
                    break;
                }
            }
        }

        Map<String,Object> result = new HashMap<>();
        Map<String,String> profileMap = new HashMap<>();
        profileMap.put("username", username);
        profileMap.put("bio",targetProfile.getBio());
        profileMap.put("image",targetProfile.getImage());
        profileMap.put("following",String.valueOf(following));
        result.put("profile",profileMap);
        return result;

    }
    public Object follow(String username, String currentUserEmail){
        System.out.println("follow function:");
        System.out.println("the value for currentUserEmail:"+ currentUserEmail);
        System.out.println("the value for username:"+ username);
        var targetUser = userRepository.findByUsername(username).orElseThrow(() ->new EntityNotFoundException("Username not exist"));
        var currentUser = userRepository.findByEmail(currentUserEmail).orElseThrow(() ->new EntityNotFoundException("Current user not exist"));
        targetUser.addFollower(currentUser);
        userRepository.save(targetUser);
        userRepository.save(currentUser);
        var targetProfile = profileRepository.findByUser(targetUser).orElseThrow(() ->new EntityNotFoundException("User profile not exist"));
        Map<String,Object> result = new HashMap<>();
        Map<String,String> profileMap = new HashMap<>();
        profileMap.put("username", username);
        profileMap.put("bio",targetProfile.getBio());
        profileMap.put("image",targetProfile.getImage());
        profileMap.put("following","true");
        result.put("profile",profileMap);
        return result;
    }
    public Object unfollow(String username, String currentUserEmail){
        System.out.println("unfollow function:");
        System.out.println("the value for currentUserEmail:"+ currentUserEmail);
        System.out.println("the value for username:"+ username);
        var targetUser = userRepository.findByUsername(username).orElseThrow(() ->new EntityNotFoundException("Username not exist"));
        var currentUser = userRepository.findByEmail(currentUserEmail).orElseThrow(() ->new EntityNotFoundException("Current user not exist"));
        targetUser.deleteFollower(currentUser);
        userRepository.save(targetUser);
        userRepository.save(currentUser);
        var targetProfile = profileRepository.findByUser(targetUser).orElseThrow(() ->new EntityNotFoundException("User profile not exist"));
        Map<String,Object> result = new HashMap<>();
        Map<String,String> profileMap = new HashMap<>();
        profileMap.put("username", username);
        profileMap.put("bio",targetProfile.getBio());
        profileMap.put("image",targetProfile.getImage());
        profileMap.put("following","false");
        result.put("profile",profileMap);
        return result;
    }

    public boolean isUserFollowTarget(User targetUser, User currentUser){
        for(User temp : targetUser.getFollowers()){
            if(Objects.equals(temp.getId(), currentUser.getId())){
                return true;
            }
        }
        return false;
    }
}
