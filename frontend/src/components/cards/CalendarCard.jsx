import React, { useState, useRef, useEffect } from "react";
import { auth } from "../../config/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import axios from "axios";

const daysOfWeek = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

const CalendarCard = () => {
    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [currentYear, setCurrentYear] = useState(today.getFullYear());
    const initialMonth = useRef(today.getMonth());
    const initialYear = useRef(today.getFullYear());

    const [highlights, setHighlights] = useState([]);

    useEffect(() => {
        const fetchHighlights = async () => {
            onAuthStateChanged(auth, async (user) => {
                if (!user) {
                    console.error("User not authenticated.");
                    return;
                }

                try {
                    const token = await user.getIdToken();

                    const res = await axios.get(`/api/calendar-highlights`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        params: {
                            year: currentYear,
                            month: currentMonth + 1,
                        },
                    });

                    setHighlights(res.data || []);
                } catch (error) {
                    console.error("🔥 Backend error:", error.message);
                    setHighlights([]);
                }
            });
        };

        (async () => {
            await fetchHighlights();
        })();
    }, [currentMonth, currentYear]);
    const getDaysInMonth = (year, month) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getStartDayOfMonth = (year, month) => {
        const day = new Date(year, month, 1).getDay();
        return day === 0 ? 6 : day - 1;
    };

    const generateCalendarDays = () => {
        const daysInMonth = getDaysInMonth(currentYear, currentMonth);
        const startDay = getStartDayOfMonth(currentYear, currentMonth);

        const calendarDays = Array(startDay).fill(null);
        for (let d = 1; d <= daysInMonth; d++) {
            calendarDays.push(new Date(currentYear, currentMonth, d));
        }
        return calendarDays;
    };

    const getHighlightClass = (dateObj) => {
        if (!dateObj) return "";
        const dateStr = dateObj.toISOString().split("T")[0];
        const highlight = highlights.find((h) => h.date === dateStr);
        if (!highlight) return "";
        if (highlight.type === "birthday") return "highlight-pink";
        if (highlight.type === "task") return "highlight-purple";
        if (highlight.type === "event") return "highlight-blue";
        return "";
    };

    const handlePrevMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear((prev) => prev - 1);
        } else {
            setCurrentMonth((prev) => prev - 1);
        }
    };

    const handleNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear((prev) => prev + 1);
        } else {
            setCurrentMonth((prev) => prev + 1);
        }
    };

    const isToday = (dateObj) => {
        return (
            dateObj &&
            dateObj.getDate() === today.getDate() &&
            dateObj.getMonth() === today.getMonth() &&
            dateObj.getFullYear() === today.getFullYear()
        );
    };

    const calendarDates = generateCalendarDays();

    return (
        <div className="calendar-card-z">
            <div className="calendar-header-z">
                <div id="calendar-select-group">
                    <select className="calendar-month-z" value={currentMonth} onChange={(e) => setCurrentMonth(parseInt(e.target.value))}>
                        {[...Array(12)].map((_, index) => (
                            <option key={index} value={index}>
                                {new Date(0, index).toLocaleString("default", { month: "long" })}
                            </option>
                        ))}
                    </select>

                    <select className="calendar-month-z" value={currentYear} onChange={(e) => setCurrentYear(parseInt(e.target.value))}>
                        {[...Array(11)].map((_, index) => {
                            const year = 2020 + index;
                            return (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            );
                        })}
                    </select>
                </div>

                <div className="calendar-arrows-z">
                    <button onClick={() => {
                        setCurrentMonth(initialMonth.current);
                        setCurrentYear(initialYear.current);
                    }}>
                        <span>↻</span>
                    </button>
                    <button className="calendar-arrow-z" onClick={handlePrevMonth}>
                        <svg viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeWidth="2" stroke="currentColor" fill="none" /></svg>
                    </button>
                    <button className="calendar-arrow-z" onClick={handleNextMonth}>
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
                {calendarDates.map((dateObj, i) => (
                    <div
                        key={i}
                        className={`calendar-date-z ${!dateObj ? "calendar-muted" : isToday(dateObj) ? "calendar-active" : ""} ${getHighlightClass(dateObj)}`}
                    >
                        {dateObj ? dateObj.getDate() : ""}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CalendarCard;
