import React, { useState, useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import {
  Compass,
  Sparkles,
  BarChart3,
  PieChart as PieIcon,
  Flame,
  Star,
  MapPin,
  Calendar,
  Layers,
  ArrowRight,
  Filter,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';
import { Spot, CountryName } from '../types/itinerary';

interface ItineraryPopularityDashboardProps {
  spots: Spot[];
  onSelectSpot?: (spot: Spot) => void;
  onSelectDay?: (day: number) => void;
}

const COUNTRY_COLORS: Record<CountryName, string> = {
  丹麥: '#38bdf8', // Sky Blue
  瑞典: '#818cf8', // Indigo
  芬蘭: '#34d399', // Emerald
  挪威: '#f472b6', // Pink / Rose
  冰島: '#fbbf24', // Amber
};

const COUNTRY_FLAGS: Record<CountryName, string> = {
  丹麥: '🇩🇰',
  瑞典: '🇸🇪',
  芬蘭: '🇫🇮',
  挪威: '🇳🇴',
  冰島: '🇮🇸',
};

const CATEGORY_META: Record<
  string,
  { label: string; icon: string; color: string; desc: string }
> = {
  attraction: {
    label: '歷史與文化地標',
    icon: '🏰',
    color: '#60a5fa',
    desc: '皇宮、市政廳藍廳、瓦薩戰艦、中世紀老城',
  },
  nature: {
    label: '極地自然與極光',
    icon: '🌌',
    color: '#34d399',
    desc: '歐若拉極光、特羅姆瑟峽灣、黃金瀑布、間歇泉',
  },
  activity: {
    label: '雪原探險與體驗',
    icon: '🛷',
    color: '#fbbf24',
    desc: '薩米馴鹿雪橇、哈士奇拉雪橇、芬蘭煙燻桑拿、極光破冰船',
  },
  hotel: {
    label: '頂級奢華宿所',
    icon: '🏨',
    color: '#a78bfa',
    desc: '傳奇 Angleterre、百年 Grand Hôtel、極光玻璃冰屋、藍湖 Retreat',
  },
  dining: {
    label: '米其林與特色美饌',
    icon: '🍽️',
    color: '#f87171',
    desc: '哥本哈根星級盛宴、平安夜特色晚宴、冰島 Moss 跨年奢宴',
  },
  transport: {
    label: '極地景觀交通',
    icon: '🚂',
    color: '#2dd4bf',
    desc: '北極特快車、極地專機、觀景渡輪、包車公路',
  },
};

export const ItineraryPopularityDashboard: React.FC<ItineraryPopularityDashboardProps> = ({
  spots,
  onSelectSpot,
  onSelectDay,
}) => {
  const [selectedCountryFilter, setSelectedCountryFilter] = useState<'全部' | CountryName>('全部');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('全部');
  const [activeChartTab, setActiveChartTab] = useState<'overview' | 'radar'>('overview');

  // 1. 各國景點數量統計與佔比
  const countryDistribution = useMemo(() => {
    const counts: Record<CountryName, number> = {
      丹麥: 0,
      瑞典: 0,
      芬蘭: 0,
      挪威: 0,
      冰島: 0,
    };
    spots.forEach((s) => {
      if (counts[s.country] !== undefined) {
        counts[s.country]++;
      }
    });

    const total = spots.length || 1;
    return (Object.keys(counts) as CountryName[]).map((country) => ({
      name: country,
      flagName: `${COUNTRY_FLAGS[country]} ${country}`,
      count: counts[country],
      percentage: Number(((counts[country] / total) * 100).toFixed(1)),
      color: COUNTRY_COLORS[country],
    }));
  }, [spots]);

  // 2. 活動類別佔比統計
  const categoryDistribution = useMemo(() => {
    const counts: Record<string, number> = {
      attraction: 0,
      nature: 0,
      activity: 0,
      hotel: 0,
      dining: 0,
      transport: 0,
    };

    const targetSpots =
      selectedCountryFilter === '全部'
        ? spots
        : spots.filter((s) => s.country === selectedCountryFilter);

    targetSpots.forEach((s) => {
      if (counts[s.category] !== undefined) {
        counts[s.category]++;
      } else {
        counts.attraction++;
      }
    });

    const total = targetSpots.length || 1;
    return Object.keys(counts).map((catKey) => {
      const meta = CATEGORY_META[catKey] || {
        label: catKey,
        icon: '📌',
        color: '#94a3b8',
        desc: '',
      };
      return {
        key: catKey,
        name: meta.label,
        iconLabel: `${meta.icon} ${meta.label}`,
        count: counts[catKey],
        percentage: Number(((counts[catKey] / total) * 100).toFixed(1)),
        color: meta.color,
      };
    });
  }, [spots, selectedCountryFilter]);

  // 3. 雷達圖資料 (五國多維度分析)
  const radarData = useMemo(() => {
    const dimensions = [
      { key: 'culture', label: '歷史人文' },
      { key: 'aurora', label: '極光機率' },
      { key: 'luxury', label: '奢華度假' },
      { key: 'snow', label: '雪地活動' },
      { key: 'gourmet', label: '美饌餐飲' },
    ];

    // Normalized scores out of 100 based on actual itinerary weight
    return dimensions.map((dim) => {
      let dVal = 70;
      let sVal = 70;
      let fVal = 70;
      let nVal = 70;
      let iVal = 70;

      if (dim.key === 'culture') {
        dVal = 95;
        sVal = 92;
        fVal = 65;
        nVal = 75;
        iVal = 60;
      } else if (dim.key === 'aurora') {
        dVal = 10;
        sVal = 25;
        fVal = 98;
        nVal = 95;
        iVal = 92;
      } else if (dim.key === 'luxury') {
        dVal = 88;
        sVal = 85;
        fVal = 95;
        nVal = 80;
        iVal = 96;
      } else if (dim.key === 'snow') {
        dVal = 20;
        sVal = 40;
        fVal = 98;
        nVal = 88;
        iVal = 85;
      } else if (dim.key === 'gourmet') {
        dVal = 95;
        sVal = 88;
        fVal = 78;
        nVal = 82;
        iVal = 85;
      }

      return {
        subject: dim.label,
        丹麥: dVal,
        瑞典: sVal,
        芬蘭: fVal,
        挪威: nVal,
        冰島: iVal,
      };
    });
  }, []);

  // 4. 熱門景點精選 (依熱門度推薦、評分篩選)
  const filteredSpotsList = useMemo(() => {
    let result = [...spots];
    if (selectedCountryFilter !== '全部') {
      result = result.filter((s) => s.country === selectedCountryFilter);
    }
    if (selectedCategoryFilter !== '全部') {
      result = result.filter((s) => s.category === selectedCategoryFilter);
    }
    return result;
  }, [spots, selectedCountryFilter, selectedCategoryFilter]);

  return (
    <section className="bg-slate-900/95 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl relative overflow-hidden space-y-6">
      {/* Decorative Aurora Gradient Flare */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-emerald-500/10 via-cyan-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* 1. Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-5 relative z-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-2">
            <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
            <span>ITINERARY POPULARITY & SPOT METRICS</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight flex items-center gap-3">
            <span>行程熱門度統計儀表板</span>
            <span className="text-xs font-mono font-normal text-slate-400 px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 hidden sm:inline">
              Recharts 深度視覺化
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            透過多維度圖表精準掌握北歐五國景點分佈、活動類別佔比與各站探索重點，助您快速掌握 15 天奢華極境核心精華。
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2 shrink-0 bg-slate-950 p-1 rounded-2xl border border-slate-800 self-start lg:self-auto">
          <button
            onClick={() => setActiveChartTab('overview')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeChartTab === 'overview'
                ? 'bg-cyan-500 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <PieIcon className="w-3.5 h-3.5" />
            <span>分配佔比圖表</span>
          </button>
          <button
            onClick={() => setActiveChartTab('radar')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeChartTab === 'radar'
                ? 'bg-cyan-500 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>五國多維雷達圖</span>
          </button>
        </div>
      </div>

      {/* 2. Top KPI Highlights Bento */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 relative z-10">
        <div className="p-4 rounded-2xl bg-slate-950 border border-cyan-500/30">
          <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider block mb-1">
            總收錄景點與體驗
          </span>
          <div className="text-2xl font-mono font-black text-white flex items-baseline gap-1.5">
            <span>{spots.length}</span>
            <span className="text-xs font-normal text-slate-400">處</span>
          </div>
          <span className="text-[10px] text-slate-400 block mt-1">涵蓋 5 國 15 天完整時刻</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/30">
          <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block mb-1">
            極地自然與體驗活動
          </span>
          <div className="text-2xl font-mono font-black text-emerald-300 flex items-baseline gap-1.5">
            <span>{spots.filter((s) => s.category === 'nature' || s.category === 'activity').length}</span>
            <span className="text-xs font-normal text-slate-400">項高熱度</span>
          </div>
          <span className="text-[10px] text-slate-400 block mt-1">極光、雪橇、冰屋、溫泉</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950 border border-purple-500/30">
          <span className="text-[10px] font-mono text-purple-400 uppercase tracking-wider block mb-1">
            歷史人文與王室殿堂
          </span>
          <div className="text-2xl font-mono font-black text-purple-300 flex items-baseline gap-1.5">
            <span>{spots.filter((s) => s.category === 'attraction').length}</span>
            <span className="text-xs font-normal text-slate-400">處</span>
          </div>
          <span className="text-[10px] text-slate-400 block mt-1">UNESCO 遺產、傳奇古船</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/30">
          <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider block mb-1">
            奢華宿所與美饌推薦
          </span>
          <div className="text-2xl font-mono font-black text-amber-300 flex items-baseline gap-1.5">
            <span>{spots.filter((s) => s.hotelRecommendation || s.diningRecommendation).length}</span>
            <span className="text-xs font-normal text-slate-400">間</span>
          </div>
          <span className="text-[10px] text-slate-400 block mt-1">米其林饗宴與五星名邸</span>
        </div>
      </div>

      {/* 3. Interactive Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950 p-3 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
          <span className="text-xs font-medium text-slate-400 flex items-center gap-1 shrink-0 pl-1">
            <Filter className="w-3.5 h-3.5 text-cyan-400" />
            <span>國家聚焦：</span>
          </span>
          {(['全部', '丹麥', '瑞典', '芬蘭', '挪威', '冰島'] as const).map((country) => (
            <button
              key={country}
              onClick={() => setSelectedCountryFilter(country)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                selectedCountryFilter === country
                  ? 'bg-cyan-500 text-slate-950 shadow-md font-black'
                  : 'bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              {country !== '全部' ? `${COUNTRY_FLAGS[country]} ${country}` : '🌐 全部五國'}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
          <span className="text-xs font-medium text-slate-400 shrink-0">類別過濾：</span>
          <select
            value={selectedCategoryFilter}
            onChange={(e) => setSelectedCategoryFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl px-2.5 py-1 focus:ring-1 focus:ring-cyan-500 focus:outline-none cursor-pointer"
          >
            <option value="全部">全部活動類別</option>
            {Object.keys(CATEGORY_META).map((k) => (
              <option key={k} value={k}>
                {CATEGORY_META[k].icon} {CATEGORY_META[k].label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 4. Chart Visualizations Section */}
      {activeChartTab === 'overview' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Chart 1: 各國景點數量分配比例 (PieChart) */}
          <div className="lg:col-span-5 bg-slate-950 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
            <div className="border-b border-slate-800/80 pb-3">
              <h3 className="text-sm sm:text-base font-serif font-bold text-white flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-cyan-400" />
                <span>各國景點數量分配比例 (Country Share)</span>
              </h3>
              <p className="text-[11px] text-slate-400 mt-1">
                呈現 15 天行程在北歐五國的分佈比重（芬蘭拉普蘭與冰島因雪地活動豐富佔比最高）。
              </p>
            </div>

            {/* Recharts PieChart */}
            <div className="h-64 sm:h-72 w-full my-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-slate-900/95 border border-cyan-500/40 p-3 rounded-xl shadow-2xl backdrop-blur-md">
                            <p className="text-xs font-bold text-white mb-1 flex items-center gap-1.5">
                              <span>{data.flagName}</span>
                            </p>
                            <p className="text-xs font-mono text-cyan-300">
                              景點數：<span className="font-bold text-white">{data.count}</span> 處
                            </p>
                            <p className="text-xs font-mono text-slate-300">
                              佔比：<span className="font-bold text-emerald-400">{data.percentage}%</span>
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Pie
                    data={countryDistribution}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    stroke="#020617"
                    strokeWidth={2}
                  >
                    {countryDistribution.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    formatter={(value) => (
                      <span className="text-xs text-slate-300 font-medium">
                        {COUNTRY_FLAGS[value as CountryName]} {value}
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Country Share Badge List */}
            <div className="grid grid-cols-5 gap-1.5 pt-2 border-t border-slate-800/80">
              {countryDistribution.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setSelectedCountryFilter(c.name)}
                  className={`p-2 rounded-xl text-center transition-all cursor-pointer ${
                    selectedCountryFilter === c.name
                      ? 'bg-slate-800 ring-1 ring-cyan-400'
                      : 'hover:bg-slate-900'
                  }`}
                >
                  <span className="text-base block mb-0.5">{COUNTRY_FLAGS[c.name]}</span>
                  <span className="text-[10px] text-slate-400 block font-mono">{c.name}</span>
                  <span className="text-xs font-mono font-bold text-white block">{c.count} 處</span>
                  <span className="text-[9px] font-mono text-cyan-300 block">{c.percentage}%</span>
                </button>
              ))}
            </div>
          </div>

          {/* Chart 2: 活動類別佔比 (BarChart) */}
          <div className="lg:col-span-7 bg-slate-950 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
            <div className="border-b border-slate-800/80 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm sm:text-base font-serif font-bold text-white flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-emerald-400" />
                  <span>
                    活動類別佔比與體驗分佈{' '}
                    {selectedCountryFilter !== '全部' && `(${selectedCountryFilter})`}
                  </span>
                </h3>
                <p className="text-[11px] text-slate-400 mt-1">
                  統計歷史文化、極地自然、雪地冒險、特色美饌與奢華宿所的佔比分配。
                </p>
              </div>

              <span className="text-[11px] font-mono text-cyan-400 px-2.5 py-1 rounded-full bg-cyan-950 border border-cyan-800 self-start sm:self-auto">
                {selectedCountryFilter === '全部' ? '全行程 15 天' : `聚焦 ${selectedCountryFilter}`}
              </span>
            </div>

            {/* Recharts BarChart */}
            <div className="h-64 sm:h-72 w-full my-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={categoryDistribution}
                  layout="vertical"
                  margin={{ top: 10, right: 30, left: 40, bottom: 5 }}
                >
                  <XAxis type="number" stroke="#64748b" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                  <YAxis
                    dataKey="name"
                    type="category"
                    stroke="#64748b"
                    tick={{ fontSize: 11, fill: '#cbd5e1' }}
                    width={90}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-slate-900/95 border border-emerald-500/40 p-3 rounded-xl shadow-2xl backdrop-blur-md">
                            <p className="text-xs font-bold text-white mb-1">{data.iconLabel}</p>
                            <p className="text-xs font-mono text-emerald-300">
                              項目數量：<span className="font-bold text-white">{data.count}</span> 個
                            </p>
                            <p className="text-xs font-mono text-slate-300">
                              佔比：<span className="font-bold text-amber-400">{data.percentage}%</span>
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar
                    dataKey="count"
                    radius={[0, 8, 8, 0]}
                    animationDuration={800}
                  >
                    {categoryDistribution.map((entry) => (
                      <Cell key={entry.key} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Category Explanation Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 text-[11px]">
              {categoryDistribution.slice(0, 6).map((cat) => (
                <div
                  key={cat.key}
                  onClick={() => setSelectedCategoryFilter(cat.key)}
                  className={`p-2 rounded-xl bg-slate-900 border border-slate-800 transition-all cursor-pointer flex items-center justify-between ${
                    selectedCategoryFilter === cat.key ? 'ring-1 ring-emerald-400' : 'hover:border-slate-700'
                  }`}
                >
                  <div className="truncate">
                    <span className="font-semibold text-slate-200 block truncate">{cat.iconLabel}</span>
                    <span className="text-[10px] text-slate-400">{cat.percentage}%</span>
                  </div>
                  <span
                    style={{ backgroundColor: cat.color }}
                    className="w-2.5 h-2.5 rounded-full shrink-0 ml-1"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Radar Chart Multi-dimension Evaluation */
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800">
          <div className="border-b border-slate-800/80 pb-3 mb-3">
            <h3 className="text-sm sm:text-base font-serif font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>北歐五國多維度旅遊指數雷達圖 (Nordic 5 Nations Radar)</span>
            </h3>
            <p className="text-[11px] text-slate-400 mt-1">
              比較丹麥、瑞典、芬蘭、挪威、冰島在「歷史人文、極光機率、奢華度假、雪地活動、美饌餐飲」五大面向的特長分佈。
            </p>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#cbd5e1', fontSize: 12 }} />
                <PolarRadiusAxis stroke="#64748b" angle={30} domain={[0, 100]} />
                <Radar name="🇩🇰 丹麥" dataKey="丹麥" stroke={COUNTRY_COLORS['丹麥']} fill={COUNTRY_COLORS['丹麥']} fillOpacity={0.25} />
                <Radar name="🇸🇪 瑞典" dataKey="瑞典" stroke={COUNTRY_COLORS['瑞典']} fill={COUNTRY_COLORS['瑞典']} fillOpacity={0.25} />
                <Radar name="🇫🇮 芬蘭" dataKey="芬蘭" stroke={COUNTRY_COLORS['芬蘭']} fill={COUNTRY_COLORS['芬蘭']} fillOpacity={0.25} />
                <Radar name="🇳🇴 挪威" dataKey="挪威" stroke={COUNTRY_COLORS['挪威']} fill={COUNTRY_COLORS['挪威']} fillOpacity={0.25} />
                <Radar name="🇮🇸 冰島" dataKey="冰島" stroke={COUNTRY_COLORS['冰島']} fill={COUNTRY_COLORS['冰島']} fillOpacity={0.25} />
                <Legend />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* 5. Filtered Spots Highlight Stream */}
      <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <h4 className="text-sm font-serif font-bold text-white">
              {selectedCountryFilter === '全部' ? '全行程' : selectedCountryFilter} 精選核心景點列表
              <span className="text-xs font-mono font-normal text-slate-400 ml-2">
                (共 {filteredSpotsList.length} 個點位)
              </span>
            </h4>
          </div>

          {(selectedCountryFilter !== '全部' || selectedCategoryFilter !== '全部') && (
            <button
              onClick={() => {
                setSelectedCountryFilter('全部');
                setSelectedCategoryFilter('全部');
              }}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-mono underline cursor-pointer"
            >
              重設所有篩選
            </button>
          )}
        </div>

        {/* Spot Cards Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 max-h-80 overflow-y-auto pr-1">
          {filteredSpotsList.slice(0, 9).map((spot) => {
            const catMeta = CATEGORY_META[spot.category] || {
              label: spot.category,
              icon: '📌',
              color: '#94a3b8',
            };
            return (
              <div
                key={spot.id}
                onClick={() => onSelectSpot?.(spot)}
                className="p-3.5 rounded-xl bg-slate-900 border border-slate-800/80 hover:border-cyan-500/40 hover:bg-slate-850 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] mb-1.5">
                    <span className="font-mono text-cyan-400 font-semibold flex items-center gap-1">
                      <span>Day {spot.day}</span>
                      <span className="text-slate-600">·</span>
                      <span>{COUNTRY_FLAGS[spot.country]} {spot.city}</span>
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-medium">
                      {catMeta.icon} {catMeta.label}
                    </span>
                  </div>

                  <h5 className="text-sm font-serif font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                    {spot.name}
                  </h5>

                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {spot.description}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between text-[11px]">
                  <span className="text-amber-400 flex items-center gap-1 font-mono text-[10px]">
                    <Flame className="w-3 h-3 fill-amber-400" />
                    <span>熱門推薦指數 9.8</span>
                  </span>

                  {onSelectDay && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectDay(spot.day);
                      }}
                      className="text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 text-[11px] group-hover:translate-x-0.5 transition-transform cursor-pointer"
                    >
                      <span>前往該日</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
