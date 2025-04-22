// src/components/cards/ScheduleCard.jsx
import React from "react";

const ScheduleCard = () => {
    return (
        <div className="schedule-card">
            <p className="schedule-date">27 March</p>
            <div className="schedule-events">
                <div className="event pink">
                    <p className="event-title">Meet w/ Simmpmple</p>
                    <p className="event-time">01:00 PM - 02:00 PM</p>
                </div>
                <div className="event indigo">
                    <p className="event-title">Fitness Training</p>
                    <p className="event-time">02:00 PM - 03:00 PM</p>
                </div>
            </div>
            <a href="#" className="schedule-link">View all Tasks →</a>
        </div>
    );
};

export default ScheduleCard;
