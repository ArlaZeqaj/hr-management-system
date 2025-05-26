package com.example.hrsystem.model;

import com.google.cloud.firestore.annotation.PropertyName;

import java.util.List;

public class NewHire {

    private String docId;
    private String department;
    private String roleTitle;
    private String status;
    private String email;
    private String phoneNr;
    private String priority;
    private String documents;

    private String name;
    private String surname;
    private String birthDate;
    private String education;
    private List<String> languages;
    private List<String> workHistory;

    public NewHire() {
        // Required by Firestore
    }

    public String getDocId() {
        return docId;
    }

    public void setDocId(String docId) {
        this.docId = docId;
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

    @PropertyName("name")
    public String getName() {
        return name;
    }

    @PropertyName("name")
    public void setName(String name) {
        this.name = name;
    }

    @PropertyName("surname")
    public String getSurname() {
        return surname;
    }

    @PropertyName("surname")
    public void setSurname(String surname) {
        this.surname = surname;
    }

    @PropertyName("birthDate")
    public String getBirthDate() {
        return birthDate;
    }

    @PropertyName("birthDate")
    public void setBirthDate(String birthDate) {
        this.birthDate = birthDate;
    }

    @PropertyName("education")
    public String getEducation() {
        return education;
    }

    @PropertyName("education")
    public void setEducation(String education) {
        this.education = education;
    }

    @PropertyName("languages")
    public List<String> getLanguages() {
        return languages;
    }

    @PropertyName("languages")
    public void setLanguages(List<String> languages) {
        this.languages = languages;
    }

    @PropertyName("workHistory")
    public List<String> getWorkHistory() {
        return workHistory;
    }

    @PropertyName("workHistory")
    public void setWorkHistory(List<String> workHistory) {
        this.workHistory = workHistory;
    }
}
