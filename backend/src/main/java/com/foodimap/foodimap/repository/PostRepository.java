package com.foodimap.foodimap.repository;

import com.foodimap.foodimap.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {

    List<Post> findPostsByUsername(String username);
}
