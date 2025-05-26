package com.example.hrsystem.controller;

import com.example.hrsystem.model.Employee;
import com.example.hrsystem.service.EmployeeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/api/employees")
@CrossOrigin(origins = "http://localhost:3000")
public class EmployeeController {

    private final EmployeeService service;

    public EmployeeController(EmployeeService service) {
        this.service = service;
    }

    // Get employee by email (used in authentication)
    @GetMapping("/by-email")
    public ResponseEntity<Employee> getEmployeeByEmail(@RequestParam String email) {
        try {
            Employee employee = service.getEmployeeByEmail(email);
            return employee != null
                    ? ResponseEntity.ok(employee)
                    : ResponseEntity.notFound().build();
        } catch (ExecutionException | InterruptedException e) {
            return ResponseEntity.status(500).build();
        }
    }

    // Get all employees
    @GetMapping
    public ResponseEntity<List<Employee>> getAllEmployees() {
        try {
            return ResponseEntity.ok(service.getAllEmployees());
        } catch (ExecutionException | InterruptedException e) {
            return ResponseEntity.status(500).build();
        }
    }

    // Get employee by document ID
    @GetMapping("/{documentId}")
    public ResponseEntity<Employee> getEmployeeByDocumentId(@PathVariable String documentId) {
        try {
            Employee employee = service.getEmployeeById(documentId);
            return employee != null
                    ? ResponseEntity.ok(employee)
                    : ResponseEntity.notFound().build();
        } catch (ExecutionException | InterruptedException e) {
            return ResponseEntity.status(500).build();
        }
    }

    // Update specific fields of an employee
    @PatchMapping("/{id}")
    public ResponseEntity<String> updateEmployee(@PathVariable String id, @RequestBody Employee updatedFields) {
        try {
            boolean success = service.updateEmployeeFields(id, updatedFields);
            return success
                    ? ResponseEntity.ok("Employee updated successfully.")
                    : ResponseEntity.notFound().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }


    // Add a new employee
    /*
    @PostMapping
    public ResponseEntity<String> addEmployee(@RequestBody Employee employee) {
        try {
            service.saveEmployee(employee);
            return ResponseEntity.ok("Employee added successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }
    */


}
