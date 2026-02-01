import React from "react";

/* All .severity styles live in global.css */

const LEVEL_MAP = {
  CRITICAL: "critical",
  HIGH: "high",
  MEDIUM: "medium",
  LOW: "low",
  INFO: "info",
  NONE: "none",
};

function SeverityBadge({ level = "INFO" }) {
  const key = LEVEL_MAP[level?.toUpperCase()] || "none";
  return <span className={`severity severity--${key}`}>{level}</span>;
}

export default SeverityBadge;