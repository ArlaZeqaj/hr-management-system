import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Projects.css";

export default () => {

  const [projects, setProjects] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8080/api/projects")
        .then((response) => {
          setProjects(response.data);
        })
        .catch((error) => {
          console.error("Error fetching projects:", error);
        });
  }, []);

  return (
    <div className="projects-page-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <span className="logo">HRCLOUDX</span>
        </div>
        
        <div className="sidebar-menu">
          <div className="menu-item">
            <img src="https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/e5cdd104-7027-4111-b9b0-203ead13153a" className="menu-icon" alt="Dashboard" />
            <span>Dashboard</span>
          </div>
          <div className="menu-item">
            <img src="https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/f83d5003-9309-4c08-b4fb-effc29fd197d" className="menu-icon" alt="Profile" />
            <span>Profile</span>
          </div>
          <div className="menu-item active">
            <img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Hvb8f3Xbra/6yzmslw0_expires_30_days.png" className="menu-icon" alt="Projects" />
            <span>Projects</span>
          </div>
          <div className="menu-item">
            <img src="https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/6980a5d3-86da-498c-89ac-e7776a1a050a" className="menu-icon" alt="Leave Requests" />
            <span>Leave Requests</span>
          </div>
        </div>
        
        <div className="upgrade-card">
                    <div className="upgrade-badge">
                        <img src="https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/afc33f36-a919-4557-8430-4f037f660cd0" alt="Upgrade" />
                        <span>Upgrade to PRO</span>
                    </div>
                    <p>to get access to all features!</p>
                </div>
      </div>
      
      {/* Main Content */}
      <div className="projects-main-content">
        {/* Header Section */}
        <div className="header-section">
          <div className="breadcrumb">
            <span>Pages / Projects</span>
            <h1>Projects</h1>
          </div>
          <div className="user-profile">
            <img
              src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Hvb8f3Xbra/o7m0g9od_expires_30_days.png"
              alt="User"
            />
            <span>Doe, Jane</span>
            <img
              src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Hvb8f3Xbra/6afz9mub_expires_30_days.png"
              alt="Menu"
            />
          </div>
        </div>

        {/* Project Cards Section */}
        <div className="project-cards-section">
          <div className="section-header">
            <h2>Projects</h2>
            <p>Architects design houses</p>
          </div>

          <div className="cards-grid">
            <ProjectCard
              image="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Hvb8f3Xbra/cvhblt7a_expires_30_days.png"
              title="Project #1"
              category="Modern"
              description="As Uber works through a huge amount of internal management turmoil."
              actionIcon="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Hvb8f3Xbra/bq8pevey_expires_30_days.png"
            />
            <ProjectCard
              image="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Hvb8f3Xbra/iihku2ut_expires_30_days.png"
              title="Project #2"
              category="Scandinavian"
              description="Music is something that every person has his or her own specific opinion about."
              actionIcon="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Hvb8f3Xbra/gefear5y_expires_30_days.png"
            />
            <ProjectCard
              image="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Hvb8f3Xbra/up3n49gc_expires_30_days.png"
              title="Project #3"
              category="Minimalist"
              description="Different people have different taste, and various types of music."
              actionIcon="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Hvb8f3Xbra/qxqsysin_expires_30_days.png"
            />
            <NewProjectCard
              icon="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Hvb8f3Xbra/r4t1cdzx_expires_30_days.png"
              text="Create a New Project"
            />
          </div>
        </div>

        {/* Projects Table Section */}
        <div className="projects-table-section">
          <div className="section-header">
            <h2>Projects</h2>
            <div className="stats">
              <img
                src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Hvb8f3Xbra/v9wqlw08_expires_30_days.png"
                alt="Done icon"
              />
              <span>30 done this month</span>
            </div>
          </div>

          <div className="table-header">
            <span>COMPANIES</span>
            <span>BUDGET</span>
            <span>STATUS</span>
            <span>COMPLETION</span>
          </div>

          <div className="divider"></div>

          <ProjectRow
            icon="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Hvb8f3Xbra/ah52p30x_expires_30_days.png"
            name="Chakra Soft UI Version"
            budget="$14,000"
            status="Ongoing"
            completion="60%"
            statusColor="#4FD1C5"
            menuIcon="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Hvb8f3Xbra/x2n0ucph_expires_30_days.png"
          />

          <div className="divider"></div>

          <ProjectRow
            icon="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Hvb8f3Xbra/dlc8xosn_expires_30_days.png"
            name="Add Progress Track"
            budget="$3,000"
            status="Canceled"
            completion="10%"
            statusColor="#E53E3E"
            menuIcon="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Hvb8f3Xbra/tm78d1k8_expires_30_days.png"
          />

          <div className="divider"></div>

          <ProjectRow
            icon="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Hvb8f3Xbra/fw57zxkg_expires_30_days.png"
            name="Fix Platform Errors"
            budget="Not set"
            status="Done"
            completion="100%"
            statusColor="#48BB78"
            menuIcon="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Hvb8f3Xbra/j5ngr2nn_expires_30_days.png"
          />

          <div className="divider"></div>

          <ProjectRow
            icon="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Hvb8f3Xbra/s7l0vdkv_expires_30_days.png"
            name="Launch our Mobile App"
            budget="$32,000"
            status="Done"
            completion="100%"
            statusColor="#48BB78"
            menuIcon="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Hvb8f3Xbra/anz0drpe_expires_30_days.png"
          />

          <div className="divider"></div>

          <ProjectRow
            icon="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Hvb8f3Xbra/b2ht41bu_expires_30_days.png"
            name="Add the New Pricing Page"
            budget="$400"
            status="Upcoming"
            completion="0%"
            statusColor="#A0AEC0"
            menuIcon="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Hvb8f3Xbra/i7bgddc4_expires_30_days.png"
          />
        </div>

        {/* Footer */}
        <div className="footer">
          <span>© 2024 HRCloudX. All Rights Reserved.</span>
          <div className="footer-links">
            <span>Marketplace</span>
            <span>License</span>
            <span>Terms of Use</span>
            <span>Blog</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable Components
const ProjectCard = ({ image, title, category, description, actionIcon }) => (
  <div className="project-card">
    <img src={image} alt={title} className="project-image" />
    <div className="card-content">
      <div className="card-header">
        <div>
          <span className="project-id">{title}</span>
          <h3 className="project-category">{category}</h3>
        </div>
        <img src={actionIcon} alt="Action" className="action-icon" />
      </div>
      <p className="project-description">{description}</p>
      <button className="view-all-btn">
        VIEW ALL
        <div className="divider"></div>
      </button>
    </div>
  </div>
);

const NewProjectCard = ({ icon, text }) => (
  <button className="new-project-card">
    <img src={icon} alt="Add project" />
    <span>{text}</span>
  </button>
);

const ProjectRow = ({ icon, name, budget, status, completion, statusColor, menuIcon }) => (
  <div className="project-row">
    <div className="company-info">
      <img src={icon} alt={name} />
      <span>{name}</span>
    </div>
    <span className="budget">{budget}</span>
    <span className="status" style={{ color: statusColor }}>{status}</span>
    <div className="completion">
      <span style={{ color: statusColor }}>{completion}</span>
      <div className="progress-bar" style={{ backgroundColor: statusColor }}></div>
    </div>
    <img src={menuIcon} alt="Menu" className="menu-icon" />
  </div>
);