import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getAuth, onAuthStateChanged } from "firebase/auth";

const CreateProjectModal = ({ newProject, setNewProject, handleCreateProject, setShowCreateModal }) => {
    const [employeeOptions, setEmployeeOptions] = useState([]);

    useEffect(() => {
        const fetchEmployees = async () => {
            const auth = getAuth();
            onAuthStateChanged(auth, async (user) => {
                if (!user) return;
                const token = await user.getIdToken();

                try {
                    const res = await axios.get("http://localhost:8080/api/employees/dropdown", {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setEmployeeOptions(res.data);
                } catch (error) {
                    console.error("Failed to fetch employee dropdown list:", error.response?.data || error.message);
                }
            });
        };

        fetchEmployees();
    }, []);

    const updateField = (field, value) => {
        setNewProject(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleEmployeeSelection = (e) => {
        const selectedIndices = Array.from(e.target.selectedOptions).map(option => parseInt(option.value));
        const selectedEmployees = selectedIndices.map(index => employeeOptions[index]);
        const names = selectedEmployees.map(emp => emp.fullName);
        const uids = selectedEmployees.map(emp => emp.uid);

        setNewProject(prev => ({
            ...prev,
            assigned_Employees: names,
            assigned_id: uids
        }));
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

    return (
        <div className="modal-overlay-aproject">
            <div className="modal-content-aproject">
                <div className="modal-header-aproject">
                    <h2>Create New Project</h2>
                    <button 
                        className="close-btn-aproject" 
                        onClick={() => setShowCreateModal(false)}
                    >
                        &times;
                    </button>
                </div>

                <div className="form-grid-aproject">
                    {/* Basic Info Column */}
                    <div className="form-column-aproject">
                        <div className="form-group-aproject">
                            <label>Project Name*</label>
                            <input 
                                type="text" 
                                placeholder="Enter project name" 
                                value={newProject.project_Name || ''} 
                                onChange={e => updateField('project_Name', e.target.value)} 
                                required
                            />
                        </div>

                        <div className="form-group-aproject">
                            <label>Company*</label>
                            <input 
                                type="text" 
                                placeholder="Enter company name" 
                                value={newProject.company || ''} 
                                onChange={e => updateField('company', e.target.value)} 
                                required
                            />
                        </div>

                        <div className="form-group-aproject">
                            <label>Budget</label>
                            <input 
                                type="text" 
                                placeholder="Enter budget" 
                                value={newProject.budget || ''} 
                                onChange={e => updateField('budget', e.target.value)} 
                            />
                        </div>

                        <div className="form-group-aproject">
                            <label>Role</label>
                            <input 
                                type="text" 
                                placeholder="Enter role" 
                                value={newProject.role || ''} 
                                onChange={e => updateField('role', e.target.value)} 
                            />
                        </div>
                    </div>

                    {/* Dates & Media Column */}
                    <div className="form-column-aproject">
                        <div className="form-group-aproject">
                            <label>Start Date*</label>
                            <input
                                type="date"
                                value={convertToInputFormat(newProject.start_Date)}
                                onChange={e => updateField('start_Date', convertToDisplayFormat(e.target.value))}
                                required
                            />
                        </div>

                        <div className="form-group-aproject">
                            <label>End Date</label>
                            <input
                                type="date"
                                value={convertToInputFormat(newProject.end_Date)}
                                onChange={e => updateField('end_Date', convertToDisplayFormat(e.target.value))}
                            />
                        </div>

                        <div className="form-group-aproject">
                            <label>Project Image URL</label>
                            <input 
                                type="text" 
                                placeholder="Enter image URL" 
                                value={newProject.image || ''} 
                                onChange={e => updateField('image', e.target.value)} 
                            />
                        </div>

                        <div className="form-group-aproject">
                            <label>Company Logo URL</label>
                            <input 
                                type="text" 
                                placeholder="Enter logo URL" 
                                value={newProject.company_img || ''} 
                                onChange={e => updateField('company_img', e.target.value)} 
                            />
                        </div>
                    </div>
                </div>

                {/* Full-width elements */}
                <div className="form-group-aproject">
                    <label>Description</label>
                    <textarea 
                        placeholder="Enter project description" 
                        value={newProject.description || ''} 
                        onChange={e => updateField('description', e.target.value)} 
                        rows="4"
                    />
                </div>

                <div className="form-group-aproject">
                    <label>Assigned Employees</label>
                    <select 
                        multiple 
                        onChange={handleEmployeeSelection}
                        className="employee-select-aproject"
                    >
                        {employeeOptions.map((emp, index) => (
                            <option key={emp.uid} value={index}>{emp.fullName}</option>
                        ))}
                    </select>
                    <small className="select-hint-aproject">Hold Ctrl/Cmd to select multiple</small>
                </div>

                <div className="modal-actions-aproject">
                    <button 
                        className="cancel-btn-aproject" 
                        onClick={() => setShowCreateModal(false)}
                    >
                        Cancel
                    </button>
                    <button 
                        className="create-btn-aproject" 
                        onClick={handleCreateProject}
                    >
                        Create Project
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateProjectModal;