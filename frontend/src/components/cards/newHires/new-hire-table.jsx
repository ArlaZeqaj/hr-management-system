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
            <React.Fragment key={hire.key || hire.id}>
              <tr onClick={() => toggleRowExpansion(hire.key || hire.id)} className="table-row">
<td>{hire.name} {hire.surname}</td>
                <td>{hire.department}</td>
                <td>{hire.roleTitle}</td>
                <td>
  <span className={`statuss-badge ${(hire.status || "unknown").replace(/\s+/g, "-").toLowerCase()}`}>
    {hire.status || "Unknown"}
  </span>
</td>
<td>
  <span className={`priority-badge ${(hire.priority || "unknown").toLowerCase()}`}>
    {hire.priority || "Unknown"}
  </span>
</td>

                <td>{hire.email}</td>
                <td className="table-actions">
                  <button className="action-button edit" onClick={(e) => handleEdit(hire, e)}>
                    <Edit size={16} />
                  </button>
                  <button className="action-button delete" onClick={(e) => handleDelete(hire, e)}>
                    <Trash2 size={16} />
                  </button>
                  <button className="action-button approve" onClick={(e) => handleApprove(hire, e)}>
                    <CheckCircle size={16} />
                  </button>
                </td>
              </tr>
              {expandedRows.includes(hire.key || hire.id) && (
                <tr className="expanded-row">
                  <td colSpan="7">
                    <div className="expanded-content">
                      <div className="expanded-item">
                        <span className="expanded-label">Phone:</span>
                        <span className="expanded-value">{hire.phoneNr}</span>
                      </div>
                      {hire.education && (
  <div className="expanded-item">
    <div className="expanded-label">Education</div>
    <div className="expanded-value">{hire.education}</div>
  </div>
)}

{hire.workHistory && hire.workHistory.length > 0 && (
  <div className="expanded-item">
    <div className="expanded-label">Work History</div>
    <div className="expanded-value">
      {hire.workHistory.join(", ")}
    </div>
  </div>
)}

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
