"use client"

import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { auth, db } from "../config/firebaseConfig"
import { collection, getDocs } from "firebase/firestore"
import { signOut, signInWithEmailAndPassword } from "firebase/auth"
import "../styles/EmployeeList.css"

// Update the NotificationsDropdown component to ensure it's properly displayed
const NotificationsDropdown = ({ notifications, isOpen }) => {
  if (!isOpen) return null

  // Calculate unread notifications count
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
  )
}

// Create a separate ProfileDropdown component
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

export default function EmployeeList() {
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

  // Add admin authentication state
  const [isAdmin, setIsAdmin] = useState(false)
  const [adminEmail, setAdminEmail] = useState("")
  const [adminPassword, setAdminPassword] = useState("")
  const [authLoading, setAuthLoading] = useState(false)
  const [authError, setAuthError] = useState(null)

  // 7. Add state for the sort dropdown
  // Add this to your state declarations at the top of the component:

  const [showSortDropdown, setShowSortDropdown] = useState(false)
  const sortDropdownRef = useRef(null)

  const profileDropdownRef = useRef(null)
  const notificationsRef = useRef(null)
  const notificationButtonRef = useRef(null)
  const profileButtonRef = useRef(null)

  // Mock data for fallback if Firebase fails
  const mockEmployees = [
    {
      id: "1",
      name: "John",
      surname: "Doe",
      email: "john.doe@example.com",
      birthDate: "1990-01-01",
      department: "Engineering",
      education: "Bachelor of Science",
      languages: ["English", "Spanish"],
      workHistory: ["Company A", "Company B"],
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
      education: "Master of Business",
      languages: ["English", "French"],
      workHistory: ["Company C", "Company D"],
      status: "Active",
      createdAt: new Date("2023-02-20").getTime(),
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

  // Function to check if user has admin privileges
  const checkAdminStatus = async () => {
    try {
      const user = auth.currentUser
      if (!user) {
        return false
      }

      const idTokenResult = await user.getIdTokenResult()
      return idTokenResult.claims.admin === true
    } catch (error) {
      console.error("Error checking admin status:", error)
      return false
    }
  }

  // Admin login function
  const handleAdminLogin = async (e) => {
    e?.preventDefault()
    setAuthLoading(true)
    setAuthError(null)

    try {
      // Sign in with Firebase
      await signInWithEmailAndPassword(auth, adminEmail, adminPassword)

      // Check if user has admin privileges
      const hasAdminRole = await checkAdminStatus()

      if (hasAdminRole) {
        setIsAdmin(true)
        setConnectionStatus("Admin authenticated successfully")
        setTimeout(() => setShowConnectionStatus(false), 3000)
        // Fetch employees after successful admin login
        fetchEmployees()
      } else {
        setAuthError("This account does not have admin privileges")
        await signOut(auth)
        setIsAdmin(false)
      }
    } catch (error) {
      console.error("Admin login error:", error)
      setAuthError(error.message || "Authentication failed")
      setIsAdmin(false)
    } finally {
      setAuthLoading(false)
    }
  }

  // Fetch employees from Firebase - updated to respect security rules
  const fetchEmployees = async () => {
    setLoading(true)
    setError(null)
    setConnectionStatus("Fetching employee data...")
    setShowConnectionStatus(true)

    try {
      // Check admin status first
      const hasAdminRole = await checkAdminStatus()

      if (!hasAdminRole) {
        console.log("User does not have admin privileges. Using mock data.")
        setEmployees(mockEmployees)
        setTotalEmployees(mockEmployees.length)
        setConnectionStatus("Using mock data (Admin privileges required)")
        setLoading(false)
        setTimeout(() => setShowConnectionStatus(false), 5000)
        return
      }

      // Create a query to the employees collection
      const employeesRef = collection(db, "employees")
      const querySnapshot = await getDocs(employeesRef)

      // Process the results
      const employeesList = []
      querySnapshot.forEach((doc) => {
        const data = doc.data()

        // Add default values for missing fields to prevent errors
        // Convert Firestore timestamp to milliseconds if it exists
        const createdAt = data.createdAt
          ? data.createdAt.toMillis
            ? data.createdAt.toMillis()
            : data.createdAt
          : new Date().getTime()

        employeesList.push({
          id: doc.id,
          name: data.name || "Unknown",
          surname: data.surname || "",
          email: data.email || "",
          birthDate: data.birthDate || "",
          department: data.department || "Unassigned",
          education: data.education || "",
          languages: data.languages || [],
          workHistory: data.workHistory || [],
          status: data.status || "Active",
          createdAt: createdAt,
        })
      })

      // Update state with the fetched data
      setEmployees(employeesList)
      setTotalEmployees(employeesList.length)
      setLoading(false)
      setConnectionStatus("Connected to database")
      setTimeout(() => setShowConnectionStatus(false), 3000)
    } catch (err) {
      console.error("Error fetching employees:", err)

      // Fall back to mock data
      console.log("Using mock data for development")
      setEmployees(mockEmployees)
      setTotalEmployees(mockEmployees.length)
      setConnectionStatus("Using development data (Firebase connection failed)")
      setError(err.message)
      setLoading(false)
      setTimeout(() => setShowConnectionStatus(false), 5000)
    }
  }

  // Apply sorting to the current employees list
  useEffect(() => {
    if (employees.length > 0) {
      // Create a copy of the employees array to avoid mutating the original
      const sortedEmployees = [...employees]

      switch (sortBy) {
        case "newest":
          sortedEmployees.sort((a, b) => {
            // Handle missing createdAt values
            const dateA = a.createdAt || 0
            const dateB = b.createdAt || 0
            return dateB - dateA // Sort in descending order (newest first)
          })
          break
        case "oldest":
          sortedEmployees.sort((a, b) => {
            // Handle missing createdAt values
            const dateA = a.createdAt || 0
            const dateB = b.createdAt || 0
            return dateA - dateB // Sort in ascending order (oldest first)
          })
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
      }

      // Update the employees state with the sorted array
      setEmployees(sortedEmployees)
    }
  }, [sortBy])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  const navigateTo = (path) => {
    console.log("Navigating to:", path)
    navigate(path)
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
      console.log("User signed out")
      setIsAdmin(false)
      navigateTo("/")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-theme")
    } else {
      document.body.classList.remove("dark-theme")
    }
  }, [darkMode])

  // Fix the notification click handler
  const handleNotificationClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    console.log("Notification clicked, toggling dropdown")
    setShowNotifications(!showNotifications)
  }

  // Fix the profile dropdown click handler
  const toggleProfileDropdown = () => {
    console.log("Profile clicked, current state:", showProfileDropdown, "toggling to:", !showProfileDropdown)
    setShowProfileDropdown(!showProfileDropdown)
  }

  // Add a direct DOM event listener for the profile button
  useEffect(() => {
    const profileButton = document.querySelector(".avatar-container")
    if (profileButton) {
      profileButton.addEventListener("click", (e) => {
        e.preventDefault()
        e.stopPropagation()
        console.log("Profile button clicked via direct DOM event")
        setShowProfileDropdown((prevState) => !prevState)
      })
    }

    return () => {
      if (profileButton) {
        profileButton.removeEventListener("click", () => {})
      }
    }
  }, [])

  useEffect(() => {
    function handleClickOutside(event) {
      // For profile dropdown - simplified check
      if (showProfileDropdown && !event.target.closest(".user-profile")) {
        setShowProfileDropdown(false)
      }

      // For notifications dropdown - simplified check
      if (
        showNotifications &&
        !event.target.closest(".notifications-container") &&
        !event.target.closest(".header-action-btn")
      ) {
        setShowNotifications(false)
      }

      // For sort dropdown
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) {
        setShowSortDropdown(false)
      }
    }

    // Add the event listener
    document.addEventListener("mousedown", handleClickOutside)

    // Clean up
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showProfileDropdown, showNotifications]) // Add dependencies to ensure it updates when these states change

  useEffect(() => {
    const handleEscKey = (event) => {
      // 9. Update the Escape key handler to close the sort dropdown
      // Add this to your existing useEffect for Escape key handling:

      if (event.key === "Escape") {
        setShowProfileDropdown(false)
        setShowNotifications(false)
        setShowSortDropdown(false)
      }
    }

    document.addEventListener("keydown", handleEscKey)
    return () => document.removeEventListener("keydown", handleEscKey)
  }, [])

  const filteredEmployees = employees.filter((employee) => {
    if (!searchTerm) return true
    const term = searchTerm.toLowerCase()
    return (
      employee.name?.toLowerCase().includes(term) ||
      employee.surname?.toLowerCase().includes(term) ||
      employee.email?.toLowerCase().includes(term) ||
      employee.department?.toLowerCase().includes(term) ||
      employee.organization?.toLowerCase().includes(term)
    )
  })

  // Calculate pagination
  const itemsPerPage = 8
  const indexOfLastEmployee = currentPage * itemsPerPage
  const indexOfFirstEmployee = indexOfLastEmployee - itemsPerPage
  const currentEmployees = filteredEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee)
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage)

  // Update the handleProfileAction function to ensure it works
  const handleProfileAction = (action) => {
    // Close the dropdown first
    setShowProfileDropdown(false)

    // Add a small delay to ensure the UI updates before taking action
    setTimeout(() => {
      switch (action) {
        case "profile":
          navigate("/admin/profile")
          break
        case "projects":
          navigate("/projects")
          break
        case "settings":
          navigate("/admin/profile")
          break
        case "photo":
          if (fileInputRef.current) {
            fileInputRef.current.click()
          }
          break
        case "logout":
          handleLogout()
          break
        default:
          break
      }
    }, 100)
  }

  // Admin login form
  if (!isAdmin) {
    return (
      <div className="admin-login-container p-6 max-w-md mx-auto bg-white rounded-lg shadow-md dark:bg-gray-800">
        <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>
        {showConnectionStatus && (
          <div className="connection-status mb-4 p-3 bg-blue-100 text-blue-800 rounded">{connectionStatus}</div>
        )}

        <form onSubmit={handleAdminLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          {authError && <div className="text-red-500 text-sm p-2 bg-red-50 rounded">{authError}</div>}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
            disabled={authLoading}
          >
            {authLoading ? "Logging in..." : "Login as Admin"}
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className={`admin-container ${darkMode ? "dark-theme" : ""}`}>
      {/* Update the connection status banner style to be centered */}
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

      <div
        className="main-content"
        style={{
          margin: "0 0 0 280px",
          padding: "20px",
          width: "calc(100% - 280px)",
        }}
      >
        <div className="header-container">
          <div className="breadcrumb">
            <div className="breadcrumb-path">Pages / Employees</div>
            <h1 className="page-title">Employees</h1>
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

            {/* Update the notifications container in the render function */}
            <div className="notifications-container" ref={notificationsRef} style={{ position: "relative" }}>
              <button
                ref={notificationButtonRef}
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

              {showNotifications && <NotificationsDropdown notifications={notifications} isOpen={showNotifications} />}
            </div>

            {/* Update the profile container in the render function */}
            {/* Profile dropdown - fixed version */}
            <div className="user-profile" style={{ position: "relative" }}>
              <div className="avatar-container" onClick={toggleProfileDropdown} style={{ cursor: "pointer" }}>
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
                <ProfileDropdown profileImage={profileImage} handleProfileAction={handleProfileAction} />
              )}
            </div>
          </div>
        </div>

        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-icon purple">
                <img
                  src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/rVxHgVJPg0/15z50vdu_expires_30_days.png"
                  alt="Total Employees"
                  className="stat-icon-img"
                />
              </div>
              <div className="stat-info">
                <div className="stat-label">Total Employees</div>
                <div className="stat-value">{totalEmployees || "..."}</div>
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
                    </tr>
                  ))}
                  {currentEmployees.length === 0 && !loading && (
                    <tr>
                      <td colSpan="8" className="no-results">
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
              {totalEmployees || "..."} entries
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
