"use client"
import { Filter, Search } from "lucide-react"

const FilterBar = ({ statusFilter, setStatusFilter, searchTerm, setSearchTerm }) => {
  return (
    <div className="filters">
      <div className="filter-group">
        <label className="filter-label">Status</label>
        <select className="filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="All">All Statuses</option>
          <option value="Hired">Hired</option>
          <option value="Interview Scheduled">Interview Scheduled</option>
          <option value="Rejected">Rejected</option>
          <option value="Initial Review">Initial Review</option>
        </select>
      </div>

      <div className="filter-group">
        <label className="filter-label">Search</label>
        <div className="relative w-full">
          <input
            type="text"
            className="filter-input"
            placeholder="Search by name, email, department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted" size={16} />
        </div>
      </div>

      <div className="filter-group">
        <button className="filter-button">
          <Filter size={16} className="mr-1" /> Apply Filters
        </button>
      </div>
    </div>
  )
}

export default FilterBar
