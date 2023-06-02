package delon.cheung.realworld.backend.app;


import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication()
@ComponentScan(basePackages = {"delon.cheung.realworld.backend.*"})
@EntityScan(basePackages = {"delon.cheung.realworld.backend.*"})
@EnableJpaRepositories("delon.cheung.realworld.backend.*")
public class RealworldApplication {

	public static void main(String[] args) {
		SpringApplication.run(RealworldApplication.class, args);
	}

}
