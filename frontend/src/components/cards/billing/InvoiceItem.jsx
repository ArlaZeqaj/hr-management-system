import React from "react";
import PropTypes from "prop-types";

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
      return "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Hvb8f3Xbra/kl8fuv50_expires_30_days.png";
    if (amountValue > 200)
      return "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Hvb8f3Xbra/7i42j92c_expires_30_days.png";
    return "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Hvb8f3Xbra/ooymt6ca_expires_30_days.png";
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
          className="pdf-button"
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
