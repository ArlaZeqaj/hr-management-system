package com.example.hrsystem.service;

import com.example.hrsystem.model.Employee;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

@Service
public class EmployeeService {

    private final RetrieveProfile retrieveProfile;


    public EmployeeService(RetrieveProfile retrieveProfile) {
        this.retrieveProfile = retrieveProfile;
    }

    public Employee getEmployeeByEmail(String email) throws ExecutionException, InterruptedException {
        return retrieveProfile.getEmployeeByEmail(email);
    }

    //po e ruaj per me vone sepse dhe dokument id do na duhet
    public Employee getEmployeeById(String employee_Id) throws ExecutionException, InterruptedException {
        return retrieveProfile.getEmployeeByDocumentId(employee_Id);
    }

    public List<Employee> getAllEmployees() throws ExecutionException, InterruptedException {
        return retrieveProfile.getAllEmployees();
    }
    public boolean updateEmployeeFields(String id, Employee updatedFields) throws ExecutionException, InterruptedException {
        return retrieveProfile.updateEmployeeFields(id, updatedFields);
    }
    public List<Map<String, Object>> getAllEmployeesBasicInfo() throws ExecutionException, InterruptedException {
        return retrieveProfile.getAllEmployees().stream()
                .map(emp -> {
                    Map<String, Object> info = new HashMap<>();
                    info.put("id", emp.getId());
                    info.put("name", emp.getName());
                    info.put("email", emp.getEmail());
                    info.put("department", emp.getDepartment());
                    return info;
                })
                .collect(Collectors.toList());
    }


}
