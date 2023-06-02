package delon.cheung.realworld.backend.model;


import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.userdetails.UserDetails;

import javax.validation.constraints.*;
import java.util.HashSet;
import java.util.Set;


@Entity
@Table(	name = "users",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = "username"),
                @UniqueConstraint(columnNames = "email")
        })
@Getter
@Setter
@NoArgsConstructor
@Builder
@AllArgsConstructor
public class User  {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 20)
    private String username;

    @NotBlank
    @Size(max = 50)
    @Email
    private String email;

    @NotBlank
    private String password;

    @OneToOne(mappedBy = "user",cascade = CascadeType.ALL)
    private Profile profile;

    @ManyToMany(fetch = FetchType.EAGER,cascade = CascadeType.ALL)
    @JoinTable(	name = "user_roles",
            joinColumns = @JoinColumn(name = "users_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Set<Role> roles = new HashSet<>();

    @ManyToMany(cascade = CascadeType.ALL)
    @JoinTable(name = "USER_RELATIONS",
            joinColumns = @JoinColumn(name = "FOLLOWED_ID"),
            inverseJoinColumns = @JoinColumn(name = "FOLLOWER_ID"))
    private Set<User> followers = new HashSet<>();

    @ManyToMany(mappedBy = "followers")
    private Set<User> following= new HashSet<>();

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true, mappedBy = "owner")
    private Set<Article> articles= new HashSet<>();

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true, mappedBy = "user")
    private Set<Comment> comments= new HashSet<>();

    @ManyToMany(cascade = CascadeType.ALL)
    @JoinTable(name = "FAVOURITE_ARTICLES",
            joinColumns = @JoinColumn(name = "users_id"),
            inverseJoinColumns = @JoinColumn(name = "articles_id"))
    private Set<Article> favourite_articles = new HashSet<>();
    @Column(name="userstatus")
    private String userstatus="NL";
    @Column(name="timeoffailedlogin")
    @Min(value = 0)
    private long timeoffailedlogin=0;

    public User(String username, String email, String password) {
        this.username = username;
        this.email = email;
        this.password = password;
    }

    public void addRole(Role role){
        roles.add(role);
        role.getUsers().add(this);
    }
    public void deleteRole(Role role){
        roles.remove(role);
        role.getUsers().remove(this);
    }

    public void addFollower(User follower) {
        followers.add(follower);
        follower.following.add(this);
    }
    public void deleteFollower(User follower){
        followers.remove(follower);
        follower.following.remove(this);
    }

    public void addFavourite_article(Article favourite_article){
        favourite_articles.add(favourite_article);
        favourite_article.getFavourite_users().add(this);
        favourite_article.setFavouritesCount(favourite_article.getFavouritesCount() +1);
    }
    public void deleteFavourite_article(Article favourite_article){
        favourite_articles.remove(favourite_article);
        favourite_article.getFavourite_users().remove(this);
        favourite_article.setFavouritesCount(favourite_article.getFavouritesCount() -1);
    }
}
