package com.example.hrsystem.controller;


import com.example.hrsystem.service.AttendanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

    @Autowired
    private AttendanceService attendanceService;


    @GetMapping("/checkin-time")
    public Map<String, String> getCheckInTime(@RequestHeader("Authorization") String authorizationHeader) throws Exception {
        System.out.println("📥 Incoming Authorization Header (Backend): " + authorizationHeader); // 🔥 Print Authorization header
        return attendanceService.getTodayCheckInTime(authorizationHeader);
    }
}

