import React from "react";
import "../styles/Admin.css";

export default (props) => {
    return (
        <div className="admin-container">
            {/* Sidebar */}
            <div className="sidebar">
                <div className="logo">HRCLOUDX</div>
                
                <div className="divider"></div>
                
                <nav className="menu">
                    <div className="menu-item active">
                        <img src="https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/9b6d12ad-df6a-4aef-a71b-970e2db2eda9" alt="Dashboard" />
                        <span>Dashboard</span>
                    </div>
                    <div className="menu-item">
                        <img src="https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/e71d6f7f-492e-410d-ba4a-6e4e57c163f8" alt="Profile" />
                        <span>Profile</span>
                    </div>
                </nav>
                
                <div className="upgrade-card">
                    <div className="upgrade-badge">
                        <img src="https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/afc33f36-a919-4557-8430-4f037f660cd0" alt="Upgrade" />
                        <span>Upgrade to PRO</span>
                    </div>
                    <p>to get access to all features!</p>
                </div>
            </div>

            {/* Main Content */}
            <div className="main-content">
                {/* Header */}
                <header className="header">
                    <div className="breadcrumbs">
                        <span>Pages / Dashboard</span>
                        <h1>Main Dashboard</h1>
                    </div>
                    
                    <div className="user-profile">
                        <img src="https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/2bb4edd4-293b-43c8-b39f-493a2edb1d91" alt="User" />
                        <span>Doe, Jane</span>
                        <img src="https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/082c3bf8-01b8-4766-8555-99763cf21464" alt="Dropdown" />
                    </div>
                </header>

                {/* Stats Cards */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon">
                            <img src="https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/c5f9b8e4-c1e3-474a-ac59-1a6e1940a968" alt="Earnings" />
                        </div>
                        <div className="stat-info">
                            <span className="stat-label">Earnings</span>
                            <span className="stat-value">$350.4</span>
                        </div>
                    </div>
                    
                    <div className="stat-card">
                        <div className="stat-icon">
                            <img src="https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/f6db50ab-057a-4a4a-aad5-6df21ea35315" alt="Spend" />
                        </div>
                        <div className="stat-info">
                            <span className="stat-label">Spend this month</span>
                            <span className="stat-value">$642.39</span>
                        </div>
                    </div>
                    
                    <div className="stat-card highlight">
                        <div className="stat-info">
                            <span className="stat-label">Sales</span>
                            <span className="stat-value">$574.34</span>
                        </div>
                        <div className="stat-trend">
                            <span className="trend-up">+23%</span>
                            <span className="trend-label">since last month</span>
                        </div>
                    </div>
                    
                    <div className="stat-card">
                        <div className="stat-info">
                            <span className="stat-label">Your balance</span>
                            <span className="stat-value">$1,000</span>
                        </div>
                        <div className="stat-graphic">
                            <img src="https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/80eb2203-0719-4576-826d-aefc62a1c5e9" alt="Balance" />
                        </div>
                    </div>
                    
                    <div className="stat-card">
                        <div className="stat-icon">
                            <img src="https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/8f2b0bc2-4f2c-4833-9078-2506010dc420" alt="Tasks" />
                        </div>
                        <div className="stat-info">
                            <span className="stat-label">New Tasks</span>
                            <span className="stat-value">154</span>
                        </div>
                    </div>
                    
                    <div className="stat-card">
                        <div className="stat-icon">
                            <img src="https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/eaf446da-7386-4573-beeb-cbe0d6b11922" alt="Projects" />
                        </div>
                        <div className="stat-info">
                            <span className="stat-label">Total Projects</span>
                            <span className="stat-value">2935</span>
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="content-grid">
                    {/* Payroll Card - Fixed Section */}
                    <div className="payroll-card" style={{ position: 'relative' }}>
                        <div style={{
                            position: 'absolute',
                            top: '20px',
                            right: '20px',
                            background: 'white',
                            padding: '8px 16px',
                            borderRadius: '8px',
                            fontWeight: 'bold',
                            fontSize: '20px',
                            color: '#2B3674',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                            zIndex: 2
                        }}>
                            Payrolls
                        </div>
                        <div className="payroll-header">
                            <span className="payroll-label">Due Date</span>
                            <span className="payroll-date">APR 05</span>
                        </div>
                        <div className="payroll-amount-container" style={{ marginTop: '20px' }}>
                            <span className="amount" style={{ fontSize: '32px', display: 'block', marginBottom: '15px' }}>$6000</span>
                            <button className="view-details" style={{ 
                                background: 'none',
                                border: 'none',
                                color: '#4318FF',
                                fontWeight: '600',
                                display: 'flex',
                                alignItems: 'center',
                                padding: 0,
                                cursor: 'pointer'
                            }}>
                                <span>View details</span>
                                <img 
  src="https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/045b0150-e6e8-4ce4-be1c-17a811aa024c" 
  alt="Arrow" 
  style={{ marginLeft: '5px', width: '20px', height: '20px' }}
/>                            </button>
                        </div>
                    </div>
                    
                    {/* Tasks Card */}
                    <div className="tasks-card">
                        <h3>27 March</h3>
                        <div className="task-item">
                            <div className="task-indicator"></div>
                            <div className="task-details">
                                <span className="task-name">Meet w/ Simmmple</span>
                                <span className="task-time">01:00 PM - 02:00 PM</span>
                            </div>
                        </div>
                        <div className="task-item">
                            <div className="task-indicator"></div>
                            <div className="task-details">
                                <span className="task-name">Fitness Training</span>
                                <span className="task-time">02:00 PM - 03:00 PM</span>
                            </div>
                        </div>
                        <button className="view-all">
                            <span>View all Tasks</span>
                            <img src="https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/0d7a58c0-b80b-489c-a7c1-9ec463b48373" alt="Arrow" />
                        </button>
                    </div>
                    
                    {/* Onboarding Card with Fixed Bullets */}
                    <div className="onboarding-card">
                        <div className="onboarding-header">
                            <div>
                                <h3>On boarding status</h3>
                                <p>From 1-6 Dec, 2020</p>
                            </div>
                            <button className="view-report" onClick={() => alert("Pressed!")}>
                                View Report
                            </button>
                        </div>
                        
                        <div className="onboarding-content">
                            <img src="https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/6e8588cc-b66f-4d2d-9e35-ae478035892e" alt="Chart" />
                            
                            <div className="status-list">
                                {[
                                    { label: 'Initial Reviews', value: '40%' },
                                    { label: 'Launched', value: '32%' }
                                ].map((item, index) => (
                                    <div key={index} style={{ 
                                        display: 'flex', 
                                        alignItems: 'center',
                                        marginBottom: '12px'
                                    }}>
                                        <div style={{
                                            width: '8px',
                                            height: '8px',
                                            borderRadius: '50%',
                                            backgroundColor: '#4318FF',
                                            marginRight: '10px'
                                        }}></div>
                                        <span style={{ flex: 1 }}>{item.label}</span>
                                        <span style={{ color: '#A3AED0' }}>{item.value}</span>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="status-list">
                                {[
                                    { label: 'Final Review', value: '28%' },
                                    { label: 'Pending Updates', value: '28%' }
                                ].map((item, index) => (
                                    <div key={index} style={{ 
                                        display: 'flex', 
                                        alignItems: 'center',
                                        marginBottom: '12px'
                                    }}>
                                        <div style={{
                                            width: '8px',
                                            height: '8px',
                                            borderRadius: '50%',
                                            backgroundColor: '#4318FF',
                                            marginRight: '10px'
                                        }}></div>
                                        <span style={{ flex: 1 }}>{item.label}</span>
                                        <span style={{ color: '#A3AED0' }}>{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};