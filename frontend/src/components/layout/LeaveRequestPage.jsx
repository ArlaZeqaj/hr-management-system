import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from 'react-router-dom';import { auth } from '../../config/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import LeaveForm from '../../components/cards/leaveRequestEmployee/LeaveForm';
import LeaveTypesCard from '../../components/cards/leaveRequestEmployee/LeaveTypesCard';
import StatusStepper from '../../components/cards/leaveRequestEmployee/StatusStepper';
import CalendarGrid from '../../components/cards/leaveRequestEmployee/CalendarGrid';
import EventSidebar from '../../components/cards/leaveRequestEmployee/EventSidebar';
import EmployeeSidebar from '../../pages/Employee/EmployeeSidebar';
import EmployeeHeader from '../../pages/Employee/EmployeeHeader';
import EmployeeFooter from '../../pages/Employee/EmployeeFooter';
import '../../styles/LeaveRequest.css';
import "../../pages/Employee/EmployeeSidebar.css";
import "../../pages/Employee/EmployeeHeader.css";
import "../../pages/Employee/EmployeeFooter.css";
import axios from "axios";
const LeaveRequestPage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [uid, setUid] = useState(null);
    const [events, setEvents] = useState([]);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [submittedRequest, setSubmittedRequest] = useState(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });

    const getActiveMenuItem = () => {
        const path = location.pathname;
        if (path.includes('/employee/dashboard')) return 'Dashboard';
        if (path.includes('/employee/profile')) return 'Profile';
        if (path.includes('/projects')) return 'Projects';
        if (path.includes('/leave-request')) return 'Leave Request';
        if (path.includes('/documents')) return 'Documents';
        return 'Dashboard';
    };
    const [activeMenuItem, setActiveMenuItem] = useState(getActiveMenuItem());
    const handleMenuItemClick = (menuItem) => {
        setActiveMenuItem(menuItem);
        switch (menuItem) {
            case 'Dashboard': navigate('/employee/dashboard'); break;
            case 'Profile': navigate('/employee/profile'); break;
            case 'Projects': navigate('/projects'); break;
            case 'Leave Request': navigate('/leave-request'); break;
            case 'Documents': navigate('/documents'); break;
            default: navigate('/employee/dashboard');
        }
    };
    // Month navigation
    const goToPreviousMonth = () => {
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    };
    const goToNextMonth = () => {
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    };

    // Load existing leave requests
    useEffect(() => {
        onAuthStateChanged(auth, async user => {
            if (!user) return;
             setUid(user.uid);

            const token = await user.getIdToken();
            const resp  = await axios.get('/api/leaves', {
                headers: { Authorization: `Bearer ${token}` }
            });
            // map API data → calendar “events”
            setEvents(resp.data.map(req => ({
                id:         req.id,
                title:      req.leaveType,
                day:        new Date(req.startDate).getDate(),
                color:      req.leaveType.replace(/\s+/g,'').toLowerCase(),
                startDate:  req.startDate,
                endDate:    req.endDate,
                status:     req.status,
                submittedAt:req.submittedAt
            })));
        });
    }, []);

    // Handle new submission
    const handleSubmit = async (request) => {
        console.log('Page.handleSubmit got', request, 'uid=', uid);
        if (!uid) return;

        try {
            const token = await auth.currentUser.getIdToken();
            const resp = await axios.post(
                '/api/leaves',
                request,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const created = resp.data;

            // Determine the colors for this leaveType
            const typeColors = {
                vacation:         { bg: '#d1faf5', text: '#319795' },
                leavewithoutpay:  { bg: '#ffedd5', text: '#dd6b20' },
                medicalleave:     { bg: '#fce7f3', text: '#be185d' },
                remote:           { bg: '#ede9fe', text: '#6b46c1' },
                pregnancyleave:   { bg: '#dcfce7', text: '#22543d' },
                specialleave:     { bg: '#dbeafe', text: '#1e40af' }
            };
            const key = created.leaveType.replace(/\s+/g, '').toLowerCase();
            const { bg: bgColor, text: textColor } = typeColors[key] || { bg: '#bfdbfe', text: '#1e3a8a' };

            // Build the new event object
            const newEvent = {
                id:         created.id,
                title:      created.leaveType,
                day:        new Date(created.startDate).getDate(),
                startDate:  created.startDate,
                endDate:    created.endDate,
                status:     created.status,
                submittedAt:created.submittedAt,
                bgColor,
                textColor
            };

            // Update UI state
            setSubmittedRequest(created);
            setCurrentStep(1);
            setEvents(prev => [...prev, newEvent]);

            // Advance the stepper
            setTimeout(() => setCurrentStep(2), 1500);
            setTimeout(() => setCurrentStep(3), 3000);

        } catch (e) {
            console.error('Submit failed', e);
            alert('Failed to submit leave request');
        }
    };




    const monthLabel = currentDate.toLocaleString('default', { month: 'long' });
    const yearLabel = currentDate.getFullYear();

    return (
        <div className="page-container-lr">
            <EmployeeSidebar
                activeMenuItem={activeMenuItem}
                handleMenuItemClick={handleMenuItemClick}
            />            <div className="main-content-lr">
                <EmployeeHeader />

                <div className="calendar-container-lr">
                    <div className="calendar-header-lr">
                        <div className="month-selector">
                            <button className="nav-button" onClick={goToPreviousMonth}>‹</button>
                            <h1>{monthLabel} {yearLabel}</h1>
                            <button className="nav-button" onClick={goToNextMonth}>›</button>
                        </div>
                        <div className="view-options">
                            <button className="view-button">Day</button>
                            <button className="view-button">Week</button>
                            <button className="view-button active">Month</button>
                        </div>
                    </div>

                    <LeaveForm onSubmit={handleSubmit} />
                    <LeaveTypesCard />

                    {currentStep > 0 && (
                        <StatusStepper
                            currentStep={currentStep}
                            submittedRequest={submittedRequest}
                        />
                    )}

                    <CalendarGrid
                        monthDate={currentDate}
                        events={events}
                        onHover={(evt, pos) => {
                            setSelectedEvent(evt);
                            setHoverPosition(pos);
                        }}
                    />

                    {selectedEvent && (
                        <EventSidebar
                            event={selectedEvent}
                            position={hoverPosition}
                        />
                    )}
                </div>

                <EmployeeFooter />
            </div>
        </div>
    );
};

export default LeaveRequestPage;

