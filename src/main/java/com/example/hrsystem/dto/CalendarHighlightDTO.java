package com.example.hrsystem.dto;

public class CalendarHighlightDTO {
    private String type;  // "birthday", "task", "event"
    private String date;  // Format: "YYYY-MM-DD"

    public CalendarHighlightDTO() {
    }

    public CalendarHighlightDTO(String type, String date) {
        this.type = type;
        this.date = date;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }
}
