package com.example.hrsystem.service;

import com.example.hrsystem.model.Employee;
import com.google.api.core.ApiFuture;
import com.google.cloud.Timestamp;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.*;
import java.util.concurrent.ExecutionException;

@Service
public class RetrieveProfile {

    private static final String COLLECTION_NAME = "employees";

    public Employee getEmployeeByEmail(String email) throws ExecutionException, InterruptedException {
        System.out.println("🫖 Debug Tea: getEmployeeByEmail called with email: " + email);
        Firestore db = FirestoreClient.getFirestore();

        Query query = db.collection(COLLECTION_NAME)
                .whereEqualTo("email", email)
                .limit(1);

        ApiFuture<QuerySnapshot> querySnapshot = query.get();
        List<QueryDocumentSnapshot> documents = querySnapshot.get().getDocuments();

        System.out.println("🫖 Debug Tea: Query returned " + documents.size() + " documents");

        if (!documents.isEmpty()) {
            Employee emp = documents.get(0).toObject(Employee.class);
            System.out.println("🫖 Debug Tea: Found employee: " + emp);
            return emp;
        }

        System.out.println("🫖 Debug Tea: No employee found with email: " + email);
        return null;
    }

    public Employee getEmployeeByDocumentId(String documentId) throws ExecutionException, InterruptedException {
        System.out.println("🫖 Debug Tea: getEmployeeByDocumentId called with ID: " + documentId);
        Firestore firestore = FirestoreClient.getFirestore();
        DocumentReference docRef = firestore.collection(COLLECTION_NAME).document(documentId);
        ApiFuture<DocumentSnapshot> future = docRef.get();
        DocumentSnapshot document = future.get();

        if (document.exists()) {
            Employee emp = document.toObject(Employee.class);
            System.out.println("🫖 Debug Tea: Document exists. Employee loaded: " + emp);
            return emp;
        }

        System.out.println("🫖 Debug Tea: No document found for ID: " + documentId);
        return null;
    }

    public List<Employee> getAllEmployees() throws ExecutionException, InterruptedException {
        System.out.println("🫖 Debug Tea: getAllEmployees called");
        Firestore db = FirestoreClient.getFirestore();
        ApiFuture<QuerySnapshot> future = db.collection(COLLECTION_NAME).get();
        List<QueryDocumentSnapshot> documents = future.get().getDocuments();

        if (documents.isEmpty()) {
            System.out.println("🫖 Debug Tea: ⚠️ Collection '" + COLLECTION_NAME + "' is empty!");
            return Collections.emptyList();
        }

        List<Employee> employees = new ArrayList<>();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

        for (QueryDocumentSnapshot doc : documents) {
            Map<String, Object> data = doc.getData();
            System.out.println("🫖 Debug Tea: Raw Firestore doc data: " + data);

            try {
                Employee emp = new Employee();
                emp.setId(doc.getId());
                emp.setName((String) data.get("Name"));
                emp.setSurname((String) data.get("Surname"));
                emp.setEmail((String) data.get("email"));
                emp.setDepartment((String) data.get("Department"));
                emp.setPosition((String) data.get("Position"));
                emp.setBio((String) data.get("Bio"));
                emp.setPhoneNumber((String) data.get("Phone Number"));
                emp.setAddress((String) data.get("Address"));
                emp.setAvatarURL((String) data.get("avatarURL"));
                emp.setEducation((String) data.get("education"));
                emp.setLanguages((List<String>) data.get("languages"));

                Timestamp joinDateTs = (Timestamp) data.get("joinDate");
                if (joinDateTs != null) {
                    emp.setJoinDate(sdf.format(joinDateTs.toDate()));
                }

                employees.add(emp);
                System.out.println("🫖 Debug Tea: ✅ Added employee: " + emp.getName());
            } catch (Exception e) {
                System.out.println("🫖 Debug Tea: 💥 Failed mapping document: " + doc.getId());
                e.printStackTrace();
            }
        }

        return employees;
    }



    public boolean updateEmployeeFields(String id, Employee updatedFields) throws ExecutionException, InterruptedException {
        System.out.println("🫖 Debug Tea: updateEmployeeFields called with ID: " + id);
        Firestore db = FirestoreClient.getFirestore();
        DocumentReference docRef = db.collection(COLLECTION_NAME).document(id);

        Map<String, Object> updates = new HashMap<>();

        if (updatedFields.getName() != null) {
            updates.put("Name", updatedFields.getName());
            System.out.println("🫖 Debug Tea: Updating name -> " + updatedFields.getName());
        }
        if (updatedFields.getSurname() != null) {
            updates.put("Surname", updatedFields.getSurname());
            System.out.println("🫖 Debug Tea: Updating surname -> " + updatedFields.getSurname());
        }
        if (updatedFields.getDepartment() != null) {
            updates.put("Department", updatedFields.getDepartment());
            System.out.println("🫖 Debug Tea: Updating department -> " + updatedFields.getDepartment());
        }
        if (updatedFields.getPosition() != null) {
            updates.put("Position", updatedFields.getPosition());
            System.out.println("🫖 Debug Tea: Updating position -> " + updatedFields.getPosition());
        }
        if (updatedFields.getBio() != null) {
            updates.put("Bio", updatedFields.getBio());
            System.out.println("🫖 Debug Tea: Updating bio -> " + updatedFields.getBio());
        }
        if (updatedFields.getPhoneNumber() != null) {
            updates.put("Phone Number", updatedFields.getPhoneNumber());
            System.out.println("🫖 Debug Tea: Updating phone number -> " + updatedFields.getPhoneNumber());
        }
        if (updatedFields.getAddress() != null) {
            updates.put("Address", updatedFields.getAddress());
            System.out.println("🫖 Debug Tea: Updating address -> " + updatedFields.getAddress());
        }

        if (updates.isEmpty()) {
            System.out.println("🫖 Debug Tea: No fields to update");
            return false;
        }

        ApiFuture<WriteResult> writeResult = docRef.update(updates);
        WriteResult result = writeResult.get();
        System.out.println("🫖 Debug Tea: Update success at " + result.getUpdateTime());

        return true;
    }
}
