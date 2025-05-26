import React from 'react';
import AdminSidebar from '../../pages/Admin/AdminSidebar';
import AdminHeader from '../../pages/Admin/AdminHeader';
import AdminFooter from '../../pages/Admin/AdminFooter';

const ProjectAdminLayout = ({
                                children,
                                activeMenuItem,
                                handleMenuItemClick,
                                searchQuery,
                                setSearchQuery,
                                darkMode,
                                toggleDarkMode,
                                notifications,
                                toggleNotification,
                                profileImage,
                                showProfileDropdown,
                                setShowProfileDropdown,
                                handleProfileAction,
                                fileInputRef,
                                handleFileChange
                            }) => {
    return (
        <div className={`admin-dashboard-page-container ${darkMode ? 'dark-theme' : ''}`}>
            <AdminSidebar
                activeMenuItem={activeMenuItem}
                handleMenuItemClick={handleMenuItemClick}
            />
            <div className="admin-dashboard-main-content">
                <AdminHeader
                    activeMenuItem={activeMenuItem}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    darkMode={darkMode}
                    toggleDarkMode={toggleDarkMode}
                    notifications={notifications}
                    toggleNotification={toggleNotification}
                    profileImage={profileImage}
                    showProfileDropdown={showProfileDropdown}
                    setShowProfileDropdown={setShowProfileDropdown}
                    handleProfileAction={handleProfileAction}
                />

                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    style={{ display: 'none' }}
                />

                {children}

                <AdminFooter />
            </div>
        </div>
    );
};

export default ProjectAdminLayout;
