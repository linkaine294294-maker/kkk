import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Compass,
  Calendar,
  ArrowRight,
  Camera,
  UtensilsCrossed,
  PartyPopper,
  Gift,
  Flame,
  ChevronRight,
  Music,
  MapPin,
  Clock,
  Award,
  Layers,
  CheckCircle2,
  Maximize2,
  Film,
  Gamepad2,
  DollarSign,
  Swords,
} from 'lucide-react';

interface CoverHeroProps {
  onStartExploring: () => void;
  onOpenMap: () => void;
  onOpenAlbum?: () => void;
  onOpenCountdown?: () => void;
  onOpenChristmasCard?: () => void;
  onOpenSouvenirs?: () => void;
  onOpenVideos?: () => void;
  onOpenGames?: () => void;
  onOpenReindeerRpg?: () => void;
  onReplayTrain?: () => void;
  onSelectDay?: (day: number) => void;
}

export interface LandmarkPhotoItem {
  id: string;
  country: string;
  countryCode: 'all' | 'denmark' | 'sweden' | 'finland' | 'norway' | 'iceland';
  flag: string;
  city: string;
  title: string;
  subtitle: string;
  dayNum: number;
  dayTag: string;
  img: string;
  highlight: string;
}

export const ALL_COVER_LANDMARKS: LandmarkPhotoItem[] = [
  // Denmark
  {
    id: 'copenhagen-nyhavn',
    country: '丹麥',
    countryCode: 'denmark',
    flag: '🇩🇰',
    city: '哥本哈根',
    title: '新港彩色木屋童話運河',
    subtitle: 'Nyhavn Historic Christmas Canal',
    dayNum: 1,
    dayTag: 'Day 1 哥本哈根啟程',
    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Kopenhagen_%28DK%29%2C_Nyhavn_--_2017_--_1711.jpg/1280px-Kopenhagen_%28DK%29%2C_Nyhavn_--_2017_--_1711.jpg',
    highlight: '經典彩色山牆木屋與暖黃聖誕集市燈串',
  },
  {
    id: 'copenhagen-mermaid',
    country: '丹麥',
    countryCode: 'denmark',
    flag: '🇩🇰',
    city: '哥本哈根',
    title: '安徒生童話小美人魚銅像',
    subtitle: 'The Little Mermaid Waterfront',
    dayNum: 2,
    dayTag: 'Day 2 皇家港灣巡禮',
    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Petite_sir%C3%A8ne_de_Copenhague_%28conforme_%C3%A0_la_loi_danoise%29.JPG/1280px-Petite_sir%C3%A8ne_de_Copenhague_%28conforme_%C3%A0_la_loi_danoise%29.JPG',
    highlight: '百年經典海濱地標與冬日冷峻港灣晨光',
  },
  {
    id: 'copenhagen-palace',
    country: '丹麥',
    countryCode: 'denmark',
    flag: '🇩🇰',
    city: '哥本哈根',
    title: '克里斯蒂安堡宮議會大廈',
    subtitle: 'Christiansborg Palace & Royal Stables',
    dayNum: 3,
    dayTag: 'Day 3 皇家議會巡禮',
    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Christiansborg_Slot_Copenhagen_2014_01.jpg/1280px-Christiansborg_Slot_Copenhagen_2014_01.jpg',
    highlight: '巴洛克花崗岩皇宮與皇家馴馬場氣度',
  },

  // Sweden
  {
    id: 'stockholm-gamla',
    country: '瑞典',
    countryCode: 'sweden',
    flag: '🇸🇪',
    city: '斯德哥爾摩',
    title: '老城雪夜暖光與石板路',
    subtitle: 'Gamla Stan Historic Old Town',
    dayNum: 4,
    dayTag: 'Day 4 水上之都降落',
    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Stortorget_2006.jpg/1280px-Stortorget_2006.jpg',
    highlight: '中古世紀暖橘磚樓、大廣場聖誕樹與積雪石板小巷',
  },
  {
    id: 'stockholm-cityhall',
    country: '瑞典',
    countryCode: 'sweden',
    flag: '🇸🇪',
    city: '斯德哥爾摩',
    title: '斯德哥爾摩市政廳諾貝爾廳',
    subtitle: 'Stadshuset Nobel Banquet Hall',
    dayNum: 5,
    dayTag: 'Day 5 諾貝爾盛宴之路',
    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Stockholms_stadshus_september_2011.jpg/1280px-Stockholms_stadshus_september_2011.jpg',
    highlight: '八百萬片純金箔金廳與梅拉倫湖畔紅磚鐘樓',
  },
  {
    id: 'stockholm-vasa',
    country: '瑞典',
    countryCode: 'sweden',
    flag: '🇸🇪',
    city: '斯德哥爾摩',
    title: '瓦薩沉船戰艦博物館',
    subtitle: 'Vasa Ship Royal Flagship Museum',
    dayNum: 6,
    dayTag: 'Day 6 17世紀帝國榮光',
    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/SS_Sankt_Erik_icebreaker_museum_ship_Stockholm_2016_02.jpg/1280px-SS_Sankt_Erik_icebreaker_museum_ship_Stockholm_2016_02.jpg',
    highlight: '全球唯一完整保留的 17 世紀 64 門巨砲皇家戰艦',
  },

  // Finland
  {
    id: 'rovaniemi-santa',
    country: '芬蘭',
    countryCode: 'finland',
    flag: '🇫🇮',
    city: '羅瓦涅米',
    title: '聖誕老人官方村與北極圈線',
    subtitle: 'Santa Claus Village & Arctic Circle Line',
    dayNum: 7,
    dayTag: 'Day 7 北極圈聖誕奇蹟',
    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Santa_Claus_Village_%285306867729%29.jpg/1280px-Santa_Claus_Village_%285306867729%29.jpg',
    highlight: '跨越北極圈 66°33′N 線，領取官方跨越證書與寄送聖誕郵戳',
  },
  {
    id: 'kakslauttanen-igloo',
    country: '芬蘭',
    countryCode: 'finland',
    flag: '🇫🇮',
    city: '薩利色爾卡',
    title: '極光穹頂發熱玻璃屋',
    subtitle: 'Kakslauttanen Aurora Glass Igloo',
    dayNum: 8,
    dayTag: 'Day 8 極夜玻璃屋極光',
    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Wood_and_flowers.jpg/1280px-Wood_and_flowers.jpg',
    highlight: '躺在溫暖床上仰望 360° 極光舞動與漫天璀璨繁星',
  },
  {
    id: 'helsinki-rock-church',
    country: '芬蘭',
    countryCode: 'finland',
    flag: '🇫🇮',
    city: '赫爾辛基',
    title: '岩石教堂天然花崗岩穹頂',
    subtitle: 'Temppeliaukio Rock Church',
    dayNum: 9,
    dayTag: 'Day 9 芬蘭設計之都',
    img: 'https://upload.wikimedia.org/wikipedia/commons/6/62/Temppeliaukio_Church_3.jpg',
    highlight: '直接在天然巨型岩石中炸開打造的銅線穹頂建築奇蹟',
  },

  // Norway
  {
    id: 'tromso-aurora',
    country: '挪威',
    countryCode: 'norway',
    flag: '🇳🇴',
    city: '特羅姆瑟',
    title: '特羅姆瑟極光峽灣特等席',
    subtitle: 'Tromsø Arctic Aurora Fjord View',
    dayNum: 10,
    dayTag: 'Day 10 極夜極光之都',
    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Tromso_banner_Aurora_Borealis.jpg/1280px-Tromso_banner_Aurora_Borealis.jpg',
    highlight: '極夜峽灣水面映照翡翠綠與紫霓極光雙重倒影',
  },
  {
    id: 'tromso-cathedral',
    country: '挪威',
    countryCode: 'norway',
    flag: '🇳🇴',
    city: '特羅姆瑟',
    title: '北極大教堂幾何冰山建築',
    subtitle: 'The Arctic Cathedral (Ishavskatedralen)',
    dayNum: 11,
    dayTag: 'Day 11 帝王蟹與北極之光',
    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Arctic_Cathedral.JPG/1280px-Arctic_Cathedral.JPG',
    highlight: '純白幾何冰川外觀與歐洲最大彩繪玻璃窗',
  },
  {
    id: 'bergen-bryggen',
    country: '挪威',
    countryCode: 'norway',
    flag: '🇳🇴',
    city: '卑爾根',
    title: '布呂根世界遺產彩色木屋碼頭',
    subtitle: 'Bryggen Hanseatic Wharf Heritage',
    dayNum: 11,
    dayTag: 'Day 11 漢薩同盟港灣',
    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Bryggen%2C_Bergen3.JPG/1280px-Bryggen%2C_Bergen3.JPG',
    highlight: '世界文化遺產，斜立的彩色木屋與北海漁港歷史氛圍',
  },
  {
    id: 'oslo-opera',
    country: '挪威',
    countryCode: 'norway',
    flag: '🇳🇴',
    city: '奧斯陸',
    title: '奧斯陸歌劇院斜坡大理石冰山',
    subtitle: 'Oslo Opera House Fjord Waterfront',
    dayNum: 12,
    dayTag: 'Day 12 挪威現代之巔',
    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/New_Opera_in_Oslo.jpg/1280px-New_Opera_in_Oslo.jpg',
    highlight: '漫步於傾斜向峽灣延伸的白色義大利大理石屋頂',
  },

  // Iceland
  {
    id: 'iceland-blue-lagoon',
    country: '冰島',
    countryCode: 'iceland',
    flag: '🇮🇸',
    city: '格林達維克',
    title: '藍湖地熱水療溫泉 SPA',
    subtitle: 'Blue Lagoon Geothermal Mineral SPA',
    dayNum: 13,
    dayTag: 'Day 13 冰與火奢華水療',
    img: 'https://upload.wikimedia.org/wikipedia/commons/b/be/Blue_lagoon%2C_Iceland_02.jpg',
    highlight: '富含二氧化矽的乳藍色地熱礦物池與火山熔岩黑石',
  },
  {
    id: 'iceland-hallgrimskirkja',
    country: '冰島',
    countryCode: 'iceland',
    flag: '🇮🇸',
    city: '雷克雅維克',
    title: '哈爾格林姆大教堂玄武岩石柱',
    subtitle: 'Hallgrímskirkja Basalt Column Cathedral',
    dayNum: 14,
    dayTag: 'Day 14 雷克雅維克市區',
    img: 'https://upload.wikimedia.org/wikipedia/commons/d/da/Hallgr%C3%ADmskirkja.jpeg',
    highlight: '74.5 公尺高聳玄武岩熔岩柱造型，登頂俯瞰彩色小木屋市容',
  },
  {
    id: 'iceland-fireworks',
    country: '冰島',
    countryCode: 'iceland',
    flag: '🇮🇸',
    city: '雷克雅維克',
    title: '2027 冰島萬人璀璨跨年煙火',
    subtitle: 'Reykjavik 2027 New Year Midnight Fireworks',
    dayNum: 15,
    dayTag: 'Day 15 2027跨年終章',
    img: 'https://upload.wikimedia.org/wikipedia/commons/2/26/NewYearFireworks-Reykjavik.jpg',
    highlight: '全城居民自發施放數萬發璀璨煙火照亮北極夜空',
  },
];

