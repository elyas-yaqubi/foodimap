package com.foodimap.foodimap.dto;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class PostRequest {

    private String caption;
    private MultipartFile image;
    private String postType;
}
