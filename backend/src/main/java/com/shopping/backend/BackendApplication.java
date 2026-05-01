package com.shopping.backend;

import com.shopping.backend.models.Product;
import com.shopping.backend.repositories.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import java.math.BigDecimal;

import com.shopping.backend.models.Brand;
import com.shopping.backend.models.User;
import com.shopping.backend.repositories.BrandRepository;
import com.shopping.backend.repositories.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

	@Bean
	public CommandLineRunner loadData(ProductRepository repository, BrandRepository brandRepo, UserRepository userRepo, PasswordEncoder passwordEncoder) {
		return args -> {
			if(userRepo.count() == 0) {
				User admin = new User();
				admin.setName("Admin");
				admin.setEmail("admin@shop.com");
				admin.setPassword(passwordEncoder.encode("admin"));
				admin.setRole("ADMIN");
				userRepo.save(admin);
			}

			if(repository.count() == 0) {
				Brand b1 = new Brand();
				b1.setName("Sony");
				b1.setDescription("Electronics Giant");
				brandRepo.save(b1);
				
				Product p1 = new Product();
				p1.setName("Wireless Noise-Canceling Headphones");
				p1.setDescription("Premium over-ear headphones with active noise cancellation and 30-hour battery life.");
				p1.setPrice(new BigDecimal("24999.00")); // Updated to INR
				p1.setCategory("Electronics");
				p1.setBrand(b1);
				p1.setMoodCategory("Relaxed");
				p1.setRating(4.8);
				p1.setStock(50);
				p1.setImageUrl("https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80");
				repository.save(p1);

				Product p2 = new Product();
				p2.setName("Smart Fitness Watch");
				p2.setDescription("Track your workouts, heart rate, and sleep patterns. Water-resistant up to 50m.");
				p2.setPrice(new BigDecimal("14999.50")); // INR
				p2.setCategory("Electronics");
				p2.setMoodCategory("Fitness");
				p2.setRating(4.5);
				p2.setStock(120);
				p2.setImageUrl("https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80");
				repository.save(p2);

				Product p3 = new Product();
				p3.setName("Cozy Cotton Hoodie");
				p3.setDescription("Ultra-soft, oversized cotton hoodie. Your perfect companion for casual days out or cozy days in.");
				p3.setPrice(new BigDecimal("3499.00")); // INR
				p3.setCategory("Clothing");
				p3.setMoodCategory("Casual");
				p3.setRating(4.7);
				p3.setStock(200);
				p3.setImageUrl("https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&q=80");
				repository.save(p3);

				Product p4 = new Product();
				p4.setName("Professional Leather Briefcase");
				p4.setDescription("Handcrafted genuine leather briefcase with laptop compartment. Elevate your professional style.");
				p4.setPrice(new BigDecimal("8999.00")); // INR
				p4.setCategory("Accessories");
				p4.setMoodCategory("Professional");
				p4.setRating(4.9);
				p4.setStock(30);
				p4.setImageUrl("https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80");
				repository.save(p4);
				
				Product p5 = new Product();
				p5.setName("Party Glow Speakers");
				p5.setDescription("Portable bluetooth speaker with dynamic LED lights that sync to your music.");
				p5.setPrice(new BigDecimal("5999.99")); // INR
				p5.setCategory("Electronics");
				p5.setMoodCategory("Happy");
				p5.setRating(4.6);
				p5.setStock(85);
				p5.setImageUrl("https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&q=80");
				repository.save(p5);
			}
		};
	}
}
