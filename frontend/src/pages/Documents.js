import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import EmployeeSidebar from "./Employee/EmployeeSidebar";
import EmployeeHeader from "./Employee/EmployeeHeader";
import EmployeeFooter from "./Employee/EmployeeFooter";
import "../styles/Documents.css";
import "./Employee/EmployeeSidebar.css";
import "./Employee/EmployeeHeader.css";
import "./Employee/EmployeeFooter.css";

const Documents = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Set active menu item based on current route
  const getActiveMenuItem = () => {
    const path = location.pathname;
    if (path.includes('/employee/dashboard')) return 'Employee Dashboard';
    if (path.includes('/employee/profile')) return 'Profile';
    if (path.includes('/projects')) return 'Projects';
    if (path.includes('/leave-request')) return 'Leave Request';
    if (path.includes('/documents')) return 'Documents';
    return 'Employee Dashboard'; // default
  };

  const [activeMenuItem, setActiveMenuItem] = useState(getActiveMenuItem());
  const handleMenuItemClick = (menuItem) => {
    setActiveMenuItem(menuItem);
    switch (menuItem) {
      case 'Employee Dashboard':
        navigate('/employee/dashboard');
        break;
      case 'Profile':
        navigate('/employee/profile');
        break;
      case 'Projects':
        navigate('/projects');
        break;
      case 'Leave Request':
        navigate('/leave-request');
        break;
      case 'Documents':
        navigate('/documents');
        break;
      default:
        navigate('/employee/dashboard');
    }
  };

  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode ? JSON.parse(savedMode) : false;
  });
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

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleNotification = (notification) => {
    setNotifications(prev => ({
      ...prev,
      [notification]: !prev[notification]
    }));
  };

  // Document categories
  const categories = [
    'All Documents',
    'Company Policies',
    'Payroll',
    'Contracts',
    'Training Materials',
    'Personal Documents'
  ];

  const [selectedCategory, setSelectedCategory] = useState('All Documents');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('date-desc');

  // Sample document data
  const [documents, setDocuments] = useState([
    {
      id: 1,
      name: 'Employee Handbook 2023',
      category: 'Company Policies',
      type: 'PDF',
      size: '2.4 MB',
      date: '2023-01-15',
      uploadedBy: 'HR Department',
      starred: true
    },
    {
      id: 2,
      name: 'Employment Contract',
      category: 'Contracts',
      type: 'DOCX',
      size: '1.2 MB',
      date: '2022-11-05',
      uploadedBy: 'HR Manager',
      starred: true
    },
    {
      id: 3,
      name: 'Payroll Schedule Q1 2023',
      category: 'Payroll',
      type: 'XLSX',
      size: '0.8 MB',
      date: '2023-02-28',
      uploadedBy: 'Finance Team',
      starred: false
    },
    {
      id: 4,
      name: 'Security Training',
      category: 'Training Materials',
      type: 'PPTX',
      size: '5.7 MB',
      date: '2023-03-10',
      uploadedBy: 'IT Department',
      starred: false
    },
    {
      id: 5,
      name: 'Performance Review Form',
      category: 'Personal Documents',
      type: 'PDF',
      size: '0.5 MB',
      date: '2023-04-01',
      uploadedBy: 'Your Manager',
      starred: true
    },
    {
      id: 6,
      name: 'Benefits Overview',
      category: 'Company Policies',
      type: 'PDF',
      size: '3.1 MB',
      date: '2023-01-20',
      uploadedBy: 'HR Department',
      starred: false
    },
    {
      id: 7,
      name: 'NDA Agreement',
      category: 'Contracts',
      type: 'PDF',
      size: '1.5 MB',
      date: '2022-10-15',
      uploadedBy: 'Legal Team',
      starred: true
    },
    {
      id: 8,
      name: 'Onboarding Checklist',
      category: 'Training Materials',
      type: 'DOCX',
      size: '0.7 MB',
      date: '2023-03-05',
      uploadedBy: 'HR Department',
      starred: false
    }
  ]);

  // Filter documents based on selected category and search query
  const filteredDocuments = documents.filter(doc => {
    const matchesCategory = selectedCategory === 'All Documents' || doc.category === selectedCategory;
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         doc.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Sort documents based on selected option
  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    switch (sortOption) {
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      case 'date-asc':
        return new Date(a.date) - new Date(b.date);
      case 'date-desc':
        return new Date(b.date) - new Date(a.date);
      case 'size-asc':
        return parseFloat(a.size) - parseFloat(b.size);
      case 'size-desc':
        return parseFloat(b.size) - parseFloat(a.size);
      default:
        return 0;
    }
  });

  // Toggle star status for a document
  const toggleStar = (id) => {
    setDocuments(docs => 
      docs.map(doc => 
        doc.id === id ? { ...doc, starred: !doc.starred } : doc
      )
    );
  };

  // Get file icon based on file type
  const getFileIcon = (type) => {
    switch (type) {
      case 'PDF':
        return 'https://img.icons8.com/color/48/000000/pdf.png';
      case 'DOCX':
        return 'https://img.icons8.com/color/48/000000/ms-word.png';
      case 'XLSX':
        return 'https://img.icons8.com/color/48/000000/ms-excel.png';
      case 'PPTX':
        return 'https://img.icons8.com/color/48/000000/ms-powerpoint.png';
      default:
        return 'https://img.icons8.com/color/48/000000/file.png';
    }
  };

  return (
    <div className="documents-page-container">
      {/* Sidebar */}
      <EmployeeSidebar
        activeMenuItem={activeMenuItem}
        handleMenuItemClick={handleMenuItemClick}
      />

      {/* Main Content */}
      <div className="documents-main-content">
        {/* Header Section */}
        <EmployeeHeader
          activeMenuItem={activeMenuItem}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          notifications={notifications}
          toggleNotification={toggleNotification}
        />

        {/* Documents Container */}
        <div className="documents-container">
          {/* Documents Header */}
          <div className="documents-header">
            <h1>All Documents</h1>
            <div className="documents-actions">
              <div className="documents-search-bar">
                <input
                  type="text"
                  placeholder="Search documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M21 21L16.65 16.65" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="documents-sort-dropdown">
                <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
                  <option value="date-desc">Newest First</option>
                  <option value="date-asc">Oldest First</option>
                  <option value="name-asc">Name (A-Z)</option>
                  <option value="name-desc">Name (Z-A)</option>
                  <option value="size-asc">Size (Smallest)</option>
                  <option value="size-desc">Size (Largest)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Documents Content */}
          <div className="documents-content">
            {/* Categories Sidebar */}
            <div className="categories-sidebar">
              <h3>Categories</h3>
              <ul>
                {categories.map(category => (
                  <li
                    key={category}
                    className={selectedCategory === category ? 'active' : ''}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                    {category !== 'All Documents' && (
                      <span className="document-count">
                        {documents.filter(doc => doc.category === category).length}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Documents List */}
            <div className="documents-list">
              {sortedDocuments.length > 0 ? (
                <div className="documents-grid">
                  {sortedDocuments.map(doc => (
                    <div key={doc.id} className="document-card">
                      <div className="document-header">
                        <img src={getFileIcon(doc.type)} alt={doc.type} className="file-icon" />
                        <button
                          className={`star-button ${doc.starred ? 'starred' : ''}`}
                          onClick={() => toggleStar(doc.id)}
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill={doc.starred ? "#F59E0B" : "none"} xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                      </div>
                      <div className="document-body">
                        <h3>{doc.name}</h3>
                        <div className="document-meta">
                          <span className="document-category">{doc.category}</span>
                          <span className="document-size">{doc.size}</span>
                        </div>
                        <div className="document-footer">
                          <span className="document-date">
                            {new Date(doc.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                          <span className="document-uploader">{doc.uploadedBy}</span>
                        </div>
                      </div>
                      <div className="document-actions">
                        <button className="download-button">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M21 15V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V15" stroke="#4318FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M7 10L12 15L17 10" stroke="#4318FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M12 15V3" stroke="#4318FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Download
                        </button>
                        <button className="preview-button">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="#4318FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="#4318FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Preview
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-documents">
                  <img src="https://img.icons8.com/ios/100/6B7280/folder-invoices.png" alt="No documents" />
                  <h3>No documents found</h3>
                  <p>Try adjusting your search or filter criteria</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <EmployeeFooter />
      </div>
    </div>
  );
};

export default Documents;