export const CoverHero: React.FC<CoverHeroProps> = ({
  onStartExploring,
  onOpenMap,
  onOpenAlbum,
  onOpenCountdown,
  onOpenChristmasCard,
  onOpenSouvenirs,
  onOpenVideos,
  onOpenGames,
  onOpenReindeerRpg,
  onReplayTrain,
  onSelectDay,
}) => {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [selectedCountryFilter, setSelectedCountryFilter] = useState<
    'all' | 'denmark' | 'sweden' | 'finland' | 'norway' | 'iceland'
  >('all');

  // Auto advance background panorama slideshow smoothly
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlideIndex((prev) => (prev + 1) % ALL_COVER_LANDMARKS.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const currentLandmark = ALL_COVER_LANDMARKS[activeSlideIndex];

  const filteredLandmarks =
    selectedCountryFilter === 'all'
      ? ALL_COVER_LANDMARKS
      : ALL_COVER_LANDMARKS.filter(
          (item) => item.countryCode === selectedCountryFilter
        );

  const handleCardClick = (idx: number, dayNum: number) => {
    // Find index in master list to sync panorama
    const masterIndex = ALL_COVER_LANDMARKS.findIndex(
      (item) => item.id === filteredLandmarks[idx].id
    );
    if (masterIndex >= 0) setActiveSlideIndex(masterIndex);

    if (onSelectDay) {
      onSelectDay(dayNum);
    }
  };

  return (
    <div className="space-y-8 mb-12">
      {/* 1. Main Hero Cinematic Panorama Box */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-800/90 shadow-2xl bg-slate-950">
        <div className="relative min-h-[90vh] lg:min-h-[82vh] flex flex-col justify-between p-6 sm:p-10 lg:p-14 overflow-hidden">
          {/* Panoramic Multilayer Background Image Switcher */}
          {ALL_COVER_LANDMARKS.map((item, idx) => (
            <div
              key={item.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                idx === activeSlideIndex
                  ? 'opacity-100 scale-100 z-0'
                  : 'opacity-0 scale-105 pointer-events-none'
              }`}
              style={{ transitionProperty: 'opacity, transform' }}
            >
              <img
                src={item.img}
                alt={item.title}
                className="w-full h-full object-cover object-center"
              />
              {/* Cinematic Multilayer Vignette Gradients */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/35" />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/30 to-slate-950/70" />
              <div className="absolute inset-0 bg-radial-gradient from-emerald-950/20 via-transparent to-slate-950/90 pointer-events-none" />
            </div>
          ))}

          {/* Top Header Bar inside Cover */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
            {/* Brand & Edition */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400/30 via-emerald-500/20 to-slate-900 border border-amber-400/40 flex items-center justify-center shadow-lg shadow-amber-500/10 backdrop-blur-md">
                <span className="text-xl">👑</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-serif font-black tracking-widest text-amber-300 uppercase">
                    NORDIC LUXURY EXPEDITION
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    2026-2027 EDITION
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 font-sans tracking-wide">
                  北歐五國 · 奢華聖誕跨年十五日全景誌
                </p>
              </div>
            </div>

            {/* Key Dates Badge & 5 Flags */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-1.5 bg-slate-900/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-700/80 text-xs text-slate-200">
                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-semibold text-emerald-300 font-mono">
                  2026.12.19 – 2027.01.02
                </span>
                <span className="text-slate-500">|</span>
                <span>15 Days</span>
              </div>

              <div className="hidden sm:flex items-center gap-1 text-base bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-full border border-slate-800">
                <span title="丹麥">🇩🇰</span>
                <span title="瑞典">🇸🇪</span>
                <span title="芬蘭">🇫🇮</span>
                <span title="挪威">🇳🇴</span>
                <span title="冰島">🇮🇸</span>
              </div>
            </div>
          </div>

          {/* Center Hero Editorial Content */}
          <div className="relative z-10 my-auto py-8 max-w-4xl">
            {/* Slide Tag & Current Location */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-amber-400/40 text-amber-300 text-xs sm:text-sm font-medium backdrop-blur-md mb-4 shadow-xl">
              <span className="text-base">{currentLandmark.flag}</span>
              <span className="font-semibold">{currentLandmark.country} · {currentLandmark.city}</span>
              <span className="text-slate-500">·</span>
              <span className="text-emerald-300">{currentLandmark.dayTag}</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse ml-1" />
            </div>

            {/* Grand Main Title */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-black text-white tracking-tight leading-tight sm:leading-none drop-shadow-2xl">
              北歐極境 · 奢華聖誕跨年
            </h1>

            {/* Current Landmark Title & Description */}
            <div className="mt-3 bg-slate-950/75 backdrop-blur-md border border-slate-800/80 p-4 rounded-2xl max-w-3xl">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
                <h3 className="text-lg sm:text-xl font-serif font-bold text-amber-200">
                  {currentLandmark.title}
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 font-sans mt-1 leading-relaxed">
                {currentLandmark.highlight}
              </p>
            </div>

            {/* Action CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-5">
              <button
                onClick={onStartExploring}
                className="px-8 py-4 bg-gradient-to-r from-amber-400 via-emerald-400 to-teal-400 hover:from-amber-300 hover:to-teal-300 text-slate-950 font-black text-sm sm:text-base rounded-2xl shadow-xl shadow-emerald-500/25 transition-all duration-300 hover:scale-105 flex items-center gap-2 group"
              >
                <span>開始探索 15 日行程</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onOpenMap}
                className="px-6 py-4 bg-slate-900/85 hover:bg-slate-800 text-slate-200 hover:text-white font-semibold text-sm sm:text-base rounded-2xl border border-slate-700/80 backdrop-blur-md shadow-xl transition-all duration-300 flex items-center gap-2"
              >
                <Compass className="w-4 h-4 text-emerald-400" />
                <span>五國全景地圖</span>
              </button>

              {onOpenAlbum && (
                <button
                  onClick={onOpenAlbum}
                  className="px-5 py-4 bg-slate-900/85 hover:bg-slate-800 text-slate-200 hover:text-white font-semibold text-sm rounded-2xl border border-slate-700/80 backdrop-blur-md shadow-xl transition-all flex items-center gap-2"
                >
                  <Camera className="w-4 h-4 text-amber-400" />
                  <span>相片圖鑑</span>
                </button>
              )}

              {onOpenChristmasCard && (
                <button
                  onClick={onOpenChristmasCard}
                  className="px-5 py-4 bg-gradient-to-r from-red-950/90 to-rose-900/90 hover:from-red-900 hover:to-rose-800 text-amber-200 hover:text-white font-bold text-sm rounded-2xl border border-rose-500/50 backdrop-blur-md shadow-xl transition-all flex items-center gap-2 hover:scale-105"
                >
                  <Gift className="w-4 h-4 text-amber-300 animate-bounce" />
                  <span>聖誕倒數 & 賀卡</span>
                </button>
              )}

              {onOpenCountdown && (
                <button
                  onClick={onOpenCountdown}
                  className="px-5 py-4 bg-gradient-to-r from-purple-950/80 to-slate-900/85 hover:from-purple-900 hover:to-slate-800 text-amber-300 hover:text-white font-semibold text-sm rounded-2xl border border-purple-500/40 backdrop-blur-md shadow-xl transition-all flex items-center gap-2"
                >
                  <PartyPopper className="w-4 h-4 text-amber-400" />
                  <span>2027 跨年倒數</span>
                </button>
              )}

              {onOpenSouvenirs && (
                <button
                  onClick={onOpenSouvenirs}
                  className="px-5 py-4 bg-slate-900/85 hover:bg-slate-800 text-slate-200 hover:text-white font-semibold text-sm rounded-2xl border border-slate-700/80 backdrop-blur-md shadow-xl transition-all flex items-center gap-2"
                >
                  <Gift className="w-4 h-4 text-emerald-400" />
                  <span>五國伴手禮</span>
                </button>
              )}

              {onOpenVideos && (
                <button
                  onClick={onOpenVideos}
                  className="px-5 py-4 bg-slate-900/85 hover:bg-slate-800 text-cyan-300 hover:text-white font-semibold text-sm rounded-2xl border border-cyan-500/40 backdrop-blur-md shadow-xl transition-all flex items-center gap-2 hover:scale-105"
                >
                  <Film className="w-4 h-4 text-cyan-400" />
                  <span>旅遊實境影片</span>
                </button>
              )}

              {onOpenReindeerRpg && (
                <button
                  onClick={onOpenReindeerRpg}
                  className="px-5 py-4 bg-gradient-to-r from-emerald-950/90 to-teal-900/90 hover:from-emerald-900 hover:to-teal-800 text-emerald-300 hover:text-white font-bold text-sm rounded-2xl border border-emerald-500/50 backdrop-blur-md shadow-xl transition-all flex items-center gap-2 hover:scale-105 cursor-pointer"
                >
                  <span className="text-base">⚔️</span>
                  <span>《北境極光傳奇：五國神話紀元》RPG</span>
                </button>
              )}

              {onOpenGames && (
                <button
                  onClick={onOpenGames}
                  className="px-5 py-4 bg-slate-900/85 hover:bg-slate-800 text-amber-300 hover:text-white font-semibold text-sm rounded-2xl border border-amber-500/40 backdrop-blur-md shadow-xl transition-all flex items-center gap-2 hover:scale-105 cursor-pointer"
                >
                  <Swords className="w-4 h-4 text-amber-400" />
                  <span>維京突圍棋</span>
                </button>
              )}

              <button
                onClick={onStartExploring}
                className="px-5 py-4 bg-slate-900/85 hover:bg-slate-800 text-emerald-300 hover:text-white font-semibold text-sm rounded-2xl border border-emerald-500/40 backdrop-blur-md shadow-xl transition-all flex items-center gap-2 hover:scale-105"
              >
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <span>預算消耗圖表</span>
              </button>

              {onReplayTrain && (
                <button
                  onClick={onReplayTrain}
                  className="px-5 py-4 bg-slate-900/85 hover:bg-slate-800 text-amber-300 hover:text-white font-semibold text-sm rounded-2xl border border-amber-500/40 backdrop-blur-md shadow-xl transition-all flex items-center gap-2 hover:scale-105"
                >
                  <span className="text-base animate-pulse">🚂</span>
                  <span>北極特快車開場</span>
                </button>
              )}
            </div>
          </div>

          {/* Bottom Fast Location Thumbnail Strip */}
          <div className="relative z-10 pt-4 border-t border-white/10">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-serif font-bold text-amber-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>即時切換封面背景景致（16 大經典地標）：</span>
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                {activeSlideIndex + 1} / {ALL_COVER_LANDMARKS.length}
              </span>
            </div>

            <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-700">
              {ALL_COVER_LANDMARKS.map((landmark, idx) => (
                <button
                  key={landmark.id}
                  onClick={() => setActiveSlideIndex(idx)}
                  className={`group relative shrink-0 w-28 sm:w-36 rounded-2xl overflow-hidden border transition-all text-left ${
                    idx === activeSlideIndex
                      ? 'border-amber-400 ring-2 ring-amber-400/40 scale-105 shadow-xl shadow-amber-950/50'
                      : 'border-slate-800 opacity-70 hover:opacity-100 hover:border-slate-600'
                  }`}
                >
                  <div className="h-16 w-full relative">
                    <img
                      src={landmark.img}
                      alt={landmark.title}
                      className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                    <span className="absolute top-1 left-1.5 text-xs drop-shadow-sm">
                      {landmark.flag}
                    </span>
                    <span className="absolute bottom-1 left-1.5 text-[9px] font-mono font-bold text-amber-300 drop-shadow-md">
                      Day {landmark.dayNum}
                    </span>
                  </div>
                  <div className="p-1.5 bg-slate-950/90">
                    <span className="text-[11px] font-serif font-bold text-white block truncate">
                      {landmark.city}
                    </span>
                    <span className="text-[9px] text-slate-400 block truncate">
                      {landmark.title.split(' ')[0]}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Comprehensive 15-Day Landmark Visual Gallery Grid on Cover */}
      <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        {/* Section Header with Country Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
                DESTINATION SHOWCASE
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                16 代表性地點
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
              北歐十五日 · 跨國地標視覺全覽
            </h2>
          </div>

          {/* Country Tabs Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {[
              { code: 'all', label: '全部地標', flag: '🌍' },
              { code: 'denmark', label: '丹麥', flag: '🇩🇰' },
              { code: 'sweden', label: '瑞典', flag: '🇸🇪' },
              { code: 'finland', label: '芬蘭', flag: '🇫🇮' },
              { code: 'norway', label: '挪威', flag: '🇳🇴' },
              { code: 'iceland', label: '冰島', flag: '🇮🇸' },
            ].map((tab) => (
              <button
                key={tab.code}
                onClick={() =>
                  setSelectedCountryFilter(
                    tab.code as 'all' | 'denmark' | 'sweden' | 'finland' | 'norway' | 'iceland'
                  )
                }
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                  selectedCountryFilter === tab.code
                    ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20 font-black'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800 hover:bg-slate-800'
                }`}
              >
                <span>{tab.flag}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Visual Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {filteredLandmarks.map((landmark, idx) => (
            <div
              key={landmark.id}
              onClick={() => handleCardClick(idx, landmark.dayNum)}
              className="group bg-slate-950/80 hover:bg-slate-950 border border-slate-800 hover:border-emerald-500/50 rounded-2xl overflow-hidden shadow-xl transition-all duration-300 hover:-translate-y-1.5 cursor-pointer flex flex-col"
            >
              {/* Photo Banner with Zoom effect */}
              <div className="relative h-44 sm:h-48 overflow-hidden bg-slate-900">
                <img
                  src={landmark.img}
                  alt={landmark.title}
                  className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                {/* Country Badge */}
                <div className="absolute top-3 left-3 bg-slate-950/85 backdrop-blur-md px-2.5 py-1 rounded-full border border-slate-700/80 text-xs font-semibold text-white flex items-center gap-1.5 shadow-md">
                  <span>{landmark.flag}</span>
                  <span>{landmark.country}</span>
                </div>

                {/* Day Tag Badge */}
                <div className="absolute top-3 right-3 bg-emerald-950/85 backdrop-blur-md px-2.5 py-1 rounded-full border border-emerald-500/40 text-[10px] font-mono font-bold text-emerald-300 shadow-md">
                  Day {landmark.dayNum}
                </div>

                {/* City Tag on Bottom of Image */}
                <div className="absolute bottom-2 left-3 flex items-center gap-1 text-xs text-amber-300 font-serif font-bold drop-shadow-md">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  <span>{landmark.city}</span>
                </div>
              </div>

              {/* Card Details */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="text-sm font-serif font-bold text-white group-hover:text-emerald-300 transition-colors line-clamp-1">
                    {landmark.title}
                  </h3>
                  <span className="text-[10px] font-mono text-slate-400 block mt-0.5 line-clamp-1">
                    {landmark.subtitle}
                  </span>
                  <p className="text-xs text-slate-300 font-sans mt-2 line-clamp-2 leading-relaxed">
                    {landmark.highlight}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-xs">
                  <span className="text-emerald-400 font-semibold group-hover:underline flex items-center gap-1">
                    <span>前往第 {landmark.dayNum} 天行程</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">
                    點擊預覽封面
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
