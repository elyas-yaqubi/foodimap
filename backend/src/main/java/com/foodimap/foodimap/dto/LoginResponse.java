package com.foodimap.foodimap.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponse {

    private String token;
    private String type = "Bearer";
    private String username;
    private String email;

    public LoginResponse(String token, String username, String email) {

        this.token = token;
        this.username = username;
        this.email = email;
    }
}
