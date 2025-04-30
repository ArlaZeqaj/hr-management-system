// src/components/CalendarGrid.jsx
import React from 'react';



const CalendarGrid = ({ monthDate, events, onHover }) => {
    const year = monthDate.getFullYear();
    const monthIndex = monthDate.getMonth();
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    // 0=Sunday, 1=Monday ... 6=Saturday
          const firstWeekday = new Date(year, monthIndex, 1).getDay() ;
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    return (
        <div className="calendar-grid">
            {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
                <div key={d} className="day-header">{d}</div>
            ))}

                 {/* blank cells to offset the start */}
                  {Array.from({ length: firstWeekday }).map((_, idx) => (
                    <div key={`blank-${idx}`} className="calendar-cell empty" />
                 ))}

            {days.map(day => {
                const dayEvents = events.filter(e => e.day === day);
                return (
                    <div
                        key={day}
                        className={`calendar-cell ${dayEvents.length ? 'has-events' : ''}`}
                        onMouseEnter={e => dayEvents.length && onHover(dayEvents[0], { x: e.clientX, y: e.clientY })}
                        onMouseLeave={() => onHover(null, {})}
                    >
                        <div className="calendar-cell-content">
                            <div className="day-number">{day}</div>
                            {dayEvents.map(ev => (
                                   <div
                                     key={ev.id}
                                    className="event-pill"
                                     style={{ backgroundColor: ev.bgColor, color: ev.textColor }}
                                   >
                                     {ev.title}+   </div>  ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default CalendarGrid;


