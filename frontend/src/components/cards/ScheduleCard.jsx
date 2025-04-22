// src/components/cards/ScheduleCard.jsx
import React from "react";

const ScheduleCard = () => {
    return (
        <div className="schedule-card-z">
            <p className="schedule-date-z">27 March</p>
            <div className="schedule-events-z">
                <div className="event-z pink">
                    <p className="event-title-z">Meet w/ Simmpmple</p>
                    <p className="event-time-z">01:00 PM - 02:00 PM</p>
                </div>
                <div className="event-z indigo">
                    <p className="event-title-z">Fitness Training</p>
                    <p className="event-time-z">02:00 PM - 03:00 PM</p>
                </div>
            </div>
            <a href="#" className="schedule-link-z">View all Tasks →</a>
        </div>
    );
};

export default ScheduleCard;
