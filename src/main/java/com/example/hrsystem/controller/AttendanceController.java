package com.example.hrsystem.controller;


import com.example.hrsystem.service.AttendanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

    @Autowired
    private AttendanceService attendanceService;

    @PostMapping("/checkout")
    public ResponseEntity<?> checkOut(@AuthenticationPrincipal String uid) {
        try {
            String checkOutTime = attendanceService.recordCheckOut(uid);
            return ResponseEntity.ok(Map.of("checkOutTime", checkOutTime));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/checkin-time")
    public Map<String, String> getCheckInTime(@RequestHeader("Authorization") String authorizationHeader) throws Exception {
        System.out.println("📥 Incoming Authorization Header (Backend): " + authorizationHeader); // 🔥 Print Authorization header
        return attendanceService.getTodayCheckInTime(authorizationHeader);
    }
}

