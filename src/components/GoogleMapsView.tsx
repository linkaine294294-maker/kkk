import React, { useState, useEffect, useRef } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
  useMap,
  useMapsLibrary,
} from '@vis.gl/react-google-maps';
import { Spot, DayPlan } from '../types/itinerary';
import {
  Locate,
  PlusCircle,
  Maximize2,
  Navigation,
  ExternalLink,
  Layers,
} from 'lucide-react';
import { getGoogleMapsNavigateUrl } from '../utils/mapUtils';
import { JOURNEY_WAYPOINTS } from '../data/journeyRouteData';

interface GoogleMapsViewProps {
  apiKey: string;
  spots: Spot[];
  dayPlans: DayPlan[];
  selectedDay?: number | null;
  visibleDays: number[];
  onSpotSelect: (spot: Spot) => void;
  onMapClickAddSpot?: (lat: number, lng: number) => void;
  isClickToAddMode?: boolean;
  highlightSpotId?: string;
  heightClass?: string;
  showGlowPath?: boolean;
  activeWaypointDay?: number | null;
  onWaypointSelect?: (day: number) => void;
}

// Inner helper component to draw polylines for each visible day
const DayRoutesRenderer: React.FC<{
  spots: Spot[];
  dayPlans: DayPlan[];
  activeDays: number[];
}> = ({ spots, dayPlans, activeDays }) => {
  const map = useMap();
  const mapsLib = useMapsLibrary('maps');
  const polylinesRef = useRef<google.maps.Polyline[]>([]);

  useEffect(() => {
    if (!map || !mapsLib) return;

    // Clear old polylines
    polylinesRef.current.forEach((p) => p.setMap(null));
    polylinesRef.current = [];

    // Group spots by day
    const dayMap: { [day: number]: Spot[] } = {};
    activeDays.forEach((d) => {
      dayMap[d] = [];
    });

    spots.forEach((s) => {
      if (dayMap[s.day]) {
        dayMap[s.day].push(s);
      }
    });

    // Draw polylines
    Object.entries(dayMap).forEach(([dayStr, dSpots]) => {
      if (dSpots.length > 1) {
        const dayNum = Number(dayStr);
        const plan = dayPlans.find((p) => p.dayNumber === dayNum);
        const color = plan ? plan.color : '#10b981';

        const path = dSpots.map((s) => ({ lat: s.lat, lng: s.lng }));

        const line = new google.maps.Polyline({
          path,
          geodesic: true,
          strokeColor: color,
          strokeOpacity: 0.85,
          strokeWeight: 4,
          map,
        });

        polylinesRef.current.push(line);
      }
    });

    return () => {
      polylinesRef.current.forEach((p) => p.setMap(null));
      polylinesRef.current = [];
    };
  }, [map, mapsLib, spots, dayPlans, activeDays]);

  return null;
};

// Map Controller for Auto-fit bounds
const MapBoundsController: React.FC<{
  spots: Spot[];
  activeDays: number[];
  selectedDay?: number | null;
}> = ({ spots, activeDays, selectedDay }) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    const filtered = spots.filter((s) => activeDays.includes(s.day));
    if (filtered.length === 0) return;

    const bounds = new google.maps.LatLngBounds();
    filtered.forEach((s) => {
      bounds.extend({ lat: s.lat, lng: s.lng });
    });

    map.fitBounds(bounds, {
      top: 50,
      right: 50,
      bottom: 50,
      left: 50,
    });

    if (selectedDay !== null && filtered.length === 1) {
      map.setZoom(14);
    }
  }, [map, spots, activeDays, selectedDay]);

  return null;
};

