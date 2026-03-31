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
import StatusBadge from '../../shared/components/StatusBadge';
import { api } from '../../api/client';
import {
  OPERATION_STATUS_LABELS,
  ACTIVITY_TYPE_LABELS,
  type ActivityType,
  type OperationStatus,
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

  const [geojsonContent, setGeojsonContent] = useState<string>('');
  const [kmlFileName, setKmlFileName] = useState<string>('');

  // Parse geojsonContent into points for the map
  const mapPoints = (() => {
    if (!geojsonContent) return [];
    try {
      const geojson = JSON.parse(geojsonContent);
      const points: Array<{ lat: number; lng: number }> = [];
      if (geojson.type === 'FeatureCollection' && Array.isArray(geojson.features)) {
        for (const feature of geojson.features) {
          if (feature.geometry?.type === 'Point' && Array.isArray(feature.geometry.coordinates)) {
            points.push({ lat: feature.geometry.coordinates[1], lng: feature.geometry.coordinates[0] });
          }
        }
      } else if (geojson.type === 'Feature' && geojson.geometry?.type === 'Point') {
        points.push({ lat: geojson.geometry.coordinates[1], lng: geojson.geometry.coordinates[0] });
      } else if (geojson.type === 'LineString' && Array.isArray(geojson.coordinates)) {
        for (const coord of geojson.coordinates) {
          points.push({ lat: coord[1], lng: coord[0] });
        }
      }
      return points;
    } catch {
      return [];
    }
  })();

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
    if (role === 'PLANNER' && plannerBlockedFields.includes(fieldName)) return true;
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
      orderProjectNumber: '',
      shortDescription: '',
      proposedDateFrom: '',
      proposedDateTo: '',
      activities: [],
      additionalInfo: '',
      routeLengthKm: 0,
      plannedDateFrom: '',
      plannedDateTo: '',
      postCompletionNotes: '',
    },
  });

  useEffect(() => {
    if (operation) {
      reset({
        orderProjectNumber: operation.orderProjectNumber,
        shortDescription: operation.shortDescription,
        proposedDateFrom: operation.proposedDateFrom ?? '',
        proposedDateTo: operation.proposedDateTo ?? '',
        activities: operation.activities,
        additionalInfo: operation.additionalInfo ?? '',
        routeLengthKm: operation.routeLengthKm,
        plannedDateFrom: operation.plannedDateFrom ?? '',
        plannedDateTo: operation.plannedDateTo ?? '',
        postCompletionNotes: operation.postCompletionNotes ?? '',
      });
      if (operation.geojsonContent) {
        setGeojsonContent(operation.geojsonContent);
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
        postCompletionNotes: data.postCompletionNotes || undefined,
        geojsonContent: geojsonContent || undefined,
        kmlFileName: kmlFileName || undefined,
      };
      if (isNew) {
        return api.operations.create({
          ...payload,
          status: 'SUBMITTED' as OperationStatus,
          createdByEmail: user?.email ?? '',
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
    mutationFn: (newStatus: OperationStatus) =>
      api.operations.updateStatus(operationId!, newStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['operations'] });
      navigate('/operations');
    },
  });

  const onSubmit = (data: OperationFormData) => {
    saveMutation.mutate(data);
  };

  const handleStatusChange = (newStatus: OperationStatus) => {
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
        {isNew ? 'Nowa operacja' : `Operacja #${operation?.id ?? ''}`}
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
            name="orderProjectNumber"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Numer zlecenia"
                error={!!errors.orderProjectNumber}
                helperText={errors.orderProjectNumber?.message}
                fullWidth
                disabled={isFieldDisabled('orderProjectNumber')}
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
            name="activities"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.activities} disabled={isFieldDisabled('activities')}>
                <InputLabel>Rodzaj czynności</InputLabel>
                <Select
                  multiple
                  label="Rodzaj czynności"
                  value={field.value.map((a) => a.activityType)}
                  onChange={(e) => {
                    const selected = e.target.value as string[];
                    const newActivities = selected.map((activityType) => {
                      const existing = field.value.find((a) => a.activityType === activityType);
                      return existing ?? { activityType };
                    });
                    field.onChange(newActivities);
                  }}
                  renderValue={(selected) => (
                    <Box display="flex" flexWrap="wrap" gap={0.5}>
                      {(selected as string[]).map((value) => (
                        <Chip key={value} label={ACTIVITY_TYPE_LABELS[value as ActivityType] ?? value} size="small" />
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
                {errors.activities && (
                  <FormHelperText>{errors.activities.message}</FormHelperText>
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
            points={mapPoints}
            onPointsChange={(points, distanceKm) => {
              // Convert points back to GeoJSON for storage
              const geojson = {
                type: 'FeatureCollection',
                features: points.map((p) => ({
                  type: 'Feature',
                  geometry: { type: 'Point', coordinates: [p.lng, p.lat] },
                  properties: {},
                })),
              };
              setGeojsonContent(JSON.stringify(geojson));
              setValue('routeLengthKm', distanceKm);
            }}
            disabled={readOnly}
            fileName={kmlFileName}
            onFileNameChange={setKmlFileName}
          />

          <Controller
            name="routeLengthKm"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                onChange={(e) => field.onChange(Number(e.target.value))}
                label="Dystans trasy (km)"
                type="number"
                error={!!errors.routeLengthKm}
                helperText={errors.routeLengthKm?.message}
                fullWidth
                disabled={isFieldDisabled('routeLengthKm')}
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
            name="postCompletionNotes"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Uwagi porealizacyjne"
                multiline
                rows={3}
                error={!!errors.postCompletionNotes}
                helperText={errors.postCompletionNotes?.message}
                fullWidth
                disabled={isFieldDisabled('postCompletionNotes')}
              />
            )}
          />

          {/* Contact emails - read-only */}
          {operation?.contactEmails && (
            <TextField
              label="Osoby kontaktowe"
              value={operation.contactEmails}
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
                      primary={comment.content}
                      secondary={`${comment.authorEmail} — ${comment.createdAt}`}
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
        <OperationMap points={mapPoints} />
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
