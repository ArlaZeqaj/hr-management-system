package com.example.hrsystem.dto;

import com.example.hrsystem.model.Performance;

public class PerformanceDTO {
    private Performance performance;
    private int taskCount;
    private int projectCount;

    public PerformanceDTO(Performance performance, int taskCount, int projectCount) {
        this.performance = performance;
        this.taskCount = taskCount;
        this.projectCount = projectCount;
    }
}