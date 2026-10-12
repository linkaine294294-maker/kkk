import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Spot, DayPlan } from '../types/itinerary';
import { Locate, PlusCircle, Maximize2, Layers } from 'lucide-react';
import { getGoogleMapsNavigateUrl } from '../utils/mapUtils';
import { JOURNEY_WAYPOINTS } from '../data/journeyRouteData';
import { DAY_TRANSIT_WEATHER_DATA } from '../data/dayTransitWeatherData';

interface InteractiveMapProps {
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
  showTrafficWeatherLayer?: boolean;
  onToggleTrafficWeatherLayer?: () => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
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
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const polylinesLayerRef = useRef<L.LayerGroup | null>(null);
  const clickMarkerRef = useRef<L.Marker | null>(null);
  const userLocationMarkerRef = useRef<L.Marker | null>(null);

  const [mapStyle, setMapStyle] = useState<'dark' | 'voyager' | 'osm'>('dark');
  const [locating, setLocating] = useState(false);
  const [clickedCoord, setClickedCoord] = useState<{ lat: number; lng: number } | null>(null);
  const [showTrafficWeather, setShowTrafficWeather] = useState<boolean>(true);
  const [isWeatherPanelMinimized, setIsWeatherPanelMinimized] = useState<boolean>(false);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Centered around Nordic region (Scandinavia)
    const map = L.map(mapContainerRef.current, {
      center: [61.0, 15.0],
      zoom: 4,
      zoomControl: false,
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    const markersGroup = L.layerGroup().addTo(map);
    const polylinesGroup = L.layerGroup().addTo(map);

    markersLayerRef.current = markersGroup;
    polylinesLayerRef.current = polylinesGroup;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Tile Layer
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Remove existing tile layer if any
    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });

    let url = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
    let attribution = '&copy; OpenStreetMap contributors &copy; CARTO';

    if (mapStyle === 'voyager') {
      url = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
    } else if (mapStyle === 'osm') {
      url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    }

