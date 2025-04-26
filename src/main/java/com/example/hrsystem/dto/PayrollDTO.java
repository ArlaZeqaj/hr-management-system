package com.example.hrsystem.dto;

public class PayrollDTO {
    private String month;
    private Double netSalary;

    public Double getNetSalary() {
        return netSalary;
    }

    public String getMonth() {
        return month;
    }

    public void setMonth(String month) {
        this.month = month;
    }

    public void setNetSalary(Double netSalary) {
        this.netSalary = netSalary;
    }
}

