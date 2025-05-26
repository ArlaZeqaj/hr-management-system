import React from "react";
import PropTypes from "prop-types";

const PaymentCard = ({ logo, number, expiry, cvv }) => {
  return (
    <div className="payment-card">
      <div className="card-header">
        <span>HRCloudX</span>
        <img src={logo} alt="Card" className="card-logo" />
      </div>
      <div className="card-number">{number}</div>
      <div className="card-footer">
        <div>
          <small>VALID THRU</small>
          <span>{expiry}</span>
        </div>
        <div>
          <small>CVV</small>
          <span>{cvv}</span>
        </div>
      </div>
    </div>
  );
};

PaymentCard.propTypes = {
  logo: PropTypes.string.isRequired,
  number: PropTypes.string,
  expiry: PropTypes.string,
  cvv: PropTypes.string,
};

export default PaymentCard;
