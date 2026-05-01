package com.shopping.backend.controllers;

import com.shopping.backend.models.Order;
import com.shopping.backend.models.User;
import com.shopping.backend.repositories.OrderRepository;
import com.shopping.backend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<Order>> getMyOrders() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow();
        return ResponseEntity.ok(orderRepository.findByUserId(user.getId()));
    }

    @PostMapping
    public ResponseEntity<Order> placeOrder(@RequestBody Order order) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow();
        order.setUser(user);
        order.setStatus("Pending");
        if(order.getItems() != null) {
            order.getItems().forEach(item -> item.setOrder(order));
        }
        return ResponseEntity.ok(orderRepository.save(order));
    }
}
