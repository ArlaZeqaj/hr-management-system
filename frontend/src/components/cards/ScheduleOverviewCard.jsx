// src/components/cards/ScheduleOverviewCard.jsx
import React from "react";

const hours = [
    { time: "08:00", label: "Meeting" },
    { time: "09:00" },
    { time: "10:00" },
    { time: "11:00" },
    { time: "12:00" },
    { time: "13:00" },
    { time: "14:00" },
    { time: "15:00" },
    { time: "16:00" }
];

const ScheduleOverviewCard = () => {
    return (
        <div className="overview-card-z">
            <h4 className="overview-title-z">Schedule Overview</h4>
            <div className="overview-timeline-z">
                {hours.map(({ time, label }, idx) => (
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
