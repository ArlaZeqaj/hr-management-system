// src/components/cards/CheckInOutCard.jsx
import React from "react";

const CheckInOutCard = () => {
    return (
        <div className="check-card-z">
            <button className="check-btn-z">Check-in</button>
            <button className="check-btn-z">Check-out</button>
            <div className="check-status-z">
                Checked-in: 08:30:44<br />
                Checked-out: 16:23:19
            </div>
        </div>
    );
};

export default CheckInOutCard;
