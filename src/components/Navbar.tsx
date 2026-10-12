import React, { useState, useRef, useEffect } from 'react';
import {
  Compass,
  Search,
  Share2,
  Calendar,
  Sparkles,
  Camera,
  Sun,
  Moon,
  CloudSnow,
  Gift,
  PartyPopper,
  Film,
  Gamepad2,
  Menu,
  X,
  ChevronDown,
  MapPin,
  Flame,
  Swords,
} from 'lucide-react';

interface NavbarProps {
  currentTab: 'cover' | 'overview' | 'day' | 'calendar' | 'map' | 'album';
  onSelectTab: (tab: 'cover' | 'overview' | 'day' | 'calendar' | 'map' | 'album') => void;
  onOpenSearch: () => void;
  onOpenAddSpot?: () => void;
  onOpenDataManage: () => void;
  onOpenCredits: () => void;
  onOpenWeather: () => void;
  onOpenCountdown: () => void;
  onOpenChristmasCard: () => void;
  onOpenSouvenirs: () => void;
  onOpenVideos?: () => void;
  onOpenGames?: () => void;
  onOpenReindeerRpg?: () => void;
  onReplayTrain?: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onOpenSearch,
  onOpenDataManage,
  onOpenCredits,
  onOpenWeather,
  onOpenCountdown,
  onOpenChristmasCard,
  onOpenSouvenirs,
  onOpenVideos,
  onOpenGames,
  onOpenReindeerRpg,
  onReplayTrain,
  isDarkMode,
  onToggleTheme,
}) => {
  const [isDiscoverOpen, setIsDiscoverOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const discoverRef = useRef<HTMLDivElement>(null);

  // Close discover dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (discoverRef.current && !discoverRef.current.contains(event.target as Node)) {
        setIsDiscoverOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-slate-950/90 border-b border-slate-800/80 transition-all select-none print:hidden">
      {/* Subtle Aurora Gradient Top Accent Line */}
      <div className="h-0.5 bg-gradient-to-r from-cyan-500 via-emerald-400 via-amber-400 to-purple-500 opacity-80" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* 1. Brand Logo */}
        <button
          onClick={() => onSelectTab('cover')}
          className="text-left flex items-center gap-2 group cursor-pointer shrink-0"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-950/40 group-hover:scale-105 transition-transform">
            <span className="text-sm">❄️</span>
          </div>
          <div>
            <div className="text-sm sm:text-base font-serif font-black tracking-tight text-white group-hover:text-emerald-400 transition-colors flex items-center gap-1.5">
              <span>北歐奢華極境之旅</span>
              <span className="text-[10px] font-mono font-bold text-amber-300 px-1.5 py-0.2 rounded bg-amber-400/15 border border-amber-400/30">
                15 DAYS
              </span>
            </div>
            <span className="text-[10px] text-slate-400 block font-mono">
              聖誕 · 跨年 · 極光 · 玻璃屋
            </span>
          </div>
        </button>

        {/* 2. Primary Navigation Links (Desktop - Uncluttered) */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-xs sm:text-sm font-medium">
          <button
            onClick={() => onSelectTab('cover')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              currentTab === 'cover'
                ? 'bg-slate-800 text-emerald-400 font-bold shadow-inner'
                : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            首頁
          </button>

          <button
            onClick={() => onSelectTab('overview')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              currentTab === 'overview'
                ? 'bg-slate-800 text-emerald-400 font-bold shadow-inner'
                : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            <span>行程總覽</span>
            <span className="text-[10px] font-mono px-1 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
              統計 & 預算
            </span>
          </button>

          <button
            onClick={() => onSelectTab('day')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              currentTab === 'day'
                ? 'bg-slate-800 text-emerald-400 font-bold shadow-inner'
                : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            每日日程
          </button>

          <button
            onClick={() => onSelectTab('map')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              currentTab === 'map'
                ? 'bg-slate-800 text-emerald-400 font-bold shadow-inner'
                : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            五國地圖
          </button>

          <button
            onClick={() => onSelectTab('album')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              currentTab === 'album'
                ? 'bg-slate-800 text-emerald-400 font-bold shadow-inner'
                : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Camera className="w-3.5 h-3.5 text-emerald-400" />
            <span>共享相簿</span>
          </button>

          {/* 3. Discover Features Dropdown (Combines all secondary holiday tools neatly) */}
          <div className="relative" ref={discoverRef}>
            <button
              onClick={() => setIsDiscoverOpen(!isDiscoverOpen)}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 border ${
                isDiscoverOpen
                  ? 'bg-slate-800 text-amber-300 border-amber-400/40 shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900 border-transparent'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>探索工坊</span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                  isDiscoverOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {isDiscoverOpen && (
              <div className="absolute top-full mt-2 left-0 w-80 bg-slate-950/95 border border-slate-800/90 rounded-2xl shadow-2xl p-2.5 backdrop-blur-2xl animate-in fade-in slide-in-from-top-2 z-50">
                <div className="px-3 py-2 border-b border-slate-800/80 mb-1 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-400">DISCOVER & WORKSHOP</span>
                  <span className="text-[10px] text-amber-300 font-bold">極地特色體驗</span>
                </div>

                <div className="grid grid-cols-1 gap-1">
                  {/* Viking Chess Game */}
                  {onOpenGames && (
                    <button
                      onClick={() => {
                        setIsDiscoverOpen(false);
                        onOpenGames();
                      }}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-slate-900 flex items-center gap-3 transition-colors group cursor-pointer"
                    >
                      <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
                        <Swords className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white group-hover:text-amber-300 flex items-center gap-1">
                          <span>維京突圍棋 (Hnefatafl)</span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 border border-amber-800">
                            11×11 國王棋
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400">
                          千年日耳曼與斯堪地那維亞古老雙人對弈棋藝
                        </p>
                      </div>
                    </button>
                  )}

                  {/* Nordic Aurora Saga RPG */}
                  {onOpenReindeerRpg && (
                    <button
                      onClick={() => {
                        setIsDiscoverOpen(false);
                        onOpenReindeerRpg();
                      }}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-slate-900 flex items-center gap-3 transition-colors group cursor-pointer"
                    >
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
                        <span className="text-base">⚔️</span>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white group-hover:text-emerald-300 flex items-center gap-1">
                          <span>《北境極光傳奇：五國神話紀元》</span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                            史詩傳奇
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400">
                          北歐五國神話探索、地標故事圖鑑與詠唱彈幕 BOSS 決戰
                        </p>
                      </div>
                    </button>
                  )}

                  {/* Travel Videos */}
                  {onOpenVideos && (
                    <button
                      onClick={() => {
                        setIsDiscoverOpen(false);
                        onOpenVideos();
                      }}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-slate-900 flex items-center gap-3 transition-colors group cursor-pointer"
                    >
                      <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0">
                        <Film className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white group-hover:text-cyan-300">
                          旅遊地點 4K 實境影音
                        </div>
                        <p className="text-[10px] text-slate-400">
                          五國代表性景觀與極光縮時微短片
                        </p>
                      </div>
                    </button>
                  )}

                  {/* Christmas Card & Countdown */}
                  <button
                    onClick={() => {
                      setIsDiscoverOpen(false);
                      onOpenChristmasCard();
                    }}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-slate-900 flex items-center gap-3 transition-colors group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center shrink-0">
                      <Gift className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-rose-300">
                        聖誕賀卡工坊 & 倒數
                      </div>
                      <p className="text-[10px] text-slate-400">
                        客製化極光賀卡與平安夜倒數鐘
                      </p>
                    </div>
                  </button>

                  {/* New Year Countdown */}
                  <button
                    onClick={() => {
                      setIsDiscoverOpen(false);
                      onOpenCountdown();
                    }}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-slate-900 flex items-center gap-3 transition-colors group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center shrink-0">
                      <PartyPopper className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-purple-300">
                        2027 冰島跨年全城煙火
                      </div>
                      <p className="text-[10px] text-slate-400">
                        雷克雅維克百萬煙火盛況與跨年攻略
                      </p>
                    </div>
                  </button>

                  {/* Souvenirs */}
                  <button
                    onClick={() => {
                      setIsDiscoverOpen(false);
                      onOpenSouvenirs();
                    }}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-slate-900 flex items-center gap-3 transition-colors group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-amber-300">
                        五國必買紀念品特產
                      </div>
                      <p className="text-[10px] text-slate-400">
                        羊毛織品、皇家瓷器、極地選品清單
                      </p>
                    </div>
                  </button>

                  {/* Calendar & Weather Row */}
                  <div className="grid grid-cols-2 gap-1.5 pt-1.5 border-t border-slate-800/80">
                    <button
                      onClick={() => {
                        setIsDiscoverOpen(false);
                        onSelectTab('calendar');
                      }}
                      className="p-2 rounded-lg bg-slate-900 hover:bg-slate-850 text-left flex items-center gap-2 cursor-pointer"
                    >
                      <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                      <span className="text-[11px] text-slate-300 font-medium">行程日曆</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsDiscoverOpen(false);
                        onOpenWeather();
                      }}
                      className="p-2 rounded-lg bg-slate-900 hover:bg-slate-850 text-left flex items-center gap-2 cursor-pointer"
                    >
                      <CloudSnow className="w-3.5 h-3.5 text-sky-400" />
                      <span className="text-[11px] text-slate-300 font-medium">極圈氣象</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* 4. Right Utility Cluster */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Quick Search */}
          <button
            onClick={onOpenSearch}
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-900 rounded-xl transition-colors cursor-pointer"
            title="搜尋景點 (快捷鍵 /)"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Train Replay Button */}
          {onReplayTrain && (
            <button
              onClick={onReplayTrain}
              className="p-2 text-amber-300 hover:text-amber-200 hover:bg-slate-900 rounded-xl transition-transform hover:scale-110 cursor-pointer hidden sm:block"
              title="重播北極特快車開場動畫"
            >
              <span className="text-base leading-none">🚂</span>
            </button>
          )}

          {/* Backup / Share */}
          <button
            onClick={onOpenDataManage}
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-900 rounded-xl transition-colors cursor-pointer hidden sm:block"
            title="匯入 / 匯出備份行程資料"
          >
            <Share2 className="w-4 h-4" />
          </button>

          {/* Dark / Light Toggle */}
          <button
            onClick={onToggleTheme}
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-900 rounded-xl transition-colors cursor-pointer"
            title={isDarkMode ? '切換淺色模式' : '切換深色模式'}
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-900 rounded-xl transition-colors cursor-pointer lg:hidden"
            title="展開選單"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* 5. Mobile Full-Width Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-slate-950/98 backdrop-blur-2xl px-4 py-5 space-y-4 animate-in fade-in">
          {/* Main Navigation Segment Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                onSelectTab('cover');
                setIsMobileMenuOpen(false);
              }}
              className={`p-3 rounded-xl text-xs font-bold text-left transition-all ${
                currentTab === 'cover'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-slate-900 text-slate-300'
              }`}
            >
              🏛️ 封面首頁
            </button>

            <button
              onClick={() => {
                onSelectTab('overview');
                setIsMobileMenuOpen(false);
              }}
              className={`p-3 rounded-xl text-xs font-bold text-left transition-all ${
                currentTab === 'overview'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-slate-900 text-slate-300'
              }`}
            >
              📊 行程總覽 & 預算
            </button>

            <button
              onClick={() => {
                onSelectTab('day');
                setIsMobileMenuOpen(false);
              }}
              className={`p-3 rounded-xl text-xs font-bold text-left transition-all ${
                currentTab === 'day'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-slate-900 text-slate-300'
              }`}
            >
              📅 每日時刻表
            </button>

            <button
              onClick={() => {
                onSelectTab('map');
                setIsMobileMenuOpen(false);
              }}
              className={`p-3 rounded-xl text-xs font-bold text-left transition-all ${
                currentTab === 'map'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-slate-900 text-slate-300'
              }`}
            >
              🗺️ 五國地圖
            </button>

            <button
              onClick={() => {
                onSelectTab('album');
                setIsMobileMenuOpen(false);
              }}
              className={`p-3 rounded-xl text-xs font-bold text-left transition-all ${
                currentTab === 'album'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-slate-900 text-slate-300'
              }`}
            >
              📸 共享相簿
            </button>

            <button
              onClick={() => {
                onSelectTab('calendar');
                setIsMobileMenuOpen(false);
              }}
              className={`p-3 rounded-xl text-xs font-bold text-left transition-all ${
                currentTab === 'calendar'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-slate-900 text-slate-300'
              }`}
            >
              📆 行程日曆
            </button>
          </div>

          {/* Quick Discover Workshop Tools */}
          <div className="pt-2 border-t border-slate-800">
            <span className="text-[11px] font-mono text-slate-400 block mb-2">
              探索工坊 & 互動功能
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {onOpenGames && (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenGames();
                  }}
                  className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 text-left flex items-center gap-2 text-slate-200"
                >
                  <Swords className="w-3.5 h-3.5 text-amber-400" />
                  <span>維京突圍棋</span>
                </button>
              )}

              {onOpenReindeerRpg && (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenReindeerRpg();
                  }}
                  className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 text-left flex items-center gap-2 text-slate-200"
                >
                  <span>⚔️</span>
                  <span>北境極光傳奇</span>
                </button>
              )}

              {onOpenVideos && (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenVideos();
                  }}
                  className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 text-left flex items-center gap-2 text-slate-200"
                >
                  <Film className="w-3.5 h-3.5 text-cyan-400" />
                  <span>4K 旅遊影片</span>
                </button>
              )}

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenChristmasCard();
                }}
                className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 text-left flex items-center gap-2 text-slate-200"
              >
                <Gift className="w-3.5 h-3.5 text-rose-400" />
                <span>聖誕賀卡工坊</span>
              </button>

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenCountdown();
                }}
                className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 text-left flex items-center gap-2 text-slate-200"
              >
                <PartyPopper className="w-3.5 h-3.5 text-purple-400" />
                <span>2027 跨年煙火</span>
              </button>

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenSouvenirs();
                }}
                className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 text-left flex items-center gap-2 text-slate-200"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>必買紀念品</span>
              </button>

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenWeather();
                }}
                className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 text-left flex items-center gap-2 text-slate-200"
              >
                <CloudSnow className="w-3.5 h-3.5 text-sky-400" />
                <span>極地天氣</span>
              </button>

              {onReplayTrain && (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onReplayTrain();
                  }}
                  className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 text-left flex items-center gap-2 text-slate-200"
                >
                  <span>🚂</span>
                  <span>重播進站動畫</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
