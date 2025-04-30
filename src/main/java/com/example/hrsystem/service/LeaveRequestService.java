package com.example.hrsystem.service;

import com.example.hrsystem.dto.LeaveRequest;
import com.example.hrsystem.dto.LeaveRequestPayload;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.*;
import java.util.concurrent.ExecutionException;

@Service
public class LeaveRequestService {

    private static final String EMPLOYEES = "employees";
    private static final String SUBCOLLECTION = "leaveRequests";

    public LeaveRequest createLeaveRequest(String uid, LeaveRequestPayload payload) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();

        // Generate a new document ID
        DocumentReference docRef = db
                .collection(EMPLOYEES)
                .document(uid)
                .collection(SUBCOLLECTION)
                .document();
        String requestId = docRef.getId();

        // Build the map
        Map<String,Object> data = new HashMap<>();
        data.put("startDate", payload.getStartDate());
        data.put("endDate", payload.getEndDate());
        data.put("leaveType", payload.getLeaveType());
        data.put("status", "submitted");
        data.put("submittedAt", Instant.now().toString());

        // Write to Firestore
        ApiFuture<WriteResult> writeResult = docRef.set(data);
        writeResult.get();  // wait for completion

        // Return DTO
        LeaveRequest lr = new LeaveRequest();
        lr.setId(requestId);
        lr.setStartDate(payload.getStartDate());
        lr.setEndDate(payload.getEndDate());
        lr.setLeaveType(payload.getLeaveType());
        lr.setStatus("submitted");
        lr.setSubmittedAt(data.get("submittedAt").toString());
        return lr;
    }

    public List<LeaveRequest> listLeaveRequests(String uid) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();

        CollectionReference coll = db
                .collection(EMPLOYEES)
                .document(uid)
                .collection(SUBCOLLECTION);

        ApiFuture<QuerySnapshot> future = coll.get();
        List<QueryDocumentSnapshot> docs = future.get().getDocuments();

        List<LeaveRequest> list = new ArrayList<>();
        for (QueryDocumentSnapshot d : docs) {
            LeaveRequest lr = new LeaveRequest();
            lr.setId(d.getId());
            lr.setStartDate(d.getString("startDate"));
            lr.setEndDate(d.getString("endDate"));
            lr.setLeaveType(d.getString("leaveType"));
            lr.setStatus(d.getString("status"));
            lr.setSubmittedAt(d.getString("submittedAt"));
            list.add(lr);
        }
        return list;
    }
}
