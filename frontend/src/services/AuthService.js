import { auth } from "../config/firebaseConfig";
import axios from "axios";

export const sendTokenToBackend = async () => {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error("No user is signed in");

        const token = await user.getIdToken();
        console.log("🔥 Sending token to backend:", token); // Log it for debugging

        const response = await axios.post(
            "http://localhost:8080/api/auth/login",
            { idToken: token },
            {
                headers: { "Content-Type": "application/json" }
            }
        );

        return response.data;
    } catch (error) {
        console.error("❌ AuthService error:", error.message);
        throw error;
    }
};