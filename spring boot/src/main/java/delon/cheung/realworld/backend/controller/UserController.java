package delon.cheung.realworld.backend.controller;

import delon.cheung.realworld.backend.model.User;
import delon.cheung.realworld.backend.model.UserDetailsImpl;
import delon.cheung.realworld.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;


@RestController
@RequiredArgsConstructor
@RequestMapping(produces = "application/json;charset=UTF-8")
public class UserController {
    @Autowired
    private UserService userService;
    @Autowired
    UserDetailsService userDetailsService;


    @GetMapping("/users/home")
    public String test(){
        return "Home";
    }
    @PostMapping("/users/login")
    public ResponseEntity<Object> authentication(@RequestBody User user){

        return  ResponseEntity.status(HttpStatus.OK).body(userService.authenticate(user));
    }
    @PostMapping("/users")
    public ResponseEntity<Object> registration(@RequestBody User user){
        return  ResponseEntity.status(HttpStatus.OK).body(userService.registration(user));
    }
    @GetMapping("/user")
    public ResponseEntity<Object> getCurrentUserInfo(){
        return ResponseEntity.status(HttpStatus.OK).body(userService.getCurrentUserInfo(getCurrentUserEmail()));
    }
    @PutMapping("/user")
    public ResponseEntity<Object> updateUserInfo(@RequestBody Map<String,Object> body){
        return ResponseEntity.status(HttpStatus.OK).body(userService.updateCurrentUser(body,getCurrentUserEmail()));
    }
    @Bean
    public String getCurrentUserEmail(){
        if(SecurityContextHolder.getContext().getAuthentication() != null){

            Authentication temp =  SecurityContextHolder.getContext().getAuthentication();
            return temp.getName();
        }
        return "";
    }
}
