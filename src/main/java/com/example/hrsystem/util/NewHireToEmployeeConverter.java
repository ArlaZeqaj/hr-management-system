package com.example.hrsystem.util;

import com.example.hrsystem.model.NewHire;

import java.util.HashMap;
import java.util.Map;

public class NewHireToEmployeeConverter {
    public static Map<String, Object> convert(NewHire hire) {
        Map<String, Object> employeeData = new HashMap<>();
        employeeData.put("name", hire.getFullName());
        employeeData.put("department", hire.getDepartment());
        employeeData.put("roleTitle", hire.getRoleTitle());
        employeeData.put("status", hire.getStatus());
        employeeData.put("email", hire.getEmail());
        employeeData.put("phoneNr", hire.getPhoneNr());
        employeeData.put("priority", hire.getPriority());
        employeeData.put("documents", hire.getDocuments());
        return employeeData;
    }

    
}
