package com.shopping.backend.models;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Entity
@Table(name = "products")
@Data
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    private BigDecimal price;
    private String category;
    
    @ManyToOne
    @JoinColumn(name = "brand_id")
    private Brand brand;
    
    private String imageUrl;
    private Double rating;
    private Integer stock;
    
    private String moodCategory; // Mood-Based Filtering (e.g., Happy, Fitness, Casual)
}
