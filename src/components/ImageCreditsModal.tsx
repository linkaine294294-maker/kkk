import React from 'react';
import { Spot } from '../types/itinerary';
import { X, ExternalLink, Camera, ShieldCheck } from 'lucide-react';

interface ImageCreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
  spots: Spot[];
}

export const ImageCreditsModal: React.FC<ImageCreditsModalProps> = ({
  isOpen,
  onClose,
  spots,
}) => {
  if (!isOpen) return null;

  // Extract all images with authors or licenses
  const allImages = spots.flatMap((spot) =>
    (spot.images || []).map((img) => ({
      ...img,
      spotName: spot.name,
      day: spot.day,
      city: spot.city,
    }))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white font-serif">
                圖片來源與版權授權說明 (Image Credits & Attributions)
              </h3>
              <p className="text-xs text-slate-400">
                本行程精選 Wikimedia Commons、Unsplash 及官方授權之高品質北歐冬日攝影創作
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs font-sans">
          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-slate-300 leading-relaxed">
            <p>
              為了呈現最壯闊的北歐奢華冬日風采，本系統圖像優先依循 <strong>Creative Commons (CC)</strong>、<strong>Wikimedia Commons</strong>、<strong>Unsplash License</strong> 及公有領域標準。您自行上傳或自本機資料夾指定之照片將標註為個人拍攝授權。
            </p>
          </div>

          <div className="divide-y divide-slate-800/80">
            {allImages.map((img, idx) => (
              <div key={idx} className="py-3 flex items-start gap-4">
                <div className="w-20 h-14 rounded-lg overflow-hidden bg-slate-950 shrink-0 border border-slate-800">
                  <img
                    src={img.url}
                    alt={img.caption || img.spotName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Stortorget_2006.jpg/1280px-Stortorget_2006.jpg';
                    }}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium mb-0.5">
                    <span>Day {img.day}</span>
                    <span>·</span>
                    <span>{img.city}</span>
                    <span>·</span>
                    <span className="text-slate-300 font-semibold">{img.spotName}</span>
                  </div>
                  <p className="text-xs text-slate-200 font-medium truncate">
                    {img.caption || img.spotName}
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Camera className="w-3 h-3 text-slate-500" />
                      {img.author || 'Wikimedia Commons Contributor'}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1 text-slate-400">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      {img.license || 'CC BY-SA 4.0'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-950/60 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-medium transition-colors"
          >
            關閉
          </button>
        </div>
      </div>
    </div>
  );
};
