import React, { useState } from 'react';
import { DayPlan, Spot } from '../types/itinerary';
import { GoogleMapsView } from './GoogleMapsView';
import { InteractiveMap } from './InteractiveMap';
import { WeatherDayBadge } from './WeatherWidget';
import { SafeImage } from './SafeImage';
import { LUXURY_HOTELS, GOURMET_DINING } from './HotelDiningGuide';
import {
  Calendar,
  Clock,
  MapPin,
  Bed,
  PlusCircle,
  Printer,
  Navigation,
  ArrowUp,
  ArrowDown,
  Edit3,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Sparkles,
  UtensilsCrossed,
  Star,
} from 'lucide-react';
import { getGoogleMapsDayRouteUrl, getGoogleMapsNavigateUrl } from '../utils/mapUtils';

const GOOGLE_MAPS_API_KEY =
  import.meta.env.VITE_GOOGLE_MAPS_API_KEY ||
  'AIzaSyAXbWgDJ5VdnVgTH8_GlNIHfYJ8ooqMspw';

interface DailyItineraryViewProps {
  dayPlan: DayPlan;
  dayPlans: DayPlan[];
  spots: Spot[];
  allSpots: Spot[];
  onSelectDay: (day: number) => void;
  onSpotSelect: (spot: Spot) => void;
  onAddSpotToDay: (day: number) => void;
  onEditSpot: (spot: Spot) => void;
  onDeleteSpot: (spotId: string) => void;
  onMoveSpotOrder: (spotId: string, direction: 'up' | 'down') => void;
  onMoveSpotToDay: (spotId: string, targetDay: number) => void;
  onOpenWeatherModal: () => void;
  onInspectHotel?: (hotel: any) => void;
  onInspectDining?: (dining: any) => void;
  onOpenReindeerRpg?: () => void;
}

