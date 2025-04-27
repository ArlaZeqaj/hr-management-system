import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import "../styles/ProfilePageEmployee.css";
import { useBirthdays } from '../services/BirthdayContext';
import BirthdayCard from '../services/BirthdayCard';

const ProfilePageEmployee = () => {
  const [activeMenuItem, setActiveMenuItem] = useState("Profile");
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode ? JSON.parse(savedMode) : false;
  });
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

  const { allBirthdays, loading: birthdaysLoading, error: birthdaysError } = useBirthdays();

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

  const handleMenuItemClick = (menuItem) => {
    setActiveMenuItem(menuItem);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleNotification = (notification) => {
    setNotifications(prev => ({
      ...prev,
      [notification]: !prev[notification]
    }));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    alert(`${files.length} file(s) selected`);
  };

  const handleSendWish = (employee) => {
    alert(`Sending birthday wish to ${employee.name}!`);
  };

  return (
    <div className="profile-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <span className="logo">HRCLOUDX</span>
        </div>

        {/* Menu Items */}
        <div className="sidebar-menu">
          <div
            className={`menu-item ${
              activeMenuItem === "Dashboard" ? "active" : ""
            }`}
            onClick={() => handleMenuItemClick("Dashboard")}
          >
            <img
              src="https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/e5cdd104-7027-4111-b9b0-203ead13153a"
              className="menu-icon"
              alt="Dashboard"
            />
            <span>Dashboard</span>
          </div>
          <div
            className={`menu-item ${
              activeMenuItem === "Profile" ? "active" : ""
            }`}
            onClick={() => handleMenuItemClick("Profile")}
          >
            <img
              src="https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/f83d5003-9309-4c08-b4fb-effc29fd197d"
              className="menu-icon"
              alt="Profile"
            />
            <span>Profile</span>
          </div>
          <div
            className={`menu-item ${
              activeMenuItem === "Leave Requests" ? "active" : ""
            }`}
            onClick={() => handleMenuItemClick("Leave Requests")}
          >
            <img
              src="https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/6980a5d3-86da-498c-89ac-e7776a1a050a"
              className="menu-icon"
              alt="Leave Requests"
            />
            <span>Leave Requests</span>
          </div>
          <div
            className={`menu-item ${
              activeMenuItem === "Projects" ? "active" : ""
            }`}
            onClick={() => handleMenuItemClick("Projects")}
          >
            <img
              src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Hvb8f3Xbra/6yzmslw0_expires_30_days.png"
              className="menu-icon"
              alt="Projects"
            />
            <span>Projects</span>
          </div>
        </div>

        {/* Upgrade Card */}
        <div className="sidebar-bottom">
          <div className="upgrade-card">
            <div className="upgrade-content">
              <div className="pro-badge">
                <span className="pro-icon">⭐</span>
                <span className="pro-text">Upgrade to PRO</span>
              </div>
              <p className="upgrade-text">Unlock all features</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="header">
          <div className="breadcrumbs">
            <span className="path">Pages / {activeMenuItem}</span>
            <span className="current-page">{activeMenuItem}</span>
          </div>

          <div className="header-actions">
            <div className="action-icons">
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
                      ? "https://cdn-icons-png.flaticon.com/512/581/581601.png"
                      : "https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/fc94b941-d6a8-49dd-9e4a-a8d7bce035cd"
                  }
                  alt={darkMode ? "Light Mode" : "Dark Mode"}
                  style={{ width: "24px", height: "24px" }}
                />
              </button>
              <div className="profile-dropdown" ref={notificationRef}>
                <button
                  className="profile-button"
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <img
                    src={userData.avatarURL}
                    alt="Profile"
                  />
                </button>
                {showNotifications && (
                  <div className="dropdown-menu">
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
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Profile Section */}
        <div className="profile-section">
          <div className="profile-card">
            <div className="profile-header">
              <div className="cover-photo-overlay"></div>
              <img
                src="https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/57709ee9-ee37-41a1-8342-a56a90377035"
                className="cover-photo"
                alt="Cover"
              />
              <div className="profile-photo-container">
                <img
                  src={userData.avatarURL}
                  className="profile-photo"
                  alt="Profile"
                />
              </div>
            </div>

            <div className="profile-content">
              {userData.loading ? (
                <div className="loading-spinner">Loading user data...</div>
              ) : userData.error ? (
                <div className="error-message">
                  Error loading profile: {userData.error}
                </div>
              ) : (
                <>
                  <h1 className="profile-name">
                    {userData.name} {userData.surname}
                  </h1>
                  <p className="profile-title">{userData.email}</p>
                  <p className="profile-title">{userData.departament}</p>
                  <div className="profile-divider"></div>
                  <p className="profile-bio">{userData.bio}</p>
                </>
              )}
            </div>
          </div>

          {/* Birthday Card */}
          <BirthdayCard
            birthdays={allBirthdays}
            loading={birthdaysLoading}
            error={birthdaysError}
            onSendWish={handleSendWish}
          />

          {/* Upload Card */}
          <div className="upload-card">
            <div className="upload-area">
              <input
                type="file"
                id="file-upload"
                className="file-input"
                accept=".png,.jpg,.jpeg,.gif"
                multiple
                onChange={handleFileUpload}
              />
              <label htmlFor="file-upload" className="upload-button">
                <img
                  src="https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/f81c15c3-242e-4ba1-91ed-f191592c92b7"
                  alt="Upload"
                />
                <h3>Upload Files</h3>
                <p>PNG, JPG and GIF files are allowed</p>
              </label>
            </div>

            <div className="complete-profile">
              <h3>Complete your profile</h3>
              <p>
                Stay on the pulse of distributed projects with an online
                whiteboard to plan, coordinate and discuss
              </p>
              <button className="publish-btn">Publish now</button>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="content-section">
          <div className="projects-card">
            <h2>All Projects</h2>
            <p className="subtext">
              Here you can find more details about your projects. Keep your user
              engaged by providing meaningful information.
            </p>

            <div className="project-list">
              {/* Project Items */}
              <div className="project-item">
                <img
                  src="https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/9c80177c-314a-4f0a-8b59-2f7172cc43f6"
                  alt="Project 1"
                />
                <div className="project-info">
                  <h4>Technology behind the Blockchain</h4>
                  <div className="project-meta">
                    <span>Project #1</span>
                    <span>•</span>
                    <a href="#">See project details</a>
                  </div>
                </div>
                <img
                  src="https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/b35fea9b-a952-4264-af4d-0402a2c28137"
                  className="more-icon"
                  alt="More"
                />
              </div>

              <div className="project-item">
                <img
                  src="https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/e72c4cfd-fba8-4609-b6b2-3bb212d5b895"
                  alt="Project 2"
                />
                <div className="project-info">
                  <h4>Greatest way to a good Economy</h4>
                  <div className="project-meta">
                    <span>Project #2</span>
                    <span>•</span>
                    <a href="#">See project details</a>
                  </div>
                </div>
                <img
                  src="https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/7691a40f-5bb1-4649-ac52-b4c3fd40e625"
                  className="more-icon"
                  alt="More"
                />
              </div>

              <div className="project-item">
                <img
                  src="https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/cc91f55f-a364-4d2b-b9ab-a674cd9f7238"
                  alt="Project 3"
                />
                <div className="project-info">
                  <h4>Most essential tips for Burnout</h4>
                  <div className="project-meta">
                    <span>Project #3</span>
                    <span>•</span>
                    <a href="#">See project details</a>
                  </div>
                </div>
                <img
                  src="https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/b95b63a7-a150-43a1-b94a-67095e2d7146"
                  className="more-icon"
                  alt="More"
                />
              </div>
            </div>
          </div>

          {/* Info Card (expanded) */}
          <div className="info-card expanded-info">
            <h2>General Information</h2>
            <p className="info-text">
              This profile contains official employment records and organizational details.
              Please contact HR for any discrepancies or updates.
            </p>

            <div className="info-grid">
              <button
                className="info-item"
                onClick={() => alert("Education clicked")}
              >
                <span className="info-label">Education</span>
                <span className="info-value">{userData.education}</span>
              </button>

              <button
                className="info-item"
                onClick={() => alert("Languages clicked")}
              >
                <span className="info-label">Languages</span>
                <span className="info-value">{userData.languages}</span>
              </button>

              <button
                className="info-item"
                onClick={() => alert("Department clicked")}
              >
                <span className="info-label">Department</span>
                <span className="info-value">{userData.departament}</span>
              </button>

              <button
                className="info-item"
                onClick={() => alert("Work History clicked")}
              >
                <span className="info-label">Work History</span>
                <span className="info-value">{userData.workHistory}</span>
              </button>

              <button
                className="info-item"
                onClick={() => alert("Organization clicked")}
              >
                <span className="info-label">Organization</span>
                <span className="info-value">{userData.organization}</span>
              </button>

              <button
                className="info-item"
                onClick={() => alert("Birthday clicked")}
              >
                <span className="info-label">Birthday</span>
                <span className="info-value">{userData.birthDate}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="footer">
          <span>
            © 2025 HRCLOUDX UI. All Rights Reserved. Made with love!
          </span>
          <div className="footer-links">
            <a href="/marketplace">Marketplace</a>
            <a href="/license">License</a>
            <a href="/terms">Terms of Use</a>
            <a href="/blog">Blog</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePageEmployee;