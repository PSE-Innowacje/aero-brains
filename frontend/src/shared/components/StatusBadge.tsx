import React from 'react';

interface StatusBadgeProps {
  statusCode: string | number;
  label: string;
}

const statusStyles: Record<string, { color: string; bg: string }> = {
  // Operation statuses
  INTRODUCED:            { color: '#1d4ed8', bg: '#dbeafe' },
  REJECTED:              { color: '#b91c1c', bg: '#fee2e2' },
  CONFIRMED:             { color: '#1a7f4e', bg: '#e6f4ed' },
  SCHEDULED:             { color: '#b45309', bg: '#fef3c7' },
  PARTIALLY_COMPLETED:   { color: '#7c3aed', bg: '#ede9fe' },
  COMPLETED:             { color: '#0f766e', bg: '#ccfbf1' },
  CANCELLED:             { color: '#64748b', bg: '#f1f5f9' },
  // Flight order statuses
  SUBMITTED:             { color: '#b45309', bg: '#fef3c7' },
  ACCEPTED:              { color: '#1a7f4e', bg: '#e6f4ed' },
  NOT_COMPLETED:         { color: '#64748b', bg: '#f1f5f9' },
  // Helicopter statuses
  ACTIVE:                { color: '#1a7f4e', bg: '#e6f4ed' },
  INACTIVE:              { color: '#64748b', bg: '#f1f5f9' },
  // Crew roles
  PILOT:                 { color: '#1e40af', bg: '#dbeafe' },
  OBSERVER:              { color: '#6b21a8', bg: '#f3e8ff' },
  // User roles
  ADMINISTRATOR:         { color: '#7c3aed', bg: '#ede9fe' },
  PLANNER:               { color: '#1d4ed8', bg: '#dbeafe' },
  SUPERVISOR:            { color: '#b45309', bg: '#fef3c7' },
};

const defaultStyle = { color: '#64748b', bg: '#f1f5f9' };

const StatusBadge: React.FC<StatusBadgeProps> = ({ statusCode, label }) => {
  const s = statusStyles[String(statusCode)] ?? defaultStyle;

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: '2px 8px',
        borderRadius: 20,
        fontSize: 10,
        fontWeight: 600,
        fontFamily: 'system-ui, -apple-system, sans-serif',
        color: s.color,
        backgroundColor: s.bg,
        whiteSpace: 'nowrap',
        lineHeight: 1.8,
      }}
    >
      {label}
    </span>
  );
};

export default StatusBadge;
