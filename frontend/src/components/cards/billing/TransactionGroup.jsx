import React from "react";
import PropTypes from "prop-types";
import TransactionItem from "./TransactionItem";

const TransactionGroup = ({ label, transactions, formatDateGroup }) => {
  return (
    <div className="transaction-group">
      <h4 className="group-label">{label}</h4>
      <div className="transactions-list">
        {transactions.map((txn) => (
          <TransactionItem
            className="transaction"
            key={txn.id || txn.name}
            transaction={txn}
            formatDateGroup={formatDateGroup}
          />
        ))}
      </div>
    </div>
  );
};

TransactionGroup.propTypes = {
  label: PropTypes.string.isRequired,
  transactions: PropTypes.array.isRequired,
  formatDateGroup: PropTypes.func,
};

export default TransactionGroup;
