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
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PageHeader from '../../shared/components/PageHeader';
import { crewSchema, type CrewFormData } from './crewSchema';
import { api } from '../../api/client';

import { useAuth } from '../../auth/AuthContext';
import { canEdit } from '../../shared/utils/permissions';

const CrewForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isNew = id === 'new';
  const crewMemberId = isNew ? null : Number(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const readOnly = !user?.role || !canEdit(user.role, 'administration');

  const { data: crewMember, isLoading } = useQuery({
    queryKey: ['crewMembers', crewMemberId],
    queryFn: () => api.crewMembers.getById(crewMemberId!),
    enabled: !isNew && crewMemberId !== null,
  });

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<CrewFormData>({
    resolver: zodResolver(crewSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      weight: 70,
      role: 'PILOT',
      pilotLicenseNumber: '',
      licenseExpiryDate: '',
      trainingExpiryDate: '',
    },
  });

  useEffect(() => {
    if (crewMember) {
      reset({
        firstName: crewMember.firstName,
        lastName: crewMember.lastName,
        email: crewMember.email,
        weight: crewMember.weight,
        role: crewMember.role,
        pilotLicenseNumber: crewMember.pilotLicenseNumber ?? '',
        licenseExpiryDate: crewMember.licenseExpiryDate ?? '',
        trainingExpiryDate: crewMember.trainingExpiryDate,
      });
    }
  }, [crewMember, reset]);

  const roleValue = watch('role');

  const saveMutation = useMutation({
    mutationFn: (data: CrewFormData) => {
      const payload = {
        ...data,
        role: data.role,
        pilotLicenseNumber: data.pilotLicenseNumber || undefined,
        licenseExpiryDate: data.licenseExpiryDate || undefined,
      };
      if (isNew) {
        return api.crewMembers.create(payload);
      }
      return api.crewMembers.update(crewMemberId!, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crewMembers'] });
      navigate('/crew');
    },
  });

  const onSubmit = (data: CrewFormData) => {
    saveMutation.mutate(data);
  };

  if (!isNew && isLoading) {
    return <Typography>Ładowanie...</Typography>;
  }

  return (
    <Box maxWidth={600}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/crew')}
        sx={{ mb: 1 }}
      >
        Powrót do listy
      </Button>
      <PageHeader
        title={isNew ? 'Nowy członek załogi' : 'Edycja członka załogi'}
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <Controller
            name="firstName"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Imię"
                error={!!errors.firstName}
                helperText={errors.firstName?.message}
                fullWidth
                disabled={readOnly}
              />
            )}
          />

          <Controller
            name="lastName"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Nazwisko"
                error={!!errors.lastName}
                helperText={errors.lastName?.message}
                fullWidth
                disabled={readOnly}
              />
            )}
          />

          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Email"
                error={!!errors.email}
                helperText={errors.email?.message}
                fullWidth
                disabled={readOnly}
              />
            )}
          />

          <Controller
            name="weight"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                onChange={(e) => field.onChange(Number(e.target.value))}
                label="Waga (kg)"
                type="number"
                error={!!errors.weight}
                helperText={errors.weight?.message}
                fullWidth
                disabled={readOnly}
              />
            )}
          />

          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.role} disabled={readOnly}>
                <InputLabel>Rola</InputLabel>
                <Select {...field} label="Rola">
                  <MenuItem value="PILOT">Pilot</MenuItem>
                  <MenuItem value="OBSERVER">Obserwator</MenuItem>
                </Select>
                {errors.role && (
                  <FormHelperText>{errors.role.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />

          {roleValue === 'PILOT' && (
            <>
              <Controller
                name="pilotLicenseNumber"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Numer licencji pilota"
                    error={!!errors.pilotLicenseNumber}
                    helperText={errors.pilotLicenseNumber?.message}
                    fullWidth
                    disabled={readOnly}
                  />
                )}
              />

              <Controller
                name="licenseExpiryDate"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Data ważności licencji"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.licenseExpiryDate}
                    helperText={errors.licenseExpiryDate?.message}
                    fullWidth
                    disabled={readOnly}
                  />
                )}
              />
            </>
          )}

          <Controller
            name="trainingExpiryDate"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Data ważności szkolenia"
                type="date"
                InputLabelProps={{ shrink: true }}
                error={!!errors.trainingExpiryDate}
                helperText={errors.trainingExpiryDate?.message}
                fullWidth
                disabled={readOnly}
              />
            )}
          />

          {!readOnly && (
            <Box display="flex" gap={2}>
              <Button type="submit" variant="contained" disabled={saveMutation.isPending}>
                Zapisz
              </Button>
              <Button variant="outlined" onClick={() => navigate('/crew')}>
                Anuluj
              </Button>
            </Box>
          )}
        </Stack>
      </form>
    </Box>
  );
};

export default CrewForm;
