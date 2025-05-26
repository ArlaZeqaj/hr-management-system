import React from "react";
import PropTypes from "prop-types";

const PaymentMethodCard = ({ icon, title, amount, color }) => {
  return (
    <div className="payment-method" style={{ borderTop: `4px solid ${color}` }}>
      <button className="method-icon" style={{ backgroundColor: color }}>
        <img src={icon} alt={title} />
      </button>
      <h4>{title}</h4>
      <div className="divider"></div>
      <span className="amount">{amount}</span>
    </div>
  );
};

PaymentMethodCard.propTypes = {
  icon: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  amount: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
};

export default PaymentMethodCard;
