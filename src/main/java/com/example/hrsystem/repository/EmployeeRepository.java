package com.example.hrsystem.repository;

import com.example.hrsystem.model.Employee;
import com.google.cloud.spring.data.firestore.FirestoreReactiveRepository;

public interface EmployeeRepository extends FirestoreReactiveRepository<Employee> {
}
