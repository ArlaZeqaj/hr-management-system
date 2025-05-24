"use client"

import { useState } from "react"
import { UserPlus } from "lucide-react"

const AddModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    id: Date.now().toString(),
    name: "",
    surname: "",
    email: "",
    roleTitle: "",
    department: "",
    status: "Initial Review",
    phoneNr: "",
    priority: "Medium",
    documents: "",
    birthDate: "",
    education: "",
    languages: "",
    workHistory: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const dataToSend = {
      ...formData,
      languages: formData.languages.split(",").map((lang) => lang.trim()).filter(Boolean),
      workHistory: formData.workHistory.split(",").map((entry) => entry.trim()).filter(Boolean),
    }

    if (!dataToSend.id) {
      dataToSend.id = Date.now().toString()
    }

    onSave(dataToSend)

    // Reset the form
    setFormData({
      id: Date.now().toString(),
      name: "",
      surname: "",
      email: "",
      roleTitle: "",
      department: "",
      status: "Initial Review",
      phoneNr: "",
      priority: "Medium",
      documents: "",
      birthDate: "",
      education: "",
      languages: "",
      workHistory: "",
    })
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">
            <UserPlus className="mr-2" size={18} /> Add New Hire
          </h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <input type="hidden" name="id" value={formData.id} />

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">First Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-input"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="surname">Surname</label>
                <input
                  type="text"
                  id="surname"
                  name="surname"
                  className="form-input"
                  value={formData.surname}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Email</label>
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
              <div className="form-group">
                <label htmlFor="birthDate">Birth Date</label>
                <input
                  type="date"
                  id="birthDate"
                  name="birthDate"
                  className="form-input"
                  value={formData.birthDate}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="education">Education</label>
                <input
                  type="text"
                  id="education"
                  name="education"
                  className="form-input"
                  value={formData.education}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="phoneNr">Phone Number</label>
                <input
                  type="tel"
                  id="phoneNr"
                  name="phoneNr"
                  className="form-input"
                  value={formData.phoneNr}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="department">Department</label>
                <select
                  id="department"
                  name="department"
                  className="form-select"
                  value={formData.department}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Department</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Marketing">Marketing</option>
                  <option value="HR">HR</option>
                  <option value="Sales">Sales</option>
                  <option value="IT">IT</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="roleTitle">Role Title</label>
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
                <label htmlFor="status">Status</label>
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
                <label htmlFor="priority">Priority</label>
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
                <label htmlFor="languages">Languages</label>
                <input
                  type="text"
                  id="languages"
                  name="languages"
                  className="form-input"
                  value={formData.languages}
                  onChange={handleChange}
                  placeholder="e.g. English, Spanish"
                />
              </div>
              <div className="form-group">
                <label htmlFor="workHistory">Work History</label>
                <input
                  type="text"
                  id="workHistory"
                  name="workHistory"
                  className="form-input"
                  value={formData.workHistory}
                  onChange={handleChange}
                  placeholder="e.g. Google, Meta"
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
            Add New Hire
          </button>
        </div>
      </div>
    </div>
  )
}

export default AddModal
