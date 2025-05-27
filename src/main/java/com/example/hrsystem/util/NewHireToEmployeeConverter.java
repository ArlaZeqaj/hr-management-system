package com.example.hrsystem.util;

import com.example.hrsystem.model.NewHire;

import java.util.HashMap;
import java.util.Map;

public class NewHireToEmployeeConverter {

    public static Map<String, Object> convert(NewHire hire) {
        Map<String, Object> employeeData = new HashMap<>();

        // Use name and surname directly — no fullName
        employeeData.put("name", hire.getName());
        employeeData.put("surname", hire.getSurname());
        employeeData.put("email", hire.getEmail());
        employeeData.put("department", hire.getDepartment());
        employeeData.put("position", hire.getRoleTitle());
        employeeData.put("phoneNr", hire.getPhoneNr());
        employeeData.put("priority", hire.getPriority());

        // Optional fields
        employeeData.put("birthDate", hire.getBirthDate());
        employeeData.put("education", hire.getEducation());
        employeeData.put("languages", hire.getLanguages());
        employeeData.put("workHistory", hire.getWorkHistory());

        // Default or placeholder values
        employeeData.put("avatarURL", "https://i.pinimg.com/564x/a4/79/36/a47936f449be9aeaa3c98d3e096ddff5.jpg");
        employeeData.put("joinDate", System.currentTimeMillis());
        employeeData.put("grossSalary", 45000);
        employeeData.put("organization", "Cloud");
        employeeData.put("posts", 10);
        employeeData.put("storageTotal", 110);
        employeeData.put("storageUsed", 30);

        // Notifications defaults
        Map<String, Boolean> notifications = new HashMap<>();
        notifications.put("buyerReviews", false);
        notifications.put("companyNews", false);
        notifications.put("itemComments", false);
        notifications.put("itemUpdates", false);
        notifications.put("meetupsNearYou", false);
        notifications.put("newFollowersEmail", false);
        notifications.put("newLaunches", false);
        notifications.put("newsletter", false);
        notifications.put("productChanges", false);
        notifications.put("ratingReminders", false);

        employeeData.put("notifications", notifications);

        return employeeData;
    }
}
