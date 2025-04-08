package com.example.hrsystem.service;

import com.example.hrsystem.model.Employee;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.ExecutionException;

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
}
