package com.example.hrsystem.service;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
public class ProjectService {

    // 🔹 Get all projects assigned to a specific user
    public List<Map<String, Object>> getAllProjectsForUser(String uid) throws Exception {
        Firestore db = FirestoreClient.getFirestore();
        CollectionReference projectsRef = db.collection("Project");

        Query query = projectsRef.whereArrayContains("assigned_id", uid);
        ApiFuture<QuerySnapshot> future = query.get();
        List<QueryDocumentSnapshot> documents = future.get().getDocuments();

        List<Map<String, Object>> allProjects = new ArrayList<>();

        for (DocumentSnapshot doc : documents) {
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

    // 🔹 Status summary for a specific user
    public Map<String, Integer> getProjectStatusSummaryForUser(String uid) throws Exception {
        Firestore db = FirestoreClient.getFirestore();
        Query query = db.collection("Project").whereArrayContains("assigned_id", uid);

        ApiFuture<QuerySnapshot> future = query.get();
        List<QueryDocumentSnapshot> documents = future.get().getDocuments();

        return summarizeStatus(documents);
    }

    // 🔹 Status summary for all projects (no UID)
    public Map<String, Integer> getProjectStatusSummaryForAllUsers() throws Exception {
        Firestore db = FirestoreClient.getFirestore();
        CollectionReference projectsRef = db.collection("Project");

        ApiFuture<QuerySnapshot> future = projectsRef.get();
        List<QueryDocumentSnapshot> documents = future.get().getDocuments();

        return summarizeStatus(documents);
    }

    // 🔹 Helper method to summarize status counts
    private Map<String, Integer> summarizeStatus(List<QueryDocumentSnapshot> documents) {
        int done = 0, ongoing = 0, canceled = 0, upcoming = 0;

        for (DocumentSnapshot doc : documents) {
            String status = doc.getString("status");
            if (status == null) continue;

            switch (status.trim()) {
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
                    System.out.println("Unrecognized status: " + status);
            }
        }

        Map<String, Integer> result = new HashMap<>();
        result.put("done", done);
        result.put("ongoing", ongoing);
        result.put("canceled", canceled);
        result.put("upcoming", upcoming);
        result.put("total", documents.size());

        return result;
    }

    // 🔹 Get all projects from all users with status "Ongoing"
    public List<Map<String, Object>> getAllOngoingProjects() throws Exception {
        Firestore db = FirestoreClient.getFirestore();
        CollectionReference projectsRef = db.collection("Project");

        // Filter where status == "Ongoing"
        Query query = projectsRef.whereEqualTo("status", "Ongoing");
        ApiFuture<QuerySnapshot> future = query.get();
        List<QueryDocumentSnapshot> documents = future.get().getDocuments();

        List<Map<String, Object>> ongoingProjects = new ArrayList<>();

        for (DocumentSnapshot doc : documents) {
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
            projectData.put("assigned_id", doc.get("assigned_id")); // optionally return assigned users
            ongoingProjects.add(projectData);
        }

        return ongoingProjects;
    }


    public int countProjectsForEmployee(String employeeId, String yearMonth) throws Exception {
        Firestore db = FirestoreClient.getFirestore();

        // First get all projects assigned to this employee
        Query query = db.collection("Project").whereArrayContains("assigned_id", employeeId);
        ApiFuture<QuerySnapshot> future = query.get();
        List<QueryDocumentSnapshot> documents = future.get().getDocuments();

        // If no projects, return 0
        if (documents.isEmpty()) {
            return 0;
        }

        // Parse year and month from input (format: "YYYY-MM")
        String[] parts = yearMonth.split("-");
        int targetYear = Integer.parseInt(parts[0]);
        int targetMonth = Integer.parseInt(parts[1]);

        // Count projects that were active during the requested month
        int count = 0;
        for (DocumentSnapshot doc : documents) {
            // Note: Using the exact field names from your database
            String startDateStr = doc.getString("start_Date"); // or whatever your start date field is
            String endDateStr = doc.getString("end_Date"); // matches your database field

            // Skip if dates are missing
            if (startDateStr == null || endDateStr == null) {
                continue;
            }

            try {
                // Parse dates in the format they're stored in your database
                SimpleDateFormat dbDateFormat = new SimpleDateFormat("MM/dd/yyyy");
                Date startDate = dbDateFormat.parse(startDateStr);
                Date endDate = dbDateFormat.parse(endDateStr);

                // Create calendar instances for comparison
                Calendar startCal = Calendar.getInstance();
                startCal.setTime(startDate);
                Calendar endCal = Calendar.getInstance();
                endCal.setTime(endDate);

                // Get year and month components
                int startYear = startCal.get(Calendar.YEAR);
                int startMonth = startCal.get(Calendar.MONTH) + 1; // Months are 0-based
                int endYear = endCal.get(Calendar.YEAR);
                int endMonth = endCal.get(Calendar.MONTH) + 1;

                // Check if project was active during the requested month
                if ((targetYear > startYear || (targetYear == startYear && targetMonth >= startMonth)) &&
                        (targetYear < endYear || (targetYear == endYear && targetMonth <= endMonth))) {
                    count++;
                }
            } catch (ParseException e) {
                System.err.println("Error parsing date for project " + doc.getId() + ": " + e.getMessage());
                continue;
            }
        }

        return count;
    }
}
