package com.foodimap.foodimap.controller;

import com.foodimap.foodimap.dto.PostRequest;
import com.foodimap.foodimap.dto.PostResponse;
import com.foodimap.foodimap.model.Post;
import com.foodimap.foodimap.service.PostService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/post")
public class PostController {

    @Autowired
    PostService postService;

    @PostMapping
    public ResponseEntity<?> createPost(@RequestPart("caption") String caption,
                                        @RequestPart("postType") String postType,
                                        @RequestPart("image") MultipartFile image) {

        try {
            String username = SecurityContextHolder.getContext().getAuthentication().getName();

            PostRequest postRequest = new PostRequest(caption, image, postType);

            PostResponse response = postService.createPost(postRequest, username);

            return ResponseEntity.ok(response);
        }
        catch (Exception e) {
            return ResponseEntity.badRequest().body(e.toString());
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllPosts() {

        try {
            List<Post> posts = postService.getAllPosts();

            return ResponseEntity.ok(posts);
        }
        catch (Exception e) {
            return ResponseEntity.badRequest().body(e.toString());
        }
    }
}
