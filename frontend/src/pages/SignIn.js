import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebaseConfig";
import { sendTokenToBackend } from "../services/AuthService";
import "../styles/SignIn.css";

export default function SignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            // 1. Firebase login
          //  const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const { user } = await signInWithEmailAndPassword(auth, email, password);
            const token = await user.getIdToken(); // ✅ get token

            // 2. Send token to backend, get role info
            const backendResponse = await sendTokenToBackend(token); // ✅ send it

            console.log("Backend response:", backendResponse);

            // 3. Store user info
            localStorage.setItem("uid", backendResponse.uid);
            localStorage.setItem("email", backendResponse.email);
            localStorage.setItem("role", backendResponse.role);

            // 4. Navigate based on role
            if (backendResponse.role === "admin") {
                navigate("/admin/dashboard");
            } else if (backendResponse.role === "employee") {
                navigate("/employee/dashboard");
            } else {
                setError("User role is not recognized.");
            }

        } catch (error) {
            console.error("Login error:", error.message);
            setError(error.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="sigin-contain">
            <div className="sigin-scroll-view">
                <div className="sigin-column">
                    <div className="sigin-row-view" style={{ cursor: 'pointer' }} onClick={() => navigate(-1)}>
                        <img
                            src="https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/e9d5f866-ccd5-4f87-b56e-e9d164fb7995"
                            className="sigin-image"
                            alt="Back arrow icon"
                        />
                        <span className="sigin-text">Back to dashboard</span>
                    </div>

                    <div className="sigin-column2">
                        <div className="sigin-column3">
                            <h1 className="sigin-text2">Sign In</h1>
                            <p className="sigin-text3">Enter your email and password to sign in!</p>
                        </div>

                        {error && <div className="sigin-error">{error}</div>}

                        <form className="sigin-column4" onSubmit={handleLogin}>
                            <div className="sigin-column5">
                                <label className="sigin-text4">Email*</label>
                                <div className="sigin-view">
                                    <input
                                        type="email"
                                        placeholder="mail@cloudx.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            <div className="sigin-column6">
                                <label className="sigin-text4">Password*</label>
                                <div className="sigin-row-view3">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Min. 8 character"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        minLength="8"
                                        disabled={loading}
                                    />
                                    <span
                                        className="password-toggle"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? "Hide" : "Show"}
                                    </span>
                                </div>
                            </div>

                            <div className="sigin-row-view4">
                                <div className="sigin-row-view">
                                    <div className="sigin-view2">
                                        <input
                                            type="checkbox"
                                            checked={rememberMe}
                                            onChange={(e) => setRememberMe(e.target.checked)}
                                            disabled={loading}
                                        />
                                    </div>
                                    <span className="sigin-text7">Keep me logged in</span>
                                    <a href="/forgot-password" className="sigin-text8">Forgot password?</a>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="sigin-button"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <svg className="sigin-spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12 2V6" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                            <path d="M12 18V22" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                            <path d="M4.93 4.93L7.76 7.76" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                            <path d="M16.24 16.24L19.07 19.07" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                            <path d="M2 12H6" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                            <path d="M18 12H22" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                            <path d="M4.93 19.07L7.76 16.24" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                            <path d="M16.24 7.76L19.07 4.93" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                        </svg>
                                        <span className="sigin-text9">Signing In...</span>
                                    </>
                                ) : (
                                    <span className="sigin-text9">Sign In</span>
                                )}
                            </button>
                        </form>
                    </div>

                    <p className="sigin-text10" style={{ left: '150px', bottom: '30px' }}>
                        © 2025 HRCLOUDX UI. All Rights Reserved. Made with love!
                    </p>
                </div>
            </div>

            <div className="sigin-column7"
                 style={{
                     backgroundImage: 'url(https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/514880e0-ce96-4b99-af83-1803937c3087)',
                 }}
            >
                <img
                    src="https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/fe4f555a-4d41-45f0-869d-acebc7dd082b"
                    className="sigin-image4"
                    alt="HRCLOUDX Company Logo"
                />

                <div className="sigin-view3">
                    <div className="sigin-row-view">
                        <span className="sigin-text11">HRCLOUDX</span>
                    </div>
                </div>

                <div className="sigin-view4">
                    <span className="sigin-text12">EMPOWERING TEAMS, ANYWHERE</span>
                </div>

                <div className="sigin-row-view6">
                    <a href="/marketplace">Marketplace</a>
                    <a href="/license">License</a>
                    <a href="/terms">Terms of Use</a>
                    <a href="/blog">Blog</a>
                </div>
            </div>
        </div>
    );
}
