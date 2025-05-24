import React from "react";
import PropTypes from "prop-types";
import TransactionHeader from "../cards/billing/TransactionHeader";
import TransactionGroup from "../cards/billing/TransactionGroup";

const TransactionsSection = ({ groupedTransactions, formatDateGroup }) => {
  return (
    <section className="transactions">
      <TransactionHeader />

      <div className="time-label">NEWEST</div>
      {Object.entries(groupedTransactions).map(([label, txns]) => (
        <TransactionGroup
          key={label}
          label={label}
          transactions={txns}
          formatDateGroup={formatDateGroup}
        />
      ))}
    </section>
  );
};

TransactionsSection.propTypes = {
  groupedTransactions: PropTypes.object.isRequired,
  formatDateGroup: PropTypes.func.isRequired,
};

export default TransactionsSection;
