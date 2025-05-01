import React, { useState } from "react";
import ProjectsCard from "../cards/ProjectsCard";
import PayrollCard from "../cards/PayrollCard";
import ScheduleCard from "../cards/ScheduleCard";
import CheckInOutCard from "../cards/CheckInOutCard";
import CalendarCard from "../cards/CalendarCard";
import ScheduleOverviewCard from "../cards/ScheduleOverviewCard";
import PerformanceChartCard from "../cards/PerformanceChartCard";
import TasksCard from "../cards/TasksCard";
import '../../styles/Employee.css';
import EmployeeFooter from "../../pages/Employee/EmployeeFooter";
import EmployeeSidebar from "../../pages/Employee/EmployeeSidebar";
import EmployeeHeader from "../../pages/Employee/EmployeeHeader";
import { useLocation, useNavigate } from "react-router-dom";
import EmployeeStadCard from "../cards/EmployeeStadCard";

const LayoutWrapper = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [showPerformance, setShowPerformance] = useState(false);
    const [showFacts, setShowFacts] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null); // shared state
    const [randomFact, setRandomFact] = useState("");

    // Add dark mode state here to share between components
    const [darkMode, setDarkMode] = useState(() => {
        const savedMode = localStorage.getItem("darkMode");
        return savedMode ? JSON.parse(savedMode) : false;
    });
    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };


    const funFacts = [
        "Honey never spoils. Archaeologists have found pots of it in ancient tombs still edible.",
        "Bananas are berries, but strawberries aren’t.",
        "A day on Venus is longer than a year on Venus.",
        "Octopuses have three hearts and blue blood.",
        "Wombat poop is cube-shaped.",
        "There are more stars in the universe than grains of sand on Earth.",
        "Sharks are older than trees.",
        "Oxford University is older than the Aztec Empire.",
        "A group of flamingos is called a 'flamboyance'.",
        "You can't hum while holding your nose.",
        "Cows have best friends and can get stressed when separated.",
        "The Eiffel Tower can grow over 6 inches during summer.",
        "The unicorn is Scotland’s national animal.",
        "An octopus can taste with its arms.",
        "Sloths can hold their breath longer than dolphins.",
        "There’s a basketball court on the top floor of the U.S. Supreme Court building.",
        "A jiffy is an actual unit of time (1/100th of a second).",
        "Elephants can’t jump.",
        "The dot over the 'i' and 'j' is called a 'tittle'.",
        "Koalas have fingerprints almost identical to humans.",
        "Cats can’t taste sweetness.",
        "Avocados are toxic to birds.",
        "A snail can sleep for three years.",
        "The moon has moonquakes.",
        "Humans share about 60% of their DNA with bananas."
    ];

    const handleShowFact = () => {
        const index = Math.floor(Math.random() * funFacts.length);
        setRandomFact(funFacts[index]);
        setShowFacts(true);
    };
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

    return (
        <div className={`layout-wrapper-z ${darkMode ? "dark-theme" : ""}`}>
            <EmployeeSidebar
                activeMenuItem={activeMenuItem}
                handleMenuItemClick={handleMenuItemClick}
                darkMode={darkMode}  // Pass darkMode prop to Sidebar
            />

            <main className="main-content-z">
                <EmployeeHeader
                    activeMenuItem={activeMenuItem}
                    darkMode={darkMode}
                    toggleDarkMode={toggleDarkMode}  // Pass toggle function to Header
                />

                <div className="stad-section-z">
                    <EmployeeStadCard />
                </div>

                <div className="dashboard-grid-z">
                    <div className="left-col-z">
                        <ProjectsCard />
                        <PayrollCard />
                        <CheckInOutCard />
                        <button className="performance-toggle-z" onClick={() => setShowPerformance(true)}>
                            see Performance
                        </button>
                    </div>

                    <div className="calendar-fullrow-z">
                        <CalendarCard onDateSelect={setSelectedDate} />
                    </div>

                    <div className="middle-column-z">
                        <TasksCard />
                    </div>

                    <div className="right-col-z">
                        <ScheduleCard selectedDate={selectedDate} />
                        <ScheduleOverviewCard selectedDate={selectedDate} />
                        <button className="fact-toggle-z" onClick={handleShowFact}>
                            see Funfact &gt;
                        </button>

                    </div>
                </div>

                {/* Performance popup */}
                {showPerformance && (
                    <div className="performance-popup-z">
                        <PerformanceChartCard />
                        <button onClick={() => setShowPerformance(false)}>Close</button>
                    </div>
                )}

                {showFacts && (
                    <div className="fact-popup-z">
                        <p>{randomFact}</p>
                        <button onClick={() => setShowFacts(false)}>Close</button>
                    </div>
                )}

                <EmployeeFooter />
            </main>
        </div>
    );
};

export default LayoutWrapper;
