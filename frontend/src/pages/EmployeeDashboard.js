import React from "react";
import "../styles/Employee.css";
import { useNavigate } from "react-router-dom";
const EmployeeDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="container">


      <aside className="sidebar">
        <div className="logo">HRCLOUDX</div>
        <nav>
          <div
              className="nav-item active"
              onClick={() => navigate("/employee-dashboard")}
              style={{ cursor: "pointer" }}
          >
            <img
                src="https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/76c6c27c-f302-4eb0-a082-7591f8751d74"
                alt="Dashboard"
            />
            Dashboard
          </div>
          <div
              className="nav-item"
              onClick={() => navigate("/profile")}
              style={{ cursor: "pointer" }}
          >
            <img
                src="https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/85efb97f-aed4-473f-a904-cc49090afefa"
                alt="Profile"
            />
            Profile
          </div>
        </nav>
      </aside>


      {/* Main Content */}
      <main className="main-content">
        <header className="header">
          <div className="breadcrumb">
            <span>Pages / Dashboard</span>
            <h1>Main Dashboard</h1>
          </div>
          <div className="user-info">
            <span>Doe, Jane</span>
            <img src="https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/a90cbc2d-5cad-46bb-905e-42cd99e48e33" alt="User" className="user-avatar" />
          </div>
        </header>

        {/* Dashboard Metrics */}
        <section className="dashboard-metrics">
          <div className="metric">
            <img src="https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/de4aa923-97df-4b07-bc38-65c63102ab7d" alt="Earnings" />
            <div>
              <span>Earnings</span>
              <strong>$350.4</strong>
            </div>
          </div>
          <div className="metric">
            <img src="https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/2c2adbd4-e1d2-472f-8ad3-185e435a9eaf" alt="Spend" />
            <div>
              <span>Spend this month</span>
              <strong>$642.39</strong>
            </div>
          </div>
          <div className="metric">
            <div>
              <span>Sales</span>
              <strong>$574.34</strong>
            </div>
            <div className="growth">
              <span className="positive">+23%</span>
              <span>since last month</span>
            </div>
          </div>
          <div className="metric">
            <div>
              <span>Your balance</span>
              <strong>$1,000</strong>
            </div>
            <img src="https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/9200c0f3-ccf2-4980-879f-3f9cdbae1a46" alt="Balance" />
          </div>
          <div className="metric">
            <img src="https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/3ae77ae8-6b5e-4083-9289-173d12681ff0" alt="Tasks" />
            <div>
              <span>New Tasks</span>
              <strong>154</strong>
            </div>
          </div>
          <div className="metric">
            <img src="https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/4de52217-ae03-4860-b3e6-0705c49d9946" alt="Projects" />
            <div>
              <span>Total Projects</span>
              <strong>2935</strong>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section className="tasks-section">
          <div className="projects-card">
            <h3>Projects</h3>
            <div className="projects-stats">
              <div className="stat-item">
                <div className="stat-value">36</div>
                <div className="stat-label">Done</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">12</div>
                <div className="stat-label">Ongoing</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">3</div>
                <div className="stat-label">Canceled</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">4</div>
                <div className="stat-label">Upcoming</div>
              </div>
            </div>
            <div className="view-details">See Details</div>
          </div>

          {/* Payroll Card */}
          <div className="payroll-card">
            <h3>Payrolls</h3>
            <div className="payroll-amount">$2400</div>
            <div className="payroll-date">Due Date APR 05</div>
            <div className="view-details">View details</div>
          </div>

          {/* Tasks Card */}
          <div className="tasks-card">
            <h3>Tasks</h3>
            <div className="task-item">
              <input type="checkbox" className="task-checkbox" defaultChecked />
              <span>Dashboard Builder</span>
            </div>
            <div className="task-item">
              <input type="checkbox" className="task-checkbox" defaultChecked />
              <span>Mobile App Design</span>
            </div>
            <div className="task-item">
              <input type="checkbox" className="task-checkbox" />
              <span>Promotional LP</span>
            </div>
            <div className="view-details">View all Tasks →</div>
          </div>
        </section>

