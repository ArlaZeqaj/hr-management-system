// src/components/cards/CalendarCard.jsx
import React from "react";

const daysOfWeek = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
const dates = [
    "26", "27", "28", "29", "1", "2", "3",
    "4", "5", "6", "7", "8", "9", "10",
    "11", "12", "13", "14", "15", "16", "17",
    "18", "19", "20", "21", "22", "23", "24",
    "25", "26", "27", "28", "29", "30", "1"
];

const CalendarCard = () => {
    return (
        <div className="calendar-card-z">
            <div className="calendar-header-z">
                <span className="calendar-month-z">March 2025</span>
                <div className="calendar-arrows-z">
                    <button className="calendar-arrow-z">
                        <svg viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeWidth="2" stroke="currentColor" fill="none" /></svg>
                    </button>
                    <button className="calendar-arrow-z">
                        <svg viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth="2" stroke="currentColor" fill="none" /></svg>
                    </button>
                </div>
            </div>

            <div className="calendar-days-z">
                {daysOfWeek.map((day) => (
                    <div key={day} className="calendar-day-z">{day}</div>
                ))}
            </div>

            <div className="calendar-dates-z">
                {dates.map((date, i) => (
                    <div
                        key={i}
                        className={`calendar-date-z ${
                            date === "27" && i === 32 ? "calendar-active" : date === "26" || date === "1" ? "calendar-muted" : ""
                        }`}
                    >
                        {date}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CalendarCard;
