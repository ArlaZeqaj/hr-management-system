import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import EmployeeSidebar from "./Employee/EmployeeSidebar";
import EmployeeHeader from "./Employee/EmployeeHeader";
import EmployeeFooter from "./Employee/EmployeeFooter";
import "../styles/LeaveRequest.css";
import "./Employee/EmployeeSidebar.css";
import "./Employee/EmployeeHeader.css";
import "./Employee/EmployeeFooter.css";

const LeaveRequest = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Set active menu item based on current route
  const getActiveMenuItem = () => {
    const path = location.pathname;
    if (path.includes('/employee/dashboard')) return 'Dashboard';
    if (path.includes('/employee/profile')) return 'Profile';
    if (path.includes('/projects')) return 'Projects';
    if (path.includes('/leave-request')) return 'Leave Request';
    if (path.includes('/documents')) return 'Documents';
    return 'Dashboard'; // default
  };

  const [activeMenuItem, setActiveMenuItem] = useState(getActiveMenuItem());
  const handleMenuItemClick = (menuItem) => {
    setActiveMenuItem(menuItem);
    switch (menuItem) {
      case 'Dashboard':
        navigate('/employee/dashboard');
        break;
      case 'Profile':
        navigate('/employee/profile');
        break;
      case 'Projects':
        navigate('/projects');
        break;
      case 'Leave Request':
        navigate('/leave-request');
        break;
      case 'Documents':
        navigate('/documents');
        break;

      default:
        navigate('/employee/dashboard');
    }
  };


  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [leaveType, setLeaveType] = useState('vacation');
  const [currentStep, setCurrentStep] = useState(0); // 0: Not submitted, 1: Submitted, 2: In Review, 3: Approved/Rejected
  const [submittedRequest, setSubmittedRequest] = useState(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });

  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode ? JSON.parse(savedMode) : false;
  });
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState({
    "Item update notifications": false,
    "Item comment notifications": false,
    "Buyer review notifications": false,
    "Rating reminders notifications": true,
    "Meetups near you notifications": false,
    "Company news notifications": false,
    "New launches and projects": false,
    "Monthly product changes": false,
    "Subscribe to newsletter": false,
    "Email me when someone follows me": false,
  });

  const notificationRef = useRef(null);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-theme");
    } else {
      document.body.classList.remove("dark-theme");
    }
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target) &&
        !event.target.closest('.profile-button')) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleNotification = (notification) => {
    setNotifications(prev => ({
      ...prev,
      [notification]: !prev[notification]
    }));
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
    <div className="page-container-lr">
      {/* Sidebar */}
      <EmployeeSidebar
        activeMenuItem={activeMenuItem}
        handleMenuItemClick={handleMenuItemClick}
      />

      {/* Main Content */}
      <div className="main-content-lr">
        {/* Header Section */}
        <EmployeeHeader
          activeMenuItem={activeMenuItem}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          notifications={notifications}
          toggleNotification={toggleNotification}
        />

        {/* Calendar Container */}
        <div className="calendar-container-lr">
          {/* Calendar Header */}
          <div className="calendar-header-lr">
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
        <EmployeeFooter />
      </div>
    </div>
  );
};

export default LeaveRequest;