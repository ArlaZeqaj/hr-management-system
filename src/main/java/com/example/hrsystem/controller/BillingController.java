package com.example.hrsystem.controller;

import com.example.hrsystem.dto.CardInfoDTO;
import com.example.hrsystem.model.Card;
import com.example.hrsystem.service.CardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/api")
public class BillingController {

    @Autowired
    private CardService cardService;

    @GetMapping("/cards")
    public ResponseEntity<CardInfoDTO> getCard(Authentication authentication) {
        String uid = (String) authentication.getPrincipal(); // Firebase UID
        return ResponseEntity.ok(cardService.getCardByUserId(uid));
    }

    @PostMapping
    public String addCard(@RequestBody Card card) throws ExecutionException, InterruptedException {
        return cardService.addCard(card);
    }
}
