import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import axios from "axios";
import 'inter-ui/inter.css';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "../styles/ProfilePageEmployee.css";
import { useBirthdays } from '../services/BirthdayContext';
import BirthdayCard from '../services/BirthdayCard';

const ProfilePageEmployee = () => {
  const navigate = useNavigate();
  const auth = getAuth();

  // State management
  const [activeMenuItem, setActiveMenuItem] = useState("Profile");
  const [darkMode, setDarkMode] = useState(() => {
    return JSON.parse(localStorage.getItem("darkMode")) || false;
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
    avatarURL: "https://i.pinimg.com/736x/a3/a8/88/a3a888f54cbe9f0c3cdaceb6e1d48053.jpg",
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
  const [currentProjects, setCurrentProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [projectsError, setProjectsError] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);


  const notificationRef = useRef(null);
  const { allBirthdays, loading: birthdaysLoading, error: birthdaysError, refreshEmployees } = useBirthdays();

  const getFileIcon = (fileType) => {
    if (!fileType) return '📄';
    if (fileType.includes('pdf')) return '📄';
    if (fileType.includes('word')) return '📝';
    if (fileType.includes('image')) return '🖼️';
    return '📂';
  };

  // Dark theme effect
  useEffect(() => {
    document.body.classList.toggle("dark-theme", darkMode);
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current &&
          !notificationRef.current.contains(event.target) &&
          !event.target.closest('.profile-button')) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // File upload handler
  const handleFileUpload = useCallback((e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);

    const filePreviews = files.map((file) => ({
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
    }));

    setUploadedFiles(filePreviews);
  }, []);

  // Publish files handler
  const handlePublish = useCallback(async () => {

   const user = auth.currentUser;
    if (!user) {
      alert('Please sign in again');
      return;
    }

    const token = await user.getIdToken(true);

    if (selectedFiles.length === 0) {
      alert('Please select files to upload first');
      return;
    }

    setIsUploading(true);

console.log('Uploading with token:', token);
console.log('Files:', selectedFiles);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated');

      const token = await user.getIdToken(true);
      const formData = new FormData();

      selectedFiles.forEach(file => {
        formData.append('files', file);
      });

      formData.append('category', 'Personal Documents');
      formData.append('userId', user.uid);

      await axios.post(
        'http://localhost:8080/api/documents/upload',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
        }
      );

      // Clean up and redirect
      setSelectedFiles([]);
      setUploadedFiles([]);
      navigate('/documents');
    } catch (error) {
      console.error('Upload failed:', error);
      alert(error?.response?.data?.message || error.message || 'Failed to upload files');
    } finally {
      setIsUploading(false);
    }
  }, [selectedFiles, navigate, auth]);

  // Clean up object URLs
  useEffect(() => {
    return () => {
      uploadedFiles.forEach(file => {
        if (file.preview) URL.revokeObjectURL(file.preview);
      });
    };
  }, [uploadedFiles]);

  // Fetch user data
  const fetchUserData = useCallback(async (user) => {
    try {
      const token = await user.getIdToken();
      const response = await axios.get(`/api/employees/by-email?email=${user.email}`, {
        headers: { 'Authorization': `Bearer ${token}` },
        timeout: 5000
      });

      setUserData(prev => ({
        ...prev,
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
        avatarURL: response.data.avatarURL || prev.avatarURL,
        loading: false,
        error: null
      }));
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      setUserData(prev => ({
        ...prev,
        loading: false,
        error: error.response?.data?.message || error.message
      }));
    }
  }, []);

  // Fetch projects
  const fetchProjects = useCallback(async (user) => {
    try {
      const token = await user.getIdToken();
      const response = await axios.get("http://localhost:8080/api/projects/all", {
        headers: { 'Authorization': `Bearer ${token}` },
        timeout: 5000
      });

      const ongoingProjects = response.data.filter(project => project.status === "Ongoing");
      setCurrentProjects(ongoingProjects);
      setProjectsLoading(false);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
      setProjectsError(error.response?.data?.message || error.message);
      setProjectsLoading(false);
    }
  }, []);

  // Auth state change handler
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        Promise.all([
          fetchUserData(user),
          refreshEmployees(),
          fetchProjects(user)
        ]).catch(err => console.error("Error in parallel fetching:", err));
      } else {
        setUserData(prev => ({
          ...prev,
          loading: false,
          error: "No user logged in"
        }));
      }
    });

    return unsubscribe;
  }, [fetchUserData, refreshEmployees, fetchProjects, auth]);

  // Event handlers
  const handleMenuItemClick = (menuItem) => {
    setActiveMenuItem(menuItem);
    if (menuItem === "Projects") {
      navigate("/projects");
    } else if (menuItem === "Dashboard") {
      navigate("/employee/dashboard");
    }
    else if (menuItem === "Leave Request") {
       navigate("/leave-request");
        }
  };

  const toggleDarkMode = useCallback(() => {
    setDarkMode(prev => !prev);
  }, []);

  const toggleNotification = useCallback((notification) => {
    setNotifications(prev => ({
      ...prev,
      [notification]: !prev[notification]
    }));
  }, []);

  const handleSendWish = useCallback((employee) => {
    alert(`Sending birthday wish to ${employee.name}!`);
  }, []);

  const handleProjectClick = useCallback(() => {
    navigate("/projects");
  }, [navigate]);

  // Memoized components
  const memoizedBirthdayCard = useMemo(() => (
    <BirthdayCard
      birthdays={allBirthdays}
      loading={birthdaysLoading}
      error={birthdaysError}
      onSendWish={handleSendWish}
    />
  ), [allBirthdays, birthdaysLoading, birthdaysError, handleSendWish]);

  // Render methods
  const renderProfileContent = () => {
    if (userData.loading) {
      return <div className="loading-text">Loading user data, please wait.</div>;
    }
    if (userData.error) {
      return <div className="error-message">Error loading profile: {userData.error}</div>;
    }
    return (
      <>
        <h1 className="profile-name">
          {userData.name} {userData.surname}
        </h1>
        <p className="profile-title">{userData.email}</p>
        <p className="profile-title">{userData.departament}</p>
        <div className="profile-divider"></div>
        <p className="profile-bio">{userData.bio}</p>
      </>
    );
  };

  const renderNotificationSettings = () => (
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
  );

  const renderProjects = () => {
    if (projectsLoading) {
      return <div className="loading-text">Loading projects...</div>;
    }
    if (projectsError) {
      return <div className="error-message">Error loading projects: {projectsError}</div>;
    }
    if (currentProjects.length === 0) {
      return <div className="no-projects">No current projects found</div>;
    }
    return (
      <div className="project-list">
        {currentProjects.map((project, index) => (
          <div
            key={index}
            className="project-item"
            onClick={handleProjectClick}
          >
            <img
              src={project.image || "https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/9c80177c-314a-4f0a-8b59-2f7172cc43f6"}
              alt={project.project_Name}
              loading="lazy"
            />
            <div className="project-info">
              <h4>{project.project_Name}</h4>
              <div className="project-meta">
                <span>Status: {project.status}</span>
                <span>•</span>
                <span>Role: {project.role}</span>
              </div>
              <div className="project-dates">
                <span>{project.start_Date} to {project.end_Date}</span>
              </div>
              <p className="project-description">
                {project.description && project.description.length > 100
                  ? `${project.description.substring(0, 100)}...`
                  : project.description || "No description available"}
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={`profile-container ${darkMode ? 'dark-theme' : ''}`}>
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <span className="logo">HRCLOUDX</span>
        </div>

        <div className="sidebar-menu">
          {['Dashboard', 'Profile', 'Leave Requests', 'Projects'].map((item) => (
            <div
              key={item}
              className={`menu-item ${activeMenuItem === item ? "active" : ""}`}
              onClick={() => handleMenuItemClick(item)}
            >
              <img
                src={getMenuItemIcon(item)}
                className="menu-icon"
                alt={item}
              />
              <span>{item}</span>
            </div>
          ))}
        </div>

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
                className="theme-toggle-btn"
                aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                <img
                  src={darkMode ?
                    "https://cdn-icons-png.flaticon.com/512/581/581601.png" :
                    "https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/fc94b941-d6a8-49dd-9e4a-a8d7bce035cd"}
                  alt={darkMode ? "Light Mode" : "Dark Mode"}
                  width="24"
                  height="24"
                />
              </button>
              <div className="profile-dropdown" ref={notificationRef}>
                <button
                  className="profile-button"
                  onClick={() => setShowNotifications(!showNotifications)}
                  aria-expanded={showNotifications}
                >
                  <img
                    src={userData.avatarURL}
                    alt="Profile"
                    width="40"
                    height="40"
                  />
                </button>
                {showNotifications && renderNotificationSettings()}
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
                loading="lazy"
              />
              <div className="profile-photo-container">
                <img
                  src={userData.avatarURL}
                  className="profile-photo"
                  alt="Profile"
                  loading="lazy"
                  width="120"
                  height="120"
                />
              </div>
            </div>

            <div className="profile-content">
              {renderProfileContent()}
            </div>
          </div>

          {memoizedBirthdayCard}

          <div className="upload-card">
            <div className="upload-area">
              <input
                type="file"
                id="file-upload"
                className="file-input"
                accept=".png,.jpg,.jpeg,.gif,.pdf,.doc,.docx"
                multiple
                onChange={handleFileUpload}
              />
              <label htmlFor="file-upload" className="upload-button">
                <img
                  src="https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/f81c15c3-242e-4ba1-91ed-f191592c92b7"
                  alt="Upload"
                  width="40"
                  height="40"
                />
                <h3>Upload Files</h3>
                <p>PNG, JPG, GIF, PDF, DOC, DOCX files are allowed</p>
              </label>

              {uploadedFiles.length > 0 && (
                <div className="uploaded-files-preview">
                  <h4>Selected Files:</h4>
                  <ul>
                    {uploadedFiles.map((file, index) => (
                      <li key={index}>
                        {file.preview ? (
                          <img src={file.preview} alt={file.name} width="50" />
                        ) : (
                          <div className="file-icon">{getFileIcon(file.type)}</div>
                        )}
                        <span>{file.name}</span>
                        <span>({(file.size / 1024).toFixed(2)} KB)</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="complete-profile">
              <h3>Complete your profile</h3>
              <p>
                Securely store your important documents,
                 Upload and save your essential files!
              </p>
              <button
                className="publish-btn"
                onClick={handlePublish}
                disabled={isUploading || selectedFiles.length === 0}
              >
                {isUploading ? (
                  <>
                    <span className="spinner"></span>
                    Publishing...
                  </>
                ) : (
                  'Publish now'
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="content-section">
          <div className="projects-card">
            <h2>Current Projects</h2>
            <p className="subtext">
              Your currently active projects. Click for more details.
            </p>
            {renderProjects()}
          </div>

          <div className="info-card expanded-info">
            <h2>General Information</h2>
            <p className="info-text">
              This profile contains official employment records and organizational details.
              Please contact HR for any discrepancies or updates.
            </p>

            <div className="info-grid">
              {infoItems.map((item) => (
                <button
                  key={item.key}
                  className="info-item"
                  onClick={() => alert(`${item.label} clicked`)}
                >
                  <span className="info-label">{item.label}</span>
                  <span className="info-value">{userData[item.key]}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="footer">
          <span>
            © 2025 HRCLOUDX UI. All Rights Reserved. Made with love!
          </span>
          <div className="footer-links">
            {['Marketplace', 'License', 'Terms of Use', 'Blog'].map((link) => (
              <a key={link} href={`/${link.toLowerCase()}`}>{link}</a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper functions
const getMenuItemIcon = (menuItem) => {
  const icons = {
    Dashboard: "https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/e5cdd104-7027-4111-b9b0-203ead13153a",
    Profile: "https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/f83d5003-9309-4c08-b4fb-effc29fd197d",
    "Leave Requests": "https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/6980a5d3-86da-498c-89ac-e7776a1a050a",
    Projects: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Hvb8f3Xbra/6yzmslw0_expires_30_days.png"
  };
  return icons[menuItem] || "";
};

const infoItems = [
  { key: "education", label: "Education" },
  { key: "languages", label: "Languages" },
  { key: "departament", label: "Department" },
  { key: "workHistory", label: "Work History" },
  { key: "organization", label: "Organization" },
  { key: "birthDate", label: "Birthday" }
];

export default ProfilePageEmployee;