import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import AdminSidebar from "./Admin/AdminSidebar";
import AdminHeader from "./Admin/AdminHeader";
import AdminFooter from "./Admin/AdminFooter";
import "../styles/AdminProfilePage.css";
import "./Admin/AdminSidebar.css";
import "./Admin/AdminHeader.css";
import "./Admin/AdminFooter.css";
import { Chart } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import AdminLeaveRequestManager from "../components/cards/leaveRequestAdmin/AdminLeaveRequestManager";

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const AdminProfilePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = getAuth();

  // State declarations
  const [pendingLeavesCount, setPendingLeavesCount] = useState(0);
  const [ongoingProjectsCount, setOngoingProjectsCount] = useState(0);
  const [leaveChartData, setLeaveChartData] = useState(null);

  const [activeMenuItem, setActiveMenuItem] = useState(() => {
    const path = location.pathname;
    if (path.includes('/admin/dashboard')) return 'AdminDashboard';
    if (path.includes('/admin/profile')) return 'Profile';
    if (path.includes('/new-hires')) return 'New Hires';
    if (path.includes('/employee')) return 'Employees';
    if (path.includes('/billing')) return 'Billing';
    if (path.includes('/admin/projects')) return 'Projects';
    return 'AdminDashboard';
  });
  const [activeTab, setActiveTab] = useState("overview");
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);
  const [darkMode, setDarkMode] = useState(() => {
    return JSON.parse(localStorage.getItem("darkMode")) || false;
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [adminData, setAdminData] = useState({
    name: "",
    email: "",
    department: "",
    bio: "",
    avatarURL: "https://randomuser.me/api/portraits/men/75.jpg",
    loading: true,
    error: null
  });
  const [departmentChartData, setDepartmentChartData] = useState(null);
  const [departmentDistribution, setDepartmentDistribution] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    email: "",
    department: "",
    position: ""
  });
  const employeesPerPage = 5;

  const handleLeaveAction = (id, action) => {
    setLeaveRequests(prev =>
      prev.map(request =>
        request.id === id ? { ...request, status: action } : request
      )
    );
    alert(`Leave request ${id} has been ${action}`);
  };

  // Navigation handler
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

  // Data fetching functions
  const fetchAdminData = useCallback(async (user) => {
    try {
      const token = await user.getIdToken();
      const response = await axios.get(`/api/Admin/by-email?email=${user.email}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      setAdminData({
        name: response.data.name || "Admin User",
        email: response.data.email || user.email,
        position: response.data.position || "System Administrator",
        bio: response.data.bio || "No bio available",
        avatarURL: response.data.avatarURL || "https://randomuser.me/api/portraits/men/75.jpg",
        loading: false,
        error: null
      });
    } catch (error) {
      console.error("Error fetching admin data:", error);
      setAdminData(prev => ({
        ...prev,
        loading: false,
        error: error.response?.data?.message || error.message
      }));
    }
  }, []);

  const fetchEmployees = useCallback(async (user) => {
    try {
      const token = await user.getIdToken();
      const response = await axios.get('/api/employees', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const employeesWithAuthData = await Promise.all(
        response.data.map(async (employee) => {
          try {
            const authResponse = await axios.get(`/api/auth/last-signin?email=${employee.email}`, {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            return {
              ...employee,
              lastSignIn: authResponse.data.lastSignIn || "Never signed in",
              department: employee.department || "Unassigned"
            };
          } catch (authError) {
            console.error(`Error fetching auth data for ${employee.email}:`, authError);
            return {
              ...employee,
              lastSignIn: "Error fetching data",
              department: employee.department || "Unassigned"
            };
          }
        })
      );

      setEmployees(employeesWithAuthData);
      setFilteredEmployees(employeesWithAuthData);

      const distribution = employeesWithAuthData.reduce((acc, employee) => {
        const dept = employee.department || "Other";
        acc[dept] = (acc[dept] || 0) + 1;
        return acc;
      }, {});

      setDepartmentDistribution(distribution);

      setDepartmentChartData({
        labels: Object.keys(distribution),
        datasets: [
          {
            label: 'Employees by Department',
            data: Object.values(distribution),
            backgroundColor: [
              'rgba(255, 99, 132, 0.7)',
              'rgba(54, 162, 235, 0.7)',
              'rgba(255, 206, 86, 0.7)',
              'rgba(75, 192, 192, 0.7)',
              'rgba(153, 102, 255, 0.7)',
              'rgba(255, 159, 64, 0.7)'
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
          }
        ]
      });
    } catch (error) {
      console.error("Error fetching employees:", error);
      setAdminData(prev => ({
        ...prev,
        loading: false,
        error: error.response?.data?.message || error.message
      }));
    }
  }, []);

  const fetchLeaveRequests = useCallback(async (user) => {
    try {
      const token = await user.getIdToken();
      const response = await axios.get('/api/leaves/all', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      console.log('API Response:', response.data);

      const approvedRequests = response.data.filter(req =>
        req.status && req.status.toLowerCase() === 'approved'
      );

      const pendingRequests = response.data.filter(req =>
        req.status && req.status.toLowerCase() === 'approved'
      );

      setPendingLeavesCount(pendingRequests.length);

      console.log('Approved requests:', approvedRequests);
      console.log('Pending requests:', pendingRequests);

      const leaveTypes = ['Vacation', 'Remote', 'MedicalLeave', 'SpecialLeave'];

      const leaveCounts = leaveTypes.map(type =>
        approvedRequests.filter(req =>
          req.leaveType && req.leaveType.toLowerCase() === type.toLowerCase()
        ).length
      );

      console.log('Leave counts:', leaveCounts);

      const chartData = {
        labels: leaveTypes,
        datasets: [{
          label: 'Approved Leave Requests',
          data: leaveCounts,
          backgroundColor: [
            'rgba(54, 162, 235, 0.7)',
            'rgba(75, 192, 192, 0.7)',
            'rgba(255, 99, 132, 0.7)',
            'rgba(255, 206, 86, 0.7)'
          ],
          borderColor: [
            'rgba(54, 162, 235, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(255, 206, 86, 1)'
          ],
          borderWidth: 1
        }]
      };

      setLeaveChartData(chartData);

    } catch (error) {
      console.error("Error fetching leave requests:", error);

      setLeaveChartData({
        labels: ['Vacation', 'Remote', 'MedicalLeave', 'SpecialLeave'],
        datasets: [{
          label: 'Approved Leave Requests',
          data: [0, 0, 0, 0],
          backgroundColor: [
            'rgba(54, 162, 235, 0.7)',
            'rgba(75, 192, 192, 0.7)',
            'rgba(255, 99, 132, 0.7)',
            'rgba(255, 206, 86, 0.7)'
          ],
          borderWidth: 1
        }]
      });

      setPendingLeavesCount(0);
    }
  }, []);

  const fetchOngoingProjectsCount = useCallback(async (user) => {
    try {
      const token = await user.getIdToken();
      const response = await axios.get('/api/projects/ongoing', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      console.log('Ongoing Projects Response:', response.data);

      const ongoingCount = Array.isArray(response.data) ? response.data.length : 0;
      setOngoingProjectsCount(ongoingCount);

    } catch (error) {
      console.error("Error fetching ongoing projects:", error);
      setOngoingProjectsCount(0);
    }
  }, []);

  // Initialize data
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        Promise.all([
          fetchAdminData(user),
          fetchEmployees(user),
          fetchLeaveRequests(user),
          fetchOngoingProjectsCount(user)
        ]).catch(err => console.error("Error in parallel fetching:", err));
      } else {
        setAdminData(prev => ({
          ...prev,
          loading: false,
          error: "No admin user logged in"
        }));
      }
    });

    return unsubscribe;
  }, [auth, fetchAdminData, fetchEmployees, fetchLeaveRequests, fetchOngoingProjectsCount]);

  // Dark mode effect
  useEffect(() => {
    document.body.classList.toggle("adm-dark-theme", darkMode);
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  // Employee search filter
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredEmployees(employees);
      setCurrentPage(1);
    } else {
      const filtered = employees.filter(employee =>
        employee.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (employee.department && employee.department.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (employee.position && employee.position.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredEmployees(filtered);
      setCurrentPage(1);
    }
  }, [searchQuery, employees]);

  // Employee edit handlers
  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee);
    setEditFormData({
      name: employee.name || `${employee.firstName} ${employee.lastName}`,
      email: employee.email,
      department: employee.department || "",
      position: employee.position || ""
    });
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const saveEditedEmployee = async () => {
    if (!editingEmployee) return;

    try {
      const token = await auth.currentUser.getIdToken();
      await axios.patch(
        `/api/employees/${editingEmployee.id}`,
        editFormData,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      setEmployees(prev =>
        prev.map(emp =>
          emp.id === editingEmployee.id ? { ...emp, ...editFormData } : emp
        )
      );

      setFilteredEmployees(prev =>
        prev.map(emp =>
          emp.id === editingEmployee.id ? { ...emp, ...editFormData } : emp
        )
      );

      setEditingEmployee(null);
      alert("Employee updated successfully!");
    } catch (error) {
      console.error("Error updating employee:", error);
      alert("Failed to update employee: " + (error.response?.data?.message || error.message));
    }
  };

  // Pagination
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = filteredEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee);
  const totalPages = Math.ceil(filteredEmployees.length / employeesPerPage);

  // UI handlers
  const toggleDarkMode = useCallback(() => {
    setDarkMode(prev => !prev);
  }, []);

  // Stats calculation
  const adminStats = useMemo(() => [
    { label: "Total Employees", value: employees.length, change: "", trend: "neutral" },
    { label: "Departments", value: Object.keys(departmentDistribution).length, change: "", trend: "neutral" },
    { label: "Approved Leaves", value: pendingLeavesCount, change: "", trend: "neutral" },
    { label: "Ongoing Projects", value: ongoingProjectsCount, change: "", trend: "neutral" },
  ], [employees.length, departmentDistribution, pendingLeavesCount, ongoingProjectsCount]);

  if (adminData.loading) {
    return (
      <div className="adm-loading">
        <div className="adm-spinner"></div>
        <p>Loading admin dashboard...</p>
      </div>
    );
  }

  if (adminData.error) {
    return (
      <div className="adm-error">
        <p>Error loading admin dashboard: {adminData.error}</p>
      </div>
    );
  }

  return (
    <div className={`adm-root ${darkMode ? 'adm-dark-theme' : ''}`}>
      <AdminSidebar
        activeMenuItem={activeMenuItem}
        handleMenuItemClick={handleMenuItemClick}
        darkMode={darkMode}
      />

      <div className="adm-main-content">
        <AdminHeader
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <div className="adm-stats">
          {adminStats.map((stat, index) => (
            <div key={index} className="adm-stat-card">
              <div>
                <span className="adm-stat-label">{stat.label}</span>
                <span className="adm-stat-value">{stat.value}</span>
              </div>
              {stat.change && (
                <div className={`adm-stat-change ${stat.trend}`}>
                  <i className={`fas ${
                    stat.trend === "up" ? "fa-arrow-up" :
                    stat.trend === "down" ? "fa-arrow-down" : "fa-minus"
                  }`} />
                  <span>{stat.change}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="adm-profile-section">
          <div className="adm-profile-card">
            <div className="adm-profile-header">
              <div className="adm-cover-photo-overlay"></div>
              <img
                src="https://images.unsplash.com/photo-1579547945413-497e1b99dac0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                className="adm-cover-photo"
                alt="Cover"
              />
              <div className="adm-profile-photo-container">
                <img
                  src={adminData.avatarURL}
                  className="adm-profile-photo"
                  alt="Profile"
                />
                <span className="adm-status-badge">
                  <i className="fas fa-shield-alt"></i> Super Admin
                </span>
              </div>
            </div>

            <div className="adm-profile-content">
              <h1 className="adm-profile-name">{adminData.name}</h1>
              <p className="adm-profile-title">{adminData.position}</p>
              <div className="adm-profile-divider"></div>
              <p className="adm-profile-bio">{adminData.bio}</p>
              <p className="adm-profile-department">{adminData.department}</p>

              <div className="adm-profile-stats">
                <div className="adm-stat-item">
                  <span className="adm-stat-number">{employees.length}</span>
                  <span className="adm-stat-label">Employees</span>
                </div>
                <div className="adm-stat-item">
                  <span className="adm-stat-number">{Object.keys(departmentDistribution).length}</span>
                  <span className="adm-stat-label">Departments</span>
                </div>
                <div className="adm-stat-item">
                  <span className="adm-stat-number">{ongoingProjectsCount}</span>
                  <span className="adm-stat-label">Ongoing</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="adm-content-section">
          <div className="adm-tabs">
            <button
              className={`adm-tab-btn ${activeTab === "overview" ? "active" : ""}`}
              onClick={() => setActiveTab("overview")}
            >
              <i className="fas fa-chart-pie"></i> Overview
            </button>
            <button
              className={`adm-tab-btn ${activeTab === "employees" ? "active" : ""}`}
              onClick={() => setActiveTab("employees")}
            >
              <i className="fas fa-users"></i> Employees
            </button>
            <button
              className={`adm-tab-btn ${activeTab === "leaves" ? "active" : ""}`}
              onClick={() => setActiveTab("leaves")}
            >
              <i className="fas fa-calendar-alt"></i> Leave Requests
            </button>
            <button
              className={`adm-tab-btn ${activeTab === "performance" ? "active" : ""}`}
              onClick={() => setActiveTab("performance")}
            >
              <i className="fas fa-chart-line"></i> Performance
            </button>
          </div>

          <div className="adm-tab-content">
            {activeTab === "overview" && (
              <div className="adm-overview-tab">
                <div className="adm-chart-container">
                  <h3>Employee Distribution by Department</h3>
                  {departmentChartData ? (
                    <div className="adm-chart-wrapper" style={{ height: '400px', width: '100%' }}>
                      <Chart
                        type="pie"
                        data={departmentChartData}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              position: 'right',
                            }
                          }
                        }}
                      />
                    </div>
                  ) : (
                    <div className="adm-chart-placeholder">
                      <i className="fas fa-chart-bar"></i>
                      <p>Loading department distribution...</p>
                    </div>
                  )}
                </div>
                <div className="adm-chart-container">
                  <h3>Leave Requests by Type</h3>
                  {leaveChartData ? (
                    <div className="adm-chart-wrapper" style={{ height: '400px', width: '100%' }}>
                      <Chart
                        type="bar"
                        data={leaveChartData}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              position: 'top',
                            },
                            title: {
                              display: true,
                              text: 'Leave Requests by Type'
                            }
                          },
                          scales: {
                            y: {
                              beginAtZero: true,
                              ticks: {
                                stepSize: 1
                              }
                            }
                          }
                        }}
                      />
                    </div>
                  ) : (
                    <div className="adm-chart-placeholder">
                      <i className="fas fa-chart-bar"></i>
                      <p>Loading leave request data...</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "employees" && (
              <div className="adm-employees-tab">
                <div className="adm-table-header">
                  <h3>Employee Management</h3>
                  <div className="adm-table-actions">
                    <div className="adm-search-filter">
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
                <div className="adm-table-responsive">
                  <table className="adm-employees-table">
                    <thead>
                      <tr>
                        <th>Employee</th>
                        <th>Email</th>
                        <th>Department</th>
                        <th>Position</th>
                        <th>Last Active</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentEmployees.map((employee) => (
                        <tr key={employee.id}>
                          <td>
                            <div className="adm-employee-info">
                              <img
                                src={employee.avatarURL || "https://randomuser.me/api/portraits/men/32.jpg"}
                                alt={employee.name}
                                className="adm-employee-avatar"
                              />
                              <span>{employee.name || `${employee.firstName} ${employee.lastName}`}</span>
                            </div>
                          </td>
                          <td>{employee.email}</td>
                          <td>{employee.department || "N/A"}</td>
                          <td>{employee.position || "N/A"}</td>
                          <td>{employee.lastSignIn || "N/A"}</td>
                          <td>
                            <div className="adm-action-buttons">
                              <button
                                className="adm-icon-btn"
                                title="Edit Employee"
                                onClick={() => handleEditEmployee(employee)}
                              >
                                <img
                                  src="https://img.icons8.com/?size=100&id=89778&format=png&color=A3AED0"
                                  className="activate-icon"
                                  alt="Edit"
                                />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {totalPages > 1 && (
                    <div className="adm-pagination">
                      <button
                        onClick={() => paginate(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                      >
                        &laquo; Prev
                      </button>
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        return (
                          <button
                            key={pageNum}
                            onClick={() => paginate(pageNum)}
                            className={currentPage === pageNum ? 'active' : ''}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      {totalPages > 5 && currentPage < totalPages - 2 && (
                        <span className="adm-ellipsis">...</span>
                      )}
                      <button
                        onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                      >
                        Next &raquo;
                      </button>
                    </div>
                  )}
                </div>

                {editingEmployee && (
                  <div className="adm-modal-overlay">
                    <div className="adm-modal-content">
                      <h3>Edit Employee</h3>
                      <div className="adm-form-group">
                        <label>Name</label>
                        <input
                          type="text"
                          name="name"
                          value={editFormData.name}
                          onChange={handleEditFormChange}
                        />
                      </div>
                      <div className="adm-form-group">
                        <label>Email</label>
                        <input
                          type="email"
                          name="email"
                          value={editFormData.email}
                          onChange={handleEditFormChange}
                          disabled
                        />
                      </div>
                      <div className="adm-form-group">
                        <label>Department</label>
                        <select
                          name="department"
                          value={editFormData.department}
                          onChange={handleEditFormChange}
                        >
                          <option value="">Select Department</option>
                          {Object.keys(departmentDistribution).map(dept => (
                            <option key={dept} value={dept}>{dept}</option>
                          ))}
                        </select>
                      </div>
                      <div className="adm-form-group">
                        <label>Position</label>
                        <input
                          type="text"
                          name="position"
                          value={editFormData.position}
                          onChange={handleEditFormChange}
                        />
                      </div>
                      <div className="adm-modal-actions">
                        <button
                          className="adm-btn secondary"
                          onClick={() => setEditingEmployee(null)}
                        >
                          Cancel
                        </button>
                        <button
                          className="adm-btn primary"
                          onClick={saveEditedEmployee}
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "leaves" && <AdminLeaveRequestManager />}

            {activeTab === "performance" && (
              <div className="adm-performance-tab">
                <div className="adm-performance-header">
                  <h3>Employee Performance Metrics</h3>
                  <div className="adm-performance-filters">
                    <select>
                      <option>All Departments</option>
                      {Object.keys(departmentDistribution).map(dept => (
                        <option key={dept}>{dept}</option>
                      ))}
                    </select>
                    <select>
                      <option>Last Quarter</option>
                      <option>Last Month</option>
                      <option>Last Year</option>
                    </select>
                  </div>
                </div>
                <div className="adm-performance-grid">
                  {performanceData.map((employee) => (
                    <div key={employee.id} className="adm-performance-card">
                      <div className="adm-employee-info">
                        <img
                          src={employees.find((e) => e.name === employee.employee)?.avatarURL}
                          alt={employee.employee}
                          className="adm-employee-avatar"
                        />
                        <div>
                          <h4>{employee.employee}</h4>
                          <p>
                            {employees.find((e) => e.name === employee.employee)?.department}
                          </p>
                        </div>
                      </div>
                      <div className="adm-performance-metrics">
                        <div className="adm-metric">
                          <span className="adm-metric-label">Completion</span>
                          <div className="adm-progress-bar">
                            <div
                              className="adm-progress-fill"
                              style={{ width: `${employee.completion}%` }}
                            ></div>
                          </div>
                          <span className="adm-metric-value">
                            {employee.completion}%
                          </span>
                        </div>
                        <div className="adm-metric">
                          <span className="adm-metric-label">Quality</span>
                          <div className="adm-rating">
                            {[...Array(5)].map((_, i) => (
                              <i
                                key={i}
                                className={`fas fa-star ${
                                  i < Math.floor(employee.quality)
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
                      </div>
                      <div className="adm-performance-actions">
                        <button className="adm-btn primary sm">
                          <i className="fas fa-chart-line"></i> Details
                        </button>
                        <button className="adm-btn secondary sm">
                          <i className="fas fa-comment-alt"></i> Feedback
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <AdminFooter darkMode={darkMode} />
      </div>
    </div>
  );
};

export default AdminProfilePage;