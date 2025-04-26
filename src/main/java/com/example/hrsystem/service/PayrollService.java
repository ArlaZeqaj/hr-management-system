package com.example.hrsystem.service;

import com.example.hrsystem.dto.PayrollDTO;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
@Service
public class PayrollService {

    private final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM");

    public PayrollDTO getPayrollForCurrentMonth(String uid) {
        try {
            Firestore db = FirestoreClient.getFirestore();

            // Get current month like "2025-04"
            String currentMonth = LocalDate.now().format(formatter);

            // Reference to /employees/{uid}/payroll/{currentMonth}
            ApiFuture<DocumentSnapshot> future = db
                    .collection("employees")
                    .document(uid)
                    .collection("payroll")
                    .document(currentMonth)
                    .get();

            DocumentSnapshot document = future.get();

            PayrollDTO payrollDTO = new PayrollDTO();
            payrollDTO.setMonth(currentMonth);

            if (document.exists()) {
                Double netSalary = document.getDouble("netSalary");
                payrollDTO.setNetSalary(netSalary != null ? netSalary : 0.0);
            } else {
                payrollDTO.setNetSalary(0.0);
            }

            return payrollDTO;

        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch payroll", e);
        }
    }
}
