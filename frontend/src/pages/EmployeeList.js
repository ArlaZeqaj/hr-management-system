"use client"

import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { auth } from "../config/firebaseConfig"
import { signOut, onAuthStateChanged } from "firebase/auth"
import "../styles/EmployeeList.css"

// NotificationsDropdown component
const NotificationsDropdown = ({ notifications, isOpen }) => {
  if (!isOpen) return null

  const unreadCount = notifications.filter((notification) => !notification.read).length

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
      <div className="dropdown-header" style={{ padding: "16px", borderBottom: "1px solid #e9ecef" }}>
        <h3>
          Notifications <span className="notification-count">{unreadCount} unread</span>
        </h3>
        <button className="text-btn">Mark all as read</button>
      </div>
      <div className="notifications-list" style={{ maxHeight: "320px", overflowY: "auto" }}>
        {notifications && notifications.length > 0 ? (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`notification-item ${notification.read ? "read" : "unread"}`}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "12px",
                padding: "12px 16px",
                borderBottom: "1px solid #e9ecef",
                backgroundColor: notification.read ? "transparent" : "rgba(124, 58, 237, 0.05)",
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
                <div className="notification-time" style={{ fontSize: "12px", color: "#64748b" }}>
                  {notification.time}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div style={{ padding: "16px", textAlign: "center", color: "#64748b" }}>No notifications to display</div>
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
        <button className="text-btn">View all</button>
        <button className="text-btn">Settings</button>
      </div>
    </div>
  )
}

// ProfileDropdown component
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
        <button className="dropdown-item" onClick={() => handleProfileAction("profile")}>
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
        <button className="dropdown-item" onClick={() => handleProfileAction("projects")}>
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
        <button className="dropdown-item" onClick={() => handleProfileAction("settings")}>
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
        <button className="dropdown-item" onClick={() => handleProfileAction("photo")}>
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
        <button className="dropdown-item" onClick={() => handleProfileAction("logout")}>
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
  )
}

