"use client"

import { useEffect, useState } from "react"
import { auth } from "../config/firebaseConfig"
import { onAuthStateChanged } from "firebase/auth"
import axios from "axios"
import { Plus, UserPlus, Search } from "lucide-react"
import { useNavigate, useLocation } from "react-router-dom"

import AdminSidebar from "./Admin/AdminSidebar"
import AdminHeader from "./Admin/AdminHeader"
import AdminFooter from "./Admin/AdminFooter"
import NewHireTable from "../components/cards/newHires/new-hire-table"
import Pagination from "../components/cards/newHires/pagination"
import EditModal from "../components/cards/newHires/edit-modal"
import AddModal from "../components/cards/newHires/add-modal"

import "../styles/NewHires.css"

const NewHires = () => {
  const navigate = useNavigate()
  const location = useLocation()

  // Get active menu item based on current route
  const getActiveMenuItem = () => {
    const path = location.pathname
    if (path.includes("/admin/dashboard")) return "Dashboard"
    if (path.includes("/admin/profile")) return "Profile"
    if (path.includes("/new-hires")) return "New Hires"
    if (path.includes("/employee")) return "Employees"
    if (path.includes("/billing")) return "Billing"
    if (path.includes("/admin/projects")) return "Projects"
    return "Dashboard" // default
  }

  const [userToken, setUserToken] = useState(null)
  const [hireList, setHireList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [connectionStatus, setConnectionStatus] = useState("Connecting to database...")
  const [showConnectionStatus, setShowConnectionStatus] = useState(true)

  const [expandedRows, setExpandedRows] = useState([])
  const [showEditModal, setShowEditModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [currentHire, setCurrentHire] = useState(null)
  const [darkMode, setDarkMode] = useState(false)
  const [activeMenuItem, setActiveMenuItem] = useState(getActiveMenuItem())

  const [notificationSettings, setNotificationSettings] = useState({
    "Email Notifications": true,
    "Push Notifications": false,
    "SMS Notifications": true,
  })

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const toggleDarkMode = () => {
    const newMode = !darkMode
    setDarkMode(newMode)
    document.body.classList.toggle("dark-theme", newMode)
    localStorage.setItem("darkMode", newMode)
  }

  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode")
    if (savedMode !== null) {
      setDarkMode(savedMode === "true")
      document.body.classList.toggle("dark-theme", savedMode === "true")
    }
  }, [])

  const toggleNotification = (item) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [item]: !prev[item],
    }))
  }

  const handleMenuItemClick = (menuItem) => {
    setActiveMenuItem(menuItem)
    // Define navigation routes
    const routes = {
      Dashboard: "/admin/dashboard",
      Profile: "/admin/profile",
      "New Hires": "/new-hires",
      Employees: "/employee",
      Billing: "/billing",
      Projects: "/admin/projects",
    }
    // Navigate to the corresponding route
    navigate(routes[menuItem] || "/admin/dashboard")
  }

  const fetchNewHires = async (token) => {
    setLoading(true)
    setError(null)
    setConnectionStatus("Fetching new hires data...")
    setShowConnectionStatus(true)

    try {
      let response
      try {
        response = await axios.get("http://localhost:8080/api/new-hires", {
          headers: { Authorization: `Bearer ${token}` },
        })
      } catch (apiError) {
        console.warn("API Error, using mock data:", apiError)
        response = {
          data: [
            {
              fullName: "John Doe",
              department: "Engineering",
              roleTitle: "Frontend Developer",
              status: "Hired",
              email: "john.doe@example.com",
              phoneNr: "123-456-7890",
              priority: "High",
              documents: "Resume, ID",
            },
            {
              fullName: "Jane Smith",
              department: "Marketing",
              roleTitle: "Content Manager",
              status: "Initial Review",
              email: "jane.smith@example.com",
              phoneNr: "987-654-3210",
              priority: "Medium",
              documents: "Resume, Portfolio",
            },
          ],
        }
      }

      const processedData = response.data.map((hire, index) => ({
        ...hire,
        key: `row-${index}`, // Only for UI expansion toggle
      }))

      setHireList(processedData)
      setConnectionStatus("Connected to database")
      setTimeout(() => setShowConnectionStatus(false), 3000)
    } catch (error) {
      console.error("API Error:", error)
      setError("Failed to connect to database. Please try again later.")
      setConnectionStatus("Failed to connect to database")
      setTimeout(() => setShowConnectionStatus(false), 5000)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        const mockToken = "mock-token-for-testing"
        setUserToken(mockToken)
        fetchNewHires(mockToken)
        return
      }
      try {
        const token = await user.getIdToken()
        setUserToken(token)
        fetchNewHires(token)
      } catch (error) {
        console.error("🔥 Error getting token:", error)
        setError("Authentication error.")
        setLoading(false)
      }
    })
    return () => unsubscribe()
  }, [])

  const handleEdit = (hire, e) => {
    e.stopPropagation()
    setCurrentHire(hire)
    setShowEditModal(true)
  }

  const handleDelete = async (hire, e) => {
    e.stopPropagation()
    try {
      await axios.delete(`http://localhost:8080/api/new-hires/${hire.docId}`, {
        headers: { Authorization: `Bearer ${userToken}` },
      })
      fetchNewHires(userToken)
    } catch (error) {
      console.error("❌ Failed to delete hire:", error)
    }
  }

  const handleDownload = (hire, e) => {
    e?.stopPropagation()
    console.log("⬇️ Download clicked:", hire)
  }

  const handleApprove = async (hire, e) => {
    e.stopPropagation()
    try {
      await axios.post(
        `http://localhost:8080/api/new-hires/${hire.docId}/approve`,
        {},
        {
          headers: { Authorization: `Bearer ${userToken}` },
        },
      )
      fetchNewHires(userToken)
    } catch (error) {
      console.error("❌ Failed to approve hire:", error)
    }
  }

  const handleSaveChanges = async (formData) => {
    try {
      await axios.put(`http://localhost:8080/api/new-hires/${formData.docId}`, formData, {
        headers: { Authorization: `Bearer ${userToken}` },
      })
      fetchNewHires(userToken)
      setShowEditModal(false)
    } catch (error) {
      console.error("❌ Failed to update hire:", error)
    }
  }

  const handleAddNewHire = async (formData) => {
    try {
      await axios.post("http://localhost:8080/api/new-hires", formData, {
        headers: { Authorization: `Bearer ${userToken}` },
      })
      fetchNewHires(userToken)
      setShowAddModal(false)
    } catch (error) {
      console.error("❌ Failed to add new hire:", error)
    }
  }

  const filteredHires = hireList.filter((hire) => {
    const matchesStatus = statusFilter === "All" || hire.status === statusFilter
    const matchesSearch = hire.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })
  const totalPages = Math.ceil(filteredHires.length / itemsPerPage)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredHires.slice(indexOfFirstItem, indexOfLastItem)

  const handlePageChange = (page) => setCurrentPage(page)

  return (
    <div className={`app-container ${darkMode ? "dark-theme" : ""}`}>
      {showConnectionStatus && (
        <div className={`connection-status ${error ? "error" : "success"}`}>
          <div className="status-icon">{error ? "✕" : "✓"}</div>
          <div className="status-text">{connectionStatus}</div>
        </div>
      )}

      <AdminSidebar activeMenuItem={activeMenuItem} handleMenuItemClick={handleMenuItemClick} />
      <div className="main-content">
        <AdminHeader
          activeMenuItem={activeMenuItem}
          searchQuery={searchTerm}
          setSearchQuery={setSearchTerm}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          notifications={notificationSettings}
          toggleNotification={(item) => setNotificationSettings((prev) => ({ ...prev, [item]: !prev[item] }))}
        />

        <div className="card hires-card">
          <div className="management-header">
            <div className="management-title">
              <UserPlus className="user-icon" size={20} />
              <h2>New Hires Management</h2>
              <div className="badge-count">{filteredHires.length}</div>
            </div>
            <button className="button button-primary add-button" onClick={() => setShowAddModal(true)}>
              <Plus size={16} className="button-icon" />
              Add New Hire
            </button>
          </div>

          <div className="filters">
            <div className="filter-group">
              <label className="filter-label">Status</label>
              <select className="filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="All">All Statuses</option>
                <option value="Initial Review">Initial Review</option>
                <option value="Interview Scheduled">Interview Scheduled</option>
                <option value="Hired">Hired</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">Search</label>
              <div className="filter-input-wrapper">
                <input
                  type="text"
                  className="filter-input"
                  placeholder="Search by name, email, department..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="search-icon">
                  <Search size={16} />
                </div>
              </div>
            </div>
          </div>

          <div className="table-container">
            <NewHireTable
              hires={currentItems}
              loading={loading}
              error={error}
              expandedRows={expandedRows}
              toggleRowExpansion={(key) =>
                setExpandedRows((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]))
              }
              handleEdit={handleEdit}
              handleDelete={handleDelete}
              handleDownload={handleDownload}
              handleApprove={handleApprove}
            />
          </div>

          {!loading && !error && filteredHires.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredHires.length}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
            />
          )}
        </div>

        <AdminFooter />
      </div>

      <EditModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        hire={currentHire}
        onSave={handleSaveChanges}
      />
      <AddModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} onSave={handleAddNewHire} />
    </div>
  )
}

export default NewHires