// Transnational Dynamic Glowing Route Renderer connecting 15 daily target points
const TransnationalGlowRenderer: React.FC<{
  showGlowPath: boolean;
  activeWaypointDay?: number | null;
  onWaypointSelect?: (day: number) => void;
}> = ({ showGlowPath, activeWaypointDay, onWaypointSelect }) => {
  const map = useMap();
  const mapsLib = useMapsLibrary('maps');
  const polylinesRef = useRef<google.maps.Polyline[]>([]);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!map || !mapsLib || !showGlowPath) return;

    polylinesRef.current.forEach((p) => p.setMap(null));
    polylinesRef.current = [];

    const pathCoords = JOURNEY_WAYPOINTS.map((w) => ({ lat: w.lat, lng: w.lng }));

    // Outer glow halo polyline
    const outerHalo = new google.maps.Polyline({
      path: pathCoords,
      geodesic: true,
      strokeColor: '#059669',
      strokeOpacity: 0.35,
      strokeWeight: 10,
      map,
    });
    polylinesRef.current.push(outerHalo);

    // Inner glowing path with animated arrows
    const lineSymbol = {
      path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
      scale: 2.5,
      strokeColor: '#ffffff',
      fillColor: '#34d399',
      fillOpacity: 1,
      strokeWeight: 1.5,
    };

    const innerLine = new google.maps.Polyline({
      path: pathCoords,
      geodesic: true,
      strokeColor: '#34d399',
      strokeOpacity: 0.95,
      strokeWeight: 3.5,
      icons: [
        {
          icon: lineSymbol,
          offset: '0%',
          repeat: '70px',
        },
      ],
      map,
    });
    polylinesRef.current.push(innerLine);

    let offset = 0;
    const animateTrail = () => {
      offset = (offset + 0.35) % 200;
      const icons = innerLine.get('icons');
      if (icons && icons[0]) {
        icons[0].offset = offset / 2 + '%';
        innerLine.set('icons', icons);
      }
      animFrameRef.current = requestAnimationFrame(animateTrail);
    };
    animFrameRef.current = requestAnimationFrame(animateTrail);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      polylinesRef.current.forEach((p) => p.setMap(null));
      polylinesRef.current = [];
    };
  }, [map, mapsLib, showGlowPath]);

  // Pan to active waypoint when selected
  useEffect(() => {
    if (!map || !activeWaypointDay) return;
    const targetWp = JOURNEY_WAYPOINTS.find((w) => w.day === activeWaypointDay);
    if (targetWp) {
      map.panTo({ lat: targetWp.lat, lng: targetWp.lng });
    }
  }, [map, activeWaypointDay]);

  return null;
};

