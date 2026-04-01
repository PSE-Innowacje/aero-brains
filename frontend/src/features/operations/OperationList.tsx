import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button, Box, Typography } from '@mui/material';
import type { GridColDef } from '@mui/x-data-grid';
import { MapContainer, TileLayer, Polyline, CircleMarker, Popup, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import DataTable from '../../shared/components/DataTable';
import PageHeader from '../../shared/components/PageHeader';
import StatusBadge from '../../shared/components/StatusBadge';
import FilterBar from '../../shared/components/FilterBar';
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

const STATUS_DOT_COLORS: Record<string, string> = {
  INTRODUCED: '#1d4ed8',
  REJECTED: '#b91c1c',
  CONFIRMED: '#1a7f4e',
  SCHEDULED: '#b45309',
  PARTIALLY_COMPLETED: '#7c3aed',
  COMPLETED: '#0f766e',
  CANCELLED: '#64748b',
};

// Auto-fit map bounds
const FitBounds: React.FC<{ positions: [number, number][] }> = ({ positions }) => {
  const map = useMap();
  React.useEffect(() => {
    if (positions.length > 0) {
      map.fitBounds(L.latLngBounds(positions), { padding: [40, 40], maxZoom: 10 });
    }
  }, [map, positions]);
  return null;
};

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
    width: 80,
    renderCell: (params) => {
      const row = params.row as FlightOperation;
      const dotColor = STATUS_DOT_COLORS[row.status] || '#64748b';
      return (
        <span style={{ fontFamily: 'monospace', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: dotColor, flexShrink: 0 }} />
          #{params.value}
        </span>
      );
    },
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
          {row.proposedDateFrom || '\u2014'}
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
          {row.plannedDateFrom || '\u2014'}
          {row.plannedDateTo && <><br />{row.plannedDateTo}</>}
        </span>
      );
    },
  },
  {
    field: 'routeLengthKm',
    headerName: 'Km',
    width: 80,
    renderCell: (params) => (
      <span>{params.value != null ? `${params.value} km` : '\u2014'}</span>
    ),
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
      borderLeft: color ? `3px solid ${color}` : '0.5px solid #e2e8f0',
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

  const STATUS_COLORS: Record<string, string> = {
    INTRODUCED: '#3b7ff5',
    REJECTED: '#b91c1c',
    CONFIRMED: '#16a34a',
    SCHEDULED: '#d97706',
    PARTIALLY_COMPLETED: '#7c3aed',
    COMPLETED: '#0f766e',
    CANCELLED: '#64748b',
  };

  const [hoveredOpId, setHoveredOpId] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('CONFIRMED');

  const filteredOperations = useMemo(
    () => statusFilter === 'all' ? operations : operations.filter((o) => o.status === statusFilter),
    [operations, statusFilter],
  );

  // Fetch geojson for all operations (cached, doesn't re-fetch on filter change)
  const [routeData, setRouteData] = useState<Record<number, Array<{ lat: number; lng: number }>>>({});

  useEffect(() => {
    if (operations.length === 0) return;
    let cancelled = false;
    const fetchRoutes = async () => {
      const results: Record<number, Array<{ lat: number; lng: number }>> = {};
      await Promise.all(
        operations.map(async (op) => {
          try {
            const geojson = await api.operations.getGeojson(op.id);
            const points = parseGeoJsonPoints(typeof geojson === 'string' ? geojson : JSON.stringify(geojson));
            if (points.length > 0) {
              results[op.id] = points;
            }
          } catch {
            // skip operations without geojson
          }
        }),
      );
      if (!cancelled) setRouteData(results);
    };
    fetchRoutes();
    return () => { cancelled = true; };
  }, [operations]);

  // Build per-route data from filtered operations
  const mapRoutes = useMemo(() => {
    return filteredOperations
      .filter((op) => routeData[op.id]?.length >= 2)
      .map((op) => ({
        id: op.id,
        label: `#${op.id} ${op.orderProjectNumber}`,
        status: op.status,
        color: STATUS_COLORS[op.status] || '#3b7ff5',
        points: routeData[op.id],
      }));
  }, [filteredOperations, routeData]);

  // All points for bounds fitting
  const allMapPositions = useMemo<[number, number][]>(() => {
    const pos: [number, number][] = [];
    for (const route of mapRoutes) {
      for (const p of route.points) {
        pos.push([p.lat, p.lng]);
      }
    }
    return pos;
  }, [mapRoutes]);

  const STATUS_FILTER_OPTIONS = [
    { value: 'all', label: 'Wszystkie' },
    { value: 'INTRODUCED', label: 'Wprowadzone', color: '#1d4ed8' },
    { value: 'REJECTED', label: 'Odrzucone', color: '#b91c1c' },
    { value: 'CONFIRMED', label: 'Potwierdzone', color: '#16a34a' },
    { value: 'SCHEDULED', label: 'Zaplanowane', color: '#d97706' },
    { value: 'PARTIALLY_COMPLETED', label: 'Częściowo zreal.', color: '#7c3aed' },
    { value: 'COMPLETED', label: 'Zrealizowane', color: '#0f766e' },
    { value: 'CANCELLED', label: 'Rezygnacja', color: '#64748b' },
  ];

  const filterCounts = useMemo(() => {
    const counts: Record<string, number> = { all: operations.length };
    for (const op of operations) {
      counts[op.status] = (counts[op.status] || 0) + 1;
    }
    return counts;
  }, [operations]);

  const handleRowClick = (id: number) => {
    navigate(`/operations/${id}`);
  };

  const showAddButton = user?.role && canEdit(user.role, 'operations');

  return (
    <>
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
      <Box sx={{ p: 3 }}>

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
          }}
        >
        <Box sx={{ p: '14px' }}>
          <Box sx={{ borderRadius: '10px', overflow: 'hidden', border: '0.5px solid #e2e8f0' }}>
            <MapContainer center={[52.0, 19.5]} zoom={6} style={{ height: 380, width: '100%' }}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {allMapPositions.length > 0 && <FitBounds positions={allMapPositions} />}
              {mapRoutes.map((route) => {
                  const positions = route.points.map((p) => [p.lat, p.lng] as [number, number]);
                  const start = route.points[0];
                  const end = route.points[route.points.length - 1];
                  const isHighlighted = hoveredOpId === route.id;
                  const isDimmed = hoveredOpId !== null && !isHighlighted;
                  return (
                    <React.Fragment key={route.id}>
                      {/* Route line */}
                      <Polyline
                        positions={positions}
                        color={route.color}
                        weight={isHighlighted ? 6 : 3}
                        opacity={isDimmed ? 0.45 : 1}
                        eventHandlers={{
                          mouseover: () => setHoveredOpId(route.id),
                          mouseout: () => setHoveredOpId(null),
                        }}
                      />
                      {/* Start pin — filled circle */}
                      <CircleMarker
                        center={[start.lat, start.lng]}
                        radius={isHighlighted ? 7 : 5}
                        pathOptions={{
                          color: '#fff',
                          weight: 2,
                          fillColor: route.color,
                          fillOpacity: isDimmed ? 0.45 : 1,
                          opacity: isDimmed ? 0.45 : 1,
                        }}
                      >
                        <Popup>
                          <strong>{route.label}</strong>
                          Początek trasy
                        </Popup>
                      </CircleMarker>
                      {/* End pin */}
                      <CircleMarker
                        center={[end.lat, end.lng]}
                        radius={isHighlighted ? 6 : 4}
                        pathOptions={{
                          color: route.color,
                          weight: 3,
                          fillColor: '#fff',
                          fillOpacity: isDimmed ? 0.45 : 1,
                          opacity: isDimmed ? 0.45 : 1,
                        }}
                      >
                        <Popup>
                          <strong>{route.label}</strong>
                          Koniec trasy
                        </Popup>
                      </CircleMarker>
                    </React.Fragment>
                  );
                })}
              </MapContainer>
            </Box>

          {/* Legend */}
          {mapRoutes.length > 0 && (() => {
            const visibleStatuses = [...new Set(mapRoutes.map((r) => r.status))];
            const STATUS_LABELS: Record<string, string> = {
              INTRODUCED: 'Wprowadzone', REJECTED: 'Odrzucone', CONFIRMED: 'Potwierdzone',
              SCHEDULED: 'Zaplanowane', PARTIALLY_COMPLETED: 'Częściowo zreal.',
              COMPLETED: 'Zrealizowane', CANCELLED: 'Rezygnacja',
            };
            return (
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 1, fontSize: 11, color: '#64748b' }}>
                {visibleStatuses.map((s) => (
                  <Box key={s} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Box sx={{ width: 18, height: 3, borderRadius: 2, bgcolor: STATUS_COLORS[s] || '#64748b' }} />
                    {STATUS_LABELS[s] || s}
                  </Box>
                ))}
              </Box>
            );
          })()}
        </Box>
      </Box>

      {/* Status filter */}
      <FilterBar
        label="Status"
        options={STATUS_FILTER_OPTIONS}
        value={statusFilter}
        onChange={setStatusFilter}
        counts={filterCounts}
      />

      {/* Operations table */}
      <DataTable
        rows={filteredOperations}
        columns={columns}
        loading={isLoading}
        onRowClick={handleRowClick}
        onRowHover={setHoveredOpId}
        highlightedRowId={hoveredOpId}
        defaultSortField="plannedDateFrom"
        defaultSortDirection="asc"
      />
      </Box>
    </>
  );
};

export default OperationList;
