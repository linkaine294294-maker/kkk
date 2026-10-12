import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Gift,
  Send,
  Heart,
  Calendar,
  Clock,
  Download,
  Copy,
  CheckCircle2,
  Share2,
  RotateCw,
  Stamp,
  Mail,
  Flame,
  Snowflake,
  Star,
  PartyPopper,
  Compass,
} from 'lucide-react';

interface ChristmasCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDay?: (day: number) => void;
}

interface CardTemplate {
  id: string;
  title: string;
  subtitle: string;
  themeColor: string;
  accentBg: string;
  borderGlow: string;
  image: string;
  badge: string;
  flag: string;
  dayNum: number;
  defaultMsg: string;
  location: string;
}

const CARD_TEMPLATES: CardTemplate[] = [
  {
    id: 'santa-village',
    title: '北極圈聖誕老人村官方郵戳卡',
    subtitle: 'Santa Claus Village Official Arctic Postcard',
    themeColor: 'text-rose-400',
    accentBg: 'from-rose-950/80 via-slate-900/90 to-amber-950/70',
    borderGlow: 'border-rose-500/50 hover:border-rose-400',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Santa_Claus_Village_%285306867729%29.jpg/1280px-Santa_Claus_Village_%285306867729%29.jpg',
    badge: '芬蘭 · 羅瓦涅米',
    flag: '🇫🇮',
    dayNum: 7,
    defaultMsg: '親愛的朋友，我在北極圈 66°33′N 的聖誕老人辦公室為你寄出這張卡片！願芬蘭極夜的漫天星光與馴鹿鈴鐺，為你帶來一整年的溫暖、平安與奇蹟。聖誕快樂！🎄✨',
    location: 'Arctic Circle 66°33′N, Rovaniemi, Finland',
  },
  {
    id: 'aurora-igloo',
    title: '薩利色爾卡極光穹頂祝福卡',
    subtitle: 'Kakslauttanen Aurora Glass Igloo Card',
    themeColor: 'text-emerald-400',
    accentBg: 'from-emerald-950/80 via-slate-900/90 to-cyan-950/70',
    borderGlow: 'border-emerald-500/50 hover:border-emerald-400',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Wood_and_flowers.jpg/1280px-Wood_and_flowers.jpg',
    badge: '芬蘭 · 薩利色爾卡',
    flag: '🇫🇮',
    dayNum: 8,
    defaultMsg: '躺在發熱玻璃屋穹頂下，翡翠色的極光正像綠色絲帶般在天頂舞動。將這份宇宙級的幸運與浪漫獻給你，願你的所有夢想都能如極光般綻放璀璨光芒！🌌💚',
    location: 'Kakslauttanen Arctic Resort, Lapland',
  },
  {
    id: 'copenhagen-nyhavn',
    title: '哥本哈根新港溫馨聖誕運河卡',
    subtitle: 'Nyhavn Hygge Christmas Postcard',
    themeColor: 'text-amber-400',
    accentBg: 'from-amber-950/80 via-slate-900/90 to-rose-950/70',
    borderGlow: 'border-amber-500/50 hover:border-amber-400',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Kopenhagen_%28DK%29%2C_Nyhavn_--_2017_--_1711.jpg/1280px-Kopenhagen_%28DK%29%2C_Nyhavn_--_2017_--_1711.jpg',
    badge: '丹麥 · 哥本哈根',
    flag: '🇩🇰',
    dayNum: 1,
    defaultMsg: '彩色木屋倒映在運河水中，空氣裡瀰漫著肉桂熱紅酒與炒杏仁的香氣。願丹麥獨有的 Hygge 溫馨時光常伴你左右，祝你擁有最甜蜜溫暖的聖誕佳節！🕯️🍷',
    location: 'Nyhavn Canal, Copenhagen, Denmark',
  },
  {
    id: 'gamla-stan',
    title: '斯德哥爾摩老城雪夜金箔賀卡',
    subtitle: 'Gamla Stan Stockholm Winter Foil Card',
    themeColor: 'text-purple-400',
    accentBg: 'from-purple-950/80 via-slate-900/90 to-amber-950/70',
    borderGlow: 'border-purple-500/50 hover:border-purple-400',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Stortorget_2006.jpg/1280px-Stortorget_2006.jpg',
    badge: '瑞典 · 斯德哥爾摩',
    flag: '🇸🇪',
    dayNum: 4,
    defaultMsg: '中古世紀的紅磚小巷覆蓋著厚厚的白雪，大廣場的聖誕樹在黃昏點亮了整座水上之都。願這份北歐雪夜的寧靜與詩意，伴隨你的每一步美好旅程！❄️🏰',
    location: 'Gamla Stan Historic Old Town, Sweden',
  },
  {
    id: 'tromso-aurora',
    title: '特羅姆瑟極夜峽灣聖誕卡',
    subtitle: 'Tromsø Arctic Cathedral & Aurora Fjord',
    themeColor: 'text-sky-400',
    accentBg: 'from-sky-950/80 via-slate-900/90 to-indigo-950/70',
    borderGlow: 'border-sky-500/50 hover:border-sky-400',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Tromso_banner_Aurora_Borealis.jpg/1280px-Tromso_banner_Aurora_Borealis.jpg',
    badge: '挪威 · 特羅姆瑟',
    flag: '🇳🇴',
    dayNum: 10,
    defaultMsg: '在極夜的峽灣之巔，北極大教堂的純白輪廓與天際極光相映成趣。向遠方的你送上最真摯的極地問候，願你的新年充滿探險的勇氣與無盡的驚喜！🏔️✨',
    location: 'Tromsø Arctic Fjord, Norway',
  },
];

