import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from "firebase/auth";

const EmployeeSidebar = ({ activeMenuItem, handleMenuItemClick, darkMode }) => {
  const navigate = useNavigate();
  const [employeeData, setEmployeeData] = useState({
    name: "",
    surname: "",
    role: "Employee",
    loading: true
  });

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const token = await user.getIdToken();
          const response = await fetch(`/api/employees/by-email?email=${user.email}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          
          if (!response.ok) throw new Error("Failed to fetch employee data");
          
          const data = await response.json();
          
          setEmployeeData({
            name: data.firstName || data.name || "",
            surname: data.lastName || data.surname || "",
            role: data.role || "Employee",
            loading: false
          });
        } catch (error) {
          console.error("Error fetching employee data:", error);
          setEmployeeData(prev => ({
            ...prev,
            loading: false,
            error: error.message
          }));
        }
      }
    });
    
    return () => unsubscribe();
  }, []);

  // Function to get initials from name and surname
  const getInitials = (name, surname) => {
    const firstInitial = name ? name.charAt(0).toUpperCase() : '';
    const lastInitial = surname ? surname.charAt(0).toUpperCase() : '';
    return `${firstInitial}${lastInitial}`;
  };

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
              <img src={item.icon} className="admin-icons" alt={item.name} />
              <span>{item.name}</span>
            </div>
            <div className="employee-active-indicator"></div>
          </div>
        ))}
      </div>
      
      <div className="employee-sidebar-footer">
        {employeeData.loading ? (
          <div className="employee-profile-loading">Loading...</div>
        ) : (
          <div className="employee-user-profile">
            <div className="employee-profile-avatar">
              {getInitials(employeeData.name, employeeData.surname)}
            </div>
            <div className="employee-profile-info">
              <span className="employee-profile-name">
                {employeeData.name} {employeeData.surname}
              </span>
              <span className="employee-profile-role">{employeeData.role}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeSidebar;