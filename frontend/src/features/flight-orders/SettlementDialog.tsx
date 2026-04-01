import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  settleFlightOrderSchema,
  type SettleFlightOrderFormData,
} from './flightOrderSchema';
import type {
  FlightOrder,
  FlightOperation,
  OperationSettlementStatus,
  SettleFlightOrderRequest,
} from '../../api/types';

interface SettlementDialogProps {
  open: boolean;
  type: 'COMPLETED' | 'PARTIALLY_COMPLETED';
  flightOrder: FlightOrder;
  operations: FlightOperation[];
  onConfirm: (data: SettleFlightOrderRequest) => void;
  onCancel: () => void;
}

const SettlementDialog: React.FC<SettlementDialogProps> = ({
  open,
  type,
  flightOrder,
  operations,
  onConfirm,
  onCancel,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<SettleFlightOrderFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(settleFlightOrderSchema) as any,
    mode: 'onChange',
    defaultValues: {
      actualStartTime: flightOrder.actualStartTime ?? '',
      actualEndTime: flightOrder.actualEndTime ?? '',
      actualRouteLengthKm: flightOrder.actualRouteLengthKm ?? 0,
    },
  });

  const linkedOperations = operations.filter((op) =>
    flightOrder.operationIds.includes(op.id),
  );

  const [operationStatuses, setOperationStatuses] = React.useState<
    Record<number, OperationSettlementStatus>
  >(() => {
    const initial: Record<number, OperationSettlementStatus> = {};
    for (const op of linkedOperations) {
      initial[op.id] = 'COMPLETED';
    }
    return initial;
  });

  const onSubmit = (data: SettleFlightOrderFormData) => {
    const request: SettleFlightOrderRequest = {
      actualStartTime: data.actualStartTime,
      actualEndTime: data.actualEndTime,
      actualRouteLengthKm: data.actualRouteLengthKm,
    };
    if (type === 'PARTIALLY_COMPLETED') {
      request.operationStatuses = operationStatuses;
    }
    onConfirm(request);
  };

  const title =
    type === 'COMPLETED'
      ? 'Rozliczenie — zrealizowane w całości'
      : 'Rozliczenie — zrealizowane w części';

  return (
    <Dialog open={open} onClose={onCancel} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Controller
              name="actualStartTime"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Rzeczywista data startu *"
                  type="datetime-local"
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.actualStartTime}
                  helperText={errors.actualStartTime?.message}
                  fullWidth
                />
              )}
            />

            <Controller
              name="actualEndTime"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Rzeczywista data ladowania *"
                  type="datetime-local"
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.actualEndTime}
                  helperText={errors.actualEndTime?.message}
                  fullWidth
                />
              )}
            />

            <Controller
              name="actualRouteLengthKm"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  label="Rzeczywista dlugość trasy (km) *"
                  type="number"
                  error={!!errors.actualRouteLengthKm}
                  helperText={errors.actualRouteLengthKm?.message}
                  fullWidth
                />
              )}
            />

            {type === 'PARTIALLY_COMPLETED' && linkedOperations.length > 0 && (
              <>
                <Typography variant="subtitle1" sx={{ mt: 1 }}>
                  Status operacji
                </Typography>
                {linkedOperations.map((op) => (
                  <FormControl key={op.id} fullWidth>
                    <InputLabel>
                      {op.orderProjectNumber}
                      {op.shortDescription ? ` — ${op.shortDescription}` : ''}
                    </InputLabel>
                    <Select
                      label={`${op.orderProjectNumber}${op.shortDescription ? ` — ${op.shortDescription}` : ''}`}
                      value={operationStatuses[op.id] ?? 'COMPLETED'}
                      onChange={(e) =>
                        setOperationStatuses((prev) => ({
                          ...prev,
                          [op.id]: e.target.value as OperationSettlementStatus,
                        }))
                      }
                    >
                      <MenuItem value="COMPLETED">Zrealizowane</MenuItem>
                      <MenuItem value="PARTIALLY_COMPLETED">
                        Częściowo zrealizowane
                      </MenuItem>
                      <MenuItem value="NOT_COMPLETED">Nie zrealizowane</MenuItem>
                    </Select>
                  </FormControl>
                ))}
              </>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onCancel}>Anuluj</Button>
          <Button type="submit" variant="contained" disabled={!isValid}>
            Potwierdź
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default SettlementDialog;
