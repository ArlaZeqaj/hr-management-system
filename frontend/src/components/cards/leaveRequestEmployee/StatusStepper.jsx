import React from 'react';

const StatusStepper = ({ currentStep, submittedRequest, onCancel }) => {
    const isFinal = ["approved", "rejected", "cancelled"].includes(submittedRequest.status.toLowerCase());

    const steps = [
        { label: 'Submitted' },
        { label: 'In Review' },
        { label: isFinal ? submittedRequest.status.charAt(0).toUpperCase() + submittedRequest.status.slice(1) : 'Decision' }
    ];

    return (
        <div className="status-stepper">
            <div className="step-details">
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

                    {submittedRequest.status.toLowerCase() === "submitted" && (
                        <button
                            className="cancel-button"
                            onClick={() => onCancel(submittedRequest.id)}
                            style={{
                                marginTop: "10px",
                                backgroundColor: "#fdecea",         // faded red background
                                color: "#b91c1c",                   // dark red text
                                border: "1.5px solid #b91c1c",      // red border
                                borderRadius: "8px",               // rounded corners
                                padding: "6px 12px",
                                width: "fit-content",              // only as wide as text
                                fontWeight: "500",
                                fontSize: "14px",
                                cursor: "pointer"
                            }}
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </div>

            <div className="step-container">
                {steps.map((s, idx) => (
                    <React.Fragment key={idx}>
                        {idx > 0 && (
                            <div className={`step-connector ${currentStep > idx ? 'active' : ''}`} />
                        )}
                        <div className={`step ${currentStep >= idx ? 'active' : ''}`}>
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
