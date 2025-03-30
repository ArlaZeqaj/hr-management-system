package com.example.hrsystem.controller;

import org.springframework.web.bind.annotation.*;
import com.example.hrsystem.model.Employee;
import com.example.hrsystem.service.EmployeeService;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

    private final EmployeeService employeeService;

    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/random")
    public Employee getRandomEmployee() {
        return employeeService.getRandomEmployee();
    }
}
