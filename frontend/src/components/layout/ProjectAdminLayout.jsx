import React from 'react';
import AdminSidebar from '../../pages/Admin/AdminSidebar';
import AdminHeader from '../../pages/Admin/AdminHeader';
import AdminFooter from '../../pages/Admin/AdminFooter';

const ProjectAdminLayout = ({
                                children,
                                activeMenuItem,
                                handleMenuItemClick,
                                darkMode,
                                toggleDarkMode,
                                profileImage,
                                showProfileDropdown,
                                setShowProfileDropdown,
                                handleProfileAction,
                                fileInputRef,
                                handleFileChange
                            }) => {
    return (
        <div className={`app-container-b ${darkMode ? 'dark-theme' : ''}`}>
            <AdminSidebar
                activeMenuItem={activeMenuItem}
                handleMenuItemClick={handleMenuItemClick}
            />
            <div className="main-content-aproject">
                <AdminHeader
                    activeMenuItem={activeMenuItem}
                    darkMode={darkMode}
                    toggleDarkMode={toggleDarkMode}
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
