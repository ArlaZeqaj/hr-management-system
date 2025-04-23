import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import SignInPage from "./pages/SignIn";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ProfilePageEmployee from "./pages/ProfilePageEmployee";
import Billing from "./pages/Billing";
import Projects from "./pages/Projects";
import NewHires from "./pages/NewHires";
import FirebaseTest from "./pages/FirebaseTest";

function App() {
    return (
        <Router>
            <Routes>
                {/* Public Route */}
                <Route path="/" element={<SignInPage />} />

                {/* Dashboards */}
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/employee/dashboard" element={<EmployeeDashboard />} />

                {/* Employee Pages */}
                <Route path="/profile" element={<ProfilePageEmployee />} />
                <Route path="/billing" element={<Billing />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/new-hires" element={<NewHires />} />

                {/* Testing */}
                <Route path="/firebase/test" element={<FirebaseTest />} />

                {/* TODO: Add <PrivateRoute> wrappers later for protection */}
            </Routes>
        </Router>
    );
}

export default App;
