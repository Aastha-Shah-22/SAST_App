import React from 'react';

function Badge({ type, children }) {
  // 'type' expects strings like: 'critical', 'high', 'medium', 'low', 'open', 'fixed', 'review', 'scanning', 'queued', 'closed'
  return (
    <span className={`badge ${type}`}>
      {children}
    </span>
  );
}

export default Badge;