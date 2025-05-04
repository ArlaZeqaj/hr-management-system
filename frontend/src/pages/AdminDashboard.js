import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import axios from "axios";
import { getIdToken } from "firebase/auth";
import { auth } from "../config/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

import AdminSidebar from "./Admin/AdminSidebar";
import AdminHeader from "./Admin/AdminHeader";
import { Bar, Pie, Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import "../styles/Admin.css";
import "./Admin/AdminSidebar.css";
import "./Admin/AdminHeader.css";



Chart.register(...registerables);

const AdminDashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();
  
    // Set active menu item based on current route
    const getActiveMenuItem = () => {
      const path = location.pathname;
      if (path.includes('/admin/dashboard')) return 'Dashboard';
      if (path.includes('/admin/profile')) return 'Profile';
      if (path.includes('/new-hires')) return 'New Hires';
      if (path.includes('/employee')) return 'Employees';
      if (path.includes('/billing')) return 'Billing';
      if (path.includes('/admin/projects')) return 'Projects';
      return 'Dashboard'; // default
    };
  
    const [activeMenuItem, setActiveMenuItem] = useState(getActiveMenuItem());
    const handleMenuItemClick = (menuItem) => {
      setActiveMenuItem(menuItem);
      switch (menuItem) {
        case 'Dashboard':
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

  const [searchQuery, setSearchQuery] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState({
    "Item updates": true,
    "New hires": true,
    "Payroll alerts": false,
    "System updates": true
  });
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState('overview');
   // New state to store employee count
  const [employeeCount, setEmployeesCount] = useState(0);
  const [activeProjectsCount, setActiveProjectsCount] = useState(0);
  const [pendingTasksCount, setPendingTasksCount] = useState(0);
  const [departmentDistribution, setDepartmentDistribution] = useState({});
  const [newHireForm, setNewHireForm] = useState({
    name: '',
    position: '',
    department: '',
    startDate: ''

  });
    // Fetch employee count from backend
useEffect(() => {
  const fetchEmployeeCount = async () => {
    const user = auth.currentUser;

    if (!user) {
      console.error("❌ No authenticated user");
      return;
    }

    try {
      const token = await user.getIdToken();  // Firebase ID token
      const response = await fetch("http://localhost:8080/api/admin1/count", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch employee count");

      const count = await response.json();
      console.log("✅ Employee count from backend:", count);
      setEmployeesCount(count);
    } catch (error) {
      console.error("Error fetching employee count:", error);
    }
  };

  // Listen to auth state
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("User is authenticated:", user);
      fetchEmployeeCount();
    } else {
      console.error("❌ No authenticated user");
    }
  });

  return () => unsubscribe();
}, []);

// Fetch active projects count
    useEffect(() => {
      const fetchActiveProjectsCount = async () => {
        const user = auth.currentUser;
        if (!user) {
          console.error("❌ No authenticated user");
          return;
        }

        try {
          const token = await getIdToken(user); // Use the token after verifying the user
          const response = await fetch("http://localhost:8080/api/admin1/active-projects/count", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,  // Attach the token in the Authorization header
            },
          });

          if (!response.ok) throw new Error("Failed to fetch active projects count");

          const count = await response.json();  // Parse the count from the response
          console.log("✅ Active projects count from backend:", count);  // For debugging purposes
          setActiveProjectsCount(count);  // Update the state with the active projects count
        } catch (error) {
          console.error("Error fetching active projects count:", error);
        }
      };

      fetchActiveProjectsCount();  // Call the function to fetch data when component mounts
    }, []);  // Empty dependency array so this runs only once when the component mounts

    useEffect(() => {
      const fetchPendingTasks = async () => {
        const user = auth.currentUser;
        if (!user) {
          console.error("❌ No authenticated user");
          return;
        }

        try {
          const token = await user.getIdToken();
          const response = await fetch("http://localhost:8080/api/admin1/tasks/pending/count", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) throw new Error("Failed to fetch pending tasks count");

          const count = await response.json();
          console.log("✅ Pending tasks count:", count);
          setPendingTasksCount(count);
        } catch (error) {
          console.error("Error fetching pending tasks:", error);
        }
      };

      fetchPendingTasks();
    }, []);

    useEffect(() => {
      const fetchDistribution = async () => {
        const user = auth.currentUser;
        if (!user) {
          console.error("❌ No authenticated user");
          return;
        }

        try {
          const token = await user.getIdToken();
          const response = await fetch("http://localhost:8080/api/admin1/employees/distribution", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) throw new Error("Failed to fetch department distribution");

          const data = await response.json();
          setDepartmentDistribution(data);
        } catch (error) {
          console.error("Error fetching department distribution:", error);
        }
      };

      fetchDistribution();
    }, []);

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Sample data - in a real app, this would come from an API -- do e heqim
  const [employees, setEmployees] = useState([
    { id: 1, name: 'John Doe', position: 'Frontend Developer', department: 'Engineering', status: 'active' },
    { id: 2, name: 'Jane Smith', position: 'HR Manager', department: 'Human Resources', status: 'active' },
    { id: 3, name: 'Mike Johnson', position: 'Sales Executive', department: 'Sales', status: 'on leave' },
    { id: 4, name: 'Sarah Williams', position: 'Marketing Specialist', department: 'Marketing', status: 'active' },
    { id: 5, name: 'David Brown', position: 'Backend Developer', department: 'Engineering', status: 'active' },
  ]);

  const [payrollData, setPayrollData] = useState([
    { id: 1, department: 'Engineering', amount: 85000, status: 'processed', date: '2023-05-01' },
    { id: 2, department: 'Marketing', amount: 42500, status: 'pending', date: '2023-05-01' },
    { id: 3, department: 'Sales', amount: 63200, status: 'processed', date: '2023-05-01' },
    { id: 4, department: 'HR', amount: 38750, status: 'pending', date: '2023-05-01' },
  ]);

  const [tasks, setTasks] = useState([
    { id: 1, title: 'Review Q2 Performance', dueDate: '2023-05-15', priority: 'high', completed: false },
    { id: 2, title: 'Interview Candidates', dueDate: '2023-05-10', priority: 'medium', completed: false },
    { id: 3, title: 'Team Meeting', dueDate: '2023-05-05', priority: 'high', completed: true },
    { id: 4, title: 'Approve Leave Requests', dueDate: '2023-05-08', priority: 'low', completed: false },
  ]);

  // Charts data
