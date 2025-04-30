// src/components/cards/StatCard.jsx

import React from "react";

const Statcard = ({ title, value, icon }) => {

    return (
        <div className="stat-card-z">
            <div className="stat-header-z">
                {icon && <img src={icon} alt="icon" className="stat-icon-z" />}
                <span className="stat-title-z">{title}</span>
            </div>
            <div className="stat-value-z">{value}</div>
        </div>
    );

};

export default Statcard;
