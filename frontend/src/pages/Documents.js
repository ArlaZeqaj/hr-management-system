import React, { useState, useEffect } from "react";
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