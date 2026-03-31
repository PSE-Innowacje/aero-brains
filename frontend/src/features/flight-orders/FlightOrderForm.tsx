import React, { useEffect, useMemo, useRef } from 'react';
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
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { flightOrderSchema, type FlightOrderFormData } from './flightOrderSchema';
import FlightOrderValidation from './FlightOrderValidation';
import FlightOrderMap from './FlightOrderMap';
import FlightOrderStatusActions from './FlightOrderStatusActions';
import StatusBadge from '../../shared/components/StatusBadge';
import { api } from '../../api/client';
import {
  FLIGHT_ORDER_STATUS_LABELS,
  type FlightOrderStatus,
  type CrewMember,
} from '../../api/types';
import { useAuth } from '../../auth/AuthContext';
import { canEdit } from '../../shared/utils/permissions';

const FlightOrderForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isNew = id === 'new';
  const flightOrderId = isNew ? null : Number(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const role = user?.role;
  const pilotAutoFilled = useRef(false);

  // Load flight order
  const { data: flightOrder, isLoading } = useQuery({
    queryKey: ['flightOrders', flightOrderId],
    queryFn: () => api.flightOrders.getById(flightOrderId!),
    enabled: !isNew && flightOrderId !== null,
  });

  // Load reference data
  const { data: allHelicopters = [] } = useQuery({
    queryKey: ['helicopters'],
    queryFn: api.helicopters.getAll,
  });

  const { data: crewMembers = [] } = useQuery({
    queryKey: ['crewMembers'],
    queryFn: api.crewMembers.getAll,
  });

  const { data: landingSites = [] } = useQuery({
    queryKey: ['landingSites'],
    queryFn: api.landingSites.getAll,
  });

  const { data: allOperations = [] } = useQuery({
    queryKey: ['operations'],
    queryFn: api.operations.getAll,
  });

  // Active helicopters only
  const activeHelicopters = useMemo(
    () => allHelicopters.filter((h) => h.status === 'active'),
    [allHelicopters],
  );

  // Operations with status = CONFIRMED (Potwierdzone do planu)
  const availableOperations = useMemo(
    () => allOperations.filter((op) => op.status === 'CONFIRMED'),
    [allOperations],
  );

  // Pilots from crew members
  const pilots = useMemo(
    () => crewMembers.filter((c) => c.role === 'pilot'),
    [crewMembers],
  );

  const hasEditAccess = role ? canEdit(role, 'flightOrders') : false;
  const readOnly = isNew ? !hasEditAccess : !hasEditAccess;

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FlightOrderFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(flightOrderSchema) as any,
    defaultValues: {
      plannedStartTime: '',
      plannedEndTime: '',
      pilotId: 0,
      helicopterId: 0,
      crewMemberIds: [],
      departureSiteId: 0,
      arrivalSiteId: 0,
      operationIds: [],
      estimatedRouteLengthKm: 0,
      actualStartTime: '',
      actualEndTime: '',
    },
  });

  // Watch form values for validation and map
  const watchedValues = watch();

  // Auto-fill pilot with current user if they are a pilot
  useEffect(() => {
    if (isNew && !pilotAutoFilled.current && user && pilots.length > 0) {
      const currentUserAsPilot = pilots.find(
        (p) => p.email === user.email,
      );
      if (currentUserAsPilot) {
        setValue('pilotId', currentUserAsPilot.id);
        pilotAutoFilled.current = true;
      }
    }
  }, [isNew, user, pilots, setValue]);

  // Load existing flight order data into form
  useEffect(() => {
    if (flightOrder) {
      reset({
        plannedStartTime: flightOrder.plannedStartTime,
        plannedEndTime: flightOrder.plannedEndTime,
        pilotId: flightOrder.pilotId,
        helicopterId: flightOrder.helicopterId,
        crewMemberIds: flightOrder.crewMemberIds,
        departureSiteId: flightOrder.departureSiteId,
        arrivalSiteId: flightOrder.arrivalSiteId,
        operationIds: flightOrder.operationIds,
        estimatedRouteLengthKm: flightOrder.estimatedRouteLengthKm,
        actualStartTime: flightOrder.actualStartTime ?? '',
        actualEndTime: flightOrder.actualEndTime ?? '',
      });
    }
  }, [flightOrder, reset]);

  // Resolve selected helicopter
  const selectedHelicopter = useMemo(
    () => allHelicopters.find((h) => h.id === watchedValues.helicopterId),
    [allHelicopters, watchedValues.helicopterId],
  );

  // Resolve selected pilot
  const selectedPilot = useMemo(
    () => crewMembers.find((c) => c.id === watchedValues.pilotId),
    [crewMembers, watchedValues.pilotId],
  );

  // Resolve selected crew members
  const selectedCrewMembers = useMemo(
    () =>
      crewMembers.filter((c) =>
        (watchedValues.crewMemberIds ?? []).includes(c.id),
      ),
    [crewMembers, watchedValues.crewMemberIds],
  );

  // Compute crew weight (pilot + selected crew members)
  const crewWeight = useMemo(() => {
    let weight = 0;
    if (selectedPilot) weight += selectedPilot.weight;
    for (const member of selectedCrewMembers) {
      weight += member.weight;
    }
    return weight;
  }, [selectedPilot, selectedCrewMembers]);

  // Resolve landing sites
  const startSite = useMemo(
    () => landingSites.find((ls) => ls.id === watchedValues.departureSiteId),
    [landingSites, watchedValues.departureSiteId],
  );

  const endSite = useMemo(
    () => landingSites.find((ls) => ls.id === watchedValues.arrivalSiteId),
    [landingSites, watchedValues.arrivalSiteId],
  );

  // Resolve operation points for map from geojsonContent
  const operationPoints = useMemo(() => {
    const points: Array<{ lat: number; lng: number }> = [];
    const selectedOps = allOperations.filter((op) =>
      (watchedValues.operationIds ?? []).includes(op.id),
    );
    for (const op of selectedOps) {
      if (op.geojsonContent) {
        try {
          const geojson = JSON.parse(op.geojsonContent);
          if (geojson.type === 'FeatureCollection' && Array.isArray(geojson.features)) {
            for (const feature of geojson.features) {
              if (feature.geometry?.type === 'Point' && Array.isArray(feature.geometry.coordinates)) {
                points.push({ lat: feature.geometry.coordinates[1], lng: feature.geometry.coordinates[0] });
              }
            }
          } else if (geojson.type === 'LineString' && Array.isArray(geojson.coordinates)) {
            for (const coord of geojson.coordinates) {
              points.push({ lat: coord[1], lng: coord[0] });
            }
          }
        } catch {
          // skip invalid geojson
        }
      }
    }
    return points;
  }, [allOperations, watchedValues.operationIds]);

  // Check if any validation warnings exist
  const hasValidationWarnings = useMemo(() => {
    const flightDay = watchedValues.plannedStartTime
      ? watchedValues.plannedStartTime.slice(0, 10)
      : '';

    if (selectedHelicopter && flightDay && selectedHelicopter.inspectionExpiryDate) {
      if (selectedHelicopter.inspectionExpiryDate < flightDay) return true;
    }
    if (selectedPilot && flightDay && selectedPilot.licenseExpiryDate) {
      if (selectedPilot.licenseExpiryDate < flightDay) return true;
    }
    if (selectedCrewMembers.length > 0 && flightDay) {
      for (const member of selectedCrewMembers) {
        if (member.trainingExpiryDate && member.trainingExpiryDate < flightDay) return true;
      }
    }
    if (selectedHelicopter && crewWeight > selectedHelicopter.maxCrewWeight) return true;
    if (
      selectedHelicopter &&
      watchedValues.estimatedRouteLengthKm > selectedHelicopter.rangeKm
    ) {
      return true;
    }
    return false;
  }, [watchedValues, selectedHelicopter, selectedPilot, selectedCrewMembers, crewWeight]);

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: (data: FlightOrderFormData) => {
      const payload = {
        ...data,
        crewWeight,
        actualStartTime: data.actualStartTime || undefined,
        actualEndTime: data.actualEndTime || undefined,
      };
      if (isNew) {
        return api.flightOrders.create({
          ...payload,
          status: 'PENDING_APPROVAL' as FlightOrderStatus,
        });
      }
      return api.flightOrders.update(flightOrderId!, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flightOrders'] });
      navigate('/flight-orders');
    },
  });

  // Status mutation
  const statusMutation = useMutation({
    mutationFn: (newStatus: FlightOrderStatus) =>
      api.flightOrders.updateStatus(flightOrderId!, newStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flightOrders'] });
      navigate('/flight-orders');
    },
  });

  const onSubmit = (data: FlightOrderFormData) => {
    saveMutation.mutate(data);
  };

  const handleStatusChange = (newStatus: FlightOrderStatus) => {
    statusMutation.mutate(newStatus);
  };

  if (!isNew && isLoading) {
    return <Typography>Ładowanie...</Typography>;
  }

  const showActualFields = flightOrder && ['ACCEPTED', 'PARTIALLY_COMPLETED', 'COMPLETED', 'NOT_COMPLETED'].includes(flightOrder.status);

  return (
    <Box maxWidth={800}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/flight-orders')}
        sx={{ mb: 1 }}
      >
        Powrót do listy
      </Button>
      <Typography variant="h5" mb={2}>
        {isNew ? 'Nowe zlecenie lotu' : `Zlecenie #${flightOrder?.id ?? ''}`}
      </Typography>

      {flightOrder && (
        <Box mb={2}>
          <StatusBadge
            statusCode={flightOrder.status}
            label={FLIGHT_ORDER_STATUS_LABELS[flightOrder.status]}
          />
        </Box>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          {/* Planned start date/time */}
          <Controller
            name="plannedStartTime"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Planowana data startu"
                type="datetime-local"
                InputLabelProps={{ shrink: true }}
                error={!!errors.plannedStartTime}
                helperText={errors.plannedStartTime?.message}
                fullWidth
                disabled={readOnly}
              />
            )}
          />

          {/* Planned landing date/time */}
          <Controller
            name="plannedEndTime"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Planowana data lądowania"
                type="datetime-local"
                InputLabelProps={{ shrink: true }}
                error={!!errors.plannedEndTime}
                helperText={errors.plannedEndTime?.message}
                fullWidth
                disabled={readOnly}
              />
            )}
          />

          {/* Pilot */}
          <Controller
            name="pilotId"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.pilotId} disabled={readOnly}>
                <InputLabel>Pilot</InputLabel>
                <Select
                  {...field}
                  label="Pilot"
                  value={field.value || ''}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                >
                  {pilots.map((pilot) => (
                    <MenuItem key={pilot.id} value={pilot.id}>
                      {pilot.firstName} {pilot.lastName}
                    </MenuItem>
                  ))}
                </Select>
                {errors.pilotId && (
                  <FormHelperText>{errors.pilotId.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />

          {/* Helicopter */}
          <Controller
            name="helicopterId"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.helicopterId} disabled={readOnly}>
                <InputLabel>Helikopter</InputLabel>
                <Select
                  {...field}
                  label="Helikopter"
                  value={field.value || ''}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                >
                  {activeHelicopters.map((heli) => (
                    <MenuItem key={heli.id} value={heli.id}>
                      {heli.registrationNumber}
                    </MenuItem>
                  ))}
                </Select>
                {errors.helicopterId && (
                  <FormHelperText>{errors.helicopterId.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />

          {/* Crew members (multi-select) */}
          <Controller
            name="crewMemberIds"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.crewMemberIds} disabled={readOnly}>
                <InputLabel>Członkowie załogi</InputLabel>
                <Select
                  {...field}
                  multiple
                  label="Członkowie załogi"
                  value={field.value ?? []}
                  onChange={(e) => {
                    const value = e.target.value;
                    field.onChange(
                      typeof value === 'string'
                        ? value.split(',').map(Number)
                        : value,
                    );
                  }}
                  renderValue={(selected) => (
                    <Box display="flex" flexWrap="wrap" gap={0.5}>
                      {(selected as number[]).map((memberId) => {
                        const member = crewMembers.find((c) => c.id === memberId);
                        return (
                          <Chip
                            key={memberId}
                            label={member ? `${member.firstName} ${member.lastName}` : memberId}
                            size="small"
                          />
                        );
                      })}
                    </Box>
                  )}
                >
                  {crewMembers.map((member) => (
                    <MenuItem key={member.id} value={member.id}>
                      {member.firstName} {member.lastName}
                    </MenuItem>
                  ))}
                </Select>
                {errors.crewMemberIds && (
                  <FormHelperText>{errors.crewMemberIds.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />

          {/* Crew weight (read-only computed) */}
          <TextField
            label="Waga załogi (kg)"
            type="number"
            value={crewWeight}
            fullWidth
            disabled
            InputProps={{ readOnly: true }}
          />

          {/* Departure site */}
          <Controller
            name="departureSiteId"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.departureSiteId} disabled={readOnly}>
                <InputLabel>Miejsce startu</InputLabel>
                <Select
                  {...field}
                  label="Miejsce startu"
                  value={field.value || ''}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                >
                  {landingSites.map((site) => (
                    <MenuItem key={site.id} value={site.id}>
                      {site.name}
                    </MenuItem>
                  ))}
                </Select>
                {errors.departureSiteId && (
                  <FormHelperText>{errors.departureSiteId.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />

          {/* Arrival site */}
          <Controller
            name="arrivalSiteId"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.arrivalSiteId} disabled={readOnly}>
                <InputLabel>Miejsce lądowania</InputLabel>
                <Select
                  {...field}
                  label="Miejsce lądowania"
                  value={field.value || ''}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                >
                  {landingSites.map((site) => (
                    <MenuItem key={site.id} value={site.id}>
                      {site.name}
                    </MenuItem>
                  ))}
                </Select>
                {errors.arrivalSiteId && (
                  <FormHelperText>{errors.arrivalSiteId.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />

          {/* Selected operations (multi-select) */}
          <Controller
            name="operationIds"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.operationIds} disabled={readOnly}>
                <InputLabel>Operacje</InputLabel>
                <Select
                  {...field}
                  multiple
                  label="Operacje"
                  value={field.value ?? []}
                  onChange={(e) => {
                    const value = e.target.value;
                    field.onChange(
                      typeof value === 'string'
                        ? value.split(',').map(Number)
                        : value,
                    );
                  }}
                  renderValue={(selected) => (
                    <Box display="flex" flexWrap="wrap" gap={0.5}>
                      {(selected as number[]).map((opId) => {
                        const op = allOperations.find((o) => o.id === opId);
                        return (
                          <Chip
                            key={opId}
                            label={
                              op
                                ? `${op.orderProjectNumber} - ${op.shortDescription}`
                                : opId
                            }
                            size="small"
                          />
                        );
                      })}
                    </Box>
                  )}
                >
                  {availableOperations.map((op) => (
                    <MenuItem key={op.id} value={op.id}>
                      {op.orderProjectNumber} - {op.shortDescription}
                    </MenuItem>
                  ))}
                </Select>
                {errors.operationIds && (
                  <FormHelperText>{errors.operationIds.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />

          {/* Estimated route distance */}
          <Controller
            name="estimatedRouteLengthKm"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                onChange={(e) => field.onChange(Number(e.target.value))}
                label="Szacowana długość trasy (km)"
                type="number"
                error={!!errors.estimatedRouteLengthKm}
                helperText={errors.estimatedRouteLengthKm?.message}
                fullWidth
                disabled={readOnly}
              />
            )}
          />

          {/* Actual start/landing - only shown for certain statuses */}
          {showActualFields && (
            <>
              <Divider />
              <Typography variant="subtitle1">Dane rzeczywiste</Typography>

              <Controller
                name="actualStartTime"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Rzeczywista data startu"
                    type="datetime-local"
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.actualStartTime}
                    helperText={errors.actualStartTime?.message}
                    fullWidth
                    disabled={readOnly}
                  />
                )}
              />

              <Controller
                name="actualEndTime"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Rzeczywista data lądowania"
                    type="datetime-local"
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.actualEndTime}
                    helperText={errors.actualEndTime?.message}
                    fullWidth
                    disabled={readOnly}
                  />
                )}
              />
            </>
          )}

          {/* Validation warnings */}
          <FlightOrderValidation
            flightOrder={watchedValues as FlightOrderFormData}
            helicopter={selectedHelicopter}
            pilot={selectedPilot}
            crewMembers={selectedCrewMembers}
            crewWeight={crewWeight}
          />

          {/* Map */}
          <Box>
            <Typography variant="h6" mb={1}>
              Mapa trasy
            </Typography>
            <FlightOrderMap
              startSite={startSite}
              endSite={endSite}
              operationPoints={operationPoints}
            />
          </Box>

          {/* Status actions */}
          {flightOrder && !isNew && (
            <FlightOrderStatusActions
              flightOrder={flightOrder}
              onStatusChange={handleStatusChange}
            />
          )}

          {/* Save / Cancel buttons */}
          {!readOnly && (
            <Box display="flex" gap={2}>
              <Button
                type="submit"
                variant="contained"
                disabled={saveMutation.isPending || hasValidationWarnings}
              >
                Zapisz
              </Button>
              <Button variant="outlined" onClick={() => navigate('/flight-orders')}>
                Anuluj
              </Button>
            </Box>
          )}

          {readOnly && (
            <Box display="flex" gap={2}>
              <Button variant="outlined" onClick={() => navigate('/flight-orders')}>
                Anuluj
              </Button>
            </Box>
          )}
        </Stack>
      </form>
    </Box>
  );
};

export default FlightOrderForm;
