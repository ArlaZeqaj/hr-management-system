import React, { useState } from "react";
import "../styles/LeaveRequest.css";

const LeaveRequest = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [leaveType, setLeaveType] = useState('vacation');
  const [currentStep, setCurrentStep] = useState(0); // 0: Not submitted, 1: Submitted, 2: In Review, 3: Approved/Rejected
  const [submittedRequest, setSubmittedRequest] = useState(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Add this leave types array
  const leaveTypes = [
    { value: 'vacation', label: 'Vacation' },
    { value: 'leave without pay', label: 'Leave Without Pay' },
    { value: 'medical leave', label: 'Medical Leave' },
    { value: 'remote', label: 'Remote' },
    { value: 'pregnancy leave', label: 'Pregnancy Leave' },
    { value: 'special leave', label: 'Special Leave' }
  ];
  const [leaveTypeColors] = useState({
    'vacation': '#38B2AC', // Teal
    'leave without pay': '#F6AD55', // Orange
    'medical leave': '#F687B3', // Pink
    'remote': '#9F7AEA', // Purple
    'pregnancy leave': '#68D391', // Green
    'special leave': '#4299E1' // Blue
  });

  // Sample events data
  const events = [
    { id: 1, title: "Remote", day: 10, color: "purple" },
    { id: 2, title: "Vacation", day: 17, color: "teal" },
    { id: 3, title: "Medical Leave", day: 23, color: "pink" },
    { id: 4, title: "Leave Without Pay", day: 12, color: "orange" },
    { id: 5, title: "Pregnancy Leave", day: 19, color: "green" }
  ];

  // Get current month and year
  const month = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();

  // Generate days for the current month
  const daysInMonth = new Date(year, currentDate.getMonth() + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="projects-page-container">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <div className="logo-container">
            <span className="logo">{sidebarCollapsed ? 'HX' : 'HRCLOUDX'}</span>
          </div>
        </div>

        <div className="sidebar-menu">
          <div className="menu-item">
            <img src="https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/e5cdd104-7027-4111-b9b0-203ead13153a" className="menu-icon" alt="Dashboard" />
            <span>Dashboard</span>
          </div>
          <div className="menu-item">
            <img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Hvb8f3Xbra/z06o8o00_expires_30_days.png" className="menu-icon" alt="Profile" />
            <span>Profile</span>
          </div>
          <div className="menu-item">
            <img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Hvb8f3Xbra/rz3od6et_expires_30_days.png" className="menu-icon" alt="Projects" />
            <span>Projects</span>
          </div>
          <div className="menu-item active">
            <img src="https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/6980a5d3-86da-498c-89ac-e7776a1a050a" className="menu-icon" alt="Leave Request" />
            <span>Leave Request</span>
          </div>
        </div>

        {/* Toggle button moved to bottom */}
        <div className="sidebar-footer">
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            {sidebarCollapsed ? (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 18L18 6M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>Collapse</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`projects-main-content ${sidebarCollapsed ? 'collapsed' : ''}`}>
        {/* Header Section */}
        <div className="header-section">
          <div className="breadcrumbs">
            <span>Pages / Leave Request</span>
            <h1>Leave Request</h1>
          </div>
          <div className="user-profile">
            <img
              src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Hvb8f3Xbra/o7m0g9od_expires_30_days.png"
              alt="User"
            />
            <span>Doe, Jane</span>
            <img
              src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Hvb8f3Xbra/6afz9mub_expires_30_days.png"
              alt="Menu"
            />
          </div>
        </div>

        {/* Calendar Container */}
        <div className="calendar-container">
          {/* Header */}
          <div className="calendar-header">
            <div className="month-selector">
              <button className="nav-button" onClick={goToPreviousMonth}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 18L9 12L15 6" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <h1>{month} {year}</h1>
              <button className="nav-button" onClick={goToNextMonth}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 18L15 12L9 6" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            <div className="view-options">
              <button className="view-button">Day</button>
              <button className="view-button">Week</button>
              <button className="view-button active">Month</button>
            </div>
          </div>

          {/* Leave Request Form */}
          <div className="leave-request-form">
            <h2>Request Leave</h2>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="start-date">Start Date</label>
                <input
                  type="date"
                  id="start-date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="end-date">End Date</label>
                <input
                  type="date"
                  id="end-date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="leave-type">Type of Leave</label>
                <select
                  id="leave-type"
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value)}
                >
                  {leaveTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              <button
                className="submit-button"
                onClick={() => {
                  if (!startDate || !endDate) {
                    alert("Please select both start and end dates");
                    return;
                  }

                  // Save the submitted request details
                  const request = {
                    startDate,
                    endDate,
                    leaveType: leaveTypes.find(lt => lt.value === leaveType)?.label || leaveType,
                    submittedAt: new Date().toLocaleString()
                  };

                  setSubmittedRequest(request);
                  setCurrentStep(1);

                  // Simulate review process
                  setTimeout(() => setCurrentStep(2), 1500);
                  // Simulate final decision
                  setTimeout(() => setCurrentStep(3), 3000);
                }}
              >
                Submit Request
              </button>
            </div>
          </div>

          {/* Leave Types Table*/}
          <div className="leave-types-card">
            <h3 className="leave-types-title"> Leave Types & Colors</h3>
            <div className="leave-types-grid">
              {leaveTypes.map((type) => (
                <div key={type.value} className="leave-type-item">
                  <span
                    className="leave-color-dot"
                    style={{ backgroundColor: leaveTypeColors[type.value] }}
                  />
                  <span className="leave-type-name">{type.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Status bar*/}
          {currentStep > 0 && (
            <div className="status-stepper">
              <div className="step-details">
                {submittedRequest && (
                  <div className="request-details">
                    <div className="detail-row">
                      <span className="detail-label">Type:</span>
                      <span>{submittedRequest.leaveType}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Dates:</span>
                      <span>{submittedRequest.startDate} to {submittedRequest.endDate}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Submitted:</span>
                      <span>{submittedRequest.submittedAt}</span>
                    </div>
                  </div>
                )}
              </div>
              <div className="step-container">
                <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
                  <div className="step-circle">1</div>
                  <div className="step-label">Submitted</div>
                </div>
                <div className={`step-connector ${currentStep >= 2 ? 'active' : ''}`}></div>
                <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
                  <div className="step-circle">2</div>
                  <div className="step-label">In Review</div>
                </div>
                <div className={`step-connector ${currentStep >= 3 ? 'active' : ''}`}></div>
                <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
                  <div className="step-circle">3</div>
                  <div className="step-label">{currentStep === 3 ? 'Approved' : 'Decision'}</div>
                </div>
              </div>
            </div>
          )}

          {/* Calendar Grid */}
          <div className="calendar-grid">
            {/* Day headers */}
            <div className="day-header">Sun</div>
            <div className="day-header">Mon</div>
            <div className="day-header">Tue</div>
            <div className="day-header">Wed</div>
            <div className="day-header">Thu</div>
            <div className="day-header">Fri</div>
            <div className="day-header">Sat</div>

            {/* Calendar cells */}
            {days.map(day => {
              const dayEvents = events.filter(event => event.day === day);
              return (
                <div
                  key={day}
                  className={`calendar-cell ${dayEvents.length > 0 ? 'has-events' : ''}`}
                  onMouseEnter={(e) => {
                    if (dayEvents.length > 0) {
                      setSelectedEvent(dayEvents[0]);
                      setHoverPosition({
                        x: e.clientX,
                        y: e.clientY
                      });
                    }
                  }}
                  onMouseLeave={() => setSelectedEvent(null)}
                >
                  <div className="calendar-cell-content">
                    <div className="day-number">{day}</div>
                    {dayEvents.map(event => (
                      <div
                        key={event.id}
                        className={`event-pill ${event.color}`}
                      >
                        {event.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          {selectedEvent && (
            <div
              className="event-sidebar"
              style={{
                position: 'fixed',
                left: `${hoverPosition.x + 20}px`,
                top: `${hoverPosition.y + 20}px`,
                transform: hoverPosition.x > window.innerWidth / 2
                  ? 'translateX(-100%)'
                  : 'none'
              }}
            >
              <div className="sidebar-header">
                <h3>Leave Details</h3>
              </div>
              <div className="event-details">
                <h4>{selectedEvent.title}</h4>
                <p><strong>Date:</strong> {month} {selectedEvent.day}, {year}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="footer">
          <span>© 2024 HRCloudX. All Rights Reserved.</span>
          <div className="footer-links">
            <span>Marketplace</span>
            <span>License</span>
            <span>Terms of Use</span>
            <span>Blog</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveRequest;