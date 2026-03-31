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
  PILOT: 'Pilot',
  OBSERVER: 'Obserwator',
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
    width: 140,
    valueFormatter: (value: string) => ROLE_LABELS[value] ?? value,
  },
  {
    field: 'licenseExpiryDate',
    headerName: 'Ważność licencji',
    width: 160,
  },
  {
    field: 'trainingExpiryDate',
    headerName: 'Ważność szkolenia',
    width: 160,
  },
];

const CrewList: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: crewMembers = [], isLoading } = useQuery({
    queryKey: ['crewMembers'],
    queryFn: api.crewMembers.getAll,
  });

  const handleRowClick = (id: number) => {
    navigate(`/crew/${id}`);
  };

  const showAddButton = user?.role && canEdit(user.role, 'administration');

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Członkowie załogi</Typography>
        {showAddButton && (
          <Button
            variant="contained"
            onClick={() => navigate('/crew/new')}
          >
            Dodaj członka załogi
          </Button>
        )}
      </Box>
      <DataTable
        rows={crewMembers}
        columns={columns}
        loading={isLoading}
        onRowClick={handleRowClick}
        defaultSortField="email"
        defaultSortDirection="asc"
      />
    </Box>
  );
};

export default CrewList;
