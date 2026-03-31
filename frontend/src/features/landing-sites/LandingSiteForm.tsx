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
  Stack,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { landingSiteSchema, type LandingSiteFormData } from './landingSiteSchema';
import { api } from '../../api/client';
import { useAuth } from '../../auth/AuthContext';
import { canEdit } from '../../shared/utils/permissions';
import MapView from '../../shared/components/MapView';

const LandingSiteForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isNew = id === 'new';
  const landingSiteId = isNew ? null : Number(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const readOnly = !user?.role || !canEdit(user.role, 'administration');

  const { data: landingSite, isLoading } = useQuery({
    queryKey: ['landingSites', landingSiteId],
    queryFn: () => api.landingSites.getById(landingSiteId!),
    enabled: !isNew && landingSiteId !== null,
  });

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<LandingSiteFormData>({
    resolver: zodResolver(landingSiteSchema),
    defaultValues: {
      name: '',
      lat: 52.0,
      lng: 19.5,
    },
  });

  useEffect(() => {
    if (landingSite) {
      reset({
        name: landingSite.name,
        lat: landingSite.latitude,
        lng: landingSite.longitude,
      });
    }
  }, [landingSite, reset]);

  const latValue = watch('lat');
  const lngValue = watch('lng');

  const isValidCoordinate =
    typeof latValue === 'number' &&
    typeof lngValue === 'number' &&
    !isNaN(latValue) &&
    !isNaN(lngValue) &&
    latValue >= -90 &&
    latValue <= 90 &&
    lngValue >= -180 &&
    lngValue <= 180;

  const saveMutation = useMutation({
    mutationFn: (data: LandingSiteFormData) => {
      const payload = {
        name: data.name,
        latitude: data.lat,
        longitude: data.lng,
      };
      if (isNew) {
        return api.landingSites.create(payload);
      }
      return api.landingSites.update(landingSiteId!, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['landingSites'] });
      navigate('/landing-sites');
    },
  });

  const onSubmit = (data: LandingSiteFormData) => {
    saveMutation.mutate(data);
  };

  if (!isNew && isLoading) {
    return <Typography>Ładowanie...</Typography>;
  }

  return (
    <Box maxWidth={600}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/landing-sites')}
        sx={{ mb: 1 }}
      >
        Powrót do listy
      </Button>
      <Typography variant="h5" mb={2}>
        {isNew ? 'Nowe lądowisko' : 'Edycja lądowiska'}
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Nazwa"
                error={!!errors.name}
                helperText={errors.name?.message}
                fullWidth
                disabled={readOnly}
              />
            )}
          />

          <Controller
            name="lat"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                onChange={(e) => field.onChange(Number(e.target.value))}
                label="Szerokość geograficzna (lat)"
                type="number"
                inputProps={{ step: 'any' }}
                error={!!errors.lat}
                helperText={errors.lat?.message}
                fullWidth
                disabled={readOnly}
              />
            )}
          />

          <Controller
            name="lng"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                onChange={(e) => field.onChange(Number(e.target.value))}
                label="Długość geograficzna (lng)"
                type="number"
                inputProps={{ step: 'any' }}
                error={!!errors.lng}
                helperText={errors.lng?.message}
                fullWidth
                disabled={readOnly}
              />
            )}
          />

          {isValidCoordinate && (
            <MapView
              center={[latValue, lngValue]}
              zoom={10}
              markers={[{ lat: latValue, lng: lngValue, label: watch('name') || 'Lądowisko' }]}
            />
          )}

          {!readOnly && (
            <Box display="flex" gap={2}>
              <Button type="submit" variant="contained" disabled={saveMutation.isPending}>
                Zapisz
              </Button>
              <Button variant="outlined" onClick={() => navigate('/landing-sites')}>
                Anuluj
              </Button>
            </Box>
          )}
        </Stack>
      </form>
    </Box>
  );
};

export default LandingSiteForm;
