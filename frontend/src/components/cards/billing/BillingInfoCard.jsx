import React from "react";
import PropTypes from "prop-types";
import EditAccNoForm from "./EditAccNoForm";

const BillingInfoCard = ({
  emp,
  editingId,
  editAccNo,
  onEdit,
  onSave,
  setEditAccNo,
}) => {
  return (
    <div className="info-card">
      <div className="card-header">
        <h4>
          {emp.name} {emp.surname}
        </h4>
      </div>
      <div className="card-content">
        <p>
          <strong>Department:</strong> {emp.department}
        </p>
        <p>
          <strong>Email:</strong> {emp.email}
        </p>
        <div className="account-section">
          <strong>Account No: </strong>
          {editingId === emp.id ? (
            <EditAccNoForm
              editAccNo={editAccNo}
              setEditAccNo={setEditAccNo}
              onSave={onSave}
              empId={emp.id}
            />
          ) : (
            <span>{emp.accNo}</span>
          )}
        </div>
      </div>
      <div className="card-actions">
        <div className="actions-container">
          {editingId !== emp.id && (
            <button className="edit-btn" onClick={() => onEdit(emp)}>
              <img
                src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Hvb8f3Xbra/7otne8qi_expires_30_days.png"
                alt="Edit"
              />
              Edit
            </button>
          )}
          <button className="delete-btn">
            <img
              src="https://fontawesome.com/icons/trash?f=classic&s=solid"
              alt="Delete"
            />
            <span>DELETE</span>
          </button>
        </div>
      </div>
    </div>
  );
};

BillingInfoCard.propTypes = {
  emp: PropTypes.object.isRequired,
  editingId: PropTypes.string,
  editAccNo: PropTypes.string,
  onEdit: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  setEditAccNo: PropTypes.func.isRequired,
};

export default BillingInfoCard;
