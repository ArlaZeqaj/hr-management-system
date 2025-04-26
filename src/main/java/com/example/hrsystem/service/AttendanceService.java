package com.example.hrsystem.service;

import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@Service
public class AttendanceService {

    public Map<String, String> getTodayCheckInTime(String authorizationHeader) throws Exception {
        System.out.println("🔍 [AttendanceService] Raw Authorization Header: " + authorizationHeader);

        // Strip "Bearer " from header
        String idToken = authorizationHeader.replace("Bearer ", "").trim();
        System.out.println("🔑 [AttendanceService] Extracted Firebase ID Token: " + idToken);

        try {
            FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(idToken);
            String uid = decodedToken.getUid();
            System.out.println("✅ [AttendanceService] Verified Firebase Token. UID: " + uid);

            Firestore db = FirestoreClient.getFirestore();

            String today = LocalDate.now().toString(); // Format: yyyy-MM-dd
            String docId = uid + "_" + today;
            System.out.println("📄 [AttendanceService] Fetching document ID: " + docId);

            DocumentReference docRef = db.collection("attendanceLogs").document(docId);
            DocumentSnapshot snapshot = docRef.get().get();

            Map<String, String> result = new HashMap<>();

            if (snapshot.exists()) {
                String checkIn = snapshot.getString("checkIn");
                System.out.println("🟢 [AttendanceService] Document found. checkIn: " + checkIn);
                result.put("checkInTime", checkIn != null ? checkIn : "Not yet");
            } else {
                System.out.println("🔴 [AttendanceService] No document found for today.");
                result.put("checkInTime", "Not yet");
            }

            return result;

        } catch (FirebaseAuthException e) {
            System.err.println("❌ [AttendanceService] FirebaseAuthException: " + e.getMessage());
            throw new RuntimeException("Invalid Firebase token", e);
        } catch (Exception ex) {
            System.err.println("🔥 [AttendanceService] Unexpected error: " + ex.getMessage());
            throw ex;
        }
    }}
