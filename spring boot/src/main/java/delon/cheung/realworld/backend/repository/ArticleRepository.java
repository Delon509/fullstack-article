package delon.cheung.realworld.backend.repository;

import delon.cheung.realworld.backend.model.Article;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ArticleRepository extends JpaRepository<Article,Integer> {

    @Query("SELECT a FROM Article a JOIN  a.tags tag  WHERE tag.name = ?1 ORDER BY a.createdAt DESC ")
    Page<Article> findArticlesByTag(String tag,Pageable pageable);
    @Query("SELECT a FROM Article a JOIN  a.owner author WHERE  author.username = ?1 ORDER BY a.createdAt DESC ")
    Page<Article> findArticlesByAuthor(String author,Pageable pageable);
    @Query("SELECT a FROM Article a JOIN  a.favourite_users fu WHERE fu.username = ?1 ORDER BY a.createdAt DESC ")
    Page<Article> findArticlesByFavouritedBy(String favoritedBy,Pageable pageable);
    @Query("SELECT a FROM Article a ORDER BY a.createdAt DESC ")
    Page<Article> findAllArticles(Pageable pageable);
    @Query("SELECT a FROM Article a JOIN  a.owner author WHERE author.id in ?1 ORDER BY a.createdAt DESC ")
    Page<Article> findArticlesByFollow(List<Long> id, Pageable pageable);

    Optional<Article> findBySlug(String slug);
    boolean existsBySlug(String slug);
}
