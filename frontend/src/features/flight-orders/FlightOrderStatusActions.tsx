import React from 'react';
import { Box, Button } from '@mui/material';
import type { FlightOrder, FlightOrderStatusCode } from '../../api/types';
import { useAuth } from '../../auth/AuthContext';

interface FlightOrderStatusActionsProps {
  flightOrder: FlightOrder;
  onStatusChange: (newStatus: FlightOrderStatusCode) => void;
}

const FlightOrderStatusActions: React.FC<FlightOrderStatusActionsProps> = ({
  flightOrder,
  onStatusChange,
}) => {
  const { user } = useAuth();
  const role = user?.role;
  const status = flightOrder.status;

  const buttons: React.ReactNode[] = [];

  // Supervisor actions when status = 2 (Przekazane do akceptacji)
  if (role === 'supervisor' && status === 2) {
    buttons.push(
      <Button
        key="reject"
        variant="contained"
        color="error"
        onClick={() => onStatusChange(3)}
      >
        Odrzuć
      </Button>,
      <Button
        key="accept"
        variant="contained"
        color="success"
        onClick={() => onStatusChange(4)}
      >
        Zaakceptuj
      </Button>,
    );
  }

  // Pilot actions when status = 4 (Zaakceptowane)
  if (role === 'pilot' && status === 4) {
    buttons.push(
      <Button
        key="partial"
        variant="contained"
        color="warning"
        onClick={() => onStatusChange(5)}
      >
        Zrealizowane w części
      </Button>,
      <Button
        key="full"
        variant="contained"
        color="success"
        onClick={() => onStatusChange(6)}
      >
        Zrealizowane w całości
      </Button>,
      <Button
        key="not-done"
        variant="contained"
        color="inherit"
        onClick={() => onStatusChange(7)}
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
