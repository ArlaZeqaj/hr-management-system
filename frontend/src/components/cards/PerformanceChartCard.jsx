import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import axios from "axios";
import { auth } from "../../config/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

const PerformanceChartCard = () => {
    const chartRef = useRef(null);
    const chartInstanceRef = useRef(null);
    const [chartLabels, setChartLabels] = useState([]);
    const [chartData, setChartData] = useState([]);

    const getWeekNumber = (dateString) => {
        const date = new Date(dateString);
        const start = new Date(date.getFullYear(), date.getMonth(), 1);
        const day = date.getDate();
        return Math.ceil((day + start.getDay()) / 7); // Week 1–5
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) return console.warn("⚠️ No user");

            try {
                const token = await user.getIdToken();
                const now = new Date();
                const yearMonth = now.toISOString().slice(0, 7); // e.g. "2025-04"

                const resp = await axios.get(
                    `http://localhost:8080/api/schedule/${yearMonth}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                const rawTasks = resp.data.tasks || [];

                // Count completed tasks per week
                const weekCounts = [0, 0, 0, 0, 0]; // Weeks 1 to 5
                rawTasks.forEach(task => {
                    if (task.status === "completed") {
                        const weekNum = getWeekNumber(task.dueDate || task.startDate);
                        if (weekNum >= 1 && weekNum <= 5) {
                            weekCounts[weekNum - 1]++;
                        }
                    }
                });

                setChartLabels(["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"]);
                setChartData(weekCounts);
            } catch (err) {
                console.error("Error loading tasks:", err);
                setChartLabels(["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"]);
                setChartData([0, 0, 0, 0, 0]);
            }
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!chartRef.current || !chartLabels.length) return;
        chartInstanceRef.current?.destroy();
        chartInstanceRef.current = new Chart(chartRef.current, {
            type: "line",
            data: {
                labels: chartLabels,
                datasets: [{
                    label: "Tasks Completed",
                    data: chartData,
                    fill: true,
                    backgroundColor: "rgba(99, 102, 241, 0.1)",
                    borderColor: "rgba(99, 102, 241, 1)",
                    tension: 0.4,
                    pointBackgroundColor: "rgba(99, 102, 241, 1)",
                }],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true, grid: { color: "#f3f4f6" } },
                    x: { grid: { color: "#f3f4f6" } },
                },
            },
        });
    }, [chartLabels, chartData]);

    return (
        <div className="chart-card-z">
            <div className="chart-header-z">
                <h3 className="chart-title-z">Performance</h3>
                <span className="chart-badge-z">This Month</span>
            </div>
            <div style={{ height: "calc(100% - 2rem)" }}>
                <canvas ref={chartRef}></canvas>
            </div>
        </div>
    );

};

export default PerformanceChartCard;
