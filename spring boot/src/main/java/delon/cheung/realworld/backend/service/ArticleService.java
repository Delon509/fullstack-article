package delon.cheung.realworld.backend.service;


import delon.cheung.realworld.backend.model.*;
import delon.cheung.realworld.backend.payload.ForbiddenException;
import delon.cheung.realworld.backend.repository.*;
import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import javax.validation.ValidationException;
import java.text.Normalizer;
import java.time.LocalDateTime;
import java.util.*;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class ArticleService {
    private static final Pattern NONLATIN = Pattern.compile("[^\\w-]");
    private static final Pattern WHITESPACE = Pattern.compile("[\\s]");
    @Autowired
    ArticleRepository articleRepository;

    @Autowired
    ProfileRepository profileRepository;
    @Autowired
    ProfileService profileService;
    @Autowired
    UserRepository userRepository;
    @Autowired
    TagRepository tagRepository;
    @Autowired
    CommentRepository commentRepository;

    public Object listArticles(String tag,String author,String favouritedBy,int limit,int offset, String currentUserEmail){
        System.out.println("listArticles function:");
        Map<String, Object> result = new HashMap<>();
        System.out.println("the value for tag:"+tag);
        System.out.println("the value for author:"+ author);
        System.out.println("the value for favouritedBy:"+ favouritedBy);
        System.out.println("the value for limit:"+ limit);
        System.out.println("the value for offset:"+ offset);
        Pageable pageable = PageRequest.of(offset/10, limit);
        Page<Article> resultFromSql = null;
        if(!tag.equals("empty")){
            resultFromSql = articleRepository.findArticlesByTag(tag,pageable);
        }
        else if(!author.equals("empty")){
            resultFromSql = articleRepository.findArticlesByAuthor(author,pageable);
        }else if(!favouritedBy.equals("empty")) {
            resultFromSql = articleRepository.findArticlesByFavouritedBy(favouritedBy,pageable);
        }
        else {
            resultFromSql = articleRepository.findAllArticles(pageable);
        }
        List<Map<String,Object>> articles = new ArrayList<>();
        if(!currentUserEmail.equals("anonymousUser")){
            //System.out.println("Find CurrentUser");
           var currentUser = userRepository.findByEmail(currentUserEmail).orElseThrow(() ->new EntityNotFoundException("Current user not exist"));
            for( Article temp : resultFromSql){
                //System.out.println("Find Owner Profile");
                var profile = profileRepository.findByUser(temp.getOwner()).orElseThrow(() ->new EntityNotFoundException("User profile not exist"));
                User target = temp.getOwner();
                boolean following = profileService.isUserFollowTarget(target,currentUser);
                boolean favorited = isUserLikeArticle(temp,currentUser);
                articles.add(articleToJSON(temp, target, profile,favorited,following));
            }
        }
        else {
            for( Article temp : resultFromSql){
                var profile = profileRepository.findByUser(temp.getOwner()).orElseThrow(() ->new EntityNotFoundException("User profile not exist"));
                User target = temp.getOwner();
                articles.add(articleToJSON(temp, target, profile,false,false));
            }
        }

        result.put("articles",articles);
        result.put("articlesCount",resultFromSql.getTotalElements());
        return result;
    }
    public Object feedArticles(int limit, int offset, String currentUserEmail){
        System.out.println("feedArticles function:");
        System.out.println("the value for currentUserEmail:"+ currentUserEmail);
        System.out.println("the value for limit:"+ limit);
        System.out.println("the value for offset:"+ offset);
        var currentUser = userRepository.findByEmail(currentUserEmail).orElseThrow(() ->new EntityNotFoundException("Current user not exist"));
        Pageable pageable = PageRequest.of(offset/10, limit);
        List<Long> followingIdList = new ArrayList<>();
        for(User temp : currentUser.getFollowing()){
            followingIdList.add(temp.getId());
        }
        Page<Article> resultFromSql = articleRepository.findArticlesByFollow(followingIdList,pageable);
        Map<String, Object> result = new HashMap<>();
        List<Map<String,Object>> articles = new ArrayList<>();
        for( Article temp : resultFromSql){
            var profile = profileRepository.findByUser(temp.getOwner()).orElseThrow(() ->new EntityNotFoundException("User profile not exist"));
            User target = temp.getOwner();
            boolean following = profileService.isUserFollowTarget(target,currentUser);
            boolean favorited = isUserLikeArticle(temp,currentUser);
            articles.add(articleToJSON(temp, target, profile,favorited,following));
        }
        result.put("articles",articles);
        result.put("articlesCount",resultFromSql.getTotalElements());
        return result;
    }

    public Object getArticle(String slug, String currentUserEmail){
        System.out.println("getArticles function:");
        System.out.println("the value for currentUserEmail:"+ currentUserEmail);
        System.out.println("the value for slug:"+ slug);
        if(slug.isBlank()){
            throw new ValidationException("slug&Slug can't be empty or null");
        }
        var currentArticle = articleRepository.findBySlug(slug).orElseThrow(() ->new EntityNotFoundException("slug not exist"));
        var profile = profileRepository.findByUser(currentArticle.getOwner()).orElseThrow(() ->new EntityNotFoundException("User profile not exist"));
        User target = currentArticle.getOwner();
        boolean following = false;
        boolean favorited = false;
        if(!currentUserEmail.equals("anonymousUser")){
            var currentUser = userRepository.findByEmail(currentUserEmail).orElseThrow(() ->new EntityNotFoundException("Current user not exist"));
            following = profileService.isUserFollowTarget(target,currentUser);
            favorited = isUserLikeArticle(currentArticle,currentUser);
        }
        Map<String, Object> result = new HashMap<>();
        result.put("article",articleToJSON(currentArticle,target,profile,favorited,following));
        return result;
    }

    public Object createArticle(Map<String,Object> body,String currentUserEmail){
        System.out.println("createArticles function:");
        System.out.println("the value for currentUserEmail:"+ currentUserEmail);
        Article newArticle = new Article();
        if(body.get("title")== null){
            throw new ValidationException("title&Title field must be provided");
        }
        if(body.get("title").toString().isBlank()){
            throw new ValidationException("title&Title can't be empty or null");
        }
        String slug = titleToSlug(body.get("title").toString());
        if(articleRepository.existsBySlug(slug)){
            throw new EntityExistsException("slug&Slug already exist");
        }
        newArticle.setTitle(body.get("title").toString());
        newArticle.setSlug(slug);
        if(body.get("description")== null){
            throw new ValidationException("description&Description field must be provided");
        }
        if(body.get("description").toString().isBlank()){
            throw new ValidationException("description&Description can't be empty or null");
        }
        newArticle.setDescription(body.get("description").toString());
        if(body.get("body")== null){
            throw new ValidationException("body&Body field must be provided");
        }
        if(body.get("body").toString().isBlank()){
            throw new ValidationException("body&Body can't be empty or null");
        }
        newArticle.setBody(body.get("body").toString());
        if(body.get("tagList")!=null){
            List<String> providedTagList = convertObjectToList(body.get("tagList"));

            ListIterator<String> iterator = providedTagList.listIterator();
            while (iterator.hasNext())
            {
                iterator.set(iterator.next().toLowerCase().trim());
            }
            for(String temp : providedTagList){
                if(!temp.trim().isBlank()) {
                    var tag = tagRepository.findByName(temp).orElse(null);
                    if (tag == null) {
                        tag = new Tag();
                        tag.setName(temp);
                    }
                    newArticle.addTag(tag);
                    tagRepository.save(tag);
                }
            }
        }
        var currentUser = userRepository.findByEmail(currentUserEmail).orElseThrow(() ->new EntityNotFoundException("Current user not exist"));
        var profile = profileRepository.findByUser(currentUser).orElseThrow(() ->new EntityNotFoundException("User profile not exist"));
        newArticle.setOwner(currentUser);
        newArticle.setCreatedAt(LocalDateTime.now());
        newArticle.setUpdatedAt(LocalDateTime.now());
        articleRepository.save(newArticle);
        Map<String, Object> result = new HashMap<>();
        result.put("article",articleToJSON(newArticle,currentUser,profile,false,false));
        return result;
    }

    public Object updateArticle(String oldSlug,Map<String,Object> body,String currentUserEmail) {
        System.out.println("updateArticles function:");
        System.out.println("the value for currentUserEmail:"+ currentUserEmail);
        System.out.println("the value for oldSlug:"+ oldSlug);
        var currentUser = userRepository.findByEmail(currentUserEmail).orElseThrow(() ->new EntityNotFoundException("User not exist"));
        var currentArticle = articleRepository.findBySlug(oldSlug).orElseThrow(() ->new EntityNotFoundException("slug not exist"));
        if(!Objects.equals(currentArticle.getOwner().getId(), currentUser.getId())){
            throw new ForbiddenException("updateArticle&User cannot update article because user are not the owner of that article");
        }
        if(body.get("title")!=null){
            if(body.get("title").toString().isBlank()){
                throw new ValidationException("title&Title can't be empty or null");
            }
            String newSlug = titleToSlug(body.get("title").toString());
            if(articleRepository.existsBySlug(newSlug)&& !(oldSlug.equals(newSlug))){
                throw new EntityExistsException("slug&Slug already exist");
            }
            currentArticle.setTitle(body.get("title").toString());
            currentArticle.setSlug(newSlug);
        }
        if(body.get("description")!=null){

            currentArticle.setDescription(body.get("description").toString());
        }
        if(body.get("body")!=null){
            currentArticle.setBody(body.get("body").toString());
        }
        if(body.get("tagList")!=null){
            Set<String> existTagsInCurrentArticle = new HashSet<>();
            for(Tag temp: currentArticle.getTags()){
                existTagsInCurrentArticle.add(temp.getName());
            }
            List<String> providedTagList = convertObjectToList(body.get("tagList"));
            ListIterator<String> iterator = providedTagList.listIterator();
            while (iterator.hasNext())
            {
                iterator.set(iterator.next().toLowerCase().trim());
            }
            for(String temp : providedTagList){
                var tag = tagRepository.findByName(temp).orElse(null);
                // null means new tag
                if(tag == null){
                    tag = new Tag();
                    tag.setName(temp);
                    currentArticle.addTag(tag);
                    tagRepository.save(tag);
                }else{
                    // Tag exist in this application but maybe not in this article
                    if(!existTagsInCurrentArticle.contains(temp)){
                        currentArticle.addTag(tag);
                    }
                }
            }
        }
        currentArticle.setUpdatedAt(LocalDateTime.now());
        articleRepository.save(currentArticle);
        var profile = profileRepository.findByUser(currentArticle.getOwner()).orElseThrow(() ->new EntityNotFoundException("User profile not exist"));
        Map<String, Object> result = new HashMap<>();
        result.put("article",articleToJSON(currentArticle,currentUser,profile,false,false));
        return result;
    }
    public Object deleteArticle(String oldSlug,String currentUserEmail){
        System.out.println("deleteArticles function:");
        System.out.println("the value for currentUserEmail:"+ currentUserEmail);
        System.out.println("the value for oldSlug:"+ oldSlug);
        var currentUser = userRepository.findByEmail(currentUserEmail).orElseThrow(() ->new EntityNotFoundException("User not exist"));
        var currentArticle = articleRepository.findBySlug(oldSlug).orElseThrow(() ->new EntityNotFoundException("slug not exist"));
        if(!Objects.equals(currentArticle.getOwner().getId(), currentUser.getId())){
            throw new ForbiddenException("deleteArticle&User cannot delete article because user are not the owner of that article");
        }
        articleRepository.delete(currentArticle);
        Map<String, Object> result = new HashMap<>();
        result.put("Message","Delete Article Success");
        result.put("slug",oldSlug);
        return result;
    }
    public Object addCommentToArticle(String slug,Map<String,Object> body,String currentUserEmail){
        System.out.println("addComment function:");
        System.out.println("the value for currentUserEmail:"+ currentUserEmail);
        System.out.println("the value for slug:"+ slug);
        var currentUser = userRepository.findByEmail(currentUserEmail).orElseThrow(() ->new EntityNotFoundException("User not exist"));
        var currentArticle = articleRepository.findBySlug(slug).orElseThrow(() ->new EntityNotFoundException("slug not exist"));
        if(body.get("body")== null){
            throw new ValidationException("body&Body field must be provided");
        }
        if(body.get("body").toString().isBlank()){
            throw new ValidationException("body&Body can't be empty or null");
        }
        Comment newComment = new Comment();
        newComment.setArticle(currentArticle);
        newComment.setUser(currentUser);
        newComment.setCreatedAt(LocalDateTime.now());
        newComment.setUpdatedAt(LocalDateTime.now());
        newComment.setBody(body.get("body").toString());
        commentRepository.save(newComment);
        Map<String, Object> result = new HashMap<>();
        var profile = profileRepository.findByUser(currentArticle.getOwner()).orElseThrow(() ->new EntityNotFoundException("User profile not exist"));
        result.put("comment",commentToJSON(newComment,currentUser,profile,false));
        return result;
    }
    public Object getComments(String slug,String currentUserEmail){
        System.out.println("getComment function:");
        System.out.println("the value for currentUserEmail:"+ currentUserEmail);
        System.out.println("the value for slug:"+ slug);
        var currentArticle = articleRepository.findBySlug(slug).orElseThrow(() ->new EntityNotFoundException("slug not exist"));
        List<Comment> commentList = commentRepository.findByArticleDESC(currentArticle);
        Map<String, Object> result = new HashMap<>();
        List<Map<String,Object>> comments = new ArrayList<>();
        if(!currentUserEmail.equals("anonymousUser")){
            var currentUser = userRepository.findByEmail(currentUserEmail).orElseThrow(() ->new EntityNotFoundException("User not exist"));
            for( Comment temp : commentList){
                var profile = profileRepository.findByUser(temp.getUser()).orElseThrow(() ->new EntityNotFoundException("User profile not exist"));
                User target = temp.getUser();
                boolean following = profileService.isUserFollowTarget(target,currentUser);
                comments.add(commentToJSON(temp,target,profile,following));
            }
        }
        else {
            for( Comment temp : commentList){
                var profile = profileRepository.findByUser(temp.getUser()).orElseThrow(() ->new EntityNotFoundException("User profile not exist"));
                User target = temp.getUser();
                comments.add(commentToJSON(temp,target,profile,false));
            }
        }
        result.put("comments",comments);
        return result;
    }
    public Object deleteComment(String Slug,long id,String currentUserEmail){
        System.out.println("deleteComment function:");
        System.out.println("the value for currentUserEmail:"+ currentUserEmail);
        System.out.println("the value for id:"+ id);
        var currentUser = userRepository.findByEmail(currentUserEmail).orElseThrow(() ->new EntityNotFoundException("User not exist"));
        var comment = commentRepository.findById(id).orElseThrow(() ->new EntityNotFoundException("Comment not exist"));
        if(!Objects.equals(comment.getUser().getId(), currentUser.getId())){
            throw new ForbiddenException("deleteArticle&User cannot delete article because user are not the owner of that article");
        }
        commentRepository.delete(comment);
        Map<String, Object> result = new HashMap<>();
        result.put("Message","Delete Comment Success");
        result.put("comment", comment.getBody());
        return result;
    }
    public Object favorite(String slug, String currentUserEmail){
        System.out.println("favorite function:");
        System.out.println("the value for currentUserEmail:"+ currentUserEmail);
        System.out.println("the value for slug:"+ slug);
        var currentUser = userRepository.findByEmail(currentUserEmail).orElseThrow(() ->new EntityNotFoundException("User not exist"));
        var currentArticle = articleRepository.findBySlug(slug).orElseThrow(() ->new EntityNotFoundException("slug not exist"));
        currentUser.addFavourite_article(currentArticle);
        userRepository.save(currentUser);
        articleRepository.save(currentArticle);
        Map<String, Object> result = new HashMap<>();
        var profile = profileRepository.findByUser(currentArticle.getOwner()).orElseThrow(() ->new EntityNotFoundException("User profile not exist"));
        User target = currentArticle.getOwner();
        boolean following = profileService.isUserFollowTarget(target,currentUser);
        result.put("article",articleToJSON(currentArticle, target, profile,true,following));
        return result;
    }
    public Object unfavorite(String slug, String currentUserEmail){
        System.out.println("unfavorite function:");
        System.out.println("the value for currentUserEmail:"+ currentUserEmail);
        System.out.println("the value for slug:"+ slug);
        var currentUser = userRepository.findByEmail(currentUserEmail).orElseThrow(() ->new EntityNotFoundException("User not exist"));
        var currentArticle = articleRepository.findBySlug(slug).orElseThrow(() ->new EntityNotFoundException("slug not exist"));
        currentUser.deleteFavourite_article(currentArticle);
        userRepository.save(currentUser);
        articleRepository.save(currentArticle);
        Map<String, Object> result = new HashMap<>();
        var profile = profileRepository.findByUser(currentArticle.getOwner()).orElseThrow(() ->new EntityNotFoundException("User profile not exist"));
        User target = currentArticle.getOwner();
        boolean following = profileService.isUserFollowTarget(target,currentUser);
        result.put("article",articleToJSON(currentArticle, target, profile,false,following));
        return result;
    }

    public Map<String,Object> articleToJSON(Article article, User author, Profile authorProfile, boolean favorited, boolean following){

        Map<String,Object> articleMap = new HashMap<>();
        Map<String,String> profileMap = new HashMap<>();
        articleMap.put("slug", article.getSlug());
        articleMap.put("title", article.getTitle());
        articleMap.put("description", article.getDescription());
        articleMap.put("body", article.getBody());
        articleMap.put("tagList", getTagNameList(article.getTags()));
        articleMap.put("createdAt", article.getCreatedAt());
        articleMap.put("updatedAt", article.getUpdatedAt());

        articleMap.put("favorited", String.valueOf(favorited));
        articleMap.put("favoritesCount", article.getFavouritesCount());
        profileMap.put("username",author.getUsername());
        profileMap.put("bio",authorProfile.getBio());
        profileMap.put("image",authorProfile.getImage());
        profileMap.put("following",String.valueOf(following));
        articleMap.put("author", profileMap);


        return articleMap;
    }


    public boolean isUserLikeArticle(Article article, User currentUser){
        for(User temp : article.getFavourite_users()){
            if(Objects.equals(temp.getId(), currentUser.getId())){
                return true;
            }
        }
        return false;
    }

    public String titleToSlug(String title){
        String nowhitespace = WHITESPACE.matcher(title).replaceAll("-");
        String normalized = Normalizer.normalize(nowhitespace, Normalizer.Form.NFD);
        String slug = NONLATIN.matcher(normalized).replaceAll("");
        return slug.toLowerCase(Locale.ENGLISH);
    }

    public static List<String> convertObjectToList(Object obj) {
        List<String> list = new ArrayList<>();
        if(obj instanceof ArrayList<?>){
            for(Object o :(List<?>) obj){
                list.add(String.class.cast(o));
            }
        }
        return list;
    }

    List<String> getTagNameList(Set<Tag> tags){
        List<String> result = new ArrayList<>();
        for(Tag temp: tags){
            result.add(temp.getName());
        }
        return result;
    }

    public Map<String,Object> commentToJSON(Comment comment, User author, Profile authorProfile, boolean following){

        Map<String,Object> commentMap = new HashMap<>();
        Map<String,String> profileMap = new HashMap<>();
        commentMap.put("id", comment.getId());

        commentMap.put("body", comment.getBody());
        commentMap.put("createdAt",comment.getCreatedAt());
        commentMap.put("updatedAt", comment.getUpdatedAt());

        profileMap.put("username",author.getUsername());
        profileMap.put("bio",authorProfile.getBio());
        profileMap.put("image",authorProfile.getImage());
        profileMap.put("following",String.valueOf(following));
        commentMap.put("author", profileMap);
        return commentMap;
    }
}
