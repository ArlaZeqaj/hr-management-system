import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import 'inter-ui/inter.css';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "../styles/ProfilePageEmployee.css";
import { useBirthdays } from '../services/BirthdayContext';
import BirthdayCard from '../services/BirthdayCard';
import EmployeeFooter from "./Employee/EmployeeFooter";
import EmployeeSidebar from "./Employee/EmployeeSidebar";
import EmployeeHeader from "./Employee/EmployeeHeader";
import "./Employee/EmployeeSidebar.css";
import "./Employee/EmployeeHeader.css";
import "./Employee/EmployeeFooter.css";

const ProfilePageEmployee = () => {
  const navigate = useNavigate();
  const auth = getAuth();

  // State management
  const [activeMenuItem, setActiveMenuItem] = useState("Profile");
  const [darkMode, setDarkMode] = useState(() => {
    return JSON.parse(localStorage.getItem("darkMode")) || false;
  });
  const [userData, setUserData] = useState({
    name: "",
    surname: "",
    email: "",
    bio: "",
    education: "",
    languages: "",
    department: "",
    workHistory: "",
    organization: "",
    birthDate: "",
    avatarURL: "https://i.pinimg.com/736x/a3/a8/88/a3a888f54cbe9f0c3cdaceb6e1d48053.jpg",
    loading: true,
    error: null
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [currentProjects, setCurrentProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [projectsError, setProjectsError] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

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

    try {
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
      const response = await axios.get(
        `http://localhost:8080/api/employees/by-email?email=${encodeURIComponent(user.email)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          timeout: 5000
        }
      );

      const employeeData = response.data;
      console.log("Received employee data:", employeeData);

      setUserData((prev) => ({
        ...prev,
        name: employeeData.name || "",
        surname: employeeData.surname || "",
        email: employeeData.email,
        bio: employeeData.bio || "No bio",
        education: employeeData.education || "No data",
        languages: employeeData.languages
          ? (Array.isArray(employeeData.languages)
              ? employeeData.languages.join(", ")
              : employeeData.languages)
          : "No data",
        workHistory: employeeData.workHistory
          ? (Array.isArray(employeeData.workHistory)
            ? employeeData.workHistory.join(", ")
            : employeeData.workHistory)
          : "No data",
        department: employeeData.department || "No data",
        organization: employeeData.organization || "No data",
        birthDate: employeeData.birthDate || "No data",
        avatarURL: employeeData.avatarURL || prev.avatarURL,
        loading: false,
        error: null
      }));

    } catch (error) {
      console.error("Failed to fetch user data:", error);
      setUserData((prev) => ({
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
    else if (menuItem === "Documents") {
      navigate("/documents");
    }
  };

  const toggleDarkMode = useCallback(() => {
    setDarkMode(prev => !prev);
  }, []);

  const handleSendWish = useCallback((employee) => {

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
      return <div className="loading-text-ep">Loading user data, please wait.</div>;
    }
    if (userData.error) {
      return <div className="error-message-ep">Error loading profile: {userData.error}</div>;
    }
    return (
      <>
        <h1 className="profile-name-ep">
          {userData.name} {userData.surname}
        </h1>
        <p className="profile-title-ep">{userData.email}</p>
        <p className="profile-title-ep">{userData.department}</p>
        <div className="profile-divider-ep"></div>
        <p className="profile-bio-ep">{userData.bio}</p>
      </>
    );
  };

  const renderProjects = () => {
    if (projectsLoading) {
      return <div className="loading-text-ep">Loading projects...</div>;
    }
    if (projectsError) {
      return <div className="error-message-ep">Error loading projects: {projectsError}</div>;
    }
    if (currentProjects.length === 0) {
      return <div className="no-projects-ep">No current projects found</div>;
    }
    return (
      <div className="project-list-ep">
        {currentProjects.map((project, index) => (
          <div
            key={`${project.id || project.project_Name}-${index}`}
            className="project-item-ep"
            onClick={handleProjectClick}
          >
            <img
              src={project.image || "https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/9c80177c-314a-4f0a-8b59-2f7172cc43f6"}
              alt={project.project_Name}
              loading="lazy"
            />
            <div className="project-info-ep">
              <h4>{project.project_Name}</h4>
              <div className="project-meta-ep">
                <span>Status: {project.status}</span>
                <span className="bullet-ep">•</span>
                <span>Role: {project.role}</span>
              </div>
              <div className="project-dates-ep">
                <span>{project.start_Date} to {project.end_Date}</span>
              </div>
              <p className="project-description-ep">
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

  const infoItems = [
    { key: "education", label: "Education" },
    { key: "languages", label: "Languages" },
    { key: "department", label: "Department" },
    { key: "workHistory", label: "Work History" },
    { key: "organization", label: "Organization" },
    { key: "birthDate", label: "Birthday" }
  ];

  return (
    <div className={`profile-page-container-ep ${darkMode ? 'dark-theme' : ''}`}>
      <EmployeeSidebar
        activeMenuItem={activeMenuItem}
        handleMenuItemClick={handleMenuItemClick}
        darkMode={darkMode}
      />

      <div className="profile-main-content-ep">
        <EmployeeHeader
          activeMenuItem={activeMenuItem}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          userData={userData}
        />

        <div className="profile-section-ep">
          <div className="profile-card-ep">
            <div className="profile-header-ep">
              <div className="cover-photo-overlay-ep"></div>
              <img
                src="https://img.freepik.com/free-vector/beige-leafy-watercolor-background-vector_53876-136491.jpg?semt=ais_hybrid&w=740"
                className="cover-photo-ep"
                alt="Cover"
                loading="lazy"
              />
              <div className="profile-photo-container-ep">
                <img
                  src={userData.avatarURL}
                  className="profile-photo-ep"
                  alt="Profile"
                  loading="lazy"
                  width="100"
                  height="100"
                />
              </div>
            </div>

            <div className="profile-content-ep">
              {renderProfileContent()}
            </div>
          </div>

          <div className="birthday-card-container-ep">
            {memoizedBirthdayCard}
          </div>

          <div className="upload-card-ep">
            <div className="upload-area-ep">
              <input
                type="file"
                id="file-upload"
                className="file-input-ep"
                accept=".png,.jpg,.jpeg,.gif,.pdf,.doc,.docx"
                multiple
                onChange={handleFileUpload}
              />
              <label htmlFor="file-upload" className="upload-button-ep">
                <img
                  src="https://img.icons8.com/?size=100&id=83225&format=png&color=6466f1"
                  alt="Upload"
                  width="40"
                  height="40"
                />
                <h3>Upload Files</h3>
                <p>PNG, JPG, GIF, PDF, DOC, DOCX files are allowed</p>
              </label>

              {uploadedFiles.length > 0 && (
                <div className="uploaded-files-preview-ep">
                  <h4>Selected Files:</h4>
                  <ul>
                    {uploadedFiles.map((file, index) => (
                      <li key={index}>
                        {file.preview ? (
                          <img src={file.preview} alt={file.name} width="50" />
                        ) : (
                          <div className="file-icon-ep">{getFileIcon(file.type)}</div>
                        )}
                        <span>{file.name}</span>
                        <span>({(file.size / 1024).toFixed(2)} KB)</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="complete-profile-ep">
              <h3>Complete your profile</h3>
              <p>
                Securely store your important documents,
                Upload and save your essential files!
              </p>
              <button
                className="publish-btn-ep"
                onClick={handlePublish}
                disabled={isUploading || selectedFiles.length === 0}
              >
                {isUploading ? (
                  <>
                    <span className="spinner-ep"></span>
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
        <div className="content-section-ep">
          <div className="projects-card-ep">
            <h2>Current Projects</h2>
            <p className="subtext-ep">
              Your currently active projects. Click for more details.
            </p>
            {renderProjects()}
          </div>

          <div className="info-card-ep expanded-info">
            <h2>General Information</h2>
            <p className="info-text-ep">
              This profile contains official employment records and organizational details.
              Please contact HR for any discrepancies or updates.
            </p>

            <div className="info-grid-ep">
              {infoItems.map((item) => (
                <div key={item.key} className="info-item-ep">
                  <span className="info-label-ep">{item.label}</span>
                  <span className="info-value-ep">{userData[item.key]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <EmployeeFooter />
      </div>
    </div>
  );
};

export default ProfilePageEmployee;