import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button, Box, Typography } from '@mui/material';
import type { GridColDef } from '@mui/x-data-grid';
import DataTable from '../../shared/components/DataTable';
import StatusBadge from '../../shared/components/StatusBadge';
import { api } from '../../api/client';
import { useAuth } from '../../auth/AuthContext';
import { canEdit } from '../../shared/utils/permissions';

const columns: GridColDef[] = [
  {
    field: 'registrationNumber',
    headerName: 'Numer rejestracyjny',
    flex: 1,
    minWidth: 150,
  },
  {
    field: 'helicopterType',
    headerName: 'Typ',
    flex: 1,
    minWidth: 150,
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 140,
    renderCell: (params) => {
      const isActive = params.value === 'ACTIVE';
      return (
        <StatusBadge
          statusCode={isActive ? 3 : 7}
          label={isActive ? 'Aktywny' : 'Nieaktywny'}
        />
      );
    },
    sortComparator: (v1, v2) => {
      if (v1 === v2) return 0;
      return v1 === 'ACTIVE' ? -1 : 1;
    },
  },
];

const HelicopterList: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: helicopters = [], isLoading } = useQuery({
    queryKey: ['helicopters'],
    queryFn: api.helicopters.getAll,
  });

  const handleRowClick = (id: number) => {
    navigate(`/helicopters/${id}`);
  };

  const showAddButton = user?.role && canEdit(user.role, 'administration');

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Helikoptery</Typography>
        {showAddButton && (
          <Button
            variant="contained"
            onClick={() => navigate('/helicopters/new')}
          >
            Dodaj helikopter
          </Button>
        )}
      </Box>
      <DataTable
        rows={helicopters}
        columns={columns}
        loading={isLoading}
        onRowClick={handleRowClick}
        defaultSortField="status"
        defaultSortDirection="asc"
      />
    </Box>
  );
};

export default HelicopterList;
