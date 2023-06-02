package delon.cheung.realworld.backend.repository;

import delon.cheung.realworld.backend.model.Profile;
import delon.cheung.realworld.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProfileRepository extends JpaRepository<Profile,Integer> {
    Optional<Profile> findByUser(User user);
}
