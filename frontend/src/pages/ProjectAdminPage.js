// pages/ProjectAdminPage.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import axios from 'axios';

import ProjectAdminLayout from '../components/layout/ProjectAdminLayout';
import ProjectsGrid from '../components/Projects/ProjectsGrid';
import ProjectsTable from '../components/Projects/ProjectsTable';
import CreateProjectModal from '../components/Projects/CreateProjectModal';
import '../styles/ProjectsAdmin.css';

export default function ProjectAdminPage() {
    const navigate = useNavigate();
    const location = useLocation();

    const getActiveMenuItem = () => {
        const path = location.pathname;
        if (path.includes('/admin/dashboard')) return 'Dashboard';
        if (path.includes('/admin/profile')) return 'Profile';
        if (path.includes('/new-hires')) return 'New Hires';
        if (path.includes('/employee')) return 'Employees';
        if (path.includes('/billing')) return 'Billing';
        if (path.includes('/admin/projects') || path.includes('/projects')) return 'Projects';
        return 'Dashboard';
    };

    const [activeMenuItem, setActiveMenuItem] = useState(getActiveMenuItem());
    const handleMenuItemClick = (menuItem) => {
        setActiveMenuItem(menuItem);
        switch (menuItem) {
          case 'Dashboard':
            navigate('/admin/dashboard');
            break;
          case 'Profile':
            navigate('/admin/profile');
            break;
          case 'New Hires':
            navigate('/new-hires');
            break;
          case 'Employees':
            navigate('/employee');
            break;
          case 'Billing':
            navigate('/billing');
            break;
          case 'Projects':
            navigate('/admin/projects');
            break;
          default:
            navigate('/admin/dashboard');
        }
      };

    const [searchQuery, setSearchQuery] = useState('');
    const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
    const toggleDarkMode = () => {
        const newMode = !darkMode;
        setDarkMode(newMode);
        localStorage.setItem('darkMode', newMode);
    };

    const [notifications, setNotifications] = useState([
        { id: 1, title: 'New project created', read: false, time: '2 min ago' },
        { id: 2, title: 'Project update', read: true, time: '1 hour ago' },
        { id: 3, title: 'System alert', read: false, time: '3 hours ago' },
        { id: 4, title: 'Project completed', read: true, time: 'Yesterday' }
    ]);
    const toggleNotification = (id) => setNotifications(n => n.map(x => x.id === id ? { ...x, read: !x.read } : x));

    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const [profileImage, setProfileImage] = useState('/placeholder.svg?height=32&width=32');
    const fileInputRef = useRef(null);
    const handleProfileAction = (action) => {
        setShowProfileDropdown(false);
        if (action === 'photo') fileInputRef.current?.click();
        else if (action === 'logout') navigate('/');
        else navigate(`/admin/${action}`);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => setProfileImage(ev.target.result);
            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', (e) => {
            if (!e.target.closest('.user-profile')) setShowProfileDropdown(false);
        });
    }, []);

    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newProject, setNewProject] = useState({ project_Name: '', company: '', budget: '', status: 'ongoing' });
    const [employees, setEmployees] = useState([]);

    const fetchProjects = async () => {
        try {
            const auth = getAuth();
            const token = await auth.currentUser.getIdToken();
            const response = await axios.get('http://localhost:8080/api/projects', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProjects(response.data);
        } catch (err) {
            console.error("Error fetching projects:", err);
        }
    };

    const fetchEmployees = async () => {
        try {
            const auth = getAuth();
            const token = await auth.currentUser.getIdToken();
            const response = await axios.get('http://localhost:8080/api/employees', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setEmployees(response.data); // each item should have: uid, fullName
        } catch (err) {
            console.error("Error fetching employees:", err);
        }
    };

    useEffect(() => {
        fetchProjects();
        fetchEmployees();
    }, []);
    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    const token = await user.getIdToken();
                    const res = await axios.get("http://localhost:8080/api/projects", {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setProjects(res.data);
                } catch (err) {
                    console.error("Error fetching projects:", err);
                } finally {
                    setLoading(false);
                }
            }
        });
        return () => unsubscribe();
    }, []);

    const handleCreateProject = async () => {
        try {
            const auth = getAuth();
            const user = auth.currentUser;
            if (!user) return;

            const token = await user.getIdToken();
            const res = await axios.post("http://localhost:8080/api/projects", newProject, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setProjects(prev => [...prev, res.data]);
            setShowCreateModal(false);
            setNewProject({ project_Name: '', company: '', budget: '', status: 'Ongoing' });
        } catch (err) {
            console.error("Error creating project:", err);
        }
    };



    return (
        <ProjectAdminLayout
            activeMenuItem={activeMenuItem}
            handleMenuItemClick={handleMenuItemClick}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            darkMode={darkMode}
            toggleDarkMode={toggleDarkMode}
            notifications={notifications}
            toggleNotification={toggleNotification}
            profileImage={profileImage}
            showProfileDropdown={showProfileDropdown}
            setShowProfileDropdown={setShowProfileDropdown}
            handleProfileAction={handleProfileAction}
            fileInputRef={fileInputRef}
            handleFileChange={handleFileChange}
        >
            <ProjectsGrid projects={projects} setShowCreateModal={setShowCreateModal} />
            <ProjectsTable
                projects={projects}
                setProjects={setProjects}
                employeeOptions={employees}
                darkMode={darkMode}
                triggerRefresh={fetchProjects}
            />
            {showCreateModal && (
                <CreateProjectModal
                    newProject={newProject}
                    setNewProject={setNewProject}
                    handleCreateProject={handleCreateProject}
                    setShowCreateModal={setShowCreateModal}
                />
            )}
        </ProjectAdminLayout>
    );
}