package delon.cheung.realworld.backend.repository;

import delon.cheung.realworld.backend.model.Article;
import delon.cheung.realworld.backend.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface CommentRepository extends JpaRepository<Comment,Integer> {
    @Query("SELECT c FROM Comment c JOIN  c.article a WHERE a = ?1 ORDER BY c.createdAt DESC ")
    List<Comment> findByArticleDESC(Article article);
    Optional<Comment> findById(Long id);
}
