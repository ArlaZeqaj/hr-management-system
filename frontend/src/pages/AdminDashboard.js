import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { getIdToken } from "firebase/auth";
import { auth } from "../config/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

import AdminSidebar from "./Admin/AdminSidebar";
import AdminHeader from "./Admin/AdminHeader";
import { Bar, Pie, Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
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
    if (path.includes("/admin/dashboard")) return "Dashboard";
    if (path.includes("/admin/profile")) return "Profile";
    if (path.includes("/new-hires")) return "New Hires";
    if (path.includes("/employee")) return "Employees";
    if (path.includes("/billing")) return "Billing";
    if (path.includes("/admin/projects")) return "Projects";
    return "Dashboard"; // default
  };

  const [activeMenuItem, setActiveMenuItem] = useState(getActiveMenuItem());
  const handleMenuItemClick = (menuItem) => {
    setActiveMenuItem(menuItem);
    switch (menuItem) {
      case "Dashboard":
        navigate("/admin/dashboard");
        break;
      case "Profile":
        navigate("/admin/profile");
        break;
      case "New Hires":
        navigate("/new-hires");
        break;
      case "Employees":
        navigate("/employee");
        break;
      case "Billing":
        navigate("/billing");
        break;
      case "Projects":
        navigate("/admin/projects");
        break;
      default:
        navigate("/admin/dashboard");
    }
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  ///tasks
  //const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: "",
    dueDate: "",
    priority: "low",
  });
  const [showModal, setShowModal] = useState(false);
  const [viewingTask, setViewingTask] = useState(null);

  const [taskToDelete, setTaskToDelete] = useState(null);

  const [notifications, setNotifications] = useState({
    "Item updates": true,
    "New hires": true,
    "Payroll alerts": false,
    "System updates": true,
  });
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState("overview");
  // New state to store employee count
  const [employeeCount, setEmployeesCount] = useState(0);
  const [activeProjectsCount, setActiveProjectsCount] = useState(0);
  const [pendingTasksCount, setPendingTasksCount] = useState(0);
  const [departmentDistribution, setDepartmentDistribution] = useState({});
  // te task
  const [employees, setEmployees] = useState([]);

  const [showAddTaskModal, setShowAddTaskModal] = useState(false);

  const [newHireForm, setNewHireForm] = useState({
    name: "",
    position: "",
    department: "",
    startDate: "",
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
        const res = await fetch(
          "http://localhost:8080/api/admin1/budget-allocation",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

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

        const response = await fetch(
          "http://localhost:8080/api/admin1/employees",
          {
            headers: {
              Authorization: `Bearer ${token}`, // Send token to backend
            },
          }
        );

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
        const token = await user.getIdToken(); // Firebase ID token
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
        const response = await fetch(
          "http://localhost:8080/api/admin1/active-projects/count",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`, // Attach the token in the Authorization header
            },
          }
        );

        if (!response.ok)
          throw new Error("Failed to fetch active projects count");

        const count = await response.json(); // Parse the count from the response
        console.log("✅ Active projects count from backend:", count); // For debugging purposes
        setActiveProjectsCount(count); // Update the state with the active projects count
        localStorage.setItem("activeProjectsCount", count); // Save to localStorage
      } catch (error) {
        console.error("Error fetching active projects count:", error);
      }
    };

    fetchActiveProjectsCount(); // Call the function to fetch data when component mounts
  }, []); // Empty dependency array so this runs only once when the component mounts

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
        const response = await fetch(
          "http://localhost:8080/api/admin1/tasks/pending/count",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok)
          throw new Error("Failed to fetch pending tasks count");

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
        const response = await fetch(
          "http://localhost:8080/api/admin1/employees/distribution",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok)
          throw new Error("Failed to fetch department distribution");

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
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === taskBeingEdited.id ? savedTask : task
          )
        );
      } else {
        // Add new task
        setTasks((prevTasks) => [...prevTasks, savedTask]);
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

      alert(
        editMode ? "Task updated successfully!" : "Task created successfully!"
      );
    } catch (error) {
      console.error("Task submit error:", error);
      alert(`Error: ${error.message}`);
    }
  };

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  //payroll data graph
  const monthMap = {
    "01": "Jan",
    "02": "Feb",
    "03": "Mar",
    "04": "Apr",
    "05": "May",
    "06": "Jun",
    "07": "Jul",
    "08": "Aug",
    "09": "Sep",
    10: "Oct",
    11: "Nov",
    12: "Dec",
  };
  const [payrollTrendData, setPayrollTrendData] = useState({
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Payroll Expenses",
        data: [250000, 280000, 300000, 320000, 310000, 330000],
        fill: false,
        backgroundColor: "#4318FF",
        borderColor: "#4318FF",
        tension: 0.4,
      },
    ],
  });

  useEffect(() => {
    const fetchPayrollTrend = async () => {
      const user = auth.currentUser;
      if (!user) {
        console.error("❌ No authenticated user");
        return;
      }

      try {
        const token = await user.getIdToken();
        const response = await fetch(
          "http://localhost:8080/api/admin1/payroll/trend",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch payroll trend");
        }

        const data = await response.json(); // e.g. { "2025-01": 1000, "2025-02": 1200 }
        console.log("Payroll data recieved ", data);

        // Sort by date (ascending)
        const sortedEntries = Object.entries(data).sort(([a], [b]) =>
          a.localeCompare(b)
        );

        // Map to labels and values
        const labels = sortedEntries.map(
          ([key]) => monthMap[key.split("-")[1]]
        );
        const values = sortedEntries.map(([, value]) => value);

        setPayrollTrendData({
          labels,
          datasets: [
            {
              label: "Payroll Expenses",
              data: values,
              fill: false,
              backgroundColor: "#4318FF",
              borderColor: "#4318FF",
              tension: 0.4,
            },
          ],
        });
      } catch (error) {
        console.error("Failed to fetch payroll trend:", error);
      }
    };

    fetchPayrollTrend(); // Call the function on component mount
  }, []); // Empty dependency array so this runs only once

  // Charts data
  const employeeDistributionData = {
    labels: Object.keys(departmentDistribution),
    datasets: [
      {
        data: Object.values(departmentDistribution),
        backgroundColor: [
          "#4318FF",
          "#6AD2FF",
          "#EFF4FB",
          "#05CD99",
          "#FFB547",
        ],
        borderWidth: 0,
      },
    ],
  };

  // Task Details Modal Component
  const TaskDetailsModal = ({ task, onClose }) => {
    if (!task) return null;

    return (
      <div className="modal-overlay-ad">
        <div className="modal-container-ad">
          <h2>Task Details</h2>

          <div className="task-details-content">
            <div className="detail-row-ad">
              <span className="detail-label-ad">Title:</span>
              <span className="detail-value-ad">{task.title}</span>
            </div>

            <div className="detail-row-ad">
              <span className="detail-label-ad">Description:</span>
              <span className="detail-value-ad">
                {task.description || "No description"}
              </span>
            </div>

            <div className="detail-row-ad">
              <span className="detail-label-ad">Status:</span>
              <span
                className={`detail-value status-badge ${task.status
                  .toLowerCase()
                  .replace(" ", "-")}`}
              >
                {task.status}
              </span>
            </div>

            <div className="detail-row-ad">
              <span className="detail-label-ad">Priority:</span>
              <span className={`detail-value priority-badge ${task.priority}`}>
                {task.priority}
              </span>
            </div>

            <div className="detail-row-ad">
              <span className="detail-label-ad">Start Date:</span>
              <span className="detail-value-ad">
                {task.startDate || "Not specified"}
              </span>
            </div>

            <div className="detail-row-ad">
              <span className="detail-label-ad">Due Date:</span>
              <span className="detail-value-ad">{task.dueDate}</span>
            </div>

            {task.assignees && task.assignees.length > 0 && (
              <div className="detail-row-ad">
                <span className="detail-label-ad">Assignees:</span>
                <span className="detail-value-ad">
                  {task.assignees
                    .map((assigneeId) => {
                      const employee = employees.find(
                        (e) => e.id === assigneeId
                      );
                      return employee
                        ? `${employee.name} ${employee.surname}`
                        : "Unknown";
                    })
                    .join(", ")}
                </span>
              </div>
            )}

            {task.notes && (
              <div className="detail-row-ad">
                <span className="detail-label-ad">Notes:</span>
                <span className="detail-value-ad">{task.notes}</span>
              </div>
            )}
          </div>

          <div className="modal-actions-ad">
            <button className="cancel-btn-ad" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  const fetchAllTasks = async () => {
    setLoading(true);
    setError(null);

    try {
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");

      const token = await user.getIdToken();

      const response = await fetch(
        "http://localhost:8080/api/admin1/tasks/all",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to fetch tasks");
      }
      console.log("Response status:", response.status); // ✅ ADD THIS
      const data = await response.json();
      console.log("Raw tasks data from backend:11111", data);

      // 🔄 Flatten nested tasks (task1, task2, ...) into one array
      const allTasks = [];
      data.forEach((doc) => {
        const { id, ...tasksInDoc } = doc;
        Object.values(tasksInDoc).forEach((task) => {
          if (task && task.title && task.dueDate) {
            allTasks.push(task);
          }
        });
      });

      // ✅ Deduplicate by title + dueDate
      const uniqueTasks = Array.from(
        new Map(
          allTasks.map((task) => [`${task.title}_${task.dueDate}`, task])
        ).values()
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
    if (activeTab === "tasks") {
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

      const response = await fetch(
        "http://localhost:8080/api/admin1/tasks/delete",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ title: taskTitle }),
        }
      );

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || "Failed to delete task");
      }

      // Refresh tasks state after deletion
      setTasks((prevTasks) =>
        prevTasks.filter((task) => task.title !== taskTitle)
      );
      setTaskToDelete(null); // Close confirmation modal
      alert("Task deleted successfully!");
    } catch (error) {
      console.error("Delete error:", error);
      alert(`Error: ${error.message}`);
      setTaskToDelete(null); // Close confirmation modal on error
    }
  };

  const DeleteConfirmationModal = ({ task, onConfirm, onCancel }) => {
    if (!task) return null;

    return (
      <div className="modal-overlay-ad">
        <div className="modal-container-ad">
          <h2>Confirm Deletion</h2>
          <div className="confirmation-content">
            <p>Are you sure you want to delete the task:</p>
            <p className="task-title-confirm">{task.title}</p>
            <p>This action cannot be undone.</p>
          </div>
          <div className="modal-actions-ad">
            <button className="cancel-btn-ad" onClick={onCancel}>
              Cancel
            </button>
            <button className="delete-confirm-btn-ad" onClick={onConfirm}>
              Delete Task
            </button>
          </div>
        </div>
      </div>
    );
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
    {
      id: 1,
      department: "Engineering",
      amount: 5800,
      status: "processed",
      date: "2025-06-07",
    },
    {
      id: 2,
      department: "Marketing",
      amount: 4250,
      status: "pending",
      date: "2025-06-07",
    },
    {
      id: 3,
      department: "Sales",
      amount: 6320,
      status: "processed",
      date: "2025-06-07",
    },
    {
      id: 4,
      department: "HR",
      amount: 3875,
      status: "pending",
      date: "2025-06-07",
    },
    {
      id: 5,
      department: "IT",
      amount: 6875,
      status: "pending",
      date: "2025-06-07",
    },
  ]);

  const hiringTrendData = {
    labels: ["sales", "marketing", "engineering", "IT"],
    datasets: [
      {
        label: "New Hires",
        data: [5, 3, 2, 1],
        backgroundColor: "#05CD99",
      },
    ],
  };

  // Dynamic stats
  const statsData = [
    {
      title: "Total Employees",
      value: employeeCount,
      change: "+12%",
      icon: "https://img.icons8.com/?size=100&id=85167&format=png&color=4318FF",
      trend: "up",
    },
    {
      title: "Active Projects",
      value: activeProjectsCount.toString(),
      change: "+5%",
      icon: "https://img.icons8.com/?size=100&id=102889&format=png&color=4318FF",
      trend: "up",
    },
    {
      title: "Pending Tasks",
      value: pendingTasksCount,
      change: "-3%",
      icon: "https://img.icons8.com/?size=100&id=83208&format=png&color=4318FF",
      trend: "down",
    },
    {
      title: "Total Payroll",
      value: `$${payrollData
        .reduce((sum, item) => sum + item.amount, 0)
        .toLocaleString()}`,
      change: "+8%",
      icon: "https://img.icons8.com/?size=100&id=87528&format=png&color=4318FF",
      trend: "up",
    },
  ];

  const toggleNotification = (notification) => {
    setNotifications((prev) => ({
      ...prev,
      [notification]: !prev[notification],
    }));
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // /////
  const handleTaskComplete = (taskId) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleNewHireChange = (e) => {
    const { name, value } = e.target;
    setNewHireForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddNewHire = (e) => {
    e.preventDefault();
    const newEmployee = {
      id: employees.length + 1,
      name: newHireForm.name,
      position: newHireForm.position,
      department: newHireForm.department,
      status: "active",
      startDate: newHireForm.startDate,
    };
    //setEmployees([...employees, newEmployee]);
    setNewHireForm({
      name: "",
      position: "",
      department: "",
      startDate: "",
    });
    alert("New hire added successfully!");
  };

  const handleProcessPayroll = (id) => {
    setPayrollData(
      payrollData.map((item) =>
        item.id === id ? { ...item, status: "processed" } : item
      )
    );
  };

  const handleProcessAllPayroll = () => {
    const updatedData = payrollData.map((item) =>
      item.status === "pending" ? { ...item, status: "processed" } : item
    );
    setPayrollData(updatedData);
  };

  // Format time
  const formattedTime = currentTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const formattedDate = currentTime.toLocaleDateString([], {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

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
              <button
                className="quick-action"
                onClick={() => setActiveTab("employees")}
              >
                <img
                  src="https://img.icons8.com/?size=100&id=85167&format=png&color=4318FF"
                  alt="Add Employee"
                />
                <span>Add Employee</span>
              </button>
              <button
                className="quick-action"
                onClick={() => setActiveTab("payroll")}
              >
                <img
                  src="https://img.icons8.com/?size=100&id=87528&format=png&color=4318FF"
                  alt="Process Payroll"
                />
                <span>Process Payroll</span>
              </button>
              <button
                className="quick-action"
                onClick={() => setActiveTab("tasks")}
              >
                <img
                  src="https://img.icons8.com/?size=100&id=83208&format=png&color=4318FF"
                  alt="Create Task"
                />
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
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {stat.trend === "up" ? (
                      <path
                        d="M12 19V5M5 12L12 5L19 12"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    ) : (
                      <path
                        d="M12 5V19M19 12L12 19L5 12"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    )}
                  </svg>
                </div>
              </div>
            ))}
          </div>

          {/* Tabs Navigation */}
          <div className="dashboard-tabs">
            <button
              className={`tab-btn-ap ${
                activeTab === "overview" ? "active" : ""
              }`}
              onClick={() => setActiveTab("overview")}
            >
              Overview
            </button>

            <button
              className={`tab-btn-ap ${
                activeTab === "payroll" ? "active" : ""
              }`}
              onClick={() => setActiveTab("payroll")}
            >
              Payroll
            </button>
            <button
              className={`tab-btn-ap ${activeTab === "tasks" ? "active" : ""}`}
              onClick={() => setActiveTab("tasks")}
            >
              Tasks
            </button>
            <button
              className={`tab-btn-ap ${
                activeTab === "analytics" ? "active" : ""
              }`}
              onClick={() => setActiveTab("analytics")}
            >
              Analytics
            </button>
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            {activeTab === "overview" && (
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
                            position: "right",
                          },
                        },
                        maintainAspectRatio: false,
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
                            beginAtZero: false,
                          },
                        },
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
                        <img
                          src="https://img.icons8.com/?size=100&id=87049&format=png&color=4318FF"
                          alt="New Hire"
                        />
                      </div>
                      <div className="activity-details">
                        <h4>New hire onboarded</h4>
                        <p>Sarah Johnson - Frontend Developer</p>
                        <span>2 hours ago</span>
                      </div>
                    </div>
                    <div className="activity-item">
                      <div className="activity-icon">
                        <img
                          src="https://img.icons8.com/?size=100&id=87528&format=png&color=4318FF"
                          alt="Payroll"
                        />
                      </div>
                      <div className="activity-details">
                        <h4>Payroll processed</h4>
                        <p>Engineering department - $85,000</p>
                        <span>1 day ago</span>
                      </div>
                    </div>
                    <div className="activity-item">
                      <div className="activity-icon">
                        <img
                          src="https://img.icons8.com/?size=100&id=83208&format=png&color=4318FF"
                          alt="Task"
                        />
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
                            beginAtZero: true,
                          },
                        },
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "employees" && (
              <div className="employees-tab">
                <div className="section-header">
                  <h2>Employee Management</h2>
                  <button
                    className="view-all"
                    onClick={() =>
                      document.getElementById("new-hire-modal").showModal()
                    }
                  >
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
                        <button
                          type="button"
                          onClick={() =>
                            document.getElementById("new-hire-modal").close()
                          }
                        >
                          Cancel
                        </button>
                        <button type="submit">Add Employee</button>
                      </div>
                    </form>
                  </div>
                </dialog>
              </div>
            )}

            {activeTab === "payroll" && (
              <div className="payroll-tab">
                <div className="section-header">
                  <h2>Payroll Management</h2>
                  <button
                    className="view-all"
                    onClick={handleProcessAllPayroll}
                  >
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
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M20 6L9 17L4 12"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
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
                            display: false,
                          },
                        },
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "tasks" && (
              <div className="tasks-tab-admin">
                <div className="section-header">
                  <h2>Task Management</h2>
                  <button
                    className="view-all"
                    onClick={() => setShowModal(true)}
                  >
                    Create New Task
                  </button>
                </div>

                <div className="tasks-list-ad">
                  {loading ? (
                    <div className="tasks-loading-container-ad">
                      <div className="loading-spinner-ad">
                        <svg className="spinner-ad" viewBox="0 0 50 50">
                          <circle
                            className="path-ad"
                            cx="25"
                            cy="25"
                            r="20"
                            fill="none"
                            strokeWidth="5"
                          ></circle>
                        </svg>
                      </div>
                      <p className="loading-text-ad">Loading your tasks...</p>
                      <div className="loading-dots-ad">
                        <span className="dot-ad"></span>
                        <span className="dot-ad"></span>
                        <span className="dot-ad"></span>
                      </div>
                    </div>
                  ) : error ? (
                    <div className="tasks-error-ad">
                      <svg className="error-icon-ad" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                      </svg>
                      <p>Error loading tasks: {error}</p>
                      <button
                        className="retry-button-ad"
                        onClick={fetchAllTasks}
                      >
                        Retry
                      </button>
                    </div>
                  ) : tasks.length === 0 ? (
                    <div className="no-tasks-ad">
                      <svg className="empty-icon-ad" viewBox="0 0 24 24">
                        <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z" />
                      </svg>
                      <p>No tasks found. Create your first task!</p>
                    </div>
                  ) : (
                    tasks.map((task, index) => (
                      <div
                        key={index}
                        className={`task-item ${
                          task.completed ? "completed" : ""
                        }`}
                      >
                        <div className="task-checkbox">
                          <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => handleTaskComplete(task.id)}
                          />
                        </div>
                        <div className="task-details-ad">
                          <h3>{task.title}</h3>
                          <p>Due: {task.dueDate}</p>
                          <span
                            className={`priority-badge-ad ${task.priority}`}
                          >
                            {task.priority} priority
                          </span>
                          <span className={`status-badge-ad ${task.status}`}>
                            {task.status}
                          </span>
                        </div>
                        <div className="task-actions-ad">
                          <button
                            className="action-btn-ad view"
                            onClick={() => setViewingTask(task)}
                          >
                            View Details
                          </button>
                          <button
                            className="action-btn-ad edit"
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
                            className="action-btn-ad delete"
                            onClick={() => setTaskToDelete(task)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {taskToDelete && (
                  <DeleteConfirmationModal
                    task={taskToDelete}
                    onConfirm={() => handleDeleteTask(taskToDelete.title)}
                    onCancel={() => setTaskToDelete(null)}
                  />
                )}

                {/* create new task and edit*/}
                {showModal && (
                  <div className="modal-overlay-ad">
                    <div className="modal-container-ad">
                      <h2>{editMode ? "Edit Task" : "Create New Task"}</h2>
                      <form onSubmit={handleTaskSubmit}>
                        <div className="form-row-ad">
                          <div className="form-group-ad">
                            <label>Title*</label>
                            <input
                              type="text"
                              placeholder="Enter task title"
                              value={newTask.title}
                              onChange={(e) =>
                                setNewTask({
                                  ...newTask,
                                  title: e.target.value,
                                })
                              }
                              required
                            />
                          </div>

                          <div className="form-group-ad">
                            <label>Description*</label>
                            <textarea
                              placeholder="Enter task description"
                              value={newTask.description}
                              onChange={(e) =>
                                setNewTask({
                                  ...newTask,
                                  description: e.target.value,
                                })
                              }
                              required
                              rows="3"
                            />
                          </div>
                        </div>

                        <div className="form-row-ad">
                          <div className="form-group-ad">
                            <label>Assign To*</label>
                            <select
                              multiple
                              size="5"
                              value={newTask.assignees || []}
                              onChange={(e) => {
                                const selected = Array.from(
                                  e.target.selectedOptions,
                                  (option) => option.value
                                );
                                setNewTask((prev) => ({
                                  ...prev,
                                  assignees: selected,
                                }));
                              }}
                              className="multi-select-ad"
                              required
                            >
                              {employees.map((emp) => (
                                <option key={emp.id} value={emp.id}>
                                  {emp.name} {emp.surname} ({emp.department})
                                </option>
                              ))}
                            </select>
                            <small className="select-hint-ad">
                              Hold Ctrl/Cmd to select multiple employees
                            </small>
                          </div>
                        </div>

                        <div className="form-row-ad">
                          <div className="form-group-ad">
                            <label>Start Date</label>
                            <input
                              type="date"
                              value={newTask.startDate}
                              onChange={(e) =>
                                setNewTask({
                                  ...newTask,
                                  startDate: e.target.value,
                                })
                              }
                            />
                          </div>

                          <div className="form-group-ad">
                            <label>Due Date*</label>
                            <input
                              type="date"
                              value={newTask.dueDate}
                              onChange={(e) =>
                                setNewTask({
                                  ...newTask,
                                  dueDate: e.target.value,
                                })
                              }
                              required
                            />
                          </div>
                        </div>

                        <div className="form-row-ad">
                          <div className="form-group-ad">
                            <label>Priority*</label>
                            <div className="priority-options-ad">
                              {["low", "medium", "high"].map((level) => (
                                <label
                                  key={level}
                                  className={`priority-option-ad ${
                                    newTask.priority === level ? "active" : ""
                                  }`}
                                >
                                  <input
                                    type="radio"
                                    name="priority"
                                    style={{ display: "none" }}
                                    value={level}
                                    checked={newTask.priority === level}
                                    onChange={() =>
                                      setNewTask({
                                        ...newTask,
                                        priority: level,
                                      })
                                    }
                                  />
                                  <span
                                    className={`priority-dot-ad ${level}`}
                                  ></span>
                                  {level.charAt(0).toUpperCase() +
                                    level.slice(1)}
                                </label>
                              ))}
                            </div>
                          </div>

                          <div className="form-group-ad">
                            <label>Status*</label>
                            <div className="status-options-ad">
                              {["Pending", "Progress", "Completed"].map(
                                (state) => (
                                  <label
                                    key={state}
                                    className={`status-option-ad ${
                                      newTask.status === state ? "active" : ""
                                    }`}
                                  >
                                    <input
                                      type="radio"
                                      name="status"
                                      value={state}
                                      checked={newTask.status === state}
                                      onChange={() =>
                                        setNewTask({
                                          ...newTask,
                                          status: state,
                                        })
                                      }
                                    />
                                    {state}
                                  </label>
                                )
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="form-group-ad">
                          <label>Additional Notes</label>
                          <textarea
                            placeholder="Any additional information..."
                            value={newTask.notes}
                            onChange={(e) =>
                              setNewTask({ ...newTask, notes: e.target.value })
                            }
                            rows="3"
                          />
                        </div>

                        <div className="modal-actions-ad">
                          <button
                            type="button"
                            className="cancel-btn-ad"
                            onClick={() => setShowModal(false)}
                          >
                            Cancel
                          </button>
                          <button type="submit" className="submit-btn-ad">
                            {editMode ? "Update Task" : "Create Task"}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}

                {viewingTask && (
                  <TaskDetailsModal
                    task={viewingTask}
                    onClose={() => setViewingTask(null)}
                  />
                )}
              </div>
            )}

            {activeTab === "analytics" && (
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
                              position: "right",
                            },
                          },
                          maintainAspectRatio: false,
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
                              beginAtZero: false,
                            },
                          },
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
                              beginAtZero: true,
                            },
                          },
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
                          datasets: [
                            {
                              label: "Budget Allocation",
                              data: Object.values(budgetData),
                              backgroundColor: "#4318FF",
                            },
                          ],
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          scales: {
                            y: {
                              beginAtZero: true,
                            },
                          },
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
