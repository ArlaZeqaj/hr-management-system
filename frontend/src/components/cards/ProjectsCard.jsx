// src/components/cards/ProjectsCard.jsx
import React from "react";

const ProjectsCard = () => {
    return (
        <div className="projects-card">
            <div className="projects-header">
                <h3 className="projects-title">Projects</h3>
                <span className="projects-tag">March</span>
            </div>

            <div className="projects-list">
                <div className="projects-item">
                    Done <span className="projects-count">36</span>
                </div>
                <div className="projects-item">
                    Ongoing <span className="projects-count">12</span>
                </div>
                <div className="projects-item">
                    Cancel <span className="projects-count">3</span>
                </div>
                <div className="projects-item">
                    Upcoming <span className="projects-count">4</span>
                </div>
            </div>

            <a href="#" className="projects-link">See details →</a>
        </div>
    );
};

export default ProjectsCard;
