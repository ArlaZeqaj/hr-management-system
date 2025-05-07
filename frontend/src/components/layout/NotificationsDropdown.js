export default function NotificationsDropdown({ notifications, isOpen }) {
    if (!isOpen) return null;
  
    // Calculate unread notifications count
    const unreadCount = notifications.filter(
      (notification) => !notification.read
    ).length;
  
    return (
      <div
        className="notifications-dropdown"
        style={{
          position: "absolute",
          top: "45px",
          right: "0",
          width: "320px",
          backgroundColor: "white",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          zIndex: 9999,
          overflow: "hidden",
          display: isOpen ? "block" : "none",
        }}
      >
        <div
          className="dropdown-header"
          style={{ padding: "16px", borderBottom: "1px solid #e9ecef" }}
        >
          <h3>
            Notifications{" "}
            <span className="notification-count">{unreadCount} unread</span>
          </h3>
          <button className="text-btn">Mark all as read</button>
        </div>
        <div
          className="notifications-list"
          style={{ maxHeight: "320px", overflowY: "auto" }}
        >
          {notifications && notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`notification-item ${
                  notification.read ? "read" : "unread"
                }`}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "12px",
                  padding: "12px 16px",
                  borderBottom: "1px solid #e9ecef",
                  backgroundColor: notification.read
                    ? "transparent"
                    : "rgba(124, 58, 237, 0.05)",
                  cursor: "pointer",
                }}
              >
                <div
                  className="notification-icon"
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    backgroundColor: "#f1f5f9",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#7c3aed",
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                </div>
                <div className="notification-content" style={{ flex: 1 }}>
                  <div
                    className="notification-title"
                    style={{
                      fontSize: "14px",
                      marginBottom: "4px",
                      fontWeight: notification.read ? "normal" : "500",
                    }}
                  >
                    {notification.title}
                  </div>
                  <div
                    className="notification-time"
                    style={{ fontSize: "12px", color: "#64748b" }}
                  >
                    {notification.time}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div
              style={{ padding: "16px", textAlign: "center", color: "#64748b" }}
            >
              No notifications to display
            </div>
          )}
        </div>
        <div
          className="notification-actions"
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "8px 16px",
            borderTop: "1px solid #e9ecef",
          }}
        >
          <button
            className="text-btn"
            style={{
              background: "none",
              border: "none",
              color: "#7c3aed",
              fontSize: "12px",
              cursor: "pointer",
              padding: "0",
            }}
          >
            View all
          </button>
          <button
            className="text-btn"
            style={{
              background: "none",
              border: "none",
              color: "#7c3aed",
              fontSize: "12px",
              cursor: "pointer",
              padding: "0",
            }}
          >
            Settings
          </button>
        </div>
      </div>
    );
  }
  