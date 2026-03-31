import React from 'react';
import { Box, Button } from '@mui/material';
import type { Operation, OperationStatusCode } from '../../api/types';
import { useAuth } from '../../auth/AuthContext';

interface OperationStatusActionsProps {
  operation: Operation;
  onStatusChange: (newStatus: OperationStatusCode) => void;
}

const OperationStatusActions: React.FC<OperationStatusActionsProps> = ({
  operation,
  onStatusChange,
}) => {
  const { user } = useAuth();
  const role = user?.role;
  const status = operation.status;

  const buttons: React.ReactNode[] = [];

  if (role === 'supervisor' && status === 1) {
    buttons.push(
      <Button
        key="reject"
        variant="contained"
        color="error"
        onClick={() => onStatusChange(2)}
      >
        Odrzuć
      </Button>,
      <Button
        key="confirm"
        variant="contained"
        color="success"
        onClick={() => onStatusChange(3)}
      >
        Potwierdź do planu
      </Button>,
    );
  }

  if (role === 'planner' && [1, 3, 4].includes(status)) {
    buttons.push(
      <Button
        key="resign"
        variant="contained"
        color="inherit"
        onClick={() => onStatusChange(7)}
      >
        Rezygnuj
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

export default OperationStatusActions;
