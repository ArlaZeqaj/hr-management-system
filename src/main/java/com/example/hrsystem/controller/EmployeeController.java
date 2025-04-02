package com.example.hrsystem.controller;

import com.example.hrsystem.model.Employee;
import com.example.hrsystem.service.EmployeeService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.concurrent.ExecutionException;


@RestController
@RequestMapping("/api/employees")
@CrossOrigin(origins = "http://localhost:3000")


public class EmployeeController {

    private final EmployeeService service;

    public EmployeeController(EmployeeService employeeService) {
        this.service = employeeService;
    }

    @GetMapping
    public List<Employee> getAllEmployees() {
        try {
            return service.getAllEmployees();
        } catch (ExecutionException e) {
            throw new RuntimeException(e);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
    }
}
