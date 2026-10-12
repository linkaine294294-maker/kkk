import { Spot, NominatimResult } from '../types/itinerary';

/**
 * Generate Google Maps single spot link
 */
export function getGoogleMapsSpotUrl(spot: Spot): string {
  const query = `${spot.name} ${spot.originalName ? spot.originalName : ''} ${spot.city}`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query.trim())}`;
}

/**
 * Generate Google Maps navigation link
 */
export function getGoogleMapsNavigateUrl(spot: Spot): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${spot.lat},${spot.lng}`;
}

/**
 * Generate Google Maps day route link with origin, destination and waypoints
 */
export function getGoogleMapsDayRouteUrl(spots: Spot[]): string {
  if (!spots || spots.length === 0) return 'https://www.google.com/maps';
  if (spots.length === 1) return getGoogleMapsNavigateUrl(spots[0]);

  const origin = `${spots[0].lat},${spots[0].lng}`;
  const destination = `${spots[spots.length - 1].lat},${spots[spots.length - 1].lng}`;

  if (spots.length === 2) {
    return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;
  }

  // Google Maps supports up to 9 waypoints in standard URL format
  const waypoints = spots
    .slice(1, -1)
    .slice(0, 8)
    .map((s) => `${s.lat},${s.lng}`)
    .join('|');

  return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&waypoints=${encodeURIComponent(waypoints)}&travelmode=driving`;
}

/**
 * Search locations using OpenStreetMap Nominatim
 */
export async function searchNominatim(query: string): Promise<NominatimResult[]> {
  if (!query || query.trim().length < 2) return [];
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query.trim())}&addressdetails=1&limit=6`;
    const res = await fetch(url, {
      headers: {
        'Accept-Language': 'zh-TW,zh;q=0.9,en;q=0.8',
      },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.warn('Nominatim search failed', err);
    return [];
  }
}

/**
 * Reverse geocode coordinate using Nominatim
 */
export async function reverseGeocode(lat: number, lon: number): Promise<string> {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`;
    const res = await fetch(url, {
      headers: {
        'Accept-Language': 'zh-TW,zh;q=0.9,en;q=0.8',
      },
    });
    if (!res.ok) return '';
    const data = await res.json();
    return data.display_name || '';
  } catch {
    return '';
  }
}
