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

        <div className="projects-header-p">
          <div className="header-content-p">
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

        <div className="projects-tabs-p">
          <button
            className={`tab-button-p ${activeTab === "current" ? "active" : ""}`}
            onClick={() => setActiveTab("current")}
          >
            Current Projects
            <span className="tab-badge-p">{currentProjects.length}</span>
          </button>
          <button
            className={`tab-button-p ${activeTab === "history" ? "active" : ""}`}
            onClick={() => setActiveTab("history")}
          >
            Project History
            <span className="tab-badge-p">{projectHistory.length}</span>
          </button>
        </div>

        {filteredProjects.length > 0 ? (
          <div className="projects-grid-p">
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
          <div className="empty-state-p">
            <div className="empty-icon-p">📂</div>
            <h3>No projects found</h3>
            <p>Try adjusting your search or create a new project</p>
          </div>
        )}

        {/* Project Details Modal */}
        {showModal && selectedProject && (
          <div className="project-modal-overlay-p">
            <div className="project-modal-p">

              <div className="modal-image-container-p">
                {selectedProject.image ? (
                  <img src={selectedProject.image} alt={selectedProject.project_Name} />
                ) : (
                  <div className="image-placeholder-p">
                    {selectedProject.project_Name.split(' ').map(word => word[0]).join('')}
                  </div>
                )}
              </div>

              <div className="modal-content-container-p">
                <div className="modal-header-p">
                  <div className="modal-title-p">
                    <h2 style={{ color: darkMode ? '#e2e8f0' : '#2B3674' }}>{selectedProject.project_Name}</h2>
                    <div className="project-meta-p">
                      <span>{new Date(selectedProject.start_Date).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>${selectedProject.budget.toLocaleString()}</span>
                    </div>
                  </div>
                  <span className={`status-badge-p1 ${getStatusColor(selectedProject.status)}`}>
                    {selectedProject.status}
                  </span>
                </div>

                <div className="modal-description-p">
                  <h3>Project Description</h3>
                  <p>{selectedProject.description}</p>
                </div>

                <div className="details-section-p">
                  <h3>Project Details</h3>
                  <div className="details-grid-p">
                    <div className="detail-card-p">
                      <div className="detail-icon-p">
                        <img
                          src={darkMode
                            ? "https://img.icons8.com/?size=100&id=116368&format=png&color=FFFFFF"
                            : "https://img.icons8.com/?size=100&id=116368&format=png&color=000000"}
                          alt={darkMode ? "light start date" : "dark start date"}
                          style={{ width: "24px", height: "24px" }}
                        />
                      </div>
                      <div>
                        <div className="detail-label-p">Start Date</div>
                        <div className="detail-value-p">
                          {new Date(selectedProject.start_Date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="detail-card-p">
                      <div className="detail-icon-p">
                        <img
                          src={darkMode
                            ? "https://img.icons8.com/?size=100&id=116369&format=png&color=FFFFFF"
                            : "https://img.icons8.com/?size=100&id=116369&format=png&color=000000"}
                          alt={darkMode ? "light end date" : "dark end date"}
                          style={{ width: "24px", height: "24px" }}
                        />
                      </div>
                      <div>
                        <div className="detail-label-p">End Date</div>
                        <div className="detail-value-p">
                          {new Date(selectedProject.end_Date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="detail-card-p">
                      <div className="detail-icon-p">
                        <img
                          src={darkMode
                            ? "https://img.icons8.com/?size=100&id=85045&format=png&color=FFFFFF"
                            : "https://img.icons8.com/?size=100&id=85045&format=png&color=000000"}
                          alt={darkMode ? "light budget" : "dark budget"}
                          style={{ width: "24px", height: "24px" }}
                        />
                      </div>
                      <div>
                        <div className="detail-label-p">Budget</div>
                        <div className="detail-value-p">
                          ${selectedProject.budget.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <div className="detail-card-p">
                      <div className="detail-icon-p">
                        <img
                          src={darkMode
                            ? "https://img.icons8.com/?size=100&id=98218&format=png&color=FFFFFF"
                            : "https://img.icons8.com/?size=100&id=98218&format=png&color=000000"}
                          alt={darkMode ? "light start date" : "dark start date"}
                          style={{ width: "24px", height: "24px" }}
                        />
                      </div>
                      <div>
                        <div className="detail-label-p">Your Role</div>
                        <div className="detail-value-p">
                          {selectedProject.role}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedProject.assigned_Employees && selectedProject.assigned_Employees.length > 0 && (
                  <div className="team-section-p">
                    <h3>Team Members</h3>
                    <div className="team-members-p">
                      {selectedProject.assigned_Employees.map((member, index) => (
                        <div key={index} className="team-member-p">
                          <div className="member-avatar-p">
                            {member.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div className="member-info-p">
                            <span className="member-name-p">{member}</span>
                            <span className="member-role-p">Team Member</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="modal-actions-p">
                  <button className="modal-button-p secondary" onClick={closeModal}>
                    Close
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
    <div className={`project-card-p ${expanded ? "expanded" : ""}`}>
      <div className="card-image-container-p">
        {project.image ? (
          <img src={project.image} alt={project.project_Name} className="project-image-p" />
        ) : (
          <div className="image-placeholder-p">
            {project.project_Name.charAt(0).toUpperCase()}
          </div>
        )}
        <span className={`status-badge-p ${statusColor}`}>
          {project.status}
        </span>
      </div>

      <div className="card-content-p">
        <div className="card-header-p">
          <h3>{project.project_Name}</h3>
          <div className="project-meta-p">
            <span>{new Date(project.start_Date).toLocaleDateString()}</span>
            <span>•</span>
            <span>${project.budget}</span>
          </div>
        </div>

        <div className="project-description-p">
          {expanded ? (
            <p>{project.description}</p>
          ) : (
            <p>{project.description.substring(0, 100)}{project.description.length > 100 && "..."}</p>
          )}
          {project.description.length > 100 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="toggle-description-p"
            >
              {expanded ? "Show Less" : "Read More"}
            </button>
          )}
        </div>

        <div className="projects-card-footer-p">
          <div className="project-role-p">
            <span>Your Role</span>
            <span>{project.role}</span>
          </div>
          <div className="project-actions-p">
            <button
              className="action-button-p view"
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