package com.foodimap.foodimap.dto;

import com.foodimap.foodimap.model.Role;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponse {

    private String token;
    private String type = "Bearer";
    private String username;
    private String email;
    private String role;

    public LoginResponse(String token, String username, String email, String role) {

        this.token = token;
        this.username = username;
        this.email = email;
        this.role = role;
    }
}
