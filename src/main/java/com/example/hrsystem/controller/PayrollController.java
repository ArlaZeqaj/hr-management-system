package com.example.hrsystem.controller;

import com.example.hrsystem.dto.PayrollDTO;
import com.example.hrsystem.model.Employee;
import com.example.hrsystem.service.EmployeeService;
import com.example.hrsystem.service.FirebaseAuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.example.hrsystem.service.PayrollService;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;

import java.time.LocalDate;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class PayrollController {
    @Autowired
    private PayrollService payrollService;

    @GetMapping("/payroll")
    public ResponseEntity<PayrollDTO> getPayroll(Authentication authentication) {
        String uid = (String) authentication.getPrincipal(); // UID from FirebaseTokenFilter
        return ResponseEntity.ok(payrollService.getPayrollForCurrentMonth(uid));
    }



}
