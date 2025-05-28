import React from "react";
import SavedCard from "../cards/billing/SavedCard";

const PaymentMethodsSection = ({ cardData, setShowModal }) => {
  return (
    <section className="payment-methods">
      <div className="section-header">
        <h3>Payment Method</h3>
        <button className="add-card-btn" onClick={() => setShowModal(true)}>
          ADD A NEW CARD
        </button>
      </div>

      <div className="cards-list">
        <SavedCard
          icon="https://img.icons8.com/?size=100&id=106942&format=png&color=A3AED0"
          number={cardData.number}
          active
        />
        <SavedCard
          icon="https://img.icons8.com/?size=100&id=87495&format=png&color=A3AED0"
          number={cardData.number}
        />
      </div>
    </section>
  );
};

export default PaymentMethodsSection;
