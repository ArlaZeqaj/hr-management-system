import React, { useState, useEffect, useCallback } from 'react';
import { getAuth } from 'firebase/auth';
import axios from 'axios';
import '../styles/PerformanceProfileSection.css';

const PerformanceDashboard = () => {
  const auth = getAuth();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [taskCounts, setTaskCounts] = useState({});
  const [projectCounts, setProjectCounts] = useState({});

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const token = await auth.currentUser.getIdToken();
      const yearMonth = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}`;

      const response = await axios.get(`/api/performance/all-with-performance/${yearMonth}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const employeeData = response.data;

      const taskPromises = employeeData.map(emp =>
        axios.get(`/api/schedule/count/${emp.id}/${yearMonth}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => ({ id: emp.id, count: res.data }))
        .catch(() => ({ id: emp.id, count: 0 }))
      );

      const projectPromises = employeeData.map(emp =>
        axios.get(`/api/projects/count/${emp.id}/${yearMonth}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => ({ id: emp.id, count: res.data }))
        .catch(() => ({ id: emp.id, count: 0 }))
      );

      const [taskResults, projectResults] = await Promise.all([
        Promise.all(taskPromises),
        Promise.all(projectPromises)
      ]);

      const taskMap = Object.fromEntries(taskResults.map(t => [t.id, t.count]));
      const projectMap = Object.fromEntries(projectResults.map(p => [p.id, p.count]));

      setEmployees(employeeData);
      setTaskCounts(taskMap);
      setProjectCounts(projectMap);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }, [auth, selectedMonth, selectedYear]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSave = async (employee) => {
    try {
      const token = await auth.currentUser.getIdToken();
      const currentUser = auth.currentUser;

      const reviewData = {
        employeeId: employee.id,
        performanceScore: Number(employee.performanceScore) || 0,
        strengths: Array.isArray(employee.strengths)
          ? employee.strengths
          : (employee.strengths || '').split('\n').filter(s => s.trim()),
        areasForImprovement: Array.isArray(employee.areasForImprovement)
          ? employee.areasForImprovement
          : (employee.areasForImprovement || '').split('\n').filter(s => s.trim()),
        year: selectedYear,
        month: selectedMonth,
        reviewerId: currentUser.uid
      };

      await axios({
        method: employee.reviewId ? 'patch' : 'post',
        url: employee.reviewId
          ? `/api/performance/${employee.reviewId}`
          : '/api/performance/review',
        data: reviewData,
        headers: { Authorization: `Bearer ${token}` }
      });

      fetchData();
      alert('Performance review saved successfully!');
    } catch (error) {
      console.error("Error saving performance review:", error);
      alert(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  if (loading) return (
    <div className="performance-loading">
      <div className="performance-loading-spinner"></div>
      <p>Loading performance data...</p>
    </div>
  );

  return (
    <div className="performance-dashboard">
      <h2>Performance Dashboard</h2>

      <div className="dashboard-controls">
        <div className="date-selectors">
          <label>
            Month:
            <select
              value={selectedMonth}
              onChange={e => setSelectedMonth(parseInt(e.target.value, 10))}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(0, i).toLocaleString('default', { month: 'long' })}
                </option>
              ))}
            </select>
          </label>

          <label>
            Year:
            <input
              type="number"
              value={selectedYear}
              onChange={e => setSelectedYear(parseInt(e.target.value, 10))}
              min="2000"
              max="2100"
            />
          </label>
        </div>

        <button className="refresh-btn" onClick={fetchData}>
          Refresh Data
        </button>
      </div>

      <div className="performance-table-container">
        <table className="performance-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Score</th>
              <th>Tasks</th>
              <th>Projects</th>
              <th>Strengths</th>
              <th>Improvements</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.filter(emp => emp && emp.name).map(emp => (
              <tr key={emp.id}>
                <td>{emp.name}</td>
                <td>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={emp.performanceScore ?? ''}
                    onChange={e => setEmployees(prev =>
                      prev.map(ei =>
                        ei.id === emp.id ? { ...ei, performanceScore: e.target.value } : ei
                      )
                    )}
                  />
                </td>
                <td className="count-cell">{taskCounts[emp.id] ?? '—'}</td>
                <td className="count-cell">{projectCounts[emp.id] ?? '—'}</td>
                <td>
                  <textarea
                    value={
                      Array.isArray(emp.strengths)
                        ? emp.strengths.join('\n')
                        : emp.strengths || ''
                    }
                    onChange={e => setEmployees(prev =>
                      prev.map(ei =>
                        ei.id === emp.id ? { ...ei, strengths: e.target.value } : ei
                      )
                    )}
                  />
                </td>
                <td>
                  <textarea
                    value={
                      Array.isArray(emp.areasForImprovement)
                        ? emp.areasForImprovement.join('\n')
                        : emp.areasForImprovement || ''
                    }
                    onChange={e => setEmployees(prev =>
                      prev.map(ei =>
                        ei.id === emp.id ? { ...ei, areasForImprovement: e.target.value } : ei
                      )
                    )}
                  />
                </td>
                <td>
                  <button className="save-btn" onClick={() => handleSave(emp)}>
                    {emp.reviewId ? 'Update' : 'Create'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PerformanceDashboard;
