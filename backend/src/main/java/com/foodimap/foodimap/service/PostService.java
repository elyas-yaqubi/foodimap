package com.foodimap.foodimap.service;

import com.foodimap.foodimap.dto.PostRequest;
import com.foodimap.foodimap.dto.PostResponse;
import com.foodimap.foodimap.model.Post;
import com.foodimap.foodimap.model.PostType;
import com.foodimap.foodimap.model.User;
import com.foodimap.foodimap.repository.PostRepository;
import com.foodimap.foodimap.repository.UserRepository;
import jakarta.servlet.ServletContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ServletContext servletContext;

    @Value("${upload.path}")
    private String uploadPath;

    public PostResponse createPost(PostRequest request, String username) throws IOException {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        MultipartFile imageFile = request.getImage();

        String imageUrl = null;
        if (imageFile != null && !imageFile.isEmpty()) {
            imageUrl = servletContext.getContextPath() + storeImage(imageFile);
        }

        Post post = new Post();
        post.setUser(user);
        post.setCaption(request.getCaption());
        post.setCreatedAt(post.getCreatedAt());
        post.setImageUrl(imageUrl);
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
                imageUrl,
                savedPost.getPostType().toString().toLowerCase(),
                user.getUsername(),
                savedPost.getCreatedAt()
        );
    }

    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    public String storeImage(MultipartFile file) throws IOException {
        String fileName = UUID.randomUUID().toString() + "_" + StringUtils.cleanPath(file.getOriginalFilename());
        Path target = Paths.get(uploadPath).resolve(fileName);
        Files.createDirectories(target.getParent());
        try (InputStream in = file.getInputStream()) {
            Files.copy(in, target, StandardCopyOption.REPLACE_EXISTING);
        }

        return "/uploads/images/" + fileName;
    }
}
