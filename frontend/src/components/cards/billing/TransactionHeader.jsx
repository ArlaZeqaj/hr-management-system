import React from "react";

const TransactionHeader = () => {
  return (
    <div className="section-header">
      <h4>Your Transactions</h4>
      <div className="date-range" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <img
          src="https://img.icons8.com/?size=100&id=117816&format=png&color=000000"
          style={{ width: '20px', height: '20px' }}
          alt="Calendar"
        />
        <span>12 - 18 May 2025</span>
      </div>
    </div>
  );
};

export default TransactionHeader;
