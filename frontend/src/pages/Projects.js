import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import axios from "axios";
import { auth } from "../config/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import EmployeeFooter from "./Employee/EmployeeFooter";
import EmployeeSidebar from "./Employee/EmployeeSidebar";
import EmployeeHeader from "./Employee/EmployeeHeader";
import "../styles/Projects.css";
import "./Employee/EmployeeSidebar.css";
import "./Employee/EmployeeHeader.css";
import "./Employee/EmployeeFooter.css";

export default () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [allProjects, setAllProjects] = useState([]);
  const [currentProjects, setCurrentProjects] = useState([]);
  const [projectHistory, setProjectHistory] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("current");
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode ? JSON.parse(savedMode) : false;
  });

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", newMode);
  };

  const [selectedProject, setSelectedProject] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const openProjectDetails = (project) => {
    setSelectedProject(project);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedProject(null);
  };

  const getActiveMenuItem = () => {
    const path = location.pathname;
    if (path.includes('/employee/dashboard')) return 'Employee Dashboard';
    if (path.includes('/employee/profile')) return 'Profile';
    if (path.includes('/projects')) return 'Projects';
    if (path.includes('/leave-request')) return 'Leave Request';
    if (path.includes('/documents')) return 'Documents';
    return 'Employee Dashboard';
  };

  const [activeMenuItem, setActiveMenuItem] = useState(getActiveMenuItem());
  const handleMenuItemClick = (menuItem) => {
    setActiveMenuItem(menuItem);
    switch (menuItem) {
      case 'Employee Dashboard': navigate('/employee/dashboard'); break;
      case 'Profile': navigate('/employee/profile'); break;
      case 'Projects': navigate('/projects'); break;
      case 'Leave Request': navigate('/leave-request'); break;
      case 'Documents': navigate('/documents'); break;
      default: navigate('/employee/dashboard');
    }
  };

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

  const toggleNotification = (notification) => {
    setNotifications(prev => ({
      ...prev,
      [notification]: !prev[notification]
    }));
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        user.getIdToken(true).then((idToken) => {
          axios.get("http://localhost:8080/api/projects/all", {
            headers: { Authorization: `Bearer ${idToken}` },
          }).then((response) => {
            setAllProjects(response.data);
            setCurrentProjects(response.data.filter(p => p.status === "Ongoing"));
            setProjectHistory(response.data.filter(p => p.status !== "Ongoing"));
          });
        });
      }
    });
    return () => unsubscribe();
  }, []);

  const filteredProjects = activeTab === "current"
    ? currentProjects.filter(p =>
      p.project_Name.toLowerCase().includes(searchQuery.toLowerCase()))
    : projectHistory.filter(p =>
      p.project_Name.toLowerCase().includes(searchQuery.toLowerCase()));

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "done": return "status-done";
      case "canceled": return "status-canceled";
      case "upcoming": return "status-upcoming";
      default: return "status-default";
    }
  };

  return (
    <div className={`projects-page-container ${darkMode ? "dark-theme" : ""}`}>
      <EmployeeSidebar
        activeMenuItem={activeMenuItem}
        handleMenuItemClick={handleMenuItemClick}
        darkMode={darkMode}
      />

      <div className="projects-main-content">
        <EmployeeHeader
          activeMenuItem={activeMenuItem}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          notifications={notifications}
          toggleNotification={toggleNotification}
        />

        <div className="projects-header">
          <div className="header-content">
            <h1>Project Dashboard</h1>
            <p>Track and manage all your active projects</p>
          </div>
          <div className="search-container-p">
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span className="search-icon-p">🔍</span>
          </div>
        </div>

        <div className="projects-tabs">
          <button
            className={`tab-button ${activeTab === "current" ? "active" : ""}`}
            onClick={() => setActiveTab("current")}
          >
            Current Projects
            <span className="tab-badge">{currentProjects.length}</span>
          </button>
          <button
            className={`tab-button ${activeTab === "history" ? "active" : ""}`}
            onClick={() => setActiveTab("history")}
          >
            Project History
            <span className="tab-badge">{projectHistory.length}</span>
          </button>
        </div>

        {filteredProjects.length > 0 ? (
          <div className="projects-grid">
            {filteredProjects.map((project, index) => (
              <ProjectCard
                key={index}
                project={project}
                statusColor={getStatusColor(project.status)}
                darkMode={darkMode}
                onViewDetails={openProjectDetails}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📂</div>
            <h3>No projects found</h3>
            <p>Try adjusting your search or create a new project</p>
          </div>
        )}

        {/* Project Details Modal */}
        {showModal && selectedProject && (
          <div className="project-modal-overlay">
            <div className="project-modal">
              

              <div className="modal-image-container">
                {selectedProject.image ? (
                  <img src={selectedProject.image} alt={selectedProject.project_Name} />
                ) : (
                  <div className="image-placeholder">
                    {selectedProject.project_Name.split(' ').map(word => word[0]).join('')}
                  </div>
                )}
              </div>

              <div className="modal-content-container">
                <div className="modal-header">
                  <div className="modal-title">
                    <h2>{selectedProject.project_Name}</h2>
                    <span className={`status-badge ${getStatusColor(selectedProject.status)}`}>
                      {selectedProject.status}
                    </span>
                  </div>
                </div>

                <div className="modal-description">
                  <p>{selectedProject.description}</p>
                </div>

                <div className="details-grid">
                  <div className="detail-card">
                    <div className="detail-label">
                      <span>📅</span> Start Date
                    </div>
                    <div className="detail-value">
                      {new Date(selectedProject.start_Date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </div>

                  <div className="detail-card">
                    <div className="detail-label">
                      <span>📅</span> End Date
                    </div>
                    <div className="detail-value">
                      {new Date(selectedProject.end_Date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </div>

                  <div className="detail-card">
                    <div className="detail-label">
                      <span>💰</span> Budget
                    </div>
                    <div className="detail-value">
                      ${selectedProject.budget.toLocaleString()}
                    </div>
                  </div>

                  <div className="detail-card">
                    <div className="detail-label">
                      <span>👤</span> Your Role
                    </div>
                    <div className="detail-value">
                      {selectedProject.role}
                    </div>
                  </div>
                </div>

                {selectedProject.assigned_Employees && selectedProject.assigned_Employees.length > 0 && (
                  <div className="team-section">
                    <h3>
                      <span>👥</span> Team Members
                    </h3>
                    <div className="team-members">
                      {selectedProject.assigned_Employees.map((member, index) => (
                        <div key={index} className="team-member">
                          <div className="member-avatar">
                            {member.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span className="member-name">{member}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="modal-actions">
                  <button className="modal-button close" onClick={closeModal}>
                    <span>Close</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 18L18 6M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <EmployeeFooter />
      </div>
    </div>
  );
};

const ProjectCard = ({ project, statusColor, darkMode, onViewDetails }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`project-card ${expanded ? "expanded" : ""}`}>
      <div className="card-image-container">
        {project.image ? (
          <img src={project.image} alt={project.project_Name} className="project-image" />
        ) : (
          <div className="image-placeholder">
            {project.project_Name.charAt(0).toUpperCase()}
          </div>
        )}
        <span className={`status-badge ${statusColor}`}>
          {project.status}
        </span>
      </div>

      <div className="card-content">
        <div className="card-header">
          <h3>{project.project_Name}</h3>
          <div className="project-meta-p">
            <span>{new Date(project.start_Date).toLocaleDateString()}</span>
            <span>•</span>
            <span>${project.budget}</span>
          </div>
        </div>

        <div className="project-description">
          {expanded ? (
            <p>{project.description}</p>
          ) : (
            <p>{project.description.substring(0, 100)}{project.description.length > 100 && "..."}</p>
          )}
          {project.description.length > 100 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="toggle-description"
            >
              {expanded ? "Show Less" : "Read More"}
            </button>
          )}
        </div>

        <div className="card-footer">
          <div className="project-role">
            <span>Your Role</span>
            <span>{project.role}</span>
          </div>
          <div className="project-actions">
            <button
              className="action-button view"
              onClick={() => onViewDetails(project)}
            >
              <span>View Details</span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};