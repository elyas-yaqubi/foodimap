package com.foodimap.foodimap.service;

import com.foodimap.foodimap.dto.PostRequest;
import com.foodimap.foodimap.dto.PostResponse;
import com.foodimap.foodimap.model.Post;
import com.foodimap.foodimap.model.PostType;
import com.foodimap.foodimap.model.User;
import com.foodimap.foodimap.repository.PostRepository;
import com.foodimap.foodimap.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    public PostResponse createPost(PostRequest request, String username) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        Post post = new Post();
        post.setUser(user);
        post.setCaption(request.getCaption());
        post.setCreatedAt(post.getCreatedAt());
        post.setImageUrl(request.getImageUrl());
        switch (request.getPostType().toLowerCase()) {
            case "review":
                post.setPostType(PostType.REVIEW);
            case "recipe":
                post.setPostType(PostType.RECIPE);
        }

        Post savedPost = postRepository.save(post);

        return new PostResponse(
                savedPost.getId(),
                savedPost.getCaption(),
                savedPost.getImageUrl(),
                savedPost.getPostType().toString().toLowerCase(),
                user.getUsername(),
                savedPost.getCreatedAt()
        );
    }

    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }
}
