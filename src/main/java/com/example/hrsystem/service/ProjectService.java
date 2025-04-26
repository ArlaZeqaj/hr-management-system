package com.example.hrsystem.service;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
@Service
public class ProjectService {
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
    }}
