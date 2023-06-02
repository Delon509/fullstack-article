package delon.cheung.realworld.backend.service;

import delon.cheung.realworld.backend.model.User;
import delon.cheung.realworld.backend.model.UserDetailsImpl;
import delon.cheung.realworld.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    @Autowired
    private UserRepository userRepository;

    public UserDetailsServiceImpl(){}
    @Override
    public UserDetailsImpl loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<User> temp = userRepository.findByEmail(username);
        if(temp.isPresent()){
            return new UserDetailsImpl(temp.get());
        }
        throw new UsernameNotFoundException("Not found: " + username);
    }
}
