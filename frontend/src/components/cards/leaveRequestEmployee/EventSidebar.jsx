// src/components/EventSidebar.jsx
import React from 'react';

const EventSidebar = ({ event, position }) => {
    const start = new Date(event.startDate);
    const monthName = start.toLocaleString('default', { month: 'long' });
    const year = start.getFullYear();

    return (
        <div
            className="event-sidebar"
            style={{
                position: 'fixed',
                left: `${position.x + 20}px`,
                top: `${position.y + 20}px`
            }}
        >
            <div className="sidebar-header">
                <h3>Leave Details</h3>
            </div>
            <div className="event-details">
                <h4>{event.title}</h4>
                <p><strong>Start:</strong> {event.startDate}</p>
                <p><strong>End:</strong> {event.endDate}</p>
                <p><strong>Status:</strong> {event.status}</p>
                <p><strong>Submitted:</strong> {event.submittedAt}</p>
            </div>
        </div>
    );
};

export default EventSidebar;

