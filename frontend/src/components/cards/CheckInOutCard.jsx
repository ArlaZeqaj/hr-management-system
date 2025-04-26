import React, { useEffect, useState } from "react";
import { auth } from "../../config/firebaseConfig";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import axios from "axios";

const CheckInOutCard = () => {
    const [checkInTime, setCheckInTime] = useState("Loading...");

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                console.error("❌ onAuthStateChanged: No user authenticated");
                setCheckInTime("Not logged in");
                return;
            }

            try {
                const token = await user.getIdToken();
                console.log("🔑 Firebase Token (Frontend):", token);

                const response = await axios.get("http://localhost:8080/api/attendance/checkin-time", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                console.log("✅ Backend Response (Frontend):", response.data);
                setCheckInTime(response.data.checkInTime || "Not yet");
            } catch (error) {
                console.error("🔥 Error fetching check-in time:", error);
                setCheckInTime("Error loading check-in");
            }
        });

        return () => unsubscribe(); // Cleanup
    }, []);

    return (
        <div className="check-card-z">
            <button className="check-btn-z">Check-in</button>
            <button className="check-btn-z">Check-out</button>
            <div className="check-status-z">
                Checked-in: {checkInTime}<br />
                Checked-out: 16:23:19
            </div>
        </div>
    );
};

export default CheckInOutCard;
