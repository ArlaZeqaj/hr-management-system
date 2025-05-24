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

        const start = new Date(startDate);
        const end = new Date(endDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (start < today) {
            alert('Start date cannot be in the past.');
            return;
        }

        if (end < start) {
            alert('End date cannot be before start date.');
            return;
        }

        const limits = {
            Vacation: 20,
            LeaveWithoutPay: Infinity,
            MedicalLeave: 15,
            Remote: Infinity,
            PregnancyLeave: 180,
            SpecialLeave: 10
        };

        const daysRequested = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
        const maxAllowed = limits[leaveType] || 0;

        if (maxAllowed < Infinity && daysRequested > maxAllowed) {
            alert(`You cannot request more than ${maxAllowed} days for ${leaveType}.`);
            return;
        }

        onSubmit({ startDate, endDate, leaveType });
    };

    return (
        <div className="leave-request-form">
            <h2>Request Leave</h2>
            <div className="form-row-lr">
                <div className="form-group-lr">
                    <label htmlFor="start-date">Start Date</label>
                    <input
                        type="date"
                        id="start-date"
                        value={startDate}
                        onChange={e => setStartDate(e.target.value)}
                    />
                </div>
                <div className="form-group-lr">
                    <label htmlFor="end-date">End Date</label>
                    <input
                        type="date"
                        id="end-date"
                        value={endDate}
                        onChange={e => setEndDate(e.target.value)}
                    />
                </div>
                <div className="form-group-lr">
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
                <div className="buttonstand-vertically">
                    <button className="submit-button-lr" onClick={handleClick}>
                        Submit Request
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LeaveForm;