const PRESET_MESSAGES = [
  '願芬蘭極夜的漫天星光與馴鹿鈴鐺，為你帶來一整年的溫暖、平安與奇蹟。聖誕快樂！🎄✨',
  '在北極圈 66°33′N 官方聖誕老人村向你寄出最誠摯的祝福！願夢想皆能如期綻放！🎅📮',
  '躺在薩利色爾卡極光穹頂下，將這份舞動於天際的幸運光芒打包送給你！🌌💚',
  '暖黃的新港彩色木屋與肉桂熱紅酒，祝你擁有最道地的北歐 Hygge 溫馨聖誕！🕯️🍷',
  '瑞典斯德哥爾摩老城的初雪，願這份純白與純粹陪伴你的每一個冬日時光！❄️🏰',
];

const STAMP_STYLES = [
  { id: 'santa', label: '北極圈 66°33′N 官方郵戳', icon: '📮' },
  { id: 'aurora', label: '極光特等席金色印章', icon: '🌌' },
  { id: 'wax', label: '馴鹿金箔火漆封蠟', icon: '👑' },
];

interface WishItem {
  id: string;
  sender: string;
  recipient: string;
  message: string;
  templateTitle: string;
  flag: string;
  time: string;
  likes: number;
}

const INITIAL_WISHES: WishItem[] = [
  {
    id: 'w-1',
    sender: '全體旅伴',
    recipient: '所有熱愛旅行的冒險家',
    message: '願我們在北歐十五天的每一刻都看見最璀璨的極光，聖誕快樂！',
    templateTitle: '北極圈聖誕老人村官方郵戳卡',
    flag: '🇫🇮',
    time: '剛剛',
    likes: 24,
  },
  {
    id: 'w-2',
    sender: 'Kaine',
    recipient: '最親愛的朋友',
    message: '希望這次北歐聖誕跨年之旅能成為一輩子最難忘的美好回憶！',
    templateTitle: '薩利色爾卡極光穹頂祝福卡',
    flag: '🇸🇪',
    time: '5分鐘前',
    likes: 18,
  },
  {
    id: 'w-3',
    sender: '極地探險隊',
    recipient: '全世界',
    message: '從哥本哈根到冰島藍湖，祝福大家新的一年心想事成、平安順遂！',
    templateTitle: '哥本哈根新港溫馨聖誕運河卡',
    flag: '🇩🇰',
    time: '12分鐘前',
    likes: 15,
  },
];

