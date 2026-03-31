import React from 'react';
import { Chip, type ChipProps } from '@mui/material';

interface StatusBadgeProps {
  statusCode: number;
  label: string;
}

const statusColorMap: Record<number, ChipProps['color']> = {
  1: 'info',      // Wprowadzone
  2: 'error',     // Odrzucone
  3: 'success',   // Potwierdzone
  4: 'warning',   // Zaplanowane
  5: 'warning',   // Częściowo zrealizowane
  6: 'success',   // Zrealizowane
  7: 'default',   // Rezygnacja
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ statusCode, label }) => {
  const color = statusColorMap[statusCode] ?? 'default';

  return <Chip label={label} color={color} size="small" />;
};

export default StatusBadge;
