"use client"

import { useEffect, useState } from "react"
import { auth } from "../config/firebaseConfig"
import { onAuthStateChanged } from "firebase/auth"
import axios from "axios"
import { Plus, UserPlus } from "lucide-react"
import { useNavigate, useLocation } from "react-router-dom"

import AdminSidebar from "./Admin/AdminSidebar"
import AdminHeader from "./Admin/AdminHeader"
import AdminFooter from "./Admin/AdminFooter"
import NewHireTable from '../components/cards/newHires/new-hire-table'
import FilterBar from '../components/cards/newHires/filter-bar'
import Pagination from '../components/cards/newHires/pagination'
import EditModal from '../components/cards/newHires/edit-modal'
import AddModal from '../components/cards/newHires/add-modal'

import '../styles/NewHires.css'

const NewHires = () => {
  const navigate = useNavigate()
  const location = useLocation()

    // Get active menu item based on current route
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
    setDarkMode(!darkMode)
    document.body.classList.toggle("dark-theme", !darkMode)
  }

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
      'Dashboard': '/admin/dashboard',
      'Profile': '/admin/profile',
      'New Hires': '/new-hires',
      'Employees': '/employee',
      'Billing': '/billing',
      'Projects': '/admin/projects'
    }
    // Navigate to the corresponding route
    navigate(routes[menuItem] || '/admin/dashboard')
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
    let unsubscribe = () => {}

    unsubscribe = onAuthStateChanged(auth, async (user) => {
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

  const handleDelete = async (index, e) => {
    e.stopPropagation()
    setHireList((prev) => prev.filter((_, i) => i !== index))
  }

  const handleDownload = (hire, e) => {
    e?.stopPropagation()
    console.log("⬇️ Download clicked:", hire)
  }

  const handleApprove = async (hire, e) => {
    e.stopPropagation()
    console.log("✅ Approve clicked:", hire)
  }

  const handleSaveChanges = async (formData) => {
    console.log("💾 Save changes called with:", formData)
    setShowEditModal(false)
  }

  const handleAddNewHire = async (formData) => {
    console.log("➕ Add new hire called with:", formData)
    setHireList((prev) => [...prev, formData])
    setShowAddModal(false)
  }

  const filteredHires = hireList
  const totalPages = Math.ceil(filteredHires.length / itemsPerPage)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredHires.slice(indexOfFirstItem, indexOfLastItem)

  const handlePageChange = (page) => setCurrentPage(page)

  return (
    <div className={`app-container ${darkMode ? "dark-theme" : ""}`}>
      {showConnectionStatus && (
        <div className={`connection-status ${error ? "error" : "success"}`}>{connectionStatus}</div>
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
          toggleNotification={toggleNotification}
        />

        <div className="card">
          <div className="card-header">
            <h2 className="card-title">
              <UserPlus className="mr-2" size={18} /> New Hires Management
            </h2>
            <div className="card-actions">
              <button className="button button-primary" onClick={() => setShowAddModal(true)}>
                <Plus size={16} className="mr-1" /> Add New Hire
              </button>
            </div>
          </div>

          <FilterBar
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />

          <NewHireTable
            hires={currentItems}
            loading={loading}
            error={error}
            expandedRows={expandedRows}
            toggleRowExpansion={(key) =>
              setExpandedRows((prev) =>
                prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
              )
            }
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            handleDownload={handleDownload}
            handleApprove={handleApprove}
          />

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

        {showEditModal && <p style={{ color: "green" }}>🟢 Edit Modal Open</p>}
        {showAddModal && <p style={{ color: "blue" }}>🟦 Add Modal Open</p>}
        <AdminFooter />
      </div>

      <EditModal isOpen={showEditModal} onClose={() => setShowEditModal(false)} hire={currentHire} onSave={handleSaveChanges} />
      <AddModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} onSave={handleAddNewHire} />
    </div>
  )
}

export default NewHires
