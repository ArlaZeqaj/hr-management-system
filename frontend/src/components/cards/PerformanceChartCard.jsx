// src/components/cards/PerformanceChartCard.jsx
import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const PerformanceChartCard = () => {
    const chartRef = useRef(null);
    const chartInstanceRef = useRef(null);

    useEffect(() => {
        const ctx = chartRef.current;

        if (chartInstanceRef.current) {
            chartInstanceRef.current.destroy();
        }

        chartInstanceRef.current = new Chart(ctx, {
            type: "line",
            data: {
                labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                datasets: [
                    {
                        label: "Tasks Completed",
                        data: [5, 7, 4, 6, 9, 3, 8],
                        fill: true,
                        backgroundColor: "rgba(99, 102, 241, 0.1)",
                        borderColor: "rgba(99, 102, 241, 1)",
                        tension: 0.4,
                        pointBackgroundColor: "rgba(99, 102, 241, 1)",
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: "#1e293b",
                        titleColor: "#fff",
                        bodyColor: "#fff",
                    },
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: "#f3f4f6" },
                    },
                    x: {
                        grid: { color: "#f3f4f6" },
                    },
                },
            },
        });

        return () => {
            chartInstanceRef.current?.destroy();
        };
    }, []);

    return (
        <div className="chart-card-z" style={{ height: "320px", padding: "1rem", borderRadius: "0.75rem", backgroundColor: "#ffffff", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
            <div className="chart-header-z" style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <h3 className="chart-title-z" style={{ fontWeight: "600", fontSize: "0.875rem" }}>Performance</h3>
                <span className="chart-badge-z" style={{ fontSize: "0.75rem", backgroundColor: "#f3f4f6", color: "#6b7280", padding: "0.125rem 0.5rem", borderRadius: "0.25rem" }}>This month</span>
            </div>
            <div style={{ height: "calc(100% - 2rem)" }}>
                <canvas ref={chartRef}></canvas>
            </div>
        </div>
    );
};

export default PerformanceChartCard;
