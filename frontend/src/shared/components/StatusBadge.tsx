import React from 'react';

interface StatusBadgeProps {
  statusCode: string | number;
  label: string;
}

const statusStyles: Record<string, { color: string; bg: string; icon: string }> = {
  // Operation statuses
  INTRODUCED:            { color: '#1d4ed8', bg: '#dbeafe', icon: '●' },
  REJECTED:              { color: '#b91c1c', bg: '#fee2e2', icon: '✕' },
  CONFIRMED:             { color: '#1a7f4e', bg: '#e6f4ed', icon: '✓' },
  SCHEDULED:             { color: '#b45309', bg: '#fef3c7', icon: '◷' },
  PARTIALLY_COMPLETED:   { color: '#7c3aed', bg: '#ede9fe', icon: '◑' },
  COMPLETED:             { color: '#0f766e', bg: '#ccfbf1', icon: '✔' },
  CANCELLED:             { color: '#64748b', bg: '#f1f5f9', icon: '⊘' },
  // Flight order statuses
  SUBMITTED:             { color: '#b45309', bg: '#fef3c7', icon: '↗' },
  ACCEPTED:              { color: '#1a7f4e', bg: '#e6f4ed', icon: '✓' },
  NOT_COMPLETED:         { color: '#64748b', bg: '#f1f5f9', icon: '⊘' },
  // Helicopter statuses
  ACTIVE:                { color: '#1a7f4e', bg: '#e6f4ed', icon: '✓' },
  INACTIVE:              { color: '#64748b', bg: '#f1f5f9', icon: '●' },
  // Crew roles
  PILOT:                 { color: '#1e40af', bg: '#dbeafe', icon: '✈' },
  OBSERVER:              { color: '#6b21a8', bg: '#f3e8ff', icon: '\u{1F441}' },
  // User roles
  ADMINISTRATOR:         { color: '#7c3aed', bg: '#ede9fe', icon: '' },
  PLANNER:               { color: '#1d4ed8', bg: '#dbeafe', icon: '' },
  SUPERVISOR:            { color: '#b45309', bg: '#fef3c7', icon: '' },
};

const defaultStyle = { color: '#64748b', bg: '#f1f5f9', icon: '' };

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
      {s.icon && <span style={{ fontSize: 10, lineHeight: 1 }}>{s.icon}</span>}
      {label}
    </span>
  );
};

export default StatusBadge;
