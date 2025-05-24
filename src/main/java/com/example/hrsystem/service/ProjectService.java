package com.example.hrsystem.service;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.stereotype.Service;

import java.util.*;


@Service
public class ProjectService {
    // Method to get all projects assigned to a user
    public List<Map<String, Object>> getAllProjectsForUser(String uid) throws Exception {
        Firestore db = FirestoreClient.getFirestore();
        CollectionReference projectsRef = db.collection("Project");

        // Query to get all projects assigned to the user
        Query query = projectsRef.whereArrayContains("assigned_id", uid);

        ApiFuture<QuerySnapshot> future = query.get();
        List<QueryDocumentSnapshot> documents = future.get().getDocuments();

        List<Map<String, Object>> allProjects = new ArrayList<>();

        // Process the documents and extract project data
        for (DocumentSnapshot doc : documents) {
            System.out.println("Firestore document data: " + doc.getData());  // Log the raw document data
            Map<String, Object> projectData = new HashMap<>();
            projectData.put("project_Name", doc.getString("project_Name"));
            projectData.put("description", doc.getString("description"));
            projectData.put("role", doc.getString("role"));
            projectData.put("status", doc.getString("status"));
            projectData.put("start_Date", doc.getString("start_Date"));
            projectData.put("end_Date", doc.getString("end_Date"));
            projectData.put("budget", doc.getString("budget"));
            projectData.put("image", doc.getString("image"));
            projectData.put("company_img", doc.getString("company_img"));

            allProjects.add(projectData);
        }



        return allProjects;
    }

    public Map<String, Integer> getProjectStatusSummaryForUser(String uid) throws Exception {
        System.out.println("🔔 getProjectStatusSummaryForUser called with uid: " + uid);

        Firestore db = FirestoreClient.getFirestore();

        // 🔍 Query: all projects where assigned_id == user's UID
        System.out.println("🔍 Building query for assigned_id == " + uid);
        CollectionReference projectsRef = db.collection("Project");
        Query query = projectsRef.whereArrayContains("assigned_id", uid);

        System.out.println("⌛ Executing query...");
        ApiFuture<QuerySnapshot> future = query.get();
        List<QueryDocumentSnapshot> documents = future.get().getDocuments();
        System.out.println("✅ Query returned " + documents.size() + " documents");

        // 🧮 Count statuses
        int done = 0, ongoing = 0, canceled = 0, upcoming = 0;
        for (DocumentSnapshot doc : documents) {
            String docId = doc.getId();
            String status = doc.getString("status");
            System.out.println("  • Doc ID=" + docId + " → status=\"" + status + "\"");

            if (status == null) {
                System.out.println("    ⚠️ status is null, skipping");
                continue;
            }

            switch (status) {
                case "Done":
                    done++;
                    break;
                case "Ongoing":
                    ongoing++;
                    break;
                case "Canceled":
                    canceled++;
                    break;
                case "Upcoming":
                    upcoming++;
                    break;
                default:
                    System.out.println("    ⚠️ Unrecognized status: " + status);
            }
        }

        System.out.println("📊 Counts: Done=" + done
                + ", Ongoing=" + ongoing
                + ", Canceled=" + canceled
                + ", Upcoming=" + upcoming);

        // ✅ Build result map
        Map<String, Integer> result = new HashMap<>();
        result.put("done", done);
        result.put("ongoing", ongoing);
        result.put("canceled", canceled);
        result.put("upcoming", upcoming);
        result.put("total", documents.size());

        System.out.println("🚀 Returning summary: " + result);
        return result;
    }
    public List<Map<String, Object>> getAllProjects() {
        Firestore db = FirestoreClient.getFirestore();

        List<Map<String, Object>> projects = new ArrayList<>();
        ApiFuture<QuerySnapshot> future = db.collection("Project").get();

        try {
            List<QueryDocumentSnapshot> documents = future.get().getDocuments();
            for (QueryDocumentSnapshot doc : documents) {
                Map<String, Object> data = doc.getData();
                data.put("id", doc.getId()); // Add doc ID if needed
                projects.add(data);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return projects;
    }
    public Map<String, Object> createProject(Map<String, Object> request) {
        try {
            // Validation
            if (!request.containsKey("assigned_id") || !request.containsKey("assigned_Employees")) {
                throw new IllegalArgumentException("Missing 'assigned_id' or 'assigned_Employees'");
            }

            // Set payment date from backend side
            request.put("paymentDate", new Date());
            Firestore db = FirestoreClient.getFirestore();

            // Add the document
            DocumentReference docRef = db.collection("Project").document();
            request.put("id", docRef.getId());
            docRef.set(request);

            return request;

        } catch (Exception e) {
            throw new RuntimeException("Failed to create project", e);
        }
    }
    public void updateProject(String id, Map<String, Object> updatedData) throws Exception {
        Firestore firestore = FirestoreClient.getFirestore();
        DocumentReference docRef = firestore.collection("Project").document(id);

        // Optional: clean unwanted keys like id or paymentDate
        updatedData.remove("id");
        updatedData.remove("paymentDate");

        // Convert string dates to Firestore-friendly format if needed (optional)

        docRef.update(updatedData);
    }
    public void updateProjectStatus(String id, String status) throws Exception {
        Firestore firestore = FirestoreClient.getFirestore();

        DocumentReference docRef = firestore.collection("Project").document(id);
        ApiFuture<WriteResult> future = docRef.update("status", status);
        future.get(); // wait for update
    }

    public void deleteProject(String id) throws Exception {
        Firestore firestore = FirestoreClient.getFirestore();

        DocumentReference docRef = firestore.collection("Project").document(id);
        ApiFuture<WriteResult> future = docRef.delete();
        future.get(); // wait for deletion
    }

}

