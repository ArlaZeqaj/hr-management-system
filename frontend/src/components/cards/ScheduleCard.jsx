// src/components/cards/ScheduleCard.jsx

import React, { useState, useEffect } from "react";
import { auth } from "../../config/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import axios from "axios";

const ScheduleCard = () => {
    const [tasks, setTasks] = useState([]);
    const [date, setDate] = useState("");
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (user) => {
            if (!user) return;
            const token = await user.getIdToken();

            const now = new Date();
            const yearMonth = now.toISOString().slice(0, 7); // "2025-04"
            const todayDate = now.toISOString().slice(0, 10); // "2025-04-27"

            try {
                const resp = await axios.get(`http://localhost:8080/api/schedule/${yearMonth}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const monthData = resp.data;
                const todayTasks = (monthData.tasks || []).filter(task =>
                    task.startDate.startsWith(todayDate)
                );

                setTasks(todayTasks);
                setDate(todayDate);
            } catch (error) {
                console.error("Error fetching tasks:", error);
            }
        });

        return () => unsub();
    }, []);

    const previewTasks = tasks.slice(0, 2);

    const formatTime = (isoString) => {
        return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="schedule-card-z">
            {/* Today's Date */}
            <p className="schedule-date-z">{date}</p>

            {/* Tasks Preview */}
            <div className="schedule-events-z">
                {previewTasks.map((task, index) => (
                    <div key={index} className="event-z blue">
                        <p className="event-title-z">{task.title}</p>
                        <p className="event-time-z">
                            {formatTime(task.startDate)} - {formatTime(task.endDate)}
                        </p>
                    </div>
                ))}
            </div>

            {/* View All Tasks Link */}
            <a
                href="#"
                className="schedule-link-z"
                onClick={(e) => {
                    e.preventDefault();
                    setShowPopup(true);
                }}
            >
                View all Tasks →
            </a>

            {/* Popup Modal when clicking View All */}
            {showPopup && (
                <div className="modal-overlay" onClick={() => setShowPopup(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3>Today's Full Tasks</h3>

                        {/* All today's tasks */}
                        {tasks.map((task, index) => (
                            <div key={index} className="event-z blue">
                                <p className="event-title-z">{task.title}</p>
                                <p className="event-time-z">
                                    {formatTime(task.startDate)} - {formatTime(task.endDate)}
                                </p>
                            </div>
                        ))}

                        {/* Close Button */}
                        <button className="close-button" onClick={() => setShowPopup(false)}>
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );

};

export default ScheduleCard;
