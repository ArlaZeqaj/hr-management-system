package com.example.hrsystem.service;

import com.example.hrsystem.dto.LeaveRequest;
import com.example.hrsystem.dto.LeaveRequestPayload;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.concurrent.ExecutionException;

@Service
public class LeaveRequestService {

    private static final String EMPLOYEES = "employees";
    private static final String SUBCOLLECTION = "leaveRequests";
    private static final Map<String, Integer> ANNUAL_LIMITS = Map.of(
            "Vacation", 20,
            "LeaveWithoutPay", Integer.MAX_VALUE,
            "MedicalLeave", 15,
            "Remote", Integer.MAX_VALUE,
            "PregnancyLeave", 180,
            "SpecialLeave", 10
    );

    private void validateLeaveRequest(String uid, LeaveRequestPayload payload) throws Exception {
        Firestore db = FirestoreClient.getFirestore();

        String startStr = payload.getStartDate();
        String endStr = payload.getEndDate();
        String type = payload.getLeaveType();

        System.out.println("🔍 Validating leave request for UID: " + uid + ", Type: " + type);

        if (startStr == null || endStr == null || type == null) {
            throw new IllegalArgumentException("Start date, end date, and leave type must be provided.");
        }

        LocalDate start = LocalDate.parse(startStr);
        LocalDate end = LocalDate.parse(endStr);
        LocalDate today = LocalDate.now();

        System.out.println("Start: " + start + ", End: " + end + ", Today: " + today);

        if (start.isBefore(today)) {
            throw new IllegalArgumentException("Leave start date cannot be in the past.");
        }

        if (end.isBefore(start)) {
            throw new IllegalArgumentException("End date cannot be before start date.");
        }

        long daysRequested = ChronoUnit.DAYS.between(start, end) + 1;
        System.out.println("Days Requested: " + daysRequested);

        // 1. Check for overlap with approved leaves
        System.out.println("Checking for overlapping approved leaves...");
        CollectionReference coll = db.collection("employees").document(uid).collection("leaveRequests");
        ApiFuture<QuerySnapshot> future = coll.whereEqualTo("status", "approved").get();

        List<QueryDocumentSnapshot> docs = future.get().getDocuments();
        for (QueryDocumentSnapshot doc : docs) {
            LocalDate docStart = LocalDate.parse(doc.getString("startDate"));
            LocalDate docEnd = LocalDate.parse(doc.getString("endDate"));
            System.out.println("Approved Leave: " + docStart + " to " + docEnd);

            boolean overlaps = !(end.isBefore(docStart) || start.isAfter(docEnd));
            System.out.println("Overlaps: " + overlaps);
            if (overlaps) {
                throw new IllegalArgumentException("Leave request overlaps with existing approved leave.");
            }
        }

        // 2. Check annual quota
        int maxAllowed = ANNUAL_LIMITS.getOrDefault(type, 0);
        if (maxAllowed < Integer.MAX_VALUE) {
            int currentYear = start.getYear();
            long usedDays = 0;

            System.out.println("Checking annual quota for leave type: " + type);

            for (QueryDocumentSnapshot doc : docs) {
                if (!type.equals(doc.getString("leaveType"))) continue;
                LocalDate docStart = LocalDate.parse(doc.getString("startDate"));
                LocalDate docEnd = LocalDate.parse(doc.getString("endDate"));

                if (docStart.getYear() == currentYear) {
                    long docDays = ChronoUnit.DAYS.between(docStart, docEnd) + 1;
                    usedDays += docDays;
                    System.out.println("Used " + docDays + " days in " + currentYear);
                }
            }

            if (usedDays + daysRequested > maxAllowed) {
                System.out.println("❌ Quota exceeded: Used=" + usedDays + ", Requested=" + daysRequested + ", Max=" + maxAllowed);
                throw new IllegalArgumentException(
                        String.format("Annual limit exceeded for %s. Used: %d, Requested: %d, Limit: %d",
                                type, usedDays, daysRequested, maxAllowed)
                );
            }
        }
    }

