import React, { useMemo } from 'react';
import { Typography, Box } from '@mui/material';
import { MapContainer, TileLayer, Polyline, Marker, Popup, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { LandingSite } from '../../api/types';

const ROUTE_COLORS = ['#3b7ff5', '#7c3aed', '#0891b2', '#d97706', '#e04040', '#16a34a'];

const makeIcon = (color: string, label: string, size = 30) =>
  L.divIcon({
    className: '',
    html: `<div style="
      background:${color};border:2.5px solid #fff;border-radius:50%;
      width:${size}px;height:${size}px;display:flex;align-items:center;justify-content:center;
      color:#fff;font-size:${size * 0.4}px;font-weight:700;
      box-shadow:0 2px 10px rgba(0,0,0,0.3);
    ">${label}</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -(size / 2 + 4)],
  });

const startIcon = makeIcon('#16a34a', '▶', 30);
const endIcon = makeIcon('#dc2626', '■', 30);

interface FlightOrderMapProps {
  startSite?: LandingSite;
  endSite?: LandingSite;
  operationSegments?: Array<Array<{ lat: number; lng: number }>>;
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

function segmentDistance(points: Array<{ lat: number; lng: number }>): number {
  let d = 0;
  for (let i = 1; i < points.length; i++) d += haversineKm(points[i - 1], points[i]);
  return Math.round(d);
}

const FitBounds: React.FC<{ positions: [number, number][] }> = ({ positions }) => {
  const map = useMap();
  React.useEffect(() => {
    if (positions.length > 0) {
      map.fitBounds(L.latLngBounds(positions), { padding: [50, 50], maxZoom: 11 });
    }
  }, [map, positions]);
  return null;
};

const FlightOrderMap: React.FC<FlightOrderMapProps> = ({
  startSite,
  endSite,
  operationSegments = [],
}) => {
  const hasSegments = operationSegments.length > 0;

  if (!startSite && !endSite && !hasSegments) {
    return (
      <Box sx={{ bgcolor: '#f8fafc', borderRadius: '10px', border: '0.5px solid #e2e8f0', py: 4, textAlign: 'center' }}>
        <Typography sx={{ fontSize: 12, color: '#94a3b8' }}>
          Wybierz lądowiska i operacje, aby wyświetlić mapę trasy
        </Typography>
      </Box>
    );
  }

  // Build transit lines (dashed) between: start → seg[0], seg[0] end → seg[1] start, ..., seg[n] end → end
  const transitLines = useMemo(() => {
    const lines: Array<{ from: [number, number]; to: [number, number] }> = [];

    // Start airport → first segment start
    if (startSite && hasSegments) {
      const first = operationSegments[0][0];
      lines.push({
        from: [startSite.latitude, startSite.longitude],
        to: [first.lat, first.lng],
      });
    }

    // Between segments
    for (let i = 0; i < operationSegments.length - 1; i++) {
      const prevSeg = operationSegments[i];
      const nextSeg = operationSegments[i + 1];
      const prevEnd = prevSeg[prevSeg.length - 1];
      const nextStart = nextSeg[0];
      lines.push({
        from: [prevEnd.lat, prevEnd.lng],
        to: [nextStart.lat, nextStart.lng],
      });
    }

    // Last segment end → end airport
    if (endSite && hasSegments) {
      const lastSeg = operationSegments[operationSegments.length - 1];
      const lastPoint = lastSeg[lastSeg.length - 1];
      lines.push({
        from: [lastPoint.lat, lastPoint.lng],
        to: [endSite.latitude, endSite.longitude],
      });
    }

    // Direct: start → end (no segments)
    if (!hasSegments && startSite && endSite) {
      lines.push({
        from: [startSite.latitude, startSite.longitude],
        to: [endSite.latitude, endSite.longitude],
      });
    }

    return lines;
  }, [startSite, endSite, operationSegments, hasSegments]);

  // All positions for bounds
  const allPositions = useMemo<[number, number][]>(() => {
    const pos: [number, number][] = [];
    if (startSite) pos.push([startSite.latitude, startSite.longitude]);
    for (const seg of operationSegments) {
      for (const p of seg) pos.push([p.lat, p.lng]);
    }
    if (endSite) pos.push([endSite.latitude, endSite.longitude]);
    return pos;
  }, [startSite, endSite, operationSegments]);

  // Stats
  const stats = useMemo(() => {
    let transitTotal = 0;
    for (const line of transitLines) {
      transitTotal += haversineKm(
        { lat: line.from[0], lng: line.from[1] },
        { lat: line.to[0], lng: line.to[1] },
      );
    }
    let opTotal = 0;
    for (const seg of operationSegments) {
      opTotal += segmentDistance(seg);
    }
    return {
      transit: Math.round(transitTotal),
      operation: Math.round(opTotal),
      total: Math.round(transitTotal + opTotal),
    };
  }, [transitLines, operationSegments]);

  return (
    <Box sx={{ bgcolor: '#fff', borderRadius: '12px', border: '0.5px solid #e2e8f0', overflow: 'hidden' }}>
      <Box sx={{ borderBottom: '0.5px solid #e2e8f0' }}>
        <MapContainer center={[52.0, 19.5]} zoom={6} style={{ height: 360, width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {allPositions.length > 0 && <FitBounds positions={allPositions} />}

          {/* Operation segments — solid colored lines */}
          {operationSegments.map((seg, idx) => {
            const positions = seg.map((p) => [p.lat, p.lng] as [number, number]);
            const color = ROUTE_COLORS[idx % ROUTE_COLORS.length];
            return positions.length >= 2 ? (
              <Polyline key={`op-${idx}`} positions={positions} color={color} weight={4} />
            ) : null;
          })}

          {/* Transit lines — dashed grey */}
          {transitLines.map((line, idx) => (
            <Polyline
              key={`transit-${idx}`}
              positions={[line.from, line.to]}
              color="#94a3b8"
              weight={2}
              dashArray="8 6"
            />
          ))}

          {/* Start marker */}
          {startSite && (
            <Marker position={[startSite.latitude, startSite.longitude]} icon={startIcon}>
              <Tooltip permanent direction="top" offset={[0, -18]} className="route-label">
                Start
              </Tooltip>
              <Popup>
                <strong>Start: {startSite.name}</strong>
                <span style={{ display: 'block', fontSize: 10, color: '#64748b', fontFamily: 'monospace' }}>
                  {startSite.latitude.toFixed(4)}, {startSite.longitude.toFixed(4)}
                </span>
              </Popup>
            </Marker>
          )}

          {/* End marker */}
          {endSite && (
            <Marker position={[endSite.latitude, endSite.longitude]} icon={endIcon}>
              <Tooltip permanent direction="top" offset={[0, -18]} className="route-label">
                Lądowanie
              </Tooltip>
              <Popup>
                <strong>Lądowanie: {endSite.name}</strong>
                <span style={{ display: 'block', fontSize: 10, color: '#64748b', fontFamily: 'monospace' }}>
                  {endSite.latitude.toFixed(4)}, {endSite.longitude.toFixed(4)}
                </span>
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </Box>

      {/* Legend and stats */}
      <Box sx={{ px: '16px', py: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
        <Box sx={{ display: 'flex', gap: 2, fontSize: 11, color: '#64748b', flexWrap: 'wrap' }}>
          {operationSegments.map((_, idx) => (
            <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box sx={{ width: 18, height: 3, borderRadius: 2, bgcolor: ROUTE_COLORS[idx % ROUTE_COLORS.length] }} />
              Operacja {idx + 1}
            </Box>
          ))}
          {transitLines.length > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box sx={{ width: 18, height: 0, borderTop: '2px dashed #94a3b8' }} />
              Przelot
            </Box>
          )}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#16a34a', border: '1.5px solid #fff', boxShadow: '0 0 0 1px #16a34a' }} />
            Start
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#dc2626', border: '1.5px solid #fff', boxShadow: '0 0 0 1px #dc2626' }} />
            Lądowanie
          </Box>
        </Box>

        {stats.total > 0 && (
          <Box sx={{ display: 'flex', gap: 2, fontSize: 11 }}>
            {stats.operation > 0 && (
              <span style={{ color: '#3b7ff5' }}>Operacje: <strong>{stats.operation} km</strong></span>
            )}
            {stats.transit > 0 && (
              <span style={{ color: '#94a3b8' }}>Przeloty: <strong style={{ color: '#475569' }}>{stats.transit} km</strong></span>
            )}
            <span style={{ color: '#0f172a', fontWeight: 700 }}>Σ {stats.total} km</span>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default FlightOrderMap;
