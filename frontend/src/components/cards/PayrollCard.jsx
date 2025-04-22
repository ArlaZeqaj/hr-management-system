// src/components/cards/PayrollCard.jsx
import React from "react";

const PayrollCard = () => {
    return (
        <div className="payroll-card">
            <div className="payroll-bg-circle top-right"></div>
            <div className="payroll-bg-circle bottom-left"></div>

            <p className="payroll-label">Total Payroll</p>
            <p className="payroll-amount">$2,400</p>
            <a href="#" className="payroll-link">View details</a>
        </div>
    );
};

export default PayrollCard;
