import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  ListMusic,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Youtube,
  ExternalLink,
  GripHorizontal,
  Move,
  Disc,
  RotateCcw,
  Volume2,
  VolumeX,
  Radio,
  Search,
  Plus,
  Trash2,
  Repeat,
  Repeat1,
  Shuffle,
  Music,
  CheckCircle2,
  Flame,
} from 'lucide-react';

export interface YorushikaTrack {
  id: string;
  title: string;
  jpTitle: string;
  album: string;
  desc: string;
  youtubeId: string;
  duration: string;
  trackNum?: number;
  isCustom?: boolean;
}

// 完整典藏ヨルシカ曲庫（包含《だから僕は音楽を辞めた》全專輯與經典神作）
export const DEFAULT_YORUSHIKA_TRACKS: YorushikaTrack[] = [
  // 《だから僕は音楽を辞めた》全專輯
  {
    id: 'dakara-boku',
    trackNum: 1,
    title: '所以我放棄了音樂 (標題曲)',
    jpTitle: 'だから僕は音楽を辞めた (That\'s Why I Gave Up on Music)',
    album: 'だから僕は音楽を辞めた',
    desc: '全專輯靈魂核心！突破 1.5 億次播放的疾走感鋼琴搖滾神作',
    youtubeId: 'KTZ-y85Erus',
    duration: '4:05',
  },
  {
    id: 'ai-nijou',
    trackNum: 2,
    title: '藍二乘',
    jpTitle: '藍二乗 (Deep Indigo)',
    album: 'だから僕は音楽を辞めた',
    desc: '深邃海軍藍暮光之詩，清亮俐落的經典吉他刷弦代表作',
    youtubeId: '4MoRLTAJY_o',
    duration: '4:07',
  },
  {
    id: 'parade',
    trackNum: 3,
    title: '巡遊',
    jpTitle: 'パレード (Parade)',
    album: 'だから僕は音楽を辞めた',
    desc: '漫步在巴黎石板路上的詩意旋律，浪漫中帶著淡淡悵惘',
    youtubeId: 'ry3Tupx4BL4',
    duration: '4:59',
  },
  {
    id: 'hachigatsu',
    trackNum: 4,
    title: '八月、某、月光',
    jpTitle: '八月、某、月明かり (August, Moonlight)',
    album: 'だから僕は音楽を辞めた',
    desc: '在月光傾瀉的夜晚吶喊，極具感染力的爆發人聲與鼓點',
    youtubeId: '_9rVpGq_QpY',
    duration: '4:36',
  },
  {
    id: 'shi-kaki',
    trackNum: 5,
    title: '寫詩與咖啡',
    jpTitle: '詩書きとコーヒー (Poetry Writer and Coffee)',
    album: 'だから僕は音楽を辞めた',
    desc: '冬日午後微苦的黑咖啡香氣，隨性而迷人的爵士氛圍',
    youtubeId: '6H8QdY2n6_w',
    duration: '4:08',
  },
  {
    id: 'odorouze',
    trackNum: 6,
    title: '起舞吧',
    jpTitle: '踊ろうぜ (Let\'s Dance)',
    album: 'だから僕は音楽を辞めた',
    desc: '節奏強勁跳躍，在繁華街景中忘我旋轉的瀟灑放肆',
    youtubeId: 'e5zN2fP-Jc0',
    duration: '4:13',
  },
  {
    id: 'rokugatsu',
    trackNum: 7,
    title: '六月書寫雨霽街道',
    jpTitle: '六月は雨上がりの街を書く (June Writes About the Street)',
    album: 'だから僕は音楽を辞めた',
    desc: '雨後水窪倒映著北歐微光，清新脫俗的夏初微風',
    youtubeId: 'Wc2Qv7nZp-c',
    duration: '3:58',
  },
  {
    id: 'gogatsu',
    trackNum: 8,
    title: '五月仰望綠青之街',
    jpTitle: '五月は花緑青の窓辺から (From the Window of May)',
    album: 'だから僕は音楽を辞めた',
    desc: '薄荷綠的初夏記憶，充滿空間感的器樂編程',
    youtubeId: 'WvYn1jF-6pM',
    duration: '3:45',
  },
  {
    id: 'yoru-magai',
    trackNum: 9,
    title: '仿如夜色',
    jpTitle: '夜紛い (Night Simulation)',
    album: 'だから僕は音楽を辞めた',
    desc: '疾風般的貝斯與鋼琴切分音，在夜色中奔馳的悵然心緒',
    youtubeId: '4MoRLTAJY_o',
    duration: '3:43',
  },
  {
    id: 'elma',
    trackNum: 10,
    title: '艾爾瑪 (Elma)',
    jpTitle: 'エルマ (Elma)',
    album: 'だから僕は音楽を辞めた',
    desc: '獻給心中永遠的靈感謬思，純淨透明的鋼琴自彈自唱',
    youtubeId: 'wK-X_U6eUfg',
    duration: '3:40',
  },
  {
    id: 'naita-mahiru',
    trackNum: 11,
    title: '哭泣的正午',
    jpTitle: '泣いた真昼 (Cried Midday)',
    album: 'だから僕は音楽を辞めた',
    desc: '陽光燦爛下的悲傷抒情詩，觸動心底最柔軟的角落',
    youtubeId: 'Q7Pj3nQeYJ4',
    duration: '4:01',
  },
  {
    id: 'kumo-to-yuurei',
    trackNum: 12,
    title: '雲與幽靈',
    jpTitle: '雲と幽霊 (Clouds and Ghost)',
    album: 'だから僕は音楽を辞めた',
    desc: '漫步在雲端的空靈幻想，suis 清澈高音宛如極光飄渺',
    youtubeId: 'r_C5z_sL3m0',
    duration: '4:33',
  },

  // 經典加選與熱門神曲
  {
    id: 'haru-dorobou',
    trackNum: 13,
    title: '春泥棒 (Spring Thief)',
    jpTitle: '春泥棒 (Haru Dorobou)',
    album: '創作',
    desc: '傳唱度極高的春之詠嘆調，描繪櫻花與時光流逝的極致美學',
    youtubeId: 'Sw1FlgbMpmY',
    duration: '4:50',
  },
  {
    id: 'hana-ni-bourei',
    trackNum: 14,
    title: '花上亡靈 (想哭的我戴上了貓的面具 主題曲)',
    jpTitle: '花に亡霊 (Ghost in a Flower)',
    album: '盗作',
    desc: '破億動畫電影神作主題曲，溫柔哀傷的盛夏回憶',
    youtubeId: '9lVPAWLWtWc',
    duration: '4:01',
  },
  {
    id: 'haru-frieren',
    trackNum: 15,
    title: '晴る (動畫《葬送的芙莉蓮》OP 2)',
    jpTitle: '晴る (Haru - Frieren OP)',
    album: '晴る',
    desc: '2024 動畫霸權片頭曲！疾速飛馳的希望之光與清澈人聲',
    youtubeId: 'CkvWJNt77mU',
    duration: '4:30',
  },
  {
    id: 'tada-kimi',
    trackNum: 16,
    title: '只因你而晴天 (Tada Kimi ni Hare)',
    jpTitle: 'ただ君に晴れ (Just a Sunny Day for You)',
    album: '負け犬にアンコールはいらない',
    desc: '破 2 億點擊最高人氣代表作！躍動拍手節奏與陽光微風',
    youtubeId: '-VKIqrvVOpo',
    duration: '3:18',
  },
  {
    id: 'hitchcock',
    trackNum: 17,
    title: '希區考克 (Hitchcock)',
    jpTitle: 'ヒッチコック (Hitchcock)',
    album: '負け犬にアンコールはいらない',
    desc: '探討人生哲理的清澈吉他名曲，「老師，人生這道題目該怎麼解？」',
    youtubeId: 't7MBzMP4OzY',
    duration: '3:42',
  },
  {
    id: 'itte',
    trackNum: 18,
    title: '說吧 (Say It)',
    jpTitle: '言って。 (Itte)',
    album: '夏草が邪魔をする',
    desc: 'ヨルシカ成名初期代表作，suis 穿透力十足的深情告白',
    youtubeId: 'F64yFFnZfkI',
    duration: '4:02',
  },
  {
    id: 'nautilus',
    trackNum: 19,
    title: '鸚鵡螺號 (Nautilus)',
    jpTitle: 'ノーチラス (Nautilus)',
    album: 'エルマ',
    desc: '《艾爾瑪》專輯完結壓軸！潛入深海般的宏大鋼琴編程',
    youtubeId: 'j83OVgv63SU',
    duration: '4:00',
  },
  {
    id: 'ame-to-cappuccino',
    trackNum: 20,
    title: '雨與卡布奇諾',
    jpTitle: '雨とカプチーノ (Rain with Cappuccino)',
    album: 'エルマ',
    desc: '雨天午後在咖啡館沉思，極具層次的爵士和弦與雨聲意象',
    youtubeId: 'PWbRleIGRR4',
    duration: '4:29',
  },
  {
    id: 'toumin',
    trackNum: 21,
    title: '冬眠 (極夜冬日精選)',
    jpTitle: '冬眠 (Toumin)',
    album: '夏草が邪魔をする',
    desc: '極寒雪夜與璀璨極光下的溫柔冬眠，極具冬日氛圍',
    youtubeId: 'pQ7d7l67uK0',
    duration: '3:35',
  },
  {
    id: 'nordic-christmas-cozy',
    trackNum: 22,
    title: '北歐聖誕壁爐與極光鋼琴',
    jpTitle: 'Cozy Christmas Fireplace & Aurora Piano',
    album: 'Christmas Special',
    desc: '溫馨柴火燃燒聲與聖誕輕柔旋律，讓整個旅程充滿聖誕溫度',
    youtubeId: 'L_LUpnjgPso',
    duration: 'LIVE',
  },
];

