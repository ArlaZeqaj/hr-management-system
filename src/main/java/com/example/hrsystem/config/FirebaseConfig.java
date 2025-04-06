package com.example.hrsystem.config;  // Adjust package name as per your project

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import org.springframework.context.annotation.Configuration;

import java.io.FileInputStream;
import java.io.IOException;

@Configuration
public class FirebaseConfig {

    public FirebaseConfig() throws IOException {
        FileInputStream serviceAccount =
                new FileInputStream("hrcloudx-3c6ee-firebase-adminsdk-fbsvc-a2dc737803.json");  // Ensure correct path

        FirebaseOptions options = FirebaseOptions.builder()
                .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                .build();

        if (FirebaseApp.getApps().isEmpty()) {  // Prevent multiple initializations
            FirebaseApp.initializeApp(options);
            System.out.println("🔥 Firebase Initialized Successfully!");
        }

    }
}
