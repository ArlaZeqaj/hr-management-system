import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import EmployeeSidebar from "./Employee/EmployeeSidebar";
import EmployeeHeader from "./Employee/EmployeeHeader";
import EmployeeFooter from "./Employee/EmployeeFooter";
import Documents from "../components/layout/Documents"


const DocumentsPage = () => {
    const [darkMode, setDarkMode] = useState(() => {
        const savedMode = localStorage.getItem("darkMode");
        return savedMode ? JSON.parse(savedMode) : false;
    });

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        localStorage.setItem("darkMode", !darkMode);
    };
    return (
        <Documents
            darkMode={darkMode}
            toggleDarkMode={toggleDarkMode}
        />
    );
};
export default DocumentsPage;