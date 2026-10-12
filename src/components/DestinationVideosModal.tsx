import React, { useState, useEffect } from 'react';
import {
  X,
  Play,
  Film,
  Sparkles,
  MapPin,
  Calendar,
  Plus,
  Trash2,
  ExternalLink,
  Search,
  CheckCircle2,
  Tv,
  Globe,
  Share2,
} from 'lucide-react';

export interface DestinationVideo {
  id: string;
  title: string;
  country: '丹麥' | '瑞典' | '芬蘭' | '挪威' | '冰島';
  city: string;
  day: number;
  spotName: string;
  youtubeId: string; // YouTube Video ID or embed URL
  videoUrl?: string; // Direct link or custom URL
  thumbnail: string;
  duration: string;
  description: string;
  isCustom?: boolean;
}

const DEFAULT_DESTINATION_VIDEOS: DestinationVideo[] = [
  {
    id: 'vid-dk-cph',
    title: '哥本哈根冬季夢幻散策：新港運河與 Tivoli 花園聖誕點燈實境',
    country: '丹麥',
    city: '哥本哈根',
    day: 1,
    spotName: '新港運河 (Nyhavn) & Tivoli 樂園',
    youtubeId: 'Z6b3wU0Z6oI', // 4K Copenhagen winter
    thumbnail: 'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?auto=format&fit=crop&w=800&q=80',
    duration: '04:15',
    description: '漫步白雪覆蓋的哥本哈根彩色木屋運河，感受歐洲最具歷史的 Tivoli 樂園百萬顆璀璨聖誕燈火與熱紅酒香氣。',
  },
  {
    id: 'vid-se-stk',
    title: '斯德哥爾摩老城 Gamla Stan 雪夜漫步與瓦薩沉船博物館巡禮',
    country: '瑞典',
    city: '斯德哥爾摩',
    day: 3,
    spotName: '老城大廣場 & 瓦薩號戰艦',
    youtubeId: '3Jt1PqjFfH4',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Stortorget_2006.jpg/1280px-Stortorget_2006.jpg',
    duration: '05:30',
    description: '穿梭在 13 世紀中世紀鵝卵石石磚巷弄，大廣場聖誕市集散發肉桂香，隨後參觀沉睡海底 333 年後重現的十七世紀海上霸主戰艦。',
  },
  {
    id: 'vid-fi-rovaniemi',
    title: '羅瓦涅米聖誕老人村實境：北極圈分界線、馴鹿拉雪橇與哈士奇極速奔馳',
    country: '芬蘭',
    city: '羅瓦涅米',
    day: 5,
    spotName: '聖誕老人村 & 極圈分界線',
    youtubeId: 'Y9Jp9_v5bEI',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Wood_and_flowers.jpg/1280px-Wood_and_flowers.jpg',
    duration: '06:12',
    description: '踏過北緯 66°33′ 極圈線！親自拜訪聖誕老人本尊，乘坐毛茸茸可愛馴鹿雪橇穿梭在童話雪白松樹林間。',
  },
  {
    id: 'vid-fi-aurora-igloo',
    title: '拉普蘭 Kakslauttanen 玻璃屋極光大爆發：躺在床上仰望綠紫極光曼舞',
    country: '芬蘭',
    city: '薩利色爾卡',
    day: 7,
    spotName: 'Kakslauttanen 玻璃穹頂木屋',
    youtubeId: 'y88XvXb-X20',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Wood_and_flowers.jpg/1280px-Wood_and_flowers.jpg',
    duration: '04:45',
    description: '世界頂級奢華極光度假村！全景保暖玻璃穹頂冰屋，夜半極光風暴爆發，如綠色絲綢般在北極夜空中激盪狂舞。',
  },
  {
    id: 'vid-no-kingcrab',
    title: '希爾克內斯巴倫支海冰封冬捕：北冰洋現撈野生帝王蟹生猛饗宴',
    country: '挪威',
    city: '希爾克內斯',
    day: 9,
    spotName: '冰封峽灣雪地摩托車 & 帝王蟹',
    youtubeId: 'kJQP7kiw5Fk',
    thumbnail: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
    duration: '05:08',
    description: '騎乘雪地摩托車馳騁在冰封海面上，拉起巨型捕蟹籠，在傳統木屋中品嚐清甜飽滿的無限量野生巨型帝王蟹腿肉！',
  },
  {
    id: 'vid-no-tromso',
    title: '特羅姆瑟北極首都探秘：北極大教堂聖歌、峽灣巡航與 Fjellheisen 俯瞰百萬夜景',
    country: '挪威',
    city: '特羅姆瑟',
    day: 11,
    spotName: '特羅姆瑟北極大教堂 & 纜車',
    youtubeId: 'qN4q1cQoFqg',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Arctic_Cathedral.JPG/1280px-Arctic_Cathedral.JPG',
    duration: '05:52',
    description: '被譽為北方巴黎的特羅姆瑟，搭乘全景登山纜車俯瞰全島燈火與峽灣雪山，北極大教堂玻璃彩繪在夜色中如冰山般純淨聖潔。',
  },
  {
    id: 'vid-is-bluelagoon',
    title: '冰島藍湖地熱溫泉仙境：零下低溫中浸泡在奶藍色礦物仙泉',
    country: '冰島',
    city: '格林達維克',
    day: 12,
    spotName: '藍湖溫泉 (Blue Lagoon)',
    youtubeId: 'LXb3EKWsInQ',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/b/be/Blue_lagoon%2C_Iceland_02.jpg',
    duration: '04:20',
    description: '黑色熔岩苔原地貌包圍下的奶藍色地熱溫泉，抹上純白矽泥面膜，手持一杯冰島氣泡飲，享受冰火五重天的極致奢華放鬆。',
  },
  {
    id: 'vid-is-newyear',
    title: '雷克雅維克哈爾格林姆教堂跨年夜：全冰島人點亮百萬煙火世紀狂歡',
    country: '冰島',
    city: '雷克雅維克',
    day: 13,
    spotName: '哈爾格林姆大教堂跨年煙火',
    youtubeId: 'V-_O7nl0Ii0',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/2/26/NewYearFireworks-Reykjavik.jpg',
    duration: '07:35',
    description: '全球最壯麗的自發性跨年煙火！超過 20 萬冰島民眾在午夜同時施放數百萬發煙火，將玄武岩大教堂照亮如白晝！',
  },
  {
    id: 'vid-is-goldencircle',
    title: '冰島黃金圈與南岸壯麗冰瀑：間歇泉沖天水柱與塞里雅蘭冰簾巡禮',
    country: '冰島',
    city: '黃金圈',
    day: 14,
    spotName: 'Strokkur 間歇泉 & 塞里雅蘭瀑布',
    youtubeId: '7wtfhZwyrcc',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Seljalandsfoss_Waterfall%2C_Iceland%2C_20240720_1455_3078.jpg/1280px-Seljalandsfoss_Waterfall%2C_Iceland%2C_20240720_1455_3078.jpg',
    duration: '06:40',
    description: '每五分鐘沖天 30 公尺的滾燙地熱沸泉，搭配凍結成冰晶宮殿的塞里雅蘭瀑布與黑色沙灘，感受地球最原始的心跳。',
  },
];

