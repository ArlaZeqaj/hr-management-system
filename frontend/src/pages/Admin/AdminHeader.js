import React from "react";

const AdminHeader = ({ 
  activeMenuItem, 
  searchQuery, 
  setSearchQuery, 
  darkMode, 
  toggleDarkMode,
  notifications,
  toggleNotification
}) => {
  return (
    <div className="admin-header">
      <div className="admin-breadcrumbs">
        <span className="path">Admin / {activeMenuItem}</span>
        <span className="current-page">{activeMenuItem}</span>
      </div>

      <div className="admin-header-actions">
        <div className="admin-action-icons">
          <button className="admin-icon-btn" title="Alerts">
          <img src="https://img.icons8.com/?size=100&id=86551&format=png&color=A3AED0" className="alerts-icon"/>
            <span className="badge">7</span>
          </button>
          <button
            onClick={toggleDarkMode}
            className="admin-icon-btn"
          >
            <img
              src={
                darkMode
                  ? "https://img.icons8.com/?size=100&id=83221&format=png&color=A3AED0"
                  : "https://img.icons8.com/?size=100&id=96393&format=png&color=A3AED0"
              }
              alt={darkMode ? "Light Mode" : "Dark Mode"}
              style={{ width: "24px", height: "24px" }}
            />
          </button>
          <div className="admin-profile-dropdown">
            <button className="profile-btn">
              <img
                src="https://randomuser.me/api/portraits/men/75.jpg"
                alt="Admin"
              />
              <span>Admin User</span>
              <i className="fas fa-chevron-down"></i>
            </button>
            <div className="admin-dropdown-content">
              <div className="admin-dropdown-header">
                <img
                  src="https://randomuser.me/api/portraits/men/75.jpg"
                  alt="Admin"
                />
                <div>
                  <h4>Admin User</h4>
                  <p>Super Administrator</p>
                </div>
              </div>
              <a href="/" className="logout">
              <img src="https://img.icons8.com/?size=100&id=2444&format=png&color=FA5252" className="alerts-icon"/> Logout
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;