export const GoogleMapsView: React.FC<GoogleMapsViewProps> = ({
  apiKey,
  spots,
  dayPlans,
  selectedDay = null,
  visibleDays,
  onSpotSelect,
  onMapClickAddSpot,
  isClickToAddMode = false,
  highlightSpotId,
  heightClass = 'h-[540px]',
  showGlowPath = true,
  activeWaypointDay = null,
  onWaypointSelect,
}) => {
  const activeDays = selectedDay !== null ? [selectedDay] : visibleDays;
  const filteredSpots = spots.filter((s) => activeDays.includes(s.day));

  const [activeInfoWindowSpot, setActiveInfoWindowSpot] = useState<Spot | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState(false);
  const [mapType, setMapType] = useState<'roadmap' | 'satellite' | 'hybrid' | 'terrain'>('roadmap');

  // Handle My Location
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert('您的瀏覽器不支援地理定位');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        const { latitude, longitude } = pos.coords;
        setUserLocation({ lat: latitude, lng: longitude });
      },
      (err) => {
        setLocating(false);
        alert('無法取得您的位置，請確認定位權限是否開啟。');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Group spots by day to compute sequence numbers
  const daySpotsCounter: Record<string, number> = {};

  return (
    <div className={`relative w-full ${heightClass} rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl`}>
      <APIProvider apiKey={apiKey} language="zh-TW" region="DK">
        <Map
          defaultCenter={{ lat: 61.0, lng: 15.0 }}
          defaultZoom={4}
          mapId="DEMO_MAP_ID"
          internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
          mapTypeId={mapType}
          gestureHandling="greedy"
          disableDefaultUI={false}
          className="w-full h-full"
          onClick={(e) => {
            if (e.detail.latLng && onMapClickAddSpot) {
              onMapClickAddSpot(e.detail.latLng.lat, e.detail.latLng.lng);
            }
          }}
        >
          {/* Auto bounds controller */}
          <MapBoundsController
            spots={spots}
            activeDays={activeDays}
            selectedDay={selectedDay}
          />

          {/* Draw connecting routes between spots */}
          <DayRoutesRenderer
            spots={spots}
            dayPlans={dayPlans}
            activeDays={activeDays}
          />

          {/* Transnational Dynamic Glowing Route Renderer */}
          <TransnationalGlowRenderer
            showGlowPath={showGlowPath}
            activeWaypointDay={activeWaypointDay}
            onWaypointSelect={onWaypointSelect}
          />

          {/* Animated Waypoint Radar Markers for Route Turning Points */}
          {showGlowPath &&
            JOURNEY_WAYPOINTS.map((wp) => {
              if (!wp.isTurningPoint && wp.day !== activeWaypointDay) return null;
              const isCurrentActive = wp.day === activeWaypointDay;
              return (
                <AdvancedMarker
                  key={`turnpoint-${wp.day}`}
                  position={{ lat: wp.lat, lng: wp.lng }}
                  title={`${wp.turningPointTitle || wp.city} (${wp.transitBadge || ''})`}
                  onClick={() => {
                    if (onWaypointSelect) onWaypointSelect(wp.day);
                  }}
                >
                  <div className="relative flex items-center justify-center cursor-pointer group select-none">
                    <div className="absolute w-12 h-12 rounded-full bg-emerald-400/30 waypoint-radar-ring pointer-events-none" />
                    <div className="absolute w-7 h-7 rounded-full bg-cyan-400/40 animate-ping pointer-events-none" />
                    <div
                      className={`relative px-2 py-1 rounded-xl bg-slate-950/95 border-2 ${
                        isCurrentActive
                          ? 'border-amber-400 scale-125 ring-4 ring-amber-400/40'
                          : 'border-emerald-400'
                      } shadow-2xl flex items-center gap-1.5 text-white turnpoint-badge-glow transition-transform hover:scale-115`}
                    >
                      <span className="text-xs">{wp.countryFlag}</span>
                      <span className="text-[10px] font-bold font-mono text-emerald-300">D{wp.day}</span>
                      <span className="text-[11px]">
                        {wp.transitType === 'flight'
                          ? '✈️'
                          : wp.transitType === 'train'
                          ? '🚆'
                          : wp.transitType === 'start'
                          ? '🚩'
                          : '🏁'}
                      </span>
                    </div>
                  </div>
                </AdvancedMarker>
              );
            })}

          {/* Render Advanced Markers */}
          {filteredSpots.map((spot) => {
            const plan = dayPlans.find((p) => p.dayNumber === spot.day);
            const color = plan ? plan.color : '#10b981';

            if (!daySpotsCounter[spot.day]) {
              daySpotsCounter[spot.day] = 0;
            }
            daySpotsCounter[spot.day] += 1;
            const seqNumber = daySpotsCounter[spot.day];

            const isHighlighted = highlightSpotId === spot.id;

            return (
              <AdvancedMarker
                key={spot.id}
                position={{ lat: spot.lat, lng: spot.lng }}
                title={`${spot.name} (Day ${spot.day} #${seqNumber})`}
                onClick={() => setActiveInfoWindowSpot(spot)}
              >
                <div className={`relative flex items-center justify-center cursor-pointer transition-transform duration-200 ${
                  isHighlighted ? 'scale-125 z-50' : 'hover:scale-115'
                }`}>
                  <div
                    style={{ backgroundColor: color }}
                    className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-bold shadow-lg border-2 border-white"
                  >
                    {seqNumber}
                  </div>
                  <div
                    className="absolute -bottom-1 w-1.5 h-1.5 rotate-45"
                    style={{ backgroundColor: color }}
                  />
                </div>
              </AdvancedMarker>
            );
          })}

          {/* User Location Marker */}
          {userLocation && (
            <AdvancedMarker position={userLocation} title="📍 您目前的位置">
              <div className="relative flex items-center justify-center">
                <span className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-sky-400 opacity-80" />
                <div className="w-5 h-5 rounded-full bg-sky-500 border-2 border-white shadow-xl" />
              </div>
            </AdvancedMarker>
          )}

          {/* Info Window on Clicked Spot */}
          {activeInfoWindowSpot && (
            <InfoWindow
              position={{
                lat: activeInfoWindowSpot.lat,
                lng: activeInfoWindowSpot.lng,
              }}
              onCloseClick={() => setActiveInfoWindowSpot(null)}
              headerContent={
                <div className="text-xs font-bold text-slate-900">
                  Day {activeInfoWindowSpot.day} · {activeInfoWindowSpot.city}
                </div>
              }
            >
              <div className="w-64 p-1 text-slate-900 font-sans">
                <div className="overflow-hidden rounded-lg mb-2 h-28 bg-slate-200">
                  <img
                    src={
                      activeInfoWindowSpot.images?.[0]?.url ||
                      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Stortorget_2006.jpg/1280px-Stortorget_2006.jpg'
                    }
                    alt={activeInfoWindowSpot.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className="text-sm font-bold text-slate-900 leading-snug mb-1">
                  {activeInfoWindowSpot.name}
                </h4>
                <p className="text-xs text-slate-600 line-clamp-2 mb-2 leading-relaxed">
                  {activeInfoWindowSpot.description}
                </p>
                <div className="flex items-center gap-1.5 pt-1 border-t border-slate-100">
                  <button
                    onClick={() => {
                      onSpotSelect(activeInfoWindowSpot);
                      setActiveInfoWindowSpot(null);
                    }}
                    className="flex-1 py-1.5 px-2 text-xs font-semibold bg-slate-900 text-white rounded-lg hover:bg-slate-800 text-center transition-colors"
                  >
                    查看景點詳情
                  </button>
                  <a
                    href={getGoogleMapsNavigateUrl(activeInfoWindowSpot)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-1.5 px-2.5 text-xs font-semibold text-emerald-700 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors"
                  >
                    導航
                  </a>
                </div>
              </div>
            </InfoWindow>
          )}
        </Map>
      </APIProvider>

      {/* Floating Top Controls */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
        {/* Map Type Switcher */}
        <div className="flex bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-xl p-1 shadow-lg text-xs">
          <button
            onClick={() => setMapType('roadmap')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
              mapType === 'roadmap' ? 'bg-slate-700 text-emerald-400 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Google 標準
          </button>
          <button
            onClick={() => setMapType('hybrid')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
              mapType === 'hybrid' ? 'bg-slate-700 text-sky-400 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            極地衛星
          </button>
          <button
            onClick={() => setMapType('terrain')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
              mapType === 'terrain' ? 'bg-slate-700 text-amber-400 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            地勢地形
          </button>
        </div>

        {/* Locate Me Button */}
        <button
          onClick={handleLocateMe}
          disabled={locating}
          title="我的位置"
          className="p-2.5 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 text-slate-200 hover:text-emerald-400 rounded-xl shadow-lg transition-colors flex items-center justify-center self-end"
        >
          <Locate className={`w-4 h-4 ${locating ? 'animate-spin text-emerald-400' : ''}`} />
        </button>
      </div>

      {/* Click-to-add mode hint banner */}
      {isClickToAddMode && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 px-4 py-2 bg-emerald-950/90 border border-emerald-500/50 rounded-full text-emerald-200 text-xs font-medium backdrop-blur-md shadow-xl flex items-center gap-2 animate-bounce">
          <PlusCircle className="w-4 h-4 text-emerald-400" />
          <span>點擊 Google 地圖任意處，即可取得座標並新增景點！</span>
        </div>
      )}
    </div>
  );
};
