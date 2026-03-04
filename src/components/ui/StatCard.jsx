import React from 'react';

function StatCard({ type, label, value, subText, valueColor }) {
  // 'type' expects strings like: 'critical', 'high', 'medium', 'low', 'accent', 'purple' 
  // to change the bottom border color via your CSS classes.
  
  return (
    <div className={`stat-card ${type}`}>
      <div className="stat-label">{label}</div>
      <div 
        className="stat-value" 
        style={{ color: valueColor || 'var(--text)' }} // Falls back to default text color if none provided
      >
        {value}
      </div>
      <div className="stat-sub">{subText}</div>
    </div>
  );
}

export default StatCard;