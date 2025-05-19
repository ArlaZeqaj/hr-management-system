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
import "../styles/tasks.css";
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
///tasks
  //const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: "", dueDate: "", priority: "low" });
  const [showModal, setShowModal] = useState(false); // 👈 Add this line


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
  // te task
  const [employees, setEmployees] = useState([]);


  const [showAddTaskModal, setShowAddTaskModal] = useState(false);

  const [newHireForm, setNewHireForm] = useState({
    name: '',
    position: '',
    department: '',
    startDate: ''

  });
  // budegt allocation
  const [budgetData, setBudgetData] = useState({});

  useEffect(() => {
    console.log("useEffect running");
    const fetchBudgetData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const token = await user.getIdToken();
        const res = await fetch("http://localhost:8080/api/admin1/budget-allocation", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch budget data");

        const data = await res.json();
        console.log("🟢 Department Budget Data from backend:", data); // Debug print
        setBudgetData(data);
      } catch (err) {
        console.error("❌ Budget fetch error:", err);
      }
    };

    fetchBudgetData();
  }, []);


  // per te bere edit nje task
  const [editMode, setEditMode] = useState(false);
  const [taskBeingEdited, setTaskBeingEdited] = useState(null);


  //po marrim employes te na dal te drop dow
  useEffect(() => {
    const fetchEmployees = async () => {
      const user = auth.currentUser;

      if (!user) {
        console.error("❌ No authenticated user");
        return;
      }

      try {
        const token = await user.getIdToken(); // Get Firebase ID token

        const response = await fetch("http://localhost:8080/api/admin1/employees", {
          headers: {
            Authorization: `Bearer ${token}`, // Send token to backend
          },
        });

        if (!response.ok) throw new Error("Failed to fetch employees");

        const employeesData = await response.json();
        console.log("✅ Employees fetched:", employeesData);
        setEmployees(employeesData);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    if (showModal) {
      fetchEmployees();
    }
  }, [showModal]);

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
      // Check localStorage first
      const savedCount = localStorage.getItem("activeProjectsCount");
      if (savedCount !== null) {
        setActiveProjectsCount(Number(savedCount));
        return;
      }

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
        localStorage.setItem("activeProjectsCount", count); // Save to localStorage
      } catch (error) {
        console.error("Error fetching active projects count:", error);
      }
    };

    fetchActiveProjectsCount();  // Call the function to fetch data when component mounts
  }, []);  // Empty dependency array so this runs only once when the component mounts

  useEffect(() => {
    const fetchPendingTasks = async () => {
      // Check localStorage first
      const savedCount = localStorage.getItem("pendingTasksCount");
      if (savedCount !== null) {
        setPendingTasksCount(Number(savedCount));
        return;
      }

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
        localStorage.setItem("pendingTasksCount", count);
      } catch (error) {
        console.error("Error fetching pending tasks:", error);
      }
    };

    fetchPendingTasks();
  }, []);

  useEffect(() => {
    const fetchDistribution = async () => {
      // Check localStorage first
      const savedData = localStorage.getItem("departmentDistribution");
      if (savedData) {
        setDepartmentDistribution(JSON.parse(savedData));
        return;
      }

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
        // Save to localStorage
        localStorage.setItem("departmentDistribution", JSON.stringify(data));
      } catch (error) {
        console.error("Error fetching department distribution:", error);
      }
    };

    fetchDistribution();
  }, []);


  const handleTaskSubmit = async (e) => {
    e.preventDefault();

    try {
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");

      const token = await user.getIdToken();

      const taskToSend = {
        title: newTask.title,
        description: newTask.description,
        assignees: Array.isArray(newTask.assignees) ? newTask.assignees : [],
        priority: newTask.priority || "low",
        status: newTask.status || "Pending",
        startDate: newTask.startDate,
        dueDate: newTask.dueDate,
        notes: newTask.notes || "",
        completed: false,
      };

      // Validation
      if (!taskToSend.title) throw new Error("Title is required");
      if (!taskToSend.dueDate) throw new Error("Due date is required");

      const url = editMode
          ? `http://localhost:8080/api/admin1/tasks/update`
          : "http://localhost:8080/api/admin1/tasks/create";

      const method = editMode ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(taskToSend),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData.message || "Failed to save task");
      }

      const contentType = response.headers.get("content-type") || "";
      const savedTask = contentType.includes("application/json")
          ? await response.json()
          : await response.text();


      if (editMode) {
        // Update task in state
        setTasks(prevTasks =>
            prevTasks.map(task =>
                task.id === taskBeingEdited.id ? savedTask : task
            )
        );
      } else {
        // Add new task
        setTasks(prevTasks => [...prevTasks, savedTask]);
      }

      // Reset state
      setNewTask({
        title: "",
        description: "",
        assignees: [],
        priority: "low",
        status: "Pending",
        startDate: "",
        dueDate: "",
        notes: "",
      });

      setShowModal(false);
      setEditMode(false);
      setTaskBeingEdited(null);

      alert(editMode ? "Task updated successfully!" : "Task created successfully!");

    } catch (error) {
      console.error("Task submit error:", error);
      alert(`Error: ${error.message}`);
    }
  };


  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAllTasks = async () => {
    setLoading(true);
    setError(null);

    try {
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");

      const token = await user.getIdToken();

      const response = await fetch("http://localhost:8080/api/admin1/tasks/all", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to fetch tasks");
      }
      console.log("Response status:", response.status); // ✅ ADD THIS
      const data = await response.json();
      console.log("Raw tasks data from backend:11111", data);


      // 🔄 Flatten nested tasks (task1, task2, ...) into one array
      const allTasks = [];
      data.forEach(doc => {
        const { id, ...tasksInDoc } = doc;
        Object.values(tasksInDoc).forEach(task => {
          if (task && task.title && task.dueDate) {
            allTasks.push(task);
          }
        });
      });

      // ✅ Deduplicate by title + dueDate
      const uniqueTasks = Array.from(
          new Map(allTasks.map(task => [`${task.title}_${task.dueDate}`, task])).values()
      );

      setTasks(uniqueTasks);
    } catch (err) {
      console.error("Fetch tasks error:", err);
      setError(err.message || "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'tasks') {
      console.log("Active tab is tasks. Fetching tasks...");
      fetchAllTasks();
    }
  }, [activeTab]); // ✅ This runs every time activeTab changes


  //delete taskkk
  const handleDeleteTask = async (taskTitle) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");

      const token = await user.getIdToken();

      const response = await fetch("http://localhost:8080/api/admin1/tasks/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: taskTitle }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || "Failed to delete task");
      }

      // Optional: refresh tasks state after deletion
      setTasks(prevTasks => prevTasks.filter(task => task.title !== taskTitle));

      alert("Task deleted successfully!");
    } catch (error) {
      console.error("Delete error:", error);
      alert(`Error: ${error.message}`);
    }
  };

  /// total Payroll

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);


  const [payrollData, setPayrollData] = useState([
    { id: 1, department: 'Engineering', amount: 85000, status: 'processed', date: '2023-05-01' },
    { id: 2, department: 'Marketing', amount: 42500, status: 'pending', date: '2023-05-01' },
    { id: 3, department: 'Sales', amount: 63200, status: 'processed', date: '2023-05-01' },
    { id: 4, department: 'HR', amount: 38750, status: 'pending', date: '2023-05-01' },
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


// /////
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
    //setEmployees([...employees, newEmployee]);
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
                      <button className="view-all" onClick={() => setShowModal(true)}>
                        Create New Task
                      </button>

                    </div>

                    <div className="tasks-list">
                      {loading ? (
                          <p>Loading tasks...</p>
                      ) : error ? (
                          <p style={{ color: 'red' }}>Error: {error}</p>
                      ) : tasks.length === 0 ? (
                          <p>No tasks found.</p>
                      ) : (
                          tasks.map((task, index) => (
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
                                  <button
                                      onClick={() => {
                                        setTaskBeingEdited(task);
                                        setNewTask({
                                          title: task.title || "",
                                          description: task.description || "",
                                          assignees: task.assignees || [],
                                          priority: task.priority || "low",
                                          status: task.status || "Pending",
                                          startDate: task.startDate || "",
                                          dueDate: task.dueDate || "",
                                          notes: task.notes || "",
                                        });
                                        setEditMode(true);
                                        setShowModal(true);
                                      }}
                                  >
                                    Edit
                                  </button>

                                  <button
                                      className="action-btn delete"
                                      onClick={() => handleDeleteTask(task.title)}
                                  >
                                    Delete
                                  </button>

                                </div>
                              </div>
                          ))
                      )}
                    </div>


                    // pop up for the new task
                    // pop up for the new task
                    {showModal && (
                        <div className="modal-overlay">
                          <div className="modal-container"> {/* Changed class to match CSS */}
                            <h2>Create New Task</h2>
                            <form onSubmit={handleTaskSubmit}>
                              <input
                                  type="text"
                                  placeholder="Title"
                                  value={newTask.title}
                                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                  required
                              />
                              <input
                                  type="text"
                                  placeholder="Description"
                                  value={newTask.description}
                                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                                  required
                              />
                              {/* Assign To: */}
                              <label>Assign To:</label>
                              <label>Assign To:</label>
                              <select
                                  multiple
                                  size="5"  // Shows 5 options at once
                                  value={newTask.assignees || []}
                                  onChange={(e) => {
                                    const selected = Array.from(e.target.selectedOptions, option => option.value);
                                    setNewTask(prev => ({ ...prev, assignees: selected }));
                                  }}
                                  style={{
                                    minHeight: '150px',  // Makes it obvious it's multi-select
                                    padding: '8px',
                                    borderRadius: '4px',
                                    border: '1px solid #ddd'
                                  }}
                              >
                                {employees.map(emp => (
                                    <option key={emp.id} value={emp.id}>
                                      {emp.name} ({emp.department})  {/* Add more info */}
                                    </option>
                                ))}
                              </select>
                              <small className="select-hint">
                                Hold Ctrl/Cmd to select multiple employees
                              </small>


                              <input
                                  type="date"
                                  value={newTask.startDate}
                                  onChange={(e) => setNewTask({ ...newTask, startDate: e.target.value })}
                              />
                              <input
                                  type="date"
                                  value={newTask.dueDate}
                                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                                  required
                              />
                              <select
                                  value={newTask.priority}
                                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                              >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                              </select>
                              <textarea
                                  placeholder="Additional Notes"
                                  value={newTask.notes}
                                  onChange={(e) => setNewTask({ ...newTask, notes: e.target.value })}
                              />
                              <select
                                  value={newTask.status}
                                  onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                              >
                                <option value="Pending">Pending</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                              </select>

                              <div className="modal-actions">
                                <button type="submit">
                                  {editMode ? "Update Task" : "Create Task"}
                                </button>
                                <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
                              </div>
                            </form>
                          </div>
                        </div>
                    )}
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
                                labels: Object.keys(budgetData),
                                datasets: [{
                                  label: 'Budget Allocation',
                                  data: Object.values(budgetData),
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