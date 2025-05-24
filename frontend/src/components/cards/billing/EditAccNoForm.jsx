import React from "react";
import PropTypes from "prop-types";

const EditAccNoForm = ({ editAccNo, setEditAccNo, onSave, onCancel, empId }) => {
  const handleCancel = () => {
    setEditAccNo(""); // Reset the input
    onCancel(); // Call the parent cancel function
  };

  return (
    <div className="edit-form-container-b">
      <div className="input-group-b">
        <input
          type="text"
          value={editAccNo}
          onChange={(e) => setEditAccNo(e.target.value)}
          className="account-input-b"
          placeholder="Enter account number"
        />
      </div>
      <div className="form-divider"></div>
      <div className="form-actions-b">
        <button 
          onClick={() => onSave(empId)} 
          className="save-btn-b"
          disabled={!editAccNo.trim()}
        >
          Save
        </button>
        <button 
          onClick={handleCancel} 
          className="cancel-btn-b"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

EditAccNoForm.propTypes = {
  editAccNo: PropTypes.string.isRequired,
  setEditAccNo: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  empId: PropTypes.string.isRequired,
};

export default EditAccNoForm;