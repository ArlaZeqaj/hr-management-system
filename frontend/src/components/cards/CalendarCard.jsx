import React, { useState, useRef, useEffect } from "react";
import { auth } from "../../config/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const daysOfWeek = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

const CalendarCard = ({ onDateSelect }) => {
    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [currentYear, setCurrentYear] = useState(today.getFullYear());
    const initialMonth = useRef(today.getMonth());
    const initialYear = useRef(today.getFullYear());

    const [token, setToken] = useState(null);
    const [highlights, setHighlights] = useState([]);
    const [tooltip, setTooltip] = useState({ show: false, x: 0, y: 0, content: "" });

    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) return;
            const userToken = await user.getIdToken();
            setToken(userToken);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const fetchHighlights = async () => {
            if (!token) return;

            try {
                const res = await axios.get(`/api/calendar-highlights`, {
                    headers: { Authorization: `Bearer ${token}` },
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
        };

        fetchHighlights();
    }, [token, currentMonth, currentYear]);

    const formatDate = (dateObj) => {
        const year = dateObj.getFullYear();
        const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
        const day = dateObj.getDate().toString().padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const getHighlightClass = (dateObj) => {
        if (!dateObj) return "";

        const dateStr = formatDate(dateObj);
        const matching = highlights.filter(h => h.date === dateStr);
        if (matching.length === 0) return "";

        const classes = new Set();
        matching.forEach(h => {
            if (h.type === "birthday") classes.add("highlight-pink");
            if (h.type === "task") classes.add("highlight-purple");
            if (h.type === "event") classes.add("highlight-blue");
        });

        return [...classes].join(" ");
    };

    const getTitleForDate = (dateObj) => {
        if (!dateObj) return "";

        const dateStr = formatDate(dateObj);
        const matching = highlights.filter(h => h.date === dateStr);

        console.log("👉 Matching highlights for", dateStr, ":", matching);

        const titles = matching.map(h => {
            if (!h.title) {
                if (h.type === "task") return "Task";
                if (h.type === "event") return "Event";
                if (h.type === "birthday") return "Birthday";
                return "Unknown";
            }
            return h.title;
        }).join(" / ");


        return titles;
    };

    const handleDateClick = (dateObj) => {
        if (!dateObj) return;
        const selected = formatDate(dateObj); // yyyy-mm-dd
        onDateSelect(selected); // pass to parent
    };


    const handleMouseEnter = (e, dateObj) => {
        const title = getTitleForDate(dateObj);
        if (!title) return;

        const rect = e.target.getBoundingClientRect();
        setTooltip({
            show: true,
            content: title,
            x: rect.left + rect.width / 2,
            y: rect.top - 10,
        });
    };

    const handleMouseLeave = () => {
        setTooltip({ show: false, x: 0, y: 0, content: "" });
    };

    const handlePrevMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(prev => prev - 1);
        } else {
            setCurrentMonth(prev => prev - 1);
        }
    };

    const handleNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(prev => prev + 1);
        } else {
            setCurrentMonth(prev => prev + 1);
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

    const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();

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

    const calendarDates = generateCalendarDays();

    return (
        <div className="calendar-card-z" style={{ position: "relative" }}>
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
                    <button
                        className="calendar-arrow-z"
                        title="Reset to today"
                        onClick={() => {
                            const now = new Date();
                            const todayStr = now.toISOString().slice(0, 10); // "YYYY-MM-DD"
                            setCurrentMonth(now.getMonth());
                            setCurrentYear(now.getFullYear());
                            onDateSelect(todayStr); // ✅ trigger updates in both components
                        }}
                    >

                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M4.93 4.93a10 10 0 1 1-1.41 1.41L3 7h5V2l-1.41 1.41A10 10 0 0 1 4.93 4.93z"/>
                        </svg>
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
                        onClick={() => handleDateClick(dateObj)}
                        onMouseEnter={(e) => handleMouseEnter(e, dateObj)}
                        onMouseLeave={handleMouseLeave}
                    >
                        {dateObj ? dateObj.getDate() : ""}
                    </div>
                ))}
            </div>

            {tooltip.show && (
                <div
                    className="custom-tooltip"
                    style={{
                        position: "fixed",
                        top: tooltip.y,
                        left: tooltip.x,
                        transform: "translate(-50%, -100%)",
                        background: "#333",
                        color: "#fff",
                        padding: "4px 8px",
                        borderRadius: "4px",
                        fontSize: "12px",
                        zIndex: 1000,
                        pointerEvents: "none",
                    }}
                >
                    {tooltip.content}
                </div>
            )}
        </div>
    );
};

export default CalendarCard;
