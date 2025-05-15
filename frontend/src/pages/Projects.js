"use client";

import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/Projects.css";

// Notifications Dropdown Component
const NotificationsDropdown = ({ notifications, isOpen }) => {
  if (!isOpen) return null;

  // Calculate unread notifications count
  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  return (
    <div
      className="notifications-dropdown"
      style={{
        position: "absolute",
        top: "45px",
        right: "0",
        width: "320px",
        backgroundColor: "white",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        zIndex: 9999,
        overflow: "hidden",
      }}
    >
      <div
        className="dropdown-header"
        style={{ padding: "16px", borderBottom: "1px solid #e9ecef" }}
      >
        <h3>
          Notifications{" "}
          <span className="notification-count">{unreadCount} unread</span>
        </h3>
        <button className="text-btn">Mark all as read</button>
      </div>
      <div
        className="notifications-list"
        style={{ maxHeight: "320px", overflowY: "auto" }}
      >
        {notifications && notifications.length > 0 ? (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`notification-item ${
                notification.read ? "read" : "unread"
              }`}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "12px",
                padding: "12px 16px",
                borderBottom: "1px solid #e9ecef",
                backgroundColor: notification.read
                  ? "transparent"
                  : "rgba(124, 58, 237, 0.05)",
                cursor: "pointer",
              }}
            >
              <div
                className="notification-icon"
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  backgroundColor: "#f1f5f9",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#7c3aed",
                }}
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
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              </div>
              <div className="notification-content" style={{ flex: 1 }}>
                <div
                  className="notification-title"
                  style={{
                    fontSize: "14px",
                    marginBottom: "4px",
                    fontWeight: notification.read ? "normal" : "500",
                  }}
                >
                  {notification.title}
                </div>
                <div
                  className="notification-time"
                  style={{ fontSize: "12px", color: "#64748b" }}
                >
                  {notification.time}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div
            style={{ padding: "16px", textAlign: "center", color: "#64748b" }}
          >
            No notifications to display
          </div>
        )}
      </div>
      <div
        className="notification-actions"
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "8px 16px",
          borderTop: "1px solid #e9ecef",
        }}
      >
        <button
          className="text-btn"
          style={{
            background: "none",
            border: "none",
            color: "#7c3aed",
            fontSize: "12px",
            cursor: "pointer",
            padding: "0",
          }}
        >
          View all
        </button>
        <button
          className="text-btn"
          style={{
            background: "none",
            border: "none",
            color: "#7c3aed",
            fontSize: "12px",
            cursor: "pointer",
            padding: "0",
          }}
        >
          Settings
        </button>
      </div>
    </div>
  );
};

