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
  const [activeMenuItem, setActiveMenuItem] = useState("New Hires")

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

  const handleMenuItemClick = (menuItem) => {
    setActiveMenuItem(menuItem)
    switch (menuItem) {
      case 'AdminDashboard':
        navigate('/admin/dashboard'); break
      case 'Profile':
        navigate('/admin/profile'); break
      case 'New Hires':
        navigate('/new-hires'); break
      case 'Employees':
        navigate('/employee'); break
      case 'Billing':
        navigate('/billing'); break
      case 'Projects':
        navigate('/admin/projects'); break
      default:
        navigate('/admin/dashboard')
    }
  }

  const fetchNewHires = async (token) => {
    setLoading(true)
    setError(null)
    setConnectionStatus("Fetching new hires data...")
    setShowConnectionStatus(true)

    try {
      const response = await axios.get("http://localhost:8080/api/new-hires", {
        headers: { Authorization: `Bearer ${token}` },
      })
      const processedData = response.data.map((hire, index) => ({
        ...hire,
        key: `row-${index}`,
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
      await axios.post(`http://localhost:8080/api/new-hires/${hire.docId}/approve`, {}, {
        headers: { Authorization: `Bearer ${userToken}` },
      })
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

  const filteredHires = hireList
  const totalPages = Math.ceil(filteredHires.length / itemsPerPage)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredHires.slice(indexOfFirstItem, indexOfLastItem)

  const handlePageChange = (page) => setCurrentPage(page)

  return (
    <div className={`app-container ${darkMode ? "dark-theme" : ""}`}>
      {showConnectionStatus && (
        <div className={`connection-status ${error ? "error" : "success"}`}>
          <span className="status-icon">{error ? "✕" : "✓"}</span>
          {connectionStatus}
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
          <div className="card-header">
            <div className="card-title-wrapper">
              <UserPlus className="card-icon" size={20} />
              <h2>New Hires Management</h2>
              <span className="badge-count">{filteredHires.length}</span>
            </div>
            <button 
              className="button button-primary add-button" 
              onClick={() => setShowAddModal(true)}
            >
              <Plus size={16} className="button-icon" />
              Add New Hire
            </button>
          </div>

          <FilterBar
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />

          <div className="table-wrapper">
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

      <EditModal isOpen={showEditModal} onClose={() => setShowEditModal(false)} hire={currentHire} onSave={handleSaveChanges} />
      <AddModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} onSave={handleAddNewHire} />
    </div>
  )
}

export default NewHires