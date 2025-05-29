"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { auth } from "../config/firebaseConfig"
import { signOut, onAuthStateChanged } from "firebase/auth"
import AdminSidebar from "./Admin/AdminSidebar"
import AdminHeader from "./Admin/AdminHeader"
import AdminFooter from "./Admin/AdminFooter"
import "./Admin/AdminSidebar.css"
import "./Admin/AdminHeader.css"
import "./Admin/AdminFooter.css"
import "../styles/EmployeeList.css"
import axios from "axios"


export default function EmployeePage() {
  const navigate = useNavigate()
  const location = useLocation()

  const [activeMenuItem, setActiveMenuItem] = useState(getActiveMenuItem())
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const [currentPage, setCurrentPage] = useState(1)
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
  const [darkMode, setDarkMode] = useState(() => {
    return JSON.parse(localStorage.getItem("darkMode")) || false;
  });
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
  const [recentHiresCount, setRecentHiresCount] = useState(0)

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

  function getActiveMenuItem() {
    const path = location.pathname
    if (path.includes("/admin/dashboard")) return "Dashboard"
    if (path.includes("/admin/profile")) return "Profile"
    if (path.includes("/new-hires")) return "New Hires"
    if (path.includes("/employee")) return "Employees"
    if (path.includes("/billing")) return "Billing"
    if (path.includes("/admin/projects")) return "Projects"
    return "Dashboard" // default
  }

  const handleMenuItemClick = (menuItem) => {
    setActiveMenuItem(menuItem)
    const routes = {
      Dashboard: "/admin/dashboard",
      Profile: "/admin/profile",
      "New Hires": "/new-hires",
      Employees: "/employee",
      Billing: "/billing",
      Projects: "/admin/projects",
    }
    navigate(routes[menuItem] || "/admin/dashboard")
  }

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

  // Fetch recent hires from backend API
  const fetchRecentHires = async () => {
    try {
      const user = auth.currentUser
      if (!user) {
        console.warn("No authenticated user for recent hires")
        return
      }

      const token = await user.getIdToken()
      const response = await axios.get("http://localhost:8080/api/new-hires", {
        headers: { Authorization: `Bearer ${token}` },
      })

      // Filter hires from the last 30 days
      const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000
      const recentHires = response.data.filter((hire) => {
        const hireDate = new Date(hire.createdAt || hire.dateAdded || Date.now()).getTime()
        return hireDate > thirtyDaysAgo
      })

      setRecentHiresCount(recentHires.length)
    } catch (error) {
      console.error("Error fetching recent hires:", error)
      // Fallback to calculating from employees data
      const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000
      const recentFromEmployees = employees.filter((emp) => {
        return emp.createdAt && emp.createdAt > thirtyDaysAgo
      }).length
      setRecentHiresCount(recentFromEmployees)
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
        default:
          break
      }

      setEmployees(sortedEmployees)
    }
  }, [sortBy])

      // Dark theme effect
  useEffect(() => {
    document.body.classList.toggle("dark-theme", darkMode);
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);
  const toggleDarkMode = useCallback(() => {
    setDarkMode(prev => !prev);
  }, []);

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

  // Handle click outside dropdowns (close dropdown header)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showProfileDropdown && !event.target.closest(".user-profile-el")) {
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
        fetchRecentHires() // Add this line
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
    fetchRecentHires() // Add this line
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

      <AdminSidebar activeMenuItem={activeMenuItem} handleMenuItemClick={handleMenuItemClick} />

      <div className="main-content">
      <AdminHeader
          activeMenuItem={activeMenuItem}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          notifications={notifications}
        />

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
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-icon purple">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <polyline
                    points="9,22 9,12 15,12 15,22"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="stat-info">
                <div className="stat-label">Departments</div>
                <div className="stat-value">{new Set(employees.map((emp) => emp.department).filter(Boolean)).size}</div>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-icon purple">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" fill="none" />
                  <path
                    d="M22 21v-2a4 4 0 0 0-3-3.87"
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
                  <path
                    d="M12 2l3 3-3 3"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="stat-info">
                <div className="stat-label">Recent Hires</div>
                <div className="stat-value">{recentHiresCount}</div>
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
        {/* Footer */}
        <AdminFooter />
      </div>
    </div>
  )
}
