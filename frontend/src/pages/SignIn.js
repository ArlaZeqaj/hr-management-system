import React from "react";
import "../styles/SignIn.css"
import { useState } from "react";
import { useNavigate } from 'react-router-dom';

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebaseConfig"; // Adjust the path based on your file structure

import { sendTokenToBackend } from "../services/AuthService";

export default function SignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            await sendTokenToBackend(); // Send token after login

            console.log("User signed in:", userCredential.user);
            navigate("/dashboard"); // 👈 Redirect to Dashboard

            alert("Login successful!");
        } catch (error) {
            console.error("Login error:", error.message);
            alert("Login failed! " + error.message);
        }
    };

    return (
        <div className="sigin-contain">
            <div className="sigin-scroll-view">
                <div className="sigin-row-view">
                    <div className="sigin-column">
                        <div className="sigin-row-view2">
                            <img
                                src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/e9d5f866-ccd5-4f87-b56e-e9d164fb7995"}
                                className="sigin-image"
                                alt="Back"
                            />
                            <span className="sigin-text">{"Back to dashboard"}</span>
                        </div>
                        <div className="sigin-column2">
                            <div className="sigin-column3">
                                <span className="sigin-text2">{"Sign In"}</span>
                                <span className="sigin-text3">{"Enter your email and password to sign in!"}</span>
                            </div>
                            <div className="sigin-column4">
                                <div className="sigin-column5">
                                    <span className="sigin-text4">{"Email*"}</span>
                                    <div className="sigin-view">
                                        <input
                                            type="email"
                                            className="sigin-textInput"
                                            placeholder="mail@cloudx.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="sigin-column6">
                                    <span className="sigin-text4">{"Password*"}</span>
                                    <div className="sigin-row-view3">
                                        <input
                                            type="password"
                                            className="sigin-textInput"
                                            placeholder="Min. 8 characters"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="sigin-row-view4">
                                    <div className="sigin-row-view5">
                                        <div className="sigin-view2">
                                            <input type="checkbox"/>
                                        </div>
                                        <span className="sigin-text7">{"Keep me logged in"}</span>
                                    </div>
                                    <span className="sigin-text8">{"Forget password?"}</span>
                                </div>
                                <button className="sigin-button" onClick={handleLogin}>
                                    <span className="sigin-text9">{"Sign In"}</span>
                                </button>
                            </div>
                        </div>
                        <span className="sigin-text10">{"© 2025 HRCLOUDX UI. All Rights Reserved. Made with love!"}</span>
                    </div>
                    <div className="sigin-column7"
                         style={{
                             backgroundImage: 'url(https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/514880e0-ce96-4b99-af83-1803937c3087)',
                         }}
                    >
                        <img
                            src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/fe4f555a-4d41-45f0-869d-acebc7dd082b"}
                            className="sigin-image4"
                            alt="HRCLOUDX Logo"
                        />
                        <div className="sigin-view3">
                            <div className="sigin-row-view">
                                <span className="sigin-text11">{"HRCLOUDX"}</span>
                            </div>
                        </div>
                        <div className="sigin-view4">
                            <span className="sigin-text12">{"EMPOWERING TEAMS, ANYWHERE"}</span>
                        </div>
                        <div className="sigin-row-view6">
                            <span className="sigin-text13">{"Marketplace"}</span>
                            <span className="sigin-text14">{"License"}</span>
                            <span className="sigin-text15">{"Terms of Use"}</span>
                            <span className="sigin-text16">{"Blog"}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}