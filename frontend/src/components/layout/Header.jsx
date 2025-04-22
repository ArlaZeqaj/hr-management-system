// src/components/layout/Header.jsx
import React from "react";

const Header = () => {
    return (
        <div className="header">
            <h2 className="header-title">Main Dashboard</h2>
            <div className="header-user">
                <div className="header-user-info">
                    <div className="header-user-name">Doe,</div>
                    <div className="header-user-role">Jane</div>
                </div>
                <img
                    src="https://source.unsplash.com/40x40/?face"
                    alt="User Avatar"
                    className="header-user-avatar"
                />
            </div>
        </div>
    );
};

export default Header;
