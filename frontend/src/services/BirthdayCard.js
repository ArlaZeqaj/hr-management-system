import React, { useState } from 'react';
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
  const [sentWishes, setSentWishes] = useState({});
  const [showTooltip, setShowTooltip] = useState(null);

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
    if (!sentWishes[employee.id]) {
      onSendWish(employee);
      setSentWishes(prev => ({ ...prev, [employee.id]: true }));

      // Show the funny tooltip
      setShowTooltip(employee.id);
      setTimeout(() => setShowTooltip(null), 3000);
    }
  };

  const funnyMessages = [
    "Did you really just email 'Happy Bday'?",
    "That's cold. Where's the personal touch?",
    "Wow, such effort. Much birthday. Very generic.",
    "Sent via email? How... corporate of you."
  ];

  const getRandomMessage = () => {
    return funnyMessages[Math.floor(Math.random() * funnyMessages.length)];
  };

  // Generate random balloon colors
  const balloonColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#A37EBA', '#FFA07A'];

  return (
    <div className={`birthday-card-ep ${customClassName}`}>
      {/* Decorative balloons */}
      <div className="balloons-container-ep">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="balloon-ep"
            style={{
              left: `${10 + (i * 15)}%`,
              backgroundColor: balloonColors[i % balloonColors.length],
              animationDelay: `${i * 0.2}s`
            }}
          />
        ))}
      </div>

      <div className="birthday-content-ep">
        <div className="birthday-header-ep">
          <div className="header-content-ep">
            <div className="birthday-icon-container-ep">
              <span className="birthday-icon-ep">🎂</span>
              <div className="sparkles-ep">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="sparkle-ep" style={{ transform: `rotate(${i * 45}deg)` }} />
                ))}
              </div>
            </div>
            <h3>Today's Celebrations</h3>
            <p className="birthday-subtitle-ep">Wish your colleagues a happy birthday!</p>
          </div>
          <button
            onClick={refreshEmployees}
            className="refresh-btn-ep"
            disabled={loading}
            aria-label="Refresh birthdays"
          >
            🔄
          </button>
        </div>

        <div className="birthday-list-ep">
          {loading ? (
            <div className="birthday-loading-ep">
              <div className="loading-spinner-ep"></div>
              <span>Loading birthdays...</span>
            </div>
          ) : error ? (
            <div className="birthday-error-ep">
              <p>⚠️ Failed to load birthdays</p>
              <button onClick={refreshEmployees}>Retry</button>
            </div>
          ) : todaysBirthdays.length > 0 ? (
            <ul className="birthday-items-ep">
              {todaysBirthdays.map((employee) => (
                <li key={employee.id} className="birthday-item-ep">
                  <div className="employee-avatar-ep">
                    {employee.avatarURL ? (
                      <img src={employee.avatarURL} alt={employee.name} />
                    ) : (
                      <div className="avatar-placeholder-ep">
                        {employee.name.charAt(0)}
                      </div>
                    )}
                    <div className="birthday-badge-ep">🎈</div>
                  </div>
                  <div className="employee-info-ep">
                    <div className="name-email-ep">
                      <span className="employee-name-ep">{employee.name}</span>
                      <span className="employee-email-ep">{employee.email}</span>
                    </div>
                    {showDepartment && employee.department && (
                      <span className="employee-department-ep">
                        {employee.department}
                      </span>
                    )}
                  </div>
                  {showSendButton && (
                    <div className="wish-button-container-ep">
                      <button
                        className={`wish-btn-ep ${sentWishes[employee.id] ? 'wish-sent-ep' : ''}`}
                        onClick={() => handleSendWish(employee)}
                        disabled={loading || sentWishes[employee.id]}
                      >
                        <span className="wish-icon-ep">🎉</span>
                        <span className="wish-text-ep">
                          {sentWishes[employee.id] ? 'Wish Sent!' : 'Send Wish'}
                        </span>
                      </button>
                      {showTooltip === employee.id && (
                        <div className="wish-tooltip-ep">
                          {getRandomMessage()}
                        </div>
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <div className="no-birthdays-ep">
              <div className="no-birthdays-icon-ep">🎈</div>
              <p>No birthdays today</p>
              <p className="no-birthdays-subtext-ep">Check back tomorrow!</p>
            </div>
          )}
        </div>
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