const VIDEOS_STORAGE_KEY = 'nordic_destination_videos_custom_v1';

interface DestinationVideosModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDay?: (day: number) => void;
  initialCountry?: string;
}

export const DestinationVideosModal: React.FC<DestinationVideosModalProps> = ({
  isOpen,
  onClose,
  onSelectDay,
  initialCountry,
}) => {
  const [videos, setVideos] = useState<DestinationVideo[]>(() => {
    try {
      const saved = localStorage.getItem(VIDEOS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return [...DEFAULT_DESTINATION_VIDEOS, ...parsed];
        }
      }
    } catch {
      // Fallback
    }
    return DEFAULT_DESTINATION_VIDEOS;
  });

  const [activeVideo, setActiveVideo] = useState<DestinationVideo>(
    DEFAULT_DESTINATION_VIDEOS[0]
  );
  const [selectedCountry, setSelectedCountry] = useState<string>(
    initialCountry || '全部'
  );
  const [selectedDay, setSelectedDay] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Add Custom Video Form State
  const [customTitle, setCustomTitle] = useState('');
  const [customCountry, setCustomCountry] = useState<'丹麥' | '瑞典' | '芬蘭' | '挪威' | '冰島'>('芬蘭');
  const [customCity, setCustomCity] = useState('');
  const [customDay, setCustomDay] = useState(5);
  const [customSpot, setCustomSpot] = useState('');
  const [customUrl, setCustomUrl] = useState('');
  const [customDesc, setCustomDesc] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (initialCountry) {
      setSelectedCountry(initialCountry);
    }
  }, [initialCountry]);

  // Extract YouTube ID from url or raw ID
  const parseYouTubeId = (urlOrId: string): string => {
    const trimmed = urlOrId.trim();
    if (!trimmed.includes('/') && !trimmed.includes('.')) {
      return trimmed;
    }
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = trimmed.match(regExp);
    return match && match[2].length === 11 ? match[2] : 'Z6b3wU0Z6oI';
  };

  // Add Custom Video Handler
  const handleAddCustomVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim() || !customUrl.trim()) {
      alert('請填寫影片標題與 YouTube / 影片網址！');
      return;
    }

    const yId = parseYouTubeId(customUrl);
    const newVideo: DestinationVideo = {
      id: `custom-vid-${Date.now()}`,
      title: customTitle.trim(),
      country: customCountry,
      city: customCity.trim() || customCountry,
      day: customDay,
      spotName: customSpot.trim() || `Day ${customDay} 旅遊地點`,
      youtubeId: yId,
      videoUrl: customUrl.trim(),
      thumbnail: `https://img.youtube.com/vi/${yId}/hqdefault.jpg`,
      duration: '自訂影片',
      description: customDesc.trim() || '使用者新增之旅遊景點精彩實境紀錄短片。',
      isCustom: true,
    };

    setVideos((prev) => [newVideo, ...prev]);
    setActiveVideo(newVideo);

    // Save to localStorage
    try {
      const existing = localStorage.getItem(VIDEOS_STORAGE_KEY);
      const parsed = existing ? JSON.parse(existing) : [];
      localStorage.setItem(
        VIDEOS_STORAGE_KEY,
        JSON.stringify([newVideo, ...parsed])
      );
    } catch {
      // storage protection
    }

    setToastMessage('🎬 已成功新增旅遊實境影片！');
    setTimeout(() => setToastMessage(null), 3000);

    // Reset Form
    setIsAddModalOpen(false);
    setCustomTitle('');
    setCustomCity('');
    setCustomSpot('');
    setCustomUrl('');
    setCustomDesc('');
  };

  const handleDeleteCustomVideo = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('確定要刪除這部自訂影片嗎？')) return;

    setVideos((prev) => prev.filter((v) => v.id !== id));
    try {
      const existing = localStorage.getItem(VIDEOS_STORAGE_KEY);
      if (existing) {
        const parsed: DestinationVideo[] = JSON.parse(existing);
        const filtered = parsed.filter((v) => v.id !== id);
        localStorage.setItem(VIDEOS_STORAGE_KEY, JSON.stringify(filtered));
      }
    } catch {
      // fallback
    }

    if (activeVideo.id === id) {
      setActiveVideo(DEFAULT_DESTINATION_VIDEOS[0]);
    }
    setToastMessage('🗑️ 已刪除自訂影片');
    setTimeout(() => setToastMessage(null), 3000);
  };

  if (!isOpen) return null;

  // Filtered Video List
  const filteredVideos = videos.filter((vid) => {
    if (selectedCountry !== '全部' && vid.country !== selectedCountry) return false;
    if (selectedDay !== 'all' && vid.day !== selectedDay) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        vid.title.toLowerCase().includes(q) ||
        vid.spotName.toLowerCase().includes(q) ||
        vid.city.toLowerCase().includes(q) ||
        vid.description.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-2xl flex items-center justify-center p-2 sm:p-4 lg:p-6 animate-in fade-in select-none">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-8 right-8 z-60 flex items-center gap-2.5 px-4 py-3 bg-slate-900 text-white font-bold rounded-2xl shadow-2xl border border-cyan-500/50 backdrop-blur-xl animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" />
          <span className="text-xs sm:text-sm">{toastMessage}</span>
        </div>
      )}

      {/* Main Container Card */}
      <div className="bg-slate-950 border border-slate-800 rounded-3xl w-full max-w-7xl max-h-[96vh] flex flex-col overflow-hidden shadow-2xl relative">
        {/* Top Header Bar */}
        <div className="p-4 sm:p-6 border-b border-slate-800/80 flex items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/40 text-cyan-400 flex items-center justify-center shadow-lg">
              <Tv className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] font-mono font-bold mb-1">
                <Sparkles className="w-3 h-3" />
                <span>4K CINEMATIC NORDIC TOUR · 共 {videos.length} 部實境短片</span>
              </div>
              <h2 className="text-base sm:text-xl font-serif font-black text-white tracking-wide">
                北歐五國旅遊地點 · 4K 實境影音與景點巡禮
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Add Custom Video CTA */}
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-3.5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black rounded-xl text-xs shadow-lg transition-all flex items-center gap-1.5 cursor-pointer hover:scale-105 active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">新增自訂影片</span>
              <span className="sm:hidden">新增</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Main Content: Split Player and Video Gallery */}
        <div className="flex-1 overflow-y-auto flex flex-col lg:flex-row">
          {/* Left Column: Big Theater Screen & Video Detail */}
          <div className="lg:w-3/5 p-4 sm:p-6 border-b lg:border-b-0 lg:border-r border-slate-800/80 flex flex-col justify-between space-y-4 bg-slate-950/70">
            {/* 16:9 Responsive Video Theater Screen */}
            <div className="w-full relative rounded-2xl overflow-hidden bg-black aspect-video border border-slate-800 shadow-2xl">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${activeVideo.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                title={activeVideo.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>

            {/* Active Video Info Banner */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-amber-400/20 text-amber-300 border border-amber-400/40 text-xs font-bold">
                  {activeVideo.country} · {activeVideo.city}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 text-xs font-mono">
                  Day {activeVideo.day}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-cyan-950 text-cyan-300 border border-cyan-800/50 text-xs font-mono">
                  ⏱️ {activeVideo.duration}
                </span>
                {activeVideo.isCustom && (
                  <span className="px-2.5 py-1 rounded-lg bg-purple-950 text-purple-300 border border-purple-800/50 text-xs font-mono font-bold">
                    自訂上傳
                  </span>
                )}
              </div>

              <h3 className="text-lg sm:text-2xl font-serif font-black text-white leading-snug">
                {activeVideo.title}
              </h3>

              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
                <MapPin className="w-4 h-4 shrink-0" />
                <span className="font-bold">{activeVideo.spotName}</span>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800/80">
                {activeVideo.description}
              </p>

              {/* Action Buttons: Jump to itinerary / Open YouTube */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                {onSelectDay && (
                  <button
                    onClick={() => {
                      onSelectDay(activeVideo.day);
                      onClose();
                    }}
                    className="px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>查看 Day {activeVideo.day} 當天行程時刻表 →</span>
                  </button>
                )}

                <a
                  href={`https://www.youtube.com/watch?v=s/${activeVideo.youtubeId}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>在 YouTube 開啟</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Search, Filters & Scrollable Video Playlist */}
          <div className="lg:w-2/5 p-4 sm:p-6 flex flex-col space-y-4 bg-slate-950/95 overflow-hidden">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜尋景點、城市或關鍵字 (如：極光、煙火、運河)..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
              />
            </div>

            {/* Country Filters Strip */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {(['全部', '丹麥', '瑞典', '芬蘭', '挪威', '冰島'] as const).map(
                (country) => (
                  <button
                    key={country}
                    onClick={() => setSelectedCountry(country)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      selectedCountry === country
                        ? 'bg-cyan-500 text-slate-950 font-black shadow-md'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {country}
                  </button>
                )
              )}
            </div>

            {/* Video Cards Scroll Area */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-[60vh] lg:max-h-[70vh]">
              {filteredVideos.length > 0 ? (
                filteredVideos.map((vid) => {
                  const isCurrent = activeVideo.id === vid.id;
                  return (
                    <div
                      key={vid.id}
                      onClick={() => setActiveVideo(vid)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex gap-3 group relative ${
                        isCurrent
                          ? 'bg-cyan-950/40 border-cyan-400 ring-1 ring-cyan-400/50 shadow-lg'
                          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                      }`}
                    >
                      {/* Video Thumbnail with Play Badge */}
                      <div className="relative w-28 h-20 shrink-0 rounded-xl overflow-hidden bg-slate-950">
                        <img
                          src={vid.thumbnail}
                          alt={vid.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform ${
                              isCurrent
                                ? 'bg-cyan-400 text-slate-950 scale-110'
                                : 'bg-black/60 text-white group-hover:scale-110'
                            }`}
                          >
                            <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                          </div>
                        </div>
                        <span className="absolute bottom-1 right-1 bg-black/80 text-[9px] font-mono font-bold text-white px-1.5 py-0.5 rounded">
                          {vid.duration}
                        </span>
                      </div>

                      {/* Video Information */}
                      <div className="flex-1 flex flex-col justify-between overflow-hidden">
                        <div>
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className="text-[10px] font-bold text-amber-300">
                              {vid.country}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              · Day {vid.day}
                            </span>
                          </div>
                          <h4
                            className={`text-xs font-serif font-bold line-clamp-2 leading-snug ${
                              isCurrent ? 'text-cyan-300' : 'text-slate-200'
                            }`}
                          >
                            {vid.title}
                          </h4>
                        </div>

                        <span className="text-[10px] text-slate-400 font-mono truncate mt-1">
                          📍 {vid.spotName}
                        </span>
                      </div>

                      {/* Delete Custom Video Button */}
                      {vid.isCustom && (
                        <button
                          onClick={(e) => handleDeleteCustomVideo(vid.id, e)}
                          className="absolute top-2 right-2 p-1 text-slate-500 hover:text-rose-400 rounded transition-colors"
                          title="刪除這部自訂影片"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="p-8 text-center text-slate-500 space-y-2">
                  <Film className="w-8 h-8 mx-auto text-slate-600" />
                  <p className="text-xs">尚無符合此篩選條件的影片</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Modal: Add Custom Destination Video */}
      {isAddModalOpen && (
        <div
          onClick={() => setIsAddModalOpen(false)}
          className="fixed inset-0 z-60 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-lg space-y-4 shadow-2xl relative"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Film className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-serif font-bold text-white">
                  新增自訂旅遊地點實境影片
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddCustomVideo} className="space-y-3.5">
              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1">
                  影片標題：
                </label>
                <input
                  type="text"
                  required
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="例如：特羅姆瑟極光大爆發全紀錄 4K"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1">
                  YouTube 影片網址或 ID：
                </label>
                <input
                  type="text"
                  required
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=... 或 影片ID"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono text-slate-400 block mb-1">
                    所屬國家：
                  </label>
                  <select
                    value={customCountry}
                    onChange={(e) =>
                      setCustomCountry(e.target.value as any)
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="丹麥">丹麥</option>
                    <option value="瑞典">瑞典</option>
                    <option value="芬蘭">芬蘭</option>
                    <option value="挪威">挪威</option>
                    <option value="冰島">冰島</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-mono text-slate-400 block mb-1">
                    旅程天數：
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={15}
                    value={customDay}
                    onChange={(e) => setCustomDay(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono text-slate-400 block mb-1">
                    城市地區：
                  </label>
                  <input
                    type="text"
                    value={customCity}
                    onChange={(e) => setCustomCity(e.target.value)}
                    placeholder="如：特羅姆瑟、雷克雅維克..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-slate-400 block mb-1">
                    相關景點：
                  </label>
                  <input
                    type="text"
                    value={customSpot}
                    onChange={(e) => setCustomSpot(e.target.value)}
                    placeholder="如：北極大教堂、藍湖..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1">
                  影片內容亮點描述：
                </label>
                <textarea
                  rows={2}
                  value={customDesc}
                  onChange={(e) => setCustomDesc(e.target.value)}
                  placeholder="簡要描述這部影片的亮點心得..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-cyan-400 to-blue-500 hover:opacity-95 text-slate-950 font-black rounded-xl text-xs shadow-xl transition-all"
                >
                  確認儲存影片至播放清單
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
