package delon.cheung.realworld.backend.repository;

import delon.cheung.realworld.backend.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<Role,Integer> {
}
