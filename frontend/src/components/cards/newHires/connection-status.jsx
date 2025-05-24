"use client"

import { useState, useEffect } from "react"

const ConnectionStatus = ({ status, error, onRetry }) => {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (status) {
      setVisible(true)
      const timer = setTimeout(
        () => {
          setVisible(false)
        },
        error ? 10000 : 3000,
      )

      return () => clearTimeout(timer)
    }
  }, [status, error])

  if (!visible || !status) return null

  return (
    <div className={`connection-status ${error ? "error" : "success"}`}>
      <div className="connection-status-content">
        <span>{status}</span>
        {error && (
          <button className="retry-button" onClick={onRetry}>
            Retry
          </button>
        )}
      </div>
    </div>
  )
}

export default ConnectionStatus
