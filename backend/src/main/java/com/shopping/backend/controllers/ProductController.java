package com.shopping.backend.controllers;

import com.shopping.backend.models.Product;
import com.shopping.backend.repositories.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductRepository productRepository;

    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String mood,
            @RequestParam(required = false) String search
    ) {
        if (search != null && !search.isEmpty()) {
            return ResponseEntity.ok(productRepository.findByNameContainingIgnoreCase(search));
        }
        if (category != null && !category.isEmpty()) {
            return ResponseEntity.ok(productRepository.findByCategory(category));
        }
        if (mood != null && !mood.isEmpty()) {
            return ResponseEntity.ok(productRepository.findByMoodCategory(mood));
        }
        return ResponseEntity.ok(productRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        return productRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
        return ResponseEntity.ok(productRepository.save(product));
    }
}
