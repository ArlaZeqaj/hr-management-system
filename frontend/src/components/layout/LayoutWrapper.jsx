// src/components/layout/LayoutWrapper.jsx
import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import StatCard from "../cards/Statcard";
import ProjectsCard from "../cards/ProjectsCard";
import PayrollCard from "../cards/PayrollCard";
import ScheduleCard from "../cards/ScheduleCard";
import CheckInOutCard from "../cards/CheckInOutCard";
import CalendarCard from "../cards/CalendarCard";
import ScheduleOverviewCard from "../cards/ScheduleOverviewCard";
import PerformanceChartCard from "../cards/PerformanceChartCard";
import TasksCard from "../cards/TasksCard";
import '../../styles/Employee.css';

const LayoutWrapper = () => {
    return (
        <div className="layout-wrapper-z">
            <Sidebar />
            <main className="main-content-z">
                <Header />

                {/* Top Summary Cards */}
                <div className="grid-six-z">
                    <StatCard title="Earnings" value="$350.4" />
                    <StatCard title="Upcoming Event" value="conference" />
                    <StatCard title="Training Progress" value="3/5" />
                    <StatCard title="Leave Requests" flag />
                    <StatCard title="My Feedback" value="154" />
                    <StatCard title="Total Projects" value="2935" />
                </div>

                {/* Main Grid */}
                <div className="grid-twelve-z">
                    <div className="col-three-z stack">
                        <ProjectsCard />
                        <PayrollCard />
                    </div>

                    <div className="col-three-z stack">
                        <ScheduleCard />
                        <CheckInOutCard />
                    </div>

                    <div className="col-three-z">
                        <CalendarCard />
                    </div>

                    <div className="col-three-z">
                        <ScheduleOverviewCard />
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="grid-two-z">
                    <PerformanceChartCard />
                    <TasksCard />
                </div>
            </main>
        </div>
    );
};

export default LayoutWrapper;
