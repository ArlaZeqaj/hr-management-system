// src/components/cards/TasksCard.jsx
import React from "react";

const TasksCard = () => {
    return (
        <div className="tasks-card">
            <h3 className="tasks-title">Tasks</h3>

            {/* In Progress */}
            <div className="tasks-section">
                <h4 className="tasks-subtitle in-progress">In Progress</h4>
                <ul className="tasks-list">
                    <li className="tasks-item">
                        <div className="tasks-left">
                            <input type="checkbox" checked className="tasks-checkbox indigo" readOnly />
                            <span>Dashboard Builder</span>
                        </div>
                        <span className="tasks-label indigo">In Progress</span>
                    </li>
                    <li className="tasks-item">
                        <div className="tasks-left">
                            <input type="checkbox" className="tasks-checkbox indigo" readOnly />
                            <span>Mobile App Design</span>
                        </div>
                        <span className="tasks-label indigo">In Progress</span>
                    </li>
                </ul>
            </div>

            {/* Completed */}
            <div className="tasks-section">
                <h4 className="tasks-subtitle completed">Completed</h4>
                <ul className="tasks-list">
                    <li className="tasks-item completed">
                        <div className="tasks-left">
                            <input type="checkbox" checked className="tasks-checkbox green" readOnly />
                            <span>Landing Page Design</span>
                        </div>
                        <span className="tasks-label green">Done</span>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default TasksCard;