const employeeDistributionData = {
  labels: Object.keys(departmentDistribution),
  datasets: [{
    data: Object.values(departmentDistribution),
    backgroundColor: [
      '#4318FF',
      '#6AD2FF',
      '#EFF4FB',
      '#05CD99',
      '#FFB547'
    ],
    borderWidth: 0,
  }]
};

  const payrollTrendData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Payroll Expenses',
      data: [250000, 280000, 300000, 320000, 310000, 330000],
      fill: false,
      backgroundColor: '#4318FF',
      borderColor: '#4318FF',
      tension: 0.4
    }]
  };

  const hiringTrendData = {
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    datasets: [{
      label: 'New Hires',
      data: [8, 12, 10, 15],
      backgroundColor: '#05CD99',
    }]
  };

  // Dynamic stats
  const statsData = [
    { 
      title: "Total Employees", 
      value: employeeCount,
      change: "+12%", 
      icon: "https://img.icons8.com/?size=100&id=85167&format=png&color=4318FF",
      trend: "up"
    },
    { 
      title: "Active Projects", 
      value: activeProjectsCount.toString(),
      change: "+5%", 
      icon: "https://img.icons8.com/?size=100&id=102889&format=png&color=4318FF",
      trend: "up"
    },
    { 
      title: "Pending Tasks", 
      value: pendingTasksCount,
      change: "-3%", 
      icon: "https://img.icons8.com/?size=100&id=83208&format=png&color=4318FF",
      trend: "down"
    },
    { 
      title: "Total Payroll", 
      value: `$${payrollData.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}`, 
      change: "+8%", 
      icon: "https://img.icons8.com/?size=100&id=87528&format=png&color=4318FF",
      trend: "up"
    }
  ];

  const toggleNotification = (notification) => {
    setNotifications(prev => ({
      ...prev,
      [notification]: !prev[notification]
    }));
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleTaskComplete = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleNewHireChange = (e) => {
    const { name, value } = e.target;
    setNewHireForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddNewHire = (e) => {
    e.preventDefault();
    const newEmployee = {
      id: employees.length + 1,
      name: newHireForm.name,
      position: newHireForm.position,
      department: newHireForm.department,
      status: 'active',
      startDate: newHireForm.startDate
    };
    setEmployees([...employees, newEmployee]);
    setNewHireForm({
      name: '',
      position: '',
      department: '',
      startDate: ''
    });
    alert('New hire added successfully!');
  };

  const handleProcessPayroll = (id) => {
    setPayrollData(payrollData.map(item => 
      item.id === id ? { ...item, status: 'processed' } : item
    ));
  };

  // Format time
  const formattedTime = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const formattedDate = currentTime.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className={`admin-dashboard ${darkMode ? "dark-theme" : ""}`}>
      <AdminSidebar 
        activeMenuItem={activeMenuItem} 
        handleMenuItemClick={handleMenuItemClick} 
      />

      <div className="admin-main-content">
        <AdminHeader
          activeMenuItem={activeMenuItem}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          notifications={notifications}
          toggleNotification={toggleNotification}
        />

        <div className="dashboard-content">
          {/* Dashboard Header with Time and Quick Actions */}
          <div className="dashboard-header">
            <div className="dashboard-time">
              <h1>{formattedTime}</h1>
              <p>{formattedDate}</p>
            </div>
            <div className="quick-actions">
              <button className="quick-action" onClick={() => setActiveTab('employees')}>
                <img src="https://img.icons8.com/?size=100&id=85167&format=png&color=4318FF" alt="Add Employee" />
                <span>Add Employee</span>
              </button>
              <button className="quick-action" onClick={() => setActiveTab('payroll')}>
                <img src="https://img.icons8.com/?size=100&id=87528&format=png&color=4318FF" alt="Process Payroll" />
                <span>Process Payroll</span>
              </button>
              <button className="quick-action" onClick={() => setActiveTab('tasks')}>
                <img src="https://img.icons8.com/?size=100&id=83208&format=png&color=4318FF" alt="Create Task" />
                <span>Create Task</span>
              </button>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="stats-overview">
            {statsData.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="stat-icon">
                  <img src={stat.icon} alt={stat.title} />
                </div>
                <div className="stat-info">
                  <h3>{stat.value}</h3>
                  <p>{stat.title}</p>
                </div>
                <div className={`stat-trend ${stat.trend}`}>
                  <span>{stat.change}</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {stat.trend === "up" ? (
                      <path d="M12 19V5M5 12L12 5L19 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    ) : (
                      <path d="M12 5V19M19 12L12 19L5 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    )}
                  </svg>
                </div>
              </div>
            ))}
          </div>

          {/* Tabs Navigation */}
          <div className="dashboard-tabs">
            <button 
              className={`tab-btn-ap ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>

            <button 
              className={`tab-btn-ap ${activeTab === 'payroll' ? 'active' : ''}`}
              onClick={() => setActiveTab('payroll')}
            >
              Payroll
            </button>
            <button 
              className={`tab-btn-ap ${activeTab === 'tasks' ? 'active' : ''}`}
              onClick={() => setActiveTab('tasks')}
            >
              Tasks
            </button>
            <button 
              className={`tab-btn-ap ${activeTab === 'analytics' ? 'active' : ''}`}
              onClick={() => setActiveTab('analytics')}
            >
              Analytics
            </button>
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            {activeTab === 'overview' && (
              <div className="overview-grid">
                {/* Employee Distribution Chart */}
                <div className="chart-card">
                  <h3>Employee Distribution</h3>
                  <div className="chart-container">
                    <Pie 
                      data={employeeDistributionData}
                      options={{
                        plugins: {
                          legend: {
                            position: 'right',
                          }
                        },
                        maintainAspectRatio: false
                      }}
                    />
                  </div>
                </div>

                {/* Payroll Trend Chart */}
                <div className="chart-card">
                  <h3>Payroll Trend</h3>
                  <div className="chart-container">
                    <Line 
                      data={payrollTrendData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                          y: {
                            beginAtZero: false
                          }
                        }
                      }}
                    />
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="recent-activity">
                  <h3>Recent Activity</h3>
                  <div className="activity-list">
                    <div className="activity-item">
                      <div className="activity-icon">
                        <img src="https://img.icons8.com/?size=100&id=87049&format=png&color=4318FF" alt="New Hire" />
                      </div>
                      <div className="activity-details">
                        <h4>New hire onboarded</h4>
                        <p>Sarah Johnson - Frontend Developer</p>
                        <span>2 hours ago</span>
                      </div>
                    </div>
                    <div className="activity-item">
                      <div className="activity-icon">
                        <img src="https://img.icons8.com/?size=100&id=87528&format=png&color=4318FF" alt="Payroll" />
                      </div>
                      <div className="activity-details">
                        <h4>Payroll processed</h4>
                        <p>Engineering department - $85,000</p>
                        <span>1 day ago</span>
                      </div>
                    </div>
                    <div className="activity-item">
                      <div className="activity-icon">
                        <img src="https://img.icons8.com/?size=100&id=83208&format=png&color=4318FF" alt="Task" />
                      </div>
                      <div className="activity-details">
                        <h4>Task completed</h4>
                        <p>Review Q2 Performance Reports</p>
                        <span>2 days ago</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hiring Trend Chart */}
                <div className="chart-card">
                  <h3>Hiring Trend</h3>
                  <div className="chart-container">
                    <Bar 
                      data={hiringTrendData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                          y: {
                            beginAtZero: true
                          }
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'employees' && (
              <div className="employees-tab">
                <div className="section-header">
                  <h2>Employee Management</h2>
                  <button className="view-all" onClick={() => document.getElementById('new-hire-modal').showModal()}>
                    Add New Employee
                  </button>
                </div>

                {/* New Hire Modal */}
                <dialog id="new-hire-modal" className="modal">
                  <div className="modal-content">
                    <h3>Add New Employee</h3>
                    <form onSubmit={handleAddNewHire}>
                      <div className="form-group">
                        <label>Full Name</label>
                        <input 
                          type="text" 
                          name="name" 
                          value={newHireForm.name}
                          onChange={handleNewHireChange}
                          required 
                        />
                      </div>
                      <div className="form-group">
                        <label>Position</label>
                        <input 
                          type="text" 
                          name="position" 
                          value={newHireForm.position}
                          onChange={handleNewHireChange}
                          required 
                        />
                      </div>
                      <div className="form-group">
                        <label>Department</label>
                        <select 
                          name="department" 
                          value={newHireForm.department}
                          onChange={handleNewHireChange}
                          required
                        >
                          <option value="">Select Department</option>
                          <option value="Engineering">Engineering</option>
                          <option value="Marketing">Marketing</option>
                          <option value="Sales">Sales</option>
                          <option value="HR">Human Resources</option>
                          <option value="Finance">Finance</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Start Date</label>
                        <input 
                          type="date" 
                          name="startDate" 
                          value={newHireForm.startDate}
                          onChange={handleNewHireChange}
                          required 
                        />
                      </div>
                      <div className="form-actions">
                        <button type="button" onClick={() => document.getElementById('new-hire-modal').close()}>
                          Cancel
                        </button>
                        <button type="submit">
                          Add Employee
                        </button>
                      </div>
                    </form>
                  </div>
                </dialog>
              </div>
            )}

            {activeTab === 'payroll' && (
              <div className="payroll-tab">
                <div className="section-header">
                  <h2>Payroll Management</h2>
                  <button className="view-all">
                    Process All
                  </button>
                </div>

                <div className="payroll-cards">
                  {payrollData.map((item, index) => (
                    <div key={index} className="payroll-card">
                      <div className="payroll-info">
                        <h3>{item.department}</h3>
                        <p>${item.amount.toLocaleString()}</p>
                        <span>Due: {item.date}</span>
                      </div>
                      <div className={`payroll-status ${item.status}`}>
                        {item.status === "processed" ? (
                          <>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <span>Processed</span>
                          </>
                        ) : (
                          <>
                            <button 
                              className="process-btn"
                              onClick={() => handleProcessPayroll(item.id)}
                            >
                              Process
                            </button>
                            <span>Pending</span>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="payroll-history">
                  <h3>Payroll History</h3>
                  <div className="history-chart">
                    <Line 
                      data={payrollTrendData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            display: false
                          }
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'tasks' && (
              <div className="tasks-tab">
                <div className="section-header">
                  <h2>Task Management</h2>
                  <button className="view-all">
                    Create New Task
                  </button>
                </div>

                <div className="tasks-list">
                  {tasks.map((task, index) => (
                    <div key={index} className={`task-item ${task.completed ? 'completed' : ''}`}>
                      <div className="task-checkbox">
                        <input 
                          type="checkbox" 
                          checked={task.completed}
                          onChange={() => handleTaskComplete(task.id)}
                        />
                      </div>
                      <div className="task-details">
                        <h3>{task.title}</h3>
                        <p>Due: {task.dueDate}</p>
                        <span className={`priority-badge ${task.priority}`}>
                          {task.priority} priority
                        </span>
                      </div>
                      <div className="task-actions">
                        <button className="action-btn edit">
                          Edit
                        </button>
                        <button className="action-btn delete">
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="analytics-tab">
                <div className="analytics-grid">
                  <div className="analytics-card">
                    <h3>Employee Distribution</h3>
                    <div className="chart-container">
                      <Pie 
                        data={employeeDistributionData}
                        options={{
                          plugins: {
                            legend: {
                              position: 'right',
                            }
                          },
                          maintainAspectRatio: false
                        }}
                      />
                    </div>
                  </div>

                  <div className="analytics-card">
                    <h3>Payroll Trend</h3>
                    <div className="chart-container">
                      <Line 
                        data={payrollTrendData}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          scales: {
                            y: {
                              beginAtZero: false
                            }
                          }
                        }}
                      />
                    </div>
                  </div>

                  <div className="analytics-card">
                    <h3>Hiring Trend</h3>
                    <div className="chart-container">
                      <Bar 
                        data={hiringTrendData}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          scales: {
                            y: {
                              beginAtZero: true
                            }
                          }
                        }}
                      />
                    </div>
                  </div>

                  <div className="analytics-card">
                    <h3>Department Budget Allocation</h3>
                    <div className="chart-container">
                      <Bar 
                        data={{
                          labels: ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance'],
                          datasets: [{
                            label: 'Budget Allocation',
                            data: [1200000, 600000, 900000, 400000, 500000],
                            backgroundColor: '#4318FF',
                          }]
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          scales: {
                            y: {
                              beginAtZero: true
                            }
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;