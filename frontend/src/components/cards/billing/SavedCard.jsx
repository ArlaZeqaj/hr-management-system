import React from "react";

const SavedCard = ({ icon, number, active = false }) => (
  <div className={`saved-card ${active ? "active" : ""}`}>
    <div className="card-info">
      <img src={icon} alt="Card" className="card-type-icon" />
      <span>{number}</span>
      <img
        src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Hvb8f3Xbra/luyjsx96_expires_30_days.png"
        alt="Options"
        className="card-menu-icon"
      />
    </div>
    <div className="card-divider"></div>
  </div>
);

export default SavedCard;
