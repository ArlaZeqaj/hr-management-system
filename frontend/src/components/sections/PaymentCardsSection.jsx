import React from "react";
import PaymentCard from "../cards/billing/PaymentCard";
import PaymentMethodCard from "../cards/billing/PaymentMethodCard";

const PaymentCardsSection = ({ cardData }) => {
  return (
    <div className="card-row">
      <PaymentCard
        logo="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Hvb8f3Xbra/4a0s3ehi_expires_30_days.png"
        number={cardData.number}
        expiry={cardData.expiry}
        cvv={cardData.cvv}
      />
      <PaymentMethodCard
        icon="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Hvb8f3Xbra/vxv57pzf_expires_30_days.png"
        title="Balance"
        amount={`+${cardData.salary || "$55640.07"}`}
        color="#4318FF"
      />
      <PaymentMethodCard
        icon="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Hvb8f3Xbra/358903cd_expires_30_days.png"
        title="Expenses"
        amount={cardData.paypal || "$7505.21"}
        color="#2D3748"
      />
    </div>
  );
};

export default PaymentCardsSection;
