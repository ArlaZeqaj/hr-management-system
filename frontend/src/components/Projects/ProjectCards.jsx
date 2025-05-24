// components/Projects/ProjectCard.jsx
import React, { useState, useEffect } from 'react';
import { getProgressColor, getStatusIcon, calculateDaysLeft } from '../utils/projectUtils';
import { getAuth } from 'firebase/auth';
import axios from 'axios';

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

        // ⏱ 0–1 days = 0%, every 2 days adds 10%
        const progress = Math.floor(daysPassed / 2) * 10;
        return Math.min(progress, 99);
    }

    return 0;
};


const ProjectCard = ({ project, darkMode }) => {
    const [showModal, setShowModal] = useState(false);
    const [editableProject, setEditableProject] = useState({...project});
    const [employeeOptions, setEmployeeOptions] = useState([]);

    const progress = calculateProgress(project);
    const daysLeftText = calculateDaysLeft(project.end_Date);

    useEffect(() => {
        const fetchEmployees = async () => {
            const auth = getAuth();
            const user = auth.currentUser;
            if (!user) return;
            const token = await user.getIdToken();

            try {
                const res = await axios.get("http://localhost:8080/api/employees/dropdown", {
                    headers: {Authorization: `Bearer ${token}`}
                });
                setEmployeeOptions(res.data);
            } catch (error) {
                console.error("Failed to fetch employee list:", error);
            }
        };
        fetchEmployees();
    }, []);

    const handleChange = (field, value) => {
        setEditableProject(prev => ({...prev, [field]: value}));
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
            const user = auth.currentUser;
            const token = await user.getIdToken();

            await axios.put(`http://localhost:8080/api/projects/${editableProject.id}`, editableProject, {
                headers: {Authorization: `Bearer ${token}`}
            });

            alert("✅ Project updated!");
            setShowModal(false);
        } catch (err) {
            console.error("Failed to save project:", err);
            alert("❌ Failed to update project.");
        }
    };
    // Convert Firestore Timestamp to input string
    // Convert "DD/MM/YYYY" → "YYYY-MM-DD" for input display
    // Convert "MM/DD/YYYY" → "YYYY-MM-DD" for input type="date"
    const convertToInputFormat = (dateStr) => {
        if (!dateStr) return '';
        const [month, day, year] = dateStr.split('/');
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    };

// Convert "YYYY-MM-DD" from input → "MM/DD/YYYY" for saving
    const convertToDisplayFormat = (inputDate) => {
        if (!inputDate) return '';
        const [year, month, day] = inputDate.split('-');
        return `${month.padStart(2, '0')}/${day.padStart(2, '0')}/${year}`;
    };



    return (
        <>
            <div className="project-card" onClick={() => setShowModal(true)}>
                <div className="project-image">
                    <img src={project.image || "/placeholder.svg"} alt={project.project_Name} />
                </div>
                <div className="project-content">
                    <h3 className="project-title">{project.project_Name}</h3>
                    <p className="project-description">
                        🕒 {daysLeftText}<br />
                        👥 {project.assigned_Employees?.slice(0, 2).join(', ') || 'Unassigned'}
                    </p>
                    <div className="project-footer">
                        <div className="progress-bar">
                            <div
                                className="progress-fill"
                                style={{ width: `${progress}%`, backgroundColor: getProgressColor(project.status) }}
                            />
                        </div>
                        <span className={`status-badge status-${project.status?.toLowerCase()}`}>
            {getStatusIcon(project.status)} {project.status}
          </span>
                    </div>
                </div>
            </div>

            {showModal && (
                <div className="project-modal-overlay-z">
                    <div className={`project-modal-z ${darkMode ? 'dark-mode' : ''}`}>
                        <div className="modal-content-z">

                            {/* LEFT: Image section */}
                            <div className="modal-left-z">
                                <label>Project Image URL</label>
                                <input
                                    type="text"
                                    value={editableProject.image || ''}
                                    onChange={e => handleChange('image', e.target.value)}
                                    placeholder="Project Image URL"
                                />
                                {editableProject.image ? (
                                    <img src={editableProject.image} alt="Preview" />
                                ) : (
                                    <div className="img-placeholder">Image preview unavailable</div>
                                )}

                                <label>Description</label>
                                <textarea
                                    value={editableProject.description || ''}
                                    onChange={e => handleChange('description', e.target.value)}
                                />
                            </div>

                            {/* RIGHT: Details section */}
                            <div className="modal-right-z">
                                <label>Budget</label>
                                <input
                                    type="text"
                                    value={editableProject.budget || ''}
                                    onChange={e => handleChange('budget', e.target.value)}
                                />

                                <label>Role</label>
                                <input
                                    type="text"
                                    value={editableProject.role || ''}
                                    onChange={e => handleChange('role', e.target.value)}
                                />

                                <label>Start Date</label>
                                <input
                                    type="date"
                                    value={convertToInputFormat(editableProject.start_Date)}
                                    onChange={e => handleChange('start_Date', convertToDisplayFormat(e.target.value))}
                                />

                                <label>End Date</label>
                                <input
                                    type="date"
                                    value={convertToInputFormat(editableProject.end_Date)}
                                    onChange={e => handleChange('end_Date', convertToDisplayFormat(e.target.value))}
                                />



                                <label>Assigned Employees</label>
                                <select multiple onChange={handleEmployeeSelection}>
                                    {employeeOptions.map((emp, index) => (
                                        <option
                                            key={emp.uid}
                                            value={index}
                                            selected={editableProject.assigned_id?.includes(emp.uid)}
                                        >
                                            {emp.fullName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Sticky bottom buttons */}
                        <div className="modal-actions-z">
                            <button onClick={handleSave}>Save Changes</button>
                            <button onClick={() => setShowModal(false)}>Close</button>
                        </div>
                    </div>
                </div>
            )}

        </>
    );

};

    export default ProjectCard;
