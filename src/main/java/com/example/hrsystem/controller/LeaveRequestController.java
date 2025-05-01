// src/main/java/com/example/hrsystem/controller/LeaveRequestController.java
package com.example.hrsystem.controller;

import com.example.hrsystem.dto.LeaveRequest;
import com.example.hrsystem.dto.LeaveRequestPayload;
import com.example.hrsystem.service.LeaveRequestService;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leaves")
public class LeaveRequestController {

    @Autowired
    private LeaveRequestService service;

    private String extractUidFromHeader(String authHeader) throws Exception {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new IllegalArgumentException("Missing or invalid Authorization header");
        }
        String idToken = authHeader.substring(7);
        FirebaseToken decoded = FirebaseAuth.getInstance().verifyIdToken(idToken);
        return decoded.getUid();
    }

    @PostMapping
    public ResponseEntity<LeaveRequest> create(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody LeaveRequestPayload payload
    ) throws Exception {
        String uid = extractUidFromHeader(authHeader);
        LeaveRequest created = service.createLeaveRequest(uid, payload);
        return ResponseEntity.ok(created);
    }

    @GetMapping
    public ResponseEntity<List<LeaveRequest>> list(
            @RequestHeader("Authorization") String authHeader
    ) throws Exception {
        String uid = extractUidFromHeader(authHeader);
        List<LeaveRequest> leaves = service.listLeaveRequests(uid);
        return ResponseEntity.ok(leaves);
    }
    @PatchMapping("/{id}/cancel")
    public ResponseEntity<Void> cancelLeaveRequest(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable String id
    ) throws Exception {
        String uid = extractUidFromHeader(authHeader);
        service.cancelLeaveRequest(uid, id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/all")
    public ResponseEntity<List<LeaveRequest>> listAllForAdmin(
            @RequestHeader("Authorization") String authHeader
    ) throws Exception {
        return ResponseEntity.ok(service.listAllLeaveRequests());
    }


    @PatchMapping("/{employeeId}/{leaveRequestId}/approve")
    public ResponseEntity<Void> approve(
            @PathVariable String employeeId,
            @PathVariable String leaveRequestId
    ) throws Exception {
        service.updateLeaveStatus(employeeId, leaveRequestId, "approved");
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{employeeId}/{leaveRequestId}/reject")
    public ResponseEntity<Void> reject(
            @PathVariable String employeeId,
            @PathVariable String leaveRequestId
    ) throws Exception {
        service.updateLeaveStatus(employeeId, leaveRequestId, "rejected");
        return ResponseEntity.noContent().build();
    }

}
