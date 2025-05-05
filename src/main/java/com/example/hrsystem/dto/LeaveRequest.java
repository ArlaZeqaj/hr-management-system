package com.example.hrsystem.dto;

public class LeaveRequest {
    private String id;
    private String startDate;
    private String endDate;
    private String leaveType;
    private String status;
    private String submittedAt;
    private String employeeId;
    private String employee;

    public String getEmployeeId() {
        return employeeId;
    }



    // getters/setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getStartDate() { return startDate; }
    public void setStartDate(String startDate) { this.startDate = startDate; }
    public String getEndDate() { return endDate; }
    public void setEndDate(String endDate) { this.endDate = endDate; }
    public String getLeaveType() { return leaveType; }
    public void setLeaveType(String leaveType) { this.leaveType = leaveType; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(String submittedAt) { this.submittedAt = submittedAt; }


    public void setEmployeeId(String employeeId) {
        this.employeeId = employeeId;
    }

    public String getEmployee() {
        return employee;
    }

    public void setEmployee(String employee) {
        this.employee = employee;
    }
}
