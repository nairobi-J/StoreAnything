package com.example.backend.controller;


import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.model.User;
import com.example.backend.service.AuthService;

@RestController
@RequestMapping("api/auth") //basepoint
@CrossOrigin(origins = "http:/localhost:3000") //req from frontend
public class AuthController {

    private AuthService authService;

    public AuthController(AuthService authService){
        this.authService = authService;
    }
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody Map<String, String> payload){
        String username = payload.get("username");
        String password = payload.get("password");
    

    if(username == null || password == null || username.isEmpty() || password.isEmpty()){
        return new ResponseEntity<>("Username and password req" ,HttpStatus.BAD_REQUEST);
    }

    Optional<User> registeredUser = authService.registerUser(username, password);
    if(registeredUser.isPresent()){
         Map<String, String> response = new HashMap<>();
         response.put("message", "user registered successfully");
         response.put("username", registeredUser.get().getUsername());
         return new ResponseEntity<>(response, HttpStatus.CREATED);
    }else{
        return new ResponseEntity<>("username Already exists", HttpStatus.CONFLICT);
    }

    
}
}
