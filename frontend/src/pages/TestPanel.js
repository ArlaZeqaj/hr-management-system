import React from 'react';

const API_BASE = 'http://localhost:8080/api';

const TestPanel = () => {
    // === USERS ===
    const createUser = async () => {
        await fetch(`${API_BASE}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'John Doe', email: 'john@example.com', role: 'employee', position: 'Developer' })
        });
    };

    const updateUser = async () => {
        await fetch(`${API_BASE}/users/USER_ID_HERE`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'newemail@example.com' })
        });
    };

    const deleteUser = async () => {
        await fetch(`${API_BASE}/users/USER_ID_HERE`, { method: 'DELETE' });
    };

    // === PROJECTS ===
    const createProject = async () => {
        await fetch(`${API_BASE}/projects`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: 'Project X', status: 'ongoing' })
        });
    };

    const deleteProject = async () => {
        await fetch(`${API_BASE}/projects/PROJECT_ID_HERE`, { method: 'DELETE' });
    };

    // === TASKS ===
    const createTask = async () => {
        await fetch(`${API_BASE}/tasks`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: 'New Task', status: 'in_progress', userId: 'USER_ID_HERE' })
        });
    };

    const updateTask = async () => {
        await fetch(`${API_BASE}/tasks/TASK_ID_HERE`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'done' })
        });
    };

    const deleteTask = async () => {
        await fetch(`${API_BASE}/tasks/TASK_ID_HERE`, { method: 'DELETE' });
    };

    // === PAYROLLS ===
    const createPayroll = async () => {
        await fetch(`${API_BASE}/payrolls`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: 'USER_ID_HERE', amount: 2000 })
        });
    };

    const updatePayroll = async () => {
        await fetch(`${API_BASE}/payrolls/PAYROLL_ID_HERE`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: 2500 })
        });
    };

    const deletePayroll = async () => {
        await fetch(`${API_BASE}/payrolls/PAYROLL_ID_HERE`, { method: 'DELETE' });
    };

    // === ATTENDANCE ===
    const createCheckIn = async () => {
        await fetch(`${API_BASE}/attendance`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: 'USER_ID_HERE', checkIn: new Date().toISOString() })
        });
    };

    const createCheckOut = async () => {
        await fetch(`${API_BASE}/attendance/LOG_ID_HERE`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ checkOut: new Date().toISOString() })
        });
    };

    const deleteAttendance = async () => {
        await fetch(`${API_BASE}/attendance/LOG_ID_HERE`, { method: 'DELETE' });
    };

    // === LEAVE REQUESTS ===
    const createLeaveRequest = async () => {
        await fetch(`${API_BASE}/leave-requests`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: 'USER_ID_HERE', type: 'vacation', startDate: '2025-04-25', endDate: '2025-04-28' })
        });
    };

    const updateLeaveRequest = async () => {
        await fetch(`${API_BASE}/leave-requests/REQUEST_ID_HERE`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'approved' })
        });
    };

    const deleteLeaveRequest = async () => {
        await fetch(`${API_BASE}/leave-requests/REQUEST_ID_HERE`, { method: 'DELETE' });
    };

    // === CALENDAR EVENTS ===
    const createEvent = async () => {
        await fetch(`${API_BASE}/events`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: 'Team Meeting', date: '2025-04-25', userId: 'USER_ID_HERE' })
        });
    };

    const updateEvent = async () => {
        await fetch(`${API_BASE}/events/EVENT_ID_HERE`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: 'Updated Title' })
        });
    };

    const deleteEvent = async () => {
        await fetch(`${API_BASE}/events/EVENT_ID_HERE`, { method: 'DELETE' });
    };

    // === SCHEDULES ===
    const createSchedule = async () => {
        await fetch(`${API_BASE}/schedules`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: 'USER_ID_HERE', date: '2025-04-25', items: [{ time: '09:00', activity: 'Standup Meeting' }] })
        });
    };

    const updateSchedule = async () => {
        await fetch(`${API_BASE}/schedules/SCHEDULE_ID_HERE`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 'items.0.activity': 'Updated Activity' })
        });
    };

    const deleteSchedule = async () => {
        await fetch(`${API_BASE}/schedules/SCHEDULE_ID_HERE`, { method: 'DELETE' });
    };

    // === FEEDBACKS ===
    const createFeedback = async () => {
        await fetch(`${API_BASE}/feedbacks`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: 'USER_ID_HERE', from: 'manager', message: 'Great job!', date: new Date().toISOString() })
        });
    };

    const updateFeedback = async () => {
        await fetch(`${API_BASE}/feedbacks/FEEDBACK_ID_HERE`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: 'Updated message' })
        });
    };

    const deleteFeedback = async () => {
        await fetch(`${API_BASE}/feedbacks/FEEDBACK_ID_HERE`, { method: 'DELETE' });
    };

    // === TRAINING PROGRESS ===
    const createTraining = async () => {
        await fetch(`${API_BASE}/training`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: 'USER_ID_HERE', module: 'Security Awareness', completed: false, score: 0 })
        });
    };

    const updateTraining = async () => {
        await fetch(`${API_BASE}/training/PROGRESS_ID_HERE`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ completed: true, score: 85 })
        });
    };

    const deleteTraining = async () => {
        await fetch(`${API_BASE}/training/PROGRESS_ID_HERE`, { method: 'DELETE' });
    };

    return (
        <div className="p-6 space-y-6">
            <h2 className="text-2xl font-bold">🛠️ API Test Panel (Spring Boot + Firebase)</h2>
            <section><h3>Users</h3><button onClick={createUser}>Create</button><button onClick={updateUser}>Update</button><button onClick={deleteUser}>Delete</button></section>
            <section><h3>Projects</h3><button onClick={createProject}>Create</button><button onClick={deleteProject}>Delete</button></section>
            <section><h3>Tasks</h3><button onClick={createTask}>Create</button><button onClick={updateTask}>Update</button><button onClick={deleteTask}>Delete</button></section>
            <section><h3>Payrolls</h3><button onClick={createPayroll}>Create</button><button onClick={updatePayroll}>Update</button><button onClick={deletePayroll}>Delete</button></section>
            <section><h3>Attendance</h3><button onClick={createCheckIn}>Check-In</button><button onClick={createCheckOut}>Check-Out</button><button onClick={deleteAttendance}>Delete</button></section>
            <section><h3>Leave Requests</h3><button onClick={createLeaveRequest}>Create</button><button onClick={updateLeaveRequest}>Update</button><button onClick={deleteLeaveRequest}>Delete</button></section>
            <section><h3>Events</h3><button onClick={createEvent}>Create</button><button onClick={updateEvent}>Update</button><button onClick={deleteEvent}>Delete</button></section>
            <section><h3>Schedules</h3><button onClick={createSchedule}>Create</button><button onClick={updateSchedule}>Update</button><button onClick={deleteSchedule}>Delete</button></section>
            <section><h3>Feedbacks</h3><button onClick={createFeedback}>Create</button><button onClick={updateFeedback}>Update</button><button onClick={deleteFeedback}>Delete</button></section>
            <section><h3>Training</h3><button onClick={createTraining}>Create</button><button onClick={updateTraining}>Update</button><button onClick={deleteTraining}>Delete</button></section>
        </div>
    );
};

export default TestPanel;
