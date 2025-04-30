package com.example.hrsystem.dto;

public class LeaveRequestPayload {
    private String startDate;
    private String endDate;
    private String leaveType;

    // getters/setters
    public String getStartDate() { return startDate; }
    public void setStartDate(String startDate) { this.startDate = startDate; }
    public String getEndDate() { return endDate; }
    public void setEndDate(String endDate) { this.endDate = endDate; }
    public String getLeaveType() { return leaveType; }
    public void setLeaveType(String leaveType) { this.leaveType = leaveType; }
}
