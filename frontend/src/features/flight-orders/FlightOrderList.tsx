import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button, Box } from '@mui/material';
import type { GridColDef } from '@mui/x-data-grid';
import DataTable from '../../shared/components/DataTable';
import PageHeader from '../../shared/components/PageHeader';
import StatusBadge from '../../shared/components/StatusBadge';
import FilterBar from '../../shared/components/FilterBar';
import { api } from '../../api/client';
import {
  FLIGHT_ORDER_STATUS_LABELS,
  type FlightOrderStatus,
} from '../../api/types';
import { useAuth } from '../../auth/AuthContext';
import { canCreate } from '../../shared/utils/permissions';

const FlightOrderList: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: flightOrders = [], isLoading: loadingOrders } = useQuery({
    queryKey: ['flightOrders'],
    queryFn: api.flightOrders.getAll,
  });

  const { data: helicopters = [] } = useQuery({
    queryKey: ['helicopters'],
    queryFn: api.helicopters.getAll,
  });

  const { data: crewMembers = [] } = useQuery({
    queryKey: ['crewMembers'],
    queryFn: api.crewMembers.getAll,
  });

  const helicopterMap = useMemo(
    () => new Map(helicopters.map((h) => [h.id, h])),
    [helicopters],
  );

  const crewMemberMap = useMemo(
    () => new Map(crewMembers.map((c) => [c.id, c])),
    [crewMembers],
  );

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: 'id',
        headerName: 'Nr zlecenia',
        width: 150,
        renderCell: (params) => (
          <span style={{ fontFamily: 'monospace' }}>#{params.value}</span>
        ),
      },
      {
        field: 'plannedStartTime',
        headerName: 'Data startu',
        width: 180,
        valueFormatter: (value: string) => {
          if (!value) return '';
          const date = new Date(value);
          return date.toLocaleString('pl-PL', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          });
        },
      },
      {
        field: 'helicopterId',
        headerName: 'Helikopter',
        width: 160,
        valueGetter: (_value: number, row: { helicopterId: number }) => {
          const heli = helicopterMap.get(row.helicopterId);
          return heli?.registrationNumber ?? '';
        },
      },
      {
        field: 'pilotId',
        headerName: 'Pilot',
        width: 200,
        valueGetter: (_value: number, row: { pilotId: number }) => {
          const pilot = crewMemberMap.get(row.pilotId);
          return pilot ? `${pilot.firstName} ${pilot.lastName}` : '';
        },
      },
      {
        field: 'estimatedRouteLengthKm',
        headerName: 'Dystans',
        width: 100,
        renderCell: (params) => (
          <span>{params.value != null ? `${params.value} km` : '\u2014'}</span>
        ),
      },
      {
        field: 'status',
        headerName: 'Status',
        width: 200,
        renderCell: (params) => (
          <StatusBadge
            statusCode={params.value as string}
            label={FLIGHT_ORDER_STATUS_LABELS[params.value as FlightOrderStatus] ?? ''}
          />
        ),
      },
    ],
    [helicopterMap, crewMemberMap],
  );

  const [statusFilter, setStatusFilter] = useState<string>('SUBMITTED');

  const STATUS_FILTER_OPTIONS = [
    { value: 'all', label: 'Wszystkie' },
    { value: 'INTRODUCED', label: 'Wprowadzone', color: '#1d4ed8' },
    { value: 'SUBMITTED', label: 'Do akceptacji', color: '#d97706' },
    { value: 'REJECTED', label: 'Odrzucone', color: '#b91c1c' },
    { value: 'ACCEPTED', label: 'Zaakceptowane', color: '#16a34a' },
    { value: 'PARTIALLY_COMPLETED', label: 'Częściowo zreal.', color: '#7c3aed' },
    { value: 'COMPLETED', label: 'Zrealizowane', color: '#0f766e' },
    { value: 'NOT_COMPLETED', label: 'Nie zrealizowane', color: '#64748b' },
  ];

  const filterCounts = useMemo(() => {
    const counts: Record<string, number> = { all: flightOrders.length };
    for (const o of flightOrders) {
      counts[o.status] = (counts[o.status] || 0) + 1;
    }
    return counts;
  }, [flightOrders]);

  const filteredOrders = useMemo(
    () => statusFilter === 'all' ? flightOrders : flightOrders.filter((o) => o.status === statusFilter),
    [flightOrders, statusFilter],
  );

  const handleRowClick = (id: number) => {
    navigate(`/flight-orders/${id}`);
  };

  const showAddButton = user?.role && canCreate(user.role, 'flightOrders');

  return (
    <>
      <PageHeader
        title="Lista zleceń"
        subtitle="Zlecenia na lot helikopterem"
        action={
          showAddButton ? (
            <Button
              variant="contained"
              onClick={() => navigate('/flight-orders/new')}
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
              Dodaj zlecenie
            </Button>
          ) : undefined
        }
      />
      <Box sx={{ p: 3 }}>
      <FilterBar
        label="Status"
        options={STATUS_FILTER_OPTIONS}
        value={statusFilter}
        onChange={setStatusFilter}
        counts={filterCounts}
      />
      <DataTable
        rows={filteredOrders}
        columns={columns}
        loading={loadingOrders}
        onRowClick={handleRowClick}
        defaultSortField="plannedStartTime"
        defaultSortDirection="asc"
      />
      </Box>
    </>
  );
};

export default FlightOrderList;
