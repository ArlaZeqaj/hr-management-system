package com.example.hrsystem.service;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

@Service
public class AdminDashService {

    public long getEmployeeCount() throws ExecutionException, InterruptedException {
        Firestore firestore = FirestoreClient.getFirestore();  // ✅ Get Firestore instance
        ApiFuture<QuerySnapshot> query = firestore.collection("employees").get();
        long count = query.get().getDocuments().size();

        System.out.println("✅ Employee count retrieved from Firestore: " + count);  // ✅ Console output
        return count;
    }

    // New method to get active projects count
    public long getActiveProjectsCount() throws ExecutionException, InterruptedException {
        Firestore firestore = FirestoreClient.getFirestore();
        // Query for active projects (you might need to adjust the field depending on how your database is structured)
        ApiFuture<QuerySnapshot> query = firestore.collection("Project")
                .whereEqualTo("status", "Ongoing")  // Assuming you have a "status" field in the "projects" collection
                .get();
        long count = query.get().getDocuments().size();
        return count;
    }

    public long countPendingTasks() throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        CollectionReference employees = db.collection("employees");

        ApiFuture<QuerySnapshot> employeeDocsFuture = employees.get();
        QuerySnapshot employeeDocs = employeeDocsFuture.get();

        long pendingCount = 0;

        for (QueryDocumentSnapshot employeeDoc : employeeDocs) {
            CollectionReference tasks = employeeDoc.getReference().collection("tasks");

            ApiFuture<QuerySnapshot> taskDocsFuture = tasks.get();
            QuerySnapshot taskDocs = taskDocsFuture.get();

            for (QueryDocumentSnapshot taskDoc : taskDocs) {
                Map<String, Object> taskFields = taskDoc.getData();

                for (Map.Entry<String, Object> entry : taskFields.entrySet()) {
                    Object taskValue = entry.getValue();

                    if (taskValue instanceof Map) {
                        Map<?, ?> taskMap = (Map<?, ?>) taskValue;
                        Object status = taskMap.get("status");

                        if ("pending".equalsIgnoreCase(String.valueOf(status))) {
                            pendingCount++;
                        }
                    }
                }
            }
        }

