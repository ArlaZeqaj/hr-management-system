import React from "react";
import PropTypes from "prop-types";
import EditAccNoForm from "./EditAccNoForm";

const BillingInfoCard = ({
  emp,
  editingId,
  editAccNo,
  onEdit,
  onSave,
  onCancel,
  setEditAccNo,
  onDelete,
}) => {
  return (
    <div className="info-card">
      <div className="card-header">
        <h4 className="employee-name">
          {emp.name} {emp.surname}
        </h4>
      </div>
      <div className="card-content">
        <div className="info-row">
          <span className="info-label">Department:</span>
          <span className="info-value">{emp.department}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Email:</span>
          <span className="info-value">{emp.email}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Account No:</span>
          {editingId === emp.id ? (
            <EditAccNoForm
              editAccNo={editAccNo}
              setEditAccNo={setEditAccNo}
              onSave={onSave}
              onCancel={onCancel}
              empId={emp.id}
            />
          ) : (
            <span className="info-value">{emp.accNo || "Not provided"}</span>
          )}
        </div>
      </div>
      <div className="card-actions">
        <div className="actions-container">
          {editingId !== emp.id ? (
            <>
              <button
                className="action-btn-b edit-btn-b"
                onClick={() => onEdit(emp)}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13"
                    stroke="#339AF0"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z"
                    stroke="#339AF0"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Edit
              </button>
              <button
                className="action-btn-b delete-btn-b"
                onClick={() => onDelete(emp.id)}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 6H5H21"
                    stroke="#E53E3E"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z"
                    stroke="#E53E3E"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Delete
              </button>
            </>
          ) : null}
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
  onCancel: PropTypes.func.isRequired,
  setEditAccNo: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default BillingInfoCard;
