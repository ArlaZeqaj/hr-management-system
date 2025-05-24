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
          icon="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Hvb8f3Xbra/lyn2slbm_expires_30_days.png"
          number={cardData.number}
          active
        />
        <SavedCard
          icon="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Hvb8f3Xbra/8rtvtp5o_expires_30_days.png"
          number={cardData.number}
        />
      </div>
    </section>
  );
};

export default PaymentMethodsSection;
