import React, { useState } from 'react';
import { DayPlan, Spot } from '../types/itinerary';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Bed,
  UtensilsCrossed,
  Sparkles,
  PartyPopper,
  Flame,
  Clock,
  ArrowRight,
  CheckCircle,
  Plus,
  StickyNote,
  Sun,
  CloudSnow,
} from 'lucide-react';
import { LUXURY_HOTELS, GOURMET_DINING } from './HotelDiningGuide';

interface TripCalendarViewProps {
  dayPlans: DayPlan[];
  spots: Spot[];
  selectedDay: number;
  onSelectDay: (day: number) => void;
  onOpenWeather?: (city: string) => void;
}

interface UserNote {
  [day: number]: string;
}

const NOTES_STORAGE_KEY = 'nordic_trip_calendar_notes_v1';

export const TripCalendarView: React.FC<TripCalendarViewProps> = ({
  dayPlans,
  spots,
  selectedDay,
  onSelectDay,
  onOpenWeather,
}) => {
  // Calendar month state: 0 = December 2026, 1 = January 2027
  const [currentMonthIndex, setCurrentMonthIndex] = useState<0 | 1>(0);

  // Active inspected day for detail drawer
  const [activeDayDetail, setActiveDayDetail] = useState<number>(selectedDay);

  // User notes stored in localStorage
  const [notes, setNotes] = useState<UserNote>(() => {
    try {
      const saved = localStorage.getItem(NOTES_STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [editingNote, setEditingNote] = useState(false);
  const [noteInput, setNoteInput] = useState('');

  const handleSaveNote = (day: number) => {
    const updated = { ...notes, [day]: noteInput.trim() };
    setNotes(updated);
    try {
      localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save calendar note', e);
    }
    setEditingNote(false);
  };

  // Calendar matrix configuration
  // Dec 2026: Dec 1 is Tuesday (starts on col 2 if Sun=0, Mon=1)
  // Trip is Dec 20 (Sun) to Jan 3 (Sun) 2027
  // Day 1 = Dec 20 (Sun), Day 2 = Dec 21 (Mon) ... Day 12 = Dec 31 (Thu), Day 13 = Jan 1 (Fri), Day 14 = Jan 2 (Sat), Day 15 = Jan 3 (Sun)

  const activePlan = dayPlans.find((p) => p.dayNumber === activeDayDetail) || dayPlans[0];
  const activeSpots = spots.filter((s) => s.day === activeDayDetail);
  const activeHotel = LUXURY_HOTELS.find((h) => h.dayOccurrences.includes(activeDayDetail));
  const activeDinings = GOURMET_DINING.filter((d) => d.dayOccurrences.includes(activeDayDetail));

  // December 2026 days (31 days)
  const decDays = Array.from({ length: 31 }, (_, i) => i + 1);
  // Dec 1, 2026 is a Tuesday -> offset by 2 (Mon-start grid: Mon=0, Tue=1, Wed=2, Thu=3, Fri=4, Sat=5, Sun=6)
  const decOffset = 1; // Tuesday is index 1 in Mon-Sun week

  // January 2027 days (31 days)
  const janDays = Array.from({ length: 31 }, (_, i) => i + 1);
  // Jan 1, 2027 is a Friday -> offset by 4 in Mon-Sun week
  const janOffset = 4;

  const getTripDayForDate = (month: 'dec' | 'jan', dayOfMonth: number): number | null => {
    if (month === 'dec') {
      if (dayOfMonth >= 20 && dayOfMonth <= 31) {
        return dayOfMonth - 19; // 20 -> Day 1, 31 -> Day 12
      }
    } else if (month === 'jan') {
      if (dayOfMonth >= 1 && dayOfMonth <= 3) {
        return 12 + dayOfMonth; // 1 -> Day 13, 2 -> Day 14, 3 -> Day 15
      }
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold mb-2">
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>互動行程日曆 · 2026年12月至2027年1月</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-white tracking-tight">
            北歐 15 天極光聖誕行事曆
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
            點擊日曆中的任意日期即可即時預覽當日五星飯店、米其林特色饗宴、精選景點時刻表，並可隨時添加自訂備忘事項。
          </p>
        </div>

        {/* Month Selector Buttons */}
        <div className="shrink-0 flex items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => setCurrentMonthIndex(0)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              currentMonthIndex === 0
                ? 'bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            2026 年 12 月（行程第 1～12 天）
          </button>
          <button
            onClick={() => setCurrentMonthIndex(1)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              currentMonthIndex === 1
                ? 'bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            2027 年 1 月（跨年第 13～15 天）
          </button>
        </div>
      </div>

      {/* Main Calendar Grid & Detail Drawer Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left / Top: Interactive Calendar Matrix (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-lg font-serif font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{currentMonthIndex === 0 ? '2026年 12月 (DECEMBER)' : '2027年 1月 (JANUARY)'}</span>
            </h2>
            <span className="text-xs text-slate-400">週一至週日</span>
          </div>

          {/* Weekday Header */}
          <div className="grid grid-cols-7 gap-1.5 text-center text-xs font-bold text-slate-400 py-1">
            <span>週一</span>
            <span>週二</span>
            <span>週三</span>
            <span>週四</span>
            <span>週五</span>
            <span className="text-emerald-400">週六</span>
            <span className="text-rose-400">週日</span>
          </div>

          {/* Month Day Matrix */}
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {/* Empty Offset cells */}
            {Array.from({ length: currentMonthIndex === 0 ? decOffset : janOffset }).map((_, idx) => (
              <div key={`empty-${idx}`} className="h-18 sm:h-22 rounded-2xl bg-slate-950/30 border border-slate-900/40 opacity-30" />
            ))}

            {/* Days in Month */}
            {(currentMonthIndex === 0 ? decDays : janDays).map((dayNum) => {
              const tripDay = getTripDayForDate(currentMonthIndex === 0 ? 'dec' : 'jan', dayNum);
              const isTripDay = tripDay !== null;
              const plan = isTripDay ? dayPlans.find((p) => p.dayNumber === tripDay) : null;
              const isSelected = isTripDay && tripDay === activeDayDetail;
              const isChristmasEve = currentMonthIndex === 0 && dayNum === 24;
              const isChristmas = currentMonthIndex === 0 && dayNum === 25;
              const isNewYearEve = currentMonthIndex === 0 && dayNum === 31;
              const isNewYearDay = currentMonthIndex === 1 && dayNum === 1;

              return (
                <button
                  key={`day-${dayNum}`}
                  onClick={() => {
                    if (isTripDay) {
                      setActiveDayDetail(tripDay);
                    }
                  }}
                  disabled={!isTripDay}
                  className={`h-18 sm:h-22 p-2 rounded-2xl border text-left flex flex-col justify-between transition-all relative overflow-hidden group ${
                    isSelected
                      ? 'border-emerald-400 bg-emerald-950/50 ring-2 ring-emerald-400/40 shadow-lg shadow-emerald-500/20'
                      : isTripDay
                      ? 'border-slate-700/80 bg-slate-900/90 hover:border-slate-500 hover:bg-slate-850 cursor-pointer shadow-md'
                      : 'border-slate-800/40 bg-slate-950/20 text-slate-600 opacity-40 cursor-default'
                  }`}
                >
                  {/* Top Bar: Date Number + Special Badge */}
                  <div className="flex items-center justify-between w-full">
                    <span
                      className={`text-xs sm:text-sm font-mono font-bold ${
                        isSelected ? 'text-emerald-300' : isTripDay ? 'text-white' : 'text-slate-500'
                      }`}
                    >
                      {dayNum}
                    </span>

                    {/* Holiday Indicator */}
                    {isChristmasEve && (
                      <span className="text-[9px] px-1 py-0.2 rounded bg-rose-500/20 text-rose-300 font-bold border border-rose-500/40">
                        平安夜
                      </span>
                    )}
                    {isChristmas && (
                      <span className="text-[9px] px-1 py-0.2 rounded bg-red-500 text-white font-bold animate-pulse">
                        🎄聖誕
                      </span>
                    )}
                    {isNewYearEve && (
                      <span className="text-[9px] px-1 py-0.2 rounded bg-amber-500 text-slate-950 font-black animate-bounce">
                        🎆跨年
                      </span>
                    )}
                    {isNewYearDay && (
                      <span className="text-[9px] px-1 py-0.2 rounded bg-amber-400 text-slate-950 font-bold">
                        2027🎉
                      </span>
                    )}
                  </div>

                  {/* Bottom: Trip Day Badge or Country */}
                  {isTripDay && plan && (
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1">
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: plan.color }}
                        />
                        <span className="text-[10px] font-bold text-slate-200 truncate">
                          D{plan.dayNumber} {plan.city}
                        </span>
                      </div>
                      <span className="text-[9px] text-slate-400 hidden sm:block truncate">
                        {plan.countryFlag} {plan.title.slice(0, 8)}...
                      </span>
                    </div>
                  )}

                  {/* User Note Indicator Dot */}
                  {isTripDay && tripDay && notes[tripDay] && (
                    <div className="absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full bg-amber-400 shadow-sm" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick Legend Ribbon */}
          <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
                <span>已選取行程日</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
                <span>有個人備忘錄</span>
              </span>
            </div>
            <span className="text-slate-400">
              共 15 天極境跨年冒險
            </span>
          </div>
        </div>

        {/* Right / Bottom: Selected Day Quick Inspector (5 cols) */}
        <div className="lg:col-span-5 bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-5">
          {activePlan ? (
            <>
              {/* Day Header */}
              <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span
                      className="px-2.5 py-0.5 rounded text-white text-xs font-mono font-bold"
                      style={{ backgroundColor: activePlan.color }}
                    >
                      DAY {String(activePlan.dayNumber).padStart(2, '0')}
                    </span>
                    <span className="text-xs text-slate-400">{activePlan.dateStr} ({activePlan.weekday})</span>
                    <span>·</span>
                    <span className="text-xs text-emerald-400 font-semibold">{activePlan.countryFlag} {activePlan.country}</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-serif font-bold text-white tracking-tight">
                    {activePlan.title}
                  </h3>
                </div>

                <button
                  onClick={() => onSelectDay(activePlan.dayNumber)}
                  className="px-3.5 py-2 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1 transition-all shadow-md shadow-emerald-500/20 shrink-0"
                >
                  <span>前往時刻表</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Day Key Itinerary Highlights */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-indigo-400" />
                  <span>當日景點時刻 ({activeSpots.length} 個點)</span>
                </h4>
                <div className="space-y-1.5 max-h-40 overflow-y-auto no-scrollbar">
                  {activeSpots.map((spot) => (
                    <div
                      key={spot.id}
                      className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="font-mono text-emerald-400 shrink-0">{spot.time}</span>
                        <span className="text-slate-200 font-medium truncate">{spot.name}</span>
                      </div>
                      <span className="text-[11px] text-slate-400 shrink-0 ml-2">{spot.city}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hotel & Dining Snapshot */}
              <div className="space-y-2 pt-2 border-t border-slate-800/80">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Bed className="w-3.5 h-3.5 text-indigo-400" />
                  <span>本日奢華住宿與特色餐廳</span>
                </h4>

                {activeHotel && (
                  <div className="p-3 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-indigo-400 font-bold uppercase block">五星下榻</span>
                      <span className="text-xs text-white font-bold">{activeHotel.name}</span>
                    </div>
                    <span className="text-xs text-amber-400">★★★★★</span>
                  </div>
                )}

                {activeDinings.length > 0 && (
                  <div className="p-3 rounded-2xl bg-rose-950/30 border border-rose-500/30">
                    <span className="text-[10px] text-rose-400 font-bold uppercase block">美食饗宴</span>
                    <span className="text-xs text-white font-bold">{activeDinings[0].name}</span>
                    <span className="text-[11px] text-slate-300 block mt-0.5">招牌：{activeDinings[0].signatureDish}</span>
                  </div>
                )}
              </div>

              {/* User Personal Travel Memo / Checklist */}
              <div className="pt-2 border-t border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                    <StickyNote className="w-3.5 h-3.5 text-amber-400" />
                    <span>Day {activePlan.dayNumber} 個人備忘錄</span>
                  </h4>
                  {!editingNote && (
                    <button
                      onClick={() => {
                        setNoteInput(notes[activePlan.dayNumber] || '');
                        setEditingNote(true);
                      }}
                      className="text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold"
                    >
                      {notes[activePlan.dayNumber] ? '編輯備忘' : '+ 新增備忘'}
                    </button>
                  )}
                </div>

                {editingNote ? (
                  <div className="space-y-2">
                    <textarea
                      value={noteInput}
                      onChange={(e) => setNoteInput(e.target.value)}
                      placeholder="例如：需預約藍湖白泥SPA、自備防風手套、購買 Marimekko 包包..."
                      className="w-full h-20 p-3 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setEditingNote(false)}
                        className="px-3 py-1 bg-slate-800 text-slate-300 rounded-lg text-xs"
                      >
                        取消
                      </button>
                      <button
                        onClick={() => handleSaveNote(activePlan.dayNumber)}
                        className="px-3 py-1 bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs"
                      >
                        儲存
                      </button>
                    </div>
                  </div>
                ) : notes[activePlan.dayNumber] ? (
                  <div className="p-3 rounded-xl bg-amber-400/10 border border-amber-400/30 text-xs text-amber-200 leading-relaxed">
                    {notes[activePlan.dayNumber]}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">
                    尚無備忘錄，可隨時記錄當日穿搭提醒、特產購買清單或私人相約事項。
                  </p>
                )}
              </div>
            </>
          ) : (
            <p className="text-sm text-slate-400">請從左側點選行程日期查看詳情</p>
          )}
        </div>
      </div>
    </div>
  );
};
