import React, { useState, useEffect, useRef } from 'react';
import { Spot, DayPlan, CountryName } from './types/itinerary';
import { DEFAULT_SPOTS, DAY_PLANS } from './data/defaultItinerary';
import { Navbar } from './components/Navbar';
import { CoverHero } from './components/CoverHero';
import { DayOverviewCard } from './components/DayOverviewCard';
import { DailyItineraryView } from './components/DailyItineraryView';
import { FullMapView } from './components/FullMapView';
import { SpotDetailModal } from './components/SpotDetailModal';
import { SpotEditorModal } from './components/SpotEditorModal';
import { ImageCreditsModal } from './components/ImageCreditsModal';
import { SearchModal } from './components/SearchModal';
import { DataManageModal } from './components/DataManageModal';
import { YorushikaPlayer } from './components/YorushikaPlayer';
import { WeatherModal } from './components/WeatherWidget';
import { SnowfallCanvas } from './components/SnowfallCanvas';
import { InteractiveChristmasScene } from './components/InteractiveChristmasScene';
import { PhotoAlbumView } from './components/PhotoAlbumView';
import { HotelDiningGuide } from './components/HotelDiningGuide';
import { TripCalendarView } from './components/TripCalendarView';
import { NewYearCountdownModal } from './components/NewYearCountdownModal';
import { ChristmasCardModal } from './components/ChristmasCardModal';
import { NordicSouvenirsModal } from './components/NordicSouvenirsModal';
import { HotelDiningDetailModal } from './components/HotelDiningDetailModal';
import { PolarExpressIntro } from './components/PolarExpressIntro';
import { DestinationVideosModal } from './components/DestinationVideosModal';
import { NordicFolkGamesModal } from './components/NordicFolkGamesModal';
import { BudgetTrackerView } from './components/BudgetTrackerView';
import { ItineraryPopularityDashboard } from './components/ItineraryPopularityDashboard';
import { PolarExpressReindeerRpgModal } from './components/PolarExpressReindeerRpgModal';
import {
  Compass,
  Calendar,
  Sparkles,
  MapPin,
  Filter,
  Layers,
  ArrowRight,
  Share2,
  PlusCircle,
  HelpCircle,
  Camera,
  UtensilsCrossed,
  Gift,
  PartyPopper,
} from 'lucide-react';

const STORAGE_KEY = 'nordic_trip_spots_v1';

