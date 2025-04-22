// src/components/cards/TasksCard.jsx
import React from "react";

const TasksCard = () => {
    return (
        <div className="tasks-card-z">
            <h3 className="tasks-title-z">Tasks</h3>

            {/* In Progress */}
            <div className="tasks-section-z">
                <h4 className="tasks-subtitle-z in-progress">In Progress</h4>
                <ul className="tasks-list-z">
                    <li className="tasks-item-z">
                        <div className="tasks-left-z">
                            <input type="checkbox" checked className="tasks-checkbox-z indigo" readOnly />
                            <span>Dashboard Builder</span>
                        </div>
                        <span className="tasks-label-z indigo">In Progress</span>
                    </li>
                    <li className="tasks-item-z">
                        <div className="tasks-left-z">
                            <input type="checkbox" className="tasks-checkbox-z indigo" readOnly />
                            <span>Mobile App Design</span>
                        </div>
                        <span className="tasks-label-z indigo">In Progress</span>
                    </li>
                </ul>
            </div>

            {/* Completed */}
            <div className="tasks-section-z">
                <h4 className="tasks-subtitle-z completed">Completed</h4>
                <ul className="tasks-list-z">
                    <li className="tasks-item-z completed">
                        <div className="tasks-left-z">
                            <input type="checkbox" checked className="tasks-checkbox-z green" readOnly />
                            <span>Landing Page Design</span>
                        </div>
                        <span className="tasks-label-z green">Done</span>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default TasksCard;
