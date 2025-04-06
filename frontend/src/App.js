import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignInPage from "../src/pages/SignIn";
import EmployeeDashboard from "../src/pages/EmployeeDashboard";
import AdminDashboard from "../src/pages/AdminDashboard";
import ProfilePageEmployee from "../src/pages/ProfilePageEmployee";
import FirebaseTest from "../src/pages/FirebaseTest";



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignInPage />} />
        <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/profile" element={<ProfilePageEmployee />} />
          <Route path="/firebase/test" element={<FirebaseTest />} />
        {/* Add protected routes if needed */}
      </Routes>
    </Router>
  );
}

export default App;
