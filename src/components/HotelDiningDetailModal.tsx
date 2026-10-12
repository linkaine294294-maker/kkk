import React, { useState, useEffect } from 'react';
import {
  Bed,
  UtensilsCrossed,
  X,
  Star,
  MapPin,
  Sparkles,
  ExternalLink,
  Flame,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Wine,
  ShieldCheck,
  Coffee,
} from 'lucide-react';
import { SafeImage } from './SafeImage';

export interface HotelDetailData {
  id: string;
  name: string;
  originalName: string;
  city: string;
  country: string;
  flag: string;
  stars: number;
  highlight: string;
  description: string;
  address: string;
  gallery: { url: string; caption: string }[];
  images?: string[];
  story?: string;
  trivia?: string;
  mustDo?: string[];
  suiteFeatures: string[];
  amenities: string[];
  priceTier?: string;
}

export interface DiningDetailData {
  id: string;
  name: string;
  originalName: string;
  city: string;
  country: string;
  flag: string;
  type: string;
  highlight: string;
  signatureDish: string;
  description: string;
  address: string;
  gallery: { url: string; caption: string }[];
  images?: string[];
  story?: string;
  trivia?: string;
  mustDo?: string[];
  courseHighlights: { name: string; desc: string }[];
  michelinRating?: string;
}

interface HotelDiningDetailModalProps {
  item: { type: 'hotel'; data: HotelDetailData } | { type: 'dining'; data: DiningDetailData } | null;
  onClose: () => void;
}

