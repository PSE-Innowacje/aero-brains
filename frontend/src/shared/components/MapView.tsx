import React, { type CSSProperties } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default marker icon — Vite doesn't bundle leaflet's default icon assets correctly.
// Use inline SVG data URIs instead.
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

interface MapMarker {
  lat: number;
  lng: number;
  label: string;
}

interface MapViewProps {
  center?: [number, number];
  zoom?: number;
  points?: MapPoint[];
  markers?: MapMarker[];
  style?: CSSProperties;
  fitToContent?: boolean;
}

const DEFAULT_CENTER: [number, number] = [52.0, 19.5];
const DEFAULT_ZOOM = 6;

/**
 * Helper component that auto-fits map bounds to all points + markers.
 */
const FitBounds: React.FC<{ points?: MapPoint[]; markers?: MapMarker[] }> = ({
  points,
  markers,
}) => {
  const map = useMap();

  React.useEffect(() => {
    const allLatLngs: L.LatLngExpression[] = [];
    if (points) {
      for (const p of points) {
        allLatLngs.push([p.lat, p.lng]);
      }
    }
    if (markers) {
      for (const m of markers) {
        allLatLngs.push([m.lat, m.lng]);
      }
    }
    if (allLatLngs.length > 0) {
      const bounds = L.latLngBounds(allLatLngs);
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
    }
  }, [map, points, markers]);

  return null;
};

const MapView: React.FC<MapViewProps> = ({
  center = DEFAULT_CENTER,
  zoom = DEFAULT_ZOOM,
  points,
  markers,
  style,
  fitToContent = true,
}) => {
  const polylinePositions = points?.map((p) => [p.lat, p.lng] as [number, number]);

  const hasContent =
    (points && points.length > 0) || (markers && markers.length > 0);

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height: 400, width: '100%', ...style }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {fitToContent && hasContent && (
        <FitBounds points={points} markers={markers} />
      )}

      {polylinePositions && polylinePositions.length > 0 && (
        <Polyline positions={polylinePositions} color="blue" weight={3} />
      )}

      {markers?.map((marker, idx) => {
        // Pick icon based on position: first = start (green), last = end (red), else default
        let icon = defaultIcon;
        if (markers.length >= 2 && idx === 0) icon = startIcon;
        else if (markers.length >= 2 && idx === markers.length - 1) icon = endIcon;

        return (
          <Marker key={idx} position={[marker.lat, marker.lng]} icon={icon}>
            <Popup>{marker.label}</Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default MapView;
