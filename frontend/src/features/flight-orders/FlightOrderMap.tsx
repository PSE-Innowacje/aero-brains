import React, { useMemo } from 'react';
import { Typography, Box } from '@mui/material';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { LandingSite } from '../../api/types';

// SVG marker icons
const svgIcon = (color: string) =>
  L.divIcon({
    className: '',
    html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="28" height="42">
      <path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 24 12 24s12-15 12-24C24 5.4 18.6 0 12 0z" fill="${color}" stroke="#fff" stroke-width="1.5"/>
      <circle cx="12" cy="12" r="5" fill="#fff"/>
    </svg>`,
    iconSize: [28, 42],
    iconAnchor: [14, 42],
    popupAnchor: [0, -42],
  });

const startIcon = svgIcon('#16a34a');
const endIcon = svgIcon('#dc2626');

interface FlightOrderMapProps {
  startSite?: LandingSite;
  endSite?: LandingSite;
  operationPoints?: Array<{ lat: number; lng: number }>;
}

// Auto-fit bounds
const FitBounds: React.FC<{ positions: Array<[number, number]> }> = ({ positions }) => {
  const map = useMap();
  React.useEffect(() => {
    if (positions.length > 0) {
      const bounds = L.latLngBounds(positions);
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 12 });
    }
  }, [map, positions]);
  return null;
};

const FlightOrderMap: React.FC<FlightOrderMapProps> = ({
  startSite,
  endSite,
  operationPoints,
}) => {
  const hasPoints = operationPoints && operationPoints.length > 0;

  if (!startSite && !endSite && !hasPoints) {
    return <Typography sx={{ fontSize: 12, color: '#94a3b8', py: 2 }}>Brak danych do wyświetlenia na mapie</Typography>;
  }

  // Operation route (solid blue line)
  const opLine = useMemo<[number, number][]>(() => {
    if (!hasPoints) return [];
    return operationPoints!.map((p) => [p.lat, p.lng]);
  }, [operationPoints, hasPoints]);

  // Dashed line: start airport → first operation point
  const transitToOp = useMemo<[number, number][]>(() => {
    if (!startSite || !hasPoints) return [];
    return [
      [startSite.latitude, startSite.longitude],
      opLine[0],
    ];
  }, [startSite, opLine, hasPoints]);

  // Dashed line: last operation point → end airport
  const transitFromOp = useMemo<[number, number][]>(() => {
    if (!endSite || !hasPoints) return [];
    return [
      opLine[opLine.length - 1],
      [endSite.latitude, endSite.longitude],
    ];
  }, [endSite, opLine, hasPoints]);

  // Fallback: direct dashed line between airports if no operation points
  const directTransit = useMemo<[number, number][]>(() => {
    if (hasPoints || !startSite || !endSite) return [];
    return [
      [startSite.latitude, startSite.longitude],
      [endSite.latitude, endSite.longitude],
    ];
  }, [startSite, endSite, hasPoints]);

  // All positions for bounds fitting
  const allPositions = useMemo<[number, number][]>(() => {
    const pos: [number, number][] = [];
    if (startSite) pos.push([startSite.latitude, startSite.longitude]);
    if (hasPoints) pos.push(...opLine);
    if (endSite) pos.push([endSite.latitude, endSite.longitude]);
    return pos;
  }, [startSite, endSite, opLine, hasPoints]);

  return (
    <Box sx={{ borderRadius: '10px', overflow: 'hidden', border: '0.5px solid #e2e8f0' }}>
      <MapContainer
        center={[52.0, 19.5]}
        zoom={6}
        style={{ height: 320, width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {allPositions.length > 0 && <FitBounds positions={allPositions} />}

        {/* Operation route — solid blue line */}
        {opLine.length >= 2 && (
          <Polyline positions={opLine} color="#3b7ff5" weight={3} />
        )}

        {/* Transit: start airport → operation start — dashed grey */}
        {transitToOp.length === 2 && (
          <Polyline
            positions={transitToOp}
            color="#94a3b8"
            weight={2}
            dashArray="8 6"
          />
        )}

        {/* Transit: operation end → end airport — dashed grey */}
        {transitFromOp.length === 2 && (
          <Polyline
            positions={transitFromOp}
            color="#94a3b8"
            weight={2}
            dashArray="8 6"
          />
        )}

        {/* Direct transit between airports (no operation points) */}
        {directTransit.length === 2 && (
          <Polyline
            positions={directTransit}
            color="#94a3b8"
            weight={2}
            dashArray="8 6"
          />
        )}

        {/* Start airport marker — green */}
        {startSite && (
          <Marker position={[startSite.latitude, startSite.longitude]} icon={startIcon}>
            <Popup><strong>Start</strong>{startSite.name}</Popup>
          </Marker>
        )}

        {/* End airport marker — red */}
        {endSite && (
          <Marker position={[endSite.latitude, endSite.longitude]} icon={endIcon}>
            <Popup><strong>Lądowanie</strong>{endSite.name}</Popup>
          </Marker>
        )}
      </MapContainer>
    </Box>
  );
};

export default FlightOrderMap;
