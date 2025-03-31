import React, { useState, useEffect } from "react";

const EmployeePage = () => {
    const [employee, setEmployee] = useState(null);

    useEffect(() => {
        fetch("http://localhost:8080/api/employees/random")
            .then((response) => response.json())
            .then((data) => setEmployee(data))
            .catch((error) => console.error("Error fetching employee:", error));
    }, []);

    if (!employee) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{ textAlign: "center", margin: "20px" }}>
            <h1>Employee of the Day</h1>
            <h2>{employee.name}</h2>
            <img
                src={employee.photoUrl}
                alt={employee.name}
                style={{ maxWidth: "100%", height: "auto" }}
            />
        </div>
    );
};

export default EmployeePage;
