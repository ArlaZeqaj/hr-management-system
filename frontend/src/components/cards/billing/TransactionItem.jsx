import React from "react";
import PropTypes from "prop-types";

const TransactionItem = ({ transaction, formatDateGroup }) => {
  const { icon, name, date, amount, status, company } = transaction;

  // Determine transaction type
  const transactionType =
    status ||
    (typeof amount === "number"
      ? amount < 0
        ? "outgoing"
        : "incoming"
      : "pending");

  // Format amount display
  const formattedAmount =
    typeof amount === "number"
      ? amount < 0
        ? `-$${Math.abs(amount)}`
        : `+$${amount}`
      : amount;

  // Format date if needed
  const formattedDate = formatDateGroup
    ? formatDateGroup(date, "dd MMMM yyyy, 'at' hh:mm a")
    : date;

  return (
    <div className={`transaction ${transactionType}`}>
      <img src={icon} alt={name} className="transaction-icon" />
      <div className="transaction-info">
        <span className="name">{company || name}</span>
        <span className="date">{formattedDate}</span>
      </div>
      <div className="divider"></div>
      <span className={`amount ${transactionType}`}>{formattedAmount}</span>
    </div>
  );
};

TransactionItem.propTypes = {
  transaction: PropTypes.shape({
    id: PropTypes.string,
    icon: PropTypes.string.isRequired,
    name: PropTypes.string,
    date: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    status: PropTypes.string,
    company: PropTypes.string,
  }).isRequired,
  formatDateGroup: PropTypes.func,
};

export default TransactionItem;