// Profile Dropdown Component
const ProfileDropdown = ({ profileImage, handleProfileAction }) => {
  return (
    <div
      className="dropdown-menu profile-dropdown animate-in fade-in-50 slide-in-from-top-5"
      style={{
        position: "absolute",
        top: "100%",
        right: "0",
        width: "280px",
        backgroundColor: "white",
        borderRadius: "8px",
        boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)",
        zIndex: 1000,
        overflow: "hidden",
        marginTop: "10px",
      }}
    >
      <div className="dropdown-header">
        <div className="dropdown-user-info">
          <div className="dropdown-avatar">
            <img src={profileImage || "/placeholder.svg"} alt="User" />
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

const ProjectsPage = () => {
  // Use React Router hooks for navigation
  const navigate = useNavigate();
  const location = useLocation();

  // State management
  const [darkMode, setDarkMode] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [profileImage, setProfileImage] = useState(
    "/placeholder.svg?height=32&width=32"
  );
  const fileInputRef = useRef(null);

  // Refs for click outside handling
  const profileDropdownRef = useRef(null);
  const notificationsRef = useRef(null);

  // Sample data for project cards
  const featuredProjects = [
    {
      id: 1,
      name: "Modern",
      description:
        "An open work environment through a huge amount of internal management format.",
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      id: 2,
      name: "Scandinavian",
      description:
        "Made in something that every person has his or her own working space area.",
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      id: 3,
      name: "Minimalist",
      description:
        "Different people have different taste, and various types of looks.",
      image: "/placeholder.svg?height=200&width=400",
    },
  ];

  // Sample team members for project cards
  const teamMembers = [
    { id: 1, avatar: "/placeholder.svg?height=24&width=24" },
    { id: 2, avatar: "/placeholder.svg?height=24&width=24" },
    { id: 3, avatar: "/placeholder.svg?height=24&width=24" },
    { id: 4, avatar: "/placeholder.svg?height=24&width=24" },
  ];

  // Sample data for projects table
  const tableProjects = [
    {
      id: 1,
      name: "Chakra Soft UI Version",
      icon: "C",
      iconColor: "#4318FF",
      budget: "$14,000",
      status: "Ongoing",
      completion: 80,
    },
    {
      id: 2,
      name: "Add Progress Track",
      icon: "A",
      iconColor: "#4318FF",
      budget: "$3,000",
      status: "Canceled",
      completion: 10,
    },
    {
      id: 3,
      name: "Fix Platform Errors",
      icon: "F",
      iconColor: "#4318FF",
      budget: "Not set",
      status: "Done",
      completion: 100,
    },
    {
      id: 4,
      name: "Launch our Mobile App",
      icon: "L",
      iconColor: "#4318FF",
      budget: "$32,000",
      status: "Done",
      completion: 100,
    },
    {
      id: 5,
      name: "Add the New Pricing Page",
      icon: "A",
      iconColor: "#4318FF",
      budget: "$400",
      status: "Upcoming",
      completion: 0,
    },
  ];

  // Sample notifications
  const notifications = [
    {
      id: 1,
      title: "New project created",
      read: false,
      time: "2 min ago",
    },
    { id: 2, title: "Project update", read: true, time: "1 hour ago" },
    { id: 3, title: "System alert", read: false, time: "3 hours ago" },
    {
      id: 4,
      title: "Project completed",
      read: true,
      time: "Yesterday",
    },
  ];

  // Navigation items with paths from App.js
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

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Navigation function using React Router
  const navigateTo = (path) => {
    console.log("Navigating to:", path);
    navigate(path);
  };

  // Handle file change for profile image
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

  // Handle logout
  const handleLogout = async () => {
    console.log("User signed out");
    // In a real app, this would handle authentication logout
    navigate("/");
  };

  // Apply dark mode class to body
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-theme");
    } else {
      document.body.classList.remove("dark-theme");
    }
  }, [darkMode]);

  // Handle notification click
  const handleNotificationClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowNotifications(!showNotifications);
  };

  // Toggle profile dropdown
  const toggleProfileDropdown = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  // Handle click outside to close dropdowns
  useEffect(() => {
    function handleClickOutside(event) {
      // For profile dropdown
      if (showProfileDropdown && !event.target.closest(".user-profile")) {
        setShowProfileDropdown(false);
      }

      // For notifications dropdown
      if (
        showNotifications &&
        !event.target.closest(".notifications-container") &&
        !event.target.closest(".header-action-btn")
      ) {
        setShowNotifications(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showProfileDropdown, showNotifications]);

  // Handle escape key to close dropdowns
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") {
        setShowProfileDropdown(false);
        setShowNotifications(false);
      }
    };

    document.addEventListener("keydown", handleEscKey);
    return () => document.removeEventListener("keydown", handleEscKey);
  }, []);

  // Handle profile actions
  const handleProfileAction = (action) => {
    setShowProfileDropdown(false);

    setTimeout(() => {
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
    }, 100);
  };

  // Check if a menu item is active based on current path
  const isMenuItemActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className={`projects-container ${darkMode ? "dark-theme" : ""}`}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: "none" }}
      />

      {/* Sidebar */}
      <div className="sidebar">
        <div className="logo">HRCLOUDX</div>

        <nav className="menu">
          {navItems.map((item) => (
            <div
              key={item.path}
              className={`menu-item ${
                isMenuItemActive(item.path) ? "active" : ""
              }`}
              onClick={() => navigateTo(item.path)}
            >
              <svg
                className="menu-icon"
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
                {item.icon === "dashboard" && (
                  <>
                    <rect x="3" y="3" width="7" height="9"></rect>
                    <rect x="14" y="3" width="7" height="5"></rect>
                    <rect x="14" y="12" width="7" height="9"></rect>
                    <rect x="3" y="16" width="7" height="5"></rect>
                  </>
                )}
                {item.icon === "profile" && (
                  <>
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </>
                )}
                {item.icon === "new-hires" && (
                  <>
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </>
                )}
                {item.icon === "employees" && (
                  <>
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </>
                )}
                {item.icon === "projects" && (
                  <>
                    <path d="M2 17L12 22L22 17"></path>
                    <path d="M2 12L12 17L22 12"></path>
                    <path d="M12 2L2 7L12 12L22 7L12 2Z"></path>
                  </>
                )}
                {item.icon === "billing" && (
                  <>
                    <rect
                      x="1"
                      y="4"
                      width="22"
                      height="16"
                      rx="2"
                      ry="2"
                    ></rect>
                    <line x1="1" y1="10" x2="23" y2="10"></line>
                  </>
                )}
                {item.icon === "documents" && (
                  <>
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                  </>
                )}
                {item.icon === "leave" && (
                  <>
                    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                    <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                  </>
                )}
              </svg>
              <span>{item.label}</span>
            </div>
          ))}
        </nav>

        <div className="upgrade-card">
          <div className="upgrade-icon">
            <svg
              className="icon"
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

      {/* Main Content */}
      <div
        className="main-content"
        style={{
          margin: "0 0 0 280px",
          padding: "20px",
          width: "calc(100% - 280px)",
        }}
      >
        {/* Header Container */}
        <div className="header-container">
          <div className="breadcrumb">
            <div className="breadcrumb-path">Pages / Projects</div>
            <h1 className="page-title">Projects</h1>
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

            {/* Notifications dropdown */}
            <div
              className="notifications-container"
              ref={notificationsRef}
              style={{ position: "relative" }}
            >
              <button
                className="header-action-btn"
                onClick={handleNotificationClick}
                style={{ cursor: "pointer" }}
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

            {/* Profile dropdown */}
            <div className="user-profile" style={{ position: "relative" }}>
              <div
                className="avatar-container"
                onClick={toggleProfileDropdown}
                style={{ cursor: "pointer" }}
              >
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
        </div>

        {/* Projects Section */}
        <div className="projects-section">
          <h2 className="section-title">Projects</h2>
          <p className="section-subtitle">Architects design houses</p>

          <div className="projects-grid">
            {featuredProjects.map((project) => (
              <div key={project.id} className="project-card">
                <div className="project-image">
                  <img
                    src={project.image || "/placeholder.svg"}
                    alt={project.name}
                  />
                </div>
                <div className="project-content">
                  <h3 className="project-title">{project.name}</h3>
                  <p className="project-description">{project.description}</p>

                  <div className="project-footer">
                    <div className="team-members">
                      {teamMembers.map((member, index) => (
                        <div
                          key={member.id}
                          className="team-avatar"
                          style={{ zIndex: teamMembers.length - index }}
                        >
                          <img
                            src={member.avatar || "/placeholder.svg"}
                            alt="Team member"
                          />
                        </div>
                      ))}
                    </div>

                    <button className="view-all-btn">VIEW ALL</button>
                  </div>
                </div>
              </div>
            ))}

            <div className="create-project-card">
              <div className="create-project-content">
                <div className="plus-icon">+</div>
                <p>Create a New Project</p>
              </div>
            </div>
          </div>
        </div>

        {/* Projects Table Section */}
        <div className="projects-table-section">
          <div className="table-header-section">
            <div>
              <h2 className="section-title">Projects</h2>
              <p className="section-subtitle">
                <span className="done-count">30</span> done this month
              </p>
            </div>
          </div>

          <div className="projects-table">
            <div className="table-header">
              <div className="header-companies">COMPANIES</div>
              <div className="header-budget">BUDGET</div>
              <div className="header-status">STATUS</div>
              <div className="header-completion">COMPLETION</div>
              <div className="header-actions"></div>
            </div>

            {tableProjects.map((project) => (
              <div key={project.id} className="table-row">
                <div className="cell-company">
                  <div
                    className="company-icon"
                    style={{
                      backgroundColor: `${project.iconColor}20`,
                      color: project.iconColor,
                    }}
                  >
                    {project.icon}
                  </div>
                  <span>{project.name}</span>
                </div>

                <div className="cell-budget">{project.budget}</div>

                <div className="cell-status">
                  <span
                    className={`status-badge status-${project.status.toLowerCase()}`}
                  >
                    {project.status}
                  </span>
                </div>

                <div className="cell-completion">
                  <div className="completion-text">{project.completion}%</div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${project.completion}%`,
                        backgroundColor: getProgressColor(
                          project.status,
                          project.completion
                        ),
                      }}
                    ></div>
                  </div>
                </div>

                <div className="cell-actions">
                  <button className="action-button">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z"
                        fill="#A0AEC0"
                        stroke="#A0AEC0"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M19 13C19.5523 13 20 12.5523 20 12C20 11.4477 19.5523 11 19 11C18.4477 11 18 11.4477 18 12C18 12.5523 18.4477 13 19 13Z"
                        fill="#A0AEC0"
                        stroke="#A0AEC0"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M5 13C5.55228 13 6 12.5523 6 12C6 11.4477 5.55228 11 5 11C4.44772 11 4 11.4477 4 12C4 12.5523 4.44772 13 5 13Z"
                        fill="#A0AEC0"
                        stroke="#A0AEC0"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="footer">
          <div className="copyright">© 2024 HRCLOUDX. All Rights Reserved.</div>
          <div className="footer-links">
            <a href="#">Marketplace</a>
            <a href="#">License</a>
            <a href="#">Terms of Use</a>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to determine progress bar color based on status and completion
const getProgressColor = (status, completion) => {
  if (status === "Done") return "#05CD99";
  if (status === "Ongoing") return "#4318FF";
  if (status === "Canceled") return "#FF5B5B";
  return "#FFB547"; // Upcoming or default
};

export default ProjectsPage;