    public LeaveRequest createLeaveRequest(String uid, LeaveRequestPayload payload) throws ExecutionException, InterruptedException {
        try {
            System.out.println("📤 Creating leave request for UID: " + uid);
            validateLeaveRequest(uid, payload);
        } catch (Exception e) {
            System.out.println("❌ Validation failed: " + e.getMessage());
            throw new RuntimeException(e);
        }

        Firestore db = FirestoreClient.getFirestore();
        DocumentReference docRef = db
                .collection(EMPLOYEES)
                .document(uid)
                .collection(SUBCOLLECTION)
                .document();
        String requestId = docRef.getId();

        Map<String,Object> data = new HashMap<>();
        data.put("startDate", payload.getStartDate());
        data.put("endDate", payload.getEndDate());
        data.put("leaveType", payload.getLeaveType());
        data.put("status", "submitted");
        data.put("submittedAt", Instant.now().toString());

        System.out.println("Request Data: " + data);
        System.out.println("Generated Request ID: " + requestId);

        ApiFuture<WriteResult> writeResult = docRef.set(data);
        writeResult.get();

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
        System.out.println("📄 Listing leave requests for UID: " + uid);

        Firestore db = FirestoreClient.getFirestore();
        CollectionReference coll = db
                .collection(EMPLOYEES)
                .document(uid)
                .collection(SUBCOLLECTION);

        ApiFuture<QuerySnapshot> future = coll.get();
        List<QueryDocumentSnapshot> docs = future.get().getDocuments();

        System.out.println("Found " + docs.size() + " leave requests.");

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

    public void cancelLeaveRequest(String uid, String requestId) throws Exception {
        System.out.println("❌ Cancelling leave request ID: " + requestId + " for UID: " + uid);
        Firestore db = FirestoreClient.getFirestore();
        DocumentReference doc = db.collection("employees").document(uid)
                .collection("leaveRequests").document(requestId);
        Map<String, Object> updates = Map.of("status", "cancelled");
        doc.update(updates).get();
    }

    public List<LeaveRequest> listAllLeaveRequests() throws Exception {
        Firestore db = FirestoreClient.getFirestore();
        List<LeaveRequest> all = new ArrayList<>();

        ApiFuture<QuerySnapshot> future = db.collectionGroup("leaveRequests").get();

        for (DocumentSnapshot doc : future.get().getDocuments()) {
            String employeeId = doc.getReference().getParent().getParent().getId();

            // Fetch employee info
            DocumentSnapshot empDoc = db.collection("employees").document(employeeId).get().get();
            String name = empDoc.getString("name");
            String surname = empDoc.getString("surname");

            LeaveRequest lr = new LeaveRequest();
            lr.setId(doc.getId());
            lr.setStartDate(doc.getString("startDate"));
            lr.setEndDate(doc.getString("endDate"));
            lr.setLeaveType(doc.getString("leaveType"));
            lr.setStatus(doc.getString("status"));
            lr.setSubmittedAt(doc.getString("submittedAt"));
            lr.setEmployeeId(employeeId);
            lr.setEmployee((name != null ? name : "User") + " " + (surname != null ? surname : ""));

            all.add(lr);
        }

        return all;
    }


    public void updateLeaveStatus(String uid, String leaveId, String status) throws Exception {
        System.out.println("🔄 Updating leave request status...");
        System.out.println("UID: " + uid + ", Leave ID: " + leaveId + ", New Status: " + status);

        Firestore db = FirestoreClient.getFirestore();
        DocumentReference doc = db.collection("employees")
                .document(uid)
                .collection("leaveRequests")
                .document(leaveId);

        Map<String, Object> updates = new HashMap<>();
        updates.put("status", status);

        doc.update(updates).get();
    }
}
