import React from 'react';
import { Typography } from '@mui/material';
import MapView from '../../shared/components/MapView';
import type { LandingSite } from '../../api/types';

interface FlightOrderMapProps {
  startSite?: LandingSite;
  endSite?: LandingSite;
  operationPoints?: Array<{ lat: number; lng: number }>;
}

const FlightOrderMap: React.FC<FlightOrderMapProps> = ({
  startSite,
  endSite,
  operationPoints,
}) => {
  const hasMarkers = startSite || endSite;
  const hasPoints = operationPoints && operationPoints.length > 0;

  if (!hasMarkers && !hasPoints) {
    return <Typography>Brak danych do wyświetlenia na mapie</Typography>;
  }

  const markers = [];
  if (startSite) {
    markers.push({
      lat: startSite.coordinates.lat,
      lng: startSite.coordinates.lng,
      label: `Start: ${startSite.name}`,
    });
  }
  if (endSite) {
    markers.push({
      lat: endSite.coordinates.lat,
      lng: endSite.coordinates.lng,
      label: `Lądowanie: ${endSite.name}`,
    });
  }

  const center: [number, number] = startSite
    ? [startSite.coordinates.lat, startSite.coordinates.lng]
    : endSite
      ? [endSite.coordinates.lat, endSite.coordinates.lng]
      : hasPoints
        ? [operationPoints![0].lat, operationPoints![0].lng]
        : [52.0, 19.5];

  return (
    <MapView
      center={center}
      zoom={10}
      points={hasPoints ? operationPoints : undefined}
      markers={markers.length > 0 ? markers : undefined}
    />
  );
};

export default FlightOrderMap;
