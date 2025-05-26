package com.example.hrsystem.controller;

import com.example.hrsystem.service.DocumentService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/documents")
public class DocumentController {

    @Autowired
    private DocumentService documentService;


    @GetMapping("/{uid}")
    public List<Map<String, Object>> getUserDocuments(@PathVariable String uid) throws Exception {
        return documentService.getDocumentsForUser(uid);
    }
    @DeleteMapping("/{uid}/{docId}")
    public ResponseEntity<Map<String, String>> deleteDocument(
            @PathVariable String uid,
            @PathVariable String docId
    ) {
        try {
            documentService.deleteDocument(uid, docId);
            return ResponseEntity.ok(Map.of("message", "Document deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadDocument(
            @RequestParam("files") MultipartFile[] files,
            @RequestParam("category") String category,
            @RequestParam("userId") String userId,
            HttpServletRequest request
    ) throws Exception {
        List<Map<String, String>> uploadedFiles = documentService.uploadDocuments(files, category, userId);
        return ResponseEntity.ok(Map.of("message", "Files uploaded successfully", "count", String.valueOf(uploadedFiles.size())));
    }

    @PatchMapping("/{uid}/{docId}/star")
    public void toggleStar(
            @PathVariable String uid,
            @PathVariable String docId,
            @RequestBody Map<String, Object> payload
    ) throws Exception {
        documentService.updateStarStatus(uid, docId, (boolean) payload.get("starred"));
    }
    @PostMapping("/{uid}/generate")
    public ResponseEntity<Void> generateSampleDocuments(@PathVariable String uid) throws Exception {
        documentService.generateSampleDocs(uid);
        return ResponseEntity.ok().build();
    }

}
