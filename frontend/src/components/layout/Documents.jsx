import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import axios from "axios";
import { auth } from "../../config/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

import EmployeeSidebar from "../../pages/Employee/EmployeeSidebar";
import EmployeeHeader from "../../pages/Employee/EmployeeHeader";
import EmployeeFooter from "../../pages/Employee/EmployeeFooter";

import DocumentsHeader from "../../components/cards/document/DocumentsHeader";
import CategoriesSidebar from "../../components/cards/document/CategoriesSidebar";
import DocumentsGrid from "../../components/cards/document/DocumentsGrid";

import "../../styles/Documents.css";
import "../../pages/Employee/EmployeeSidebar.css";
import "../../pages/Employee/EmployeeHeader.css";
import "../../pages/Employee/EmployeeFooter.css";

// Define categories at the top level (before the component)
const categories = [
    'All Documents',
    'Company Policies',
    'Payroll',
    'Contracts',
    'Training Materials',
    'Personal Documents',
    'HR Documents'
];

const Documents = ({ darkMode, toggleDarkMode }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const [searchQuery, setSearchQuery] = useState("");
    const [sortOption, setSortOption] = useState("date-desc");
    const [selectedCategory, setSelectedCategory] = useState("All Documents");
    const [documents, setDocuments] = useState([]);
    const [documentCounts, setDocumentCounts] = useState({});
    const [notifications, setNotifications] = useState({
        "Item update notifications": false,
        "Item comment notifications": false,
        "Buyer review notifications": false,
        "Rating reminders notifications": true,
        "Meetups near you notifications": false,
        "Company news notifications": false,
        "New launches and projects": false,
        "Monthly product changes": false,
        "Subscribe to newsletter": false,
        "Email me when someone follows me": false,
    });

    const getActiveMenuItem = () => {
        const path = location.pathname;
        if (path.includes('/employee/dashboard')) return 'Employee Dashboard';
        if (path.includes('/employee/profile')) return 'Profile';
        if (path.includes('/projects')) return 'Projects';
        if (path.includes('/leave-request')) return 'Leave Request';
        if (path.includes('/documents')) return 'Documents';
        return 'Employee Dashboard';
    };

    const [activeMenuItem, setActiveMenuItem] = useState(getActiveMenuItem());
    const handleMenuItemClick = (menuItem) => {
        setActiveMenuItem(menuItem);
        switch (menuItem) {
            case 'Employee Dashboard': navigate('/employee/dashboard'); break;
            case 'Profile': navigate('/employee/profile'); break;
            case 'Projects': navigate('/projects'); break;
            case 'Leave Request': navigate('/leave-request'); break;
            case 'Documents': navigate('/documents'); break;
            default: navigate('/employee/dashboard');
        }
    };

    // Calculate document counts whenever documents change
    useEffect(() => {
        const counts = categories.reduce((acc, category) => {
            acc[category] = category === 'All Documents' 
                ? documents.length 
                : documents.filter(doc => doc.category === category).length;
            return acc;
        }, {});
        setDocumentCounts(counts);
    }, [documents]);

    // Fetch documents for logged-in user
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) return;

            try {
                const token = await user.getIdToken();
                const uid = user.uid;

                const response = await axios.get(
                    `http://localhost:8080/api/documents/${uid}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                const docs = response.data.map(doc => ({
                    ...doc,
                    size: doc.size || "—",
                    formattedDate: doc.formattedDate || new Date().toISOString().slice(0, 10),
                }));

                setDocuments(docs);
            } catch (err) {
                console.error("❌ Error fetching documents:", err);
            }
        });

        return () => unsubscribe();
    }, []);

    const toggleNotification = (notification) => {
        setNotifications(prev => ({
            ...prev,
            [notification]: !prev[notification]
        }));
    };
    // Handlers
    const handleSearchChange = query => setSearchQuery(query);
    const handleSortChange = option => setSortOption(option);
    const handleCategorySelect = cat => setSelectedCategory(cat);
    const handleToggleStar = async (id) => {
        const updatedDocs = documents.map(doc =>
            doc.id === id ? { ...doc, starred: !doc.starred } : doc
        );
        setDocuments(updatedDocs);

        const doc = updatedDocs.find(d => d.id === id);
        const user = auth.currentUser;
        if (!user) return;

        const token = await user.getIdToken();
        await axios.patch(`http://localhost:8080/api/documents/${user.uid}/${id}/star`, {
            starred: doc.starred
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
    };

    const handleDownload = (id) => {
        const doc = documents.find(d => d.id === id);
        if (doc?.url) {
            const fullUrl = `http://localhost:8080${decodeURIComponent(doc.url)}`;
            const link = document.createElement("a");
            link.href = fullUrl;
            link.download = doc.name || "file";
            link.click();
        } else {
            alert("Download failed: URL not found.");
        }
    };
    const handlePreview = (id) => {
        const doc = documents.find(d => d.id === id);
        if (!doc?.url) {
            alert("No preview URL available.");
            return;
        }

        const fullUrl = `http://localhost:8080${decodeURIComponent(doc.url)}`;

        // Open in new tab
        window.open(fullUrl, "_blank");
    };
    const allCategories = [
        "All Documents",
        "Company Policies",
        "Payroll",
        "Contracts",
        "Training Materials",
        "Personal Documents",
        "HR Documents"
    ];

    const handleGenerateSampleDocs = async () => {
        const user = auth.currentUser;
        if (!user) return;

        const token = await user.getIdToken();
        const uid = user.uid;

        try {
            await axios.post(`http://localhost:8080/api/documents/${uid}/generate`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("📄 Sample documents generated!");

            // Re-fetch to refresh UI
            const response = await axios.get(
                `http://localhost:8080/api/documents/${uid}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const docs = response.data.map(doc => ({
                ...doc,
                size: doc.size || "—",
                formattedDate: doc.formattedDate || new Date().toISOString().slice(0, 10),
            }));
            setDocuments(docs);
        } catch (err) {
            console.error("Error generating documents:", err);
            alert("Failed to generate sample documents.");
        }
    };

    // Filtering & sorting
    const filtered = documents
        .filter(d => selectedCategory === "All Documents" || d.category === selectedCategory)
        .filter(d => d.name?.toLowerCase().includes(searchQuery.toLowerCase()));

    const sorted = [...filtered].sort((a, b) => {
        switch (sortOption) {
            case "date-desc":
                return new Date(b.formattedDate) - new Date(a.formattedDate);
            case "date-asc":
                return new Date(a.formattedDate) - new Date(b.formattedDate);
            case "name-asc":
                return a.name.localeCompare(b.name);
            case "name-desc":
                return b.name.localeCompare(a.name);
            case "size-asc":
                return (parseInt(a.size) || 0) - (parseInt(b.size) || 0);
            case "size-desc":
                return (parseInt(b.size) || 0) - (parseInt(a.size) || 0);
            default:
                return 0;
        }
    });

    return (
        <div className={`documents-page-container ${darkMode ? "dark-theme" : ""}`}>
            <EmployeeSidebar
                activeMenuItem={activeMenuItem}
                handleMenuItemClick={handleMenuItemClick}
                darkMode={darkMode}
            />
            <div className="documents-main-content">
                <EmployeeHeader
                    activeMenuItem={activeMenuItem}
                    darkMode={darkMode}
                    toggleDarkMode={toggleDarkMode}
                    notifications={notifications}
                    toggleNotification={toggleNotification}
                />

                <DocumentsHeader
                    title="All Documents"
                    searchQuery={searchQuery}
                    onSearchChange={handleSearchChange}
                    sortOption={sortOption}
                    onSortChange={handleSortChange}
                    onGenerateSampleDocs={handleGenerateSampleDocs}

                />

                <div className="documents-content">
                    <CategoriesSidebar
                        categories={categories}
                        selectedCategory={selectedCategory}
                        onSelect={handleCategorySelect}
                        documentCounts={documentCounts}
                    />

                    <div className="documents-container"> {/* ✅ Wrap the grid */}
                        <DocumentsGrid
                            documents={sorted}
                            onToggleStar={handleToggleStar}
                            onDownload={handleDownload}
                            onPreview={handlePreview}
                        />
                    </div>
                </div>



                <EmployeeFooter />
            </div>
        </div>
    );
};

export default Documents;
