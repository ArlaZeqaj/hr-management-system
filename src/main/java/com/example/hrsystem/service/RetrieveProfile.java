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

        try {
            Query query = db.collection(COLLECTION_NAME)
                    .whereEqualTo("email", email)
                    .limit(1);

            ApiFuture<QuerySnapshot> querySnapshot = query.get();
            QuerySnapshot snapshot = querySnapshot.get();
            List<QueryDocumentSnapshot> documents = snapshot.getDocuments();

            System.out.println("🫖 Debug Tea: Query returned " + documents.size() + " documents");

            if (documents.isEmpty()) {
                System.out.println("🫖 Debug Tea: No employee found with email: " + email);
                return null;
            }

            QueryDocumentSnapshot doc = documents.get(0);
            Map<String, Object> data = doc.getData();
            System.out.println("🫖 Debug Tea: Raw document data: " + data);

            // Manual mapping like in getAllEmployees()
            Employee emp = new Employee();
            emp.setId(doc.getId());
            emp.setName((String) data.get("name"));
            emp.setSurname((String) data.get("surname"));
            emp.setEmail((String) data.get("email"));
            emp.setDepartment((String) data.get("department"));
            emp.setPosition((String) data.get("position"));
            emp.setBio((String) data.get("bio"));
            emp.setBirthDate((String) data.get("birthDate"));
            emp.setAvatarURL((String) data.get("avatarURL"));
            emp.setEducation((String) data.get("education"));
            emp.setOrganization((String) data.get("organization"));

            // Handle languages array
            List<Object> rawLangs = (List<Object>) data.get("languages");
            if (rawLangs != null) {
                List<String> languages = new ArrayList<>();
                for (Object o : rawLangs) {
                    languages.add(o.toString());
                }
                emp.setLanguages(languages);
            }

            // Handle workHistory array
            List<Object> rawWorkHistory = (List<Object>) data.get("workHistory");
            if (rawWorkHistory != null) {
                List<String> workHistory = new ArrayList<>();
                for (Object o : rawWorkHistory) {
                    workHistory.add(o.toString());
                }
                emp.setWorkHistory(workHistory);
            }

            System.out.println("🫖 Debug Tea: Successfully mapped employee: " + emp);
            return emp;

        } catch (Exception e) {
            System.err.println("🔥 Error in getEmployeeByEmail: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
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
                emp.setName((String) data.get("name"));
                emp.setSurname((String) data.get("surname"));
                emp.setEmail((String) data.get("email"));
                emp.setDepartment((String) data.get("department"));
                emp.setPosition((String) data.get("position"));
                emp.setBio((String) data.get("bio"));
                emp.setBirthDate((String) data.get("birthDate"));
                emp.setPhoneNumber((String) data.get("phoneNumber"));
                emp.setAddress((String) data.get("address"));
                emp.setAvatarURL((String) data.get("avatarURL"));
                emp.setEducation((String) data.get("education"));

                List<Object> rawLangs = (List<Object>) data.get("languages");
                if (rawLangs != null) {
                    List<String> languages = new ArrayList<>();
                    for (Object o : rawLangs) {
                        languages.add(o.toString());
                    }
                    emp.setLanguages(languages);
                }

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
            updates.put("name", updatedFields.getName());
        }
        if (updatedFields.getSurname() != null) {
            updates.put("surname", updatedFields.getSurname());
        }
        if (updatedFields.getDepartment() != null) {
            updates.put("department", updatedFields.getDepartment());
        }
        if (updatedFields.getPosition() != null) {
            updates.put("position", updatedFields.getPosition());
        }
        if (updatedFields.getBio() != null) {
            updates.put("bio", updatedFields.getBio());
        }
        if (updatedFields.getPhoneNumber() != null) {
            updates.put("phoneNumber", updatedFields.getPhoneNumber());
        }
        if (updatedFields.getAddress() != null) {
            updates.put("address", updatedFields.getAddress());
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
