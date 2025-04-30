import React, { useEffect, useState } from "react";
import { auth } from "../../config/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import axios from "axios";
import StatCard from "../cards/Statcard";

const EmployeeStadCard = () => {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (user) => {
            if (!user) return;

            const token = await user.getIdToken();

            try {
                const resp = await axios.get("http://localhost:8080/api/employee-stats", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setStats(resp.data);
            } catch (error) {
                console.error("Error fetching stats:", error);
            }
        });

        return () => unsub();
    }, []);

    if (!stats) return <p>Loading stats...</p>;

    return (
        <div className="stats-grid-z">
            <StatCard
                title="Tasks Completed"
                value={stats.tasksCompleted}
                icon="https://img.icons8.com/?size=100&id=zHjuaaCYdoar&format=png&color=000000"
            />
            <StatCard
                title="Trainings Completed"
                value={stats.trainingsCompleted}
                icon="https://img.icons8.com/?size=100&id=89387&format=png&color=000000"
            />
            <StatCard
                title="Leaves Taken"
                value={stats.leavesTaken}
                icon="https://img.icons8.com/?size=100&id=88360&format=png&color=000000"
            />
            <StatCard
                title="Upcoming Events"
                value={stats.upcomingEvents}
                icon="https://img.icons8.com/?size=100&id=116253&format=png&color=000000"
            />
            <StatCard
                title="Certificates Earned"
                value={stats.certificatesEarned}
                icon="https://img.icons8.com/?size=100&id=86736&format=png&color=000000"
            />
            <StatCard
                title="Years at Company"
                value={stats.yearsAtCompany}
                icon="https://img.icons8.com/?size=100&id=86992&format=png&color=000000"
            />
        </div>
    );
};

export default EmployeeStadCard;
