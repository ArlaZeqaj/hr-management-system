package com.example.hrsystem.controller;

import com.example.hrsystem.model.NewHire;
import com.example.hrsystem.service.NewHireService;
import com.google.firebase.auth.FirebaseAuth;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/new-hires")
@CrossOrigin(origins = "http://localhost:3000")
public class NewHireController {

    @Autowired
    private NewHireService newHireService;

    @PostMapping
    public NewHire submitNewHire(@RequestBody NewHire hire, @RequestHeader("Authorization") String authHeader) throws Exception {
        String token = authHeader.replace("Bearer ", "");
        FirebaseAuth.getInstance().verifyIdToken(token); // token validation only
        newHireService.saveNewHire(hire);
        return hire;
    }

    @GetMapping
    public List<NewHire> getAllHires(@RequestHeader("Authorization") String authHeader) throws Exception {
        String token = authHeader.replace("Bearer ", "");
        FirebaseAuth.getInstance().verifyIdToken(token);
        return newHireService.getAllHires();
    }

    @PutMapping("/{id}")
public void updateNewHire(@PathVariable String id, @RequestBody NewHire hire,
                          @RequestHeader("Authorization") String authHeader) throws Exception {
    FirebaseAuth.getInstance().verifyIdToken(authHeader.replace("Bearer ", ""));
    newHireService.updateNewHire(id, hire);
}

@DeleteMapping("/{id}")
public void deleteNewHire(@PathVariable String id,
                          @RequestHeader("Authorization") String authHeader) throws Exception {
    FirebaseAuth.getInstance().verifyIdToken(authHeader.replace("Bearer ", ""));
    newHireService.deleteNewHire(id);
}

@PostMapping("/{id}/approve")
public void approveNewHire(@PathVariable String id,
                           @RequestHeader("Authorization") String authHeader) throws Exception {
    FirebaseAuth.getInstance().verifyIdToken(authHeader.replace("Bearer ", ""));
    newHireService.approveNewHire(id);
}


    
}
