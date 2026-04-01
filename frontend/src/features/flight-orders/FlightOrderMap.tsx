import React, { useMemo } from 'react';
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
      lat: startSite.latitude,
      lng: startSite.longitude,
      label: `Start: ${startSite.name}`,
    });
  }
  if (endSite) {
    markers.push({
      lat: endSite.latitude,
      lng: endSite.longitude,
      label: `Lądowanie: ${endSite.name}`,
    });
  }

  // Build a complete route line: start site → operation points → end site
  const routeLine = useMemo(() => {
    const line: Array<{ lat: number; lng: number }> = [];
    if (startSite) {
      line.push({ lat: startSite.latitude, lng: startSite.longitude });
    }
    if (hasPoints) {
      line.push(...operationPoints!);
    }
    if (endSite) {
      line.push({ lat: endSite.latitude, lng: endSite.longitude });
    }
    return line.length >= 2 ? line : undefined;
  }, [startSite, endSite, operationPoints, hasPoints]);

  return (
    <MapView
      zoom={10}
      points={routeLine}
      markers={markers.length > 0 ? markers : undefined}
    />
  );
};

export default FlightOrderMap;
