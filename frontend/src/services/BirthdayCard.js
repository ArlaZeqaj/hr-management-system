import React from 'react';
import PropTypes from 'prop-types';
import { useBirthdays } from '../services/BirthdayContext';
import '../styles/BirthdayCard.css';

const BirthdayCard = ({
  showDepartment = true,
  showSendButton = true,
  customClassName = '',
  onSendWish = () => {}
}) => {
  const { allEmployees, loading, error, refreshEmployees } = useBirthdays();

  const getTodaysBirthdays = () => {
    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentDay = today.getDate();

    return allEmployees.filter(employee => {
      if (!employee.birthDate) return false;

      try {
        const [year, month, day] = employee.birthDate.split('-').map(Number);
        if (isNaN(day) || isNaN(month) || isNaN(year)) return false;
        return month === currentMonth && day === currentDay;
      } catch (e) {
        console.error('Error parsing birthdate:', employee.birthDate, e);
        return false;
      }
    });
  };

  const todaysBirthdays = getTodaysBirthdays();

  const handleSendWish = (employee) => {
    onSendWish(employee);
  };

  return (
    <div className={`birthday-card ${customClassName}`}>
      <div className="birthday-header">
        <div className="header-content">
          <span className="birthday-icon">🎂</span>
          <h3>Today's Birthdays</h3>
        </div>
        <button
          onClick={refreshEmployees}
          className="refresh-btn"
          disabled={loading}
          aria-label="Refresh birthdays"
        >
          🔄
        </button>
      </div>

      <div className="birthday-list">
        {loading ? (
          <div className="birthday-loading">
            <div className="loading-spinner"></div>
            <span>Loading birthdays...</span>
          </div>
        ) : error ? (
          <div className="birthday-error">
            <p>⚠️ Failed to load birthdays</p>
            <button onClick={refreshEmployees}>Retry</button>
          </div>
        ) : todaysBirthdays.length > 0 ? (
          <ul className="birthday-items">
            {todaysBirthdays.map((employee) => (
              <li key={employee.id} className="birthday-item">
                <div className="employee-info">
                  <div className="name-email">
                    <span className="employee-name">{employee.name}</span>
                    <span className="employee-email">{employee.email}</span>
                  </div>
                  {showDepartment && employee.department && (
                    <span className="employee-department">
                      {employee.department}
                    </span>
                  )}
                </div>
                {showSendButton && (
                  <button
                    className="wish-btn"
                    onClick={() => handleSendWish(employee)}
                    disabled={loading}
                  >
                    🎉 Send Wish
                  </button>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div className="no-birthdays">
            <p>🎈 No birthdays today</p>
          </div>
        )}
      </div>
    </div>
  );
};

BirthdayCard.propTypes = {
  showDepartment: PropTypes.bool,
  showSendButton: PropTypes.bool,
  customClassName: PropTypes.string,
  onSendWish: PropTypes.func,
};

export default BirthdayCard;