import React from "react";
import PropTypes from "prop-types";
import { FileText, FileDigit, FileSearch } from "lucide-react";

const InvoiceItem = ({
  date,
  invoiceNumber,
  amount,
  currency = "$",
  onGeneratePDF,
}) => {
  const amountValue =
    typeof amount === "string"
      ? parseFloat(amount.replace(/[^0-9.]/g, ""))
      : amount;

  // Determine which PDF icon to use based on amount
  const getPdfIcon = () => {
    if (amountValue > 500)
      return "https://img.icons8.com/?size=100&id=86868&format=png&color=FA5252";
    if (amountValue > 200)
      return "https://img.icons8.com/?size=100&id=86868&format=png&color=5C7CFA";
    return "https://img.icons8.com/?size=100&id=86868&format=png&color=74A824";
  };

  // Format amount display
  const formattedAmount =
    typeof amount === "number" ? amount.toFixed(2) : amount;

  return (
    <div className="invoice-item">
      <div className="invoice-info">
        <span className="invoice-date">{date}</span>
        <span className="invoice-number">{invoiceNumber}</span>
      </div>
      <div className="invoice-divider"></div>
      <div className="invoice-actions">
        <span className="invoice-amount">
          {currency}
          {formattedAmount}
        </span>
        <button
          className="pdf-btn"
          onClick={onGeneratePDF}
          aria-label="Generate PDF"
        >
          <img src={getPdfIcon()} />
          <span>PDF</span>
        </button>
      </div>
    </div>
  );
};

InvoiceItem.propTypes = {
  date: PropTypes.string.isRequired,
  invoiceNumber: PropTypes.string.isRequired,
  amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  currency: PropTypes.string,
  onGeneratePDF: PropTypes.func,
};

export default InvoiceItem;
