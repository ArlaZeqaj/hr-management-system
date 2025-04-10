package com.example.hrsystem.controller;

import com.example.hrsystem.model.Project;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/projects")

public class ProjectController {

    private final Firestore db = FirestoreClient.getFirestore();

    @GetMapping
    public List<Project> getProjects() throws Exception {
        List<Project> projects = new ArrayList<>();
        ApiFuture<QuerySnapshot> future = db.collection("projects").get();
        for (DocumentSnapshot doc : future.get().getDocuments()) {
            projects.add(doc.toObject(Project.class));
        }
        return projects;
    }
}
