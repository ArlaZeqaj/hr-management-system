package com.example.hrsystem.dto;

public class CalendarHighlightDTO {
    private String type;  // "birthday", "task", "event"
    private String date;  // Format: "YYYY-MM-DD"
    private String title;  // Format: "YYYY-MM-DD"

    public CalendarHighlightDTO() {
    }

    public CalendarHighlightDTO(String type, String date,String title) {
        this.type = type;
        this.date = date;
        this.title=title;
    }

    public String getType() {
        return type;
    }
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
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
