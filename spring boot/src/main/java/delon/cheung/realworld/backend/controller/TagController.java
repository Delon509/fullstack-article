package delon.cheung.realworld.backend.controller;


import delon.cheung.realworld.backend.service.TagService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
@RestController
@RequiredArgsConstructor
@RequestMapping(produces = "application/json;charset=UTF-8")
public class TagController {
    @Autowired
    UserController userController;
    @Autowired
    TagService tagService;

    @GetMapping("/tags")
    public ResponseEntity<Object> getTags(){
        return  ResponseEntity.status(HttpStatus.OK).body(tagService.getAllTags());
    }
}
