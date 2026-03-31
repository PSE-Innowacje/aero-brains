import React from 'react';
import { Typography } from '@mui/material';
import MapView from '../../shared/components/MapView';

interface OperationMapProps {
  points?: Array<{ lat: number; lng: number }>;
}

const OperationMap: React.FC<OperationMapProps> = ({ points }) => {
  if (!points || points.length === 0) {
    return <Typography>Brak danych do wyświetlenia na mapie</Typography>;
  }

  const firstPoint = points[0];
  const lastPoint = points[points.length - 1];

  const markers = [
    { lat: firstPoint.lat, lng: firstPoint.lng, label: 'Początek' },
    { lat: lastPoint.lat, lng: lastPoint.lng, label: 'Koniec' },
  ];

  const center: [number, number] = [firstPoint.lat, firstPoint.lng];

  return (
    <MapView
      center={center}
      zoom={10}
      points={points}
      markers={markers}
    />
  );
};

export default OperationMap;
