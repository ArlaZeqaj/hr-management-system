package com.example.hrsystem.model;

import com.google.cloud.firestore.annotation.PropertyName;

public class NewHire {

    private String docId;
    private String fullName;
    private String department;
    private String roleTitle;
    private String status;
    private String email;
    private String phoneNr;
    private String priority;
    private String documents;
    

    public NewHire() {
        // Required by Firestore
    }


public String getDocId() {
    return docId;
}

public void setDocId(String docId) {
    this.docId = docId;
}

    @PropertyName("Full Name")
    public String getFullName() {
        return fullName;
    }

    @PropertyName("Full Name")
    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    @PropertyName("Department")
    public String getDepartment() {
        return department;
    }

    @PropertyName("Department")
    public void setDepartment(String department) {
        this.department = department;
    }

    @PropertyName("Role Title")
    public String getRoleTitle() {
        return roleTitle;
    }

    @PropertyName("Role Title")
    public void setRoleTitle(String roleTitle) {
        this.roleTitle = roleTitle;
    }

    @PropertyName("Status")
    public String getStatus() {
        return status;
    }

    @PropertyName("Status")
    public void setStatus(String status) {
        this.status = status;
    }

    @PropertyName("email")
    public String getEmail() {
        return email;
    }

    @PropertyName("email")
    public void setEmail(String email) {
        this.email = email;
    }

    @PropertyName("phone Nr")
    public String getPhoneNr() {
        return phoneNr;
    }

    @PropertyName("phone Nr")
    public void setPhoneNr(String phoneNr) {
        this.phoneNr = phoneNr;
    }

    @PropertyName("priority")
    public String getPriority() {
        return priority;
    }

    @PropertyName("priority")
    public void setPriority(String priority) {
        this.priority = priority;
    }

    @PropertyName("Documents")
    public String getDocuments() {
        return documents;
    }

    @PropertyName("Documents")
    public void setDocuments(String documents) {
        this.documents = documents;
    }
}
