import React from "react";
import PaymentCard from "../cards/billing/PaymentCard";
import PaymentMethodCard from "../cards/billing/PaymentMethodCard";

const PaymentCardsSection = ({ cardData }) => {
  return (
    <div className="card-row">
      <PaymentCard
        logo="https://img.icons8.com/?size=100&id=106942&format=png&color=FFFFFFD4"
        number={cardData.number}
        expiry={cardData.expiry}
        cvv={cardData.cvv}
      />
      <PaymentMethodCard
        icon="https://img.icons8.com/?size=100&id=106586&format=png&color=FFFFFF"
        title="Balance"
        amount={`+${cardData.salary || "$55640.07"}`}
        color="#4318FF"
      />
      <PaymentMethodCard
        icon="https://img.icons8.com/?size=100&id=100394&format=png&color=FFFFFF"
        title="Expenses"
        amount={cardData.paypal || "$7505.21"}
        color="#2D3748"
      />
    </div>
  );
};

export default PaymentCardsSection;
