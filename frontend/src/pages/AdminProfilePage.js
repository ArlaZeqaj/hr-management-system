import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import AdminSidebar from "./Admin/AdminSidebar";
import AdminHeader from "./Admin/AdminHeader";
import AdminFooter from "./Admin/AdminFooter";
import "../styles/AdminProfilePage.css";
import "./Admin/AdminSidebar.css";
import "./Admin/AdminHeader.css";
import "./Admin/AdminFooter.css";

const AdminProfilePage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Set active menu item based on current route
  const getActiveMenuItem = () => {
    const path = location.pathname;
    if (path.includes('/admin/dashboard')) return 'AdminDashboard';
    if (path.includes('/admin/profile')) return 'Profile';
    if (path.includes('/new-hires')) return 'New Hires';
    if (path.includes('/employee')) return 'Employees';
    if (path.includes('/billing')) return 'Billing';
    if (path.includes('/admin/projects')) return 'Projects';
    return 'AdminDashboard'; // default
  };

  const [activeMenuItem, setActiveMenuItem] = useState(getActiveMenuItem());
  const handleMenuItemClick = (menuItem) => {
    setActiveMenuItem(menuItem);
    switch (menuItem) {
      case 'AdminDashboard':
        navigate('/admin/dashboard');
        break;
      case 'Profile':
        navigate('/admin/profile');
        break;
      case 'New Hires':
        navigate('/new-hires');
        break;
      case 'Employees':
        navigate('/employee');
        break;
      case 'Billing':
        navigate('/billing');
        break;
      case 'Projects':
        navigate('/admin/projects');
        break;
      default:
        navigate('/admin/dashboard');
    }
  };

  const [notifications, setNotifications] = useState({
    "New employee registrations": true,
    "Leave request approvals": true,
    "System alerts": true,
    "Payroll processing": false,
    "Performance reviews": false,
    "Company announcements": true,
    "Security alerts": true,
    "Data export completions": false,
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [employees, setEmployees] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);

  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  // Initialize data and dark mode
  useEffect(() => {
    // Dark mode
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode !== null) {
      setDarkMode(savedMode === "true");
    }

    // Mock data fetch
    const mockEmployees = [
      {
        id: 1,
        name: "John Smith",
        email: "john.smith@company.com",
        department: "Engineering",
        position: "Senior Developer",
        status: "active",
        lastActive: "2 hours ago",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      },
      {
        id: 2,
        name: "Sarah Johnson",
        email: "sarah.j@company.com",
        department: "Marketing",
        position: "Marketing Manager",
        status: "active",
        lastActive: "30 minutes ago",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      },
      {
        id: 3,
        name: "Michael Brown",
        email: "michael.b@company.com",
        department: "HR",
        position: "HR Specialist",
        status: "on leave",
        lastActive: "3 days ago",
        avatar: "https://randomuser.me/api/portraits/men/67.jpg",
      },
    ];

    const mockLeaveRequests = [
      {
        id: 1,
        employee: "John Smith",
        type: "Vacation",
        startDate: "2023-06-15",
        endDate: "2023-06-22",
        status: "pending",
        days: 5,
      },
      {
        id: 2,
        employee: "Sarah Johnson",
        type: "Sick Leave",
        startDate: "2023-06-10",
        endDate: "2023-06-12",
        status: "approved",
        days: 2,
      },
    ];

    const mockPerformanceData = [
      {
        id: 1,
        employee: "John Smith",
        completion: 92,
        quality: 4.5,
        teamwork: 4.2,
        deadline: 4.8,
      },
      {
        id: 2,
        employee: "Sarah Johnson",
        completion: 88,
        quality: 4.7,
        teamwork: 4.5,
        deadline: 4.3,
      },
    ];

    setEmployees(mockEmployees);
    setLeaveRequests(mockLeaveRequests);
    setPerformanceData(mockPerformanceData);
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

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleNotification = (notification) => {
    setNotifications((prev) => ({
      ...prev,
      [notification]: !prev[notification],
    }));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    // In a real app, you would upload files to server here
    alert(`${files.length} file(s) selected for admin processing`);
  };

  const handleLeaveAction = (id, action) => {
    setLeaveRequests(prev =>
      prev.map(request =>
        request.id === id ? { ...request, status: action } : request
      )
    );
    alert(`Leave request ${id} has been ${action}`);
  };

  const handleEmployeeAction = (id, action) => {
    if (action === "deactivate") {
      setEmployees(prev =>
        prev.map(employee =>
          employee.id === id ? { ...employee, status: "inactive" } : employee
        )
      );
      alert(`Employee ${id} has been deactivated`);
    } else if (action === "activate") {
      setEmployees(prev =>
        prev.map(employee =>
          employee.id === id ? { ...employee, status: "active" } : employee
        )
      );
      alert(`Employee ${id} has been activated`);
    }
  };

  // Admin-specific stats
  const adminStats = [
    { label: "Total Employees", value: "143", change: "+5%", trend: "up" },
    { label: "Active Projects", value: "24", change: "+2", trend: "up" },
    { label: "Pending Leaves", value: "17", change: "-3", trend: "down" },
    { label: "Open Positions", value: "8", change: "0", trend: "neutral" },
  ];

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <AdminSidebar
        activeMenuItem={activeMenuItem}
        handleMenuItemClick={handleMenuItemClick}
      />

      {/* Main Content */}
      <div className="admin-main-content">
        {/* Header */}
        <AdminHeader
          activeMenuItem={activeMenuItem}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          notifications={notifications}
          toggleNotification={toggleNotification}
        />

        {/* Admin Stats */}
        <div className="admin-stats">
          {adminStats.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-info">
                <span className="stat-label">{stat.label}</span>
                <span className="stat-value">{stat.value}</span>
              </div>
              <div
                className={`stat-change ${stat.trend === "up" ? "up" : stat.trend === "down" ? "down" : ""
                  }`}
              >
                <i
                  className={`fas ${stat.trend === "up"
                    ? "fa-arrow-up"
                    : stat.trend === "down"
                      ? "fa-arrow-down"
                      : "fa-minus"
                    }`}
                ></i>
                <span>{stat.change}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Profile Section */}
        <div className="admin-profile-section">
          {/* Admin Profile Card */}
          <div className="admin-profile-card">
            <div className="profile-header">
              <div className="cover-photo-overlay"></div>
              <img
                src="https://images.unsplash.com/photo-1579547945413-497e1b99dac0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                className="cover-photo"
                alt="Cover"
              />
              <div className="profile-photo-container">
                <img
                  src="https://randomuser.me/api/portraits/men/75.jpg"
                  className="profile-photo"
                  alt="Profile"
                />
                <span className="admin-status-badge">
                  <i className="fas fa-shield-alt"></i> Super Admin
                </span>
              </div>
            </div>

            <div className="profile-content">
              <h1 className="profile-name">Admin User</h1>
              <p className="profile-title">System Administrator</p>
              <div className="profile-divider"></div>
              <p className="profile-bio">
                Managing all HR operations, employee data, and system
                configurations with highest privileges.
              </p>

              <div className="profile-stats">
                <div className="stat-item">
                  <span className="stat-number">143</span>
                  <span className="stat-label">Employees</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">24</span>
                  <span className="stat-label">Projects</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">17</span>
                  <span className="stat-label">Pending</span>
                </div>
              </div>
            </div>

            <div className="profile-actions">
              <button className="action-btn primary">
                <i className="fas fa-cog"></i> System Settings
              </button>
              <button className="action-btn secondary">
                <i className="fas fa-user-shield"></i> Admin Console
              </button>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="quick-actions-card">
            <h3>
              <i className="fas fa-bolt"></i> Quick Actions
            </h3>
            <div className="actions-grid">
              <button className="action-item">
                <i className="fas fa-user-plus"></i>
                <span>Add Employee</span>
              </button>
              <button className="action-item">
                <i className="fas fa-file-import"></i>
                <span>Import Data</span>
              </button>
              <button className="action-item">
                <i className="fas fa-file-export"></i>
                <span>Export Reports</span>
              </button>
              <button className="action-item">
                <i className="fas fa-calendar-check"></i>
                <span>Approve Leaves</span>
              </button>
              <button className="action-item">
                <i className="fas fa-money-check-alt"></i>
                <span>Run Payroll</span>
              </button>
              <button className="action-item">
                <i className="fas fa-chart-pie"></i>
                <span>View Analytics</span>
              </button>
            </div>

            <div className="recent-activity">
              <h4>Recent Activity</h4>
              <ul>
                <li>
                  <i className="fas fa-user-circle"></i> Approved Sarah Johnson's
                  leave request
                </li>
                <li>
                  <i className="fas fa-file-alt"></i> Generated monthly payroll
                  report
                </li>
                <li>
                  <i className="fas fa-user-plus"></i> Added new employee:
                  Michael Brown
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Main Content Section */}
        <div className="admin-content-section">
          {/* Tabs */}
          <div className="admin-tabs">
            <button
              className={`tab-btn ${activeTab === "overview" ? "active" : ""}`}
              onClick={() => setActiveTab("overview")}
            >
              <i className="fas fa-chart-pie"></i> Overview
            </button>
            <button
              className={`tab-btn ${activeTab === "employees" ? "active" : ""}`}
              onClick={() => setActiveTab("employees")}
            >
              <i className="fas fa-users"></i> Employees
            </button>
            <button
              className={`tab-btn ${activeTab === "leaves" ? "active" : ""}`}
              onClick={() => setActiveTab("leaves")}
            >
              <i className="fas fa-calendar-alt"></i> Leave Requests
            </button>
            <button
              className={`tab-btn ${activeTab === "performance" ? "active" : ""}`}
              onClick={() => setActiveTab("performance")}
            >
              <i className="fas fa-chart-line"></i> Performance
            </button>
            <button
              className={`tab-btn ${activeTab === "settings" ? "active" : ""}`}
              onClick={() => setActiveTab("settings")}
            >
              <i className="fas fa-cog"></i> System Settings
            </button>
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            {activeTab === "overview" && (
              <div className="overview-tab">
                <div className="chart-container">
                  <h3>Employee Distribution by Department</h3>
                  <div className="chart-placeholder">
                    <i className="fas fa-chart-bar"></i>
                    <p>Department distribution chart would display here</p>
                  </div>
                </div>
                <div className="chart-container">
                  <h3>Leave Requests Trend</h3>
                  <div className="chart-placeholder">
                    <i className="fas fa-chart-line"></i>
                    <p>Leave trend chart would display here</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "employees" && (
              <div className="employees-tab">
                <div className="table-header">
                  <h3>Employee Management</h3>
                  <div className="table-actions">
                    <button className="btn primary">
                      <i className="fas fa-user-plus"></i> Add Employee
                    </button>
                    <button className="btn secondary">
                      <i className="fas fa-file-export"></i> Export
                    </button>
                    <div className="search-filter">
                      <input
                        type="text"
                        placeholder="Filter employees..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <i className="fas fa-filter"></i>
                    </div>
                  </div>
                </div>
                <div className="table-responsive">
                  <table className="employees-table">
                    <thead>
                      <tr>
                        <th>Employee</th>
                        <th>Email</th>
                        <th>Department</th>
                        <th>Position</th>
                        <th>Status</th>
                        <th>Last Active</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {employees.map((employee) => (
                        <tr key={employee.id}>
                          <td>
                            <div className="employee-info">
                              <img
                                src={employee.avatar}
                                alt={employee.name}
                                className="employee-avatar"
                              />
                              <span>{employee.name}</span>
                            </div>
                          </td>
                          <td>{employee.email}</td>
                          <td>{employee.department}</td>
                          <td>{employee.position}</td>
                          <td>
                            <span
                              className={`status-badge ${employee.status === "active"
                                ? "active"
                                : employee.status === "on leave"
                                  ? "warning"
                                  : "inactive"
                                }`}
                            >
                              {employee.status}
                            </span>
                          </td>
                          <td>{employee.lastActive}</td>
                          <td>
                            <div className="action-buttons">
                              <button
                                className="icon-btn"
                                title="Edit Employee"
                              >
                                <img src="https://img.icons8.com/?size=100&id=89778&format=png&color=A3AED0" className="activate-icon" />
                              </button>
                              {employee.status === "active" ? (
                                <button
                                  className="icon-btn danger"
                                  title="Deactivate"
                                  onClick={() =>
                                    handleEmployeeAction(employee.id, "deactivate")
                                  }
                                >
                                  <img src="https://img.icons8.com/?size=100&id=YSq5LQKUtUA8&format=png&color=A3AED0" className="activate-icon" />
                                </button>
                              ) : (
                                <button
                                  className="icon-btn success"
                                  title="Activate"
                                  onClick={() =>
                                    handleEmployeeAction(employee.id, "activate")
                                  }
                                >
                                  <img src="https://img.icons8.com/?size=100&id=478ct6UMdB85&format=png&color=A3AED0" className="activate-icon" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "leaves" && (
              <div className="leaves-tab">
                <div className="table-header">
                  <h3>Leave Requests Management</h3>
                  <div className="table-actions">
                    <button className="btn primary">
                      <i className="fas fa-calendar-plus"></i> Add Leave
                    </button>
                    <div className="view-options">
                      <button className="view-option active">All</button>
                      <button className="view-option">Pending</button>
                      <button className="view-option">Approved</button>
                      <button className="view-option">Rejected</button>
                    </div>
                  </div>
                </div>
                <div className="table-responsive">
                  <table className="leaves-table">
                    <thead>
                      <tr>
                        <th>Employee</th>
                        <th>Leave Type</th>
                        <th>Date Range</th>
                        <th>Duration</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaveRequests.map((request) => (
                        <tr key={request.id}>
                          <td>{request.employee}</td>
                          <td>{request.type}</td>
                          <td>
                            {request.startDate} to {request.endDate}
                          </td>
                          <td>{request.days} days</td>
                          <td>
                            <span
                              className={`status-badge ${request.status === "pending"
                                ? "warning"
                                : request.status === "approved"
                                  ? "success"
                                  : "danger"
                                }`}
                            >
                              {request.status}
                            </span>
                          </td>
                          <td>
                            {request.status === "pending" && (
                              <div className="action-buttons">
                                <button
                                  className="btn success sm"
                                  onClick={() =>
                                    handleLeaveAction(request.id, "approved")
                                  }
                                >
                                  Approve
                                </button>
                                <button
                                  className="btn danger sm"
                                  onClick={() =>
                                    handleLeaveAction(request.id, "rejected")
                                  }
                                >
                                  Reject
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "performance" && (
              <div className="performance-tab">
                <div className="performance-header">
                  <h3>Employee Performance Metrics</h3>
                  <div className="performance-filters">
                    <select>
                      <option>All Departments</option>
                      <option>Engineering</option>
                      <option>Marketing</option>
                      <option>HR</option>
                    </select>
                    <select>
                      <option>Last Quarter</option>
                      <option>Last Month</option>
                      <option>Last Year</option>
                    </select>
                  </div>
                </div>
                <div className="performance-grid">
                  {performanceData.map((employee) => (
                    <div key={employee.id} className="performance-card">
                      <div className="employee-info">
                        <img
                          src={
                            employees.find((e) => e.name === employee.employee)
                              ?.avatar
                          }
                          alt={employee.employee}
                          className="employee-avatar"
                        />
                        <div>
                          <h4>{employee.employee}</h4>
                          <p>
                            {
                              employees.find((e) => e.name === employee.employee)
                                ?.department
                            }
                          </p>
                        </div>
                      </div>
                      <div className="performance-metrics">
                        <div className="metric">
                          <span className="metric-label">Completion</span>
                          <div className="progress-bar">
                            <div
                              className="progress-fill"
                              style={{ width: `${employee.completion}%` }}
                            ></div>
                          </div>
                          <span className="metric-value">
                            {employee.completion}%
                          </span>
                        </div>
                        <div className="metric">
                          <span className="metric-label">Quality</span>
                          <div className="rating">
                            {[...Array(5)].map((_, i) => (
                              <i
                                key={i}
                                className={`fas fa-star ${i < Math.floor(employee.quality)
                                  ? "filled"
                                  : i < employee.quality
                                    ? "half"
                                    : ""
                                  }`}
                              ></i>
                            ))}
                            <span>({employee.quality})</span>
                          </div>
                        </div>
                        <div className="metric">
                          <span className="metric-label">Teamwork</span>
                          <div className="rating">
                            {[...Array(5)].map((_, i) => (
                              <i
                                key={i}
                                className={`fas fa-star ${i < Math.floor(employee.teamwork)
                                  ? "filled"
                                  : i < employee.teamwork
                                    ? "half"
                                    : ""
                                  }`}
                              ></i>
                            ))}
                            <span>({employee.teamwork})</span>
                          </div>
                        </div>
                        <div className="metric">
                          <span className="metric-label">Deadline</span>
                          <div className="rating">
                            {[...Array(5)].map((_, i) => (
                              <i
                                key={i}
                                className={`fas fa-star ${i < Math.floor(employee.deadline)
                                  ? "filled"
                                  : i < employee.deadline
                                    ? "half"
                                    : ""
                                  }`}
                              ></i>
                            ))}
                            <span>({employee.deadline})</span>
                          </div>
                        </div>
                      </div>
                      <div className="performance-actions">
                        <button className="btn primary sm">
                          <i className="fas fa-chart-line"></i> Details
                        </button>
                        <button className="btn secondary sm">
                          <i className="fas fa-comment-alt"></i> Feedback
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="settings-tab">
                <div className="settings-grid">
                  <div className="settings-card">
                    <h3>
                      <i className="fas fa-user-shield"></i> Admin Settings
                    </h3>
                    <div className="setting-item">
                      <label>Admin Access Level</label>
                      <select>
                        <option>Super Admin</option>
                        <option>HR Admin</option>
                        <option>Department Admin</option>
                      </select>
                    </div>
                    <div className="setting-item">
                      <label>Two-Factor Authentication</label>
                      <label className="toggle-switch">
                        <input type="checkbox" checked />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                    <div className="setting-item">
                      <label>Activity Log Retention</label>
                      <select>
                        <option>30 days</option>
                        <option>90 days</option>
                        <option>1 year</option>
                        <option>Indefinite</option>
                      </select>
                    </div>
                    <button className="btn primary">
                      <i className="fas fa-save"></i> Save Settings
                    </button>
                  </div>

                  <div className="settings-card">
                    <h3>
                      <i className="fas fa-lock"></i> Security Settings
                    </h3>
                    <div className="setting-item">
                      <label>Password Policy</label>
                      <select>
                        <option>Medium (8 chars, 1 special)</option>
                        <option>Strong (10 chars, 2 special)</option>
                        <option>Very Strong (12 chars, 3 special)</option>
                      </select>
                    </div>
                    <div className="setting-item">
                      <label>Session Timeout</label>
                      <select>
                        <option>15 minutes</option>
                        <option>30 minutes</option>
                        <option>1 hour</option>
                        <option>2 hours</option>
                      </select>
                    </div>
                    <div className="setting-item">
                      <label>IP Whitelisting</label>
                      <textarea placeholder="Enter allowed IP addresses, one per line"></textarea>
                    </div>
                    <button className="btn primary">
                      <i className="fas fa-save"></i> Save Settings
                    </button>
                  </div>

                  <div className="settings-card">
                    <h3>
                      <i className="fas fa-upload"></i> Data Management
                    </h3>
                    <div className="setting-item">
                      <label>Backup Schedule</label>
                      <select>
                        <option>Daily</option>
                        <option>Weekly</option>
                        <option>Monthly</option>
                      </select>
                    </div>
                    <div className="setting-item">
                      <label>Automatic Backup</label>
                      <label className="toggle-switch">
                        <input type="checkbox" checked />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                    <div className="setting-item">
                      <label>Backup Location</label>
                      <input
                        type="text"
                        placeholder="Enter backup server path"
                      />
                    </div>
                    <div className="backup-actions">
                      <button className="btn secondary">
                        <i className="fas fa-download"></i> Download Backup
                      </button>
                      <button className="btn primary">
                        <i className="fas fa-upload"></i> Restore Backup
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <AdminFooter />
      </div>
    </div>
  );
};

export default AdminProfilePage;