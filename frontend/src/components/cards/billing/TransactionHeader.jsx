import React from "react";

const TransactionHeader = () => {
  return (
    <div className="section-header">
      <h4>Your Transactions</h4>{" "}
      <img
        src="https://img.icons8.com/material-outlined/24/calendar--v1.png"
        alt="Calendar"
      />
      <div className="date-range">
        <span>26/05 - 01/06 2025</span>
      </div>
    </div>
  );
};

export default TransactionHeader;
