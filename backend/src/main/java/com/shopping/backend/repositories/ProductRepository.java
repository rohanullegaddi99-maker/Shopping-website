package com.shopping.backend.repositories;

import com.shopping.backend.models.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCategory(String category);
    List<Product> findByMoodCategory(String moodCategory);
    List<Product> findByNameContainingIgnoreCase(String name);
    // Used by seeder to avoid duplicates on restart
    Optional<Product> findByName(String name);
}
