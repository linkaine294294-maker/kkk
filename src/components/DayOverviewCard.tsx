import React from 'react';
import { DayPlan, Spot } from '../types/itinerary';
import { SafeImage } from './SafeImage';
import { Bed, UtensilsCrossed, MapPin, ChevronRight, Sparkles } from 'lucide-react';
import { GOURMET_DINING } from './HotelDiningGuide';

interface DayOverviewCardProps {
  plan: DayPlan;
  spots: Spot[];
  onClick: () => void;
  onOpenReindeerRpg?: () => void;
}

export const DayOverviewCard: React.FC<DayOverviewCardProps> = ({
  plan,
  spots,
  onClick,
  onOpenReindeerRpg,
}) => {
  const displayThumbnails = spots.flatMap((s) => s.images || []).slice(0, 3);
  const diningMatch = GOURMET_DINING.find((d) => d.dayOccurrences.includes(plan.dayNumber));

  return (
    <div
      onClick={onClick}
      className="group relative bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-5 transition-all duration-300 shadow-xl hover:shadow-2xl cursor-pointer flex flex-col justify-between overflow-hidden"
    >
      {/* Decorative top accent line with day color */}
      <div
        className="absolute top-0 left-0 right-0 h-1 transition-all duration-300 group-hover:h-1.5"
        style={{ backgroundColor: plan.color }}
      />

      <div>
        {/* Top Header: Date, Day, Country */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span
              className="px-2.5 py-0.5 rounded text-white text-[11px] font-mono tracking-wider"
              style={{ backgroundColor: plan.color }}
            >
              DAY {String(plan.dayNumber).padStart(2, '0')}
            </span>
            <span className="text-slate-300 font-sans">
              {plan.dateStr} <span className="text-slate-500">({plan.weekday})</span>
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
            <span className="text-base">{plan.countryFlag}</span>
            <span>{plan.country}</span>
          </div>
        </div>

        {/* City and Title */}
        <div className="mb-3">
          <div className="flex items-center gap-1 text-xs text-emerald-400 font-medium mb-1">
            <MapPin className="w-3.5 h-3.5" />
            <span>{plan.city}</span>
          </div>
          <h3 className="text-base sm:text-lg font-serif font-bold text-white group-hover:text-emerald-300 transition-colors leading-snug">
            {plan.title}
          </h3>
          <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed font-sans">
            {plan.summary}
          </p>
        </div>

        {/* Spots Thumbnails preview */}
        {displayThumbnails.length > 0 && (
          <div className="grid grid-cols-3 gap-2 my-3">
            {displayThumbnails.map((img, idx) => (
              <div
                key={idx}
                className="relative aspect-4/3 rounded-lg overflow-hidden bg-slate-950 border border-slate-800"
              >
                <img
                  src={img.url}
                  alt={img.caption || '景點預覽'}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Stortorget_2006.jpg/1280px-Stortorget_2006.jpg';
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Info: Hotel & Dining & Spots count */}
      <div className="pt-3 mt-2 border-t border-slate-800/80 space-y-1.5 text-xs">
        <div className="flex items-center justify-between gap-2">
          {/* Hotel info */}
          <div className="flex items-center gap-1.5 text-slate-400 min-w-0">
            <Bed className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span className="truncate font-medium text-slate-300" title={plan.hotel}>
              {plan.hotel}
            </span>
          </div>

          <div className="flex items-center gap-1 text-emerald-400 font-medium shrink-0 group-hover:translate-x-0.5 transition-transform">
            <span>{spots.length} 景點</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Dining recommendation tag */}
        {diningMatch && (
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <UtensilsCrossed className="w-3 h-3 text-rose-400 shrink-0" />
            <span className="text-slate-400">推薦料理：</span>
            <span className="truncate text-rose-300 font-medium">{diningMatch.name.split(' ')[0]}</span>
          </div>
        )}

        {/* Interactive Reindeer Sleigh Trigger for Day 6 */}
        {(plan.dayNumber === 6 || spots.some((s) => s.name.includes('馴鹿') || s.name.includes('雪橇'))) && onOpenReindeerRpg && (
          <div
            onClick={(e) => {
              e.stopPropagation();
              onOpenReindeerRpg();
            }}
            className="w-full mt-2.5 py-1.5 px-3 rounded-xl bg-gradient-to-r from-emerald-950/90 via-teal-950/90 to-cyan-950/90 border border-emerald-500/50 hover:border-emerald-400 text-emerald-300 hover:text-white text-[11px] font-bold flex items-center justify-between shadow-md hover:scale-[1.02] active:scale-98 transition-all cursor-pointer group/btn"
          >
            <span className="flex items-center gap-1.5">
              <span className="text-sm">⚔️</span>
              <span>《北境極光傳奇：五國神話紀元》</span>
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-900/80 text-emerald-200 border border-emerald-700 flex items-center gap-1">
              <span>啟動 RPG</span>
              <Sparkles className="w-3 h-3 text-amber-300" />
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
