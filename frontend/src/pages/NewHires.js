"use client";

import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { auth, db } from "../config/firebaseConfig";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { signOut, signInWithEmailAndPassword } from "firebase/auth";
import "../styles/NewHires.css";

// Notification Dropdown Component
const NotificationsDropdown = ({ notifications, isOpen }) => {
  if (!isOpen) return null;

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  return (
    <div className="notifications-dropdown">
      <div className="dropdown-header">
        <h3>
          Notifications{" "}
          <span className="notification-count">{unreadCount} unread</span>
        </h3>
        <button className="text-btn">Mark all as read</button>
      </div>
      <div className="notifications-list">
        {notifications && notifications.length > 0 ? (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`notification-item ${
                notification.read ? "read" : "unread"
              }`}
            >
              <div className="notification-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              </div>
              <div className="notification-content">
                <div className="notification-title">{notification.title}</div>
                <div className="notification-time">{notification.time}</div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-notifications">No notifications to display</div>
        )}
      </div>
      <div className="notification-actions">
        <button className="text-btn">View all</button>
        <button className="text-btn">Settings</button>
      </div>
    </div>
  );
};

// Profile Dropdown Component
const ProfileDropdown = ({ profileImage, handleProfileAction }) => {
  return (
    <div className="profile-dropdown">
      <div className="dropdown-header">
        <div className="dropdown-user-info">
          <div className="dropdown-avatar">
            <img
              src={profileImage || "/placeholder.svg?height=40&width=40"}
              alt="User"
            />
          </div>
          <div>
            <div className="dropdown-user-name">Jane Doe</div>
            <div className="dropdown-user-email">jane.doe@hrcloudx.com</div>
          </div>
        </div>
      </div>
      <div className="dropdown-menu-items">
        <button
          className="dropdown-item"
          onClick={() => handleProfileAction("profile")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="dropdown-item-icon"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          <span>My Profile</span>
        </button>
        <button
          className="dropdown-item"
          onClick={() => handleProfileAction("projects")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="dropdown-item-icon"
          >
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
          </svg>
          <span>My Projects</span>
        </button>
        <button
          className="dropdown-item"
          onClick={() => handleProfileAction("settings")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="dropdown-item-icon"
          >
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
          </svg>
          <span>Account Settings</span>
        </button>
        <button
          className="dropdown-item"
          onClick={() => handleProfileAction("photo")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="dropdown-item-icon"
          >
            <rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect>
            <path d="M6 8h.01"></path>
            <path d="M10 8h.01"></path>
            <path d="M14 8h.01"></path>
            <path d="M18 8h.01"></path>
            <path d="M8 12h.01"></path>
            <path d="M12 12h.01"></path>
            <path d="M16 12h.01"></path>
            <path d="M7 16h10"></path>
          </svg>
          <span>Change Photo</span>
        </button>
        <div className="dropdown-divider"></div>
        <button
          className="dropdown-item"
          onClick={() => handleProfileAction("logout")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="dropdown-item-icon"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

// Edit Modal Component
const EditModal = ({ isOpen, onClose, hire, onSave }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    department: "",
    roleTitle: "",
    status: "",
    startDate: "",
    endDate: "",
    priority: "",
    email: "",
    phone: "",
    additionalInfo: ""
  });

  useEffect(() => {
    if (hire) {
      setFormData({
        fullName: hire.fullName || "",
        department: hire.department || "",
        roleTitle: hire.roleTitle || "",
        status: hire.status || "Active",
        startDate: hire.startDate || "",
        endDate: hire.endDate || "",
        priority: hire.priority || "Medium",
        email: hire.email || "",
        phone: hire.phone || "",
        additionalInfo: hire.additionalInfo || ""
      });
    }
  }, [hire]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Edit Employee</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="department">Department</label>
              <input
                type="text"
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="roleTitle">Role Title</label>
              <input
                type="text"
                id="roleTitle"
                name="roleTitle"
                value={formData.roleTitle}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Pending">Pending</option>
                <option value="On Leave">On Leave</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="priority">Priority</label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startDate">Start Date</label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="endDate">End Date</label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="additionalInfo">Additional Info</label>
            <textarea
              id="additionalInfo"
              name="additionalInfo"
              value={formData.additionalInfo}
              onChange={handleChange}
              rows="3"
            />
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="save-btn">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const NewHires = () => {
  const [expandedRows, setExpandedRows] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New employee registration",
      read: false,
      time: "2 min ago",
    },
    { id: 2, title: "Leave request approval", read: true, time: "1 hour ago" },
    { id: 3, title: "System alert", read: false, time: "3 hours ago" },
    {
      id: 4,
      title: "Payroll processing complete",
      read: true,
      time: "Yesterday",
    },
  ]);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [profileImage, setProfileImage] = useState(
    "/placeholder.svg?height=40&width=40"
  );
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  // State for Firebase data
  const [newHires, setNewHires] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState(
    "Connecting to database..."
  );
  const [showConnectionStatus, setShowConnectionStatus] = useState(true);

  // State for authentication
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  // State for edit modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentHire, setCurrentHire] = useState(null);

  // State for search and filter
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");

  const navItems = [
    { path: "/admin/dashboard", icon: "dashboard", label: "Dashboard" },
    { path: "/admin/profile", icon: "profile", label: "Profile" },
    { path: "/new-hires", icon: "new-hires", label: "New Hires" },
    { path: "/employee", icon: "employees", label: "Employees" },
    { path: "/projects", icon: "projects", label: "Projects" },
    { path: "/billing", icon: "billing", label: "Billing" },
    { path: "/documents", icon: "documents", label: "Documents" },
    { path: "/leave-request", icon: "leave", label: "Leave Request" },
  ];

  const notificationsRef = useRef(null);
  const profileDropdownRef = useRef(null);

  const checkAdminStatus = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        return false;
      }

      const idTokenResult = await user.getIdTokenResult();
      return idTokenResult.claims.admin === true;
    } catch (error) {
      console.error("Error checking admin status:", error);
      return false;
    }
  };

  const handleAdminLogin = async (e) => {
    e?.preventDefault();
    setAuthLoading(true);
    setAuthError(null);

    try {
      await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
      const hasAdminRole = await checkAdminStatus();

      if (hasAdminRole) {
        setIsAdmin(true);
        setConnectionStatus("Admin authenticated successfully");
        setTimeout(() => setShowConnectionStatus(false), 3000);
        fetchNewHires();
      } else {
        setAuthError("This account does not have admin privileges");
        await signOut(auth);
        setIsAdmin(false);
      }
    } catch (error) {
      console.error("Admin login error:", error);
      setAuthError(error.message || "Authentication failed");
      setIsAdmin(false);
    } finally {
      setAuthLoading(false);
    }
  };

  const fetchNewHires = async () => {
    setLoading(true);
    setError(null);
    setConnectionStatus("Fetching new hires data...");
    setShowConnectionStatus(true);
  
    try {
      const hasAdminRole = await checkAdminStatus();
  
      if (!hasAdminRole) {
        console.log("User does not have admin privileges. Using mock data.");
        setNewHires(mockNewHires);
        setLoading(false);
        setConnectionStatus("Using mock data (Admin privileges required)");
        setTimeout(() => setShowConnectionStatus(false), 5000);
        return;
      }
  
      const newHiresRef = collection(db, "NewHires");
      const querySnapshot = await getDocs(newHiresRef);
  
      const newHiresList = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        newHiresList.push({
          id: data.ID || doc.id, // Use ID field if exists, otherwise use document ID
          fullName: data["Full Name"] || "N/A",
          department: data.Department || "N/A",
          roleTitle: data["Role Title"] || "N/A",
          status: data.Status || "N/A",
          startDate: data.startDate || "N/A",
          endDate: data.endDate || "N/A",
          priority: data.priority?.toLowerCase() || "medium",
          email: data.email || "N/A",
          phone: data["phone Nr"] || "N/A",
          nr: data.Nr || "N/A",
          documents: data.Documents || "N/A",
          value: data["Net/Gross Value"] || "N/A",
          additionalInfo: data.additionalInfo || ""
        });
      });
  
      setNewHires(newHiresList);
      setLoading(false);
      setConnectionStatus("Connected to database");
      setTimeout(() => setShowConnectionStatus(false), 3000);
    } catch (err) {
      console.error("Error fetching new hires:", err);
      setError(err.message);
      setLoading(false);
      setConnectionStatus("Failed to connect to database");
      setTimeout(() => setShowConnectionStatus(false), 5000);
    }
  };

  const mockNewHires = [
    {
      id: "1",
      fullName: "John Doe",
      department: "Engineering",
      roleTitle: "Senior Developer",
      status: "Active",
      startDate: "15-03-2023",
      endDate: "15-03-2025",
      priority: "High",
      email: "john.doe@example.com",
      phone: "+1 555-123-4567",
      additionalInfo: "Requires special equipment",
      details: []
    },
    {
      id: "2",
      fullName: "Jane Smith",
      department: "Marketing",
      roleTitle: "Marketing Manager",
      status: "Active",
      startDate: "10-02-2023",
      endDate: "10-02-2025",
      priority: "Medium",
      email: "jane.smith@example.com",
      phone: "+1 555-987-6543",
      additionalInfo: "",
      details: []
    },
    {
      id: "3",
      fullName: "Robert Johnson",
      department: "HR",
      roleTitle: "HR Specialist",
      status: "Pending",
      startDate: "05-05-2023",
      endDate: "05-05-2024",
      priority: "Low",
      email: "robert.johnson@example.com",
      phone: "+1 555-456-7890",
      additionalInfo: "Waiting for background check",
      details: []
    },
    {
      id: "4",
      fullName: "Emily Davis",
      department: "Sales",
      roleTitle: "Sales Representative",
      status: "On Leave",
      startDate: "20-01-2023",
      endDate: "20-01-2024",
      priority: "Medium",
      email: "emily.davis@example.com",
      phone: "+1 555-789-0123",
      additionalInfo: "Maternity leave until June 2023",
      details: []
    },
    {
      id: "5",
      fullName: "Michael Wilson",
      department: "IT",
      roleTitle: "System Administrator",
      status: "Inactive",
      startDate: "12-12-2022",
      endDate: "12-12-2023",
      priority: "High",
      email: "michael.wilson@example.com",
      phone: "+1 555-234-5678",
      additionalInfo: "Contract ended",
      details: []
    }
  ];

  const toggleRowExpansion = (id) => {
    setExpandedRows((prevState) => {
      if (prevState.includes(id)) {
        return prevState.filter((rowId) => rowId !== id);
      } else {
        return [...prevState, id];
      }
    });
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleNotifications = (e) => {
    e.stopPropagation();
    setShowNotifications(!showNotifications);
    if (showProfileDropdown) setShowProfileDropdown(false);
  };

  const toggleProfileDropdown = (e) => {
    e.stopPropagation();
    setShowProfileDropdown(!showProfileDropdown);
    if (showNotifications) setShowNotifications(false);
  };

  const navigateTo = (path) => {
    console.log(`Navigating to: ${path}`);
    navigate(path);
  };

  const handleProfileAction = (action) => {
    setShowProfileDropdown(false);

    switch (action) {
      case "profile":
        navigate("/admin/profile");
        break;
      case "projects":
        navigate("/projects");
        break;
      case "settings":
        navigate("/admin/profile");
        break;
      case "photo":
        if (fileInputRef.current) {
          fileInputRef.current.click();
        }
        break;
      case "logout":
        handleLogout();
        break;
      default:
        break;
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("User signed out");
      setIsAdmin(false);
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownload = (hire) => {
    try {
      let csvContent = "data:text/csv;charset=utf-8,";
      csvContent += "ID,Full Name,Department,Role,Status,Start Date,End Date,Priority,Email,Phone\n";
      csvContent += `${hire.id},${hire.fullName},${hire.department},${hire.roleTitle},${hire.status},${hire.startDate},${hire.endDate},${hire.priority},${hire.email},${hire.phone}\n`;
      
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute(
        "download",
        `Employee_${hire.id}_${new Date().toISOString().split("T")[0]}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Download error:", error);
      alert(`Error downloading file: ${error.message}`);
    }
  };

  const handleEdit = (hire, e) => {
    e.stopPropagation();
    setCurrentHire(hire);
    setShowEditModal(true);
  };

  const handleSaveChanges = async (formData) => {
    if (!currentHire || !currentHire.id) {
      console.error("No hire selected for editing");
      return;
    }

    setLoading(true);
    setConnectionStatus("Updating data...");
    setShowConnectionStatus(true);

    try {
      const hireRef = doc(db, "NewHires", currentHire.id);
      const updateData = {
        fullName: formData.fullName,
        department: formData.department,
        roleTitle: formData.roleTitle,
        status: formData.status,
        startDate: formData.startDate,
        endDate: formData.endDate,
        priority: formData.priority,
        email: formData.email,
        phone: formData.phone,
        additionalInfo: formData.additionalInfo
      };

      await updateDoc(hireRef, updateData);

      setNewHires((prevHires) =>
        prevHires.map((hire) =>
          hire.id === currentHire.id
            ? { ...hire, ...updateData }
            : hire
        )
      );

      setConnectionStatus("Data updated successfully");
      setTimeout(() => setShowConnectionStatus(false), 3000);
      setShowEditModal(false);
      setCurrentHire(null);
    } catch (error) {
      console.error("Error updating document:", error);
      setError(`Failed to update: ${error.message}`);
      setConnectionStatus(`Update failed: ${error.message}`);
      setTimeout(() => setShowConnectionStatus(false), 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();

    if (window.confirm("Are you sure you want to delete this employee record?")) {
      setLoading(true);
      setConnectionStatus("Deleting data...");
      setShowConnectionStatus(true);

      try {
        const hireRef = doc(db, "NewHires", id);
        await deleteDoc(hireRef);
        setNewHires((prevHires) => prevHires.filter((hire) => hire.id !== id));
        setConnectionStatus("Record deleted successfully");
        setTimeout(() => setShowConnectionStatus(false), 3000);
      } catch (error) {
        console.error("Error deleting document:", error);
        setError(`Failed to delete: ${error.message}`);
        setConnectionStatus(`Delete failed: ${error.message}`);
        setTimeout(() => setShowConnectionStatus(false), 5000);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleFilter = () => {
    console.log("Filtering data...");
  };

  const [currentPage, setCurrentPage] = useState(1);
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const filteredNewHires = newHires.filter((hire) => {
    if (statusFilter !== "All" && hire.status !== statusFilter) {
      return false;
    }

    if (
      searchTerm &&
      !Object.values(hire).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    ) {
      return false;
    }

    if (startDateFilter && hire.startDate < startDateFilter) {
      return false;
    }

    if (endDateFilter && hire.endDate > endDateFilter) {
      return false;
    }

    return true;
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }

      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-theme");
    } else {
      document.body.classList.remove("dark-theme");
    }
  }, [darkMode]);

  useEffect(() => {
    const checkAuth = async () => {
      const user = auth.currentUser;
      if (user) {
        const hasAdminRole = await checkAdminStatus();
        if (hasAdminRole) {
          setIsAdmin(true);
          fetchNewHires();
        }
      }
    };

    checkAuth();
  }, []);

  if (!isAdmin) {
    return (
      <div className="admin-login-container">
        <h2>Admin Login</h2>
        {showConnectionStatus && (
          <div className="connection-status">{connectionStatus}</div>
        )}

        <form onSubmit={handleAdminLogin}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              required
            />
          </div>

          {authError && <div className="auth-error">{authError}</div>}

          <button type="submit" className="login-btn" disabled={authLoading}>
            {authLoading ? "Logging in..." : "Login as Admin"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className={`app-container ${darkMode ? "dark-theme" : ""}`}>
      {showConnectionStatus && (
        <div className={`connection-status ${error ? "error" : "success"}`}>
          {connectionStatus}
        </div>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: "none" }}
      />

      <div className="sidebar">
        <div className="logo">HRCLOUDX</div>

        <nav className="menu">
          {navItems.map((item) => (
            <div
              key={item.path}
              className={`menu-item ${
                currentPath === item.path ? "active" : ""
              }`}
              onClick={() => navigateTo(item.path)}
            >
              <div className="menu-icon">
                {item.icon === "dashboard" && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="3" width="7" height="9"></rect>
                    <rect x="14" y="3" width="7" height="5"></rect>
                    <rect x="14" y="12" width="7" height="9"></rect>
                    <rect x="3" y="16" width="7" height="5"></rect>
                  </svg>
                )}
                {item.icon === "profile" && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                )}
                {item.icon === "new-hires" && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                )}
                {item.icon === "employees" && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                )}
                {item.icon === "projects" && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect
                      x="1"
                      y="4"
                      width="22"
                      height="16"
                      rx="2"
                      ry="2"
                    ></rect>
                    <line x1="1" y1="10" x2="23" y2="10"></line>
                  </svg>
                )}
                {item.icon === "billing" && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect
                      x="1"
                      y="4"
                      width="22"
                      height="16"
                      rx="2"
                      ry="2"
                    ></rect>
                    <line x1="1" y1="10" x2="23" y2="10"></line>
                  </svg>
                )}
                {item.icon === "documents" && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                  </svg>
                )}
                {item.icon === "leave" && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect
                      x="3"
                      y="4"
                      width="18"
                      height="18"
                      rx="2"
                      ry="2"
                    ></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                )}
              </div>
              <span className="menu-text">{item.label}</span>
              {currentPath === item.path && (
                <div className="active-indicator"></div>
              )}
            </div>
          ))}
        </nav>

        <div className="upgrade-card">
          <div className="upgrade-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="16"></line>
              <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
          </div>
          <div className="upgrade-title">Upgrade to PRO</div>
          <div className="upgrade-desc">to get access to all features!</div>
        </div>
      </div>

      <div className="main-content">
        <header className="header">
          <div className="breadcrumbs">
            <span>
              Pages /{" "}
              {currentPath.split("/").pop().charAt(0).toUpperCase() +
                currentPath.split("/").pop().slice(1)}
            </span>
            <h1>
              {currentPath.split("/").pop().charAt(0).toUpperCase() +
                currentPath.split("/").pop().slice(1).replace("-", " ")}
            </h1>
          </div>

          <div className="header-actions">
            <button className="header-action-btn" onClick={toggleDarkMode}>
              {darkMode ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="5"></circle>
                  <line x1="12" y1="1" x2="12" y2="3"></line>
                  <line x1="12" y1="21" x2="12" y2="23"></line>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                  <line x1="1" y1="12" x2="3" y2="12"></line>
                  <line x1="21" y1="12" x2="23" y2="12"></line>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
              )}
            </button>

            <div className="notifications-container" ref={notificationsRef}>
              <button
                className="header-action-btn"
                onClick={toggleNotifications}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
                <span className="notification-badge">2</span>
              </button>

              {showNotifications && (
                <NotificationsDropdown
                  notifications={notifications}
                  isOpen={showNotifications}
                />
              )}
            </div>

            <div className="user-profile" ref={profileDropdownRef}>
              <div className="avatar-container" onClick={toggleProfileDropdown}>
                <div className="avatar">
                  <img src={profileImage || "/placeholder.svg"} alt="User" />
                </div>
                <div className="user-info">
                  <div className="user-name">Doe, Jane</div>
                  <div className="user-role">Administrator</div>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="dropdown-arrow"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>

              {showProfileDropdown && (
                <ProfileDropdown
                  profileImage={profileImage}
                  handleProfileAction={handleProfileAction}
                />
              )}
            </div>
          </div>
        </header>

        {currentPath === "/new-hires" && (
          <div className="content-container">
            <div className="table-container">
              <h2 className="table-title">New Hires</h2>

              <div className="filters-row">
                <div className="filter-group">
                  <label>Status</label>
                  <div className="select-wrapper">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="All">All</option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Pending">Pending</option>
                      <option value="On Leave">On Leave</option>
                    </select>
                    <span className="select-arrow">▼</span>
                  </div>
                </div>

                <div className="date-range">
                  <label>Start Date</label>
                  <input
                    type="date"
                    value={startDateFilter}
                    onChange={(e) => setStartDateFilter(e.target.value)}
                  />

                  <label>End Date</label>
                  <input
                    type="date"
                    value={endDateFilter}
                    onChange={(e) => setEndDateFilter(e.target.value)}
                  />
                </div>

                <div className="search-box">
                  <input
                    type="text"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <span className="search-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                  </span>
                </div>

                <button className="filter-button" onClick={handleFilter}>
                  <span className="filter-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                    </svg>
                  </span>
                  Filter
                </button>
              </div>

              {loading && (
                <div className="loading-indicator">
                  <div className="spinner"></div>
                  <p>Loading data...</p>
                </div>
              )}

              {error && !loading && (
                <div className="error-message">
                  <p>{error}</p>
                </div>
              )}

              {!loading && !error && (
               <div className="table-wrapper">
                <div className="table">
                <div className="table-header">
                  <div className="header-cell">ID</div>
                  <div className="header-cell">Full Name</div>
                  <div className="header-cell">Department</div>
                  <div className="header-cell">Role Title</div>
                  <div className="header-cell">Status</div>
                  <div className="header-cell">Priority</div>
                  <div className="header-cell">Email</div>
                  <div className="header-cell">Phone</div>
                  <div className="header-cell">Actions</div>
                </div>
              
                <div className="table-body">
                  {filteredNewHires.length > 0 ? (
                    filteredNewHires.map((hire) => (
                      <div key={hire.id}>
                        <div className="table-row">
                          <div className="table-cell">{hire.id}</div>
                          <div className="table-cell">
                            <div className="cell-content">{hire.fullName || "N/A"}</div>
                          </div>
                          <div className="table-cell">
                            <div className="cell-content">{hire.department || "N/A"}</div>
                          </div>
                          <div className="table-cell">
                            <div className="cell-content">{hire.roleTitle || "N/A"}</div>
                          </div>
                          <div className="table-cell">
                            <span className={`status-badge ${hire.status.toLowerCase().replace(/\s+/g, '-')}`}>
                              {hire.status}
                            </span>
                          </div>
                          <div className="table-cell">
                            <span className={`priority-tag ${hire.priority.toLowerCase()}`}>
                              {hire.priority}
                            </span>
                          </div>
                          <div className="table-cell">
                            <div className="cell-content email-cell">{hire.email || "N/A"}</div>
                          </div>
                          <div className="table-cell">
                            <div className="cell-content">{hire.phone || "N/A"}</div>
                          </div>
                          <div className="table-cell actions-cell">
                            <div className="action-buttons">
                              <button 
                                className="action-btn edit" 
                                onClick={(e) => handleEdit(hire, e)}
                                title="Edit"
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                </svg>
                              </button>
                              <button 
                                className="action-btn delete" 
                                onClick={(e) => handleDelete(hire.id, e)}
                                title="Delete"
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="3 6 5 6 21 6"></polyline>
                                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                </svg>
                              </button>
                              <button 
                                className="action-btn download" 
                                onClick={() => handleDownload(hire)}
                                title="Download"
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                  <polyline points="7 10 12 15 17 10"></polyline>
                                  <line x1="12" y1="15" x2="12" y2="3"></line>
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
              
                        {expandedRows.includes(hire.id) && (
                          <div className="expanded-row">
                            <div className="expanded-content">
                              <div className="expanded-detail">
                                <strong>Additional Info:</strong> {hire.additionalInfo || "None"}
                              </div>
                              <div className="expanded-detail">
                                <strong>Documents:</strong> {hire.documents || "None"}
                              </div>
                              <div className="expanded-detail">
                                <strong>Net/Gross Value:</strong> {hire.value || "N/A"}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="no-data-message">
                      <p>No new hires found matching your criteria.</p>
                    </div>
                  )}
                </div>
              </div>
              </div>

              )}

              {!loading && !error && filteredNewHires.length > 0 && (
                <div className="pagination">
                  <div className="page-text">Page</div>
                  <button className="page-btn prev-btn">◀</button>
                  <button className="page-btn active">{currentPage}</button>
                  <button className="page-btn">2</button>
                  <button className="page-btn next-btn">▶</button>
                  <div className="page-text">20</div>
                </div>
              )}
            </div>
          </div>
        )}

        {currentPath !== "/new-hires" && (
          <div className="content-container">
            <div className="placeholder-content">
              <h2>
                {currentPath.split("/").pop().charAt(0).toUpperCase() +
                  currentPath.split("/").pop().slice(1).replace("-", " ")}{" "}
                Page
              </h2>
              <p>This is a placeholder for the {currentPath} page content.</p>
              <p>Click on different sidebar items to navigate between pages.</p>
            </div>
          </div>
        )}

        <footer className="footer">
          © 2024 HRCloudX. All Rights Reserved.
        </footer>
      </div>

      <EditModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        hire={currentHire}
        onSave={handleSaveChanges}
      />
    </div>
  );
};

export default NewHires;