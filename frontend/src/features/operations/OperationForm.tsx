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
import PageHeader from '../../shared/components/PageHeader';
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

  const isFieldHidden = (fieldName: string): boolean => {
    if (isNew && plannerBlockedFields.includes(fieldName)) return true;
    return false;
  };

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<OperationFormData>({
    resolver: zodResolver(operationSchema),
    mode: 'onChange',
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
          orderProjectNumber: data.orderProjectNumber,
          shortDescription: data.shortDescription,
          activities: data.activities,
          proposedDateFrom: data.proposedDateFrom || undefined,
          proposedDateTo: data.proposedDateTo || undefined,
          additionalInfo: data.additionalInfo || undefined,
          contactEmails: data.contactEmails || undefined,
          kmlFileName: kmlFileName || undefined,
          kmlContent: undefined, // KML content sent separately if needed
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
    <>
      <PageHeader
        title={isNew ? 'Nowa operacja' : `Operacja #${operation?.id ?? ''}`}
        onBack={() => navigate('/operations')}
      />
      <Box sx={{ p: 3, maxWidth: 800 }}>

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
                label="Numer zlecenia *"
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
                label="Krótki opis *"
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
                <InputLabel>Rodzaj czynności *</InputLabel>
                <Select
                  multiple
                  label="Rodzaj czynności *"
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
                {errors.activities && typeof errors.activities.message === 'string' && (
                  <FormHelperText>{errors.activities.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />

          {watch('activities')?.some((a) => a.activityType === 'OTHER') && (
            <Controller
              name={`activities.${watch('activities').findIndex((a) => a.activityType === 'OTHER')}.description`}
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  value={field.value ?? ''}
                  label='Opis dla "Inne" *'
                  multiline
                  rows={2}
                  inputProps={{ maxLength: 200 }}
                  error={!!errors.activities?.[watch('activities').findIndex((a) => a.activityType === 'OTHER')]?.description}
                  helperText={errors.activities?.[watch('activities').findIndex((a) => a.activityType === 'OTHER')]?.description?.message}
                  disabled={isFieldDisabled('activities')}
                />
              )}
            />
          )}

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
                label="Dystans trasy (km) *"
                type="number"
                error={!!errors.routeLengthKm}
                helperText={errors.routeLengthKm?.message}
                fullWidth
                disabled={isFieldDisabled('routeLengthKm')}
              />
            )}
          />

          {!isFieldHidden('plannedDateFrom') && (
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
          )}

          {!isFieldHidden('plannedDateTo') && (
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
          )}

          {!isFieldHidden('postCompletionNotes') && (
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
          )}

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
                disabled={saveMutation.isPending || !isValid}
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

      {/* Change log */}
      {operation?.changeLog && operation.changeLog.length > 0 && (
        <Box mt={3}>
          <Typography variant="h6" mb={1}>
            Historia zmian
          </Typography>
          <Box sx={{ bgcolor: '#fff', borderRadius: '12px', border: '0.5px solid #e2e8f0', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  <th style={{ padding: '8px 12px', textAlign: 'left', color: '#64748b', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', borderBottom: '1px solid #e2e8f0' }}>Pole</th>
                  <th style={{ padding: '8px 12px', textAlign: 'left', color: '#64748b', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', borderBottom: '1px solid #e2e8f0' }}>Stara wartość</th>
                  <th style={{ padding: '8px 12px', textAlign: 'left', color: '#64748b', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', borderBottom: '1px solid #e2e8f0' }}>Nowa wartość</th>
                  <th style={{ padding: '8px 12px', textAlign: 'left', color: '#64748b', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', borderBottom: '1px solid #e2e8f0' }}>Zmienił/a</th>
                  <th style={{ padding: '8px 12px', textAlign: 'left', color: '#64748b', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', borderBottom: '1px solid #e2e8f0' }}>Data</th>
                </tr>
              </thead>
              <tbody>
                {operation.changeLog.map((log) => (
                  <tr key={log.id}>
                    <td style={{ padding: '7px 12px', borderBottom: '0.5px solid #f1f5f9' }}>{log.fieldName}</td>
                    <td style={{ padding: '7px 12px', borderBottom: '0.5px solid #f1f5f9', color: '#94a3b8' }}>{log.oldValue || '—'}</td>
                    <td style={{ padding: '7px 12px', borderBottom: '0.5px solid #f1f5f9' }}>{log.newValue || '—'}</td>
                    <td style={{ padding: '7px 12px', borderBottom: '0.5px solid #f1f5f9', fontFamily: 'monospace', fontSize: 10 }}>{log.changedByEmail}</td>
                    <td style={{ padding: '7px 12px', borderBottom: '0.5px solid #f1f5f9', fontSize: 10 }}>{new Date(log.changedAt).toLocaleString('pl-PL')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
        </Box>
      )}

      {/* Status actions */}
      {operation && !isNew && (
        <OperationStatusActions
          operation={operation}
          onStatusChange={handleStatusChange}
          plannedDateFrom={watch('plannedDateFrom')}
          plannedDateTo={watch('plannedDateTo')}
        />
      )}
      </Box>
    </>
  );
};

export default OperationForm;