        return pendingCount;
    }

    public Map<String, Long> getDepartmentDistribution() throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        CollectionReference employees = db.collection("employees");

        QuerySnapshot snapshot = employees.get().get();
        Map<String, Long> departmentCounts = new HashMap<>();

        for (DocumentSnapshot doc : snapshot.getDocuments()) {
            String department = doc.getString("department");
            if (department != null) {
                departmentCounts.put(department, departmentCounts.getOrDefault(department, 0L) + 1);
            }
        }
        return departmentCounts;
    }



    // ✅ ADD THIS: createTask method for saving new task to "tasks" collection
    public void createTask(List<String> employeeIds, Map<String, Object> taskData) throws Exception {
        Firestore db = FirestoreClient.getFirestore();

        // Extract due date for document naming
        String dueDateStr = (String) taskData.get("dueDate"); // Ensure this is present and formatted
        LocalDate dueDate = LocalDate.parse(dueDateStr);
        String docName = "task_" + dueDate.getYear() + "-" + String.format("%02d", dueDate.getMonthValue());

        // Iterate over the employeeIds to assign the task to each employee
        for (String employeeId : employeeIds) {
            DocumentReference taskDocRef = db.collection("employees")
                    .document(employeeId)
                    .collection("tasks")
                    .document(docName); // Document name based on the year and month

            // Fetch the document to check if it exists
            DocumentSnapshot taskDocSnapshot = taskDocRef.get().get();
            Map<String, Object> updates = new HashMap<>();

            if (taskDocSnapshot.exists()) {
                // If the document exists, check the existing tasks and add a new one
                Map<String, Object> existingTasks = taskDocSnapshot.getData();
                int nextIndex = existingTasks != null ? existingTasks.size() + 1 : 1;  // Calculate next task index
                String newTaskKey = "task" + nextIndex; // Generate task key like "task1", "task2", etc.
                updates.put(newTaskKey, taskData); // Add new task to the document
            } else {
                // If the document doesn't exist, create it and add the first task
                updates.put("task1", taskData); // First task in the document
            }

            // Save or update the document with the new task
            taskDocRef.set(updates, SetOptions.merge()); // Use merge to avoid overwriting
        }
    }

    // edit task
    public void updateOrAssignTask(List<String> incomingEmployeeIds, Map<String, Object> taskData) throws Exception {
        Firestore db = FirestoreClient.getFirestore();

        String dueDateStr = (String) taskData.get("dueDate");
        String taskTitle = (String) taskData.get("title");

        if (dueDateStr == null || taskTitle == null) {
            throw new IllegalArgumentException("Both dueDate and title must be provided in taskData");
        }

        LocalDate dueDate = LocalDate.parse(dueDateStr);
        String docName = "task_" + dueDate.getYear() + "-" + String.format("%02d", dueDate.getMonthValue());

        for (String employeeId : incomingEmployeeIds) {
            DocumentReference taskDocRef = db.collection("employees")
                    .document(employeeId)
                    .collection("tasks")
                    .document(docName);

            DocumentSnapshot taskDocSnapshot = taskDocRef.get().get();

            boolean taskFound = false;

            if (taskDocSnapshot.exists()) {
                Map<String, Object> tasks = taskDocSnapshot.getData();
                if (tasks != null) {
                    for (Map.Entry<String, Object> entry : tasks.entrySet()) {
                        String taskKey = entry.getKey();
                        Map<String, Object> existingTask = (Map<String, Object>) entry.getValue();

                        if (existingTask != null && taskTitle.equals(existingTask.get("title"))) {
                            // Existing assignees in the task
                            List<String> currentAssignees = (List<String>) existingTask.get("assignees");
                            if (currentAssignees == null) currentAssignees = new ArrayList<>();

                            // Merge new assignees (incomingEmployeeIds)
                            for (String newEmpId : incomingEmployeeIds) {
                                if (!currentAssignees.contains(newEmpId)) {
                                    currentAssignees.add(newEmpId);
                                }
                            }

                            // --- NEW: Find removed assignees (present in currentAssignees but NOT in incomingEmployeeIds)
                            List<String> removedAssignees = new ArrayList<>();
                            for (String assignee : currentAssignees) {
                                if (!incomingEmployeeIds.contains(assignee)) {
                                    removedAssignees.add(assignee);
                                }
                            }

                            // Remove the assignees that are no longer assigned
                            currentAssignees.removeAll(removedAssignees);

                            // Update the taskData with the updated assignees list
                            taskData.put("assignees", currentAssignees);

                            // Update the task document for this employee
                            taskDocRef.update(taskKey, taskData).get();

                            // --- NEW: For each removed assignee, delete this task from their subcollection
                            for (String removedEmpId : removedAssignees) {
                                DocumentReference removedEmpTaskDocRef = db.collection("employees")
                                        .document(removedEmpId)
                                        .collection("tasks")
                                        .document(docName);

                                // Get the removed employee's task doc
                                DocumentSnapshot removedEmpTaskSnapshot = removedEmpTaskDocRef.get().get();
                                if (removedEmpTaskSnapshot.exists()) {
                                    Map<String, Object> removedEmpTasks = removedEmpTaskSnapshot.getData();
                                    if (removedEmpTasks != null && removedEmpTasks.containsKey(taskKey)) {
                                        // Remove the specific task from the document map
                                        removedEmpTaskDocRef.update(taskKey, FieldValue.delete()).get();
                                    }
                                }
                            }

                            taskFound = true;
                            break;
                        }
                    }
                }
            }

            if (!taskFound) {
                // Employee doesn't have the task yet, assign it using existing method
                createTask(Collections.singletonList(employeeId), taskData);
            }
        }
    }



    // Helper method to check and update task for a single employee




    public List<Map<String, Object>> getAllEmployees() throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        ApiFuture<QuerySnapshot> query = db.collection("employees").get();

        List<Map<String, Object>> employeeList = new ArrayList<>();
        for (DocumentSnapshot doc : query.get().getDocuments()) {
            Map<String, Object> data = new HashMap<>(doc.getData());
            data.put("id", doc.getId());
            employeeList.add(data);
        }

        return employeeList;
    }


    // po marrim task nga dtabaza edhe do heqim ato duplicate qe ti kemi unike meqe 2 employees mund te ken te njejtin task
    public List<Map<String, Object>> getAllTasks1() throws Exception {
        Firestore db = FirestoreClient.getFirestore();
        List<Map<String, Object>> allTasks = new ArrayList<>();

        // Fetch all employees
        ApiFuture<QuerySnapshot> employeesSnapshot = db.collection("employees").get();
        List<QueryDocumentSnapshot> employeeDocs = employeesSnapshot.get().getDocuments();

        // Fetch tasks from all employees
        for (QueryDocumentSnapshot employeeDoc : employeeDocs) {
            CollectionReference tasksRef = employeeDoc.getReference().collection("tasks");

            ApiFuture<QuerySnapshot> tasksSnapshot = tasksRef.get();
            List<QueryDocumentSnapshot> taskDocs = tasksSnapshot.get().getDocuments();

            for (QueryDocumentSnapshot taskDoc : taskDocs) {
                Map<String, Object> task = taskDoc.getData();
                task.put("id", taskDoc.getId()); // Add task ID for reference
                allTasks.add(task);
            }
        }

        // Remove duplicate tasks by comparing task title and due date
        List<Map<String, Object>> uniqueTasks = allTasks.stream()
                .distinct() // This will remove exact duplicate tasks
                .collect(Collectors.toList());

        // Return the unique tasks list
        return uniqueTasks;
    }
    // delete task
    public void deleteTask(String title) throws Exception {
        Firestore db = FirestoreClient.getFirestore();

        // Query all employee documents
        ApiFuture<QuerySnapshot> employeeQuery = db.collection("employees").get();
        List<QueryDocumentSnapshot> employeeDocs = employeeQuery.get().getDocuments();

        for (QueryDocumentSnapshot employeeDoc : employeeDocs) {
            CollectionReference tasksCollection = employeeDoc.getReference().collection("tasks");

            // Iterate through monthly task documents
            ApiFuture<QuerySnapshot> monthlyTasksQuery = tasksCollection.get();
            for (DocumentSnapshot monthDoc : monthlyTasksQuery.get().getDocuments()) {
                Map<String, Object> allTasks = monthDoc.getData();
                if (allTasks == null) continue;

                for (String taskKey : allTasks.keySet()) {
                    Map<String, Object> taskData = (Map<String, Object>) allTasks.get(taskKey);
                    if (taskData != null && title.equals(taskData.get("title"))) {
                        // Delete the task field from the document
                        monthDoc.getReference().update(taskKey, FieldValue.delete());
                        break; // Remove only the first match per user
                    }
                }
            }
        }
    }
    public Map<String, Double> calculateBudgetAllocationByDepartment() throws Exception {
        Firestore db = FirestoreClient.getFirestore();

        // Get current year-month string (e.g. "2025-05")
        LocalDate now = LocalDate.now();
        String yearMonth = String.format("%d-%02d", now.getYear(), now.getMonthValue());

        // Map to store total payroll per department
        Map<String, Double> departmentTotals = new HashMap<>();

        // Get all employees
        ApiFuture<QuerySnapshot> employeesFuture = db.collection("employees").get();
        List<QueryDocumentSnapshot> employees = employeesFuture.get().getDocuments();

        for (QueryDocumentSnapshot employeeDoc : employees) {
            String department = employeeDoc.getString("department");
            if (department == null) {
                department = "Unknown";
            }

            // Access payroll document for current year-month
            DocumentReference payrollDocRef = employeeDoc.getReference()
                    .collection("payroll")
                    .document(yearMonth);

            DocumentSnapshot payrollSnapshot = payrollDocRef.get().get();

            if (payrollSnapshot.exists()) {
                Double grossSalary = payrollSnapshot.getDouble("grossSalary");
                if (grossSalary == null) {
                    grossSalary = 0.0;
                }
                // Sum payroll per department
                departmentTotals.put(department,
                        departmentTotals.getOrDefault(department, 0.0) + grossSalary);
            } else {
                // Payroll document for current month not found, assume zero
                departmentTotals.putIfAbsent(department, departmentTotals.getOrDefault(department, 0.0));
            }
        }

        return departmentTotals;
    }
    public double calculateTotalPayroll() throws Exception {
        Firestore db = FirestoreClient.getFirestore();

        LocalDate now = LocalDate.now();
        String yearMonth = String.format("%d-%02d", now.getYear(), now.getMonthValue());

        ApiFuture<QuerySnapshot> employeesFuture = db.collection("employees").get();
        List<QueryDocumentSnapshot> employees = employeesFuture.get().getDocuments();

        double totalPayroll = 0.0;

        for (QueryDocumentSnapshot employeeDoc : employees) {
            DocumentReference payrollDocRef = employeeDoc.getReference()
                    .collection("payroll")
                    .document(yearMonth);

            DocumentSnapshot payrollSnapshot = payrollDocRef.get().get();

            if (payrollSnapshot.exists()) {
                Double grossSalary = payrollSnapshot.getDouble("grossSalary");
                if (grossSalary != null) {
                    totalPayroll += grossSalary;
                }
            }
        }

        return totalPayroll;
    }

    public Map<String, Double> getPayrollTrendByMonth() throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        ApiFuture<QuerySnapshot> employeesFuture = db.collection("employees").get();
        List<QueryDocumentSnapshot> employeeDocs = employeesFuture.get().getDocuments();

        Map<String, Double> monthlyTotals = new TreeMap<>();

        for (QueryDocumentSnapshot employeeDoc : employeeDocs) {
            CollectionReference payrollRef = employeeDoc.getReference().collection("payroll");
            List<QueryDocumentSnapshot> payrollDocs = payrollRef.get().get().getDocuments();

            for (QueryDocumentSnapshot payrollDoc : payrollDocs) {
                Double grossSalary = payrollDoc.getDouble("grossSalary");
                String month = payrollDoc.getId();  // format "2025-04"

                if (grossSalary != null) {
                    monthlyTotals.put(month, monthlyTotals.getOrDefault(month, 0.0) + grossSalary);
                }
            }
        }

        return monthlyTotals;
    }



}