export default function EmployeePage() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const [currentPage, setCurrentPage] = useState(1)
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [profileImage, setProfileImage] = useState(
    "https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/2bb4edd4-293b-43c8-b39f-493a2edb1d91",
  )
  const fileInputRef = useRef(null)

  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [totalEmployees, setTotalEmployees] = useState(0)
  const [connectionStatus, setConnectionStatus] = useState("Connecting to database...")
  const [showConnectionStatus, setShowConnectionStatus] = useState(true)
  const [currentUser, setCurrentUser] = useState(null)

  const [showSortDropdown, setShowSortDropdown] = useState(false)
  const sortDropdownRef = useRef(null)

  // Mock data for fallback if API fails
  const mockEmployees = [
    {
      id: "1",
      name: "John",
      surname: "Doe",
      email: "john.doe@example.com",
      birthDate: "1990-01-01",
      department: "Engineering",
      education: "Bachelor of Science in Computer Science",
      languages: ["English", "Spanish"],
      workHistory: ["Company A - Software Engineer", "Company B - Senior Developer"],
      status: "Active",
      createdAt: new Date("2023-01-15").getTime(),
    },
    {
      id: "2",
      name: "Jane",
      surname: "Smith",
      email: "jane.smith@example.com",
      birthDate: "1992-05-15",
      department: "Marketing",
      education: "Master of Business Administration",
      languages: ["English", "French"],
      workHistory: ["Company C - Marketing Associate", "Company D - Marketing Manager"],
      status: "Active",
      createdAt: new Date("2023-02-20").getTime(),
    },
    {
      id: "3",
      name: "Michael",
      surname: "Johnson",
      email: "michael.johnson@example.com",
      birthDate: "1985-08-10",
      department: "Finance",
      education: "Master of Finance",
      languages: ["English", "German"],
      workHistory: ["Company E - Financial Analyst", "Company F - Finance Manager"],
      status: "Active",
      createdAt: new Date("2023-03-05").getTime(),
    },
    {
      id: "4",
      name: "Emily",
      surname: "Williams",
      email: "emily.williams@example.com",
      birthDate: "1988-11-22",
      department: "Human Resources",
      education: "Bachelor of Arts in Psychology",
      languages: ["English", "Italian"],
      workHistory: ["Company G - HR Assistant", "Company H - HR Manager"],
      status: "Active",
      createdAt: new Date("2023-04-10").getTime(),
    },
    {
      id: "5",
      name: "David",
      surname: "Brown",
      email: "david.brown@example.com",
      birthDate: "1991-03-30",
      department: "Sales",
      education: "Bachelor of Business",
      languages: ["English", "Portuguese"],
      workHistory: ["Company I - Sales Representative", "Company J - Sales Manager"],
      status: "Active",
      createdAt: new Date("2023-05-15").getTime(),
    },
    {
      id: "6",
      name: "Sarah",
      surname: "Miller",
      email: "sarah.miller@example.com",
      birthDate: "1993-07-18",
      department: "Engineering",
      education: "Master of Computer Science",
      languages: ["English", "Chinese"],
      workHistory: ["Company K - Junior Developer", "Company L - Software Architect"],
      status: "Active",
      createdAt: new Date("2023-06-20").getTime(),
    },
    {
      id: "7",
      name: "James",
      surname: "Wilson",
      email: "james.wilson@example.com",
      birthDate: "1987-09-05",
      department: "Product",
      education: "Bachelor of Design",
      languages: ["English", "Japanese"],
      workHistory: ["Company M - Product Designer", "Company N - Product Manager"],
      status: "Active",
      createdAt: new Date("2023-07-25").getTime(),
    },
    {
      id: "8",
      name: "Jessica",
      surname: "Taylor",
      email: "jessica.taylor@example.com",
      birthDate: "1994-12-12",
      department: "Customer Support",
      education: "Bachelor of Communication",
      languages: ["English", "Russian"],
      workHistory: ["Company O - Support Agent", "Company P - Support Team Lead"],
      status: "Active",
      createdAt: new Date("2023-08-30").getTime(),
    },
    {
      id: "9",
      name: "Robert",
      surname: "Anderson",
      email: "robert.anderson@example.com",
      birthDate: "1986-04-25",
      department: "Operations",
      education: "Master of Business Operations",
      languages: ["English", "Arabic"],
      workHistory: ["Company Q - Operations Analyst", "Company R - Operations Director"],
      status: "Active",
      createdAt: new Date("2023-09-05").getTime(),
    },
    {
      id: "10",
      name: "Jennifer",
      surname: "Thomas",
      email: "jennifer.thomas@example.com",
      birthDate: "1989-06-08",
      department: "Legal",
      education: "Juris Doctor",
      languages: ["English", "Korean"],
      workHistory: ["Company S - Legal Assistant", "Company T - Legal Counsel"],
      status: "Active",
      createdAt: new Date("2023-10-10").getTime(),
    },
  ]

  const notifications = [
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
  ]

  const navItems = [
    { path: "/admin/dashboard", icon: "dashboard", label: "Dashboard" },
    { path: "/admin/profile", icon: "profile", label: "Profile" },
    { path: "/new-hires", icon: "new-hires", label: "New Hires" },
    { path: "/employee", icon: "employees", label: "Employees", active: true },
    { path: "/projects", icon: "projects", label: "Projects" },
    { path: "/billing", icon: "billing", label: "Billing" },
  ]

  // Fetch employees from backend API
  const fetchEmployees = async () => {
    setLoading(true)
    setError(null)
    setConnectionStatus("Fetching employee data...")
    setShowConnectionStatus(true)

    try {
      const user = auth.currentUser
      if (!user) {
        throw new Error("No authenticated user found")
      }

      const token = await user.getIdToken()
      const response = await fetch("http://localhost:8080/api/admin1/employees", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch employees: ${response.status}`)
      }

      const employeesData = await response.json()
      setEmployees(employeesData)
      setTotalEmployees(employeesData.length)
      setConnectionStatus("Connected to database")
      setTimeout(() => setShowConnectionStatus(false), 3000)
    } catch (err) {
      console.error("Error fetching employees:", err)
      setEmployees(mockEmployees)
      setTotalEmployees(mockEmployees.length)
      setConnectionStatus("Using mock data (Backend not available)")
      setError(err.message)
      setTimeout(() => setShowConnectionStatus(false), 5000)
    } finally {
      setLoading(false)
    }
  }

  // Apply sorting to the current employees list
  useEffect(() => {
    if (employees.length > 0) {
      const sortedEmployees = [...employees]

      switch (sortBy) {
        case "newest":
          sortedEmployees.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
          break
        case "oldest":
          sortedEmployees.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0))
          break
        case "name":
          sortedEmployees.sort((a, b) => (a.name || "").localeCompare(b.name || ""))
          break
        case "name-desc":
          sortedEmployees.sort((a, b) => (b.name || "").localeCompare(a.name || ""))
          break
        case "department":
          sortedEmployees.sort((a, b) => (a.department || "").localeCompare(b.department || ""))
          break
        case "birthDate":
          sortedEmployees.sort((a, b) => {
            if (!a.birthDate) return 1
            if (!b.birthDate) return -1
            return a.birthDate.localeCompare(b.birthDate)
          })
          break
        case "education":
          sortedEmployees.sort((a, b) => {
            if (!a.education) return 1
            if (!b.education) return -1
            return a.education.localeCompare(b.education)
          })
          break
        case "workHistory":
          sortedEmployees.sort((a, b) => {
            const aHistory = Array.isArray(a.workHistory) ? a.workHistory.join(", ") : ""
            const bHistory = Array.isArray(b.workHistory) ? b.workHistory.join(", ") : ""
            if (!aHistory) return 1
            if (!bHistory) return -1
            return aHistory.localeCompare(bHistory)
          })
          break
        case "status":
          sortedEmployees.sort((a, b) => (a.status || "").localeCompare(b.status || ""))
          break
        default:
          break
      }

      setEmployees(sortedEmployees)
    }
  }, [sortBy])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    if (!darkMode) {
      document.body.classList.add("dark-theme")
    } else {
      document.body.classList.remove("dark-theme")
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setProfileImage(event.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
      navigate("/login")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const handleProfileAction = (action) => {
    setShowProfileDropdown(false)

    setTimeout(() => {
      switch (action) {
        case "profile":
          navigate("/admin/profile")
          break
        case "projects":
          navigate("/projects")
          break
        case "settings":
          navigate("/admin/settings")
          break
        case "photo":
          fileInputRef.current?.click()
          break
        case "logout":
          handleLogout()
          break
        default:
          break
      }
    }, 100)
  }

  // Handle click outside dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showProfileDropdown && !event.target.closest(".user-profile")) {
        setShowProfileDropdown(false)
      }
      if (showNotifications && !event.target.closest(".notifications-container")) {
        setShowNotifications(false)
      }
      if (showSortDropdown && sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) {
        setShowSortDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [showProfileDropdown, showNotifications, showSortDropdown])

  // Check authentication status on component mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user)
        fetchEmployees()
      } else {
        navigate("/login")
      }
    })

    return () => unsubscribe()
  }, [navigate])

  // Filter employees based on search term
  const filteredEmployees = employees.filter((employee) => {
    if (!searchTerm) return true
    const term = searchTerm.toLowerCase()
    return (
      employee.name?.toLowerCase().includes(term) ||
      employee.surname?.toLowerCase().includes(term) ||
      employee.email?.toLowerCase().includes(term) ||
      employee.department?.toLowerCase().includes(term)
    )
  })

  // Pagination logic
  const itemsPerPage = 8
  const indexOfLastEmployee = currentPage * itemsPerPage
  const indexOfFirstEmployee = indexOfLastEmployee - itemsPerPage
  const currentEmployees = filteredEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee)
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage)

  // Manual refresh function
  const refreshData = () => {
    fetchEmployees()
  }

  return (
    <div className={`admin-container ${darkMode ? "dark-theme" : ""}`}>
      {showConnectionStatus && (
        <div
          className={`connection-status ${error ? "error" : "success"}`}
          style={{
            position: "fixed",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 9999,
            padding: "8px 15px",
            borderRadius: "4px",
            fontSize: "14px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            maxWidth: "400px",
            width: "auto",
            backgroundColor: error ? "#fee2e2" : "#ecfdf5",
            color: error ? "#b91c1c" : "#047857",
          }}
        >
          {connectionStatus}
        </div>
      )}

      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" style={{ display: "none" }} />

      <div className="sidebar">
        <div className="logo">HRCLOUDX</div>

        <nav className="menu">
          {navItems.map((item) => (
            <div
              key={item.path}
              className={`menu-item ${item.active ? "active" : ""}`}
              onClick={() => navigate(item.path)}
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
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                    <line x1="1" y1="10" x2="23" y2="10"></line>
                  </>
                )}
                {item.icon === "billing" && (
                  <>
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                    <line x1="1" y1="10" x2="23" y2="10"></line>
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

      <div className="main-content">
        <div className="header-container">
          <div className="breadcrumb">
            <div className="breadcrumb-path">Pages / Employees</div>
            <h1 className="page-title">Employees</h1>
          </div>
          <div className="header-actions">
            <button
              className="header-action-btn"
              onClick={refreshData}
              style={{
                marginRight: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                border: "none",
                background: "transparent",
                cursor: "pointer",
              }}
              title="Refresh data"
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
                <path d="M23 4v6h-6"></path>
                <path d="M1 20v-6h6"></path>
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10"></path>
                <path d="M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
              </svg>
            </button>

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

            <div className="notifications-container" style={{ position: "relative" }}>
              <button
                className="header-action-btn"
                onClick={() => setShowNotifications(!showNotifications)}
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

              {showNotifications && <NotificationsDropdown notifications={notifications} isOpen={showNotifications} />}
            </div>

            <div className="user-profile" style={{ position: "relative" }}>
              <div
                className="avatar-container"
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                style={{ cursor: "pointer" }}
              >
                <div className="avatar">
                  <img src={profileImage || "/placeholder.svg"} alt="User" />
                </div>
                <div className="user-info">
                  <div className="user-name">{currentUser?.displayName || "Admin User"}</div>
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
                <ProfileDropdown profileImage={profileImage} handleProfileAction={handleProfileAction} />
              )}
            </div>
          </div>
        </div>

        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-icon purple">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" fill="none" />
                  <path
                    d="M23 21v-2a4 4 0 0 0-3-3.87"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M16 3.13a4 4 0 0 1 0 7.75"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="stat-info">
                <div className="stat-label">Total Employees</div>
                <div className="stat-value">{totalEmployees}</div>
                <div className="stat-trend up">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="trend-icon"
                  >
                    <path
                      d="M8 4L12 8L8 12"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M4 8L12 8"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>16% this month</span>
                </div>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-icon purple">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" fill="none" />
                </svg>
              </div>
              <div className="stat-info">
                <div className="stat-label">Members</div>
                <div className="stat-value">{Math.floor(totalEmployees * 0.85)}</div>
                <div className="stat-trend up">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="trend-icon"
                  >
                    <path
                      d="M8 4L12 8L8 12"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M4 8L12 8"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>8% this month</span>
                </div>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-icon purple">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect
                    x="2"
                    y="4"
                    width="20"
                    height="16"
                    rx="2"
                    ry="2"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                  />
                  <circle cx="8" cy="12" r="2" fill="currentColor" />
                  <path
                    d="M14 12h4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M14 8h4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M14 16h4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="stat-info">
                <div className="stat-label">Active Now</div>
                <div className="stat-value">{Math.floor(totalEmployees * 0.15)}</div>
                <div className="stat-trend up">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="trend-icon"
                  >
                    <path
                      d="M8 4L12 8L8 12"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M4 8L12 8"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>12% this month</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="employees-section">
          <div className="employees-header">
            <div className="employees-title">
              <h3 className="section-title">All Employees</h3>
            </div>
            <div className="employees-actions">
              <div className="search-container">
                <svg
                  className="search-icon"
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
                <input
                  type="text"
                  placeholder="Search..."
                  className="search-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="sort-container" ref={sortDropdownRef}>
                <div className="custom-select">
                  <select className="sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                    <option value="name">Name (A-Z)</option>
                    <option value="name-desc">Name (Z-A)</option>
                    <option value="department">Department</option>
                    <option value="birthDate">Birth Date</option>
                    <option value="education">Education</option>
                    <option value="workHistory">Work History</option>
                    <option value="status">Status</option>
                  </select>
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
                    className="select-arrow"
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="employees-table">
            {loading ? (
              <div className="loading-indicator">
                <div className="spinner"></div>
                <p>Loading employees data...</p>
              </div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Surname</th>
                    <th>Email</th>
                    <th>Birth Date</th>
                    <th>Department</th>
                    <th>Education</th>
                    <th>Languages</th>
                    <th>Work History</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {currentEmployees.map((employee) => (
                    <tr key={employee.id}>
                      <td>{employee.name}</td>
                      <td>{employee.surname}</td>
                      <td>{employee.email}</td>
                      <td>{employee.birthDate}</td>
                      <td>{employee.department}</td>
                      <td>{employee.education}</td>
                      <td>{Array.isArray(employee.languages) ? employee.languages.join(", ") : ""}</td>
                      <td>{Array.isArray(employee.workHistory) ? employee.workHistory.join(", ") : ""}</td>
                      <td>
                        <span className={`status-badge ${employee.status ? employee.status.toLowerCase() : "active"}`}>
                          {employee.status || "Active"}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {currentEmployees.length === 0 && !loading && (
                    <tr>
                      <td colSpan="9" className="no-results">
                        {error ? error : "No employees found matching your search."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>

          <div className="table-footer">
            <div className="entries-info">
              Showing data {indexOfFirstEmployee + 1} to {Math.min(indexOfLastEmployee, filteredEmployees.length)} of{" "}
              {totalEmployees} entries
            </div>
            <div className="pagination">
              <button
                className={`page-btn ${currentPage === 1 ? "disabled" : ""}`}
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                &lt;
              </button>
              {[...Array(Math.min(5, totalPages))].map((_, index) => (
                <button
                  key={index}
                  className={`page-btn ${currentPage === index + 1 ? "active" : ""}`}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
              {totalPages > 5 && <span className="page-ellipsis">...</span>}
              {totalPages > 5 && (
                <button className="page-btn" onClick={() => setCurrentPage(totalPages)}>
                  {totalPages}
                </button>
              )}
              <button
                className={`page-btn ${currentPage === totalPages ? "disabled" : ""}`}
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                &gt;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