{/* Calendar and Check-in Cards */}
<div style={{
  display: 'flex',
  gap: '20px',
  padding: '0 0px 20px',
  flexWrap: 'nowrap',
  maxWidth: '100%',
}}>
  
  {/* Calendar Card */}
  <div className="calendar-card" style={{ 
    background: 'white', 
    borderRadius: '12px', 
    padding: '20px', 
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    flex: '1',
    minWidth: '400px',
    border: '1px solid #f0f0f0'
  }}>
    <div className="card-title" style={{
      fontSize: '18px',
      fontWeight: '600',
      marginBottom: '16px',
      color: '#333'
    }}>March 2025</div>
    
    <table className="calendar" style={{
      width: '100%',
      borderCollapse: 'collapse',
      textAlign: 'center'
    }}>
      <thead>
        <tr>
          <th style={{ padding: '8px', color: '#666' }}>Mo</th>
          <th style={{ padding: '8px', color: '#666' }}>Tu</th>
          <th style={{ padding: '8px', color: '#666' }}>We</th>
          <th style={{ padding: '8px', color: '#666' }}>Th</th>
          <th style={{ padding: '8px', color: '#666' }}>Fr</th>
          <th style={{ padding: '8px', color: '#666' }}>Sa</th>
          <th style={{ padding: '8px', color: '#666' }}>Su</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style={{ padding: '10px' }}></td>
          <td style={{ padding: '10px' }}></td>
          <td style={{ padding: '10px' }}></td>
          <td style={{ padding: '10px' }}></td>
          <td style={{ padding: '10px' }}>1</td>
          <td style={{ padding: '10px' }}>2</td>
          <td style={{ padding: '10px' }}>3</td>
        </tr>
        <tr>
          <td style={{ padding: '10px' }}>4</td>
          <td style={{ padding: '10px' }}>5</td>
          <td style={{ padding: '10px' }}>6</td>
          <td style={{ padding: '10px' }}>7</td>
          <td style={{ padding: '10px' }}>8</td>
          <td style={{ padding: '10px' }}>9</td>
          <td style={{ padding: '10px' }}>10</td>
        </tr>
        <tr>
          <td style={{ padding: '10px' }}>11</td>
          <td style={{ padding: '10px' }}>12</td>
          <td style={{ padding: '10px' }}>13</td>
          <td style={{ padding: '10px' }}>14</td>
          <td style={{ padding: '10px' }}>15</td>
          <td style={{ padding: '10px' }}>16</td>
          <td style={{ padding: '10px' }}>17</td>
        </tr>
        <tr>
          <td style={{ padding: '10px' }}>18</td>
          <td style={{ padding: '10px' }}>19</td>
          <td style={{ padding: '10px' }}>20</td>
          <td style={{ padding: '10px' }}>21</td>
          <td style={{ padding: '10px' }}>22</td>
          <td style={{ padding: '10px' }}>23</td>
          <td style={{ padding: '10px' }}>24</td>
        </tr>
        <tr>
          <td style={{ padding: '10px' }}>25</td>
          <td style={{ padding: '10px' }}>26</td>
          <td style={{ 
            padding: '10px',
            background: '#4285f4',
            color: 'white',
            borderRadius: '50%',
            width: '24px',
            height: '24px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>27</td>
          <td style={{ padding: '10px' }}>28</td>
          <td style={{ padding: '10px' }}>29</td>
          <td style={{ padding: '10px' }}>30</td>
          <td style={{ padding: '10px' }}>31</td>
        </tr>
      </tbody>
    </table>
    
    <div className="events-section" style={{ marginTop: '20px' }}>
      <div style={{
        fontSize: '14px',
        fontWeight: '600',
        marginBottom: '8px',
        color: '#555'
      }}>Today's Events</div>
      <div className="event-item" style={{
        display: 'flex',
        alignItems: 'center',
        padding: '10px 12px',
        background: '#f8f9fa',
        borderRadius: '8px',
        marginTop: '8px'
      }}>
        <div className="event-time" style={{
          fontWeight: '500',
          color: '#666',
          minWidth: '70px'
        }}>8:00 AM</div>
        <div className="event-title" style={{
          fontWeight: '500'
        }}>Team Meeting</div>
      </div>
    </div>
  </div>

  {/* Check-in Card */}
  <div className="checkin-card" style={{ 
    background: 'white', 
    borderRadius: '12px', 
    padding: '20px', 
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    width: '280px',
    flexShrink: 0,
    border: '1px solid #f0f0f0'
  }}>
    <h3 style={{
      fontSize: '18px',
      fontWeight: '600',
      margin: '0 0 16px 0',
      color: '#333'
    }}>Check-In</h3>
    
    <div style={{ marginBottom: '20px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '8px',
        fontSize: '14px',
        color: '#666'
      }}>
        <span>Today's Hours:</span>
        <span style={{ fontWeight: '500' }}>7h 52m</span>
      </div>
      <div style={{
        height: '6px',
        background: '#e0e0e0',
        borderRadius: '3px',
        overflow: 'hidden'
      }}>
        <div style={{
          width: '82%',
          height: '100%',
          background: '#4285f4',
          borderRadius: '3px'
        }}></div>
      </div>
    </div>
    
    <div className="checkin-row" style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: '#f8f9fa',
      padding: '12px',
      borderRadius: '8px',
      marginBottom: '12px'
    }}>
      <button className="checkin-btn" style={{
        background: '#34a853',
        color: 'white',
        border: 'none',
        padding: '8px 16px',
        borderRadius: '6px',
        fontWeight: '500',
        cursor: 'pointer',
        fontSize: '14px'
      }}>Check-in</button>
      <span style={{
        fontWeight: '500',
        color: '#666',
        fontSize: '14px'
      }}>08:30:44</span>
    </div>
    
    <div className="checkin-row" style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: '#f8f9fa',
      padding: '12px',
      borderRadius: '8px'
    }}>
      <button className="checkout-btn" style={{
        background: '#ea4335',
        color: 'white',
        border: 'none',
        padding: '8px 16px',
        borderRadius: '6px',
        fontWeight: '500',
        cursor: 'pointer',
        fontSize: '14px'
      }}>Check-out</button>
      <span style={{
        fontWeight: '500',
        color: '#666',
        fontSize: '14px'
      }}>16:23:19</span>
    </div>
  </div>
</div>
      </main>
    </div>
  );
};

export default EmployeeDashboard;