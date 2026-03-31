import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button, Box, Typography } from '@mui/material';
import type { GridColDef } from '@mui/x-data-grid';
import DataTable from '../../shared/components/DataTable';
import StatusBadge from '../../shared/components/StatusBadge';
import { api } from '../../api/client';
import {
  OPERATION_STATUS_LABELS,
  ACTIVITY_TYPE_LABELS,
  type OperationStatus,
  type ActivityTypeEntry,
} from '../../api/types';
import { useAuth } from '../../auth/AuthContext';
import { canEdit } from '../../shared/utils/permissions';

const columns: GridColDef[] = [
  {
    field: 'id',
    headerName: 'Nr operacji',
    width: 150,
  },
  {
    field: 'orderProjectNumber',
    headerName: 'Nr zlecenia',
    width: 150,
  },
  {
    field: 'activities',
    headerName: 'Rodzaj czynności',
    flex: 1,
    minWidth: 200,
    valueFormatter: (value: ActivityTypeEntry[]) =>
      value?.map((t) => ACTIVITY_TYPE_LABELS[t.activityType as keyof typeof ACTIVITY_TYPE_LABELS] ?? t.activityType).join(', ') ?? '',
  },
  {
    field: 'proposedDateFrom',
    headerName: 'Proponowana od',
    width: 140,
  },
  {
    field: 'proposedDateTo',
    headerName: 'Proponowana do',
    width: 140,
  },
  {
    field: 'plannedDateFrom',
    headerName: 'Planowana od',
    width: 140,
  },
  {
    field: 'plannedDateTo',
    headerName: 'Planowana do',
    width: 140,
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 180,
    renderCell: (params) => (
      <StatusBadge
        statusCode={params.value as string}
        label={OPERATION_STATUS_LABELS[params.value as OperationStatus] ?? ''}
      />
    ),
  },
];

const OperationList: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: operations = [], isLoading } = useQuery({
    queryKey: ['operations'],
    queryFn: api.operations.getAll,
  });

  const handleRowClick = (id: number) => {
    navigate(`/operations/${id}`);
  };

  const showAddButton = user?.role && canEdit(user.role, 'operations');

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Operacje</Typography>
        {showAddButton && (
          <Button
            variant="contained"
            onClick={() => navigate('/operations/new')}
          >
            Dodaj operację
          </Button>
        )}
      </Box>
      <DataTable
        rows={operations}
        columns={columns}
        loading={isLoading}
        onRowClick={handleRowClick}
        defaultSortField="plannedDateFrom"
        defaultSortDirection="asc"
        initialFilter={{ field: 'status', operator: 'equals', value: 'CONFIRMED' }}
      />
    </Box>
  );
};

export default OperationList;
