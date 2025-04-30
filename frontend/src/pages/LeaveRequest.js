import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import EmployeeSidebar from "./Employee/EmployeeSidebar";
import EmployeeHeader from "./Employee/EmployeeHeader";
import EmployeeFooter from "./Employee/EmployeeFooter";
import LeaveRequestPage from "../components/layout/LeaveRequestPage";
//import "../styles/LeaveRequest.css";


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
   <LeaveRequestPage/>);
};

export default LeaveRequest;