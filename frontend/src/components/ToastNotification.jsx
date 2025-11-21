import { useState, useEffect } from 'react';
import '../styles/toasts.css';

export default function ToastNotification({ id, message, type = 'info', duration = 4000, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose?.(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  return (
    <div className={`toast toast-${type} toast-enter`}>
      <div className="toast-content">
        {type === 'success' && <span className="toast-icon">✅</span>}
        {type === 'error' && <span className="toast-icon">❌</span>}
        {type === 'warning' && <span className="toast-icon">⚠️</span>}
        {type === 'info' && <span className="toast-icon">ℹ️</span>}
        <span className="toast-message">{message}</span>
      </div>
      <div className="toast-progress" style={{ animation: `progress ${duration}ms linear` }} />
    </div>
  );
}
