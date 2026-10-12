import React, { useState, useEffect } from 'react';
import {
  CityWeather,
  NORDIC_CITIES,
  fetchCityWeather,
  getCityKeyFromDayCity,
} from '../utils/weatherService';
import {
  CloudSnow,
  Wind,
  Droplets,
  Sun,
  Sparkles,
  Shirt,
  Compass,
  X,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';

interface WeatherDayBadgeProps {
  cityStr: string;
  onOpenWeatherModal: () => void;
}

export const WeatherDayBadge: React.FC<WeatherDayBadgeProps> = ({
  cityStr,
  onOpenWeatherModal,
}) => {
  const [weather, setWeather] = useState<CityWeather | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const key = getCityKeyFromDayCity(cityStr);
    setLoading(true);
    fetchCityWeather(key).then((w) => {
      if (isMounted) {
        setWeather(w);
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [cityStr]);

  if (!weather && loading) {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 animate-pulse">
        <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
        <span>同步北歐即時氣象...</span>
      </div>
    );
  }

  if (!weather) return null;

  return (
    <div
      onClick={onOpenWeatherModal}
      className="group cursor-pointer inline-flex flex-wrap items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/40 text-xs transition-all shadow-md"
      title="點擊查看北歐五國七大城市氣象與極光指數"
    >
      <div className="flex items-center gap-1.5">
        <span className="text-base">{weather.conditionIcon}</span>
        <span className="font-bold text-white text-sm font-mono">{weather.temp}°C</span>
        <span className="text-slate-400 text-[11px]">(體感 {weather.feelsLike}°C)</span>
      </div>

      <span className="text-slate-600 hidden sm:inline">|</span>

      <span className="text-slate-300 font-medium hidden sm:inline">
        {weather.conditionText}
      </span>

      <span className="text-slate-600 hidden md:inline">|</span>

      <div className="flex items-center gap-1 text-emerald-400 font-medium">
        <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
        <span>極光機率 {weather.auroraChance}</span>
      </div>

      <span className="text-[11px] text-emerald-400 group-hover:translate-x-0.5 transition-transform hidden lg:inline">
        詳情 →
      </span>
    </div>
  );
};

interface WeatherModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCity?: string;
}

export const WeatherModal: React.FC<WeatherModalProps> = ({
  isOpen,
  onClose,
  initialCity = 'copenhagen',
}) => {
  const [selectedKey, setSelectedKey] = useState<string>(
    getCityKeyFromDayCity(initialCity)
  );
  const [weatherMap, setWeatherMap] = useState<Record<string, CityWeather>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    Promise.all(NORDIC_CITIES.map((c) => fetchCityWeather(c.key))).then((list) => {
      const map: Record<string, CityWeather> = {};
      list.forEach((w) => {
        map[w.cityKey] = w;
      });
      setWeatherMap(map);
      setLoading(false);
    });
  }, [isOpen]);

  if (!isOpen) return null;

  const currentW = weatherMap[selectedKey] || weatherMap['copenhagen'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 text-lg">
              ❄️
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white font-serif">
                北歐五國即時氣象與極光天候指數
              </h3>
              <p className="text-xs text-slate-400">
                串接 Open-Meteo 高精度衛星氣象，掌握寒冬穿著與追光時機
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

        {/* City Selector Pills */}
        <div className="flex items-center gap-1.5 p-3 px-6 bg-slate-950/40 border-b border-slate-800 overflow-x-auto no-scrollbar">
          {NORDIC_CITIES.map((c) => {
            const isSel = c.key === selectedKey;
            return (
              <button
                key={c.key}
                onClick={() => setSelectedKey(c.key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isSel
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <span>{c.flag}</span>
                <span>{c.name.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm font-sans flex-1">
          {currentW ? (
            <>
              {/* Highlight Weather Banner */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/40 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold mb-1">
                    <span>{currentW.countryFlag} {currentW.country}</span>
                    <span>·</span>
                    <span>{currentW.cityName}</span>
                  </div>
                  <div className="flex items-baseline gap-3 my-2">
                    <span className="text-5xl font-mono font-bold text-white tracking-tight">
                      {currentW.temp}°C
                    </span>
                    <span className="text-4xl">{currentW.conditionIcon}</span>
                    <div className="text-xs text-slate-400">
                      <div>體感 {currentW.feelsLike}°C</div>
                      <div className="text-slate-300 font-semibold">{currentW.conditionText}</div>
                    </div>
                  </div>
                  <div className="text-xs text-slate-400 flex items-center gap-4 mt-2">
                    <span>最高 {currentW.tempMax}°C</span>
                    <span>最低 {currentW.tempMin}°C</span>
                    <span className="flex items-center gap-1">
                      <Wind className="w-3.5 h-3.5 text-sky-400" />
                      風速 {currentW.windSpeed} km/h
                    </span>
                    <span className="flex items-center gap-1">
                      <Droplets className="w-3.5 h-3.5 text-blue-400" />
                      濕度 {currentW.humidity}%
                    </span>
                  </div>
                </div>

                {/* Aurora & Daylight Card */}
                <div className="p-4 rounded-xl bg-slate-900/90 border border-emerald-900/50 space-y-2.5 md:w-72 shrink-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                      歐若拉極光機率
                    </span>
                    <span className="text-xs font-bold text-emerald-400">
                      {currentW.auroraChance}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">地磁指數預估</span>
                    <span className="font-mono text-emerald-300 font-bold">{currentW.auroraKp}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800">
                    <span className="text-slate-400">冬季日照時間</span>
                    <span className="text-slate-200 font-medium text-right text-[11px] max-w-[150px]">
                      {currentW.daylightHours}
                    </span>
                  </div>
                </div>
              </div>

              {/* Clothing and Packing Guidance */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 shrink-0 mt-0.5">
                  <Shirt className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-1">
                    當前城市保暖穿著建議
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {currentW.clothingTip}
                  </p>
                </div>
              </div>

              {/* 7 Cities Side-by-side Table */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  十五日全行程七大城市氣象一覽
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {NORDIC_CITIES.map((c) => {
                    const w = weatherMap[c.key];
                    const isCurrent = c.key === selectedKey;
                    return (
                      <div
                        key={c.key}
                        onClick={() => setSelectedKey(c.key)}
                        className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                          isCurrent
                            ? 'bg-slate-800/90 border-emerald-500/80 shadow-md'
                            : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-semibold text-white">
                            {c.flag} {c.name.split(' ')[0]}
                          </span>
                          <span className="text-base">{w?.conditionIcon || '❄️'}</span>
                        </div>
                        <div className="flex items-baseline justify-between text-xs">
                          <span className="font-mono text-lg font-bold text-emerald-400">
                            {w ? `${w.temp}°C` : '--'}
                          </span>
                          <span className="text-slate-400 text-[11px]">
                            極光：{c.aurora}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <div className="p-8 text-center text-slate-400 text-xs">
              氣象載入中...
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-950/70 flex items-center justify-between text-xs text-slate-500">
          <span>數據來源：Open-Meteo WMO 標準高精度氣象模型</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors"
          >
            關閉
          </button>
        </div>
      </div>
    </div>
  );
};
