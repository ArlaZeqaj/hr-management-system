//package com.example.hrsystem.controller;
//
//import com.example.hrsystem.service.FirebaseAuthService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.PathVariable;
//import org.springframework.web.bind.annotation.RestController;
//
//@RestController
//public class FirebaseController {
//
//    @Autowired
//    private FirebaseAuthService firebaseService;
//
//    @GetMapping("/firebase/test/{userId}")
//    public String getUserData(@PathVariable String userId) {
//        firebaseService.getUserData(userId);
//        return "User data fetched!";
//    }
//}
