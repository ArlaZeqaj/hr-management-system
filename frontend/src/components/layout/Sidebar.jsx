// src/components/layout/Sidebar.jsx
import React from "react";
import {Link} from "react-router-dom";

const Sidebar = () => {
    return (
        <aside className="sidebar-z">
            <h1 className="sidebar-title-z">HRCLOUDX</h1>
            <nav className="sidebar-nav-z">
                <div className="sidebar-item-z active">

                    <span className="sidebar-indicator-z"></span>
                    <svg className="sidebar-icon-z" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M3 3h8v8H3V3zm10 0h8v5h-8V3zm0 7h8v11h-8V10zM3 13h8v8H3v-8z" strokeWidth="2" />
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
                        <path d="M6 2h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm9 1.5V9h5.5L15 3.5z" strokeWidth="2" />
                    </svg>
                    Documents
                </div>
                <div className="sidebar-item-z">
                    <svg className="sidebar-icon-z" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M3 6a2 2 0 0 1 2-2h4l2 2h10a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6z" strokeWidth="2" />
                    </svg>
                    Project
                </div>
                <div className="sidebar-item-z">
                    <svg className="sidebar-icon-z" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" strokeWidth="2" />
                    </svg>
                    Leave Request
                </div>
            </nav>
        </aside>
    );
};

export default Sidebar;