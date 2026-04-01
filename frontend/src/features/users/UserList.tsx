import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button, Box } from '@mui/material';
import type { GridColDef } from '@mui/x-data-grid';
import DataTable from '../../shared/components/DataTable';
import PageHeader from '../../shared/components/PageHeader';
import StatusBadge from '../../shared/components/StatusBadge';
import { api } from '../../api/client';
import { useAuth } from '../../auth/AuthContext';
import { canEdit } from '../../shared/utils/permissions';

const ROLE_LABELS: Record<string, string> = {
  ADMINISTRATOR: 'Administrator',
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
    renderCell: (params) => (
      <span style={{ fontFamily: 'monospace', fontSize: 11 }}>{params.value}</span>
    ),
  },
  {
    field: 'fullName',
    headerName: 'Imię i nazwisko',
    flex: 1,
    minWidth: 160,
    valueGetter: (_value: unknown, row: { firstName?: string; lastName?: string }) =>
      `${row.firstName ?? ''} ${row.lastName ?? ''}`.trim(),
  },
  {
    field: 'role',
    headerName: 'Rola',
    width: 180,
    renderCell: (params) => (
      <StatusBadge statusCode={params.value as string} label={ROLE_LABELS[params.value as string] ?? params.value} />
    ),
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
    <>
      <PageHeader
        title="Użytkownicy"
        subtitle="Zarządzanie kontami"
        action={
          showAddButton ? (
            <Button
              variant="contained"
              onClick={() => navigate('/users/new')}
              sx={{
                bgcolor: '#3b7ff5',
                color: '#fff',
                fontSize: 12,
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: '7px',
                px: 1.5,
                py: 0.75,
                '&:hover': { bgcolor: '#2563eb' },
              }}
            >
              Dodaj użytkownika
            </Button>
          ) : undefined
        }
      />
      <Box sx={{ p: 3 }}>
      <DataTable
        rows={users}
        columns={columns}
        loading={isLoading}
        onRowClick={handleRowClick}
        defaultSortField="email"
        defaultSortDirection="asc"
      />
      </Box>
    </>
  );
};

export default UserList;
