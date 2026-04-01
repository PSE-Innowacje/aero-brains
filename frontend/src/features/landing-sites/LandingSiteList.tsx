import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button, Box, Typography } from '@mui/material';
import type { GridColDef } from '@mui/x-data-grid';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import DataTable from '../../shared/components/DataTable';
import PageHeader from '../../shared/components/PageHeader';
import { api } from '../../api/client';
import { useAuth } from '../../auth/AuthContext';
import { canEdit } from '../../shared/utils/permissions';

const airportIcon = L.divIcon({
  className: '',
  html: `<div style="background:#3b7ff5;border:2px solid #fff;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;color:#fff;font-size:11px;font-weight:700;box-shadow:0 2px 8px rgba(0,0,0,0.25)">🛬</div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
  popupAnchor: [0, -16],
});

const highlightedIcon = L.divIcon({
  className: '',
  html: `<div style="background:#2563eb;border:3px solid #fff;border-radius:50%;width:36px;height:36px;display:flex;align-items:center;justify-content:center;color:#fff;font-size:14px;font-weight:700;box-shadow:0 3px 12px rgba(37,99,235,0.4)">🛬</div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
  popupAnchor: [0, -20],
});

// Auto-fit bounds
const FitBounds: React.FC<{ positions: [number, number][] }> = ({ positions }) => {
  const map = useMap();
  React.useEffect(() => {
    if (positions.length > 0) {
      map.fitBounds(L.latLngBounds(positions), { padding: [40, 40], maxZoom: 10 });
    }
  }, [map, positions]);
  return null;
};

const columns: GridColDef[] = [
  {
    field: 'name',
    headerName: 'Nazwa',
    flex: 1,
    minWidth: 200,
    renderCell: (params) => (
      <span style={{ fontWeight: 600 }}>{params.value}</span>
    ),
  },
  {
    field: 'latitude',
    headerName: 'Szerokość',
    width: 120,
    renderCell: (params) => (
      <span style={{ fontFamily: 'monospace', fontSize: 11 }}>
        {params.row.latitude?.toFixed(4) ?? ''}
      </span>
    ),
  },
  {
    field: 'longitude',
    headerName: 'Długość',
    width: 120,
    renderCell: (params) => (
      <span style={{ fontFamily: 'monospace', fontSize: 11 }}>
        {params.row.longitude?.toFixed(4) ?? ''}
      </span>
    ),
  },
];

const LandingSiteList: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [hoveredSiteId, setHoveredSiteId] = useState<number | null>(null);

  const { data: landingSites = [], isLoading } = useQuery({
    queryKey: ['landingSites'],
    queryFn: api.landingSites.getAll,
  });

  const mapPositions = useMemo<[number, number][]>(
    () => landingSites.map((s) => [s.latitude, s.longitude]),
    [landingSites],
  );

  const handleRowClick = (id: number) => {
    navigate(`/landing-sites/${id}`);
  };

  const showAddButton = user?.role && canEdit(user.role, 'administration');

  return (
    <>
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
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2.5, mb: 2.5 }}>
          {/* Map card */}
          <Box
            sx={{
              bgcolor: '#fff',
              borderRadius: '12px',
              border: '0.5px solid #e2e8f0',
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                px: '18px',
                py: '14px',
                borderBottom: '0.5px solid #e2e8f0',
              }}
            >
              <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>
                Mapa lądowisk
              </Typography>
            </Box>
            <Box sx={{ p: '14px' }}>
              {landingSites.length > 0 ? (
                <Box sx={{ borderRadius: '10px', overflow: 'hidden', border: '0.5px solid #e2e8f0' }}>
                  <MapContainer center={[52.0, 19.5]} zoom={6} style={{ height: 340, width: '100%' }}>
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {mapPositions.length > 0 && <FitBounds positions={mapPositions} />}
                    {landingSites.map((site) => (
                      <Marker
                        key={site.id}
                        position={[site.latitude, site.longitude]}
                        icon={hoveredSiteId === site.id ? highlightedIcon : airportIcon}
                        eventHandlers={{
                          mouseover: () => setHoveredSiteId(site.id),
                          mouseout: () => setHoveredSiteId(null),
                        }}
                      >
                        <Popup>
                          <strong>{site.name}</strong>
                          <span style={{ fontSize: 11, fontFamily: 'monospace', display: 'block', marginTop: 2, color: '#64748b' }}>
                            {site.latitude.toFixed(4)}, {site.longitude.toFixed(4)}
                          </span>
                        </Popup>
                      </Marker>
                    ))}
                  </MapContainer>
                </Box>
              ) : (
                <Typography sx={{ fontSize: 12, color: '#94a3b8', textAlign: 'center', py: 4 }}>
                  Brak lądowisk
                </Typography>
              )}
            </Box>
          </Box>

          {/* Table card */}
          <Box>
            <DataTable
              rows={landingSites}
              columns={columns}
              loading={isLoading}
              onRowClick={handleRowClick}
              onRowHover={setHoveredSiteId}
              highlightedRowId={hoveredSiteId}
              defaultSortField="name"
              defaultSortDirection="asc"
            />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default LandingSiteList;
