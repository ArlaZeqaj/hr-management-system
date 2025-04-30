// src/components/cards/ScheduleCard.jsx

import React, { useState, useEffect } from "react";
import { auth } from "../../config/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import axios from "axios";

const ScheduleCard = ({ selectedDate }) => {
    const [tasks, setTasks] = useState([]);
    const [date, setDate] = useState("");
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (user) => {
            if (!user) return;

            const token = await user.getIdToken();
            const now = selectedDate ? new Date(selectedDate) : new Date();
           // const now = new Date();
            const yearMonth = now.toISOString().slice(0, 7);
            const dayDate = now.toISOString().slice(0, 10);

            setDate(dayDate);


            try {
                const resp = await axios.get(`http://localhost:8080/api/schedule/${yearMonth}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const monthData = resp.data;
                const dayTasks = (monthData.tasks || []).filter(task => {
                    if (!task.dueDate) return false;
                   // const taskEndDate = new Date(task.dueDate)//.toISOString().slice(0, 10);
                    return task.dueDate === dayDate;
                });

                setTasks(dayTasks);
            } catch (error) {
                console.error("Error fetching tasks:", error);
            }
        });

        return () => unsub();
    }, [selectedDate]);

    const formatTime = (isoString) => {
        return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const previewTasks = tasks.slice(0, 2);

    return (
        <div className="schedule-card-z">
            <p className="schedule-date-z">
                {new Date(date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                })}
            </p>
            <div className="schedule-events-z">
                {previewTasks.map((task, index) => (
                    <div key={index} className="event-z blue">
                        <p className="event-title-z">{task.title}</p>
                        <p className="event-time-z">
                            -{task.description}                       </p>
                    </div>

                ))}
                {tasks.length > 2 && (
                    <a
                        href="hithere"
                        className="schedule-link-z"
                        onClick={(e) => {
                            e.preventDefault();
                            setShowPopup(true);
                        }}
                    >
                        View all Tasks →
                    </a>
                )}
                {tasks.length === 0 && <p className="no-task-message">No tasks for this day.</p>}
            </div>



            {showPopup && (
                <div className="modal-overlay-z" onClick={() => setShowPopup(false)}>
                    <div className="modal-content-z" onClick={(e) => e.stopPropagation()}>
                        <h3 className="modal-header-z">All Tasks for  {new Date(date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}</h3>
                        <div className="schedule-events-z">
                            {tasks.map((task, index) => (
                                <div key={index} className="event-z blue">
                                    <p className="event-title-z">{task.title}</p>
                                    <p className="event-time-z">
                                        -{task.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                        <button className="close-button-z" onClick={() => setShowPopup(false)}>
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ScheduleCard;
