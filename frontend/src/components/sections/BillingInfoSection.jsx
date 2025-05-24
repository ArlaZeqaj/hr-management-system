import React from "react";
import BillingInfoCard from "../cards/billing/BillingInfoCard";

const BillingInfoSection = ({
  billingData,
  loading,
  editingId,
  editAccNo,
  handleEdit,
  handleSave,
  setEditAccNo,
}) => {
  return (
    <section className="billing-info">
      <h3>Billing Information</h3>
      <div className="info-cards">
        {loading ? (
          <p>Loading billing info...</p>
        ) : billingData.length === 0 ? (
          <p>No billing information found.</p>
        ) : (
          billingData
            .slice(0, 3)
            .map((emp) => (
              <BillingInfoCard
                key={emp.id}
                emp={emp}
                editingId={editingId}
                editAccNo={editAccNo}
                onEdit={handleEdit}
                onSave={handleSave}
                setEditAccNo={setEditAccNo}
              />
            ))
        )}
      </div>
    </section>
  );
};

export default BillingInfoSection;
