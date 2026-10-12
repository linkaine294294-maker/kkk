import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Clock,
  PartyPopper,
  X,
  Volume2,
  VolumeX,
  Calendar,
  Flame,
  Award,
  Compass,
  Wine,
} from 'lucide-react';
import { SafeImage } from './SafeImage';

interface NewYearCountdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDay?: (day: number) => void;
}

export const NewYearCountdownModal: React.FC<NewYearCountdownModalProps> = ({
  isOpen,
  onClose,
  onSelectDay,
}) => {
  // Target: 2027 New Year Midnight (2027-01-01 00:00:00)
  const targetTime = new Date('2027-01-01T00:00:00').getTime();

  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    millis: number;
  }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    millis: 0,
  });

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'countdown' | 'traditions' | 'cheers'>('countdown');

  // Update countdown every 50ms for smooth millisecond animation
  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = Math.max(0, targetTime - now);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      const millis = Math.floor((diff % 1000) / 10);

      setTimeLeft({ days, hours, minutes, seconds, millis });
    }, 50);

    return () => clearInterval(interval);
  }, [isOpen, targetTime]);

  const playChime = () => {
    if (!soundEnabled) return;
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const freqs = [523.25, 659.25, 783.99, 1046.5, 1318.51];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
        gain.gain.setValueAtTime(0.06, ctx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.6);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.08);
        osc.stop(ctx.currentTime + idx * 0.08 + 0.65);
      });
    } catch {
      // Audio playback fallback
    }
  };

  const handleFireworkToast = () => {
    playChime();
    setToastMessage('🎆 碰！願 2027 新年大家平安喜樂、北歐極光願望全部實現！✨');
    setTimeout(() => setToastMessage(null), 4000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl my-auto bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border border-amber-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Gold & Red Holiday Top Trim */}
        <div className="h-1 bg-gradient-to-r from-amber-400 via-rose-500 via-emerald-400 to-amber-400" />

        {/* Close & Sound Buttons */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 bg-slate-950/80 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white rounded-full transition-colors"
            title={soundEnabled ? '靜音' : '開啟音效'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>
          <button
            onClick={onClose}
            className="p-2 bg-slate-950/80 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white rounded-full transition-colors"
            aria-label="關閉"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Header Hero */}
        <div className="relative p-6 sm:p-8 overflow-hidden bg-gradient-to-br from-indigo-950/60 via-purple-950/30 to-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest mb-2">
            <Sparkles className="w-4 h-4 animate-spin text-amber-400" />
            <span>Nordic 2027 New Year Celebration</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-serif font-black text-white tracking-tight flex items-center gap-3">
            <span>2027 北歐極境跨年倒數</span>
            <PartyPopper className="w-6 h-6 text-amber-400" />
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-xl leading-relaxed">
            北歐跨年是全球最壯麗的慶典之一！第12天與第13天我們將在冰島雷克雅維克迎接跨年午夜，全城數千朵煙火照亮冰封海港與極光夜空。
          </p>

          {/* Navigation Tabs inside modal */}
          <div className="flex items-center gap-2 mt-5">
            <button
              onClick={() => setActiveTab('countdown')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'countdown'
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-lg shadow-amber-400/20'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              ⏱️ 實時倒數鐘
            </button>
            <button
              onClick={() => setActiveTab('traditions')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'traditions'
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-lg shadow-amber-400/20'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              🌍 北歐五國跨年傳統
            </button>
            <button
              onClick={() => setActiveTab('cheers')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'cheers'
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-lg shadow-amber-400/20'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              🥂 跨年狂歡指南
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto no-scrollbar">
          {activeTab === 'countdown' && (
            <>
              {/* Massive Modern Luxury Ticker Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4 text-center">
                {/* Days */}
                <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-amber-500/30 rounded-2xl p-4 shadow-xl relative overflow-hidden group">
                  <div className="absolute top-0 inset-x-0 h-0.5 bg-amber-400" />
                  <span className="text-3xl sm:text-5xl font-mono font-black text-amber-400 tracking-tight block">
                    {String(timeLeft.days).padStart(2, '0')}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-1 block">
                    天 (DAYS)
                  </span>
                </div>

                {/* Hours */}
                <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-700 rounded-2xl p-4 shadow-xl relative overflow-hidden">
                  <span className="text-3xl sm:text-5xl font-mono font-black text-white tracking-tight block">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-1 block">
                    小時 (HOURS)
                  </span>
                </div>

                {/* Minutes */}
                <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-700 rounded-2xl p-4 shadow-xl relative overflow-hidden">
                  <span className="text-3xl sm:text-5xl font-mono font-black text-white tracking-tight block">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-1 block">
                    分鐘 (MINS)
                  </span>
                </div>

                {/* Seconds */}
                <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-rose-500/40 rounded-2xl p-4 shadow-xl relative overflow-hidden">
                  <span className="text-3xl sm:text-5xl font-mono font-black text-rose-400 tracking-tight block">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-1 block">
                    秒 (SECS)
                  </span>
                </div>

                {/* Milliseconds */}
                <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-emerald-500/40 rounded-2xl p-4 shadow-xl relative overflow-hidden col-span-2 sm:col-span-1">
                  <span className="text-3xl sm:text-5xl font-mono font-black text-emerald-400 tracking-tight block">
                    {String(timeLeft.millis).padStart(2, '0')}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-1 block">
                    毫秒 (MS)
                  </span>
                </div>
              </div>

              {/* Toast Message */}
              {toastMessage && (
                <div className="p-4 rounded-2xl bg-amber-400/20 border border-amber-400 text-amber-200 text-xs sm:text-sm font-bold text-center animate-bounce shadow-xl">
                  {toastMessage}
                </div>
              )}

              {/* Spectacular Fireworks Visual Preview */}
              <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
                <SafeImage
                  src="https://upload.wikimedia.org/wikipedia/commons/2/26/NewYearFireworks-Reykjavik.jpg"
                  alt="北歐雷克雅維克跨年煙火"
                  aspectRatioClass="aspect-21/9"
                  className="w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex flex-col justify-end p-5">
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                      <span className="text-xs text-amber-400 font-bold uppercase tracking-wider block">
                        Day 12 & 13 冰島特別行程
                      </span>
                      <h3 className="text-lg font-serif font-bold text-white">
                        雷克雅維克全城跨年煙火與極光守候夜
                      </h3>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleFireworkToast}
                        className="px-4 py-2 bg-gradient-to-r from-amber-400 to-rose-500 hover:from-amber-300 hover:to-rose-400 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-amber-500/25 flex items-center gap-1.5 transition-transform hover:scale-105 active:scale-95"
                      >
                        <Flame className="w-4 h-4 text-slate-950" />
                        <span>點燃慶祝煙火</span>
                      </button>

                      {onSelectDay && (
                        <button
                          onClick={() => {
                            onClose();
                            onSelectDay(12);
                          }}
                          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-xs border border-slate-700 transition-colors"
                        >
                          查看 Day 12 行程
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'traditions' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Iceland */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white flex items-center gap-1.5">
                    <span>🇮🇸 冰島：萬眾篝火與自發煙火秀</span>
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 font-mono">
                    Brenna
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  冰島在跨年夜不設官方煙火，而是家家戶戶自發採購數百萬顆煙火！晚上8點全城點燃巨大的海邊篝火（Brenna），午夜12點整個雷克雅維克天空被幾萬發璀璨煙火點亮。
                </p>
              </div>

              {/* Denmark */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white flex items-center gap-1.5">
                    <span>🇩🇰 丹麥：從椅子上跳入新年</span>
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 font-mono">
                    Hoppe ind
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  丹麥人在午夜鐘聲敲響最後一秒前，會全員站上椅子或沙發，在整點瞬間一起「跳到地面」，象徵跨過舊年晦氣，躍入嶄新吉祥的一年！並享用經典杏仁年輪塔蛋糕（Kransekage）。
                </p>
              </div>

              {/* Sweden */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white flex items-center gap-1.5">
                    <span>🇸🇪 瑞典：斯堪森朗誦新年鐘聲</span>
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-mono">
                    Nyårsklockan
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  瑞典全國自1897年起由國家電視台現場直播斯德哥爾摩斯堪森公園（Skansen）朗誦《丁冬新年鐘聲》（Ring Out, Wild Bells），全家圍著暖爐倒數並在王宮水岸施放煙火。
                </p>
              </div>

              {/* Finland */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white flex items-center gap-1.5">
                    <span>🇫🇮 芬蘭：融錫占卜新年運勢</span>
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono">
                    Uudenvuodentina
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  芬蘭人在跨年夜會將馬蹄形錫塊（或特製環保糖）在勺子中融化後迅速倒入冷水中，觀察冷卻後奇異形狀在燭光下的陰影，預測來年是否會迎來愛情、財富或長途旅行。
                </p>
              </div>
            </div>
          )}

          {activeTab === 'cheers' && (
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <div className="flex items-center gap-2">
                <Wine className="w-5 h-5 text-amber-400" />
                <h4 className="text-base font-serif font-bold text-white">
                  行程跨年派對小錦囊
                </h4>
              </div>

              <ul className="text-xs text-slate-300 space-y-2.5 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold">1.</span>
                  <span><strong>穿著極地保暖裝備：</strong>雷克雅維克跨年夜氣溫約 -2°C 至 -8°C，海風強勁，請務必著防風防水外套、羊毛內層、防滑雪靴與防風手套。</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold">2.</span>
                  <span><strong>最佳觀景點：</strong>哈爾格林姆教堂（Hallgrímskirkja）前方廣場、珍珠樓（Perlan）觀景台，或下榻的 The Reykjavik EDITION 頂樓景觀酒吧。</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold">3.</span>
                  <span><strong>香檳與氣泡酒禮儀：</strong>北歐敬酒時習慣直視彼此眼睛，大聲說出「Skål！」（發音為 Skawl），象徵誠摯與友誼長存。</span>
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            北歐跨年特輯 · 2026-12-20 至 2027-01-03
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-xs transition-colors"
          >
            返回行程
          </button>
        </div>
      </div>
    </div>
  );
};
