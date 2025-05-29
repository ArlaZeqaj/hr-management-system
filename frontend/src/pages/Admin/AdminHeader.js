import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const AdminHeader = ({ 
  activeMenuItem, 
  darkMode, 
  toggleDarkMode,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    role: "",
    avatarURL: "",
    loading: true,
    error: null
  });

  const notificationRef = useRef(null);
  const auth = getAuth();

  const fetchAdminData = useCallback(async (user) => {
    try {
      const token = await user.getIdToken();
      const response = await axios.get(`/api/admins/by-email?email=${user.email}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      // Ensure the response has the expected structure
      const adminData = response.data || {};
      
      setUserData({
        name: adminData.name || "Admin",
        email: adminData.email || user.email,
        role: adminData.role || adminData.position || "Administrator",
        avatarURL: adminData.avatarURL || adminData.photoURL || "https://www.shutterstock.com/image-photo/close-photo-attractive-strong-healthy-600nw-1308189415.jpg",
        loading: false,
        error: null
      });
    } catch (error) {
      console.error("Failed to fetch admin data:", error);
      setUserData({
        name: "Ziko",
        email: user?.email || "",
        role: "IT Admin",
        avatarURL: "https://www.shutterstock.com/image-photo/close-photo-attractive-strong-healthy-600nw-1308189415.jpg",
        loading: false,
        error: error.response?.data?.message || error.message
      });
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-theme");
    } else {
      document.body.classList.remove("dark-theme");
    }
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target) &&
        !event.target.closest('.profile-btn')) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchAdminData(user);
      } else {
        setUserData(prev => ({
          ...prev,
          loading: false,
          error: "No user logged in"
        }));
      }
    });
    return () => unsubscribe();
  }, [auth, fetchAdminData]);

  if (userData.loading) {
    return (
      <div className="admin-header">
        <div className="admin-breadcrumbs">
          <span className="path">Admin / {activeMenuItem}</span>
          <span className="current-page">{activeMenuItem}</span>
        </div>
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  return (
    <div className="admin-header">
      <div className="admin-breadcrumbs">
        <span className="path">Admin / {activeMenuItem}</span>
        <span className="current-page">{activeMenuItem}</span>
      </div>

      <div className="admin-header-actions">
        <div className="admin-action-icons">
          <div className="admin-profile-dropdown" ref={notificationRef}>
            <button
              className="profile-btn"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <img
                src={userData.avatarURL}
                alt="Admin"
                className="admin-avatar"
              />
              <span>{userData.name || "Admin"}</span>
              <i className="fas fa-chevron-down"></i>
            </button>

            {showNotifications && (
              <div className="admin-dropdown-content">
                <button
                  className="dark-mode-toggle-icon"
                  onClick={toggleDarkMode}
                  aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
                >
                  <img
                    src={
                      darkMode
                        ? "https://img.icons8.com/?size=100&id=83221&format=png&color=FFFFFF"
                        : "https://img.icons8.com/?size=100&id=96393&format=png&color=A3AED0"
                    }
                    alt=""
                    className="dark-mode-icon"
                  />
                </button>

                <div className="admin-dropdown-header">
                  <img
                    src={userData.avatarURL}
                    alt="Admin"
                    className="admin-avatar-large"
                  />
                  <div>
                    <h4>{userData.name}</h4>
                    <p>{userData.email}</p>
                    {userData.role && (
                      <div className="employee-department-badge">
                        {userData.role}
                      </div>
                    )}
                  </div>
                </div>

                <button className="employee-logout-btn" onClick={() => {
                  auth.signOut();
                  window.location.href = "/";
                }}>
                  <img
                    src="https://img.icons8.com/?size=100&id=2444&format=png&color=FA5252"
                    className="logout-icon"
                    alt="Logout"
                  />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;