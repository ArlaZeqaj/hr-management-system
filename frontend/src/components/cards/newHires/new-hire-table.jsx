// Updated new-hire-table.jsx
"use client"

import React from "react"
import { Download, Edit, Trash2, CheckCircle } from "lucide-react"

const NewHireTable = ({
  hires,
  loading,
  error,
  expandedRows,
  toggleRowExpansion,
  handleEdit,
  handleDelete,
  handleDownload,
  handleApprove,
}) => {
  console.log("📋 HIRES PASSED TO TABLE:", hires)

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  if (error) {
    return <div className="error">Error: {error}</div>
  }

  if (!hires || hires.length === 0) {
    return <div className="empty-state">No hires found.</div>
  }

  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Department</th>
            <th>Role Title</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {hires.map((hire) => (
            <React.Fragment key={hire.id}>
              <tr onClick={() => toggleRowExpansion(hire.id)} className="table-row">
                <td>{hire.fullName}</td>
                <td>{hire.department}</td>
                <td>{hire.roleTitle}</td>
                <td>{hire.status}</td>
                <td>{hire.priority}</td>
                <td>{hire.email}</td>
                <td className="table-actions">
                  <button onClick={(e) => handleEdit(hire, e)}><Edit size={16} /></button>
                  <button onClick={(e) => handleDelete(hire, e)}><Trash2 size={16} /></button>
                  <button onClick={(e) => handleDownload(hire, e)}><Download size={16} /></button>
                  <button onClick={(e) => handleApprove(hire, e)}><CheckCircle size={16} /></button>
                </td>
              </tr>
              {expandedRows.includes(hire.id) && (
                <tr className="expanded-row">
                  <td colSpan="7">
                    <div className="expanded-content">
                      <div className="expanded-item">
                        <span className="expanded-label">Phone:</span>
                        <span className="expanded-value">{hire.phoneNr}</span>
                      </div>
                      <div className="expanded-item">
                        <span className="expanded-label">Documents:</span>
                        <span className="expanded-value">{hire.documents}</span>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default NewHireTable