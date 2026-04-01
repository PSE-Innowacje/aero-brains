import React from 'react';
import { Box, Button } from '@mui/material';
import type { FlightOrder, FlightOrderStatus } from '../../api/types';
import { useAuth } from '../../auth/AuthContext';

interface FlightOrderStatusActionsProps {
  flightOrder: FlightOrder;
  onStatusChange: (newStatus: FlightOrderStatus) => void;
  onSettle: (type: 'COMPLETED' | 'PARTIALLY_COMPLETED') => void;
}

const FlightOrderStatusActions: React.FC<FlightOrderStatusActionsProps> = ({
  flightOrder,
  onStatusChange,
  onSettle,
}) => {
  const { user } = useAuth();
  const role = user?.role?.toUpperCase();
  const status = flightOrder.status;

  const buttons: React.ReactNode[] = [];

  // Pilot action when status = INTRODUCED — submit for supervisor approval
  if (role === 'PILOT' && status === 'INTRODUCED') {
    buttons.push(
      <Button
        key="submit"
        variant="contained"
        color="primary"
        onClick={() => onStatusChange('SUBMITTED')}
      >
        Przekaż do akceptacji
      </Button>,
    );
  }

  // Supervisor actions when status = SUBMITTED (Przekazane do akceptacji)
  if (role === 'SUPERVISOR' && status === 'SUBMITTED') {
    buttons.push(
      <Button
        key="reject"
        variant="contained"
        color="error"
        onClick={() => onStatusChange('REJECTED')}
      >
        Odrzuć
      </Button>,
      <Button
        key="accept"
        variant="contained"
        color="success"
        onClick={() => onStatusChange('ACCEPTED')}
      >
        Zaakceptuj
      </Button>,
    );
  }

  // Pilot actions when status = ACCEPTED (Zaakceptowane)
  if (role === 'PILOT' && status === 'ACCEPTED') {
    buttons.push(
      <Button
        key="partial"
        variant="contained"
        color="warning"
        onClick={() => onSettle('PARTIALLY_COMPLETED')}
      >
        Zrealizowane w części
      </Button>,
      <Button
        key="full"
        variant="contained"
        color="success"
        onClick={() => onSettle('COMPLETED')}
      >
        Zrealizowane w całości
      </Button>,
      <Button
        key="not-done"
        variant="contained"
        color="inherit"
        onClick={() => onStatusChange('NOT_COMPLETED')}
      >
        Nie zrealizowane
      </Button>,
    );
  }

  if (buttons.length === 0) return null;

  return (
    <Box display="flex" gap={2} mt={2}>
      {buttons}
    </Box>
  );
};

export default FlightOrderStatusActions;
