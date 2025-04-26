package com.example.hrsystem.controller;

import com.example.hrsystem.dto.PayrollDTO;
import com.example.hrsystem.service.FirebaseAuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import com.example.hrsystem.service.PayrollService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
