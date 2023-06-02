package delon.cheung.realworld.backend.service;

import delon.cheung.realworld.backend.model.Profile;
import delon.cheung.realworld.backend.model.User;
import delon.cheung.realworld.backend.model.UserDetailsImpl;
import delon.cheung.realworld.backend.repository.ProfileRepository;
import delon.cheung.realworld.backend.repository.UserRepository;
import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.validation.ValidationException;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private JwtService jwtService;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private ProfileRepository profileRepository;

    public UserService(){}
    public Object  authenticate(User newUser) {
        System.out.println("Authenticate function:");
        if(newUser.getEmail().isBlank()){
            throw new ValidationException("email&Email can't be empty or null");
        }
        if(newUser.getPassword().isBlank()){
            throw new ValidationException("password&Password can't be empty or null");
        }
        System.out.println("authenticationManager start authenticate");
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        newUser.getEmail(),
                        newUser.getPassword()
                )
        );
        System.out.println("authenticationManager end authenticate");
        var user = userRepository.findByEmail(newUser.getEmail()).orElseThrow(() ->new EntityNotFoundException("User not exist"));
        var targetProfile = profileRepository.findByUser(user).orElseThrow(() ->new EntityNotFoundException("User profile not exist"));
        UserDetailsImpl temp = new UserDetailsImpl(user);
        var jwtToken = jwtService.generateToken(temp);
        Map<String,Object> result = new HashMap<>();
        Map<String,String> userMap = new HashMap<>();
        userMap.put("email", newUser.getEmail());
        userMap.put("token",jwtToken);
        userMap.put("username",user.getUsername());
        userMap.put("bio",targetProfile.getBio());
        userMap.put("image",targetProfile.getImage());
        result.put("user",userMap);
        return result;
    }
    public Object registration(User newUser){
        System.out.println("Registration function:");
        if(newUser.getUsername().isBlank()){
            throw new ValidationException("username&Username can't be empty or null");
        }
        if(newUser.getEmail().isBlank()){
            throw new ValidationException("email&Email can't be empty or null");
        }
        if(newUser.getPassword().isBlank()){
            throw new ValidationException("password&Password can't be empty or null");
        }
        if(userRepository.existsByUsername(newUser.getUsername())){
            throw new EntityExistsException("username&Username already exist");
        }
        if(userRepository.existsByEmail(newUser.getEmail())){
            throw new EntityExistsException("email&Email already exist");
        }
        Pattern pattern = Pattern.compile("^(.+)@(.+)$");
        Matcher matcher = pattern.matcher(newUser.getEmail());
        if(!matcher.matches()){
            throw new ValidationException("email&Email format incorrect");
        }

        newUser.setPassword(passwordEncoder.encode(newUser.getPassword()));
        Profile newProfile = new Profile();
        newProfile.setUser(newUser);
        newUser.setProfile(newProfile);
        profileRepository.save(newProfile);
        userRepository.save(newUser);
        Map<String,Object> result = new HashMap<>();
        Map<String,String> userMap = new HashMap<>();
        userMap.put("email", newUser.getEmail());
        userMap.put("username",newUser.getUsername());
        result.put("user",userMap);
        return result;
    }
    public Object getCurrentUserInfo(String email){
        System.out.println("getCurrentUserInfo function: param email is "+email);
        var user = userRepository.findByEmail(email).orElseThrow(() ->new EntityNotFoundException("User not exist"));
        Map<String,Object> result = new HashMap<>();
        Map<String,Object> userMap = new HashMap<>();
        Map<String,String> profileMap = new HashMap<>();
        userMap.put("email", user.getEmail());
        userMap.put("username",user.getUsername());

        profileMap.put("bio",user.getProfile().getBio());
        profileMap.put("image",user.getProfile().getImage());
        userMap.put("profile", profileMap);
        result.put("user",userMap);
        return result;
    }
    public Object updateCurrentUser(Map<String,Object> body,String email){
        System.out.println("UpdateCurrentUser function:");
        System.out.println("the value for email:"+ email);

        var currentUser = userRepository.findByEmail(email).orElseThrow(() ->new EntityNotFoundException("User not exist"));
        if(body.get("username").toString().isBlank()){
            throw new ValidationException("username&Username can't be empty or null");
        }
        if(body.get("email").toString().isBlank()){
            throw new ValidationException("email&Email can't be empty or null");
        }
        if(body.get("username")!=null){

            if(userRepository.existsByUsername(body.get("username").toString())&& !(currentUser.getUsername().equals(body.get("username").toString()))){
                throw new EntityExistsException("username&Username already exist");
            }
            currentUser.setUsername(body.get("username").toString());

        }
        if(body.get("email")!=null){

                if(userRepository.existsByEmail(body.get("email").toString())&& !(currentUser.getEmail().equals(body.get("email").toString()))){
                    throw new EntityExistsException("email&Email already exist");
                }
                currentUser.setEmail(body.get("email").toString());

        }

        if(body.get("password")!=null){
            if(!body.get("password").toString().isBlank()) {
                currentUser.setPassword(passwordEncoder.encode(body.get("password").toString()));
            }
        }
        Profile currentProfile = currentUser.getProfile();
        if(body.get("bio")!=null){
                currentProfile.setBio(body.get("bio").toString());
        }
        if(body.get("image")!=null){
                currentProfile.setImage(body.get("image").toString());
        }
        profileRepository.save(currentProfile);
        userRepository.save(currentUser);
        Map<String,Object> result = new HashMap<>();
        Map<String,Object> userMap = new HashMap<>();
        Map<String,String> profileMap = new HashMap<>();
        userMap.put("email", currentUser.getEmail());
        userMap.put("username",currentUser.getUsername());
        profileMap.put("bio",currentUser.getProfile().getBio());
        profileMap.put("image",currentUser.getProfile().getImage());
        userMap.put("profile", profileMap);
        result.put("user",userMap);
        return result;
    }
}
