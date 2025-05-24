package com.example.hrsystem.model;

import com.google.cloud.firestore.annotation.DocumentId;
import com.google.cloud.firestore.annotation.PropertyName;

import java.util.List;

public class Employee {
    @DocumentId
    private String id;

    @PropertyName("employee_ID")
    private String employeeID;

    @PropertyName("Name")
    private String name;

    @PropertyName("Surname")
    private String surname;

    @PropertyName("Email")
    private String email;

    @PropertyName("Phone Number")
    private String phoneNumber;

    @PropertyName("Address")
    private String address;

    @PropertyName("Education")
    private String education;

    @PropertyName("Department")
    private String departament;
    @PropertyName("grossSalary")
    private int grossSalary;

    @PropertyName("Work History")
    private List<String> workHistory;

    @PropertyName("Gender")
    private String gender;


    @PropertyName("Lanuages")
    private List<String> languages;

    @PropertyName("Birth Date")
    private String birthDate;

    @PropertyName("Organization")
    private String organization;


    @PropertyName("Joined Date")
    private String joinedDate;

    @PropertyName("Bio")
    private String bio;

    @PropertyName("Position")
    private String position;


    @PropertyName("Avatar Url")
    private String avatarURL;

    public String getAvatarURL() {
        return avatarURL;
    }

    public void setAvatarURL(String avatarURL) {
        this.avatarURL = avatarURL;
    }

    // Getters and setters

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getEmployeeID() {
        return employeeID;
    }

    public void setEmployeeID(String employeeID) {
        this.employeeID = employeeID;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSurname() {
        return surname;
    }

    public String getOrganization() {
        return organization;
    }

    public void setOrganization(String organization) {
        this.organization = organization;
    }

    public String getEducation() {
        return education;
    }

    public void setEducation(String education) {
        this.education = education;
    }

    public String getDepartament() {
        return departament;
    }
    public int getGrossSalary() {
        return grossSalary;
    }

    public void setDepartament(String departament) {
        this.departament = departament;
    }
    public void setGrossSalary(int grossSalary) {
        this.grossSalary = grossSalary;
    }
    public List<String> getWorkHistory() {
        return workHistory;
    }

    public void setWorkHistory(List<String> workHistory) {
        this.workHistory = workHistory;
    }

    public List<String> getLanguages() {
        return languages;
    }

    public void setLanguages(List<String> languages) {
        this.languages = languages;
    }

    public void setSurname(String surname) {
        this.surname = surname;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public void setBio(String bio) {this.bio = bio;}

    public String getBio() {return bio;}

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getBirthDate() {
        return birthDate;
    }

    public void setBirthDate(String birthDate) {
        this.birthDate = birthDate;
    }

    public String getJoinedDate() {
        return joinedDate;
    }

    public void setJoinedDate(String joinedDate) {
        this.joinedDate = joinedDate;
    }

    public String getPosition() {
        return position;
    }

    public void setPosition(String position) {
        this.position = position;
    }


}


