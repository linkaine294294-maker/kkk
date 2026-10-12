import React, { useState, useEffect } from 'react';
import { Spot } from '../types/itinerary';
import {
  X,
  MapPin,
  Clock,
  Lightbulb,
  Hotel,
  Utensils,
  Edit3,
  ExternalLink,
  Navigation,
  BookOpen,
  Sparkles,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Images,
} from 'lucide-react';
import { SafeImage } from './SafeImage';

interface SpotDetailModalProps {
  spot: Spot | null;
  onClose: () => void;
  onEdit: (spot: Spot) => void;
}

export const SpotDetailModal: React.FC<SpotDetailModalProps> = ({
  spot,
  onClose,
  onEdit,
}) => {
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [checkedMustDos, setCheckedMustDos] = useState<Record<number, boolean>>({});

  useEffect(() => {
    setActiveImageIdx(0);
    setCheckedMustDos({});
  }, [spot?.id]);

  if (!spot) return null;

  const images =
    spot.images && spot.images.length > 0
      ? spot.images
      : [
          {
            url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Kopenhagen_%28DK%29%2C_Nyhavn_--_2017_--_1711.jpg/1280px-Kopenhagen_%28DK%29%2C_Nyhavn_--_2017_--_1711.jpg',
            caption: spot.name,
            author: 'Wikimedia Commons',
            license: 'CC BY-SA 4.0',
          },
        ];

  const currentImage = images[activeImageIdx] || images[0];
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${spot.originalName || spot.name} ${spot.city}`
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Top Hero Image with Multi-Photo Gallery Controls */}
        <div className="relative h-64 sm:h-80 w-full shrink-0 bg-slate-950 group">
          <SafeImage
            src={currentImage.url}
            alt={currentImage.caption || spot.name}
            className="w-full h-full object-cover transition-all duration-500"
            fallbackKeyword={spot.originalName || spot.city}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/35 to-transparent" />

          {/* Prev / Next Image Arrows when multiple photos exist */}
          {images.length > 1 && (
            <>
              <button
                onClick={() =>
                  setActiveImageIdx((prev) => (prev - 1 + images.length) % images.length)
                }
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-950/75 hover:bg-slate-900 text-white border border-slate-700/80 shadow-lg transition-all cursor-pointer"
                title="上一張實景照片"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setActiveImageIdx((prev) => (prev + 1) % images.length)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-950/75 hover:bg-slate-900 text-white border border-slate-700/80 shadow-lg transition-all cursor-pointer"
                title="下一張實景照片"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Top Action Buttons */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-emerald-500/40 text-[11px] font-mono text-emerald-300 flex items-center gap-1">
              <Images className="w-3.5 h-3.5" />
              <span>
                實景圖輯 {activeImageIdx + 1} / {images.length}
              </span>
            </span>
            <button
              onClick={() => {
                onClose();
                onEdit(spot);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/80 hover:bg-emerald-600 text-slate-200 hover:text-white text-xs font-medium backdrop-blur-md border border-slate-700 transition-colors cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>編輯景點 / 增補照片</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white backdrop-blur-md border border-slate-700 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Title overlay */}
          <div className="absolute bottom-4 left-6 right-6">
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-emerald-400 mb-1">
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/30">
                Day {spot.day}
              </span>
              <span>{spot.country}</span>
              <span>·</span>
              <span>{spot.city}</span>
              {spot.time && (
                <>
                  <span>·</span>
                  <span className="flex items-center gap-1 text-amber-300">
                    <Clock className="w-3 h-3" />
                    {spot.time}
                  </span>
                </>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-serif">
              {spot.name}
            </h2>
            <div className="flex flex-wrap items-center justify-between gap-2 mt-0.5">
              {spot.originalName && (
                <p className="text-xs text-slate-300 font-mono">{spot.originalName}</p>
              )}
              {currentImage.caption && (
                <span className="text-[11px] text-amber-200/90 bg-slate-950/70 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                  📷 {currentImage.caption}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Multi-Photo Thumbnail Strip */}
        {images.length > 1 && (
          <div className="px-6 py-2.5 bg-slate-950 border-b border-slate-800 flex items-center gap-2.5 overflow-x-auto">
            <span className="text-[11px] font-mono text-slate-400 shrink-0">
              切換照片 ({images.length} 張真實攝影)：
            </span>
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIdx(idx)}
                className={`relative w-20 h-13 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                  idx === activeImageIdx
                    ? 'border-emerald-400 ring-2 ring-emerald-400/30 scale-105'
                    : 'border-slate-800 opacity-60 hover:opacity-100'
                }`}
              >
                <SafeImage
                  src={img.url}
                  alt={img.caption || `${spot.name} ${idx + 1}`}
                  className="w-full h-full object-cover"
                  fallbackKeyword={spot.city}
                />
              </button>
            ))}
          </div>
        )}

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm text-slate-300 leading-relaxed">
          {/* Main Description */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              景點深度介紹
            </h4>
            <p className="text-slate-200 whitespace-pre-line leading-relaxed">
              {spot.description}
            </p>
          </div>

          {/* 1. 小故事 (Historical Story / Folklore) */}
          {spot.story && (
            <div className="p-4 rounded-xl bg-amber-950/25 border border-amber-500/30 space-y-1.5">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
                <BookOpen className="w-4 h-4 text-amber-400 shrink-0" />
                <span>📖 地點歷史小故事 (Historical Story & Lore)</span>
              </div>
              <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed font-serif">
                {spot.story}
              </p>
            </div>
          )}

          {/* 2. 小知識 (Fun Trivia / Secret Fact) */}
          {spot.trivia && (
            <div className="p-4 rounded-xl bg-cyan-950/25 border border-cyan-500/30 space-y-1.5">
              <div className="flex items-center gap-2 text-cyan-300 font-bold text-xs">
                <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>💡 北歐達人小知識 (Fun Trivia)</span>
              </div>
              <p className="text-xs sm:text-sm text-cyan-100/90 leading-relaxed">
                {spot.trivia}
              </p>
            </div>
          )}

          {/* 3. 必做的事 (Must-Do Checklist) */}
          {spot.mustDo && spot.mustDo.length > 0 && (
            <div className="p-4 rounded-xl bg-emerald-950/25 border border-emerald-500/30 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>✅ 到訪必做的事清單 (Must-Do Checklist)</span>
                </div>
                <span className="text-[11px] font-mono text-emerald-400/80">
                  點擊可打勾記錄
                </span>
              </div>
              <div className="space-y-2">
                {spot.mustDo.map((item, idx) => {
                  const isDone = !!checkedMustDos[idx];
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() =>
                        setCheckedMustDos((prev) => ({ ...prev, [idx]: !prev[idx] }))
                      }
                      className={`w-full text-left p-2.5 rounded-lg border transition-all flex items-start gap-2.5 cursor-pointer ${
                        isDone
                          ? 'bg-emerald-900/40 border-emerald-400/60 text-emerald-200 line-through opacity-80'
                          : 'bg-slate-950/60 border-slate-800 hover:border-emerald-500/40 text-slate-200'
                      }`}
                    >
                      <span
                        className={`w-4 h-4 rounded flex items-center justify-center text-[10px] mt-0.5 shrink-0 border ${
                          isDone
                            ? 'bg-emerald-500 border-emerald-400 text-slate-950 font-bold'
                            : 'border-slate-600 text-transparent'
                        }`}
                      >
                        ✓
                      </span>
                      <span className="text-xs sm:text-sm leading-snug">{item}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Travel Tips */}
          {spot.tips && spot.tips.length > 0 && (
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
              <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs mb-2">
                <Lightbulb className="w-4 h-4" />
                <span>旅人貼心提醒 & 最佳拍照時機</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-300 list-disc list-inside">
                {spot.tips.map((tip, i) => (
                  <li key={i}>{tip}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Hotel & Dining Recommendations */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {spot.hotelRecommendation && (
              <div className="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-500/20">
                <div className="flex items-center gap-1.5 text-indigo-400 text-xs font-semibold mb-1">
                  <Hotel className="w-3.5 h-3.5" />
                  <span>奢華住宿推薦</span>
                </div>
                <div className="font-semibold text-white text-xs mb-1">
                  {spot.hotelRecommendation.name}
                </div>
                <p className="text-xs text-slate-400">
                  {spot.hotelRecommendation.description}
                </p>
              </div>
            )}

            {spot.diningRecommendation && (
              <div className="p-3.5 rounded-xl bg-rose-950/30 border border-rose-500/20">
                <div className="flex items-center gap-1.5 text-rose-400 text-xs font-semibold mb-1">
                  <Utensils className="w-3.5 h-3.5" />
                  <span>星級美饌推薦</span>
                </div>
                <div className="font-semibold text-white text-xs mb-1">
                  {spot.diningRecommendation.name}
                </div>
                <p className="text-xs text-slate-400">
                  {spot.diningRecommendation.description}
                </p>
              </div>
            )}
          </div>

          {/* Coordinates & External Map Link */}
          <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
            <div className="flex items-center gap-1.5 font-mono">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>
                座標: {spot.lat.toFixed(4)}, {spot.lng.toFixed(4)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 transition-colors font-medium"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>在 Google Maps 開啟導航</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