const STORAGE_CUSTOM_TRACKS_KEY = 'nordic_trip_custom_music_tracks';

export const YorushikaPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showVideo, setShowVideo] = useState(true);
  const [activeTab, setActiveTab] = useState<'playlist' | 'search' | 'custom'>('playlist');

  // Search & YouTube input state
  const [searchQuery, setSearchQuery] = useState('');
  const [youtubeInputUrl, setYoutubeInputUrl] = useState('');
  const [customSongTitle, setCustomSongTitle] = useState('');
  const [inputFeedback, setInputFeedback] = useState<string | null>(null);

  // Custom Tracks State (saved in localStorage)
  const [customTracks, setCustomTracks] = useState<YorushikaTrack[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_CUSTOM_TRACKS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Loop Mode: 'single' (單曲循環) | 'playlist' (歌單循環) | 'shuffle' (隨機播放)
  const [loopMode, setLoopMode] = useState<'single' | 'playlist' | 'shuffle'>('single');

  // Merged playlist (default tracks + user custom tracks)
  const allTracks = useMemo(() => {
    return [...DEFAULT_YORUSHIKA_TRACKS, ...customTracks];
  }, [customTracks]);

  const currentTrack = allTracks[currentTrackIndex] || allTracks[0];

  const [activeYoutubeId, setActiveYoutubeId] = useState<string>(
    DEFAULT_YORUSHIKA_TRACKS[0].youtubeId
  );

  // Background Web Audio Synth Engine Mode
  const [ambientSynthPlaying, setAmbientSynthPlaying] = useState(false);
  const [ambientVolume, setAmbientVolume] = useState(0.5);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const synthTimerRef = useRef<number | null>(null);

  // Free Draggable State
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef<{ mouseX: number; mouseY: number; initialX: number; initialY: number }>({
    mouseX: 0,
    mouseY: 0,
    initialX: 0,
    initialY: 0,
  });
  const playerContainerRef = useRef<HTMLDivElement | null>(null);

  // Helper to extract YouTube video ID from any URL or string
  const extractYoutubeId = (urlOrId: string): string | null => {
    const trimmed = urlOrId.trim();
    if (!trimmed) return null;

    // Direct 11-char ID
    if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
      return trimmed;
    }

    // Standard Youtube URLs (youtu.be, watch?v=, embed/, /v/, etc.)
    const regExp = /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/;
    const match = trimmed.match(regExp);
    return match ? match[1] : null;
  };

  // Filtered tracks based on search query
  const filteredTracks = useMemo(() => {
    if (!searchQuery.trim()) return allTracks;
    const q = searchQuery.toLowerCase();
    return allTracks.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.jpTitle.toLowerCase().includes(q) ||
        t.album.toLowerCase().includes(q) ||
        t.desc.toLowerCase().includes(q)
    );
  }, [allTracks, searchQuery]);

  // Select and Play a track
  const handleSelectTrack = (track: YorushikaTrack) => {
    const idx = allTracks.findIndex((t) => t.id === track.id);
    if (idx >= 0) setCurrentTrackIndex(idx);
    setActiveYoutubeId(track.youtubeId);
    setIsPlaying(true);
  };

  // Next Track based on Loop Mode
  const handleNext = () => {
    if (loopMode === 'shuffle') {
      const randomIdx = Math.floor(Math.random() * allTracks.length);
      setCurrentTrackIndex(randomIdx);
      setActiveYoutubeId(allTracks[randomIdx].youtubeId);
      setIsPlaying(true);
    } else {
      const nextIdx = (currentTrackIndex + 1) % allTracks.length;
      setCurrentTrackIndex(nextIdx);
      setActiveYoutubeId(allTracks[nextIdx].youtubeId);
      setIsPlaying(true);
    }
  };

  // Prev Track
  const handlePrev = () => {
    const prevIdx = (currentTrackIndex - 1 + allTracks.length) % allTracks.length;
    setCurrentTrackIndex(prevIdx);
    setActiveYoutubeId(allTracks[prevIdx].youtubeId);
    setIsPlaying(true);
  };

  // Toggle Loop Mode
  const cycleLoopMode = () => {
    if (loopMode === 'single') setLoopMode('playlist');
    else if (loopMode === 'playlist') setLoopMode('shuffle');
    else setLoopMode('single');
  };

  // Handle Custom YouTube Input Submission
  const handleDirectPlayOrAdd = (playNow: boolean) => {
    const yId = extractYoutubeId(youtubeInputUrl);
    if (!yId) {
      setInputFeedback('⚠️ 請輸入有效的 YouTube 影片網址或 11 位影片 ID！');
      setTimeout(() => setInputFeedback(null), 3500);
      return;
    }

    const title = customSongTitle.trim() || `自訂曲目 (${yId})`;
    const newTrack: YorushikaTrack = {
      id: `custom-${Date.now()}`,
      title,
      jpTitle: title,
      album: '自訂 YouTube 典藏',
      desc: '由使用者自行加入的全站背景循環播放曲目',
      youtubeId: yId,
      duration: '自訂',
      isCustom: true,
    };

    // Save to custom tracks in localStorage
    const updated = [newTrack, ...customTracks];
    setCustomTracks(updated);
    try {
      localStorage.setItem(STORAGE_CUSTOM_TRACKS_KEY, JSON.stringify(updated));
    } catch {
      // Storage fallback
    }

    if (playNow) {
      setActiveYoutubeId(yId);
      setIsPlaying(true);
      setShowVideo(true);
    }

    setInputFeedback(`✨ 成功載入《${title}》！已啟動全站背景播放。`);
    setYoutubeInputUrl('');
    setCustomSongTitle('');
    setTimeout(() => setInputFeedback(null), 3500);
  };

  // Remove a custom track
  const handleRemoveCustomTrack = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = customTracks.filter((t) => t.id !== id);
    setCustomTracks(updated);
    try {
      localStorage.setItem(STORAGE_CUSTOM_TRACKS_KEY, JSON.stringify(updated));
    } catch {
      // Storage fallback
    }
  };

  // Web Audio Native Ambient Piano & Fireplace Synthesizer (True uninterrupted background audio)
  const toggleAmbientSynth = () => {
    if (ambientSynthPlaying) {
      setAmbientSynthPlaying(false);
      if (synthTimerRef.current) clearInterval(synthTimerRef.current);
    } else {
      setAmbientSynthPlaying(true);
      startAmbientSynthLoop();
    }
  };

  const startAmbientSynthLoop = () => {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      // Nordic winter acoustic chords progression (Fmaj7 - Em7 - Dm7 - Cmaj7 - Am7)
      const chordNotes = [
        [349.23, 440.0, 523.25, 659.25], // Fmaj7
        [329.63, 392.0, 493.88, 587.33], // Em7
        [293.66, 349.23, 440.0, 523.25], // Dm7
        [261.63, 329.63, 392.0, 493.88], // Cmaj7
        [220.0, 261.63, 329.63, 392.0],  // Am7
      ];

      let chordIdx = 0;

      const playChord = () => {
        if (!ctx || ctx.state === 'closed') return;
        const notes = chordNotes[chordIdx % chordNotes.length];
        chordIdx++;

        const now = ctx.currentTime;
        notes.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = i === 0 ? 'triangle' : 'sine';
          osc.frequency.setValueAtTime(freq, now + i * 0.12);

          // Gentle piano acoustic envelope with warm decay
          const startTime = now + i * 0.12;
          gain.gain.setValueAtTime(0.0001, startTime);
          gain.gain.linearRampToValueAtTime(0.06 * ambientVolume, startTime + 0.05);
          gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 2.8);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(startTime);
          osc.stop(startTime + 3.0);
        });
      };

      playChord();
      if (synthTimerRef.current) clearInterval(synthTimerRef.current);
      synthTimerRef.current = window.setInterval(playChord, 3200);
    } catch {
      // Audio autoplay policy fallback
    }
  };

  // Clean up synth timer on unmount
  useEffect(() => {
    return () => {
      if (synthTimerRef.current) clearInterval(synthTimerRef.current);
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  // Free Dragging Handlers
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    isDraggingRef.current = true;
    setIsDragging(true);

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const el = playerContainerRef.current;
    let initialX = window.innerWidth - 380;
    let initialY = window.innerHeight - 180;

    if (el) {
      const rect = el.getBoundingClientRect();
      initialX = rect.left;
      initialY = rect.top;
    }

    if (position) {
      initialX = position.x;
      initialY = position.y;
    }

    dragStartRef.current = {
      mouseX: clientX,
      mouseY: clientY,
      initialX,
      initialY,
    };

    const handleDragMove = (moveEvt: MouseEvent | TouchEvent) => {
      if (!isDraggingRef.current) return;
      const moveX = 'touches' in moveEvt ? moveEvt.touches[0].clientX : moveEvt.clientX;
      const moveY = 'touches' in moveEvt ? moveEvt.touches[0].clientY : moveEvt.clientY;

      const deltaX = moveX - dragStartRef.current.mouseX;
      const deltaY = moveY - dragStartRef.current.mouseY;

      const newX = Math.max(10, Math.min(window.innerWidth - 100, dragStartRef.current.initialX + deltaX));
      const newY = Math.max(60, Math.min(window.innerHeight - 80, dragStartRef.current.initialY + deltaY));

      setPosition({ x: newX, y: newY });
    };

    const handleDragEnd = () => {
      isDraggingRef.current = false;
      setIsDragging(false);
      window.removeEventListener('mousemove', handleDragMove);
      window.removeEventListener('mouseup', handleDragEnd);
      window.removeEventListener('touchmove', handleDragMove);
      window.removeEventListener('touchend', handleDragEnd);
    };

    window.addEventListener('mousemove', handleDragMove);
    window.addEventListener('mouseup', handleDragEnd);
    window.addEventListener('touchmove', handleDragMove, { passive: true });
    window.addEventListener('touchend', handleDragEnd);
  };

  // Construct iframe src with robust background looping
  const iframeSrc = useMemo(() => {
    const isSingleLoop = loopMode === 'single';
    return `https://www.youtube-nocookie.com/embed/${activeYoutubeId}?autoplay=1&enablejsapi=1&rel=0${
      isSingleLoop ? `&loop=1&playlist=${activeYoutubeId}` : ''
    }`;
  }, [activeYoutubeId, loopMode]);

  return (
    <div
      ref={playerContainerRef}
      style={
        position
          ? {
              position: 'fixed',
              left: `${position.x}px`,
              top: `${position.y}px`,
              bottom: 'auto',
              right: 'auto',
            }
          : undefined
      }
      className={`z-45 transition-shadow select-none print:hidden ${
        !position ? 'fixed bottom-4 right-4' : ''
      }`}
    >
      {/* Minimized Compact Floating Music Capsule */}
      {!isExpanded ? (
        <div className="flex items-center gap-2 p-2 bg-slate-900/95 hover:bg-slate-900 backdrop-blur-2xl border border-rose-500/50 rounded-full shadow-2xl shadow-rose-950/40 transition-all hover:scale-105 group">
          {/* Drag Handle */}
          <div
            onMouseDown={handleDragStart}
            onTouchStart={handleDragStart}
            className="cursor-grab active:cursor-grabbing p-1 text-slate-400 hover:text-white"
            title="按住可自由拖曳音樂盒位置"
          >
            <GripHorizontal className="w-3.5 h-3.5" />
          </div>

          {/* Vinyl Record Spinning Disc Icon */}
          <button
            onClick={() => setIsExpanded(true)}
            className="relative flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-tr from-rose-600 to-amber-500 text-white shadow-md cursor-pointer"
          >
            <Disc
              className={`w-5 h-5 ${isPlaying || ambientSynthPlaying ? 'animate-spin' : ''}`}
              style={{ animationDuration: '4s' }}
            />
          </button>

          {/* Track Info (Click to Expand) */}
          <div
            onClick={() => setIsExpanded(true)}
            className="cursor-pointer max-w-[150px] sm:max-w-[210px] truncate pr-1"
          >
            <span className="text-xs font-serif font-bold text-white block truncate flex items-center gap-1">
              <span>{ambientSynthPlaying ? '極光鋼琴背景音' : currentTrack.title}</span>
              {(isPlaying || ambientSynthPlaying) && (
                <span className="inline-flex items-end gap-0.5 h-3 shrink-0">
                  <span className="w-0.5 bg-rose-400 animate-pulse h-full" />
                  <span className="w-0.5 bg-amber-400 animate-pulse h-2/3" />
                  <span className="w-0.5 bg-emerald-400 animate-pulse h-4/5" />
                </span>
              )}
            </span>
            <span className="text-[10px] text-rose-400 block truncate flex items-center gap-1">
              <span>{ambientSynthPlaying ? 'Web Audio 背景音' : '全站背景循環播放中'}</span>
              <span>·</span>
              <span className="font-mono text-[9px] text-slate-400">
                {loopMode === 'single' ? '🔂單曲' : loopMode === 'playlist' ? '🔁歌單' : '🔀隨機'}
              </span>
            </span>
          </div>

          {/* Play/Pause Quick Toggle */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1.5 rounded-full bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white transition-colors"
            title={isPlaying ? '暫停播放' : '播放音樂'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
          </button>

          {/* Loop Mode Quick Cycle Button */}
          <button
            onClick={cycleLoopMode}
            className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            title={`當前循環模式：${
              loopMode === 'single' ? '單曲循環' : loopMode === 'playlist' ? '歌單循環' : '隨機播放'
            } (點擊切換)`}
          >
            {loopMode === 'single' ? (
              <Repeat1 className="w-3.5 h-3.5 text-rose-400" />
            ) : loopMode === 'playlist' ? (
              <Repeat className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Shuffle className="w-3.5 h-3.5 text-amber-400" />
            )}
          </button>

          {/* Expand Full Player */}
          <button
            onClick={() => setIsExpanded(true)}
            className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
            title="展開搜尋與音樂盒"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
        </div>
      ) : (
        /* Expanded Full Player Card */
        <div className="w-88 sm:w-[420px] bg-slate-900/95 backdrop-blur-2xl border border-rose-500/40 rounded-3xl shadow-2xl overflow-hidden p-4 sm:p-5 flex flex-col space-y-3.5">
          {/* Draggable Header */}
          <div
            onMouseDown={handleDragStart}
            onTouchStart={handleDragStart}
            className="flex items-center justify-between border-b border-slate-800 pb-2.5 cursor-grab active:cursor-grabbing group select-none"
            title="按住此處可自由拖動音樂盒位置"
          >
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
                <Youtube className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider font-serif flex items-center gap-1.5">
                  <span>ヨルシカ · 全站背景音樂盒</span>
                  <span className="text-[10px] text-amber-300">🎄</span>
                </h4>
                <p className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Move className="w-2.5 h-2.5 text-rose-400" />
                  <span>支援自訂搜尋 YouTube · 全站循環播放</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {position && (
                <button
                  onClick={() => setPosition(null)}
                  className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
                  title="重設回畫面右下角"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={() => setIsExpanded(false)}
                className="p-1 text-slate-400 hover:text-white rounded transition-colors"
                title="縮小為浮動膠囊"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* YouTube Video Player Embed Screen */}
          <div className="relative rounded-2xl overflow-hidden bg-black border border-slate-800 shadow-inner">
            {isPlaying ? (
              <iframe
                src={iframeSrc}
                title="Yorushika YouTube Music"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                className={`w-full ${showVideo ? 'h-44' : 'h-12'} transition-all duration-300 ${
                  isDragging ? 'pointer-events-none' : ''
                }`}
              />
            ) : (
              <div
                onClick={() => setIsPlaying(true)}
                className="w-full h-36 flex flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/60 cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-xl shadow-rose-500/40 group-hover:scale-110 transition-transform mb-2">
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                </div>
                <span className="text-xs font-bold text-white tracking-wide">
                  點擊立即全站播放《{currentTrack.title}》
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5">
                  {currentTrack.jpTitle}
                </span>
              </div>
            )}

            {/* Toggle Video Height overlay */}
            {isPlaying && (
              <button
                onClick={() => setShowVideo(!showVideo)}
                className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/75 hover:bg-black text-[10px] text-slate-300 hover:text-white backdrop-blur-xs border border-white/10 transition-colors"
              >
                {showVideo ? '縮小畫面 (僅聽音訊)' : '顯示 MV 畫面'}
              </button>
            )}
          </div>

          {/* Feedback message banner */}
          {inputFeedback && (
            <div className="p-2 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{inputFeedback}</span>
            </div>
          )}

          {/* Player Nav Tabs */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-2xl border border-slate-800 text-xs">
            <button
              onClick={() => setActiveTab('playlist')}
              className={`flex-1 py-1.5 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'playlist'
                  ? 'bg-rose-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ListMusic className="w-3.5 h-3.5" />
              <span>曲目典藏 ({allTracks.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('search')}
              className={`flex-1 py-1.5 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'search'
                  ? 'bg-rose-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>搜尋 & YouTube</span>
            </button>
          </div>

          {/* Tab 1: Built-in & Custom Playlist */}
          {activeTab === 'playlist' && (
            <div className="space-y-2">
              {/* Quick Search inside playlist */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="快速過濾歌名、日文或專輯..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-rose-400"
                />
              </div>

              {/* Tracks Scroll List */}
              <div className="space-y-1 max-h-48 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-700">
                {filteredTracks.map((track, idx) => {
                  const isCurrent = track.id === currentTrack.id;
                  return (
                    <div
                      key={track.id}
                      onClick={() => handleSelectTrack(track)}
                      className={`p-2 rounded-xl text-xs flex items-center justify-between cursor-pointer transition-colors group ${
                        isCurrent && isPlaying
                          ? 'bg-rose-500/20 text-white border border-rose-500/50 font-bold'
                          : 'text-slate-300 hover:bg-slate-800/80 hover:text-white border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-mono text-[10px] text-slate-500 w-5 shrink-0">
                          {isCurrent && isPlaying ? (
                            <Disc className="w-3.5 h-3.5 text-rose-400 animate-spin" />
                          ) : (
                            idx + 1
                          )}
                        </span>
                        <div className="truncate">
                          <span className="block truncate font-medium">
                            {track.title}
                          </span>
                          <span className="text-[10px] text-slate-500 block truncate">
                            {track.jpTitle}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 ml-2">
                        {track.isCustom && (
                          <button
                            onClick={(e) => handleRemoveCustomTrack(track.id, e)}
                            className="p-1 text-slate-500 hover:text-rose-400 rounded transition-colors"
                            title="從自訂清單移除"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <span className="text-[10px] font-mono text-slate-500">
                          {track.duration}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {filteredTracks.length === 0 && (
                  <div className="py-6 text-center text-xs text-slate-500 font-sans">
                    找不到符合「{searchQuery}」的曲目，可至「搜尋 & YouTube」分頁直接貼上 YouTube 網址！
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab 2: Direct Search & Custom YouTube Input Form */}
          {activeTab === 'search' && (
            <div className="space-y-3">
              {/* Preset Quick Search Chips */}
              <div>
                <span className="text-[10px] font-mono text-slate-400 block mb-1.5">
                  🔥 熱門神曲快捷點播：
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    '春泥棒',
                    '花に亡霊',
                    '晴る (芙莉蓮)',
                    '藍二乗',
                    'ヒッチコック',
                    '言って。',
                    'ノーチラス',
                    '雨とカプチーノ',
                  ].map((chip) => (
                    <button
                      key={chip}
                      onClick={() => {
                        setSearchQuery(chip.split(' ')[0]);
                        setActiveTab('playlist');
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-rose-950/60 text-slate-300 hover:text-rose-300 border border-slate-800 hover:border-rose-500/40 text-[11px] font-medium transition-colors"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>

              {/* YouTube URL / Video ID Input */}
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl space-y-2.5">
                <span className="text-xs font-serif font-bold text-amber-300 block flex items-center gap-1.5">
                  <Youtube className="w-4 h-4 text-rose-500" />
                  <span>輸入任意 YouTube 網址自選播放：</span>
                </span>

                <input
                  type="text"
                  value={youtubeInputUrl}
                  onChange={(e) => setYoutubeInputUrl(e.target.value)}
                  placeholder="貼上 YouTube 網址 (如 https://youtu.be/... 或影片 ID)"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-rose-400"
                />

                <input
                  type="text"
                  value={customSongTitle}
                  onChange={(e) => setCustomSongTitle(e.target.value)}
                  placeholder="自訂歌曲名稱 (選填，如：ヨルシカ - 新曲)"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-rose-400"
                />

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => handleDirectPlayOrAdd(true)}
                    className="flex-1 py-2 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>立即載入並背景循環播放</span>
                  </button>

                  <button
                    onClick={() => handleDirectPlayOrAdd(false)}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-colors"
                    title="儲存至我的歌單"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Playback Controls & Status Bar */}
          <div className="border-t border-slate-800 pt-3 flex items-center justify-between gap-2">
            {/* Loop Mode Selector */}
            <button
              onClick={cycleLoopMode}
              className={`px-2.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                loopMode === 'single'
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                  : loopMode === 'playlist'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              }`}
              title="點擊切換循環模式：單曲循環 / 歌單循環 / 隨機播放"
            >
              {loopMode === 'single' ? (
                <>
                  <Repeat1 className="w-3.5 h-3.5" />
                  <span>單曲循環</span>
                </>
              ) : loopMode === 'playlist' ? (
                <>
                  <Repeat className="w-3.5 h-3.5" />
                  <span>歌單循環</span>
                </>
              ) : (
                <>
                  <Shuffle className="w-3.5 h-3.5" />
                  <span>隨機播放</span>
                </>
              )}
            </button>

            {/* Prev / Play / Next */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={handlePrev}
                className="p-2 text-slate-300 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
                title="上一首"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl shadow-lg transition-transform hover:scale-105"
                title={isPlaying ? '暫停' : '播放'}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
              </button>

              <button
                onClick={handleNext}
                className="p-2 text-slate-300 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
                title="下一首"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            </div>

            {/* Ambient Synth Native Audio Switcher */}
            <button
              onClick={toggleAmbientSynth}
              className={`p-2 rounded-xl border transition-colors ${
                ambientSynthPlaying
                  ? 'bg-emerald-500/30 text-emerald-300 border-emerald-500/50'
                  : 'bg-slate-950 text-slate-400 hover:text-white border-slate-800'
              }`}
              title={ambientSynthPlaying ? '關閉極光鋼琴背景音' : '開啟極光鋼琴 Web Audio 背景音'}
            >
              <Radio className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
