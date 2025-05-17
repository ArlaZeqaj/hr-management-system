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
    bio: "",
    education: "",
    languages: "",
    departament: "",
    workHistory: "",
    organization: "",
    birthDate: "",
    avatarURL: "",
    loading: true,
    error: null
  });
  const [notifications, setNotifications] = useState({
    "Item update notifications": false,
    "Item comment notifications": false,
    "Buyer review notifications": false,
    "Rating reminders notifications": true,
    "Meetups near you notifications": false,
    "Company news notifications": false,
    "New launches and projects": false,
    "Monthly product changes": false,
    "Subscribe to newsletter": false,
    "Email me when someone follows me": false,
  });
  const [selectedFiles, setSelectedFiles] = useState([]);

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
        !event.target.closest('.profile-button')) {
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
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          setUserData({
            name: response.data.firstName || response.data.name || "",
            surname: response.data.lastName || response.data.surname || "",
            email: response.data.email || user.email,
            bio: response.data.bio || "No bio",
            education: response.data.education || "No data",
            languages: Array.isArray(response.data.languages)
              ? response.data.languages.join(", ")
              : response.data.languages || "No data",
            workHistory: Array.isArray(response.data.workHistory)
              ? response.data.workHistory.join(", ")
              : response.data.workHistory || "No data",
            departament: response.data.departament || "No data",
            organization: response.data.organization || "No data",
            birthDate: response.data.birthDate || "No data",
            avatarURL: response.data.avatarURL || "https://i.pinimg.com/736x/a3/a8/88/a3a888f54cbe9f0c3cdaceb6e1d48053.jpg",
            loading: false,
            error: null
          });
        } catch (error) {
          console.error("Failed to fetch user data:", error);
          setUserData({
            ...userData,
            loading: false,
            error: error.response?.data?.message || error.message
          });
        }
      } else {
        setUserData({
          ...userData,
          loading: false,
          error: "No user logged in"
        });
      }
    });
    return () => unsubscribe();
  }, []);

  const toggleNotification = (notification) => {
    setNotifications(prev => ({
      ...prev,
      [notification]: !prev[notification]
    }));
  };

  return (
    <div className="employee-header">
      <div className="employee-breadcrumbs">
        <span className="employee-path">Pages / {activeMenuItem}</span>
        <span className="employee-current-page">{activeMenuItem}</span>
      </div>

      <div className="employee-header-actions">
        <div className="employee-action-icons">
          <button
            onClick={toggleDarkMode}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              cursor: "pointer",
            }}
          >
            <img
              src={
                darkMode
                  ? "https://img.icons8.com/?size=100&id=83221&format=png&color=FFFFFF"
                  : "https://img.icons8.com/?size=100&id=96393&format=png&color=A3AED0"
              }
              alt={darkMode ? "Light Mode" : "Dark Mode"}
              style={{ width: "24px", height: "24px" }}
            />
          </button>
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
                <h3>Notification Settings</h3>
                {Object.keys(notifications).map((item) => (
                  <div key={item} className="toggle-item">
                    <span>{item}</span>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={notifications[item]}
                        onChange={() => toggleNotification(item)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                ))}
                <div className="employee-dropdown-divider">
                <button className="employee-logout-btn" onClick={() => {
                  // Add your logout logic here
                  const auth = getAuth();
                  auth.signOut();
                  window.location.href = "/"; // or your login route
                }}>
                  <img
                    src="https://img.icons8.com/?size=100&id=2444&format=png&color=FA5252"
                    className="logout-icon"
                    alt="Logout"
                  />
                  <span>Logout</span>
                </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeHeader;