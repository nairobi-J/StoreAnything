package com.example.backend.service;

import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.backend.model.Role;
import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder){
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Optional<User> registerUser(String username, String password){
        if(userRepository.findByUsername(username).isPresent()){
            return Optional.empty();
        }
        User newUser = new User();
        newUser.setUsername(username);
        newUser.setPassword(passwordEncoder.encode(password));
        newUser.setRole(Role.USER);
        return Optional.of(userRepository.save(newUser));
    }

    public boolean authenticateUser(String username, String rawPassword){
        Optional<User> userOptional = userRepository.findByUsername(username);
        return userOptional.map(user -> passwordEncoder.matches(rawPassword, user.getPassword())).orElse(false);
    }

    
}
