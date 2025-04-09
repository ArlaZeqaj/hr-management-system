import React, { useState, useEffect } from "react";
import axios from "axios";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import "../styles/ProfilePageEmployee.css";

const ProfilePageEmployee = () => {

  const [userData, setUserData] = useState({
    name: '',
    surname: '',
    email: ''
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const [input1, setInput1] = useState("");
  const [activeMenuItem, setActiveMenuItem] = useState("Dashboard");
  const [darkMode, setDarkMode] = useState(false);
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

  // Initialize dark mode
  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode !== null) {
      setDarkMode(savedMode === "true");
    }
  }, []);

  // Apply dark mode
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-theme");
    } else {
      document.body.classList.remove("dark-theme");
    }
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  // marrim te dhenat e userit
  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userEmail = user.email;

          const response = await axios.get(`/api/employees/by-email?email=${userEmail}`);

          setUserData({
            name: response.data.name || '',
            surname: response.data.surname || '',
            email: response.data.email || ''
          });
          setLoading(false);
        } catch (err) {
          setError(err.message);
          setLoading(false);
        }
      } else {
        setError("No user logged in");
        setLoading(false);
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
    setNotifications((prev) => ({
      ...prev,
      [notification]: !prev[notification],
    }));
  };

  const handleChange = (e, field) => {
    setUserData({
      ...userData,
      [field]: e.target.value
    });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

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
        <div className="upgrade-card">
          <img
            src="https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/351f8885-31c6-4919-8816-1e9afdfbaee3"
            className="upgrade-icon"
            alt="Upgrade"
          />
          <div className="upgrade-content">
            <div className="pro-badge">
              <img
                src="https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/2132e7a3-85e8-43b4-a441-49f76f6dc5d1"
                alt="Pro Badge"
              />
              <span>Upgrade to PRO</span>
            </div>
            <span className="upgrade-text">to get access to all features!</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <div className="header">
          <div className="breadcrumbs">
            <span className="path">Pages / {activeMenuItem}</span>
            <span className="current-page">{activeMenuItem}</span>
          </div>

          <div className="header-actions">
            <div className="search-bar">
              <img
                src="https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/fb74aa3d-1201-4827-aba3-e8456f9e7557"
                alt="Search"
              />
              <input
                placeholder="Search"
                value={input1}
                onChange={(e) => setInput1(e.target.value)}
              />
            </div>
            <div className="action-icons">
              <img
                src="https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/5d37501d-2f6f-43eb-8027-f0dcb7225cec"
                alt="Icon 1"
              />
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
              <div className="profile-dropdown">
                <button className="profile-button">
                  <img
                    src="https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/4dfb0d26-a823-4773-9ff9-02c8455e9f5b"
                    alt="Profile"
                  />
                </button>
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
              </div>
            </div>
          </div>
        </div>

        {/* Profile Section */}
        <div className="profile-section">
          {/* Profile Card */}
          <div className="profile-card">
            <div className="profile-header">
              <img
                src="https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/57709ee9-ee37-41a1-8342-a56a90377035"
                className="cover-photo"
                alt="Cover"
              />
              <img
                src="https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/27b5ab18-748c-4fa7-b21c-07e1da88edcf"
                className="profile-photo"
                alt="Profile"
              />
            </div>

            <div className="profile-info">
              <div className="user-info">
                <input
                  type="text"
                  value={userData.name}
                  onChange={(e) => handleChange(e, 'name')}
                  className="profile-name"
                  placeholder="First Name"
                />
                <input
                  type="text"
                  value={userData.surname}
                  onChange={(e) => handleChange(e, 'surname')}
                  className="profile-name"
                  placeholder="Last Name"
                />
                <div className="profile-email">{userData.email}</div>
              </div>

              <div className="stats">
                <div className="stat-item">
                  <span className="stat-number">17</span>
                  <span className="stat-label">Posts</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">9.7k</span>
                  <span className="stat-label">Followers</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">274</span>
                  <span className="stat-label">Following</span>
                </div>
              </div>
            </div>
          </div>

          {/* Storage Card */}
          <div className="storage-card">
            <div className="storage-header">
              <img
                src="https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/35bb522e-7190-4669-9e39-f9992ef28f4d"
                className="storage-icon"
                alt="Storage"
              />
              <button
                className="settings-btn"
                onClick={() => alert("Storage settings clicked")}
              >
                <img
                  src="https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/6ddec5e0-c842-41ce-9839-ef84315aca47"
                  alt="Settings"
                />
              </button>
            </div>

            <div className="storage-info">
              <h3>Your storage</h3>
              <p>Supervise your drive space in the easiest way</p>
            </div>

            <div className="storage-progress">
              <div className="progress-labels">
                <span>25.6 Gb</span>
                <span>50 Gb</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill"></div>
              </div>
            </div>
          </div>

          {/* Upload Card */}
          <div className="upload-card">
            <div className="upload-area">
              <input
                type="file"
                id="file-upload"
                className="file-input"
                accept=".png,.jpg,.jpeg,.gif"
                multiple
                onChange={(e) => {
                  if (e.target.files.length > 0) {
                    alert(`${e.target.files.length} file(s) selected`);
                    // Handle file upload logic here
                  }
                }}
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
          {/* Projects Card */}
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
              As we live, our hearts turn colder. Cause pain is what we go
              through as we become older. We get insulted by others, lose trust
              for those others. We get back stabbed by friends. It becomes
              harder for us to give others a hand. We get our heart broken by
              people we love, even that we give them all...
            </p>

            <div className="info-grid">
              <button
                className="info-item"
                onClick={() => alert("Education clicked")}
              >
                <span className="info-label">Education</span>
                <span className="info-value">Stanford University</span>
              </button>

              <button
                className="info-item"
                onClick={() => alert("Languages clicked")}
              >
                <span className="info-label">Languages</span>
                <span className="info-value">English, Spanish, Italian</span>
              </button>

              <button
                className="info-item"
                onClick={() => alert("Department clicked")}
              >
                <span className="info-label">Department</span>
                <span className="info-value">Product Design</span>
              </button>

              <button
                className="info-item"
                onClick={() => alert("Work History clicked")}
              >
                <span className="info-label">Work History</span>
                <span className="info-value">Google, Facebook</span>
              </button>

              <button
                className="info-item"
                onClick={() => alert("Organization clicked")}
              >
                <span className="info-label">Organization</span>
                <span className="info-value">Simmmple Web LLC</span>
              </button>

              <button
                className="info-item"
                onClick={() => alert("Birthday clicked")}
              >
                <span className="info-label">Birthday</span>
                <span className="info-value">20 July 1986</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="footer">
          <span>
            © 2022 Horizon UI. All Rights Reserved. Made with love by Simmmple!
          </span>
          <div className="footer-links">
            <a href="#">Marketplace</a>
            <a href="#">License</a>
            <a href="#">Terms of Use</a>
            <a href="#">Blog</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePageEmployee;