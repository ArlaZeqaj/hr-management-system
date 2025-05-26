import React, { useEffect, useState } from "react";
import { auth } from "../../config/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import axios from "axios";

const CheckInOutCard = () => {
    const [checkInTime, setCheckInTime] = useState("Loading...");
    const [checkOutTime, setCheckOutTime] = useState("Not yet");

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
                    headers: { Authorization: `Bearer ${token}` },
                });

                console.log("✅ Backend Response (Frontend):", response.data);
                setCheckInTime(response.data.checkInTime || "Not yet");

                if (response.data.checkOutTime) {
                    setCheckOutTime(response.data.checkOutTime);
                }
            } catch (error) {
                console.error("🔥 Error fetching check-in time:", error);
                setCheckInTime("Error loading check-in");
            }
        });

        return () => unsubscribe();
    }, []);

    const handleCheckOut = async () => {
        const user = auth.currentUser;
        if (!user) {
            alert("User not authenticated");
            return;
        }

        try {
            const token = await user.getIdToken();

            const response = await axios.post("http://localhost:8080/api/attendance/checkout", {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log("✅ Checkout successful:", response.data);
            setCheckOutTime(response.data.checkOutTime || new Date().toLocaleTimeString());
        } catch (error) {
            console.error("🔥 Error during checkout:", error);
            alert("Checkout failed");
        }
    };

    return (
        <div className="check-card-z">
            <button className="check-btn-z">Check-in</button>
            <button className="check-btn-z" onClick={handleCheckOut}>Check-out</button>
            <div className="check-status-z">
                Checked-in: {checkInTime}<br />
                Checked-out: {checkOutTime}
            </div>
        </div>
    );
};

export default CheckInOutCard;
