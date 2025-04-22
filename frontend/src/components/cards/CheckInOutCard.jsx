// src/components/cards/CheckInOutCard.jsx
import React from "react";

const CheckInOutCard = () => {
    return (
        <div className="check-card">
            <button className="check-btn">Check-in</button>
            <button className="check-btn">Check-out</button>
            <div className="check-status">
                Checked-in: 08:30:44<br />
                Checked-out: 16:23:19
            </div>
        </div>
    );
};

export default CheckInOutCard;
