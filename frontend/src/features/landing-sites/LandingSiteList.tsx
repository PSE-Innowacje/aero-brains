import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button, Box } from '@mui/material';
import type { GridColDef } from '@mui/x-data-grid';
import DataTable from '../../shared/components/DataTable';
import PageHeader from '../../shared/components/PageHeader';
import { api } from '../../api/client';
import { useAuth } from '../../auth/AuthContext';
import { canEdit } from '../../shared/utils/permissions';

const columns: GridColDef[] = [
  {
    field: 'name',
    headerName: 'Nazwa',
    flex: 1,
    minWidth: 200,
  },
  {
    field: 'latitude',
    headerName: 'Szerokość',
    width: 140,
    valueGetter: (_value: unknown, row: { latitude?: number }) =>
      row.latitude?.toFixed(4) ?? '',
  },
  {
    field: 'longitude',
    headerName: 'Długość',
    width: 140,
    valueGetter: (_value: unknown, row: { longitude?: number }) =>
      row.longitude?.toFixed(4) ?? '',
  },
];

const LandingSiteList: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: landingSites = [], isLoading } = useQuery({
    queryKey: ['landingSites'],
    queryFn: api.landingSites.getAll,
  });

  const handleRowClick = (id: number) => {
    navigate(`/landing-sites/${id}`);
  };

  const showAddButton = user?.role && canEdit(user.role, 'administration');

  return (
    <Box>
      <PageHeader
        title="Lądowiska planowe"
        subtitle="Dostępne lądowiska"
        action={
          showAddButton ? (
            <Button
              variant="contained"
              onClick={() => navigate('/landing-sites/new')}
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
              Dodaj lądowisko
            </Button>
          ) : undefined
        }
      />
      <DataTable
        rows={landingSites}
        columns={columns}
        loading={isLoading}
        onRowClick={handleRowClick}
        defaultSortField="name"
        defaultSortDirection="asc"
      />
    </Box>
  );
};

export default LandingSiteList;
