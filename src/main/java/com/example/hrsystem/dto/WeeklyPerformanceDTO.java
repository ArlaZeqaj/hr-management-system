package com.example.hrsystem.dto;

public class WeeklyPerformanceDTO {
    private int week;
    private int tasks;

    public WeeklyPerformanceDTO() {
    }

    public WeeklyPerformanceDTO(int w, Integer orDefault) {
        week=w;
        tasks=orDefault;
    }

    public void setTasks(int tasks) {
        this.tasks = tasks;
    }

    public void setWeek(int week) {
        this.week = week;
    }

    public int getTasks() {
        return tasks;
    }

    public int getWeek() {
        return week;
    }
}
