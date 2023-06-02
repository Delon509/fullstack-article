package delon.cheung.realworld.backend.repository;

import delon.cheung.realworld.backend.model.Tag;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TagRepository extends JpaRepository<Tag,Integer> {
    boolean existsByName(String name);
    Optional<Tag> findByName(String name);
}
