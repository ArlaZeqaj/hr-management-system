"use client"

import React, { useState, useMemo } from "react"
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
  const [sortColumn, setSortColumn] = useState(null)
  const [sortDirection, setSortDirection] = useState("asc")

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  const sortedHires = useMemo(() => {
    if (!sortColumn) return hires

    return [...hires].sort((a, b) => {
      const aVal = a[sortColumn]?.toString().toLowerCase() || ""
      const bVal = b[sortColumn]?.toString().toLowerCase() || ""

      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1
      return 0
    })
  }, [hires, sortColumn, sortDirection])

  if (loading) return <div className="loading">Loading...</div>
  if (error) return <div className="error">Error: {error}</div>
  if (!hires || hires.length === 0) return <div className="empty-state">No hires found.</div>

  const renderSortArrow = (column) => {
    if (sortColumn !== column) return null
    return sortDirection === "asc" ? " ↑" : " ↓"
  }

  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            <th onClick={() => handleSort("name")}>Full Name {renderSortArrow("name")}</th>
            <th onClick={() => handleSort("department")}>Department {renderSortArrow("department")}</th>
            <th onClick={() => handleSort("roleTitle")}>Role Title {renderSortArrow("roleTitle")}</th>
            <th onClick={() => handleSort("status")}>Status {renderSortArrow("status")}</th>
            <th onClick={() => handleSort("priority")}>Priority {renderSortArrow("priority")}</th>
            <th onClick={() => handleSort("email")}>Email {renderSortArrow("email")}</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedHires.map((hire) => (
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
                      {hire.workHistory?.length > 0 && (
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