    L.tileLayer(url, {
      attribution,
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);
  }, [mapStyle]);

  // Handle Map Click (Click to add spot)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const handleMapClick = (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      setClickedCoord({ lat, lng });

      if (clickMarkerRef.current) {
        map.removeLayer(clickMarkerRef.current);
      }

      // Create a temporary indicator pin
      const pulseIcon = L.divIcon({
        className: 'custom-map-pin',
        html: `
          <div class="relative flex items-center justify-center">
            <span class="animate-ping absolute inline-flex h-7 w-7 rounded-full bg-emerald-400 opacity-75"></span>
            <div class="w-6 h-6 rounded-full bg-emerald-500 border-2 border-white shadow-lg flex items-center justify-center text-white text-xs font-bold">
              +
            </div>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const newMarker = L.marker([lat, lng], { icon: pulseIcon }).addTo(map);
      clickMarkerRef.current = newMarker;

      if (onMapClickAddSpot) {
        onMapClickAddSpot(lat, lng);
      }
    };

    map.on('click', handleMapClick);

    return () => {
      map.off('click', handleMapClick);
    };
  }, [onMapClickAddSpot]);

  // Render Markers and Polylines
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersLayerRef.current;
    const polylinesGroup = polylinesLayerRef.current;

    if (!map || !markersGroup || !polylinesGroup) return;

    markersGroup.clearLayers();
    polylinesGroup.clearLayers();

    // Filter spots based on visibleDays or selectedDay
    const activeDays = selectedDay !== null ? [selectedDay] : visibleDays;
    const filteredSpots = spots.filter((s) => activeDays.includes(s.day));

    if (filteredSpots.length === 0) return;

    // Group spots by day for polylines
    const dayMap: { [day: number]: Spot[] } = {};
    activeDays.forEach((d) => {
      dayMap[d] = [];
    });

    const latLngBounds = L.latLngBounds([]);

    filteredSpots.forEach((spot) => {
      if (dayMap[spot.day]) {
        dayMap[spot.day].push(spot);
      }
      latLngBounds.extend([spot.lat, spot.lng]);
    });

    // Draw Polylines for each day (含實時路況與動畫流動線條)
    Object.entries(dayMap).forEach(([dayStr, dSpots]) => {
      const dayNum = Number(dayStr);
      const plan = dayPlans.find((p) => p.dayNumber === dayNum);
      const color = plan ? plan.color : '#38bdf8';
      const transitData = DAY_TRANSIT_WEATHER_DATA[dayNum];
      const isSelectedOrActive = (selectedDay === dayNum) || (activeWaypointDay === dayNum) || (selectedDay === null && dayNum === 1);

      if (dSpots.length > 1) {
        const polyCoords = dSpots.map((s) => [s.lat, s.lng] as [number, number]);

        if (showTrafficWeather && isSelectedOrActive) {
          // 實時路況高亮：外層發光光暈
          const glowHalo = L.polyline(polyCoords, {
            color: '#0284c7',
            weight: 9,
            opacity: 0.45,
            className: 'anim-day-route-halo',
            lineCap: 'round',
            lineJoin: 'round',
          });
          polylinesGroup.addLayer(glowHalo);

          // 實時路況高亮：內層動態流動光影線條
          const flowingLine = L.polyline(polyCoords, {
            color: '#38bdf8',
            weight: 4,
            opacity: 0.95,
            className: 'anim-day-route-flow',
            lineCap: 'round',
            lineJoin: 'round',
          });
          polylinesGroup.addLayer(flowingLine);

          // 兩點間標記實時推薦交通工具與預估時間
          for (let i = 0; i < dSpots.length - 1; i++) {
            const s1 = dSpots[i];
            const s2 = dSpots[i + 1];
            const midLat = (s1.lat + s2.lat) / 2;
            const midLng = (s1.lng + s2.lng) / 2;
            const distKm = (L.latLng(s1.lat, s1.lng).distanceTo(L.latLng(s2.lat, s2.lng)) / 1000).toFixed(1);
            const estMin = Math.max(5, Math.round(Number(distKm) * 2.2));
            const icon = transitData ? transitData.transit.icon : '🚗';

            const transitMarkerHtml = `
              <div class="relative flex items-center justify-center cursor-pointer select-none group">
                <div class="px-2 py-0.5 rounded-lg bg-slate-950/95 border border-cyan-400 text-white shadow-xl flex items-center gap-1.5 text-[10px] whitespace-nowrap hover:scale-110 transition-transform">
                  <span class="animate-bounce">${icon}</span>
                  <span class="font-bold text-cyan-300 font-mono">${distKm} km · 約 ${estMin} 分</span>
                  <span class="text-emerald-400 text-[9px] font-bold">●路況暢通</span>
                </div>
              </div>
            `;
            const transitIcon = L.divIcon({
              className: 'transit-midpoint-badge',
              html: transitMarkerHtml,
              iconSize: [120, 24],
              iconAnchor: [60, 12],
            });
            const tMarker = L.marker([midLat, midLng], { icon: transitIcon });
            polylinesGroup.addLayer(tMarker);
          }
        } else {
          const polyline = L.polyline(polyCoords, {
            color: color,
            weight: 3.5,
            opacity: 0.85,
            dashArray: '6, 8',
            lineCap: 'round',
            lineJoin: 'round',
          });
          polylinesGroup.addLayer(polyline);
        }
      }
    });

    // Draw Transnational Dynamic Glowing Route Connecting All 15 Daily Targets
    if (showGlowPath) {
      const glowCoords = JOURNEY_WAYPOINTS.map((w) => [w.lat, w.lng] as [number, number]);

      // Outer glowing halo underlay (wide semi-transparent green/cyan)
      const glowHalo = L.polyline(glowCoords, {
        color: '#059669',
        weight: 10,
        opacity: 0.35,
        className: 'anim-route-halo-underlay',
        lineCap: 'round',
        lineJoin: 'round',
      });
      polylinesGroup.addLayer(glowHalo);

      // Inner animated flowing light trail
      const glowLine = L.polyline(glowCoords, {
        color: '#34d399',
        weight: 3.5,
        opacity: 0.95,
        className: 'anim-route-glow-path',
        lineCap: 'round',
        lineJoin: 'round',
      });
      polylinesGroup.addLayer(glowLine);

      // Render Animated Turning Point Waypoint Radar Markers
      JOURNEY_WAYPOINTS.forEach((wp) => {
        if (wp.isTurningPoint || wp.day === activeWaypointDay) {
          const isCurrentActive = wp.day === activeWaypointDay;
          const turnMarkerHtml = `
            <div class="relative flex items-center justify-center cursor-pointer group select-none">
              <div class="absolute w-12 h-12 rounded-full bg-emerald-400/30 waypoint-radar-ring pointer-events-none"></div>
              <div class="absolute w-7 h-7 rounded-full bg-cyan-400/40 animate-ping pointer-events-none"></div>
              <div class="relative px-2 py-1 rounded-xl bg-slate-950/95 border-2 ${
                isCurrentActive ? 'border-amber-400 scale-125 ring-4 ring-amber-400/40' : 'border-emerald-400'
              } shadow-2xl flex items-center gap-1.5 text-white turnpoint-badge-glow transition-transform hover:scale-115">
                <span class="text-xs">${wp.countryFlag}</span>
                <span class="text-[10px] font-bold font-mono text-emerald-300">D${wp.day}</span>
                <span class="text-[11px]">${wp.transitType === 'flight' ? '✈️' : wp.transitType === 'train' ? '🚆' : wp.transitType === 'start' ? '🚩' : '🏁'}</span>
              </div>
              <!-- Floating Animated Prompt on Hover / Active -->
              <div class="absolute -top-12 left-1/2 -translate-x-1/2 ${
                isCurrentActive ? 'opacity-100 scale-100' : 'opacity-0 group-hover:opacity-100'
              } transition-all pointer-events-none z-50 bg-slate-900/95 border border-emerald-500/70 text-white text-[11px] px-2.5 py-1 rounded-xl whitespace-nowrap shadow-2xl backdrop-blur-md">
                <div class="font-bold text-emerald-300 flex items-center gap-1">
                  <span>${wp.countryFlag}</span>
                  <span>${wp.turningPointTitle || wp.city}</span>
                </div>
                <div class="text-[10px] text-slate-300">${wp.transitBadge || ''}</div>
              </div>
            </div>
          `;

          const turnIcon = L.divIcon({
            className: 'nordic-turnpoint-pin',
            html: turnMarkerHtml,
            iconSize: [46, 46],
            iconAnchor: [23, 23],
            popupAnchor: [0, -24],
          });

          const turnMarker = L.marker([wp.lat, wp.lng], {
            icon: turnIcon,
            zIndexOffset: isCurrentActive ? 2000 : 1200,
          });

          turnMarker.on('click', () => {
            if (onWaypointSelect) {
              onWaypointSelect(wp.day);
            }
          });

          markersGroup.addLayer(turnMarker);
        }
      });
    }

    // Draw Markers
    Object.entries(dayMap).forEach(([dayStr, dSpots]) => {
      const dayNum = Number(dayStr);
      const plan = dayPlans.find((p) => p.dayNumber === dayNum);
      const color = plan ? plan.color : '#38bdf8';

      dSpots.forEach((spot, index) => {
        const seqNumber = index + 1;
        const isHighlighted = highlightSpotId === spot.id;

        // Custom divIcon
        const iconHtml = `
          <div class="group relative flex items-center justify-center cursor-pointer transition-transform duration-200 ${
            isHighlighted ? 'scale-125 z-50' : 'hover:scale-110'
          }">
            <div style="background-color: ${color}; border-color: ${
          isHighlighted ? '#ffffff' : 'rgba(255,255,255,0.85)'
        };"
                 class="w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-bold shadow-md border-2">
              ${seqNumber}
            </div>
            <div class="absolute -bottom-1 w-1.5 h-1.5 rotate-45" style="background-color: ${color}"></div>
          </div>
        `;

        const customIcon = L.divIcon({
          className: 'nordic-pin',
          html: iconHtml,
          iconSize: [28, 32],
          iconAnchor: [14, 30],
          popupAnchor: [0, -32],
        });

        const marker = L.marker([spot.lat, spot.lng], { icon: customIcon });

        // Popup Content
        const firstImg =
          spot.images?.[0]?.url ||
          'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80';

        const popupContent = document.createElement('div');
        popupContent.className = 'w-64 p-1 text-slate-900 font-sans';
        popupContent.innerHTML = `
          <div class="overflow-hidden rounded-md mb-2 h-28 bg-slate-800">
            <img src="${firstImg}" alt="${spot.name}" class="w-full h-full object-cover" onerror="this.src='https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80'"/>
          </div>
          <div class="text-[11px] text-slate-500 font-medium mb-0.5">
            Day ${spot.day} · ${spot.city}
          </div>
          <h4 class="text-sm font-bold text-slate-900 leading-snug mb-1">
            ${spot.name}
          </h4>
          <p class="text-xs text-slate-600 line-clamp-2 mb-2 leading-relaxed">
            ${spot.description}
          </p>
          <div class="flex items-center gap-1.5 pt-1 border-t border-slate-100">
            <button id="view-spot-${spot.id}" class="flex-1 py-1 px-2 text-xs font-semibold bg-slate-900 text-white rounded hover:bg-slate-800 text-center transition-colors">
              查看景點詳情
            </button>
            <a href="${getGoogleMapsNavigateUrl(spot)}" target="_blank" rel="noopener noreferrer" class="py-1 px-2 text-xs font-medium text-slate-700 bg-slate-100 rounded hover:bg-slate-200 transition-colors">
              導航
            </a>
          </div>
        `;

        popupContent.querySelector(`#view-spot-${spot.id}`)?.addEventListener('click', () => {
          onSpotSelect(spot);
        });

        marker.bindPopup(popupContent, {
          closeButton: true,
          className: 'nordic-popup',
        });

        markersGroup.addLayer(marker);
      });
    });

    // Auto-fit to bounds if valid
    if (latLngBounds.isValid() && filteredSpots.length > 0) {
      map.fitBounds(latLngBounds, {
        padding: [45, 45],
        maxZoom: selectedDay !== null ? 14 : 7,
      });
    }
  }, [spots, dayPlans, selectedDay, visibleDays, highlightSpotId, onSpotSelect, showGlowPath, activeWaypointDay, onWaypointSelect, showTrafficWeather]);

  // Smoothly fly to active waypoint on map when activeWaypointDay changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !activeWaypointDay) return;
    const targetWp = JOURNEY_WAYPOINTS.find((w) => w.day === activeWaypointDay);
    if (targetWp) {
      map.flyTo([targetWp.lat, targetWp.lng], Math.max(map.getZoom(), 6), {
        duration: 1.2,
      });
    }
  }, [activeWaypointDay]);

  // Handle "My Location"
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
        const map = mapInstanceRef.current;
        if (!map) return;

        if (userLocationMarkerRef.current) {
          map.removeLayer(userLocationMarkerRef.current);
        }

        const userIcon = L.divIcon({
          className: 'user-location-pin',
          html: `
            <div class="relative flex items-center justify-center">
              <span class="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-sky-400 opacity-80"></span>
              <div class="w-4 h-4 rounded-full bg-sky-500 border-2 border-white shadow-xl"></div>
            </div>
          `,
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        });

        const marker = L.marker([latitude, longitude], { icon: userIcon }).addTo(map);
        marker.bindPopup('<div class="p-1 font-bold text-xs text-slate-900">📍 您目前所在位置</div>').openPopup();
        userLocationMarkerRef.current = marker;

        map.flyTo([latitude, longitude], 12, { duration: 1.5 });
      },
      (err) => {
        setLocating(false);
        console.warn('Geolocation error:', err);
        alert('無法取得您的位置，請確認瀏覽器定位權限是否開啟。');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Reset view to Nordic bounds
  const handleResetView = () => {
    const map = mapInstanceRef.current;
    if (!map) return;
    map.flyTo([61.0, 15.0], 4, { duration: 1.2 });
  };

  return (
    <div className={`relative w-full ${heightClass} rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl`}>
      {/* Map DOM Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Floating Traffic & Weather Toggle Button */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
        <button
          onClick={() => setShowTrafficWeather((prev) => !prev)}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-2 shadow-2xl backdrop-blur-md cursor-pointer border ${
            showTrafficWeather
              ? 'bg-gradient-to-r from-cyan-900/90 to-blue-900/90 border-cyan-400 text-cyan-200 ring-2 ring-cyan-400/30'
              : 'bg-slate-900/80 border-slate-700 text-slate-400 hover:text-white'
          }`}
          title="切換實時路況與天氣圖層"
        >
          <span className="text-sm">{showTrafficWeather ? '🚦❄️' : '⚪'}</span>
          <span>實時路況與天氣圖層：{showTrafficWeather ? '已開啟' : '已關閉'}</span>
        </button>
      </div>

      {/* Real-time Weather & Transit Forecast Card on Map */}
      {showTrafficWeather && (() => {
        const currentTargetDay = selectedDay !== null ? selectedDay : (activeWaypointDay || 1);
        const info = DAY_TRANSIT_WEATHER_DATA[currentTargetDay] || DAY_TRANSIT_WEATHER_DATA[1];
        return (
          <div className="absolute bottom-3 left-3 z-10 max-w-sm w-[90%] sm:w-auto bg-slate-950/95 backdrop-blur-xl border border-cyan-500/60 rounded-2xl p-3.5 shadow-2xl space-y-2.5 text-left text-xs animate-in fade-in select-none">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <span className="text-base">{info.flag}</span>
                <div>
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <span>Day {info.day} · {info.city.split(' ')[0]}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-mono">
                      實時氣象 & 交通
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">{info.weather.daylight}</span>
                </div>
              </div>

              <button
                onClick={() => setIsWeatherPanelMinimized(!isWeatherPanelMinimized)}
                className="text-slate-400 hover:text-white text-xs px-1.5 py-0.5 rounded bg-slate-800/80 cursor-pointer"
              >
                {isWeatherPanelMinimized ? '展開' : '收合'}
              </button>
            </div>

            {!isWeatherPanelMinimized && (
              <>
                {/* Weather Stats Row */}
                <div className="grid grid-cols-2 gap-2 p-2 rounded-xl bg-slate-900/90 border border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{info.weather.conditionIcon}</span>
                    <div>
                      <div className="font-bold text-cyan-300 font-mono text-[13px]">{info.weather.tempText}</div>
                      <div className="text-[10px] text-slate-400">體感 {info.weather.feelsLikeText} · {info.weather.conditionText}</div>
                    </div>
                  </div>
                  <div className="text-right text-[10px] space-y-0.5 font-mono text-slate-300">
                    <div className="text-emerald-400 font-bold">🌌 極光 {info.weather.auroraKp} ({info.weather.auroraChance})</div>
                    <div>💨 風速 {info.weather.windSpeed}</div>
                    <div>❄️ 降雪率 {info.weather.snowProb}</div>
                  </div>
                </div>

                {/* Transit Recommendation */}
                <div className="p-2 rounded-xl bg-cyan-950/40 border border-cyan-800/60 space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-bold text-cyan-200">
                    <span className="flex items-center gap-1.5">
                      <span className="text-base">{info.transit.icon}</span>
                      <span>{info.transit.modeName}</span>
                    </span>
                    <span className="text-[10px] text-emerald-400 font-mono">●暢通</span>
                  </div>
                  <p className="text-[10px] text-slate-300 leading-relaxed">{info.transit.winterSafetyTip}</p>
                  <div className="text-[10px] text-cyan-400 font-mono pt-1 border-t border-cyan-900/50 flex justify-between">
                    <span>⏱️ {info.transit.transitTime}</span>
                    <span>📍 {info.transit.distanceText}</span>
                  </div>
                </div>
              </>
            )}
          </div>
        );
      })()}

      {/* Floating Map Controls */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
        {/* Style Selector */}
        <div className="flex bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-lg p-1 shadow-lg">
          <button
            onClick={() => setMapStyle('dark')}
            title="極夜深色地圖"
            className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
              mapStyle === 'dark' ? 'bg-slate-700 text-emerald-400' : 'text-slate-400 hover:text-white'
            }`}
          >
            極夜黑
          </button>
          <button
            onClick={() => setMapStyle('voyager')}
            title="雪白明亮地圖"
            className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
              mapStyle === 'voyager' ? 'bg-slate-700 text-sky-400' : 'text-slate-400 hover:text-white'
            }`}
          >
            雪原白
          </button>
        </div>

        {/* Locate Me Button */}
        <button
          onClick={handleLocateMe}
          disabled={locating}
          title="我的位置"
          className="p-2.5 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 text-slate-200 hover:text-emerald-400 rounded-lg shadow-lg transition-colors flex items-center justify-center self-end"
        >
          <Locate className={`w-4 h-4 ${locating ? 'animate-spin text-emerald-400' : ''}`} />
        </button>

        {/* Reset View Button */}
        <button
          onClick={handleResetView}
          title="重設北歐全覽視角"
          className="p-2.5 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 text-slate-200 hover:text-sky-400 rounded-lg shadow-lg transition-colors flex items-center justify-center self-end"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Click-to-add mode hint banner */}
      {isClickToAddMode && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 px-4 py-2 bg-emerald-950/90 border border-emerald-500/50 rounded-full text-emerald-200 text-xs font-medium backdrop-blur-md shadow-xl flex items-center gap-2 animate-bounce">
          <PlusCircle className="w-4 h-4 text-emerald-400" />
          <span>點擊地圖任意位置，即可自動填入經緯度並建立新景點！</span>
        </div>
      )}
    </div>
  );
};
