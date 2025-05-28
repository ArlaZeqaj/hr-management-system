import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/hrcloudx-logo.png";
import "../styles/ResetPassword.css";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);
  const [emailValid, setEmailValid] = useState(null);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    if (value === "") {
      setEmailValid(null);
    } else {
      setEmailValid(validateEmail(value));
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setMessage({ text: "Please enter a valid email address", type: "error" });
      setEmailValid(false);
      return;
    }

    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const res = await fetch(
        `http://localhost:3000/api/auth/reset-password?email=${email}`,
        { method: "POST" }
      );
      const text = await res.text();
      setMessage({ text: text, type: "success" });
    } catch (err) {
      console.error(err);
      setMessage({ text: "Something went wrong! Please try again.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-contain">
      <div className="reset-scroll-view">
        <div
          className="reset-row-view"
          style={{ cursor: "pointer" }}
          onClick={() => navigate(-1)}
        >
          <img
            src="https://img.icons8.com/?size=100&id=85498&format=png&color=a3aed0"
            className="reset-image"
            alt="Back arrow icon"
          />
          <span className="reset-text">Back to sign in</span>
        </div>
        <div className="reset-column">
          <div className="reset-column2">
            <div className="reset-column3">
              <h1 className="reset-text2">Reset Password</h1>
              <p className="reset-text3">
                Enter your email to receive a reset link
              </p>
            </div>

            {message.text && (
              <div className={`reset-message ${message.type}`}>
                {message.type === 'success' ? (
                  <svg className="reset-icon" viewBox="0 0 24 24">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                  </svg>
                ) : (
                  <svg className="reset-icon" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                  </svg>
                )}
                <span>{message.text}</span>
              </div>
            )}

            <form className="reset-column4" onSubmit={handleReset}>
              <div className="reset-column5">
                <label className="reset-text4">Email</label>
                <div className={`reset-view ${emailValid === true ? 'valid' : emailValid === false ? 'invalid' : ''}`}>
                  <input
                    type="email"
                    placeholder="mail@example.com"
                    value={email}
                    onChange={handleEmailChange}
                    required
                    disabled={loading}
                    className="reset-input"
                  />
                </div>
              </div>

              <button type="submit" className="reset-button" disabled={loading}>
                {loading ? (
                  <>
                    <svg
                      className="reset-spinner"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 2V6"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <path
                        d="M12 18V22"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <path
                        d="M4.93 4.93L7.76 7.76"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <path
                        d="M16.24 16.24L19.07 19.07"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <path
                        d="M2 12H6"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <path
                        d="M18 12H22"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <path
                        d="M4.93 19.07L7.76 16.24"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <path
                        d="M16.24 7.76L19.07 4.93"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="reset-text9">Sending...</span>
                  </>
                ) : (
                  <span className="reset-text9">Send Reset Link</span>
                )}
              </button>
            </form>
          </div>
        </div>
        <footer className="reset-footer">
          © 2025 HRCLOUDX UI. All Rights Reserved. Made with love!
        </footer>
      </div>

      <div
        className="reset-column7"
        style={{
          backgroundImage:
            "url(https://i.pinimg.com/736x/18/d2/84/18d2846a78b4d6bead5eeba215378d3e.jpg)",
        }}
      >
        <img src={logo} className="reset-image4" alt="HRCLOUDX Company Logo" />

        <div className="reset-view3">
          <div className="reset-row-view">
            <span className="reset-text11">HRCLOUDX</span>
          </div>
        </div>

        <div className="reset-view4">
          <span className="reset-text12">EMPOWERING TEAMS, ANYWHERE</span>
        </div>

        <div className="reset-row-view6">
          <a href="/marketplace">Marketplace</a>
          <a href="/license">License</a>
          <a href="/terms">Terms of Use</a>
          <a href="/blog">Blog</a>
        </div>
      </div>
    </div>
  );
}