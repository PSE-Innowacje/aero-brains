import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button, Box } from '@mui/material';
import type { GridColDef } from '@mui/x-data-grid';
import DataTable from '../../shared/components/DataTable';
import PageHeader from '../../shared/components/PageHeader';
import StatusBadge from '../../shared/components/StatusBadge';
import { api } from '../../api/client';
import {
  FLIGHT_ORDER_STATUS_LABELS,
  type FlightOrderStatus,
} from '../../api/types';
import { useAuth } from '../../auth/AuthContext';
import { canEdit } from '../../shared/utils/permissions';

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

  const handleRowClick = (id: number) => {
    navigate(`/flight-orders/${id}`);
  };

  const showAddButton = user?.role && canEdit(user.role, 'flightOrders');

  return (
    <Box>
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
      <DataTable
        rows={flightOrders}
        columns={columns}
        loading={loadingOrders}
        onRowClick={handleRowClick}
        defaultSortField="plannedStartTime"
        defaultSortDirection="asc"
        initialFilter={{ field: 'status', operator: 'equals', value: 'PENDING_APPROVAL' }}
      />
    </Box>
  );
};

export default FlightOrderList;
