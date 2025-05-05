package com.example.hrsystem.dto;

public class CardInfoDTO {
    private String number;
    private String expiry;
    private String cvv;

    public CardInfoDTO(String number, String expiry, String cvv) {
        this.number = number;
        this.expiry = expiry;
        this.cvv = cvv;
    }

    // Getters and setters
    public String getNumber() { return number; }
    public void setNumber(String number) { this.number = number; }

    public String getExpiry() { return expiry; }
    public void setExpiry(String expiry) { this.expiry = expiry; }

    public String getCvv() { return cvv; }
    public void setCvv(String cvv) { this.cvv = cvv; }
}
