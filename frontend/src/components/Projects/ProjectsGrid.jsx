import React from 'react';
import ProjectCard from './ProjectCards';

const ProjectsGrid = ({ projects, setShowCreateModal }) => {
    const ongoingProjects = projects.filter(p => p.status?.toLowerCase() === 'ongoing').slice(0, 4);
    return (
        <div className="projects-section">
            <div className="projects-header-flex">
                <div>
                    <h2 className="section-title">Ongoing Projects</h2>
                    <p className="section-subtitle">Latest active projects with progress</p>
                </div>
            </div>
            <div className="projects-grid">
                {ongoingProjects.map(project => <ProjectCard key={project.id} project={project} />)}

                {ongoingProjects.length === 0 && (
                    <p className="section-subtitle">No ongoing projects available right now.</p>
                )}

                <div className="create-project-card" onClick={() => setShowCreateModal(true)}>
                    <div className="create-project-content">
                        <div className="plus-icon">+</div>
                        <span>Add New Project</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectsGrid;