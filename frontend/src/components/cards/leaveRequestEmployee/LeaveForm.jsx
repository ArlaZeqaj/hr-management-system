// src/components/LeaveForm.jsx
import React, { useState } from 'react';



const LeaveForm = ({ onSubmit }) => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [leaveType, setLeaveType] = useState('Vacation');

    const leaveTypes = [
        { value: 'Vacation', label: 'Vacation' },
        { value: 'LeaveWithoutPay', label: 'Leave Without Pay' },
        { value: 'MedicalLeave', label: 'Medical Leave' },
        { value: 'Remote', label: 'Remote' },
        { value: 'PregnancyLeave', label: 'Pregnancy Leave' },
        { value: 'SpecialLeave', label: 'Special Leave' }
    ];

    const handleClick = () => {
        if (!startDate || !endDate) {
            alert('Please select both start and end dates');
            return;
        }
        console.log('LeaveForm → calling onSubmit', { startDate, endDate, leaveType });

        onSubmit({ startDate, endDate, leaveType });
    };

    return (
        <div className="leave-request-form">
            <h2>Request Leave</h2>
            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="start-date">Start Date</label>
                    <input
                        type="date"
                        id="start-date"
                        value={startDate}
                        onChange={e => setStartDate(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="end-date">End Date</label>
                    <input
                        type="date"
                        id="end-date"
                        value={endDate}
                        onChange={e => setEndDate(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="leave-type">Type of Leave</label>
                    <select
                        id="leave-type"
                        value={leaveType}
                        onChange={e => setLeaveType(e.target.value)}
                    >
                        {leaveTypes.map(t => (
                            <option key={t.value} value={t.value}>{t.label}</option>
                        ))}
                    </select>
                </div>
                <button className="submit-button" onClick={handleClick}>
                    Submit Request
                </button>
            </div>
        </div>
    );
};

export default LeaveForm;
