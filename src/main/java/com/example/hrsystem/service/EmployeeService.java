package com.example.hrsystem.service;

import com.example.hrsystem.model.Employee;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.cloud.firestore.WriteResult;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.stereotype.Service;
import com.google.cloud.firestore.*;
import java.util.List;
import java.util.concurrent.ExecutionException;
import org.springframework.beans.factory.annotation.Autowired;
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

    public List<Employee> getAllEmployeesList() throws ExecutionException, InterruptedException {
        Firestore firestore = FirestoreClient.getFirestore();
        ApiFuture<QuerySnapshot> future = firestore.collection("employees").get();
        List<QueryDocumentSnapshot> documents = future.get().getDocuments();
        return documents.stream().map(doc -> doc.toObject(Employee.class)).collect(Collectors.toList());
    }

    public Employee getEmployeeByIdCollection(String id) throws ExecutionException, InterruptedException {
        Firestore firestore = FirestoreClient.getFirestore();
        DocumentSnapshot doc = firestore.collection("employees").document(id).get().get();
        return doc.exists() ? doc.toObject(Employee.class) : null;
    }

    public String saveEmployee(Employee employee) throws ExecutionException, InterruptedException {
        Firestore firestore = FirestoreClient.getFirestore();
        ApiFuture<WriteResult> result = firestore.collection("employees").document(employee.getId()).set(employee);
        return result.get().getUpdateTime().toString();
    }

    public void deleteEmployee(String id) {
        Firestore firestore = FirestoreClient.getFirestore();
        firestore.collection("employees").document(id).delete();
    }

    public long countEmployees() throws ExecutionException, InterruptedException {
        Firestore firestore = FirestoreClient.getFirestore();
        ApiFuture<QuerySnapshot> future = firestore.collection("employees").get();
        return future.get().getDocuments().size();
    }
}
