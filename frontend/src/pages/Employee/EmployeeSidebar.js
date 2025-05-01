import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

const EmployeeSidebar = ({ activeMenuItem, handleMenuItemClick, darkMode }) => {
  const navigate = useNavigate();

  const menuItems = [
    { name: "Dashboard", icon: "https://img.icons8.com/?size=100&id=Yj5svDsC4jQA&format=png&color=6b7280" },
    { name: "Profile", icon: "https://img.icons8.com/?size=100&id=83190&format=png&color=6b7280" },
    { name: "Projects", icon: "https://img.icons8.com/?size=100&id=102889&format=png&color=6b7280" },
    { name: "Leave Request", icon: "https://img.icons8.com/?size=100&id=30330&format=png&color=6b7280" },
    { name: "Documents", icon: "https://img.icons8.com/?size=100&id=85927&format=png&color=6b7280" }
  ];

  return (
    <div className={`employee-sidebar ${darkMode ? "dark-theme" : ""}`}>
      <div className="employee-sidebar-header">
        <span className="employee-logo">
          <span className="logo-highlight">HR</span>CLOUDX
        </span>
        <div className="sidebar-divider"></div>
      </div>

      <div className="employee-sidebar-menu">
        {menuItems.map((item) => (
          <div
            key={item.name}
            className={`employee-menu-item ${activeMenuItem === item.name ? "active" : ""}`}
            onClick={() => handleMenuItemClick(item.name)}
          >
            <div className="menu-item-content">
              <img src={item.icon} className="admin-icons" />
              <span>{item.name}</span>
            </div>
            <div className="active-indicator"></div>
          </div>
        ))}
      </div>
      
      <div className="employee-sidebar-footer">
        <div className="employee-user-profile">
          <div className="employee-profile-avatar">JD</div>
          <div className="employee-profile-info">
            <span className="employee-profile-name">John Doe</span>
            <span className="employee-profile-role">Employee</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeSidebar;