export interface KmlPoint {
  lat: number;
  lng: number;
  name?: string;
}

/**
 * Parse a KML file string and extract coordinates from Placemarks.
 * Supports <Point>, <LineString>, and <LinearRing> geometries.
 */
export function parseKml(kmlString: string): KmlPoint[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(kmlString, 'application/xml');
  const points: KmlPoint[] = [];

  // Extract from <Placemark> elements
  const placemarks = doc.getElementsByTagName('Placemark');
  for (let i = 0; i < placemarks.length; i++) {
    const placemark = placemarks[i];
    const nameEl = placemark.getElementsByTagName('name')[0];
    const name = nameEl?.textContent?.trim() || undefined;

    // Point geometry
    const pointEls = placemark.getElementsByTagName('Point');
    for (let j = 0; j < pointEls.length; j++) {
      const coords = pointEls[j].getElementsByTagName('coordinates')[0];
      if (coords?.textContent) {
        const parsed = parseCoordinateString(coords.textContent);
        for (const p of parsed) {
          points.push({ ...p, name });
        }
      }
    }

    // LineString geometry
    const lineEls = placemark.getElementsByTagName('LineString');
    for (let j = 0; j < lineEls.length; j++) {
      const coords = lineEls[j].getElementsByTagName('coordinates')[0];
      if (coords?.textContent) {
        const parsed = parseCoordinateString(coords.textContent);
        for (const p of parsed) {
          points.push({ ...p, name: name ?? undefined });
        }
      }
    }

    // LinearRing (polygons)
    const ringEls = placemark.getElementsByTagName('LinearRing');
    for (let j = 0; j < ringEls.length; j++) {
      const coords = ringEls[j].getElementsByTagName('coordinates')[0];
      if (coords?.textContent) {
        const parsed = parseCoordinateString(coords.textContent);
        for (const p of parsed) {
          points.push({ ...p, name: name ?? undefined });
        }
      }
    }
  }

  return points;
}

/**
 * Parse a KML coordinates string: "lng,lat,alt lng,lat,alt ..."
 * KML uses longitude,latitude,altitude order.
 */
function parseCoordinateString(coordStr: string): KmlPoint[] {
  const points: KmlPoint[] = [];
  const tuples = coordStr.trim().split(/\s+/);
  for (const tuple of tuples) {
    const parts = tuple.split(',');
    if (parts.length >= 2) {
      const lng = parseFloat(parts[0]);
      const lat = parseFloat(parts[1]);
      if (!isNaN(lat) && !isNaN(lng)) {
        points.push({ lat, lng });
      }
    }
  }
  return points;
}

/**
 * Calculate approximate total route distance in km from a list of points.
 * Uses the Haversine formula.
 */
export function calculateRouteDistanceKm(points: KmlPoint[]): number {
  let total = 0;
  for (let i = 1; i < points.length; i++) {
    total += haversineKm(points[i - 1], points[i]);
  }
  return Math.round(total);
}

function haversineKm(a: KmlPoint, b: KmlPoint): number {
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const sinLat = Math.sin(dLat / 2);
  const sinLng = Math.sin(dLng / 2);
  const h =
    sinLat * sinLat +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * sinLng * sinLng;
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}
