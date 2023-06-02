package delon.cheung.realworld.backend.controller;

import delon.cheung.realworld.backend.service.ArticleService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping(produces = "application/json;charset=UTF-8")
public class ArticleController {
    @Autowired
    ArticleService articleService;
    @Autowired
    UserController userController;

    @GetMapping("/articles")
    public ResponseEntity<Object> listArticles(@RequestParam(value = "tag", defaultValue = "empty") String tag,
                                               @RequestParam(value = "author", defaultValue = "empty") String author,
                                               @RequestParam(value = "favourited", defaultValue = "empty") String favourited,
                                               @RequestParam(value = "limit", defaultValue = "10") int limit,
                                               @RequestParam(value = "offset", defaultValue = "0") int offset){
        return  ResponseEntity.status(HttpStatus.OK).body(articleService.listArticles(tag,author,favourited,limit,offset, userController.getCurrentUserEmail()));
    }
    @GetMapping("/articles/feed")
    public ResponseEntity<Object> feedArticles(@RequestParam(value = "limit", defaultValue = "10") int limit,
                                               @RequestParam(value = "offset", defaultValue = "0") int offset){
        return  ResponseEntity.status(HttpStatus.OK).body(articleService.feedArticles(limit,offset, userController.getCurrentUserEmail()));
    }
    @GetMapping("/articles/{slug}")
    public ResponseEntity<Object> getArticle(@PathVariable String slug){
        return  ResponseEntity.status(HttpStatus.OK).body(articleService.getArticle(slug, userController.getCurrentUserEmail()));
    }
    @PostMapping("/articles")
    public ResponseEntity<Object> createArticle(@RequestBody Map<String,Object> body){
        return  ResponseEntity.status(HttpStatus.OK).body(articleService.createArticle(body,userController.getCurrentUserEmail()));
    }
    @PutMapping("/articles/{slug}")
    public ResponseEntity<Object> updateArticle(@PathVariable String slug,@RequestBody Map<String,Object> body){
        return  ResponseEntity.status(HttpStatus.OK).body(articleService.updateArticle(slug, body,userController.getCurrentUserEmail()));
    }
    @DeleteMapping("/articles/{slug}")
    public ResponseEntity<Object> deleteArticle(@PathVariable String slug){
        return  ResponseEntity.status(HttpStatus.OK).body(articleService.deleteArticle(slug,userController.getCurrentUserEmail()));
    }
    @PostMapping("/articles/{slug}/comments")
    public ResponseEntity<Object> addComment(@PathVariable String slug,@RequestBody Map<String,Object> body){
        return  ResponseEntity.status(HttpStatus.OK).body(articleService.addCommentToArticle(slug,body,userController.getCurrentUserEmail()));
    }
    @GetMapping("/articles/{slug}/comments")
    public ResponseEntity<Object> getComments(@PathVariable String slug){
        return  ResponseEntity.status(HttpStatus.OK).body(articleService.getComments(slug,userController.getCurrentUserEmail()));
    }
    @DeleteMapping("/articles/{slug}/comments/{id}")
    public ResponseEntity<Object> deleteArticle(@PathVariable String slug,@PathVariable long id){
        return  ResponseEntity.status(HttpStatus.OK).body(articleService.deleteComment(slug,id,userController.getCurrentUserEmail()));
    }
    @PostMapping("/articles/{slug}/favorite")
    public ResponseEntity<Object> favoriteArticle(@PathVariable String slug){
        return  ResponseEntity.status(HttpStatus.OK).body(articleService.favorite(slug, userController.getCurrentUserEmail()));
    }
    @DeleteMapping("/articles/{slug}/favorite")
    public ResponseEntity<Object> unfavoriteArticle(@PathVariable String slug){
        return  ResponseEntity.status(HttpStatus.OK).body(articleService.unfavorite(slug, userController.getCurrentUserEmail()));
    }

}
