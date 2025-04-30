import React, { useState, useEffect } from "react";
import { db, auth } from "../../config/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import axios from "axios";

const TasksCard = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState("all");
    const [tasks, setTasks] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) return;

            const token = await user.getIdToken(true);
            const now = new Date();
            const yearMonth = now.toISOString().slice(0, 7);

            try {
                const response = await axios.get(
                    `http://localhost:8080/api/schedule/${yearMonth}-taskcomponent`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                const rawTasks = response.data.tasks;
                if (Array.isArray(rawTasks)) {
                    const tasksWithIds = rawTasks.map((task, index) => ({
                        ...task,
                        id: `task${index + 1}`,
                    }));
                    setTasks(tasksWithIds);
                }
            } catch (err) {
                console.error("❌ Failed to fetch tasks:", err);
            }
        });

        return () => unsubscribe();
    }, []);

    const filteredTasks = tasks.filter(task => {
        const matches = filter === "all" ||
            task.status?.toLowerCase() === filter ||
            task.priority?.toLowerCase() === filter;
        return matches && task.title?.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const openModal = (task) => {
        setSelectedTask(task);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedTask(null);
    };

    const handleSaveChanges = async () => {
        if (!selectedTask || !auth.currentUser) return;

        try {
            const token = await auth.currentUser.getIdToken(true);
            const now = new Date();
            const yearMonth = now.toISOString().slice(0, 7);
            const taskId = selectedTask.id;

            const updates = {
                status: selectedTask.status,
                notes: selectedTask.notes,
            };

            await axios.put(
                `http://localhost:8080/api/schedule/${yearMonth}/${taskId}`,
                updates,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            closeModal();
            setTasks(prev =>
                prev.map(t => (t.id === taskId ? { ...t, ...updates } : t))
            );
        } catch (err) {
            console.error("❌ Failed to update task:", err);
        }
    };

    return (
        <div className="tasks-card-z">
            <div className="task-controls-z">
                <input
                    type="text"
                    className="task-search-z"
                    placeholder="Search tasks..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="task-filters-z">
                {['all', 'pending', 'in-progress', 'completed', 'high', 'medium', 'low'].map(type => (
                    <button
                        key={type}
                        onClick={() => setFilter(type)}
                        className={`filter-btn-z ${filter === type ? 'active' : ''}`}
                    >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                ))}
            </div>

            <ul className="task-list-z">
                {filteredTasks.length === 0 ? (
                    <div className="empty-state-z">
                        <i className="fas fa-tasks"></i>
                        <p>No tasks found</p>
                    </div>
                ) : (
                    filteredTasks.map(task => (
                        <li key={task.id} className="task-item-z" onClick={() => openModal(task)}>
                            <div className="task-line-z">
                                <input type="checkbox" checked={task.status === 'completed'} readOnly />
                                <div>
                                    <div className={`task-title-z ${task.status === 'completed' ? 'completed' : ''}`}>
                                        {task.title}
                                    </div>
                                    <div className="task-description-z">{task.description}</div>
                                    <div className="task-meta-z">
                                        <span className={`priority-z priority-${task.priority}`}>{task.priority}</span>
                                        <span className={`status-z status-${task.status.replace('-', '')}`}>{task.status}</span>
                                        <span className="due-date-z">Due: {task.dueDate}</span>
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))
                )}
            </ul>

            {showModal && selectedTask && (
                <div className="task-detail-modal-z" onClick={closeModal}>
                    <div className="modal-content-z" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header-z">
                            <h3>{selectedTask.title}</h3>
                            <button className="close-modal-z" onClick={closeModal}>&times;</button>
                        </div>
                        <div className="modal-body-z">
                            <div className="detail-row-z"><label>Description</label><p>{selectedTask.description}</p></div>
                            <div className="detail-row-z">
                                <label>Status</label>
                                <div className="status-selector-z">
                                    {['pending', 'in-progress', 'completed'].map(status => (
                                        <div
                                            key={status}
                                            className={`status-option-z ${selectedTask.status === status ? 'active' : ''}`}
                                            onClick={() => setSelectedTask(prev => ({ ...prev, status }))}
                                        >
                                            {status}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="detail-row-z"><label>Priority</label><p>{selectedTask.priority}</p></div>
                            <div className="detail-row-z"><label>Assignee</label><p>{selectedTask.assignee}</p></div>
                            <div className="detail-row-z"><label>Due Date</label><p>{selectedTask.dueDate}</p></div>
                            <div className="detail-row-z">
                                <label>Notes</label>
                                <textarea
                                    value={selectedTask.notes || ""}
                                    onChange={(e) => setSelectedTask(prev => ({ ...prev, notes: e.target.value }))}
                                />
                            </div>
                        </div>
                        <div className="modal-footer-z">
                            <button className="modal-btn-z secondary" onClick={closeModal}>Cancel</button>
                            <button className="modal-btn-z primary" onClick={handleSaveChanges}>Save Changes</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TasksCard;
