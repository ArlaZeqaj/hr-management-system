import React from "react";

const SavedCard = ({ icon, number, active = false }) => (
  <div className={`saved-card ${active ? "active" : ""}`}>
    <div className="card-info">
      <img src={icon} alt="Card" className="card-type-icon" />
      <span>{number}</span>
      <img
        width="14"
        height="14"
        src="https://img.icons8.com/?size=100&id=11476&format=png&color=A3A3D0"
        alt="visa"
      />
    </div>
    <div className="card-divider"></div>
  </div>
);

export default SavedCard;
