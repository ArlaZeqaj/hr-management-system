/*import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
*/
/*
import React from "react";
import EmployeePage from "./EmployeePage";

const App = () => {
    return (
        <div>
            <EmployeePage />
        </div>
    );
};

export default App;
*/
import React from "react";
import "./index.css"
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebaseConfig"; // Adjust the path based on your file structure

import { sendTokenToBackend } from "./AuthService";

export default function SignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
                    await sendTokenToBackend(); // Send token after login

            console.log("User signed in:", userCredential.user);
            alert("Login successful!");
        } catch (error) {
            console.error("Login error:", error.message);
            alert("Login failed! " + error.message);
        }
    };

    return (
        <div className="contain">
            <div className="scroll-view">
                <div className="row-view">
                    <div className="column">
                        <div className="row-view2">
                            <img
                                src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/e9d5f866-ccd5-4f87-b56e-e9d164fb7995"}
                                className="image"
                                alt="Back"
                            />
                            <span className="text">{"Back to dashboard"}</span>
                        </div>
                        <div className="column2">
                            <div className="column3">
                                <span className="text2">{"Sign In"}</span>
                                <span className="text3">{"Enter your email and password to sign in!"}</span>
                            </div>
                            <div className="column4">
                                <div className="column5">
                                    <span className="text4">{"Email*"}</span>
                                    <div className="view">
                                        <input
                                            type="email"
                                            className="textInput"
                                            placeholder="mail@cloudx.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="column6">
                                    <span className="text4">{"Password*"}</span>
                                    <div className="row-view3">
                                        <input
                                            type="password"
                                            className="textInput"
                                            placeholder="Min. 8 characters"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="row-view4">
                                    <div className="row-view5">
                                        <div className="view2">
                                            <input type="checkbox" />
                                        </div>
                                        <span className="text7">{"Keep me logged in"}</span>
                                    </div>
                                    <span className="text8">{"Forget password?"}</span>
                                </div>
                                <button className="button" onClick={handleLogin}>
                                    <span className="text9">{"Sign In"}</span>
                                </button>
                            </div>
                        </div>
                        <span className="text10">{"© 2025 HRCLOUDX UI. All Rights Reserved. Made with love!"}</span>
                    </div>
                    <div className="column7"
                        style={{
                            backgroundImage: 'url(https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/514880e0-ce96-4b99-af83-1803937c3087)',
                        }}
                    >
                        <img
                            src={"https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/fe4f555a-4d41-45f0-869d-acebc7dd082b"}
                            className="image4"
                            alt="HRCLOUDX Logo"
                        />
                        <div className="view3">
                            <div className="row-view">
                                <span className="text11">{"HRCLOUDX"}</span>
                            </div>
                        </div>
                        <div className="view4">
                            <span className="text12">{"EMPOWERING TEAMS, ANYWHERE"}</span>
                        </div>
                        <div className="row-view6">
                            <span className="text13">{"Marketplace"}</span>
                            <span className="text14">{"License"}</span>
                            <span className="text15">{"Terms of Use"}</span>
                            <span className="text16">{"Blog"}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
