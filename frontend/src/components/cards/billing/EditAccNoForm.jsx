import React from "react";
import PropTypes from "prop-types";

const EditAccNoForm = ({ editAccNo, setEditAccNo, onSave, empId }) => {
  return (
    <div className="edit-form">
      <input
        type="text"
        value={editAccNo}
        onChange={(e) => setEditAccNo(e.target.value)}
        className="account-input"
      />
      <button onClick={() => onSave(empId)} className="save-btn">
        Save
      </button>
    </div>
  );
};

EditAccNoForm.propTypes = {
  editAccNo: PropTypes.string.isRequired,
  setEditAccNo: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  empId: PropTypes.string.isRequired,
};

export default EditAccNoForm;
