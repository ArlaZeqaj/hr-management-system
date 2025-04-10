package com.example.hrsystem.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class LoginAttempt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String email;
    private String ip;
    private LocalDateTime timestamp;
    private boolean success;

    // Constructors
    public LoginAttempt() {}

    public LoginAttempt(String email, String ip, boolean success) {
        this.email = email;
        this.ip = ip;
        this.success = success;
        this.timestamp = LocalDateTime.now();
    }

    // Getters & Setters
    // (use Lombok @Data if preferred)
}
