import React from 'react';

function Toast({ toast }) {
  // Destructure the values from the toast object passed from App.jsx
  const { show, title, msg, type } = toast;

  // Determine the border color based on success or danger
  const borderColor = type === 'danger' ? 'var(--danger)' : 'var(--success)';

  return (
    <div 
      className={`toast ${show ? 'show' : ''}`} 
      style={{ borderLeftColor: borderColor }}
    >
      <div className="toast-title">{title}</div>
      <div className="toast-msg">{msg}</div>
    </div>
  );
}

export default Toast;