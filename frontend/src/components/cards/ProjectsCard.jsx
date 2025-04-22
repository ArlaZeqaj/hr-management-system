// src/components/cards/ProjectsCard.jsx
import React from "react";

const ProjectsCard = () => {
    return (
        <div className="projects-card-z">
            <div className="projects-header-z">
                <h3 className="projects-title-z">Projects</h3>
                <span className="projects-tag-z">March</span>
            </div>

            <div className="projects-list-z">
                <div className="projects-item-z">
                    Done <span className="projects-count-z">36</span>
                </div>
                <div className="projects-item-z">
                    Ongoing <span className="projects-count-z">12</span>
                </div>
                <div className="projects-item-z">
                    Cancel <span className="projects-count-z">3</span>
                </div>
                <div className="projects-item-z">
                    Upcoming <span className="projects-count-z">4</span>
                </div>
            </div>

            <a href="#" className="projects-link-z">See details →</a>
        </div>
    );
};

export default ProjectsCard;
