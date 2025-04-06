package com.example.hrsystem.service;

import com.example.hrsystem.model.Employee;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.ExecutionException;

@Service
public class EmployeeService {

    private final Firestore db;

    public EmployeeService() {
        this.db = FirestoreClient.getFirestore();
    }

    // Fetch a single employee by ID
    public Employee getEmployeeById(String employeeId) throws ExecutionException, InterruptedException {
        DocumentReference docRef = db.collection("employees").document(employeeId);
        DocumentSnapshot documentSnapshot = docRef.get().get();

        if (documentSnapshot.exists()) {
            return documentSnapshot.toObject(Employee.class);
        } else {
            return null;
        }
    }

    // Fetch all employees from the 'employees' collection
    public List<Employee> getAllEmployees() throws ExecutionException, InterruptedException {
        return db.collection("employees").get().get().toObjects(Employee.class);
    }


}
