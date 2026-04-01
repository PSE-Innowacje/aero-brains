import React, { useEffect } from 'react';
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
  Card,
  CardMedia,
} from '@mui/material';
import PageHeader from '../../shared/components/PageHeader';
import { helicopterSchema, type HelicopterFormData } from './helicopterSchema';
import { api } from '../../api/client';
import { useAuth } from '../../auth/AuthContext';
import { canEdit } from '../../shared/utils/permissions';

const HelicopterForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isNew = id === 'new';
  const helicopterId = isNew ? null : Number(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const readOnly = !user?.role || !canEdit(user.role, 'administration');

  const { data: helicopter, isLoading } = useQuery({
    queryKey: ['helicopters', helicopterId],
    queryFn: () => api.helicopters.getById(helicopterId!),
    enabled: !isNew && helicopterId !== null,
  });

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isValid },
  } = useForm<HelicopterFormData>({
    resolver: zodResolver(helicopterSchema),
    mode: 'onChange',
    defaultValues: {
      registrationNumber: '',
      helicopterType: '',
      description: '',
      maxCrewCount: 1,
      maxCrewWeight: 1,
      status: 'ACTIVE',
      inspectionExpiryDate: '',
      rangeKm: 1,
    },
  });

  useEffect(() => {
    if (helicopter) {
      reset({
        registrationNumber: helicopter.registrationNumber,
        helicopterType: helicopter.helicopterType,
        description: helicopter.description ?? '',
        maxCrewCount: helicopter.maxCrewCount,
        maxCrewWeight: helicopter.maxCrewWeight,
        status: helicopter.status,
        inspectionExpiryDate: helicopter.inspectionExpiryDate ?? '',
        rangeKm: helicopter.rangeKm,
      });
    }
  }, [helicopter, reset]);

  const statusValue = watch('status');

  const saveMutation = useMutation({
    mutationFn: (data: HelicopterFormData) => {
      const payload = {
        ...data,
        description: data.description || undefined,
        inspectionExpiryDate: data.inspectionExpiryDate || undefined,
      };
      if (isNew) {
        return api.helicopters.create(payload);
      }
      return api.helicopters.update(helicopterId!, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['helicopters'] });
      navigate('/helicopters');
    },
  });

  const onSubmit = (data: HelicopterFormData) => {
    saveMutation.mutate(data);
  };

  if (!isNew && isLoading) {
    return <Typography>Ładowanie...</Typography>;
  }

  return (
    <>
      <PageHeader
        title={isNew ? 'Nowy helikopter' : 'Edycja helikoptera'}
        subtitle={!isNew ? helicopter?.registrationNumber : undefined}
        onBack={() => navigate('/helicopters')}
      />

      <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', gap: 4, alignItems: 'flex-start' }}>
        {/* Left column — form */}
        <Box sx={{ flex: 1, minWidth: 0, maxWidth: 600 }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
              <Controller
                name="registrationNumber"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Numer rejestracyjny *"
                    error={!!errors.registrationNumber}
                    helperText={errors.registrationNumber?.message}
                    fullWidth
                    disabled={readOnly}
                  />
                )}
              />

              <Controller
                name="helicopterType"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Typ *"
                    error={!!errors.helicopterType}
                    helperText={errors.helicopterType?.message}
                    fullWidth
                    disabled={readOnly}
                  />
                )}
              />

              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Opis"
                    error={!!errors.description}
                    helperText={errors.description?.message}
                    fullWidth
                    disabled={readOnly}
                  />
                )}
              />

              <Controller
                name="maxCrewCount"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    label="Maks. liczba załogi *"
                    type="number"
                    error={!!errors.maxCrewCount}
                    helperText={errors.maxCrewCount?.message}
                    fullWidth
                    disabled={readOnly}
                  />
                )}
              />

              <Controller
                name="maxCrewWeight"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    label="Maks. waga załogi (kg) *"
                    type="number"
                    error={!!errors.maxCrewWeight}
                    helperText={errors.maxCrewWeight?.message}
                    fullWidth
                    disabled={readOnly}
                  />
                )}
              />

              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.status} disabled={readOnly}>
                    <InputLabel>Status *</InputLabel>
                    <Select {...field} label="Status *">
                      <MenuItem value="ACTIVE">Aktywny</MenuItem>
                      <MenuItem value="INACTIVE">Nieaktywny</MenuItem>
                    </Select>
                    {errors.status && (
                      <FormHelperText>{errors.status.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />

              {statusValue === 'ACTIVE' && (
                <Controller
                  name="inspectionExpiryDate"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Data ważności przeglądu"
                      type="date"
                      InputLabelProps={{ shrink: true }}
                      error={!!errors.inspectionExpiryDate}
                      helperText={errors.inspectionExpiryDate?.message}
                      fullWidth
                      disabled={readOnly}
                    />
                  )}
                />
              )}

              <Controller
                name="rangeKm"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    label="Zasięg bez lądowania (km) *"
                    type="number"
                    error={!!errors.rangeKm}
                    helperText={errors.rangeKm?.message}
                    fullWidth
                    disabled={readOnly}
                  />
                )}
              />

              {!readOnly && (
                <Box display="flex" gap={2}>
                  <Button type="submit" variant="contained" disabled={saveMutation.isPending || !isValid}>
                    Zapisz
                  </Button>
                  <Button variant="outlined" onClick={() => navigate('/helicopters')}>
                    Anuluj
                  </Button>
                </Box>
              )}
            </Stack>
          </form>
        </Box>

        {/* Right column — image */}
        {helicopter?.imageUrl && (
          <Card
            sx={{
              width: 400,
              flexShrink: 0,
              position: 'sticky',
              top: 80,
              alignSelf: 'flex-start',
            }}
            elevation={2}
          >
            <CardMedia
              component="img"
              image={helicopter.imageUrl}
              alt={`${helicopter.helicopterType} — ${helicopter.registrationNumber}`}
              sx={{ height: 260, objectFit: 'cover' }}
            />
            <Box sx={{ px: 2, py: 1.5, bgcolor: 'grey.50' }}>
              <Typography variant="subtitle2">
                {helicopter.helicopterType}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {helicopter.registrationNumber}
                {helicopter.description && ` — ${helicopter.description}`}
              </Typography>
            </Box>
          </Card>
        )}
      </Box>
      </Box>
    </>
  );
};

export default HelicopterForm;
