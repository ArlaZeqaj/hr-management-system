"use client"

import { useState, useEffect } from "react"
import { Edit } from "lucide-react"

const EditModal = ({ isOpen, onClose, hire, onSave }) => {
  const [formData, setFormData] = useState({
    id: "",
    fullName: "",
    roleTitle: "",
    department: "",
    status: "",
    email: "",
    phoneNr: "",
    priority: "",
    documents: "",
  })

  useEffect(() => {
    if (hire) {
      // Normalize the data to ensure consistent property names
      setFormData({
        id: hire.id || "",
        fullName: hire.fullName || "",
        roleTitle: hire.roleTitle || "",
        department: hire.department || "",
        status: hire.status || "Initial Review",
        email: hire.email || "",
        phoneNr: hire.phoneNr || "",
        priority: hire.priority || "Medium",
        documents: hire.documents || "",
      })
    }
  }, [hire])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">
            <Edit className="mr-2" size={18} /> Edit New Hire
          </h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="fullName" className="form-label">
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  className="form-input"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-input"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="department" className="form-label">
                  Department
                </label>
                <input
                  type="text"
                  id="department"
                  name="department"
                  className="form-input"
                  value={formData.department}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="roleTitle" className="form-label">
                  Role Title
                </label>
                <input
                  type="text"
                  id="roleTitle"
                  name="roleTitle"
                  className="form-input"
                  value={formData.roleTitle}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="status" className="form-label">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  className="form-select"
                  value={formData.status}
                  onChange={handleChange}
                  required
                >
                  <option value="Initial Review">Initial Review</option>
                  <option value="Interview Scheduled">Interview Scheduled</option>
                  <option value="Hired">Hired</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="priority" className="form-label">
                  Priority
                </label>
                <select
                  id="priority"
                  name="priority"
                  className="form-select"
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
                <label htmlFor="phoneNr" className="form-label">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phoneNr"
                  name="phoneNr"
                  className="form-input"
                  value={formData.phoneNr}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="documents" className="form-label">
                  Documents
                </label>
                <input
                  type="text"
                  id="documents"
                  name="documents"
                  className="form-input"
                  value={formData.documents}
                  onChange={handleChange}
                  placeholder="CV, Cover Letter, etc."
                />
              </div>
            </div>
          </form>
        </div>
        <div className="modal-footer">
          <button type="button" className="button button-outline" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="button button-primary" onClick={handleSubmit}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditModal
