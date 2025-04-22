// src/components/layout/Sidebar.jsx
import React from "react";

const Sidebar = () => {
    return (
        <aside className="sidebar-z">
            <h1 className="sidebar-title-z">HRCLOUDX</h1>
            <nav className="sidebar-nav-z">
                <div className="sidebar-item-z active">
                    <span className="sidebar-indicator-z"></span>
                    <svg className="sidebar-icon-z" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M3 12l2-2 4 4 8-8 4 4v6H3v-4z" strokeWidth="2" />
                    </svg>
                    Dashboard
                </div>
                <div className="sidebar-item-z">
                    <svg className="sidebar-icon-z" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M12 12c2.21 0 4-1.79 4-4S14.21 4 12 4 8 5.79 8 8s1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" strokeWidth="2" />
                    </svg>
                    Profile
                </div>
                <div className="sidebar-item-z">
                    <svg className="sidebar-icon-z" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M12 4v16m8-8H4" strokeWidth="2" />
                    </svg>
                    New Hires
                </div>
                <div className="sidebar-item-z">
                    <svg className="sidebar-icon-z" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M17 20h5V4H2v16h5" strokeWidth="2" />
                    </svg>
                    Employees
                </div>
            </nav>
        </aside>
    );
};

export default Sidebar;