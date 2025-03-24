package com.example.hrsystem;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
public class HrSystemApplication {

	public static void main(String[] args) {
		SpringApplication.run(HrSystemApplication.class, args);
	}

	// Your original GET mappings
	@GetMapping("/")
	public String sayHello() {
		return "Hello from the main application!";
	}

	@GetMapping("/goodbye")
	public String sayGoodbye() {
		return "Goodbye from the main application!";
	}
}
