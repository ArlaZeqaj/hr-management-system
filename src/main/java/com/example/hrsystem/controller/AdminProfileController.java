package com.example.hrsystem.controller;

import com.example.hrsystem.model.Admin;
import com.example.hrsystem.service.AdminProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/api/Admin")
public class AdminProfileController {

    private final AdminProfileService adminProfileService;

    @Autowired
    public AdminProfileController(AdminProfileService adminProfileService) {
        this.adminProfileService = adminProfileService;
    }

    @GetMapping("/by-email")
    public ResponseEntity<?> getAdminByEmail(@RequestParam String email) {
        try {
            Admin admin = adminProfileService.getAdminByEmail(email);

            if (admin == null) {
                return ResponseEntity.notFound().build();
            }

            return ResponseEntity.ok(admin);

        } catch (ExecutionException e) {
            return ResponseEntity.internalServerError().body("Error executing Firestore query: " + e.getMessage());
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            return ResponseEntity.internalServerError().body("Operation interrupted: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Unexpected error: " + e.getMessage());
        }
    }
/*
    // Additional endpoints you might need:
    @GetMapping("/{id}")
    public ResponseEntity<?> getAdminById(@PathVariable String id) {
        try {
            // You would need to implement this method in your service
            Admin admin = adminProfileService.getAdminById(id);

            if (admin == null) {
                return ResponseEntity.notFound().build();
            }

            return ResponseEntity.ok(admin);

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error fetching admin: " + e.getMessage());
        }
    }

 */
}