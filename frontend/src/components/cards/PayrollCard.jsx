// src/components/cards/PayrollCard.jsx
import React from "react";

const PayrollCard = () => {
    return (
        <div className="payroll-card-z">
            <div className="payroll-bg-circle-z top-right"></div>
            <div className="payroll-bg-circle-z bottom-left"></div>

            <p className="payroll-label-z">Total Payroll</p>
            <p className="payroll-amount-z">$2,400</p>
            <a href="#" className="payroll-link-z">View details</a>
        </div>
    );
};

export default PayrollCard;
