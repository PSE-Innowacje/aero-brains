import React from 'react';
import { Chip, type ChipProps } from '@mui/material';

interface StatusBadgeProps {
  statusCode: string | number;
  label: string;
}

const statusColorMap: Record<string, ChipProps['color']> = {
  // Operation statuses
  SUBMITTED: 'info',
  REJECTED: 'error',
  CONFIRMED: 'success',
  SCHEDULED: 'warning',
  PARTIALLY_COMPLETED: 'warning',
  COMPLETED: 'success',
  CANCELLED: 'default',
  // Flight order statuses
  PENDING_APPROVAL: 'info',
  ACCEPTED: 'success',
  NOT_COMPLETED: 'default',
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ statusCode, label }) => {
  const color = statusColorMap[String(statusCode)] ?? 'default';

  return <Chip label={label} color={color} size="small" />;
};

export default StatusBadge;
