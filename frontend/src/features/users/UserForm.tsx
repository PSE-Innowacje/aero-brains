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
import PageHeader from '../../shared/components/PageHeader';
import { userSchema, type UserFormData } from './userSchema';
import { api } from '../../api/client';
import { useAuth } from '../../auth/AuthContext';
import { canEdit } from '../../shared/utils/permissions';

const UserForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isNew = id === 'new';
  const userId = isNew ? null : Number(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const readOnly = !user?.role || !canEdit(user.role, 'administration');

  const { data: userData, isLoading } = useQuery({
    queryKey: ['users', userId],
    queryFn: () => api.users.getById(userId!),
    enabled: !isNew && userId !== null,
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    mode: 'onChange',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      role: 'PILOT',
      password: '',
    },
  });

  useEffect(() => {
    if (userData) {
      reset({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        role: userData.role as UserFormData['role'],
      });
    }
  }, [userData, reset]);

  const saveMutation = useMutation({
    mutationFn: (data: UserFormData) => {
      if (isNew) {
        return api.users.create({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          role: data.role,
          password: data.password || '',
        });
      }
      return api.users.update(userId!, {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        role: data.role,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      navigate('/users');
    },
  });

  const onSubmit = (data: UserFormData) => {
    saveMutation.mutate(data);
  };

  if (!isNew && isLoading) {
    return <Typography>Ładowanie...</Typography>;
  }

  return (
    <Box maxWidth={600}>
      <PageHeader
        title={isNew ? 'Nowy użytkownik' : 'Edycja użytkownika'}
        onBack={() => navigate('/users')}
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <Controller
            name="firstName"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Imię *"
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
                label="Nazwisko *"
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
                label="Email *"
                error={!!errors.email}
                helperText={errors.email?.message}
                fullWidth
                disabled={readOnly}
              />
            )}
          />

          {isNew && (
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Hasło *"
                  type="password"
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  fullWidth
                  disabled={readOnly}
                />
              )}
            />
          )}

          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.role} disabled={readOnly}>
                <InputLabel>Rola *</InputLabel>
                <Select {...field} label="Rola *">
                  <MenuItem value="ADMINISTRATOR">Administrator</MenuItem>
                  <MenuItem value="PLANNER">Osoba planująca</MenuItem>
                  <MenuItem value="SUPERVISOR">Osoba nadzorująca</MenuItem>
                  <MenuItem value="PILOT">Pilot</MenuItem>
                </Select>
                {errors.role && (
                  <FormHelperText>{errors.role.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />

          {!readOnly && (
            <Box display="flex" gap={2}>
              <Button type="submit" variant="contained" disabled={saveMutation.isPending || !isValid}>
                Zapisz
              </Button>
              <Button variant="outlined" onClick={() => navigate('/users')}>
                Anuluj
              </Button>
            </Box>
          )}
        </Stack>
      </form>
    </Box>
  );
};

export default UserForm;
