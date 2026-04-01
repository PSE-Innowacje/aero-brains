import React from 'react';
import { Box, Button, Tooltip } from '@mui/material';
import type { Operation, OperationStatus } from '../../api/types';
import { useAuth } from '../../auth/AuthContext';

interface OperationStatusActionsProps {
  operation: Operation;
  onStatusChange: (newStatus: OperationStatus) => void;
  plannedDateFrom?: string;
  plannedDateTo?: string;
}

const OperationStatusActions: React.FC<OperationStatusActionsProps> = ({
  operation,
  onStatusChange,
  plannedDateFrom,
  plannedDateTo,
}) => {
  const { user } = useAuth();
  const role = user?.role;
  const status = operation.status;

  const buttons: React.ReactNode[] = [];

  if (role === 'SUPERVISOR' && status === 'INTRODUCED') {
    buttons.push(
      <Button
        key="reject"
        variant="contained"
        color="error"
        onClick={() => onStatusChange('REJECTED')}
      >
        Odrzuć
      </Button>,
    );

    const hasPlannedDates = !!(plannedDateFrom && plannedDateTo);
    buttons.push(
      <Tooltip
        key="confirm-tip"
        title={hasPlannedDates ? '' : 'Wymagane wypełnienie planowanych dat'}
        arrow
      >
        <span>
          <Button
            key="confirm"
            variant="contained"
            color="success"
            disabled={!hasPlannedDates}
            onClick={() => onStatusChange('CONFIRMED')}
          >
            Potwierdź do planu
          </Button>
        </span>
      </Tooltip>,
    );
  }

  if (role === 'PLANNER' && ['INTRODUCED', 'CONFIRMED', 'SCHEDULED'].includes(status)) {
    buttons.push(
      <Button
        key="resign"
        variant="contained"
        color="inherit"
        onClick={() => onStatusChange('CANCELLED')}
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
