import React, { useState, useEffect } from 'react';
import { getProgressColor } from '../utils/projectUtils';
import axios from 'axios';
import { getAuth } from 'firebase/auth';

const calculateProgress = (project) => {
    const status = project.status?.toLowerCase();

    if (status === "done") return 100;

    if (status === "canceled") {
        return project.progressAtCancel ?? 0;
    }

    if (status === "ongoing") {
        const startDate = new Date(
            project.start_Date?.seconds
                ? project.start_Date.seconds * 1000
                : project.start_Date
        );
        const today = new Date();

        const daysPassed = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
        const progress = Math.floor(daysPassed / 2) * 10;
        return Math.min(progress, 99);
    }

    return 0;
};

const convertToInputFormat = (dateStr) => {
    if (!dateStr) return '';
    const [month, day, year] = dateStr.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
};

const convertToDisplayFormat = (inputDate) => {
    if (!inputDate) return '';
    const [year, month, day] = inputDate.split('-');
    return `${month.padStart(2, '0')}/${day.padStart(2, '0')}/${year}`;
};

const ProjectsTable = ({
    projects = [],
    setProjects,
    employeeOptions = [],
    darkMode = false,
    triggerRefresh
}) => {
    const [selectedProject, setSelectedProject] = useState(null);
    const [editableProject, setEditableProject] = useState(null);

    useEffect(() => {
        if (selectedProject) setEditableProject({ ...selectedProject });
    }, [selectedProject]);

    const isReadOnly = selectedProject?.status?.toLowerCase() === 'done' || selectedProject?.status?.toLowerCase() === 'canceled';

    const handleStatusChange = async (projectId, newStatus) => {
        const project = projects.find(p => p.id === projectId);
        if (!project) return;

        const updatedProject = { ...project };

        if (newStatus === "canceled" && project.status === "ongoing") {
            updatedProject.progressAtCancel = calculateProgress(project);
        }

        updatedProject.status = newStatus;

        try {
            const auth = getAuth();
            const token = await auth.currentUser.getIdToken();
            await axios.put(`http://localhost:8080/api/projects/${projectId}/status`, { status: newStatus }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (newStatus === "canceled" && updatedProject.progressAtCancel != null) {
                await axios.put(`http://localhost:8080/api/projects/${projectId}`, {
                    progressAtCancel: updatedProject.progressAtCancel
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }

            await triggerRefresh();
        } catch (err) {
            console.error("Failed to update status:", err);
        }
    };

    const handleDelete = async (projectId) => {
        if (!window.confirm("Are you sure you want to delete this project?")) return;
        try {
            const auth = getAuth();
            const token = await auth.currentUser.getIdToken();
            await axios.delete(`http://localhost:8080/api/projects/${projectId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            await triggerRefresh();
        } catch (err) {
            console.error("Failed to delete project:", err);
        }
    };

    const handleChange = (field, value) => {
        setEditableProject(prev => ({ ...prev, [field]: value }));
    };

    const handleEmployeeSelection = (e) => {
        const selectedIndices = Array.from(e.target.selectedOptions).map(option => parseInt(option.value));
        const selectedEmployees = selectedIndices.map(index => employeeOptions[index]);
        const names = selectedEmployees.map(emp => emp.fullName);
        const uids = selectedEmployees.map(emp => emp.uid);

        setEditableProject(prev => ({
            ...prev,
            assigned_Employees: names,
            assigned_id: uids
        }));
    };


    const handleSave = async () => {
        try {
            const auth = getAuth();
            const token = await auth.currentUser.getIdToken();
            await axios.put(`http://localhost:8080/api/projects/${editableProject.id}`, editableProject, {
                headers: { Authorization: `Bearer ${token}` }
            });
            await triggerRefresh();
            setSelectedProject(null);
        } catch (err) {
            console.error("Failed to save project:", err);
        }
    };

    return (
        <div className="projects-table-section">
            <div className="table-header-section">
                <h2 className="section-title">All Projects</h2>
            </div>
            <div className="projects-table">
                <div className="tablee-header">
                    <div className="header-companies">COMPANIES</div>
                    <div className="header-budget">BUDGET</div>
                    <div className="header-status">STATUS</div>
                    <div className="header-completion">COMPLETION</div>
                    <div className="header-actions-ap">ACTIONS</div>
                </div>
                {Array.isArray(projects) && projects.map(proj => {
                    const status = proj.status?.toLowerCase();
                    const completion = calculateProgress(proj);

                    return (
                        <div key={proj.id} className="tablee-row">
                            <div className="cell-company">
                                <div className="company-icon" style={{ backgroundColor: "#4318FF20", color: "#4318FF" }}>
                                    {proj.project_Name?.[0] || "?"}
                                </div>
                                <span>{proj.project_Name} <small style={{ color: "#888" }}>({proj.company})</small></span>
                            </div>
                            <div className="cell-budget">${proj.budget || "—"}</div>
                            <div className="cell-status">
                                {status === "ongoing" ? (
                                    <select
                                        value={proj.status}
                                        onChange={(e) => handleStatusChange(proj.id, e.target.value)}
                                        className={`statuss-dropdown statuss-${status}`}
                                    >
                                        <option value="Ongoing">Ongoing</option>
                                        <option value="Done">Done</option>
                                        <option value="Canceled">Canceled</option>
                                    </select>
                                ) : (
                                    <span className={`statuss-text statuss-${status}`}>{proj.status}</span>
                                )}
                            </div>
                            <div className="cell-completion">
                                <div className="completion-text">{completion}%</div>
                                <div className="progress-bar-aproject">
                                    <div
                                        className="progress-fill-aproject"
                                        style={{ width: `${completion}%`, backgroundColor: getProgressColor(proj.status) }}
                                    />
                                </div>
                            </div>
                            <div className="cell-actions">
                                <button className="action-button-aproject" title="View Project"
                                    onClick={() => setSelectedProject(proj)}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="#339AF0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="#339AF0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>

                                </button>
                                <button className="action-button-aproject" title="Delete Project" onClick={() => handleDelete(proj.id)}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M3 6H5H21" stroke="#E53E3E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="#E53E3E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>

                                </button>

                            </div>
                        </div>
                    );
                })}
            </div>

            {selectedProject && editableProject && (
                <div className="project-modal-overlay-aproject-z">
                    <div className={`project-modal-aproject ${darkMode ? 'dark-mode' : ''}`}>
                        <div className="modal-content-aproject-z">
                            <div className="modal-left-aproject">
                                <label>Project Image URL</label>
                                <input
                                    type="text"
                                    value={editableProject.image || ''}
                                    onChange={e => handleChange('image', e.target.value)}
                                    placeholder="Project Image URL"
                                    disabled={isReadOnly}
                                />
                                {editableProject.image ? (
                                    <img src={editableProject.image} alt="Preview" className="project-image-aproject" />
                                ) : (
                                    <div className="img-placeholder-aproject">Image preview unavailable</div>
                                )}
                                <label>Description</label>
                                <textarea
                                    value={editableProject.description || ''}
                                    onChange={e => handleChange('description', e.target.value)}
                                    disabled={isReadOnly}
                                    className="project-description-aproject"
                                />
                            </div>
                            <div className="modal-right-aproject">
                                <label>Budget</label>
                                <input
                                    type="text"
                                    value={editableProject.budget || ''}
                                    onChange={e => handleChange('budget', e.target.value)}
                                    disabled={isReadOnly}
                                    className="project-budget-aproject"
                                />
                                <label>Role</label>
                                <input
                                    type="text"
                                    value={editableProject.role || ''}
                                    onChange={e => handleChange('role', e.target.value)}
                                    disabled={isReadOnly}
                                    className="project-role-aproject"
                                />
                                <label>Start Date</label>
                                <input
                                    type="date"
                                    value={convertToInputFormat(editableProject.start_Date)}
                                    onChange={e => handleChange('start_Date', convertToDisplayFormat(e.target.value))}
                                    disabled={isReadOnly}
                                    className="project-date-aproject"
                                />
                                <label>End Date</label>
                                <input
                                    type="date"
                                    value={convertToInputFormat(editableProject.end_Date)}
                                    onChange={e => handleChange('end_Date', convertToDisplayFormat(e.target.value))}
                                    disabled={isReadOnly}
                                    className="project-date-aproject"
                                />

                                {editableProject.assigned_Employees?.length > 0 && (
                                    <div className="assigned-names-aproject">
                                        <strong>Selected:</strong> {editableProject.assigned_Employees.join(', ')}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="modal-actions-aproject-z">
                            {!isReadOnly && <button className="save-btn-aproject" onClick={handleSave}>Save Changes</button>}
                            <button className="close-btn-aproject-z" onClick={() => setSelectedProject(null)}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectsTable;