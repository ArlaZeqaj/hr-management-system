package com.example.hrsystem.model;


import com.google.cloud.firestore.annotation.DocumentId;

import java.util.Date;
import java.util.List;
import java.util.Map;

public class Performance {


    @DocumentId
    private String id;

    private String employeeId;
    private int month;
    private int year;
    private double performanceScore;

    private List<String> strengths;
    private List<String> areasForImprovement;
    private String reviewerId; // Admin who conducted the review
    private boolean valid;


    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(String employeeId) {
        this.employeeId = employeeId;
    }


    public int getMonth() {
        return month;
    }

    public void setMonth(int month) {
        this.month = month;
    }

    public int getYear() {
        return year;
    }

    public void setYear(int year) {
        this.year = year;
    }

    public boolean isValid() {
        return valid;
    }

    public void setValid(boolean valid) {
        this.valid = valid;
    }

    // Update your existing isValid() method to avoid conflict
    public boolean isDataValid() {
        return employeeId != null && !employeeId.isEmpty() &&
                month > 0 && month <= 12 &&
                year > 2000 && year < 2100 &&
                performanceScore >= 0 && performanceScore <= 100 &&
                reviewerId != null && !reviewerId.isEmpty() &&
                strengths != null &&
                areasForImprovement != null;
    }

    public double getPerformanceScore() {
        return performanceScore;
    }

    public void setPerformanceScore(double performanceScore) {
        this.performanceScore = performanceScore;
    }


    public List<String> getStrengths() {
        return strengths;
    }

    public void setStrengths(List<String> strengths) {
        this.strengths = strengths;
    }

    public List<String> getAreasForImprovement() {
        return areasForImprovement;
    }

    public void setAreasForImprovement(List<String> areasForImprovement) {
        this.areasForImprovement = areasForImprovement;
    }

    public String getReviewerId() {
        return reviewerId;
    }

    public void setReviewerId(String reviewerId) {
        this.reviewerId = reviewerId;
    }
}