package com.foodimap.foodimap.controller;

import com.foodimap.foodimap.dto.LoginRequest;
import com.foodimap.foodimap.dto.LoginResponse;
import com.foodimap.foodimap.dto.RegisterRequest;
import com.foodimap.foodimap.model.User;
import com.foodimap.foodimap.service.UserService;
import com.foodimap.foodimap.util.JwtUtils;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtils jwtUtils;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);

            User user;

            if (loginRequest.getUsername().contains("@")) {
                user = userService.findByEmailIgnoreCase(loginRequest.getUsername())
                        .orElseThrow(() -> new RuntimeException("User not found"));
            } else {
                user = userService.findByUsername(loginRequest.getUsername())
                        .orElseThrow(() -> new RuntimeException("User not found"));
            }

            String jwtToken = jwtUtils.generateToken(user);

            LoginResponse loginResponse = new LoginResponse(
                    jwtToken,
                    user.getUsername(),
                    user.getEmail(),
                    user.getRole().name()
            );

            return ResponseEntity.ok(loginResponse);
        }
        catch (Exception e) {

            return ResponseEntity.badRequest().body(e.toString());
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {

        if (userService.existsByUsername(registerRequest.getUsername())) {
            return ResponseEntity.badRequest().body("Username is already taken");
        }

        if (userService.existsByEmail(registerRequest.getEmail())) {
            return ResponseEntity.badRequest().body("Email is already in use");
        }

        User savedUser = userService.registerUser(registerRequest);
        return ResponseEntity.ok("User registered successfully");
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {

        SecurityContextHolder.clearContext();

        return ResponseEntity.ok("Logged out successfully");
    }
}
