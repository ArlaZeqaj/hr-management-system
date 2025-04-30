// src/components/StatusStepper.jsx
import React from 'react';

const StatusStepper = ({ currentStep, submittedRequest }) => {
    const steps = [
        { label: 'Submitted' },
        { label: 'In Review' },
        { label: currentStep === 3 ? 'Approved' : 'Decision' }
    ];

    return (
        <div className="status-stepper">
            <div className="step-details">
                {submittedRequest && (
                    <div className="request-details">
                        <div className="detail-row">
                            <span className="detail-label">Type:</span>
                            <span>{submittedRequest.leaveType}</span>
                        </div>
                        <div className="detail-row">
                            <span className="detail-label">Dates:</span>
                            <span>{submittedRequest.startDate} to {submittedRequest.endDate}</span>
                        </div>
                        <div className="detail-row">
                            <span className="detail-label">Submitted:</span>
                            <span>{submittedRequest.submittedAt}</span>
                        </div>
                    </div>
                )}
            </div>
            <div className="step-container">
                {steps.map((s, idx) => (
                    <React.Fragment key={idx}>
                        {idx > 0 && (
                            <div className={`step-connector ${currentStep > idx ? 'active' : ''}`} />
                        )}
                        <div className={`step ${currentStep > idx ? 'active' : ''}`}>
                            <div className="step-circle">{idx + 1}</div>
                            <div className="step-label">{s.label}</div>
                        </div>
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default StatusStepper;