export const HotelDiningDetailModal: React.FC<HotelDiningDetailModalProps> = ({
  item,
  onClose,
}) => {
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  useEffect(() => {
    setActiveImgIndex(0);
  }, [item]);

  if (!item) return null;

  const isHotel = item.type === 'hotel';
  const hotel = isHotel ? item.data : null;
  const dining = !isHotel ? item.data : null;

  const rawImages = isHotel ? hotel?.images : dining?.images;
  const gallery =
    rawImages && rawImages.length > 0
      ? rawImages.map((url, idx) => ({
          url,
          caption: `${isHotel ? hotel!.name : dining!.name} · 實景攝影 (${idx + 1}/${rawImages.length})`,
        }))
      : isHotel
      ? hotel!.gallery && hotel!.gallery.length > 0
        ? hotel!.gallery
        : [
            { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/K%C3%A4mp_room.jpg/1280px-K%C3%A4mp_room.jpg', caption: '頂級奢華套房落地窗全景與壁爐' },
          ]
      : dining!.gallery && dining!.gallery.length > 0
      ? dining!.gallery
      : [
          { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Paralithodes_camtschaticus%2C_1.jpg/1280px-Paralithodes_camtschaticus%2C_1.jpg', caption: '米其林主廚特製北歐帝王蟹佐魚子醬美饌' },
        ];

  const currentImage = gallery[activeImgIndex] || gallery[0];
  const itemStory = isHotel ? hotel?.story : dining?.story;
  const itemTrivia = isHotel ? hotel?.trivia : dining?.trivia;
  const itemMustDo = isHotel ? hotel?.mustDo : dining?.mustDo;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl my-auto bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Trim */}
        <div
          className={`h-1 bg-gradient-to-r ${
            isHotel
              ? 'from-indigo-500 via-amber-400 to-indigo-500'
              : 'from-rose-500 via-amber-400 to-rose-500'
          }`}
        />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-slate-950/80 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white rounded-full transition-colors"
          aria-label="關閉"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Media Carousel Header */}
        <div className="relative w-full h-64 sm:h-84 shrink-0 bg-slate-950 overflow-hidden">
          <SafeImage
            src={currentImage.url}
            alt={currentImage.caption}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

          {/* Badge */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg backdrop-blur-md ${
                isHotel ? 'bg-indigo-600/90' : 'bg-rose-600/90'
              }`}
            >
              {isHotel ? <Bed className="w-3.5 h-3.5" /> : <UtensilsCrossed className="w-3.5 h-3.5" />}
              <span>{isHotel ? '頂級奢華下榻飯店' : dining!.type}</span>
            </span>
            <span className="px-2.5 py-1 rounded-full bg-slate-950/80 text-white text-xs font-semibold backdrop-blur-md shadow-md">
              {isHotel ? hotel!.flag + ' ' + hotel!.city : dining!.flag + ' ' + dining!.city}
            </span>
          </div>

          {/* Navigation Arrows */}
          {gallery.length > 1 && (
            <>
              <button
                onClick={() =>
                  setActiveImgIndex((prev) => (prev === 0 ? gallery.length - 1 : prev - 1))
                }
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-slate-950/70 hover:bg-slate-900 text-white rounded-full border border-slate-700 backdrop-blur-sm"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() =>
                  setActiveImgIndex((prev) => (prev === gallery.length - 1 ? 0 : prev + 1))
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-slate-950/70 hover:bg-slate-900 text-white rounded-full border border-slate-700 backdrop-blur-sm"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Photo Caption & Counter */}
          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-white">
            <span className="font-medium bg-slate-950/80 px-3 py-1 rounded-full backdrop-blur-sm border border-slate-800">
              📸 {currentImage.caption}
            </span>
            <span className="font-mono bg-slate-950/80 px-2.5 py-1 rounded-full backdrop-blur-sm border border-slate-800">
              {activeImgIndex + 1} / {gallery.length}
            </span>
          </div>
        </div>

        {/* Thumbnail Selector Bar */}
        {gallery.length > 1 && (
          <div className="flex items-center gap-2 p-3 bg-slate-950/90 border-b border-slate-800 overflow-x-auto no-scrollbar">
            {gallery.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImgIndex(idx)}
                className={`relative w-16 h-12 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                  activeImgIndex === idx
                    ? 'border-amber-400 scale-105 shadow-md shadow-amber-500/30'
                    : 'border-slate-800 opacity-60 hover:opacity-100'
                }`}
              >
                <SafeImage src={img.url} alt={img.caption} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto no-scrollbar">
          {/* Header Title */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-xl sm:text-2xl font-serif font-black text-white">
                {isHotel ? hotel!.name : dining!.name}
              </h3>
              <p className="text-xs text-indigo-300 font-mono mt-0.5">
                {isHotel ? hotel!.originalName : dining!.originalName}
              </p>
            </div>

            {isHotel && (
              <div className="flex items-center gap-1 text-amber-400 bg-amber-400/10 border border-amber-400/30 px-3 py-1.5 rounded-xl self-start">
                {Array.from({ length: hotel!.stars }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
                <span className="text-xs font-bold ml-1 text-amber-300">五星級奢華認證</span>
              </div>
            )}
          </div>

          {/* Highlight Banner */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-transparent border border-amber-400/30 flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-xs font-bold text-amber-200">
              {isHotel ? hotel!.highlight : dining!.highlight}
            </span>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {isHotel ? '飯店歷史與設計哲學' : '餐廳特色與主廚理念'}
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {isHotel ? hotel!.description : dining!.description}
            </p>
          </div>

          {/* Story, Trivia & Must-Do Cards */}
          {(itemStory || itemTrivia || (itemMustDo && itemMustDo.length > 0)) && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {itemStory && (
                <div className="p-3.5 rounded-2xl bg-amber-950/25 border border-amber-500/30 space-y-1.5">
                  <div className="text-xs font-bold text-amber-300">📖 傳奇小故事</div>
                  <p className="text-xs text-amber-100/90 leading-relaxed">{itemStory}</p>
                </div>
              )}
              {itemTrivia && (
                <div className="p-3.5 rounded-2xl bg-cyan-950/25 border border-cyan-500/30 space-y-1.5">
                  <div className="text-xs font-bold text-cyan-300">💡 趣味小知識</div>
                  <p className="text-xs text-cyan-100/90 leading-relaxed">{itemTrivia}</p>
                </div>
              )}
              {itemMustDo && itemMustDo.length > 0 && (
                <div className="p-3.5 rounded-2xl bg-emerald-950/25 border border-emerald-500/30 space-y-1.5">
                  <div className="text-xs font-bold text-emerald-300">✅ 必做的事</div>
                  <ul className="text-xs text-emerald-100/90 space-y-1 list-disc list-inside">
                    {itemMustDo.map((m, mIdx) => (
                      <li key={mIdx}>{m}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Hotel Specifics: Suite Features & Amenities */}
          {isHotel && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2.5">
                <h5 className="text-xs font-bold text-indigo-400 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5" />
                  <span>奢華客房與套房規格</span>
                </h5>
                <ul className="text-xs text-slate-300 space-y-1.5">
                  {(hotel!.suiteFeatures || [
                    '極景落地窗直面白雪森林 / 峽灣水岸',
                    '瑞典國寶級 Hästens 手工天然馬毛名床',
                    '私人極地芬蘭桑拿室與真火壁爐',
                    'Bang & Olufsen 丹麥頂級聲學音響系統',
                    'Diptyque / Molton Brown 皇家香氛洗沐組',
                  ]).map((feat, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2.5">
                <h5 className="text-xs font-bold text-indigo-400 flex items-center gap-1.5">
                  <Coffee className="w-3.5 h-3.5" />
                  <span>貴賓專屬禮遇與設施</span>
                </h5>
                <ul className="text-xs text-slate-300 space-y-1.5">
                  {(hotel!.amenities || [
                    '每日主廚現做香檳魚子醬北歐式早餐',
                    '私人極光自動喚醒偵測服務',
                    '免費奢華溫泉水療與地熱池使用權',
                    '24小時私人禮賓車隊與行李運送',
                    '迎賓特調香料熱紅酒與手作黑巧克力',
                  ]).map((amen, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span>{amen}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Dining Specifics: Signature Courses */}
          {!isHotel && (
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
              <h5 className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                <Wine className="w-3.5 h-3.5" />
                <span>主廚招牌美饌與推薦品項</span>
              </h5>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200">
                <span className="font-bold text-amber-400 block mb-1">主廚盛宴核心招牌：</span>
                <span>{dining!.signatureDish}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                {(dining!.courseHighlights || [
                  { name: '前菜 (Appetizer)', desc: '野生海鱸魚薄片佐蒔蘿青蘋果泥與酸豆' },
                  { name: '主餐 (Main Course)', desc: '低溫慢燉帝王蟹佐焦糖奶油與海紅果乳沫' },
                  { name: '甜點 (Dessert)', desc: '北極野雲莓舒芙蕾佐香草冰淇淋' },
                  { name: '餐酒搭配 (Pairing)', desc: '精選勃根地特級白酒與北歐手工精釀麥酒' },
                ]).map((c, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
                    <span className="font-bold text-emerald-400 block mb-0.5">{c.name}</span>
                    <span className="text-slate-300">{c.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Address & Navigation */}
          <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400">
            <div className="flex items-center gap-1.5 truncate">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="truncate">{isHotel ? hotel!.address : dining!.address}</span>
            </div>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                (isHotel ? hotel!.name : dining!.name) + ' ' + (isHotel ? hotel!.city : dining!.city)
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md shadow-emerald-500/20 shrink-0"
            >
              <span>在 Google 地圖導航</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
