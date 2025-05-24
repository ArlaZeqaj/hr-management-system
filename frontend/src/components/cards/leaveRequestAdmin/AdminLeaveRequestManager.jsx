import React, { useEffect, useState } from "react";
import axios from "axios";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../config/firebaseConfig";

const AdminLeaveRequestManager = () => {
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [filterStatus, setFilterStatus] = useState("All");

    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            if (!user) return;
            const token = await user.getIdToken();

            try {
                const res = await axios.get("/api/leaves/all", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const data = res.data.map(req => ({
                    ...req,
                    employee: req.employee || `User (${req.employeeId})`,
                    type: req.leaveType,
                    days:
                        (new Date(req.endDate) - new Date(req.startDate)) /
                        (1000 * 60 * 60 * 24) +
                        1,
                }));

                setLeaveRequests(data);
            } catch (err) {
                console.error("❌ Failed to fetch leave requests:", err);
                alert("Failed to load leave requests");
            }
        });
    }, []);

    const handleLeaveAction = async (employeeId, leaveId, action) => {
        try {
            const token = await auth.currentUser.getIdToken();
            await axios.patch(`/api/leaves/${employeeId}/${leaveId}/${action}`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setLeaveRequests(prev =>
                prev.filter(req => req.id !== leaveId)
            );

            alert(`Leave ${action}d successfully`);
        } catch (err) {
            alert("Failed to update leave status");
            console.error(err);
        }
    };

    // Filtered display logic
    const filteredRequests = leaveRequests.filter(req => {
        if (filterStatus === "All") return true;
        return req.status?.toLowerCase() === filterStatus.toLowerCase();
    });

    return (
        <div className="leaves-tab">
            <div className="table-header">
                <h3>Leave Requests Management</h3>
                <div className="view-options-lr">
                    {["All", "Submitted", "Approved", "Rejected"].map(status => (
                        <button
                            key={status}
                            className={`view-option ${filterStatus === status ? "active" : ""}`}
                            onClick={() => setFilterStatus(status)}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            <div className="table-responsive">
                <table className="leaves-table">
                    <thead>
                    <tr>
                        <th>Employee</th>
                        <th>Leave Type</th>
                        <th>Date Range</th>
                        <th>Duration</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredRequests.map(req => (
                        <tr key={req.id}>
                            <td>{req.employee}</td>
                            <td>{req.type}</td>
                            <td>{req.startDate} to {req.endDate}</td>
                            <td>{req.days} days</td>
                            <td>
                                <span className={`status-badge ${req.status.toLowerCase()}`}>{req.status}</span>

                            </td>
                            <td>
                                {req.status.toLowerCase() === "submitted" && (
                                    <div className="action-buttons">
                                        <button
                                            className="btn success sm"
                                            onClick={() =>
                                                handleLeaveAction(req.employeeId, req.id, "approve")
                                            }
                                        >
                                            Approve
                                        </button>
                                        <button
                                            className="btn danger sm"
                                            onClick={() =>
                                                handleLeaveAction(req.employeeId, req.id, "reject")
                                            }
                                        >
                                            Reject
                                        </button>
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminLeaveRequestManager;
