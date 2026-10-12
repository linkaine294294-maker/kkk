import React, { useState, useEffect } from 'react';
import { DayPlan, Spot } from '../types/itinerary';
import { GoogleMapsView } from './GoogleMapsView';
import { InteractiveMap } from './InteractiveMap';
import {
  MapPin,
  Filter,
  CheckSquare,
  Square,
  Navigation,
  Compass,
  PlusCircle,
  ExternalLink,
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  Plane,
  Train,
  Ship,
  Zap,
  Info,
  ChevronRight,
  Activity,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { getGoogleMapsDayRouteUrl } from '../utils/mapUtils';
import { JOURNEY_WAYPOINTS, JourneyWaypoint } from '../data/journeyRouteData';
import { DAY_TRANSIT_WEATHER_DATA } from '../data/dayTransitWeatherData';

const GOOGLE_MAPS_API_KEY =
  import.meta.env.VITE_GOOGLE_MAPS_API_KEY ||
  'AIzaSyAXbWgDJ5VdnVgTH8_GlNIHfYJ8ooqMspw';

interface FullMapViewProps {
  spots: Spot[];
  dayPlans: DayPlan[];
  onSpotSelect: (spot: Spot) => void;
  onMapClickAddSpot: (lat: number, lng: number) => void;
}

export const FullMapView: React.FC<FullMapViewProps> = ({
  spots,
  dayPlans,
  onSpotSelect,
  onMapClickAddSpot,
}) => {
  // All 15 days visible by default
  const [visibleDays, setVisibleDays] = useState<number[]>(
    dayPlans.map((d) => d.dayNumber)
  );
  const [clickToAddMode, setClickToAddMode] = useState(false);
  const [activeDayRoute, setActiveDayRoute] = useState<number>(1);
  const [mapEngine, setMapEngine] = useState<'google' | 'leaflet'>('google');

  // Dynamic glowing route and cross-national mobility simulation
  const [showGlowPath, setShowGlowPath] = useState<boolean>(true);
  const [activeJourneyDay, setActiveJourneyDay] = useState<number>(1);
  const [isPlayingJourney, setIsPlayingJourney] = useState<boolean>(false);
  const [journeySpeed, setJourneySpeed] = useState<number>(1);
  const [showTrafficWeatherLayer, setShowTrafficWeatherLayer] = useState<boolean>(true);

  // Playback timer for cross-national journey mobility simulation
  useEffect(() => {
    if (!isPlayingJourney) return;
    const interval = setInterval(() => {
      setActiveJourneyDay((prev) => {
        const next = prev >= 15 ? 1 : prev + 1;
        setActiveDayRoute(next);
        return next;
      });
    }, 2400 / journeySpeed);

    return () => clearInterval(interval);
  }, [isPlayingJourney, journeySpeed]);

  const toggleDay = (dayNum: number) => {
    setVisibleDays((prev) =>
      prev.includes(dayNum) ? prev.filter((d) => d !== dayNum) : [...prev, dayNum]
    );
  };

  const handleSelectAll = () => {
    setVisibleDays(dayPlans.map((d) => d.dayNumber));
  };

  const handleClearAll = () => {
    setVisibleDays([]);
  };

  const currentRouteSpots = spots.filter((s) => s.day === activeDayRoute);
  const currentRouteUrl = getGoogleMapsDayRouteUrl(currentRouteSpots);
  const activePlan = dayPlans.find((p) => p.dayNumber === activeDayRoute);

  const activeWaypoint =
    JOURNEY_WAYPOINTS.find((w) => w.day === activeJourneyDay) || JOURNEY_WAYPOINTS[0];
  const turningPoints = JOURNEY_WAYPOINTS.filter((w) => w.isTurningPoint);

  // Find corresponding spot for active waypoint target
  const handleInspectActiveSpot = () => {
    const matchedSpot = spots.find(
      (s) => s.day === activeJourneyDay && s.name.includes(activeWaypoint.targetSpotName.slice(0, 4))
    ) || spots.find((s) => s.day === activeJourneyDay);

    if (matchedSpot) {
      onSpotSelect(matchedSpot);
    }
  };

  return (
    <div className="space-y-6">
      {/* Map Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              <span>全景五國動態跨國地圖</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-cyan-950 text-cyan-300 border border-cyan-800/40">
              總里程 8,000+ 公里
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-white flex items-center gap-2">
            <Compass className="w-6 h-6 text-emerald-400 shrink-0" />
            <span>北歐五國全景互動地圖 · 動態光影路徑</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Google Maps Platform 高精度圖資 · 連接 15 天目標點之動態光影路徑 · 6 大跨國轉折點動畫提示
          </p>
        </div>

        {/* Engine switcher & Glow Path toggle */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Toggle Traffic & Weather Layer */}
          <button
            onClick={() => setShowTrafficWeatherLayer(!showTrafficWeatherLayer)}
            className={`px-3.5 py-2 text-xs font-semibold rounded-xl border transition-all flex items-center gap-1.5 shadow-sm cursor-pointer ${
              showTrafficWeatherLayer
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white border-cyan-400 shadow-cyan-500/20'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-400 border-slate-700'
            }`}
            title="切換實時路況與天氣預報圖層"
          >
            <span>{showTrafficWeatherLayer ? '🚦❄️ 實時路況與天氣 (已開啟)' : '⚪ 開啟實時路況與天氣'}</span>
          </button>

          {/* Toggle Dynamic Glow Path */}
          <button
            onClick={() => setShowGlowPath(!showGlowPath)}
            className={`px-3.5 py-2 text-xs font-semibold rounded-xl border transition-all flex items-center gap-1.5 shadow-sm ${
              showGlowPath
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-400 shadow-emerald-500/20'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-400 border-slate-700'
            }`}
            title="開啟或關閉連接所有行程每日目標點的動態光影路徑"
          >
            <Zap className={`w-3.5 h-3.5 ${showGlowPath ? 'text-amber-300 fill-amber-300' : ''}`} />
            <span>{showGlowPath ? '動態光影路徑 (啟動中)' : '開啟光影路徑'}</span>
          </button>

          {/* Engine Selector */}
          <div className="flex bg-slate-950 border border-slate-800 rounded-xl p-1 text-xs">
            <button
              onClick={() => setMapEngine('google')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                mapEngine === 'google'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Google 地圖
            </button>
            <button
              onClick={() => setMapEngine('leaflet')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                mapEngine === 'leaflet'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              OSM 極夜黑
            </button>
          </div>

          {/* Click to add spot */}
          <button
            onClick={() => setClickToAddMode(!clickToAddMode)}
            className={`px-3.5 py-2 text-xs font-semibold rounded-xl border transition-all flex items-center gap-1.5 shadow-sm ${
              clickToAddMode
                ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
          >
            <PlusCircle className={`w-4 h-4 ${clickToAddMode ? 'text-slate-950' : 'text-emerald-400'}`} />
            <span>{clickToAddMode ? '點擊地圖新增中' : '點地圖新增景點'}</span>
          </button>
        </div>
      </div>

      {/* Dynamic Glowing Journey Route & Turning Points Interactive Panel */}
      {showGlowPath && (
        <div className="bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-950 border border-emerald-500/40 rounded-2xl p-5 shadow-2xl relative overflow-hidden space-y-4">
          {/* Subtle Ambient Aurora Light Effect */}
          <div className="absolute top-0 right-1/4 w-80 h-32 bg-emerald-500/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 left-10 w-96 h-28 bg-cyan-500/10 blur-3xl pointer-events-none" />

          {/* Header Row: Simulator Controls and Stats */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 shadow-md">
                <Compass className="w-5 h-5 text-emerald-400 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-1.5">
                    <span>15 天跨國動態光影路徑 · 航線漫遊模擬</span>
                  </h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-600/50 text-emerald-300 font-mono">
                    Day {activeJourneyDay} / 15
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  沿光影路徑穿梭北歐五國 · 點擊任意目標點或播放模擬體驗跨國移動
                </p>
              </div>
            </div>

            {/* Simulation Controls */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                onClick={() => setIsPlayingJourney(!isPlayingJourney)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md ${
                  isPlayingJourney
                    ? 'bg-amber-500 text-slate-950 hover:bg-amber-400 animate-pulse'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
                }`}
              >
                {isPlayingJourney ? (
                  <>
                    <Pause className="w-3.5 h-3.5 fill-current" />
                    <span>暫停漫遊</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>播放跨國漫遊</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  setIsPlayingJourney(false);
                  setActiveJourneyDay(1);
                  setActiveDayRoute(1);
                }}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                title="重設回 Day 1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-0.5 text-[11px]">
                {[1, 2].map((speed) => (
                  <button
                    key={speed}
                    onClick={() => setJourneySpeed(speed)}
                    className={`px-2 py-1 rounded-lg font-mono transition-colors ${
                      journeySpeed === speed
                        ? 'bg-slate-800 text-emerald-400 font-bold'
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 15 Days Interactive Waypoint Timeline Track */}
          <div className="relative z-10 pt-2 pb-1">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-2">
              {JOURNEY_WAYPOINTS.map((wp) => {
                const isActive = wp.day === activeJourneyDay;
                const isPassed = wp.day < activeJourneyDay;

                return (
                  <button
                    key={wp.day}
                    onClick={() => {
                      setActiveJourneyDay(wp.day);
                      setActiveDayRoute(wp.day);
                    }}
                    className={`shrink-0 px-2.5 py-2 rounded-xl border text-left transition-all relative flex flex-col items-center min-w-[70px] ${
                      isActive
                        ? 'bg-gradient-to-b from-emerald-950 to-slate-900 border-amber-400 ring-2 ring-amber-400/30 scale-105 shadow-xl'
                        : wp.isTurningPoint
                        ? 'bg-slate-950/80 border-emerald-500/50 hover:border-emerald-400 text-slate-300'
                        : 'bg-slate-950/40 border-slate-800/80 hover:border-slate-700 text-slate-400'
                    }`}
                  >
                    {/* Top radar dot for turning point */}
                    {wp.isTurningPoint && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                    )}

                    <div className="flex items-center gap-1 text-[11px] font-bold">
                      <span>{wp.countryFlag}</span>
                      <span className={isActive ? 'text-amber-300' : wp.isTurningPoint ? 'text-emerald-300' : 'text-slate-400'}>
                        D{wp.day}
                      </span>
                    </div>

                    <div className="text-[10px] text-slate-400 mt-0.5 truncate max-w-[62px] text-center">
                      {wp.city.split(' ')[0]}
                    </div>

                    <div className="text-[10px] mt-1 text-slate-500">
                      {wp.transitType === 'flight' ? '✈️' : wp.transitType === 'train' ? '🚆' : wp.transitType === 'start' ? '🚩' : '📍'}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Turning Point Animated Notification Card (路線轉折點動畫提示) */}
          <div
            className={`relative z-10 rounded-2xl border p-4.5 transition-all duration-300 ${
              activeWaypoint.isTurningPoint
                ? 'bg-gradient-to-r from-emerald-950/80 via-slate-900/90 to-teal-950/80 border-emerald-400/70 shadow-2xl ring-1 ring-emerald-500/30 turnpoint-badge-glow'
                : 'bg-slate-950/70 border-slate-800 text-slate-300'
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2">
                {/* Badge Row */}
                <div className="flex flex-wrap items-center gap-2">
                  {activeWaypoint.isTurningPoint ? (
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md">
                      <span className="w-2 h-2 rounded-full bg-slate-950 animate-ping" />
                      <span>{activeWaypoint.turningPointTitle || '路線轉折點'}</span>
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 font-semibold text-xs flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-emerald-400" />
                      <span>Day {activeWaypoint.day} 當日目標景點</span>
                    </span>
                  )}

                  <span className="px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-700 text-cyan-300 font-mono text-xs flex items-center gap-1">
                    <span>{activeWaypoint.transitBadge}</span>
                  </span>

                  <span className="text-xs text-slate-400">
                    {activeWaypoint.dateStr} · {activeWaypoint.city}
                  </span>
                </div>

                {/* Main Heading & Transition Story */}
                <div>
                  <h4 className="text-base sm:text-lg font-bold text-white leading-snug flex items-center gap-2">
                    <span>{activeWaypoint.countryFlag}</span>
                    <span>{activeWaypoint.targetSpotName}</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed max-w-3xl">
                    {activeWaypoint.isTurningPoint
                      ? activeWaypoint.turningPointDescription
                      : activeWaypoint.summary}
                  </p>
                </div>

                {/* Transit Specs Info Bar */}
                <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-400">
                  <div className="flex items-center gap-1 text-emerald-400">
                    <Activity className="w-3.5 h-3.5" />
                    <span>移動感航線：{activeWaypoint.transitDetail}</span>
                  </div>
                  {activeWaypoint.hotel && (
                    <div className="text-slate-400">
                      <span>🏨 {activeWaypoint.hotel}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
                <button
                  onClick={handleInspectActiveSpot}
                  className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors shadow-lg flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>查看當日目標景點</span>
                </button>
                <button
                  onClick={() => setActiveDayRoute(activeWaypoint.day)}
                  className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs transition-colors flex items-center justify-center gap-1"
                >
                  <Navigation className="w-3.5 h-3.5 text-emerald-400" />
                  <span>定位此日路線</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Interactive Map (Google Maps or Leaflet) */}
      {mapEngine === 'google' ? (
        <GoogleMapsView
          apiKey={GOOGLE_MAPS_API_KEY}
          spots={spots}
          dayPlans={dayPlans}
          visibleDays={visibleDays}
          onSpotSelect={onSpotSelect}
          onMapClickAddSpot={onMapClickAddSpot}
          isClickToAddMode={clickToAddMode}
          heightClass="h-[540px] sm:h-[620px]"
          showGlowPath={showGlowPath}
          activeWaypointDay={activeJourneyDay}
          onWaypointSelect={(day) => {
            setActiveJourneyDay(day);
            setActiveDayRoute(day);
          }}
        />
      ) : (
        <InteractiveMap
          spots={spots}
          dayPlans={dayPlans}
          selectedDay={activeDayRoute}
          visibleDays={visibleDays}
          onSpotSelect={onSpotSelect}
          onMapClickAddSpot={onMapClickAddSpot}
          isClickToAddMode={clickToAddMode}
          heightClass="h-[540px] sm:h-[620px]"
          showGlowPath={showGlowPath}
          activeWaypointDay={activeJourneyDay}
          onWaypointSelect={(day) => {
            setActiveJourneyDay(day);
            setActiveDayRoute(day);
          }}
        />
      )}

      {/* Day Filter Checkboxes Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              勾選顯示天數 ({visibleDays.length} / 15 天)
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSelectAll}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-medium px-2 py-1 rounded hover:bg-slate-800 transition-colors"
            >
              全選
            </button>
            <span className="text-slate-600">·</span>
            <button
              onClick={handleClearAll}
              className="text-xs text-slate-400 hover:text-slate-200 font-medium px-2 py-1 rounded hover:bg-slate-800 transition-colors"
            >
              全部清除
            </button>
          </div>
        </div>

        {/* Days grid badges */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 pt-1">
          {dayPlans.map((dp) => {
            const isVisible = visibleDays.includes(dp.dayNumber);
            const spotCount = spots.filter((s) => s.day === dp.dayNumber).length;

            return (
              <button
                key={dp.dayNumber}
                onClick={() => toggleDay(dp.dayNumber)}
                className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between gap-2 ${
                  isVisible
                    ? 'bg-slate-800/90 border-slate-600 text-white shadow-sm'
                    : 'bg-slate-950/60 border-slate-800 text-slate-500 opacity-60 hover:opacity-90'
                }`}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 text-xs font-semibold">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: dp.color }}
                    />
                    <span>Day {dp.dayNumber}</span>
                    <span className="text-[11px] font-normal text-slate-400">({dp.dateStr})</span>
                  </div>
                  <div className="text-[11px] text-slate-400 truncate mt-0.5">
                    {dp.city.split(' ')[0]} ({spotCount}點)
                  </div>
                </div>

                <div className="shrink-0 text-slate-400">
                  {isVisible ? (
                    <CheckSquare className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Square className="w-4 h-4" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Google Maps Route Generator Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
              <Navigation className="w-4 h-4" />
              <span>Google 地圖每日路線快速產生器</span>
            </div>
            <p className="text-xs text-slate-300">
              自動抓取當日所有景點之起點、途經點與終點，一鍵生成官方 Google Maps 導航連結。
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={activeDayRoute}
              onChange={(e) => {
                const dayVal = Number(e.target.value);
                setActiveDayRoute(dayVal);
                setActiveJourneyDay(dayVal);
              }}
              className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-hidden focus:border-emerald-500"
            >
              {dayPlans.map((dp) => (
                <option key={dp.dayNumber} value={dp.dayNumber}>
                  Day {dp.dayNumber} ({dp.dateStr}) · {dp.city.split(' ')[0]}
                </option>
              ))}
            </select>

            <a
              href={currentRouteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 whitespace-nowrap"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>開啟 Google 導航路線</span>
            </a>
          </div>
        </div>

        {/* Selected route preview */}
        {activePlan && (
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center gap-2 text-xs text-slate-400">
            <span className="font-semibold text-slate-300">
              Day {activePlan.dayNumber} 途經點清單：
            </span>
            {currentRouteSpots.map((s, idx) => (
              <span key={s.id} className="flex items-center gap-1 text-slate-300">
                <span className="w-4 h-4 rounded-full bg-slate-800 text-emerald-400 flex items-center justify-center text-[10px] font-mono">
                  {idx + 1}
                </span>
                <span>{s.name}</span>
                {idx < currentRouteSpots.length - 1 && <span className="text-slate-600">→</span>}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
