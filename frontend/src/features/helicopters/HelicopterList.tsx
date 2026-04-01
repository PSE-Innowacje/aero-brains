import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button, Box } from '@mui/material';
import type { GridColDef } from '@mui/x-data-grid';
import DataTable from '../../shared/components/DataTable';
import FilterBar from '../../shared/components/FilterBar';
import PageHeader from '../../shared/components/PageHeader';
import StatusBadge from '../../shared/components/StatusBadge';
import { api } from '../../api/client';
import { useAuth } from '../../auth/AuthContext';
import { canEdit } from '../../shared/utils/permissions';

const columns: GridColDef[] = [
  {
    field: 'registrationNumber',
    headerName: 'Rejestracja',
    width: 130,
    renderCell: (params) => (
      <strong style={{ fontFamily: 'monospace' }}>{params.value}</strong>
    ),
  },
  {
    field: 'helicopterType',
    headerName: 'Typ',
    flex: 1,
    minWidth: 140,
  },
  {
    field: 'rangeKm',
    headerName: 'Zasięg',
    width: 100,
    valueFormatter: (value: number) => `${value} km`,
  },
  {
    field: 'maxCrewCount',
    headerName: 'Maks. załoga',
    width: 110,
    valueFormatter: (value: number) => `${value} os.`,
  },
  {
    field: 'maxCrewWeight',
    headerName: 'Maks. waga',
    width: 110,
    valueFormatter: (value: number) => `${value} kg`,
  },
  {
    field: 'inspectionExpiryDate',
    headerName: 'Przegląd',
    width: 110,
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 130,
    renderCell: (params) => (
      <StatusBadge
        statusCode={params.value as string}
        label={params.value === 'ACTIVE' ? 'Aktywny' : 'Nieaktywny'}
      />
    ),
    sortComparator: (v1, v2) => {
      if (v1 === v2) return 0;
      return v1 === 'ACTIVE' ? -1 : 1;
    },
  },
];

const statusFilterOptions = [
  { value: 'all', label: 'Wszystkie' },
  { value: 'ACTIVE', label: 'Aktywny', color: '#16a34a' },
  { value: 'INACTIVE', label: 'Nieaktywny', color: '#64748b' },
];

const HelicopterList: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [statusFilter, setStatusFilter] = useState('all');

  const { data: helicopters = [], isLoading } = useQuery({
    queryKey: ['helicopters'],
    queryFn: api.helicopters.getAll,
  });

  const filteredHelicopters = useMemo(
    () =>
      statusFilter === 'all'
        ? helicopters
        : helicopters.filter((h: { status: string }) => h.status === statusFilter),
    [helicopters, statusFilter],
  );

  const handleRowClick = (id: number) => {
    navigate(`/helicopters/${id}`);
  };

  const showAddButton = user?.role && canEdit(user.role, 'administration');

  return (
    <>
      <PageHeader
        title="Helikoptery"
        subtitle="Flota helikopterów"
        action={
          showAddButton ? (
            <Button
              variant="contained"
              onClick={() => navigate('/helicopters/new')}
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
              Dodaj helikopter
            </Button>
          ) : undefined
        }
      />
      <Box sx={{ p: 3 }}>
      <FilterBar
        label="Status"
        options={statusFilterOptions}
        value={statusFilter}
        onChange={setStatusFilter}
      />
      <DataTable
        rows={filteredHelicopters}
        columns={columns}
        loading={isLoading}
        onRowClick={handleRowClick}
        defaultSortField="status"
        defaultSortDirection="asc"
      />
      </Box>
    </>
  );
};

export default HelicopterList;
