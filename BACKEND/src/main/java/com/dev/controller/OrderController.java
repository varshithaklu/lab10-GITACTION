package com.dev.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.dev.entity.Order;
import com.dev.service.OrderService;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderService service;

    @GetMapping("/")
    public ResponseEntity<String> home() {
        return ResponseEntity.ok("Order API Demo");
    }

    // 🔹 GET all orders
    @GetMapping("/all")
    public ResponseEntity<List<Order>> getAll() 
    {
        List<Order> orders = service.getAllOrders();
        return ResponseEntity.ok(orders);
    }

    // 🔹 GET order by ID
    @GetMapping("/get/{id}")
    public ResponseEntity<?> getOne(@PathVariable Long id) {
        try {
            Order order = service.getOrderById(id);
            return ResponseEntity.ok(order); // 200 OK
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Order with ID " + id + " not found");
        }
    }

    // 🔹 POST create new order
    @PostMapping("/add")
    public ResponseEntity<Order> create(@RequestBody Order order) 
    {
        order.setStatus("ASSIGNED");
        Order createdOrder = service.createOrder(order);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdOrder); // 201 Created
    }

    // 🔹 PUT update existing order
    @PutMapping("/update/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Order updatedOrder) {
        try {
            Order order = service.updateOrder(id, updatedOrder);
            return ResponseEntity.ok(order); // 200 OK
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Order with ID " + id + " not found for update");
        }
    }

    // 🔹 DELETE order
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        try {
            service.deleteOrder(id);
            return ResponseEntity.ok("Order with ID " + id + " deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Order with ID " + id + " not found for deletion");
        }
    }
    
    // 🔹 PUT update status
    @PutMapping("/updatestatus/{id}")
    public ResponseEntity<Order> updatestatus(@PathVariable Long id, @RequestBody Order order) {
        Order updated = service.updateStatus(id, order);
        return ResponseEntity.ok(updated);
    }

}
