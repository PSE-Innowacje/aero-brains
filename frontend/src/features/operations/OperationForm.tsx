import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormHelperText,
  Stack,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { operationSchema, type OperationFormData } from './operationSchema';
import OperationMap from './OperationMap';
import OperationStatusActions from './OperationStatusActions';
import KmlUpload from './KmlUpload';
import type { KmlPoint } from '../../shared/utils/kml';
import StatusBadge from '../../shared/components/StatusBadge';
import { api } from '../../api/client';
import {
  OPERATION_STATUS_LABELS,
  ACTIVITY_TYPE_LABELS,
  type ActivityType,
  type OperationStatusCode,
} from '../../api/types';
import { useAuth } from '../../auth/AuthContext';
import {
  canEdit,
  canEditOperation,
  plannerBlockedFields,
} from '../../shared/utils/permissions';

const activityTypeOptions: { value: ActivityType; label: string }[] = (
  Object.entries(ACTIVITY_TYPE_LABELS) as [ActivityType, string][]
).map(([value, label]) => ({ value, label }));

const OperationForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isNew = id === 'new';
  const operationId = isNew ? null : Number(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const role = user?.role;

  const [kmlPoints, setKmlPoints] = useState<KmlPoint[]>([]);
  const [kmlFileName, setKmlFileName] = useState<string>('');

  const { data: operation, isLoading } = useQuery({
    queryKey: ['operations', operationId],
    queryFn: () => api.operations.getById(operationId!),
    enabled: !isNew && operationId !== null,
  });

  const hasEditAccess = role ? canEdit(role, 'operations') : false;
  const canEditStatus =
    hasEditAccess && operation ? canEditOperation(role!, operation.status) : false;
  const readOnly = isNew ? !hasEditAccess : !hasEditAccess || !canEditStatus;

  const isFieldDisabled = (fieldName: string): boolean => {
    if (readOnly) return true;
    if (role === 'planner' && plannerBlockedFields.includes(fieldName)) return true;
    return false;
  };

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<OperationFormData>({
    resolver: zodResolver(operationSchema),
    defaultValues: {
      orderNumber: '',
      shortDescription: '',
      proposedDateFrom: '',
      proposedDateTo: '',
      activityTypes: [],
      additionalInfo: '',
      routeDistanceKm: 0,
      plannedDateFrom: '',
      plannedDateTo: '',
      postRealizationNotes: '',
    },
  });

  useEffect(() => {
    if (operation) {
      reset({
        orderNumber: operation.orderNumber,
        shortDescription: operation.shortDescription,
        proposedDateFrom: operation.proposedDateFrom ?? '',
        proposedDateTo: operation.proposedDateTo ?? '',
        activityTypes: operation.activityTypes,
        additionalInfo: operation.additionalInfo ?? '',
        routeDistanceKm: operation.routeDistanceKm,
        plannedDateFrom: operation.plannedDateFrom ?? '',
        plannedDateTo: operation.plannedDateTo ?? '',
        postRealizationNotes: operation.postRealizationNotes ?? '',
      });
      if (operation.kmlPoints) {
        setKmlPoints(operation.kmlPoints);
      }
      if (operation.kmlFileName) {
        setKmlFileName(operation.kmlFileName);
      }
    }
  }, [operation, reset]);

  const saveMutation = useMutation({
    mutationFn: (data: OperationFormData) => {
      const payload = {
        ...data,
        proposedDateFrom: data.proposedDateFrom || undefined,
        proposedDateTo: data.proposedDateTo || undefined,
        additionalInfo: data.additionalInfo || undefined,
        plannedDateFrom: data.plannedDateFrom || undefined,
        plannedDateTo: data.plannedDateTo || undefined,
        postRealizationNotes: data.postRealizationNotes || undefined,
        kmlPoints: kmlPoints.length > 0 ? kmlPoints : undefined,
        kmlFileName: kmlFileName || undefined,
      };
      if (isNew) {
        return api.operations.create({
          ...payload,
          status: 1 as OperationStatusCode,
          comments: [],
          createdBy: user?.email ?? '',
          linkedFlightOrderIds: [],
        });
      }
      return api.operations.update(operationId!, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['operations'] });
      navigate('/operations');
    },
  });

  const statusMutation = useMutation({
    mutationFn: (newStatus: OperationStatusCode) =>
      api.operations.updateStatus(operationId!, newStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['operations'] });
      navigate('/operations');
    },
  });

  const onSubmit = (data: OperationFormData) => {
    saveMutation.mutate(data);
  };

  const handleStatusChange = (newStatus: OperationStatusCode) => {
    statusMutation.mutate(newStatus);
  };

  if (!user || (!isNew && isLoading)) {
    return <Typography>Ładowanie...</Typography>;
  }

  return (
    <Box maxWidth={800}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/operations')}
        sx={{ mb: 1 }}
      >
        Powrót do listy
      </Button>
      <Typography variant="h5" mb={2}>
        {isNew ? 'Nowa operacja' : `Operacja ${operation?.operationNumber ?? ''}`}
      </Typography>

      {operation && (
        <Box mb={2}>
          <StatusBadge
            statusCode={operation.status}
            label={OPERATION_STATUS_LABELS[operation.status]}
          />
        </Box>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <Controller
            name="orderNumber"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Numer zlecenia"
                error={!!errors.orderNumber}
                helperText={errors.orderNumber?.message}
                fullWidth
                disabled={isFieldDisabled('orderNumber')}
              />
            )}
          />

          <Controller
            name="shortDescription"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Krótki opis"
                error={!!errors.shortDescription}
                helperText={errors.shortDescription?.message}
                fullWidth
                disabled={isFieldDisabled('shortDescription')}
              />
            )}
          />

          <Controller
            name="proposedDateFrom"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Proponowana data od"
                type="date"
                InputLabelProps={{ shrink: true }}
                error={!!errors.proposedDateFrom}
                helperText={errors.proposedDateFrom?.message}
                fullWidth
                disabled={isFieldDisabled('proposedDateFrom')}
              />
            )}
          />

          <Controller
            name="proposedDateTo"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Proponowana data do"
                type="date"
                InputLabelProps={{ shrink: true }}
                error={!!errors.proposedDateTo}
                helperText={errors.proposedDateTo?.message}
                fullWidth
                disabled={isFieldDisabled('proposedDateTo')}
              />
            )}
          />

          <Controller
            name="activityTypes"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.activityTypes} disabled={isFieldDisabled('activityTypes')}>
                <InputLabel>Rodzaj czynności</InputLabel>
                <Select
                  {...field}
                  multiple
                  label="Rodzaj czynności"
                  renderValue={(selected) => (
                    <Box display="flex" flexWrap="wrap" gap={0.5}>
                      {(selected as ActivityType[]).map((value) => (
                        <Chip key={value} label={ACTIVITY_TYPE_LABELS[value]} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  {activityTypeOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
                {errors.activityTypes && (
                  <FormHelperText>{errors.activityTypes.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />

          <Controller
            name="additionalInfo"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Dodatkowe informacje"
                multiline
                rows={3}
                error={!!errors.additionalInfo}
                helperText={errors.additionalInfo?.message}
                fullWidth
                disabled={isFieldDisabled('additionalInfo')}
              />
            )}
          />

          {/* KML file upload */}
          <KmlUpload
            points={kmlPoints}
            onPointsChange={(points, distanceKm) => {
              setKmlPoints(points);
              setValue('routeDistanceKm', distanceKm);
            }}
            disabled={readOnly}
            fileName={kmlFileName}
            onFileNameChange={setKmlFileName}
          />

          <Controller
            name="routeDistanceKm"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                onChange={(e) => field.onChange(Number(e.target.value))}
                label="Dystans trasy (km)"
                type="number"
                error={!!errors.routeDistanceKm}
                helperText={errors.routeDistanceKm?.message}
                fullWidth
                disabled={isFieldDisabled('routeDistanceKm')}
              />
            )}
          />

          <Controller
            name="plannedDateFrom"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Planowana data od"
                type="date"
                InputLabelProps={{ shrink: true }}
                error={!!errors.plannedDateFrom}
                helperText={errors.plannedDateFrom?.message}
                fullWidth
                disabled={isFieldDisabled('plannedDateFrom')}
              />
            )}
          />

          <Controller
            name="plannedDateTo"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Planowana data do"
                type="date"
                InputLabelProps={{ shrink: true }}
                error={!!errors.plannedDateTo}
                helperText={errors.plannedDateTo?.message}
                fullWidth
                disabled={isFieldDisabled('plannedDateTo')}
              />
            )}
          />

          <Controller
            name="postRealizationNotes"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Uwagi porealizacyjne"
                multiline
                rows={3}
                error={!!errors.postRealizationNotes}
                helperText={errors.postRealizationNotes?.message}
                fullWidth
                disabled={isFieldDisabled('postRealizationNotes')}
              />
            )}
          />

          {/* Contact persons - read-only */}
          {operation?.contactPersons && operation.contactPersons.length > 0 && (
            <TextField
              label="Osoby kontaktowe"
              value={operation.contactPersons.join(', ')}
              fullWidth
              disabled
            />
          )}

          {/* Comments section - read-only */}
          {operation?.comments && operation.comments.length > 0 && (
            <Box>
              <Divider sx={{ my: 1 }} />
              <Typography variant="h6" mb={1}>
                Komentarze
              </Typography>
              <List dense>
                {operation.comments.map((comment, idx) => (
                  <ListItem key={idx}>
                    <ListItemText
                      primary={comment.text}
                      secondary={`${comment.author} — ${comment.date}`}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}

          {!readOnly && (
            <Box display="flex" gap={2}>
              <Button
                type="submit"
                variant="contained"
                disabled={saveMutation.isPending}
              >
                Zapisz
              </Button>
              <Button variant="outlined" onClick={() => navigate('/operations')}>
                Anuluj
              </Button>
            </Box>
          )}

          {readOnly && (
            <Box display="flex" gap={2}>
              <Button variant="outlined" onClick={() => navigate('/operations')}>
                Anuluj
              </Button>
            </Box>
          )}
        </Stack>
      </form>

      {/* Map */}
      <Box mt={3}>
        <Typography variant="h6" mb={1}>
          Mapa trasy
        </Typography>
        <OperationMap points={kmlPoints} />
      </Box>

      {/* Status actions */}
      {operation && !isNew && (
        <OperationStatusActions
          operation={operation}
          onStatusChange={handleStatusChange}
        />
      )}
    </Box>
  );
};

export default OperationForm;
