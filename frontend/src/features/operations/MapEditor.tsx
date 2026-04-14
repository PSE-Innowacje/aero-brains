import React, { useCallback } from 'react';
import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Box, Button, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { calculateRouteDistanceKm } from '../../shared/utils/kml';

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

const defaultIcon = svgIcon('#2196F3');
const startIcon = svgIcon('#4CAF50');
const endIcon = svgIcon('#F44336');

interface MapPoint {
  lat: number;
  lng: number;
}

interface MapEditorProps {
  points: MapPoint[];
  onPointsChange: (points: MapPoint[], distanceKm: number) => void;
  disabled?: boolean;
}

const DEFAULT_CENTER: [number, number] = [52.0, 19.5];
const DEFAULT_ZOOM = 6;

const FitBounds: React.FC<{ points: MapPoint[] }> = ({ points }) => {
  const map = useMap();

  React.useEffect(() => {
    if (points.length > 0) {
      const bounds = L.latLngBounds(points.map((p) => [p.lat, p.lng]));
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
    }
  }, [map, points]);

  return null;
};

const ClickHandler: React.FC<{ onClick: (latlng: L.LatLng) => void; disabled: boolean }> = ({
  onClick,
  disabled,
}) => {
  useMapEvents({
    click(e) {
      if (!disabled) {
        onClick(e.latlng);
      }
    },
  });
  return null;
};

const MapEditor: React.FC<MapEditorProps> = ({ points, onPointsChange, disabled = false }) => {
  const notify = useCallback(
    (newPoints: MapPoint[]) => {
      const distance = calculateRouteDistanceKm(newPoints);
      onPointsChange(newPoints, distance);
    },
    [onPointsChange],
  );

  const handleMapClick = useCallback(
    (latlng: L.LatLng) => {
      const newPoints = [...points, { lat: latlng.lat, lng: latlng.lng }];
      notify(newPoints);
    },
    [points, notify],
  );

  const handleMarkerDragEnd = useCallback(
    (index: number, latlng: L.LatLng) => {
      const newPoints = [...points];
      newPoints[index] = { lat: latlng.lat, lng: latlng.lng };
      notify(newPoints);
    },
    [points, notify],
  );

  const handleRemovePoint = useCallback(
    (index: number) => {
      const newPoints = points.filter((_, i) => i !== index);
      notify(newPoints);
    },
    [points, notify],
  );

  const handleClear = useCallback(() => {
    notify([]);
  }, [notify]);

  const getIcon = (index: number, total: number) => {
    if (total < 2) return defaultIcon;
    if (index === 0) return startIcon;
    if (index === total - 1) return endIcon;
    return defaultIcon;
  };

  const polylinePositions = points.map((p) => [p.lat, p.lng] as [number, number]);

  return (
    <Box>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
        <Typography variant="subtitle2">
          Trasa na mapie {points.length > 0 && `(${points.length} pkt)`}
        </Typography>
        {points.length > 0 && !disabled && (
          <Button size="small" startIcon={<DeleteIcon />} onClick={handleClear} color="error">
            Wyczyść trasę
          </Button>
        )}
      </Box>

      {!disabled && (
        <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
          Kliknij na mapę, aby dodać punkt trasy. Przeciągnij marker, aby zmienić jego pozycję.
          Kliknij na marker, aby go usunąć.
        </Typography>
      )}

      <MapContainer
        center={DEFAULT_CENTER}
        zoom={DEFAULT_ZOOM}
        style={{ height: 450, width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <ClickHandler onClick={handleMapClick} disabled={disabled} />

        {points.length > 0 && <FitBounds points={points} />}

        {polylinePositions.length > 1 && (
          <Polyline positions={polylinePositions} color="blue" weight={3} />
        )}

        {points.map((point, idx) => (
          <Marker
            key={idx}
            position={[point.lat, point.lng]}
            icon={getIcon(idx, points.length)}
            draggable={!disabled}
            eventHandlers={{
              dragend: (e) => {
                const marker = e.target as L.Marker;
                handleMarkerDragEnd(idx, marker.getLatLng());
              },
            }}
          >
            <Popup>
              <Box textAlign="center">
                <Typography variant="body2">
                  Punkt {idx + 1}
                </Typography>
                <Typography variant="caption" display="block">
                  {point.lat.toFixed(6)}, {point.lng.toFixed(6)}
                </Typography>
                {!disabled && (
                  <Button
                    size="small"
                    color="error"
                    onClick={() => handleRemovePoint(idx)}
                    sx={{ mt: 0.5 }}
                  >
                    Usuń
                  </Button>
                )}
              </Box>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </Box>
  );
};

export default MapEditor;