export default function App() {
  // Load initial spots from LocalStorage or Default
  const [spots, setSpots] = useState<Spot[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Synchronize and update verified authentic images and dining/hotel recommendations
          return parsed.map((s: Spot) => {
            const defaultMatch = DEFAULT_SPOTS.find((ds) => ds.id === s.id);
            if (defaultMatch) {
              return {
                ...s,
                images: defaultMatch.images,
                hotelRecommendation: defaultMatch.hotelRecommendation || s.hotelRecommendation,
                diningRecommendation: defaultMatch.diningRecommendation || s.diningRecommendation,
              };
            }
            return s;
          });
        }
      }
    } catch (e) {
      console.warn('Failed to load saved spots from localStorage', e);
    }
    return DEFAULT_SPOTS;
  });

  // Navigation tab state: 'cover' | 'overview' | 'day' | 'calendar' | 'map' | 'album'
  const [currentTab, setCurrentTab] = useState<
    'cover' | 'overview' | 'day' | 'calendar' | 'map' | 'album'
  >('cover');
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [countryFilter, setCountryFilter] = useState<'全部' | CountryName>('全部');

  // Modals state
  const [selectedSpot, setSelectedSpot] = useState<Spot | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingSpot, setEditingSpot] = useState<Spot | null>(null);
  const [editorInitialDay, setEditorInitialDay] = useState<number>(1);
  const [editorInitialCoord, setEditorInitialCoord] = useState<{ lat: number; lng: number } | null>(null);

  const [isCreditsOpen, setIsCreditsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDataManageOpen, setIsDataManageOpen] = useState(false);
  const [isWeatherModalOpen, setIsWeatherModalOpen] = useState(false);
  const [weatherModalCity, setWeatherModalCity] = useState('copenhagen');

  // New Holiday & Luxury Feature Modals
  const [showPolarExpressIntro, setShowPolarExpressIntro] = useState(() => !sessionStorage.getItem('polar_express_intro_seen'));
  const [isCountdownOpen, setIsCountdownOpen] = useState(false);
  const [isChristmasCardOpen, setIsChristmasCardOpen] = useState(false);
  const [isSouvenirsOpen, setIsSouvenirsOpen] = useState(false);
  const [isVideosModalOpen, setIsVideosModalOpen] = useState(false);
  const [isGamesModalOpen, setIsGamesModalOpen] = useState(false);
  const [isReindeerRpgOpen, setIsReindeerRpgOpen] = useState(false);
  const [videosModalCountry, setVideosModalCountry] = useState<string | undefined>(undefined);
  const [hotelDiningDetailItem, setHotelDiningDetailItem] = useState<{
    type: 'hotel';
    data: any;
  } | {
    type: 'dining';
    data: any;
  } | null>(null);

  // Google Maps client quota defense state
  const [quotaExceeded, setQuotaExceeded] = useState(false);

  // Theme: default dark mode
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Save to localStorage whenever spots change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(spots));
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }
  }, [spots]);

  // Sync dark class on html root
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Edge Aurora & Starlight Particles Canvas Ref & System
  const edgeCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const edgeParticlesRef = useRef<Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    alpha: number;
    decay: number;
    color: string;
    rotation: number;
    vRot: number;
    spikeLength: number;
    hasCross: boolean;
  }>>([]);
  const edgePulsesRef = useRef<Array<{
    x: number;
    y: number;
    edge: 'top' | 'bottom' | 'left' | 'right';
    alpha: number;
    decay: number;
    color1: string;
    color2: string;
  }>>([]);

  // Listen to mousemove / touchmove on window and spawn edge starbursts & spectrum pulses
  useEffect(() => {
    const canvas = edgeCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const EDGE_THRESHOLD = 95; // pixels from screen border

    const spawnEdgeParticles = (clientX: number, clientY: number) => {
      const isLeft = clientX <= EDGE_THRESHOLD;
      const isRight = clientX >= width - EDGE_THRESHOLD;
      const isTop = clientY <= EDGE_THRESHOLD;
      const isBottom = clientY >= height - EDGE_THRESHOLD;

      if (!isLeft && !isRight && !isTop && !isBottom) return;

      const auroralPalette = [
        '#10b981', // Emerald
        '#06b6d4', // Neon Cyan
        '#a855f7', // Electric Violet
        '#fde047', // Champagne Gold
        '#ec4899', // Radiant Magenta
        '#ffffff', // Diamond White
      ];

      // Spawn 2-4 sparkling starburst particles
      const count = Math.floor(Math.random() * 3) + 2;
      for (let i = 0; i < count; i++) {
        const color = auroralPalette[Math.floor(Math.random() * auroralPalette.length)];
        // Slight drift towards screen interior
        const dirX = isLeft ? Math.random() * 1.5 + 0.2 : isRight ? -Math.random() * 1.5 - 0.2 : (Math.random() - 0.5) * 1.5;
        const dirY = isTop ? Math.random() * 1.5 + 0.2 : isBottom ? -Math.random() * 1.5 - 0.2 : (Math.random() - 0.5) * 1.5;

        edgeParticlesRef.current.push({
          x: clientX + (Math.random() * 24 - 12),
          y: clientY + (Math.random() * 24 - 12),
          vx: dirX,
          vy: dirY,
          size: Math.random() * 2.8 + 1.2,
          alpha: 1.0,
          decay: Math.random() * 0.025 + 0.015,
          color,
          rotation: Math.random() * Math.PI * 2,
          vRot: (Math.random() - 0.5) * 0.15,
          spikeLength: Math.random() * 10 + 6,
          hasCross: Math.random() > 0.35,
        });
      }

      // Limit particle array
      if (edgeParticlesRef.current.length > 85) {
        edgeParticlesRef.current.splice(0, edgeParticlesRef.current.length - 85);
      }

      // Add edge spectrum glow pulse
      if (Math.random() > 0.4) {
        const edgeName = isTop ? 'top' : isBottom ? 'bottom' : isLeft ? 'left' : 'right';
        edgePulsesRef.current.push({
          x: clientX,
          y: clientY,
          edge: edgeName,
          alpha: 0.85,
          decay: 0.022,
          color1: auroralPalette[Math.floor(Math.random() * 3)],
          color2: auroralPalette[Math.floor(Math.random() * 3) + 3],
        });

        if (edgePulsesRef.current.length > 25) {
          edgePulsesRef.current.shift();
        }
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      spawnEdgeParticles(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches && e.touches[0]) {
        spawnEdgeParticles(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    // Render loop for edge starlight & spectrum particles
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Render Edge Spectrum Glow Pulses
      const pulses = edgePulsesRef.current;
      for (let i = pulses.length - 1; i >= 0; i--) {
        const pulse = pulses[i];
        pulse.alpha -= pulse.decay;
        if (pulse.alpha <= 0) {
          pulses.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, pulse.alpha);

        let grad: CanvasGradient;
        if (pulse.edge === 'top') {
          grad = ctx.createRadialGradient(pulse.x, 0, 0, pulse.x, 0, 85);
        } else if (pulse.edge === 'bottom') {
          grad = ctx.createRadialGradient(pulse.x, height, 0, pulse.x, height, 85);
        } else if (pulse.edge === 'left') {
          grad = ctx.createRadialGradient(0, pulse.y, 0, 0, pulse.y, 85);
        } else {
          grad = ctx.createRadialGradient(width, pulse.y, 0, width, pulse.y, 85);
        }

        grad.addColorStop(0, pulse.color1);
        grad.addColorStop(0.5, pulse.color2);
        grad.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(pulse.x, pulse.y, 85, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 2. Render Edge Starburst Diffraction Cross Particles
      const particles = edgeParticlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.vRot;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;

        // Draw central core
        ctx.beginPath();
        ctx.arc(0, 0, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Draw Diffraction Cross Spikes
        if (p.hasCross) {
          ctx.strokeStyle = p.color;
          ctx.lineWidth = 1.0;
          ctx.beginPath();
          // Primary Cross
          ctx.moveTo(-p.spikeLength, 0);
          ctx.lineTo(p.spikeLength, 0);
          ctx.moveTo(0, -p.spikeLength);
          ctx.lineTo(0, p.spikeLength);
          // Secondary diagonal rays
          const diag = p.spikeLength * 0.45;
          ctx.moveTo(-diag, -diag);
          ctx.lineTo(diag, diag);
          ctx.moveTo(-diag, diag);
          ctx.lineTo(diag, -diag);
          ctx.stroke();
        }

        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  // Handler: Save spot (Add or Update)
  const handleSaveSpot = (spotData: Spot) => {
    setSpots((prev) => {
      const existsIndex = prev.findIndex((s) => s.id === spotData.id);
      if (existsIndex >= 0) {
        const updated = [...prev];
        updated[existsIndex] = spotData;
        return updated;
      } else {
        return [...prev, spotData];
      }
    });

    if (selectedSpot && selectedSpot.id === spotData.id) {
      setSelectedSpot(spotData);
    }
  };

  // Handler: Delete spot
  const handleDeleteSpot = (spotId: string) => {
    setSpots((prev) => prev.filter((s) => s.id !== spotId));
    if (selectedSpot && selectedSpot.id === spotId) {
      setSelectedSpot(null);
    }
  };

  // Handler: Move spot order within same day
  const handleMoveSpotOrder = (spotId: string, direction: 'up' | 'down') => {
    setSpots((prev) => {
      const targetSpot = prev.find((s) => s.id === spotId);
      if (!targetSpot) return prev;

      // Extract spots for that day
      const daySpots = prev.filter((s) => s.day === targetSpot.day);
      const otherSpots = prev.filter((s) => s.day !== targetSpot.day);

      const currentIndex = daySpots.findIndex((s) => s.id === spotId);
      if (currentIndex < 0) return prev;

      const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      if (targetIndex < 0 || targetIndex >= daySpots.length) return prev;

      const updatedDaySpots = [...daySpots];
      const [moved] = updatedDaySpots.splice(currentIndex, 1);
      updatedDaySpots.splice(targetIndex, 0, moved);

      // Recombine preserving relative order of other days
      const result: Spot[] = [];
      DAY_PLANS.forEach((dp) => {
        if (dp.dayNumber === targetSpot.day) {
          result.push(...updatedDaySpots);
        } else {
          result.push(...otherSpots.filter((s) => s.day === dp.dayNumber));
        }
      });

      return result;
    });
  };

  // Handler: Move spot to another day
  const handleMoveSpotToDay = (spotId: string, targetDay: number) => {
    setSpots((prev) =>
      prev.map((s) => (s.id === spotId ? { ...s, day: targetDay } : s))
    );
  };

  // Handler: Reset to default
  const handleResetToDefault = () => {
    setSpots(DEFAULT_SPOTS);
    localStorage.removeItem(STORAGE_KEY);
  };

  // Handler: Import spots from JSON
  const handleImportSpots = (newSpots: Spot[]) => {
    setSpots(newSpots);
  };

  // Open editor from map click
  const handleMapClickAddSpot = (lat: number, lng: number) => {
    setEditingSpot(null);
    setEditorInitialCoord({ lat, lng });
    setEditorInitialDay(selectedDay);
    setIsEditorOpen(true);
  };

  // Open editor for specific day
  const handleAddSpotToDay = (day: number) => {
    setEditingSpot(null);
    setEditorInitialCoord(null);
    setEditorInitialDay(day);
    setIsEditorOpen(true);
  };

  // Filter day plans by country
  const filteredDayPlans =
    countryFilter === '全部'
      ? DAY_PLANS
      : DAY_PLANS.filter((p) => p.country === countryFilter);

  const activeDayPlan = DAY_PLANS.find((p) => p.dayNumber === selectedDay) || DAY_PLANS[0];

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'} selection:bg-emerald-500 selection:text-white transition-colors duration-300 relative`}>
      {/* Google Maps Quota Warning Banner */}
      {quotaExceeded && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}

      {/* Top 3-Zone Navigation Bar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAddSpot={() => {
          setEditingSpot(null);
          setEditorInitialCoord(null);
          setEditorInitialDay(selectedDay);
          setIsEditorOpen(true);
        }}
        onOpenDataManage={() => setIsDataManageOpen(true)}
        onOpenCredits={() => setIsCreditsOpen(true)}
        onOpenWeather={() => {
          setWeatherModalCity(activeDayPlan.city);
          setIsWeatherModalOpen(true);
        }}
        onOpenCountdown={() => setIsCountdownOpen(true)}
        onOpenChristmasCard={() => setIsChristmasCardOpen(true)}
        onOpenSouvenirs={() => setIsSouvenirsOpen(true)}
        onOpenVideos={() => {
          setVideosModalCountry(undefined);
          setIsVideosModalOpen(true);
        }}
        onOpenGames={() => setIsGamesModalOpen(true)}
        onOpenReindeerRpg={() => setIsReindeerRpgOpen(true)}
        onReplayTrain={() => setShowPolarExpressIntro(true)}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Cover Tab */}
        {currentTab === 'cover' && (
          <div>
            <CoverHero
              onStartExploring={() => setCurrentTab('overview')}
              onOpenMap={() => setCurrentTab('map')}
              onOpenAlbum={() => setCurrentTab('album')}
              onOpenCountdown={() => setIsCountdownOpen(true)}
              onOpenChristmasCard={() => setIsChristmasCardOpen(true)}
              onOpenSouvenirs={() => setIsSouvenirsOpen(true)}
              onOpenVideos={() => {
                setVideosModalCountry(undefined);
                setIsVideosModalOpen(true);
              }}
              onOpenGames={() => setIsGamesModalOpen(true)}
              onOpenReindeerRpg={() => setIsReindeerRpgOpen(true)}
              onReplayTrain={() => setShowPolarExpressIntro(true)}
              onSelectDay={(dayNum) => {
                setSelectedDay(dayNum);
                setCurrentTab('day');
              }}
            />

            {/* Quick Preview of 15 Days Highlights below Hero */}
            <div className="space-y-6 pt-4">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-800 pb-4">
                <div>
                  <span className="text-xs font-semibold text-emerald-400 uppercase tracking-widest block mb-1">
                    JOURNEY HIGHLIGHTS
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                    十五日行程亮點速覽
                  </h2>
                </div>
                <button
                  onClick={() => setCurrentTab('overview')}
                  className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 self-start sm:self-auto group"
                >
                  <span>查看全部 15 天詳細時間軸</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* 3 Featured Days Highlights Bento Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {[
                  {
                    dayNum: 3,
                    title: '斯德哥爾摩 · 老城中世紀雪夜',
                    desc: '穿梭 Gamla Stan 鵝卵石窄巷與大廣場聖誕市集，暖熱格洛格香料酒香滿溢。',
                    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Stortorget_2006.jpg/1280px-Stortorget_2006.jpg',
                    hotel: 'Grand Hôtel Stockholm',
                  },
                  {
                    dayNum: 5,
                    title: '拉普蘭 · 玻璃穹頂極光冰屋',
                    desc: '世界知名 Kakslauttanen 玻璃屋，躺在溫暖大床仰望璀璨星空與綠色極光光幔。',
                    img: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=800&q=80',
                    hotel: 'Kakslauttanen Arctic Resort',
                  },
                  {
                    dayNum: 13,
                    title: '雷克雅維克 · 跨年夜百萬煙火',
                    desc: '間歇泉與黃金瀑布震撼巡禮，午夜見證全冰島人自發點亮夜空的壯麗跨年奇蹟！',
                    img: 'https://images.unsplash.com/photo-1529963183134-61a90db47eaf?auto=format&fit=crop&w=800&q=80',
                    hotel: 'The Reykjavik EDITION',
                  },
                ].map((item) => (
                  <div
                    key={item.dayNum}
                    onClick={() => {
                      setSelectedDay(item.dayNum);
                      setCurrentTab('day');
                    }}
                    className="group relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 hover:border-slate-700 cursor-pointer shadow-xl transition-all"
                  >
                    <div className="h-48 overflow-hidden bg-slate-950">
                      <img
                        src={item.img}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-5">
                      <div className="text-xs font-semibold text-emerald-400 mb-1">
                        DAY {item.dayNum} 精選亮點
                      </div>
                      <h3 className="text-lg font-serif font-bold text-white group-hover:text-emerald-300 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                        {item.desc}
                      </p>
                      <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                        <span>🏨 {item.hotel}</span>
                        <span className="text-emerald-400 font-medium group-hover:translate-x-1 transition-transform">
                          進入此天 →
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Itinerary Overview Tab */}
        {currentTab === 'overview' && (
          <div className="space-y-8">
            {/* Interactive Recharts Itinerary Popularity Dashboard */}
            <ItineraryPopularityDashboard
              spots={spots}
              onSelectSpot={(spot) => setSelectedSpot(spot)}
              onSelectDay={(dayNum) => {
                setSelectedDay(dayNum);
                setCurrentTab('day');
              }}
            />

            {/* Interactive Daily & Total Budget Consumption Tracker */}
            <BudgetTrackerView />

            {/* Header & Country Filter */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5 pt-2">
              <div>
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-widest block mb-1">
                  15-DAY COMPLETE ITINERARY
                </span>
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
                  北歐 15 天奢華聖誕跨年行程總覽
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  點擊任意天數卡片即可查看該日詳細時刻表、景點導航地圖與推薦住宿
                </p>
              </div>

              {/* Country Segmented Buttons */}
              <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto self-start md:self-auto">
                {(['全部', '丹麥', '瑞典', '芬蘭', '挪威', '冰島'] as const).map((country) => (
                  <button
                    key={country}
                    onClick={() => setCountryFilter(country)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                      countryFilter === country
                        ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {country}
                  </button>
                ))}
              </div>
            </div>

            {/* 15 Days Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredDayPlans.map((plan) => {
                const daySpots = spots.filter((s) => s.day === plan.dayNumber);
                return (
                  <DayOverviewCard
                    key={plan.dayNumber}
                    plan={plan}
                    spots={daySpots}
                    onClick={() => {
                      setSelectedDay(plan.dayNumber);
                      setCurrentTab('day');
                    }}
                    onOpenReindeerRpg={() => setIsReindeerRpgOpen(true)}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* Daily Schedule Tab */}
        {currentTab === 'day' && (
          <DailyItineraryView
            dayPlan={activeDayPlan}
            dayPlans={DAY_PLANS}
            spots={spots}
            allSpots={spots}
            onSelectDay={(dayNum) => setSelectedDay(dayNum)}
            onSpotSelect={(spot) => setSelectedSpot(spot)}
            onAddSpotToDay={handleAddSpotToDay}
            onEditSpot={(spot) => {
              setEditingSpot(spot);
              setIsEditorOpen(true);
            }}
            onDeleteSpot={handleDeleteSpot}
            onMoveSpotOrder={handleMoveSpotOrder}
            onMoveSpotToDay={handleMoveSpotToDay}
            onOpenWeatherModal={() => {
              setWeatherModalCity(activeDayPlan.city);
              setIsWeatherModalOpen(true);
            }}
            onInspectHotel={(hotel) => setHotelDiningDetailItem({ type: 'hotel', data: hotel })}
            onInspectDining={(dining) => setHotelDiningDetailItem({ type: 'dining', data: dining })}
            onOpenReindeerRpg={() => setIsReindeerRpgOpen(true)}
          />
        )}

        {/* Interactive Trip Calendar Tab */}
        {currentTab === 'calendar' && (
          <TripCalendarView
            dayPlans={DAY_PLANS}
            spots={spots}
            selectedDay={selectedDay}
            onSelectDay={(dayNum) => {
              setSelectedDay(dayNum);
              setCurrentTab('day');
            }}
            onOpenWeather={(city) => {
              setWeatherModalCity(city);
              setIsWeatherModalOpen(true);
            }}
          />
        )}

        {/* Detailed Map Tab */}
        {currentTab === 'map' && (
          <FullMapView
            spots={spots}
            dayPlans={DAY_PLANS}
            onSpotSelect={(spot) => setSelectedSpot(spot)}
            onMapClickAddSpot={handleMapClickAddSpot}
          />
        )}

        {/* Shared Photo Album Tab */}
        {currentTab === 'album' && (
          <PhotoAlbumView dayPlans={DAY_PLANS} />
        )}
      </main>

      {/* Spot Detail Modal with Lightbox */}
      <SpotDetailModal
        spot={selectedSpot}
        dayPlan={selectedSpot ? DAY_PLANS.find((p) => p.dayNumber === selectedSpot.day) : undefined}
        onClose={() => setSelectedSpot(null)}
        onEdit={(spot) => {
          setEditingSpot(spot);
          setIsEditorOpen(true);
        }}
        onDelete={(spotId) => handleDeleteSpot(spotId)}
        onOpenVideos={(country) => {
          setVideosModalCountry(country);
          setIsVideosModalOpen(true);
        }}
      />

      {/* Spot Add / Edit Modal */}
      <SpotEditorModal
        isOpen={isEditorOpen}
        onClose={() => {
          setIsEditorOpen(false);
          setEditingSpot(null);
          setEditorInitialCoord(null);
        }}
        onSave={handleSaveSpot}
        editingSpot={editingSpot}
        dayPlans={DAY_PLANS}
        initialDay={editorInitialDay}
        initialCoord={editorInitialCoord}
      />

      {/* Global Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        spots={spots}
        dayPlans={DAY_PLANS}
        onSelectSpot={(spot) => {
          setSelectedSpot(spot);
        }}
        onSelectDay={(dayNum) => {
          setSelectedDay(dayNum);
          setCurrentTab('day');
        }}
      />

      {/* Data Management / Export / Import JSON Modal */}
      <DataManageModal
        isOpen={isDataManageOpen}
        onClose={() => setIsDataManageOpen(false)}
        spots={spots}
        dayPlans={DAY_PLANS}
        onImportSpots={handleImportSpots}
        onResetToDefault={handleResetToDefault}
      />

      {/* 7-City Weather Forecast & Aurora Modal */}
      <WeatherModal
        isOpen={isWeatherModalOpen}
        onClose={() => setIsWeatherModalOpen(false)}
        initialCity={weatherModalCity}
      />

      {/* 2027 New Year Countdown & Fireworks Modal */}
      <NewYearCountdownModal
        isOpen={isCountdownOpen}
        onClose={() => setIsCountdownOpen(false)}
        onSelectDay={(dayNum) => {
          setSelectedDay(dayNum);
          setCurrentTab('day');
        }}
      />

      {/* Nordic Lapland Christmas Eve Countdown & Postcard Studio Modal */}
      <ChristmasCardModal
        isOpen={isChristmasCardOpen}
        onClose={() => setIsChristmasCardOpen(false)}
        onSelectDay={(dayNum) => {
          setSelectedDay(dayNum);
          setCurrentTab('day');
        }}
      />

      {/* Nordic 5-Country Souvenirs & Specialties Modal */}
      <NordicSouvenirsModal
        isOpen={isSouvenirsOpen}
        onClose={() => setIsSouvenirsOpen(false)}
      />

      {/* 4K Nordic Destination Videos Showcase Modal */}
      <DestinationVideosModal
        isOpen={isVideosModalOpen}
        onClose={() => setIsVideosModalOpen(false)}
        initialCountry={videosModalCountry}
        onSelectDay={(dayNum) => {
          setSelectedDay(dayNum);
          setCurrentTab('day');
          setIsVideosModalOpen(false);
        }}
      />

      {/* Nordic Ethnic Folk Games & Cultural Lore Modal (Viking Hnefatafl) */}
      <NordicFolkGamesModal
        isOpen={isGamesModalOpen}
        onClose={() => setIsGamesModalOpen(false)}
      />

      {/* Polar Express & Reindeer Arctic Expedition RPG Modal */}
      <PolarExpressReindeerRpgModal
        isOpen={isReindeerRpgOpen}
        onClose={() => setIsReindeerRpgOpen(false)}
        onSelectDay={(dayNum) => {
          setSelectedDay(dayNum);
          setCurrentTab('day');
          setIsReindeerRpgOpen(false);
        }}
      />

      {/* Hotel & Dining Deep Inspection Modal */}
      <HotelDiningDetailModal
        item={hotelDiningDetailItem}
        onClose={() => setHotelDiningDetailItem(null)}
      />

      {/* Polar Express Opening Animation Effect */}
      {showPolarExpressIntro && (
        <PolarExpressIntro
          onComplete={() => {
            setShowPolarExpressIntro(false);
            try {
              sessionStorage.setItem('polar_express_intro_seen', 'true');
            } catch {
              // Storage fallback
            }
          }}
        />
      )}

      {/* Background Interactive Snowfall & 3D Parallax Canvas */}
      <SnowfallCanvas />

      {/* Dynamic Edge Starlight & Aurora Spectrum Canvas Overlay */}
      <canvas
        ref={edgeCanvasRef}
        className="fixed inset-0 pointer-events-none z-32"
        style={{ mixBlendMode: 'screen' }}
      />

      {/* Interactive Christmas Scene: Clickable Ornaments, Gold Dust Particles & Bell Sound */}
      <InteractiveChristmasScene />

      {/* Floating Yorushika (ヨルシカ) Background Music Player */}
      <YorushikaPlayer />

      {/* Image Credits & Attribution Modal */}
      <ImageCreditsModal
        isOpen={isCreditsOpen}
        onClose={() => setIsCreditsOpen(false)}
        spots={spots}
      />

      {/* Magazine Footer */}
      <footer className="mt-16 border-t border-slate-900 bg-slate-950 py-10 text-center text-xs text-slate-500 font-sans print:hidden">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-slate-300">
              北歐 15 天奢華聖誕跨年之旅
            </span>
            <span>·</span>
            <span>丹麥 · 瑞典 · 芬蘭 · 挪威 · 冰島</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => setIsCreditsOpen(true)}
              className="hover:text-emerald-400 transition-colors"
            >
              圖片授權與來源
            </button>
            <span>·</span>
            <button
              onClick={() => setIsDataManageOpen(true)}
              className="hover:text-emerald-400 transition-colors"
            >
              備份與分享行程 JSON
            </button>
            <span>·</span>
            <span>12/19 – 1/2</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
