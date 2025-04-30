// src/components/cards/ScheduleOverviewCard.jsx

import React, { useState, useEffect } from "react";
import { auth } from "../../config/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import axios from "axios";

const ScheduleOverviewCard = ({ selectedDate }) => {
    const [events, setEvents] = useState([]);
    const [date, setDate] = useState("");

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (user) => {
            if (!user) return;

            const token = await user.getIdToken();
            const now = selectedDate ? new Date(selectedDate) : new Date();
            const yearMonth = now.toISOString().slice(0, 7);
            const dayDate = now.toISOString().slice(0, 10);

            setDate(dayDate);

            try {
                const resp = await axios.get(`http://localhost:8080/api/calendar-events/${yearMonth}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const monthData = resp.data;
                const todayEvents = (monthData.events || []).filter(event => {
                    if (!event.startDate) return false;
                   // const eventDate = new Date(event.startDate).toISOString().slice(0, 10);
                    return event.startDate === dayDate;
                });

                setEvents(todayEvents);
            } catch (error) {
                console.error("Error fetching calendar events:", error);
            }
        });

        return () => unsub();
    }, [selectedDate]);

    const generateTimelineHours = () => {
        const hours = [];
        for (let h = 8; h <= 16; h++) {
            const label = events.find(event => {
                const fullDateTime = new Date(`${event.startDate}T${event.startTime}`);
                return fullDateTime.getHours() === h;
            });

            hours.push({
                time: label ? label.startTime : null,
                label: label ? label.title : null
            });
        }
        return hours;
    };


    const timeline = generateTimelineHours();

    return (
        <div className="overview-card-z">
            <h4 className="overview-title-z">Schedule Overview</h4>
            <div className="overview-timeline-z">
                {timeline.map(({ time, label }, idx) => (
                    <div key={idx} className="overview-slot-z">
                        <span className="overview-time-z">{time}</span>
                        {label ? (
                            <span className="overview-label-z">{label}</span>
                        ) : (
                            <span className="overview-dash-z">—</span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ScheduleOverviewCard;
