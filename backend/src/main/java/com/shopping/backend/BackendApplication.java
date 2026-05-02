package com.shopping.backend;

import com.shopping.backend.models.Brand;
import com.shopping.backend.models.Product;
import com.shopping.backend.models.User;
import com.shopping.backend.repositories.BrandRepository;
import com.shopping.backend.repositories.ProductRepository;
import com.shopping.backend.repositories.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.util.Map;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

	@Bean
	public CommandLineRunner loadData(
			ProductRepository productRepo,
			BrandRepository brandRepo,
			UserRepository userRepo,
			PasswordEncoder passwordEncoder
	) {
		return args -> {

			// ── Seed Admin User ──────────────────────────────────────────
			if (userRepo.count() == 0) {
				User admin = new User();
				admin.setName("Admin");
				admin.setEmail("admin@shop.com");
				admin.setPassword(passwordEncoder.encode("admin"));
				admin.setRole("ADMIN");
				userRepo.save(admin);
			}

			// ── Brand helper: find-or-create ─────────────────────────────
			Map<String, Brand> brands = new java.util.HashMap<>();
			String[] brandDefs = {
				"Sony|Electronics Giant",
				"Nike|World's Leading Sportswear",
				"Apple|Think Different",
				"Samsung|Innovating for the Future",
				"Levi's|Original Blue Jeans",
				"Puma|Forever Faster",
				"Philips|Innovation and You",
				"Bose|Better Sound Through Research",
				"boAt|Make Every Moment Count",
				"Fastrack|Move On",
				"WildCraft|Gear Up",
				"Prestige|Smart Kitchen"
			};
			for (String def : brandDefs) {
				String[] parts = def.split("\\|");
				String bName = parts[0], bDesc = parts[1];
				Brand b = brandRepo.findAll().stream()
						.filter(x -> x.getName().equals(bName))
						.findFirst()
						.orElseGet(() -> {
							Brand nb = new Brand();
							nb.setName(bName);
							nb.setDescription(bDesc);
							return brandRepo.save(nb);
						});
				brands.put(bName, b);
			}

			// ── Product seeder helper ────────────────────────────────────
			// Only inserts a product if no product with that exact name exists.
			// Safe to run on every restart — no duplicates.

			// format: name | description | price | category | brand | mood | rating | stock | imageUrl
			Object[][] products = {

				// ── RELAXED (6) ──────────────────────────────────────────
				{
					"Wireless Noise-Canceling Headphones",
					"Premium over-ear headphones with active noise cancellation and 30-hour battery life.",
					"24999.00", "Electronics", "Sony", "Relaxed", 4.8, 50,
					"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80"
				},
				{
					"Scented Candle Gift Set",
					"Set of 6 luxury soy wax candles in calming lavender, vanilla, and sandalwood fragrances.",
					"1299.00", "Home & Living", "Philips", "Relaxed", 4.6, 150,
					"https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&q=80"
				},
				{
					"Bamboo Loose-Leaf Tea Set",
					"Elegant 7-piece bamboo tea set with infuser, perfect for a mindful tea ritual.",
					"2499.00", "Home & Living", "Prestige", "Relaxed", 4.7, 80,
					"https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=500&q=80"
				},
				{
					"Electric Foot Massager",
					"Shiatsu foot massager with heat therapy and adjustable intensity. Relieves tired feet instantly.",
					"4999.00", "Health & Wellness", "Philips", "Relaxed", 4.5, 40,
					"https://images.unsplash.com/photo-1519415943484-9fa1873496d4?w=500&q=80"
				},
				{
					"Aromatherapy Diffuser",
					"Ultrasonic essential oil diffuser with 7-color LED night light and auto shut-off.",
					"1799.00", "Home & Living", "Philips", "Relaxed", 4.4, 120,
					"https://images.unsplash.com/photo-1545259742-c98875c49a92?w=500&q=80"
				},
				{
					"Plush Memory Foam Pillow",
					"Ergonomic cervical memory foam pillow that adapts to your neck shape for deep, restful sleep.",
					"1599.00", "Home & Living", "Philips", "Relaxed", 4.6, 200,
					"https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500&q=80"
				},

				// ── FITNESS (5) ──────────────────────────────────────────
				{
					"Smart Fitness Watch",
					"Track workouts, heart rate, and sleep patterns. Water-resistant up to 50 m.",
					"14999.50", "Electronics", "Samsung", "Fitness", 4.5, 120,
					"https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80"
				},
				{
					"Premium Yoga Mat",
					"6 mm thick non-slip TPE yoga mat with alignment lines. Eco-friendly and sweat-resistant.",
					"999.00", "Sports & Fitness", "Nike", "Fitness", 4.7, 300,
					"https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&q=80"
				},
				{
					"Resistance Bands Set (5 Levels)",
					"Set of 5 latex-free resistance bands for full-body workouts at home or the gym.",
					"799.00", "Sports & Fitness", "Puma", "Fitness", 4.6, 500,
					"https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=500&q=80"
				},
				{
					"Stainless Steel Protein Shaker",
					"600 ml leak-proof shaker with BlenderBall wire whisk for lump-free protein shakes.",
					"599.00", "Sports & Fitness", "boAt", "Fitness", 4.4, 400,
					"https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=500&q=80"
				},
				{
					"Nike Air Running Shoes",
					"Lightweight mesh running shoes with cushioned sole and breathable upper for long-distance runs.",
					"6999.00", "Footwear", "Nike", "Fitness", 4.8, 90,
					"https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80"
				},

				// ── CASUAL (5) ───────────────────────────────────────────
				{
					"Cozy Cotton Hoodie",
					"Ultra-soft oversized cotton hoodie. Your perfect companion for casual days.",
					"3499.00", "Clothing", "Levi's", "Casual", 4.7, 200,
					"https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&q=80"
				},
				{
					"Classic Canvas Sneakers",
					"Timeless low-top canvas sneakers available in 12 colours. Comfortable all-day wear.",
					"2299.00", "Footwear", "Puma", "Casual", 4.5, 250,
					"https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&q=80"
				},
				{
					"Slim Fit Denim Jacket",
					"Classic blue denim jacket with stretch fabric for a modern slim fit. Pair with anything.",
					"2999.00", "Clothing", "Levi's", "Casual", 4.6, 180,
					"https://images.unsplash.com/photo-1601333144130-8cbb312386b6?w=500&q=80"
				},
				{
					"Unisex Baseball Cap",
					"Adjustable 100% cotton cap with embroidered logo. One-size-fits-all for casual outings.",
					"699.00", "Accessories", "Nike", "Casual", 4.3, 350,
					"https://images.unsplash.com/photo-1534215754734-18e55d13e346?w=500&q=80"
				},
				{
					"Casual Canvas Backpack 25L",
					"Lightweight 25 L backpack with padded laptop sleeve, USB charging port, and multiple pockets.",
					"1899.00", "Bags", "WildCraft", "Casual", 4.6, 160,
					"https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80"
				},

				// ── PROFESSIONAL (5) ─────────────────────────────────────
				{
					"Professional Leather Briefcase",
					"Handcrafted genuine leather briefcase with laptop compartment. Elevate your style.",
					"8999.00", "Bags", "WildCraft", "Professional", 4.9, 30,
					"https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80"
				},
				{
					"Fountain Pen Luxury Gift Set",
					"Iridium-tipped gold fountain pen with 6 ink cartridges in a premium wooden gift box.",
					"3499.00", "Stationery", "Fastrack", "Professional", 4.8, 60,
					"https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=500&q=80"
				},
				{
					"Genuine Leather Wallet (RFID-Safe)",
					"Slim bi-fold leather wallet with RFID-blocking lining, 8 card slots, and currency pocket.",
					"1599.00", "Accessories", "Fastrack", "Professional", 4.7, 200,
					"https://images.unsplash.com/photo-1614179689702-355944cd0918?w=500&q=80"
				},
				{
					"2025 Hardcover Business Planner",
					"A5 hardcover planner with weekly/monthly views, goal-tracking pages, and lay-flat binding.",
					"799.00", "Stationery", "Fastrack", "Professional", 4.5, 300,
					"https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=500&q=80"
				},
				{
					"Wireless Keyboard & Mouse Combo",
					"Slim wireless keyboard and silent mouse combo with 2.4 GHz USB receiver. 12-month battery life.",
					"2499.00", "Electronics", "Samsung", "Professional", 4.6, 140,
					"https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&q=80"
				},

				// ── HAPPY (4) ────────────────────────────────────────────
				{
					"Party Glow Speakers",
					"Portable Bluetooth speaker with dynamic LED lights that sync to your music.",
					"5999.99", "Electronics", "boAt", "Happy", 4.6, 85,
					"https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&q=80"
				},
				{
					"Instax Mini Instant Camera",
					"Capture memories instantly! Credit-card-sized colour prints. Includes 10-shot film pack.",
					"7499.00", "Electronics", "Sony", "Happy", 4.7, 70,
					"https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&q=80"
				},
				{
					"LED Gaming Mechanical Keyboard",
					"TKL mechanical keyboard with rainbow RGB backlighting and tactile blue switches.",
					"3299.00", "Electronics", "Samsung", "Happy", 4.5, 110,
					"https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=500&q=80"
				},
				{
					"Funky Retro Sunglasses",
					"UV400 polarised oversized round sunglasses with retro frames. Be bold, be you.",
					"899.00", "Accessories", "Fastrack", "Happy", 4.4, 220,
					"https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&q=80"
				},
			};

			// Save each product only if it doesn't already exist by name
			for (Object[] p : products) {
				String name = (String) p[0];
				if (productRepo.findByName(name).isEmpty()) {
					Product product = new Product();
					product.setName(name);
					product.setDescription((String) p[1]);
					product.setPrice(new BigDecimal((String) p[2]));
					product.setCategory((String) p[3]);
					product.setBrand(brands.get((String) p[4]));
					product.setMoodCategory((String) p[5]);
					product.setRating((Double) p[6]);
					product.setStock((Integer) p[7]);
					product.setImageUrl((String) p[8]);
					productRepo.save(product);
					System.out.println("✅ Seeded: " + name);
				}
			}
		};
	}
}
