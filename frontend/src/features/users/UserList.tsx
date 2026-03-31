import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button, Box, Typography } from '@mui/material';
import type { GridColDef } from '@mui/x-data-grid';
import DataTable from '../../shared/components/DataTable';
import { api } from '../../api/client';
import { useAuth } from '../../auth/AuthContext';
import { canEdit } from '../../shared/utils/permissions';

const ROLE_LABELS: Record<string, string> = {
  ADMIN: 'Administrator',
  PLANNER: 'Osoba planująca',
  SUPERVISOR: 'Osoba nadzorująca',
  PILOT: 'Pilot',
};

const columns: GridColDef[] = [
  {
    field: 'email',
    headerName: 'Email',
    flex: 1,
    minWidth: 200,
  },
  {
    field: 'role',
    headerName: 'Rola',
    width: 180,
    valueFormatter: (value: string) => ROLE_LABELS[value] ?? value,
  },
];

const UserList: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: api.users.getAll,
  });

  const handleRowClick = (id: number) => {
    navigate(`/users/${id}`);
  };

  const showAddButton = user?.role && canEdit(user.role, 'administration');

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Użytkownicy</Typography>
        {showAddButton && (
          <Button
            variant="contained"
            onClick={() => navigate('/users/new')}
          >
            Dodaj użytkownika
          </Button>
        )}
      </Box>
      <DataTable
        rows={users}
        columns={columns}
        loading={isLoading}
        onRowClick={handleRowClick}
        defaultSortField="email"
        defaultSortDirection="asc"
      />
    </Box>
  );
};

export default UserList;
