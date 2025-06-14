import React, { useState } from "react";
import PropTypes from "prop-types";
import TransactionHeader from "../cards/billing/TransactionHeader";
import TransactionGroup from "../cards/billing/TransactionGroup";

const TransactionsSection = ({ groupedTransactions, formatDateGroup }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerGroup = 3; // Transactions per group per page

  const paginatedGroups = Object.entries(groupedTransactions).reduce(
    (acc, [label, txns]) => {
      const totalPages = Math.ceil(txns.length / transactionsPerGroup);
      const currentPageForGroup = Math.min(currentPage, totalPages);
      const startIdx = (currentPageForGroup - 1) * transactionsPerGroup;
      const endIdx = startIdx + transactionsPerGroup;

      acc[label] = txns.slice(startIdx, endIdx);
      return acc;
    },
    {}
  );

  const totalGroups = Object.keys(groupedTransactions).length;
  const hasMorePages = Object.entries(groupedTransactions).some(
    ([_, txns]) => currentPage * transactionsPerGroup < txns.length
  );

  return (
    <section className="transactions">
      <TransactionHeader />
      <div className="transactions-container">
        <div className="transactions-scrollable">
          {Object.entries(paginatedGroups).map(
            ([label, txns]) =>
              txns.length > 0 && (
                <TransactionGroup
                  key={label}
                  label={label}
                  transactions={txns}
                  formatDateGroup={formatDateGroup}
                />
              )
          )}
        </div>
      </div>
    </section>
  );
};

export default TransactionsSection;
