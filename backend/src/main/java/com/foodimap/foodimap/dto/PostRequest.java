package com.foodimap.foodimap.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
@AllArgsConstructor
public class PostRequest {

    private String caption;
    private MultipartFile image;
    private String postType;
}
