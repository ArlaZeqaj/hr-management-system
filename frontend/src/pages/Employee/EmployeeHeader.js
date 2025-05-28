import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const EmployeeHeader = ({
  activeMenuItem,
  darkMode,
  toggleDarkMode
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    surname: "",
    email: "",
    department: "",
    avatarURL: "",
    loading: true,
    error: null
  });

  const notificationRef = useRef(null);

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
        !event.target.closest('.employee-profile-button')) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const token = await user.getIdToken();
          const response = await axios.get(`/api/employees/by-email?email=${user.email}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });

          setUserData(u => ({
            ...u,
            name: response.data.firstName || response.data.name || "",
            surname: response.data.lastName || response.data.surname || "",
            email: response.data.email || user.email,
            department: response.data.department || "No department",
            avatarURL: response.data.avatarURL || "https://i.pinimg.com/736x/a3/a8/88/a3a888f54cbe9f0c3cdaceb6e1d48053.jpg",
            loading: false,
            error: null
          }));
        } catch (error) {
          console.error("Failed to fetch user data:", error);
          setUserData(u => ({
            ...u,
            loading: false,
            error: error.response?.data?.message || error.message
          }));
        }
      } else {
        setUserData(u => ({
          ...u,
          loading: false,
          error: "No user logged in"
        }));
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="employee-header">
      <div className="employee-breadcrumbs">
        <span className="employee-path">Pages / {activeMenuItem}</span>
        <span className="employee-current-page">{activeMenuItem}</span>
      </div>

      <div className="employee-header-actions">
        <div className="employee-action-icons">
          <div className="employee-profile-dropdown" ref={notificationRef}>
            <button
              className="employee-profile-button"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <img
                src={userData.avatarURL}
                alt="Profile"
              />
            </button>

            {showNotifications && (
              <div className="employee-dropdown-menu">
                {/* Dark Mode Toggle (small icon in corner) */}
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

                {/* Employee Info Section */}
                <div className="employee-dropdown-header">
                  <img
                    src={userData.avatarURL}
                    alt="Profile"
                    className="employee-dropdown-avatar"
                  />
                  <div className="employee-dropdown-info">
                    <h4>{userData.name} {userData.surname}</h4>
                    <p>{userData.email}</p>
                    <div className="employee-department-badge">
                      {userData.department}
                    </div>
                  </div>
                </div>

                <div className="employee-dropdown-divider"></div>

                {/* Logout Section */}
                <button className="employee-logout-btn" onClick={() => {
                  const auth = getAuth();
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

export default EmployeeHeader;