import React, { useState } from "react";
import "../styles/ProfilePageEmployee.css"

export default (props) => {
    const [input1, onChangeInput1] = useState('');
    
    return (
        <div className="profile-container">
            <div className="sidebar">
                <div className="sidebar-header">
                    <span className="logo">HRCLOUDX</span>
                </div>
                
                <div className="sidebar-menu">
                    <div className="menu-item">
                        <img src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/e5cdd104-7027-4111-b9b0-203ead13153a"} className="menu-icon" />
                        <span>Dashboard</span>
                    </div>
                    <div className="menu-item active">
                        <img src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/f83d5003-9309-4c08-b4fb-effc29fd197d"} className="menu-icon" />
                        <span>Profile</span>
                    </div>
                    <div className="menu-item">
                        <img src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/6980a5d3-86da-498c-89ac-e7776a1a050a"} className="menu-icon" />
                        <span>Leave Requests</span>
                    </div>
                </div>
                
                <div className="upgrade-card">
                    <img src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/351f8885-31c6-4919-8816-1e9afdfbaee3"} className="upgrade-icon" />
                    <div className="upgrade-content">
                        <div className="pro-badge">
                            <img src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/2132e7a3-85e8-43b4-a441-49f76f6dc5d1"} />
                            <span>Upgrade to PRO</span>
                        </div>
                        <span className="upgrade-text">to get access to all features!</span>
                    </div>
                </div>
            </div>
            
            <div className="main-content">
                <div className="header">
                    <div className="breadcrumbs">
                        <span className="path">Pages / Profile</span>
                        <span className="current-page">Profile</span>
                    </div>
                    
                    <div className="header-actions">
                        <div className="search-bar">
                            <img src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/fb74aa3d-1201-4827-aba3-e8456f9e7557"} />
                            <input 
                                placeholder="Search" 
                                value={input1} 
                                onChange={(e) => onChangeInput1(e.target.value)} 
                            />
                        </div>
                        <div className="action-icons">
                            <img src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/5d37501d-2f6f-43eb-8027-f0dcb7225cec"} />
                            <img src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/fc94b941-d6a8-49dd-9e4a-a8d7bce035cd"} />
                            <img src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/5f95be88-67e2-436a-bad1-d0a2554ba6e0"} />
                            <img src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/4dfb0d26-a823-4773-9ff9-02c8455e9f5b"} />
                        </div>
                    </div>
                </div>
                
                <div className="profile-section">
                    <div className="profile-card">
                        <div className="profile-header">
                            <img src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/57709ee9-ee37-41a1-8342-a56a90377035"} className="cover-photo" />
                            <img src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/27b5ab18-748c-4fa7-b21c-07e1da88edcf"} className="profile-photo" />
                        </div>
                        
                        <div className="profile-info">
                            <div className="user-info">
                                <h2>Jane Doe</h2>
                                <p>Product Designer</p>
                            </div>
                            
                            <div className="stats">
                                <div className="stat-item">
                                    <span className="stat-number">17</span>
                                    <span className="stat-label">Posts</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-number">9.7k</span>
                                    <span className="stat-label">Followers</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-number">274</span>
                                    <span className="stat-label">Following</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="storage-card">
                        <div className="storage-header">
                            <img src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/35bb522e-7190-4669-9e39-f9992ef28f4d"} className="storage-icon" />
                            <button className="settings-btn" onClick={() => alert("Pressed!")}>
                                <img src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/6ddec5e0-c842-41ce-9839-ef84315aca47"} />
                            </button>
                        </div>
                        
                        <div className="storage-info">
                            <h3>Your storage</h3>
                            <p>Supervise your drive space in the easiest way</p>
                        </div>
                        
                        <div className="storage-progress">
                            <div className="progress-labels">
                                <span>25.6 Gb</span>
                                <span>50 Gb</span>
                            </div>
                            <div className="progress-bar">
                                <div className="progress-fill"></div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="upload-card">
                        <div className="upload-area">
                            <img src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/f81c15c3-242e-4ba1-91ed-f191592c92b7"} />
                            <h3>Upload Files</h3>
                            <p>PNG, JPG and GIF files are allowed</p>
                        </div>
                        
                        <div className="complete-profile">
                            <h3>Complete your profile</h3>
                            <p>Stay on the pulse of distributed projects with an online whiteboard to plan, coordinate and discuss</p>
                            <button className="publish-btn">Publish now</button>
                        </div>
                    </div>
                </div>
                
                <div className="content-section">
                    <div className="projects-card">
                        <h2>All Projects</h2>
                        <p className="subtext">Here you can find more details about your projects. Keep your user engaged by providing meaningful information.</p>
                        
                        <div className="project-list">
                            <div className="project-item">
                                <img src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/9c80177c-314a-4f0a-8b59-2f7172cc43f6"} />
                                <div className="project-info">
                                    <h4>Technology behind the Blockchain</h4>
                                    <div className="project-meta">
                                        <span>Project #1</span>
                                        <span>•</span>
                                        <a href="#">See project details</a>
                                    </div>
                                </div>
                                <img src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/b35fea9b-a952-4264-af4d-0402a2c28137"} className="more-icon" />
                            </div>
                            
                            <div className="project-item">
                                <img src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/e72c4cfd-fba8-4609-b6b2-3bb212d5b895"} />
                                <div className="project-info">
                                    <h4>Greatest way to a good Economy</h4>
                                    <div className="project-meta">
                                        <span>Project #2</span>
                                        <span>•</span>
                                        <a href="#">See project details</a>
                                    </div>
                                </div>
                                <img src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/7691a40f-5bb1-4649-ac52-b4c3fd40e625"} className="more-icon" />
                            </div>
                            
                            <div className="project-item">
                                <img src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/cc91f55f-a364-4d2b-b9ab-a674cd9f7238"} />
                                <div className="project-info">
                                    <h4>Most essential tips for Burnout</h4>
                                    <div className="project-meta">
                                        <span>Project #3</span>
                                        <span>•</span>
                                        <a href="#">See project details</a>
                                    </div>
                                </div>
                                <img src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/b95b63a7-a150-43a1-b94a-67095e2d7146"} className="more-icon" />
                            </div>
                        </div>
                    </div>
                    
                    <div className="info-card">
                        <h2>General Information</h2>
                        <p className="info-text">As we live, our hearts turn colder. Cause pain is what we go through as we become older. We get insulted by others, lose trust for those others. We get back stabbed by friends. It becomes harder for us to give others a hand. We get our heart broken by people we love, even that we give them all...</p>
                        
                        <div className="info-grid">
                            <button className="info-item" onClick={() => alert("Pressed!")}>
                                <span className="info-label">Education</span>
                                <span className="info-value">Stanford University</span>
                            </button>
                            
                            <button className="info-item" onClick={() => alert("Pressed!")}>
                                <span className="info-label">Languages</span>
                                <span className="info-value">English, Spanish, Italian</span>
                            </button>
                            
                            <button className="info-item" onClick={() => alert("Pressed!")}>
                                <span className="info-label">Department</span>
                                <span className="info-value">Product Design</span>
                            </button>
                            
                            <button className="info-item" onClick={() => alert("Pressed!")}>
                                <span className="info-label">Work History</span>
                                <span className="info-value">Google, Facebook</span>
                            </button>
                            
                            <button className="info-item" onClick={() => alert("Pressed!")}>
                                <span className="info-label">Organization</span>
                                <span className="info-value">Simmmple Web LLC</span>
                            </button>
                            
                            <button className="info-item" onClick={() => alert("Pressed!")}>
                                <span className="info-label">Birthday</span>
                                <span className="info-value">20 July 1986</span>
                            </button>
                        </div>
                    </div>
                    
                    <div className="notifications-card">
                        <div className="notifications-header">
                            <h2>Notifications</h2>
                            <button className="settings-btn" onClick={() => alert("Pressed!")}>
                                <img src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/03310866-1a7e-4c11-baa8-8a37f4f6c582"} />
                            </button>
                        </div>
                        
                        <div className="notification-list">
                            <div className="notification-item">
                                <img src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/0c106869-82ae-4fc4-a28d-6ed7aee438db"} />
                                <span>Item update notifications</span>
                            </div>
                            
                            <div className="notification-item">
                                <img src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/d6414e25-9c98-4796-838f-e02a9dd576fc"} />
                                <span>Item comment notifications</span>
                            </div>
                            
                            <div className="notification-item">
                                <img src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/f8dfaf95-99de-48aa-a1c8-b07b1ab2f17c"} />
                                <span>Buyer review notifications</span>
                            </div>
                            
                            <div className="notification-item">
                                <img src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/cba84a8a-3acb-4e37-98a0-b8fd62457a43"} />
                                <span>Rating reminders notifications</span>
                            </div>
                            
                            <div className="notification-item">
                                <img src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/9b818ce1-17fa-449c-80db-ec89c1bfe9e4"} />
                                <span>Meetups near you notifications</span>
                            </div>
                            
                            <div className="notification-item">
                                <img src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/b3c87455-caf8-40e3-a343-6dce1438390e"} />
                                <span>Company news notifications</span>
                            </div>
                            
                            <div className="notification-item">
                                <img src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/91c7293f-a5fb-4af5-8363-6b5a549e1dcb"} />
                                <span>New launches and projects</span>
                            </div>
                            
                            <div className="notification-item">
                                <img src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/99b6fbf2-fa7a-48a8-a60f-941852c6c315"} />
                                <span>Monthly product changes</span>
                            </div>
                            
                            <div className="notification-item">
                                <img src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/27a78237-bd1f-44f6-8037-13ac7b2a11d5"} />
                                <span>Subscribe to newsletter</span>
                            </div>
                            
                            <div className="notification-item">
                                <img src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/5193a8df-145d-4ba9-9e6e-c3add42e3c12"} />
                                <span>Email me when someone follows me</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="footer">
                    <span>© 2022 Horizon UI. All Rights Reserved. Made with love by Simmmple!</span>
                    <div className="footer-links">
                        <a href="#">Marketplace</a>
                        <a href="#">License</a>
                        <a href="#">Terms of Use</a>
                        <a href="#">Blog</a>
                    </div>
                </div>
            </div>
        </div>
    )
}