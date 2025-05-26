package com.example.hrsystem.service;

import com.example.hrsystem.dto.PayrollDTO;
import com.example.hrsystem.model.Employee;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;

@Service
public class PayrollService {

    private final Firestore firestore = FirestoreClient.getFirestore();

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
    public void processPayrollByDepartment(String department) throws ExecutionException, InterruptedException {
        List<Employee> employees = getEmployeesByDepartment(department);

        LocalDate now = LocalDate.now();
        LocalDate dueDate = now.withDayOfMonth(7).plusMonths(1);

        for (Employee employee : employees) {
            Map<String, Object> payrollData = new HashMap<>();
            payrollData.put("employeeId", employee.getId());
            payrollData.put("employeeName", employee.getName());
            payrollData.put("department", employee.getDepartament());
            payrollData.put("grossSalary", employee.getGrossSalary());
            payrollData.put("paymentDate", now.toString());
            payrollData.put("dueDate", dueDate.toString());
            payrollData.put("status", "processed");

            firestore.collection("payrolls").add(payrollData);
        }
    }

    private List<Employee> getEmployeesByDepartment(String department) throws ExecutionException, InterruptedException {
        List<Employee> employees = new ArrayList<>();
        ApiFuture<QuerySnapshot> future = firestore.collection("employees")
                .whereEqualTo("departament", department)
                .get();

        List<QueryDocumentSnapshot> documents = future.get().getDocuments();
        for (QueryDocumentSnapshot doc : documents) {
            employees.add(doc.toObject(Employee.class));
        }
        return employees;
    }
    public Map<String, Double> getPayrollSummaryByDepartment() {
        Map<String, Double> summary = new HashMap<>();

        try {
            ApiFuture<QuerySnapshot> future = firestore.collection("employees").get();
            List<QueryDocumentSnapshot> documents = future.get().getDocuments();

            for (QueryDocumentSnapshot doc : documents) {
                Employee employee = doc.toObject(Employee.class);
                String department = employee.getDepartament();
                double grossSalary = employee.getGrossSalary();

                summary.put(department, summary.getOrDefault(department, 0.0) + grossSalary);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return summary;
    }
}
