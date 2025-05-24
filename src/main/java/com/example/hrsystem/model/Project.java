package com.example.hrsystem.model;

import com.google.cloud.firestore.annotation.PropertyName;

public class Project {
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    private String title;
    private String category;
    private String description;
    private String image;
    private String actionIcon;


    @PropertyName("Status")
    private String status;

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    // Getters and setters
}
