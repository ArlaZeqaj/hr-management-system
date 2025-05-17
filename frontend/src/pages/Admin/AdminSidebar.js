import React from "react";
import { useNavigate } from 'react-router-dom';

const AdminSidebar = ({ activeMenuItem, handleMenuItemClick }) => {
  const navigate = useNavigate();

  return (
    <div className="admin-sidebar">
      <div className="admin-sidebar-header">
        <span className="admin-logo">HRCLOUDX</span>
        <span className="admin-logo">ADMIN</span>
      </div>

      {/* Admin Menu Items */}
      <div className="admin-sidebar-menu">
        <div
          className={`admin-menu-item ${activeMenuItem === "Dashboard" ? "active" : ""}`}
          onClick={() => handleMenuItemClick("Dashboard")}
        >
           <img src="https://img.icons8.com/?size=100&id=Yj5svDsC4jQA&format=png&color=FFFFFF" className="admin-icons"/>
          <span>Dashboard</span>
        </div>
        <div
          className={`admin-menu-item ${activeMenuItem === "Profile" ? "active" : ""}`}
          onClick={() => handleMenuItemClick("Profile")}
        >
          <img src="https://img.icons8.com/?size=100&id=83190&format=png&color=FFFFFF" className="admin-icons"/>
          <span>Profile</span>
        </div>
        <div
          className={`admin-menu-item ${activeMenuItem === "New Hires" ? "active" : ""}`}
          onClick={() => handleMenuItemClick("New Hires")}
        >
          <img src="https://img.icons8.com/?size=100&id=87049&format=png&color=FFFFFF" className="admin-icons"/>
          <span>New Hires</span>
        </div>
        <div
          className={`admin-menu-item ${activeMenuItem === "Employees" ? "active" : ""}`}
          onClick={() => handleMenuItemClick("Employees")}
        >
          <img src="https://img.icons8.com/?size=100&id=85167&format=png&color=FFFFFF" className="admin-icons"/>
          <span>Employees</span>
        </div>
        <div
          className={`admin-menu-item ${activeMenuItem === "Billing" ? "active" : ""}`}
          onClick={() => handleMenuItemClick("Billing")}
        >
          <img src="https://img.icons8.com/?size=100&id=87528&format=png&color=FFFFFF" className="admin-icons"/>
          <span>Billing</span>
        </div>
        <div
          className={`admin-menu-item ${activeMenuItem === "Projects" ? "active" : ""}`}
          onClick={() => handleMenuItemClick("Projects")}
        >
          <img src="https://img.icons8.com/?size=100&id=102889&format=png&color=FFFFFF" className="admin-icons"/>
          <span>Projects</span>
        </div>
      </div>
      {/* Upgrade Card */}
      <div className="sidebar-bottom-a">
        <div className="upgrade-card-a">
          <img
            src="https://img.icons8.com/?size=100&id=84109&format=png&color=000000"
            className="upgrade-icon-a"
            alt="Upgrade"
          />
          <div className="upgrade-text-a">
            <div>Upgrade to PRO</div>
            <small>to get access to all features!</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;