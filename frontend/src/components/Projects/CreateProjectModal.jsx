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

    // 🔁 Conversion: "DD/MM/YYYY" <=> "YYYY-MM-DD"
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
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Create New Project</h2>

                <input type="text" placeholder="Project Name" value={newProject.project_Name || ''} onChange={e => updateField('project_Name', e.target.value)} />
                <input type="text" placeholder="Company" value={newProject.company || ''} onChange={e => updateField('company', e.target.value)} />
                <input type="text" placeholder="Budget" value={newProject.budget || ''} onChange={e => updateField('budget', e.target.value)} />
                <input type="text" placeholder="Role" value={newProject.role || ''} onChange={e => updateField('role', e.target.value)} />

                <label>Start Date</label>
                <input
                    type="date"
                    value={convertToInputFormat(newProject.start_Date)}
                    onChange={e => updateField('start_Date', convertToDisplayFormat(e.target.value))}
                />

                <label>End Date</label>
                <input
                    type="date"
                    value={convertToInputFormat(newProject.end_Date)}
                    onChange={e => updateField('end_Date', convertToDisplayFormat(e.target.value))}
                />

                <textarea placeholder="Description" value={newProject.description || ''} onChange={e => updateField('description', e.target.value)} />
                <input type="text" placeholder="Project Image URL" value={newProject.image || ''} onChange={e => updateField('image', e.target.value)} />
                <input type="text" placeholder="Company Logo URL" value={newProject.company_img || ''} onChange={e => updateField('company_img', e.target.value)} />

                <label>Select Assigned Employees:</label>
                <select multiple onChange={handleEmployeeSelection}>
                    {employeeOptions.map((emp, index) => (
                        <option key={emp.uid} value={index}>{emp.fullName}</option>
                    ))}
                </select>

                <div className="modal-actions">
                    <button onClick={handleCreateProject}>Create</button>
                    <button onClick={() => setShowCreateModal(false)}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default CreateProjectModal;
