import { auth } from "../config/firebaseConfig"; // Import Firebase auth
import axios from "axios"; // Install axios if not installed: npm install axios

export const sendTokenToBackend = async () => {
    try {
        const user = auth.currentUser;
        if (user) {
            const token = await user.getIdToken(); // Get Firebase token
            console.log("Firebase Token:", token);

            // Send token to Spring Boot API
            const response = await axios.post(
                "http://localhost:8080/api/auth/verify", // Change to your backend URL
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Send token in Authorization header
                    },
                }
            );

            console.log("Backend Response:", response.data);
        } else {
            console.log("No user signed in.");
        }
    } catch (error) {
        console.error("Error getting token or sending request:", error);
    }
};
