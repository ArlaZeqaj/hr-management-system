// src/components/cards/StatCard.jsx
import React from "react";

const StatCard = ({ title, value, isFlag }) => {
    return (
        <div className="stat-card">
            <div className="stat-title">{title}</div>
            {isFlag ? (
                <img
                    src="https://flagcdn.com/us.svg"
                    alt="Flag"
                    className="stat-flag"
                />
            ) : (
                <div className="stat-value">{value}</div>
            )}
        </div>
    );
};

export default StatCard;
