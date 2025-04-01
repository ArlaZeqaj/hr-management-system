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
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignInPage from '../src/pages/SignIn';
import EmployeeDashboard from '../src/pages/EmployeeDashboard';
import AdminDashboard from '../src/pages/AdminDashboard';
import ProfilePageEmployee from '../src/pages/ProfilePageEmployee';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<SignInPage />} />
                <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
                <Route path="/profile" element={<ProfilePageEmployee />} />
                {/* Add protected routes if needed */}
            </Routes>
        </Router>
    );
}

export default App;

