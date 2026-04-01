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
import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import PageHeader from '../../shared/components/PageHeader';
import { landingSiteSchema, type LandingSiteFormData } from './landingSiteSchema';
import { api } from '../../api/client';
import { useAuth } from '../../auth/AuthContext';
import { canEdit } from '../../shared/utils/permissions';

const FitPoint: React.FC<{ lat: number; lng: number }> = ({ lat, lng }) => {
  const map = useMap();
  React.useEffect(() => {
    map.setView([lat, lng], 12);
  }, [map, lat, lng]);
  return null;
};

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
    formState: { errors, isValid },
  } = useForm<LandingSiteFormData>({
    resolver: zodResolver(landingSiteSchema),
    mode: 'onChange',
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
  const nameValue = watch('name');

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
    <>
      <PageHeader
        title={isNew ? 'Nowe lądowisko' : 'Edycja lądowiska'}
        onBack={() => navigate('/landing-sites')}
      />
      <Box sx={{ p: 3, maxWidth: 600 }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Nazwa *"
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
                label="Szerokość geograficzna (lat) *"
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
                label="Długość geograficzna (lng) *"
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
            <Box
              sx={{
                bgcolor: '#fff',
                borderRadius: '12px',
                border: '0.5px solid #e2e8f0',
                overflow: 'hidden',
              }}
            >
              {/* Card header */}
              <Box
                sx={{
                  px: '18px',
                  py: '14px',
                  borderBottom: '0.5px solid #e2e8f0',
                }}
              >
                <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>
                  Lokalizacja lądowiska
                </Typography>
              </Box>

              <Box sx={{ p: '14px' }}>
                <Box sx={{ borderRadius: '10px', overflow: 'hidden', border: '0.5px solid #e2e8f0' }}>
                  <MapContainer
                    center={[latValue, lngValue]}
                    zoom={12}
                    style={{ height: 340, width: '100%' }}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <FitPoint lat={latValue} lng={lngValue} />
                    <CircleMarker
                      center={[latValue, lngValue]}
                      radius={8}
                      pathOptions={{
                        color: '#fff',
                        weight: 2.5,
                        fillColor: '#3b7ff5',
                        fillOpacity: 1,
                      }}
                    >
                      <Tooltip permanent direction="top" offset={[0, -10]} className="route-label">
                        {nameValue || 'Lądowisko'}
                      </Tooltip>
                      <Popup>
                        <strong>{nameValue || 'Lądowisko'}</strong>
                        <span style={{ display: 'block', fontSize: 10, color: '#64748b', fontFamily: 'monospace' }}>
                          {latValue.toFixed(4)}, {lngValue.toFixed(4)}
                        </span>
                      </Popup>
                    </CircleMarker>
                  </MapContainer>
                </Box>

                {/* Legend */}
                <Box sx={{ display: 'flex', gap: 1, mt: 1.5, fontSize: 11, color: '#64748b', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#3b7ff5', border: '1.5px solid #fff', boxShadow: '0 0 0 1px #3b7ff5' }} />
                    Lokalizacja lądowiska
                  </Box>
                </Box>
              </Box>
            </Box>
          )}

          {!readOnly && (
            <Box display="flex" gap={2}>
              <Button type="submit" variant="contained" disabled={saveMutation.isPending || !isValid}>
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
    </>
  );
};

export default LandingSiteForm;
