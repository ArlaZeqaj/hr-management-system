import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AdminSidebar from './Admin/AdminSidebar';
import AdminHeader from './Admin/AdminHeader';
import AdminFooter from './Admin/AdminFooter';
import '../styles/ProjectsAdmin.css';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import axios from "axios";

const getProgressColor = (status) => {
    if (!status) return '#FFB547';
    const s = status.toLowerCase();
    if (s === 'done') return '#05CD99';
    if (s === 'ongoing') return '#4318FF';
    if (s === 'canceled') return '#FF5B5B';
    return '#FFB547';
};

const getStatusIcon = (status) => {
    if (!status) return '⏳';
    const s = status.toLowerCase();
    if (s === 'done') return '✔️';
    if (s === 'ongoing') return '🛠️';
    if (s === 'canceled') return '❌';
    return '⏳';
};

const calculateDaysLeft = (endDate) => {
    if (!endDate || !endDate.seconds) return null;
    const today = new Date();
    const end = new Date(endDate.seconds * 1000);
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? `${diffDays} days left` : `⚠️ Overdue`;
};

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
    const handleMenuItemClick = (item) => {
        setActiveMenuItem(item);
        navigate(`/admin/${item.toLowerCase().replace(' ', '-')}`);
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
    const [selectedProject, setSelectedProject] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newProject, setNewProject] = useState({ project_Name: '', company: '', budget: '', status: 'ongoing' });

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    const token = await user.getIdToken();
                    const res = await axios.get("http://localhost:8080/api/projects", {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    console.log("✅ Received from backend:", res.data);
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

    const formatDate = (timestamp) => {
        if (!timestamp || !timestamp.seconds) return '—';
        return new Date(timestamp.seconds * 1000).toLocaleDateString();
    };

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
            setNewProject({ project_Name: '', company: '', budget: '', status: 'ongoing' });
        } catch (err) {
            console.error("Error creating project:", err);
        }
    };

    const handleStatusChange = async (projectId, newStatus) => {
        try {
            const auth = getAuth();
            const user = auth.currentUser;
            if (!user) return;

            const token = await user.getIdToken();
            await axios.put(`http://localhost:8080/api/projects/${projectId}/status`, { status: newStatus }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setProjects(prev =>
                prev.map(p => (p.id === projectId ? { ...p, status: newStatus } : p))
            );
        } catch (err) {
            console.error("Error updating status:", err);
        }
    };

    return (
        <div className={`admin-dashboard-page-container ${darkMode ? 'dark-theme' : ''}`}>
            <AdminSidebar activeMenuItem={activeMenuItem} handleMenuItemClick={handleMenuItemClick} />
            <div className="admin-dashboard-main-content">
                <AdminHeader
                    activeMenuItem={activeMenuItem}
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
                />

                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" style={{ display: 'none' }} />

                <div className="projects-section">
                    <div className="projects-header-flex">
                        <div>
                            <h2 className="section-title">Ongoing Projects</h2>
                            <p className="section-subtitle">Latest active projects with progress</p>
                        </div>
                    </div>
                    <div className="projects-grid">
                        {projects.filter(p => p.status?.toLowerCase() === 'ongoing').slice(0, 4).map(p => (
                            <div key={p.id} className="project-card">
                                <div className="project-image">
                                    <img src={p.image || "/placeholder.svg"} alt={p.project_Name} />
                                </div>
                                <div className="project-content">
                                    <h3 className="project-title">{p.project_Name}</h3>
                                    <p className="project-description">
                                        🕒 {calculateDaysLeft(p.end_Date)}<br />
                                        👥 {p.assigned_Employees?.slice(0, 2).join(', ') || 'Unassigned'}
                                    </p>
                                    <div className="project-footer">
                                        <div className="progress-bar">
                                            <div className="progress-fill" style={{ width: '50%', backgroundColor: getProgressColor(p.status) }} />
                                        </div>
                                        <span className={`status-badge status-${p.status?.toLowerCase()}`}>{getStatusIcon(p.status)} {p.status}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {projects.filter(p => p.status?.toLowerCase() === 'ongoing').length === 0 && (
                            <p className="section-subtitle">No ongoing projects available right now.</p>
                        )}


                        <div className="create-project-card" onClick={() => setShowCreateModal(true)}>
                            <div className="create-project-content">
                                <div className="plus-icon">+</div>
                                <span>Add New Project</span>
                            </div>
                        </div>

                    </div>
                </div>

                <div className="projects-table-section">
                    <div className="table-header-section">
                        <h2 className="section-title">All Projects</h2>
                    </div>
                    <div className="projects-table">
                        <div className="tablee-header">
                            <div className="header-companies">COMPANIES</div>
                            <div className="header-budget">BUDGET</div>
                            <div className="header-status">STATUS</div>
                            <div className="header-completion">COMPLETION</div>
                            <div className="header-actions"></div>
                        </div>
                        {projects.map(proj => {
                            const status = proj.status?.toLowerCase();
                            const completion = status === "done" ? 100 : status === "ongoing" ? 50 : status === "canceled" ? 10 : 0;

                            return (
                                <div key={proj.id} className="tablee-row">
                                    <div className="cell-company">
                                        <div className="company-icon" style={{ backgroundColor: "#4318FF20", color: "#4318FF" }}>
                                            {proj.project_Name?.[0] || "?"}
                                        </div>
                                        <span>{proj.project_Name} <small style={{ color: "#888" }}>({proj.company})</small></span>
                                    </div>
                                    <div className="cell-budget">{proj.budget || "—"}</div>
                                    <div className="cell-status">
                                        <select
                                            value={proj.status}
                                            onChange={(e) => handleStatusChange(proj.id, e.target.value)}
                                            className={`status-dropdown status-${status}`}
                                        >
                                            <option value="ongoing">Ongoing</option>
                                            <option value="done">Done</option>
                                            <option value="canceled">Canceled</option>
                                        </select>
                                    </div>
                                    <div className="cell-completion">
                                        <div className="completion-text">{completion}%</div>
                                        <div className="progress-bar">
                                            <div className="progress-fill" style={{ width: `${completion}%`, backgroundColor: getProgressColor(proj.status) }} />
                                        </div>
                                    </div>
                                    <div className="cell-actions">
                                        <button className="action-button">•••</button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {showCreateModal && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <h2>Create New Project</h2>

                            <input
                                type="text"
                                placeholder="Project Name"
                                value={newProject.assigned_id?.[0]?.project_Name || ''}
                                onChange={e =>
                                    setNewProject({
                                        ...newProject,
                                        assigned_id: [
                                            {
                                                ...newProject.assigned_id?.[0],
                                                project_Name: e.target.value
                                            }
                                        ]
                                    })
                                }
                            />

                            <input
                                type="text"
                                placeholder="Company"
                                value={newProject.assigned_id?.[0]?.company || ''}
                                onChange={e =>
                                    setNewProject({
                                        ...newProject,
                                        assigned_id: [
                                            {
                                                ...newProject.assigned_id?.[0],
                                                company: e.target.value
                                            }
                                        ]
                                    })
                                }
                            />

                            <input
                                type="text"
                                placeholder="Budget"
                                value={newProject.assigned_id?.[0]?.budget || ''}
                                onChange={e =>
                                    setNewProject({
                                        ...newProject,
                                        assigned_id: [
                                            {
                                                ...newProject.assigned_id?.[0],
                                                budget: e.target.value
                                            }
                                        ]
                                    })
                                }
                            />

                            <input
                                type="text"
                                placeholder="Role"
                                value={newProject.assigned_id?.[0]?.role || ''}
                                onChange={e =>
                                    setNewProject({
                                        ...newProject,
                                        assigned_id: [
                                            {
                                                ...newProject.assigned_id?.[0],
                                                role: e.target.value
                                            }
                                        ]
                                    })
                                }
                            />

                            <input
                                type="text"
                                placeholder="Start Date (e.g., 6/21/2025)"
                                value={newProject.assigned_id?.[0]?.start_Date || ''}
                                onChange={e =>
                                    setNewProject({
                                        ...newProject,
                                        assigned_id: [
                                            {
                                                ...newProject.assigned_id?.[0],
                                                start_Date: e.target.value
                                            }
                                        ]
                                    })
                                }
                            />

                            <input
                                type="text"
                                placeholder="End Date (e.g., 1/25/2025)"
                                value={newProject.assigned_id?.[0]?.end_Date || ''}
                                onChange={e =>
                                    setNewProject({
                                        ...newProject,
                                        assigned_id: [
                                            {
                                                ...newProject.assigned_id?.[0],
                                                end_Date: e.target.value
                                            }
                                        ]
                                    })
                                }
                            />

                            <textarea
                                placeholder="Description"
                                value={newProject.assigned_id?.[0]?.description || ''}
                                onChange={e =>
                                    setNewProject({
                                        ...newProject,
                                        assigned_id: [
                                            {
                                                ...newProject.assigned_id?.[0],
                                                description: e.target.value
                                            }
                                        ]
                                    })
                                }
                            />

                            <input
                                type="text"
                                placeholder="Project Image URL"
                                value={newProject.assigned_id?.[0]?.image || ''}
                                onChange={e =>
                                    setNewProject({
                                        ...newProject,
                                        assigned_id: [
                                            {
                                                ...newProject.assigned_id?.[0],
                                                image: e.target.value
                                            }
                                        ]
                                    })
                                }
                            />

                            <input
                                type="text"
                                placeholder="Company Logo URL"
                                value={newProject.assigned_id?.[0]?.company_img || ''}
                                onChange={e =>
                                    setNewProject({
                                        ...newProject,
                                        assigned_id: [
                                            {
                                                ...newProject.assigned_id?.[0],
                                                company_img: e.target.value
                                            }
                                        ]
                                    })
                                }
                            />

                            <input
                                type="text"
                                placeholder="Assigned Employees (comma-separated)"
                                value={newProject.assigned_id?.[0]?.assigned_Employees?.join(', ') || ''}
                                onChange={e =>
                                    setNewProject({
                                        ...newProject,
                                        assigned_id: [
                                            {
                                                ...newProject.assigned_id?.[0],
                                                assigned_Employees: e.target.value.split(',').map(emp => emp.trim())
                                            }
                                        ]
                                    })
                                }
                            />

                            <select
                                value={newProject.assigned_id?.[0]?.status || 'ongoing'}
                                onChange={e =>
                                    setNewProject({
                                        ...newProject,
                                        assigned_id: [
                                            {
                                                ...newProject.assigned_id?.[0],
                                                status: e.target.value
                                            }
                                        ]
                                    })
                                }
                            >
                                <option value="ongoing">Ongoing</option>
                                <option value="done">Done</option>
                                <option value="canceled">Canceled</option>
                            </select>

                            <div className="modal-actions">
                                <button onClick={handleCreateProject}>Create</button>
                                <button onClick={() => setShowCreateModal(false)}>Cancel</button>
                            </div>
                        </div>
                    </div>
                )}


                <AdminFooter />
            </div>
        </div>
    );
}
