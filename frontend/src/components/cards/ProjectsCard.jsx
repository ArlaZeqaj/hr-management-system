import React, { useState, useEffect } from "react";
import axios from "axios";
import { auth } from "../../config/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

const ProjectsCard = () => {
    const [counts, setCounts] = useState({
        done: 0,
        ongoing: 0,
        canceled: 0,
        upcoming: 0,
    });
    const [month, setMonth] = useState("");

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    const token = await user.getIdToken();

                    const response = await axios.get("http://localhost:8080/api/projects/summary", {
                        headers: { Authorization: `Bearer ${token}` },
                    });

                    const projects = response.data; // Should be an array

                    // ✅ Smarter counting with reduce
                    setCounts({
                        done: projects.done,
                        ongoing: projects.ongoing,
                        canceled: projects.canceled,
                        upcoming: projects.upcoming,
                    });

                    const now = new Date();
                    setMonth(now.toLocaleString('default', { month: 'long' }));

                } catch (error) {
                    console.error("Error fetching projects:", error);
                }
            } else {
                console.log("No user signed in.");
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <div className="projects-card-z">
            <div className="projects-header-z">
                <h3 className="projects-title-z">Projects</h3>
                <span className="projects-tag-z">{month}</span>
            </div>

            <div className="projects-list-z">
                <div className="projects-item-z">
                    Done <span className="projects-count-z">{counts.done}</span>
                </div>
                <div className="projects-item-z">
                    Ongoing <span className="projects-count-z">{counts.ongoing}</span>
                </div>
                <div className="projects-item-z">
                    Cancel <span className="projects-count-z">{counts.canceled}</span>
                </div>
                <div className="projects-item-z">
                    Upcoming <span className="projects-count-z">{counts.upcoming}</span>
                </div>
            </div>

            <a href="#" className="projects-link-z">See details →</a>
        </div>
    );
};

export default ProjectsCard;