export const ChristmasCardModal: React.FC<ChristmasCardModalProps> = ({
  isOpen,
  onClose,
  onSelectDay,
}) => {
  const [selectedTemplateIndex, setSelectedTemplateIndex] = useState(0);
  const [recipient, setRecipient] = useState('親愛的朋友');
  const [sender, setSender] = useState('北歐旅人');
  const [customMessage, setCustomMessage] = useState(CARD_TEMPLATES[0].defaultMsg);
  const [selectedStamp, setSelectedStamp] = useState('santa');
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [copiedToast, setCopiedToast] = useState(false);

  // Countdown to Christmas Eve (2026.12.24 18:00 Lapland Local Time)
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const [wishes, setWishes] = useState<WishItem[]>(() => {
    try {
      const saved = localStorage.getItem('nordic_holiday_wishes');
      return saved ? JSON.parse(saved) : INITIAL_WISHES;
    } catch {
      return INITIAL_WISHES;
    }
  });

  const [newWishInput, setNewWishInput] = useState('');

  // Update Countdown timer
  useEffect(() => {
    const calculateCountdown = () => {
      // Christmas Eve: 2026-12-24 18:00:00 UTC+2
      const targetTime = new Date('2026-12-24T18:00:00+02:00').getTime();
      const now = new Date().getTime();
      const diff = Math.max(0, targetTime - now);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculateCountdown();
    const interval = setInterval(calculateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  // Update default message when template changes
  const handleSelectTemplate = (idx: number) => {
    setSelectedTemplateIndex(idx);
    setCustomMessage(CARD_TEMPLATES[idx].defaultMsg);
  };

  const currentTemplate = CARD_TEMPLATES[selectedTemplateIndex];

  // Copy Card Share Link / Text
  const handleCopyCard = () => {
    const fullText = `🎄【北歐奢華聖誕跨年賀卡 · ${currentTemplate.title}】\n\nTo: ${recipient}\n\n${customMessage}\n\nFrom: ${sender}\n📍 寄件地點：${currentTemplate.location}\n✨ 旅程天數：Day ${currentTemplate.dayNum}\n📮 官方郵戳：${
      STAMP_STYLES.find((s) => s.id === selectedStamp)?.label
    }`;

    navigator.clipboard.writeText(fullText);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 3000);
  };

  // Post a new wish to community board
  const handlePostWish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWishInput.trim()) return;

    const newWish: WishItem = {
      id: `wish-${Date.now()}`,
      sender: sender.trim() || '北歐旅人',
      recipient: recipient.trim() || '所有人',
      message: newWishInput.trim(),
      templateTitle: currentTemplate.title,
      flag: currentTemplate.flag,
      time: '剛剛',
      likes: 1,
    };

    const updated = [newWish, ...wishes];
    setWishes(updated);
    try {
      localStorage.setItem('nordic_holiday_wishes', JSON.stringify(updated));
    } catch {
      // Storage fallback
    }

    setNewWishInput('');
  };

  const handleLikeWish = (id: string) => {
    const updated = wishes.map((w) =>
      w.id === id ? { ...w, likes: w.likes + 1 } : w
    );
    setWishes(updated);
    try {
      localStorage.setItem('nordic_holiday_wishes', JSON.stringify(updated));
    } catch {
      // Storage fallback
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 print:hidden animate-in fade-in">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-amber-500/40 rounded-3xl shadow-2xl overflow-hidden my-8 flex flex-col max-h-[92vh]">
        {/* Festive Header Garland */}
        <div className="h-1.5 bg-gradient-to-r from-red-500 via-amber-400 via-emerald-400 via-sky-400 to-red-500" />

        {/* Modal Top Bar */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/80 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shadow-lg">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-serif font-black text-white flex items-center gap-2">
                  <span>北歐聖誕倒數 & 專屬賀卡工坊</span>
                  <span className="text-amber-300 text-sm">🎅🎄</span>
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  LAPLAND 66°33′N
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                拉普蘭官方聖誕老人村郵戳 · 極光玻璃屋明信片 · 節慶心願牆
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="overflow-y-auto p-5 sm:p-8 space-y-8 scrollbar-thin scrollbar-thumb-slate-700">
          {/* 1. Real-Time Christmas Eve & Christmas Day Countdown Widget */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-950/70 via-slate-950 to-emerald-950/70 border border-rose-500/40 p-6 sm:p-8 shadow-2xl">
            {/* Background Festive Floating Bokeh */}
            <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-rose-500/10 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-semibold mb-2 border border-rose-500/30">
                  <Snowflake className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
                  <span>2026 芬蘭拉普蘭 · 極夜聖誕夜即時倒數</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-serif font-black text-white">
                  距離 12/24 聖誕夜極光大餐還有：
                </h3>
                <p className="text-xs text-slate-300 font-sans mt-1">
                  芬蘭羅瓦涅米聖誕老人村 (Day 7) ➔ 薩利色爾卡極光玻璃屋 (Day 8)
                </p>
              </div>

              {/* Countdown Ticker Boxes */}
              <div className="flex items-center gap-2.5 sm:gap-4">
                {[
                  { value: timeLeft.days, label: '天 (DAYS)' },
                  { value: timeLeft.hours, label: '時 (HRS)' },
                  { value: timeLeft.minutes, label: '分 (MINS)' },
                  { value: timeLeft.seconds, label: '秒 (SECS)' },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col items-center justify-center w-16 sm:w-20 py-2.5 sm:py-3 bg-slate-900/90 border border-amber-500/40 rounded-2xl shadow-xl shadow-slate-950/80 backdrop-blur-md"
                  >
                    <span className="text-2xl sm:text-3xl font-mono font-black text-amber-300 leading-none">
                      {String(item.value).padStart(2, '0')}
                    </span>
                    <span className="text-[9px] sm:text-[10px] font-mono text-slate-400 mt-1 uppercase">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 2. Interactive Christmas Card Studio */}
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
                  POSTCARD STUDIO
                </span>
                <h3 className="text-xl font-serif font-bold text-white mt-0.5">
                  客製化北歐聖誕賀卡
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-sans">
                選擇賀卡範本 · 自訂祝福 · 蓋上北極圈郵戳
              </span>
            </div>

            {/* Template Carousel Selector */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {CARD_TEMPLATES.map((tmpl, idx) => (
                <button
                  key={tmpl.id}
                  onClick={() => handleSelectTemplate(idx)}
                  className={`relative rounded-2xl overflow-hidden border p-2.5 text-left transition-all flex flex-col justify-between ${
                    idx === selectedTemplateIndex
                      ? 'border-amber-400 ring-2 ring-amber-400/40 bg-slate-800 shadow-xl scale-102'
                      : 'border-slate-800 bg-slate-950/70 hover:bg-slate-900 opacity-75 hover:opacity-100'
                  }`}
                >
                  <div className="h-20 w-full rounded-xl overflow-hidden relative mb-2">
                    <img
                      src={tmpl.image}
                      alt={tmpl.title}
                      className="w-full h-full object-cover object-center"
                    />
                    <span className="absolute top-1 left-1.5 text-xs">
                      {tmpl.flag}
                    </span>
                    <span className="absolute bottom-1 right-1.5 text-[9px] font-mono font-bold bg-slate-950/80 px-1.5 py-0.5 rounded text-amber-300">
                      Day {tmpl.dayNum}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] font-serif font-bold text-white block truncate">
                      {tmpl.title}
                    </span>
                    <span className="text-[9px] text-slate-400 block truncate">
                      {tmpl.badge}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* Card Editor & Preview Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Interactive 3D Card Display */}
              <div className="lg:col-span-7 flex flex-col items-center">
                {/* Flip Card Action Button */}
                <div className="w-full flex items-center justify-between mb-2 px-1">
                  <span className="text-xs text-slate-400 font-mono">
                    賀卡預覽 (點擊右上角翻轉明信片)：
                  </span>
                  <button
                    onClick={() => setIsCardFlipped(!isCardFlipped)}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 hover:text-white transition-colors"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>{isCardFlipped ? '切換正面 (封面圖)' : '切換背面 (手寫格)'}</span>
                  </button>
                </div>

                {/* The Physical Card Canvas Container */}
                <div
                  className={`w-full min-h-[380px] rounded-3xl border-2 overflow-hidden shadow-2xl transition-all duration-500 ${
                    currentTemplate.borderGlow
                  } ${
                    !isCardFlipped
                      ? 'bg-gradient-to-br ' + currentTemplate.accentBg
                      : 'bg-stone-900 border-stone-700'
                  }`}
                >
                  {!isCardFlipped ? (
                    /* Front Face: High-Res Panorama, Golden Typography, Warm Greetings */
                    <div className="relative h-full flex flex-col justify-between p-6 sm:p-8 min-h-[380px]">
                      {/* Image Background */}
                      <img
                        src={currentTemplate.image}
                        alt={currentTemplate.title}
                        className="absolute inset-0 w-full h-full object-cover object-center opacity-40 mix-blend-overlay"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/40" />

                      {/* Top Badges & Stamp */}
                      <div className="relative z-10 flex items-start justify-between">
                        <div className="flex items-center gap-2 bg-slate-950/85 backdrop-blur-md px-3 py-1 rounded-full border border-amber-400/40">
                          <span className="text-base">{currentTemplate.flag}</span>
                          <span className="text-xs font-serif font-bold text-amber-300">
                            {currentTemplate.title}
                          </span>
                        </div>

                        {/* Physical Stamp Badge */}
                        <div className="w-14 h-16 rounded-xl border-2 border-dashed border-amber-400/70 bg-amber-950/60 p-1 flex flex-col items-center justify-center text-center shadow-lg">
                          <span className="text-lg">
                            {STAMP_STYLES.find((s) => s.id === selectedStamp)?.icon}
                          </span>
                          <span className="text-[7px] font-mono text-amber-200 mt-0.5 leading-tight">
                            LAPLAND
                            <br />
                            66°33′N
                          </span>
                        </div>
                      </div>

                      {/* Center Greeting Content */}
                      <div className="relative z-10 my-auto py-4">
                        <div className="text-xs font-mono text-amber-300 font-bold mb-1">
                          TO: {recipient}
                        </div>
                        <p className="text-sm sm:text-base font-serif text-slate-100 leading-relaxed drop-shadow-md">
                          “{customMessage}”
                        </p>
                      </div>

                      {/* Bottom Sender & Location Signature */}
                      <div className="relative z-10 pt-4 border-t border-white/10 flex items-end justify-between">
                        <div>
                          <span className="text-[10px] text-slate-400 block font-mono">
                            FROM:
                          </span>
                          <span className="text-sm font-serif font-bold text-amber-200">
                            {sender}
                          </span>
                        </div>

                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 block font-mono">
                            {currentTemplate.location}
                          </span>
                          <span className="text-[11px] font-mono font-bold text-emerald-400">
                            CHRISTMAS 2026
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Back Face: Postcard Hand-drawn Mail Grid */
                    <div className="h-full flex flex-col justify-between p-6 sm:p-8 min-h-[380px] text-stone-200 font-serif">
                      <div className="flex justify-between items-start border-b border-stone-700 pb-4">
                        <div>
                          <h4 className="text-sm font-bold tracking-widest text-amber-300 uppercase">
                            NORDIC ARCTIC POSTCARD
                          </h4>
                          <span className="text-[10px] text-stone-400 font-mono">
                            Official Santa Claus Post Office Mail
                          </span>
                        </div>
                        <div className="w-16 h-18 border-2 border-stone-600 rounded-lg p-1.5 flex flex-col items-center justify-center text-center">
                          <span className="text-xl">🎅</span>
                          <span className="text-[8px] font-mono text-stone-400 mt-1">
                            POSTAGE PAID
                          </span>
                        </div>
                      </div>

                      {/* Hand written message section */}
                      <div className="grid grid-cols-2 gap-6 my-4">
                        <div className="border-r border-stone-700 pr-4 text-xs leading-relaxed text-stone-300 italic">
                          Dear {recipient},
                          <br />
                          {customMessage}
                          <br />
                          <span className="block mt-4 text-right font-bold text-amber-300">
                            — {sender}
                          </span>
                        </div>

                        <div className="space-y-4 pt-4">
                          <div className="border-b border-stone-700 pb-1 text-xs text-stone-400">
                            Recipient: {recipient}
                          </div>
                          <div className="border-b border-stone-700 pb-1 text-xs text-stone-400">
                            Address: Planet Earth 🌍
                          </div>
                          <div className="border-b border-stone-700 pb-1 text-xs text-stone-400">
                            Nordic Odyssey 2026-2027
                          </div>
                        </div>
                      </div>

                      <div className="text-[10px] text-stone-500 font-mono text-center pt-2">
                        SANTA CLAUS MAIN POST OFFICE · 96930 ROVANIEMI, ARCTIC CIRCLE
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick Share Actions */}
                <div className="w-full flex items-center justify-center gap-3 mt-4">
                  <button
                    onClick={handleCopyCard}
                    className="flex-1 py-2.5 bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-1.5"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedToast ? '✅ 已複製賀卡文字！' : '複製賀卡內容與祝福'}</span>
                  </button>

                  {onSelectDay && (
                    <button
                      onClick={() => {
                        onSelectDay(currentTemplate.dayNum);
                        onClose();
                      }}
                      className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors flex items-center gap-1.5"
                    >
                      <Compass className="w-3.5 h-3.5 text-emerald-400" />
                      <span>查看第 {currentTemplate.dayNum} 天行程</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Right Column: Card Customization Controls */}
              <div className="lg:col-span-5 space-y-4 bg-slate-950/80 border border-slate-800 p-5 rounded-3xl">
                <h4 className="text-sm font-serif font-bold text-amber-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>自訂賀卡內容</span>
                </h4>

                {/* Recipient & Sender Inputs */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-mono text-slate-400 block mb-1">
                      收件人姓名 (To:)
                    </label>
                    <input
                      type="text"
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                      placeholder="親愛的朋友..."
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-slate-400 block mb-1">
                      寄件人署名 (From:)
                    </label>
                    <input
                      type="text"
                      value={sender}
                      onChange={(e) => setSender(e.target.value)}
                      placeholder="北歐旅人..."
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-400"
                    />
                  </div>
                </div>

                {/* Stamp Style Selector */}
                <div>
                  <label className="text-[10px] font-mono text-slate-400 block mb-1.5">
                    選擇專屬實體感郵戳印章：
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {STAMP_STYLES.map((st) => (
                      <button
                        key={st.id}
                        onClick={() => setSelectedStamp(st.id)}
                        className={`p-2 rounded-xl text-center border text-[10px] font-semibold transition-all ${
                          selectedStamp === st.id
                            ? 'bg-amber-500/20 text-amber-300 border-amber-400 shadow-md'
                            : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                        }`}
                      >
                        <span className="text-base block mb-0.5">{st.icon}</span>
                        <span className="truncate block">{st.label.split(' ')[0]}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Message Customization */}
                <div>
                  <label className="text-[10px] font-mono text-slate-400 block mb-1">
                    聖誕祝福語編輯：
                  </label>
                  <textarea
                    rows={4}
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-hidden focus:border-amber-400 resize-none font-sans leading-relaxed"
                  />
                </div>

                {/* Preset Messages Quick Selector */}
                <div>
                  <label className="text-[10px] font-mono text-slate-400 block mb-1">
                    快速套用聖誕經典祝福語：
                  </label>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-700">
                    {PRESET_MESSAGES.map((msg, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCustomMessage(msg)}
                        className="w-full text-left p-2 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-[11px] text-slate-300 hover:text-white transition-colors truncate block"
                      >
                        {msg}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Community Holiday Wish Wall (聖誕心願留言板) */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">
                    HOLIDAY WISH BOARD
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    旅伴心願牆
                  </span>
                </div>
                <h3 className="text-xl font-serif font-bold text-white mt-1">
                  寫下你的北歐聖誕心願
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-sans">
                願北歐夜空的流星與極光聽見所有祝福
              </span>
            </div>

            {/* Input Form for New Wish */}
            <form onSubmit={handlePostWish} className="flex items-center gap-2">
              <input
                type="text"
                value={newWishInput}
                onChange={(e) => setNewWishInput(e.target.value)}
                placeholder="寫下你的聖誕或跨年心願（例如：希望在特羅姆瑟看見綠色與紫色極光爆發！）..."
                className="flex-1 bg-slate-900 border border-slate-700 rounded-2xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-400"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-bold text-xs rounded-2xl shadow-lg transition-all shrink-0 flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>發布心願</span>
              </button>
            </form>

            {/* Wishes Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {wishes.map((w) => (
                <div
                  key={w.id}
                  className="bg-slate-900 border border-slate-800 hover:border-amber-500/40 p-4 rounded-2xl shadow-md transition-all flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1.5">
                      <span className="flex items-center gap-1">
                        <span>{w.flag}</span>
                        <span className="font-bold text-amber-300">{w.sender}</span>
                        <span>➔</span>
                        <span>{w.recipient}</span>
                      </span>
                      <span className="font-mono">{w.time}</span>
                    </div>
                    <p className="text-xs text-slate-200 font-serif leading-relaxed">
                      “{w.message}”
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                    <span className="truncate max-w-[140px] text-slate-500">
                      {w.templateTitle.split('官方')[0]}
                    </span>
                    <button
                      onClick={() => handleLikeWish(w.id)}
                      className="flex items-center gap-1 text-rose-400 hover:text-rose-300 font-semibold transition-colors"
                    >
                      <Heart className="w-3.5 h-3.5 fill-current" />
                      <span>{w.likes}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
