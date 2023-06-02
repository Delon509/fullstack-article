package delon.cheung.realworld.backend.controller;

import delon.cheung.realworld.backend.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping(produces = "application/json;charset=UTF-8")
public class ProfileController {
    @Autowired
    ProfileService profileService;
    @Autowired
    UserController userController;
    @GetMapping("/profiles/{username}")
    public ResponseEntity<Object> getUserProfile(@PathVariable String username){
        return  ResponseEntity.status(HttpStatus.OK).body(profileService.getProfile(username, userController.getCurrentUserEmail()));
    }
    @PostMapping("/profiles/{username}/follow")
    public ResponseEntity<Object> followUser(@PathVariable String username){
        return  ResponseEntity.status(HttpStatus.OK).body(profileService.follow(username, userController.getCurrentUserEmail()));
    }
    @DeleteMapping("/profiles/{username}/follow")
    public ResponseEntity<Object> unfollowUser(@PathVariable String username){
        return  ResponseEntity.status(HttpStatus.OK).body(profileService.unfollow(username, userController.getCurrentUserEmail()));
    }
}
