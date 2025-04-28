import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import AdminSidebar from "./Admin/AdminSidebar";
import AdminHeader from "./Admin/AdminHeader";
import AdminFooter from "./Admin/AdminFooter";
import "../styles/AdminProfilePage.css";
import "./Admin/AdminSidebar.css";
import "./Admin/AdminHeader.css";
import "./Admin/AdminFooter.css";
import "../styles/EmployeeList.css";


const Employee = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [notifications, setNotifications] = useState({
        "New employee registrations": true,
        "Leave request approvals": true,
        "System alerts": true,
        "Payroll processing": false,
        "Performance reviews": false,
        "Company announcements": true,
        "Security alerts": true,
        "Data export completions": false,
    });

    // Set active menu item based on current route
    const getActiveMenuItem = () => {
        const path = location.pathname;
        if (path.includes('/admin/dashboard')) return 'AdminDashboard';
        if (path.includes('/admin/profile')) return 'Profile';
        if (path.includes('/new-hires')) return 'New Hires';
        if (path.includes('/employee')) return 'Employees';
        if (path.includes('/billing')) return 'Billing';
        if (path.includes('/admin/projects')) return 'Projects';
        return 'AdminDashboard'; // default
    };

    const [activeMenuItem, setActiveMenuItem] = useState(getActiveMenuItem());
    const handleMenuItemClick = (menuItem) => {
        setActiveMenuItem(menuItem);
        switch (menuItem) {
            case 'AdminDashboard':
                navigate('/admin/dashboard');
                break;
            case 'Profile':
                navigate('/admin/profile');
                break;
            case 'New Hires':
                navigate('/new-hires');
                break;
            case 'Employees':
                navigate('/employee');
                break;
            case 'Billing':
                navigate('/billing');
                break;
            case 'Projects':
                navigate('/admin/projects');
                break;
            default:
                navigate('/admin/dashboard');
        }
    };
    const [darkMode, setDarkMode] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    // Initialize data and dark mode
    useEffect(() => {
        // Dark mode
        const savedMode = localStorage.getItem("darkMode");
        if (savedMode !== null) {
            setDarkMode(savedMode === "true");
        }
    }, []);

    // Apply dark mode
    useEffect(() => {
        if (darkMode) {
            document.body.classList.add("dark-theme");
        } else {
            document.body.classList.remove("dark-theme");
        }
        localStorage.setItem("darkMode", darkMode);
    }, [darkMode]);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    const toggleNotification = (notification) => {
        setNotifications((prev) => ({
            ...prev,
            [notification]: !prev[notification],
        }));
    };

    const [searchInput, setSearchInput] = useState('');

    const employees = [
        {
            id: 1,
            firstName: "Jane",
            lastName: "Cooper",
            position: "Lead Designer",
            phone: "069 555 0118",
            email: "jcooper22@cloudx.com",
            gender: "Female",
            birthDate: "19.02.1998",
            status: "active"
        },
        {
            id: 2,
            firstName: "Floyd",
            lastName: "Miles",
            position: "Programmer",
            phone: "068 555-0100",
            email: "fmiles23@cloudx.com",
            gender: "Male",
            birthDate: "20.06.1997",
            status: "inactive"
        },
        // ... more employee data
    ];

    return (
        <div className="app-container-el">
            {/* Sidebar */}
            <AdminSidebar
                activeMenuItem={activeMenuItem}
                handleMenuItemClick={handleMenuItemClick}
            />

            {/* Main Content */}
            <div className="main-content-el">
                {/* Header Section */}
                <AdminHeader
                    activeMenuItem={activeMenuItem}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    darkMode={darkMode}
                    toggleDarkMode={toggleDarkMode}
                    notifications={notifications}
                    toggleNotification={toggleNotification}
                />

                {/* Stats Cards */}
                <div className="card-row">
                    <StatCard
                        icon="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/rVxHgVJPg0/15z50vdu_expires_30_days.png"
                        title="Total Employees"
                        value="5,423"
                        trend="up"
                        percentage="16%"
                    />
                    <StatCard
                        icon="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/rVxHgVJPg0/xto263dd_expires_30_days.png"
                        title="Members"
                        value="1,893"
                        trend="down"
                        percentage="1%"
                    />
                    <StatCard
                        icon="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/rVxHgVJPg0/tj8c6xcv_expires_30_days.png"
                        title="Active Now"
                        value="189"
                    />
                </div>

                {/* Employees Table */}
                <div className="employees-table">
                    <div className="table-header">
                        <h3>All Employees</h3>
                        <div className="table-actions">
                            <div className="search-sort-container">
                                <div className="search-bar">
                                    <div className="search-icon-wrapper">
                                        <img
                                            src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/rVxHgVJPg0/9pubq1xq_expires_30_days.png"
                                            alt="Search"
                                            className="search-icon"
                                        />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Search employees..."
                                        className="search-input"
                                        value={searchInput}
                                        onChange={(e) => setSearchInput(e.target.value)}
                                    />
                                    {searchInput && (
                                        <button
                                            className="clear-search"
                                            onClick={() => setSearchInput('')}
                                        >
                                            ×
                                        </button>
                                    )}
                                </div>
                                <div className="dropdown-wrapper">
                                    <button className="sort-button">
                                        <span>Sort: Newest</span>
                                        <img
                                            src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/rVxHgVJPg0/h983ip9i_expires_30_days.png"
                                            alt="Sort"
                                            className="sort-icon"
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <table className="table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Surname</th>
                                <th>Position</th>
                                <th>Phone Number</th>
                                <th>Email</th>
                                <th>Gender</th>
                                <th>Birth Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.map((employee) => (
                                <tr key={employee.id}>
                                    <td>{employee.firstName}</td>
                                    <td>{employee.lastName}</td>
                                    <td>{employee.position}</td>
                                    <td>{employee.phone}</td>
                                    <td>{employee.email}</td>
                                    <td>{employee.gender}</td>
                                    <td>{employee.birthDate}</td>
                                    <td>
                                        <StatusBadge status={employee.status} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    <div className="pagination">
                        <div className="pagination-info">
                            Showing data 1 to 8 of 256K entries
                        </div>
                        <div className="pagination-controls">
                            <button className="pagination-button">
                                &lt;
                            </button>
                            <button className="pagination-button active">
                                1
                            </button>
                            <button className="pagination-button">
                                2
                            </button>
                            <button className="pagination-button">
                                3
                            </button>
                            <button className="pagination-button">
                                4
                            </button>
                            <span className="pagination-ellipsis">...</span>
                            <button className="pagination-button">
                                40
                            </button>
                            <button className="pagination-button">
                                &gt;
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <AdminFooter />
            </div>
        </div>
    );
};

// Reusable Components
const MenuItem = ({ icon, text, active = false }) => (
    <div className={`menu-item ${active ? 'active' : ''}`}>
        <img src={icon} alt={text} className="menu-icon" />
        <span>{text}</span>
    </div>
);

const StatCard = ({ icon, title, value, trend, percentage }) => (
    <div className="stat-card">
        <div className="stat-icon-container">
            <img src={icon} alt={title} className="stat-icon" />
        </div>
        <div className="stat-content">
            <h4>{title}</h4>
            <h3>{value}</h3>
            {trend && (
                <div className={`stat-trend ${trend}`}>
                    <img
                        src={
                            trend === 'up'
                                ? "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/rVxHgVJPg0/n8r0s5m8_expires_30_days.png"
                                : "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/rVxHgVJPg0/9ovpf1zo_expires_30_days.png"
                        }
                        alt={trend === 'up' ? "Up" : "Down"}
                    />
                    <span>{percentage} this month</span>
                </div>
            )}
        </div>
    </div>
);

const StatusBadge = ({ status }) => (
    <span className={`status-badge ${status}`}>
        {status === 'active' ? 'Active' : 'Inactive'}
    </span>
);

export default Employee;