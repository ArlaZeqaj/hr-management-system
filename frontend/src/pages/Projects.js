import React, { useEffect, useState } from "react";
import axios from "axios";
import { auth } from "../config/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import "../styles/Projects.css"; // Ensure the correct CSS file is imported

export default () => {
  const [allProjects, setAllProjects] = useState([]);
  const [currentProjects, setCurrentProjects] = useState([]);
  const [projectHistory, setProjectHistory] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        user.getIdToken(true).then((idToken) => {
          axios.get("http://localhost:8080/api/projects/all", {
            headers: {
              Authorization: `Bearer ${idToken}`,
            },
          })
            .then((response) => {
              setAllProjects(response.data);

              // Separate current projects (ongoing) from history projects (completed/canceled)
              const ongoing = response.data.filter((project) => project.status === "Ongoing");
              setCurrentProjects(ongoing);

              const history = response.data.filter((project) => project.status !== "Ongoing");
              setProjectHistory(history);
            });
        });
      }
    });

    return () => unsubscribe();
  }, []);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "done":
        return "status-done";
      case "canceled":
        return "status-canceled";
      case "upcoming":
        return "status-upcoming";
      default:
        return "status-default";
    }
  };

  return (
    <div className="projects-page-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="logo">My Projects</div>
        </div>
        <div className="sidebar-menu">
          <div className="menu-item">
            <img className="menu-icon" src="home-icon.png" alt="Home" />
            Home
          </div>
          <div className="menu-item">
            <img className="menu-icon" src="projects-icon.png" alt="Projects" />
            Projects
          </div>
          {/* Add other menu items as needed */}
        </div>
      </div>

      {/* Main Content */}
      <div className="projects-main-content">
        <div className="header-section">
          <div className="breadcrumb">
            <span>Pages / Projects</span>
            <h1>Projects</h1>
          </div>
        </div>

        {/* Current Projects Section */}
        <div className="project-cards-section white-cardO">
          <div className="section-header">
            <h2>Current Projects</h2>
            <p>Currently active projects</p>
          </div>
          <div className="cards-grid">
            {currentProjects.map((project, index) => (
              <ProjectCard
                key={index}
                image={project.image}
                projectName={project.project_Name}
                description={project.description}
                startDate={project.start_Date}
                endDate={project.end_Date}
                budget={project.budget}
                status={project.status}
                roles={project.role}
              />
            ))}
          </div>
        </div>

        {/* Project History Section */}
        <div className="project-history-section white-cardO">
          <div className="section-header">
            <h2>Project History</h2>
            <p>All completed, canceled, or upcoming projects</p>
          </div>
          <div className="project-history-table">
            <table>
              <thead>
                <tr>
                  <th></th>
                  <th>Project Name</th>
                  <th>Budget</th>
                  <th>Role</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {projectHistory.map((project, index) => (
                  <tr key={index}>
                    <td>
                      <img
                        src={project.image}
                        alt={project.project_Name}
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "cover",
                          borderRadius: "8px",
                        }}
                      />
                    </td>
                    <td>{project.project_Name}</td>
                    <td>${project.budget}</td>
                    <td>{project.role}</td>
                    <td>
                      <span className={`status-badge ${getStatusColor(project.status)}`}>
                        {project.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable Components
const ProjectCard = ({ image, projectName, description, startDate, endDate, budget, status, roles }) => {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  const toggleDescription = () => {
    setIsDescriptionExpanded(!isDescriptionExpanded);
  };

  return (
    <div className="project-card">
      <img src={image} alt={projectName} className="project-image" />

      <div className="card-content">
        <div className="card-header">
          <h3 className="project-title">{projectName}</h3>
          <span className={`status-badge ${status.toLowerCase().replace(/\s/g, '-')}`}>
            {status}
          </span>
        </div>

        <div className="project-description">
          {isDescriptionExpanded ? (
            <p>{description}</p>
          ) : (
            <p>{description.length > 100 ? description.substring(0, 100) + "..." : description}</p>
          )}

          {description.length > 100 && (
            <button onClick={toggleDescription} className="read-more-btn">
              {isDescriptionExpanded ? "Show Less" : "Read More"}
            </button>
          )}
        </div>

        <div className="project-details">
          <div><strong>Start Date:</strong> {startDate}</div>
          <div><strong>End Date:</strong> {endDate}</div>
          <div><strong>Budget:</strong> ${budget}</div>
          <div><strong>Role:</strong> {roles}</div>
        </div>
      </div>
    </div>
  );
};