export const DailyItineraryView: React.FC<DailyItineraryViewProps> = ({
  dayPlan,
  dayPlans,
  spots,
  allSpots,
  onSelectDay,
  onSpotSelect,
  onAddSpotToDay,
  onEditSpot,
  onDeleteSpot,
  onMoveSpotOrder,
  onMoveSpotToDay,
  onOpenWeatherModal,
  onInspectHotel,
  onInspectDining,
  onOpenReindeerRpg,
}) => {
  const currentDay = dayPlan.dayNumber;
  const daySpots = spots.filter((s) => s.day === currentDay);
  const routeUrl = getGoogleMapsDayRouteUrl(daySpots);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Day Selector Navigation Ribbon */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto py-2 no-scrollbar border-b border-slate-800 print:hidden">
        <button
          onClick={() => onSelectDay(Math.max(1, currentDay - 1))}
          disabled={currentDay === 1}
          className="p-2 text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none rounded-lg hover:bg-slate-800 transition-colors"
          title="前一天"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          {dayPlans.map((dp) => {
            const isActive = dp.dayNumber === currentDay;
            return (
              <button
                key={dp.dayNumber}
                onClick={() => onSelectDay(dp.dayNumber)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'text-white shadow-lg'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
                }`}
                style={{
                  backgroundColor: isActive ? dp.color : 'transparent',
                }}
              >
                D{dp.dayNumber} {dp.dateStr}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => onSelectDay(Math.min(15, currentDay + 1))}
          disabled={currentDay === 15}
          className="p-2 text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none rounded-lg hover:bg-slate-800 transition-colors"
          title="後一天"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Day Hero Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8 relative overflow-hidden">
        <div
          className="absolute top-0 left-0 bottom-0 w-2"
          style={{ backgroundColor: dayPlan.color }}
        />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-2">
              <span
                className="px-2.5 py-0.5 rounded text-white text-xs font-mono font-bold"
                style={{ backgroundColor: dayPlan.color }}
              >
                DAY {String(dayPlan.dayNumber).padStart(2, '0')}
              </span>
              <span>·</span>
              <span className="text-slate-300 font-semibold">{dayPlan.dateStr} ({dayPlan.weekday})</span>
              <span>·</span>
              <span className="text-base">{dayPlan.countryFlag}</span>
              <span className="text-emerald-400 font-medium">{dayPlan.country} · {dayPlan.city}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-white tracking-tight">
              {dayPlan.title}
            </h1>

            <p className="text-sm text-slate-300 mt-2 max-w-3xl leading-relaxed font-sans">
              {dayPlan.summary}
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0 print:hidden">
            <a
              href={routeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl transition-colors shadow-lg shadow-emerald-500/20 flex items-center gap-1.5"
            >
              <Navigation className="w-4 h-4 fill-current" />
              <span>Google 導航今日全路線</span>
            </a>

            <button
              onClick={() => onAddSpotToDay(currentDay)}
              className="px-3.5 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4 text-emerald-400" />
              <span>新增此日景點</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3 py-2 text-xs font-medium bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-slate-700 transition-colors flex items-center gap-1.5"
              title="列印當日行程成 PDF"
            >
              <Printer className="w-4 h-4" />
              <span>列印 / 存為 PDF</span>
            </button>
          </div>
        </div>

        {/* Accommodation and Weather info bar */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-300">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Bed className="w-4 h-4 text-indigo-400" />
              <span className="text-slate-400">當晚下榻：</span>
              <span className="font-semibold text-white">{dayPlan.hotel}</span>
            </div>
            {dayPlan.hotelDetail && (
              <span className="text-slate-400 text-xs hidden sm:inline">
                ({dayPlan.hotelDetail})
              </span>
            )}
          </div>

          {/* Real-time Weather Forecast for Today's City */}
          <WeatherDayBadge
            cityStr={dayPlan.city}
            onOpenWeatherModal={onOpenWeatherModal}
          />
        </div>
      </div>

      {/* Mini Google Map for the day */}
      <div className="space-y-2 print:hidden">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>Google 當日景點路線地圖 ({daySpots.length} 個點)</span>
          </h3>
          <span className="text-[11px] text-slate-500">點擊標記可查看卡片與直接導航</span>
        </div>
        <GoogleMapsView
          apiKey={GOOGLE_MAPS_API_KEY}
          spots={allSpots}
          dayPlans={dayPlans}
          selectedDay={currentDay}
          visibleDays={[currentDay]}
          onSpotSelect={onSpotSelect}
          heightClass="h-72 sm:h-84"
        />
      </div>

      {/* Spots Timeline List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <h2 className="text-lg sm:text-xl font-serif font-bold text-white flex items-center gap-2">
            <span>當日行程清單</span>
            <span className="text-xs font-mono font-normal text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800/50">
              {daySpots.length} 個地點
            </span>
          </h2>
          <button
            onClick={() => onAddSpotToDay(currentDay)}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 print:hidden"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>增加景點</span>
          </button>
        </div>

        {daySpots.length === 0 ? (
          <div className="p-8 text-center bg-slate-900/60 border border-slate-800 rounded-2xl">
            <p className="text-slate-400 text-sm">此天目前尚無景點安排</p>
            <button
              onClick={() => onAddSpotToDay(currentDay)}
              className="mt-3 px-4 py-2 bg-emerald-500 text-slate-950 rounded-lg text-xs font-bold"
            >
              立刻新增景點
            </button>
          </div>
        ) : (
          <div className="space-y-4 relative">
            {daySpots.map((spot, index) => {
              const seqNum = index + 1;
              const firstImg =
                spot.images?.[0]?.url ||
                'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Stortorget_2006.jpg/1280px-Stortorget_2006.jpg';

              return (
                <div
                  key={spot.id}
                  className="group relative bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 sm:p-5 transition-all shadow-lg flex flex-col sm:flex-row gap-4"
                >
                  {/* Left Sequence and Image */}
                  <div className="relative w-full sm:w-56 h-44 sm:h-auto rounded-xl overflow-hidden bg-slate-950 shrink-0 border border-slate-800">
                    <img
                      src={firstImg}
                      alt={spot.name}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 cursor-pointer"
                      onClick={() => onSpotSelect(spot)}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Stortorget_2006.jpg/1280px-Stortorget_2006.jpg';
                      }}
                    />
                    {/* Sequence Badge */}
                    <div
                      className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-md text-white text-xs font-bold font-mono shadow-md flex items-center gap-1"
                      style={{ backgroundColor: dayPlan.color }}
                    >
                      <span>#{seqNum}</span>
                    </div>

                    {spot.time && (
                      <div className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded bg-slate-950/80 backdrop-blur-xs text-[11px] font-medium text-slate-300 flex items-center gap-1 border border-slate-800">
                        <Clock className="w-3 h-3 text-emerald-400" />
                        <span>{spot.time}</span>
                      </div>
                    )}
                  </div>

                  {/* Middle Content */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                        <span className="text-emerald-400 font-medium">{spot.city}</span>
                        <span>·</span>
                        <span>{spot.country}</span>
                        {spot.isCustom && (
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded border border-emerald-500/30">
                            自訂
                          </span>
                        )}
                      </div>

                      <h3
                        onClick={() => onSpotSelect(spot)}
                        className="text-lg sm:text-xl font-serif font-bold text-white hover:text-emerald-400 cursor-pointer transition-colors leading-snug"
                      >
                        {spot.name}
                      </h3>

                      {spot.originalName && (
                        <p className="text-xs text-slate-400 mb-2">{spot.originalName}</p>
                      )}

                      <p className="text-xs sm:text-sm text-slate-300 line-clamp-3 leading-relaxed font-sans mb-3">
                        {spot.description}
                      </p>

                      {/* Multi-photo thumbnail strip */}
                      {spot.images && spot.images.length > 1 && (
                        <div className="flex items-center gap-2 mb-3 overflow-x-auto pb-1">
                          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/70 px-2 py-0.5 rounded border border-emerald-500/40 shrink-0">
                            📷 {spot.images.length} 張實景照
                          </span>
                          {spot.images.slice(0, 4).map((im, iIdx) => (
                            <img
                              key={iIdx}
                              src={im.url}
                              alt={im.caption || `${spot.name} ${iIdx + 1}`}
                              onClick={() => onSpotSelect(spot)}
                              className="w-12 h-8 rounded object-cover border border-slate-700 hover:border-emerald-400 cursor-pointer shrink-0 transition-transform hover:scale-105"
                            />
                          ))}
                        </div>
                      )}

                      {/* Story, Trivia & Must-Do Preview Cards */}
                      {(spot.story || spot.trivia || (spot.mustDo && spot.mustDo.length > 0)) && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-3 text-[11px]">
                          {spot.story && (
                            <div
                              onClick={() => onSpotSelect(spot)}
                              className="p-2.5 rounded-xl bg-amber-950/25 border border-amber-500/30 hover:border-amber-400/60 cursor-pointer transition-colors"
                            >
                              <div className="font-bold text-amber-300 mb-0.5">📖 小故事</div>
                              <p className="text-amber-100/90 line-clamp-2 leading-relaxed">{spot.story}</p>
                            </div>
                          )}
                          {spot.trivia && (
                            <div
                              onClick={() => onSpotSelect(spot)}
                              className="p-2.5 rounded-xl bg-cyan-950/25 border border-cyan-500/30 hover:border-cyan-400/60 cursor-pointer transition-colors"
                            >
                              <div className="font-bold text-cyan-300 mb-0.5">💡 小知識</div>
                              <p className="text-cyan-100/90 line-clamp-2 leading-relaxed">{spot.trivia}</p>
                            </div>
                          )}
                          {spot.mustDo && spot.mustDo.length > 0 && (
                            <div
                              onClick={() => onSpotSelect(spot)}
                              className="p-2.5 rounded-xl bg-emerald-950/25 border border-emerald-500/30 hover:border-emerald-400/60 cursor-pointer transition-colors"
                            >
                              <div className="font-bold text-emerald-300 mb-0.5">✅ 必做的事 ({spot.mustDo.length})</div>
                              <p className="text-emerald-100/90 line-clamp-2 leading-relaxed">
                                • {spot.mustDo.join(' · ')}
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Interactive Nordic Aurora Saga RPG Launch Button */}
                      {onOpenReindeerRpg &&
                        (spot.name.includes('馴鹿') ||
                          spot.name.includes('雪橇') ||
                          spot.description.includes('馴鹿雪橇')) && (
                          <div className="mb-3">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onOpenReindeerRpg();
                              }}
                              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-950 via-teal-950 to-cyan-950 border border-emerald-400/60 hover:border-emerald-300 text-emerald-300 hover:text-white font-bold text-xs shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer group/rpg"
                            >
                              <span className="text-base">⚔️</span>
                              <span>點此啟動《北境極光傳奇：五國神話紀元》RPG</span>
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-900/80 text-emerald-200 border border-emerald-600 font-mono">
                                闖關遊玩 🎮
                              </span>
                            </button>
                          </div>
                        )}

                      {/* Tips preview */}
                      {spot.tips && spot.tips.length > 0 && (
                        <div className="text-xs text-emerald-400/90 flex items-start gap-1.5 font-sans mb-2">
                          <Sparkles className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{spot.tips[0]}</span>
                        </div>
                      )}
                    </div>

                    {/* Action Bar */}
                    <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
                      {/* Left: Reorder and Move Day (print:hidden) */}
                      <div className="flex items-center gap-1 print:hidden">
                        <button
                          onClick={() => onMoveSpotOrder(spot.id, 'up')}
                          disabled={index === 0}
                          title="往前移動順序"
                          className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none rounded hover:bg-slate-800 transition-colors"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onMoveSpotOrder(spot.id, 'down')}
                          disabled={index === daySpots.length - 1}
                          title="往後移動順序"
                          className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none rounded hover:bg-slate-800 transition-colors"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>

                        {/* Move to another day select */}
                        <select
                          value={spot.day}
                          onChange={(e) => onMoveSpotToDay(spot.id, Number(e.target.value))}
                          title="移至其他天"
                          className="text-[11px] bg-slate-950 border border-slate-700 rounded px-2 py-1 text-slate-300 focus:outline-hidden"
                        >
                          {dayPlans.map((dp) => (
                            <option key={dp.dayNumber} value={dp.dayNumber}>
                              移至 Day {dp.dayNumber}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Right: Detail, Edit, Delete, Navigate */}
                      <div className="flex items-center gap-2 print:hidden">
                        <button
                          onClick={() => onEditSpot(spot)}
                          title="編輯景點"
                          className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => {
                            if (confirm(`確定要刪除景點「${spot.name}」嗎？`)) {
                              onDeleteSpot(spot.id);
                            }
                          }}
                          title="刪除景點"
                          className="p-1.5 text-rose-400 hover:text-rose-300 rounded hover:bg-rose-950/40 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => onSpotSelect(spot)}
                          className="px-3 py-1.5 text-xs font-medium text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                        >
                          查看詳情
                        </button>

                        <a
                          href={getGoogleMapsNavigateUrl(spot)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors flex items-center gap-1 shadow-xs"
                        >
                          <Navigation className="w-3 h-3 fill-current" />
                          <span>導航</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Today's Luxury Accommodation & Gourmet Dining Highlights */}
      {(() => {
        const dayHotel = LUXURY_HOTELS.find((h) => h.dayOccurrences.includes(currentDay));
        const dayDinings = GOURMET_DINING.filter((d) => d.dayOccurrences.includes(currentDay));

        if (!dayHotel && dayDinings.length === 0) return null;

        return (
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-serif font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>本日極致享受 · 頂級奢華住宿與特色美饌</span>
              </h3>
              <span className="text-xs text-slate-400 hidden sm:inline">米其林饗宴 · 百年宮廷 · 極地水療</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dayHotel && (
                <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl overflow-hidden flex flex-col justify-between shadow-xl backdrop-blur-md group hover:border-indigo-500/50 transition-all">
                  <div>
                    {/* Hotel Image Banner */}
                    <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-slate-950">
                      <SafeImage
                        src={dayHotel.imageUrl}
                        alt={dayHotel.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                      <div className="absolute top-3 left-3 flex items-center gap-1.5">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-600/90 backdrop-blur-md text-white text-xs font-semibold shadow-lg">
                          <Bed className="w-3.5 h-3.5" />
                          <span>奢華下榻飯店</span>
                        </span>
                      </div>
                      <div className="absolute top-3 right-3 flex items-center gap-0.5 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-full text-amber-400 text-xs shadow-lg">
                        {Array.from({ length: dayHotel.stars }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>
                      <div className="absolute bottom-3 left-3 right-3">
                        <h4 className="text-base sm:text-lg font-serif font-bold text-white drop-shadow-md">
                          {dayHotel.name}
                        </h4>
                        <p className="text-xs text-indigo-300 font-mono drop-shadow">
                          {dayHotel.originalName}
                        </p>
                      </div>
                    </div>

                    {/* Hotel Info Body */}
                    <div className="p-4 sm:p-5 space-y-3">
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {dayHotel.description}
                      </p>

                      <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                        <span className="truncate">{dayHotel.address}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 sm:p-5 pt-0 mt-auto">
                    <div className="pt-3 flex items-center justify-between border-t border-slate-800 gap-2">
                      <button
                        onClick={() => onInspectHotel && onInspectHotel(dayHotel)}
                        className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 transition-colors bg-indigo-500/10 px-3 py-1.5 rounded-xl border border-indigo-500/20"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>查看房間內裝與設施相簿</span>
                      </button>

                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(dayHotel.name + ' ' + dayHotel.city)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-slate-300 hover:text-emerald-300 flex items-center gap-1 shrink-0"
                      >
                        <span>地圖導航</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {dayDinings.map((dining) => (
                <div key={dining.id} className="bg-slate-900/90 border border-slate-700/80 rounded-2xl overflow-hidden flex flex-col justify-between shadow-xl backdrop-blur-md group hover:border-rose-500/50 transition-all">
                  <div>
                    {/* Dining Image Banner */}
                    <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-slate-950">
                      <SafeImage
                        src={dining.imageUrl}
                        alt={dining.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                      <div className="absolute top-3 left-3 flex items-center gap-1.5">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-600/90 backdrop-blur-md text-white text-xs font-semibold shadow-lg">
                          <UtensilsCrossed className="w-3.5 h-3.5" />
                          <span>{dining.type}</span>
                        </span>
                      </div>
                      <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-full text-slate-300 text-xs font-semibold shadow-lg">
                        {dining.city}
                      </div>
                      <div className="absolute bottom-3 left-3 right-3">
                        <h4 className="text-base sm:text-lg font-serif font-bold text-white drop-shadow-md">
                          {dining.name}
                        </h4>
                        <p className="text-xs text-rose-300 font-mono drop-shadow">
                          {dining.originalName}
                        </p>
                      </div>
                    </div>

                    {/* Dining Info Body */}
                    <div className="p-4 sm:p-5 space-y-3">
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {dining.description}
                      </p>

                      <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                        <span className="text-[11px] font-bold text-amber-400 block mb-0.5">
                          主廚招牌推薦：
                        </span>
                        <span className="text-xs text-slate-200">
                          {dining.signatureDish}
                        </span>
                      </div>

                      <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                        <span className="truncate">{dining.address}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 sm:p-5 pt-0 mt-auto">
                    <div className="pt-3 flex items-center justify-between border-t border-slate-800 gap-2">
                      <button
                        onClick={() => onInspectDining && onInspectDining(dining)}
                        className="text-xs font-bold text-rose-400 hover:text-rose-300 flex items-center gap-1.5 transition-colors bg-rose-500/10 px-3 py-1.5 rounded-xl border border-rose-500/20"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>查看主廚菜單與美饌相簿</span>
                      </button>

                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(dining.name + ' ' + dining.city)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-slate-300 hover:text-emerald-300 flex items-center gap-1 shrink-0"
                      >
                        <span>地圖導航</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })()}
    </div>
  );
};
