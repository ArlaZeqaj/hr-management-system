package com.example.hrsystem.service;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.util.*;
import java.util.concurrent.ExecutionException;

@Service
public class DocumentService {

    public List<Map<String, Object>> getDocumentsForUser(String uid) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        CollectionReference docsRef = db.collection("employees").document(uid).collection("documents");

        ApiFuture<QuerySnapshot> future = docsRef.get();
        QuerySnapshot snapshot = future.get();

        List<Map<String, Object>> documents = new ArrayList<>();
        for (DocumentSnapshot doc : snapshot.getDocuments()) {
            Map<String, Object> data = doc.getData();
            data.put("id", doc.getId()); // Include Firestore ID for frontend operations
            documents.add(data);
        }

        return documents;
    }

    public List<Map<String, String>> uploadDocuments(MultipartFile[] files, String category, String userId) throws IOException {
        Firestore db = FirestoreClient.getFirestore();
        List<Map<String, String>> uploadedFiles = new ArrayList<>();

        for (MultipartFile file : files) {
            String originalFilename = file.getOriginalFilename();
            String fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String filename = UUID.randomUUID().toString() + fileExtension;


            String uploadDir = "uploads/";
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            Path filePath = uploadPath.resolve(filename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            Map<String, Object> docData = new HashMap<>();
            docData.put("name", originalFilename);
            docData.put("type", file.getContentType());
            docData.put("category", category);
            docData.put("starred", false);
            docData.put("url", "/" + uploadDir + filename);
            docData.put("formattedDate", LocalDate.now().toString());
            docData.put("size", formatFileSize(file.getSize()));
            docData.put("uploadedBy", userId);

            db.collection("employees")
                    .document(userId)
                    .collection("documents")
                    .document()
                    .set(docData);

            uploadedFiles.add(Map.of(
                    "originalName", originalFilename,
                    "storedName", filename,
                    "size", formatFileSize(file.getSize())
            ));
        }

        return uploadedFiles;
    }

    private String formatFileSize(long size) {
        if (size < 1024) return size + " B";
        if (size < 1024 * 1024) return (size / 1024) + " KB";
        return (size / (1024 * 1024)) + " MB";
    }

    public void updateStarStatus(String uid, String docId, boolean starred) {
        Firestore db = FirestoreClient.getFirestore();
        db.collection("employees")
                .document(uid)
                .collection("documents")
                .document(docId)
                .update("starred", starred);
    }
    public void generateSampleDocs(String uid) throws Exception {
        Firestore db = FirestoreClient.getFirestore();
        CollectionReference docRef = db.collection("employees").document(uid).collection("documents");

        List<Map<String, Object>> sampleDocs = List.of(
                Map.of("name", "Company_Policy.pdf", "type", "PDF", "category", "Company Policies", "starred", false, "url", "/uploads/sample1.pdf", "formattedDate", LocalDate.now().toString(), "size", "210 KB", "uploadedBy", uid),
                Map.of("name", "Payroll_March.xlsx", "type", "XLSX", "category", "Payroll", "starred", false, "url", "/uploads/sample2.xlsx", "formattedDate", LocalDate.now().toString(), "size", "120 KB", "uploadedBy", uid)
                // Add more samples if desired
        );

        for (Map<String, Object> doc : sampleDocs) {
            docRef.document().set(doc);
        }
    }

}
