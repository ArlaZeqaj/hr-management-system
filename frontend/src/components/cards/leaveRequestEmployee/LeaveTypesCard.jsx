// src/components/LeaveTypesCard.jsx
import React from 'react';


const LeaveTypesCard = () => {
    const leaveTypes = [
        { value: 'Vacation', label: 'Vacation' },
        { value: 'LeaveWithoutPay', label: 'Leave Without Pay' },
        { value: 'MedicalLeave', label: 'Medical Leave' },
        { value: 'Remote', label: 'Remote' },
        { value: 'PregnancyLeave', label: 'Pregnancy Leave' },
        { value: 'SpecialLeave', label: 'Special Leave' }
    ];

    const leaveTypeColors = {
        Vacation: '#38B2AC',
        LeaveWithoutPay: '#F6AD55',
        MedicalLeave: '#F687B3',
        Remote: '#9F7AEA',
        PregnancyLeave: '#68D391',
        SpecialLeave: '#4299E1'
    };

    return (
        <div className="leave-types-card">
            <h3 className="leave-types-title">Leave Types & Colors</h3>
            <div className="leave-types-grid">
                {leaveTypes.map(t => (
                    <div key={t.value} className="leave-type-item">
            <span
                className="leave-color-dot"
                style={{ backgroundColor: leaveTypeColors[t.value] }}
            />
                        <span className="leave-type-name">{t.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LeaveTypesCard;

