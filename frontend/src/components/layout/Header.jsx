// src/components/layout/Header.jsx
import React from "react";

const Header = () => {
    return (
        <div className="header-z">
            <h2 className="header-title-z">Main Dashboard</h2>
            <div className="header-user-z">
                <div className="header-user-info-z">
                    <div className="header-user-name-z">Doe,</div>
                    <div className="header-user-role-z">Jane</div>
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
