import React from "react";

const AdminFooter = () => {
  return (
    <div className="admin-footer">
      <span>
        © 2025 HRCLOUDX Admin Portal. All Rights Reserved. Version 2.4.1
      </span>
      <div className="footer-links">
        <a href="#">
          <i className="fas fa-shield-alt"></i> Privacy Policy
        </a>
        <a href="#">
          <i className="fas fa-file-contract"></i> Terms of Service
        </a>
        <a href="#">
          <i className="fas fa-question-circle"></i> Help Center
        </a>
      </div>
    </div>
  );
};

export default AdminFooter;