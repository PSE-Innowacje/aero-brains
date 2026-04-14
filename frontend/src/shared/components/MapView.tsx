import React, { type CSSProperties } from 'react';
import { MapContainer, TileLayer, Polyline, CircleMarker, Popup, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

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

/**
 * Returns marker color config based on position in the markers array.
 */
function getMarkerStyle(idx: number, total: number) {
  if (total >= 2 && idx === 0) return { fillColor: '#16a34a', color: '#fff', label: 'Poczatek' }; // green = start
  if (total >= 2 && idx === total - 1) return { fillColor: '#dc2626', color: '#fff', label: 'Koniec' }; // red = end
  return { fillColor: '#3b7ff5', color: '#fff', label: '' }; // blue = middle
}

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
      style={{ height: 400, width: '100%', borderRadius: '10px', ...style }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {fitToContent && hasContent && (
        <FitBounds points={points} markers={markers} />
      )}

      {polylinePositions && polylinePositions.length > 0 && (
        <Polyline positions={polylinePositions} color="blue" weight={4} />
      )}

      {markers?.map((marker, idx) => {
        const markerCount = markers.length;
        const ms = getMarkerStyle(idx, markerCount);
        const isStartOrEnd = (markerCount >= 2 && idx === 0) || (markerCount >= 2 && idx === markerCount - 1);
        const tooltipLabel = markerCount >= 2 && idx === 0
          ? 'Początek'
          : markerCount >= 2 && idx === markerCount - 1
            ? 'Koniec'
            : null;

        return (
          <CircleMarker
            key={idx}
            center={[marker.lat, marker.lng]}
            radius={isStartOrEnd ? 8 : 6}
            pathOptions={{
              color: ms.color,
              weight: 2.5,
              fillColor: ms.fillColor,
              fillOpacity: 1,
            }}
          >
            {tooltipLabel && (
              <Tooltip permanent direction="top" offset={[0, -10]} className="route-label">
                {tooltipLabel}
              </Tooltip>
            )}
            <Popup>
              <strong>{marker.label}</strong>
            </Popup>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
};

export default MapView;
