// src/pages/ResetPassword.js
import React, { useState } from "react";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = async () => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/auth/reset-password?email=${email}`,
        {
          method: "POST",
        }
      );
      const text = await res.text();
      setMessage("✅ " + text);
    } catch (err) {
      console.error(err);
      setMessage("❌ Something went wrong!");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Reset Your Password</h2>
      <input
        type="email"
        placeholder="Enter your email"
        className="border p-2 w-full mb-4"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button
        onClick={handleReset}
        className="bg-blue-500 text-white p-2 w-full rounded"
      >
        Send Reset Link
      </button>
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
};

export default ResetPassword;
