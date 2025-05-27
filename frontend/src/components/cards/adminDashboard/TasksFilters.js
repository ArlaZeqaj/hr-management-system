import React, { useState } from "react";

const TaskFilters = ({
    employees = [],
    filters = {},
    setFilters,
    statusOptions = ["All", "Pending", "In Progress", "Completed"],
    priorityOptions = ["All", "low", "medium", "high"]
}) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value === "All" ? "" : value
        }));
    };

    const handleEmployeeSelect = (employeeId) => {
        setFilters(prev => ({
            ...prev,
            assignee: employeeId === "All" ? "" : employeeId
        }));
        setIsDropdownOpen(false);
    };

    const filteredEmployees = employees.filter(employee =>
        `${employee.name} ${employee.surname}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="task-filters-container-ad">
            <div className="filter-group-ad">
                <label>Filter by Employee:</label>
                <div className="custom-select-ad">
                    <div
                        className="select-header-ad"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                        {filters.assignee ?
                            `${employees.find(e => e.id === filters.assignee)?.name || ''} ${employees.find(e => e.id === filters.assignee)?.surname || ''}`
                            : "All Employees"}
                        <span className={`dropdown-icon-ad ${isDropdownOpen ? 'open' : ''}`}>▼</span>
                    </div>

                    {isDropdownOpen && (
                        <div className="select-dropdown-ad">
                            <div className="search-container-ad">
                                <input
                                    type="text"
                                    placeholder="Search employees..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="search-input-ad"
                                    autoFocus
                                />
                            </div>
                            <div className="dropdown-options-ad">
                                <div
                                    className={`dropdown-option-ad ${!filters.assignee ? 'selected' : ''}`}
                                    onClick={() => handleEmployeeSelect("All")}
                                >
                                    All Employees
                                </div>
                                {filteredEmployees.map(employee => (
                                    <div
                                        key={employee.id}
                                        className={`dropdown-option-ad ${filters.assignee === employee.id ? 'selected' : ''}`}
                                        onClick={() => handleEmployeeSelect(employee.id)}
                                    >
                                        {employee.name} {employee.surname} ({employee.department})
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="filter-group-ad">
                <label htmlFor="status-filter">Filter by Status:</label>
                <select
                    id="status-filter"
                    name="status"
                    value={filters.status || "All"}
                    onChange={handleFilterChange}
                    className="filter-select-ad"
                >
                    {statusOptions.map(status => (
                        <option key={status} value={status}>
                            {status}
                        </option>
                    ))}
                </select>
            </div>

            <div className="filter-group-ad">
                <label htmlFor="priority-filter">Filter by Priority:</label>
                <select
                    id="priority-filter"
                    name="priority"
                    value={filters.priority || "All"}
                    onChange={handleFilterChange}
                    className="filter-select-ad"
                >
                    {priorityOptions.map(priority => (
                        <option key={priority} value={priority}>
                            {priority}
                        </option>
                    ))}
                </select>
            </div>

            <button
                className="reset-filters-btn-ad"
                onClick={() => {
                    setFilters({});
                    setSearchTerm("");
                }}
                title="Reset all filters"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M3 6h18" />
                    <path d="M7 12h10" />
                    <path d="M10 18h4" />
                </svg>
                <span>Reset</span>
            </button>
        </div>
    );
};

export default TaskFilters;