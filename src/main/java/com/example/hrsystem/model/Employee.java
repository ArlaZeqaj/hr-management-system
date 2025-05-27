package com.example.hrsystem.model;

import com.google.cloud.firestore.annotation.DocumentId;
import com.google.cloud.firestore.annotation.PropertyName;

import java.util.List;
import java.util.Map;

public class Employee {
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    @DocumentId
    private String id;

    @PropertyName("name")
    private String name;

    public String getName1() {
        return name1;
    }

    public void setName1(String name1) {
        this.name1 = name1;
    }

    @PropertyName("Name")
    private String name1;

    public String getSurname() {
        return surname;
    }

    public void setSurname(String surname) {
        this.surname = surname;
    }

    @PropertyName("surname")
    private String surname;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    @PropertyName("email")
    private String email;

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    @PropertyName("Phone Number")
    private String phoneNumber;

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getEducation() {
        return education;
    }

    public void setEducation(String education) {
        this.education = education;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public int getGrossSalary() {
        return grossSalary;
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

    public String getBirthDate() {
        return birthDate;
    }

    public void setBirthDate(String birthDate) {
        this.birthDate = birthDate;
    }

    public String getOrganization() {
        return organization;
    }

    public void setOrganization(String organization) {
        this.organization = organization;
    }

    public String getPosition() {
        return position;
    }

    public void setPosition(String position) {
        this.position = position;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getAvatarURL() {
        return avatarURL;
    }

    public void setAvatarURL(String avatarURL) {
        this.avatarURL = avatarURL;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public int getStorageTotal() {
        return storageTotal;
    }

    public void setStorageTotal(int storageTotal) {
        this.storageTotal = storageTotal;
    }

    public double getStorageUsed() {
        return storageUsed;
    }

    public void setStorageUsed(double storageUsed) {
        this.storageUsed = storageUsed;
    }

    public Map<String, Object> getNotifications() {
        return notifications;
    }

    public void setNotifications(Map<String, Object> notifications) {
        this.notifications = notifications;
    }

    public String getEmployeeID() {
        return employeeID;
    }

    public void setEmployeeID(String employeeID) {
        this.employeeID = employeeID;
    }

    @PropertyName("address")
    private String address;

    @PropertyName("education")
    private String education;

    @PropertyName("department")
    private String department;



    public void setGrossSalary(int grossSalary) {
        this.grossSalary = grossSalary;
    }


    @PropertyName("grossSalary")
    private int grossSalary;

    @PropertyName("workHistory")
    private List<String> workHistory;

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    @PropertyName("gender")
    private String gender;

    @PropertyName("languages")
    private List<String> languages;

    @PropertyName("birthDate")
    private String birthDate;

    public String getJoinDate() {
        return joinDate;
    }

    public void setJoinDate(String joinDate) {
        this.joinDate = joinDate;
    }

    @PropertyName("joinDate")
    private String joinDate; // Or long if using Timestamp and converting in code

    @PropertyName("organization")
    private String organization;

    @PropertyName("position")
    private String position;

    @PropertyName("bio")
    private String bio;

    @PropertyName("avatarURL")
    private String avatarURL;

    @PropertyName("priority")
    private String priority;

    @PropertyName("storageTotal")
    private int storageTotal;

    @PropertyName("storageUsed")
    private double storageUsed;

    @PropertyName("notifications")
    private Map<String, Object> notifications;

    @PropertyName("employee_ID")
    private String employeeID;

    public Integer getPosts() {
        return posts;
    }

    public void setPosts(Integer posts) {
        this.posts = posts;
    }

    @PropertyName("posts")
    private Integer posts;

    public Employee() {}


    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}