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

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) return console.warn("⚠️ No user");

            try {
                const token = await user.getIdToken();
                const resp = await axios.get(
                    "http://localhost:8080/api/performance/monthly",
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                // Expecting: [{ week:1, tasks:12 }, … up to week 5]
                const weekly = resp.data;
                const labels = weekly.map((w) => `Week ${w.week}`);
                const data = weekly.map((w) => w.tasks);

                setChartLabels(labels);
                setChartData(data);
            } catch (err) {
                console.error("Error loading performance:", err);
                setChartLabels(["Week 1","Week 2","Week 3","Week 4","Week 5"]);
                setChartData([0,0,0,0,0]);
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
        <div
            className="chart-card-z"
            style={{
                height: "320px",
                padding: "1rem",
                borderRadius: "0.75rem",
                backgroundColor: "#fff",
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
            }}
        >
            <div
                className="chart-header-z"
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "0.5rem",
                }}
            >
                <h3 className="chart-title-z" style={{ fontWeight: 600, fontSize: "0.875rem" }}>
                    Performance
                </h3>
                <span
                    className="chart-badge-z"
                    style={{
                        fontSize: "0.75rem",
                        backgroundColor: "#f3f4f6",
                        color: "#6b7280",
                        padding: "0.125rem 0.5rem",
                        borderRadius: "0.25rem",
                    }}
                >
          This Month
        </span>
            </div>
            <div style={{ height: "calc(100% - 2rem)" }}>
                <canvas ref={chartRef}></canvas>
            </div>
        </div>
    );
};

export default PerformanceChartCard;
