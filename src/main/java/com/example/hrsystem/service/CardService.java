package com.example.hrsystem.service;

import com.example.hrsystem.dto.CardInfoDTO;
import com.example.hrsystem.model.Card;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.stereotype.Service;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.stereotype.Service;

import java.util.concurrent.ExecutionException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CardService {
    private static final String COLLECTION_NAME = "cards";

    public CardInfoDTO getCardByUserId(String uid) {
        try {
            Firestore db = FirestoreClient.getFirestore();

            ApiFuture<DocumentSnapshot> future = db
                    .collection("cards")
                    .document(uid)
                    .get();

            DocumentSnapshot document = future.get();

            if (document.exists()) {
                return new CardInfoDTO(
                        document.getString("number"),
                        document.getString("expiry"),
                        document.getString("cvv")
                );
            } else {
                throw new RuntimeException("No card found for user: " + uid);
            }

        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch card from Firestore", e);
        }
    }
    public String addCard(Card card) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        if (card.getId() == null || card.getId().isEmpty()) {
            card.setId(db.collection(COLLECTION_NAME).document().getId()); // Auto-generate ID
        }
        ApiFuture<WriteResult> future = db.collection(COLLECTION_NAME).document(card.getId()).set(card);
        return future.get().getUpdateTime().toString();
    }
}
