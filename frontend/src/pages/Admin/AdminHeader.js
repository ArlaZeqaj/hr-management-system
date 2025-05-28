import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const AdminHeader = ({ 
  activeMenuItem, 
  darkMode, 
  toggleDarkMode,
}) => {

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

  return (
    <div className="admin-header">
      <div className="admin-breadcrumbs">
        <span className="path">Admin / {activeMenuItem}</span>
        <span className="current-page">{activeMenuItem}</span>
      </div>

      <div className="admin-header-actions">
        <div className="admin-action-icons">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;