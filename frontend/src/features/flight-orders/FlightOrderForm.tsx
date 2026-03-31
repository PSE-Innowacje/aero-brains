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
  type FlightOrderStatusCode,
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

  // Operations with status = 3 (Potwierdzone do planu)
  const availableOperations = useMemo(
    () => allOperations.filter((op) => op.status === 3),
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
      plannedStartDateTime: '',
      plannedLandingDateTime: '',
      pilotId: 0,
      helicopterId: 0,
      crewMemberIds: [],
      startLandingSiteId: 0,
      endLandingSiteId: 0,
      selectedOperationIds: [],
      estimatedRouteDistance: 0,
      actualStartDateTime: '',
      actualLandingDateTime: '',
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
        plannedStartDateTime: flightOrder.plannedStartDateTime,
        plannedLandingDateTime: flightOrder.plannedLandingDateTime,
        pilotId: flightOrder.pilotId,
        helicopterId: flightOrder.helicopterId,
        crewMemberIds: flightOrder.crewMemberIds,
        startLandingSiteId: flightOrder.startLandingSiteId,
        endLandingSiteId: flightOrder.endLandingSiteId,
        selectedOperationIds: flightOrder.selectedOperationIds,
        estimatedRouteDistance: flightOrder.estimatedRouteDistance,
        actualStartDateTime: flightOrder.actualStartDateTime ?? '',
        actualLandingDateTime: flightOrder.actualLandingDateTime ?? '',
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
    () => landingSites.find((ls) => ls.id === watchedValues.startLandingSiteId),
    [landingSites, watchedValues.startLandingSiteId],
  );

  const endSite = useMemo(
    () => landingSites.find((ls) => ls.id === watchedValues.endLandingSiteId),
    [landingSites, watchedValues.endLandingSiteId],
  );

  // Resolve operation points for map
  const operationPoints = useMemo(() => {
    const points: Array<{ lat: number; lng: number }> = [];
    const selectedOps = allOperations.filter((op) =>
      (watchedValues.selectedOperationIds ?? []).includes(op.id),
    );
    for (const op of selectedOps) {
      if (op.kmlPoints) {
        points.push(...op.kmlPoints);
      }
    }
    return points;
  }, [allOperations, watchedValues.selectedOperationIds]);

  // Check if any validation warnings exist
  const hasValidationWarnings = useMemo(() => {
    const flightDay = watchedValues.plannedStartDateTime
      ? watchedValues.plannedStartDateTime.slice(0, 10)
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
      watchedValues.estimatedRouteDistance > selectedHelicopter.rangeWithoutLanding
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
        actualStartDateTime: data.actualStartDateTime || undefined,
        actualLandingDateTime: data.actualLandingDateTime || undefined,
      };
      if (isNew) {
        return api.flightOrders.create({
          ...payload,
          status: 2 as FlightOrderStatusCode,
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
    mutationFn: (newStatus: FlightOrderStatusCode) =>
      api.flightOrders.updateStatus(flightOrderId!, newStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flightOrders'] });
      navigate('/flight-orders');
    },
  });

  const onSubmit = (data: FlightOrderFormData) => {
    saveMutation.mutate(data);
  };

  const handleStatusChange = (newStatus: FlightOrderStatusCode) => {
    statusMutation.mutate(newStatus);
  };

  if (!isNew && isLoading) {
    return <Typography>Ładowanie...</Typography>;
  }

  const showActualFields = flightOrder && flightOrder.status >= 4;

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
        {isNew ? 'Nowe zlecenie lotu' : `Zlecenie ${flightOrder?.orderNumber ?? ''}`}
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
            name="plannedStartDateTime"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Planowana data startu"
                type="datetime-local"
                InputLabelProps={{ shrink: true }}
                error={!!errors.plannedStartDateTime}
                helperText={errors.plannedStartDateTime?.message}
                fullWidth
                disabled={readOnly}
              />
            )}
          />

          {/* Planned landing date/time */}
          <Controller
            name="plannedLandingDateTime"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Planowana data lądowania"
                type="datetime-local"
                InputLabelProps={{ shrink: true }}
                error={!!errors.plannedLandingDateTime}
                helperText={errors.plannedLandingDateTime?.message}
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

          {/* Start landing site */}
          <Controller
            name="startLandingSiteId"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.startLandingSiteId} disabled={readOnly}>
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
                {errors.startLandingSiteId && (
                  <FormHelperText>{errors.startLandingSiteId.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />

          {/* End landing site */}
          <Controller
            name="endLandingSiteId"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.endLandingSiteId} disabled={readOnly}>
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
                {errors.endLandingSiteId && (
                  <FormHelperText>{errors.endLandingSiteId.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />

          {/* Selected operations (multi-select) */}
          <Controller
            name="selectedOperationIds"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.selectedOperationIds} disabled={readOnly}>
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
                                ? `${op.operationNumber} - ${op.shortDescription}`
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
                      {op.operationNumber} - {op.shortDescription}
                    </MenuItem>
                  ))}
                </Select>
                {errors.selectedOperationIds && (
                  <FormHelperText>{errors.selectedOperationIds.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />

          {/* Estimated route distance */}
          <Controller
            name="estimatedRouteDistance"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                onChange={(e) => field.onChange(Number(e.target.value))}
                label="Szacowana długość trasy (km)"
                type="number"
                error={!!errors.estimatedRouteDistance}
                helperText={errors.estimatedRouteDistance?.message}
                fullWidth
                disabled={readOnly}
              />
            )}
          />

          {/* Actual start/landing - only shown when status >= 4 */}
          {showActualFields && (
            <>
              <Divider />
              <Typography variant="subtitle1">Dane rzeczywiste</Typography>

              <Controller
                name="actualStartDateTime"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Rzeczywista data startu"
                    type="datetime-local"
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.actualStartDateTime}
                    helperText={errors.actualStartDateTime?.message}
                    fullWidth
                    disabled={readOnly}
                  />
                )}
              />

              <Controller
                name="actualLandingDateTime"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Rzeczywista data lądowania"
                    type="datetime-local"
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.actualLandingDateTime}
                    helperText={errors.actualLandingDateTime?.message}
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
