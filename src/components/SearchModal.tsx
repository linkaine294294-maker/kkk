import React, { useState } from 'react';
import { Spot, DayPlan } from '../types/itinerary';
import { Search, X, MapPin, Calendar, Clock, ChevronRight } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  spots: Spot[];
  dayPlans: DayPlan[];
  onSelectSpot: (spot: Spot) => void;
  onSelectDay: (day: number) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  spots,
  dayPlans,
  onSelectSpot,
  onSelectDay,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const trimmed = searchTerm.trim().toLowerCase();

  const filteredSpots = trimmed
    ? spots.filter(
        (s) =>
          s.name.toLowerCase().includes(trimmed) ||
          (s.originalName && s.originalName.toLowerCase().includes(trimmed)) ||
          s.city.toLowerCase().includes(trimmed) ||
          s.country.toLowerCase().includes(trimmed) ||
          s.description.toLowerCase().includes(trimmed) ||
          (s.tips && s.tips.some((t) => t.toLowerCase().includes(trimmed)))
      )
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 pt-16 sm:pt-24 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3 bg-slate-950/60">
          <Search className="w-5 h-5 text-emerald-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="搜尋任何景點名稱、城市、國家、關鍵字（例如：蒂沃利、藍湖、極光、桑拿、瓦薩）..."
            className="flex-1 bg-transparent text-slate-100 placeholder:text-slate-500 text-sm focus:outline-hidden"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-slate-400 hover:text-white text-xs px-1.5 py-0.5"
            >
              清除
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="p-4 overflow-y-auto space-y-2 text-sm font-sans flex-1">
          {!trimmed ? (
            <div className="p-6 text-center text-slate-400 text-xs">
              請輸入關鍵字開始搜尋北歐 15 天行程中的全部景點
            </div>
          ) : filteredSpots.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              找不到符合「{searchTerm}」的景點，請嘗試其他關鍵字
            </div>
          ) : (
            <div className="space-y-2">
              <div className="text-xs font-semibold text-emerald-400 px-2 py-1">
                找到 {filteredSpots.length} 個相關景點
              </div>
              {filteredSpots.map((spot) => {
                const plan = dayPlans.find((p) => p.dayNumber === spot.day);
                const firstImg =
                  spot.images?.[0]?.url ||
                  'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Stortorget_2006.jpg/1280px-Stortorget_2006.jpg';

                return (
                  <div
                    key={spot.id}
                    onClick={() => {
                      onSelectSpot(spot);
                      onClose();
                    }}
                    className="p-3 rounded-xl bg-slate-950/70 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all flex items-center gap-3.5 group"
                  >
                    <div className="w-14 h-14 rounded-lg overflow-hidden bg-slate-900 shrink-0 border border-slate-800">
                      <img
                        src={firstImg}
                        alt={spot.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Stortorget_2006.jpg/1280px-Stortorget_2006.jpg';
                        }}
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-0.5">
                        <span
                          className="px-1.5 py-0.2 rounded text-[10px] text-white font-mono"
                          style={{ backgroundColor: plan?.color || '#10b981' }}
                        >
                          Day {spot.day}
                        </span>
                        <span>{spot.city}</span>
                        <span>·</span>
                        <span>{spot.country}</span>
                      </div>
                      <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors truncate">
                        {spot.name}
                      </h4>
                      {spot.originalName && (
                        <p className="text-[11px] text-slate-400 truncate">
                          {spot.originalName}
                        </p>
                      )}
                    </div>

                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors shrink-0" />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
