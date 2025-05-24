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
import { BirthdayProvider } from './services/BirthdayContext';
import TestPanel from './pages/TestPanel';
import LeaveRequest from "./pages/LeaveRequest";
import AdminProfile from './pages/AdminProfilePage';
import EmployeeList from './pages/EmployeeList';
import Documents from "./pages/Documents";
import ProjectAdmin from "./pages/ProjectAdminPage"

function App() {
  return (
    <BirthdayProvider>
      <Router>
        <Routes>
          {/* Public Route */}
          <Route path="/" element={<SignInPage />} />

          {/* Dashboards */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/employee/dashboard" element={<EmployeeDashboard />} />

          {/* Employee Pages */}
          <Route path="/employee/profile" element={<ProfilePageEmployee />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/leave-request" element={<LeaveRequest />} />
          <Route path="/documents" element={<Documents />} />

          {/* Admin Pages */}
          <Route path="/admin/profile" element={<AdminProfile />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/employee" element={<EmployeeList />} />
          <Route path="/new-hires" element={<NewHires />} />
          <Route path="/admin/projects" element={<ProjectAdmin />} />

          {/* Testing */}
          <Route path="/firebase/test" element={<FirebaseTest />} />
          <Route path="/databasa" element={<TestPanel />} />

          {/* TODO: Add <PrivateRoute> wrappers later for protection */}
        </Routes>
      </Router>
    </BirthdayProvider>
  );
}

export default App;