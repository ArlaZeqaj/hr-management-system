import React, { useEffect, useState } from "react";
import axios from "axios";

const FirebaseTest = () => {
    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:8080/api/employees")
            .then(response => setEmployees(response.data))
            .catch(error => console.error("Error loading employees:", error));
    }, []);

    return (
        <div>
            <h2>Employee List</h2>
            {employees.length > 0 ? (
                <table border="1" cellPadding="10">
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Surname</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Address</th>
                        <th>Gender</th>
                        <th>Birth Date</th>
                        <th>Joined Date</th>
                        <th>Position</th>
                    </tr>
                    </thead>
                    <tbody>
                    {employees.map(emp => (
                        <tr key={emp.id}>
                            <td>{emp.name}</td>
                            <td>{emp.surname}</td>
                            <td>{emp.email}</td>
                            <td>{emp.phoneNumber}</td>
                            <td>{emp.address}</td>
                            <td>{emp.gender}</td>
                            <td>{emp.birthDate}</td>
                            <td>{emp.joinedDate}</td>
                            <td>{emp.position}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <p>No employee data found.</p>
            )}
        </div>
    );
};

export default FirebaseTest;
