package com.foodimap.foodimap.dto;

import lombok.Data;

@Data
public class PostRequest {

    private String caption;
    private String imageUrl;
    private String postType;
}
