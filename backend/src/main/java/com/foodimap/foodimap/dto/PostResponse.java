package com.foodimap.foodimap.dto;

import com.foodimap.foodimap.model.PostType;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.Instant;

@Data
@AllArgsConstructor
public class PostResponse {

    private Long id;
    private String caption;
    private String imageUrl;
    private String postType;
    private String username;
    private Instant createdAt;
}
