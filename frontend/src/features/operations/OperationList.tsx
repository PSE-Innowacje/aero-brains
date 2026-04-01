import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button, Box, Typography } from '@mui/material';
import type { GridColDef } from '@mui/x-data-grid';
import DataTable from '../../shared/components/DataTable';
import PageHeader from '../../shared/components/PageHeader';
import StatusBadge from '../../shared/components/StatusBadge';
import MapView from '../../shared/components/MapView';
import { api } from '../../api/client';
import {
  OPERATION_STATUS_LABELS,
  ACTIVITY_TYPE_LABELS,
  type OperationStatus,
  type ActivityTypeEntry,
  type FlightOperation,
} from '../../api/types';
import { useAuth } from '../../auth/AuthContext';
import { canEdit } from '../../shared/utils/permissions';

const ROUTE_COLORS = ['#3b7ff5', '#e04040', '#16a34a', '#d97706', '#7c3aed', '#0891b2'];

// Parse GeoJSON content to lat/lng points
function parseGeoJsonPoints(geojson?: string): Array<{ lat: number; lng: number }> {
  if (!geojson) return [];
  try {
    const parsed = JSON.parse(geojson);
    const points: Array<{ lat: number; lng: number }> = [];
    const features = parsed.type === 'FeatureCollection' ? parsed.features : [parsed];
    for (const feature of features) {
      const geom = feature.geometry || feature;
      if (geom.type === 'LineString') {
        for (const coord of geom.coordinates) {
          points.push({ lat: coord[1], lng: coord[0] });
        }
      } else if (geom.type === 'Point') {
        points.push({ lat: geom.coordinates[1], lng: geom.coordinates[0] });
      }
    }
    return points;
  } catch {
    return [];
  }
}

const columns: GridColDef[] = [
  {
    field: 'id',
    headerName: 'Nr',
    width: 70,
    renderCell: (params) => (
      <span style={{ fontFamily: 'monospace' }}>#{params.value}</span>
    ),
  },
  {
    field: 'orderProjectNumber',
    headerName: 'Zlecenie',
    width: 130,
    renderCell: (params) => (
      <span style={{ fontFamily: 'monospace', fontSize: 11 }}>{params.value}</span>
    ),
  },
  {
    field: 'shortDescription',
    headerName: 'Opis',
    flex: 1,
    minWidth: 160,
    renderCell: (params) => (
      <span style={{ fontSize: 11 }}>{params.value}</span>
    ),
  },
  {
    field: 'activities',
    headerName: 'Czynności',
    width: 200,
    renderCell: (params) => (
      <Box display="flex" flexWrap="wrap" gap={0.3}>
        {(params.value as ActivityTypeEntry[])?.map((t, i) => (
          <span
            key={i}
            style={{
              display: 'inline-block',
              padding: '1px 6px',
              borderRadius: 4,
              fontSize: 10,
              background: '#f1f5f9',
              color: '#475569',
            }}
          >
            {ACTIVITY_TYPE_LABELS[t.activityType as keyof typeof ACTIVITY_TYPE_LABELS] ?? t.activityType}
          </span>
        ))}
      </Box>
    ),
  },
  {
    field: 'proposedDateFrom',
    headerName: 'Propon. daty',
    width: 120,
    renderCell: (params) => {
      const row = params.row as FlightOperation;
      return (
        <span style={{ fontSize: 11 }}>
          {row.proposedDateFrom || '—'}
          {row.proposedDateTo && <><br />{row.proposedDateTo}</>}
        </span>
      );
    },
  },
  {
    field: 'plannedDateFrom',
    headerName: 'Plan. daty',
    width: 120,
    renderCell: (params) => {
      const row = params.row as FlightOperation;
      return (
        <span style={{ fontSize: 11 }}>
          {row.plannedDateFrom || '—'}
          {row.plannedDateTo && <><br />{row.plannedDateTo}</>}
        </span>
      );
    },
  },
  {
    field: 'routeLengthKm',
    headerName: 'Km',
    width: 70,
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

interface StatCardProps {
  label: string;
  value: number;
  color?: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, color }) => (
  <Box
    sx={{
      bgcolor: '#fff',
      borderRadius: '10px',
      border: '0.5px solid #e2e8f0',
      px: '15px',
      py: '12px',
    }}
  >
    <Typography sx={{ fontSize: 10, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
      {label}
    </Typography>
    <Typography sx={{ fontSize: 24, fontWeight: 700, color: color || '#0f172a', mt: '3px', lineHeight: 1 }}>
      {value}
    </Typography>
  </Box>
);

const OperationList: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: operations = [], isLoading } = useQuery({
    queryKey: ['operations'],
    queryFn: api.operations.getAll,
  });

  // Stats
  const total = operations.length;
  const confirmed = operations.filter((o) => o.status === 'CONFIRMED').length;
  const scheduled = operations.filter((o) => o.status === 'SCHEDULED').length;
  const completed = operations.filter((o) => o.status === 'COMPLETED').length;

  // Map data — collect all operation routes with colors
  const mapData = useMemo(() => {
    const allPoints: Array<{ lat: number; lng: number }> = [];
    const allMarkers: Array<{ lat: number; lng: number; label: string }> = [];

    operations.forEach((op, idx) => {
      const points = parseGeoJsonPoints(op.geojsonContent);
      if (points.length > 0) {
        allPoints.push(...points);
        // Add a marker at the start of each route
        allMarkers.push({
          lat: points[0].lat,
          lng: points[0].lng,
          label: `#${op.id} ${op.orderProjectNumber}`,
        });
      }
    });

    return { points: allPoints, markers: allMarkers };
  }, [operations]);

  const handleRowClick = (id: number) => {
    navigate(`/operations/${id}`);
  };

  const showAddButton = user?.role && canEdit(user.role, 'operations');

  return (
    <Box>
      <PageHeader
        title="Lista operacji lotniczych"
        subtitle="Planowane operacje i ich statusy"
        action={
          showAddButton ? (
            <Button
              variant="contained"
              onClick={() => navigate('/operations/new')}
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
              + Nowa operacja
            </Button>
          ) : undefined
        }
      />

      {/* Stat cards */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '10px',
          mb: '18px',
        }}
      >
        <StatCard label="Łącznie" value={total} />
        <StatCard label="Potwierdzone" value={confirmed} color="#1a7f4e" />
        <StatCard label="Zaplanowane" value={scheduled} color="#b45309" />
        <StatCard label="Zrealizowane" value={completed} color="#0f766e" />
      </Box>

      {/* Operations map */}
      <Box
        sx={{
          bgcolor: '#fff',
          borderRadius: '12px',
          border: '0.5px solid #e2e8f0',
          overflow: 'hidden',
          mb: '20px',
        }}
      >
        <Box
          sx={{
            px: '18px',
            py: '14px',
            borderBottom: '0.5px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>
            Mapa tras operacji
          </Typography>
        </Box>
        <Box sx={{ p: '14px' }}>
          {mapData.points.length > 0 ? (
            <MapView
              points={mapData.points}
              markers={mapData.markers}
              style={{ height: 320, borderRadius: 10 }}
            />
          ) : (
            <Typography sx={{ fontSize: 12, color: '#94a3b8', textAlign: 'center', py: 4 }}>
              Brak danych do wyświetlenia na mapie
            </Typography>
          )}
        </Box>
      </Box>

      {/* Operations table */}
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
