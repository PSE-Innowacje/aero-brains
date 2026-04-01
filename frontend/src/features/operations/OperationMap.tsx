import React, { useMemo } from 'react';
import { Typography, Box } from '@mui/material';
import { MapContainer, TileLayer, Polyline, CircleMarker, Popup, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface OperationMapProps {
  points?: Array<{ lat: number; lng: number }>;
}

function haversineKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const sinLat = Math.sin(dLat / 2);
  const sinLng = Math.sin(dLng / 2);
  const h = sinLat * sinLat + Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * sinLng * sinLng;
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

function routeDistance(points: Array<{ lat: number; lng: number }>): number {
  let d = 0;
  for (let i = 1; i < points.length; i++) d += haversineKm(points[i - 1], points[i]);
  return Math.round(d);
}

const FitBounds: React.FC<{ positions: [number, number][] }> = ({ positions }) => {
  const map = useMap();
  React.useEffect(() => {
    if (positions.length > 0) {
      map.fitBounds(L.latLngBounds(positions), { padding: [40, 40], maxZoom: 14 });
    }
  }, [map, positions]);
  return null;
};

const OperationMap: React.FC<OperationMapProps> = ({ points }) => {
  const positions = useMemo(
    () => points?.map((p) => [p.lat, p.lng] as [number, number]) ?? [],
    [points],
  );

  const distance = useMemo(
    () => (points && points.length >= 2 ? routeDistance(points) : null),
    [points],
  );

  const hasPoints = points && points.length > 0;

  return (
    <Box
      sx={{
        bgcolor: '#fff',
        borderRadius: '12px',
        border: '0.5px solid #e2e8f0',
        overflow: 'hidden',
      }}
    >
      {/* Card header */}
      <Box
        sx={{
          px: '18px',
          py: '14px',
          borderBottom: '0.5px solid #e2e8f0',
        }}
      >
        <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>
          Mapa trasy operacji
        </Typography>
      </Box>

      <Box sx={{ p: '14px' }}>
        {hasPoints ? (
          <>
            <Box sx={{ borderRadius: '10px', overflow: 'hidden', border: '0.5px solid #e2e8f0' }}>
              <MapContainer
                center={[points[0].lat, points[0].lng]}
                zoom={10}
                style={{ height: 400, width: '100%' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {positions.length > 0 && <FitBounds positions={positions} />}

                {positions.length >= 2 && (
                  <Polyline positions={positions} color="#3b7ff5" weight={4} />
                )}

                {/* Start marker */}
                <CircleMarker
                  center={[points[0].lat, points[0].lng]}
                  radius={8}
                  pathOptions={{
                    color: '#fff',
                    weight: 2.5,
                    fillColor: '#16a34a',
                    fillOpacity: 1,
                  }}
                >
                  <Tooltip permanent direction="top" offset={[0, -10]} className="route-label">
                    Początek
                  </Tooltip>
                  <Popup>
                    <strong>Początek trasy</strong>
                    <span style={{ display: 'block', fontSize: 10, color: '#64748b', fontFamily: 'monospace' }}>
                      {points[0].lat.toFixed(4)}, {points[0].lng.toFixed(4)}
                    </span>
                  </Popup>
                </CircleMarker>

                {/* End marker */}
                {points.length >= 2 && (
                  <CircleMarker
                    center={[points[points.length - 1].lat, points[points.length - 1].lng]}
                    radius={8}
                    pathOptions={{
                      color: '#fff',
                      weight: 2.5,
                      fillColor: '#dc2626',
                      fillOpacity: 1,
                    }}
                  >
                    <Tooltip permanent direction="top" offset={[0, -10]} className="route-label">
                      Koniec
                    </Tooltip>
                    <Popup>
                      <strong>Koniec trasy</strong>
                      <span style={{ display: 'block', fontSize: 10, color: '#64748b', fontFamily: 'monospace' }}>
                        {points[points.length - 1].lat.toFixed(4)}, {points[points.length - 1].lng.toFixed(4)}
                      </span>
                    </Popup>
                  </CircleMarker>
                )}
              </MapContainer>
            </Box>

            {/* Legend */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1, mt: 1.5 }}>
              <Box sx={{ display: 'flex', gap: 2, fontSize: 11, color: '#64748b', flexWrap: 'wrap' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Box sx={{ width: 18, height: 3, borderRadius: 2, bgcolor: '#3b7ff5' }} />
                  Trasa operacji
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#16a34a', border: '1.5px solid #fff', boxShadow: '0 0 0 1px #16a34a' }} />
                  Początek
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#dc2626', border: '1.5px solid #fff', boxShadow: '0 0 0 1px #dc2626' }} />
                  Koniec
                </Box>
              </Box>

              {distance !== null && distance > 0 && (
                <Box sx={{ fontSize: 11 }}>
                  <span style={{ color: '#0f172a', fontWeight: 700 }}>Dystans: {distance} km</span>
                </Box>
              )}
            </Box>
          </>
        ) : (
          <Box sx={{ bgcolor: '#f8fafc', borderRadius: '10px', border: '0.5px solid #e2e8f0', py: 4, textAlign: 'center' }}>
            <Typography sx={{ fontSize: 12, color: '#94a3b8' }}>
              Wgraj plik KML, aby wyświetlić mapę trasy
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default OperationMap;
