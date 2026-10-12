import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Play,
  RotateCcw,
  Sparkles,
  Trophy,
  Flame,
  Volume2,
  VolumeX,
  Compass,
  ArrowRight,
  Shield,
  Zap,
  MapPin,
  Train,
  CheckCircle2,
  Award,
  BookOpen,
  Coffee,
  Bed,
  Swords,
  ChevronRight,
  Maximize2,
  Minimize2,
  RefreshCw,
  Heart,
  Activity,
  Luggage,
  Target,
  Sparkle,
  Radio,
  Eye,
  Navigation,
  MessageSquare,
  HelpCircle,
  FlameKindling,
  Lock,
  Unlock,
  Music,
  Skull,
  Layers,
  History,
  FastForward,
} from 'lucide-react';
import { rpgBgmEngine, BgmTrackId, BGM_TRACKS_INFO } from '../utils/rpgBgmEngine';

interface PolarExpressReindeerRpgModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDay?: (day: number) => void;
}

// ==========================================
// 1. DATA MODELS & TYPES
// ==========================================

export interface DialogueOption {
  label: string;
  next?: string;
  action?: 'learn_story_and_quest' | 'claim_gift' | 'claim_hidden_quest' | 'close';
  courageDelta?: number;
  courageReaction?: string;
}

export interface PrimaryStoryNpc {
  id: string;
  name: string;
  title: string;
  role: string;
  avatar: string;
  spriteType: string;
  chapterId: string;
  x: number;
  y: number;
  dialogueTree: {
    start: {
      text: string;
      options: DialogueOption[];
    };
    [nodeKey: string]: {
      text: string;
      options: DialogueOption[];
    };
  };
  rewardExp: number;
  rewardGold: number;
  buffReward?: string;
  hiddenQuest?: {
    id: string;
    title: string;
    desc: string;
    minCourage: number;
    rewardBuff: string;
    rewardExp: number;
    rewardGold: number;
  };
}

export interface RpgQuest {
  id: string;
  title: string;
  desc: string;
  targetLandmarkId: string;
  rewardExp: number;
  rewardGold: number;
  completed: boolean;
}

export interface RpgLandmark {
  id: string;
  name: string;
  x: number;
  y: number;
  historicalLore: string;
  trivia: string;
  mustDo?: string[];
  emoji: string;
  dayNum: number;
}

export interface RpgChapter {
  id: string;
  number: number;
  title: string;
  subTitle: string;
  country: string;
  countryFlag: string;
  dayRange: string;
  themeColor: string;
  accentBg: string;
  description: string;
  questObjective: string;
  primaryStoryNpcId: string;
  quests: RpgQuest[];
  hotelSavePoint: {
    name: string;
    description: string;
  };
  michelinBuff: {
    name: string;
    description: string;
    type: string;
    effectText: string;
  };
  boss: {
    id: string;
    name: string;
    title: string;
    stage: string;
    avatar: string;
    bossType: string;
    maxHp: number;
    atk: number;
    taunts: {
      start: string;
      turn1: string;
      halfHp: string;
      lowHp: string;
      actLoreResponse: string;
      postDodge: string;
    };
    skills: { name: string; desc: string; dmg: number }[];
    rewardItem: string;
    rewardDesc: string;
    winQuote: string;
  };
  landmarks: RpgLandmark[];
}

// Player State Definition
export interface RpgPlayerState {
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  level: number;
  exp: number;
  gold: number;
  courage: number; // 隱藏屬性：勇氣值，影響 NPC 好感表情、隱藏任務與戰鬥 Buff
  unlockedHiddenQuests: string[]; // 已解鎖的勇氣隱藏任務清單
  clearedBosses: string[];
  unlockedLandmarks: string[];
  completedQuests: string[];
  learnedStories: string[];
  claimedNpcRewards: string[];
  activeBuff: string | null;
  attackPower?: number;
  transportMode: 'walk' | 'reindeer' | 'train';
  savePointHotel: string;
  inventory: Array<{
    id: string;
    name: string;
    icon: string;
    count: number;
    healAmount: number;
    description: string;
    effectLabel: string;
  }>;
}

// Undertale Bullet Hell Object
// ==========================================
// BOSS SIDE WEAPON & BEAM ATTACK SYSTEM (框外特裝重器光束系統)
// ==========================================
export interface BossSideWeapon {
  id: string;
  type:
    | 'mjolnir_hammer'      // 丹麥藍牙王：耶靈雷神戰鎚 (Mjölnir)
    | 'vasa_anchor_halberd' // 瑞典瓦薩號：深海巨錨戰戟 (Vasa Anchor Halberd)
    | 'pirate_flintlock'    // 船長瓦薩號：皇家金獅青銅艦砲
    | 'bluetooth_pylon'     // 藍牙王：芬里爾藍牙狼首砲
    | 'frost_totem'         // 薩米薩滿：極光狼靈圖騰
    | 'kantele_string'      // 萬奈摩寧：黃金五弦琴音鐮 (Kantele Sonic Scythe)
    | 'viking_axe'          // 哈拉爾狂戰士：維京血鷹雙刃巨斧
    | 'twilight_sword'      // 蘇爾特爾：諸神黃昏暮光炎魔神劍
    | 'gaster_blaster'      // Sans 蒼龍噬魂龍顱巨砲 (Screenshot 2 & Flappy Screenshot)
    | 'chaos_saber'         // Asriel 混沌雙刃聖劍 (Screenshot 1)
    | 'star_cannon'         // 對角星隕巨砲 (Screenshot 3)
    | 'crimson_trident';    // Asgore 鮮紅王權三叉戟 (Screenshot 4)
  side: 'left' | 'right' | 'top' | 'bottom';
  x: number;
  y: number;
  targetCoord: number; // Y for horizontal beam, X for vertical beam
  state: 'charging' | 'firing' | 'cooldown';
  chargeTicks: number;
  maxChargeTicks: number;
  fireTicks: number;
  beamThickness: number;
  color: string;
  glowColor: string;
  name: string;
}

export interface FlappyNordicPillar {
  id: string;
  x: number;
  width: number;
  gapY: number;
  gapHeight: number;
  passed: boolean;
  theme: 'bone_pine' | 'runestone' | 'ship_mast' | 'organ_pipe' | 'fjord_ice' | 'basalt_magma';
}

// ==========================================
// NORDIC TOWN SHOPS & VENDORS (北歐各國互動城鎮商店)
// ==========================================
export interface NordicShopItem {
  id: string;
  name: string;
  icon: string;
  cost: number;
  courageRequired: number;
  description: string;
  effectLabel: string;
  buffType: 'heal' | 'maxHp' | 'aegis' | 'speed' | 'iframes' | 'attack' | 'counterRate' | 'damageReduction';
  buffValue: number;
}

export interface NordicShopData {
  id: string;
  chapterId: string;
  title: string;
  subtitle: string;
  shopkeeperName: string;
  shopkeeperTitle: string;
  shopkeeperAvatar: string;
  greeting: string;
  x: number;
  y: number;
  items: NordicShopItem[];
}

export interface UndertaleBullet {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  type:
    | 'rune'
    | 'orbit_rune'
    | 'cannonball'
    | 'anchor'
    | 'aurora_beam'
    | 'polar_cutter'
    | 'snowflake'
    | 'note'
    | 'kantele_wave'
    | 'axe'
    | 'magma'
    | 'nyhavn_house'
    | 'water_bubble'
    | 'mosaic_shard'
    | 'cobblestone'
    | 'letter'
    | 'antler'
    | 'sauna_steam'
    | 'rock_block'
    | 'geyser_spout'
    | 'firework'
    | 'pixel_shard'
    | 'laser_cross'
    | 'spiral_rune'
    | 'broadside_cannon'
    | 'kraken_tentacle'
    | 'fenrir_claw'
    | 'ice_vortex'
    | 'kantele_cascade'
    | 'rock_shrapnel'
    | 'boomerang_axe'
    | 'prism_laser'
    | 'twilight_cleave'
    | 'meteor_magma'
    | 'radar_ping'
    | 'star'; // Asriel 群星天墜弧線彈幕 (Screenshot 1)
  char?: string;
  color: string;
  rot?: number;
  vRot?: number;
  width?: number;
  height?: number;
  beamProgress?: number;
  isPhase2?: boolean;
  bouncesLeft?: number;
  phaseTime?: number;
  baseX?: number;
  baseY?: number;
  amplitude?: number;
  frequency?: number;
  orbitAngle?: number;
  orbitRadius?: number;
  orbitSpeed?: number;
  orbitCenterX?: number;
  orbitCenterY?: number;
  stringIdx?: number;
  trail?: { x: number; y: number }[];
  isCurving?: boolean;
  hasShattered?: boolean;
  lifeFrames?: number;
  meta?: any;
}


// ==========================================
// BOSS 3-PHASE FORMS CONFIGURATION (血量三段形態轉換系統)
// ==========================================
export interface BossFormDef {
  phaseNumber: 1 | 2 | 3;
  formName: string;
  formBadge: string;
  fullTitle: string;
  themeColor: string;
  secondaryColor: string;
  auraStyle: string;
  transformQuote: string;
  boxDynamicPattern: string;
}

export const BOSS_FORMS_CONFIG: Record<string, Record<1 | 2 | 3, BossFormDef>> = {
  harald_bluetooth: {
    1: {
      phaseNumber: 1,
      formName: '耶靈石碑守護姿態',
      formBadge: '【形態 I · 耶靈守護】',
      fullTitle: '丹麥國王 · 藍牙哈拉爾',
      themeColor: '#38bdf8',
      secondaryColor: '#60a5fa',
      auraStyle: 'cyan_glow',
      transformQuote: '「這片北海潮音與耶靈石碑，皆在聆聽孤王的召喚。」',
      boxDynamicPattern: '常態微波律動',
    },
    2: {
      phaseNumber: 2,
      formName: '北歐電磁雷暴覺醒態',
      formBadge: '【形態 II · 電磁雷暴覺醒】',
      fullTitle: '雷霆符文王 · 藍牙哈拉爾',
      themeColor: '#06b6d4',
      secondaryColor: '#a855f7',
      auraStyle: 'electric_blue',
      transformQuote: '「古代耶靈石碑的血脈正在共鳴！這才是丹麥王真正的電磁神力！」',
      boxDynamicPattern: '電磁脈衝橫移與磁場跳躍',
    },
    3: {
      phaseNumber: 3,
      formName: '終焉諸神電磁支配神王',
      formBadge: '【形態 III · 諸神黃昏電磁天神】',
      fullTitle: '電磁天神 · 藍牙哈拉爾完全體',
      themeColor: '#c084fc',
      secondaryColor: '#f43f5e',
      auraStyle: 'violet_lightning_storm',
      transformQuote: '「雷霆支配萬象！凡人，臣服於統禦全北歐的古盧恩律令之下！」',
      boxDynamicPattern: '極限高頻磁場扭曲與傾角飄移',
    },
  },
  captain_vasa: {
    1: {
      phaseNumber: 1,
      formName: '1628 皇家戰艦守護靈',
      formBadge: '【形態 I · 皇家戰艦守護】',
      fullTitle: '瓦薩號幽靈船長',
      themeColor: '#14b8a6',
      secondaryColor: '#0d9488',
      auraStyle: 'teal_mist',
      transformQuote: '「1628年的起航誓言……我們仍在等待未竟的勝利航向。」',
      boxDynamicPattern: '波浪潮汐緩擺',
    },
    2: {
      phaseNumber: 2,
      formName: '波羅的海深淵魔咒怨靈',
      formBadge: '【形態 II · 深淵魔咒怨靈】',
      fullTitle: '深海怨靈 · 瓦薩海怪艦長',
      themeColor: '#2dd4bf',
      secondaryColor: '#f59e0b',
      auraStyle: 'abyssal_green',
      transformQuote: '「沉睡海底333年的怨念狂瀾……將化為吞沒一切的深淵漩渦！」',
      boxDynamicPattern: '大航海狂濤顛簸與滾浪傾斜',
    },
    3: {
      phaseNumber: 3,
      formName: '幽冥巨艦克拉肯共鳴體',
      formBadge: '【形態 III · 諸神黃昏深淵海神】',
      fullTitle: '海神天譴 · 幽冥巨艦瓦薩完全體',
      themeColor: '#10b981',
      secondaryColor: '#e11d48',
      auraStyle: 'kraken_abyss',
      transformQuote: '「幽靈艦隊全面啟航！讓整個波羅的海都為瓦薩號殉葬！」',
      boxDynamicPattern: '暴風怒海劇烈起伏與通道極限擠壓',
    },
  },
  sami_shaman: {
    1: {
      phaseNumber: 1,
      formName: '極地守護薩滿',
      formBadge: '【形態 I · 極地薩滿】',
      fullTitle: '薩米巫師與極光狼',
      themeColor: '#38bdf8',
      secondaryColor: '#67e8f9',
      auraStyle: 'aurora_green',
      transformQuote: "「北緯66°33'的極夜風雪，由古老薩米神鼓永恆守望。」",
      boxDynamicPattern: '極地微風浮游',
    },
    2: {
      phaseNumber: 2,
      formName: '拉普蘭火狐極光共鳴體',
      formBadge: '【形態 II · 火狐極光共鳴】',
      fullTitle: '極光神使 · 火狐大薩滿',
      themeColor: '#ec4899',
      secondaryColor: '#10b981',
      auraStyle: 'firefox_aurora',
      transformQuote: '「拉普蘭的極光火狐正在天空奔馳，這片極夜絕非你能踏足！」',
      boxDynamicPattern: '極光風暴垂直升降浮動',
    },
    3: {
      phaseNumber: 3,
      formName: '吞日魔狼芬里爾真身召喚',
      formBadge: '【形態 III · 諸神黃昏芬里爾吞天】',
      fullTitle: '極夜吞天神 · 芬里爾魔狼真靈',
      themeColor: '#f43f5e',
      secondaryColor: '#a855f7',
      auraStyle: 'fenrir_crimson',
      transformQuote: '「芬里爾魔狼真身降世！連太陽都將被這片極夜冰霜吞噬！」',
      boxDynamicPattern: '極圈反重力旋轉漂浮與撕裂',
    },
  },
  vainamoinen: {
    1: {
      phaseNumber: 1,
      formName: '卡勒瓦拉創世詩聖',
      formBadge: '【形態 I · 創世詩聖】',
      fullTitle: '老賢者 萬奈摩寧',
      themeColor: '#facc15',
      secondaryColor: '#eab308',
      auraStyle: 'golden_strings',
      transformQuote: '「五弦神琴撥動微風，卡勒瓦拉的古歌永不湮滅。」',
      boxDynamicPattern: '五弦樂章緩慢搖曳',
    },
    2: {
      phaseNumber: 2,
      formName: '花崗岩銅殿音律大宗師',
      formBadge: '【形態 II · 音律大宗師】',
      fullTitle: '神琴律動 · 萬奈摩寧',
      themeColor: '#fbbf24',
      secondaryColor: '#c084fc',
      auraStyle: 'copper_resonance',
      transformQuote: '「卡勒瓦拉的天籟神琴已奏至高潮，萬物生靈皆隨我的琴音起舞！」',
      boxDynamicPattern: '琴弦拍點節奏律動擴張與收縮',
    },
    3: {
      phaseNumber: 3,
      formName: '萬物創生原初吟遊真神',
      formBadge: '【形態 III · 諸神黃昏創世神曲】',
      fullTitle: '創世始源 · 神聖詩聖萬奈摩寧',
      themeColor: '#f59e0b',
      secondaryColor: '#ec4899',
      auraStyle: 'celestial_hymn',
      transformQuote: '「聽啊！這是宇宙開天闢地的原初終曲！你能夠跟上這神聖的節奏嗎？！」',
      boxDynamicPattern: '天地神曲狂想全維度形變震盪',
    },
  },
  harald_hardrada: {
    1: {
      phaseNumber: 1,
      formName: '瓦蘭吉衛隊指揮官',
      formBadge: '【形態 I · 瓦蘭吉統帥】',
      fullTitle: '無情者 哈拉爾',
      themeColor: '#ef4444',
      secondaryColor: '#f87171',
      auraStyle: 'steel_blade',
      transformQuote: '「拜占庭瓦蘭吉的鐵血誓言，鑄就了這柄永不生鏽的戰斧。」',
      boxDynamicPattern: '戰士巡步重踏',
    },
    2: {
      phaseNumber: 2,
      formName: '斯坦福橋最後狂戰之王',
      formBadge: '【形態 II · 狂戰之王】',
      fullTitle: '血誓狂神 · 雙斧哈拉爾',
      themeColor: '#dc2626',
      secondaryColor: '#fbbf24',
      auraStyle: 'blood_berserk',
      transformQuote: '「斯坦福橋的血戰尚未結束！我的雙斧渴望飲下更多敵人之血！」',
      boxDynamicPattern: '狂戰士巨力衝鋒衝擊波震退',
    },
    3: {
      phaseNumber: 3,
      formName: '英靈殿諸神黃昏戰狂真靈',
      formBadge: '【形態 III · 諸神黃昏英靈戰神】',
      fullTitle: '瓦爾哈拉之怒 · 終極狂神哈拉爾',
      themeColor: '#991b1b',
      secondaryColor: '#f59e0b',
      auraStyle: 'valhalla_wrath',
      transformQuote: '「以奧丁與瓦爾哈拉之名！我乃最後的維京霸主，粉碎吧！」',
      boxDynamicPattern: '大地崩裂劇烈震顫與極速反衝',
    },
  },
  surtr: {
    1: {
      phaseNumber: 1,
      formName: '原初穆斯貝爾海姆炎魔',
      formBadge: '【形態 I · 原初炎魔】',
      fullTitle: '火焰巨人 史爾特爾',
      themeColor: '#ea580c',
      secondaryColor: '#f97316',
      auraStyle: 'volcanic_heat',
      transformQuote: '「穆斯貝爾海姆的地火，自世界誕生起便不曾熄滅。」',
      boxDynamicPattern: '火山地熱浮流',
    },
    2: {
      phaseNumber: 2,
      formName: '地熱裂隙甦醒黑曜火神',
      formBadge: '【形態 II · 黑曜滅世神】',
      fullTitle: '熔岩滅世神 · 史爾特爾',
      themeColor: '#c2410c',
      secondaryColor: '#fde047',
      auraStyle: 'obsidian_magma',
      transformQuote: '「地底深處的黑曜石地脈已然沸騰！整座冰島都將化為熔岩火海！」',
      boxDynamicPattern: '地熱間歇泉間歇噴衝與板塊滑移',
    },
    3: {
      phaseNumber: 3,
      formName: '諸神黃昏終焉焚界滅世神',
      formBadge: '【形態 III · 諸神黃昏終焉焚界】',
      fullTitle: '終焉世界吞噬者 · 史爾特爾完全體',
      themeColor: '#7f1d1d',
      secondaryColor: '#fbbf24',
      auraStyle: 'apocalyptic_inferno',
      transformQuote: '「諸神黃昏終焉時刻已至！我的暮光神劍將把世界燃燒殆盡！」',
      boxDynamicPattern: '地殼板塊大撕裂劇烈飄移與極限脈衝',
    },
  },
};
BOSS_FORMS_CONFIG.surtr_final = BOSS_FORMS_CONFIG.surtr;

export function getBossForm(currentHp: number, maxHp: number): 1 | 2 | 3 {
  if (maxHp <= 0) return 1;
  const ratio = currentHp / maxHp;
  if (ratio > 0.70) return 1;
  if (ratio > 0.35) return 2;
  return 3;
}

export interface DanmakuShatterShard {
  x: number;
  y: number;
  vx: number;
  vy: number;
  gravity: number;
  size: number;
  color: string;
  secondaryColor?: string;
  alpha: number;
  rot: number;
  vRot: number;
  kind: 'rune_frag' | 'stone_chip' | 'ice_crystal' | 'gold_spark' | 'lava_slag';
  char?: string;
}

// NPC 心理與情緒狀態機定義
export type NpcEmotionKey = 'skeptical' | 'warm' | 'inspired' | 'valiant';

export interface NpcEmotionState {
  key: NpcEmotionKey;
  label: string;
  emoji: string;
  badgeColor: string;
  borderClass: string;
  attitude: string;
  pixelExpression: string; // 像素臉部表情描繪符號
}

export function getNpcEmotion(courage: number): NpcEmotionState {
  if (courage < 20) {
    return {
      key: 'skeptical',
      label: '審視猶疑',
      emoji: '🤨',
      badgeColor: '#94a3b8',
      borderClass: 'border-slate-500 text-slate-300',
      attitude: '「這名旅人步伐仍有猶豫，寒風正試探著你的信念……」',
      pixelExpression: '• _ •',
    };
  }
  if (courage < 40) {
    return {
      key: 'warm',
      label: '認可親和',
      emoji: '🙂',
      badgeColor: '#38bdf8',
      borderClass: 'border-sky-500 text-sky-300',
      attitude: '「你眼中已燃起不懼風雪的探險火種，值得北境的信賴！」',
      pixelExpression: 'ᵔ ᵕ ᵔ',
    };
  }
  if (courage < 60) {
    return {
      key: 'inspired',
      label: '熱血敬佩',
      emoji: '⚡',
      badgeColor: '#f59e0b',
      borderClass: 'border-amber-500 text-amber-300',
      attitude: '「好豪邁的氣魄！真乃能繼承極夜誓約的北境豪傑！」',
      pixelExpression: '✧ ᗜ ✧',
    };
  }
  return {
    key: 'valiant',
    label: '崇敬誓約',
    emoji: '👑',
    badgeColor: '#10b981',
    borderClass: 'border-emerald-500 text-emerald-300',
    attitude: '「以奧丁與歐若拉之名！你的非凡勇氣已超越極光之巔！」',
    pixelExpression: '★ ∀ ★',
  };
}

// 根據玩家「勇氣值」動態計算 Undertale 彈幕戰鬥 Buff
export function getCourageCombatBuff(courage: number) {
  if (courage >= 60) {
    return {
      title: '👑 英靈殿之勇 (Valhalla Valor)',
      atkMultiplier: 1.55,
      soulSpeedMultiplier: 1.25,
      extraIFrames: 20,
      regenPerTurn: 18,
      critChance: 0.35,
      desc: '傷害 +55% · 移動速 +25% · 無敵幀大幅提升 · 每輪自動戰意回血 +18 HP！',
      tagColor: 'bg-emerald-950 border-emerald-500 text-emerald-300',
    };
  }
  if (courage >= 40) {
    return {
      title: '⚡ 勇者無懼 (Fearless Heart)',
      atkMultiplier: 1.35,
      soulSpeedMultiplier: 1.15,
      extraIFrames: 12,
      regenPerTurn: 8,
      critChance: 0.20,
      desc: '傷害 +35% · 移動速 +15% · 受擊無敵時間 +12 幀 · 暴擊率 +20%！',
      tagColor: 'bg-amber-950 border-amber-500 text-amber-300',
    };
  }
  if (courage >= 20) {
    return {
      title: '🛡️ 勇氣戰吼 (Courage Cry)',
      atkMultiplier: 1.20,
      soulSpeedMultiplier: 1.08,
      extraIFrames: 6,
      regenPerTurn: 0,
      critChance: 0.10,
      desc: '傷害 +20% · 移動速 +8% · 受擊無敵時間 +6 幀！',
      tagColor: 'bg-sky-950 border-sky-500 text-sky-300',
    };
  }
  return {
    title: '❄️ 探索初心 (Novice Will)',
    atkMultiplier: 1.05,
    soulSpeedMultiplier: 1.0,
    extraIFrames: 0,
    regenPerTurn: 0,
    critChance: 0.05,
    desc: '傷害 +5% · 與 NPC 對話累積勇氣值可解鎖強大戰意 Buff 與隱藏任務！',
    tagColor: 'bg-slate-900 border-slate-700 text-slate-300',
  };
}

// 勇氣值專屬解鎖戰鬥輔助技能定義
export interface CombatSkill {
  id: 'warcry' | 'blessing' | 'aegis';
  name: string;
  icon: string;
  minCourage: number;
  cooldownTurns: number;
  description: string;
  flavor: string;
  badgeColor: string;
}

export const COMBAT_SKILLS: CombatSkill[] = [
  {
    id: 'warcry',
    name: '維京戰吼',
    icon: '🪓',
    minCourage: 20,
    cooldownTurns: 3,
    description: '激發瓦爾哈拉狂熱！下 2 回合暴擊率提升至 70%，打擊傷害增加 60%',
    flavor: '「瓦爾哈拉之嘯！」以狂戰士的戰意震懾強敵，刀鋒所向披靡。',
    badgeColor: 'border-amber-500 bg-amber-950/60 text-amber-300',
  },
  {
    id: 'blessing',
    name: '拉普蘭祈福',
    icon: '❄️',
    minCourage: 35,
    cooldownTurns: 3,
    description: '喚醒火狐與薩滿極光！立即回復 50 HP，隨後 2 回合每輪自動回復 15 HP',
    flavor: '「Buorre beaivi！」北緯 66° 薩米古靈神聖祝禱，驅散刺骨寒霜。',
    badgeColor: 'border-cyan-500 bg-cyan-950/60 text-cyan-300',
  },
  {
    id: 'aegis',
    name: '英靈殿守護',
    icon: '🛡️',
    minCourage: 50,
    cooldownTurns: 4,
    description: '女武神光翼庇護！在彈幕閃避回合中完全抵消前 2 次傷害，並反彈衝擊波',
    flavor: '「奧丁之盾！」女武神金翼加持，抵禦任何破滅之擊。',
    badgeColor: 'border-emerald-500 bg-emerald-950/60 text-emerald-300',
  },
];

// ==========================================
// 1.5 歷史 BOSS 戰鬥難度系統定義 (DIFFICULTY SYSTEM)
// ==========================================
export type BattleDifficulty = 'easy' | 'normal' | 'hard' | 'lunatic';

export interface DifficultyConfig {
  id: BattleDifficulty;
  name: string;
  badge: string;
  subtitle: string;
  colorTheme: string;
  hpMult: number;
  bulletSpeedMult: number;
  bulletSpawnRateMult: number;
  playerDmgMult: number;
  strikeBarSpeedMult: number;
  dodgeDuration: number;
  expMult: number;
  goldMult: number;
  desc: string;
}

export const DIFFICULTY_CONFIGS: Record<BattleDifficulty, DifficultyConfig> = {
  easy: {
    id: 'easy',
    name: '冒險者',
    badge: '🌱 簡單',
    subtitle: '入門巡禮',
    colorTheme: 'text-emerald-400 border-emerald-500/60 bg-emerald-950/40',
    hpMult: 0.75,
    bulletSpeedMult: 0.75,
    bulletSpawnRateMult: 0.72,
    playerDmgMult: 0.7,
    strikeBarSpeedMult: 0.8,
    dodgeDuration: 4.5,
    expMult: 1.0,
    goldMult: 1.0,
    desc: '彈幕稀疏、移動速度減緩，容錯率高，適合專注體驗北歐歷史誓約劇情的旅人。',
  },
  normal: {
    id: 'normal',
    name: '北歐史詩',
    badge: '⚔️ 普通',
    subtitle: '標準誓約',
    colorTheme: 'text-amber-400 border-amber-500/60 bg-amber-950/40',
    hpMult: 1.0,
    bulletSpeedMult: 1.0,
    bulletSpawnRateMult: 1.0,
    playerDmgMult: 1.0,
    strikeBarSpeedMult: 1.0,
    dodgeDuration: 5.5,
    expMult: 1.0,
    goldMult: 1.0,
    desc: '正統 Undertale 彈幕節奏，考驗走位擦彈（Graze）與歷史對抗應答。',
  },
  hard: {
    id: 'hard',
    name: '狂戰士之怒',
    badge: '🔥 困難',
    subtitle: '狂怒考驗',
    colorTheme: 'text-rose-400 border-rose-500/60 bg-rose-950/40',
    hpMult: 1.35,
    bulletSpeedMult: 1.25,
    bulletSpawnRateMult: 1.35,
    playerDmgMult: 1.3,
    strikeBarSpeedMult: 1.25,
    dodgeDuration: 6.5,
    expMult: 1.5,
    goldMult: 1.5,
    desc: 'BOSS 血量大幅提升，彈幕速度加快且交錯密集，通關獲得 1.5 倍 EXP 與金幣！',
  },
  lunatic: {
    id: 'lunatic',
    name: '諸神黃昏',
    badge: '💀 地獄',
    subtitle: '極限彈幕地獄',
    colorTheme: 'text-purple-400 border-purple-500/60 bg-purple-950/40',
    hpMult: 1.75,
    bulletSpeedMult: 1.48,
    bulletSpawnRateMult: 1.65,
    playerDmgMult: 1.55,
    strikeBarSpeedMult: 1.45,
    dodgeDuration: 7.5,
    expMult: 2.2,
    goldMult: 2.2,
    desc: '狂人等級！雙螺旋交叉彈幕、極速攻擊條，每次擦彈獎勵雙倍勇氣，享受最極致的心跳體驗！',
  },
};

// ==========================================
// 2. 3 PRIMARY STORY NPCS WITH INTERACTIVE DIALOGUE TREES
// ==========================================

export const PRIMARY_STORY_NPCS: PrimaryStoryNpc[] = [
  // ==================== CHAPTER 0: DENMARK (COPENHAGEN) ====================
  {
    id: 'npc_elder_erik',
    name: '埃里克先知長老 (Elder Erik)',
    title: '維京誓約記錄官 · 丹麥王權考據',
    role: '丹麥主線劇情導師 · 第一位誓約傳承者',
    avatar: '📜',
    spriteType: 'scholar',
    chapterId: 'chapter0',
    x: 210,
    y: 365,
    rewardExp: 80,
    rewardGold: 120,
    buffReward: '維京誓約護符 (攻擊力 +20%)',
    hiddenQuest: {
      id: 'hq_viking_axe',
      title: '瓦爾哈拉古代戰斧試煉',
      desc: '當勇氣值達到 30 時，維京先知長老傳承奧丁的遠古狂戰戰斧，在彈幕戰中激發破空暴擊！',
      minCourage: 30,
      rewardBuff: '奧丁狂戰斧魂 (傷害 +45% · 暴擊率 +30%)',
      rewardExp: 150,
      rewardGold: 220,
    },
    dialogueTree: {
      start: {
        text: '「願奧丁的雙鴉指引你，遠方而來的旅者！極夜已深，彩色木屋下的新港正瀰漫著安徒生童話與維京英魂的低語。你為何在此佇立？」',
        options: [
          {
            label: '⚔️【勇氣 +15】「我誓將踏平極夜風暴，縱使面對藍牙王亦無所畏懼！」',
            next: 'bold_path',
            courageDelta: 15,
            courageReaction: '長老眼中精芒一閃：「好狂傲的維京戰意！奧丁喜愛你這股不滅的烈火！」',
          },
          {
            label: '📜【勇氣 +8】「請問何謂北境的誓約與極夜傳奇？我想探知歷史之秘。」',
            next: 'lore_saga',
            courageDelta: 8,
            courageReaction: '長老微微頷首：「探求真理亦需堅韌之心。」',
          },
          {
            label: '🛡️【勇氣 +2】「若是遇到強敵，我是否該先暫避其鋒、求穩自保？」',
            next: 'cautious_path',
            courageDelta: 2,
            courageReaction: '長老眉頭微動：「戰士可以審慎，但直面風暴方能淬鍊鋼鐵之心！」',
          },
        ],
      },
      bold_path: {
        text: '「痛快！狂瀾將至，唯勇者生！阿馬林堡宮廣場上，統一丹麥與挪威的藍牙王哈拉爾一世正守望著王權，他的符文碎片彈幕曾撕裂無數怯懦之徒。你若有膽，老夫便授你誓約！」',
        options: [
          {
            label: '「藍牙王的符文彈幕有何歷史淵源？」',
            next: 'lore_andersen_bluetooth',
            courageDelta: 5,
            courageReaction: '「知己知彼，方是英靈殿戰士的本色！」',
          },
          { label: '「不必多言！即刻授予我探索誓約，我將正面迎戰！」', next: 'accept_quest' },
        ],
      },
      cautious_path: {
        text: '「謹慎不是懦弱，但若不敢迎向巨浪，龍首戰船便永遠離不開峽灣。唯有解開歷史之謎並在 Undertale 模式中降伏藍牙王，邊界的極光結界才會向你敞開！」',
        options: [
          { label: '「我受教了，請告訴我藍牙王的歷史真相。」', next: 'lore_andersen_bluetooth' },
          { label: '「我明白了，請指引我解開本區的誓約！」', next: 'accept_quest' },
        ],
      },
      lore_saga: {
        text: '「千年前維京先祖乘著龍首戰船橫越北海，在耶靈立下盧恩石碑。相傳唯有向每座國度的劇情導師探尋歷史真相，並在 Undertale 模式彈幕戰中降伏守護 BOSS，通往鄰國的極光結界才會解開！」',
        options: [
          { label: '「藍牙王哈拉爾一世究竟是何許人也？」', next: 'lore_andersen_bluetooth' },
          { label: '「我明白了，請指引我解開本區的誓約！」', next: 'accept_quest' },
        ],
      },
      lore_andersen_bluetooth: {
        text: '「新港 20 號曾是安徒生大師寫下《打火匣》與《豌豆公主》之所；而阿馬林堡宮廣場上，統一丹麥與挪威的藍牙王哈拉爾一世守望著王權。只有先向我探明歷史，並在彈幕決鬥中擊敗藍牙王，通往瑞典斯德哥爾摩的結界才會解開！」',
        options: [
          { label: '「請賦予我探索使命！」', next: 'accept_quest' },
        ],
      },
      accept_quest: {
        text: '「很好！接下這份【北境行者初章誓約】！前往新港運河、小美人魚雕像與蒂沃利花園，並在阿馬林堡宮迎戰藍牙王吧！願極光常伴你的利刃！」',
        options: [
          { label: '【接受誓約並解鎖本章主線】', action: 'learn_story_and_quest' },
        ],
      },
      hidden_quest_offer: {
        text: '「【勇氣共鳴】轟隆——！你身上的勇氣值激起了耶靈古石碑的遠古共鳴！奧丁的英靈殿戰士認可了你的無畏之心！老夫在此正式傳承【隱藏任務：瓦爾哈拉古代戰斧試煉】！」',
        options: [
          { label: '🔥【接下古代戰斧試煉並領取狂戰斧魂 Buff】', action: 'claim_hidden_quest' },
          { label: '暫時推遲試煉', next: 'start' },
        ],
      },
    },
  },
  {
    id: 'npc_hans_andersen',
    name: '童話詩人 漢斯 (Hans)',
    title: '安徒生童話傳承者 · 新港漫遊者',
    role: '丹麥支線歷史學者',
    avatar: '📖',
    spriteType: 'poet',
    chapterId: 'chapter0',
    x: 850,
    y: 365,
    rewardExp: 60,
    rewardGold: 100,
    buffReward: '童話靈感之羽 (敏捷 +20%)',
    dialogueTree: {
      start: {
        text: '「天哪！這片運河的波光多像一首未完成的詩歌……我是漫遊詩人漢斯，常在此追隨安徒生先生的足跡。你看見海港邊的小美人魚了嗎？」',
        options: [
          { label: '「小美人魚雕像背後有什麼不為人知的故事？」', next: 'lore_mermaid' },
          { label: '「新港彩色山牆木屋有何建造歷史？」', next: 'lore_nyhavn_history' },
          { label: '「能給我一些漫遊這座童話之都的祝福嗎？」', next: 'claim_gift' },
        ],
      },
      lore_mermaid: {
        text: '「1913 年由嘉士伯啤酒家族出資建立，雕刻家以妻子艾琳為模特兒塑造身體，臉孔則是傳奇芭蕾舞伶。她憂鬱地凝望海面，象徵著為愛追求不朽靈魂的誓約。」',
        options: [
          { label: '「新港彩色木屋又是如何建成的？」', next: 'lore_nyhavn_history' },
          { label: '「謝謝你的分享，請賜予童話祝福！」', next: 'claim_gift' },
        ],
      },
      lore_nyhavn_history: {
        text: '「1670 年代克里斯蒂安五世國王命瑞典戰俘開鑿運河，彩色木屋原是水手與商人的客棧。安徒生在此 18 號、20 號與 67 號度過了人生大半創作時光！」',
        options: [
          { label: '「請賜予童話靈感之羽！」', next: 'claim_gift' },
        ],
      },
      claim_gift: {
        text: '「願安徒生大師的羽毛筆拂過你的行囊，為你在風雪中帶來輕盈的腳步與靈巧的閃避之姿！」',
        options: [
          { label: '【領取童話靈感加護】', action: 'claim_gift' },
        ],
      },
    },
  },

  // ==================== CHAPTER 1: SWEDEN (STOCKHOLM) ====================
  {
    id: 'npc_shipwright_jacob',
    name: '造船巨匠 雅各布 (Master Jacob)',
    title: '瓦薩號總工程督造官 · 1628 重心考據',
    role: '瑞典主線劇情導師 · 第二位誓約傳承者',
    avatar: '🔨',
    spriteType: 'shipwright',
    chapterId: 'chapter1',
    x: 210,
    y: 365,
    rewardExp: 90,
    rewardGold: 140,
    buffReward: '皇家重裝鋼甲 (物理防禦 +25%)',
    dialogueTree: {
      start: {
        text: '「嘿！小心那些滾動的原木！老夫是皇家造船總匠雅各布。這裡曾建造過波羅的海最強戰艦瓦薩號，但唉……一場盲目追求王權威風的悲劇也隨之沉睡。」',
        options: [
          { label: '「瓦薩號當年究竟為何首航就沉沒？」', next: 'lore_vasa_tragedy' },
          { label: '「斯德哥爾摩老城有什麼中世紀血色歷史？」', next: 'lore_gamla_stan' },
          { label: '「請授予我瓦薩號副本與老城誓約指引！」', next: 'accept_quest' },
        ],
      },
      lore_vasa_tragedy: {
        text: '「1628 年古斯塔夫二世強行要求在船身增設雙層重砲甲板，導致重心過高、壓艙石不足！首航出港僅 1300 公尺遇上一陣微風就翻覆沉沒……如今其幽魂艦長在博物館深處化身重砲 BOSS 徘徊不散！」',
        options: [
          { label: '「老城鵝卵石街道的秘密又是什麼？」', next: 'lore_gamla_stan' },
          { label: '「我將前往沉船博物館平息船長冤魂！」', next: 'accept_quest' },
        ],
      },
      lore_gamla_stan: {
        text: '「老城 Gamla Stan 的窄巷 Mårten Trotzigs Gränd 僅 90 公分寬！而大廣場曾是 1520 年著名的『斯德哥爾摩血案』刑場。唯有淨化瓦薩號幽靈船長，通往極北芬蘭拉普蘭的寒霜航線才會開放！」',
        options: [
          { label: '「我已明白，請授予造船匠之誓約！」', next: 'accept_quest' },
        ],
      },
      accept_quest: {
        text: '「穿上老夫鍛造的【皇家重裝鋼甲】！前往瓦薩沉船博物館，在加農砲彈幕中戰勝幽靈船長，為 300 年前的恥辱劃下休止符！」',
        options: [
          { label: '【接受誓約並解鎖本章劇情】', action: 'learn_story_and_quest' },
        ],
      },
    },
  },
  {
    id: 'npc_archivist_elena',
    name: '金廳典禮官 艾蓮娜 (Archivist Elena)',
    title: '諾貝爾獎晚宴主理官 · 梅拉倫湖誓約者',
    role: '瑞典支線皇家典籍官',
    avatar: '👑',
    spriteType: 'archivist',
    chapterId: 'chapter1',
    x: 850,
    y: 365,
    rewardExp: 75,
    rewardGold: 110,
    buffReward: '梅拉倫湖金箔庇佑 (魔法防禦 +30%)',
    dialogueTree: {
      start: {
        text: '「致敬，品味卓越的旅人！我是市政廳皇家典禮官艾蓮娜。每年的 12 月 10 日，世界頂尖智慧齊聚於藍廳與金廳，以人類理性的光芒照亮寒冬。」',
        options: [
          { label: '「金廳的 1800 萬塊鍍金馬賽克有何典故？」', next: 'lore_golden_hall' },
          { label: '「諾貝爾博物館的翻轉椅背是真的嗎？」', next: 'lore_nobel_chairs' },
          { label: '「請賜予金廳典禮官的神聖護符！」', next: 'claim_gift' },
        ],
      },
      lore_golden_hall: {
        text: '「金廳壁畫正中央是手捧王冠的『梅拉倫湖女王』，象徵斯德哥爾摩受到世界各國崇敬。整座大廳由 1800 萬塊拜占庭式鍍金玻璃磚鑲嵌，閃爍著不朽的金色榮光。」',
        options: [
          { label: '「諾貝爾咖啡廳的簽名椅是怎麼回事？」', next: 'lore_nobel_chairs' },
          { label: '「多麼壯麗的藝術，請賜予金箔庇佑！」', next: 'claim_gift' },
        ],
      },
      lore_nobel_chairs: {
        text: '「在大廣場的諾貝爾博物館咖啡廳，每位獲獎者都會在椅子底部親筆簽名，翻過椅座就能親眼目睹愛因斯坦等巨匠的真跡！這是智慧傳承的奇蹟。」',
        options: [
          { label: '【領取梅拉倫湖金箔庇佑】', action: 'claim_gift' },
        ],
      },
      claim_gift: {
        text: '「願金廳中梅拉倫湖女王的金箔光輝覆蓋你的靈魂，為你抵禦一切狂暴魔法的侵蝕！」',
        options: [
          { label: '【接受金箔加護】', action: 'claim_gift' },
        ],
      },
    },
  },

  // ==================== CHAPTER 2: FINLAND (LAPLAND / ROVANIEMI) ====================
  {
    id: 'npc_lapland_nilas',
    name: '薩米極光薩滿 尼拉斯 (Nilas)',
    title: '拉普蘭極光引路人 · 火狐傳奇長老',
    role: '芬蘭拉普蘭主線劇情導師 · 第三位誓約傳承者',
    avatar: '🦌',
    spriteType: 'sami',
    chapterId: 'chapter2',
    x: 210,
    y: 365,
    rewardExp: 100,
    rewardGold: 160,
    buffReward: '極狐雪印加護 (閃避率 +25%)',
    hiddenQuest: {
      id: 'hq_shaman_drum',
      title: '極光古薩滿神鼓之謎',
      desc: '當勇氣值達到 35 時，薩米薩滿傳承刻有太陽神象徵的古符神鼓，可在彈幕戰中激發極光護盾與每輪戰意回血！',
      minCourage: 35,
      rewardBuff: '薩米神鼓極光佑 (無敵時間 +50% · 戰意回血 +15 HP)',
      rewardExp: 180,
      rewardGold: 260,
    },
    dialogueTree: {
      start: {
        text: '「Buorre beaivi！歡迎踏入北緯 66°33′ 的極圈雪原。在白雪掩映的原始針葉林中，極光正在漆黑的蒼穹深處起舞。你所尋求的是何種智慧？」',
        options: [
          {
            label: '🐺【勇氣 +15】「我願直面極光巨狼芬里爾，為拉普蘭守護純淨的極夜！」',
            next: 'bold_fenrir',
            courageDelta: 15,
            courageReaction: '薩滿驚喜地輕撫鹿角神杖：「年輕的靈魂竟有如火狐奔原般的赤子勇魄！」',
          },
          {
            label: '❄️【勇氣 +8】「請向我講述火狐奔馳雪原 (Revontulet) 與薩米神鼓之秘。」',
            next: 'lore_revontulet',
            courageDelta: 8,
            courageReaction: '薩滿撫摸神鼓：「智慧與敬畏乃是穿越極夜的雙翼。」',
          },
          {
            label: '🛖【勇氣 +2】「外頭的暴風雪太可怖了，我能否先躲進暖和的玻璃圓頂冰屋？」',
            next: 'cautious_igloo',
            courageDelta: 2,
            courageReaction: '薩滿微笑搖頭：「冰屋雖暖，但極光只會照亮敢於走出風雪之人的雙眼。」',
          },
        ],
      },
      bold_fenrir: {
        text: '「好氣魄！在 Kakslauttanen 冰雪祭壇上，巨狼芬里爾引導著暴雪，薩滿神鼓也將召喚出極光光束彈幕！只有心懷至純勇氣的冒險者，才能在 Undertale 彈幕戰中安然穿梭！」',
        options: [
          {
            label: '「極光光束彈幕背後有何薩米歷史典故？」',
            next: 'lore_revontulet',
            courageDelta: 5,
            courageReaction: '「萬物皆有靈，聆聽風雪之音吧！」',
          },
          { label: '「我已毫無懼色，請即刻授予我探索誓約！」', next: 'accept_quest' },
        ],
      },
      cautious_igloo: {
        text: '「玻璃冰屋的電熱防霜玻璃能守護你的軀體，但無法融化心靈的恐懼。若想抵達世界終焉的冰島，你必須學會與芬里爾的冰霜風暴共舞！」',
        options: [
          { label: '「我受教了，請向我講述火狐奔馳的秘密。」', next: 'lore_revontulet' },
          { label: '「我已鼓起勇氣，指引我前往祭壇吧！」', next: 'accept_quest' },
        ],
      },
      lore_lapland: {
        text: '「北緯 66°33′ 是世界極夜與永晝的分界線。薩米人世代牧鹿而居，而聖誕老人村的專屬郵戳承載著全世界的平安夜祝福。但在冰雪祭壇深處，被暗夜幽靈侵蝕的極光巨狼芬里爾正威脅著極圈的安寧！」',
        options: [
          { label: '「傳說中的火狐極光又是怎麼回事？」', next: 'lore_revontulet' },
          { label: '「指引我前進，我將淨化極圈守護靈！」', next: 'accept_quest' },
        ],
      },
      lore_revontulet: {
        text: '「當神奇的白狐在極夜雪原奔馳，蓬鬆的尾巴掃起萬千雪花撞擊天幕，摩擦出的火星點亮了北歐的天空！唯有吹響極光之笛，方能平息風暴！」',
        options: [
          { label: '「指引我前進，接受極地試煉！」', next: 'accept_quest' },
        ],
      },
      accept_quest: {
        text: '「拿上這張【極地探險通行誓約】！駕馭馴鹿雪橇，造訪玻璃冰屋與聖誕老人辦公室，並在祭壇上降伏巨狼！極光的祝福將認可你的前行！」',
        options: [
          { label: '【接受薩米誓約並解鎖本章主線】', action: 'learn_story_and_quest' },
        ],
      },
      hidden_quest_offer: {
        text: '「【極光共鳴】嗡——！古老薩米神鼓發出了前所未有的祥和震鳴！你的勇氣值已讓極光火狐低頭致敬！老夫在此授予你【隱藏任務：極光古薩滿神鼓之謎】！」',
        options: [
          { label: '✨【接下神鼓之謎並領取神鼓極光佑 Buff】', action: 'claim_hidden_quest' },
          { label: '暫時推遲試煉', next: 'start' },
        ],
      },
    },
  },
  {
    id: 'npc_elf_toppu',
    name: '聖誕郵政長 托普 (Elf Postmaster Toppu)',
    title: '聖誕老人村總管 · 極圈郵戳守護精靈',
    role: '拉普蘭支線精靈長老',
    avatar: '✉️',
    spriteType: 'elf',
    chapterId: 'chapter2',
    x: 850,
    y: 365,
    rewardExp: 80,
    rewardGold: 130,
    buffReward: '平安夜神聖祝福 (每回合回復 25 HP)',
    dialogueTree: {
      start: {
        text: '「叮噹！雪橇鈴聲響起來了！我是北極圈總郵局的精靈郵長托普。全世界寄給聖誕老人的信件堆成了小山，我們正在日夜分揀蓋上專屬極地郵戳呢！」',
        options: [
          { label: '「聖誕老人村的專屬郵戳有何特別意義？」', next: 'lore_santa_post' },
          { label: '「馴鹿雪橇在深雪裡奔馳的秘密是什麼？」', next: 'lore_reindeer_hooves' },
          { label: '「能給我寄出一封帶有極圈魔力的平安夜卡片嗎？」', next: 'claim_gift' },
        ],
      },
      lore_santa_post: {
        text: '「每年有超過 200 個國家、50 萬封信件湧入這裡！只要從村內的橘色郵筒寄出，就會加蓋經過芬蘭官方認證的北極圈特製聖誕老人郵戳，能為收信人保佑一整年的平安！」',
        options: [
          { label: '「那馴鹿在雪地奔馳的秘密呢？」', next: 'lore_reindeer_hooves' },
          { label: '「太美妙了！請賜予我平安夜祝福！」', next: 'claim_gift' },
        ],
      },
      lore_reindeer_hooves: {
        text: '「馴鹿的蹄子在寒冬會收縮變硬，邊緣宛如天然冰爪切入冰雪；夏天則變軟增加接地面積！牠們還能看見紫外線，在極夜風雪中也能辨識苔原路徑。」',
        options: [
          { label: '【領取平安夜神聖祝福】', action: 'claim_gift' },
        ],
      },
      claim_gift: {
        text: '「叮鈴！這張【平安夜極圈賀卡】贈予你！溫暖的聖誕壁爐之火將隨行守護你，每回合持續治癒你的傷痛！」',
        options: [
          { label: '【收下祝福賀卡】', action: 'claim_gift' },
        ],
      },
    },
  },

  // ==================== CHAPTER 3: FINLAND (HELSINKI) ====================
  {
    id: 'npc_bard_urho',
    name: '卡勒瓦拉琴師 烏爾霍 (Bard Urho)',
    title: '芬蘭史詩傳承者 · 岩石教堂吟遊詩人',
    role: '赫爾辛基主線劇情導師 · 第四位誓約傳承者',
    avatar: '🪕',
    spriteType: 'bard',
    chapterId: 'chapter3',
    x: 210,
    y: 365,
    rewardExp: 110,
    rewardGold: 170,
    buffReward: '史詩康特勒共鳴 (技能傷害 +25%)',
    dialogueTree: {
      start: {
        text: '「叮咚……天然花崗岩的回音是大地最古老的歌聲。我是卡勒瓦拉琴師烏爾霍。你可曾聽見岩石教堂銅線穹頂下，史詩賢者萬奈摩寧的琴音？」',
        options: [
          { label: '「岩石教堂究竟是如何在整塊岩盤中炸開建造的？」', next: 'lore_rock_church' },
          { label: '「史詩英雄萬奈摩寧為何被尊為卡勒瓦拉永恆賢者？」', next: 'lore_vainamoinen_epic' },
          { label: '「我準備好接受花崗岩音律與史詩試煉了！」', next: 'accept_quest' },
        ],
      },
      lore_rock_church: {
        text: '「1969 年建築師蘇馬萊寧兄弟直接在十億年古老花崗岩中爆破炸開洞窟！頂部以長達 22 公里的紫銅帶盤繞成同心圓，保留粗糙未經打磨的岩石牆壁，形成了完美的天然音響殿堂！」',
        options: [
          { label: '「萬奈摩寧的梭子魚琴又有何傳奇？」', next: 'lore_vainamoinen_epic' },
          { label: '「指引我前進，我將挑戰萬奈摩寧！」', next: 'accept_quest' },
        ],
      },
      lore_vainamoinen_epic: {
        text: '「在《卡勒瓦拉》中，萬奈摩寧取大梭子魚的顎骨造成了第一把康特勒琴（Kantele），當他撫琴高歌，森林裡的熊、天上的飛鳥與湖中的水神皆為之落淚！在彈幕戰中，他的琴音化為音波符刃，需格外小心閃避！」',
        options: [
          { label: '「請賦予我挑戰琴音的誓約！」', next: 'accept_quest' },
        ],
      },
      accept_quest: {
        text: '「很好！帶著這把共鳴之琴，穿行於岩石教堂與參議院廣場，在教堂穹頂正下方挑戰萬奈摩寧吧！擊敗他即可解鎖通往挪威特羅姆瑟的峽灣航路！」',
        options: [
          { label: '【接受誓約並解鎖本章劇情】', action: 'learn_story_and_quest' },
        ],
      },
    },
  },
  {
    id: 'npc_sauna_martta',
    name: '桑拿大師 瑪爾塔 (Mestari Martta)',
    title: 'Löyly 煙燻桑拿掌門 · 設計之都工藝師',
    role: '赫爾辛基支線文化傳奇人物',
    avatar: '🧖',
    spriteType: 'sauna',
    chapterId: 'chapter3',
    x: 850,
    y: 365,
    rewardExp: 90,
    rewardGold: 140,
    buffReward: '冰海桑拿煥發 (全異常狀態免疫)',
    dialogueTree: {
      start: {
        text: '「Terve！進來烤一會兒吧！在芬蘭，桑拿不是奢侈品，而是靈魂的澡堂。全芬蘭有 550 萬人口，卻有超過 330 萬座桑拿房！你看波羅的海的冰海正冒著白煙呢！」',
        options: [
          { label: '「『Löyly』這個詞在芬蘭語中代表什麼含義？」', next: 'lore_loyly_meaning' },
          { label: '「跳入結冰的波羅的海真的不會凍僵嗎？」', next: 'lore_ice_swimming' },
          { label: '「請賜予我正宗芬蘭桑拿的淨化加護！」', next: 'claim_gift' },
        ],
      },
      lore_loyly_meaning: {
        text: '「『Löyly』特指當水潑灑在燒紅桑拿石上瞬間升騰的蒸氣！在古芬蘭信仰中，這是生命靈魂之息（Henki），蒸氣會洗滌人世間所有的焦慮、毒素與疲憊。」',
        options: [
          { label: '「那冰海冬泳（Avantouinti）又是怎樣的體驗？」', next: 'lore_ice_swimming' },
          { label: '「太神奇了，請為我進行蒸氣洗禮！」', next: 'claim_gift' },
        ],
      },
      lore_ice_swimming: {
        text: '「在 90°C 的煙燻桑拿蒸出大汗後，直接光腳跑進零下 2°C 的波羅的海冰洞浸泡！極速溫差刺激血管收縮與內啡肽狂飆，全身毛孔如獲新生，這就是北歐長壽的秘訣！」',
        options: [
          { label: '【接受冰海桑拿煥發加護】', action: 'claim_gift' },
        ],
      },
      claim_gift: {
        text: '「拿上這束白樺樹枝（Vihta）的清香洗禮！你的體魄已百毒不侵，在未來的戰鬥中將完全免疫任何冰凍與詛咒異常！」',
        options: [
          { label: '【領取桑拿淨化加護】', action: 'claim_gift' },
        ],
      },
    },
  },

  // ==================== CHAPTER 4: NORWAY (OSLO & TROMSØ) ====================
  {
    id: 'npc_captain_aslak',
    name: '極光領航船長 阿斯拉克 (Captain Aslak)',
    title: '北冰洋極光破冰船長 · 峽灣航海家',
    role: '挪威主線劇情導師 · 第五位誓約傳承者',
    avatar: '⚓',
    spriteType: 'captain',
    chapterId: 'chapter4',
    x: 210,
    y: 365,
    rewardExp: 120,
    rewardGold: 190,
    buffReward: '破冰航海者意志 (暴擊傷害 +35%)',
    dialogueTree: {
      start: {
        text: '「嗚——！北冰洋的冷風吹不滅航海者的熱血！我是特羅姆瑟極光船長阿斯拉克。這裡是被雪峰峽灣環繞的『北極之門』，也是最後的維京國王無情者哈拉爾的狂暴戰場！」',
        options: [
          { label: '「特羅姆瑟為何被稱為北極圈門戶？」', next: 'lore_tromso_gateway' },
          { label: '「最後的維京戰王哈拉爾三世有何功過？」', next: 'lore_hardrada_history' },
          { label: '「請賦予我峽灣破冰誓約，我將出海挑戰！」', next: 'accept_quest' },
        ],
      },
      lore_tromso_gateway: {
        text: '「歷史上阿蒙森等偉大極地探險家皆從此出港征服北極點！特羅姆瑟座落在北緯 69° 的島嶼上，四周直插雲霄的雪白峽灣山峰能阻擋外海巨浪，是全歐洲觀測極光成功率最高的海港。」',
        options: [
          { label: '「無情者哈拉爾又是如何成為 BOSS 的？」', next: 'lore_hardrada_history' },
          { label: '「指引我迎擊最後的維京國王！」', next: 'accept_quest' },
        ],
      },
      lore_hardrada_history: {
        text: '「哈拉爾三世曾任拜占庭帝國瓦蘭吉衛隊指揮官，戰無不勝，被譽為『最後的維京國王』。他在 1066 年斯坦福橋戰役英勇陣亡，象徵著古典維京時代的落幕！在 Undertale 模式中，他的狂戰士雙斧彈幕威力毀天滅地！」',
        options: [
          { label: '「我無懼狂暴怒火，賜予我誓約吧！」', next: 'accept_quest' },
        ],
      },
      accept_quest: {
        text: '「好樣的！接下這枚【峽灣破冰舵手誓約】！巡航暗夜峽灣、仰望北極大教堂，登上極光破冰船與無情者哈拉爾展開狂暴者對決！擊敗他即可取得飛往終章冰島的航線通行印信！」',
        options: [
          { label: '【接受誓約並解鎖本章劇情】', action: 'learn_story_and_quest' },
        ],
      },
    },
  },
  {
    id: 'npc_priestess_ingrid',
    name: '北極大教堂聖歌祭司 英格麗 (Priestess Ingrid)',
    title: '冰雪聖堂詠唱者 · 生命之柱哲學家',
    role: '挪威支線神聖學者',
    avatar: '❄️',
    spriteType: 'priestess',
    chapterId: 'chapter4',
    x: 850,
    y: 365,
    rewardExp: 95,
    rewardGold: 150,
    buffReward: '冰川極光聖佑 (受到的傷害 -20%)',
    dialogueTree: {
      start: {
        text: '「平安。你望見對岸那座在極光下熠熠生輝的純白三角形聖堂了嗎？我是英格麗祭司。這座北極大教堂正如一塊自冰川分裂而出的純潔冰山。」',
        options: [
          { label: '「北極大教堂的外觀設計究竟有何象徵？」', next: 'lore_arctic_cathedral' },
          { label: '「奧斯陸維格蘭雕塑公園的生命之柱寓意為何？」', next: 'lore_vigeland_monolith' },
          { label: '「請賜予神聖的冰川聖歌祝福！」', next: 'claim_gift' },
        ],
      },
      lore_arctic_cathedral: {
        text: '「建於 1965 年，建築師將薩米人傳統帳篷 Lavvu 與北冰洋浮冰裂紋結合，由 11 片漸縮混凝土板構成。東側的巨幅彩色玻璃在長夜燈火映照下，宛如基督的神聖之手破冰而出。」',
        options: [
          { label: '「奧斯陸的生命之柱又有何哲理？」', next: 'lore_vigeland_monolith' },
          { label: '「真令人肅然起敬，請賜予庇護！」', next: 'claim_gift' },
        ],
      },
      lore_vigeland_monolith: {
        text: '「維格蘭公園內 212 座雕像雕刻了整個人生輪迴。高達 14 公尺的單塊花崗岩生命之柱（Monolitten）上雕刻了 121 個人物互相攀爬掙扎，象徵人類在苦難中渴望向光明升華的永恆渴望。」',
        options: [
          { label: '【領取冰川極光聖佑加護】', action: 'claim_gift' },
        ],
      },
      claim_gift: {
        text: '「願北極聖堂的純潔冰光化為堅不可摧的護盾，為你抵禦風暴與利刃，減免所有遭受的傷害！」',
        options: [
          { label: '【接受聖佑加護】', action: 'claim_gift' },
        ],
      },
    },
  },

  // ==================== CHAPTER 5: ICELAND (REYKJAVÍK & BLUE LAGOON) ====================
  {
    id: 'npc_saga_thor',
    name: '冰火吟誦者 索爾 (Thor the Skald)',
    title: '諸神黃昏史詩守護者 · 板塊裂谷學者',
    role: '冰島終章主線劇情導師 · 第六位誓約傳承者',
    avatar: '🌋',
    spriteType: 'skald',
    chapterId: 'chapter5',
    x: 210,
    y: 365,
    rewardExp: 140,
    rewardGold: 220,
    buffReward: '創世誓約火種 (全屬性 +30%)',
    dialogueTree: {
      start: {
        text: '「站在世界盡頭的冰與火之國，你能感受到腳下大地脈動的創世之火嗎？大西洋中脊兩大板塊的裂谷在向你呼喚！這裡是北歐史詩的終焉與新生之所。」',
        options: [
          { label: '「辛格韋德利的板塊交會與民主議會有何歷史？」', next: 'lore_iceland_rift' },
          { label: '「12/31 跨年夜全城煙火與炎之巨人史爾特爾有何淵源？」', next: 'lore_surtr_fireworks' },
          { label: '「指引我迎向終章的最終決戰！」', next: 'accept_quest' },
        ],
      },
      lore_iceland_rift: {
        text: '「西元 930 年維京人在辛格韋德利開創了世界最早的民主議會 Althingi！更奇妙的是，北美板塊與歐亞板塊正以每年 2 公分拉開，地心的創世之火正透過間歇泉與藍湖溫泉噴薄而出！」',
        options: [
          { label: '「跨年夜的狂歡與炎之巨人又是怎麼回事？」', next: 'lore_surtr_fireworks' },
          { label: '「我已了解，請指引我完成北境誓約！」', next: 'accept_quest' },
        ],
      },
      lore_surtr_fireworks: {
        text: '「每年 12 月 31 日，全冰島人會圍繞社區篝火歌唱驅魔，午夜全城數十萬枚彩色煙火照亮天際！炎之巨人史爾特爾手持炎之魔劍在哈爾格林姆教堂頂端降臨，這既是諸神黃昏，亦是萬物重生的起點！」',
        options: [
          { label: '「指引我迎戰史爾特爾，成就傳奇！」', next: 'accept_quest' },
        ],
      },
      accept_quest: {
        text: '「接下這枚【北極星傳承誓約之印】！走訪黃金圈、沐浴藍湖白矽泥溫泉，並在跨年煙火的頂點戰勝史爾特爾，為你的 15 天北歐長征劃上完美句點！」',
        options: [
          { label: '【迎接終章誓約並解鎖本章劇情】', action: 'learn_story_and_quest' },
        ],
      },
    },
  },
  {
    id: 'npc_witch_freyja',
    name: '藍湖地熱侍女 弗蕾亞 (Freyja)',
    title: '藍湖地熱守護女巫 · 跨年篝火祝禱者',
    role: '冰島支線地熱守護者',
    avatar: '♨️',
    spriteType: 'witch',
    chapterId: 'chapter5',
    x: 850,
    y: 365,
    rewardExp: 110,
    rewardGold: 180,
    buffReward: '藍湖白矽泥清泉 (每回合回復 15 MP & 異常免疫)',
    dialogueTree: {
      start: {
        text: '「呼……閉上眼睛，感受這奶藍色天然溫泉中的白矽泥撫過肌膚的滋潤吧。黑色火山岩與地熱蒸汽在此交融，這是蓋亞母親賜予遠行旅者最溫柔的擁抱。」',
        options: [
          { label: '「藍湖溫泉的奶藍色湖水究竟是如何形成的？」', next: 'lore_blue_lagoon' },
          { label: '「12/31 冰島跨年社區篝火（Brenna）有何文化風俗？」', next: 'lore_brenna_bonfire' },
          { label: '「請賜予我藍湖白矽泥的終極療癒祝福！」', next: 'claim_gift' },
        ],
      },
      lore_blue_lagoon: {
        text: '「湖水來自鄰近地熱電廠抽取自地底 2000 公尺的海水與地熱水，蘊含極高濃度的二氧化矽礦物與藍綠藻微藻！當微粒在陽光折射下，呈現出夢幻的乳藍天青色，對肌膚有極強的修復力。」',
        options: [
          { label: '「冰島人跨年燒篝火的典故又是什麼？」', next: 'lore_brenna_bonfire' },
          { label: '「太神奇了，請賜予地熱清泉加護！」', next: 'claim_gift' },
        ],
      },
      lore_brenna_bonfire: {
        text: '「12 月 31 日晚間 8 點，雷克雅維克各個社區會點燃巨大的 Brenna 篝火，居民聚集歌唱象徵把舊年的晦氣與精靈厄運燒成灰燼！隨後全城家庭自發購買煙火射向天幕資助搜救隊，整個天空會化為白晝！」',
        options: [
          { label: '【領取藍湖白矽泥清泉加護】', action: 'claim_gift' },
        ],
      },
      claim_gift: {
        text: '「將這份源自藍湖深層白矽泥的純淨祝福銘刻於心！它將持續為你充盈精神魔力，陪伴你贏得最後的勝利！」',
        options: [
          { label: '【接受地熱溫泉加護】', action: 'claim_gift' },
        ],
      },
    },
  },
];

// ==========================================
// 3. 6 CHAPTERS DATA (WITH BOSS TAUNTS & STORY INTEGRATION)
// ==========================================


// ==========================================
// 2.5 ROVING HISTORICAL NPCS (斯德哥爾摩 & 冰島黃金圈 移動歷史 NPC)
// ==========================================
export interface RovingHistoricalNpc {
  id: string;
  name: string;
  title: string;
  role: string;
  chapterId: string;
  avatar: string;
  spriteType:
    | 'sailor'
    | 'scholar_bellman'
    | 'skald_egill'
    | 'geologist_hildur'
    | 'guard_christian'
    | 'herbalist_astrid'
    | 'glassblower_magnus'
    | 'herder_sampo'
    | 'architect_alvar'
    | 'ranger_katla';
  x: number;
  y: number;
  minX: number;
  maxX: number;
  dir: number; // 1 = right, -1 = left
  speed: number;
  dialogue: string;
  triviaLore: string;
  giftCourage: number;
  giftGold: number;
  giftBuff: string;
}

export const ROVING_HISTORICAL_NPCS: RovingHistoricalNpc[] = [
  // 1. Stockholm (Chapter 1) - Boatswain Olov
  {
    id: 'roving_stockholm_olov',
    name: '老水手長 奧洛夫 (Boatswain Olov)',
    title: '瓦薩號 1628 皇家水手長 · 巡弋港灣碼頭',
    role: '瓦薩沉船歷史巡察官',
    chapterId: 'chapter1',
    avatar: '🧭',
    spriteType: 'sailor',
    x: 460,
    y: 430,
    minX: 320,
    maxX: 620,
    dir: 1,
    speed: 0.85,
    dialogue: '「嘿！當心腳下的原木與加農砲！老夫在 1628 年曾親眼看著瓦薩號出港，可惜雙層重砲讓重心過高……如今我在這木棧道上日夜巡守，確保北歐的航海勇氣不滅！」',
    triviaLore: '【歷史考據】：瓦薩號全艦配置了 64 門重型青銅加農砲，首航僅航行 1300 公尺便因側風傾覆沉沒。沉船在冰冷少鹽的波羅的海底保存了 333 年，被打撈出水時原木完整度高達 98%！',
    giftCourage: 10,
    giftGold: 120,
    giftBuff: '皇家水手長之誓 (敏捷 +15% · 走位靈巧)',
  },
  // 2. Stockholm (Chapter 1) - Scholar Bellman
  {
    id: 'roving_stockholm_bellman',
    name: '金廳學者 貝爾曼 (Scholar Bellman)',
    title: '斯德哥爾摩市政廳典禮哲人 · 漫步長廊',
    role: '諾貝爾智慧考據學者',
    chapterId: 'chapter1',
    avatar: '📜',
    spriteType: 'scholar_bellman',
    x: 740,
    y: 500,
    minX: 620,
    maxX: 880,
    dir: -1,
    speed: 0.7,
    dialogue: '「請駐足片刻，旅人。仰望這座金廳吧，1800 萬塊鍍金拜占庭馬賽克玻璃磚閃爍著光華，梅拉倫湖女王正手捧王冠，象徵著世界對和平與理性的追求。」',
    triviaLore: '【歷史考據】：斯德哥爾摩市政廳金廳（Gyllene Salen）是每年諾貝爾獎晚宴舞會的舉辦場所。壁畫正中央巨大的梅拉倫湖女王受四方萬國使者朝拜，由建築師拉格納·厄斯特貝里耗時十餘年精雕而成。',
    giftCourage: 8,
    giftGold: 100,
    giftBuff: '金廳哲人之思 (受到的魔法傷害 -15%)',
  },
  // 3. Iceland (Chapter 5) - Skald Egill
  {
    id: 'roving_iceland_egill',
    name: '吟遊詩人 埃吉爾 (Skald Egill)',
    title: '辛格韋德利維京史詩吟唱者 · 巡遊大裂谷',
    role: '板塊議會史詩守護者',
    chapterId: 'chapter5',
    avatar: '🪕',
    spriteType: 'skald_egill',
    x: 390,
    y: 430,
    minX: 250,
    maxX: 550,
    dir: 1,
    speed: 0.8,
    dialogue: '「聽啊！腳下大地正在劇烈震顫，北美與歐亞兩大板塊每年以兩公分速度撕裂開來！西元 930 年維京先祖在此立下了世界最早的民主國會 Althingi，史詩之火永不熄滅！」',
    triviaLore: '【歷史考據】：辛格韋德利（Thingvellir）是世界上最早的露天民主議會所在地。在這裡，歐亞板塊與北美板塊相遇並持續撕裂，形成壯麗的大裂谷景觀與辛格瓦德拉冰川融水清泉。',
    giftCourage: 12,
    giftGold: 150,
    giftBuff: '板塊裂谷史詩詠唱 (暴擊率 +15%)',
  },
  // 4. Iceland (Chapter 5) - Geologist Hildur
  {
    id: 'roving_iceland_hildur',
    name: '地熱地質學家 希爾杜 (Geologist Hildur)',
    title: '藍湖天然溫泉與地脈觀測員 · 巡視間歇泉',
    role: '極地地熱生態守護者',
    chapterId: 'chapter5',
    avatar: '🌋',
    spriteType: 'geologist_hildur',
    x: 650,
    y: 510,
    minX: 500,
    maxX: 790,
    dir: -1,
    speed: 0.75,
    dialogue: '「地底兩千公尺湧出的沸騰地熱水，在零下十度的風雪中與深層海水交融，冷卻凝結成天然白矽泥泉。抹上一點白矽泥吧，它能抵禦世界盡頭最刺骨的霜寒！」',
    triviaLore: '【歷史考據】：藍湖（Blue Lagoon）是因鄰近地熱發電廠所排出的礦物地熱水形成的天然溫泉。富含二氧化矽與藍綠藻微藻，水質呈乳藍天青色，水溫常年維持在 37-39°C。',
    giftCourage: 10,
    giftGold: 130,
    giftBuff: '地熱白矽泥防寒甲 (受擊受傷 -15% · 冰凍免疫)',
  },
  // 5. Denmark (Chapter 0) - Royal Guard Christian
  {
    id: 'roving_cph_guard',
    name: '阿馬林堡皇家衛兵 克里斯蒂安 (Guard Christian)',
    title: '高聳熊皮帽皇家衛隊 · 巡邏阿馬林堡宮廣場',
    role: '丹麥王室親衛步兵',
    chapterId: 'chapter0',
    avatar: '💂‍♂️',
    spriteType: 'guard_christian',
    x: 480,
    y: 420,
    minX: 340,
    maxX: 640,
    dir: 1,
    speed: 0.7,
    dialogue: '「立正！這頂黑熊皮高帽傳承自 1805 年拿破崙戰爭時期。每天正午十二點，我們從羅森堡城堡行軍交接至此，守護瑪格麗特二世女王與歷史王權！」',
    triviaLore: '【歷史考據】：丹麥皇家禁衛軍（Den Kongelige Livgarde）由國王弗雷德里克三世於 1658 年創立，其標誌性的八角星帽徽與高聳黑熊皮帽歷經數百年風霜未曾更動。',
    giftCourage: 9,
    giftGold: 110,
    giftBuff: '皇家禁衛威儀 (受擊硬直減免 · 穩若泰山)',
  },
  // 6. Denmark (Chapter 0) - Herbalist Astrid
  {
    id: 'roving_cph_herbalist',
    name: '蒂沃利調香藥草師 艾絲特 (Herbalist Astrid)',
    title: '聖誕熱紅酒肉桂香料師 · 漫步新港市集',
    role: '冬夜節慶溫暖守護者',
    chapterId: 'chapter0',
    avatar: '🍷',
    spriteType: 'herbalist_astrid',
    x: 720,
    y: 490,
    minX: 580,
    maxX: 860,
    dir: -1,
    speed: 0.8,
    dialogue: '「捧起一杯冒著白煙的 Gløgg 丹麥香料熱紅酒！新鮮肉桂、丁香、橙皮與杏仁碎碎在赤紅酒液中煮沸，這就是哥本哈根冬夜最純粹的 Hygge（溫馨愜意）。」',
    triviaLore: '【文化考據】：北歐的 Gløgg 具有五百年歷史，相傳中世紀騎士在嚴寒冬日靠加入糖與香料的溫熱紅酒驅寒，今日已成為丹麥與瑞典冬夜不可或缺的傳統慶典飲品。',
    giftCourage: 8,
    giftGold: 100,
    giftBuff: '香料熱紅酒暖意 (每回合自動微量回血 HP +5%)',
  },
  // 7. Sweden (Chapter 1) - Glassblower Magnus
  {
    id: 'roving_stk_magnus',
    name: '水晶吹玻璃匠 馬格努斯 (Glassblower Magnus)',
    title: '波羅的海熔琉璃匠人 · 漫步老城最窄巷口',
    role: '瑞典水晶王國琉璃工藝師',
    chapterId: 'chapter1',
    avatar: '🔮',
    spriteType: 'glassblower_magnus',
    x: 240,
    y: 470,
    minX: 160,
    maxX: 360,
    dir: 1,
    speed: 0.75,
    dialogue: '「小心身旁的古磚！這條 90 公分窄巷連吹玻璃的長鐵管都難以橫拿！但正是這份狹小與專注，淬煉出了如北方晨霜般剔透的吹玻璃水晶。」',
    triviaLore: '【文化考據】：瑞典南部的「水晶王國」（Glasriket）自 1742 年起便以手工吹製玻璃聞名於世，Kosta Boda 與 Orrefors 水晶更被譽為北歐設計美學的極致代表。',
    giftCourage: 9,
    giftGold: 120,
    giftBuff: '晨霜琉璃稜鏡 (折射彈幕軌跡 · 判定縮小)',
  },
  // 8. Lapland (Chapter 2) - Herder Sampo
  {
    id: 'roving_lapland_sampo',
    name: '薩米馴鹿牧人 桑波 (Herder Sampo)',
    title: '極圈白線領航員 · 巡視北緯 66°33′ 碑石',
    role: '拉普蘭白線雪原嚮導',
    chapterId: 'chapter2',
    avatar: '🦌',
    spriteType: 'herder_sampo',
    x: 480,
    y: 440,
    minX: 350,
    maxX: 650,
    dir: -1,
    speed: 0.8,
    dialogue: '「跨過這條發光的白線，你就真正踏入了北極圈！白雪覆蓋的松林裡有八季更迭，馴鹿靠著苔原深處的氣味在暴風雪中奔馳，跟緊蹄印就不會迷失方向。」',
    triviaLore: '【地理考據】：北緯 66°33′ 極圈線橫跨芬蘭羅瓦涅米聖誕老人村。薩米人傳統曆法將一年分為八個季節，完美對應馴鹿的遷徙、產犢與角脫落生命週期。',
    giftCourage: 11,
    giftGold: 130,
    giftBuff: '雪原馴鹿蹄印加護 (雪地移動速度 +20%)',
  },
  // 9. Helsinki (Chapter 3) - Architect Alvar
  {
    id: 'roving_helsinki_alvar',
    name: '白樺木建築師 阿爾瓦 (Architect Alvar)',
    title: '岩石教堂與現代美學哲人 · 漫步參議院廣場',
    role: '芬蘭現代主義工藝大師',
    chapterId: 'chapter3',
    avatar: '📐',
    spriteType: 'architect_alvar',
    x: 520,
    y: 460,
    minX: 380,
    maxX: 690,
    dir: 1,
    speed: 0.7,
    dialogue: '「別把建築當作冰冷的方塊。摸摸這座岩石教堂斑駁的花崗岩，穹頂盤旋的純銅絲線如同芬蘭琴的琴弦，陽光自裂隙灑落時，整座大地都在為萬奈摩寧鳴奏！」',
    triviaLore: '【歷史考據】：赫爾辛基岩石教堂（Temppeliaukio）建於 1969 年，建築師兄弟直接在堅硬的花崗岩巨石中炸出空間，並以 22 公里長銅線盤繞成穹頂，聲學音響效果享譽全球。',
    giftCourage: 10,
    giftGold: 120,
    giftBuff: '花崗岩共振共鳴 (戰鬥 QTE 條判定寬容度 +20%)',
  },
  // 10. Iceland (Chapter 5) - Ranger Katla
  {
    id: 'roving_iceland_katla',
    name: '瓦特納冰川巡警 卡特拉 (Ranger Katla)',
    title: '黑沙灘玄武岩地質巡邏隊 · 凝望大西洋巨浪',
    role: '冰島自然遺產巡邏長',
    chapterId: 'chapter5',
    avatar: '🌊',
    spriteType: 'ranger_katla',
    x: 230,
    y: 480,
    minX: 140,
    maxX: 360,
    dir: -1,
    speed: 0.75,
    dialogue: '「站在雷尼斯黑沙灘前千萬不要背對大海！看似平靜的黑浪中藏著致命的瘋狗浪（Sneaker Waves）。抬頭看看身旁的六角玄武岩柱，那是熔岩冷卻十萬年的秩序結晶。」',
    triviaLore: '【地質考據】：雷尼斯黑沙灘（Reynisfjara）的六角玄武岩柱是由厚重玄武岩熔岩流噴發後均勻冷卻收縮裂解而成，宛如大自然的管風琴，傳說中是來不及躲避陽光化為巨石的海怪。',
    giftCourage: 12,
    giftGold: 160,
    giftBuff: '黑曜岩意志加護 (免死護盾：抵擋一次致命傷害)',
  },
];
// ==========================================
// 2.5 NORDIC REGIONAL SHOPS & VENDORS CONFIG
// ==========================================

// ==========================================
// INTERACTIVE TOWN BUILDINGS DATA & CONFIG (全章節地圖可互動特色建築)
// ==========================================
export interface InteractiveBuildingData {
  id: string;
  type: 'inn' | 'forge' | 'library' | 'cathedral' | 'observatory' | 'special_monument';
  name: string;
  subtitle: string;
  icon: string;
  x: number;
  y: number;
  description: string;
  greeting: string;
  actionButtonText: string;
  rewardType: 'full_heal' | 'attack_boost' | 'courage_lore' | 'valkyrie_shield' | 'aurora_show' | 'special_blessing';
  rewardLabel: string;
}

export interface InteractiveAnimalData {
  id: string;
  chapterId: string;
  name: string;
  species: string;
  icon: string;
  x: number;
  y: number;
  minX: number;
  maxX: number;
  cryText: string;
  story: string;
  trivia: string;
  favoriteTreat: string;
  blessingName: string;
  rewardCourage: number;
  rewardGold: number;
}

export const NORDIC_BUILDINGS_CONFIG: Record<string, InteractiveBuildingData[]> = {
  chapter0: [
    {
      id: 'cph_inn',
      type: 'inn',
      name: '阿馬林堡親衛隊壁爐酒館 (Guardsman Hearth Inn)',
      subtitle: '哥本哈根溫馨旅舍 · 柴火劈啪作響',
      icon: '🏨',
      x: 155,
      y: 195,
      description: '供應熱啤酒、烤豬肉脆皮與溫暖壁爐，各國衛兵與旅人在這裡交流心得。',
      greeting: '「歡迎進來烤烤火！旅者，外頭的運河寒風刺骨，在這裡歇歇腳，HP 與 MP 能完全回滿喔！」',
      actionButtonText: '辦理入住並完全回滿狀態',
      rewardType: 'full_heal',
      rewardLabel: '❤️ 全隊 HP & MP 完全回滿！',
    },
    {
      id: 'cph_forge',
      type: 'forge',
      name: '新港青銅與鍍銀鍛造坊 (Nyhavn Silver & Bronze Smithy)',
      subtitle: '丹麥王室認證工坊 · 火光四射',
      icon: '⚒️',
      x: 175,
      y: 535,
      description: '百年老鐵砧上鍛造著高純度青銅與精鋼，能淬鍊你的戰鬥愛心靈魂。',
      greeting: '「叮！噹！好鋼需要千錘百煉，讓我為你的愛心靈魂注能，戰鬥中的 QTE 打擊威力將大幅提升！」',
      actionButtonText: '淬鍊愛心靈魂 (提升攻擊力)',
      rewardType: 'attack_boost',
      rewardLabel: '⚡ QTE 打擊攻擊力永久 +15！',
    },
    {
      id: 'cph_library',
      type: 'library',
      name: '哥本哈根皇家古地圖檔案館 (Royal Cartography Archives)',
      subtitle: '安徒生手稿與波羅的海航海圖',
      icon: '📜',
      x: 665,
      y: 175,
      description: '保存著 17 世紀丹麥海軍古地圖、克里斯蒂安堡設計原稿與童話手抄本。',
      greeting: '「輕聲點，旅者。翻開這些羊皮紙，你能探知北歐先祖穿越冰海的非凡智慧與勇氣。」',
      actionButtonText: '研讀歷史古卷與藍圖',
      rewardType: 'courage_lore',
      rewardLabel: '🦁 勇氣值 +15 · 獲得丹麥海圖典故！',
    },
    {
      id: 'cph_cathedral',
      type: 'cathedral',
      name: '腓特烈大理石圓頂聖堂 (Frederik\'s Marble Church)',
      subtitle: '莊嚴羅馬拜占庭圓頂 · 神聖管風琴',
      icon: '⛪',
      x: 935,
      y: 195,
      description: '以挪威大理石耗時百年雕琢而成，穹頂直通天際，聖壇前散發著祥和的光環。',
      greeting: '「在北歐神聖之光的庇佑下，願你在直面強敵時無所畏懼，神盾將守護你的靈魂。」',
      actionButtonText: '聖壇前虔誠祈禱',
      rewardType: 'valkyrie_shield',
      rewardLabel: '🛡️ 獲得【女武神免傷神盾】+1 次次數！',
    },
    {
      id: 'cph_observatory',
      type: 'observatory',
      name: '圓塔天文台 (Rundetaarn Observatory)',
      subtitle: '歐洲現存最古老運作中天文觀測塔',
      icon: '🔭',
      x: 405,
      y: 175,
      description: '沿著 209 公尺無階梯螺旋斜坡登頂，巨大的黃銅望遠鏡正指向天際星座。',
      greeting: '「仰望星空吧！今晚的北極星座格外明亮，連極光的微光都依稀可辨！」',
      actionButtonText: '校準天象望遠鏡',
      rewardType: 'aurora_show',
      rewardLabel: '🌌 觸發絢爛星空極光演出！',
    },
    {
      id: 'cph_special_tivoli_palace',
      type: 'special_monument',
      name: '✨ 蒂沃利古老魔幻木馬宮 (Tivoli Magic Carousel)',
      subtitle: '【地圖特殊建築】1843年華特迪士尼靈感聖殿',
      icon: '🎡',
      x: 530,
      y: 560,
      description: '建於1843年的古老奇幻東方宮殿與星光旋轉木馬，點綴著十萬顆冬日水晶燈泡，充滿童話魔力。',
      greeting: '「叮咚！古老的八音盒與旋轉木馬正在為你轉動！接受安徒生與迪士尼的奇幻星光洗禮吧！」',
      actionButtonText: '啟動魔幻星光木馬共鳴',
      rewardType: 'special_blessing',
      rewardLabel: '🌟 獲得【童話星光聖鎧】全狀態回滿 + 勇氣 +20 + 攻擊 +20！',
    },
  ],
  chapter1: [
    {
      id: 'stk_inn',
      type: 'inn',
      name: '梅拉倫湖老水手壁爐客棧 (Mälaren Sailors Inn)',
      subtitle: '斯德哥爾摩老城地下酒窖 · 燭光搖曳',
      icon: '🏨',
      x: 155,
      y: 195,
      description: '在中世紀石砌拱頂下品嚐醃鯡魚與熱肉桂咖啡，洗去一切舟車勞頓。',
      greeting: '「喝杯熱咖啡吧！今晚就在這石砌拱頂下好好睡上一覺，明天再出海！」',
      actionButtonText: '辦理入住並完全回滿狀態',
      rewardType: 'full_heal',
      rewardLabel: '❤️ 全隊 HP & MP 完全回滿！',
    },
    {
      id: 'stk_forge',
      type: 'forge',
      name: '瓦薩皇家古橡木與加農鑄造所 (Vasa Foundry)',
      subtitle: '皇家沉船青銅修復專家',
      icon: '⚒️',
      x: 175,
      y: 535,
      description: '利用沉船出水青銅合金為冒險者強化護甲，抗衝擊力極強。',
      greeting: '「這是 1628 年同款青銅砲銅！塗在你的靈魂邊框上，能抵禦最猛烈的彈幕！」',
      actionButtonText: '青銅鍍層護心鍛造',
      rewardType: 'attack_boost',
      rewardLabel: '⚡ QTE 打擊攻擊力永久 +15！',
    },
    {
      id: 'stk_library',
      type: 'library',
      name: '諾貝爾智慧金廳歷史檔案庫 (Nobel Gyllene Archives)',
      subtitle: '梅拉倫湖女王鑲嵌壁畫研究室',
      icon: '📜',
      x: 665,
      y: 175,
      description: '收藏著市政廳 1800 萬塊鍍金拜占庭馬賽克玻璃磚的修復手冊與和平獎手稿。',
      greeting: '「和平與理性是文明的基石。研讀這些篇章，願你的心靈清澈如波羅的海。」',
      actionButtonText: '研讀諾貝爾和平史詩',
      rewardType: 'courage_lore',
      rewardLabel: '🦁 勇氣值 +15 · 獲得諾貝爾考據！',
    },
    {
      id: 'stk_cathedral',
      type: 'cathedral',
      name: '斯德哥爾摩大教堂 (Storkyrkan Sanctuary)',
      subtitle: '老城 700 年皇家加冕聖所 · 聖喬治屠龍像',
      icon: '⛪',
      x: 935,
      y: 195,
      description: '高聳的哥德式紅磚大教堂，木雕聖喬治屠龍像在燭光中散發著勇氣力量。',
      greeting: '「面對如惡龍般的宿命，挺身而出的人終將得到光芒的眷顧。」',
      actionButtonText: '瞻仰屠龍聖像祈願',
      rewardType: 'valkyrie_shield',
      rewardLabel: '🛡️ 獲得【女武神免傷神盾】+1 次次數！',
    },
    {
      id: 'stk_observatory',
      type: 'observatory',
      name: '水上之都天象觀測樓 (Stockholm Stjärntornet)',
      subtitle: '群島水岸高地天文望遠鏡',
      icon: '🔭',
      x: 405,
      y: 175,
      description: '坐落於索德馬爾姆懸崖頂端，俯瞰十四座島嶼與冬夜星空。',
      greeting: '「看！北方的天空正在泛起微綠的極光弧光，預示著壯麗的旅途即將展開！」',
      actionButtonText: '觀測群島星空與極光',
      rewardType: 'aurora_show',
      rewardLabel: '🌌 觸發絢爛星空極光演出！',
    },
    {
      id: 'stk_special_nobel_organ',
      type: 'special_monument',
      name: '👑 諾貝爾藍廳皇家管風琴殿 (Nobel Organ Pavilion)',
      subtitle: '【地圖特殊建築】10,270根音管北歐最大管風琴',
      icon: '🏛️',
      x: 530,
      y: 560,
      description: '斯德哥爾摩市政廳藍廳核心聖殿，配備超過一萬根音管的傳奇管風琴與1800萬塊金廳馬賽克。',
      greeting: '「轟鳴的管風琴聲穿透波羅的海的夜空！讓諾貝爾智慧之光與梅拉倫女王為你加冕！」',
      actionButtonText: '奏響皇家萬管交響曲',
      rewardType: 'special_blessing',
      rewardLabel: '🌟 獲得【諾貝爾智慧聖冕】全狀態回滿 + 勇氣 +20 + 攻擊 +20！',
    },
  ],
  chapter2: [
    {
      id: 'lap_inn',
      type: 'inn',
      name: '極圈原木溫暖壁爐木屋 (Arctic Hearth Chalet)',
      subtitle: '拉普蘭針葉林深處 · 地暖與熱雲莓',
      icon: '🏨',
      x: 155,
      y: 195,
      description: '粗壯的原木牆壁阻絕零下三十度的暴風雪，壁爐火堆烘烤著薑餅與熱茶。',
      greeting: '「外面風雪大得很，快脫下雪靴進來！喝碗熱鹿肉湯，一覺醒來又是充實的一天！」',
      actionButtonText: '辦理入住並完全回滿狀態',
      rewardType: 'full_heal',
      rewardLabel: '❤️ 全隊 HP & MP 完全回滿！',
    },
    {
      id: 'lap_forge',
      type: 'forge',
      name: '薩米古代鹿角與精鋼工坊 (Sámi Antler & Steel Craft)',
      subtitle: '雕琢北極圈傳統獵刀與符文護符',
      icon: '⚒️',
      x: 175,
      y: 535,
      description: '使用脫落的馴鹿角與高碳鋼打造，刻有太陽神與四方風神的庇護符紋。',
      greeting: '「白鹿在嚴冬中賜予我們角冠。握緊這枚符文刀柄，你的斬擊將勢如破竹！」',
      actionButtonText: '鹿角符文淬火開刃',
      rewardType: 'attack_boost',
      rewardLabel: '⚡ QTE 打擊攻擊力永久 +15！',
    },
    {
      id: 'lap_library',
      type: 'library',
      name: '北極圈雪原古歌謠檔案室 (Polar Lore & Yoik Library)',
      subtitle: '薩米祖輩口述歷史與極夜古抄本',
      icon: '📜',
      x: 665,
      y: 175,
      description: '記錄著馴鹿遷徙路徑、極光精靈傳說與古老的薩米呼麥 Yoik 音律。',
      greeting: '「極光是北極狐尾巴在雪原上掃出的火花……靜下心來，聆聽雪落下的聲音。」',
      actionButtonText: '研讀薩米極夜傳承',
      rewardType: 'courage_lore',
      rewardLabel: '🦁 勇氣值 +15 · 獲得極地智慧！',
    },
    {
      id: 'lap_cathedral',
      type: 'cathedral',
      name: '薩米原木拉夫帳篷聖所 (Sacred Sámi Lavvu)',
      subtitle: '中心篝火燃燒 · 薩滿神鼓環繞',
      icon: '⛪',
      x: 935,
      y: 195,
      description: '傳統圓錐形帳篷頂端開孔直面星空，中心炭火散發著杜松香氣，薩滿神鼓低沉共鳴。',
      greeting: '「天地靈魂與你同在。接受自然先祖的洗禮，護盾將保你在暴雪中安然無恙。」',
      actionButtonText: '聖火前受贈神鼓祝福',
      rewardType: 'valkyrie_shield',
      rewardLabel: '🛡️ 獲得【女武神免傷神盾】+1 次次數！',
    },
    {
      id: 'lap_observatory',
      type: 'observatory',
      name: '北緯66°極光地磁雷達台 (Arctic Aurora Radar)',
      subtitle: '實時監測太陽風暴與 Kp 指數',
      icon: '🔭',
      x: 405,
      y: 175,
      description: '專業極光預警雷達，即時連線歐洲地磁台網，精準預報極光爆發時間點。',
      greeting: '「儀器正在劇烈震盪！太陽風帶電粒子正在大氣層電離，極光爆發就在眼前！」',
      actionButtonText: '啟動全天候極光雷達',
      rewardType: 'aurora_show',
      rewardLabel: '🌌 觸發絢爛星空極光演出！',
    },
    {
      id: 'lap_special_santa_post',
      type: 'special_monument',
      name: '📮 聖誕老人官方極圈總郵局 (Santa Main Post Office)',
      subtitle: '【地圖特殊建築】北緯66°33′全球唯一聖誕郵戳總部',
      icon: '📮',
      x: 530,
      y: 560,
      description: '堆滿來自全球兩百多個國家信件的原木郵政聖殿，橘色郵筒寄出的信件皆加蓋官方北極圈郵戳。',
      greeting: '「叮叮噹！精靈郵政官為你的冒險通行證蓋上了金色的【北緯66°33′極圈神聖郵戳】！」',
      actionButtonText: '加蓋北極圈官方黃金郵戳',
      rewardType: 'special_blessing',
      rewardLabel: '🌟 獲得【極圈黃金郵戳庇佑】全狀態回滿 + 勇氣 +20 + 攻擊 +20！',
    },
  ],
  chapter3: [
    {
      id: 'hel_inn',
      type: 'inn',
      name: '芬蘭白樺木桑拿與壁爐旅舍 (Birch Sauna & Inn)',
      subtitle: '赫爾辛基市集旁 · 正宗熱柴火煙燻桑拿',
      icon: '🏨',
      x: 155,
      y: 195,
      description: '先在 85°C 桑拿房中用白樺樹枝拍打舒緩筋骨，再喝一杯冰涼越橘汁，徹底滿血復活！',
      greeting: '「Löyly 蒸氣正濃！洗完桑拿再到壁爐邊打個盹，全隊體力精力立刻拉滿！」',
      actionButtonText: '享受桑拿並全回復狀態',
      rewardType: 'full_heal',
      rewardLabel: '❤️ 全隊 HP & MP 完全回滿！',
    },
    {
      id: 'hel_forge',
      type: 'forge',
      name: '卡勒瓦拉千湖音律鍛造鋪 (Kalevala Melody Forge)',
      subtitle: '將花崗岩石鳴融入金屬鑄造',
      icon: '⚒️',
      x: 175,
      y: 535,
      description: '依照琴聖萬奈摩寧的音律比例調配合金，打造帶有共鳴音浪的打擊武器。',
      greeting: '「當錘擊與琴弦產生共振，你的攻擊將不再只是力量，而是帶有破壞性的音波！」',
      actionButtonText: '音律共鳴強化鍛造',
      rewardType: 'attack_boost',
      rewardLabel: '⚡ QTE 打擊攻擊力永久 +15！',
    },
    {
      id: 'hel_library',
      type: 'library',
      name: '頌歌中央歷史檔案圖書館 (Oodi History Archives)',
      subtitle: '波浪形雲杉木頂棚 · 現代建築之巔',
      icon: '📜',
      x: 665,
      y: 175,
      description: '芬蘭獨立百年國寶級建築，館藏無數芬蘭民族史詩《卡勒瓦拉》原稿與北歐歷史。',
      greeting: '「閱讀是芬蘭人最驕傲的資產。在字裡行間，你將發現頑強不屈的 Sisu 堅毅精神。」',
      actionButtonText: '研讀芬蘭 Sisu 史詩',
      rewardType: 'courage_lore',
      rewardLabel: '🦁 勇氣值 +15 · 領悟 Sisu 精神！',
    },
    {
      id: 'hel_cathedral',
      type: 'cathedral',
      name: '岩石教堂天然花崗岩聖壇 (Temppeliaukio Altar)',
      subtitle: '直接炸開整塊花崗岩建造 · 銅線穹頂天幕',
      icon: '⛪',
      x: 935,
      y: 195,
      description: '未經雕琢的天然岩壁水滴潺潺，金銅圓頂引導自然天光，聲學共鳴無與倫比。',
      greeting: '「在大地的懷抱中靜默沉思，花崗岩的堅硬意志將化為保護你的不滅神盾。」',
      actionButtonText: '在花崗岩聖壇前靜修祈福',
      rewardType: 'valkyrie_shield',
      rewardLabel: '🛡️ 獲得【女武神免傷神盾】+1 次次數！',
    },
    {
      id: 'hel_observatory',
      type: 'observatory',
      name: '烏斯佩斯基高台觀象樓 (Uspenski Sky Lookout)',
      subtitle: '波羅的海紅磚高台 · 俯瞰港灣天際線',
      icon: '🔭',
      x: 405,
      y: 175,
      description: '立於卡塔亞諾卡半島高地，金燦燦的洋蔥圓頂下，海灣與極夜星空盡收眼底。',
      greeting: '「海灣對面的極光光暈正在擴大，點亮這盞觀測燈，引導流星群落吧！」',
      actionButtonText: '點亮高台星象信標',
      rewardType: 'aurora_show',
      rewardLabel: '🌌 觸發絢爛星空極光演出！',
    },
    {
      id: 'hel_special_smoke_sauna',
      type: 'special_monument',
      name: '🔥 波羅的海冰洞煙燻桑拿聖所 (Baltic Smoke Sauna)',
      subtitle: '【地圖特殊建築】百年柴燒黑樺木桑拿 × 冰海冬泳',
      icon: '🧖',
      x: 530,
      y: 560,
      description: '芬蘭國寶級無煙囪柴燒煙燻桑拿，搭配零下2度波羅的海冰洞冬泳，淬鍊極致的 Sisu 堅毅體魄。',
      greeting: '「嗤——！一瓢清泉澆上滾燙桑拿石，白樺木清香蒸氣瞬間包覆全身，再躍入冰海重獲新生！」',
      actionButtonText: '體驗煙燻桑拿與冰海冬泳洗禮',
      rewardType: 'special_blessing',
      rewardLabel: '🌟 獲得【Sisu 冰火不滅體】全狀態回滿 + 勇氣 +20 + 攻擊 +20！',
    },
  ],
  chapter4: [
    {
      id: 'tro_inn',
      type: 'inn',
      name: '極光獵人峽灣溫暖酒館 (Aurora Hunters Fjord Tavern)',
      subtitle: '特羅姆瑟水岸木屋 · 飄散棕起司燉肉香',
      icon: '🏨',
      x: 155,
      y: 195,
      description: '全球各地的極光攝影師齊聚於此，分享最新雲層情報，壁爐邊乾杯歡呼。',
      greeting: '「剛從外海峽灣追光回來嗎？快喝口熱薑茶，躺在舒服的羊毛床上回滿體力！」',
      actionButtonText: '辦理入住並完全回滿狀態',
      rewardType: 'full_heal',
      rewardLabel: '❤️ 全隊 HP & MP 完全回滿！',
    },
    {
      id: 'tro_forge',
      type: 'forge',
      name: '維京戰斧與精鋼甲冑鍛造爐 (Viking Battle Forge)',
      subtitle: '傳承自無情者哈拉爾戰士工坊',
      icon: '⚒️',
      x: 175,
      y: 535,
      description: '重型水力鍛錘敲打著挪威峽灣磁鐵礦，鑄造無堅不摧的瓦蘭吉雙手戰斧。',
      greeting: '「真正的維京戰士不懼任何強敵！把你的武器交給我，保證一擊破敵！」',
      actionButtonText: '維京重裝精鋼開刃',
      rewardType: 'attack_boost',
      rewardLabel: '⚡ QTE 打擊攻擊力永久 +15！',
    },
    {
      id: 'tro_library',
      type: 'library',
      name: '南森與阿蒙森極地探險檔案館 (Polar Pioneers Archives)',
      subtitle: '世界最北的極地航海探險博物館',
      icon: '📜',
      x: 665,
      y: 175,
      description: '陳列著前進號木帆船日誌、征服南北極的雪橇裝備與極地生存手冊。',
      greeting: '「向未知進發需要常人無法企及的膽魄。前輩探險家的足跡將激勵你的征程。」',
      actionButtonText: '研讀前進號極地遠征日記',
      rewardType: 'courage_lore',
      rewardLabel: '🦁 勇氣值 +15 · 獲得極地探險精神！',
    },
    {
      id: 'tro_cathedral',
      type: 'cathedral',
      name: '北極大教堂光之聖壇 (Arctic Cathedral Altar)',
      subtitle: '壯麗白色三角錐冰川幾何建築',
      icon: '⛪',
      x: 935,
      y: 195,
      description: '象徵著冰山與極光的巨幅彩色玻璃窗，在極夜幽藍暮光下投射出純潔的光之階梯。',
      greeting: '「站在這座光的殿堂前，極光的純淨守護將化作堅定盾牌，阻隔任何邪惡傷害。」',
      actionButtonText: '在彩色玻璃光芒下祈禱',
      rewardType: 'valkyrie_shield',
      rewardLabel: '🛡️ 獲得【女武神免傷神盾】+1 次次數！',
    },
    {
      id: 'tro_observatory',
      type: 'observatory',
      name: '斯托爾斯泰嫩山頂極光雷達 (Fjellheisen Peak Radar)',
      subtitle: '海拔 421 公尺懸崖觀景台 · 360 度俯瞰峽灣',
      icon: '🔭',
      x: 405,
      y: 175,
      description: '搭乘全景纜車直達山巔，整個特羅姆瑟島嶼的璀璨萬家燈火與峽灣極光天幕盡收眼底。',
      greeting: '「站上海拔四百公尺的雪嶺，極光弧線就在頭頂狂舞！啟動這座全景天文信標吧！」',
      actionButtonText: '啟動山巔極光星空光幕',
      rewardType: 'aurora_show',
      rewardLabel: '🌌 觸發絢爛星空極光演出！',
    },
    {
      id: 'tro_special_icebreaker_dock',
      type: 'special_monument',
      name: '⚓ 北極星號破冰船皇家船塢 (Polstjerna Icebreaker)',
      subtitle: '【地圖特殊建築】傳奇北極探險木造破冰船聖殿',
      icon: '🚢',
      x: 530,
      y: 560,
      description: '曾穿越北冰洋浮冰區30餘次的傳奇破冰船，船艙內保存著阿蒙森與北極獵人的航海羅盤與日誌。',
      greeting: '「汽笛長鳴！北極星號破冰船的鋼鐵龍骨正在共鳴，賦予你劈開一切冰川與風暴的霸氣！」',
      actionButtonText: '鳴響北極星號破冰汽笛',
      rewardType: 'special_blessing',
      rewardLabel: '🌟 獲得【北極破冰領航印】全狀態回滿 + 勇氣 +20 + 攻擊 +20！',
    },
  ],
  chapter5: [
    {
      id: 'ice_inn',
      type: 'inn',
      name: '冰島地熱蒸氣壁爐旅舍 (Geothermal Hearth Inn)',
      subtitle: '世界盡頭的世界樹酒館 · 天然地熱供暖',
      icon: '🏨',
      x: 155,
      y: 195,
      description: '腳下是滾燙的地熱，窗外是呼嘯的大西洋強風，喝一口黑死酒 Brennivín，無比痛快！',
      greeting: '「跨越大西洋來到冰島辛苦了！泡杯熱可可，享受兩千公尺地熱的溫暖，狀態全滿！」',
      actionButtonText: '辦理入住並完全回滿狀態',
      rewardType: 'full_heal',
      rewardLabel: '❤️ 全隊 HP & MP 完全回滿！',
    },
    {
      id: 'ice_forge',
      type: 'forge',
      name: '火山玄武岩與黑曜石鍛造坊 (Basalt & Obsidian Forge)',
      subtitle: '以 Muspelheim 始源熔岩鍛造火器',
      icon: '⚒️',
      x: 175,
      y: 535,
      description: '將六角玄武岩柱與冷卻黑曜石融合，打造帶有灼燒反傷特性的終極武器。',
      greeting: '「火山是冰島跳動的心臟！讓始源黑焰淬鍊你的武器，直面諸神黃昏的最終試煉！」',
      actionButtonText: '黑曜石熔火終極淬鍊',
      rewardType: 'attack_boost',
      rewardLabel: '⚡ QTE 打擊攻擊力永久 +15！',
    },
    {
      id: 'ice_library',
      type: 'library',
      name: '冰島薩迦維京史詩檔案館 (Icelandic Sagas Archives)',
      subtitle: '西元 930 年露天國會辛格韋德利全集',
      icon: '📜',
      x: 665,
      y: 175,
      description: '用古諾斯語完整抄寫的埃達神話 (Edda) 與諸神黃昏預言，記錄世界誕生與重生。',
      greeting: '「火與冰交織，誕生了這片土地。讀懂毀滅與重生的哲學，你將無可匹敵。」',
      actionButtonText: '研讀薩迦諸神黃昏終卷',
      rewardType: 'courage_lore',
      rewardLabel: '🦁 勇氣值 +15 · 領悟始源史詩！',
    },
    {
      id: 'ice_cathedral',
      type: 'cathedral',
      name: '哈爾格林姆巨石管風琴聖殿 (Hallgrímskirkja Sanctuary)',
      subtitle: '74.5 公尺玄武岩柱階梯風貌建築',
      icon: '⛪',
      x: 935,
      y: 195,
      description: '仿造火山冷卻六角玄武岩結構而建，大廳內 5275 根音管的巨型管風琴震撼迴響。',
      greeting: '「當管風琴奏響莊嚴聖樂，地脈的狂暴之火將平息，至高神盾將護你周全。」',
      actionButtonText: '在巨石管風琴前領受加護',
      rewardType: 'valkyrie_shield',
      rewardLabel: '🛡️ 獲得【女武神免傷神盾】+1 次次數！',
    },
    {
      id: 'ice_observatory',
      type: 'observatory',
      name: '珍珠樓地熱天象台 (Perlan Geothermal Dome)',
      subtitle: '玻璃穹頂旋轉景觀台 · 360 度眺望火山與藍湖',
      icon: '🔭',
      x: 405,
      y: 175,
      description: '坐落於六座巨大地熱熱水儲罐之上的玻璃穹頂，擁有頂級極光天文天象儀。',
      greeting: '「世界盡頭的冰島天空是宇宙最浪漫的畫布！按下星空投影，讓極光盛宴綻放吧！」',
      actionButtonText: '點亮全天候極光星空穹頂',
      rewardType: 'aurora_show',
      rewardLabel: '🌌 觸發絢爛星空極光演出！',
    },
    {
      id: 'ice_special_geyser_altar',
      type: 'special_monument',
      name: '♨️ 藍湖地熱白矽泥水晶湧泉壇 (Blue Lagoon Geyser Altar)',
      subtitle: '【地圖特殊建築】地下2000公尺乳藍矽泥湧泉聖所',
      icon: '🌋',
      x: 530,
      y: 560,
      description: '匯聚歐亞與北美板塊裂谷地熱能量與藍湖白矽泥的天然水晶湧泉，水藍圓頂每隔數分鐘直衝天際。',
      greeting: '「轟隆！晶瑩剔透的水藍地熱水泡沖天而起，火山與冰川的創世能量徹底融入你的靈魂！」',
      actionButtonText: '沐浴創世地熱白矽泥湧泉',
      rewardType: 'special_blessing',
      rewardLabel: '🌟 獲得【創世冰火神鎧】全狀態回滿 + 勇氣 +20 + 攻擊 +20！',
    },
  ],
};


// =========================================================================
// INTERACTIVE NORDIC ANIMALS (地圖可互動式動物系統 — 18隻北歐代表性靈獸)
// =========================================================================
export const NORDIC_INTERACTIVE_ANIMALS: InteractiveAnimalData[] = [
  // Chapter 0: Denmark
  {
    id: 'animal_cph_swan',
    chapterId: 'chapter0',
    name: '丹麥國鳥·皇冠瘤鵠白天鵝 (Royal Mute Swan)',
    species: '丹麥國鳥 · 安徒生《醜小鴨》原型',
    icon: '🦢',
    x: 345,
    y: 440,
    minX: 300,
    maxX: 395,
    cryText: '「咕嚕——✨（優雅地展開雪白雙翼向你頷首致意！）」',
    story: '安徒生於新港創作的不朽名篇《醜小鴨》，靈感正是來自哥本哈根運河與湖泊中優雅游弋的瘤鵠白天鵝。',
    trivia: '1984年瘤鵠正式被選為丹麥國鳥，牠們終生奉行一夫一妻制，常以長頸相交圍成愛心形狀！',
    favoriteTreat: '新港剛出爐的丹麥皇家裸麥麵包屑',
    blessingName: '🦢 白天鵝優雅之翼 (移動靈巧 +15% · HP +40)',
    rewardCourage: 12,
    rewardGold: 90,
  },
  {
    id: 'animal_cph_dachshund',
    chapterId: 'chapter0',
    name: '阿馬林堡皇家臘腸犬 瓦德瑪 (Royal Dachshund)',
    species: '丹麥王室最寵愛的宮廷御用犬',
    icon: '🐕',
    x: 685,
    y: 440,
    minX: 640,
    maxX: 735,
    cryText: '「汪汪！🐾（披著紅格紋皇家披風，開心地搖著短尾巴轉圈！）」',
    story: '丹麥女王瑪格麗特二世與亨里克親王一生鍾愛臘腸犬，宮廷臘腸犬經常出現在阿馬林堡宮陽台向民眾致意。',
    trivia: '丹麥王室的臘腸犬擁有專屬的皇家衛兵開門禮遇，甚至曾登上丹麥皇家肖像畫與郵票！',
    favoriteTreat: '哥本哈根香脆烤豬皮肉乾',
    blessingName: '🐕 皇家獵犬敏銳直覺 (暴擊率 +15% · HP +40)',
    rewardCourage: 12,
    rewardGold: 90,
  },
  {
    id: 'animal_cph_seal',
    chapterId: 'chapter0',
    name: '長堤防波堤小斑海豹 (Langelinie Harbor Seal)',
    species: '厄勒海峽親人海洋精靈',
    icon: '🦭',
    x: 960,
    y: 470,
    minX: 915,
    maxX: 1005,
    cryText: '「拍拍肚皮～🌊（在礁石上伴著小美人魚雕像拍手歡呼！）」',
    story: '每逢冬日，厄勒海峽的小斑海豹喜歡游到小美人魚雕像旁的礁石上曬太陽，與岸邊旅人對望。',
    trivia: '斑海豹能在冰冷海水中憋氣潛水長達30分鐘，厚實的皮下脂肪讓牠們在零度海水中依然溫暖自如！',
    favoriteTreat: '新鮮北海甜蝦與小鯡魚',
    blessingName: '🦭 海豹抗寒水盾 (受傷減免 +15% · HP +40)',
    rewardCourage: 12,
    rewardGold: 90,
  },
  // Chapter 1: Sweden
  {
    id: 'animal_stk_moose',
    chapterId: 'chapter1',
    name: '瑞典森林之王·白冠駝鹿 (Nordic King Moose)',
    species: '斯堪地那維亞體型最龐大的鹿科動物',
    icon: '🫎',
    x: 345,
    y: 440,
    minX: 300,
    maxX: 395,
    cryText: '「哞嗚——🌿（巨大的掌狀鹿角閃耀著北方森林的晨霜光芒！）」',
    story: '在瑞典被尊稱為「森林之王 (Skogens Konung)」，稀有白化駝鹿更被北歐民間視為神靈派來的幸運使者。',
    trivia: '成年瑞典駝鹿肩高可超過2公尺，鹿角展開寬達1.8公尺，而且牠們其實是游泳健將，能潛入水底6公尺吃水草！',
    favoriteTreat: '瑞典森林野生藍莓與鮮嫩白樺葉',
    blessingName: '🫎 森林之王巨角霸氣 (攻擊力 +18 · HP +45)',
    rewardCourage: 14,
    rewardGold: 100,
  },
  {
    id: 'animal_stk_fox',
    chapterId: 'chapter1',
    name: '斯德哥爾摩老城紅絨狐 (Gamla Stan Red Fox)',
    species: '穿梭中世紀鵝卵石巷弄的靈巧夜行者',
    icon: '🦊',
    x: 685,
    y: 440,
    minX: 640,
    maxX: 735,
    cryText: '「嚶嚶～✨（蓬鬆的大尾巴掃過雪地，歪著頭好奇地看著你！）」',
    story: '冬夜裡常有毛色火紅的北歐赤狐踏著積雪穿過斯德哥爾摩老城廣場，宛如中世紀童話裡走出的精靈。',
    trivia: '北歐赤狐能聽見積雪下1公尺深處的老鼠腳步聲，並藉助地球磁場精準躍起撲獵！',
    favoriteTreat: '瑞典傳統肉丸配越橘果醬',
    blessingName: '🦊 赤狐磁場閃避步 (擦彈判定 +20% · HP +45)',
    rewardCourage: 14,
    rewardGold: 100,
  },
  {
    id: 'animal_stk_owl',
    chapterId: 'chapter1',
    name: '梅拉倫湖極地雪鴞 (Mälaren Snowy Owl)',
    species: '瑞典皇家群島的雪白守夜者',
    icon: '🦉',
    x: 960,
    y: 470,
    minX: 915,
    maxX: 1005,
    cryText: '「咕咕——🌕（金黃色的雙眼在極夜中閃閃發亮！）」',
    story: '棲息於市政廳高塔與群島松林間的純白雪鴞，曾為無數迷失在波羅的海冰霧中的水手指引方向。',
    trivia: '雪鴞連腳趾都覆滿厚密的白色羽毛，就像穿了天然雪靴一樣，飛行時更是完全無聲！',
    favoriteTreat: '煙燻波羅的海小鮭魚片',
    blessingName: '🦉 雪鴞夜視洞察 (QTE 暴擊率 +20% · HP +45)',
    rewardCourage: 14,
    rewardGold: 100,
  },
  // Chapter 2: Lapland
  {
    id: 'animal_lap_rudolph',
    chapterId: 'chapter2',
    name: '紅鼻領頭馴鹿 魯道夫 (Rudolph the Reindeer)',
    species: '聖誕老人雪橇隊首席領航神鹿',
    icon: '🦌',
    x: 345,
    y: 440,
    minX: 300,
    maxX: 395,
    cryText: '「叮鈴鈴～🔴（紅鼻子發出溫暖紅光，親暱地蹭了蹭你的手心！）」',
    story: '在暴風雪最猛烈的平安夜，唯有魯道夫閃耀紅光的鼻子能穿透濃霧，引領聖誕老人的雪橇飛越北極圈。',
    trivia: '真實的北極馴鹿鼻子內部充滿密集微血管以加熱冰冷空氣，在紅外線熱成像下真的呈現發亮的紅鼻子！而且雌雄馴鹿都會長角！',
    favoriteTreat: '拉普蘭森林馴鹿最愛的地衣苔蘚 (Jäkälä)',
    blessingName: '🦌 魯道夫紅鼻領航光 (全能力 +15% · HP +50)',
    rewardCourage: 15,
    rewardGold: 110,
  },
  {
    id: 'animal_lap_husky',
    chapterId: 'chapter2',
    name: '極地西伯利亞哈士奇 博爾特 (Arctic Husky)',
    species: '拉普蘭雪原最熱血的雪橇犬隊長',
    icon: '🐕',
    x: 685,
    y: 440,
    minX: 640,
    maxX: 735,
    cryText: '「嗷嗚——❄️（冰藍色雙眼充滿幹勁，迫不及待想在雪原狂奔！）」',
    story: '在零下30度的拉普蘭針葉林中，哈士奇雪橇犬隊是旅人最忠誠的夥伴，越冷越興奮。',
    trivia: '極地哈士奇擁有雙層濃密毛皮，就算在零下50度的雪地裡把尾巴捲在鼻子上睡覺也不會凍傷！',
    favoriteTreat: '高熱量北極鮭魚肉條',
    blessingName: '🐕 哈士奇破風疾馳 (彈幕閃避移速 +20% · HP +50)',
    rewardCourage: 15,
    rewardGold: 110,
  },
  {
    id: 'animal_lap_arcticfox',
    chapterId: 'chapter2',
    name: '拉普蘭極光火狐 (Revontulet Arctic Fox)',
    species: '芬蘭神話中揮尾創造極光的靈狐',
    icon: '🦊',
    x: 960,
    y: 470,
    minX: 915,
    maxX: 1005,
    cryText: '「啾啾～🌌（雪白尾尖掃過雪地，激起一串翠綠色的極光星火！）」',
    story: '芬蘭語稱北極光為「Revontulet（狐狸之火）」，相傳正是極地白狐奔跑時尾巴掃起雪花摩擦天幕化為極光。',
    trivia: '北極狐的毛色會隨季節變換：冬天是純白雪色，夏天則會變成灰褐色岩石保護色！',
    favoriteTreat: '黃金北極雲莓果乾 (Lakka)',
    blessingName: '🦊 火狐極光星火佑 (觸發極光閃耀 + 勇氣加成 · HP +50)',
    rewardCourage: 18,
    rewardGold: 120,
  },
  // Chapter 3: Helsinki
  {
    id: 'animal_hel_seal',
    chapterId: 'chapter3',
    name: '芬蘭國寶·塞馬環斑海豹 (Saimaa Ringed Seal)',
    species: '全球僅存於芬蘭湖泊的冰河時期活化石',
    icon: '🦭',
    x: 345,
    y: 440,
    minX: 300,
    maxX: 395,
    cryText: '「噗嚕嚕～💧（圓滾滾的大眼睛眨呀眨，露出微笑般的嘴角！）」',
    story: '一萬年前冰河時期結束後被困在芬蘭內陸淡水湖中的珍貴海豹，是全芬蘭人最疼愛的自然保育象徵。',
    trivia: '塞馬環斑海豹全身有著獨特的淺色圓環花紋，全球野生數量僅約400餘隻，比大貓熊還要珍稀！',
    favoriteTreat: '芬蘭千湖冰水鮮魚',
    blessingName: '🦭 塞馬海豹冰河守護 (免傷神盾 +1 · HP +50)',
    rewardCourage: 15,
    rewardGold: 115,
  },
  {
    id: 'animal_hel_bear',
    chapterId: 'chapter3',
    name: '芬蘭國獸·卡勒瓦拉棕熊幼崽 (Karhu Bear Cub)',
    species: '芬蘭神話中最受敬畏的森林聖獸',
    icon: '🐻',
    x: 685,
    y: 440,
    minX: 640,
    maxX: 735,
    cryText: '「呼嚕嚕～🍯（抱著白樺木蜂蜜罐，開心地在雪地打滾！）」',
    story: '在《卡勒瓦拉》史詩中，棕熊（Otso）被視為誕生於北斗七星的神聖生靈，古代芬蘭人甚至不敢直呼其名而以蜜掌尊稱。',
    trivia: '棕熊是芬蘭的官方國獸，象徵著芬蘭民族沉穩、強大且與森林共生的 Sisu 精神！',
    favoriteTreat: '芬蘭森林野生百花蜂蜜與越橘',
    blessingName: '🐻 森林聖熊 Otso 之力 (攻擊力 +22 · HP +55)',
    rewardCourage: 16,
    rewardGold: 120,
  },
  {
    id: 'animal_hel_blackswan',
    chapterId: 'chapter3',
    name: '圖奧內拉神話天鵝 (Swan of Tuonela)',
    species: '西貝流士交響詩與卡勒瓦拉聖鳥',
    icon: '🦢',
    x: 960,
    y: 470,
    minX: 915,
    maxX: 1005,
    cryText: '「吟——🎶（長鳴聲宛如英國管獨奏般空靈悠遠！）」',
    story: '《卡勒瓦拉》中游弋於星夜聖河上的神祕天鵝，芬蘭音樂巨匠西貝流士為牠譜寫了傳世名曲《圖奧內拉的天鵝》。',
    trivia: '誰若能傾聽圖奧內拉天鵝的歌聲而不懷惡念，便能獲得跨越生死的詩篇智慧！',
    favoriteTreat: '岩石教堂銅頂凝結的晨露與漿果',
    blessingName: '🦢 聖河天鵝交響共鳴 (MP全滿 + 詠唱威力強化 · HP +50)',
    rewardCourage: 16,
    rewardGold: 120,
  },
  // Chapter 4: Norway
  {
    id: 'animal_tro_orca',
    chapterId: 'chapter4',
    name: '特羅姆瑟峽灣虎鯨 (Fjord Orca)',
    species: '追隨冬日鯡魚群游入極圈峽灣的海洋霸主',
    icon: '🐋',
    x: 345,
    y: 440,
    minX: 300,
    maxX: 395,
    cryText: '「嗚——🌊（在極光倒映的峽灣水面躍出壯觀的水花弧線！）」',
    story: '每年11月至1月極夜期間，數百頭虎鯨與座頭鯨會游入特羅姆瑟峽灣捕食鯡魚，在極光下噴出白色水柱。',
    trivia: '挪威峽灣的虎鯨家族由年長雌鯨帶領，每個家族都擁有自己世代相傳的獨特方言叫聲！',
    favoriteTreat: '北冰洋肥美銀鯡魚',
    blessingName: '🐋 峽灣虎鯨破浪衝擊 (暴擊傷害 +30% · HP +55)',
    rewardCourage: 18,
    rewardGold: 130,
  },
  {
    id: 'animal_tro_eagle',
    chapterId: 'chapter4',
    name: '挪威峽灣白尾海雕 (White-Tailed Sea Eagle)',
    species: '北歐翼展最寬的峽灣天空霸主',
    icon: '🦅',
    x: 685,
    y: 440,
    minX: 640,
    maxX: 735,
    cryText: '「唳——⚡（翼展超過兩公尺半，在海拔421公尺雪峰盤旋致意！）」',
    story: '棲息於特羅姆瑟與羅浮敦陡峭峽灣懸崖上的天空霸主，維京水手視其為奧丁神鷹的化身。',
    trivia: '白尾海雕翼展可達2.5公尺，能從數百公尺高空精準鎖定海面下的魚群，俯衝時速超過120公里！',
    favoriteTreat: '北海野生鮮鱈魚塊',
    blessingName: '🦅 海雕蒼穹之眼 (閃避與QTE精準度提升 · HP +55)',
    rewardCourage: 18,
    rewardGold: 130,
  },
  {
    id: 'animal_tro_goat',
    chapterId: 'chapter4',
    name: '挪威峽灣長毛雪山羊 (Fjord Mountain Goat)',
    species: '孕育挪威國寶焦糖棕起司 Brunost 的功臣',
    icon: '🐐',
    x: 960,
    y: 470,
    minX: 915,
    maxX: 1005,
    cryText: '「咩～🧀（踩著垂直雪崖如履平地，搖著脖子上的銅鈴！）」',
    story: '北歐神話中雷神索爾的戰車正是由兩隻神羊拉動；而在現實中，挪威峽灣山羊奶熬製出了鹹甜香濃的焦糖棕起司。',
    trivia: '挪威人喜愛棕起司（Brunost）到連切起司刨刀（Ostehøvel）都是挪威木匠在1925年發明的國寶級專利！',
    favoriteTreat: '高山雪線鮮甜苔草與燕麥',
    blessingName: '🐐 雷神戰羊堅韌體魄 (受擊傷害減免 25% · HP +55)',
    rewardCourage: 18,
    rewardGold: 130,
  },
  // Chapter 5: Iceland
  {
    id: 'animal_ice_puffin',
    chapterId: 'chapter5',
    name: '冰島大西洋北極海鸚鵡 (Atlantic Puffin)',
    species: '冰島最受喜愛的彩色鳥喙海洋小丑',
    icon: '🐧',
    x: 345,
    y: 440,
    minX: 300,
    maxX: 395,
    cryText: '「噗嚕嚕～🌈（搖擺著橘紅腳掌，嘴裡叼著一排小銀魚向你歪頭！）」',
    story: '全球約有60%的大西洋海鸚鵡在冰島玄武岩海崖築巢，呆萌的三角形彩色大嘴讓牠成為冰島最具代表性的動物明星。',
    trivia: '海鸚鵡的上顎內長有倒刺，一次可以在嘴裡整齊排列叼住多達60條小魚而不掉落！而且翅膀拍動高達每分鐘400次！',
    favoriteTreat: '大西洋冰海玉筋魚',
    blessingName: '🐧 海鸚鵡彩色幸運星 (金幣與經驗獲取 +25% · HP +60)',
    rewardCourage: 20,
    rewardGold: 150,
  },
  {
    id: 'animal_ice_horse',
    chapterId: 'chapter5',
    name: '冰島五步態純血小馬 (Icelandic Tölt Horse)',
    species: '維京時代至今血統純淨千年的神聖駿馬',
    icon: '🐎',
    x: 685,
    y: 440,
    minX: 640,
    maxX: 735,
    cryText: '「嘶鳴——✨（飄逸的金色長鬃毛在火山雪原風中飛揚！）」',
    story: '自西元982年起冰島國會便立法禁止任何外來馬匹入境，連出國比賽的冰島馬都不能再回國，維持了超過一千年的純淨維京血統。',
    trivia: '冰島馬擁有全球獨一無二的第五種步態「Tölt（溜蹄）」，騎乘時無論速度多快，騎士端著滿杯香檳都不會灑出一滴！',
    favoriteTreat: '冰島地熱溫室栽培的香脆紅蘿蔔與方糖',
    blessingName: '🐎 維京神駒溜蹄神速 (移動與攻擊全面強化 · HP +60)',
    rewardCourage: 20,
    rewardGold: 150,
  },
  {
    id: 'animal_ice_whale',
    chapterId: 'chapter5',
    name: '雷克雅維克法赫薩灣座頭鯨 (Faxaflói Humpback Whale)',
    species: '跨年煙火與極光下的深海歌者',
    icon: '🐋',
    x: 960,
    y: 470,
    minX: 915,
    maxX: 1005,
    cryText: '「嗡——🌌（空靈悠長的鯨歌與天際極光產生強烈共鳴！）」',
    story: '在雷克雅維克舊港外海的法赫薩灣，座頭鯨在火山地熱暖流與極光交織的海域中吟唱著古老的深海史詩。',
    trivia: '座頭鯨的鯨歌結構完整如交響樂，每次吟唱可持續20分鐘，聲音能在深海中傳播數千公里遠！',
    favoriteTreat: '北大西洋磷蝦群',
    blessingName: '🐋 深海鯨歌創世共鳴 (女武神免傷神盾 +2 · HP +65)',
    rewardCourage: 22,
    rewardGold: 160,
  },
];

export const NORDIC_SHOPS_CONFIG: Record<string, NordicShopData> = {
  chapter0: {
    id: 'shop_copenhagen',
    chapterId: 'chapter0',
    title: '新港聖誕熱紅酒與黃油餅乾小鋪',
    subtitle: 'Nyhavn Gløgg & Royal Butter Bakery',
    shopkeeperName: '烘焙坊女主人 瑪倫 (Baker Maren)',
    shopkeeperTitle: '哥本哈根暖心甜點師',
    shopkeeperAvatar: '🥐',
    greeting: '「歡迎來到新港！聞到剛出爐的肉桂餅乾與熱紅酒香氣了嗎？帶上一份熱騰騰的點心去挑戰藍牙王吧！」',
    x: 520,
    y: 350,
    items: [
      {
        id: 'cph_glogg',
        name: '丹麥香料熱紅酒 (Danish Gløgg)',
        icon: '🍷',
        cost: 80,
        courageRequired: 0,
        description: '以赤紅葡萄酒加肉桂、丁香、橙皮與杏仁片溫熱熬煮，北歐冬夜驅寒名物。',
        effectLabel: '立即回滿 80 HP · 戰鬥每2秒回血 3 HP',
        buffType: 'heal',
        buffValue: 80,
      },
      {
        id: 'cph_cookies',
        name: '皇家黃油餅乾罐 (Royal Butter Cookies)',
        icon: '🧈',
        cost: 120,
        courageRequired: 5,
        description: '經典金黃藍色鐵罐，濃郁丹麥純黃油烘烤，入口即化酥脆香甜。',
        effectLabel: '生命上限永久提升 +30 HP',
        buffType: 'maxHp',
        buffValue: 30,
      },
      {
        id: 'cph_mermaid_pearl',
        name: '小美人魚海藍珍珠 (Little Mermaid Pearl)',
        icon: '🧜‍♀️',
        cost: 150,
        courageRequired: 10,
        description: '長堤公園海灣浪花凝聚的純淨珍珠，賦予敏銳避險直覺。',
        effectLabel: '極限擦彈 (Graze) 判定寬容度 +6px',
        buffType: 'counterRate',
        buffValue: 25,
      },
    ],
  },
  chapter1: {
    id: 'shop_stockholm',
    chapterId: 'chapter1',
    title: '老城皇家船匠與古董商會',
    subtitle: 'Gamla Stan Shipwright & Relic Guild',
    shopkeeperName: '沉船老工匠 斯文森 (Shipwright Svensson)',
    shopkeeperTitle: '波羅的海海事遺產維護匠',
    shopkeeperAvatar: '⚓',
    greeting: '「老朽年輕時曾參與打撈瓦薩號！這些從 1628 年古沉船保留下來的青銅零件，依然擁有深海祝福！」',
    x: 520,
    y: 350,
    items: [
      {
        id: 'stk_vasa_amulet',
        name: '瓦薩號深海青銅護身符 (Vasa Amulet)',
        icon: '🛡️',
        cost: 180,
        courageRequired: 5,
        description: '以瓦薩號重砲同款青銅熔鑄的護身吊墜，刻有古老航海保護印記。',
        effectLabel: '戰鬥中額外獲得 1 次免傷神盾 (Aegis Shield)',
        buffType: 'aegis',
        buffValue: 1,
      },
      {
        id: 'stk_oak_armor',
        name: '波羅的海古橡木板護甲 (Baltic Oak Armor)',
        icon: '🪵',
        cost: 140,
        courageRequired: 0,
        description: '沉浸海底三百餘年仍未腐爛的堅硬橡木，抗衝擊韌性極佳。',
        effectLabel: '受到的彈幕傷害永久減免 20%',
        buffType: 'damageReduction',
        buffValue: 20,
      },
      {
        id: 'stk_nav_compass',
        name: '老水手長航海羅盤 (Navigator Compass)',
        icon: '🧭',
        cost: 130,
        courageRequired: 8,
        description: '鍍金指北針，在波羅的海群島迷宮中從不迷航。',
        effectLabel: '戰鬥靈巧度提升 · 移動速度 +15%',
        buffType: 'speed',
        buffValue: 15,
      },
    ],
  },
  chapter2: {
    id: 'shop_lapland',
    chapterId: 'chapter2',
    title: '北極圈聖誕精靈禮物與雪橇驛站',
    subtitle: 'Santa Village Toy & Sled Workshop',
    shopkeeperName: '精靈工匠 丁克爾 (Elf Tinkerer Tink)',
    shopkeeperTitle: '聖誕老人官方首席玩具師',
    shopkeeperAvatar: '🎅',
    greeting: '「叮叮噹！精靈們整夜都在打包聖誕禮物！你想要加裝雪橇鹿鈴，還是來件抗暴風雪的純羊毛披肩？」',
    x: 520,
    y: 350,
    items: [
      {
        id: 'lap_sled_bell',
        name: '極地雪橇奔馳鈴鐺 (Reindeer Sled Bell)',
        icon: '🦌',
        cost: 150,
        courageRequired: 0,
        description: '純銀打造的清脆鈴鐺，搖響時能凝聚馴鹿飛行的祝福神力。',
        effectLabel: 'QTE 打擊普通攻擊傷害 +25%',
        buffType: 'attack',
        buffValue: 25,
      },
      {
        id: 'lap_santa_cloak',
        name: '聖誕老人手織羊毛斗篷 (Santa Wool Cloak)',
        icon: '🧣',
        cost: 140,
        courageRequired: 10,
        description: '以極地厚純羊毛手工密織，能抵禦拉普蘭零下三十度暴雪。',
        effectLabel: '受傷無敵時間 (i-Frames) 延長 +50%',
        buffType: 'iframes',
        buffValue: 50,
      },
      {
        id: 'lap_berry_jam',
        name: '極光野生蔓越莓果醬 (Aurora Berry Jam)',
        icon: '🫐',
        cost: 90,
        courageRequired: 0,
        description: '在極光下採摘的北極雲莓與蔓越莓熬製，酸甜濃郁滋養元氣。',
        effectLabel: '立即回滿 100 HP · 勇氣值 +15',
        buffType: 'heal',
        buffValue: 100,
      },
    ],
  },
  chapter3: {
    id: 'shop_helsinki',
    chapterId: 'chapter3',
    title: '集市廣場芬蘭白樺木與肉桂捲店',
    subtitle: 'Market Square Birch & Korvapuusti',
    shopkeeperName: '市集老闆娘 艾蓮娜 (Market Host Elena)',
    shopkeeperTitle: '赫爾辛基港灣傳統料理師',
    shopkeeperAvatar: '☕',
    greeting: '「Hei！剛煮好的芬蘭三文魚湯冒著奶油白煙！再來一塊剛出爐的 Korvapuusti 肉桂捲，保證讓你精神百倍！」',
    x: 520,
    y: 350,
    items: [
      {
        id: 'hel_korvapuusti',
        name: '傳統黑麥肉桂捲 (Korvapuusti)',
        icon: '🥮',
        cost: 100,
        courageRequired: 0,
        description: '芬蘭經典肉桂捲，揉入濃郁小荳蔻香料，是每天不可或缺的 Kahvi 咖啡伴侶。',
        effectLabel: '立即回復 85 HP · 淨化負面效果',
        buffType: 'heal',
        buffValue: 85,
      },
      {
        id: 'hel_tuning_fork',
        name: '岩石教堂共鳴音叉 (Rock Church Fork)',
        icon: '🪕',
        cost: 170,
        courageRequired: 8,
        description: '在天然花崗岩石壁前校準的聲學音叉，能引導琴聖萬奈摩寧的音律之力。',
        effectLabel: '極限反擊 (Extreme Counter) 傷害 +35%',
        buffType: 'attack',
        buffValue: 35,
      },
      {
        id: 'hel_salmon_soup',
        name: '港灣鮮濃燻鮭魚湯 (Creamy Salmon Soup)',
        icon: '🐟',
        cost: 110,
        courageRequired: 0,
        description: '新鮮波羅的海鮭魚、小土豆、蒔蘿與濃郁鮮奶油燉煮，溫暖全身。',
        effectLabel: '生命上限 +20 · 傷害減免 +15%',
        buffType: 'maxHp',
        buffValue: 20,
      },
    ],
  },
  chapter4: {
    id: 'shop_tromso',
    chapterId: 'chapter4',
    title: '極光獵人防寒裝備與維京鐵匠鋪',
    subtitle: 'Aurora Hunter Gear & Viking Smithy',
    shopkeeperName: '維京鐵匠 托爾瓦德 (Smith Torvald)',
    shopkeeperTitle: '特羅姆瑟峽灣鑄造大師',
    shopkeeperAvatar: '⚔️',
    greeting: '「峽灣的狂風可不留情面！這是老夫親手敲打的維京精鋼，還有北極狼皮大衣，穿上它們直面哈拉爾王吧！」',
    x: 520,
    y: 350,
    items: [
      {
        id: 'tro_viking_mead',
        name: '維京狂戰士蜂蜜酒 (Viking Mead)',
        icon: '🍺',
        cost: 200,
        courageRequired: 10,
        description: '古維京戰士出征前痛飲的發酵蜂蜜酒，飲下後熱血沸騰勇往直前。',
        effectLabel: '攻擊力永久 +25 · QTE 完美暴擊率 +20%',
        buffType: 'attack',
        buffValue: 25,
      },
      {
        id: 'tro_wolf_coat',
        name: '特羅姆瑟北極狼皮大衣 (Arctic Wolf Coat)',
        icon: '🐺',
        cost: 160,
        courageRequired: 5,
        description: '極圈獵人深冬必備，厚實毛皮能完全阻絕冰風與暴雪侵襲。',
        effectLabel: '生命上限 +25 · 免疫減速減免傷害 15%',
        buffType: 'maxHp',
        buffValue: 25,
      },
      {
        id: 'tro_steel_shield',
        name: '瓦蘭吉衛隊鋼鐵重盾 (Varangian Shield)',
        icon: '🛡️',
        cost: 190,
        courageRequired: 12,
        description: '東羅馬帝國維京皇家親衛隊配備的重盾，正面堅不可摧。',
        effectLabel: '戰鬥中額外獲得 1 次免傷神盾 (Aegis Shield)',
        buffType: 'aegis',
        buffValue: 1,
      },
    ],
  },
  chapter5: {
    id: 'shop_iceland',
    chapterId: 'chapter5',
    title: '藍湖火山黑曜石鍊金與地熱藥水坊',
    subtitle: 'Blue Lagoon Geothermal & Rune Lab',
    shopkeeperName: '地熱鍊金師 希格露恩 (Alchemist Sigrun)',
    shopkeeperTitle: '世界盡頭火山結晶探研員',
    shopkeeperAvatar: '🌋',
    greeting: '「大地的板塊正在腳下撕裂！從兩千公尺地底噴湧出的火山黑曜石與白矽泥，是抵禦終末之火的最佳護符！」',
    x: 520,
    y: 350,
    items: [
      {
        id: 'ice_obsidian_core',
        name: '火山黑曜石核心 (Obsidian Flame Core)',
        icon: '💎',
        cost: 250,
        courageRequired: 15,
        description: '冷卻熔岩凝結而成的黑色晶體，封存著 Muspelheim 的始源火種。',
        effectLabel: '反擊蓄力速度 +50% · 反擊對BOSS造成灼燒',
        buffType: 'counterRate',
        buffValue: 50,
      },
      {
        id: 'ice_silica_mud',
        name: '藍湖天然白矽泥護甲 (Silica Mud Pack)',
        icon: '🧖',
        cost: 180,
        courageRequired: 5,
        description: '藍湖地熱泉沉積的純白天青礦物泥，深層滋養並形成耐熱隔熱保護膜。',
        effectLabel: '減免環境岩漿與極光射線傷害 30%',
        buffType: 'damageReduction',
        buffValue: 30,
      },
      {
        id: 'ice_firework_blast',
        name: '跨年雷克雅維克焰火包 (Reykjavik Fireworks)',
        icon: '🎆',
        cost: 220,
        courageRequired: 10,
        description: '冰島跨年夜全民點燃的絢爛彩色煙火，能在危急關頭驅散夜空陰霾。',
        effectLabel: '極限反擊觸發時自動清空周圍 120px 彈幕',
        buffType: 'attack',
        buffValue: 40,
      },
    ],
  },
};



// =========================================================================
// EPIC CHANT PHILOSOPHICAL COMMUNICATION TREE (史詩詠唱·靈魂對話感化系統)
// 透過與 BOSS 深度歷史對話、選擇正確的同理心選項，有機會直接和平通關 (Pacifist Spare)!
// =========================================================================
export interface EpicChantChoice {
  text: string;
  isCorrect: boolean;
  reaction: string;
}

export interface EpicChantRound {
  prompt: string;
  choices: EpicChantChoice[];
}

export interface BossEpicChantConfig {
  bossName: string;
  bossTitle: string;
  bossAvatar: string;
  rounds: EpicChantRound[];
  pacifistClearSpeech: string;
  achievementText: string;
}

export const BOSS_EPIC_CHANT_DATA: Record<string, BossEpicChantConfig> = {
  harald_bluetooth: {
    bossName: '藍牙王 哈拉爾 (Harald Bluetooth)',
    bossTitle: '丹麥統一之王 · 耶靈石碑立碑者',
    bossAvatar: '👑',
    rounds: [
      {
        prompt: '「自古強者為尊！唯有雷霆之劍與無情戰斧方能震懾四海！你這羸弱的凡人旅者，憑何要孤王放下屠刀？」',
        choices: [
          {
            text: '📜【傳唱耶靈雙石碑】「藍牙王啊，你在耶靈巨石上刻下的是基督信仰與丹麥挪威合一的和平誓言，而非永無止境的殺戮！請重拾這份護國初衷！」',
            isCorrect: true,
            reaction: '「……耶靈石碑！孤王刻在巨石上的字句，歷經千載風霜……你竟然懂得孤王當年的治國初心？」',
          },
          {
            text: '📱「你的藍牙通訊訊號只有 1 格，快換成最新款手機吧！」',
            isCorrect: false,
            reaction: '「無知的凡人！竟敢嘲弄孤王的王號！感受符文狂雷的制裁吧！」',
          },
          {
            text: '⚔️「廢話少說，看我的戰斧誰更硬！」',
            isCorrect: false,
            reaction: '「狂妄之徒！讓你在狂暴電磁彈幕中化為齏粉！」',
          },
        ],
      },
      {
        prompt: '「孤王為了部族安寧，背負了一生征戰的罪孽……凡人，你真相信這冰封極地能迎來和平？」',
        choices: [
          {
            text: '🕊️【以包容溫暖極地】「真正的王者，以胸懷容納四海。北歐的冬夜因互助而溫暖，放開戰意，同赴極光之約吧！」',
            isCorrect: true,
            reaction: '「真正的王者……胸懷四海……哈哈哈哈！好！孤王認可你的心靈！此戰已無必要，去擁抱你的極光吧！」',
          },
          {
            text: '💰「既然如此，把你的維京寶藏全交出來吧！」',
            isCorrect: false,
            reaction: '「貪婪的宵小！果然只是看中孤王的財寶！受死吧！」',
          },
        ],
      },
    ],
    pacifistClearSpeech: '👑 藍牙王哈拉爾卸下雷光王冠，露出欣慰笑容：『千百年來，你是第一位讀懂耶靈石碑真諦的旅者……這片北歐沃土，託付給你們了！』',
    achievementText: '🕊️ 丹麥和平聖者 · 耶靈石碑共鳴者',
  },
  captain_vasa: {
    bossName: '幽靈艦長 斯文森 (Captain of Vasa)',
    bossTitle: '瓦薩號 1628 皇家戰艦幽靈總督',
    bossAvatar: '⚓',
    rounds: [
      {
        prompt: '「沉睡在波羅的海泥沙三百年……孤艦首航即沉的奇恥大辱，唯有用海浪與砲火將你們吞噬方能雪恥！」',
        choices: [
          {
            text: '📜【剖析歷史工程真相】「艦長，瓦薩號的沉沒絕非海員的過失，而是國王強加過重雙層重砲導致重心失衡！你們英勇奮戰至最後一刻，無需背負這份恥辱！」',
            isCorrect: true,
            reaction: '「……並非我們航海技術的過失？國王的雙層重砲……竟是這般造化弄人……但世人難道不是都在嘲弄我們的傾覆嗎？」',
          },
          {
            text: '🚤「誰叫你們造船不用現代鋼鐵？沉了也是活該！」',
            isCorrect: false,
            reaction: '「褻瀆大皇家艦隊的狂徒！雙舷火砲，全面齊射！」',
          },
          {
            text: '💣「吃我一發魚雷砲擊！」',
            isCorrect: false,
            reaction: '「在波羅的海艦隊面前班門弄斧！全彈發射！」',
          },
        ],
      },
      {
        prompt: '「我們是瑞典帝國最大的笑話……我們在黑暗的海底度過了漫長的歲月……世人早已遺忘了我們！」',
        choices: [
          {
            text: '🏛️【傳頌博物館傳世榮耀】「不！如今瓦薩號在斯德哥爾摩博物館永恆佇立，全球每年百萬旅者瞻仰其巴洛克木雕與皇家雄姿，世人敬仰的是瑞典十七世紀工藝的絕代輝煌！」',
            isCorrect: true,
            reaction: '「三百年了……原來世人從未忘記我們的雄姿……沉睡的英靈終於可以安息了……艦隊，鳴禮砲送行！」',
          },
          {
            text: '⚓「反正都沉了，繼續在泥巴裡睡覺吧。」',
            isCorrect: false,
            reaction: '「幽靈戰艦不可辱！幽靈巨浪吞沒一切！」',
          },
        ],
      },
    ],
    pacifistClearSpeech: '⚓ 瓦薩號艦長熱淚盈眶，脫帽致敬，沉船幽靈水手齊射禮砲：『旅者，感謝你洗刷了我們的冤屈……波羅的海的海風將永遠庇護你們！』',
    achievementText: '🕊️ 波羅的海海事傳奇 · 瓦薩幽靈引渡者',
  },
  sami_shaman: {
    bossName: '極光薩滿 伊納里 (Sámi Shaman Inari)',
    bossTitle: '拉普蘭極夜長生天通靈祭司',
    bossAvatar: '🦌',
    rounds: [
      {
        prompt: '「南方的凡人帶著喧囂踏入薩米人的神聖苔原！長生天的極光狂嵐，將把擅闖者的靈魂凍結於永夜！」',
        choices: [
          {
            text: '🎵【哼唱悠伊克民謠與極地誓約】「大薩滿，我們不是掠奪者，而是帶著敬畏前來的巡禮者。我們尊重每一隻奔馳的馴鹿，願傾聽風雪中的自然脈動！」',
            isCorrect: true,
            reaction: '「……悠伊克的旋律？你的眼中倒映著極光最純粹的翠綠……但世間旅人往往來去匆匆，何人願守護這片極淨之土？」',
          },
          {
            text: '❄️「這裡太冷了，快把你的馴鹿皮大衣脫下來給我穿！」',
            isCorrect: false,
            reaction: '「貪婪無禮的凡人！感受零下四十度暴雪寒潮！」',
          },
          {
            text: '🏹「看我的極地獵槍，把霜狼全打跑！」',
            isCorrect: false,
            reaction: '「傷害靈獸者，必遭長生天極光焚滅！」',
          },
        ],
      },
      {
        prompt: '「極光是祖靈的裙擺，苔原是萬物的搖籃。當你們離開北極圈，是否還會記得這份純淨？」',
        choices: [
          {
            text: '✨【許下永恆守護誓言】「我們願將拉普蘭的純潔與共生智慧帶回人間，以謙卑之心守望極光，讓這片冰雪天地世代繁衍！」',
            isCorrect: true,
            reaction: '「長生天的精靈回應了你的純淨誓約……通過考驗吧，極光的守護者！」',
          },
          {
            text: '🛷「我只是來搭雪橇拍照發社群打卡的！」',
            isCorrect: false,
            reaction: '「膚淺的虛妄！極光風暴將驅逐偽善者！」',
          },
        ],
      },
    ],
    pacifistClearSpeech: '🦌 薩米薩滿微笑揮舞鹿骨法杖，漫天極光化作溫暖的青綠色極地光環：『純潔的旅人，願長生天的白鹿永遠伴你同行！』',
    achievementText: '🕊️ 北極圈自然守護者 · 悠伊克心靈通靈師',
  },
  vainamoinen: {
    bossName: '琴聖 萬奈摩寧 (Väinämöinen)',
    bossTitle: '卡勒瓦拉千湖史詩創世歌者',
    bossAvatar: '🪕',
    rounds: [
      {
        prompt: '「凡俗的噪音玷污了卡勒瓦拉的聖境！大地沈默，湖泊結冰，唯有琴弦割裂的音波方能喚醒永恆的肅穆！」',
        choices: [
          {
            text: '📜【吟誦卡勒瓦拉創世史詩】「琴聖萬奈摩寧啊，天地自金眼鳧之卵誕生，三界由琴聲而豐饒！詩歌的真諦是給予生靈希望，而非將世間化為闃寂！」',
            isCorrect: true,
            reaction: '「……金眼鳧之卵……你竟深明我萬奈摩寧最初的創世韻律！然而，若無知音，這魚骨琴弦彈與誰聽？」',
          },
          {
            text: '🎸「老爺爺，你的琴聲彈得太走音了，換首重金屬搖滾吧！」',
            isCorrect: false,
            reaction: '「狂妄後輩！音波撕裂將碎裂你的耳膜！」',
          },
          {
            text: '⚔️「刀劍比你的琴弦更鋒利！」',
            isCorrect: false,
            reaction: '「粗鄙之徒，感受千湖怒濤琴弦切面！」',
          },
        ],
      },
      {
        prompt: '「世人追逐鋼筋水泥與喧鬧財富，古老的三波 (Sampo) 神磨已碎，誰還記得千湖芬蘭的堅毅靈魂？」',
        choices: [
          {
            text: '🎶【心靈與康特勒琴合鳴】「我們便是傾聽你靈魂的知音！願將芬蘭的堅毅 (Sisu) 與詩篇傳唱四海，讓萬物在樂聲中欣欣向榮！」',
            isCorrect: true,
            reaction: '「妙哉……千百年後，孤獨的琴聖終於覓得靈魂知音……去吧，北境的神話已為你銘刻！」',
          },
          {
            text: '🔇「神磨既然碎了，那就買新的啊，別彈了！」',
            isCorrect: false,
            reaction: '「毫無靈性之輩！音波風暴終結一切！」',
          },
        ],
      },
    ],
    pacifistClearSpeech: '🪕 琴聖萬奈摩寧潸然淚下，康特勒魚骨琴弦散發出溫潤金光，漫天琴音化作綻放的白樺花瓣：『這曲創世之音，送給天涯若比鄰的知音旅者！』',
    achievementText: '🕊️ 卡勒瓦拉靈魂知音 · 千湖堅毅 (Sisu) 賢者',
  },
  harald_hardrada: {
    bossName: '無情者 哈拉爾 (Harald Hardrada)',
    bossTitle: '最後的維京霸王 · 瓦蘭吉衛隊傳奇領袖',
    bossAvatar: '🪓',
    rounds: [
      {
        prompt: '「戰士的宿命唯有鐵與血！英格蘭的斯坦福橋帶走孤王的大軍，但這柄狂戰士之斧依然飢渴！來吧，以死決戰！」',
        choices: [
          {
            text: '🪓【銘刻最後維京戰神的傳奇】「最後的維京王哈拉爾！你的英勇跨越拜占庭瓦蘭吉衛隊至北海怒濤，歷史已承認你的勇名！戰神的歸宿在瓦爾哈拉，何須困於昔日的殘垣？」',
            isCorrect: true,
            reaction: '「……瓦蘭吉的金色徽記……連那個遙遠的帝國你都知曉？狂風呼嘯千百年，從未有人敢在孤王斧下直視孤王的戰魂！」',
          },
          {
            text: '🏴󠁧󠁢󠁥󠁮󠁧󠁿「你在斯坦福橋早就打輸了，還不快投降？」',
            isCorrect: false,
            reaction: '「揭開孤王的傷疤？狂戰士雙斧將你碎屍萬段！」',
          },
          {
            text: '🛡️「我有重裝防暴盾，你砍不破的！」',
            isCorrect: false,
            reaction: '「可笑的木板！戰斧烈焰劈開一切！」',
          },
        ],
      },
      {
        prompt: '「世人皆稱孤王為『無情者 (Hardrada)』，畏我如猛虎！凡人，你站在孤王面前，難道當真不懼孤王奪走你的性命？」',
        choices: [
          {
            text: '🍻【舉起維京號角祝酒誓盟】「為無畏的冒險者乾杯！你的熱血已化作挪威峽灣的峭壁與永恆的探險精神，我們繼承你的勇氣，繼續探索這片天地！」',
            isCorrect: true,
            reaction: '「哈哈哈哈！好一個知己！世人皆畏我無情，唯你懂我心中的浩蕩！你贏得了孤王的全心尊敬！」',
          },
          {
            text: '🏃「我當然怕啊，所以叫你趕快停手！」',
            isCorrect: false,
            reaction: '「懦弱之輩！不配踏足挪威峽灣！」',
          },
        ],
      },
    ],
    pacifistClearSpeech: '🪓 哈拉爾王仰天長嘯，豪邁地將狂戰士雙刃巨斧插於雪地，端起北海蜂蜜酒號角與你相碰：『哈哈哈哈！從今往後，你就是孤王承認的維京兄弟！』',
    achievementText: '🕊️ 挪威峽灣戰神之友 · 瓦爾哈拉結盟者',
  },
  surtr: {
    bossName: '火巨人 史爾特爾 (Surtr)',
    bossTitle: '諸神黃昏終末審判者 · 暮光火劍執掌者',
    bossAvatar: '🌋',
    rounds: [
      {
        prompt: '「諸神黃昏已至！暮光烈焰將焚盡一切虛妄！世界終將歸於灰燼與熔岩！」',
        choices: [
          {
            text: '🌋【吟誦女巫預言 (Völuspá) 的新生希望】「史爾特爾！烈火焚盡腐朽，並非毀滅的終局，而是重生的序幕！女巫預言翠綠的大地必將再度從湛藍海洋中升起，穀物無須播種自會生長！」',
            isCorrect: true,
            reaction: '「……翠綠的大地……新生的種子……億萬年來，我背負焚世的詛咒與熾熱，從未有生靈告訴我……大火之後，亦有希望？」',
          },
          {
            text: '🔥「你的火不夠燙，我有噴火槍比你更強！」',
            isCorrect: false,
            reaction: '「狂妄之蟻！讓你在滅世熔岩熱線中灰飛煙滅！」',
          },
          {
            text: '🧊「潑一盆冰水澆滅你！」',
            isCorrect: false,
            reaction: '「愚蠢的凡人！滅世黑焰豈是凡水可滅！」',
          },
        ],
      },
      {
        prompt: '「九界已朽，神座坍塌。當烈焰熄滅，留給你們的只有冰冷的廢墟……凡人，你們憑何在餘燼中活下去？」',
        choices: [
          {
            text: '🌱【呈遞極地永凍冰晶與春之萌芽】「看吧，這是冰島冰川下的微光與新生的希望！收起暮光火劍，成為照耀新世界的第一抹破曉晨曦吧！」',
            isCorrect: true,
            reaction: '「翠綠的大地……新生的種子……億萬年的烈焰之怒，終於尋得止息……諸神黃昏終結，新紀元降臨！」',
          },
          {
            text: '🌪️「活不下去就算了，大家一起毀滅吧。」',
            isCorrect: false,
            reaction: '「既然如此，那就隨孤一同沉淪於末日火海！」',
          },
        ],
      },
    ],
    pacifistClearSpeech: '🌋 史爾特爾收起暮光巨劍，黑曜石熔岩熄滅化作溫暖的火山地熱與極地溫泉：『億萬年漫長的燃燒終於結束了……去吧，新紀元的第一位旅者！』',
    achievementText: '🕊️ 新紀元破曉使者 · 諸神黃昏救贖之光',
  },
};

export const RPG_CHAPTERS: RpgChapter[] = [
  {
    id: 'chapter0',
    number: 0,
    title: '序章：童話與皇權之國',
    subTitle: '丹麥篇 · 哥本哈根',
    country: '丹麥',
    countryFlag: '🇩🇰',
    dayRange: 'Day 1 - 2',
    themeColor: '#ef4444',
    accentBg: 'from-rose-950 via-slate-900 to-slate-950',
    description: '極夜降臨前夕抵達新港運河，彩色山牆木屋飄著冬日肉桂香，童話幻影悄然甦醒……',
    questObjective: '先向【埃里克先知長老】探聽歷史，走訪新港與小美人魚，在阿馬林堡宮廣場討伐藍牙王！',
    primaryStoryNpcId: 'npc_elder_erik',
    quests: [
      {
        id: 'q_cph_nyhavn',
        title: '【尋訪安徒生之居】',
        desc: '前往新港運河 20 號，尋找失落的童話原稿殘頁。',
        targetLandmarkId: 'cph_nyhavn',
        rewardExp: 50,
        rewardGold: 80,
        completed: false,
      },
      {
        id: 'q_cph_mermaid',
        title: '【海之誓約印記】',
        desc: '穿越港灣防波堤，於小美人魚像前觸碰海潮盧恩之印。',
        targetLandmarkId: 'cph_mermaid',
        rewardExp: 70,
        rewardGold: 100,
        completed: false,
      },
      {
        id: 'q_cph_tivoli',
        title: '【蒂沃利星光慶典】',
        desc: '走訪蒂沃利花園，點亮百萬盞聖誕童話提燈。',
        targetLandmarkId: 'cph_tivoli',
        rewardExp: 60,
        rewardGold: 90,
        completed: false,
      },
    ],
    hotelSavePoint: {
      name: "Hotel d'Angleterre (英格蘭奢華飯店)",
      description: '全丹麥最富傳奇色彩的皇室飯店，在此休養可恢復全部 HP 與 MP。',
    },
    michelinBuff: {
      name: 'Geranium / Alchemist 創意料理',
      description: '全隊攻擊力與魔法力 +50%（三星米其林美饌加護）',
      type: 'atk',
      effectText: '攻擊力 & 秘術威力 +50%',
    },
    boss: {
      id: 'harald_bluetooth',
      name: '丹麥藍牙王 哈拉爾一世',
      title: 'Harald Bluetooth · 維京統一之主 (西元 958-986)',
      stage: '阿馬林堡宮廣場 (衛兵交接時間)',
      avatar: '👑',
      bossType: 'harald_bluetooth',
      maxHp: 380,
      atk: 28,
      taunts: {
        start: '「你以為你能違抗丹麥的符文意志嗎？展示你的力量吧！」',
        turn1: '「這柄盧恩戰斧曾斬開北海冰浪，你能接下幾招？」',
        halfHp: '「不錯的步伐……但古典狂戰士的怒火才剛要燃燒！」',
        lowHp: '「這股誓約之光……竟然能撼動我的藍牙符印？！」',
        actLoreResponse: '「……你竟然懂得耶靈石碑的銘文？！本王對你刮目相看！」',
        postDodge: '「躲得挺靈活！但下一波符文鎖鏈可沒那麼容易閃避！」',
      },
      skills: [
        { name: '符文鎖鏈彈幕', desc: '以古代北歐盧恩符文封鎖對手行動', dmg: 30 },
        { name: '藍牙狂戰士衝擊', desc: '召喚古典維京狂戰士發動衝鋒', dmg: 45 },
      ],
      rewardItem: '符文通行鑰匙',
      rewardDesc: '刻有藍牙王印記的通行之鑰，解鎖前往瑞典斯德哥爾摩之航線。',
      winQuote: '「童話之國的勇士啊，去吧！前往北方冰霜王國尋找你的誓約。」',
    },
    landmarks: [
      {
        id: 'cph_nyhavn',
        name: '新港運河 (Nyhavn)',
        x: 320,
        y: 290,
        historicalLore: '建於 1670 年代，兩側為 17 世紀鮮豔彩色山牆木屋，安徒生曾在此 18、20 與 67 號居住寫作。',
        trivia: '安徒生在新港寫下了著名的《打火匣》與《豌豆公主》。',
        mustDo: ["在彩色木屋與古帆船前合影","尋找安徒生故居 20 號與 67 號門牌","品嚐運河市集熱紅酒 Gløgg"],
        emoji: '🏘️',
        dayNum: 1,
      },
      {
        id: 'cph_stroget',
        name: '斯楚格徒步街 (Strøget)',
        x: 640,
        y: 285,
        historicalLore: '歐洲最古老且最長的步行購物街之一，貫穿哥本哈根心臟地帶與市政廳廣場。',
        trivia: '1962 年改為徒步街時曾引發爭議，如今成為世界各大城市步行區典範。',
        mustDo: ["參觀皇家哥本哈根手繪瓷器旗艦店","在老廣場噴泉旁欣賞街頭管樂演出"],
        emoji: '🛍️',
        dayNum: 2,
      },
      {
        id: 'cph_mermaid',
        name: '小美人魚雕像 (The Little Mermaid)',
        x: 960,
        y: 310,
        historicalLore: '1913 年由嘉士伯啤酒創始人之子委託愛德華·埃里克森雕塑，靜坐海邊礁石上守望港口。',
        trivia: '雕像原型臉部以芭蕾舞名伶艾倫·普萊斯為模特，身軀則以雕刻家妻子為模特。',
        mustDo: ["在長堤公園海濱與百年青銅小美人魚合影","遠眺哥本哈根歌劇院與海港風光"],
        emoji: '🧜‍♀️',
        dayNum: 2,
      },
      {
        id: 'cph_christiansborg',
        name: '克里斯蒂安堡宮 (Christiansborg)',
        x: 740,
        y: 495,
        historicalLore: '現為丹麥議會、首相辦公室與最高法院所在地，歷史上歷經兩次大火重建。',
        trivia: '世界上唯一一座集合國家三權（立法、行政、司法）於同一棟建築的殿堂。',
        mustDo: ["免費登頂 106 公尺高皇宮塔樓俯瞰全城","探訪皇家接待廳與女王現代掛毯"],
        emoji: '🏛️',
        dayNum: 1,
      },
      {
        id: 'cph_tivoli',
        name: '蒂沃利花園 (Tivoli Gardens)',
        x: 360,
        y: 505,
        historicalLore: '建於 1843 年，是全球第二古老的遊樂園，華特·迪士尼曾在此汲取靈感打造迪士尼樂園。',
        trivia: '每年聖誕季節換上百萬盞童話燈飾，是哥本哈根最溫馨的冬夜節慶。',
        mustDo: ["漫步百萬盞聖誕燈飾點亮的童話小徑","體驗 1914 年百年木製雲霄飛車"],
        emoji: '🎠',
        dayNum: 2,
      },
    ],
  },
  {
    id: 'chapter1',
    number: 1,
    title: '第一章：沉船與金箔的誓言',
    subTitle: '瑞典篇 · 斯德哥爾摩',
    country: '瑞典',
    countryFlag: '🇸🇪',
    dayRange: 'Day 3 - 4',
    themeColor: '#38bdf8',
    accentBg: 'from-cyan-950 via-slate-900 to-slate-950',
    description: '穿越全城最窄巷（90公分 Mårten Trotzigs Gränd），揭開 1520 年「斯德哥爾摩血案」冤魂迷霧。',
    questObjective: '向【造船巨匠 雅各布】探尋瓦薩號重心沉沒之謎，潛入沉船博物館，在重砲彈幕中戰勝幽靈船長！',
    primaryStoryNpcId: 'npc_shipwright_jacob',
    quests: [
      {
        id: 'q_stk_narrow',
        title: '【穿梭 90 公分之隙】',
        desc: '探索中世紀老城最窄巷，避開暗影幽魂的糾纏。',
        targetLandmarkId: 'stk_gamlastan',
        rewardExp: 70,
        rewardGold: 110,
        completed: false,
      },
      {
        id: 'q_stk_vasa',
        title: '【潛入 1628 幽靈戰艦】',
        desc: '前往瓦薩博物館，調查 64 門青銅加農砲上的古老詛咒。',
        targetLandmarkId: 'stk_vasa',
        rewardExp: 90,
        rewardGold: 140,
        completed: false,
      },
      {
        id: 'q_stk_cityhall',
        title: '【金廳馬賽克之光】',
        desc: '走訪斯德哥爾摩市政廳，解開梅拉倫女王金箔之謎。',
        targetLandmarkId: 'stk_cityhall',
        rewardExp: 80,
        rewardGold: 120,
        completed: false,
      },
    ],
    hotelSavePoint: {
      name: 'Grand Hôtel Stockholm (斯德哥爾摩大飯店)',
      description: '面對皇宮與老城的水岸傳奇飯店，諾貝爾獎晚宴得主御用下榻地。',
    },
    michelinBuff: {
      name: '瑞典肉丸與越橘特餐',
      description: '瞬間回復全隊 50% MP，並提升 25% 暴擊率。',
      type: 'mp_regen',
      effectText: 'MP 回復 + 暴擊率提升',
    },
    boss: {
      id: 'captain_vasa',
      name: '瓦薩號靈魂船長',
      title: 'Captain of Vasa · 1628 年沉沒的大航海幽魂艦長',
      stage: '1628 年沉沒的大航海幽靈船艙內 (瓦薩沉船博物館)',
      avatar: '⚓',
      bossType: 'captain_vasa',
      maxHp: 480,
      atk: 36,
      taunts: {
        start: '「沉睡海底 333 年的 64 門青銅加農砲……將向你齊射！」',
        turn1: '「看著這座波羅的海的幽魂戰艦吧，沒有人能安然離去！」',
        halfHp: '「海水在沸騰……我的幽靈水手們，舷側開火！」',
        lowHp: '「這艘皇家旗艦的命運……絕不會在此沉沒第二次！」',
        actLoreResponse: '「你竟敢提起重心過高的設計恥辱？！這不是我的錯！」',
        postDodge: '「加農砲彈的煙幕只是開端，下一次連海水都會冰封！」',
      },
      skills: [
        { name: '重砲轟炸彈幕', desc: '64 門青銅加農砲齊射，引發巨大海水衝擊波', dmg: 40 },
        { name: '幽靈錨鏈突襲', desc: '召喚 17 世紀木造幽靈水手進行舷側突襲', dmg: 55 },
      ],
      rewardItem: '金箔馬賽克護符',
      rewardDesc: '來自斯德哥爾摩市政廳金廳的神聖護符，提升全隊基礎防禦力。',
      winQuote: '「沉睡海底 333 年的執念……終於在你的劍下得到了安息。」',
    },
    landmarks: [
      {
        id: 'stk_gamlastan',
        name: '斯德哥爾摩老城 (Gamla Stan)',
        x: 320,
        y: 290,
        historicalLore: '建於 13 世紀，保留中世紀蜿蜒鵝卵石街道與赭黃色建築，1520 年曾發生慘烈血案。',
        trivia: '老城中最窄的小巷 Mårten Trotzigs Gränd 寬度僅有 90 公分，兩人相遇需側身通過。',
        mustDo: ["挑戰側身穿過 90 公分寬的莫滕特羅齊格窄巷","在大廣場彩色山牆建築前品嚐瑞典肉桂捲 Fika"],
        emoji: '🏰',
        dayNum: 3,
      },
      {
        id: 'stk_vasa',
        name: '瓦薩沉船博物館 (Vasa Museum)',
        x: 780,
        y: 285,
        historicalLore: '1628 年首航出港僅 1300 公尺即因重心不穩沉沒，1961 年被打撈出水，完整保留 98% 原木結構。',
        trivia: '艦上擁有數百件精美木雕，曾是古斯塔夫二世國王耀武揚威的超級旗艦。',
        mustDo: ["近距離仰望 1628 年 64 門青銅砲巨艦真跡","觀賞船尾超過 700 尊巴洛克皇家木雕"],
        emoji: '🚢',
        dayNum: 4,
      },
      {
        id: 'stk_cityhall',
        name: '市政廳金廳 (Stockholm City Hall)',
        x: 380,
        y: 500,
        historicalLore: '每年諾貝爾獎晚宴舞會舉辦地，金廳牆面鑲嵌超過 1800 萬塊鍍金馬賽克瓷磚。',
        trivia: '金色壁畫中央為「梅拉倫湖女王」，象徵斯德哥爾摩受到世界各國崇敬。',
        mustDo: ["走進鑲嵌 1800 萬塊金箔馬賽克的金廳","拾級走下諾貝爾獎得主專屬的藍廳晚宴階梯"],
        emoji: '✨',
        dayNum: 3,
      },
      {
        id: 'stk_nobel',
        name: '諾貝爾博物館 (Nobel Prize Museum)',
        x: 740,
        y: 495,
        historicalLore: '座落於大廣場，展示阿爾弗雷德·諾貝爾的遺產以及歷屆諾貝爾獎得主的創新思想。',
        trivia: '館內咖啡廳椅背下方留有歷屆得主的親筆簽名，翻轉椅座即可看見愛因斯坦等人的手跡。',
        mustDo: ["在館內咖啡廳翻看椅背底部的諾貝爾得主親筆簽名","品嚐諾貝爾晚宴同款皇家冰淇淋與金幣巧克力"],
        emoji: '🎖️',
        dayNum: 4,
      },
    ],
  },
  {
    id: 'chapter2',
    number: 2,
    title: '第二章：極夜與聖誕老人',
    subTitle: '芬蘭拉普蘭篇 · 羅凡納米',
    country: '芬蘭',
    countryFlag: '🇫🇮',
    dayRange: 'Day 5 - 7',
    themeColor: '#10b981',
    accentBg: 'from-emerald-950 via-slate-900 to-slate-950',
    description: '踏入北緯 66°33′ 極圈界線，平安夜前夕極光被闇夜幽靈遮蔽。搭乘雪橇穿越林海雪原！',
    questObjective: '向【薩米極光薩滿 尼拉斯】探知火狐傳說，跨越極圈線，在冰雪祭壇淨化極光巨狼！',
    primaryStoryNpcId: 'npc_lapland_nilas',
    quests: [
      {
        id: 'q_lap_arcticcircle',
        title: '【跨越北緯 66°33′】',
        desc: '踏上北極圈界線地標，領取極地探險證明書。',
        targetLandmarkId: 'lap_arcticcircle',
        rewardExp: 100,
        rewardGold: 150,
        completed: false,
      },
      {
        id: 'q_lap_santavillage',
        title: '【尋訪聖誕老人辦公室】',
        desc: '抵達聖誕老人村，寄出蓋有極圈郵戳的平安夜祝福。',
        targetLandmarkId: 'lap_santavillage',
        rewardExp: 110,
        rewardGold: 160,
        completed: false,
      },
      {
        id: 'q_lap_glassigloo',
        title: '【玻璃冰屋捕捉歐若拉】',
        desc: '入住 Kakslauttanen 穹頂冰屋，凝望天際漫天綠色極光。',
        targetLandmarkId: 'lap_glassigloo',
        rewardExp: 120,
        rewardGold: 180,
        completed: false,
      },
    ],
    hotelSavePoint: {
      name: 'Kakslauttanen Arctic Resort (玻璃圓頂冰屋)',
      description: '全球知名的穹頂玻璃冰屋，躺在溫暖床鋪即可 360 度飽覽漫天歐若拉極光！',
    },
    michelinBuff: {
      name: '拉普蘭極地馴鹿肉燉湯',
      description: '受到極地生機庇佑，全隊生命上限 +80，且每回合自動回復 30 點 HP。',
      type: 'hp_regen',
      effectText: '生命上限 +80 & 自動再生',
    },
    boss: {
      id: 'sami_shaman',
      name: '薩米巫師與極光巨狼',
      title: 'Sámi Shaman & Fenrir Wolf · 極夜冰雪祭壇守護靈',
      stage: 'Kakslauttanen 冰雪祭壇 (極光狂舞之夜)',
      avatar: '🐺',
      bossType: 'sami_shaman',
      maxHp: 650,
      atk: 45,
      taunts: {
        start: '「極夜的寒冬會凍結所有外來者的靈魂！芬里爾，撲上去！」',
        turn1: '「聽聽這薩米神鼓的震響，風雪將撕裂你的每一步！」',
        halfHp: '「狼群在雪原中長嚎……極光的怒火絕不會熄滅！」',
        lowHp: '「這道吹響極光之笛的音律……是傳說中的勇者之兆嗎？！」',
        actLoreResponse: '「你居然知曉火狐奔馳的秘密……薩米的神靈正在注視你！」',
        postDodge: '「在深雪暴風中躲避可不是僥倖，但暴風雪才正要降臨！」',
      },
      skills: [
        { name: '芬里爾冰霜風暴', desc: '極地暴風雪凍結目標，造成大量冰霜傷害', dmg: 45 },
        { name: '薩米符鼓雷擊', desc: '敲響薩米神聖符鼓，召喚極光雷電轟擊', dmg: 65 },
      ],
      rewardItem: '極光之笛',
      rewardDesc: '薩米長老傳承的古笛，吹奏時可在夜空中呼喚出瑰麗的歐若拉光帶。',
      winQuote: '「極夜的寒冬已為你退讓，北極光的祝福將永伴你的旅途……」',
    },
    landmarks: [
      {
        id: 'lap_santavillage',
        name: '聖誕老人村 (Santa Claus Village)',
        x: 760,
        y: 285,
        historicalLore: '官方認證聖誕老人故鄉，北極圈白線橫穿村莊，擁有專屬聖誕郵局與馴鹿圍欄。',
        trivia: '聖誕老人村的專屬郵戳每年為全球寄出數十萬封滿載祝福的信件。',
        mustDo: ["與官方認證聖誕老人面對面合影","從聖誕總郵局寄出加蓋北極圈郵戳的明信片"],
        emoji: '🎅',
        dayNum: 6,
      },
      {
        id: 'lap_glassigloo',
        name: '玻璃圓頂冰屋 (Glass Igloo)',
        x: 340,
        y: 290,
        historicalLore: '採用特殊防霜電熱玻璃打造，即便室外零下 30 度依然維持溫暖通透視野。',
        trivia: '躺在冰屋床上仰望極光，是無數旅人一生一次的北極夢想清單。',
        mustDo: ["躺在防霜電熱玻璃穹頂下 360 度仰望極光","開啟房內極光警報器不錯過午夜歐若拉爆發"],
        emoji: '🛖',
        dayNum: 7,
      },
      {
        id: 'lap_reindeersled',
        name: '薩米馴鹿雪橇營地 (Reindeer Farm)',
        x: 360,
        y: 500,
        historicalLore: '薩米人數百年來仰賴馴鹿遷徙與生活，雪橇奔馳於白雪覆蓋的原始針葉林。',
        trivia: '馴鹿的蹄子在冬天會收縮硬化，宛如冰爪般能穩健走在深雪與薄冰上。',
        mustDo: ["披上溫暖馴鹿皮搭乘木製雪橇穿越雪白針葉林","在薩米帳篷篝火旁喝熱漿果茶聽牧鹿傳說"],
        emoji: '🛷',
        dayNum: 5,
      },
      {
        id: 'lap_arcticcircle',
        name: '北極圈標誌線 (Arctic Circle Line)',
        x: 730,
        y: 495,
        historicalLore: '精確標示北緯 66°33′07″ 的地理分界線，標誌著永晝與極夜現象的起始點。',
        trivia: '雙腳跨越白線即代表正式進入極圈，是造訪拉普蘭最經典的打卡儀式。',
        mustDo: ["雙腳跨越北緯 66°33′07″ 發光極圈標誌線拍照","領取官方簽發的跨越北極圈榮譽證書"],
        emoji: '🌐',
        dayNum: 5,
      },
    ],
  },
  {
    id: 'chapter3',
    number: 3,
    title: '第三章：岩石、設計與桑拿',
    subTitle: '芬蘭赫爾辛基篇',
    country: '芬蘭',
    countryFlag: '🇫🇮',
    dayRange: 'Day 8 - 9',
    themeColor: '#06b6d4',
    accentBg: 'from-cyan-950 via-slate-900 to-slate-950',
    description: '節禮日抵達白雪覆蓋的設計之都赫爾辛基，古典大教堂與天然岩石音律共鳴！',
    questObjective: '向【卡勒瓦拉琴師 烏爾霍】體悟天然花崗岩回音，體驗 Löyly 桑拿，擊退《卡勒瓦拉》史詩賢者萬奈摩寧！',
    primaryStoryNpcId: 'npc_bard_urho',
    quests: [
      {
        id: 'q_hel_rockchurch',
        title: '【花崗岩石鳴之音】',
        desc: '步入岩石教堂，仰望 22 公里銅線盤繞的壯麗穹頂。',
        targetLandmarkId: 'hel_rockchurch',
        rewardExp: 110,
        rewardGold: 170,
        completed: false,
      },
      {
        id: 'q_hel_loylysauna',
        title: '【Löyly 煙燻桑拿洗禮】',
        desc: '體驗正宗芬蘭木造桑拿，一躍跳入波羅的海冰海之中。',
        targetLandmarkId: 'hel_loylysauna',
        rewardExp: 120,
        rewardGold: 190,
        completed: false,
      },
      {
        id: 'q_hel_senatesquare',
        title: '【參議院廣場雪白階梯】',
        desc: '走過赫爾辛基大教堂前綠色圓頂與莊嚴雪白石階。',
        targetLandmarkId: 'hel_senatesquare',
        rewardExp: 100,
        rewardGold: 150,
        completed: false,
      },
    ],
    hotelSavePoint: {
      name: 'Hotel Kämp (赫爾辛基傳奇坎普飯店)',
      description: '芬蘭建國以來最負盛名的歷史飯店，芬蘭音樂家西貝流士曾在此聚會交流。',
    },
    michelinBuff: {
      name: 'Löyly 傳統黑麥麵包與芬蘭鮭魚濃湯',
      description: '驅散所有異常狀態，提升全屬性 25%，下一場戰鬥暴擊率大幅提升。',
      type: 'all_cleanse',
      effectText: '全異常狀態移除 + 暴擊提升',
    },
    boss: {
      id: 'vainamoinen',
      name: '史詩賢者 萬奈摩寧',
      title: 'Väinämöinen · 芬蘭國民史詩《卡勒瓦拉》永恆賢者',
      stage: '岩石教堂銅製天窗正下方 (花崗岩石鳴迴響)',
      avatar: '🪕',
      bossType: 'vainamoinen',
      maxHp: 780,
      atk: 52,
      taunts: {
        start: '「聆聽古老花崗岩與康特勒琴的音律……卡勒瓦拉的智慧無人能擋！」',
        turn1: '「此琴以巨梭子魚之骨所造，琴弦一動，風雲色變！」',
        halfHp: '「岩磐在地裂，但我的歌詠絕不會在此停歇！」',
        lowHp: '「你的意志竟能穿透億萬年花崗岩磐的音壁……！」',
        actLoreResponse: '「你竟然能背誦西貝流士的音調……大自然在為你喝采！」',
        postDodge: '「在岩石音波中穿梭得很好，但琴弦的重奏還在後頭！」',
      },
      skills: [
        { name: '康特勒琴音波彈幕', desc: '以巨型梭子魚顎骨所造之琴奏響，催眠並震懾心神', dmg: 50 },
        { name: '天然岩石地裂術', desc: '呼喚億萬年古老花崗岩爆裂，引發大地震動', dmg: 70 },
      ],
      rewardItem: '卡勒瓦拉符文豎琴',
      rewardDesc: '芬蘭史詩英雄留下的神琴，蘊含大自然風、水與岩石的磅礴靈魂。',
      winQuote: '「你的勇氣正如卡勒瓦拉的勇士！前往挪威峽灣，迎接海潮的咆哮吧！」',
    },
    landmarks: [
      {
        id: 'hel_rockchurch',
        name: '岩石教堂 (Temppeliaukio)',
        x: 330,
        y: 290,
        historicalLore: '1969 年直接在整塊天然花崗岩石磐中爆破開鑿而成，頂部以 22 公里長紫銅條盤繞。',
        trivia: '粗糙天然岩壁具備極其完美的音響效果，常舉辦頂級交響樂與古典管風琴音樂會。',
        mustDo: ["仰望 22 公里紫銅線盤繞而成的巨型穹頂","在十億年天然花崗岩壁環繞下聆聽管風琴共鳴"],
        emoji: '⛪',
        dayNum: 8,
      },
      {
        id: 'hel_senatesquare',
        name: '參議院廣場 (Senate Square)',
        x: 740,
        y: 285,
        historicalLore: '赫爾辛基最古老核心，環繞著新古典主義風格的大教堂、政府宮與赫爾辛基大學。',
        trivia: '廣場中央聳立俄皇亞歷山大二世銅像，大教堂綠色圓頂是赫爾辛基最顯眼的天際線。',
        mustDo: ["登上赫爾辛基大教堂雪白長階俯瞰廣場全景","欣賞綠色大圓頂與十二使徒鋅製雕像"],
        emoji: '🏛️',
        dayNum: 8,
      },
      {
        id: 'hel_loylysauna',
        name: 'Löyly 現代海濱桑拿 (Löyly Sauna)',
        x: 760,
        y: 495,
        historicalLore: '座落於波羅的海邊緣，由環保木材以幾何立體切面建造，擁有傳統柴燒與煙燻桑拿。',
        trivia: '「Löyly」意指水潑到桑拿熱石上所升騰的蒸氣，是芬蘭桑拿文化的靈魂所在。',
        mustDo: ["體驗傳統柴燒煙燻桑拿的白樺木蒸氣 Löyly","鼓起勇氣從海濱木階梯走進波羅的海冰洞冬泳"],
        emoji: '🧖',
        dayNum: 9,
      },
      {
        id: 'hel_design',
        name: '赫爾辛基設計街區 (Design District)',
        x: 370,
        y: 500,
        historicalLore: '凝聚超過 200 家北歐設計店、精品工坊與 Marimekko / Iittala 等殿堂品牌。',
        trivia: '赫爾辛基曾榮獲世界設計之都稱號，簡約實用與自然美學融入了整座城市的骨髓。',
        mustDo: ["選購 Iittala 極光玻璃與 Marimekko 印花設計精品","造訪頌歌中央圖書館 Oodi 雲杉木波浪大廳"],
        emoji: '🎨',
        dayNum: 9,
      },
    ],
  },
  {
    id: 'chapter4',
    number: 4,
    title: '第四章：峽灣與極夜航線',
    subTitle: '挪威篇 · 奧斯陸 & 特羅姆瑟',
    country: '挪威',
    countryFlag: '🇳🇴',
    dayRange: 'Day 10 - 11',
    themeColor: '#818cf8',
    accentBg: 'from-indigo-950 via-slate-900 to-slate-950',
    description: '從奧斯陸生命之柱一路向北翱翔至北極圈門戶特羅姆瑟，深邃峽灣在極光下閃爍冷冽微光。',
    questObjective: '向【極光領航船長 阿斯拉克】探尋峽灣航海秘辛，巡航特羅姆瑟極光峽灣，戰勝最後的維京國王哈拉爾三世！',
    primaryStoryNpcId: 'npc_captain_aslak',
    quests: [
      {
        id: 'q_nor_cathedral',
        title: '【北極大教堂冰山剪影】',
        desc: '造訪特羅姆瑟象徵性白色三角形大教堂，仰望壯麗彩繪玻璃。',
        targetLandmarkId: 'trom_arcticcathedral',
        rewardExp: 120,
        rewardGold: 200,
        completed: false,
      },
      {
        id: 'q_nor_fjellheisen',
        title: '【夜眺特羅姆瑟極夜燈火】',
        desc: '乘纜車攀升至海拔 421 公尺山頂，俯瞰全城如璀璨珠寶盒。',
        targetLandmarkId: 'trom_fjellheisen',
        rewardExp: 130,
        rewardGold: 220,
        completed: false,
      },
      {
        id: 'q_nor_auroraship',
        title: '【峽灣暗夜啟航】',
        desc: '登上寂靜極光巡航船，在無光害的北冰洋峽灣深處等待極光爆發。',
        targetLandmarkId: 'trom_auroraship',
        rewardExp: 140,
        rewardGold: 240,
        completed: false,
      },
    ],
    hotelSavePoint: {
      name: 'Clarion Hotel The Edge (特羅姆瑟水岸旗艦)',
      description: '坐落於特羅姆瑟海港邊緣，大片落地窗倒映著峽灣水色與漫天跳躍的綠色極光。',
    },
    michelinBuff: {
      name: '特羅姆瑟極地帝王蟹與北海野生鱈魚',
      description: '全隊獲得狂暴維京血脈！攻擊力 +60%，受到的物理傷害減少 30%！',
      type: 'viking_fury',
      effectText: '攻擊力 +60% & 減傷 30%',
    },
    boss: {
      id: 'harald_hardrada',
      name: '無情者哈拉爾 (哈拉爾三世)',
      title: 'Harald Hardrada · 歷史上最後的維京國王 (1015-1066)',
      stage: '特羅姆瑟極夜峽灣上的極光巡航船船頭 (暴風雪與極光交織)',
      avatar: '⚔️',
      bossType: 'harald_hardrada',
      maxHp: 920,
      atk: 62,
      taunts: {
        start: '「我是最後的維京國王！狂戰士的雙斧將撕裂你的防禦！」',
        turn1: '「我在拜占庭禁衛軍與北海血戰中未嘗一敗，接招吧！」',
        halfHp: '「狂暴之血在沸騰！見識維京時代終焉的最後怒吼！」',
        lowHp: '「你手中的誓約之劍……難道承載著超越維京的信念？！」',
        actLoreResponse: '「狂戰士不屑言語，但你的膽識……贏得了我的尊重！」',
        postDodge: '「躲開雙斧算你有兩下子，但冰雹狂風不會停息！」',
      },
      skills: [
        { name: '狂暴旋轉斧刃', desc: '進入維京狂戰士狂暴狀態，雙斧瘋狂旋轉彈射', dmg: 60 },
        { name: '北海冰雹怒吼', desc: '以最後維京王戰斧召喚北冰洋冰雹暴風席捲全場', dmg: 80 },
      ],
      rewardItem: '維京戰斧之刃',
      rewardDesc: '最後維京霸主留下的破陣之刃，可破開冰川與狂風阻礙。',
      winQuote: '「維京時代的落幕並非終結，北境的勇氣將在你的意志中永遠流傳！」',
    },
    landmarks: [
      {
        id: 'oslo_vigeland',
        name: '維格蘭雕塑公園 (Vigeland Park)',
        x: 310,
        y: 290,
        historicalLore: '全球最大的單一藝術家雕塑公園，212 座青銅與花崗岩雕像展現人類生老病死悲歡。',
        trivia: '中央 14 公尺高的「生命之柱 (Monolith)」由單塊巨石雕刻出 121 個人體交纏攀升。',
        mustDo: ["仰望 14 公尺高單塊花崗岩雕刻的 121 人生命之柱","尋找人氣最高的「憤怒的小男孩」青銅雕像"],
        emoji: '🗿',
        dayNum: 10,
      },
      {
        id: 'oslo_operahouse',
        name: '奧斯陸歌劇院 (Oslo Opera House)',
        x: 540,
        y: 280,
        historicalLore: '白色義大利大理石與花崗岩斜面宛如一座從峽灣冰水中升起的巨大冰山。',
        trivia: '屋頂設計為全開放式斜坡，訪客可自由漫步至屋頂俯瞰奧斯陸峽灣全景。',
        mustDo: ["沿著潔白大理石冰山斜坡屋頂漫步登頂","俯瞰奧斯陸峽灣與水面上漂浮的玻璃冰山雕塑"],
        emoji: '🎭',
        dayNum: 10,
      },
      {
        id: 'trom_arcticcathedral',
        name: '北極大教堂 (Arctic Cathedral)',
        x: 780,
        y: 295,
        historicalLore: '建於 1965 年，白色三角翼狀建築宛如巨大的冰山與極地裂縫，為特羅姆瑟經典地標。',
        trivia: '教堂東面的整面巨幅彩繪玻璃是歐洲最大之一，由藝術家維克多·斯帕雷手工拼嵌。',
        mustDo: ["在極夜藍調下拍攝純白三角形冰山建築剪影","欣賞東側 23 公尺高巨幅馬賽克彩繪玻璃窗"],
        emoji: '⛪',
        dayNum: 11,
      },
      {
        id: 'trom_fjellheisen',
        name: 'Fjellheisen 登山纜車',
        x: 370,
        y: 500,
        historicalLore: '短短 4 分鐘內將旅人攀升至海拔 421 公尺的 Storsteinen 山頂，飽覽特羅姆瑟全島夜景。',
        trivia: '山頂觀景台是全挪威守候極光低垂掠過城市燈火最熱門的制高點。',
        mustDo: ["搭乘纜車登上 421 公尺山頂觀景台俯瞰全島燈火","在無光害雪峰山巔守候綠色極光弧線躍動"],
        emoji: '🚡',
        dayNum: 10,
      },
      {
        id: 'trom_auroraship',
        name: '極光峽灣巡航船 (Aurora Fjord Cruise)',
        x: 730,
        y: 495,
        historicalLore: '遠離城市光害，安靜航行於幽深寂靜的北極峽灣之中，感受世界盡頭的冰雪莊嚴。',
        trivia: '在平靜無波的海灣中，常能看見極光倒映於漆黑海面上的雙重奇蹟。',
        mustDo: ["乘靜音雙體船深入北冰洋無光害峽灣追尋極光","拍攝漫天極光與漆黑峽灣海面雙重倒影"],
        emoji: '🚢',
        dayNum: 11,
      },
    ],
  },
  {
    id: 'chapter5',
    number: 5,
    title: '終章：火山、冰川與跨年之火',
    subTitle: '冰島篇 · 雷克雅維克 & 藍湖',
    country: '冰島',
    countryFlag: '🇮🇸',
    dayRange: 'Day 12 - 15',
    themeColor: '#f59e0b',
    accentBg: 'from-amber-950 via-slate-900 to-slate-950',
    description: '長途飛躍大西洋抵達冰島，世界末日與創世之火在此交織。跨年夜篝火燃起，迎戰終焉巨人！',
    questObjective: '向【冰火吟誦者 索爾】探尋諸神黃昏，在全城跨年煙火中登頂大教堂，擊敗史爾特爾！',
    primaryStoryNpcId: 'npc_saga_thor',
    quests: [
      {
        id: 'q_ice_thingvellir',
        title: '【兩大板塊交會誓約】',
        desc: '前往辛格韋德利，腳踏歐亞與美洲板塊裂縫尋訪議會古跡。',
        targetLandmarkId: 'ice_thingvellir',
        rewardExp: 130,
        rewardGold: 220,
        completed: false,
      },
      {
        id: 'q_ice_geysir',
        title: '【大地沸騰水藍之泡】',
        desc: '守候間歇泉爆發，捕捉晶瑩水藍圓頂升空一瞬。',
        targetLandmarkId: 'ice_geysir',
        rewardExp: 140,
        rewardGold: 240,
        completed: false,
      },
      {
        id: 'q_ice_bluelagoon',
        title: '【藍湖矽泥深層洗滌】',
        desc: '沐浴於夢幻奶藍色地熱溫泉，塗抹白矽泥解除所有詛咒。',
        targetLandmarkId: 'ice_bluelagoon',
        rewardExp: 160,
        rewardGold: 280,
        completed: false,
      },
    ],
    hotelSavePoint: {
      name: 'The Retreat at Blue Lagoon (藍湖奢華套房)',
      description: '坐落於 800 年古老黑色火山熔岩地帶，擁有私人專屬地熱瀉湖，全身心終極療癒之境。',
    },
    michelinBuff: {
      name: '藍湖天然白矽泥面膜 & Moss 跨年名廚饗宴',
      description: '全屬性 +30%，全異常狀態免疫，每回合恢復 100 點 HP 與 30 點 MP！',
      type: 'def_immune',
      effectText: '全屬性 +30% + 滿額再生',
    },
    boss: {
      id: 'surtr_final',
      name: '火山與冰川之主 史爾特爾',
      title: 'Surtr of Muspelheim · 北歐神話毀滅世界與重生之火',
      stage: '跨年夜哈爾格林姆教堂頂端 · 背後全城漫天綻放篝火與彩色像素煙火',
      avatar: '🌋',
      bossType: 'surtr_final',
      maxHp: 1280,
      atk: 75,
      taunts: {
        start: '「穆斯貝爾海姆的業火已燃！讓這場跨年煙火化為諸神黃昏的祭禮！」',
        turn1: '「炎之魔劍出鞘，冰川與地殼都將在烈焰中重塑！」',
        halfHp: '「岩漿在奔湧……凡人，你能承受這創世的熔融高熱嗎？！」',
        lowHp: '「極光……極光竟然壓制住了我的魔焰？！新紀元的光芒誕生了……！」',
        actLoreResponse: '「這不是毀滅，而是再生……你終於讀懂了火與冰的誓約！」',
        postDodge: '「在流星般的熔岩雨中生存下來了嗎？那麼迎接真正的地脈爆發吧！」',
      },
      skills: [
        { name: '穆斯貝爾海姆熔岩彈幕', desc: '炎之國度終焉烈焰從大地裂縫噴湧而出', dmg: 70 },
        { name: '創世烈焰巨刃劈砍', desc: '揮舞熾熱炎之魔劍，斬開冰川與地殼', dmg: 95 },
      ],
      rewardItem: '北極星永恆之冕',
      rewardDesc: '五國旅途圓滿！集齊五國誓約之物鑄造而成的神器，獲得【北極星傳承者】最高傳奇榮銜！',
      winQuote: '「火與冰的試煉已畢，極光將永遠照亮你在北方的歸途……願你的生命如北境天空般壯麗！」',
    },
    landmarks: [
      {
        id: 'ice_thingvellir',
        name: '辛格韋德利 (Thingvellir)',
        x: 310,
        y: 285,
        historicalLore: '西元 930 年維京人在此創立世界最早的露天民主議會（Althingi），同時也是美洲與歐亞板塊斷裂帶。',
        trivia: '在這裡可以一腳踩在北美板塊、一腳踩在歐亞板塊，見證地球兩大地質板塊正以每年 2 公分拉開！',
        mustDo: ["漫步歐亞板塊與北美板塊撕裂形成的阿爾曼納陡崖","探訪西元 930 年世界最早民主議會法律石遺址"],
        emoji: '🏞️',
        dayNum: 13,
      },
      {
        id: 'ice_geysir',
        name: '蓋錫爾間歇泉 (Strokkur Geysir)',
        x: 560,
        y: 275,
        historicalLore: '世界上所有間歇泉（Geyser）的命名鼻祖，鄰近的史托克間歇泉每 5 至 8 分鐘噴發一次。',
        trivia: '噴發前水面會先凝聚出一顆晶瑩剔透的藍色巨大水泡，隨後瞬間衝上 20-30 公尺高空！',
        mustDo: ["站在上風處抓拍間歇泉噴發前瞬間形成的藍色水泡","見證沸騰水柱衝上 30 公尺高空的震撼瞬間"],
        emoji: '💨',
        dayNum: 13,
      },
      {
        id: 'ice_gullfoss',
        name: '黃金瀑布 (Gullfoss)',
        x: 810,
        y: 290,
        historicalLore: '冰島最具代表性的兩階巨大斷層瀑布，源自朗格冰原融水，咆哮奔入 32 公尺深的峽谷。',
        trivia: '20 世紀初曾有外資企圖在此建造水力發電廠，在當地女農民誓死抗爭下奇蹟般完整保存。',
        mustDo: ["沿步道近距離感受雙層斷層黃金瀑布的磅礴水霧","聆聽冰島環保先驅西格麗德守護瀑布的傳奇故事"],
        emoji: '🌊',
        dayNum: 13,
      },
      {
        id: 'ice_fireworks',
        name: '跨年篝火與全城煙火大會',
        x: 370,
        y: 505,
        historicalLore: '每年 12 月 31 日晚間，冰島人聚在社區篝火旁唱歌驅逐舊年晦氣，午夜全城數十萬人同時點燃煙火！',
        trivia: '全城居民自發購買煙火支持搜救隊基金，整座雷克雅維克夜空被 360 度燦爛火花完全照亮。',
        mustDo: ["跨年夜先參與雷克雅維克社區傳統篝火晚會 Brenna","午夜在哈爾格林姆教堂前見證全城 360 度煙火海"],
        emoji: '🎆',
        dayNum: 13,
      },
      {
        id: 'ice_bluelagoon',
        name: '藍湖天然地熱溫泉 (Blue Lagoon)',
        x: 740,
        y: 500,
        historicalLore: '由鄰近地熱發電廠所排出的富含矽、硫與微藻礦物質之溫泉水形成，維持在令人放鬆的 38°C。',
        trivia: '湖水因礦物質在陽光反射下呈現夢幻奶藍色，塗抹湖畔白矽泥可深層清潔修復肌膚。',
        mustDo: ["浸泡在 38°C 夢幻乳藍色地熱溫泉中敷白矽泥面膜","在溫泉水吧享用冰島特色藍莓果昔或氣泡香檳"],
        emoji: '♨️',
        dayNum: 14,
      },
    ],
  },
];

// ==========================================
// 4. MAP DRAWING HELPERS: PHOTO-REALISTIC PIXEL SCENERY (參照截圖)
// ==========================================

// -------------------------------------------------------------------------
// REUSABLE SUB-HELPERS FOR NORDIC SCENERY
// -------------------------------------------------------------------------

export function drawFestoonStringLights(ctx: CanvasRenderingContext2D, width: number, tick: number) {
  const lightSegments = [
    { startX: 80, startY: 340, endX: 280, endY: 350, sag: 20 },
    { startX: 280, startY: 350, endX: 520, endY: 342, sag: 24 },
    { startX: 520, startY: 342, endX: 780, endY: 352, sag: 26 },
    { startX: 780, startY: 352, endX: 1040, endY: 340, sag: 22 },
  ];

  lightSegments.forEach((seg) => {
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(seg.startX, seg.startY);
    const midX = (seg.startX + seg.endX) / 2;
    const midY = (seg.startY + seg.endY) / 2 + seg.sag;
    ctx.quadraticCurveTo(midX, midY, seg.endX, seg.endY);
    ctx.stroke();

    const bulbCount = 7;
    for (let b = 1; b < bulbCount; b++) {
      const t = b / bulbCount;
      const bx = (1 - t) * (1 - t) * seg.startX + 2 * (1 - t) * t * midX + t * t * seg.endX;
      const by = (1 - t) * (1 - t) * seg.startY + 2 * (1 - t) * t * midY + t * t * seg.endY;

      const glowGrad = ctx.createRadialGradient(bx, by, 1, bx, by, 14);
      glowGrad.addColorStop(0, 'rgba(254, 240, 138, 0.9)');
      glowGrad.addColorStop(0.3, 'rgba(250, 204, 21, 0.4)');
      glowGrad.addColorStop(1, 'rgba(234, 179, 8, 0)');
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(bx, by, 14, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(bx, by, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  });
}

export function drawPixelAuroraSky(ctx: CanvasRenderingContext2D, width: number, height: number, tick: number) {
  const skyGrad = ctx.createLinearGradient(0, 0, 0, 240);
  skyGrad.addColorStop(0, '#060a17');
  skyGrad.addColorStop(0.5, '#0b162c');
  skyGrad.addColorStop(1, '#1e1b4b');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, width, 260);

  for (let s = 0; s < 65; s++) {
    const sx = (s * 37 + 19) % width;
    const sy = (s * 29 + 11) % 220;
    const twinkle = Math.sin(tick * 0.08 + s) * 0.4 + 0.6;
    ctx.fillStyle = `rgba(255, 255, 255, ${twinkle})`;
    ctx.fillRect(sx, sy, (s % 3 === 0) ? 2.5 : 1.5, (s % 3 === 0) ? 2.5 : 1.5);
  }

  const aurAlpha1 = Math.sin(tick * 0.03) * 0.15 + 0.55;
  const aurGrad1 = ctx.createLinearGradient(0, 0, width, 180);
  aurGrad1.addColorStop(0, `rgba(52, 211, 153, ${aurAlpha1})`);
  aurGrad1.addColorStop(0.4, `rgba(56, 189, 248, ${aurAlpha1 * 0.85})`);
  aurGrad1.addColorStop(0.8, `rgba(168, 85, 247, ${aurAlpha1 * 0.6})`);
  aurGrad1.addColorStop(1, 'rgba(52, 211, 153, 0)');

  ctx.fillStyle = aurGrad1;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(width, 0);
  ctx.lineTo(width, 90 + Math.sin(tick * 0.035) * 25);
  ctx.quadraticCurveTo(
    width * 0.65,
    160 + Math.cos(tick * 0.04) * 35,
    width * 0.35,
    110 + Math.sin(tick * 0.03) * 20
  );
  ctx.quadraticCurveTo(width * 0.15, 60 + Math.cos(tick * 0.03) * 15, 0, 100);
  ctx.closePath();
  ctx.fill();

  const aurGrad2 = ctx.createLinearGradient(0, 40, width, 220);
  aurGrad2.addColorStop(0, 'rgba(192, 132, 252, 0)');
  aurGrad2.addColorStop(0.5, `rgba(168, 85, 247, ${aurAlpha1 * 0.45})`);
  aurGrad2.addColorStop(1, 'rgba(56, 189, 248, 0)');
  ctx.fillStyle = aurGrad2;
  ctx.beginPath();
  ctx.moveTo(60, 30);
  ctx.quadraticCurveTo(width * 0.5, 140 + Math.sin(tick * 0.04) * 20, width - 60, 50);
  ctx.lineTo(width - 60, 80);
  ctx.quadraticCurveTo(width * 0.5, 180 + Math.sin(tick * 0.04) * 20, 60, 70);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#040d1a';
  for (let tx = 0; tx < width; tx += 28) {
    const tHeight = 40 + (tx % 5) * 8;
    ctx.beginPath();
    ctx.moveTo(tx, 260);
    ctx.lineTo(tx + 14, 260 - tHeight);
    ctx.lineTo(tx + 28, 260);
    ctx.closePath();
    ctx.fill();
  }
}

export function drawSnowIgloo(ctx: CanvasRenderingContext2D, iglooX: number, iglooY: number, tick: number) {
  ctx.save();
  ctx.translate(iglooX, iglooY);

  ctx.fillStyle = '#cbd5e1';
  ctx.beginPath();
  ctx.arc(0, 0, 32, Math.PI, 0);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.strokeStyle = '#64748b';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(0, 0, 22, Math.PI, 0);
  ctx.arc(0, 0, 12, Math.PI, 0);
  ctx.stroke();
  for (let ang = Math.PI + 0.3; ang < Math.PI * 2 - 0.3; ang += 0.5) {
    ctx.beginPath();
    ctx.moveTo(Math.cos(ang) * 12, Math.sin(ang) * 12);
    ctx.lineTo(Math.cos(ang) * 22, Math.sin(ang) * 22);
    ctx.stroke();
  }

  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.arc(0, 0, 12, Math.PI, 0);
  ctx.closePath();
  ctx.fill();

  const hearthGlow = 0.6 + Math.sin(tick * 0.1) * 0.2;
  const hGrad = ctx.createRadialGradient(0, -4, 2, 0, -4, 24);
  hGrad.addColorStop(0, `rgba(254, 240, 138, ${hearthGlow})`);
  hGrad.addColorStop(0.5, `rgba(245, 158, 11, ${hearthGlow * 0.5})`);
  hGrad.addColorStop(1, 'rgba(245, 158, 11, 0)');
  ctx.fillStyle = hGrad;
  ctx.beginPath();
  ctx.arc(0, -4, 24, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(0, -4, 28, Math.PI * 1.15, Math.PI * 1.85);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

export function drawHarborBoardwalk(ctx: CanvasRenderingContext2D, width: number, height: number, tick: number) {
  const pierY = 360;
  const pierHeight = 90;

  ctx.fillStyle = '#081225';
  ctx.fillRect(0, pierY + 40, width, height - pierY - 40);

  ctx.fillStyle = 'rgba(56, 189, 248, 0.15)';
  for (let rw = 0; rw < width; rw += 32) {
    const wy = pierY + 50 + Math.sin((tick + rw) * 0.04) * 8;
    ctx.fillRect(rw, wy, 18, 2);
  }

  ctx.fillStyle = '#452610';
  ctx.fillRect(60, pierY, width - 120, pierHeight);

  ctx.strokeStyle = '#271406';
  ctx.lineWidth = 1.5;
  for (let px = 60; px < width - 60; px += 18) {
    ctx.beginPath();
    ctx.moveTo(px, pierY);
    ctx.lineTo(px, pierY + pierHeight);
    ctx.stroke();

    ctx.fillStyle = '#5c3317';
    ctx.fillRect(px + 2, pierY + 4, 14, pierHeight - 8);
    ctx.fillStyle = '#1e0d04';
    ctx.fillRect(px + 3, pierY + 8, 2, 2);
    ctx.fillRect(px + 3, pierY + pierHeight - 10, 2, 2);
  }

  for (let pileX = 80; pileX < width - 80; pileX += 70) {
    ctx.fillStyle = '#291406';
    ctx.fillRect(pileX - 4, pierY + pierHeight, 8, 28);
    ctx.strokeStyle = 'rgba(147, 197, 253, 0.35)';
    ctx.strokeRect(pileX - 6, pierY + pierHeight + 24, 12, 3);
  }

  for (let postX = 120; postX < width - 120; postX += 160) {
    ctx.fillStyle = '#78350f';
    ctx.fillRect(postX - 5, pierY - 14, 10, 18);
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(postX - 7, pierY - 16, 14, 4);
    ctx.strokeStyle = '#ca8a04';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(postX, pierY, 6, 0, Math.PI);
    ctx.stroke();
  }
}

export function drawMooredBoats(ctx: CanvasRenderingContext2D, tick: number) {
  const boatBob1 = Math.sin(tick * 0.05) * 3;
  const boatBob2 = Math.sin((tick + 20) * 0.05) * 2.5;

  const b1X = 580;
  const b1Y = 470 + boatBob1;
  ctx.save();
  ctx.translate(b1X, b1Y);

  ctx.fillStyle = '#3b0764';
  ctx.beginPath();
  ctx.moveTo(-50, 0);
  ctx.lineTo(65, 0);
  ctx.lineTo(55, 26);
  ctx.lineTo(-40, 24);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#6b21a8';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(-45, 6, 102, 3);

  ctx.fillStyle = '#581c87';
  ctx.fillRect(-20, -18, 45, 18);
  ctx.fillStyle = '#fef08a';
  ctx.beginPath();
  ctx.arc(2, -8, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#d97706';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = '#78350f';
  ctx.fillRect(36, -38, 4, 38);
  ctx.strokeStyle = '#ca8a04';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(65, 4);
  ctx.lineTo(75, -20);
  ctx.stroke();

  ctx.fillStyle = '#92400e';
  ctx.fillRect(-35, -12, 10, 12);
  ctx.fillRect(-24, -14, 10, 14);

  ctx.restore();

  const b2X = 170;
  const b2Y = 480 + boatBob2;
  ctx.save();
  ctx.translate(b2X, b2Y);

  ctx.fillStyle = '#0369a1';
  ctx.beginPath();
  ctx.ellipse(0, 8, 48, 16, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = '#0284c7';
  ctx.fillRect(-10, -14, 20, 14);
  ctx.fillRect(-4, -24, 8, 10);
  ctx.fillStyle = '#fef08a';
  ctx.beginPath();
  ctx.ellipse(-22, 6, 6, 5, 0, 0, Math.PI * 2);
  ctx.ellipse(22, 6, 6, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// =========================================================================
// PROCEDURAL 16-BIT MAP TEXTURES & ENVIRONMENTAL DETAILS ENGINE
// =========================================================================

// 1. Procedural Pavement & Ground Textures for all 6 Chapters
export function drawPixelPavementTextures(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  startY: number,
  chapterType: 'copenhagen' | 'stockholm' | 'lapland' | 'helsinki' | 'tromso' | 'iceland',
  tick: number
) {
  const gHeight = height - startY;

  if (chapterType === 'copenhagen') {
    // Herringbone Brick Paving & Quayside Cargo Barrels
    ctx.strokeStyle = 'rgba(15, 23, 42, 0.4)';
    ctx.lineWidth = 1;
    for (let py = startY; py < height; py += 12) {
      const shift = ((py - startY) / 12) % 2 === 0 ? 0 : 8;
      for (let px = shift; px < width; px += 16) {
        // Subtle brick tint variation
        const brickTint = (px * 13 + py * 17) % 5;
        if (brickTint === 0) ctx.fillStyle = '#3f4f66';
        else if (brickTint === 1) ctx.fillStyle = '#2d3a4d';
        else ctx.fillStyle = '#334155';
        ctx.fillRect(px, py, 15, 11);
        ctx.strokeRect(px, py, 15, 11);

        // Moss specks in cracks
        if ((px + py) % 43 === 0) {
          ctx.fillStyle = '#15803d';
          ctx.fillRect(px + 2, py + 9, 3, 2);
        }
      }
    }

    // Wooden Cargo Crates & Herring Salt Barrels on Quay
    const barrels = [
      { x: 260, y: startY + 45 },
      { x: 275, y: startY + 48 },
      { x: 580, y: startY + 35 },
      { x: 740, y: startY + 50 },
    ];
    barrels.forEach((b) => {
      // Barrel Body
      ctx.fillStyle = '#78350f';
      ctx.fillRect(b.x - 7, b.y - 12, 14, 14);
      ctx.strokeStyle = '#ca8a04';
      ctx.lineWidth = 1;
      ctx.strokeRect(b.x - 7, b.y - 12, 14, 14);
      // Iron bands
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(b.x - 7, b.y - 10, 14, 2);
      ctx.fillRect(b.x - 7, b.y - 2, 14, 2);
    });

  } else if (chapterType === 'stockholm') {
    // Gamla Stan Medieval Flagstones & Royal Cannonball Pyramids
    ctx.strokeStyle = 'rgba(15, 23, 42, 0.5)';
    ctx.lineWidth = 1;
    for (let py = startY; py < height; py += 16) {
      const rowShift = ((py - startY) / 16) % 2 === 0 ? 0 : 12;
      for (let px = rowShift; px < width; px += 24) {
        const stoneSeed = (px * 31 + py * 7) % 4;
        ctx.fillStyle = stoneSeed === 0 ? '#1e293b' : stoneSeed === 1 ? '#334155' : '#273549';
        ctx.fillRect(px, py, 23, 15);
        ctx.strokeRect(px, py, 23, 15);

        // Weathered granite speckles
        if ((px * py) % 19 === 0) {
          ctx.fillStyle = 'rgba(254, 240, 138, 0.2)';
          ctx.fillRect(px + 4, py + 4, 2, 2);
        }
      }
    }

    // Vasa Drydock 1628 Iron Cannonball Pyramids
    const pyramids = [{ x: 710, y: startY + 38 }, { x: 960, y: startY + 42 }];
    pyramids.forEach((p) => {
      ctx.fillStyle = '#090d16';
      // 3 bottom balls
      for (let i = -1; i <= 1; i++) {
        ctx.beginPath();
        ctx.arc(p.x + i * 8, p.y, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#475569';
        ctx.stroke();
      }
      // 1 top ball
      ctx.beginPath();
      ctx.arc(p.x, p.y - 7, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });

  } else if (chapterType === 'lapland') {
    // Sparkling Powder Snow Tundra & Glowing Sami Totems
    // Crystalline Snow Glitter Specks
    for (let sp = 0; sp < 65; sp++) {
      const spx = (sp * 73 + tick * 0.2) % width;
      const spy = startY + 15 + ((sp * 47) % (gHeight - 30));
      const sparkle = Math.sin(tick * 0.12 + sp) * 0.5 + 0.5;
      ctx.fillStyle = sp % 3 === 0 ? `rgba(103, 232, 249, ${sparkle})` : `rgba(255, 255, 255, ${sparkle})`;
      ctx.fillRect(spx, spy, 2.5, 2.5);
    }

    // Sami Sacred Boundary Totem Posts with Carved Sun / Reindeer Horns
    const totems = [{ x: 140, y: startY + 65 }, { x: 540, y: startY + 80 }, { x: 890, y: startY + 70 }];
    totems.forEach((totem, tidx) => {
      // Wooden Pole
      ctx.fillStyle = '#451a03';
      ctx.fillRect(totem.x - 4, totem.y - 36, 8, 36);
      ctx.fillStyle = '#78350f';
      ctx.fillRect(totem.x - 3, totem.y - 35, 6, 34);
      // Carved Horn Crown
      ctx.fillStyle = '#fed7aa';
      ctx.beginPath();
      ctx.arc(totem.x, totem.y - 42, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#d97706';
      ctx.stroke();
      // Glowing Sami Rune
      const runeP = Math.sin(tick * 0.08 + tidx) * 0.4 + 0.6;
      ctx.fillStyle = `rgba(34, 211, 238, ${runeP})`;
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('☼', totem.x, totem.y - 20);
    });

  } else if (chapterType === 'helsinki') {
    // Neoclassical Granite Slabs, Tram Rail Sparks & Löyly Birch Woodpiles
    ctx.strokeStyle = 'rgba(71, 85, 105, 0.4)';
    ctx.lineWidth = 1;
    for (let py = startY; py < height; py += 20) {
      for (let px = 0; px < width; px += 30) {
        ctx.strokeRect(px, py, 30, 20);
        // Frost ice crystals on edge
        if ((px + py) % 35 === 0) {
          ctx.fillStyle = 'rgba(226, 232, 240, 0.35)';
          ctx.fillRect(px + 2, py + 2, 8, 4);
        }
      }
    }

    // Stacked Finnish Split Birch Firewood Logs (for Löyly sauna)
    const woodpiles = [{ x: 380, y: startY + 50 }, { x: 790, y: startY + 45 }];
    woodpiles.forEach((wp) => {
      ctx.fillStyle = '#f8fafc'; // White birch bark
      for (let layer = 0; layer < 3; layer++) {
        for (let log = 0; log < 4 - layer; log++) {
          const lx = wp.x + log * 9 + layer * 4;
          const ly = wp.y - layer * 7;
          ctx.fillRect(lx - 12, ly - 4, 8, 5);
          ctx.fillStyle = '#451a03'; // Inner heartwood
          ctx.fillRect(lx - 11, ly - 3, 6, 3);
          ctx.fillStyle = '#f8fafc';
        }
      }
    });

  } else if (chapterType === 'tromso') {
    // Weathered Timber Boardwalk Planks with Grain & Stockfish Racks
    for (let py = startY; py < height; py += 14) {
      // Boardwalk Plank
      const plankTone = ((py - startY) / 14) % 3;
      ctx.fillStyle = plankTone === 0 ? '#451a03' : plankTone === 1 ? '#3f1a04' : '#4d2005';
      ctx.fillRect(0, py, width, 13);
      ctx.fillStyle = '#1c0d02';
      ctx.fillRect(0, py + 13, width, 1); // Dark plank gap

      // Iron nail studs along planks
      for (let nx = 40; nx < width; nx += 90) {
        ctx.fillStyle = '#64748b';
        ctx.fillRect(nx, py + 3, 2, 2);
        ctx.fillRect(nx, py + 9, 2, 2);
      }
    }

    // Traditional Arctic Cod Drying Wooden Frames (Hjell / Stockfish)
    const hjell = [{ x: 420, y: startY + 40 }, { x: 700, y: startY + 45 }];
    hjell.forEach((h) => {
      ctx.fillStyle = '#78350f';
      ctx.fillRect(h.x - 25, h.y - 24, 4, 24);
      ctx.fillRect(h.x + 25, h.y - 24, 4, 24);
      ctx.fillRect(h.x - 28, h.y - 22, 60, 3); // Crossbar
      // Hanging Dried Cod Silhouettes
      ctx.fillStyle = '#94a3b8';
      for (let f = -2; f <= 2; f++) {
        const fx = h.x + f * 10;
        ctx.fillRect(fx - 1.5, h.y - 19, 3, 10);
        ctx.beginPath();
        ctx.moveTo(fx, h.y - 9);
        ctx.lineTo(fx - 2, h.y - 5);
        ctx.lineTo(fx + 2, h.y - 5);
        ctx.closePath();
        ctx.fill();
      }
    });

  } else {
    // Iceland Volcanic Basalt Hexagonal Columns & Glowing Magma Fissures
    // Hexagonal Basalt Pavement
    for (let py = startY; py < height; py += 18) {
      const hxOff = ((py - startY) / 18) % 2 === 0 ? 0 : 15;
      for (let px = hxOff; px < width; px += 30) {
        ctx.strokeStyle = '#27272a';
        ctx.lineWidth = 1;
        ctx.strokeRect(px, py, 28, 16);
      }
    }

    // Pulsing Subterranean Magma Fissures (Glowing veins in rock)
    const magmaPulse = Math.sin(tick * 0.08) * 0.35 + 0.65;
    const fissures = [
      [{ x: 180, y: startY + 25 }, { x: 220, y: startY + 45 }, { x: 270, y: startY + 35 }],
      [{ x: 500, y: startY + 55 }, { x: 540, y: startY + 35 }, { x: 590, y: startY + 60 }],
      [{ x: 800, y: startY + 30 }, { x: 830, y: startY + 65 }, { x: 880, y: startY + 45 }],
    ];
    fissures.forEach((fis) => {
      ctx.strokeStyle = `rgba(234, 88, 12, ${magmaPulse * 0.6})`;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(fis[0].x, fis[0].y);
      ctx.lineTo(fis[1].x, fis[1].y);
      ctx.lineTo(fis[2].x, fis[2].y);
      ctx.stroke();

      ctx.strokeStyle = `rgba(250, 204, 21, ${magmaPulse})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(fis[0].x, fis[0].y);
      ctx.lineTo(fis[1].x, fis[1].y);
      ctx.lineTo(fis[2].x, fis[2].y);
      ctx.stroke();
    });
  }
}

// 2. Mystical Boss Summoning Rune Circle on the Map
export function drawBossSummoningRuneCircle(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  bossType: string,
  isBeaten: boolean,
  tick: number,
  diffBadge: string
) {
  ctx.save();
  const radius = 46;
  const pulse = Math.sin(tick * 0.08) * 4;

  // Elemental Color Themes
  let coreColor = '#ef4444';
  let glowColor = 'rgba(239, 68, 68, 0.3)';
  if (bossType === 'harald_bluetooth') {
    coreColor = '#38bdf8';
    glowColor = 'rgba(56, 189, 248, 0.28)';
  } else if (bossType === 'captain_vasa') {
    coreColor = '#eab308';
    glowColor = 'rgba(234, 179, 8, 0.28)';
  } else if (bossType === 'shaman_nilas') {
    coreColor = '#34d399';
    glowColor = 'rgba(52, 211, 153, 0.28)';
  } else if (bossType === 'vainamoinen') {
    coreColor = '#a855f7';
    glowColor = 'rgba(168, 85, 247, 0.28)';
  } else if (bossType === 'surtr_fire') {
    coreColor = '#f97316';
    glowColor = 'rgba(249, 115, 22, 0.32)';
  }

  if (isBeaten) {
    coreColor = '#10b981';
    glowColor = 'rgba(16, 185, 129, 0.2)';
  }

  // Outer Glowing Altar Ring
  ctx.fillStyle = glowColor;
  ctx.beginPath();
  ctx.arc(x, y, radius + pulse, 0, Math.PI * 2);
  ctx.fill();

  // Outer Rune Ring Boundary
  ctx.strokeStyle = coreColor;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.stroke();

  // Inner Geometric Star / Hexagram
  ctx.strokeStyle = `rgba(255, 255, 255, 0.45)`;
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let s = 0; s < 6; s++) {
    const ang = (s / 6) * Math.PI * 2 + tick * 0.02;
    const sx = x + Math.cos(ang) * (radius - 12);
    const sy = y + Math.sin(ang) * (radius - 12);
    if (s === 0) ctx.moveTo(sx, sy);
    else ctx.lineTo(sx, sy);
  }
  ctx.closePath();
  ctx.stroke();

  // Rotating Elder Futhark Nordic Runes around circumference
  const runes = ['ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᚲ', 'ᚷ', 'ᚹ', 'ᛋ', 'ᛏ'];
  ctx.font = 'bold 9px monospace';
  ctx.fillStyle = isBeaten ? '#6ee7b7' : '#fde047';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  runes.forEach((r, idx) => {
    const rAng = (idx / runes.length) * Math.PI * 2 - tick * 0.03;
    const rx = x + Math.cos(rAng) * (radius - 5);
    const ry = y + Math.sin(rAng) * (radius - 5);
    ctx.fillText(r, rx, ry);
  });

  // Difficulty Badge Pill above Boss Altar
  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.fillRect(x - 36, y - radius - 24, 72, 16);
  ctx.strokeStyle = coreColor;
  ctx.lineWidth = 1;
  ctx.strokeRect(x - 36, y - radius - 24, 72, 16);
  ctx.font = 'bold 9px sans-serif';
  ctx.fillStyle = '#fef08a';
  ctx.fillText(diffBadge, x, y - radius - 13);

  ctx.restore();
}

// 3. Player Footprint Trails in Snow / Mud
export function drawPlayerFootprintTrails(
  ctx: CanvasRenderingContext2D,
  footprints: { x: number; y: number; life: number; dir: string }[]
) {
  footprints.forEach((fp) => {
    ctx.save();
    ctx.globalAlpha = Math.max(0, fp.life * 0.45);
    ctx.fillStyle = '#1e293b';

    // Left and right small sole prints
    const isHoriz = fp.dir === 'left' || fp.dir === 'right';
    if (isHoriz) {
      ctx.fillRect(fp.x - 2, fp.y - 3, 5, 2);
      ctx.fillRect(fp.x - 2, fp.y + 2, 5, 2);
    } else {
      ctx.fillRect(fp.x - 3, fp.y - 2, 2, 5);
      ctx.fillRect(fp.x + 2, fp.y - 2, 2, 5);
    }
    ctx.restore();
  });
}

// 4. Warm Nordic Streetlamps with Ambient Light Cones
export function drawNordicWarmStreetlamps(
  ctx: CanvasRenderingContext2D,
  lamps: { x: number; y: number }[],
  tick: number
) {
  lamps.forEach((lamp, idx) => {
    const flicker = Math.sin(tick * 0.15 + idx * 2) * 3;
    const glowRadius = 45 + flicker;

    // Ground Ambient Light Pool
    const gGrad = ctx.createRadialGradient(lamp.x, lamp.y + 8, 2, lamp.x, lamp.y + 8, glowRadius);
    gGrad.addColorStop(0, 'rgba(254, 240, 138, 0.35)');
    gGrad.addColorStop(0.5, 'rgba(253, 224, 71, 0.15)');
    gGrad.addColorStop(1, 'rgba(254, 240, 138, 0)');
    ctx.fillStyle = gGrad;
    ctx.beginPath();
    ctx.arc(lamp.x, lamp.y + 8, glowRadius, 0, Math.PI * 2);
    ctx.fill();

    // Wrought-iron Post & Brass Lantern Housing
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(lamp.x - 2, lamp.y - 32, 4, 32);
    // Brass Hexagonal Lantern Box
    ctx.fillStyle = '#ca8a04';
    ctx.fillRect(lamp.x - 6, lamp.y - 42, 12, 12);
    // Incandescent Core Glow
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(lamp.x - 4, lamp.y - 40, 8, 8);
  });
}

// =========================================================================
// CHAPTER 0: COPENHAGEN (丹麥篇 · 新港彩色山牆木屋、小美人魚、阿馬林堡衛兵、蒂沃利彩燈)
// =========================================================================
export function drawCopenhagenWorldMap(ctx: CanvasRenderingContext2D, width: number, height: number, tick: number) {
  // 1. Twilight Royal Copenhagen Sky
  const skyGrad = ctx.createLinearGradient(0, 0, 0, 240);
  skyGrad.addColorStop(0, '#090d1f');
  skyGrad.addColorStop(0.5, '#1e1b4b');
  skyGrad.addColorStop(0.85, '#4c1d95');
  skyGrad.addColorStop(1, '#831843');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, width, 260);

  // Distant Christiansborg & Church Spires Silhouette
  ctx.fillStyle = '#060913';
  ctx.beginPath();
  ctx.moveTo(80, 260);
  ctx.lineTo(100, 180);
  ctx.lineTo(105, 140); // Copper verdigris spire
  ctx.lineTo(110, 180);
  ctx.lineTo(140, 260);
  ctx.lineTo(460, 260);
  ctx.lineTo(485, 160);
  ctx.lineTo(495, 110);
  ctx.lineTo(505, 160);
  ctx.lineTo(530, 260);
  ctx.lineTo(840, 260);
  ctx.lineTo(860, 170);
  ctx.lineTo(870, 130);
  ctx.lineTo(880, 170);
  ctx.lineTo(910, 260);
  ctx.closePath();
  ctx.fill();

  // Twinkling urban stars
  for (let s = 0; s < 40; s++) {
    const sx = (s * 41 + 17) % width;
    const sy = (s * 23 + 13) % 180;
    const tw = Math.sin(tick * 0.08 + s) * 0.4 + 0.6;
    ctx.fillStyle = `rgba(254, 240, 138, ${tw})`;
    ctx.fillRect(sx, sy, 2, 2);
  }

  // 2. Iconic Nyhavn Colorful 17th-Century Stepped-Gable Townhouses
  const houseDefs = [
    { x: 80, w: 100, h: 140, color: '#991b1b', trim: '#fecaca', roof: '#450a0a', steps: true, name: 'No.9' },
    { x: 190, w: 110, h: 160, color: '#d97706', trim: '#fef08a', roof: '#78350f', steps: false, name: 'No.20 (安徒生故居)' },
    { x: 310, w: 95, h: 135, color: '#0284c7', trim: '#bae6fd', roof: '#0c4a6e', steps: true, name: 'No.22' },
    { x: 415, w: 115, h: 155, color: '#15803d', trim: '#bbf7d0', roof: '#14532d', steps: false, name: 'No.28' },
    { x: 540, w: 105, h: 145, color: '#c2410c', trim: '#fed7aa', roof: '#7c2d12', steps: true, name: 'No.35' },
    { x: 655, w: 95, h: 150, color: '#e11d48', trim: '#fecdd3', roof: '#881337', steps: false, name: 'No.41' },
    { x: 760, w: 110, h: 160, color: '#ca8a04', trim: '#fef08a', roof: '#713f12', steps: true, name: 'No.53' },
    { x: 880, w: 100, h: 140, color: '#0369a1', trim: '#bae6fd', roof: '#082f49', steps: false, name: 'No.67 (安徒生晚年)' },
    { x: 990, w: 110, h: 150, color: '#b91c1c', trim: '#fecaca', roof: '#450a0a', steps: true, name: 'No.71' },
  ];

  houseDefs.forEach((h) => {
    const by = 260 - h.h;
    // House Base Wall
    ctx.fillStyle = h.color;
    ctx.fillRect(h.x, by, h.w, h.h);
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(h.x, by, h.w, h.h);

    // Stepped or Triangular Gable Roof
    ctx.fillStyle = h.roof;
    if (h.steps) {
      // Classic Stepped Dutch-Danish Gable
      const stepH = 9;
      for (let st = 0; st < 4; st++) {
        const sw = h.w - st * 22;
        const sx = h.x + st * 11;
        const sy = by - (st + 1) * stepH;
        ctx.fillRect(sx, sy, sw, stepH);
      }
    } else {
      // Steep Triangular Pitched Roof with Dormer
      ctx.beginPath();
      ctx.moveTo(h.x, by);
      ctx.lineTo(h.x + h.w / 2, by - 36);
      ctx.lineTo(h.x + h.w, by);
      ctx.closePath();
      ctx.fill();
    }

    // Brick Chimney with gentle smoke
    ctx.fillStyle = '#451a03';
    ctx.fillRect(h.x + h.w - 18, by - 24, 10, 24);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    const smY = by - 28 - (tick * 0.4) % 30;
    ctx.beginPath();
    ctx.arc(h.x + h.w - 13 + Math.sin(tick * 0.05) * 4, smY, 5, 0, Math.PI * 2);
    ctx.fill();

    // Multi-pane glowing windows
    const cols = 3;
    const rows = 3;
    const winW = 12;
    const winH = 16;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const wx = h.x + 14 + c * (winW + 16);
        const wy = by + 22 + r * (winH + 18);
        ctx.fillStyle = h.trim;
        ctx.fillRect(wx - 2, wy - 2, winW + 4, winH + 4);
        ctx.fillStyle = (r + c + h.x) % 3 === 0 ? '#fef08a' : '#fde047'; // Warm incandescent glow
        ctx.fillRect(wx, wy, winW, winH);
        // Window mullion cross
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(wx + winW / 2 - 0.5, wy, 1, winH);
        ctx.fillRect(wx, wy + winH / 2 - 0.5, winW, 1);
      }
    }

    // Ground Floor Tavern Door & Striped Awning
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(h.x + h.w / 2 - 8, by + h.h - 22, 16, 22);
  });

  // 3. Central Nyhavn Waterway Basin (Reflecting Townhouses)
  const canalY = 260;
  const canalH = 90;
  const waterGrad = ctx.createLinearGradient(0, canalY, 0, canalY + canalH);
  waterGrad.addColorStop(0, '#0c2238');
  waterGrad.addColorStop(0.5, '#071728');
  waterGrad.addColorStop(1, '#040b15');
  ctx.fillStyle = waterGrad;
  ctx.fillRect(0, canalY, width, canalH);

  // Watercolor reflection ripples
  for (let rx = 10; rx < width; rx += 28) {
    const rwY = canalY + 15 + Math.sin((tick + rx) * 0.04) * 8;
    ctx.fillStyle = rx % 2 === 0 ? 'rgba(217, 119, 6, 0.25)' : 'rgba(185, 28, 28, 0.2)';
    ctx.fillRect(rx, rwY, 20, 2.5);
  }

  // 4. Moored Historic Two-Masted Wooden Schooner on Canal
  const shipX = 350;
  const shipY = 275 + Math.sin(tick * 0.04) * 2;
  ctx.fillStyle = '#3e2008';
  ctx.beginPath();
  ctx.moveTo(shipX - 60, shipY + 8);
  ctx.lineTo(shipX + 80, shipY + 8);
  ctx.lineTo(shipX + 65, shipY + 32);
  ctx.lineTo(shipX - 45, shipY + 30);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#78350f';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Masts & Rigging
  ctx.fillStyle = '#78350f';
  ctx.fillRect(shipX - 15, shipY - 45, 3.5, 52);
  ctx.fillRect(shipX + 35, shipY - 55, 3.5, 62);
  ctx.strokeStyle = 'rgba(254, 240, 138, 0.4)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(shipX - 55, shipY + 8);
  ctx.lineTo(shipX - 15, shipY - 45);
  ctx.lineTo(shipX + 35, shipY - 55);
  ctx.lineTo(shipX + 80, shipY + 8);
  ctx.stroke();

  // 5. Cobblestone Quay Promenade (Where Player Walks)
  const quayY = canalY + canalH;
  ctx.fillStyle = '#334155';
  ctx.fillRect(0, quayY, width, height - quayY);

  // Cobblestone Grid Lines & Texture
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 1;
  for (let gy = quayY; gy < height; gy += 18) {
    ctx.beginPath();
    ctx.moveTo(0, gy);
    ctx.lineTo(width, gy);
    ctx.stroke();
    const xOff = (gy / 18) % 2 === 0 ? 0 : 12;
    for (let gx = xOff; gx < width; gx += 24) {
      ctx.beginPath();
      ctx.moveTo(gx, gy);
      ctx.lineTo(gx, gy + 18);
      ctx.stroke();
    }
  }

  // Timber Edge Boardwalk on canal lip
  ctx.fillStyle = '#78350f';
  ctx.fillRect(0, quayY - 6, width, 8);
  ctx.fillStyle = '#451a03';
  ctx.fillRect(0, quayY + 2, width, 3);

  // Mooring bollards along the canal edge
  for (let bx = 70; bx < width - 70; bx += 140) {
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(bx - 4, quayY - 14, 8, 12);
    ctx.fillStyle = '#ca8a04';
    ctx.fillRect(bx - 6, quayY - 16, 12, 3); // Brass cap
  }

  // 6. Iconic Little Mermaid (Den Lille Havfrue) Bronze Silhouette on Sea-Boulder
  const mmX = 860;
  const mmY = canalY + 28;
  // Granite Sea Rock
  ctx.fillStyle = '#475569';
  ctx.beginPath();
  ctx.ellipse(mmX, mmY + 12, 28, 14, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#64748b';
  ctx.beginPath();
  ctx.ellipse(mmX - 4, mmY + 8, 20, 8, 0, 0, Math.PI * 2);
  ctx.fill();
  // Bronze Little Mermaid Perched Gracefully
  ctx.fillStyle = '#047857'; // Weathered bronze patina
  ctx.beginPath();
  ctx.ellipse(mmX, mmY - 4, 6, 8, 0.2, 0, Math.PI * 2); // Body
  ctx.arc(mmX - 2, mmY - 14, 4.5, 0, Math.PI * 2); // Head
  ctx.fill();
  // Fish Tail draped over boulder
  ctx.beginPath();
  ctx.moveTo(mmX + 2, mmY);
  ctx.quadraticCurveTo(mmX + 14, mmY + 6, mmX + 18, mmY + 14);
  ctx.lineTo(mmX + 10, mmY + 12);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#6ee7b7';
  ctx.font = 'bold 9px monospace';
  ctx.fillText('🧜‍♀️ 小美人魚', mmX - 20, mmY + 34);

  // 7. Amalienborg Royal Guard Red Octagonal Sentry Box & Dannebrog Flag
  const guardX = 140;
  const guardY = quayY + 60;
  // Red Octagonal Sentry Booth
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(guardX - 12, guardY - 44, 24, 44);
  ctx.strokeStyle = '#991b1b';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(guardX - 12, guardY - 44, 24, 44);
  // Arched opening
  ctx.fillStyle = '#450a0a';
  ctx.beginPath();
  ctx.arc(guardX, guardY - 26, 8, Math.PI, 0);
  ctx.lineTo(guardX + 8, guardY);
  ctx.lineTo(guardX - 8, guardY);
  ctx.closePath();
  ctx.fill();
  // Danish Dannebrog Flag waving on pole
  ctx.fillStyle = '#e2e8f0';
  ctx.fillRect(guardX + 18, guardY - 55, 2.5, 55);
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(guardX + 20, guardY - 55, 26, 16);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(guardX + 27, guardY - 55, 3.5, 16); // White vertical bar
  ctx.fillRect(guardX + 20, guardY - 48, 26, 3.5); // White horizontal cross

  // 8. Tivoli Gardens Warm Festive String Lights along Quay Promenade
  drawFestoonStringLights(ctx, width, tick);
}

// =========================================================================
// CHAPTER 1: STOCKHOLM (瑞典篇 · 瓦薩沉船龍骨、老城90cm窄巷、市政廳三王冠金箔)
// =========================================================================
export function drawStockholmWorldMap(ctx: CanvasRenderingContext2D, width: number, height: number, tick: number) {
  // 1. Lake Mälaren Deep Midnight Indigo Sky
  const skyGrad = ctx.createLinearGradient(0, 0, 0, 240);
  skyGrad.addColorStop(0, '#020617');
  skyGrad.addColorStop(0.6, '#0f172a');
  skyGrad.addColorStop(1, '#1e293b');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, width, 240);

  // Stockholm City Hall (Stadshuset) Tower Silhouette with Three Golden Crowns
  const chX = 520;
  ctx.fillStyle = '#090d16';
  ctx.fillRect(chX - 25, 60, 50, 180); // Red brick square tower silhouette
  ctx.beginPath();
  ctx.moveTo(chX - 28, 60);
  ctx.lineTo(chX, 20); // Spire peak
  ctx.lineTo(chX + 28, 60);
  ctx.closePath();
  ctx.fill();

  // Golden Three Crowns (Tre Kronor) Spire glowing at top
  ctx.fillStyle = '#eab308';
  ctx.beginPath();
  ctx.arc(chX, 18, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.font = 'bold 12px sans-serif';
  ctx.fillText('👑👑👑', chX - 16, 12);

  // Medieval Gamla Stan Skyline (Narrow medieval gables and arches)
  ctx.fillStyle = '#111827';
  for (let gx = 40; gx < width - 40; gx += 85) {
    if (Math.abs(gx - chX) < 80) continue;
    const gh = 90 + ((gx * 7) % 50);
    ctx.fillRect(gx, 240 - gh, 75, gh);
    ctx.beginPath();
    ctx.moveTo(gx, 240 - gh);
    ctx.lineTo(gx + 37, 240 - gh - 22);
    ctx.lineTo(gx + 75, 240 - gh);
    ctx.closePath();
    ctx.fill();
  }

  // 2. Legendary Vasa 1628 Warship Drydocked in the Harbor (Massive Carved Oak Stern)
  const vasaX = 840;
  const vasaY = 240;
  // Immense Oak Stern Castle
  ctx.fillStyle = '#271708';
  ctx.beginPath();
  ctx.moveTo(vasaX - 90, vasaY);
  ctx.lineTo(vasaX + 90, vasaY);
  ctx.lineTo(vasaX + 65, vasaY - 140);
  ctx.lineTo(vasaX - 65, vasaY - 140);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#78350f';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Dual Tiers of Square Gunports with Black Cannon Barrels
  for (let tier = 0; tier < 2; tier++) {
    const py = vasaY - 45 - tier * 35;
    for (let p = -2; p <= 2; p++) {
      const px = vasaX + p * 24;
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(px - 6, py - 6, 12, 12);
      ctx.strokeStyle = '#ca8a04';
      ctx.strokeRect(px - 6, py - 6, 12, 12);
      // Cannon Barrel poking out
      ctx.fillStyle = '#475569';
      ctx.fillRect(px - 3, py - 1, 6, 10);
    }
  }

  // Gilded Royal Vasa Lions & Carvings on Stern
  ctx.fillStyle = '#ca8a04';
  ctx.font = 'bold 10px serif';
  ctx.fillText('🦁 1628 VASA 🦁', vasaX - 44, vasaY - 110);
  ctx.fillText('64 CANNONS', vasaX - 34, vasaY - 85);

  // Shipyard Timber Scaffolding & Rigging Crane next to Vasa
  ctx.fillStyle = '#5c3a21';
  ctx.fillRect(vasaX - 115, vasaY - 100, 6, 100);
  ctx.fillRect(vasaX - 145, vasaY - 80, 6, 80);
  ctx.fillRect(vasaX - 145, vasaY - 60, 36, 4);
  ctx.fillRect(vasaX - 145, vasaY - 30, 36, 4);
  // Pulley & Crane Arm
  ctx.strokeStyle = '#ca8a04';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(vasaX - 145, vasaY - 80);
  ctx.lineTo(vasaX - 115, vasaY - 105);
  ctx.lineTo(vasaX - 90, vasaY - 70);
  ctx.stroke();

  // 3. Lake Mälaren Dynamic Flowing Currents & Drifting Ice Floes
  const waterY = 240;
  const waterH = 95;
  const waterGrad = ctx.createLinearGradient(0, waterY, 0, waterY + waterH);
  waterGrad.addColorStop(0, '#040d1a');
  waterGrad.addColorStop(0.3, '#08203e');
  waterGrad.addColorStop(0.7, '#0b2b4f');
  waterGrad.addColorStop(1, '#051426');
  ctx.fillStyle = waterGrad;
  ctx.fillRect(0, waterY, width, waterH);

  // Multi-tier animated wave currents (流動水波)
  for (let layer = 0; layer < 4; layer++) {
    const waveSpeed = 0.04 + layer * 0.015;
    const waveAmp = 5 + layer * 2;
    const layerY = waterY + 16 + layer * 20;
    ctx.fillStyle = layer % 2 === 0 ? 'rgba(56, 189, 248, 0.22)' : 'rgba(14, 165, 233, 0.15)';
    for (let w = (tick * (1.2 + layer * 0.5)) % 40 - 40; w < width; w += 38) {
      const wy = layerY + Math.sin((tick * waveSpeed) + w * 0.06) * waveAmp;
      ctx.fillRect(w, wy, 24, 2.5);
    }
  }

  // Drifting Arctic Ice Floes on Lake Mälaren (緩慢漂流的浮冰)
  const iceFloes = [
    { seed: 0, w: 26, h: 10, spd: 0.35, yOff: 18 },
    { seed: 1, w: 38, h: 14, spd: 0.28, yOff: 42 },
    { seed: 2, w: 22, h: 8, spd: 0.42, yOff: 68 },
    { seed: 3, w: 32, h: 12, spd: 0.32, yOff: 30 },
    { seed: 4, w: 18, h: 7, spd: 0.48, yOff: 58 },
  ];
  iceFloes.forEach((ice, i) => {
    const ix = (width - ((tick * ice.spd + i * 220) % (width + 80))) - 20;
    const iy = waterY + ice.yOff + Math.sin((tick + i * 15) * 0.05) * 3;
    // Ice Shadow in water
    ctx.fillStyle = 'rgba(6, 78, 119, 0.45)';
    ctx.fillRect(ix - 2, iy + ice.h - 1, ice.w + 4, 3);
    // Glacial Ice Core
    ctx.fillStyle = 'rgba(224, 242, 254, 0.9)';
    ctx.fillRect(ix, iy, ice.w, ice.h);
    // Glacial Top Snow
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(ix + 2, iy - 2, ice.w - 4, 3);
    // Translucent Cyan Edge
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(ix, iy + ice.h - 2, ice.w, 2);
  });

  // Reflection of Three Golden Crowns on Water
  const reflX = chX;
  const crownReflAlpha = Math.sin(tick * 0.08) * 0.15 + 0.35;
  ctx.fillStyle = `rgba(234, 179, 8, ${crownReflAlpha})`;
  for (let cr = 0; cr < 3; cr++) {
    const ry = waterY + 12 + cr * 16 + Math.sin((tick + cr * 10) * 0.1) * 3;
    ctx.fillRect(reflX - 14 + cr * 10, ry, 10, 2.5);
  }

  // 4. Gamla Stan Granite Quayside & Golden Hall (Gyllene Salen) Mosaic Floor
  const quayY = waterY + waterH;
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(0, quayY, width, height - quayY);

  // Cobblestone Paving Grid Texture (老城石板路網紋)
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 1;
  for (let gy = quayY; gy < height; gy += 18) {
    ctx.beginPath();
    ctx.moveTo(0, gy);
    ctx.lineTo(width, gy);
    ctx.stroke();
    const xOff = (gy / 18) % 2 === 0 ? 0 : 12;
    for (let gx = xOff; gx < width; gx += 24) {
      ctx.beginPath();
      ctx.moveTo(gx, gy);
      ctx.lineTo(gx, gy + 18);
      ctx.stroke();
    }
  }

  // Gilded Mosaic Gold Flecks (Simulating Gyllene Salen 18 million gold tiles)
  for (let m = 0; m < 75; m++) {
    const mx = (m * 47 + 13) % width;
    const my = quayY + 12 + ((m * 31) % (height - quayY - 24));
    ctx.fillStyle = (m % 2 === 0) ? 'rgba(234, 179, 8, 0.45)' : 'rgba(250, 204, 21, 0.3)';
    ctx.fillRect(mx, my, 4, 4);
  }

  // Heavy Oak Quayside Lip & Mooring Bollards
  ctx.fillStyle = '#3e2008';
  ctx.fillRect(0, quayY - 6, width, 8);
  ctx.fillStyle = '#271708';
  ctx.fillRect(0, quayY + 2, width, 3);
  for (let bx = 90; bx < width - 60; bx += 160) {
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(bx - 5, quayY - 14, 10, 12);
    ctx.fillStyle = '#ca8a04';
    ctx.fillRect(bx - 7, quayY - 17, 14, 4); // Brass bollard cap
  }

  // Pyramids of 24-pounder Vasa Cast Iron Cannonballs (加農砲彈堆)
  const cbStacks = [vasaX - 160, vasaX - 60, 340];
  cbStacks.forEach((sx) => {
    const sy = quayY + 36;
    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    // 3 base balls, 2 mid, 1 top
    for (let b = 0; b < 3; b++) {
      ctx.beginPath();
      ctx.arc(sx + b * 8 - 8, sy, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
    for (let b = 0; b < 2; b++) {
      ctx.beginPath();
      ctx.arc(sx + b * 8 - 4, sy - 7, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.arc(sx, sy - 14, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  });

  // Medieval Mårten Trotzigs Gränd Archway (Old Town 90cm narrow alley recreation)
  const archX = 220;
  const archY = quayY + 40;
  ctx.fillStyle = '#334155';
  ctx.fillRect(archX - 35, archY - 60, 16, 60);
  ctx.fillRect(archX + 20, archY - 60, 16, 60);
  // Arched Stone Buttress
  ctx.beginPath();
  ctx.arc(archX + 1, archY - 50, 26, Math.PI, 0);
  ctx.lineWidth = 10;
  ctx.strokeStyle = '#475569';
  ctx.stroke();
  ctx.fillStyle = '#fef08a';
  ctx.font = 'bold 9px monospace';
  ctx.fillText('90cm 窄巷', archX - 18, archY + 14);

  // Gamla Stan Amber Street Lanterns with Warm Halo
  const lanterns = [150, 370, 680, 890];
  lanterns.forEach((lx) => {
    const ly = quayY + 22;
    // Cast iron lamp post
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(lx - 2, ly - 28, 4, 30);
    ctx.fillRect(lx - 6, ly - 32, 12, 5);
    // Glowing lamp core
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(lx - 4, ly - 27, 8, 8);
    // Warm radial glow
    const lGrad = ctx.createRadialGradient(lx, ly - 23, 2, lx, ly - 23, 26);
    lGrad.addColorStop(0, 'rgba(253, 224, 71, 0.35)');
    lGrad.addColorStop(1, 'rgba(253, 224, 71, 0)');
    ctx.fillStyle = lGrad;
    ctx.beginPath();
    ctx.arc(lx, ly - 23, 26, 0, Math.PI * 2);
    ctx.fill();
  });

  // Nobel Banquet Brass Fire Braziers with Crackling Sparks
  const brazierX = 490;
  const brazierY = quayY + 60;
  ctx.fillStyle = '#78350f';
  ctx.fillRect(brazierX - 10, brazierY - 16, 20, 16);
  // Flames
  ctx.fillStyle = '#ea580c';
  ctx.beginPath();
  ctx.arc(brazierX, brazierY - 22, 9, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#facc15';
  ctx.beginPath();
  ctx.arc(brazierX, brazierY - 24, 5, 0, Math.PI * 2);
  ctx.fill();
}

// =========================================================================
// CHAPTER 2: LAPLAND & ROVANIEMI (芬蘭拉普蘭 · 極圈線66°33′、玻璃冰屋、火狐極光、聖誕郵局)
// =========================================================================
export function drawLaplandWorldMap(ctx: CanvasRenderingContext2D, width: number, height: number, tick: number) {
  // 1. Dancing Revontulet Multi-tier Emerald-Cyan Pixel Aurora Curtain
  drawPixelAuroraSky(ctx, width, height, tick);

  // 2. Rolling Arctic Powder Snow Tundra & Snowbanks
  const snowY = 250;
  ctx.fillStyle = '#f1f5f9';
  ctx.beginPath();
  ctx.moveTo(0, snowY);
  ctx.quadraticCurveTo(width * 0.25, snowY - 25, width * 0.5, snowY);
  ctx.quadraticCurveTo(width * 0.75, snowY + 25, width, snowY);
  ctx.lineTo(width, height);
  ctx.lineTo(0, height);
  ctx.closePath();
  ctx.fill();

  // Soft Blue Tundra Snow Shadows
  ctx.fillStyle = '#e2e8f0';
  ctx.fillRect(0, snowY + 40, width, height - snowY - 40);

  // Snow-covered Pine Taiga Trees
  const pineLocs = [80, 180, 290, 720, 840, 960, 1080];
  pineLocs.forEach((px) => {
    // Tree Trunk
    ctx.fillStyle = '#3e2008';
    ctx.fillRect(px - 3, snowY - 20, 6, 20);
    // Heavy Snow-covered Pine Boughs
    ctx.fillStyle = '#064e3b';
    ctx.beginPath();
    ctx.moveTo(px, snowY - 80);
    ctx.lineTo(px + 22, snowY - 30);
    ctx.lineTo(px - 22, snowY - 30);
    ctx.closePath();
    ctx.fill();
    // Pure White Snow Caps on branches
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(px - 18, snowY - 34, 36, 6);
    ctx.fillRect(px - 10, snowY - 56, 20, 5);
  });

  // 3. Glowing Electric Cyan Arctic Circle Latitude Marker (北緯 66°33′07″)
  const lineY = 390;
  ctx.fillStyle = 'rgba(6, 182, 212, 0.2)';
  ctx.fillRect(0, lineY - 6, width, 18);
  ctx.fillStyle = '#22d3ee';
  ctx.fillRect(0, lineY, width, 4);

  // Arctic Circle Wooden Boundary Milestone
  const signX = 640;
  ctx.fillStyle = '#78350f';
  ctx.fillRect(signX - 4, lineY - 40, 8, 40);
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(signX - 70, lineY - 58, 140, 22);
  ctx.strokeStyle = '#22d3ee';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(signX - 70, lineY - 58, 140, 22);
  ctx.fillStyle = '#67e8f9';
  ctx.font = 'bold 9px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('ARCTIC CIRCLE 66°33′07″', signX, lineY - 44);
  ctx.textAlign = 'left';

  // 4. Kakslauttanen Thermal Glass Dome Igloos (Warm Hearth Glowing Inside)
  drawSnowIgloo(ctx, 420, 310, tick);
  drawSnowIgloo(ctx, 940, 320, tick + 15);

  // 5. Santa Claus Village Rustic Log Cabin Post Office
  const santaX = 780;
  const santaY = 270;
  // Timber Log Walls
  ctx.fillStyle = '#78350f';
  ctx.fillRect(santaX - 45, santaY - 50, 90, 50);
  // Log horizontal ridges
  ctx.strokeStyle = '#451a03';
  ctx.lineWidth = 1;
  for (let ly = santaY - 50; ly < santaY; ly += 10) {
    ctx.beginPath();
    ctx.moveTo(santaX - 45, ly);
    ctx.lineTo(santaX + 45, ly);
    ctx.stroke();
  }
  // Snow-covered Gabled Roof
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(santaX - 55, santaY - 50);
  ctx.lineTo(santaX, santaY - 82);
  ctx.lineTo(santaX + 55, santaY - 50);
  ctx.closePath();
  ctx.fill();
  // Stone Chimney puffing smoke
  ctx.fillStyle = '#475569';
  ctx.fillRect(santaX + 22, santaY - 85, 12, 35);
  // Golden Lit Windows & Festive Wreath
  ctx.fillStyle = '#fef08a';
  ctx.fillRect(santaX - 32, santaY - 35, 18, 18);
  ctx.fillRect(santaX + 14, santaY - 35, 18, 18);
  ctx.fillStyle = '#16a34a'; // Wreath
  ctx.beginPath();
  ctx.arc(santaX, santaY - 60, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#dc2626'; // Ribbon
  ctx.fillRect(santaX - 2, santaY - 54, 4, 6);
  ctx.font = 'bold 9px monospace';
  ctx.fillStyle = '#fef08a';
  ctx.fillText('🎅 聖誕總局', santaX - 26, santaY + 14);

  // 6. Reindeer Wooden Sleigh Tracks in Powder Snow
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.6)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(280, 480);
  ctx.lineTo(390, 480);
  ctx.moveTo(280, 492);
  ctx.lineTo(390, 492);
  ctx.stroke();
}

// =========================================================================
// CHAPTER 3: HELSINKI (芬蘭赫爾辛基 · 岩石教堂銅線穹頂、參議院白階梯、LÖYLY桑拿冰海)
// =========================================================================
export function drawHelsinkiWorldMap(ctx: CanvasRenderingContext2D, width: number, height: number, tick: number) {
  // 1. Frosty Cold Neoclassical Steel-Blue Twilight
  const skyGrad = ctx.createLinearGradient(0, 0, 0, 240);
  skyGrad.addColorStop(0, '#040b17');
  skyGrad.addColorStop(0.6, '#0f2942');
  skyGrad.addColorStop(1, '#1e3a5f');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, width, 240);

  // 2. Senate Square & Helsinki Cathedral Grand Neoclassical Facade (Green Domes)
  const cathX = 720;
  const cathY = 220;
  // White Neoclassical Colonnade
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(cathX - 70, cathY - 60, 140, 60);
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 1;
  ctx.strokeRect(cathX - 70, cathY - 60, 140, 60);
  // Pillars
  for (let col = -3; col <= 3; col++) {
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(cathX + col * 18 - 3, cathY - 55, 6, 55);
  }
  // Majestic Central Zinc-Green Copper Dome
  ctx.fillStyle = '#059669';
  ctx.beginPath();
  ctx.arc(cathX, cathY - 75, 28, Math.PI, 0);
  ctx.closePath();
  ctx.fill();
  // Golden Cross
  ctx.fillStyle = '#facc15';
  ctx.fillRect(cathX - 1.5, cathY - 115, 3, 14);
  ctx.fillRect(cathX - 5, cathY - 110, 10, 3);
  // Side Domes
  ctx.beginPath();
  ctx.arc(cathX - 55, cathY - 62, 12, Math.PI, 0);
  ctx.arc(cathX + 55, cathY - 62, 12, Math.PI, 0);
  ctx.fill();

  // Grand Monumental Granite Staircase
  ctx.fillStyle = '#64748b';
  for (let st = 0; st < 6; st++) {
    ctx.fillRect(cathX - 85 + st * 4, cathY + st * 6, 170 - st * 8, 6);
  }

  // 3. Temppeliaukio Rock Church: Blasted Bedrock Cave & Copper Spiral Ribbon Dome
  const rockX = 260;
  const rockY = 220;
  // Natural Dark Granite Jagged Quarry Rocks
  ctx.fillStyle = '#334155';
  ctx.beginPath();
  ctx.ellipse(rockX, rockY, 85, 45, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Circular Copper Ribbon Dome (22km of copper wire coil simulation)
  ctx.fillStyle = '#b45309'; // Rich copper
  ctx.beginPath();
  ctx.ellipse(rockX, rockY - 8, 55, 26, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#d97706';
  ctx.lineWidth = 2;
  // Concentric copper coils
  for (let c = 12; c < 50; c += 10) {
    ctx.beginPath();
    ctx.ellipse(rockX, rockY - 8, c, c * 0.45, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.fillStyle = '#fef08a';
  ctx.font = 'bold 9px monospace';
  ctx.fillText('⛪ 岩石教堂 (銅盤穹頂)', rockX - 55, rockY + 36);

  // 4. Löyly Seaside Faceted Timber Sauna Pavilion & Icy Baltic Sea
  const seaY = 280;
  const seaH = 90;
  ctx.fillStyle = '#061a2e';
  ctx.fillRect(0, seaY, width, seaH);

  // Ice Sheets on Baltic Sea
  ctx.fillStyle = 'rgba(226, 232, 240, 0.45)';
  ctx.fillRect(0, seaY, width, 24);
  ctx.fillRect(100, seaY + 24, 380, 18);

  // Löyly Angled Wooden Facade jutting into the sea
  const loylyX = 860;
  const loylyY = seaY + 45;
  ctx.fillStyle = '#78350f';
  ctx.beginPath();
  ctx.moveTo(loylyX - 60, loylyY);
  ctx.lineTo(loylyX, loylyY - 35);
  ctx.lineTo(loylyX + 70, loylyY);
  ctx.lineTo(loylyX + 45, loylyY + 30);
  ctx.lineTo(loylyX - 45, loylyY + 30);
  ctx.closePath();
  ctx.fill();

  // Ice Plunge Pool (Avantouinti) cut in sea ice with Rising Steam (Löyly)
  const poolX = 720;
  const poolY = seaY + 30;
  ctx.fillStyle = '#020617'; // Open frigid black water
  ctx.fillRect(poolX - 25, poolY - 14, 50, 28);
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(poolX - 25, poolY - 14, 50, 28);

  // Swirling white Sauna Steam Clouds rising
  ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
  for (let sm = 0; sm < 4; sm++) {
    const smY = poolY - 10 - ((tick * 0.5 + sm * 15) % 45);
    const smX = poolX + Math.sin(tick * 0.05 + sm) * 12;
    ctx.beginPath();
    ctx.arc(smX, smY, 8 + sm * 2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = '#67e8f9';
  ctx.font = 'bold 9px monospace';
  ctx.fillText('🧖 Löyly 桑拿冰海', poolX - 40, poolY + 28);

  // 5. Granite Street Boulevard with Vintage Green Tram Tracks
  const streetY = seaY + seaH;
  ctx.fillStyle = '#334155';
  ctx.fillRect(0, streetY, width, height - streetY);

  // Retro Tram Rail Lines curving across the snow
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(0, streetY + 40);
  ctx.lineTo(width, streetY + 40);
  ctx.moveTo(0, streetY + 52);
  ctx.lineTo(width, streetY + 52);
  ctx.stroke();
}

// =========================================================================
// CHAPTER 4: NORWAY & TROMSØ (挪威特羅姆瑟 · 壯麗峽灣、北極大教堂、漁夫高腳屋、纜車)
// =========================================================================
export function drawTromsoWorldMap(ctx: CanvasRenderingContext2D, width: number, height: number, tick: number) {
  // 1. Polar Night Sky with Ethereal Fjord Aurora Ribbon
  const skyGrad = ctx.createLinearGradient(0, 0, 0, 240);
  skyGrad.addColorStop(0, '#020617');
  skyGrad.addColorStop(0.5, '#0c1a30');
  skyGrad.addColorStop(1, '#1e293b');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, width, 240);

  // Fjord Aurora Green Arc behind mountains
  const aurAlpha = Math.sin(tick * 0.03) * 0.15 + 0.5;
  const aGrad = ctx.createLinearGradient(0, 0, width, 180);
  aGrad.addColorStop(0, `rgba(52, 211, 153, ${aurAlpha})`);
  aGrad.addColorStop(0.7, `rgba(129, 140, 248, ${aurAlpha * 0.6})`);
  aGrad.addColorStop(1, 'rgba(52, 211, 153, 0)');
  ctx.fillStyle = aGrad;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(width * 0.5, 120 + Math.sin(tick * 0.04) * 20, width, 30);
  ctx.lineTo(width, 100);
  ctx.quadraticCurveTo(width * 0.5, 180, 0, 70);
  ctx.closePath();
  ctx.fill();

  // 2. Towering Jagged Arctic Fjord Mountain Peaks (Tromsø Alps)
  const mtnPeaks = [
    { x: 0, y: 110, w: 220, h: 140 },
    { x: 180, y: 70, w: 280, h: 180 },
    { x: 420, y: 95, w: 240, h: 155 },
    { x: 620, y: 60, w: 320, h: 190 },
    { x: 900, y: 85, w: 280, h: 165 },
  ];
  mtnPeaks.forEach((m) => {
    // Dark Blue Mountain Rock
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.moveTo(m.x, 240);
    ctx.lineTo(m.x + m.w / 2, m.y);
    ctx.lineTo(m.x + m.w, 240);
    ctx.closePath();
    ctx.fill();
    // Glacier Snow Couloirs on peak
    ctx.fillStyle = '#e2e8f0';
    ctx.beginPath();
    ctx.moveTo(m.x + m.w / 2, m.y);
    ctx.lineTo(m.x + m.w / 2 - 18, m.y + 40);
    ctx.lineTo(m.x + m.w / 2 + 18, m.y + 40);
    ctx.closePath();
    ctx.fill();
  });

  // Fjellheisen Mountain Cable Car Cables & Summit Beacon
  const cabX = 360;
  ctx.strokeStyle = 'rgba(226, 232, 240, 0.4)';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(cabX - 140, 240);
  ctx.lineTo(cabX, 75); // Summit station
  ctx.stroke();
  // Red Blinking Summit Beacon
  ctx.fillStyle = tick % 30 < 15 ? '#ef4444' : '#450a0a';
  ctx.beginPath();
  ctx.arc(cabX, 74, 4, 0, Math.PI * 2);
  ctx.fill();

  // 3. Iconic Arctic Cathedral (Ishavskatedralen) Triangular Iceberg Architecture
  const cathX = 780;
  const cathY = 240;
  // White Triangular Stepped Concrete Gables
  ctx.fillStyle = '#f8fafc';
  ctx.beginPath();
  ctx.moveTo(cathX - 45, cathY);
  ctx.lineTo(cathX, cathY - 95);
  ctx.lineTo(cathX + 45, cathY);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Huge Stained-Glass Window Glowing in Jewels of Gold and Indigo
  ctx.fillStyle = '#facc15';
  ctx.beginPath();
  ctx.moveTo(cathX - 18, cathY);
  ctx.lineTo(cathX, cathY - 65);
  ctx.lineTo(cathX + 18, cathY);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#818cf8';
  ctx.fillRect(cathX - 4, cathY - 45, 8, 45);
  ctx.font = 'bold 9px monospace';
  ctx.fillStyle = '#f8fafc';
  ctx.fillText('❄️ 北極大教堂', cathX - 32, cathY + 16);

  // 4. Deep Dark Blue Fjord Water Basin
  const fjordY = 240;
  const fjordH = 100;
  ctx.fillStyle = '#061324';
  ctx.fillRect(0, fjordY, width, fjordH);

  // Fjord reflections
  ctx.fillStyle = 'rgba(129, 140, 248, 0.15)';
  for (let fw = 20; fw < width; fw += 40) {
    ctx.fillRect(fw, fjordY + 30 + Math.sin((tick + fw) * 0.04) * 8, 26, 2);
  }

  // 5. Norwegian Fisherman Wooden Stilt Cabins (Rorbuer)
  const rorbuDefs = [
    { x: 120, y: fjordY + 45, color: '#dc2626', name: '紅屋 Rorbu' },
    { x: 230, y: fjordY + 45, color: '#eab308', name: '黃屋 Rorbu' },
  ];
  rorbuDefs.forEach((r) => {
    // Heavy wooden stilts into water
    ctx.fillStyle = '#451a03';
    ctx.fillRect(r.x - 22, r.y + 20, 6, 26);
    ctx.fillRect(r.x + 18, r.y + 20, 6, 26);
    // Cabin Body
    ctx.fillStyle = r.color;
    ctx.fillRect(r.x - 28, r.y - 20, 56, 40);
    // White window frames
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(r.x - 18, r.y - 12, 12, 12);
    ctx.fillRect(r.x + 6, r.y - 12, 12, 12);
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(r.x - 16, r.y - 10, 8, 8);
    ctx.fillRect(r.x + 8, r.y - 10, 8, 8);
    // Pitched Roof
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.moveTo(r.x - 34, r.y - 20);
    ctx.lineTo(r.x, r.y - 42);
    ctx.lineTo(r.x + 34, r.y - 20);
    ctx.closePath();
    ctx.fill();
  });

  // 6. Wooden Wharf Pier & Moored Electric Catamaran Aurora Ship
  const pierY = fjordY + fjordH;
  drawHarborBoardwalk(ctx, width, height, tick);
  drawMooredBoats(ctx, tick);
}

// =========================================================================
// CHAPTER 5: ICELAND (冰島終章 · 藍湖地熱奶藍溫泉、黑熔岩柱、12/31跨年篝火煙火大會)
// =========================================================================
export function drawIcelandWorldMap(ctx: CanvasRenderingContext2D, width: number, height: number, tick: number) {
  // 1. Volcanic Twilight Sky with Magnificent 12/31 New Year's Eve Pixel Fireworks!
  const skyGrad = ctx.createLinearGradient(0, 0, 0, 240);
  skyGrad.addColorStop(0, '#05020c');
  skyGrad.addColorStop(0.5, '#1e0828');
  skyGrad.addColorStop(1, '#3b0764');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, width, 240);

  // Dynamic Multi-colored New Year's Eve Fireworks Bursts (12/31 全島自發煙火)
  const fireworkBursts = [
    { x: 180, y: 70, color: '#f43f5e', spread: 35, phase: 0 },
    { x: 420, y: 55, color: '#fbbf24', spread: 45, phase: 12 },
    { x: 680, y: 80, color: '#06b6d4', spread: 38, phase: 24 },
    { x: 920, y: 65, color: '#a855f7', spread: 42, phase: 6 },
    { x: 300, y: 110, color: '#10b981', spread: 30, phase: 18 },
  ];

  fireworkBursts.forEach((fw) => {
    const fTick = (tick + fw.phase * 5) % 60;
    const progress = fTick / 60;
    const rad = progress * fw.spread;
    const alpha = 1 - progress;

    ctx.fillStyle = fw.color;
    for (let p = 0; p < 12; p++) {
      const ang = (p / 12) * Math.PI * 2;
      const fx = fw.x + Math.cos(ang) * rad;
      const fy = fw.y + Math.sin(ang) * rad;
      ctx.globalAlpha = alpha;
      ctx.fillRect(fx, fy, 2.5, 2.5);
    }
    ctx.globalAlpha = 1.0;
  });

  // Hallgrímskirkja Stepped Basalt Organ-Pipe Spire Silhouette
  const hallX = 740;
  ctx.fillStyle = '#0c0514';
  ctx.fillRect(hallX - 10, 50, 20, 190); // Central tower
  for (let b = 1; b <= 5; b++) {
    const colH = 190 - b * 22;
    ctx.fillRect(hallX - 10 - b * 8, 240 - colH, 8, colH);
    ctx.fillRect(hallX + 10 + (b - 1) * 8, 240 - colH, 8, colH);
  }
  ctx.beginPath();
  ctx.moveTo(hallX - 10, 50);
  ctx.lineTo(hallX, 22);
  ctx.lineTo(hallX + 10, 50);
  ctx.closePath();
  ctx.fill();

  // 2. Black Volcanic Basalt Columns (Reynisfjara Hexagonal Columns & Jointed Stacks)
  const basaltLocs = [60, 130, 210, 840, 930, 1020];
  basaltLocs.forEach((bx) => {
    const bHeight = 70 + (bx % 4) * 20;
    ctx.fillStyle = '#18181b';
    ctx.fillRect(bx - 12, 240 - bHeight, 24, bHeight);
    ctx.strokeStyle = '#3f3f46';
    ctx.lineWidth = 1;
    ctx.strokeRect(bx - 12, 240 - bHeight, 24, bHeight);
    ctx.fillStyle = '#27272a';
    ctx.fillRect(bx - 10, 240 - bHeight, 10, bHeight);

    // Hexagonal Joint Cross-Sections on Column Tops
    ctx.fillStyle = '#52525b';
    ctx.beginPath();
    ctx.arc(bx, 240 - bHeight, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#71717a';
    ctx.stroke();
  });

  // 2.5 Golden Circle: Gullfoss & Langjökull Flowing Turquoise Glacier (會流動的冰河)
  const glacierX = 310;
  const glacierY = 155;
  const glacierW = 190;
  const glacierH = 85;

  // Glacial Ice Valley Bed
  const glacGrad = ctx.createLinearGradient(glacierX, glacierY, glacierX + glacierW, glacierY + glacierH);
  glacGrad.addColorStop(0, '#0e7490');
  glacGrad.addColorStop(0.3, '#06b6d4');
  glacGrad.addColorStop(0.7, '#67e8f9');
  glacGrad.addColorStop(1, '#a5f3fc');
  ctx.fillStyle = glacGrad;
  ctx.beginPath();
  ctx.moveTo(glacierX, glacierY + 30);
  ctx.quadraticCurveTo(glacierX + glacierW * 0.4, glacierY - 10, glacierX + glacierW, glacierY + 15);
  ctx.lineTo(glacierX + glacierW + 20, glacierY + glacierH);
  ctx.lineTo(glacierX - 15, glacierY + glacierH);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Rapidly Flowing Glacial Meltwater Currents (流動的冰河水波紋)
  for (let gl = 0; gl < 5; gl++) {
    const gFlowY = glacierY + 18 + gl * 14;
    ctx.fillStyle = gl % 2 === 0 ? 'rgba(255, 255, 255, 0.75)' : 'rgba(207, 250, 254, 0.6)';
    for (let gx = glacierX - 10 + ((tick * 1.8 + gl * 28) % 45); gx < glacierX + glacierW + 10; gx += 40) {
      const gOffset = Math.sin((tick * 0.08) + gx * 0.08) * 3;
      ctx.fillRect(gx, gFlowY + gOffset, 22, 2.2);
    }
  }

  // Floating Crystalline Ice Shards tumbling down the Glacier
  for (let is = 0; is < 6; is++) {
    const isProg = ((tick * 1.2 + is * 45) % (glacierW + 40));
    const isX = glacierX + isProg - 15;
    const isY = glacierY + 22 + (is % 4) * 14 + Math.sin(tick * 0.1 + is) * 3;
    if (isX >= glacierX && isX <= glacierX + glacierW) {
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(isX, isY - 4);
      ctx.lineTo(isX + 4, isY);
      ctx.lineTo(isX, isY + 4);
      ctx.lineTo(isX - 4, isY);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(isX - 1, isY - 1, 2, 2);
    }
  }

  // Glacier Waterfall Froth & Spray Lip
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  for (let sp = 0; sp < 8; sp++) {
    const sx = glacierX + 15 + sp * 20;
    const sy = glacierY + glacierH - 4 + Math.sin(tick * 0.2 + sp) * 4;
    ctx.beginPath();
    ctx.arc(sx, sy, 4 + (sp % 2) * 2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.font = 'bold 9px monospace';
  ctx.fillStyle = '#cffafe';
  ctx.fillText('🧊 朗格冰川流動河道 (Langjökull)', glacierX + 10, glacierY + 12);

  // 2.7 Strokkur Geysir Periodic Eruption (間歇泉定時噴發)
  const geyX = 175;
  const geyY = 240;
  // Geothermal vent pool
  ctx.fillStyle = '#0f766e';
  ctx.beginPath();
  ctx.ellipse(geyX, geyY, 18, 7, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#14b8a6';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Eruption Cycle: Every 90 ticks, erupts for 35 ticks
  const geyPhase = tick % 90;
  if (geyPhase > 50) {
    const eruptProg = (geyPhase - 50) / 40;
    const plumeH = 45 + Math.sin(eruptProg * Math.PI) * 45;
    // Water Column
    const gGrad = ctx.createLinearGradient(geyX, geyY, geyX, geyY - plumeH);
    gGrad.addColorStop(0, 'rgba(45, 212, 191, 0.85)');
    gGrad.addColorStop(0.5, 'rgba(204, 251, 241, 0.9)');
    gGrad.addColorStop(1, 'rgba(255, 255, 255, 0.95)');
    ctx.fillStyle = gGrad;
    ctx.beginPath();
    ctx.moveTo(geyX - 7, geyY);
    ctx.lineTo(geyX - 3, geyY - plumeH);
    ctx.lineTo(geyX + 3, geyY - plumeH);
    ctx.lineTo(geyX + 7, geyY);
    ctx.closePath();
    ctx.fill();

    // Billowing Steam Cloud at Top
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.beginPath();
    ctx.arc(geyX, geyY - plumeH, 12, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.font = 'bold 9px monospace';
  ctx.fillStyle = '#5eead4';
  ctx.fillText('♨️ 史托克間歇泉', geyX - 32, geyY + 18);

  // 3. The World-Famous Blue Lagoon: Steaming Milky-Cyan Thermal Mineral Pools
  const lagoonY = 240;
  const lagoonH = 110;
  // Milky Turquoise Geothermal Water
  const lagGrad = ctx.createLinearGradient(0, lagoonY, 0, lagoonY + lagoonH);
  lagGrad.addColorStop(0, '#0891b2');
  lagGrad.addColorStop(0.35, '#06b6d4');
  lagGrad.addColorStop(0.7, '#38bdf8');
  lagGrad.addColorStop(1, '#67e8f9');
  ctx.fillStyle = lagGrad;
  ctx.fillRect(0, lagoonY, width, lagoonH);

  // Mineral Swirling Ripples in Blue Lagoon
  for (let lr = 0; lr < 4; lr++) {
    const ly = lagoonY + 22 + lr * 22;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    for (let lx = (tick * 0.6 + lr * 35) % 50; lx < width; lx += 55) {
      const lOffset = Math.sin((tick * 0.05) + lx * 0.05) * 4;
      ctx.fillRect(lx, ly + lOffset, 28, 2);
    }
  }

  // Billowing White Geothermal Steam Clouds
  ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
  for (let sm = 0; sm < 9; sm++) {
    const smX = (sm * 125 + tick * 0.9) % width;
    const smY = lagoonY + 20 + Math.sin(tick * 0.04 + sm) * 14;
    ctx.beginPath();
    ctx.arc(smX, smY, 18 + (sm % 3) * 7, 0, Math.PI * 2);
    ctx.fill();
  }

  // Pure White Silica Mud Banks & Wooden Footbridges
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(160, lagoonY + 50, 80, 14);
  ctx.fillRect(520, lagoonY + 40, 110, 16);
  ctx.font = 'bold 9px monospace';
  ctx.fillStyle = '#0891b2';
  ctx.fillText('♨️ 藍湖白矽泥泉 (38°C)', 530, lagoonY + 52);

  // 4. Black Volcanic Lava Fields & Moss Pavement (Ground)
  const lavaY = lagoonY + lagoonH;
  ctx.fillStyle = '#18181b';
  ctx.fillRect(0, lavaY, width, height - lavaY);

  // Glowing Magma Fissures in Lava Field (大地裂谷地熱微光)
  for (let gf = 0; gf < 4; gf++) {
    const fx = 120 + gf * 240;
    const fy = lavaY + 35;
    ctx.strokeStyle = Math.sin(tick * 0.1 + gf) > 0 ? '#f97316' : '#ea580c';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(fx, fy);
    ctx.lineTo(fx + 25, fy + 8);
    ctx.lineTo(fx + 40, fy - 6);
    ctx.stroke();
  }

  // Lava Rocks & Icelandic Green Moss
  for (let lv = 30; lv < width; lv += 70) {
    ctx.fillStyle = '#27272a';
    ctx.fillRect(lv, lavaY + 15, 35, 18);
    ctx.fillStyle = '#65a30d'; // Olive tundra moss
    ctx.fillRect(lv + 4, lavaY + 12, 27, 5);
  }

  // 5. Roaring New Year's Eve Community Bonfire (12/31 Brenna)
  const fireX = 460;
  const fireY = lavaY + 60;
  // Pyre Wood Logs
  ctx.fillStyle = '#451a03';
  ctx.fillRect(fireX - 25, fireY - 12, 50, 14);
  ctx.fillRect(fireX - 18, fireY - 22, 36, 12);
  // Roaring Fiery Flame
  const flameFlicker = Math.sin(tick * 0.2) * 5;
  ctx.fillStyle = '#ea580c';
  ctx.beginPath();
  ctx.moveTo(fireX - 22, fireY - 20);
  ctx.quadraticCurveTo(fireX + flameFlicker, fireY - 65, fireX, fireY - 70);
  ctx.quadraticCurveTo(fireX - flameFlicker, fireY - 65, fireX + 22, fireY - 20);
  ctx.closePath();
  ctx.fill();
  // Core White-Hot Yellow Flame
  ctx.fillStyle = '#fef08a';
  ctx.beginPath();
  ctx.arc(fireX, fireY - 32, 12, 0, Math.PI * 2);
  ctx.fill();
  // Flying Fire Sparks into the Night
  for (let sp = 0; sp < 6; sp++) {
    const spY = fireY - 70 - ((tick * 1.2 + sp * 14) % 45);
    const spX = fireX + Math.sin(tick * 0.1 + sp) * 16;
    ctx.fillStyle = '#fde047';
    ctx.fillRect(spX, spY, 2.5, 2.5);
  }
  ctx.fillStyle = '#fed7aa';
  ctx.font = 'bold 9px monospace';
  ctx.fillText('🔥 跨年社區篝火 (Brenna)', fireX - 58, fireY + 18);
}


// =========================================================================
// TOWN SHOPS & ATMOSPHERE DECORATIONS RENDERING SYSTEM
// =========================================================================

export function drawNordicShopStation(
  ctx: CanvasRenderingContext2D,
  shopData: NordicShopData | undefined,
  tick: number,
  isPlayerNear: boolean
) {
  if (!shopData) return;
  const sx = shopData.x;
  const sy = shopData.y;

  ctx.save();
  // 1. Cozy Timber Cottage Base Wall (木質溫馨商鋪基座)
  const bW = 68;
  const bH = 46;
  ctx.fillStyle = '#78350f';
  ctx.fillRect(sx - bW / 2, sy - bH / 2, bW, bH);
  ctx.strokeStyle = '#451a03';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(sx - bW / 2, sy - bH / 2, bW, bH);

  // Horizontal wood plank grooves
  ctx.strokeStyle = '#92400e';
  ctx.lineWidth = 1;
  for (let p = -bH / 2 + 10; p < bH / 2; p += 10) {
    ctx.beginPath();
    ctx.moveTo(sx - bW / 2 + 2, sy + p);
    ctx.lineTo(sx + bW / 2 - 2, sy + p);
    ctx.stroke();
  }

  // 2. Snow-covered Sloped Gable Roof (白雪覆頂雙坡屋頂)
  ctx.fillStyle = '#451a03';
  ctx.beginPath();
  ctx.moveTo(sx - bW / 2 - 8, sy - bH / 2);
  ctx.lineTo(sx, sy - bH / 2 - 20);
  ctx.lineTo(sx + bW / 2 + 8, sy - bH / 2);
  ctx.closePath();
  ctx.fill();

  // Fresh White Snow Blanket on roof
  ctx.fillStyle = '#f8fafc';
  ctx.beginPath();
  ctx.moveTo(sx - bW / 2 - 10, sy - bH / 2 - 2);
  ctx.lineTo(sx, sy - bH / 2 - 24);
  ctx.lineTo(sx + bW / 2 + 10, sy - bH / 2 - 2);
  ctx.lineTo(sx + bW / 2 + 6, sy - bH / 2 + 2);
  ctx.lineTo(sx, sy - bH / 2 - 18);
  ctx.lineTo(sx - bW / 2 - 6, sy - bH / 2 + 2);
  ctx.closePath();
  ctx.fill();

  // Chimney on Roof puffing hearth smoke
  ctx.fillStyle = '#b91c1c';
  ctx.fillRect(sx + 14, sy - bH / 2 - 22, 10, 16);
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(sx + 12, sy - bH / 2 - 24, 14, 4);

  // Smoke particles
  for (let sm = 0; sm < 3; sm++) {
    const smY = sy - bH / 2 - 28 - ((tick * 0.4 + sm * 14) % 36);
    const smX = sx + 19 + Math.sin(tick * 0.05 + sm) * 6;
    const alpha = Math.max(0, 0.6 - ((tick * 0.4 + sm * 14) % 36) / 36);
    ctx.fillStyle = `rgba(241, 245, 249, ${alpha})`;
    ctx.beginPath();
    ctx.arc(smX, smY, 4 + sm * 1.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // 3. Striped Festive Awning (紅白/藍白北歐條紋遮陽雨棚)
  const awnW = 60;
  const awnH = 14;
  const awnY = sy - 4;
  const stripeColors = ['#dc2626', '#fef08a', '#dc2626', '#fef08a', '#dc2626', '#fef08a'];
  const sStep = awnW / stripeColors.length;
  for (let st = 0; st < stripeColors.length; st++) {
    ctx.fillStyle = stripeColors[st];
    ctx.fillRect(sx - awnW / 2 + st * sStep, awnY, sStep, awnH);
  }

  // 4. Lit Glass Showcase Window (暖黃燈火展示櫥窗)
  ctx.fillStyle = '#fef08a';
  ctx.fillRect(sx - 20, sy + 10, 16, 12);
  ctx.strokeStyle = '#ca8a04';
  ctx.lineWidth = 1;
  ctx.strokeRect(sx - 20, sy + 10, 16, 12);
  ctx.beginPath();
  ctx.moveTo(sx - 12, sy + 10);
  ctx.lineTo(sx - 12, sy + 22);
  ctx.moveTo(sx - 20, sy + 16);
  ctx.lineTo(sx - 4, sy + 16);
  ctx.stroke();

  // 5. Hanging Brass Lantern with Radial Glow (搖曳黃銅壁燈)
  const lBob = Math.sin(tick * 0.08) * 2;
  const lanX = sx + 18;
  const lanY = sy + 14 + lBob;
  // Glow aura
  const gGrad = ctx.createRadialGradient(lanX, lanY, 2, lanX, lanY, 18);
  gGrad.addColorStop(0, 'rgba(254, 240, 138, 0.65)');
  gGrad.addColorStop(1, 'rgba(254, 240, 138, 0)');
  ctx.fillStyle = gGrad;
  ctx.beginPath();
  ctx.arc(lanX, lanY, 18, 0, Math.PI * 2);
  ctx.fill();
  // Lantern body
  ctx.fillStyle = '#ca8a04';
  ctx.fillRect(lanX - 3, lanY - 4, 6, 8);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(lanX - 1.5, lanY - 2, 3, 4);

  // 6. Shopkeeper Avatar at Counter
  ctx.font = '16px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(shopData.shopkeeperAvatar, sx, sy + 14);

  // 7. Overhead Signboard
  ctx.fillStyle = '#0f172a';
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(sx - 52, sy - bH / 2 - 36, 104, 18, [4]);
  ctx.fill();
  ctx.stroke();
  ctx.font = 'bold 9.5px sans-serif';
  ctx.fillStyle = '#fef08a';
  ctx.fillText(`🛒 ${shopData.title.slice(0, 8)}…`, sx, sy - bH / 2 - 27);

  // 8. Player Proximity Interaction Cue
  if (isPlayerNear) {
    // Pulse Radar Ring
    const rPhase = (tick * 0.05) % 1;
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.85)';
    ctx.lineWidth = 2 - rPhase;
    ctx.beginPath();
    ctx.ellipse(sx, sy + bH / 2 + 4, 30 + rPhase * 16, 12 + rPhase * 6, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Floating Interaction Badge
    const bBob = Math.sin(tick * 0.1) * 3;
    const badgeY = sy - bH / 2 - 58 + bBob;
    ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.roundRect(sx - 66, badgeY - 10, 132, 22, [6]);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 9.5px sans-serif';
    ctx.fillText('🛒 [E / 點擊] 進入商店', sx, badgeY + 1);
  }

  ctx.restore();
}

export function drawTownAtmosphereDecorations(
  ctx: CanvasRenderingContext2D,
  chapterIdx: number,
  width: number,
  height: number,
  tick: number
) {
  ctx.save();

  // A. Street Lamps at Walkways (歐風鑄鐵路燈與暖光光暈)
  const lampPositions = [
    { x: 140, y: 390 },
    { x: 420, y: 380 },
    { x: 700, y: 390 },
  ];

  lampPositions.forEach((lp) => {
    // Ground circular warm glow
    const gGrad = ctx.createRadialGradient(lp.x, lp.y + 16, 4, lp.x, lp.y + 16, 44);
    gGrad.addColorStop(0, 'rgba(254, 240, 138, 0.28)');
    gGrad.addColorStop(1, 'rgba(254, 240, 138, 0)');
    ctx.fillStyle = gGrad;
    ctx.beginPath();
    ctx.arc(lp.x, lp.y + 16, 44, 0, Math.PI * 2);
    ctx.fill();

    // Lamp Post Pole
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(lp.x - 2, lp.y - 28, 4, 38);
    // Base
    ctx.fillRect(lp.x - 5, lp.y + 8, 10, 4);
    // Lantern Fixture
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(lp.x - 6, lp.y - 34, 12, 4);
    ctx.fillRect(lp.x - 4, lp.y - 38, 8, 4);
    // Bulb
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(lp.x - 3, lp.y - 30, 6, 8);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(lp.x - 1, lp.y - 28, 2, 4);
  });

  // B. Snow-covered Christmas Pine Tree with Twinkle Lights (積雪聖誕松樹與彩色仙女燈)
  const treePositions = [
    { x: 90, y: 370 },
    { x: 820, y: 360 },
  ];

  treePositions.forEach((tp) => {
    // Trunk
    ctx.fillStyle = '#451a03';
    ctx.fillRect(tp.x - 4, tp.y + 10, 8, 16);

    // 3 Tiers of Pine foliage
    const tiers = [
      { y: tp.y + 8, w: 38, h: 18 },
      { y: tp.y - 4, w: 28, h: 16 },
      { y: tp.y - 14, w: 18, h: 14 },
    ];
    tiers.forEach((t) => {
      ctx.fillStyle = '#064e3b';
      ctx.beginPath();
      ctx.moveTo(tp.x - t.w / 2, t.y);
      ctx.lineTo(tp.x, t.y - t.h);
      ctx.lineTo(tp.x + t.w / 2, t.y);
      ctx.closePath();
      ctx.fill();

      // Snow on edge
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.moveTo(tp.x - t.w / 2, t.y);
      ctx.lineTo(tp.x - t.w / 2 + 4, t.y - 4);
      ctx.lineTo(tp.x + t.w / 2 - 4, t.y - 4);
      ctx.lineTo(tp.x + t.w / 2, t.y);
      ctx.closePath();
      ctx.fill();
    });

    // Gold Star on Top
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('⭐', tp.x, tp.y - 26);

    // Twinkling Holiday Lights
    const lightColors = ['#f43f5e', '#38bdf8', '#facc15', '#4ade80'];
    for (let l = 0; l < 6; l++) {
      const lx = tp.x + Math.sin(l * 1.8) * (10 - l);
      const ly = tp.y - 10 + l * 4;
      const tw = Math.sin(tick * 0.12 + l) > 0 ? 1 : 0.3;
      ctx.fillStyle = lightColors[l % lightColors.length];
      ctx.globalAlpha = tw;
      ctx.beginPath();
      ctx.arc(lx, ly, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  });

  // C. Cozy Campfire / Firepit (暖心石砌營火)
  const fireX = 520;
  const fireY = 410;
  // Stone Ring
  ctx.fillStyle = '#64748b';
  ctx.beginPath();
  ctx.ellipse(fireX, fireY, 18, 9, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#334155';
  ctx.beginPath();
  ctx.ellipse(fireX, fireY, 13, 6, 0, 0, Math.PI * 2);
  ctx.fill();
  // Fire Wood
  ctx.fillStyle = '#78350f';
  ctx.fillRect(fireX - 8, fireY - 4, 16, 4);
  // Animated Flame
  const fFlicker = Math.sin(tick * 0.25) * 3;
  ctx.fillStyle = '#ea580c';
  ctx.beginPath();
  ctx.moveTo(fireX - 7, fireY - 2);
  ctx.quadraticCurveTo(fireX + fFlicker, fireY - 18, fireX, fireY - 20);
  ctx.quadraticCurveTo(fireX - fFlicker, fireY - 18, fireX + 7, fireY - 2);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#fde047';
  ctx.beginPath();
  ctx.arc(fireX, fireY - 7, 4, 0, Math.PI * 2);
  ctx.fill();
  // Rising Ember Sparks
  for (let em = 0; em < 3; em++) {
    const emY = fireY - 14 - ((tick * 0.8 + em * 12) % 24);
    const emX = fireX + Math.sin(tick * 0.1 + em) * 6;
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(emX, emY, 2, 2);
  }

  // D. Frosty Snowman with Scarf (圍巾紅鼻小雪人)
  const snX = 640;
  const snY = 420;
  // Bottom snowball
  ctx.fillStyle = '#f8fafc';
  ctx.beginPath();
  ctx.arc(snX, snY + 8, 11, 0, Math.PI * 2);
  ctx.fill();
  // Middle snowball
  ctx.beginPath();
  ctx.arc(snX, snY - 4, 8, 0, Math.PI * 2);
  ctx.fill();
  // Head snowball
  ctx.beginPath();
  ctx.arc(snX, snY - 15, 6, 0, Math.PI * 2);
  ctx.fill();
  // Red Scarf
  ctx.fillStyle = '#e11d48';
  ctx.fillRect(snX - 7, snY - 10, 14, 3);
  ctx.fillRect(snX + 3, snY - 8, 3, 7);
  // Coal Eyes & Carrot Nose
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(snX - 3, snY - 17, 1.5, 1.5);
  ctx.fillRect(snX + 1.5, snY - 17, 1.5, 1.5);
  ctx.fillStyle = '#ea580c';
  ctx.fillRect(snX - 1, snY - 15, 4, 2);

  ctx.restore();
}


export function drawInteractiveTownBuildings(
  ctx: CanvasRenderingContext2D,
  chapterId: string,
  tick: number,
  playerPos: { x: number; y: number }
) {
  const buildings = NORDIC_BUILDINGS_CONFIG[chapterId] || [];

  buildings.forEach((b) => {
    ctx.save();
    const bx = b.x;
    const by = b.y;
    const isNear = Math.hypot(playerPos.x - bx, playerPos.y - by) < 58;

    // 1. Building Facade Frame (54x42 px)
    const bW = 56;
    const bH = 42;
    const wallColor =
      b.type === 'special_monument'
        ? '#581c87'
        : b.type === 'inn'
        ? '#78350f'
        : b.type === 'forge'
        ? '#451a03'
        : b.type === 'library'
        ? '#1e293b'
        : b.type === 'cathedral'
        ? '#0f766e'
        : '#1e1b4b';

    // Special Halo & Golden Pillars for special_monument
    if (b.type === 'special_monument') {
      const haloGrad = ctx.createRadialGradient(bx, by, 6, bx, by, 48);
      haloGrad.addColorStop(0, 'rgba(250, 204, 21, 0.45)');
      haloGrad.addColorStop(0.6, 'rgba(168, 85, 247, 0.25)');
      haloGrad.addColorStop(1, 'rgba(168, 85, 247, 0)');
      ctx.fillStyle = haloGrad;
      ctx.beginPath();
      ctx.arc(bx, by, 48, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = wallColor;
    ctx.fillRect(bx - bW / 2, by - bH / 2, bW, bH);
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(bx - bW / 2, by - bH / 2, bW, bH);

    // 2. Sloped Roof with Snow Blanket
    const roofColor =
      b.type === 'cathedral' ? '#14b8a6' : b.type === 'library' ? '#334155' : '#881337';
    ctx.fillStyle = roofColor;
    ctx.beginPath();
    ctx.moveTo(bx - bW / 2 - 6, by - bH / 2);
    ctx.lineTo(bx, by - bH / 2 - 18);
    ctx.lineTo(bx + bW / 2 + 6, by - bH / 2);
    ctx.closePath();
    ctx.fill();

    // Snow on roof
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.moveTo(bx - bW / 2 - 7, by - bH / 2 - 2);
    ctx.lineTo(bx, by - bH / 2 - 21);
    ctx.lineTo(bx + bW / 2 + 7, by - bH / 2 - 2);
    ctx.lineTo(bx + bW / 2 + 3, by - bH / 2 + 2);
    ctx.lineTo(bx, by - bH / 2 - 15);
    ctx.lineTo(bx - bW / 2 - 3, by - bH / 2 + 2);
    ctx.closePath();
    ctx.fill();

    // 3. Lit Arched Windows / Fireplace Glow
    const glowColor =
      b.type === 'forge'
        ? 'rgba(249, 115, 22, 0.85)'
        : b.type === 'inn'
        ? 'rgba(254, 240, 138, 0.9)'
        : 'rgba(56, 189, 248, 0.85)';
    ctx.fillStyle = glowColor;
    ctx.fillRect(bx - 18, by - 2, 12, 14);
    ctx.fillRect(bx + 6, by - 2, 12, 14);

    // Chimney & Smoke for Inn and Forge
    if (b.type === 'inn' || b.type === 'forge') {
      ctx.fillStyle = '#b91c1c';
      ctx.fillRect(bx + 12, by - bH / 2 - 20, 8, 14);
      for (let s = 0; s < 3; s++) {
        const sY = by - bH / 2 - 24 - ((tick * 0.4 + s * 12) % 30);
        const sX = bx + 16 + Math.sin(tick * 0.08 + s) * 5;
        ctx.fillStyle = 'rgba(241, 245, 249, 0.45)';
        ctx.beginPath();
        ctx.arc(sX, sY, 3 + s, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // 4. Building Icon Badge
    ctx.font = '16px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(b.icon, bx, by + 12);

    // 5. Overhead Building Nameplate
    const isSpecialBld = b.type === 'special_monument';
    ctx.fillStyle = isSpecialBld ? 'rgba(59, 7, 100, 0.95)' : 'rgba(15, 23, 42, 0.95)';
    ctx.strokeStyle = isSpecialBld ? '#facc15' : '#38bdf8';
    ctx.lineWidth = isSpecialBld ? 1.8 : 1.2;
    ctx.beginPath();
    ctx.roundRect(bx - 58, by - bH / 2 - 35, 116, 17, [5]);
    ctx.fill();
    ctx.stroke();

    ctx.font = 'bold 9px sans-serif';
    ctx.fillStyle = isSpecialBld ? '#fde047' : '#67e8f9';
    ctx.fillText(b.name.split(' (')[0].slice(0, 10), bx, by - bH / 2 - 26);

    // 6. Proximity Radar Ring and [E / 點擊] Prompt
    if (isNear) {
      const rPhase = (tick * 0.05) % 1;
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.85)';
      ctx.lineWidth = 2 - rPhase;
      ctx.beginPath();
      ctx.ellipse(bx, by + bH / 2 + 6, 26 + rPhase * 14, 10 + rPhase * 5, 0, 0, Math.PI * 2);
      ctx.stroke();

      const bBob = Math.sin(tick * 0.1) * 3;
      const badgeY = by - bH / 2 - 54 + bBob;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.roundRect(bx - 60, badgeY - 10, 120, 20, [6]);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#fef08a';
      ctx.font = 'bold 9px sans-serif';
      ctx.fillText(`🚪 [E/點擊] 進入${b.name.split(' ')[0].slice(0, 4)}`, bx, badgeY);
    }

    ctx.restore();
  });
}


export function drawInteractiveNordicAnimals(
  ctx: CanvasRenderingContext2D,
  chapterId: string,
  tick: number,
  playerPos: { x: number; y: number },
  interactedIds: string[]
) {
  const animals = NORDIC_INTERACTIVE_ANIMALS.filter((a) => a.chapterId === chapterId);

  animals.forEach((an, idx) => {
    ctx.save();
    // Gentle organic horizontal roam within [minX, maxX]
    const span = (an.maxX - an.minX) / 2;
    const midX = (an.minX + an.maxX) / 2;
    const phase = tick * 0.022 + idx * 2.1;
    const ax = midX + Math.sin(phase) * span;
    const ay = an.y + Math.abs(Math.sin(tick * 0.12 + idx)) * -4;
    const facingRight = Math.cos(phase) >= 0;
    const isNear = Math.hypot(playerPos.x - ax, playerPos.y - ay) < 58;
    const isFed = interactedIds.includes(an.id);

    // Store current dynamic position on object for click/key hit-testing
    an.x = ax;

    // 1. Soft snow shadow & radar aura
    ctx.fillStyle = isFed ? 'rgba(52, 211, 153, 0.3)' : 'rgba(251, 191, 36, 0.25)';
    ctx.beginPath();
    ctx.ellipse(ax, an.y + 12, 18, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    // 2. Cute 16-bit Pixel Pedestal / Fur Halo
    ctx.strokeStyle = isFed ? '#34d399' : '#fbbf24';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(ax, ay, 17, 0, Math.PI * 2);
    ctx.stroke();

    // 3. Animal Sprite Icon with directional flip
    ctx.save();
    ctx.translate(ax, ay);
    if (!facingRight) ctx.scale(-1, 1);
    ctx.font = '22px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(an.icon, 0, 0);
    ctx.restore();

    // 4. Floating Heart / Musical Note above happy animal
    const floatY = ay - 22 + Math.sin(tick * 0.1 + idx) * 3;
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(isFed ? '💖' : '🐾', ax + 14, floatY);

    // 5. Compact Animal Name Tag
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.strokeStyle = isFed ? '#10b981' : '#f59e0b';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(ax - 44, ay + 15, 88, 14, [4]);
    ctx.fill();
    ctx.stroke();

    ctx.font = 'bold 8.5px sans-serif';
    ctx.fillStyle = isFed ? '#a7f3d0' : '#fde68a';
    const shortName = an.name.split('·').pop()?.split(' (')[0] || an.name.slice(0, 7);
    ctx.fillText(`${an.icon} ${shortName.slice(0, 7)}`, ax, ay + 22);

    // 6. Proximity Interaction Prompt
    if (isNear) {
      const bob = Math.sin(tick * 0.12) * 3;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.96)';
      ctx.strokeStyle = '#34d399';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.roundRect(ax - 56, ay - 44 + bob, 112, 18, [6]);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#6ee7b7';
      ctx.font = 'bold 9px sans-serif';
      ctx.fillText('🐾 [E/點擊] 撫摸餵食靈獸', ax, ay - 35 + bob);
    }

    ctx.restore();
  });
}

export function drawBossSideWeapons(
  ctx: CanvasRenderingContext2D,
  weapons: BossSideWeapon[],
  boxBounds: { x: number; y: number; w: number; h: number },
  tick: number
) {
  const { x: bx, y: by, w: bw, h: bh } = boxBounds;

  weapons.forEach((w) => {
    ctx.save();
    const wx = w.x;
    const wy = w.y;
    const isFiring = w.state === 'firing';
    const chargePct = w.maxChargeTicks > 0 ? Math.max(0, 1 - w.chargeTicks / w.maxChargeTicks) : 1;
    const fireProgress = isFiring ? Math.max(0, Math.min(1, 1 - w.fireTicks / 26)) : 0;
    const isRight = w.side === 'right';

    // ========================================================================
    // 1. RENDER DISTINCT BOSS ELEMENTAL WEAPON SPRITE & UNIQUE MOTION PHYSICS
    // ========================================================================
    if (w.type === 'mjolnir_hammer' || w.type === 'bluetooth_pylon') {
      // 🇩🇰 丹麥藍牙王：🔨 耶靈雷神戰鎚 (Mjölnir) & 📡 藍牙盧恩方尖碑 — 雷霆重擊與電磁脈衝
      ctx.save();
      const slamOffset = isFiring
        ? Math.sin(fireProgress * Math.PI) * (isRight ? -56 : 56)
        : (isRight ? 16 : -16) * chargePct;
      ctx.translate(wx + slamOffset, wy);

      const hammerTilt = isFiring
        ? (isRight ? -0.85 : 0.85) * Math.sin(fireProgress * Math.PI)
        : (isRight ? 0.45 : -0.45) * chargePct;
      ctx.rotate(hammerTilt);
      if (isRight) ctx.scale(-1, 1);

      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = isFiring ? 26 : 14;

      if (w.type === 'mjolnir_hammer') {
        ctx.fillStyle = '#64748b';
        ctx.fillRect(-26, -5, 68, 10);
        ctx.fillStyle = '#fde047';
        ctx.fillRect(-28, -7, 8, 14);
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(36, -34, 44, 68);
        ctx.strokeStyle = '#bae6fd';
        ctx.lineWidth = 2.5;
        ctx.strokeRect(36, -34, 44, 68);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 22px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('ᛒ', 58, 0);
      } else {
        ctx.fillStyle = '#0f172a';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(-16, -24);
        ctx.lineTo(24, -14);
        ctx.lineTo(36, 0);
        ctx.lineTo(24, 14);
        ctx.lineTo(-16, 24);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#fde047';
        ctx.font = 'bold 16px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('📶', 8, 0);
      }
      ctx.restore();
    } else if (w.type === 'vasa_anchor_halberd' || w.type === 'pirate_flintlock') {
      // 🇸🇪 瑞典瓦薩號：⚓ 瓦薩深海巨錨 (鐘擺鐵鏈甩動) & 💣 1628 皇家青銅艦砲
      ctx.save();
      if (w.type === 'vasa_anchor_halberd') {
        const pendulumAng = isFiring
          ? Math.cos(fireProgress * Math.PI * 1.5) * 0.95
          : (isRight ? 0.55 : -0.55) * chargePct;
        const swingX = wx + (isFiring ? (isRight ? -52 : 52) * Math.sin(fireProgress * Math.PI) : 0);
        const swingY = wy + Math.sin(pendulumAng) * 24;

        ctx.strokeStyle = '#5eead4';
        ctx.lineWidth = 3;
        ctx.setLineDash([5, 4]);
        ctx.beginPath();
        ctx.moveTo(wx + (isRight ? 30 : -30), wy - 45);
        ctx.lineTo(swingX, swingY);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.translate(swingX, swingY);
        ctx.rotate(pendulumAng);
        if (isRight) ctx.scale(-1, 1);

        ctx.shadowColor = '#2dd4bf';
        ctx.shadowBlur = 22;
        ctx.fillStyle = '#0f766e';
        ctx.fillRect(-14, -5, 76, 10);
        ctx.strokeStyle = '#99f6e4';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(48, 0, 26, -Math.PI * 0.68, Math.PI * 0.68);
        ctx.stroke();
        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.arc(-14, 0, 7, 0, Math.PI * 2);
        ctx.fill();
      } else {
        const recoil = isFiring ? Math.sin(fireProgress * Math.PI) * (isRight ? 14 : -14) : 0;
        ctx.translate(wx + recoil, wy);
        if (isRight) ctx.scale(-1, 1);
        ctx.shadowColor = '#facc15';
        ctx.shadowBlur = 18;
        ctx.fillStyle = '#78350f';
        ctx.fillRect(-20, 6, 36, 12);
        ctx.fillStyle = '#d97706';
        ctx.strokeStyle = '#fef08a';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-18, -10);
        ctx.lineTo(28, -7);
        ctx.lineTo(32, 7);
        ctx.lineTo(-18, 10);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#fef08a';
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('🦁', 2, 3);
      }
      ctx.restore();
    } else if (w.type === 'chaos_saber' || w.type === 'gaster_blaster') {
      // 🇫🇮 芬蘭薩米巫師：⚔️ 混沌雙刃聖劍 (Chaos Saber) & 💀 龍顱極光巨砲 (Gaster Blaster)
      if (w.type === 'chaos_saber') {
        ctx.save();
        const lungeOffset = isFiring
          ? Math.sin(fireProgress * Math.PI) * (isRight ? -74 : 74)
          : (isRight ? 12 : -12) * chargePct;
        ctx.translate(wx + lungeOffset, wy);

        const swingAngle = isFiring
          ? isRight
            ? 1.28 - fireProgress * 2.5
            : -1.28 + fireProgress * 2.5
          : isRight
          ? 0.45 + chargePct * 0.75
          : -0.45 - chargePct * 0.75;

        if (isFiring) {
          ctx.save();
          ctx.strokeStyle = '#e879f9';
          ctx.lineWidth = 15 * Math.sin(fireProgress * Math.PI);
          ctx.shadowColor = '#e879f9';
          ctx.shadowBlur = 24;
          ctx.beginPath();
          if (isRight) ctx.arc(0, 0, 112, Math.PI - 1.15, Math.PI + 1.15);
          else ctx.arc(0, 0, 112, -1.15, 1.15);
          ctx.stroke();

          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 7 * Math.sin(fireProgress * Math.PI);
          ctx.beginPath();
          if (isRight) ctx.arc(0, 0, 98, Math.PI - 1.0, Math.PI + 1.0);
          else ctx.arc(0, 0, 98, -1.0, 1.0);
          ctx.stroke();
          ctx.restore();
        }

        ctx.rotate(swingAngle);
        if (isRight) ctx.scale(-1, 1);
        ctx.shadowColor = '#e879f9';
        ctx.shadowBlur = isFiring ? 26 : 16;

        ctx.fillStyle = '#facc15';
        ctx.fillRect(-24, -6, 12, 12);
        ctx.fillRect(-12, -20, 7, 40);
        ctx.fillStyle = '#e879f9';
        ctx.beginPath();
        ctx.moveTo(-5, -13);
        ctx.lineTo(106, -7);
        ctx.lineTo(130, 0);
        ctx.lineTo(106, 7);
        ctx.lineTo(-5, 13);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(-4, -5, 114, 10);
        ctx.restore();
      } else {
        ctx.save();
        ctx.translate(wx, wy);
        const jawOpen = isFiring ? 10 + Math.sin(tick * 0.6) * 2 : chargePct * 5;
        ctx.shadowColor = w.color;
        ctx.shadowBlur = isFiring ? 22 : 10;
        ctx.fillStyle = '#e2e8f0';
        ctx.fillRect(-20, -18, 7, 10);
        ctx.fillRect(13, -18, 7, 10);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(-15, -14 - jawOpen * 0.3, 30, 18);
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 2;
        ctx.strokeRect(-15, -14 - jawOpen * 0.3, 30, 18);
        ctx.fillStyle = tick % 4 < 2 ? w.color : '#fde047';
        ctx.fillRect(-10, -7 - jawOpen * 0.3, 6, 6);
        ctx.fillRect(4, -7 - jawOpen * 0.3, 6, 6);
        ctx.fillStyle = '#cbd5e1';
        ctx.fillRect(-12, 4 + jawOpen * 0.6, 24, 8);
        ctx.restore();
      }
    } else if (w.type === 'kantele_string' || w.type === 'star_cannon') {
      // 🇫🇮 芬蘭赫爾辛基萬奈摩寧：🪕 黃金五弦神琴 (Kantele Harp) & 🎺 聖殿紫銅聖詠號角
      ctx.save();
      ctx.translate(wx + (isFiring ? (isRight ? -24 : 24) * Math.sin(fireProgress * Math.PI) : 0), wy);
      if (isRight) ctx.scale(-1, 1);
      ctx.shadowColor = '#facc15';
      ctx.shadowBlur = 22;

      if (w.type === 'kantele_string') {
        ctx.fillStyle = '#ca8a04';
        ctx.strokeStyle = '#fef08a';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(-14, -28);
        ctx.quadraticCurveTo(42, -34, 58, -10);
        ctx.lineTo(58, 12);
        ctx.quadraticCurveTo(36, 30, -14, 28);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        for (let s = -2; s <= 2; s++) {
          const vib = isFiring ? Math.sin(tick * 0.8 + s) * 2.5 : 0;
          ctx.beginPath();
          ctx.moveTo(-6, s * 8);
          ctx.quadraticCurveTo(22, s * 6 + vib, 50, s * 3);
          ctx.stroke();
        }
      } else {
        ctx.fillStyle = '#b45309';
        ctx.strokeStyle = '#fde047';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-18, -6);
        ctx.lineTo(24, -20);
        ctx.lineTo(24, 20);
        ctx.lineTo(-18, 6);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#fef08a';
        ctx.font = 'bold 14px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('♪', 6, 4);
      }
      ctx.restore();
    } else if (w.type === 'viking_axe' || w.type === 'crimson_trident') {
      // 🇳🇴 挪威無情者哈拉爾：🪓 瓦蘭吉 360° 狂戰迴旋巨斧 & 🔱 鮮紅王權三叉戟
      ctx.save();
      if (w.type === 'viking_axe') {
        const spinLunge = isFiring ? Math.sin(fireProgress * Math.PI) * (isRight ? -82 : 82) : 0;
        ctx.translate(wx + spinLunge, wy);

        ctx.strokeStyle = isFiring ? '#67e8f9' : 'rgba(244, 63, 94, 0.6)';
        ctx.lineWidth = isFiring ? 4 : 2;
        ctx.beginPath();
        ctx.arc(0, 0, isFiring ? 46 : 32, 0, Math.PI * 1.65);
        ctx.stroke();

        ctx.rotate(tick * (isFiring ? 0.55 : 0.22));
        ctx.shadowColor = '#f43f5e';
        ctx.shadowBlur = 22;

        ctx.fillStyle = '#e2e8f0';
        ctx.fillRect(-34, -4, 68, 8);
        ctx.fillStyle = '#e11d48';
        ctx.beginPath();
        ctx.moveTo(-8, -32);
        ctx.quadraticCurveTo(0, -14, 8, -32);
        ctx.quadraticCurveTo(28, -22, 22, 0);
        ctx.quadraticCurveTo(28, 22, 8, 32);
        ctx.quadraticCurveTo(0, 14, -8, 32);
        ctx.quadraticCurveTo(-28, 22, -22, 0);
        ctx.quadraticCurveTo(-28, -22, -8, -32);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
      } else {
        const thrustOffset = isFiring
          ? Math.sin(fireProgress * Math.PI) * (isRight ? -68 : 68)
          : (isRight ? 14 : -14) * chargePct;
        ctx.translate(wx + thrustOffset, wy);
        if (isRight) ctx.scale(-1, 1);
        ctx.shadowColor = '#f43f5e';
        ctx.shadowBlur = 22;

        ctx.fillStyle = '#e11d48';
        ctx.fillRect(-26, -3, 62, 6);
        ctx.fillStyle = '#fb7185';
        ctx.fillRect(28, -18, 6, 36);
        ctx.fillRect(34, -18, 26, 5);
        ctx.fillRect(34, -3, 36, 6);
        ctx.fillRect(34, 13, 26, 5);
      }
      ctx.restore();
    } else if (w.type === 'twilight_sword') {
      // 🇮🇸 冰島史爾特爾：🗡️ 暮光滅世炎魔神劍 (Laevateinn — 天降垂直滅世劈斬！)
      ctx.save();
      const isTopPlunge = w.side === 'top';
      const plungeX = wx;
      const plungeY = isTopPlunge
        ? wy + (isFiring ? Math.sin(fireProgress * Math.PI) * 95 : -12 * chargePct)
        : wy;
      ctx.translate(plungeX, plungeY);
      if (isTopPlunge) {
        ctx.rotate(Math.PI / 2);
      } else if (isRight) {
        ctx.scale(-1, 1);
      }

      ctx.shadowColor = '#f97316';
      ctx.shadowBlur = 28;
      ctx.fillStyle = '#450a0a';
      ctx.fillRect(-24, -18, 12, 36);
      ctx.fillStyle = '#ea580c';
      ctx.beginPath();
      ctx.moveTo(-10, -16);
      ctx.lineTo(42, -22);
      ctx.lineTo(35, -11);
      ctx.lineTo(94, -15);
      ctx.lineTo(136, 0);
      ctx.lineTo(94, 15);
      ctx.lineTo(35, 11);
      ctx.lineTo(42, 22);
      ctx.lineTo(-10, 16);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(-6, -5, 120, 10);
      ctx.restore();
    }

    // ========================================================================
    // 2. WHILE CHARGING: BOSS-SPECIFIC ELEMENTAL TELEGRAPH (預警特效)
    // ========================================================================
    if (w.state === 'charging' && w.beamThickness > 0) {
      const isBlink = Math.sin(tick * 0.4) > 0;
      ctx.save();
      ctx.strokeStyle = isBlink ? '#ffffff' : w.color;
      ctx.lineWidth = 1.8;
      ctx.setLineDash([8, 6]);

      ctx.beginPath();
      if (w.side === 'left' || w.side === 'right') {
        ctx.moveTo(bx + 6, w.targetCoord);
        ctx.lineTo(bx + bw - 6, w.targetCoord);
      } else {
        ctx.moveTo(w.targetCoord, by + 6);
        ctx.lineTo(w.targetCoord, by + bh - 6);
      }
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = w.glowColor;
      ctx.globalAlpha = 0.22;
      if (w.side === 'left' || w.side === 'right') {
        ctx.fillRect(bx + 4, w.targetCoord - w.beamThickness / 2, bw - 8, w.beamThickness);
      } else {
        ctx.fillRect(w.targetCoord - w.beamThickness / 2, by + 4, w.beamThickness, bh - 8);
      }
      ctx.restore();
    }

    // ========================================================================
    // 3. WHILE FIRING: 6 COMPLETELY DIFFERENT ELEMENTAL ATTACK METHODS (不同攻擊特效)
    // ========================================================================
    if (w.state === 'firing' && w.beamThickness > 0) {
      ctx.save();
      const bThick = w.beamThickness;

      if (w.type === 'mjolnir_hammer' || w.type === 'bluetooth_pylon') {
        // ⚡ 攻擊方法 1 (丹麥藍牙王)：鋸齒狀高壓落雷閃電鏈 + 藍牙盧恩電弧
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 7;
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 20;
        ctx.beginPath();
        const steps = 12;
        for (let s = 0; s <= steps; s++) {
          const px = bx + (bw * s) / steps;
          const jitter = s === 0 || s === steps ? 0 : Math.sin(tick * 0.9 + s * 2.3) * (bThick * 0.65);
          const py = w.targetCoord + jitter;
          if (s === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();

        ctx.strokeStyle = '#fef08a';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 13px monospace';
        for (let r = 1; r <= 3; r++) {
          const rx = bx + (bw * r) / 4;
          const ry = w.targetCoord + Math.cos(tick * 0.7 + r) * 8;
          ctx.fillText(r % 2 === 0 ? 'ᛒ' : 'ᚱ', rx, ry);
        }
      } else if (w.type === 'vasa_anchor_halberd' || w.type === 'pirate_flintlock') {
        // 🌊 攻擊方法 2 (瑞典瓦薩號)：波羅的海翻湧深淵漩渦海浪 & 水花泡沫
        ctx.fillStyle = 'rgba(20, 184, 166, 0.35)';
        ctx.strokeStyle = '#2dd4bf';
        ctx.lineWidth = 4;
        ctx.shadowColor = '#14b8a6';
        ctx.shadowBlur = 16;

        ctx.beginPath();
        for (let xOff = 0; xOff <= bw; xOff += 10) {
          const waveY =
            w.targetCoord +
            Math.sin((xOff * 0.045) + tick * 0.35) * (bThick * 0.55) +
            Math.cos((xOff * 0.09) - tick * 0.25) * 4;
          if (xOff === 0) ctx.moveTo(bx + xOff, waveY);
          else ctx.lineTo(bx + xOff, waveY);
        }
        ctx.stroke();

        ctx.fillStyle = '#ccfbf1';
        for (let b = 0; b < 6; b++) {
          const bxPos = bx + ((tick * 5 + b * 52) % bw);
          const byPos = w.targetCoord + Math.sin(tick * 0.3 + b) * 8;
          ctx.beginPath();
          ctx.arc(bxPos, byPos, 3.5, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (w.type === 'kantele_string' || w.type === 'star_cannon') {
        // 🎼 攻擊方法 4 (芬蘭萬奈摩寧)：5 條發光五線譜黃金琴弦正弦波共鳴震盪 + 音符滑行
        const stringColors = ['#fde047', '#38bdf8', '#e879f9', '#4ade80', '#fb923c'];
        for (let st = -2; st <= 2; st++) {
          const baseLineY = w.targetCoord + st * 5.5;
          ctx.strokeStyle = stringColors[st + 2];
          ctx.lineWidth = 2;
          ctx.shadowColor = '#fde047';
          ctx.shadowBlur = 10;
          ctx.beginPath();
          for (let sx = 0; sx <= bw; sx += 12) {
            const sy =
              baseLineY +
              Math.sin((sx / bw) * Math.PI) * Math.sin(tick * 0.55 + st * 1.1 + sx * 0.04) * 7;
            if (sx === 0) ctx.moveTo(bx + sx, sy);
            else ctx.lineTo(bx + sx, sy);
          }
          ctx.stroke();
        }
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 14px sans-serif';
        const noteX = bx + ((tick * 7) % bw);
        ctx.fillText('𝄞 ♪ ♫', noteX, w.targetCoord - 6);
      } else if (w.type === 'viking_axe' || w.type === 'crimson_trident') {
        // 🔱 攻擊方法 5 (挪威無情者哈拉爾)：三道平行尖銳赤紅三叉戟芒突刺
        const prongOffsets = [-9, 0, 9];
        prongOffsets.forEach((pOff, idx) => {
          const py = w.targetCoord + pOff;
          const reach = idx === 1 ? bw - 10 : bw - 36;
          const startX = isRight ? bx + bw : bx;
          const endX = isRight ? bx + bw - reach : bx + reach;

          ctx.strokeStyle = idx === 1 ? '#ffffff' : '#f43f5e';
          ctx.lineWidth = idx === 1 ? 4.5 : 3;
          ctx.shadowColor = '#e11d48';
          ctx.shadowBlur = 16;
          ctx.beginPath();
          ctx.moveTo(startX, py);
          ctx.lineTo(endX, py);
          ctx.stroke();

          ctx.fillStyle = '#fda4af';
          ctx.beginPath();
          ctx.arc(endX, py, 4, 0, Math.PI * 2);
          ctx.fill();
        });
      } else if (w.type === 'twilight_sword') {
        // 🌋 攻擊方法 6 (冰島史爾特爾)：天降垂直炎魔神劍劈裂大地 + 底部熔岩火坑噴發
        if (w.side === 'top') {
          const cx = w.targetCoord;
          const grad = ctx.createLinearGradient(cx - 16, by, cx + 16, by + bh);
          grad.addColorStop(0, '#fef08a');
          grad.addColorStop(0.5, '#f97316');
          grad.addColorStop(1, '#dc2626');
          ctx.fillStyle = grad;
          ctx.shadowColor = '#ea580c';
          ctx.shadowBlur = 24;
          ctx.beginPath();
          ctx.moveTo(cx - 14, by);
          ctx.lineTo(cx + 14, by);
          ctx.lineTo(cx + 4, by + bh);
          ctx.lineTo(cx - 4, by + bh);
          ctx.closePath();
          ctx.fill();

          ctx.fillStyle = '#fde047';
          ctx.beginPath();
          ctx.ellipse(cx, by + bh - 4, 28, 7, 0, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.strokeStyle = '#f97316';
          ctx.lineWidth = 6;
          ctx.shadowColor = '#dc2626';
          ctx.shadowBlur = 18;
          ctx.beginPath();
          for (let lx = 0; lx <= bw; lx += 14) {
            const ly = w.targetCoord + ((lx / 14) % 2 === 0 ? -5 : 5);
            if (lx === 0) ctx.moveTo(bx + lx, ly);
            else ctx.lineTo(bx + lx, ly);
          }
          ctx.stroke();
        }
      } else {
        // 🌌 攻擊方法 3 (芬蘭薩米巫師 Chaos Saber / 極光龍顱)：漸變梭形雙色極光斬擊裂痕 + 閃爍星芒 ★
        const cy = w.targetCoord;
        ctx.fillStyle = w.glowColor;
        ctx.shadowColor = w.color;
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.moveTo(bx, cy);
        ctx.quadraticCurveTo(bx + bw / 2, cy - bThick * 0.75, bx + bw, cy);
        ctx.quadraticCurveTo(bx + bw / 2, cy + bThick * 0.75, bx, cy);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(bx + 12, cy);
        ctx.quadraticCurveTo(bx + bw / 2, cy - bThick * 0.28, bx + bw - 12, cy);
        ctx.quadraticCurveTo(bx + bw / 2, cy + bThick * 0.28, bx + 12, cy);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#fde047';
        ctx.font = 'bold 12px sans-serif';
        for (let sp = 1; sp <= 3; sp++) {
          const spX = bx + (bw * sp) / 4;
          ctx.fillText('★', spX, cy + 4);
        }
      }

      ctx.restore();
    }

    ctx.restore();
  });
}

export type BossAnimState = 'idle' | 'dialogue' | 'move' | 'attack_cast' | 'hit_recoil' | 'enrage';

export function getBossBgmTrack(bossType: string): BgmTrackId {
  if (bossType === 'harald_bluetooth') return 'boss_bluetooth';
  if (bossType === 'captain_vasa') return 'boss_vasa';
  if (bossType === 'sami_shaman') return 'boss_sami';
  if (bossType === 'vainamoinen') return 'boss_kantele';
  if (bossType === 'harald_hardrada') return 'boss_hardrada';
  if (bossType === 'surtr_final' || bossType === 'surtr') return 'boss_surtr';
  return 'boss_clash';
}

export interface BossPreBattleCutscene {
  speaker: string;
  title: string;
  landmarkStage: string;
  danmakuSignature: string;
  lines: {
    text: string;
    pose: BossAnimState;
    sfx: 'roar' | 'magic' | 'slash' | 'blip';
    stageEffect: string;
  }[];
}

export const BOSS_PRE_BATTLE_CUTSCENES: Record<string, BossPreBattleCutscene> = {
  harald_bluetooth: {
    speaker: '藍牙王 哈拉爾一世 (Harald Bluetooth)',
    title: '丹麥與挪威統一者 · 耶靈盧恩石碑之主',
    landmarkStage: '哥本哈根新港運河 & 阿馬林堡宮廣場',
    danmakuSignature: '【藍色盧恩符文環繞波動 × 新港彩色木屋墜落 × 小美人魚潮汐水泡】',
    lines: [
      {
        text: '「止步吧，踏入哥本哈根極夜的旅人！吾乃哈拉爾·戈姆松——世人稱頌的『藍牙王』！」',
        pose: 'dialogue',
        sfx: 'roar',
        stageEffect: '⚡ 耶靈石碑古盧恩符文（ᚼᛒ）於新港夜空緩緩亮起！',
      },
      {
        text: '「西元 965 年，吾於耶靈立下萬鈞石碑，以盧恩符文連結丹麥與挪威！千年之後，吾之名諱依舊連結著全世界的訊號！」',
        pose: 'move',
        sfx: 'magic',
        stageEffect: '📶 皇家藍牙符文環繞結界展開，新港運河波光震盪！',
      },
      {
        text: '「想跨越厄勒海峽前往瑞典？先在吾的【藍色盧恩環繞波動】與新港童話風暴中證明你的靈魂共鳴吧！」',
        pose: 'attack_cast',
        sfx: 'slash',
        stageEffect: '🌊 藍牙王高舉盧恩龍首權杖，地標彈幕試煉正式降臨！',
      },
    ],
  },
  captain_vasa: {
    speaker: '瓦薩號幽靈船長 (Captain of the Vasa)',
    title: '1628 波羅的海沉沒皇艦之魂 · 老城窄巷守望者',
    landmarkStage: '瓦薩沉船博物館 & 老城 90cm 莫滕特羅齊格窄巷',
    danmakuSignature: '【1628 歷史遺物重砲 × 1520 大廣場滾動鵝卵石 × 90cm 極窄巷道傾覆】',
    lines: [
      {
        text: '「嘎吱……聽見橡木龍骨在冰冷海水中哀鳴的聲音了嗎？1628 年 8 月 10 日，瓦薩號首航僅千餘公尺便沉入漆黑海底……」',
        pose: 'dialogue',
        sfx: 'roar',
        stageEffect: '⚓ 波羅的海深淵綠霧湧起，64 門青銅重砲緩緩推入砲門！',
      },
      {
        text: '「古斯塔夫國王追求雙層砲甲板的極致榮耀，卻讓我們在微風中傾覆沉睡了 333 年！這份失衡的重量，你也來體會吧！」',
        pose: 'move',
        sfx: 'magic',
        stageEffect: '🧱 結界壓縮為斯德哥爾摩老城 90 公分極窄通道（Mårten Trotzigs Gränd）！',
      },
      {
        text: '「全艦聽令——！發射【1628 歷史遺物青銅砲彈】與大廣場鵝卵石！看你能否在傾覆的窄巷激流中倖存！」',
        pose: 'attack_cast',
        sfx: 'slash',
        stageEffect: '💥 瓦薩號幽靈船舵急速旋轉，雙層火砲齊射轟鳴！',
      },
    ],
  },
  sami_shaman: {
    speaker: '薩米巫師與極光巨狼 (Sámi Shaman & Fenrir)',
    title: '北緯 66°33′ 極圈守護者 · 火狐歐若拉祭司',
    landmarkStage: '羅凡納米北極圈分界線 & Kakslauttanen 玻璃冰屋祭壇',
    danmakuSignature: '【薩米神鼓極光光束召喚 × 北緯 66°33′ 極圈界線軌道切割 × 聖誕郵戳信件】',
    lines: [
      {
        text: '「Buorre beaivi……你腳下踩著的，正是北緯 66°33′07″ 的神聖極圈分界線！此處是永夜與極光的疆域。」',
        pose: 'dialogue',
        sfx: 'magic',
        stageEffect: '❄️ 北緯 66°33′ 純白極圈雷射界線橫貫戰場中央！',
      },
      {
        text: '「在薩米古傳說『Revontulet』中，火狐奔馳雪原掃起萬千星火化為歐若拉；而神鼓（Kannus）的每一次震鳴，皆與天地磁場共鳴！」',
        pose: 'move',
        sfx: 'roar',
        stageEffect: '🐺 極光巨狼芬里爾仰天長嘯，漫天綠紫極光匯聚成高能光束！',
      },
      {
        text: '「敲響太陽神鼓！讓【極圈界線軌道切割】與【極光光束風暴】試煉你是否具備穿越北極圈的純淨之魂！」',
        pose: 'attack_cast',
        sfx: 'slash',
        stageEffect: '🌌 薩米神鼓雷動，極光光束與聖誕老人村郵戳信件同時席捲而來！',
      },
    ],
  },
  vainamoinen: {
    speaker: '史詩賢者 萬奈摩寧 (Väinämöinen)',
    title: '芬蘭民族史詩《卡勒瓦拉》不朽吟遊詩神',
    landmarkStage: '赫爾辛基岩石教堂 22 公里紫銅穹頂 & Löyly 海濱桑拿',
    danmakuSignature: '【芬蘭五弦琴 Kantele 音符軌跡 × 岩石教堂花崗岩塊 × Löyly 桑拿蒸氣上升流】',
    lines: [
      {
        text: '「萬物皆源於歌詠，大地由詩篇鑄就……旅人，在這座十億年花崗岩炸開的聖殿穹頂下，你聽見《卡勒瓦拉》的迴響了嗎？」',
        pose: 'dialogue',
        sfx: 'magic',
        stageEffect: '🪕 岩石教堂 22 公里盤繞紫銅穹頂降下五道金色康特勒琴弦！',
      },
      {
        text: '「吾取深淵巨梭子魚之顎骨造出第一把芬蘭五弦琴（Kantele）。當吾撥動琴弦，連波羅的海的風浪與森林諸神皆屏息傾聽！」',
        pose: 'move',
        sfx: 'blip',
        stageEffect: '♨️ Löyly 煙燻桑拿的滾燙蒸氣（Henki）自波羅的海冰洞冉冉升騰！',
      },
      {
        text: '「聆聽這首花崗岩與蒸氣的交響曲吧！在吾的【芬蘭琴五線譜音符軌跡】中，譜寫出屬於你的北境樂章！」',
        pose: 'attack_cast',
        sfx: 'slash',
        stageEffect: '🎵 萬奈摩寧十指疾撥，七彩音符沿著五線譜正弦軌跡破空飛舞！',
      },
    ],
  },
  harald_hardrada: {
    speaker: '無情者哈拉爾 (Harald Hardrada)',
    title: '最後的維京國王 · 拜占庭瓦蘭吉衛隊統帥',
    landmarkStage: '特羅姆瑟北極大教堂冰山稜鏡 & 極夜峽灣破冰船',
    danmakuSignature: '【瓦蘭吉狂戰雙斧迴旋 × 北極大教堂冰晶稜鏡光束 × 峽灣暴風雪】',
    lines: [
      {
        text: '「哈哈哈！北緯 69° 特羅姆瑟的刺骨狂風，正是吾輩維京戰士最好的溫酒！吾乃哈拉爾三世——最後的維京霸主！」',
        pose: 'dialogue',
        sfx: 'roar',
        stageEffect: '⚓ 極光破冰船撞碎峽灣浮冰，對岸北極大教堂綻放冰藍聖光！',
      },
      {
        text: '「從君士坦丁堡的瓦蘭吉禁衛軍到北海驚濤，吾手中的雙刃戰斧未曾有過一絲猶豫！怯懦者絕無資格飛越北大西洋！」',
        pose: 'move',
        sfx: 'slash',
        stageEffect: '🪓 狂戰士血氣衝霄，空氣中凝結出迴旋雙斧與峽灣寒霜！',
      },
      {
        text: '「拿出你的全部決心吧！在吾的【峽灣狂戰雙斧迴旋】中，讓我見識新時代北境行者的鋒芒！」',
        pose: 'attack_cast',
        sfx: 'roar',
        stageEffect: '⚡ 雙斧撕裂極夜天幕，峽灣決鬥正式展開！',
      },
    ],
  },
  surtr_final: {
    speaker: '火山與冰川之主 史爾特爾 (Surtr of Muspelheim)',
    title: '穆斯貝爾海姆終焉炎魔 · 冰與火創世主宰',
    landmarkStage: '雷克雅維克哈爾格林姆教堂之巔 · 藍湖地熱與全城跨年煙火',
    danmakuSignature: '【穆斯貝爾海姆火山岩漿噴發 × 史托克間歇泉水柱 × 雷克雅維克跨年煙火星雨】',
    lines: [
      {
        text: '「轟隆隆——！跨越丹麥、瑞典、芬蘭與挪威的漫長旅途，你終於站在世界盡頭的冰與火之島了，北境行者！」',
        pose: 'dialogue',
        sfx: 'roar',
        stageEffect: '🌋 歐亞與北美板塊大裂谷劇烈震動，玄武岩柱綻放赤紅熔岩光脈！',
      },
      {
        text: '「吾乃穆斯貝爾海姆之王史爾特爾！當雷克雅維克午夜跨年篝火與數十萬枚煙火齊放，吾手中的炎之魔劍（Lævateinn）將焚盡舊歲！」',
        pose: 'move',
        sfx: 'magic',
        stageEffect: '🎆 哈爾格林姆教堂背後漫天跨年煙火綻放，藍湖與間歇泉沸騰湧動！',
      },
      {
        text: '「諸神黃昏並非毀滅，而是新紀元的創世洗禮！接下吾的【火山岩漿噴發彈幕】與冰火試煉，加冕為北極星傳承者吧！」',
        pose: 'attack_cast',
        sfx: 'slash',
        stageEffect: '🔥 炎之魔劍劈開地脈，熔岩火雨、間歇泉水柱與跨年煙火全面爆發！',
      },
    ],
  },
};
BOSS_PRE_BATTLE_CUTSCENES.surtr = BOSS_PRE_BATTLE_CUTSCENES.surtr_final;

export function getBossCutsceneScript(bossType: string): BossPreBattleCutscene {
  return BOSS_PRE_BATTLE_CUTSCENES[bossType] || BOSS_PRE_BATTLE_CUTSCENES.harald_bluetooth;
}

export interface BossCounterSkillMeta {
  name: string;
  subtitle: string;
  runeSymbol: string;
  primaryColor: string;
  secondaryColor: string;
  bossHitReaction: string;
  baseDamage: number;
}

export const BOSS_COUNTER_SKILLS: Record<string, BossCounterSkillMeta> = {
  harald_bluetooth: {
    name: '⚡ 盧恩超頻破界斬',
    subtitle: 'RUNIC OVERCLOCK COUNTER',
    runeSymbol: 'ᚼᛒ',
    primaryColor: '#38bdf8',
    secondaryColor: '#fde047',
    bossHitReaction: '「什麼？！你竟然在極限閃避瞬間逆向解析了本王的藍牙盧恩波動？！」',
    baseDamage: 75,
  },
  captain_vasa: {
    name: '⚓ 皇家破浪斷錨斬',
    subtitle: 'BALTIC WAVEBREAKER SLASH',
    runeSymbol: '⚓',
    primaryColor: '#2dd4bf',
    secondaryColor: '#fbbf24',
    bossHitReaction: '「不可能！90公分窄巷的青銅重砲彈幕竟被你一劍劈開了？！」',
    baseDamage: 85,
  },
  sami_shaman: {
    name: '🦊 火狐極光返照閃',
    subtitle: 'REVONTULET AURORA PARRY',
    runeSymbol: '❄️',
    primaryColor: '#34d399',
    secondaryColor: '#e879f9',
    bossHitReaction: '「天啊……你捕捉到了北緯 66°33′ 極圈光束的脈動並將其反彈？！」',
    baseDamage: 90,
  },
  vainamoinen: {
    name: '🪕 卡勒瓦拉五弦逆轉共鳴',
    subtitle: 'KANTELE HARMONIC REVERSAL',
    runeSymbol: '𝄞',
    primaryColor: '#facc15',
    secondaryColor: '#38bdf8',
    bossHitReaction: '「好精妙的節奏！你竟能順著康特勒琴的音波軌跡彈奏出反擊和弦！」',
    baseDamage: 95,
  },
  harald_hardrada: {
    name: '🪓 瓦爾哈拉碎冰雙極斬',
    subtitle: 'VALHALLA FROST-SHATTER',
    runeSymbol: 'ᛏ',
    primaryColor: '#f43f5e',
    secondaryColor: '#38bdf8',
    bossHitReaction: '「痛快！！竟能在雙斧迴旋的毫釐之間發動極限反擊，真乃狂戰之魂！」',
    baseDamage: 110,
  },
  surtr_final: {
    name: '🌌 北極星創世極光滅卻',
    subtitle: 'POLARIS SUPERNOVA COUNTER',
    runeSymbol: '✧',
    primaryColor: '#fbbf24',
    secondaryColor: '#38bdf8',
    bossHitReaction: '「轟啊啊啊——！連穆斯貝爾海姆的火山熔岩都被你的極限反擊斬碎了？！」',
    baseDamage: 135,
  },
};
BOSS_COUNTER_SKILLS.surtr = BOSS_COUNTER_SKILLS.surtr_final;

export interface BossPostBattleEpilogue {
  epilogueTitle: string;
  landmarkLocation: string;
  bossFinalSpeech: string;
  historicalConclusion: string;
  nextDestinationHint: string;
  relicTitle: string;
  relicSymbol: string;
  bonusCourage: number;
}

export const BOSS_POST_BATTLE_EPILOGUES: Record<string, BossPostBattleEpilogue> = {
  harald_bluetooth: {
    epilogueTitle: '【丹麥終章結算】耶靈盧恩石碑的千年迴響',
    landmarkLocation: '🇩🇰 哥本哈根 · 阿馬林堡宮廣場 & 新港運河',
    bossFinalSpeech: '「哈哈哈！好久沒有遇見能看穿吾之『ᚼᛒ』藍色符文環繞陣的勇者了！千年前吾以耶靈石碑連結丹麥與挪威；今日，你的極限閃避與決心也將北境的命運重新連結在一起！」',
    historicalConclusion: '西元 965 年，藍牙王哈拉爾一世在日德蘭半島立下耶靈石碑（Jelling Stones），記載統一丹麥並引入基督教的歷史功績，被譽為「丹麥的出生證明」。1996 年科技界更以他的盧恩姓名縮寫（ᚼ 與 ᛒ）創造了今日全球通用的 Bluetooth 藍牙標誌。',
    nextDestinationHint: '🚢 厄勒海峽封印已解除！手持【符文通行鑰匙】，準備啟航前往瑞典斯德哥爾摩老城與瓦薩沉船博物館！',
    relicTitle: '符文通行鑰匙 (Jelling Runic Key)',
    relicSymbol: '🗝️',
    bonusCourage: 15,
  },
  captain_vasa: {
    epilogueTitle: '【瑞典終章結算】波羅的海 333 年沉睡的救贖',
    landmarkLocation: '🇸🇪 斯德哥爾摩 · 瓦薩沉船博物館 & 90cm 最窄巷',
    bossFinalSpeech: '「風平浪靜了……1628 年首航傾覆的遺憾，在海底冰封了整整 333 年。旅人啊，你在那 90 公分窄巷中穿梭重砲的身姿，終於讓瓦薩號全體水手的靈魂得以榮耀靠岸！」',
    historicalConclusion: '1628 年 8 月 10 日，瑞典國王古斯塔夫二世下令建造的 64 門青銅砲皇家旗艦「瓦薩號」因雙層砲甲板重心過高，出港僅 1,300 公尺便在微風中沉沒。1961 年重見天日後，成為全球保存最完好的 17 世紀木造戰艦。',
    nextDestinationHint: '❄️ 波羅的海航線全面暢通！攜帶市政廳金廳【金箔馬賽克護符】，飛往芬蘭拉普蘭北緯 66°33′ 聖誕老人村！',
    relicTitle: '金箔馬賽克護符 (Golden Hall Mosaic Crest)',
    relicSymbol: '🛡️',
    bonusCourage: 18,
  },
  sami_shaman: {
    epilogueTitle: '【芬蘭拉普蘭終章結算】北緯 66°33′ 火狐歐若拉的祝福',
    landmarkLocation: '🇫🇮 羅凡納米 · 北極圈界線 & 穹頂玻璃冰屋',
    bossFinalSpeech: '「Buorre beaivi，純潔的北境行者！薩米神鼓（Kannus）已為你奏響凱歌，極光巨狼也向你的極限反擊俯首。當火狐奔過拉普蘭雪原，漫天歐若拉將永遠照亮你的前路！」',
    historicalConclusion: '在芬蘭語中，北極光被稱為「Revontulet」（意為火狐之火）。相傳極地火狐在雪原奔跑時，尾巴掃過積雪激起萬千火花升入夜空化為極光。跨越北緯 66°33′07″ 極圈白線，象徵正式獲得極夜試煉的最高認證。',
    nextDestinationHint: '🦌 極圈試煉圓滿達成！吹響【極光之笛】，搭乘極地夜車南下芬蘭設計之都赫爾辛基！',
    relicTitle: '極光之笛 (Flute of Revontulet)',
    relicSymbol: '🪈',
    bonusCourage: 20,
  },
  vainamoinen: {
    epilogueTitle: '【芬蘭赫爾辛基終章結算】花崗岩聖殿與《卡勒瓦拉》的共鳴',
    landmarkLocation: '🇫🇮 赫爾辛基 · 岩石教堂紫銅穹頂 & Löyly 桑拿',
    bossFinalSpeech: '「妙哉！妙哉！在這座十億年花崗岩開鑿的聖殿下，你的靈魂步伐竟與老夫的五弦康特勒琴（Kantele）完美合拍！《卡勒瓦拉》的詩篇將永遠傳唱你的名字！」',
    historicalConclusion: '芬蘭民族史詩《卡勒瓦拉》是芬蘭獨立與文化認同的靈魂支柱，智者萬奈摩寧以撥奏五弦琴與歌詠創造萬物。赫爾辛基岩石教堂（Temppeliaukio）直接於天然花崗岩盤炸開建造，頂部以 22 公里紫銅線盤繞，具備世界級的天然音響共鳴。',
    nextDestinationHint: '⛵ 波羅的海冰海洗禮完成！背負【卡勒瓦拉符文豎琴】，前往挪威北極圈門戶特羅姆瑟峽灣！',
    relicTitle: '卡勒瓦拉符文豎琴 (Kalevala Kantele)',
    relicSymbol: '🪕',
    bonusCourage: 22,
  },
  harald_hardrada: {
    epilogueTitle: '【挪威終章結算】北極大教堂下的最後維京禮讚',
    landmarkLocation: '🇳🇴 特羅姆瑟 · 北極大教堂 & 極夜峽灣巡航船',
    bossFinalSpeech: '「痛快至極！！自君士坦丁堡瓦蘭吉衛隊到北海驚濤，本王從未見過如此凌厲的極限閃避與反擊！拿去吧，最後維京國王的雙斧榮耀，今日正式託付於你！」',
    historicalConclusion: '「無情者」哈拉爾三世（Harald Hardrada，1015–1066）年輕時曾遠赴拜占庭帝國擔任精銳瓦蘭吉衛隊統帥，歸國後成為挪威國王，被歷史學家公認為「最後一位偉大的維京國王」。特羅姆瑟則在北緯 69° 的極夜峽灣中守望著這段航海傳奇。',
    nextDestinationHint: '✈️ 挪威峽灣結界突破！握緊【維京戰斧之刃】，飛越北大西洋邁向最終章——冰與火之國冰島！',
    relicTitle: '維京戰斧之刃 (Varangian Twin-Axe)',
    relicSymbol: '🪓',
    bonusCourage: 25,
  },
  surtr_final: {
    epilogueTitle: '【冰島大結局結算】諸神黃昏後的跨年新紀元黎明',
    landmarkLocation: '🇮🇸 雷克雅維克 · 哈爾格林姆教堂 & 藍湖地熱溫泉',
    bossFinalSpeech: '「轟隆隆……炎之魔劍（Lævateinn）的烈焰平息了！在這歐亞與北美板塊交會的裂谷之上，你以冰與火淬煉出的極限連擊超越了諸神黃昏！聽啊，雷克雅維克午夜跨年的鐘聲與漫天煙火，正在為新紀元的北極星霸主加冕！」',
    historicalConclusion: '在北歐神話《詩體埃達》中，火焰巨人史爾特爾在諸神黃昏（Ragnarök）焚盡舊世界後，嶄新的綠地與生命將從海面重生。每年 12 月 31 日，冰島人點燃社區篝火（Brenna）並於哈爾格林姆教堂前施放數十萬枚跨年煙火，象徵浴火重生的永恆希望。',
    nextDestinationHint: '👑 恭喜完成北歐五國 15 天奢華聖誕跨年史詩全章節！你已成為真正的【北極星傳承者】！',
    relicTitle: '北極星創世王冠 (Crown of Polaris)',
    relicSymbol: '👑',
    bonusCourage: 35,
  },
};
BOSS_POST_BATTLE_EPILOGUES.surtr = BOSS_POST_BATTLE_EPILOGUES.surtr_final;

// Draw High-fidelity 16-Bit Undertale-Style Pixel Art Boss with Articulated Limb State Machine
export function drawPixelBossModel(
  ctx: CanvasRenderingContext2D,
  bossType: string,
  bx: number,
  by: number,
  tick: number,
  scale: number = 1.0,
  flashWhite: boolean = false,
  animState: BossAnimState = 'idle',
  hitIntensity: number = 0,
  bossForm: 1 | 2 | 3 = 1
) {
  // Helper for drawing crisp stepped 16-bit pixel blocks (grid size P = 2)
  const P = 2;
  const px = (gx: number, gy: number, gw: number, gh: number, color?: string) => {
    if (color) ctx.fillStyle = color;
    ctx.fillRect(Math.round(gx) * P, Math.round(gy) * P, Math.round(gw) * P, Math.round(gh) * P);
  };

  // Animation State Machine kinematics (自然な肢體擺動與狀態切換)
  const isHit = flashWhite || animState === 'hit_recoil' || hitIntensity > 0;
  const isMoving = animState === 'move' || animState === 'attack_cast' || animState === 'enrage';
  const isTalking = animState === 'dialogue';

  const freq = animState === 'enrage' ? 0.22 : animState === 'attack_cast' ? 0.18 : isMoving ? 0.14 : 0.08;
  const amp = animState === 'enrage' ? 1.6 : animState === 'attack_cast' ? 1.4 : isMoving ? 1.2 : 0.7;

  // Articulated limb offsets in pixel-grid units
  const torsoBob = Math.round(Math.sin(tick * freq) * 1.5 * amp);
  const headBob = Math.round(Math.sin(tick * freq - 0.4) * 1.5 * amp);
  const armSwingL = isHit ? -3 : Math.round(Math.sin(tick * freq * 1.3) * 3.2 * amp);
  const armSwingR = isHit ? 3 : Math.round(Math.cos(tick * freq * 1.3) * 3.5 * amp);
  const legStepL = isHit ? -1 : Math.round(Math.max(-2, Math.sin(tick * freq * 1.3) * 2.2 * amp));
  const legStepR = isHit ? 1 : Math.round(Math.max(-2, -Math.sin(tick * freq * 1.3) * 2.2 * amp));
  const capeWave = Math.round(Math.sin(tick * 0.16) * 2);
  const jawTalk = isTalking && Math.floor(tick / 4) % 2 === 0 ? 1 : 0;
  const bodySwayX = isHit
    ? (tick % 2 === 0 ? -3 : 3)
    : isMoving
    ? Math.round(Math.cos(tick * freq * 0.65) * 2.5)
    : 0;

  const renderBossSpritePass = (tintOverride?: string) => {
    const c = (hex: string) => tintOverride || hex;

    if (bossType === 'harald_bluetooth') {
      // =========================================================================
      // 1. 丹麥藍牙王 (Harald Bluetooth) - 16-Bit Undertale Pixel Art
      // Articulated: Flowing Royal Indigo Cape, Chainmail & Gold Eagle Cuirass,
      // Braided Viking Beard, Winged/Horned Royal Crown + Bearskin Crest,
      // Left Hand Viking Runic Shield, Right Hand Jelling Bluetooth Scepter
      // =========================================================================
      // Ground shadow
      ctx.fillStyle = tintOverride || 'rgba(0,0,0,0.45)';
      ctx.beginPath();
      ctx.ellipse(0, 42, 30, 8, 0, 0, Math.PI * 2);
      ctx.fill();

      // 1) Back Flowing Royal Cape (Stepped pixel contour, no boxy rectangle)
      px(-11 + capeWave, -8 + torsoBob, 22, 22, c('#0f172a'));
      px(-13 + capeWave, -4 + torsoBob, 26, 18, c('#1e1b4b'));
      px(-12 + capeWave, -6 + torsoBob, 24, 20, c('#1e3a8a'));
      px(-10 + capeWave, -4 + torsoBob, 20, 16, c('#1d4ed8'));
      // Tattered & Gold-trimmed pixel hem
      for (let i = -12; i <= 10; i += 3) {
        const drop = (Math.abs(i) + Math.floor(tick / 6)) % 2;
        px(i + capeWave, 14 + torsoBob + drop, 2, 2, c('#eab308'));
        px(i + capeWave, 16 + torsoBob + drop, 2, 1, c('#fef08a'));
      }

      // 2) Articulated Legs & Fur-rimmed Viking Greaves
      // Left Leg
      px(-7, 11 + legStepL, 5, 6, c('#0f172a'));
      px(-6, 12 + legStepL, 3, 4, c('#334155'));
      px(-7, 15 + legStepL, 5, 2, c('#d97706')); // Gold knee guard
      px(-8, 17 + legStepL, 6, 3, c('#451a03')); // Boot
      // Right Leg
      px(2, 11 + legStepR, 5, 6, c('#0f172a'));
      px(3, 12 + legStepR, 3, 4, c('#334155'));
      px(2, 15 + legStepR, 5, 2, c('#d97706'));
      px(2, 17 + legStepR, 6, 3, c('#451a03'));

      // 3) Torso: Dithered Chainmail & Royal Gilded Cuirass
      px(-9, -7 + torsoBob, 18, 18, c('#0f172a')); // Outline
      px(-8, -6 + torsoBob, 16, 16, c('#334155')); // Mail base
      // 16-bit pixel chainmail weave dithering
      for (let py = -5; py <= 8; py += 2) {
        for (let pxOff = -7; pxOff <= 6; pxOff += 2) {
          if ((pxOff + py) % 4 === 0) {
            px(pxOff, py + torsoBob, 1, 1, c('#94a3b8'));
          } else {
            px(pxOff, py + torsoBob, 1, 1, c('#1e293b'));
          }
        }
      }
      // White Bear/Wolf Fur Shoulder Mantle
      px(-12, -9 + torsoBob, 24, 4, c('#0f172a'));
      px(-11, -8 + torsoBob, 22, 3, c('#e2e8f0'));
      px(-9, -7 + torsoBob, 18, 2, c('#ffffff'));
      // Golden Jelling Dragon Chest Emblem & Runic Belt
      px(-6, -4 + torsoBob, 12, 3, c('#ca8a04'));
      px(-4, -3 + torsoBob, 8, 2, c('#fef08a'));
      px(-2, -1 + torsoBob, 4, 5, c('#eab308'));
      px(-1, 0 + torsoBob, 2, 3, c('#38bdf8')); // Blue runestone gem in chest
      px(-8, 6 + torsoBob, 16, 3, c('#78350f')); // Belt
      px(-2, 6 + torsoBob, 4, 3, c('#facc15')); // Buckle

      // 4) Left Arm: Swinging Viking Runic Round Shield
      const lArmY = -4 + torsoBob + armSwingL;
      px(-14, lArmY, 5, 9, c('#1e3a8a'));
      px(-13, lArmY + 1, 3, 7, c('#3b82f6'));
      // Pixel Round Shield with Bluetooth Rune
      px(-18, lArmY + 2, 8, 10, c('#0f172a'));
      px(-19, lArmY + 4, 10, 6, c('#0f172a'));
      px(-17, lArmY + 3, 6, 8, c('#ca8a04'));
      px(-18, lArmY + 4, 8, 6, c('#eab308'));
      px(-16, lArmY + 4, 4, 6, c('#1e3a8a'));
      px(-15, lArmY + 5, 2, 4, c('#38bdf8')); // Shield center glow

      // 5) Head, Expressive Undertale Eyes, Braided Viking Beard & Horned Royal Crown
      const hY = -17 + headBob;
      // Head outline & skin shading
      px(-7, hY, 14, 10, c('#0f172a'));
      px(-6, hY + 1, 12, 8, c('#fdba74'));
      px(-5, hY + 1, 10, 7, c('#fed7aa'));
      // Fierce Undertale Pixel Brows & Glowing Cyan Eyes
      px(-5, hY + 2, 4, 1, c('#78350f'));
      px(1, hY + 2, 4, 1, c('#78350f'));
      px(-5, hY + 3, 3, 2, c('#090d16'));
      px(2, hY + 3, 3, 2, c('#090d16'));
      px(-4, hY + 3, 2, 2, c('#38bdf8'));
      px(3, hY + 3, 2, 2, c('#38bdf8'));
      px(-3, hY + 3, 1, 1, c('#ffffff')); // Eye sparkle
      px(4, hY + 3, 1, 1, c('#ffffff'));

      // Multi-layered Twin-Braided Viking Beard (Stepped pixel silhouette)
      px(-8, hY + 6, 16, 5, c('#78350f'));
      px(-7, hY + 7, 14, 6, c('#92400e'));
      px(-6, hY + 8, 12, 6, c('#b45309'));
      px(-4, hY + 9, 8, 4, c('#d97706'));
      // Speaking Mouth / Roaring Grin
      if (jawTalk > 0 || isHit || animState === 'attack_cast') {
        px(-3, hY + 7, 6, 2, c('#090d16'));
        px(-2, hY + 7, 1, 1, c('#ffffff'));
        px(0, hY + 7, 2, 1, c('#38bdf8')); // Iconic "Blue Tooth" glint!
      }
      // Twin Beard Braids hanging down with Gold Rings
      px(-6, hY + 13, 4, 4, c('#92400e'));
      px(2, hY + 13, 4, 4, c('#92400e'));
      px(-6, hY + 15, 4, 1, c('#facc15'));
      px(2, hY + 15, 4, 1, c('#facc15'));
      px(-5, hY + 16, 3, 2, c('#b45309'));
      px(2, hY + 16, 3, 2, c('#b45309'));

      // Royal Amalienborg Bearskin Crest + Winged Viking Crown
      px(-8, hY - 5, 16, 6, c('#090d16'));
      px(-7, hY - 7, 14, 7, c('#1e293b'));
      px(-8, hY - 1, 16, 2, c('#ca8a04')); // Gold crown band
      px(-7, hY - 2, 2, 2, c('#facc15'));
      px(-3, hY - 3, 2, 3, c('#fef08a'));
      px(1, hY - 3, 2, 3, c('#fef08a'));
      px(5, hY - 2, 2, 2, c('#facc15'));
      px(-1, hY - 2, 2, 2, c('#38bdf8')); // Crown sapphire
      // Curved Pixel Horns (Stepped 16-bit pixel curve)
      px(-10, hY - 3, 2, 2, c('#d97706'));
      px(-12, hY - 5, 2, 3, c('#eab308'));
      px(-13, hY - 8, 2, 3, c('#fef08a'));
      px(8, hY - 3, 2, 2, c('#d97706'));
      px(10, hY - 5, 2, 3, c('#eab308'));
      px(11, hY - 8, 2, 3, c('#fef08a'));

      // 6) Right Arm & Jelling Runic Scepter (Swings dynamically with armSwingR)
      const rArmY = -5 + torsoBob + armSwingR;
      px(9, rArmY, 5, 8, c('#1e3a8a'));
      px(10, rArmY + 1, 3, 6, c('#3b82f6'));
      px(11, rArmY + 5, 4, 3, c('#fed7aa')); // Gauntlet hand
      // Runic Staff Shaft & Dragon Head Finial
      const staffX = 13;
      const staffY = rArmY - 12;
      px(staffX, staffY, 2, 28, c('#451a03'));
      px(staffX, staffY + 2, 1, 24, c('#b45309'));
      px(staffX - 2, staffY - 2, 6, 3, c('#eab308'));
      px(staffX - 3, staffY - 6, 8, 4, c('#fef08a'));
      px(staffX - 1, staffY - 5, 4, 2, c('#0284c7'));

      if (!tintOverride) {
        // Floating Bluetooth Bind-Rune Halo above Scepter
        const btPulse = Math.sin(tick * 0.16) * 3;
        ctx.fillStyle = 'rgba(56, 189, 248, 0.35)';
        ctx.beginPath();
        ctx.arc((staffX + 1) * P, (staffY - 9) * P, 13 + btPulse, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#e0f2fe';
        ctx.font = 'bold 14px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('ᛒ', (staffX + 1) * P, (staffY - 7) * P);

        // Orbiting Elder Futhark Runes around Harald Bluetooth
        const runes = ['ᛒ', 'ᚱ', 'ᚠ', 'ᛏ', 'ᚦ'];
        for (let r = 0; r < runes.length; r++) {
          const rAng = tick * 0.055 + (r * Math.PI * 2) / runes.length;
          const rx = Math.cos(rAng) * 44;
          const ry = Math.sin(rAng) * 18 + torsoBob * P;
          ctx.fillStyle = r % 2 === 0 ? '#38bdf8' : '#93c5fd';
          ctx.font = 'bold 11px monospace';
          ctx.fillText(runes[r], rx, ry);
        }
      }

    } else if (bossType === 'captain_vasa') {
      // =========================================================================
      // 2. 瑞典瓦薩號幽靈船長 (Captain Vasa) - 16-Bit Undertale Pixel Art
      // Articulated: Spectral Seaweed-Draped 1628 Admiral Coat, Skeletal Ribcage &
      // Gold Gyllene Salen Medallion, Tricorne Hat with Vasa Lion Plume,
      // Left Hand Ghostly Cutlass, Right Hand Spinning 1628 Bronze Ship Helm
      // =========================================================================
      const floatBob = torsoBob + Math.round(Math.sin(tick * 0.1) * 1.5);

      // Ghostly Abyssal Wake Shadow
      ctx.fillStyle = tintOverride || 'rgba(20, 184, 166, 0.32)';
      ctx.beginPath();
      ctx.ellipse(0, 42, 32, 9, 0, 0, Math.PI * 2);
      ctx.fill();

      // 1) Tattered Spectral Coat Tails & Floating Kelp Tendrils (Bottom)
      for (let k = -10; k <= 10; k += 4) {
        const wave = Math.round(Math.sin(tick * 0.15 + k) * 2);
        px(k, 10 + floatBob, 3, 7 + (Math.abs(k) % 3), c('#042f2e'));
        px(k + 1, 11 + floatBob, 2, 5, c('#0f766e'));
        px(k + wave * 0.5, 16 + floatBob, 2, 3, c('#2dd4bf')); // Ghostly ectoplasm tips
      }
      // Articulated Skeletal Boots stepping in water
      px(-6, 14 + legStepL, 4, 6, c('#022c22'));
      px(-5, 15 + legStepL, 2, 4, c('#5eead4')); // Bone shin
      px(2, 14 + legStepR, 4, 6, c('#022c22'));
      px(3, 15 + legStepR, 2, 4, c('#5eead4'));

      // 2) Torso: 17th-Century Swedish Royal Admiral Doublet + Exposed Spectral Ribs
      px(-10, -7 + floatBob, 20, 18, c('#022c22'));
      px(-9, -6 + floatBob, 18, 16, c('#115e59'));
      px(-7, -5 + floatBob, 14, 14, c('#0f766e'));
      // Exposed Glowing Turquoise Ribcage in chest center
      for (let rib = -3; rib <= 5; rib += 3) {
        px(-4, rib + floatBob, 8, 1, c('#99f6e4'));
        px(-1, rib - 1 + floatBob, 2, 2, c('#042f2e')); // Spine gap
      }
      // Golden Epaulettes & Gilded Buttons (18 Million Mosaic Gold Glint)
      px(-12, -8 + floatBob, 5, 3, c('#ca8a04'));
      px(-11, -7 + floatBob, 3, 2, c('#fef08a'));
      px(7, -8 + floatBob, 5, 3, c('#ca8a04'));
      px(8, -7 + floatBob, 3, 2, c('#fef08a'));
      // Diagonal Admiral Baldric Sash
      for (let s = -5; s <= 5; s += 2) {
        px(s, s + floatBob, 2, 2, c('#eab308'));
      }
      // Dripping Seaweed & Barnacles on coat
      px(-8, -2 + floatBob, 2, 6, c('#15803d'));
      px(7, 0 + floatBob, 2, 7, c('#166534'));

      // 3) Left Arm: Swinging Ghostly Naval Cutlass
      const lY = -4 + floatBob + armSwingL;
      px(-14, lY, 4, 8, c('#115e59'));
      px(-14, lY + 6, 3, 3, c('#99f6e4')); // Skeletal hand
      // Curved Ghost Saber Blade (Stepped pixel curve)
      px(-16, lY + 5, 5, 2, c('#eab308')); // Brass basket hilt
      px(-18, lY - 2, 2, 7, c('#5eead4'));
      px(-19, lY - 8, 2, 6, c('#99f6e4'));
      px(-20, lY - 12, 2, 4, c('#ffffff'));

      // 4) Expressive Undertale Skull Head & 1628 Bicorn/Tricorne Admiral Hat
      const hY = -17 + headBob;
      px(-6, hY + 1, 12, 9, c('#042f2e'));
      px(-5, hY + 2, 10, 6, c('#99f6e4')); // Cranium
      px(-4, hY + 3, 8, 4, c('#ccfbf1'));
      // Cheekbones & Animated Talking Jaw
      px(-4, hY + 8 + jawTalk, 8, 3, c('#5eead4'));
      for (let t = -3; t <= 3; t += 2) {
        px(t, hY + 7, 1, 2, c('#ffffff')); // Upper teeth
      }
      // Abyssal Eye Sockets with Pinprick Undertale Soul-Fire Pupils
      px(-4, hY + 4, 3, 3, c('#022c22'));
      px(1, hY + 4, 3, 3, c('#022c22'));
      px(-3, hY + 5, 2, 2, c(isHit ? '#f43f5e' : '#2dd4bf'));
      px(2, hY + 5, 2, 2, c(isHit ? '#f43f5e' : '#facc15')); // One golden royal eye, one ghostly cyan eye!

      // Stepped Pixel 1628 Admiral Tricorne Hat with Gold Trim & Ostrich Plume
      px(-13, hY - 1, 26, 2, c('#eab308')); // Gold brim highlight
      px(-12, hY - 2, 24, 2, c('#022c22'));
      px(-9, hY - 5, 18, 3, c('#042f2e'));
      px(-6, hY - 8, 12, 3, c('#0f766e'));
      px(-2, hY - 5, 4, 3, c('#fef08a')); // Royal Vasa sheaf emblem
      // Flowing Spectral Plume Feather on Hat
      px(4, hY - 10 + capeWave, 5, 2, c('#2dd4bf'));
      px(7, hY - 12 + capeWave, 5, 2, c('#99f6e4'));

      // 5) Right Arm & Spinning 1628 Vasa Ship Helm
      const rY = -4 + floatBob + armSwingR;
      px(10, rY, 4, 8, c('#115e59'));
      px(11, rY + 6, 3, 3, c('#99f6e4'));

      if (!tintOverride) {
        const helmX = (14) * P;
        const helmY = (rY + 4) * P;
        ctx.save();
        ctx.translate(helmX, helmY);
        ctx.rotate(tick * (isMoving ? 0.09 : 0.04));
        ctx.strokeStyle = '#eab308';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, 15, 0, Math.PI * 2);
        ctx.stroke();
        ctx.strokeStyle = '#fef08a';
        ctx.lineWidth = 2;
        for (let sp = 0; sp < 4; sp++) {
          const ang = (sp * Math.PI) / 4;
          ctx.beginPath();
          ctx.moveTo(-Math.cos(ang) * 19, -Math.sin(ang) * 19);
          ctx.lineTo(Math.cos(ang) * 19, Math.sin(ang) * 19);
          ctx.stroke();
        }
        ctx.fillStyle = '#2dd4bf';
        ctx.beginPath();
        ctx.arc(0, 0, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

    } else if (bossType === 'sami_shaman') {
      // =========================================================================
      // 3. 芬蘭拉普蘭薩米巫師與極光巨狼 (Sámi Shaman & Fenrir) - 16-Bit Undertale Pixel Art
      // Articulated: Traditional Sámi Gákti (Blue/Red/Yellow stepped trim),
      // Four Winds Hat (Čiehgahpir), Left Hand Painted Kannus Sun Drum,
      // Right Hand Antler Drum Hammer + Prowling Pixel Aurora Wolf Fenrir
      // =========================================================================
      ctx.fillStyle = tintOverride || 'rgba(16, 185, 129, 0.35)';
      ctx.beginPath();
      ctx.ellipse(2, 42, 36, 9, 0, 0, Math.PI * 2);
      ctx.fill();

      // 1) Articulated Reindeer-Skin Boots (Nutukas) with curled toes
      px(-7, 12 + legStepL, 4, 6, c('#78350f'));
      px(-9, 16 + legStepL, 6, 2, c('#fde68a')); // Curled Sámi boot toe
      px(1, 12 + legStepR, 4, 6, c('#78350f'));
      px(1, 16 + legStepR, 6, 2, c('#fde68a'));

      // 2) Flared Sámi Gákti Tunic (Stepped A-line silhouette, rich woven bands)
      px(-9, -7 + torsoBob, 16, 14, c('#1e3a8a'));
      px(-11, 3 + torsoBob, 20, 10, c('#1d4ed8'));
      // Traditional Red, Yellow & Cyan Geometric Woven Bands
      px(-9, -3 + torsoBob, 16, 2, c('#dc2626'));
      px(-9, -1 + torsoBob, 16, 1, c('#facc15'));
      px(-11, 8 + torsoBob, 20, 2, c('#dc2626'));
      px(-11, 10 + torsoBob, 20, 1, c('#facc15'));
      px(-11, 11 + torsoBob, 20, 1, c('#38bdf8'));
      // Silver Pewter Collar clasps & Reindeer Belt
      px(-6, -6 + torsoBob, 10, 2, c('#dc2626'));
      px(-3, -5 + torsoBob, 2, 2, c('#f8fafc'));
      px(1, -5 + torsoBob, 2, 2, c('#f8fafc'));
      px(-9, 3 + torsoBob, 16, 2, c('#451a03'));
      for (let b = -7; b <= 5; b += 3) {
        px(b, 3 + torsoBob, 1, 2, c('#fef08a'));
      }

      // 3) Head, Aurora Face Paint & Stepped Four Winds Hat (Čiehgahpir)
      const hY = -17 + headBob;
      px(-6, hY + 1, 10, 9, c('#451a03'));
      px(-5, hY + 2, 8, 8, c('#fed7aa'));
      // Glowing Cyan/Emerald Shamanic Cheek Markings & Eyes
      px(-4, hY + 4, 2, 2, c('#090d16'));
      px(1, hY + 4, 2, 2, c('#090d16'));
      px(-4, hY + 4, 1, 1, c('#34d399'));
      px(1, hY + 4, 1, 1, c('#34d399'));
      px(-5, hY + 6, 2, 1, c('#38bdf8'));
      px(2, hY + 6, 2, 1, c('#38bdf8'));
      if (jawTalk > 0 || isHit) {
        px(-2, hY + 7, 3, 2, c('#7c2d12'));
      }
      // Stepped Pixel Four Winds Hat (Curved pixel horns left & right)
      px(-7, hY - 2, 12, 3, c('#dc2626'));
      px(-7, hY - 1, 12, 1, c('#facc15'));
      px(-8, hY - 5, 14, 3, c('#1d4ed8'));
      // Left curved wind-horn
      px(-11, hY - 7, 4, 3, c('#1e3a8a'));
      px(-13, hY - 9, 3, 3, c('#1d4ed8'));
      px(-14, hY - 10, 2, 2, c('#dc2626')); // Pom-pom
      // Right curved wind-horn
      px(5, hY - 7, 4, 3, c('#1e3a8a'));
      px(8, hY - 9, 3, 3, c('#1d4ed8'));
      px(10, hY - 10, 2, 2, c('#dc2626'));

      // 4) Left Arm Holding Sacred Sámi Sun-Drum (Kannus)
      const drumX = -15;
      const drumY = -2 + torsoBob + Math.round(armSwingL * 0.6);
      px(drumX - 3, drumY - 5, 8, 12, c('#78350f'));
      px(drumX - 4, drumY - 3, 10, 8, c('#78350f'));
      px(drumX - 2, drumY - 4, 6, 10, c('#fef3c7'));
      px(drumX - 3, drumY - 2, 8, 6, c('#fef3c7'));
      // Red Ochre Beaivi Sun Cross on Drumhead
      px(drumX, drumY - 1, 2, 4, c('#dc2626'));
      px(drumX - 1, drumY, 4, 2, c('#dc2626'));

      // 5) Right Arm Striking Drum with Reindeer Antler Hammer (Bállin)
      const rY = -4 + torsoBob + armSwingR;
      px(6, rY, 4, 6, c('#1d4ed8'));
      px(8, rY - 5, 1, 8, c('#fde68a'));
      px(6, rY - 6, 5, 2, c('#fef08a'));

      // 6) Companion: Articulated 16-Bit Pixel Aurora Wolf (Fenrir) Prowling Beside Shaman
      const wBob = Math.round(Math.sin(tick * 0.16 + 1) * 1.5);
      const wX = 11;
      const wY = 2 + wBob;
      // Wolf Hind & Fore Legs (Animated stride)
      px(wX + 1, wY + 10 + legStepR, 2, 5, c('#065f46'));
      px(wX + 7, wY + 10 + legStepL, 2, 5, c('#047857'));
      // Wolf Muscular Torso & Bristling Aurora Mane
      px(wX, wY + 3, 10, 7, c('#047857'));
      px(wX + 2, wY + 1, 9, 7, c('#10b981'));
      px(wX + 3, wY - 1, 7, 3, c('#34d399'));
      // Flowing Fire-Fox / Wolf Tail
      px(wX - 4, wY + 2 + capeWave, 4, 3, c('#10b981'));
      px(wX - 6, wY + 1 + capeWave, 3, 2, c('#6ee7b7'));
      // Wolf Head, Pointed Ears, Snout & Glowing Eyes
      px(wX + 7, wY - 5, 6, 6, c('#059669'));
      px(wX + 8, wY - 8, 2, 3, c('#34d399')); // Ear 1
      px(wX + 11, wY - 8, 2, 3, c('#10b981')); // Ear 2
      px(wX + 12, wY - 3, 5, 3, c('#10b981')); // Snout
      px(wX + 12, wY - 1 + jawTalk, 4, 2, c('#064e3b')); // Lower jaw
      px(wX + 15, wY - 3, 2, 1, c('#090d16')); // Nose
      px(wX + 10, wY - 4, 2, 2, c('#ffffff')); // Blazing wolf eye
      px(wX + 11, wY - 4, 1, 1, c('#38bdf8'));

    } else if (bossType === 'vainamoinen') {
      // =========================================================================
      // 4. 芬蘭萬奈摩寧 (Väinämöinen) - 16-Bit Undertale Pixel Art
      // Articulated: Kalevala Runo-Singer Cloak with Copper Dome Trim,
      // Flowing Silver Beard down to knees, Birch-bark Wizard Cap,
      // Cradled Giant Pike-Bone 5-String Kantele Harp & Plucking Right Hand
      // =========================================================================
      ctx.fillStyle = tintOverride || 'rgba(6, 182, 212, 0.32)';
      ctx.beginPath();
      ctx.ellipse(0, 42, 30, 8, 0, 0, Math.PI * 2);
      ctx.fill();

      // 1) Stepped Robe Hem & Boots
      px(-6, 14 + legStepL, 4, 5, c('#1e1b4b'));
      px(2, 14 + legStepR, 4, 5, c('#1e1b4b'));
      px(-11, -6 + torsoBob, 22, 21, c('#0f172a'));
      px(-10, -5 + torsoBob, 20, 19, c('#1e293b'));
      px(-8, -4 + torsoBob, 16, 17, c('#334155'));
      // Rock Church Copper-Ribbon & Silver Runic Robe Trim
      px(-10, 12 + torsoBob, 20, 2, c('#d97706')); // Copper band
      px(-8, -4 + torsoBob, 2, 16, c('#38bdf8'));
      px(6, -4 + torsoBob, 2, 16, c('#38bdf8'));

      // 2) Head, Wise Eyes & Cascading Silver Kalevala Beard (Animated wave)
      const hY = -17 + headBob;
      px(-6, hY + 1, 12, 8, c('#fed7aa'));
      // Long Silver Hair locks framing face
      px(-8, hY, 2, 12, c('#cbd5e1'));
      px(6, hY, 2, 12, c('#cbd5e1'));
      // Expressive Eyes & Silver Brows
      px(-5, hY + 2, 4, 1, c('#f8fafc'));
      px(1, hY + 2, 4, 1, c('#f8fafc'));
      px(-4, hY + 3, 2, 2, c('#090d16'));
      px(2, hY + 3, 2, 2, c('#090d16'));
      px(-4, hY + 3, 1, 1, c('#67e8f9'));
      px(2, hY + 3, 1, 1, c('#67e8f9'));

      // Multi-tiered Flowing Silver Beard (Stepped pixel taper with sway)
      px(-6, hY + 6, 12, 4, c('#f8fafc'));
      px(-5 + Math.round(capeWave * 0.4), hY + 10, 10, 5, c('#e2e8f0'));
      px(-4 + Math.round(capeWave * 0.7), hY + 15, 8, 5, c('#cbd5e1'));
      px(-2 + capeWave, hY + 20, 4, 3, c('#94a3b8'));
      if (jawTalk > 0 || animState === 'attack_cast') {
        px(-2, hY + 7, 4, 2, c('#0f172a'));
      }

      // Traditional Kalevala Sage Cap (Patakukko / Runo Hat with Copper Crest)
      px(-8, hY - 2, 16, 3, c('#b45309'));
      px(-7, hY - 5, 14, 3, c('#0f766e'));
      px(-5, hY - 7, 10, 2, c('#14b8a6'));
      px(-1, hY - 3, 2, 2, c('#fef08a'));

      // 3) Giant Pike-Bone Kantele Harp (Cradled on Right Side, Strings Glow when plucked)
      const kX = 6;
      const kY = -6 + torsoBob + Math.round(armSwingL * 0.4);
      // Carved Pike-Jawbone Frame (Stepped wing shape)
      px(kX, kY - 6, 3, 18, c('#78350f'));
      px(kX + 1, kY - 5, 2, 16, c('#d97706'));
      px(kX + 3, kY - 8, 8, 3, c('#fef3c7')); // Pike bone top arch
      px(kX + 9, kY - 5, 2, 13, c('#b45309'));
      px(kX + 3, kY + 8, 7, 3, c('#92400e'));
      // 5 Glowing Kantele Strings
      for (let st = 0; st < 5; st++) {
        const isPlucked = (Math.floor(tick / 4) % 5) === st;
        px(kX + 3 + st, kY - 5, 1, 13, c(isPlucked ? '#ffffff' : st % 2 === 0 ? '#fde047' : '#38bdf8'));
      }

      // 4) Plucking Hand Moving Across the Kantele Strings
      const handX = kX + 3 + Math.abs(armSwingR % 5);
      const handY = kY + armSwingR;
      px(handX, handY, 3, 3, c('#fed7aa'));

      if (!tintOverride) {
        // Floating Musical Runes ascending from Kantele
        const notes = ['♪', '♫', '♬'];
        for (let n = 0; n < 3; n++) {
          const ny = (kY - 8) * P - ((tick * 0.8 + n * 14) % 28);
          const nx = (kX + 5) * P + Math.sin(tick * 0.12 + n * 2) * 12;
          ctx.fillStyle = n === 0 ? '#fde047' : n === 1 ? '#38bdf8' : '#c084fc';
          ctx.font = 'bold 11px sans-serif';
          ctx.fillText(notes[n], nx, ny);
        }
      }

    } else if (bossType === 'harald_hardrada') {
      // =========================================================================
      // 5. 挪威無情者哈拉爾 (Harald Hardrada) - 16-Bit Undertale Pixel Art
      // Articulated: Crimson Varangian Guard Cloak, Scale Armor, Spangenhelm
      // with Nasal Guard, Dual Swinging Double-Bearded Viking Battle Axes
      // =========================================================================
      ctx.fillStyle = tintOverride || 'rgba(239, 68, 68, 0.38)';
      ctx.beginPath();
      ctx.ellipse(0, 42, 30, 8, 0, 0, Math.PI * 2);
      ctx.fill();

      // Crimson Varangian Cloak
      px(-11 + capeWave, -7 + torsoBob, 22, 21, c('#7f1d1d'));
      px(-9 + capeWave, -5 + torsoBob, 18, 18, c('#991b1b'));
      // Legs
      px(-6, 12 + legStepL, 4, 6, c('#1e293b'));
      px(2, 12 + legStepR, 4, 6, c('#1e293b'));
      // Scale Mail Torso
      px(-8, -6 + torsoBob, 16, 17, c('#0f172a'));
      px(-7, -5 + torsoBob, 14, 15, c('#334155'));
      for (let sy = -4; sy <= 7; sy += 3) {
        for (let sx = -6; sx <= 4; sx += 3) {
          px(sx, sy + torsoBob, 2, 2, c((sx + sy) % 2 === 0 ? '#eab308' : '#64748b'));
        }
      }
      // Head & Varangian Spangenhelm with Nasal Bar
      const hY = -17 + headBob;
      px(-6, hY + 1, 12, 9, c('#fed7aa'));
      px(-7, hY + 5, 14, 6, c('#c2410c')); // Red-gold beard
      px(-7, hY - 4, 14, 6, c('#475569')); // Steel helm dome
      px(-7, hY + 1, 14, 2, c('#eab308')); // Brow band
      px(-1, hY + 1, 2, 5, c('#94a3b8')); // Nasal guard
      px(-4, hY + 3, 2, 2, c('#ef4444')); // Glowing berserker eyes
      px(2, hY + 3, 2, 2, c('#ef4444'));

      // Dual Articulated Battle Axes (Left & Right Arms Swing Opposite)
      const lAxeY = -5 + torsoBob + armSwingL;
      const rAxeY = -5 + torsoBob + armSwingR;
      // Left Axe
      px(-13, lAxeY - 8, 2, 20, c('#78350f'));
      px(-18, lAxeY - 7, 5, 8, c('#cbd5e1'));
      px(-19, lAxeY - 6, 2, 6, c('#ffffff'));
      // Right Axe
      px(11, rAxeY - 8, 2, 20, c('#78350f'));
      px(13, rAxeY - 7, 5, 8, c('#cbd5e1'));
      px(17, rAxeY - 6, 2, 6, c('#ffffff'));

    } else {
      // =========================================================================
      // 6. 冰島火焰巨人史爾特爾 (Surtr of Muspelheim) - 16-Bit Undertale Pixel Art
      // Articulated: Colossal Obsidian Volcanic Pauldrons & Ribbed Armor,
      // Pulsing Molten Magma Veins, Stepped Swept-Back Demon Horns with Crown of Fire,
      // Left Hand Molten Magma Orb, Right Hand Blazing Great-Sword Lævateinn
      // =========================================================================
      ctx.fillStyle = tintOverride || 'rgba(249, 115, 22, 0.45)';
      ctx.beginPath();
      ctx.ellipse(0, 44, 38, 11, 0, 0, Math.PI * 2);
      ctx.fill();

      const lavaFlash = Math.floor(tick / 5) % 2 === 0 ? '#f97316' : '#facc15';
      const coreWhite = Math.floor(tick / 3) % 2 === 0 ? '#ffffff' : '#fde047';

      // 1) Massive Obsidian Pillar Legs with Magma Knee-Cracks
      px(-9, 11 + legStepL, 6, 8, c('#09090b'));
      px(-8, 12 + legStepL, 4, 6, c('#27272a'));
      px(-7, 14 + legStepL, 2, 2, c(lavaFlash));
      px(3, 11 + legStepR, 6, 8, c('#09090b'));
      px(4, 12 + legStepR, 4, 6, c('#27272a'));
      px(5, 14 + legStepR, 2, 2, c(lavaFlash));

      // 2) Colossal V-Tapered Volcanic Obsidian Torso & Spiked Pauldrons
      px(-11, -8 + torsoBob, 22, 19, c('#09090b'));
      px(-10, -7 + torsoBob, 20, 17, c('#18181b'));
      px(-8, -5 + torsoBob, 16, 13, c('#27272a'));
      // Stepped Volcanic Shoulder Pauldrons (Left & Right)
      px(-16, -11 + torsoBob + Math.round(armSwingL * 0.3), 7, 6, c('#09090b'));
      px(-15, -10 + torsoBob + Math.round(armSwingL * 0.3), 5, 4, c('#3f3f46'));
      px(-14, -9 + torsoBob + Math.round(armSwingL * 0.3), 3, 2, c(lavaFlash));
      px(9, -11 + torsoBob + Math.round(armSwingR * 0.3), 7, 6, c('#09090b'));
      px(10, -10 + torsoBob + Math.round(armSwingR * 0.3), 5, 4, c('#3f3f46'));
      px(11, -9 + torsoBob + Math.round(armSwingR * 0.3), 3, 2, c(lavaFlash));

      // Glowing Molten Magma Core & Branching Fissure Veins on Torso
      px(-3, -3 + torsoBob, 6, 5, c('#ea580c'));
      px(-2, -2 + torsoBob, 4, 3, c(coreWhite));
      // Rib fissures
      px(-7, -2 + torsoBob, 3, 1, c(lavaFlash));
      px(4, -2 + torsoBob, 3, 1, c(lavaFlash));
      px(-6, 1 + torsoBob, 4, 1, c(lavaFlash));
      px(2, 1 + torsoBob, 4, 1, c(lavaFlash));
      px(-4, 4 + torsoBob, 8, 2, c('#ea580c'));
      px(-2, 4 + torsoBob, 4, 1, c('#fde047'));

      // 3) Left Arm: Clawed Obsidian Gauntlet Channeling Erupting Magma Orb
      const lY = -4 + torsoBob + armSwingL;
      px(-15, lY, 4, 9, c('#18181b'));
      px(-14, lY + 2, 2, 5, c(lavaFlash));
      // Floating Magma Sphere in Left Palm
      const orbBeat = Math.floor(tick / 4) % 2;
      px(-18, lY - 5 - orbBeat, 5, 5, c('#ea580c'));
      px(-17, lY - 4 - orbBeat, 3, 3, c('#fde047'));
      px(-16, lY - 3 - orbBeat, 1, 1, c('#ffffff'));

      // 4) Head: Molten Titan Visage, Jagged Fang Maw & Swept Pixel Great-Horns
      const hY = -19 + headBob;
      px(-7, hY + 1, 14, 10, c('#09090b'));
      px(-6, hY + 2, 12, 8, c('#18181b'));
      // Blazing Undertale Boss Eyes
      px(-5, hY + 4, 4, 2, c('#ea580c'));
      px(1, hY + 4, 4, 2, c('#ea580c'));
      px(-4, hY + 4, 2, 2, c('#ffffff'));
      px(2, hY + 4, 2, 2, c('#ffffff'));
      // Roaring Jagged Furnace Mouth
      px(-4, hY + 7, 8, 3 + jawTalk, c('#7c2d12'));
      px(-3, hY + 8, 6, 1 + jawTalk, c('#fde047'));
      px(-3, hY + 7, 1, 1, c('#18181b')); // Obsidian fang
      px(2, hY + 7, 1, 1, c('#18181b'));

      // Crown of Muspelheim Flame & Stepped Pixel Curved Great-Horns
      px(-4, hY - 3, 8, 4, c('#ea580c'));
      px(-2, hY - 5 + (tick % 2), 4, 4, c('#fde047'));
      // Left Stepped Horn
      px(-9, hY, 3, 3, c('#27272a'));
      px(-12, hY - 3, 3, 4, c('#3f3f46'));
      px(-15, hY - 7, 3, 4, c('#7c2d12'));
      px(-17, hY - 11, 3, 4, c('#ea580c'));
      px(-18, hY - 13, 2, 2, c('#fde047'));
      // Right Stepped Horn
      px(6, hY, 3, 3, c('#27272a'));
      px(9, hY - 3, 3, 4, c('#3f3f46'));
      px(12, hY - 7, 3, 4, c('#7c2d12'));
      px(14, hY - 11, 3, 4, c('#ea580c'));
      px(16, hY - 13, 2, 2, c('#fde047'));

      // 5) Right Arm & Blazing Twilight Greatsword Lævateinn (Stepped Pixel Blade)
      const rY = -4 + torsoBob + armSwingR;
      px(11, rY, 4, 9, c('#18181b'));
      const sX = 14;
      const sY = rY + 2;
      // Pommel & Cruciform Obsidian Guard
      px(sX, sY + 4, 3, 5, c('#27272a'));
      px(sX - 3, sY + 2, 9, 2, c('#ea580c'));
      px(sX - 2, sY + 2, 7, 1, c('#fde047'));
      // Stepped Pixel Flaming Greatsword Blade
      px(sX - 1, sY - 22, 5, 24, c('#991b1b'));
      px(sX, sY - 24, 3, 26, c('#ea580c'));
      px(sX + 1, sY - 26, 1, 27, c('#fef08a'));
      // Flickering Pixel Flame tongues along blade edge
      for (let fb = 0; fb < 5; fb++) {
        const fy = sY - 4 - fb * 5 + ((tick + fb) % 2);
        px(sX - 2, fy, 1, 2, c('#f97316'));
        px(sX + 4, fy - 1, 1, 2, c('#fde047'));
      }
    }
  };

  ctx.save();
  ctx.translate(bx + bodySwayX, by);
  ctx.scale(scale, scale);

  // ==========================================
  // BOSS PHASE FORMS VISUAL UPGRADES (形態 II / 形態 III 專屬光環與神格特效)
  // ==========================================
  if (bossForm >= 2) {
    ctx.save();
    const isMythicP3 = bossForm === 3;
    const auraPulse = Math.sin(tick * 0.16) * 4;

    // Ground platform runic circle
    const platformRad = (isMythicP3 ? 38 : 30) + auraPulse;
    ctx.strokeStyle = isMythicP3
      ? (tick % 4 < 2 ? '#fbbf24' : '#f43f5e')
      : (bossType === 'harald_bluetooth' ? '#38bdf8' : bossType === 'captain_vasa' ? '#2dd4bf' : bossType === 'sami_shaman' ? '#ec4899' : bossType === 'vainamoinen' ? '#fde047' : bossType === 'harald_hardrada' ? '#ef4444' : '#f97316');
    ctx.lineWidth = isMythicP3 ? 3 : 2;
    ctx.beginPath();
    ctx.ellipse(0, 42, platformRad, 11, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Floating elemental satellites & sparks
    const sparkCount = isMythicP3 ? 8 : 4;
    for (let sp = 0; sp < sparkCount; sp++) {
      const spAng = tick * (isMythicP3 ? 0.08 : 0.05) + (sp * Math.PI * 2) / sparkCount;
      const spDistX = Math.cos(spAng) * (platformRad * 0.85);
      const spDistY = 38 + Math.sin(spAng) * 8;
      ctx.fillStyle = sp % 2 === 0 ? '#fde047' : '#ffffff';
      ctx.fillRect(spDistX - 1.5, spDistY - 1.5, 3, 3);
    }

    // Boss Type-specific Awakening Visual Layers
    if (bossType === 'harald_bluetooth') {
      // Form 2 & 3: Electric blue lightning arcs around crown and staff
      ctx.strokeStyle = isMythicP3 ? '#c084fc' : '#38bdf8';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      for (let l = 0; l < 4; l++) {
        const lAng = tick * 0.12 + (l * Math.PI) / 2;
        ctx.moveTo(Math.cos(lAng) * 22, -14 + Math.sin(lAng) * 16);
        ctx.lineTo(Math.cos(lAng) * 28 + (tick % 3), -14 + Math.sin(lAng) * 22);
      }
      ctx.stroke();
    } else if (bossType === 'captain_vasa') {
      // Form 2 & 3: Abyssal green mist & rising sea bubbles
      ctx.fillStyle = isMythicP3 ? 'rgba(16, 185, 129, 0.35)' : 'rgba(45, 212, 191, 0.25)';
      ctx.beginPath();
      ctx.arc(0, 10, 32 + auraPulse, 0, Math.PI * 2);
      ctx.fill();
    } else if (bossType === 'sami_shaman') {
      // Form 2 & 3: Aurora wings radiating behind back
      const aurW = 34 + auraPulse * 1.5;
      const aurGrad = ctx.createLinearGradient(-aurW, -20, aurW, 10);
      aurGrad.addColorStop(0, 'rgba(236, 72, 153, 0.4)');
      aurGrad.addColorStop(0.5, 'rgba(16, 185, 129, 0.55)');
      aurGrad.addColorStop(1, 'rgba(6, 182, 212, 0.4)');
      ctx.fillStyle = aurGrad;
      ctx.beginPath();
      ctx.ellipse(-18, -4, 18, 28, -0.4, 0, Math.PI * 2);
      ctx.ellipse(18, -4, 18, 28, 0.4, 0, Math.PI * 2);
      ctx.fill();
    } else if (bossType === 'vainamoinen') {
      // Form 2 & 3: Radiant golden musical staff rings
      ctx.strokeStyle = 'rgba(250, 204, 21, 0.45)';
      ctx.lineWidth = 1.2;
      for (let r = 1; r <= 3; r++) {
        ctx.beginPath();
        ctx.arc(0, 0, 20 + r * 7 + auraPulse * 0.5, 0, Math.PI * 2);
        ctx.stroke();
      }
    } else if (bossType === 'harald_hardrada') {
      // Form 2 & 3: Blazing crimson berserker flames rising from shoulders
      ctx.fillStyle = isMythicP3 ? 'rgba(225, 29, 72, 0.45)' : 'rgba(239, 68, 68, 0.35)';
      for (let fl = 0; fl < 5; fl++) {
        const flX = -18 + fl * 9 + Math.sin(tick * 0.2 + fl) * 3;
        const flY = -12 - ((tick * 1.5 + fl * 12) % 24);
        ctx.fillRect(flX, flY, 3, 4);
      }
    } else {
      // Surtr Form 2 & 3: Molten magma crack glow & rising embers
      ctx.fillStyle = isMythicP3 ? 'rgba(220, 38, 38, 0.55)' : 'rgba(249, 115, 22, 0.4)';
      ctx.beginPath();
      ctx.arc(0, 10, 36 + auraPulse, 0, Math.PI * 2);
      ctx.fill();
    }

    // Form 3 Mythic Ragnarök: Floating Sacred Runes Orbiting Boss
    if (isMythicP3) {
      const mythicRunes = ['ᚱ', 'ᛏ', 'ᚦ', 'ᛒ'];
      for (let mr = 0; mr < 4; mr++) {
        const mrAng = -tick * 0.06 + (mr * Math.PI) / 2;
        const mrX = Math.cos(mrAng) * 36;
        const mrY = -8 + Math.sin(mrAng) * 22;
        ctx.font = 'bold 12px serif';
        ctx.fillStyle = '#fde047';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = '#eab308';
        ctx.shadowBlur = 8;
        ctx.fillText(mythicRunes[mr], mrX, mrY);
        ctx.shadowBlur = 0;
      }
    }
    ctx.restore();
  }

  // When boss takes damage: RGB Chromatic Aberration Split Ghosts + Strobe Flash!
  if (isHit) {
    const splitDist = Math.max(4, hitIntensity * 0.45);
    ctx.save();
    ctx.translate(-splitDist, -2);
    ctx.globalAlpha = 0.7;
    renderBossSpritePass('#38bdf8'); // Cyan chromatic ghost
    ctx.restore();

    ctx.save();
    ctx.translate(splitDist, 2);
    ctx.globalAlpha = 0.7;
    renderBossSpritePass('#f43f5e'); // Crimson chromatic ghost
    ctx.restore();

    // Main sprite flashes between pure white and crimson/gold invert
    const strobeTint = Math.floor(tick / 2) % 2 === 0 ? '#ffffff' : undefined;
    if (!strobeTint) {
      ctx.filter = 'brightness(2.2) contrast(1.6) saturate(1.8)';
    }
    renderBossSpritePass(strobeTint);
  } else {
    renderBossSpritePass();
  }

  ctx.restore();
}

// Draw Primary Story NPC Pixel Model
export function drawPrimaryStoryNpc(
  ctx: CanvasRenderingContext2D,
  npc: PrimaryStoryNpc,
  tick: number,
  isStoryLearned: boolean,
  courage: number = 15
) {
  const { x, y, spriteType } = npc;
  const bob = Math.sin((tick + x) * 0.1) * 2.5;

  ctx.save();
  ctx.translate(x, y);

  // Ground platform aura
  ctx.fillStyle = isStoryLearned ? 'rgba(52, 211, 153, 0.25)' : 'rgba(245, 158, 11, 0.35)';
  ctx.beginPath();
  ctx.ellipse(0, 16, 20, 7, 0, 0, Math.PI * 2);
  ctx.fill();

  if (spriteType === 'scholar') {
    // Elder Erik: White Fur Cloak & Golden Runic Staff
    ctx.fillStyle = '#78350f';
    ctx.fillRect(-9, -12 + bob, 18, 22);
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(-11, -14 + bob, 22, 6); // Fur trim
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(-6, -24 + bob, 12, 10);
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(-7, -16 + bob, 14, 12); // Long white beard
    // Golden Runic Staff
    ctx.fillStyle = '#ca8a04';
    ctx.fillRect(11, -26 + bob, 3, 36);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(10, -30 + bob, 5, 5); // Glowing crystal
  } else if (spriteType === 'poet') {
    // Hans Andersen: Top Hat, Frock Coat & Feather Quill
    ctx.fillStyle = '#1c1917';
    ctx.fillRect(-7, -14 + bob, 14, 24); // Brown-black coat
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-3, -12 + bob, 6, 6); // Cravat
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(-6, -24 + bob, 12, 10); // Face
    // Tall Top Hat
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-10, -26 + bob, 20, 3); // Brim
    ctx.fillRect(-7, -38 + bob, 14, 12); // Crown
    ctx.fillStyle = '#b91c1c';
    ctx.fillRect(-7, -29 + bob, 14, 3); // Red hat ribbon
    // Quill Pen & Book
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(9, -20 + bob, 3, 14); // White feather quill
    ctx.fillStyle = '#78350f';
    ctx.fillRect(-12, -4 + bob, 6, 8); // Fairy tale book
  } else if (spriteType === 'shipwright') {
    // Master Jacob: Leather Apron, Rolled Draft & Mallet
    ctx.fillStyle = '#9a3412';
    ctx.fillRect(-8, -12 + bob, 16, 22); // Leather apron
    ctx.fillStyle = '#451a03';
    ctx.fillRect(-7, -4 + bob, 14, 14);
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(-6, -24 + bob, 12, 10);
    // Brow band
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(-7, -26 + bob, 14, 4);
    // Shipwright's Brass Calipers & Scroll
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(9, -16 + bob, 4, 18); // Rolled parchment blueprint
    ctx.fillStyle = '#eab308';
    ctx.fillRect(-12, -10 + bob, 4, 12); // Brass tool
  } else if (spriteType === 'archivist') {
    // Elena: Royal Gown, Nobel Sash & Golden Medallion
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(-8, -12 + bob, 16, 24); // Velvet gown
    ctx.fillStyle = '#facc15';
    ctx.fillRect(-7, -12 + bob, 4, 20); // Gold ceremonial sash
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(-5, -24 + bob, 10, 10);
    ctx.fillStyle = '#92400e';
    ctx.fillRect(-6, -28 + bob, 12, 6); // Updo hair
    // Golden Nobel Medallion & Scroll
    ctx.fillStyle = '#eab308';
    ctx.beginPath();
    ctx.arc(0, -6 + bob, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(9, -14 + bob, 3, 14);
  } else if (spriteType === 'sami') {
    // Nilas: Colorful Sámi Gákti & Four Winds Hat
    ctx.fillStyle = '#1d4ed8';
    ctx.fillRect(-9, -12 + bob, 18, 22);
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(-9, 4 + bob, 18, 4);
    ctx.fillStyle = '#facc15';
    ctx.fillRect(-9, -2 + bob, 18, 3);
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(-6, -22 + bob, 12, 10);
    // Four Winds Hat
    ctx.fillStyle = '#2563eb';
    ctx.fillRect(-8, -30 + bob, 16, 8);
    ctx.fillStyle = '#facc15';
    ctx.fillRect(-12, -34 + bob, 6, 6);
    ctx.fillRect(6, -34 + bob, 6, 6);
    // Shaman Drum (Kannus)
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(10, -14 + bob, 4, 12);
  } else if (spriteType === 'elf') {
    // Toppu: Elf Tunic, Pointed Hat with Bell & Mailbag
    ctx.fillStyle = '#15803d';
    ctx.fillRect(-8, -12 + bob, 16, 20); // Green tunic
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(-8, -4 + bob, 16, 3); // Red belt
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(-5, -22 + bob, 10, 10);
    // Pointed Elf Hat
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.moveTo(-7, -22 + bob);
    ctx.lineTo(7, -22 + bob);
    ctx.lineTo(12, -34 + bob);
    ctx.closePath();
    ctx.fill();
    // Golden jingle bell
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.arc(13, -34 + bob, 3, 0, Math.PI * 2);
    ctx.fill();
    // Leather mailbag
    ctx.fillStyle = '#78350f';
    ctx.fillRect(-12, -6 + bob, 6, 10);
  } else if (spriteType === 'bard') {
    // Urho: Kalevala Embroidered Tunic & Kantele Harp
    ctx.fillStyle = '#475569';
    ctx.fillRect(-8, -12 + bob, 16, 22);
    ctx.fillStyle = '#06b6d4';
    ctx.fillRect(-8, 4 + bob, 16, 3); // Cyan Nordic trim
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(-5, -24 + bob, 10, 10);
    ctx.fillStyle = '#ca8a04';
    ctx.fillRect(-6, -27 + bob, 12, 5); // Blonde hair
    // Kantele Harp
    ctx.fillStyle = '#b45309';
    ctx.fillRect(8, -18 + bob, 6, 16);
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(9, -16 + bob, 1, 12); // Silver string
    ctx.fillRect(11, -16 + bob, 1, 12);
    ctx.fillRect(13, -16 + bob, 1, 12);
  } else if (spriteType === 'sauna') {
    // Martta: Linen Sauna Wrap & Birch Whisk (Vihta)
    ctx.fillStyle = '#f1f5f9';
    ctx.fillRect(-7, -12 + bob, 14, 22); // White sauna towel
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(-7, -12 + bob, 14, 3);
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(-5, -24 + bob, 10, 10);
    ctx.fillStyle = '#d97706';
    ctx.fillRect(-6, -28 + bob, 12, 6);
    // Green Birch Vihta Whisk
    ctx.fillStyle = '#16a34a';
    ctx.beginPath();
    ctx.arc(10, -12 + bob, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#78350f';
    ctx.fillRect(8, -6 + bob, 3, 10);
  } else if (spriteType === 'captain') {
    // Aslak: Navy Peacoat, Peaked Visor Cap & Spyglass
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-9, -12 + bob, 18, 24); // Double-breasted coat
    ctx.fillStyle = '#eab308';
    ctx.fillRect(-5, -6 + bob, 3, 3); // Brass buttons
    ctx.fillRect(2, -6 + bob, 3, 3);
    ctx.fillRect(-5, 0 + bob, 3, 3);
    ctx.fillRect(2, 0 + bob, 3, 3);
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(-6, -24 + bob, 12, 10);
    // Captain Peaked Visor Cap
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-8, -32 + bob, 16, 7);
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(-10, -25 + bob, 20, 3); // Black visor
    ctx.fillStyle = '#eab308';
    ctx.fillRect(-3, -29 + bob, 6, 3); // Golden anchor insignia
    // Brass Spyglass
    ctx.fillStyle = '#ca8a04';
    ctx.fillRect(10, -18 + bob, 3, 16);
  } else if (spriteType === 'priestess') {
    // Ingrid: Nordic Wool Cowl, Lavender Vestment & Cross
    ctx.fillStyle = '#e0e7ff';
    ctx.fillRect(-8, -12 + bob, 16, 24); // Sacred robe
    ctx.fillStyle = '#818cf8';
    ctx.fillRect(-9, -14 + bob, 18, 6); // Indigo hood
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(-5, -24 + bob, 10, 10);
    // Silver Cross
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(-1, -6 + bob, 2, 8);
    ctx.fillRect(-3, -4 + bob, 6, 2);
    // Stained Glass Crystal
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(9, -14 + bob, 4, 6);
  } else if (spriteType === 'skald') {
    // Thor: Volcanic Obsidian Cape & Geothermal Compass
    ctx.fillStyle = '#c2410c';
    ctx.fillRect(-9, -12 + bob, 18, 22);
    ctx.fillStyle = '#1c1917';
    ctx.fillRect(-11, -14 + bob, 22, 6);
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(-6, -22 + bob, 12, 10);
    ctx.fillStyle = '#ea580c';
    ctx.fillRect(-8, -28 + bob, 16, 6);
    // Geothermal Compass
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(10, -6 + bob, 4, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // Freyja / Witch: Azure Thermal Robe & Silica Quartz Crown
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(-8, -12 + bob, 16, 24); // Thermal azure gown
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(-10, -10 + bob, 20, 4);
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(-5, -24 + bob, 10, 10);
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(-6, -28 + bob, 12, 5); // White silica crown
    // Silica Mud Pot
    ctx.fillStyle = '#e0f2fe';
    ctx.beginPath();
    ctx.arc(10, -8 + bob, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  // Floating Speech Bubble with pulsating quest mark & NPC Emotional Expression
  const emotion = getNpcEmotion(courage);
  const bubbleY = -40 + bob;

  // Quest Mark bubble
  ctx.fillStyle = isStoryLearned ? '#10b981' : '#f59e0b';
  ctx.beginPath();
  ctx.arc(-11, bubbleY, 9, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1.6;
  ctx.stroke();

  ctx.font = 'bold 10px sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(isStoryLearned ? '✓' : '!', -11, bubbleY);

  // NPC Emotion Pixel Expression Box
  ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
  ctx.fillRect(2, bubbleY - 9, 24, 18);
  ctx.strokeStyle = emotion.badgeColor;
  ctx.lineWidth = 1.4;
  ctx.strokeRect(2, bubbleY - 9, 24, 18);

  ctx.font = '11px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(emotion.emoji, 14, bubbleY);

  // Name Tag & Emotion Label
  ctx.font = 'bold 10px sans-serif';
  ctx.fillStyle = '#fef08a';
  ctx.fillText(npc.name.split(' ')[0], 0, 26);

  ctx.restore();
}


// Draw Roving Historical NPC (Patrolling and interacting)
export function drawRovingHistoricalNpc(
  ctx: CanvasRenderingContext2D,
  npc: RovingHistoricalNpc,
  tick: number
) {
  const { x, y, spriteType, dir } = npc;
  const walkBob = Math.sin((tick + x) * 0.15) * 2;
  const legCycle = Math.sin((tick + x) * 0.25) * 3;

  ctx.save();
  ctx.translate(x, y);

  // Ground shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.beginPath();
  ctx.ellipse(0, 16, 18, 6, 0, 0, Math.PI * 2);
  ctx.fill();

  if (spriteType === 'sailor') {
    // Boatswain Olov: Blue Pea Coat, Knit Beanie, Brass Lantern
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(-7, -10 + walkBob, 14, 20);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-6, 10 + walkBob, 5, 8 + (dir > 0 ? legCycle : -legCycle));
    ctx.fillRect(1, 10 + walkBob, 5, 8 + (dir > 0 ? -legCycle : legCycle));
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(-5, -22 + walkBob, 10, 10);
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(-4, -14 + walkBob, 8, 4);
    ctx.fillStyle = '#1e40af';
    ctx.fillRect(-7, -27 + walkBob, 14, 6);
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(-4, -29 + walkBob, 8, 3);
    const handX = dir > 0 ? 8 : -11;
    ctx.fillStyle = '#ca8a04';
    ctx.fillRect(handX, -6 + walkBob, 4, 8);
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(handX + 1, -4 + walkBob, 2, 4);
  } else if (spriteType === 'scholar_bellman') {
    // Scholar Bellman: Tailcoat, Cravat, Golden Feather Quill
    ctx.fillStyle = '#312e81';
    ctx.fillRect(-6, -10 + walkBob, 12, 22);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-2, -8 + walkBob, 4, 6);
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(-5, -22 + walkBob, 10, 10);
    ctx.fillStyle = '#f1f5f9';
    ctx.fillRect(-7, -26 + walkBob, 14, 6);
    ctx.fillRect(-8, -22 + walkBob, 3, 10);
    ctx.fillRect(5, -22 + walkBob, 3, 10);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-5, 12 + walkBob, 4, 7 + (dir > 0 ? legCycle : -legCycle));
    ctx.fillRect(1, 12 + walkBob, 4, 7 + (dir > 0 ? -legCycle : legCycle));
    const hX = dir > 0 ? 7 : -10;
    ctx.fillStyle = '#facc15';
    ctx.fillRect(hX, -12 + walkBob, 3, 12);
  } else if (spriteType === 'skald_egill') {
    // Skald Egill: Viking Wool Cloak, Bone Lyre, Fur Trim
    ctx.fillStyle = '#7c2d12';
    ctx.fillRect(-8, -10 + walkBob, 16, 22);
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(-10, -12 + walkBob, 20, 4);
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(-5, -22 + walkBob, 10, 10);
    ctx.fillStyle = '#c2410c';
    ctx.fillRect(-5, -14 + walkBob, 10, 6);
    ctx.fillStyle = '#78350f';
    ctx.fillRect(-6, -24 + walkBob, 12, 3);
    ctx.fillStyle = '#451a03';
    ctx.fillRect(-5, 12 + walkBob, 4, 7 + (dir > 0 ? legCycle : -legCycle));
    ctx.fillRect(1, 12 + walkBob, 4, 7 + (dir > 0 ? -legCycle : legCycle));
    const hX = dir > 0 ? 8 : -12;
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(hX, -6 + walkBob, 4, 10);
  } else if (spriteType === 'geologist_hildur') {
    // Geologist Hildur: Red Polar Parka, Thermal Goggles, Sample Tube
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(-7, -10 + walkBob, 14, 20);
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(-9, -12 + walkBob, 18, 4);
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(-5, -22 + walkBob, 10, 10);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(-6, -20 + walkBob, 12, 4);
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(-5, 10 + walkBob, 4, 8 + (dir > 0 ? legCycle : -legCycle));
    ctx.fillRect(1, 10 + walkBob, 4, 8 + (dir > 0 ? -legCycle : legCycle));
    const hX = dir > 0 ? 8 : -11;
    ctx.fillStyle = '#67e8f9';
    ctx.fillRect(hX, -4 + walkBob, 3, 10);
  } else if (spriteType === 'guard_christian') {
    // Guard Christian: Royal Bearskin Hat, Red Tunic, White Cross-belts & Rifle
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(-7, -10 + walkBob, 14, 20); // Royal red coat
    // White cross belts
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-5, -10 + walkBob, 2, 20);
    ctx.fillRect(3, -10 + walkBob, 2, 20);
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(-5, 10 + walkBob, 4, 8 + (dir > 0 ? legCycle : -legCycle));
    ctx.fillRect(1, 10 + walkBob, 4, 8 + (dir > 0 ? -legCycle : legCycle));
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(-5, -20 + walkBob, 10, 10);
    // Tall Bearskin Hat
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-7, -36 + walkBob, 14, 16);
    ctx.fillStyle = '#ca8a04';
    ctx.fillRect(-2, -26 + walkBob, 4, 3); // Golden badge
    // Rifle with bayonet
    const hX = dir > 0 ? 8 : -12;
    ctx.fillStyle = '#78350f';
    ctx.fillRect(hX, -28 + walkBob, 3, 36);
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(hX + 0.5, -34 + walkBob, 2, 8); // Bayonet
  } else if (spriteType === 'herbalist_astrid') {
    // Herbalist Astrid: Cinnamon Apron, Steaming Wine Cup & Fur Shawl
    ctx.fillStyle = '#991b1b';
    ctx.fillRect(-7, -10 + walkBob, 14, 20);
    ctx.fillStyle = '#78350f';
    ctx.fillRect(-5, -6 + walkBob, 10, 14); // Apron
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(-5, -20 + walkBob, 10, 10);
    ctx.fillStyle = '#d97706';
    ctx.fillRect(-6, -24 + walkBob, 12, 5); // Hair
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(-5, 10 + walkBob, 4, 7 + (dir > 0 ? legCycle : -legCycle));
    ctx.fillRect(1, 10 + walkBob, 4, 7 + (dir > 0 ? -legCycle : legCycle));
    // Steaming Wine Cup (Gløgg)
    const hX = dir > 0 ? 8 : -11;
    ctx.fillStyle = '#b91c1c';
    ctx.fillRect(hX, -6 + walkBob, 5, 7);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.fillRect(hX + 1, -10 + walkBob, 3, 3); // Steam
  } else if (spriteType === 'glassblower_magnus') {
    // Glassblower Magnus: Heavy Leather Apron, Protective Goggles & Long Blowpipe with Molten Bulb
    ctx.fillStyle = '#451a03';
    ctx.fillRect(-8, -10 + walkBob, 16, 22);
    ctx.fillStyle = '#78350f';
    ctx.fillRect(-6, -6 + walkBob, 12, 16);
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(-5, -20 + walkBob, 10, 10);
    // Protective dark goggles
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(-6, -18 + walkBob, 12, 4);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(-4, -17 + walkBob, 3, 2);
    ctx.fillRect(1, -17 + walkBob, 3, 2);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-5, 12 + walkBob, 4, 7 + (dir > 0 ? legCycle : -legCycle));
    ctx.fillRect(1, 12 + walkBob, 4, 7 + (dir > 0 ? -legCycle : legCycle));
    // Long steel blowpipe with glowing glass bulb
    const hX = dir > 0 ? 8 : -14;
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(hX, -16 + walkBob, 3, 28);
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(hX + 1.5, -18 + walkBob, 4, 0, Math.PI * 2);
    ctx.fill();
  } else if (spriteType === 'herder_sampo') {
    // Herder Sampo: Traditional Sámi Fur Boots, Belt with Pouch & Lasso (Suopanki)
    ctx.fillStyle = '#1d4ed8';
    ctx.fillRect(-8, -10 + walkBob, 16, 20);
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(-8, 6 + walkBob, 16, 4);
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(-5, -20 + walkBob, 10, 10);
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(-7, -26 + walkBob, 14, 6); // Sámi blue hat
    ctx.fillStyle = '#facc15';
    ctx.fillRect(-7, -22 + walkBob, 14, 2);
    ctx.fillStyle = '#78350f';
    ctx.fillRect(-5, 10 + walkBob, 4, 8 + (dir > 0 ? legCycle : -legCycle));
    ctx.fillRect(1, 10 + walkBob, 4, 8 + (dir > 0 ? -legCycle : legCycle));
    // Coiled Reindeer Lasso (Suopanki)
    const hX = dir > 0 ? 8 : -11;
    ctx.strokeStyle = '#ca8a04';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(hX + 2, -4 + walkBob, 5, 0, Math.PI * 2);
    ctx.stroke();
  } else if (spriteType === 'architect_alvar') {
    // Architect Alvar: Wool Overcoat, Round Glasses, Blueprint Roll & T-Square
    ctx.fillStyle = '#334155';
    ctx.fillRect(-7, -10 + walkBob, 14, 22);
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(-2, -8 + walkBob, 4, 4); // White collar
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(-5, -20 + walkBob, 10, 10);
    // Round glasses
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1;
    ctx.strokeRect(-4, -17 + walkBob, 3, 3);
    ctx.strokeRect(1, -17 + walkBob, 3, 3);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-5, 12 + walkBob, 4, 7 + (dir > 0 ? legCycle : -legCycle));
    ctx.fillRect(1, 12 + walkBob, 4, 7 + (dir > 0 ? -legCycle : legCycle));
    // Rolled Blueprint & Triangle ruler
    const hX = dir > 0 ? 8 : -11;
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(hX, -12 + walkBob, 4, 18);
    ctx.fillStyle = '#eab308';
    ctx.fillRect(hX - 2, -2 + walkBob, 8, 2);
  } else {
    // Ranger Katla: Weatherproof Parka, Thermal Backpack, Trekking Pole & Safety Radio
    ctx.fillStyle = '#ea580c';
    ctx.fillRect(-8, -10 + walkBob, 16, 20); // Orange rescue parka
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(-8, 6 + walkBob, 16, 4);
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(-5, -20 + walkBob, 10, 10);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-6, -24 + walkBob, 12, 5); // Thermal beanie
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-5, 10 + walkBob, 4, 8 + (dir > 0 ? legCycle : -legCycle));
    ctx.fillRect(1, 10 + walkBob, 4, 8 + (dir > 0 ? -legCycle : legCycle));
    // Trekking Pole & Shoulder Radio
    const hX = dir > 0 ? 9 : -12;
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(hX, -16 + walkBob, 2, 28);
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(-8, -8 + walkBob, 3, 6); // Radio
  }

  // Floating Patrol Badge & Name Tag
  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.fillRect(-35, -42 + walkBob, 70, 15);
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 1;
  ctx.strokeRect(-35, -42 + walkBob, 70, 15);

  ctx.font = 'bold 9px sans-serif';
  ctx.fillStyle = '#fef08a';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`${npc.avatar} ${npc.name.split(' ')[0]}`, 0, -34 + walkBob);

  ctx.restore();
}

// Draw Player Character Model
export function drawPixelPlayerModel(
  ctx: CanvasRenderingContext2D,
  px: number,
  py: number,
  dir: string,
  tick: number,
  transportMode: 'walk' | 'reindeer' | 'train'
) {
  const walkBob = Math.sin(tick * 0.25) * 2;

  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  ctx.beginPath();
  ctx.ellipse(px, py + 16, 16, 6, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.save();
  ctx.translate(px, py);

  ctx.fillStyle = '#451a03';
  ctx.fillRect(-7, 6 + walkBob, 5, 9);
  ctx.fillRect(2, 6 + walkBob, 5, 9);

  ctx.fillStyle = '#0284c7';
  ctx.fillRect(-9, -12 + walkBob, 18, 18);
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(-11, -14 + walkBob, 22, 5);

  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  ctx.arc(0, -18 + walkBob, 9, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#fed7aa';
  ctx.fillRect(-5, -20 + walkBob, 10, 8);

  ctx.restore();
}

// ==========================================
// 5. MAIN REACT COMPONENT
// ==========================================

export const PolarExpressReindeerRpgModal: React.FC<PolarExpressReindeerRpgModalProps> = ({
  isOpen,
  onClose,
  onSelectDay,
}) => {
  const [activeTab, setActiveTab] = useState<'world' | 'battle' | 'quests' | 'logbook' | 'buffs'>('world');
  const [currentChapterIdx, setCurrentChapterIdx] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [soundVolume, setSoundVolume] = useState<number>(() => {
    try {
      const v = localStorage.getItem('rpg_sound_volume_v1');
      return v !== null ? parseFloat(v) : 0.7;
    } catch {
      return 0.7;
    }
  });
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Persistent Player Progression State
  const [playerState, setPlayerState] = useState<RpgPlayerState>(() => {
    try {
      const saved = localStorage.getItem('aurora_saga_save_v4_undertale');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          courage: typeof parsed.courage === 'number' ? parsed.courage : 15,
          unlockedHiddenQuests: Array.isArray(parsed.unlockedHiddenQuests) ? parsed.unlockedHiddenQuests : [],
        };
      }
    } catch {
      // fallback
    }
    return {
      hp: 160,
      maxHp: 160,
      mp: 100,
      maxMp: 100,
      level: 1,
      exp: 0,
      gold: 300,
      courage: 15, // 初始勇氣值 15
      unlockedHiddenQuests: [] as string[],
      clearedBosses: [] as string[],
      unlockedLandmarks: ['cph_nyhavn'] as string[],
      completedQuests: [] as string[],
      learnedStories: [] as string[], // Chapters where primary story NPC was consulted
      claimedNpcRewards: [] as string[], // One-time claimed NPC rewards
      activeBuff: null as string | null,
      transportMode: 'walk' as 'walk' | 'reindeer' | 'train',
      savePointHotel: "Hotel d'Angleterre",
      inventory: [
        {
          id: 'cph_glogg',
          name: '丹麥香料熱紅酒 (Danish Gløgg)',
          icon: '🍷',
          count: 2,
          healAmount: 80,
          description: '以赤紅葡萄酒加肉桂、丁香溫熱熬煮，北歐冬夜驅寒名物。',
          effectLabel: '回復 80 HP · 暖身加護',
        },
      ],
    };
  });

  // Active Story Dialogue Tree Modal
  const [activeStoryNpc, setActiveStoryNpc] = useState<PrimaryStoryNpc | null>(null);
  const [dialogueNodeKey, setDialogueNodeKey] = useState<string>('start');
  const [courageFeedback, setCourageFeedback] = useState<{ delta: number; text: string } | null>(null);

  // NPC Dialogue Animation, Typewriter, Voice Synth & Backlog System
  const [dialogueTextSpeed, setDialogueTextSpeed] = useState<'normal' | 'fast' | 'instant'>(() => {
    try {
      const saved = localStorage.getItem('aurora_dialogue_speed_v1');
      if (saved === 'normal' || saved === 'fast' || saved === 'instant') return saved;
    } catch {
      // ignore
    }
    return 'fast';
  });

  // Story NPC Typewriter State
  const [storyDialogueTypedChars, setStoryDialogueTypedChars] = useState<string>('');
  const [isStoryDialogueTyping, setIsStoryDialogueTyping] = useState<boolean>(false);
  const storyDialogueTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number>(0);
  const [npcTalkingTick, setNpcTalkingTick] = useState<number>(0);

  // Roving NPC Typewriter State
  const [rovingDialogueTypedChars, setRovingDialogueTypedChars] = useState<string>('');
  const [isRovingDialogueTyping, setIsRovingDialogueTyping] = useState<boolean>(false);
  const rovingDialogueTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Dialogue Backlog / History Log
  const [dialogueHistory, setDialogueHistory] = useState<Array<{
    id: string;
    speaker: string;
    title: string;
    avatar: string;
    text: string;
    playerChoice?: string;
    courageDelta?: number;
    timestamp: number;
  }>>([]);
  const [isDialogueHistoryOpen, setIsDialogueHistoryOpen] = useState<boolean>(false);

  // Nordic Town Shops, Boss Side Weapons & Organic NPC Wander States
  const [activeShopModal, setActiveShopModal] = useState<NordicShopData | null>(null);
  const [isEpicChantMenuOpen, setIsEpicChantMenuOpen] = useState<boolean>(false);
  const [epicChantRoundIdx, setEpicChantRoundIdx] = useState<number>(0);
  const [epicChantFeedback, setEpicChantFeedback] = useState<{ quote: string; isCorrect: boolean } | null>(null);
  const [isItemMenuOpen, setIsItemMenuOpen] = useState<boolean>(false);
  const [buildingToast, setBuildingToast] = useState<string | null>(null);
  const [activeBuildingModal, setActiveBuildingModal] = useState<InteractiveBuildingData | null>(null);
  const [activeAnimalModal, setActiveAnimalModal] = useState<InteractiveAnimalData | null>(null);
  const [interactedAnimals, setInteractedAnimals] = useState<string[]>([]);
  const [animalToast, setAnimalToast] = useState<string | null>(null);

  const [epicChantStep, setEpicChantStep] = useState<number>(0);
  const [isBossPacified, setIsBossPacified] = useState<boolean>(false);
  const [activeItemToast, setActiveItemToast] = useState<string | null>(null);
  const [shopToast, setShopToast] = useState<{ message: string; type: 'success' | 'warn' } | null>(null);
  const sideWeaponsRef = useRef<BossSideWeapon[]>([]);
  const npcWanderStatesRef = useRef<Record<string, {
    state: 'idle' | 'walk';
    timer: number;
    targetX: number;
    targetY: number;
    baseY: number;
    dir: number;
    thoughtEmoji: string;
  }>>({});

  // Active Global Notification Event Modal
  const [activeEvent, setActiveEvent] = useState<{
    title: string;
    description: string;
    icon: string;
    actionLabel?: string;
    onAction?: () => void;
  } | null>(null);

  // ==========================================
  // UNDERTALE BOSS BATTLE ENGINE STATE
  // ==========================================
  const [inBattle, setInBattle] = useState<boolean>(false);
  const [battleBossHp, setBattleBossHp] = useState<number>(380);
  const battleBossHpRef = useRef<number>(380);
  battleBossHpRef.current = battleBossHp;
  const [dodgeCombo, setDodgeCombo] = useState<number>(0);
  const dodgeComboRef = useRef<number>(0);
  const [extremeCounterReady, setExtremeCounterReady] = useState<boolean>(false);
  const extremeDodgeWindowRef = useRef<number>(0);
  const extremeCounterCountRef = useRef<number>(0);
  const counterSlashAnimRef = useRef<{
    active: boolean;
    life: number;
    skillName: string;
    damage: number;
    combo: number;
    color: string;
    secondaryColor: string;
    targetX: number;
    targetY: number;
    soulX: number;
    soulY: number;
  }>({
    active: false,
    life: 0,
    skillName: '',
    damage: 0,
    combo: 0,
    color: '#ffffff',
    secondaryColor: '#38bdf8',
    targetX: 0,
    targetY: 0,
    soulX: 0,
    soulY: 0,
  });
  const [battlePhase, setBattlePhase] = useState<'intro_cutscene' | 'menu' | 'act_menu' | 'item_menu' | 'strike_bar' | 'dodge' | 'victory' | 'defeat'>('intro_cutscene');
  const [cutsceneStep, setCutsceneStep] = useState<number>(0);
  const [cutsceneCharIdx, setCutsceneCharIdx] = useState<number>(0);
  const cutsceneCharIdxRef = useRef<number>(0);
  const [bossSpeech, setBossSpeech] = useState<string>('');
  const [dodgeTimer, setDodgeTimer] = useState<number>(8.0);
  const dodgeTimerRef = useRef<number>(8.0);
  dodgeTimerRef.current = dodgeTimer;
  const battleTickRef = useRef<number>(0);
  const flappyPillarsRef = useRef<FlappyNordicPillar[]>([]);
  const flappyVyRef = useRef<number>(0);
  const flappyFlapCooldownRef = useRef<number>(0);
  const [isChaosSaberCssWaveActive, setIsChaosSaberCssWaveActive] = useState<boolean>(false);
  const [activeCssWeaponSide, setActiveCssWeaponSide] = useState<'none' | 'left' | 'right' | 'top'>('none');
  // 戰鬥階段系統：第一階段（彈幕射擊）、第二階段（水管鳥式障礙與上下蜿蜒躲避）、第三階段（強力激光射線）
  const [bossAttackStage, setBossAttackStage] = useState<'stage1_danmaku' | 'stage2_flappy' | 'stage3_laser'>('stage1_danmaku');
  const bossAttackStageRef = useRef<'stage1_danmaku' | 'stage2_flappy' | 'stage3_laser'>('stage1_danmaku');
  bossAttackStageRef.current = bossAttackStage;
  const flappyWaveCountRef = useRef<number>(0);

  const switchBossAttackStage = (nextStage: 'stage1_danmaku' | 'stage2_flappy' | 'stage3_laser') => {
    setBossAttackStage(nextStage);
    bossAttackStageRef.current = nextStage;
    bulletsRef.current = [];
    sideWeaponsRef.current = [];
    flappyPillarsRef.current = [];
    flappyWaveCountRef.current = 0;
    setIsChaosSaberCssWaveActive(false);
    setActiveCssWeaponSide('none');
    intermittentAttackStateRef.current = {
      nextAttackTick: battleTickRef.current + 10,
      activeMode: 'idle',
      modeEndTick: 0,
      lastSide: 'right',
      cssHideTick: 0,
      bannerText: '',
      bannerColor: nextStage === 'stage1_danmaku' ? '#38bdf8' : nextStage === 'stage2_flappy' ? '#4ade80' : '#f43f5e',
    };
  };

  const intermittentAttackStateRef = useRef<{
    nextAttackTick: number;
    activeMode: 'idle' | 'weapon_strike' | 'flappy_corridor';
    modeEndTick: number;
    lastSide: 'left' | 'right' | 'top';
    cssHideTick: number;
    bannerText: string;
    bannerColor: string;
  }>({
    nextAttackTick: 16,
    activeMode: 'idle',
    modeEndTick: 0,
    lastSide: 'right',
    cssHideTick: 0,
    bannerText: '',
    bannerColor: '#38bdf8',
  });
  const [battleLog, setBattleLog] = useState<string[]>([]);
  const bossPatrolRef = useRef<{ x: number; y: number; vx: number }>({ x: 0, y: 0, vx: 1.15 });
  const bossAnimOverrideRef = useRef<BossAnimState | null>(null);

  // 歷史 BOSS 戰鬥難度系統狀態
  const [battleDifficulty, setBattleDifficulty] = useState<BattleDifficulty>(() => {
    try {
      const saved = localStorage.getItem('aurora_rpg_difficulty_v1');
      if (saved && (saved === 'easy' || saved === 'normal' || saved === 'hard' || saved === 'lunatic')) {
        return saved as BattleDifficulty;
      }
    } catch {
      // ignore
    }
    return 'normal';
  });
  const battleDifficultyRef = useRef<BattleDifficulty>(battleDifficulty);

  // 8-Bit Chiptune 背景音樂 (BGM) 系統狀態
  const [bgmEnabled, setBgmEnabled] = useState<boolean>(() => rpgBgmEngine.isSoundEnabled());
  const [bgmVolume, setBgmVolume] = useState<number>(() => rpgBgmEngine.getVolume());
  const [currentBgmTrack, setCurrentBgmTrack] = useState<BgmTrackId | null>('nordic_explore');

  // 地圖玩家腳印軌跡記錄 (Footprint Trails)
  const playerFootprintsRef = useRef<{ x: number; y: number; life: number; dir: string }[]>([]);

  // 勇氣值解鎖輔助技能冷卻回合狀態
  const [skillCooldowns, setSkillCooldowns] = useState<Record<'warcry' | 'blessing' | 'aegis', number>>({
    warcry: 0,
    blessing: 0,
    aegis: 0,
  });
  const warcryActiveTurnsRef = useRef<number>(0);
  const blessingRegenTurnsRef = useRef<number>(0);
  const aegisChargesRef = useRef<number>(0);

  // 經典 Undertale 攻擊條 (QTE Strike Bar) 狀態
  const strikePosRef = useRef<number>(0);
  const strikeSpeedRef = useRef<number>(6.2);
  const strikeDoneRef = useRef<boolean>(false);
  const strikeResultRef = useRef<{ rating: 'PERFECT' | 'GREAT' | 'GOOD' | 'MISS'; damage: number; isCrit: boolean } | null>(null);
  const slashAnimRef = useRef<{ life: number; damage: number; isCrit: boolean } | null>(null);

  // 第四面牆打破元素與 BOSS 專屬機制狀態
  const bluetoothGlitchRef = useRef<boolean>(false);
  const waterHeightRef = useRef<number>(0);
  const boxTiltRef = useRef<number>(0);
  const isInvertedControlsRef = useRef<boolean>(false);
  const glassCracksRef = useRef<{ x: number; y: number; lines: { dx: number; dy: number }[] }[]>([]);
  const coreTempRef = useRef<number>(65);
  const interactivePropsRef = useRef<{
    type: 'driftwood' | 'sami_drum' | 'rest_note' | 'rage_shard' | 'steam_vent';
    x: number;
    y: number;
    radius: number;
    life: number;
  }[]>([]);

  // Undertale Battle Arena Box Dynamic Movement Physics (彈幕框動態移動與血量形態系統)
  const boxMotionRef = useRef<{ x: number; y: number; w: number; h: number; tilt: number }>({
    x: 270,
    y: 130,
    w: 320,
    h: 180,
    tilt: 0,
  });
  const boxBounds = boxMotionRef.current;
  const lastAnnouncedFormRef = useRef<Record<string, 1 | 2 | 3>>({});
  const formTransitionBannerRef = useRef<{ form: 1 | 2 | 3; name: string; badge: string; quote: string; frames: number } | null>(null);
  const soulPosRef = useRef({ x: 430, y: 220, iFrames: 0 });
  const bulletsRef = useRef<UndertaleBullet[]>([]);
  const soulTrailRef = useRef<{ x: number; y: number; alpha: number; color?: string; scale?: number }[]>([]);
  const grazeSparksRef = useRef<{ x: number; y: number; vx: number; vy: number; life: number; color: string }[]>([]);
  const grazeIndicatorRef = useRef<{ x: number; y: number; text: string; alpha: number } | null>(null);
  const grazeAudioCooldownRef = useRef<number>(0);
  const grazeCountRef = useRef<number>(0);

  const battleCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const battleAnimFrameRef = useRef<number | null>(null);
  const screenShakeRef = useRef<number>(0);
  const bossShakeRef = useRef<number>(0);
  const bossHitFlashRef = useRef<number>(0);
  const impactParticlesRef = useRef<{ x: number; y: number; vx: number; vy: number; life: number; color: string; size: number }[]>([]);

  // 進階『連擊 (Combo)』與『極限躲避點擊反擊 (Extreme Dodge Timed Click Counter)』系統狀態
  const [comboCount, setComboCount] = useState<number>(0);
  const comboCountRef = useRef<number>(0);
  const [maxCombo, setMaxCombo] = useState<number>(0);
  const maxComboRef = useRef<number>(0);
  const [extremeDodgeCount, setExtremeDodgeCount] = useState<number>(0);
  const extremeDodgeCountRef = useRef<number>(0);
  const [counterAttackCount, setCounterAttackCount] = useState<number>(0);
  const counterAttackCountRef = useRef<number>(0);
  const [counterWindowActive, setCounterWindowActive] = useState<boolean>(false);
  const counterWindowTimerRef = useRef<number>(0); // 特定時間點反擊判定倒數幀數
  const counterCooldownRef = useRef<number>(0);
  const pixelCounterAnimsRef = useRef<{
    life: number;
    fromX: number;
    fromY: number;
    toX: number;
    toY: number;
    skillName: string;
    runeSymbol: string;
    primaryColor: string;
    secondaryColor: string;
    damage: number;
    combo: number;
  }[]>([]);

  // 彈幕『引力場 (Gravitational Field)』與『碎裂 (Shatter Physics)』粒子狀態
  const danmakuShardsRef = useRef<DanmakuShatterShard[]>([]);
  const shatterRingsRef = useRef<{ x: number; y: number; radius: number; maxRadius: number; color: string; alpha: number }[]>([]);

  const spawnBulletShatterFragments = (
    x: number,
    y: number,
    color: string,
    secondaryColor: string = '#ffffff',
    kind: DanmakuShatterShard['kind'] = 'rune_frag',
    count: number = 10,
    char?: string
  ) => {
    shatterRingsRef.current.push({
      x,
      y,
      radius: 4,
      maxRadius: 28,
      color,
      alpha: 0.9,
    });
    const runeGlyphs = ['ᛒ', 'ᚱ', 'ᚠ', 'ᛏ', 'ᚦ', 'ᛦ'];
    for (let i = 0; i < count; i++) {
      const ang = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.45;
      const spd = 1.6 + Math.random() * 3.4;
      danmakuShardsRef.current.push({
        x,
        y,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd - 0.6,
        gravity: kind === 'rune_frag' || kind === 'ice_crystal' ? 0.04 : 0.12,
        size: 3 + Math.random() * 3.2,
        color: i % 2 === 0 ? color : secondaryColor,
        secondaryColor,
        alpha: 1.0,
        rot: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.28,
        kind,
        char: kind === 'rune_frag' && i % 3 === 0 ? (char || runeGlyphs[i % runeGlyphs.length]) : undefined,
      });
    }
    if (danmakuShardsRef.current.length > 160) {
      danmakuShardsRef.current.splice(0, danmakuShardsRef.current.length - 160);
    }
  };

  // 戰鬥後專屬劇情結算視窗狀態 (Post-Battle Exclusive Story Epilogue Modal)
  const [showVictoryEpilogueModal, setShowVictoryEpilogueModal] = useState<boolean>(false);

  // Active Roving Historical NPC Dialogue Modal
  const [activeRovingNpc, setActiveRovingNpc] = useState<RovingHistoricalNpc | null>(null);

  // Map Canvas Engine
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const playerPosRef = useRef({ x: 280, y: 380, dir: 'down', frame: 0 });
  const keysDownRef = useRef<Record<string, boolean>>({});
  const animFrameRef = useRef<number | null>(null);
  const inBattleRef = useRef<boolean>(false);
  inBattleRef.current = inBattle;

  const audioCtxRef = useRef<AudioContext | null>(null);

  const currentChapter = RPG_CHAPTERS[currentChapterIdx] || RPG_CHAPTERS[0];
  const primaryNpc = PRIMARY_STORY_NPCS.find((n) => n.chapterId === currentChapter.id) || PRIMARY_STORY_NPCS[0];
  const isCurrentStoryLearned = playerState.learnedStories.includes(currentChapter.id);
  const isCurrentBossBeaten = playerState.clearedBosses.includes(currentChapter.boss.id);

  // Save game progress
  const saveGame = (stateToSave: typeof playerState) => {
    try {
      localStorage.setItem('aurora_saga_save_v4_undertale', JSON.stringify(stateToSave));
    } catch {
      // ignore
    }
  };

  // ==========================================
  // 8-BIT AUDIO MANAGER & DIFFICULTY CONTROLS
  // ==========================================
  const updateDifficulty = (newDiff: BattleDifficulty) => {
    setBattleDifficulty(newDiff);
    battleDifficultyRef.current = newDiff;
    try {
      localStorage.setItem('aurora_rpg_difficulty_v1', newDiff);
    } catch {
      // ignore
    }
    playRetroSound('blip');
    if (newDiff === 'lunatic' && inBattle) {
      rpgBgmEngine.startTrack('boss_ragnarok_lunatic');
      setCurrentBgmTrack('boss_ragnarok_lunatic');
    }
  };

  const updateSoundVolume = (newVol: number) => {
    const clamped = Math.max(0, Math.min(1, newVol));
    setSoundVolume(clamped);
    try {
      localStorage.setItem('rpg_sound_volume_v1', clamped.toString());
    } catch {
      // ignore
    }
  };

  const updateBgmVolume = (newVol: number) => {
    const clamped = Math.max(0, Math.min(1, newVol));
    setBgmVolume(clamped);
    rpgBgmEngine.setVolume(clamped);
  };

  const toggleBgmEnabled = () => {
    const next = !bgmEnabled;
    setBgmEnabled(next);
    rpgBgmEngine.setEnabled(next);
    if (next) playRetroSound('blip');
  };

  const playRetroSound = (
    type:
      | 'blip'
      | 'slash'
      | 'magic'
      | 'fanfare'
      | 'heal'
      | 'roar'
      | 'hit'
      | 'bullet'
      | 'graze'
      | 'warcry'
      | 'blessing'
      | 'aegis'
      | 'glass_shatter'
      | 'laser'
      | 'glitch'
      | 'water_splash'
      | 'strike_perfect'
      | 'strike_good'
      | 'strike_miss'
  ) => {
    if (!soundEnabled || soundVolume <= 0.01) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const now = ctx.currentTime;
      const master = soundVolume;

      if (type === 'strike_perfect') {
        // Triumphant 8-bit fanfare arpeggio [C5, E5, G5, C6]
        [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(freq, now + idx * 0.05);
          gain.gain.setValueAtTime(0.18 * master, now + idx * 0.05);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.16);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.05);
          osc.stop(now + idx * 0.05 + 0.18);
        });
      } else if (type === 'strike_good') {
        // Punchy metallic slice
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(580, now);
        osc.frequency.exponentialRampToValueAtTime(140, now + 0.12);
        gain.gain.setValueAtTime(0.2 * master, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.13);
      } else if (type === 'strike_miss') {
        // Muffled whoosh
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(260, now);
        osc.frequency.exponentialRampToValueAtTime(60, now + 0.16);
        gain.gain.setValueAtTime(0.1 * master, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.17);
      } else if (type === 'warcry') {
        // Dual oscillator Viking war horn swell
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        osc1.type = 'sawtooth';
        osc2.type = 'square';
        osc1.frequency.setValueAtTime(180, now);
        osc1.frequency.exponentialRampToValueAtTime(420, now + 0.28);
        osc2.frequency.setValueAtTime(270, now);
        osc2.frequency.exponentialRampToValueAtTime(630, now + 0.28);
        gain.gain.setValueAtTime(0.22 * master, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);
        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.36);
        osc2.stop(now + 0.36);
      } else if (type === 'blessing') {
        // Ethereal pentatonic harmonic chimes
        [523.25, 659.25, 783.99, 1046.5, 1318.5].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.06);
          gain.gain.setValueAtTime(0.12 * master, now + idx * 0.06);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.28);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.06);
          osc.stop(now + idx * 0.06 + 0.3);
        });
      } else if (type === 'aegis') {
        // High metallic shield deflection ping
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1480, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.22);
        gain.gain.setValueAtTime(0.24 * master, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.24);
      } else if (type === 'laser') {
        // High-energy laser beam discharge zap
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(1350, now);
        osc.frequency.exponentialRampToValueAtTime(180, now + 0.24);
        gain.gain.setValueAtTime(0.2 * master, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.26);
      } else if (type === 'glass_shatter') {
        // Glass crack dissonant high cluster burst
        [2200, 2900, 3600].forEach((freq) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(freq, now);
          osc.frequency.exponentialRampToValueAtTime(120, now + 0.15);
          gain.gain.setValueAtTime(0.12 * master, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.16);
        });
      } else if (type === 'glitch') {
        // Rapid frequency-hopping square glitch
        [140, 880, 220, 1200].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(freq, now + idx * 0.03);
          gain.gain.setValueAtTime(0.14 * master, now + idx * 0.03);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.03 + 0.05);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.03);
          osc.stop(now + idx * 0.03 + 0.055);
        });
      } else if (type === 'water_splash') {
        // Lowpass noise whoosh
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(160, now);
        osc.frequency.linearRampToValueAtTime(420, now + 0.1);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.24);
        gain.gain.setValueAtTime(0.18 * master, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.25);
      } else if (type === 'graze') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(1760, now + 0.05);
        gain.gain.setValueAtTime(0.09 * master, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.055);
      } else if (type === 'blip') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
        gain.gain.setValueAtTime(0.09 * master, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.09);
      } else if (type === 'hit') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(35, now + 0.16);
        gain.gain.setValueAtTime(0.24 * master, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.17);
      } else if (type === 'slash') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(360, now);
        osc.frequency.exponentialRampToValueAtTime(60, now + 0.16);
        gain.gain.setValueAtTime(0.18 * master, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.17);
      } else if (type === 'magic') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(520, now);
        osc.frequency.exponentialRampToValueAtTime(1420, now + 0.28);
        gain.gain.setValueAtTime(0.14 * master, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.3);
      } else if (type === 'heal') {
        [440, 554.37, 659.25, 880].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.08);
          gain.gain.setValueAtTime(0.11 * master, now + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.3);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.08);
          osc.stop(now + idx * 0.08 + 0.35);
        });
      } else if (type === 'fanfare') {
        [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.06);
          gain.gain.setValueAtTime(0.14 * master, now + idx * 0.06);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.2);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.06);
          osc.stop(now + idx * 0.06 + 0.22);
        });
      } else if (type === 'roar') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(120, now);
        osc.frequency.linearRampToValueAtTime(240, now + 0.2);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.45);
        gain.gain.setValueAtTime(0.24 * master, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.46);
      }
    } catch {
      // audio fallback
    }
  };

  // Undertale-style Boss Voice Blip Synthesizer (每個 BOSS 開場說話專屬像素語音音色)
  const playBossVoiceBlip = (bossType: string, charStep: number = 0) => {
    if (!soundEnabled || soundVolume <= 0.01) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const pitchJitter = ((charStep * 17) % 5) * 9 - 18;

      if (bossType === 'harald_bluetooth') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(145 + pitchJitter, now);
      } else if (bossType === 'captain_vasa') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(110 + pitchJitter, now);
      } else if (bossType === 'sami_shaman') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(240 + pitchJitter * 1.4, now);
      } else if (bossType === 'vainamoinen') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(196 + pitchJitter * 1.2, now);
      } else if (bossType === 'harald_hardrada') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(125 + pitchJitter, now);
      } else {
        // Surtr deep volcanic bass voice
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(92 + pitchJitter * 0.8, now);
      }

      gain.gain.setValueAtTime(0.08 * soundVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.048);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.052);
    } catch {
      // ignore audio context restrictions
    }
  };

  // Procedural NPC Character Voice Synth (復古 JRPG 語音音色合成器，各角色音色各異)
  const playNpcVoiceBlip = (spriteType?: string, charStep: number = 0) => {
    if (!soundEnabled || soundVolume <= 0.01) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Pitch micro-jitter for organic retro talking effect
      const pitchJitter = ((charStep * 19) % 7) * 7 - 21;

      if (spriteType === 'scholar' || spriteType === 'elder' || spriteType === 'scholar_bellman') {
        // Deep erudite tone
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(175 + pitchJitter, now);
      } else if (spriteType === 'elf' || spriteType === 'sauna') {
        // High playful bell chime
        osc.type = 'sine';
        osc.frequency.setValueAtTime(540 + pitchJitter * 1.5, now);
      } else if (spriteType === 'captain' || spriteType === 'sailor' || spriteType === 'guard' || spriteType === 'shipwright') {
        // Crisp naval / warrior voice
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(210 + pitchJitter, now);
      } else if (spriteType === 'bard' || spriteType === 'poet' || spriteType === 'skald' || spriteType === 'skald_egill') {
        // Melodious acoustic harp tone
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(360 + pitchJitter * 1.2, now);
      } else if (spriteType === 'priestess' || spriteType === 'shaman' || spriteType === 'alchemist' || spriteType === 'sami') {
        // Ethereal mystical frequency
        osc.type = 'sine';
        osc.frequency.setValueAtTime(310 + pitchJitter * 1.3, now);
      } else {
        // Standard pleasant chime
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(280 + pitchJitter, now);
      }

      gain.gain.setValueAtTime(0.065 * soundVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.042);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.045);
    } catch {
      // audio context fallback
    }
  };

  // Helper to execute a chosen dialogue option
  const executeDialogueOption = (opt: DialogueOption) => {
    if (!activeStoryNpc) return;
    playRetroSound('blip');

    // Handle Courage changes if option has courageDelta
    if (opt.courageDelta) {
      setPlayerState((prev) => {
        const nextCourage = prev.courage + opt.courageDelta!;
        const updated = { ...prev, courage: nextCourage };
        saveGame(updated);
        return updated;
      });
      setCourageFeedback({
        delta: opt.courageDelta,
        text: opt.courageReaction || '勇氣值提升！',
      });
    }

    // Record player's choice in dialogue history
    setDialogueHistory((prev) => {
      if (prev.length === 0) return prev;
      const last = { ...prev[prev.length - 1], playerChoice: opt.label, courageDelta: opt.courageDelta };
      return [...prev.slice(0, prev.length - 1), last];
    });

    if (opt.action === 'claim_hidden_quest' && activeStoryNpc.hiddenQuest) {
      const hq = activeStoryNpc.hiddenQuest;
      setPlayerState((prev) => {
        const updated = {
          ...prev,
          unlockedHiddenQuests: prev.unlockedHiddenQuests.includes(hq.id)
            ? prev.unlockedHiddenQuests
            : [...prev.unlockedHiddenQuests, hq.id],
          exp: prev.exp + hq.rewardExp,
          gold: prev.gold + hq.rewardGold,
          activeBuff: hq.rewardBuff,
        };
        saveGame(updated);
        return updated;
      });
      setActiveStoryNpc(null);
      setCourageFeedback(null);
      setActiveEvent({
        title: `👑 隱藏任務達成：${hq.title}`,
        description: `獲得隱藏傳承獎勵：\n✨ 經驗值 +${hq.rewardExp} EXP\n🪙 金幣 +${hq.rewardGold} G\n🌟 獲得神聖戰鬥 Buff：【${hq.rewardBuff}】！`,
        icon: '👑',
      });
      return;
    }

    if (opt.action === 'learn_story_and_quest' || opt.action === 'claim_gift') {
      const npc = activeStoryNpc;
      const isFirstTime = !playerState.claimedNpcRewards.includes(npc.id);
      setPlayerState((prev) => {
        const updated = {
          ...prev,
          learnedStories: opt.action === 'learn_story_and_quest'
            ? prev.learnedStories.includes(currentChapter.id)
              ? prev.learnedStories
              : [...prev.learnedStories, currentChapter.id]
            : prev.learnedStories,
          claimedNpcRewards: isFirstTime
            ? [...prev.claimedNpcRewards, npc.id]
            : prev.claimedNpcRewards,
          exp: isFirstTime ? prev.exp + npc.rewardExp : prev.exp,
          gold: isFirstTime ? prev.gold + npc.rewardGold : prev.gold,
          activeBuff: npc.buffReward || prev.activeBuff,
        };
        saveGame(updated);
        return updated;
      });
      setActiveStoryNpc(null);
      setCourageFeedback(null);
      setActiveEvent({
        title: opt.action === 'learn_story_and_quest'
          ? `📜 主線歷史誓約解鎖！`
          : `🎁 獲贈【${npc.name.split(' ')[0]}】文化典故祝福！`,
        description: isFirstTime
          ? `已向【${npc.name.split(' ')[0]}】探明典故真相！\n\n獲得初次交流禮遇（僅限領取一次）：\n✨ 經驗值 +${npc.rewardExp} EXP\n🪙 金幣 +${npc.rewardGold} G\n🌟 獲得增益：${npc.buffReward || '無'}\n\n${opt.action === 'learn_story_and_quest' ? '通關進度更新：前往右下角 BOSS 舞台擊敗守護者即可解鎖下一國度！' : '歷史考據已深深刻入旅者手帳！'}`
          : `再次聆聽【${npc.name.split(' ')[0]}】的智慧！\n\n（初次獎勵已領取過，當前特殊增益常駐生效中：${npc.buffReward || '無'}）`,
        icon: npc.avatar,
      });
    } else if (opt.next) {
      setDialogueNodeKey(opt.next);
    } else {
      setActiveStoryNpc(null);
      setCourageFeedback(null);
    }
  };

  const skipStoryDialogueTypewriter = () => {
    if (!activeStoryNpc) return;
    const fullText =
      activeStoryNpc.dialogueTree[dialogueNodeKey]?.text || activeStoryNpc.dialogueTree.start.text || '';
    if (storyDialogueTimerRef.current) {
      clearTimeout(storyDialogueTimerRef.current);
      storyDialogueTimerRef.current = null;
    }
    setStoryDialogueTypedChars(fullText);
    setIsStoryDialogueTyping(false);
    playRetroSound('blip');
  };

  const skipRovingDialogueTypewriter = () => {
    if (!activeRovingNpc) return;
    const fullText = activeRovingNpc.dialogue || '';
    if (rovingDialogueTimerRef.current) {
      clearTimeout(rovingDialogueTimerRef.current);
      rovingDialogueTimerRef.current = null;
    }
    setRovingDialogueTypedChars(fullText);
    setIsRovingDialogueTyping(false);
    playRetroSound('blip');
  };

  // Story NPC Typewriter animation & character voice blips
  useEffect(() => {
    if (!activeStoryNpc) {
      setStoryDialogueTypedChars('');
      setIsStoryDialogueTyping(false);
      if (storyDialogueTimerRef.current) {
        clearTimeout(storyDialogueTimerRef.current);
        storyDialogueTimerRef.current = null;
      }
      return;
    }

    const fullText =
      activeStoryNpc.dialogueTree[dialogueNodeKey]?.text || activeStoryNpc.dialogueTree.start.text || '';

    // Add to dialogue backlog if not already recorded
    setDialogueHistory((prev) => {
      const isAlreadyRecorded = prev.length > 0 && prev[prev.length - 1].text === fullText;
      if (isAlreadyRecorded) return prev;
      return [
        ...prev,
        {
          id: `${activeStoryNpc.id}_${dialogueNodeKey}_${Date.now()}`,
          speaker: activeStoryNpc.name,
          title: activeStoryNpc.title,
          avatar: activeStoryNpc.avatar,
          text: fullText,
          timestamp: Date.now(),
        },
      ];
    });

    setSelectedOptionIndex(0);

    if (dialogueTextSpeed === 'instant') {
      setStoryDialogueTypedChars(fullText);
      setIsStoryDialogueTyping(false);
      return;
    }

    setIsStoryDialogueTyping(true);
    setStoryDialogueTypedChars('');

    let charIdx = 0;
    const typeNextChar = () => {
      if (charIdx >= fullText.length) {
        setIsStoryDialogueTyping(false);
        return;
      }

      charIdx += 1;
      setStoryDialogueTypedChars(fullText.slice(0, charIdx));
      setNpcTalkingTick((t) => (t + 1) % 100);

      const currentChar = fullText[charIdx - 1];
      if (currentChar && !/\s/.test(currentChar)) {
        if (dialogueTextSpeed === 'normal' || charIdx % 2 === 1) {
          playNpcVoiceBlip(activeStoryNpc.spriteType, charIdx);
        }
      }

      let delay = dialogueTextSpeed === 'fast' ? 12 : 28;
      if (currentChar === '，' || currentChar === ',' || currentChar === '、' || currentChar === '；') {
        delay = dialogueTextSpeed === 'fast' ? 70 : 160;
      } else if (currentChar === '。' || currentChar === '！' || currentChar === '？' || currentChar === '…' || currentChar === '\n') {
        delay = dialogueTextSpeed === 'fast' ? 130 : 280;
      }

      storyDialogueTimerRef.current = setTimeout(typeNextChar, delay);
    };

    typeNextChar();

    return () => {
      if (storyDialogueTimerRef.current) {
        clearTimeout(storyDialogueTimerRef.current);
        storyDialogueTimerRef.current = null;
      }
    };
  }, [activeStoryNpc?.id, dialogueNodeKey, dialogueTextSpeed]);

  // Roving NPC Typewriter animation & character voice blips
  useEffect(() => {
    if (!activeRovingNpc) {
      setRovingDialogueTypedChars('');
      setIsRovingDialogueTyping(false);
      if (rovingDialogueTimerRef.current) {
        clearTimeout(rovingDialogueTimerRef.current);
        rovingDialogueTimerRef.current = null;
      }
      return;
    }

    const fullText = activeRovingNpc.dialogue || '';

    if (dialogueTextSpeed === 'instant') {
      setRovingDialogueTypedChars(fullText);
      setIsRovingDialogueTyping(false);
      return;
    }

    setIsRovingDialogueTyping(true);
    setRovingDialogueTypedChars('');

    let charIdx = 0;
    const typeNextChar = () => {
      if (charIdx >= fullText.length) {
        setIsRovingDialogueTyping(false);
        return;
      }

      charIdx += 1;
      setRovingDialogueTypedChars(fullText.slice(0, charIdx));

      const currentChar = fullText[charIdx - 1];
      if (currentChar && !/\s/.test(currentChar)) {
        if (dialogueTextSpeed === 'normal' || charIdx % 2 === 1) {
          playNpcVoiceBlip(activeRovingNpc.spriteType, charIdx);
        }
      }

      let delay = dialogueTextSpeed === 'fast' ? 12 : 28;
      if (currentChar === '，' || currentChar === ',' || currentChar === '、' || currentChar === '；') {
        delay = dialogueTextSpeed === 'fast' ? 70 : 160;
      } else if (currentChar === '。' || currentChar === '！' || currentChar === '？' || currentChar === '…' || currentChar === '\n') {
        delay = dialogueTextSpeed === 'fast' ? 130 : 280;
      }

      rovingDialogueTimerRef.current = setTimeout(typeNextChar, delay);
    };

    typeNextChar();

    return () => {
      if (rovingDialogueTimerRef.current) {
        clearTimeout(rovingDialogueTimerRef.current);
        rovingDialogueTimerRef.current = null;
      }
    };
  }, [activeRovingNpc?.id, dialogueTextSpeed]);

  // Typewriter animation & Undertale voice blips when BOSS speaks at the start of battle (BOSS 開場逐字說話與語音音效)
  useEffect(() => {
    if (!isOpen || activeTab !== 'battle' || battlePhase !== 'intro_cutscene') return;

    const script = getBossCutsceneScript(currentChapter.boss.bossType);
    const currentCue = script.lines[cutsceneStep] || script.lines[0];
    const fullText = currentCue?.text || '';

    cutsceneCharIdxRef.current = 0;
    setCutsceneCharIdx(0);
    setBossSpeech(fullText);

    let idx = 0;
    const timer = setInterval(() => {
      idx += 1;
      cutsceneCharIdxRef.current = idx;
      setCutsceneCharIdx(idx);
      if (idx % 2 === 1 && idx <= fullText.length) {
        playBossVoiceBlip(currentChapter.boss.bossType, idx);
      }
      if (idx >= fullText.length) {
        clearInterval(timer);
      }
    }, 32);

    return () => clearInterval(timer);
  }, [isOpen, activeTab, battlePhase, cutsceneStep, currentChapter.boss.bossType]);

  // Keyboard controls listener
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      keysDownRef.current[k] = true;

      // Handle active Story NPC dialogue interactions
      if (activeStoryNpc) {
        if (isDialogueHistoryOpen) {
          if (k === 'escape' || k === 'h') {
            setIsDialogueHistoryOpen(false);
            e.preventDefault();
          }
          return;
        }

        const currentOptions = activeStoryNpc.dialogueTree[dialogueNodeKey]?.options || [];

        // Space or Enter: Skip typing or confirm currently selected option
        if (k === ' ' || k === 'enter') {
          if (isStoryDialogueTyping) {
            skipStoryDialogueTypewriter();
            e.preventDefault();
            return;
          } else if (currentOptions.length > 0 && currentOptions[selectedOptionIndex]) {
            executeDialogueOption(currentOptions[selectedOptionIndex]);
            e.preventDefault();
            return;
          }
        }

        // Numeric keys 1~9 to pick option directly
        const numKey = parseInt(k, 10);
        if (!isNaN(numKey) && numKey >= 1 && numKey <= currentOptions.length) {
          executeDialogueOption(currentOptions[numKey - 1]);
          e.preventDefault();
          return;
        }

        // Arrow navigation for choices
        if (k === 'arrowdown' || k === 's') {
          setSelectedOptionIndex((prev) => (prev + 1) % Math.max(1, currentOptions.length));
          playRetroSound('blip');
          e.preventDefault();
          return;
        }
        if (k === 'arrowup' || k === 'w') {
          setSelectedOptionIndex((prev) => (prev - 1 + currentOptions.length) % Math.max(1, currentOptions.length));
          playRetroSound('blip');
          e.preventDefault();
          return;
        }

        // H key to toggle dialogue backlog
        if (k === 'h') {
          setIsDialogueHistoryOpen((prev) => !prev);
          playRetroSound('blip');
          e.preventDefault();
          return;
        }

        // Escape to exit NPC conversation
        if (k === 'escape') {
          setActiveStoryNpc(null);
          setCourageFeedback(null);
          e.preventDefault();
          return;
        }
      }

      // Handle active Roving Historical NPC dialogue interactions
      if (activeRovingNpc) {
        if (k === ' ' || k === 'enter') {
          if (isRovingDialogueTyping) {
            skipRovingDialogueTypewriter();
            e.preventDefault();
            return;
          }
        }
        if (k === 'escape') {
          setActiveRovingNpc(null);
          e.preventDefault();
          return;
        }
      }

      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'w', 'a', 's', 'd', ' '].includes(k)) {
        e.preventDefault();
      }

      // Advance Pre-Battle Theatrical Cutscene with Spacebar or Enter
      if ((k === ' ' || k === 'enter') && battlePhase === 'intro_cutscene') {
        handleAdvanceBossCutscene();
        return;
      }

      // Spacebar / W / ArrowUp during dodge phase: Flap upward in Flappy Bird Corridor Mode OR trigger Extreme Counter!
      if ((k === ' ' || k === 'w' || k === 'arrowup') && battlePhase === 'dodge') {
        flappyVyRef.current = -3.7;
        flappyFlapCooldownRef.current = 10;
        if (k === ' ' && counterWindowTimerRef.current > 0) {
          handleTriggerExtremeCounter();
        }
        return;
      }
      if (k === 'c' && battlePhase === 'dodge') {
        handleTriggerExtremeCounter();
        return;
      }

      // Spacebar for Undertale QTE Strike Bar timing
      if (k === ' ' && battlePhase === 'strike_bar' && !strikeDoneRef.current) {
        handleConfirmStrike();
        return;
      }

      // Spacebar in menu phase triggers Runic Strike directly
      if (k === ' ' && battlePhase === 'menu') {
        handleUndertaleAction('fight');
        return;
      }

      // E or Space to trigger nearby BOSS battle or NPC on World Map
      if ((k === 'e' || k === 'enter' || k === ' ') && activeTab === 'world' && !activeStoryNpc && !activeRovingNpc) {
        const bossX = 1200 - 150;
        const bossY = 700 - 120;
        const distBoss = Math.hypot(playerPosRef.current.x - bossX, playerPosRef.current.y - bossY);
        if (distBoss < 75) {
          startUndertaleBossBattle();
          return;
        }

        const chapterNpcs = PRIMARY_STORY_NPCS.filter((n) => n.chapterId === currentChapter.id);
        const currentShop = NORDIC_SHOPS_CONFIG[currentChapter.id];
        if (currentShop && Math.hypot(playerPosRef.current.x - currentShop.x, playerPosRef.current.y - currentShop.y) < 65) {
          setActiveShopModal(currentShop);
          playRetroSound('blip');
          return;
        }

        // Check Town Interactive Buildings
        const townBuildings = NORDIC_BUILDINGS_CONFIG[currentChapter.id] || [];
        const nearBuilding = townBuildings.find((b) => Math.hypot(playerPosRef.current.x - b.x, playerPosRef.current.y - b.y) < 65);
        if (nearBuilding) {
          setActiveBuildingModal(nearBuilding);
          playRetroSound('blip');
          return;
        }

        // Check Interactive Nordic Animals
        const chapterAnimals = NORDIC_INTERACTIVE_ANIMALS.filter((a) => a.chapterId === currentChapter.id);
        const nearAnimal = chapterAnimals.find((a) => Math.hypot(playerPosRef.current.x - a.x, playerPosRef.current.y - a.y) < 62);
        if (nearAnimal) {
          setActiveAnimalModal(nearAnimal);
          setAnimalToast(null);
          playRetroSound('blip');
          return;
        }

        const nearNpc = chapterNpcs.find((n) => Math.hypot(playerPosRef.current.x - n.x, playerPosRef.current.y - n.y) < 60);
        if (nearNpc) {
          setActiveStoryNpc(nearNpc);
          setDialogueNodeKey('start');
          setSelectedOptionIndex(0);
          playRetroSound('blip');
          return;
        }
      }

      // Q key for Bluetooth radio glitch clearance
      if (k === 'q' && bluetoothGlitchRef.current) {
        handleClearBluetoothGlitch();
      }

      if (k === 'f') {
        setIsFullscreen((prev) => !prev);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysDownRef.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [
    isOpen,
    activeTab,
    battlePhase,
    cutsceneStep,
    activeStoryNpc,
    activeRovingNpc,
    isStoryDialogueTyping,
    isRovingDialogueTyping,
    dialogueNodeKey,
    selectedOptionIndex,
    isDialogueHistoryOpen,
    currentChapter.id,
  ]);

  // Synchronize 8-Bit Chiptune BGM across tabs, battle state, boss-specific themes, and 20% HP Berserk Tempo Acceleration
  useEffect(() => {
    if (!isOpen) {
      rpgBgmEngine.setTempoMultiplier(1.0);
      rpgBgmEngine.stop();
      return;
    }

    if (activeTab === 'world' || activeTab === 'quests' || activeTab === 'logbook' || activeTab === 'buffs') {
      rpgBgmEngine.setTempoMultiplier(1.0);
      rpgBgmEngine.startTrack('nordic_explore');
      setCurrentBgmTrack('nordic_explore');
    } else if (activeTab === 'battle') {
      const diffHpMult = DIFFICULTY_CONFIGS[battleDifficultyRef.current]?.hpMult || 1.0;
      const scaledMaxHp = Math.round(currentChapter.boss.maxHp * diffHpMult);
      const isBerserk = battleBossHp > 0 && battleBossHp <= scaledMaxHp * 0.2 && battlePhase !== 'intro_cutscene';
      const isP2 = battleBossHp > 0 && battleBossHp <= scaledMaxHp * 0.5 && battlePhase !== 'intro_cutscene';
      const bossDedicatedTrack = getBossBgmTrack(currentChapter.boss.bossType);

      if (battlePhase === 'victory') {
        rpgBgmEngine.setTempoMultiplier(1.0);
        rpgBgmEngine.startTrack('victory_fanfare');
        setCurrentBgmTrack('victory_fanfare');
      } else if (inBattle) {
        // 當 BOSS HP 降至 20% 以下時觸發『狂暴模式』，加快背景音樂播放速度 (1.38x)
        if (isBerserk) {
          rpgBgmEngine.setTempoMultiplier(1.38);
        } else if (isP2) {
          rpgBgmEngine.setTempoMultiplier(1.12);
        } else {
          rpgBgmEngine.setTempoMultiplier(1.0);
        }
        const activeTrack = battleDifficultyRef.current === 'lunatic' ? 'boss_ragnarok_lunatic' : bossDedicatedTrack;
        rpgBgmEngine.startTrack(activeTrack);
        setCurrentBgmTrack(activeTrack);
      } else {
        rpgBgmEngine.setTempoMultiplier(1.0);
        rpgBgmEngine.startTrack('nordic_explore');
        setCurrentBgmTrack('nordic_explore');
      }
    }
  }, [isOpen, activeTab, inBattle, battlePhase, battleBossHp, currentChapter.boss.maxHp, currentChapter.boss.bossType]);


  // Fullscreen Handler
  const toggleFullscreen = () => {
    setIsFullscreen((prev) => !prev);
    try {
      if (!isFullscreen && document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else if (isFullscreen && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    } catch {
      // iframe restriction fallback
    }
  };

  // ==========================================
  // UNDERTALE BULLET DODGE PHASE ANIMATION LOOP
  // ==========================================
  useEffect(() => {
    if (!isOpen || activeTab !== 'battle') return;

    const canvas = battleCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (battlePhase === 'dodge' && battleTickRef.current === 0) {
      battleTickRef.current = 0;
    }

    const renderUndertaleBattle = () => {
      battleTickRef.current++;
      const bTick = battleTickRef.current;
      const width = canvas.width;
      const height = canvas.height;

      const isBossHit = bossHitFlashRef.current > 0;
      const diffHpMult = DIFFICULTY_CONFIGS[battleDifficultyRef.current]?.hpMult || 1.0;
      const scaledMaxHp = Math.round(currentChapter.boss.maxHp * diffHpMult);
      const bossForm = getBossForm(battleBossHp, scaledMaxHp);
      const formDef = (BOSS_FORMS_CONFIG[currentChapter.boss.bossType] || BOSS_FORMS_CONFIG.harald_bluetooth)[bossForm];
      const isPhase2 = bossForm >= 2;
      const isPhase3 = bossForm === 3;
      // 狂暴模式 (Berserk Mode)：當 BOSS HP 降至 20% 以下或形態 III 時觸發！
      const isBerserkMode = isPhase3 || (battleBossHp > 0 && battleBossHp <= scaledMaxHp * 0.2 && battlePhase !== 'intro_cutscene' && battlePhase !== 'victory');

      // 檢查是否跨過血量閾值觸發形態轉換演出 (70% 或 35% HP)
      const lastForm = lastAnnouncedFormRef.current[currentChapter.boss.id] || 1;
      if (bossForm > lastForm && battlePhase !== 'intro_cutscene' && inBattle) {
        lastAnnouncedFormRef.current[currentChapter.boss.id] = bossForm;
        formTransitionBannerRef.current = {
          form: bossForm,
          name: formDef.formName,
          badge: formDef.formBadge,
          quote: formDef.transformQuote,
          frames: 130,
        };
        screenShakeRef.current = 24;
        bossHitFlashRef.current = 26;
        playRetroSound('roar');
        setBossSpeech(formDef.transformQuote);
      }

      // ==========================================
      // UNDERTALE ARENA BOX DYNAMIC MOVEMENT (彈幕框移動物理)
      // ==========================================
      const baseBx = 270;
      const baseBy = 130;
      const baseBw = 320;
      const baseBh = 180;

      let targetBx = baseBx;
      let targetBy = baseBy;
      let targetBw = baseBw;
      let targetBh = baseBh;
      let targetTilt = 0;

      if (battlePhase === 'dodge') {
        const bossCycleLen = isBerserkMode ? 200 : 240;
        const cycleTick = bTick % bossCycleLen;
        // 依玩家要求：彈幕框平時保持完全靜止穩定，不持續晃動！
        // 僅在【特殊攻擊】階段 (cycleTick >= 165 && cycleTick < 205) 觸發專屬位移與傾斜
        const isSpecialArenaShiftActive = cycleTick >= 165 && cycleTick < 205;

        if (isSpecialArenaShiftActive) {
          const bType = currentChapter.boss.bossType;
          const shiftProgress = (cycleTick - 165) / 40; // 0 -> 1
          const shiftWave = Math.sin(shiftProgress * Math.PI); // Smooth ease-in ease-out

          if (bType === 'captain_vasa') {
            // 瓦薩號幽靈狂濤海嘯：戰艦側舷隨巨浪平滑傾斜
            targetTilt = shiftWave * 0.055;
            targetBy = baseBy + shiftWave * 16;
          } else if (bType === 'harald_bluetooth') {
            // 藍牙王電磁脈衝推擠：水平平滑偏移
            targetBx = baseBx + shiftWave * 32;
          } else if (bType === 'sami_shaman') {
            // 薩米暴風雪極地沉降：微幅下沉
            targetBy = baseBy + shiftWave * 20;
          } else if (bType === 'vainamoinen') {
            // 琴聖萬奈摩寧岩洞聲學共鳴：框體平滑呼吸縮放
            targetBw = baseBw + shiftWave * 24;
            targetBh = baseBh + shiftWave * 12;
          } else if (bType === 'harald_hardrada') {
            // 無情者撼地重踏：地脈上下微震
            targetBy = baseBy + Math.sin(shiftProgress * Math.PI * 4) * 8;
          } else {
            // 蘇爾特爾終焉板塊撕裂：斜向受力偏移
            targetBx = baseBx + shiftWave * 36;
            targetTilt = shiftWave * 0.035;
          }
        }
      }

      const prevBoxX = boxMotionRef.current.x;
      const prevBoxY = boxMotionRef.current.y;
      boxMotionRef.current.x += (targetBx - boxMotionRef.current.x) * 0.15;
      boxMotionRef.current.y += (targetBy - boxMotionRef.current.y) * 0.15;
      boxMotionRef.current.w += (targetBw - boxMotionRef.current.w) * 0.15;
      boxMotionRef.current.h += (targetBh - boxMotionRef.current.h) * 0.15;
      boxMotionRef.current.tilt += (targetTilt - boxMotionRef.current.tilt) * 0.12;

      const deltaBoxX = boxMotionRef.current.x - prevBoxX;
      const deltaBoxY = boxMotionRef.current.y - prevBoxY;

      // Apply arena inertia to soul during dodge phase
      if (battlePhase === 'dodge') {
        soulPosRef.current.x += deltaBoxX;
        soulPosRef.current.y += deltaBoxY;
      }

      ctx.save();

      // Amplified Screen Shake on Boss Hit, Player Hit, or Berserk Tremor
      if (screenShakeRef.current > 0) {
        const shake = screenShakeRef.current;
        ctx.translate((Math.random() - 0.5) * shake * 1.35, (Math.random() - 0.5) * shake * 1.15);
        screenShakeRef.current = Math.max(0, screenShakeRef.current - 1.0);
      } else if (isBerserkMode && battlePhase === 'dodge' && bTick % 4 === 0) {
        ctx.translate((Math.random() - 0.5) * 2.2, (Math.random() - 0.5) * 1.6);
      }

      // Deep Nordic Night Background — shifts to Ominous Dark Crimson in Berserk Mode (< 20% HP)!
      if (isBerserkMode) {
        const crimsonPulse = Math.sin(bTick * 0.14) * 0.08 + 0.92;
        const bgGrad = ctx.createRadialGradient(width / 2, 90, 30, width / 2, height / 2, width * 0.7);
        bgGrad.addColorStop(0, `rgba(69, 10, 18, ${crimsonPulse})`);
        bgGrad.addColorStop(0.55, '#220509');
        bgGrad.addColorStop(1, '#110205');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        // Rising Dark-Red Blood Embers across stage during Berserk Mode
        ctx.fillStyle = 'rgba(244, 63, 94, 0.55)';
        for (let em = 0; em < 24; em++) {
          const ex = (em * 39 + Math.sin(bTick * 0.05 + em) * 18) % width;
          const ey = height - ((bTick * 1.8 + em * 29) % height);
          ctx.fillRect(ex, ey, 2.5, 2.5);
        }
      } else {
        ctx.fillStyle = '#060911';
        ctx.fillRect(0, 0, width, height);
      }

      // Full-stage Strobe Impact Flash when Boss takes heavy damage
      if (bossHitFlashRef.current > 10) {
        ctx.fillStyle = bossHitFlashRef.current % 2 === 0 ? 'rgba(255, 255, 255, 0.18)' : 'rgba(244, 63, 94, 0.16)';
        ctx.fillRect(0, 0, width, height);
      }

      // Starry background dust & subtle Nordic grid
      ctx.fillStyle = isBerserkMode ? 'rgba(253, 164, 175, 0.45)' : 'rgba(255, 255, 255, 0.35)';
      for (let s = 0; s < 30; s++) {
        ctx.fillRect((s * 31 + bTick * (isBerserkMode ? 0.65 : 0.3)) % width, (s * 23) % height, 1.5, 1.5);
      }

      // 1. Update 16-bit Boss Patrol Movement & Animation State Machine
      if (battlePhase === 'dodge') {
        const moveSpd = isBerserkMode ? 2.45 : isPhase2 ? 1.85 : 1.15;
        bossPatrolRef.current.x += bossPatrolRef.current.vx * moveSpd;
        if (bossPatrolRef.current.x > 68) {
          bossPatrolRef.current.x = 68;
          bossPatrolRef.current.vx = -1;
        } else if (bossPatrolRef.current.x < -68) {
          bossPatrolRef.current.x = -68;
          bossPatrolRef.current.vx = 1;
        }
        bossPatrolRef.current.y = Math.sin(bTick * (isBerserkMode ? 0.14 : 0.08)) * (isBerserkMode ? 8 : 6);
      } else {
        // Smoothly return toward center during cutscene/strike
        bossPatrolRef.current.x *= 0.9;
        bossPatrolRef.current.y = Math.sin(bTick * 0.06) * 3;
      }

      let bShakeX = 0;
      let bShakeY = 0;
      if (bossShakeRef.current > 0) {
        bShakeX = (Math.random() - 0.5) * bossShakeRef.current * 2.2;
        bShakeY = (Math.random() - 0.5) * bossShakeRef.current * 1.5;
        bossShakeRef.current = Math.max(0, bossShakeRef.current - 0.8);
      }

      const bossX = (battlePhase === 'intro_cutscene' ? width / 2 - 90 : width / 2) + bossPatrolRef.current.x + bShakeX;
      const bossY = (battlePhase === 'intro_cutscene' ? 84 : 68) + bossPatrolRef.current.y + bShakeY;

      // Determine active 16-bit Boss Animation State
      let currentAnimState: BossAnimState = 'idle';
      if (isBossHit) {
        currentAnimState = 'hit_recoil';
      } else if (battlePhase === 'intro_cutscene') {
        const script = getBossCutsceneScript(currentChapter.boss.bossType);
        const cue = script.lines[cutsceneStep] || script.lines[0];
        // While typing out characters, force 'dialogue' mouth movement + gesture!
        if (cutsceneCharIdxRef.current < (cue?.text?.length || 0)) {
          currentAnimState = 'dialogue';
        } else {
          currentAnimState = cue?.pose || 'dialogue';
        }
      } else if (bossAnimOverrideRef.current) {
        currentAnimState = bossAnimOverrideRef.current;
      } else if (battlePhase === 'dodge') {
        if (bTick % (isBerserkMode ? 24 : 36) < 12) {
          currentAnimState = 'attack_cast';
        } else if (isPhase2 || isBerserkMode) {
          currentAnimState = 'enrage';
        } else {
          currentAnimState = 'move';
        }
      } else if (isPhase2 || isBerserkMode) {
        currentAnimState = 'enrage';
      }

      // Render Impact Explosion Particles & Expanding Shockwave Rings on Boss
      impactParticlesRef.current.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.032;
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 12;
        ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
        ctx.restore();
      });
      impactParticlesRef.current = impactParticlesRef.current.filter((p) => p.life > 0);

      // Hit Shockwave Ring when Boss is struck
      if (bossHitFlashRef.current > 0) {
        const ringProg = (22 - bossHitFlashRef.current) / 22;
        ctx.save();
        ctx.strokeStyle = `rgba(251, 191, 36, ${Math.max(0, 1 - ringProg)})`;
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.arc(bossX, bossY, 18 + ringProg * 75, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // Phase 2 & Berserk (<20% HP) Enrage Flaming Shockwaves around Boss
      if (isPhase2 || isBerserkMode) {
        const ringSpeed = isBerserkMode ? 2.4 : 1.6;
        const shockwaveRad = 32 + ((bTick * ringSpeed) % 38);
        const shockwaveAlpha = 1 - ((bTick * ringSpeed) % 38) / 38;
        ctx.save();
        ctx.strokeStyle = isBerserkMode
          ? `rgba(225, 29, 72, ${shockwaveAlpha * 0.95})`
          : `rgba(244, 63, 94, ${shockwaveAlpha * 0.75})`;
        ctx.lineWidth = isBerserkMode ? 3.5 : 2.5;
        ctx.beginPath();
        ctx.arc(bossX, bossY, shockwaveRad, 0, Math.PI * 2);
        ctx.stroke();

        if (isBerserkMode) {
          ctx.strokeStyle = `rgba(251, 191, 36, ${shockwaveAlpha * 0.75})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(bossX, bossY, shockwaveRad * 0.7, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Inner glowing electric sparks
        for (let sp = 0; sp < (isBerserkMode ? 8 : 5); sp++) {
          const spAng = (bTick * (isBerserkMode ? 0.14 : 0.08)) + (sp * Math.PI * 2) / (isBerserkMode ? 8 : 5);
          const sx = bossX + Math.cos(spAng) * 34;
          const sy = bossY + Math.sin(spAng) * 24;
          ctx.fillStyle = sp % 2 === 0 ? '#f59e0b' : '#f43f5e';
          ctx.fillRect(sx - 1.5, sy - 1.5, 3.5, 3.5);
        }
        ctx.restore();
      }

      // Theatrical Spotlight Beam during Pre-Battle Cutscene
      if (battlePhase === 'intro_cutscene') {
        ctx.save();
        const spotGrad = ctx.createRadialGradient(bossX, bossY, 10, bossX, bossY + 40, 170);
        spotGrad.addColorStop(0, 'rgba(56, 189, 248, 0.25)');
        spotGrad.addColorStop(0.5, 'rgba(245, 158, 11, 0.08)');
        spotGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = spotGrad;
        ctx.beginPath();
        ctx.moveTo(bossX - 50, 0);
        ctx.lineTo(bossX + 50, 0);
        ctx.lineTo(bossX + 165, height);
        ctx.lineTo(bossX - 165, height);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }

      drawPixelBossModel(
        ctx,
        currentChapter.boss.bossType,
        bossX,
        bossY,
        bTick,
        battlePhase === 'intro_cutscene' ? 1.42 : isBerserkMode ? 1.32 : 1.25,
        isBossHit,
        currentAnimState,
        0,
        bossForm
      );
      if (bossHitFlashRef.current > 0) bossHitFlashRef.current--;

      // Visual Boss Seal Bar (No raw "HP" text — pure Undertale visual gauge above Boss + 20% Berserk Threshold Marker)
      if (battlePhase !== 'intro_cutscene') {
        const gaugeW = 140;
        const gaugeH = 6;
        const gaugeX = bossX - gaugeW / 2;
        const gaugeY = bossY - 46;
        const hpRatio = Math.max(0, Math.min(1, battleBossHp / scaledMaxHp));
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(gaugeX, gaugeY, gaugeW, gaugeH);
        ctx.fillStyle = isBerserkMode
          ? (bTick % 6 < 3 ? '#e11d48' : '#fbbf24')
          : isPhase2
          ? '#f43f5e'
          : '#22c55e';
        ctx.fillRect(gaugeX, gaugeY, gaugeW * hpRatio, gaugeH);
        // 20% Berserk threshold tick mark on Boss gauge
        ctx.fillStyle = '#fde047';
        ctx.fillRect(gaugeX + gaugeW * 0.2, gaugeY - 1, 1.5, gaugeH + 2);
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(gaugeX, gaugeY, gaugeW, gaugeH);

        if (isBerserkMode) {
          ctx.font = 'bold 9px monospace';
          ctx.fillStyle = '#fda4af';
          ctx.textAlign = 'center';
          ctx.fillText('🩸 BERSERK MODE (彈幕 1.5x · BGM 加速)', bossX, gaugeY - 4);
        }
      }

      // 2. Boss Speech Bubble (Hidden during active dodge phase to keep the arena clean and uncluttered)
      if (bossSpeech && battlePhase !== 'intro_cutscene' && battlePhase !== 'dodge') {
        const bubbleX = Math.min(width - 260, bossX + 45);
        const bubbleY = Math.max(10, bossY - 35);
        ctx.fillStyle = isPhase2 ? '#fff1f2' : '#ffffff';
        ctx.strokeStyle = isPhase2 ? '#e11d48' : '#000000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(bubbleX, bubbleY, 250, 48, [10]);
        ctx.fill();
        ctx.stroke();

        // Speech bubble tail
        ctx.fillStyle = isPhase2 ? '#fff1f2' : '#ffffff';
        ctx.beginPath();
        ctx.moveTo(bubbleX, bubbleY + 16);
        ctx.lineTo(bubbleX - 12, bubbleY + 22);
        ctx.lineTo(bubbleX, bubbleY + 28);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = isPhase2 ? '#e11d48' : '#000000';
        ctx.stroke();

        ctx.font = 'bold 11px sans-serif';
        ctx.fillStyle = isPhase2 ? '#9f1239' : '#0f172a';
        ctx.textAlign = 'left';
        ctx.fillText(bossSpeech.slice(0, 27), bubbleX + 12, bubbleY + 20);
        if (bossSpeech.length > 27) {
          ctx.fillText(bossSpeech.slice(27, 54), bubbleX + 12, bubbleY + 36);
        }
      }

      // 2.2 PRE-BATTLE THEATRICAL CUTSCENE STAGE (BOSS 開打前說話演出：頭頂對話氣泡 + 雙框劇場台詞)
      if (battlePhase === 'intro_cutscene') {
        const script = getBossCutsceneScript(currentChapter.boss.bossType);
        const currentCue = script.lines[cutsceneStep] || script.lines[0];
        const fullText = currentCue?.text || '';
        const typedText = fullText.slice(0, Math.min(fullText.length, cutsceneCharIdxRef.current));
        const isTyping = cutsceneCharIdxRef.current < fullText.length;

        // (A) Undertale Comic Speech Bubble right next to Boss's head!
        const sbX = bossX + 52;
        const sbY = Math.max(14, bossY - 54);
        const sbW = 345;
        const sbH = 92;

        ctx.save();
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.roundRect(sbX, sbY, sbW, sbH, [12]);
        ctx.fill();
        ctx.stroke();

        // Comic speech bubble tail pointing to Boss's mouth
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(sbX, sbY + 32);
        ctx.lineTo(sbX - 18, sbY + 42);
        ctx.lineTo(sbX, sbY + 50);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Speaker badge inside comic bubble
        ctx.font = 'bold 11px monospace';
        ctx.fillStyle = '#be123c';
        ctx.textAlign = 'left';
        ctx.fillText(`💬 ${script.speaker.split(' ')[0]}（開場宣言 ${cutsceneStep + 1}/${script.lines.length}）`, sbX + 14, sbY + 20);

        // Typewriter lines inside comic bubble
        ctx.font = 'bold 12px sans-serif';
        ctx.fillStyle = '#0f172a';
        const sbLine1 = typedText.slice(0, 26);
        const sbLine2 = typedText.slice(26, 52);
        const sbLine3 = typedText.slice(52, 82);
        ctx.fillText(sbLine1 + (isTyping && typedText.length <= 26 ? '▌' : ''), sbX + 14, sbY + 42);
        if (sbLine2) ctx.fillText(sbLine2 + (isTyping && typedText.length > 26 && typedText.length <= 52 ? '▌' : ''), sbX + 14, sbY + 61);
        if (sbLine3) ctx.fillText(sbLine3 + (isTyping && typedText.length > 52 ? '▌' : ''), sbX + 14, sbY + 80);
        ctx.restore();

        // (B) Undertale-style double-bordered dialogue theatre box at bottom of stage
        const dlgX = 70;
        const dlgY = 172;
        const dlgW = width - 140;
        const dlgH = 148;

        ctx.fillStyle = 'rgba(3, 7, 18, 0.95)';
        ctx.fillRect(dlgX, dlgY, dlgW, dlgH);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3.5;
        ctx.strokeRect(dlgX, dlgY, dlgW, dlgH);
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 1.2;
        ctx.strokeRect(dlgX + 5, dlgY + 5, dlgW - 10, dlgH - 10);

        // Stage Action Cue Banner (演出動作提示)
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(dlgX + 18, dlgY - 13, 460, 24);
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(dlgX + 18, dlgY - 13, 460, 24);
        ctx.font = 'bold 11px monospace';
        ctx.fillStyle = '#67e8f9';
        ctx.textAlign = 'left';
        ctx.fillText(`🎭 ${currentCue.stageEffect}`, dlgX + 28, dlgY + 3);

        // Step Progress Badge
        ctx.font = 'bold 11px monospace';
        ctx.fillStyle = '#fbbf24';
        ctx.textAlign = 'right';
        ctx.fillText(`ACT ${cutsceneStep + 1} / ${script.lines.length}`, dlgX + dlgW - 20, dlgY + 26);

        // Speaker Name & Title
        ctx.font = 'bold 14px serif';
        ctx.fillStyle = '#fde047';
        ctx.textAlign = 'left';
        ctx.fillText(`【${script.speaker}】 — ${script.title}`, dlgX + 22, dlgY + 34);

        // Dialogue Lines with crisp typewriter spacing
        ctx.font = 'bold 13px sans-serif';
        ctx.fillStyle = '#f8fafc';
        const line1 = typedText.slice(0, 42);
        const line2 = typedText.slice(42, 84);
        const line3 = typedText.slice(84, 130);
        ctx.fillText(`* ${line1}${isTyping && typedText.length <= 42 ? '▌' : ''}`, dlgX + 24, dlgY + 64);
        if (line2) ctx.fillText(`  ${line2}${isTyping && typedText.length > 42 && typedText.length <= 84 ? '▌' : ''}`, dlgX + 24, dlgY + 88);
        if (line3) ctx.fillText(`  ${line3}${isTyping && typedText.length > 84 ? '▌' : ''}`, dlgX + 24, dlgY + 112);

        // Pulsing Continue Prompt
        const blink = Math.sin(bTick * 0.18) > 0;
        ctx.font = 'bold 11px monospace';
        ctx.fillStyle = blink ? '#34d399' : '#94a3b8';
        ctx.textAlign = 'right';
        ctx.fillText(
          isTyping
            ? '🔊 BOSS 正在說話… 按 [SPACE] 或點擊立即顯示整句'
            : cutsceneStep < script.lines.length - 1
            ? '▼ 按 [SPACE] 或點擊繼續下一句開場白'
            : '⚔️ 按 [SPACE] 或點擊正式展開北歐地標彈幕決戰！',
          dlgX + dlgW - 22,
          dlgY + dlgH - 14
        );
      }

      // 2.5 Draw Slash Animation & Floating Damage Numbers on Boss
      if (slashAnimRef.current && slashAnimRef.current.life > 0) {
        const sa = slashAnimRef.current;
        ctx.save();
        ctx.strokeStyle = sa.isCrit ? '#fbbf24' : '#f43f5e';
        ctx.lineWidth = sa.isCrit ? 6 : 4;
        ctx.shadowColor = sa.isCrit ? '#f59e0b' : '#e11d48';
        ctx.shadowBlur = 18;
        ctx.beginPath();
        const prog = 1 - sa.life;
        const sLen = 80;
        ctx.moveTo(bossX - sLen * prog, bossY - (sLen * 0.7) * prog);
        ctx.lineTo(bossX + sLen * prog, bossY + (sLen * 0.7) * prog);
        ctx.stroke();

        ctx.font = sa.isCrit ? 'bold 24px monospace' : 'bold 20px monospace';
        ctx.fillStyle = sa.isCrit ? '#fbbf24' : '#ffffff';
        ctx.textAlign = 'center';
        ctx.shadowBlur = 10;
        ctx.fillText(sa.isCrit ? `⚡ CRIT! -${sa.damage}` : `-${sa.damage}`, bossX, bossY - 32 - prog * 28);
        ctx.restore();
        sa.life -= 0.045;
      }

      // 3. Undertale Battle Box: Strike Bar Phase (盧恩反擊波段)
      if (battlePhase === 'strike_bar') {
        const { x: bx, y: by, w: bw, h: bh } = boxBounds;

        ctx.fillStyle = '#05070f';
        ctx.fillRect(bx, by, bw, bh);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3.5;
        ctx.strokeRect(bx, by, bw, bh);

        // Reticle Title
        ctx.font = 'bold 12px monospace';
        ctx.fillStyle = '#fde047';
        ctx.textAlign = 'center';
        ctx.fillText('⚡【北歐盧恩共鳴斬】對準核心紅心釋放破擊！', bx + bw / 2, by + 24);

        // Horizontal Strike Bar
        const barW = 280;
        const barH = 50;
        const barX = bx + (bw - barW) / 2;
        const barY = by + 42;

        ctx.fillStyle = '#0f172a';
        ctx.fillRect(barX, barY, barW, barH);
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 2;
        ctx.strokeRect(barX, barY, barW, barH);

        // Target Zones (Courage widens perfect critical window!)
        const centerTargetX = barX + barW / 2;
        const courageTol = Math.min(24, Math.floor(playerState.courage / 3.5));
        const perfectW = 24 + courageTol;
        const greatW = 72 + courageTol;

        // Great Zone (cyan/teal)
        ctx.fillStyle = 'rgba(14, 165, 233, 0.35)';
        ctx.fillRect(centerTargetX - greatW / 2, barY, greatW, barH);

        // Perfect Zone (golden yellow pulsing)
        const pulse = Math.sin(bTick * 0.25) * 0.2 + 0.8;
        ctx.fillStyle = `rgba(234, 179, 8, ${0.55 * pulse})`;
        ctx.fillRect(centerTargetX - perfectW / 2, barY, perfectW, barH);
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 2;
        ctx.strokeRect(centerTargetX - perfectW / 2, barY, perfectW, barH);

        // Target Center Line
        ctx.strokeStyle = '#fef08a';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(centerTargetX, barY - 4);
        ctx.lineTo(centerTargetX, barY + barH + 4);
        ctx.stroke();

        ctx.font = 'bold 9px monospace';
        ctx.fillStyle = '#fde047';
        ctx.fillText('CRITICAL', centerTargetX, barY - 6);

        // Move White Strike Cursor
        if (!strikeDoneRef.current) {
          strikePosRef.current += strikeSpeedRef.current;
          if (strikePosRef.current >= barW || strikePosRef.current <= 0) {
            strikeSpeedRef.current = -strikeSpeedRef.current;
          }
        }

        // Draw White Strike Cursor Line
        const curX = barX + strikePosRef.current;
        ctx.save();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 5;
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.moveTo(curX, barY - 6);
        ctx.lineTo(curX, barY + barH + 6);
        ctx.stroke();
        ctx.restore();

        // Action hint
        ctx.font = '11px sans-serif';
        ctx.fillStyle = '#cbd5e1';
        ctx.textAlign = 'center';
        ctx.fillText('⌨️ 按【SPACE】或點擊畫面釋放盧恩斬擊！', bx + bw / 2, by + bh - 32);

        if (warcryActiveTurnsRef.current > 0) {
          ctx.font = 'bold 11px sans-serif';
          ctx.fillStyle = '#f59e0b';
          ctx.fillText('🪓【維京戰吼】戰狂加持中！暴擊率大幅提升！', bx + bw / 2, by + bh - 14);
        } else {
          ctx.font = '10px monospace';
          ctx.fillStyle = '#38bdf8';
          ctx.fillText(`🔥 勇氣共鳴：CRITICAL 判定寬度 +${courageTol}px`, bx + bw / 2, by + bh - 14);
        }

        // Strike Result Banner
        if (strikeResultRef.current) {
          const res = strikeResultRef.current;
          ctx.save();
          ctx.font = 'bold 22px monospace';
          ctx.textAlign = 'center';
          ctx.shadowBlur = 14;
          if (res.rating === 'PERFECT') {
            ctx.fillStyle = '#fbbf24';
            ctx.shadowColor = '#eab308';
            ctx.fillText('⚡ PERFECT CRITICAL!!', bx + bw / 2, barY + barH / 2 + 8);
          } else if (res.rating === 'GREAT') {
            ctx.fillStyle = '#38bdf8';
            ctx.shadowColor = '#0284c7';
            ctx.fillText('✨ GREAT HIT!', bx + bw / 2, barY + barH / 2 + 8);
          } else if (res.rating === 'GOOD') {
            ctx.fillStyle = '#10b981';
            ctx.shadowColor = '#059669';
            ctx.fillText('🗡️ HIT!', bx + bw / 2, barY + barH / 2 + 8);
          } else {
            ctx.fillStyle = '#94a3b8';
            ctx.shadowColor = '#475569';
            ctx.fillText('💨 GRAZE / MISS...', bx + bw / 2, barY + barH / 2 + 8);
          }
          ctx.restore();
        }
      }

      // 4. Undertale Battle Box: Narrative Resonance Phase (Pure Visual Box without legacy Fight/Act text prompts)
      if (battlePhase === 'menu' || battlePhase === 'act_menu' || battlePhase === 'item_menu') {
        const { x: bx, y: by, w: bw, h: bh } = boxBounds;
        ctx.fillStyle = '#000000';
        ctx.fillRect(bx, by, bw, bh);
        ctx.strokeStyle = isPhase2 ? '#f43f5e' : '#38bdf8';
        ctx.lineWidth = 3.5;
        ctx.strokeRect(bx, by, bw, bh);

        ctx.font = '13px monospace';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'left';
        const flavor = isPhase2
          ? `* ${currentChapter.boss.name} 的地標結界徹底狂暴！極夜風暴正在加劇！`
          : `* 極北寒風呼嘯，${currentChapter.boss.name} 正凝聚北歐地標之力。`;
        ctx.fillText(flavor.slice(0, 24), bx + 20, by + 44);
        if (flavor.length > 24) ctx.fillText(flavor.slice(24), bx + 20, by + 70);

        ctx.font = '11px monospace';
        ctx.fillStyle = '#38bdf8';
        ctx.fillText('* 按 [SPACE] 或點擊下方北歐聖物印記發動盧恩反擊！', bx + 20, by + 112);
        if (warcryActiveTurnsRef.current > 0) {
          ctx.fillStyle = '#f59e0b';
          ctx.fillText(`* 🪓 維京戰吼生效中（剩餘 ${warcryActiveTurnsRef.current} 回合暴擊提升）`, bx + 20, by + 138);
        } else if (blessingRegenTurnsRef.current > 0) {
          ctx.fillStyle = '#38bdf8';
          ctx.fillText(`* ❄️ 拉普蘭極光祈福生效中`, bx + 20, by + 138);
        } else if (aegisChargesRef.current > 0) {
          ctx.fillStyle = '#10b981';
          ctx.fillText(`* 🛡️ 英靈殿守護生效中（可抵消 ${aegisChargesRef.current} 次受擊）`, bx + 20, by + 138);
        }
      }

      // 5. Undertale Battle Box & Bullet Hell Phase
      if (battlePhase === 'dodge') {
        const { x: bx, y: by, w: bw, h: bh } = boxBounds;

        // Black Box interior
        ctx.fillStyle = '#000000';
        ctx.fillRect(bx, by, bw, bh);

        // 3-Stage Progression: Boss only advances to the next stage AFTER each player attack!
        // Stage 1: 🎯 第一階段：彈幕射擊 (7.0s)
        // Stage 2: 🐦 第二階段：水管鳥式北歐神話圖騰柱與冰柱躲避 (7.0s)
        // Stage 3: ⚡ 第三階段：強力激光射線 (7.0s)
        if (bTick === 1) {
          const activeStg = bossAttackStageRef.current;
          flappyWaveCountRef.current = 0;
          sideWeaponsRef.current = [];
          flappyPillarsRef.current = [];
          bulletsRef.current = [];
          setIsChaosSaberCssWaveActive(false);
          setActiveCssWeaponSide('none');
          if (activeStg === 'stage2_flappy') {
            flappyVyRef.current = -2.2;
          }
          intermittentAttackStateRef.current = {
            nextAttackTick: activeStg === 'stage2_flappy' ? 10 : 8,
            activeMode: activeStg === 'stage2_flappy' ? 'flappy_corridor' : 'idle',
            modeEndTick: 0,
            lastSide: Math.random() > 0.5 ? 'left' : 'right',
            cssHideTick: 0,
            bannerText:
              activeStg === 'stage1_danmaku'
                ? '🎯【第一階段：彈幕射擊】觀察節奏閃避北歐地標元素彈幕！（反擊後進入第二階段）'
                : activeStg === 'stage2_flappy'
                ? '🐦【第二階段：北歐神話圖騰柱與冰柱】按 W/↑/空白鍵 拍翅閃避！（反擊後進入第三階段）'
                : '⚡【第三階段：強力激光射線】留意框外神兵飛入與激光鎖定預警線！',
            bannerColor:
              activeStg === 'stage1_danmaku'
                ? '#38bdf8'
                : activeStg === 'stage2_flappy'
                ? '#4ade80'
                : '#f43f5e',
          };
        }

        const isFlappyCorridorMode = bossAttackStageRef.current === 'stage2_flappy';

        // Neon Border: During Flappy Corridor Mode (Sans Screenshot Style), use bright Emerald Green (#22c55e) with inner White frame!
        const boxBorderColor = isFlappyCorridorMode
          ? '#22c55e'
          : isBerserkMode
          ? Math.sin(bTick * 0.28) > 0 ? '#e11d48' : '#9f1239'
          : isPhase2
          ? Math.sin(bTick * 0.16) > 0 ? '#f43f5e' : '#f59e0b'
          : '#38bdf8';

        ctx.strokeStyle = boxBorderColor;
        ctx.lineWidth = isFlappyCorridorMode ? 5 : isBerserkMode ? 5 : 4;
        ctx.shadowColor = boxBorderColor;
        ctx.shadowBlur = isFlappyCorridorMode ? 14 : 8;
        ctx.strokeRect(bx, by, bw, bh);
        ctx.shadowBlur = 0;

        if (isFlappyCorridorMode) {
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2;
          ctx.strokeRect(bx + 4, by + 4, bw - 8, bh - 8);
        }

        // Form Transition Announcement Banner
        if (formTransitionBannerRef.current && formTransitionBannerRef.current.frames > 0) {
          const banner = formTransitionBannerRef.current;
          banner.frames--;
          const bAlpha = Math.min(1.0, banner.frames / 20, (130 - banner.frames) / 15);
          ctx.save();
          ctx.globalAlpha = bAlpha;
          const bannerY = Math.max(12, by - 55);
          const bannerW = Math.min(width - 40, bw + 150);
          const bannerX = width / 2 - bannerW / 2;

          ctx.fillStyle = banner.form === 3 ? 'rgba(159, 18, 57, 0.94)' : 'rgba(14, 116, 144, 0.94)';
          ctx.strokeStyle = banner.form === 3 ? '#fbbf24' : '#67e8f9';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.roundRect(bannerX, bannerY, bannerW, 36, [8]);
          ctx.fill();
          ctx.stroke();

          ctx.font = 'bold 12px monospace';
          ctx.fillStyle = '#ffffff';
          ctx.textAlign = 'center';
          ctx.shadowColor = banner.form === 3 ? '#f59e0b' : '#38bdf8';
          ctx.shadowBlur = 10;
          ctx.fillText(`⚡【形態轉換】${banner.badge} · ${banner.name} 覺醒！`, width / 2, bannerY + 22);
          ctx.restore();
        }

        // Compact Top-Right Combo Pill (Moved away from Battle Box sides so Side Weapons have 100% clear space!)
        if (comboCountRef.current > 0 || extremeDodgeCountRef.current > 0) {
          ctx.save();
          ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
          ctx.strokeStyle = '#fbbf24';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.roundRect(width - 156, 46, 144, 24, [6]);
          ctx.fill();
          ctx.stroke();
          ctx.font = 'bold 10px monospace';
          ctx.fillStyle = '#fbbf24';
          ctx.textAlign = 'center';
          ctx.fillText(`🔥 ${comboCountRef.current} COMBO · ⚡閃避 ${extremeDodgeCountRef.current}`, width - 84, 62);
          ctx.restore();
        }

        // Update Soul Position (❤️) — Supports Both Standard 8-Way Dodge AND Flappy Bird Corridor Mode (水管鳥小遊戲玩法)!
        const soul = soulPosRef.current;
        const courageBuff = getCourageCombatBuff(playerState.courage);
        const speed = 4.2 * (courageBuff.soulSpeedMultiplier || 1.0);

        let isMoving = false;
        if (isInvertedControlsRef.current) {
          if (keysDownRef.current['arrowleft'] || keysDownRef.current['a']) { soul.x += speed; isMoving = true; }
          if (keysDownRef.current['arrowright'] || keysDownRef.current['d']) { soul.x -= speed; isMoving = true; }
        } else {
          if (keysDownRef.current['arrowleft'] || keysDownRef.current['a']) { soul.x -= speed; isMoving = true; }
          if (keysDownRef.current['arrowright'] || keysDownRef.current['d']) { soul.x += speed; isMoving = true; }
        }

        if (isFlappyCorridorMode) {
          // 🐦 水管鳥小遊戲物理 (Flappy Soul Mode): Gravity pulls down, W/Up/Space flaps upward!
          if (flappyFlapCooldownRef.current > 0) flappyFlapCooldownRef.current--;
          if ((keysDownRef.current['arrowup'] || keysDownRef.current['w'] || keysDownRef.current[' ']) && flappyFlapCooldownRef.current === 0) {
            flappyVyRef.current = -3.4;
            flappyFlapCooldownRef.current = 8;
            isMoving = true;
          } else if (keysDownRef.current['arrowdown'] || keysDownRef.current['s']) {
            flappyVyRef.current = Math.min(4.2, flappyVyRef.current + 0.35);
            isMoving = true;
          } else {
            flappyVyRef.current = Math.min(3.4, flappyVyRef.current + 0.19);
          }
          soul.y += flappyVyRef.current;
        } else {
          flappyVyRef.current = 0;
          if (keysDownRef.current['arrowup'] || keysDownRef.current['w']) { soul.y -= speed; isMoving = true; }
          if (keysDownRef.current['arrowdown'] || keysDownRef.current['s']) { soul.y += speed; isMoving = true; }
        }

        // Clamp soul within full 320x180 bullet box (clean, uncluttered space)
        soul.x = Math.max(bx + 12, Math.min(bx + bw - 12, soul.x));
        soul.y = Math.max(by + 12, Math.min(by + bh - 12, soul.y));

        // Update Timed Click Counter Window
        if (counterCooldownRef.current > 0) counterCooldownRef.current--;
        if (counterWindowTimerRef.current > 0) {
          counterWindowTimerRef.current--;
          if (counterWindowTimerRef.current === 0) {
            setCounterWindowActive(false);
          }
        } else if (bTick % 140 === 0 && counterCooldownRef.current === 0 && !isFlappyCorridorMode) {
          counterWindowTimerRef.current = 60;
          setCounterWindowActive(true);
        }

        // Record Multi-tier Soul Dodge Afterimage (玩家躲避彈幕時的殘影效果)
        if (isMoving) {
          const colors = isPhase2 ? ['#f43f5e', '#fbbf24', '#e11d48'] : ['#38bdf8', '#f43f5e', '#a855f7'];
          const trailColor = colors[soulTrailRef.current.length % colors.length];
          soulTrailRef.current.push({
            x: soul.x,
            y: soul.y,
            alpha: 0.85,
            color: trailColor,
            scale: 1.0,
          });

          // Spawn tiny dodging motion sparks behind soul
          if (bTick % 2 === 0) {
            grazeSparksRef.current.push({
              x: soul.x + (Math.random() - 0.5) * 8,
              y: soul.y + (Math.random() - 0.5) * 8,
              vx: (Math.random() - 0.5) * 1.2,
              vy: (Math.random() - 0.5) * 1.2,
              life: 0.7,
              color: isPhase2 ? '#fbbf24' : '#38bdf8',
            });
          }
        } else if (bTick % 3 === 0) {
          soulTrailRef.current.push({
            x: soul.x,
            y: soul.y,
            alpha: 0.45,
            color: '#ef4444',
            scale: 0.95,
          });
        }

        // Render Multi-layer Soul Dodge Afterimages with Chromatic Glow
        soulTrailRef.current.forEach((t) => {
          ctx.save();
          ctx.globalAlpha = Math.max(0, t.alpha * 0.55);
          ctx.shadowColor = t.color || '#ef4444';
          ctx.shadowBlur = 12;
          ctx.font = `${Math.round(16 * (t.scale || 1.0))}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('❤️', t.x, t.y);

          // Outer ghostly aura ring for dodge sensation
          if (t.alpha > 0.4) {
            ctx.strokeStyle = t.color || '#38bdf8';
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.arc(t.x, t.y, 11 * (t.scale || 1.0), 0, Math.PI * 2);
            ctx.stroke();
          }
          ctx.restore();
          t.alpha -= isMoving ? 0.08 : 0.12;
          if (t.scale) t.scale = Math.max(0.6, t.scale - 0.025);
        });
        soulTrailRef.current = soulTrailRef.current.filter((t) => t.alpha > 0.05);

        // Render Active Graze Particles & Text Indicator
        grazeSparksRef.current.forEach((gp) => {
          gp.x += gp.vx;
          gp.y += gp.vy;
          gp.life -= 0.06;
          ctx.save();
          ctx.globalAlpha = Math.max(0, gp.life);
          ctx.fillStyle = gp.color;
          ctx.fillRect(gp.x - 1.5, gp.y - 1.5, 3, 3);
          ctx.restore();
        });
        grazeSparksRef.current = grazeSparksRef.current.filter((gp) => gp.life > 0);

        if (grazeIndicatorRef.current) {
          const gi = grazeIndicatorRef.current;
          gi.y -= 0.6;
          gi.alpha -= 0.04;
          ctx.save();
          ctx.globalAlpha = Math.max(0, gi.alpha);
          ctx.font = 'bold 11px monospace';
          ctx.fillStyle = isPhase2 ? '#fbbf24' : '#fde047';
          ctx.textAlign = 'center';
          ctx.shadowColor = '#eab308';
          ctx.shadowBlur = 6;
          ctx.fillText(gi.text, gi.x, gi.y);
          ctx.restore();
          if (gi.alpha <= 0) grazeIndicatorRef.current = null;
        }

        // Draw Fourth Wall Interactive Props & Handle Soul Collision
        interactivePropsRef.current = interactivePropsRef.current.filter((prop) => {
          ctx.save();
          ctx.font = '18px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          const pBob = Math.sin(bTick * 0.15) * 3;

          let icon = '🪵';
          if (prop.type === 'driftwood') icon = '🪵';
          else if (prop.type === 'sami_drum') icon = '🥁';
          else if (prop.type === 'rest_note') icon = '𝄽';
          else if (prop.type === 'rage_shard') icon = '💎';
          else if (prop.type === 'steam_vent') icon = '💧';

          ctx.fillText(icon, prop.x, prop.y + pBob);
          ctx.restore();

          const distProp = Math.hypot(soul.x - prop.x, soul.y - (prop.y + pBob));
          if (distProp < prop.radius + 10) {
            if (prop.type === 'driftwood') {
              playRetroSound('water_splash');
              setPlayerState((p) => ({ ...p, hp: Math.min(p.maxHp, p.hp + 12) }));
              bulletsRef.current = bulletsRef.current.filter((b) => Math.hypot(b.x - soul.x, b.y - soul.y) > 75);
              grazeIndicatorRef.current = { x: soul.x, y: soul.y - 18, text: '🪵 拾獲浮木！水下彈幕震退 +12 HP', alpha: 1.0 };
            } else if (prop.type === 'sami_drum') {
              playRetroSound('magic');
              isInvertedControlsRef.current = false;
              bulletsRef.current.forEach((b) => { b.vx *= 0.3; b.vy *= 0.3; });
              grazeIndicatorRef.current = { x: soul.x, y: soul.y - 18, text: '🥁 薩米神鼓共鳴！鏡像破解 & 極光凍結！', alpha: 1.0 };
            } else if (prop.type === 'rest_note') {
              playRetroSound('fanfare');
              bulletsRef.current = [];
              grazeIndicatorRef.current = { x: soul.x, y: soul.y - 18, text: '𝄽 休止符奏響！全場音符消弭！', alpha: 1.0 };
            } else if (prop.type === 'rage_shard') {
              playRetroSound('blip');
              grazeIndicatorRef.current = { x: soul.x, y: soul.y - 18, text: '💎 瓦蘭吉金晶！狂戰暴擊蓄能！', alpha: 1.0 };
              warcryActiveTurnsRef.current = Math.max(warcryActiveTurnsRef.current, 1);
            } else if (prop.type === 'steam_vent') {
              playRetroSound('heal');
              coreTempRef.current = 65;
              soul.iFrames = 45;
              grazeIndicatorRef.current = { x: soul.x, y: soul.y - 18, text: '💧 地熱冰泉冷卻！核心降溫 & 冰甲無敵！', alpha: 1.0 };
            }
            return false;
          }
          return true;
        });

        // Draw Player Soul (❤️ Red Heart + Flappy Wings during Flappy Corridor Mode!)
        if (soul.iFrames % 4 < 2) {
          ctx.font = '18px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.shadowColor = isFlappyCorridorMode ? '#22c55e' : isPhase2 ? '#fb7185' : '#ef4444';
          ctx.shadowBlur = 8;
          ctx.fillText('❤️', soul.x, soul.y);
          if (isFlappyCorridorMode) {
            const wingY = soul.y - 2 + (flappyVyRef.current < 0 ? -3 : 2);
            ctx.font = '11px sans-serif';
            ctx.fillText('🪽', soul.x - 12, wingY);
          }
          ctx.shadowBlur = 0;
        }

        // Protective Hexagonal Shield Aura during Invulnerability (i-Frames) or Valhalla Aegis
        if (soul.iFrames > 0 || aegisChargesRef.current > 0) {
          ctx.save();
          const isAegis = aegisChargesRef.current > 0;
          const shieldRadius = (isAegis ? 20 : 17) + Math.sin(bTick * 0.35) * 2;
          ctx.strokeStyle = isAegis ? '#10b981' : isPhase2 ? '#fbbf24' : '#38bdf8';
          ctx.lineWidth = isAegis ? 2.5 : 1.8;
          ctx.shadowColor = isAegis ? '#34d399' : isPhase2 ? '#f59e0b' : '#60a5fa';
          ctx.shadowBlur = isAegis ? 12 : 8;
          ctx.beginPath();
          for (let s = 0; s < 6; s++) {
            const sAng = (s / 6) * Math.PI * 2 + bTick * 0.08;
            const sx = soul.x + Math.cos(sAng) * shieldRadius;
            const sy = soul.y + Math.sin(sAng) * shieldRadius;
            if (s === 0) ctx.moveTo(sx, sy);
            else ctx.lineTo(sx, sy);
          }
          ctx.closePath();
          ctx.stroke();
          ctx.restore();
          if (soul.iFrames > 0) soul.iFrames--;
        }

        // Disable simultaneous background multi-bullet spam so Boss attacks NEVER overlap or crowd the screen!
        // All projectiles are cleanly and sequentially spawned by the Boss's active elemental weapon in Windows 1 & 2.
        const spawnInterval = (_baseTicks: number) => 999999;
        const bossType = currentChapter.boss.bossType;

        if (bossType === 'harald_bluetooth') {
          // 1. 丹麥 BOSS：藍牙王哈拉爾（Harald Bluetooth）
          // 專屬北歐敘事彈幕：藍色符文環繞陣 (Orbiting Blue Runes)、藍牙符文波動、新港彩色山牆木屋、小美人魚水泡
          // (A) 藍色符文環繞 (Orbiting Blue Runes Circling & Spiraling)
          if (bTick % spawnInterval(isPhase2 ? 32 : 45) === 0) {
            const runes = ['ᛒ', 'ᚱ', 'ᚠ', 'ᛏ', 'ᚦ', 'ᛦ'];
            const count = isPhase2 ? 6 : 4;
            const centerX = bx + bw / 2 + (Math.random() - 0.5) * 60;
            const centerY = by + bh / 2 + (Math.random() - 0.5) * 36;
            for (let i = 0; i < count; i++) {
              const initAng = (i * Math.PI * 2) / count;
              bulletsRef.current.push({
                x: centerX + Math.cos(initAng) * 16,
                y: centerY + Math.sin(initAng) * 16,
                vx: 0,
                vy: 0,
                radius: 10,
                type: 'orbit_rune',
                char: runes[i % runes.length],
                color: i % 2 === 0 ? '#38bdf8' : '#60a5fa',
                orbitAngle: initAng,
                orbitRadius: 16,
                orbitSpeed: isPhase2 ? 0.075 : 0.055,
                orbitCenterX: centerX,
                orbitCenterY: centerY,
                isPhase2,
              });
            }
          }

          // (B) 藍牙符文鋸齒波紋 (Bluetooth Rune Waveform)
          if (bTick % spawnInterval(isPhase2 ? 14 : 20) === 0) {
            const runes = ['ᛒ', 'ᚱ', 'ᚠ', 'ᛏ'];
            bulletsRef.current.push({
              x: bx + 15,
              y: by - 14,
              vx: 1.6,
              vy: 2.2,
              radius: 11,
              type: 'rune',
              char: runes[Math.floor(Math.random() * runes.length)],
              color: '#38bdf8',
              rot: 0,
              vRot: 0.12,
              amplitude: 3.2,
              frequency: 0.14,
              isPhase2,
            });
            bulletsRef.current.push({
              x: bx + bw - 15,
              y: by - 14,
              vx: -1.6,
              vy: 2.2,
              radius: 11,
              type: 'rune',
              char: runes[Math.floor(Math.random() * runes.length)],
              color: '#60a5fa',
              rot: 0,
              vRot: -0.12,
              amplitude: -3.2,
              frequency: 0.14,
              isPhase2,
            });
          }

          // (C) 畫面上方掉落彩色的新港建築砸向玩家 (Falling Nyhavn Gable Houses)
          if (bTick % spawnInterval(isPhase2 ? 30 : 42) === 0) {
            const housePalette = ['#e11d48', '#ea580c', '#facc15', '#0284c7'];
            bulletsRef.current.push({
              x: bx + 24 + Math.random() * (bw - 48),
              y: by - 28,
              vx: (Math.random() - 0.5) * 0.8,
              vy: 2.5 + Math.random() * 1.2,
              radius: 14,
              type: 'nyhavn_house',
              color: housePalette[Math.floor(Math.random() * housePalette.length)],
              rot: (Math.random() - 0.5) * 0.2,
              vRot: (Math.random() - 0.5) * 0.02,
              isPhase2,
            });
          }

          // (D) 小美人魚甩出水泡阻擋去路 (Little Mermaid Floating Bubbles)
          if (bTick % spawnInterval(isPhase2 ? 18 : 28) === 0) {
            const fromLeft = Math.random() > 0.5;
            bulletsRef.current.push({
              x: fromLeft ? bx - 10 : bx + bw + 10,
              y: by + 30 + Math.random() * (bh - 60),
              vx: fromLeft ? 2.2 : -2.2,
              vy: Math.sin(bTick * 0.2) * 1.5,
              radius: 9,
              type: 'water_bubble',
              color: '#38bdf8',
              isPhase2,
            });
          }

          // (E) 【形態 II/III 覺醒新招式】電磁雙向十字雷射矩陣 (Electromagnetic Cross Laser Grid)
          if (isPhase2 && bTick % spawnInterval(isPhase3 ? 46 : 64) === 0) {
            bulletsRef.current.push({
              x: bx + bw / 2 + (Math.random() - 0.5) * 80,
              y: by + bh / 2 + (Math.random() - 0.5) * 40,
              vx: 0,
              vy: 0,
              radius: 14,
              type: 'laser_cross',
              color: isPhase3 ? '#c084fc' : '#38bdf8',
              beamProgress: 0,
              isPhase2,
            });
          }

          // (F) 【形態 II/III 覺醒新招式】八方螺旋盧恩風暴 (Spiral Runic Tempest)
          if (isPhase2 && bTick % spawnInterval(isPhase3 ? 38 : 54) === 0) {
            const runes = ['ᛒ', 'ᚱ', 'ᚠ', 'ᛏ', 'ᚦ', 'ᛦ'];
            const count = isPhase3 ? 8 : 6;
            const cx = bx + bw / 2;
            const cy = by + bh / 2;
            for (let i = 0; i < count; i++) {
              const ang = (i * Math.PI * 2) / count + (bTick * 0.1);
              bulletsRef.current.push({
                x: cx,
                y: cy,
                vx: Math.cos(ang) * (isPhase3 ? 2.6 : 2.1),
                vy: Math.sin(ang) * (isPhase3 ? 2.6 : 2.1),
                radius: 10,
                type: 'spiral_rune',
                char: runes[i % runes.length],
                color: isPhase3 ? '#a855f7' : '#06b6d4',
                rot: ang,
                vRot: 0.15,
                isPhase2,
              });
            }
          }

          // (G) 【形態 III 終焉新招式】藍牙雷達聲納脈衝環 (Bluetooth Radar Ping Pulse)
          if (isPhase3 && bTick % spawnInterval(54) === 0) {
            bulletsRef.current.push({
              x: bx + bw / 2,
              y: by + bh / 2,
              vx: 0,
              vy: 0,
              radius: 12,
              width: 14,
              type: 'radar_ping',
              color: '#38bdf8',
              beamProgress: 0,
              isPhase2,
            });
          }

        } else if (bossType === 'captain_vasa') {
          // 2. 瑞典 BOSS：瓦薩號幽靈船長（Captain of Vasa）
          // 專屬北歐敘事彈幕：戰鬥框縮小至90公分狹窄通道、1628歷史遺物青銅重砲、1520大廣場鵝卵石砲彈反彈、市政廳金箔碎片
          const alleyLeft = bx + 100;
          const alleyW = bw - 200;

          // (A) 1628 歷史遺物雙層青銅重砲彈 (Vasa Relic Bronze Cannonballs)
          if (bTick % spawnInterval(isPhase2 ? 15 : 22) === 0) {
            bulletsRef.current.push({
              x: alleyLeft + 14 + Math.random() * (alleyW - 28),
              y: by - 16,
              vx: (Math.random() - 0.5) * 2.2,
              vy: 3.3 + Math.random() * 0.9,
              radius: 11,
              type: 'cannonball',
              color: '#0d9488',
              bouncesLeft: isPhase2 ? 3 : 2,
              isPhase2,
            });
          }

          // (B) 1520 年斯德哥爾摩血案大廣場歷史鵝卵石砲彈 (Stortorget Historical Cobblestone Projectiles)
          if (bTick % spawnInterval(isPhase2 ? 20 : 30) === 0) {
            bulletsRef.current.push({
              x: alleyLeft + 16 + Math.random() * (alleyW - 32),
              y: by - 15,
              vx: (Math.random() > 0.5 ? 1 : -1) * 1.8,
              vy: 2.5,
              radius: 13,
              type: 'cobblestone',
              color: '#475569',
              rot: 0,
              vRot: 0.14,
              bouncesLeft: 2,
              trail: [],
              isPhase2,
            });
          }

          // (C) 市政廳金色馬賽克金箔碎片劃過陣地 (Golden City Hall Mosaic Shards)
          if (bTick % spawnInterval(isPhase2 ? 12 : 20) === 0) {
            const sweepFromLeft = Math.random() > 0.5;
            bulletsRef.current.push({
              x: sweepFromLeft ? alleyLeft - 8 : alleyLeft + alleyW + 8,
              y: by + 15 + Math.random() * (bh - 30),
              vx: sweepFromLeft ? 3.2 : -3.2,
              vy: (Math.random() - 0.5) * 2.0,
              radius: 8,
              type: 'mosaic_shard',
              color: '#fbbf24',
              rot: Math.random() * Math.PI,
              vRot: 0.2,
              isPhase2,
            });
          }

          // (D) 瓦薩號幽靈巨錨擺盪 (Spectral Anchor Sweep)
          if (bTick % spawnInterval(isPhase2 ? 36 : 52) === 0) {
            bulletsRef.current.push({
              x: bx + bw / 2,
              y: by - 24,
              vx: Math.sin(bTick * 0.1) * 2.0,
              vy: 2.3,
              radius: 15,
              type: 'anchor',
              color: '#10b981',
              rot: Math.sin(bTick * 0.1) * 0.5,
              vRot: 0.05,
              isPhase2,
            });
          }

          // (E) 【形態 II/III 覺醒新招式】360° 側舷雙層火砲全面齊射 (Broadside Double-Deck Cannon Salvo)
          if (isPhase2 && bTick % spawnInterval(isPhase3 ? 30 : 44) === 0) {
            const leftY = by + 25 + Math.random() * (bh - 50);
            const rightY = by + 25 + Math.random() * (bh - 50);
            bulletsRef.current.push({
              x: alleyLeft + 12,
              y: leftY,
              vx: 3.3,
              vy: (Math.random() - 0.5) * 1.4,
              radius: 12,
              type: 'broadside_cannon',
              color: '#2dd4bf',
              bouncesLeft: 2,
              isPhase2,
            });
            bulletsRef.current.push({
              x: alleyLeft + alleyW - 12,
              y: rightY,
              vx: -3.3,
              vy: (Math.random() - 0.5) * 1.4,
              radius: 12,
              type: 'broadside_cannon',
              color: '#14b8a6',
              bouncesLeft: 2,
              isPhase2,
            });
          }

          // (F) 【形態 II/III 覺醒新招式】波羅的海克拉肯幽靈觸手橫掃 (Kraken Abyssal Tentacle Sweep)
          if (isPhase2 && bTick % spawnInterval(isPhase3 ? 46 : 64) === 0) {
            const sweepFromTop = Math.random() > 0.5;
            bulletsRef.current.push({
              x: alleyLeft + alleyW / 2 + (Math.random() - 0.5) * 35,
              y: sweepFromTop ? by - 16 : by + bh + 16,
              vx: (Math.random() - 0.5) * 1.0,
              vy: sweepFromTop ? 2.8 : -2.8,
              radius: 16,
              type: 'kraken_tentacle',
              color: isPhase3 ? '#10b981' : '#0d9488',
              rot: 0,
              vRot: 0.08,
              phaseTime: 0,
              isPhase2,
            });
          }

        } else if (bossType === 'sami_shaman') {
          // 3. 芬蘭拉普蘭 BOSS：薩米巫師與極光狼（Sámi Shaman & Fenrir）
          // 專屬北歐敘事彈幕：極光光束貫穿、北緯 66°33' 極圈界線軌道切割、聖誕郵局信件、盤旋馴鹿角
          // (A) 薩米神鼓召喚極光光束 (Sámi Shaman Aurora Borealis Laser Beams)
          if (bTick % spawnInterval(isPhase2 ? 34 : 48) === 0) {
            bulletsRef.current.push({
              x: bx + 36 + Math.random() * (bw - 72),
              y: by,
              vx: 0,
              vy: 0,
              radius: 16,
              width: isPhase2 ? 36 : 30,
              height: bh,
              type: 'aurora_beam',
              color: isPhase2 ? '#ec4899' : '#10b981',
              beamProgress: 0,
              isPhase2,
            });
          }

          // (B) 北緯 66°33' 極圈界線軌道切割光刃 (66°33'N Arctic Circle Orbital Line Slicers)
          if (bTick % spawnInterval(isPhase2 ? 22 : 34) === 0) {
            const fromLeft = Math.random() > 0.5;
            const splitY = by + bh / 2 + (Math.random() - 0.5) * 26;
            bulletsRef.current.push({
              x: fromLeft ? bx - 14 : bx + bw + 14,
              y: splitY,
              vx: fromLeft ? (isPhase2 ? 4.4 : 3.5) : (isPhase2 ? -4.4 : -3.5),
              vy: Math.sin(bTick * 0.12) * 0.6,
              radius: 12,
              type: 'polar_cutter',
              color: '#67e8f9',
              rot: 0,
              vRot: 0.28,
              isPhase2,
            });
          }

          // (C) 聖誕郵局郵票信件軌道飛行 (Christmas Letters with Postal Stamps)
          if (bTick % spawnInterval(isPhase2 ? 16 : 24) === 0) {
            const startLeft = Math.random() > 0.5;
            bulletsRef.current.push({
              x: startLeft ? bx - 14 : bx + bw + 14,
              y: by + 20 + Math.random() * (bh - 40),
              vx: startLeft ? 3.0 : -3.0,
              vy: Math.sin(bTick * 0.15) * 1.8,
              radius: 12,
              type: 'letter',
              color: '#f8fafc',
              rot: 0,
              vRot: 0.05,
              isPhase2,
            });
          }

          // (D) 盤旋飛舞的馴鹿角 (Swirling Reindeer Antlers)
          if (bTick % spawnInterval(isPhase2 ? 24 : 34) === 0) {
            bulletsRef.current.push({
              x: bx + 25 + Math.random() * (bw - 50),
              y: by - 16,
              vx: (Math.random() - 0.5) * 2.0,
              vy: 2.5 + Math.random() * 1.0,
              radius: 13,
              type: 'antler',
              color: '#fed7aa',
              rot: 0,
              vRot: 0.22,
              isPhase2,
            });
          }

          // (E) 【形態 II/III 覺醒新招式】芬里爾霜寒神狼巨爪撕裂 (Fenrir Frost Claw Cleave)
          if (isPhase2 && bTick % spawnInterval(isPhase3 ? 36 : 50) === 0) {
            bulletsRef.current.push({
              x: bx + 30 + Math.random() * (bw - 60),
              y: by + 20 + Math.random() * (bh - 40),
              vx: (Math.random() > 0.5 ? 1 : -1) * 3.6,
              vy: (Math.random() - 0.5) * 1.8,
              radius: 15,
              type: 'fenrir_claw',
              color: isPhase3 ? '#f43f5e' : '#67e8f9',
              rot: Math.random() * Math.PI,
              vRot: 0.18,
              phaseTime: 0,
              isPhase2,
            });
          }

          // (F) 【形態 II/III 覺醒新招式】極地暴風雪冰晶旋渦 (Polar Blizzard Ice Vortex)
          if (isPhase2 && bTick % spawnInterval(isPhase3 ? 42 : 58) === 0) {
            const cx = bx + bw / 2;
            const cy = by + bh / 2;
            bulletsRef.current.push({
              x: cx + (Math.random() - 0.5) * 90,
              y: cy + (Math.random() - 0.5) * 55,
              vx: (soulPosRef.current.x - cx) * 0.016,
              vy: (soulPosRef.current.y - cy) * 0.016,
              radius: 13,
              type: 'ice_vortex',
              color: '#38bdf8',
              rot: 0,
              vRot: 0.22,
              phaseTime: 0,
              isPhase2,
            });
          }

        } else if (bossType === 'vainamoinen') {
          // 4. 芬蘭赫爾辛基 BOSS：賢者萬奈摩寧（Väinämöinen）
          // 專屬北歐敘事彈幕：彈奏芬蘭康特勒琴（Kantele）五弦音符軌跡、Löyly 桑拿蒸汽上升流、岩石教堂花崗岩石塊
          // (A) 康特勒琴五弦諧波音符軌跡 (Kantele Harp Harmonic Note Trajectories with Golden Trails)
          if (bTick % spawnInterval(isPhase2 ? 11 : 16) === 0) {
            const strIdx = Math.floor(Math.random() * 4) + 1;
            const stringY = by + (bh * strIdx) / 5;
            const noteChars = ['♪', '♫', '♬', '𝄞'];
            const notePalette = ['#fde047', '#38bdf8', '#c084fc', '#4ade80'];
            const fromLeft = strIdx % 2 === 1;
            bulletsRef.current.push({
              x: fromLeft ? bx - 10 : bx + bw + 10,
              y: stringY,
              baseY: stringY,
              vx: fromLeft ? (isPhase2 ? 3.6 : 3.0) : (isPhase2 ? -3.6 : -3.0),
              vy: 0,
              radius: 10,
              type: 'kantele_wave',
              char: noteChars[strIdx - 1],
              color: notePalette[strIdx - 1],
              amplitude: isPhase2 ? 16 : 11,
              frequency: 0.14,
              stringIdx: strIdx,
              trail: [],
              isPhase2,
            });
          }

          // (B) 底部向上升騰的 Löyly 桑拿蒸汽 (Löyly Sauna Steam Clouds)
          if (bTick % spawnInterval(isPhase2 ? 12 : 18) === 0) {
            bulletsRef.current.push({
              x: bx + 20 + Math.random() * (bw - 40),
              y: by + bh + 10,
              vx: (Math.random() - 0.5) * 1.2,
              vy: -2.8 - Math.random() * 1.0,
              radius: 14,
              type: 'sauna_steam',
              color: 'rgba(255, 255, 255, 0.75)',
              isPhase2,
            });
          }

          // (C) 岩石教堂天然銅脈花崗岩塊崩落 (Temppeliaukio Rock Church Blocks)
          if (bTick % spawnInterval(isPhase2 ? 24 : 36) === 0) {
            bulletsRef.current.push({
              x: bx + 25 + Math.random() * (bw - 50),
              y: by - 18,
              vx: (Math.random() - 0.5) * 1.0,
              vy: 3.0 + Math.random() * 1.0,
              radius: 13,
              type: 'rock_block',
              color: '#64748b',
              rot: Math.random() * Math.PI,
              vRot: 0.08,
              isPhase2,
            });
          }

          // (D) 【形態 II/III 覺醒新招式】卡勒瓦拉天籟五重琶音連鎖瀑布 (Kantele 5-String Arpeggio Cascade)
          if (isPhase2 && bTick % spawnInterval(isPhase3 ? 34 : 48) === 0) {
            const noteSymbols = ['♪', '♫', '♬', '𝄞', '𝄢'];
            const palette = ['#fde047', '#38bdf8', '#c084fc', '#4ade80', '#fb923c'];
            for (let s = 1; s <= 5; s++) {
              const startY = by + (bh * s) / 6;
              bulletsRef.current.push({
                x: bx - 14 - s * 14,
                y: startY,
                vx: 3.5,
                vy: Math.sin(s * 0.8) * 0.6,
                radius: 11,
                type: 'kantele_cascade',
                char: noteSymbols[s - 1],
                color: palette[s - 1],
                isPhase2,
              });
            }
          }

          // (E) 【形態 II/III 覺醒新招式】岩石教堂花崗岩爆裂四向碎片 (Temppeliaukio Bursting Rock Shrapnel)
          if (isPhase2 && bTick % spawnInterval(isPhase3 ? 38 : 54) === 0) {
            bulletsRef.current.push({
              x: bx + 30 + Math.random() * (bw - 60),
              y: by - 16,
              vx: (Math.random() - 0.5) * 1.5,
              vy: 2.8,
              radius: 14,
              type: 'rock_shrapnel',
              color: '#ca8a04',
              phaseTime: 0,
              isPhase2,
            });
          }

        } else if (bossType === 'harald_hardrada') {
          // 5. 挪威特羅姆瑟 BOSS：無情者哈拉爾（Harald Hardrada）
          // 瓦蘭吉雙刃戰斧迴旋 + 北極大教堂冰晶極光束
          if (bTick % spawnInterval(isPhase2 ? 13 : 18) === 0) {
            const startFromLeft = Math.random() > 0.5;
            bulletsRef.current.push({
              x: startFromLeft ? bx - 10 : bx + bw + 10,
              y: by + 15 + Math.random() * (bh - 30),
              vx: startFromLeft ? (isPhase2 ? 4.6 : 3.9) : (isPhase2 ? -4.6 : -3.9),
              vy: (Math.random() - 0.5) * 2.8,
              radius: 12,
              type: 'axe',
              color: isPhase2 ? '#ff2200' : '#ef4444',
              rot: 0,
              vRot: 0.24,
              isPhase2,
              amplitude: 2.2,
              frequency: 0.14,
            });
          }
          if (bTick % spawnInterval(isPhase2 ? 42 : 60) === 0) {
            bulletsRef.current.push({
              x: bx + 40 + Math.random() * (bw - 80),
              y: by,
              vx: 0,
              vy: 0,
              radius: 15,
              width: 28,
              height: bh,
              type: 'aurora_beam',
              color: '#38bdf8',
              beamProgress: 0,
              isPhase2,
            });
          }

          // (C) 【形態 II/III 覺醒新招式】維京狂戰雙迴旋戰斧 (Dual Boomerang Waraxes)
          if (isPhase2 && bTick % spawnInterval(isPhase3 ? 32 : 46) === 0) {
            const startX = bx + (Math.random() > 0.5 ? 20 : bw - 20);
            bulletsRef.current.push({
              x: startX,
              y: by - 14,
              vx: (startX < bx + bw / 2 ? 1 : -1) * 3.8,
              vy: 3.2,
              radius: 14,
              type: 'boomerang_axe',
              color: isPhase3 ? '#ef4444' : '#f97316',
              rot: 0,
              vRot: 0.35,
              phaseTime: 0,
              isPhase2,
            });
          }

          // (D) 【形態 II/III 覺醒新招式】北極大教堂三向折射稜鏡光束 (Prism Refraction Laser)
          if (isPhase2 && bTick % spawnInterval(isPhase3 ? 46 : 64) === 0) {
            bulletsRef.current.push({
              x: bx + 40 + Math.random() * (bw - 80),
              y: by,
              vx: 0,
              vy: 0,
              radius: 16,
              width: 26,
              height: bh,
              type: 'prism_laser',
              color: '#38bdf8',
              beamProgress: 0,
              isPhase2,
            });
          }

        } else {
          // 6. 冰島 Final BOSS：火焰巨人史爾特爾（Surtr & Volcanic Fire）
          // 專屬北歐敘事彈幕：噴發拋物線火山岩漿彈幕 (Erupting Magma Barrage)、間歇泉噴射、雷克雅維克跨年煙火
          // (A) 火山口向上拋物線噴發岩漿彈幕與天降熔岩隕石 (Volcanic Magma Eruption Barrage)
          if (bTick % spawnInterval(isPhase2 ? 12 : 18) === 0) {
            const fromCraterBottom = Math.random() > 0.45;
            bulletsRef.current.push({
              x: bx + 20 + Math.random() * (bw - 40),
              y: fromCraterBottom ? by + bh + 8 : by - 16,
              vx: (Math.random() - 0.5) * 2.6,
              vy: fromCraterBottom ? -(5.2 + Math.random() * 1.4) : 3.2 + Math.random() * 1.0,
              radius: 12,
              type: 'magma',
              color: isPhase2 ? '#f97316' : '#ea580c',
              meta: { gravity: fromCraterBottom ? 0.14 : 0.03 },
              trail: [],
              isPhase2,
            });
          }

          // (B) 史托克間歇泉噴泉從框底定時爆發 (Geysir Eruptions from bottom)
          if (bTick % spawnInterval(isPhase2 ? 26 : 38) === 0) {
            bulletsRef.current.push({
              x: bx + 30 + Math.random() * (bw - 60),
              y: by + bh + 10,
              vx: (Math.random() - 0.5) * 0.8,
              vy: -4.5,
              radius: 14,
              type: 'geyser_spout',
              color: '#38bdf8',
              isPhase2,
            });
          }

          // (C) 哈爾格林姆教堂跨年夜彩色煙火彈雨 (New Year Eve Colorful Fireworks)
          if (bTick % spawnInterval(isPhase2 ? 14 : 22) === 0) {
            const fwColor = ['#f43f5e', '#fbbf24', '#a855f7', '#38bdf8', '#34d399'][Math.floor(Math.random() * 5)];
            bulletsRef.current.push({
              x: bx + 15 + Math.random() * (bw - 30),
              y: by - 14,
              vx: (Math.random() - 0.5) * 2.4,
              vy: 2.6 + Math.random() * 1.5,
              radius: 9,
              type: 'firework',
              color: fwColor,
              isPhase2,
            });
          }

          // (D) 【形態 II/III 覺醒新招式】諸神黃昏·暮光神劍天降滅世斬 (Twilight Sword Apocalyptic Cleave)
          if (isPhase2 && bTick % spawnInterval(isPhase3 ? 38 : 54) === 0) {
            bulletsRef.current.push({
              x: bx + bw / 2,
              y: by + bh / 2 + (Math.random() - 0.5) * 30,
              vx: 0,
              vy: 0,
              radius: 18,
              width: bw - 20,
              type: 'twilight_cleave',
              color: isPhase3 ? '#dc2626' : '#ea580c',
              beamProgress: 0,
              isPhase2,
            });
          }

          // (E) 【形態 II/III 覺醒新招式】穆斯貝爾海姆熔岩巨隕爆散 (Muspelheim Magma Meteor Burst)
          if (isPhase2 && bTick % spawnInterval(isPhase3 ? 32 : 46) === 0) {
            bulletsRef.current.push({
              x: bx + 25 + Math.random() * (bw - 50),
              y: by - 20,
              vx: (Math.random() - 0.5) * 1.8,
              vy: 3.8,
              radius: 16,
              type: 'meteor_magma',
              color: '#f97316',
              phaseTime: 0,
              isPhase2,
            });
          }
        }

        // Update & Render Bullets inside Box with Gravitational Field (引力場軌跡彎曲) & Shatter Physics (撞擊碎裂像素碎片飛散)
        // ============================================================================
        // SEQUENTIAL SINGLE-FOCUS BOSS ATTACK ARCHITECTURE (絕不一次擠滿畫面！)
        // - WINDOW 1 (Tick 0 ~ 69):   【單體主武器第 1 式】僅召喚 1 把專屬主武器從單側/上方發動獨特元素攻擊
        // - WINDOW 2 (Tick 70 ~ 139): 【單體副武器第 2 式】清空前波，僅召喚 1 把專屬副武器發動第二種元素攻擊
        // - WINDOW 3 (Tick 140 ~ 239):【北歐元素水管鳥高低柱走廊】清空彈幕，展開各 BOSS 專屬元素障礙走廊
        // ============================================================================
        const bType = currentChapter.boss.bossType;

        const bossWeaponSpec: Record<string, {
          meleeType: BossSideWeapon['type'];
          meleeName: string;
          meleeColor: string;
          meleeGlow: string;
          rangedType: BossSideWeapon['type'];
          rangedName: string;
          rangedColor: string;
          rangedGlow: string;
          flappyTitle: string;
          flappyTheme: FlappyNordicPillar['theme'];
          bulletChar: string;
        }> = {
          harald_bluetooth: {
            meleeType: 'mjolnir_hammer',
            meleeName: '🔨 耶靈雷神戰鎚 · 鋸齒落雷與藍牙電磁環',
            meleeColor: '#38bdf8',
            meleeGlow: 'rgba(56, 189, 248, 0.5)',
            rangedType: 'bluetooth_pylon',
            rangedName: '📡 藍牙盧恩方尖碑 · 正弦符文電網',
            rangedColor: '#60a5fa',
            rangedGlow: 'rgba(96, 165, 250, 0.5)',
            flappyTitle: '🐦【丹麥盧恩石碑走廊】按 W/↑/空白鍵 拍翅飛越耶靈雷電石碑缺口！',
            flappyTheme: 'runestone',
            bulletChar: 'ᛒ',
          },
          captain_vasa: {
            meleeType: 'vasa_anchor_halberd',
            meleeName: '⚓ 瓦薩深海巨錨 · 鐘擺海浪橫掃',
            meleeColor: '#2dd4bf',
            meleeGlow: 'rgba(45, 212, 191, 0.5)',
            rangedType: 'pirate_flintlock',
            rangedName: '💣 1628 皇家金獅青銅砲 · 彈跳重砲彈',
            rangedColor: '#facc15',
            rangedGlow: 'rgba(250, 204, 21, 0.5)',
            flappyTitle: '🐦【波羅的海沉船走廊】按 W/↑/空白鍵 拍翅穿梭 1628 斷裂桅杆與船錨！',
            flappyTheme: 'ship_mast',
            bulletChar: '⚓',
          },
          sami_shaman: {
            meleeType: 'chaos_saber',
            meleeName: '⚔️ 混沌雙刃聖劍 (Chaos Saber) · 框外飛入極光斬',
            meleeColor: '#e879f9',
            meleeGlow: 'rgba(232, 121, 249, 0.55)',
            rangedType: 'gaster_blaster',
            rangedName: '💀 龍顱極光巨砲 · 北緯 66°33′ 極光吐息',
            rangedColor: '#38bdf8',
            rangedGlow: 'rgba(56, 189, 248, 0.55)',
            flappyTitle: '🐦【北極白骨高低走廊】按 W/↑/空白鍵 拍翅穿越馴鹿白骨縫隙！',
            flappyTheme: 'bone_pine',
            bulletChar: '★',
          },
          vainamoinen: {
            meleeType: 'kantele_string',
            meleeName: '🪕 萬奈摩寧黃金五弦琴 · 五線譜正弦音波',
            meleeColor: '#facc15',
            meleeGlow: 'rgba(250, 204, 21, 0.5)',
            rangedType: 'star_cannon',
            rangedName: '🎺 岩石教堂紫銅號角 · 聖殿琶音與桑拿蒸氣',
            rangedColor: '#c084fc',
            rangedGlow: 'rgba(192, 132, 252, 0.5)',
            flappyTitle: '🐦【岩石教堂管風琴走廊】按 W/↑/空白鍵 拍翅飛躍紅銅高低音階柱！',
            flappyTheme: 'organ_pipe',
            bulletChar: '♪',
          },
          harald_hardrada: {
            meleeType: 'viking_axe',
            meleeName: '🪓 瓦蘭吉血鷹巨斧 · 360° 旋風迴旋飛斧',
            meleeColor: '#f43f5e',
            meleeGlow: 'rgba(244, 63, 94, 0.5)',
            rangedType: 'crimson_trident',
            rangedName: '🔱 鮮紅王權三叉戟 · 三連赤紅戟芒突刺',
            rangedColor: '#fb7185',
            rangedGlow: 'rgba(251, 113, 133, 0.5)',
            flappyTitle: '🐦【挪威峽灣冰錐走廊】按 W/↑/空白鍵 拍翅穿越峽灣冰柱與維京盾牆！',
            flappyTheme: 'fjord_ice',
            bulletChar: '❄️',
          },
          surtr: {
            meleeType: 'twilight_sword',
            meleeName: '🗡️ 暮光滅世炎魔神劍 · 天降劈裂大地與火山噴發',
            meleeColor: '#f97316',
            meleeGlow: 'rgba(249, 115, 22, 0.55)',
            rangedType: 'twilight_sword',
            rangedName: '🌋 穆斯貝爾熔岩裂地波 · 間歇泉沖天火柱',
            rangedColor: '#ef4444',
            rangedGlow: 'rgba(239, 68, 68, 0.55)',
            flappyTitle: '🐦【冰島六角玄武岩走廊】按 W/↑/空白鍵 拍翅穿越黑沙灘熔岩玄武岩柱！',
            flappyTheme: 'basalt_magma',
            bulletChar: '🔥',
          },
        };
        const curSpec = bossWeaponSpec[bType] || bossWeaponSpec.sami_shaman;
        const atkState = intermittentAttackStateRef.current;
        const currentStage = bossAttackStageRef.current;

        // Automatically turn off CSS fly-in motion blur overlay once the entry swing completes
        if (atkState.cssHideTick > 0 && bTick >= atkState.cssHideTick) {
          atkState.cssHideTick = 0;
          setIsChaosSaberCssWaveActive(false);
          setActiveCssWeaponSide('none');
        }

        // ============================================================================
        // THREE-STAGE BOSS COMBAT SYSTEM (分輪次獨立進行：第一階段彈幕、第二階段水管鳥、第三階段強力激光)
        // ============================================================================
        if (currentStage === 'stage1_danmaku') {
          // --------------------------------------------------------------------------
          // 【第一階段：彈幕射擊 (Stage 1: Rhythmic Boss Elemental Danmaku)】
          // 僅發射各 BOSS 專屬節奏元素彈幕，不出現水管鳥障礙柱與激光射線，畫面乾淨有節奏！
          // --------------------------------------------------------------------------
          sideWeaponsRef.current = [];
          flappyPillarsRef.current = [];

          if (bTick >= atkState.nextAttackTick) {
            atkState.nextAttackTick = bTick + (isBerserkMode ? 24 : 30);
            atkState.bannerText = `🎯【第一階段：彈幕射擊】${curSpec.meleeName.split(' · ')[0]} · 觀察節奏閃避！`;
            atkState.bannerColor = curSpec.meleeColor;

            // Keep concurrent bullets capped so the screen is never overcrowded
            if (bulletsRef.current.length < (isBerserkMode ? 6 : 5)) {
              const fromLeft = Math.random() > 0.5;
              const spawnX = fromLeft ? bx + 14 : bx + bw - 14;
              const spawnY = by + 26 + Math.random() * (bh - 52);
              const dirX = fromLeft ? 1 : -1;

              if (bType === 'harald_bluetooth') {
                const runes = ['ᛒ', 'ᚱ', 'ᚠ', 'ᛏ'];
                bulletsRef.current.push({
                  x: spawnX,
                  y: spawnY,
                  vx: dirX * 2.45,
                  vy: (Math.random() - 0.5) * 1.4,
                  radius: 10,
                  type: 'rune',
                  char: runes[Math.floor(Math.random() * runes.length)],
                  color: '#38bdf8',
                  amplitude: 2.0,
                  frequency: 0.14,
                  isPhase2,
                });
                bulletsRef.current.push({
                  x: bx + 32 + Math.random() * (bw - 64),
                  y: by - 16,
                  vx: (Math.random() - 0.5) * 0.7,
                  vy: 2.35,
                  radius: 13,
                  type: 'nyhavn_house',
                  color: ['#e11d48', '#ea580c', '#facc15', '#0284c7'][bTick % 4],
                  rot: 0,
                  vRot: 0.02,
                  isPhase2,
                });
              } else if (bType === 'captain_vasa') {
                const alleyLeft = bx + 100;
                const alleyW = bw - 200;
                bulletsRef.current.push({
                  x: alleyLeft + 16 + Math.random() * (alleyW - 32),
                  y: by - 14,
                  vx: (Math.random() > 0.5 ? 1 : -1) * 1.9,
                  vy: 2.6,
                  radius: 11,
                  type: 'cannonball',
                  color: '#2dd4bf',
                  bouncesLeft: 2,
                  isPhase2,
                });
                bulletsRef.current.push({
                  x: alleyLeft + 16 + Math.random() * (alleyW - 32),
                  y: by - 14,
                  vx: (Math.random() > 0.5 ? 1 : -1) * 1.6,
                  vy: 2.2,
                  radius: 12,
                  type: 'cobblestone',
                  color: '#94a3b8',
                  bouncesLeft: 2,
                  trail: [],
                  isPhase2,
                });
              } else if (bType === 'sami_shaman') {
                bulletsRef.current.push({
                  x: spawnX,
                  y: spawnY,
                  vx: dirX * 2.8,
                  vy: (Math.random() - 0.5) * 1.3,
                  radius: 11,
                  type: 'polar_cutter',
                  color: '#67e8f9',
                  rot: 0,
                  vRot: 0.25,
                  isPhase2,
                });
                bulletsRef.current.push({
                  x: bx + 30 + Math.random() * (bw - 60),
                  y: by - 14,
                  vx: (Math.random() - 0.5) * 1.4,
                  vy: 2.4,
                  radius: 12,
                  type: 'antler',
                  color: '#fed7aa',
                  rot: 0,
                  vRot: 0.2,
                  isPhase2,
                });
              } else if (bType === 'vainamoinen') {
                bulletsRef.current.push({
                  x: bx + 30 + Math.random() * (bw - 60),
                  y: by - 16,
                  vx: (Math.random() - 0.5) * 1.0,
                  vy: 2.6,
                  radius: 12,
                  type: 'rock_block',
                  color: '#ca8a04',
                  rot: 0,
                  vRot: 0.08,
                  isPhase2,
                });
                bulletsRef.current.push({
                  x: bx + 30 + Math.random() * (bw - 60),
                  y: by + bh + 8,
                  vx: (Math.random() - 0.5) * 0.9,
                  vy: -2.4,
                  radius: 13,
                  type: 'sauna_steam',
                  color: 'rgba(255, 255, 255, 0.78)',
                  isPhase2,
                });
              } else if (bType === 'harald_hardrada') {
                bulletsRef.current.push({
                  x: spawnX,
                  y: spawnY,
                  vx: dirX * 3.1,
                  vy: (Math.random() - 0.5) * 1.6,
                  radius: 12,
                  type: 'boomerang_axe',
                  color: '#f43f5e',
                  rot: 0,
                  vRot: 0.32,
                  phaseTime: 0,
                  isPhase2,
                });
                bulletsRef.current.push({
                  x: bx + 30 + Math.random() * (bw - 60),
                  y: by - 14,
                  vx: (Math.random() - 0.5) * 1.5,
                  vy: 2.5,
                  radius: 11,
                  type: 'axe',
                  color: '#fb7185',
                  rot: 0,
                  vRot: 0.24,
                  isPhase2,
                });
              } else {
                [-1.35, 1.35].forEach((mvx) => {
                  bulletsRef.current.push({
                    x: bx + bw / 2 + (Math.random() - 0.5) * 50,
                    y: by + bh - 12,
                    vx: mvx,
                    vy: -4.3,
                    radius: 11,
                    type: 'magma',
                    color: '#f97316',
                    meta: { gravity: 0.14 },
                    trail: [],
                    isPhase2,
                  });
                });
              }
            }
          }
        } else if (currentStage === 'stage2_flappy') {
          // --------------------------------------------------------------------------
          // 【第二階段：水管鳥式北歐神話圖騰柱與冰柱躲避 (Stage 2: Norse Totem Poles & Glacial Icicles)】
          // 1. 根據戰鬥進度（BOSS 已損血比例 + 波次推進 + 狂暴狀態）動態調整障礙物移動速度、水平間距與垂直缺口間距
          // 2. 將障礙物設計為具有北歐神話元素的「盧恩獸首圖騰柱」與「尼福爾海姆萬年冰柱」
          // 3. 搭配上下蜿蜒的正弦路徑穿梭攻擊物，考驗玩家觀察節奏閃避
          // --------------------------------------------------------------------------
          sideWeaponsRef.current = [];
          setIsChaosSaberCssWaveActive(false);
          setActiveCssWeaponSide('none');

          // Calculate Dynamic Combat Progress (0.0 -> 1.0) based on Boss HP loss & wave progression
          const scaledMaxHp = Math.max(
            1,
            Math.round(currentChapter.boss.maxHp * (DIFFICULTY_CONFIGS[battleDifficultyRef.current]?.hpMult || 1.0))
          );
          const hpLostRatio = Math.max(0, Math.min(1, 1 - battleBossHpRef.current / scaledMaxHp));
          const waveProgress = Math.min(0.35, flappyWaveCountRef.current * 0.08);
          const combatProgress = Math.min(
            1,
            hpLostRatio * 0.72 + waveProgress + (isBerserkMode ? 0.22 : isPhase2 ? 0.12 : 0)
          );

          // Dynamically scale obstacle speed, spawn spacing, and vertical gap height with combatProgress!
          const pillarSpeed = 2.15 + combatProgress * 1.45;
          const pillarSpawnInterval = Math.max(25, Math.round(42 - combatProgress * 15));
          const dynamicGapHeight = Math.max(58, Math.round(82 - combatProgress * 22));
          const waveAmplitude = Math.round(24 + combatProgress * 12);

          atkState.bannerText = `🐦【第二階段：北歐神話圖騰柱與冰柱】速度 ${(pillarSpeed / 2.15).toFixed(2)}x · 間距 ${dynamicGapHeight}px`;
          atkState.bannerColor = '#4ade80';

          // Draw rhythmic undulating serpentine guide path across the battle box so player can observe the rhythm!
          ctx.save();
          ctx.strokeStyle = 'rgba(74, 222, 128, 0.25)';
          ctx.lineWidth = 1.5;
          ctx.setLineDash([4, 6]);
          ctx.beginPath();
          for (let gx = bx + 12; gx <= bx + bw - 12; gx += 8) {
            const relX = gx - bx;
            const guideY = by + bh / 2 + Math.sin(relX * 0.045 + bTick * 0.11) * waveAmplitude;
            if (gx === bx + 12) ctx.moveTo(gx, guideY);
            else ctx.lineTo(gx, guideY);
          }
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.restore();

          // (A) Spawn Norse Mythological Totem Poles / Glacial Icicles at dynamic spacing interval
          const lastPillar = flappyPillarsRef.current[flappyPillarsRef.current.length - 1];
          const minHorizSpacingPx = Math.max(68, Math.round(pillarSpawnInterval * pillarSpeed));
          const canSpawnNextPillar = !lastPillar || (bx + bw - 14) - lastPillar.x >= minHorizSpacingPx;

          if (canSpawnNextPillar) {
            flappyWaveCountRef.current++;
            const waveIdx = flappyWaveCountRef.current;
            const rhythmicOffset = Math.round(Math.sin(waveIdx * 1.15) * waveAmplitude);
            const gapCenterY = by + bh / 2 + rhythmicOffset;

            // Alternate or match Boss element between Norse Totem Pole ('runestone' / 'ship_mast' / 'organ_pipe' / 'basalt_magma') and Glacial Icicle ('fjord_ice' / 'bone_pine')
            const chosenPillarTheme: FlappyNordicPillar['theme'] =
              bType === 'harald_hardrada' || bType === 'sami_shaman'
                ? waveIdx % 2 === 1 ? 'fjord_ice' : curSpec.flappyTheme
                : waveIdx % 2 === 0 ? 'fjord_ice' : curSpec.flappyTheme;

            flappyPillarsRef.current.push({
              id: `pillar_${bTick}_${waveIdx}`,
              x: bx + bw - 14,
              width: 20,
              gapY: gapCenterY,
              gapHeight: dynamicGapHeight,
              passed: false,
              theme: chosenPillarTheme,
            });

            // (B) Spawn Serpentine Wave Attacker (上下蜿蜒路徑穿梭攻擊物) in the corridor gap between pillars
            if (bulletsRef.current.length < 3) {
              const centerWaveY = by + bh / 2 + Math.cos(waveIdx * 1.15) * 16;
              bulletsRef.current.push({
                x: bx + bw + 18,
                y: centerWaveY,
                baseY: centerWaveY,
                vx: -(pillarSpeed + 0.35),
                vy: 0,
                radius: 9,
                type: 'kantele_wave',
                char: curSpec.bulletChar,
                color: curSpec.meleeColor,
                amplitude: waveAmplitude,
                frequency: 0.13 + combatProgress * 0.04,
                trail: [],
                isPhase2,
              });
            }
          }

          // Update & Draw Norse Mythological Totem Poles & Glacial Icicles
          flappyPillarsRef.current.forEach((p) => {
            p.x -= pillarSpeed;
            const topPillarH = Math.max(10, p.gapY - p.gapHeight / 2 - by - 6);
            const bottomPillarY = p.gapY + p.gapHeight / 2;
            const bottomPillarH = Math.max(10, by + bh - 6 - bottomPillarY);

            ctx.save();
            if (p.theme === 'fjord_ice' || p.theme === 'bone_pine') {
              // =========================================================================
              // ❄️ 北歐神話極地萬年冰柱 (Niflheim Glacial Icicle & Frost Rune Spire)
              // =========================================================================
              const icePrimary = p.theme === 'bone_pine' ? '#67e8f9' : '#0284c7';
              const iceCore = '#e0f2fe';
              const iceEdge = '#bae6fd';

              // Top Icicle Spire (hanging from ceiling down to gap)
              ctx.fillStyle = icePrimary;
              ctx.strokeStyle = iceEdge;
              ctx.lineWidth = 1.8;
              ctx.beginPath();
              ctx.moveTo(p.x - 10, by + 6);
              ctx.lineTo(p.x + 10, by + 6);
              ctx.lineTo(p.x + 6, by + 6 + topPillarH * 0.65);
              ctx.lineTo(p.x + 9, by + 6 + topPillarH * 0.65);
              ctx.lineTo(p.x, by + 6 + topPillarH);
              ctx.lineTo(p.x - 9, by + 6 + topPillarH * 0.65);
              ctx.lineTo(p.x - 6, by + 6 + topPillarH * 0.65);
              ctx.closePath();
              ctx.fill();
              ctx.stroke();

              // Inner Crystalline Specular Ridge (Top Icicle)
              ctx.fillStyle = iceCore;
              ctx.beginPath();
              ctx.moveTo(p.x - 3, by + 8);
              ctx.lineTo(p.x + 3, by + 8);
              ctx.lineTo(p.x, by + 6 + topPillarH - 5);
              ctx.closePath();
              ctx.fill();

              // Bottom Icicle Spire (rising from floor up to gap)
              ctx.fillStyle = icePrimary;
              ctx.beginPath();
              ctx.moveTo(p.x - 10, bottomPillarY + bottomPillarH);
              ctx.lineTo(p.x + 10, bottomPillarY + bottomPillarH);
              ctx.lineTo(p.x + 6, bottomPillarY + bottomPillarH * 0.35);
              ctx.lineTo(p.x + 9, bottomPillarY + bottomPillarH * 0.35);
              ctx.lineTo(p.x, bottomPillarY);
              ctx.lineTo(p.x - 9, bottomPillarY + bottomPillarH * 0.35);
              ctx.lineTo(p.x - 6, bottomPillarY + bottomPillarH * 0.35);
              ctx.closePath();
              ctx.fill();
              ctx.stroke();

              // Inner Crystalline Specular Ridge (Bottom Icicle)
              ctx.fillStyle = iceCore;
              ctx.beginPath();
              ctx.moveTo(p.x - 3, bottomPillarY + bottomPillarH - 2);
              ctx.lineTo(p.x + 3, bottomPillarY + bottomPillarH - 2);
              ctx.lineTo(p.x, bottomPillarY + 5);
              ctx.closePath();
              ctx.fill();

              // Glowing Niflheim Frost Rune inside Icicle
              ctx.fillStyle = '#ffffff';
              ctx.font = 'bold 9px monospace';
              ctx.textAlign = 'center';
              if (topPillarH > 26) ctx.fillText('ᛇ', p.x, by + 6 + topPillarH * 0.45);
              if (bottomPillarH > 26) ctx.fillText('ᛁ', p.x, bottomPillarY + bottomPillarH * 0.6);
            } else {
              // =========================================================================
              // 🗿 北歐神話盧恩獸首圖騰柱 (Norse Mythological Odin/Yggdrasil Totem Pole)
              // =========================================================================
              const totemPalette =
                p.theme === 'runestone'
                  ? { body: '#0f172a', border: '#38bdf8', cap: '#1e293b', eye: '#7dd3fc', rune: 'ᛒ' }
                  : p.theme === 'ship_mast'
                  ? { body: '#451a03', border: '#2dd4bf', cap: '#78350f', eye: '#fde047', rune: 'ᚱ' }
                  : p.theme === 'organ_pipe'
                  ? { body: '#78350f', border: '#facc15', cap: '#92400e', eye: '#fef08a', rune: 'ᚠ' }
                  : { body: '#1e293b', border: '#f97316', cap: '#334155', eye: '#fde047', rune: 'ᛟ' };

              // Top & Bottom Totem Shafts
              ctx.fillStyle = totemPalette.body;
              ctx.strokeStyle = totemPalette.border;
              ctx.lineWidth = 2;
              ctx.fillRect(p.x - 8, by + 6, 16, topPillarH);
              ctx.strokeRect(p.x - 8, by + 6, 16, topPillarH);
              ctx.fillRect(p.x - 8, bottomPillarY, 16, bottomPillarH);
              ctx.strokeRect(p.x - 8, bottomPillarY, 16, bottomPillarH);

              // Carved Totem Beast Caps with Viking Horns at the Gap Jaws
              const topCapY = by + 6 + topPillarH - 12;
              ctx.fillStyle = totemPalette.cap;
              ctx.fillRect(p.x - 11, topCapY, 22, 12);
              ctx.strokeRect(p.x - 11, topCapY, 22, 12);
              ctx.fillRect(p.x - 11, bottomPillarY, 22, 12);
              ctx.strokeRect(p.x - 11, bottomPillarY, 22, 12);

              // Glowing Odin's Raven / Fenrir Totem Eyes on both Totem Heads
              ctx.fillStyle = totemPalette.eye;
              ctx.fillRect(p.x - 6, topCapY + 4, 3, 3);
              ctx.fillRect(p.x + 3, topCapY + 4, 3, 3);
              ctx.fillRect(p.x - 6, bottomPillarY + 5, 3, 3);
              ctx.fillRect(p.x + 3, bottomPillarY + 5, 3, 3);

              // Glowing Elder Futhark Runes carved along the Totem Pole
              ctx.fillStyle = totemPalette.border;
              ctx.font = 'bold 10px monospace';
              ctx.textAlign = 'center';
              if (topPillarH > 28) ctx.fillText(totemPalette.rune, p.x, topCapY - 6);
              if (bottomPillarH > 28) ctx.fillText('ᛏ', p.x, bottomPillarY + 24);
            }
            ctx.restore();

            // Check Flappy Pillar Collision with Soul ❤️
            const inHorizBounds = Math.abs(soul.x - p.x) < 10;
            const hitTop = soul.y - 7 < by + 6 + topPillarH;
            const hitBottom = soul.y + 7 > bottomPillarY;

            if (inHorizBounds && (hitTop || hitBottom) && soul.iFrames <= 0) {
              playRetroSound('hit');
              screenShakeRef.current = 12;
              soul.iFrames = 32;
              comboCountRef.current = 0;
              setComboCount(0);
              const pDmg = isBerserkMode ? 18 : 14;
              setPlayerState((prev) => {
                const nextHp = Math.max(0, prev.hp - pDmg);
                if (nextHp <= 0) setBattlePhase('defeat');
                return { ...prev, hp: nextHp };
              });
            } else if (!p.passed && p.x < soul.x - 10) {
              p.passed = true;
              comboCountRef.current++;
              setComboCount(comboCountRef.current);
              playRetroSound('blip');
            }
          });

          flappyPillarsRef.current = flappyPillarsRef.current.filter((p) => p.x > bx + 10);
        } else {
          // --------------------------------------------------------------------------
          // 【第三階段：強力激光射線 (Stage 3: Intermittent High-Energy Laser Beams & Weapon Fly-In)】
          // 僅召喚框外專屬神兵飛入並發射強力激光束貫穿戰場，不混雜一般彈幕或水管鳥柱子！
          // --------------------------------------------------------------------------
          flappyPillarsRef.current = [];
          bulletsRef.current = [];

          // Transition back to 'idle' breathing interval when current laser strike finishes
          if (atkState.activeMode !== 'idle' && bTick >= atkState.modeEndTick) {
            atkState.activeMode = 'idle';
            sideWeaponsRef.current = [];
            setIsChaosSaberCssWaveActive(false);
            setActiveCssWeaponSide('none');
            atkState.bannerText = '✨【第三階段：激光充能間歇】觀察下一道框外神兵與激光鎖定線！';
            atkState.bannerColor = '#94a3b8';
          }

          if (bTick >= atkState.nextAttackTick && atkState.activeMode === 'idle') {
            atkState.activeMode = 'weapon_strike';
            const useMelee = Math.random() < 0.5;
            const chosenType = useMelee ? curSpec.meleeType : curSpec.rangedType;
            const chosenName = useMelee ? curSpec.meleeName : curSpec.rangedName;
            const chosenColor = useMelee ? curSpec.meleeColor : curSpec.rangedColor;
            const chosenGlow = useMelee ? curSpec.meleeGlow : curSpec.rangedGlow;

            let chosenSide: 'left' | 'right' | 'top' =
              atkState.lastSide === 'left'
                ? Math.random() < 0.8 ? 'right' : 'top'
                : atkState.lastSide === 'right'
                ? Math.random() < 0.8 ? 'left' : 'top'
                : Math.random() < 0.5 ? 'left' : 'right';
            if (bType === 'surtr' && useMelee) {
              chosenSide = 'top';
            }
            atkState.lastSide = chosenSide;

            // Trigger CSS keyframe fly-in & motion blur slash trajectory from outside the frame!
            setIsChaosSaberCssWaveActive(false);
            setTimeout(() => {
              setIsChaosSaberCssWaveActive(true);
              setActiveCssWeaponSide(chosenSide);
            }, 0);
            atkState.cssHideTick = bTick + 38;

            const targetY = Math.max(by + 34, Math.min(by + bh - 34, soulPosRef.current.y + (Math.random() - 0.5) * 18));
            const targetX = Math.max(bx + 44, Math.min(bx + bw - 44, soulPosRef.current.x + (Math.random() - 0.5) * 18));

            sideWeaponsRef.current = [
              {
                id: `laser_stage3_${bType}_${bTick}`,
                type: chosenType,
                side: chosenSide,
                x: chosenSide === 'top' ? targetX : chosenSide === 'right' ? bx + bw + 26 : bx - 22,
                y: chosenSide === 'top' ? by - 36 : targetY,
                targetCoord: chosenSide === 'top' ? targetX : targetY,
                state: 'charging',
                chargeTicks: 18,
                maxChargeTicks: 18,
                fireTicks: 24,
                beamThickness: 24,
                color: chosenColor,
                glowColor: chosenGlow,
                name: chosenName,
              },
            ];

            atkState.modeEndTick = bTick + 44;
            const randomRestTicks = (isBerserkMode ? 20 : 26) + Math.floor(Math.random() * 18);
            atkState.nextAttackTick = atkState.modeEndTick + randomRestTicks;
            atkState.bannerText = `⚡【第三階段：強力激光】${chosenName}`;
            atkState.bannerColor = chosenColor;
          }

          // Update Laser Weapon State & Check High-Energy Beam Collision
          sideWeaponsRef.current.forEach((w) => {
            if (w.state === 'charging') {
              w.chargeTicks--;
              if (w.chargeTicks <= 0) {
                w.state = 'firing';
                if (w.beamThickness > 0) {
                  playRetroSound('laser');
                  screenShakeRef.current = 9;
                }
              }
            } else if (w.state === 'firing') {
              w.fireTicks--;
              if (w.fireTicks <= 0) {
                w.state = 'cooldown';
              } else if (w.beamThickness > 0) {
                const halfThick = w.beamThickness / 2;
                let isBeamHit = false;
                if (w.side === 'left' || w.side === 'right') {
                  if (
                    Math.abs(soulPosRef.current.y - w.targetCoord) < halfThick &&
                    soulPosRef.current.x >= bx - 8 &&
                    soulPosRef.current.x <= bx + bw + 8
                  ) {
                    isBeamHit = true;
                  }
                } else {
                  if (
                    Math.abs(soulPosRef.current.x - w.targetCoord) < halfThick &&
                    soulPosRef.current.y >= by - 8 &&
                    soulPosRef.current.y <= by + bh + 8
                  ) {
                    isBeamHit = true;
                  }
                }

                if (isBeamHit && soulPosRef.current.iFrames <= 0) {
                  if (aegisChargesRef.current > 0) {
                    aegisChargesRef.current--;
                    playRetroSound('aegis');
                    soulPosRef.current.iFrames = 35;
                    screenShakeRef.current = 8;
                    grazeIndicatorRef.current = {
                      x: soulPosRef.current.x,
                      y: soulPosRef.current.y - 18,
                      text: `🛡️ 英靈殿神盾抵消激光！(剩餘 ${aegisChargesRef.current} 次)`,
                      alpha: 1.0,
                    };
                  } else {
                    playRetroSound('hit');
                    screenShakeRef.current = 16;
                    soulPosRef.current.iFrames = 36;
                    comboCountRef.current = 0;
                    setComboCount(0);
                    const beamDmg = isBerserkMode ? 20 : isPhase2 ? 16 : 13;
                    setPlayerState((p) => {
                      const nextHp = Math.max(0, p.hp - beamDmg);
                      if (nextHp <= 0) setBattlePhase('defeat');
                      return { ...p, hp: nextHp };
                    });
                  }
                }
              }
            }
          });

          sideWeaponsRef.current = sideWeaponsRef.current.filter((w) => w.state !== 'cooldown');

          // Render Active Boss Laser Weapon outside arena box (only in Stage 3!)
          drawBossSideWeapons(ctx, sideWeaponsRef.current, { x: bx, y: by, w: bw, h: bh }, bTick);
        }

        // Single Clean HUD Banner above Box showing active combat stage & timer
        const stageProgressLabel =
          currentStage === 'stage1_danmaku'
            ? '【階段 1/3：彈幕射擊（攻擊後進階）】'
            : currentStage === 'stage2_flappy'
            ? '【階段 2/3：水管鳥北歐圖騰冰柱（攻擊後進階）】'
            : '【階段 3/3：強力激光射線（攻擊後循環）】';
        const attackStatusTitle = `${stageProgressLabel} ${atkState.bannerText || curSpec.meleeName} (⏱️${dodgeTimerRef.current.toFixed(1)}s)`;
        const attackStatusColor = atkState.bannerColor || curSpec.meleeColor;

        ctx.save();
        ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
        ctx.strokeStyle = attackStatusColor;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(bx - 16, by - 26, bw + 32, 20, [4]);
        ctx.fill();
        ctx.stroke();

        ctx.font = 'bold 9.5px monospace';
        ctx.fillStyle = attackStatusColor;
        ctx.textAlign = 'center';
        ctx.fillText(attackStatusTitle, bx + bw / 2, by - 13);
        ctx.restore();

        const nextBullets: UndertaleBullet[] = [];
        for (const b of bulletsRef.current) {
          b.phaseTime = (b.phaseTime || 0) + 1;
          if (b.lifeFrames !== undefined) {
            b.lifeFrames--;
            if (b.lifeFrames <= 0) continue;
          }

          // Boomerang Axe trajectory reversal physics
          if (b.type === 'boomerang_axe' && b.phaseTime > 22) {
            b.vx *= -1.02;
            b.vy = -Math.abs(b.vy) * 0.95;
          }

          // Temppeliaukio Rock Shrapnel Mid-air burst
          if (b.type === 'rock_shrapnel' && b.phaseTime === 24 && !b.hasShattered) {
            b.hasShattered = true;
            spawnBulletShatterFragments(b.x, b.y, '#ca8a04', '#fde047', 'stone_chip', 8);
            [[-2.4, 0], [2.4, 0], [0, -2.4], [0, 2.4]].forEach(([svx, svy]) => {
              nextBullets.push({
                x: b.x,
                y: b.y,
                vx: svx,
                vy: svy,
                radius: 7,
                type: 'pixel_shard',
                color: '#facc15',
                lifeFrames: 45,
              });
            });
          }

          // Muspelheim Magma Meteor Ground Impact Explosion
          if (b.type === 'meteor_magma' && b.y >= by + bh - 12 && !b.hasShattered) {
            b.hasShattered = true;
            spawnBulletShatterFragments(b.x, b.y, '#f97316', '#ea580c', 'lava_slag', 12);
            for (let m = 0; m < 4; m++) {
              nextBullets.push({
                x: b.x,
                y: b.y - 4,
                vx: (m - 1.5) * 2.2,
                vy: -(2.5 + Math.random() * 2),
                radius: 6,
                type: 'pixel_shard',
                color: '#ea580c',
                lifeFrames: 32,
              });
            }
          }

          const dxSoul = soul.x - b.x;
          const dySoul = soul.y - b.y;
          const distSoulPre = Math.hypot(dxSoul, dySoul);

          // ==========================================
          // PER-BOSS GRAVITATIONAL FIELD PHYSICS (引力場軌跡彎曲)
          // ==========================================
          b.isCurving = false;
          if (b.type === 'orbit_rune') {
            // 藍牙王：電磁符文引力場牽引環繞中心向玩家偏移，並螺旋擴張
            if (distSoulPre < 155 && b.orbitCenterX !== undefined && b.orbitCenterY !== undefined) {
              b.orbitCenterX += (soul.x - b.orbitCenterX) * 0.018;
              b.orbitCenterY += (soul.y - b.orbitCenterY) * 0.018;
              b.isCurving = true;
            }
            b.orbitAngle = (b.orbitAngle || 0) + (b.orbitSpeed || 0.06);
            b.orbitRadius = (b.orbitRadius || 16) + 0.65;
            const cx = b.orbitCenterX ?? (bx + bw / 2);
            const cy = b.orbitCenterY ?? (by + bh / 2);
            b.x = cx + Math.cos(b.orbitAngle) * b.orbitRadius;
            b.y = cy + Math.sin(b.orbitAngle) * b.orbitRadius;
          } else if (b.type === 'cobblestone' || b.type === 'cannonball' || b.type === 'anchor') {
            // 瓦薩船長：歷史鵝卵石砲彈與青銅重砲在接近玩家時產生引力軌跡彎曲！
            if (distSoulPre < 145 && distSoulPre > 14) {
              const curSpd = Math.hypot(b.vx, b.vy) || 2.8;
              const pullStrength = b.type === 'cobblestone' ? 0.14 : 0.095;
              b.vx += (dxSoul / distSoulPre) * pullStrength;
              b.vy += (dySoul / distSoulPre) * pullStrength;
              const newSpd = Math.hypot(b.vx, b.vy) || 1;
              b.vx = (b.vx / newSpd) * curSpd;
              b.vy = (b.vy / newSpd) * curSpd;
              b.isCurving = true;
            }
            b.x += b.vx;
            b.y += b.vy;
            if (!b.trail) b.trail = [];
            b.trail.push({ x: b.x, y: b.y });
            if (b.trail.length > 8) b.trail.shift();
          } else if (b.type === 'kantele_wave') {
            // 萬奈摩寧：芬蘭琴弦正弦波音符軌跡 + 接近玩家時產生共鳴引力偏移
            if (distSoulPre < 130 && distSoulPre > 14 && b.baseY !== undefined) {
              b.baseY += (soul.y - b.baseY) * 0.032;
              b.isCurving = true;
            }
            b.x += b.vx;
            const base = b.baseY ?? b.y;
            b.y = base + Math.sin(b.phaseTime * (b.frequency || 0.14)) * (b.amplitude || 12);
            if (!b.trail) b.trail = [];
            b.trail.push({ x: b.x, y: b.y });
            if (b.trail.length > 10) b.trail.shift();
          } else if (b.type === 'magma' && b.meta?.gravity) {
            // Surtr：火山岩漿拋物線重力軌跡 + 熔岩引力彎曲
            if (distSoulPre < 135 && distSoulPre > 15) {
              b.vx += (dxSoul / distSoulPre) * 0.085;
              b.isCurving = true;
            }
            b.vy += b.meta.gravity;
            b.x += b.vx;
            b.y += b.vy;
            if (!b.trail) b.trail = [];
            b.trail.push({ x: b.x, y: b.y });
            if (b.trail.length > 7) b.trail.shift();
          } else {
            // 藍牙符文波動、薩米極圈切割刃、萬奈摩寧花崗岩、哈拉爾戰斧、跨年煙火接近玩家時的引力微幅彎曲
            if (
              distSoulPre < 130 &&
              distSoulPre > 16 &&
              (b.type === 'rune' || b.type === 'polar_cutter' || b.type === 'antler' || b.type === 'rock_block' || b.type === 'axe' || b.type === 'firework')
            ) {
              const pull = 0.075;
              b.vx += (dxSoul / distSoulPre) * pull;
              b.vy += (dySoul / distSoulPre) * pull;
              b.isCurving = true;
            }
            if (b.amplitude && b.frequency) {
              b.x += b.vx + Math.cos(b.phaseTime * b.frequency) * b.amplitude;
            } else {
              b.x += b.vx;
            }
            b.y += b.vy;
          }

          // Render Gravitational Bending Tether & Wake when bullet trajectory is curving toward Soul (引力軌跡彎曲視覺張力線)
          if (b.isCurving && distSoulPre < 145) {
            ctx.save();
            ctx.strokeStyle = b.type === 'cobblestone' || b.type === 'cannonball'
              ? 'rgba(45, 212, 191, 0.35)'
              : 'rgba(56, 189, 248, 0.28)';
            ctx.lineWidth = 1.2;
            ctx.setLineDash([3, 4]);
            ctx.beginPath();
            ctx.moveTo(b.x, b.y);
            ctx.quadraticCurveTo(
              (b.x + soul.x) / 2 + (b.vy * 4),
              (b.y + soul.y) / 2 - (b.vx * 4),
              soul.x,
              soul.y
            );
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.restore();
          }

          // ==========================================
          // PER-BOSS SHATTER PHYSICS ON WALL / ORBIT / FLOOR IMPACT (撞擊碎裂小型像素碎片飛散)
          // ==========================================
          const leftWall = currentChapter.boss.bossType === 'captain_vasa' ? bx + 100 : bx;
          const rightWall = currentChapter.boss.bossType === 'captain_vasa' ? bx + bw - 100 : bx + bw;

          // 1. 藍牙王的符文環繞 (`orbit_rune`) 與符文波 (`rune`) 撞擊邊界或達到臨界半徑時碎裂成小型像素碎片飛散！
          if (
            b.type === 'orbit_rune' &&
            !b.hasShattered &&
            ((b.orbitRadius || 0) >= 84 || b.x <= bx + 10 || b.x >= bx + bw - 10 || b.y <= by + 10 || b.y >= by + bh - 10)
          ) {
            b.hasShattered = true;
            spawnBulletShatterFragments(b.x, b.y, '#38bdf8', '#fde047', 'rune_frag', 12, b.char);
            // Spawn 2 small pixel rune fragments that scatter dynamically
            for (let sf = 0; sf < 2; sf++) {
              const sAng = (b.orbitAngle || 0) + (sf === 0 ? 0.65 : -0.65);
              nextBullets.push({
                x: b.x,
                y: b.y,
                vx: Math.cos(sAng) * 2.9,
                vy: Math.sin(sAng) * 2.9,
                radius: 4.5,
                type: 'pixel_shard',
                color: sf === 0 ? '#38bdf8' : '#fde047',
                char: b.char || 'ᛒ',
                lifeFrames: 34,
                isPhase2,
              });
            }
            continue;
          }

          // 2. 瓦薩船長的歷史鵝卵石砲彈 (`cobblestone`) 與青銅重砲 (`cannonball`) 撞擊窄巷石牆時反彈並迸發碎石像素碎片！
          if (b.bouncesLeft && b.bouncesLeft > 0) {
            if (b.x <= leftWall + b.radius + 2 || b.x >= rightWall - b.radius - 2) {
              b.vx = -b.vx;
              b.bouncesLeft--;
              playRetroSound('blip');
              spawnBulletShatterFragments(
                b.x,
                b.y,
                b.type === 'cobblestone' ? '#94a3b8' : '#2dd4bf',
                '#fbbf24',
                'stone_chip',
                10
              );
            }
          }

          // 3. 各 BOSS 專屬彈幕撞擊戰鬥框底部或側牆時的碎裂物理效果 (Nyhavn House, Cobblestone, Rock Block, Polar Cutter, Axe, Magma, Firework)
          if (!b.hasShattered && b.type !== 'pixel_shard' && b.type !== 'aurora_beam') {
            const hitBottom = b.y >= by + bh - b.radius - 2 && b.vy > 0;
            const hitSide = (b.x <= leftWall + b.radius + 1 && b.vx < 0) || (b.x >= rightWall - b.radius - 1 && b.vx > 0);

            if (hitBottom && (b.type === 'rune' || b.type === 'nyhavn_house' || b.type === 'cobblestone' || b.type === 'rock_block' || b.type === 'magma' || b.type === 'antler')) {
              b.hasShattered = true;
              const shardKind: DanmakuShatterShard['kind'] =
                b.type === 'magma'
                  ? 'lava_slag'
                  : b.type === 'cobblestone' || b.type === 'rock_block'
                  ? 'stone_chip'
                  : b.type === 'antler'
                  ? 'ice_crystal'
                  : 'rune_frag';
              spawnBulletShatterFragments(b.x, by + bh - 6, b.color, '#fde047', shardKind, 11, b.char);
              continue;
            } else if (hitSide && (b.type === 'polar_cutter' || b.type === 'kantele_wave' || b.type === 'axe')) {
              b.hasShattered = true;
              const shardKind: DanmakuShatterShard['kind'] =
                b.type === 'polar_cutter' ? 'ice_crystal' : b.type === 'kantele_wave' ? 'gold_spark' : 'stone_chip';
              spawnBulletShatterFragments(b.x, b.y, b.color, '#ffffff', shardKind, 10, b.char);
              continue;
            } else if (b.type === 'firework' && b.phaseTime === 34) {
              // 跨年煙火彈在半空中碎裂綻放星芒像素碎片
              b.hasShattered = true;
              spawnBulletShatterFragments(b.x, b.y, b.color, '#fde047', 'gold_spark', 14);
              continue;
            }
          }

          if (b.rot !== undefined && b.vRot !== undefined) {
            b.rot += b.vRot;
          }

          if (b.type === 'pixel_shard') {
            ctx.save();
            ctx.translate(b.x, b.y);
            ctx.rotate((b.phaseTime || 0) * 0.25);
            ctx.fillStyle = b.color;
            ctx.shadowColor = b.color;
            ctx.shadowBlur = 8;
            ctx.fillRect(-3.5, -3.5, 7, 7);
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(-1.5, -1.5, 3, 3);
            ctx.restore();
          } else if (b.type === 'orbit_rune') {
            ctx.save();
            const cx = b.orbitCenterX ?? (bx + bw / 2);
            const cy = b.orbitCenterY ?? (by + bh / 2);
            // Draw subtle glowing Bluetooth orbital ring
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.18)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(cx, cy, b.orbitRadius || 20, 0, Math.PI * 2);
            ctx.stroke();

            ctx.translate(b.x, b.y);
            ctx.fillStyle = 'rgba(12, 74, 110, 0.85)';
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 2;
            ctx.shadowColor = '#38bdf8';
            ctx.shadowBlur = 12;
            ctx.beginPath();
            ctx.arc(0, 0, b.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            ctx.font = 'bold 14px serif';
            ctx.fillStyle = '#e0f2fe';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(b.char || 'ᛒ', 0, 0);
            ctx.restore();
          } else if (b.type === 'polar_cutter') {
            // 北緯 66°33' 極圈界線軌道切割光刃
            ctx.save();
            ctx.translate(b.x, b.y);
            if (b.rot !== undefined) ctx.rotate(b.rot);
            ctx.shadowColor = '#67e8f9';
            ctx.shadowBlur = 12;
            ctx.strokeStyle = '#ffffff';
            ctx.fillStyle = 'rgba(6, 182, 212, 0.55)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            for (let k = 0; k < 4; k++) {
              const ang = (k * Math.PI) / 2;
              ctx.lineTo(Math.cos(ang) * (b.radius + 4), Math.sin(ang) * (b.radius + 4));
              ctx.lineTo(Math.cos(ang + Math.PI / 4) * 5, Math.sin(ang + Math.PI / 4) * 5);
            }
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            ctx.restore();
          } else if (b.type === 'kantele_wave') {
            // 萬奈摩寧：芬蘭琴五弦音符軌跡 (Golden Harmonic Trail + Glowing Note)
            ctx.save();
            if (b.trail && b.trail.length > 1) {
              ctx.strokeStyle = b.color;
              ctx.lineWidth = 2.2;
              ctx.globalAlpha = 0.55;
              ctx.beginPath();
              b.trail.forEach((pt, idx) => {
                if (idx === 0) ctx.moveTo(pt.x, pt.y);
                else ctx.lineTo(pt.x, pt.y);
              });
              ctx.stroke();
              ctx.globalAlpha = 1;
            }
            ctx.translate(b.x, b.y);
            ctx.shadowColor = b.color;
            ctx.shadowBlur = 12;
            ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
            ctx.strokeStyle = b.color;
            ctx.lineWidth = 1.8;
            ctx.beginPath();
            ctx.arc(0, 0, b.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.font = 'bold 15px sans-serif';
            ctx.fillStyle = b.color;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(b.char || '♪', 0, 0);
            ctx.restore();
          } else if (b.type === 'anchor') {
            ctx.save();
            ctx.translate(b.x, b.y);
            if (b.rot !== undefined) ctx.rotate(b.rot);

            const anchorColor = b.isPhase2 ? '#0d9488' : '#475569';
            const ringColor = b.isPhase2 ? '#2dd4bf' : '#94a3b8';
            const glowColor = b.isPhase2 ? 'rgba(45, 212, 191, 0.4)' : 'rgba(148, 163, 184, 0.3)';

            // 1. Spectral Ocean Halo & Trailing Water Cavitation
            ctx.fillStyle = glowColor;
            ctx.beginPath();
            ctx.arc(0, 0, 18, 0, Math.PI * 2);
            ctx.fill();

            // 2. Heavy Iron Ring & Crown Chain
            ctx.strokeStyle = ringColor;
            ctx.lineWidth = 2.8;
            ctx.beginPath();
            ctx.arc(0, -13, 5, 0, Math.PI * 2);
            ctx.stroke();

            // Ghostly Chain Links trailing upwards
            ctx.strokeStyle = b.isPhase2 ? '#5eead4' : '#cbd5e1';
            ctx.lineWidth = 1.6;
            ctx.strokeRect(-2, -22, 4, 6);

            // 3. Central Anchor Shank (垂直鐵柄)
            ctx.fillStyle = anchorColor;
            ctx.fillRect(-2.5, -9, 5, 22);

            // 4. Wooden / Brass Stock Crossbar (橫桿木柄與金屬栓)
            ctx.fillStyle = b.isPhase2 ? '#115e59' : '#334155';
            ctx.fillRect(-11, -5, 22, 4);
            ctx.fillStyle = '#facc15';
            ctx.fillRect(-12, -4.5, 2, 3);
            ctx.fillRect(10, -4.5, 2, 3);

            // 5. Curved Barbed Flukes (弧形重鐵錨爪)
            ctx.strokeStyle = b.isPhase2 ? '#14b8a6' : '#64748b';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.arc(0, 7, 10, 0.15, Math.PI - 0.15);
            ctx.stroke();

            // Sharp Metallic Triangular Bill Highlights (鋒利尖刃高光)
            ctx.fillStyle = b.isPhase2 ? '#a7f3d0' : '#f8fafc';
            ctx.beginPath();
            ctx.moveTo(-13, 3);
            ctx.lineTo(-8, 9);
            ctx.lineTo(-13, 9);
            ctx.closePath();
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(13, 3);
            ctx.lineTo(8, 9);
            ctx.lineTo(13, 9);
            ctx.closePath();
            ctx.fill();

            ctx.restore();
          } else if (b.type === 'aurora_beam') {
            b.beamProgress = (b.beamProgress || 0) + 1;
            const beamW = b.width || 34;
            const isFiring = b.beamProgress > (b.isPhase2 ? 18 : 22);

            if (!isFiring) {
              // Pre-fire Warning Laser Telegraph: Pulsing warning line with ionization spark beacons
              const warnAlpha = Math.sin(b.beamProgress * 0.4) * 0.3 + 0.65;
              ctx.strokeStyle = b.isPhase2 ? `rgba(244, 63, 94, ${warnAlpha})` : `rgba(56, 189, 248, ${warnAlpha})`;
              ctx.lineWidth = b.isPhase2 ? 3 : 2;
              ctx.setLineDash([6, 6]);
              ctx.beginPath();
              ctx.moveTo(b.x, by);
              ctx.lineTo(b.x, by + bh);
              ctx.stroke();
              ctx.setLineDash([]);

              // Warning Diamond Runes along the telegraph line
              for (let wr = 0; wr < 4; wr++) {
                const wry = by + (bh * (wr + 1)) / 5;
                ctx.fillStyle = b.isPhase2 ? '#fb7185' : '#67e8f9';
                ctx.beginPath();
                ctx.arc(b.x, wry, 3, 0, Math.PI * 2);
                ctx.fill();
              }
            } else {
              // Firing Stage: Multi-layer Aurora Plasma Pillar
              const waveOff = Math.sin(bTick * 0.2) * 4;
              const gradCurtain = ctx.createLinearGradient(b.x - beamW * 0.7 + waveOff, by, b.x + beamW * 0.7 + waveOff, by);
              if (b.isPhase2) {
                gradCurtain.addColorStop(0, 'rgba(244, 63, 94, 0.4)');
                gradCurtain.addColorStop(0.5, 'rgba(217, 70, 239, 0.65)');
                gradCurtain.addColorStop(1, 'rgba(168, 85, 247, 0.4)');
              } else {
                gradCurtain.addColorStop(0, 'rgba(16, 185, 129, 0.4)');
                gradCurtain.addColorStop(0.5, 'rgba(6, 182, 212, 0.65)');
                gradCurtain.addColorStop(1, 'rgba(129, 140, 248, 0.4)');
              }
              ctx.fillStyle = gradCurtain;
              ctx.fillRect(b.x - beamW * 0.7 + waveOff, by, beamW * 1.4, bh);

              const gradCore = ctx.createLinearGradient(b.x - beamW / 2, by, b.x + beamW / 2, by);
              if (b.isPhase2) {
                gradCore.addColorStop(0, 'rgba(225, 29, 72, 0.85)');
                gradCore.addColorStop(0.5, 'rgba(251, 191, 36, 0.95)');
                gradCore.addColorStop(1, 'rgba(225, 29, 72, 0.85)');
              } else {
                gradCore.addColorStop(0, 'rgba(14, 165, 233, 0.85)');
                gradCore.addColorStop(0.5, 'rgba(52, 211, 153, 0.95)');
                gradCore.addColorStop(1, 'rgba(14, 165, 233, 0.85)');
              }
              ctx.fillStyle = gradCore;
              ctx.fillRect(b.x - beamW / 2, by, beamW, bh);

              ctx.fillStyle = '#ffffff';
              ctx.fillRect(b.x - 4, by, 8, bh);

              for (let sp = 0; sp < 4; sp++) {
                const spY = by + (sp * 45 + bTick * 4) % bh;
                const spDir = sp % 2 === 0 ? 1 : -1;
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(b.x + spDir * (beamW / 2), spY);
                ctx.lineTo(b.x + spDir * (beamW / 2 + 6), spY + 4);
                ctx.stroke();
              }
            }
          } else if (b.type === 'rune') {
            ctx.save();
            ctx.translate(b.x, b.y);
            if (b.rot !== undefined) ctx.rotate(b.rot);

            const runeHalo = b.isPhase2 ? '#f43f5e' : '#38bdf8';
            const runeStone = b.isPhase2 ? 'rgba(76, 5, 25, 0.7)' : 'rgba(8, 47, 73, 0.7)';

            ctx.fillStyle = runeStone;
            ctx.strokeStyle = runeHalo;
            ctx.lineWidth = 1.8;
            ctx.shadowColor = runeHalo;
            ctx.shadowBlur = b.isPhase2 ? 14 : 10;
            ctx.beginPath();
            for (let s = 0; s < 6; s++) {
              const sAng = (s / 6) * Math.PI * 2;
              const sx = Math.cos(sAng) * (b.radius + 4);
              const sy = Math.sin(sAng) * (b.radius + 4);
              if (s === 0) ctx.moveTo(sx, sy);
              else ctx.lineTo(sx, sy);
            }
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            ctx.strokeStyle = b.isPhase2 ? '#fbbf24' : '#7dd3fc';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(0, 0, b.radius - 2, 0, Math.PI * 2);
            ctx.stroke();

            ctx.font = 'bold 15px serif';
            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(b.char || 'ᚠ', 0, 0);

            ctx.restore();
          } else if (b.type === 'note') {
            ctx.save();
            ctx.translate(b.x, b.y);
            ctx.shadowColor = b.isPhase2 ? '#818cf8' : '#fde047';
            ctx.shadowBlur = 10;

            ctx.strokeStyle = b.isPhase2 ? 'rgba(167, 139, 250, 0.5)' : 'rgba(254, 240, 138, 0.5)';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(0, 0, 11, 0, Math.PI * 2);
            ctx.stroke();

            ctx.font = 'bold 16px sans-serif';
            ctx.fillStyle = b.color;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(b.char || '♪', 0, 0);
            ctx.restore();
          } else if (b.type === 'axe') {
            ctx.save();
            ctx.translate(b.x, b.y);
            if (b.rot !== undefined) ctx.rotate(b.rot);

            ctx.strokeStyle = b.isPhase2 ? 'rgba(244, 63, 94, 0.4)' : 'rgba(147, 197, 253, 0.35)';
            ctx.lineWidth = 1.6;
            ctx.beginPath();
            ctx.arc(0, 0, 14, 0, Math.PI * 2);
            ctx.stroke();

            ctx.fillStyle = '#78350f';
            ctx.fillRect(-2, -12, 4, 24);

            ctx.fillStyle = b.color;
            ctx.beginPath();
            ctx.arc(-6, -6, 7, -Math.PI / 2, Math.PI / 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(6, -6, 7, Math.PI / 2, -Math.PI / 2);
            ctx.fill();

            ctx.fillStyle = '#ffffff';
            ctx.fillRect(-8, -12, 1.5, 12);
            ctx.fillRect(7, -12, 1.5, 12);
            ctx.restore();
          } else if (b.type === 'cannonball') {
            ctx.save();
            ctx.fillStyle = 'rgba(71, 85, 105, 0.35)';
            ctx.beginPath();
            ctx.arc(b.x - b.vx * 2, b.y - b.vy * 2, b.radius * 0.7, 0, Math.PI * 2);
            ctx.fill();

            const cbGrad = ctx.createRadialGradient(b.x - 3, b.y - 3, 1, b.x, b.y, b.radius);
            cbGrad.addColorStop(0, '#64748b');
            cbGrad.addColorStop(0.6, '#1e293b');
            cbGrad.addColorStop(1, '#020617');
            ctx.fillStyle = cbGrad;
            ctx.beginPath();
            ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = b.isCurving ? '#fbbf24' : b.isPhase2 ? '#2dd4bf' : '#94a3b8';
            ctx.lineWidth = 1.8;
            ctx.stroke();
            ctx.restore();
          } else if (b.type === 'nyhavn_house') {
            ctx.save();
            ctx.translate(b.x, b.y);
            if (b.rot !== undefined) ctx.rotate(b.rot);
            ctx.fillStyle = b.color;
            ctx.fillRect(-11, -7, 22, 18);
            ctx.fillStyle = '#7f1d1d';
            ctx.beginPath();
            ctx.moveTo(-13, -7);
            ctx.lineTo(0, -18);
            ctx.lineTo(13, -7);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(-8, -3, 5, 5);
            ctx.fillRect(3, -3, 5, 5);
            ctx.fillRect(-8, 5, 5, 5);
            ctx.fillRect(3, 5, 5, 5);
            ctx.restore();
          } else if (b.type === 'water_bubble') {
            ctx.save();
            ctx.translate(b.x, b.y);
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 1.8;
            ctx.fillStyle = 'rgba(56, 189, 248, 0.25)';
            ctx.beginPath();
            ctx.arc(0, 0, b.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(-b.radius * 0.35, -b.radius * 0.35, b.radius * 0.25, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          } else if (b.type === 'mosaic_shard') {
            ctx.save();
            ctx.translate(b.x, b.y);
            if (b.rot !== undefined) ctx.rotate(b.rot);
            ctx.fillStyle = '#fef08a';
            ctx.strokeStyle = '#ca8a04';
            ctx.lineWidth = 1.5;
            ctx.shadowColor = '#eab308';
            ctx.shadowBlur = 8;
            ctx.fillRect(-b.radius, -b.radius * 0.6, b.radius * 2, b.radius * 1.2);
            ctx.strokeRect(-b.radius, -b.radius * 0.6, b.radius * 2, b.radius * 1.2);
            ctx.restore();
          } else if (b.type === 'cobblestone') {
            // 瓦薩船長：1520 大廣場歷史鵝卵石砲彈 + 引力彎曲軌跡尾跡
            ctx.save();
            if (b.trail && b.trail.length > 1) {
              ctx.strokeStyle = b.isCurving ? 'rgba(251, 191, 36, 0.5)' : 'rgba(148, 163, 184, 0.35)';
              ctx.lineWidth = 2.2;
              ctx.beginPath();
              b.trail.forEach((pt, idx) => {
                if (idx === 0) ctx.moveTo(pt.x, pt.y);
                else ctx.lineTo(pt.x, pt.y);
              });
              ctx.stroke();
            }
            ctx.translate(b.x, b.y);
            if (b.rot !== undefined) ctx.rotate(b.rot);
            ctx.fillStyle = '#334155';
            ctx.strokeStyle = b.isCurving ? '#fbbf24' : '#64748b';
            ctx.lineWidth = b.isCurving ? 2.4 : 2;
            ctx.beginPath();
            ctx.arc(0, 0, b.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = '#1e293b';
            ctx.fillRect(-4, -4, 3, 3);
            ctx.fillRect(2, 2, 3, 3);
            ctx.restore();
          } else if (b.type === 'letter') {
            ctx.save();
            ctx.translate(b.x, b.y);
            if (b.rot !== undefined) ctx.rotate(b.rot);
            ctx.fillStyle = '#f8fafc';
            ctx.strokeStyle = '#94a3b8';
            ctx.lineWidth = 1.4;
            ctx.fillRect(-12, -8, 24, 16);
            ctx.strokeRect(-12, -8, 24, 16);
            ctx.fillStyle = '#dc2626';
            ctx.fillRect(5, -6, 5, 5);
            ctx.strokeStyle = '#cbd5e1';
            ctx.beginPath();
            ctx.moveTo(-12, -8);
            ctx.lineTo(0, 2);
            ctx.lineTo(12, -8);
            ctx.stroke();
            ctx.restore();
          } else if (b.type === 'antler') {
            ctx.save();
            ctx.translate(b.x, b.y);
            if (b.rot !== undefined) ctx.rotate(b.rot);
            ctx.strokeStyle = '#d97706';
            ctx.fillStyle = '#fed7aa';
            ctx.lineWidth = 2.4;
            ctx.beginPath();
            ctx.moveTo(-10, 8);
            ctx.quadraticCurveTo(-4, 0, -2, -10);
            ctx.quadraticCurveTo(4, -4, 10, -8);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(-4, -2);
            ctx.lineTo(-8, -6);
            ctx.moveTo(2, -4);
            ctx.lineTo(6, -2);
            ctx.stroke();
            ctx.restore();
          } else if (b.type === 'sauna_steam') {
            ctx.save();
            ctx.translate(b.x, b.y);
            ctx.fillStyle = 'rgba(241, 245, 249, 0.45)';
            ctx.beginPath();
            ctx.arc(0, 0, b.radius, 0, Math.PI * 2);
            ctx.arc(-6, 4, b.radius * 0.7, 0, Math.PI * 2);
            ctx.arc(6, 4, b.radius * 0.7, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          } else if (b.type === 'rock_block') {
            ctx.save();
            ctx.translate(b.x, b.y);
            if (b.rot !== undefined) ctx.rotate(b.rot);
            ctx.fillStyle = '#475569';
            ctx.strokeStyle = '#94a3b8';
            ctx.lineWidth = 1.8;
            ctx.beginPath();
            ctx.moveTo(-b.radius, -b.radius * 0.6);
            ctx.lineTo(0, -b.radius);
            ctx.lineTo(b.radius, -b.radius * 0.4);
            ctx.lineTo(b.radius * 0.8, b.radius * 0.8);
            ctx.lineTo(-b.radius * 0.6, b.radius);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            ctx.strokeStyle = '#d97706';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(-4, -6);
            ctx.lineTo(2, 4);
            ctx.stroke();
            ctx.restore();
          } else if (b.type === 'geyser_spout') {
            ctx.save();
            ctx.translate(b.x, b.y);
            const gGrad = ctx.createLinearGradient(0, -b.radius * 2, 0, b.radius * 2);
            gGrad.addColorStop(0, '#ffffff');
            gGrad.addColorStop(0.4, '#38bdf8');
            gGrad.addColorStop(1, '#0284c7');
            ctx.fillStyle = gGrad;
            ctx.beginPath();
            ctx.ellipse(0, 0, b.radius * 0.75, b.radius * 1.5, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(-b.radius * 0.5, -b.radius * 1.2, 3, 0, Math.PI * 2);
            ctx.arc(b.radius * 0.5, -b.radius * 1.2, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          } else if (b.type === 'firework') {
            ctx.save();
            ctx.translate(b.x, b.y);
            ctx.shadowColor = b.color;
            ctx.shadowBlur = 10;
            ctx.fillStyle = b.color;
            ctx.beginPath();
            ctx.arc(0, 0, b.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.moveTo(-b.radius * 1.5, 0);
            ctx.lineTo(b.radius * 1.5, 0);
            ctx.moveTo(0, -b.radius * 1.5);
            ctx.lineTo(0, b.radius * 1.5);
            ctx.stroke();
            ctx.restore();
          } else if (b.type === 'snowflake') {
            ctx.save();
            ctx.translate(b.x, b.y);
            ctx.shadowColor = '#38bdf8';
            ctx.shadowBlur = 8;
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1.8;
            for (let arm = 0; arm < 3; arm++) {
              const aAng = (arm * Math.PI) / 3 + (b.rot || 0);
              ctx.beginPath();
              ctx.moveTo(-Math.cos(aAng) * b.radius, -Math.sin(aAng) * b.radius);
              ctx.lineTo(Math.cos(aAng) * b.radius, Math.sin(aAng) * b.radius);
              ctx.stroke();
            }
            ctx.fillStyle = '#67e8f9';
            ctx.beginPath();
            ctx.arc(0, 0, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          } else if (b.type === 'laser_cross') {
            // 電磁雙向十字雷射
            b.beamProgress = (b.beamProgress || 0) + 1;
            const isFiring = b.beamProgress > 18;
            ctx.save();
            if (!isFiring) {
              // Warning cross lines
              const wAlpha = Math.sin(b.beamProgress * 0.45) * 0.35 + 0.65;
              ctx.strokeStyle = `rgba(56, 189, 248, ${wAlpha})`;
              ctx.lineWidth = 1.8;
              ctx.setLineDash([6, 6]);
              ctx.beginPath();
              ctx.moveTo(bx, b.y);
              ctx.lineTo(bx + bw, b.y);
              ctx.moveTo(b.x, by);
              ctx.lineTo(b.x, by + bh);
              ctx.stroke();
              ctx.setLineDash([]);
              ctx.font = 'bold 12px serif';
              ctx.fillStyle = '#fde047';
              ctx.textAlign = 'center';
              ctx.fillText('⚡', b.x, b.y + 4);
            } else {
              // Firing cross laser beam
              ctx.fillStyle = b.color;
              ctx.shadowColor = b.color;
              ctx.shadowBlur = 14;
              ctx.fillRect(bx, b.y - 10, bw, 20);
              ctx.fillRect(b.x - 10, by, 20, bh);
              ctx.fillStyle = '#ffffff';
              ctx.fillRect(bx, b.y - 3, bw, 6);
              ctx.fillRect(b.x - 3, by, 6, bh);
            }
            ctx.restore();
          } else if (b.type === 'spiral_rune') {
            // 螺旋盧恩風暴符文
            ctx.save();
            ctx.translate(b.x, b.y);
            if (b.rot !== undefined) ctx.rotate(b.rot);
            ctx.shadowColor = b.color;
            ctx.shadowBlur = 10;
            ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
            ctx.strokeStyle = b.color;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(0, 0, b.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.font = 'bold 13px serif';
            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(b.char || 'ᛒ', 0, 0);
            ctx.restore();
          } else if (b.type === 'broadside_cannon') {
            // 側舷火砲齊射
            ctx.save();
            ctx.translate(b.x, b.y);
            ctx.shadowColor = '#2dd4bf';
            ctx.shadowBlur = 8;
            ctx.fillStyle = '#0f766e';
            ctx.strokeStyle = '#5eead4';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(0, 0, b.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(-2, -2, 4, 4);
            ctx.restore();
          } else if (b.type === 'kraken_tentacle') {
            // 克拉肯幽靈觸手
            b.phaseTime = (b.phaseTime || 0) + 1;
            ctx.save();
            ctx.translate(b.x, b.y);
            const tBob = Math.sin(b.phaseTime * 0.12) * 8;
            ctx.shadowColor = '#10b981';
            ctx.shadowBlur = 12;
            ctx.fillStyle = 'rgba(16, 185, 129, 0.75)';
            ctx.strokeStyle = '#a7f3d0';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.ellipse(tBob, 0, b.radius, b.radius * 1.5, 0.2, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.restore();
          } else if (b.type === 'fenrir_claw') {
            // 芬里爾神狼爪痕
            ctx.save();
            ctx.translate(b.x, b.y);
            if (b.rot !== undefined) ctx.rotate(b.rot);
            ctx.strokeStyle = b.color;
            ctx.lineWidth = 2.5;
            ctx.shadowColor = b.color;
            ctx.shadowBlur = 10;
            ctx.beginPath();
            for (let c = -1; c <= 1; c++) {
              ctx.moveTo(-16, c * 6 - 8);
              ctx.lineTo(16, c * 6 + 8);
            }
            ctx.stroke();
            ctx.restore();
          } else if (b.type === 'ice_vortex') {
            // 極地暴風雪冰晶旋渦
            ctx.save();
            ctx.translate(b.x, b.y);
            if (b.rot !== undefined) ctx.rotate(b.rot);
            ctx.shadowColor = '#38bdf8';
            ctx.shadowBlur = 10;
            ctx.strokeStyle = '#67e8f9';
            ctx.lineWidth = 1.8;
            for (let k = 0; k < 4; k++) {
              const a = (k * Math.PI) / 2;
              ctx.strokeRect(Math.cos(a) * 8 - 3, Math.sin(a) * 8 - 3, 6, 6);
            }
            ctx.restore();
          } else if (b.type === 'kantele_cascade') {
            // 五弦琴琶音瀑布音符
            ctx.save();
            ctx.translate(b.x, b.y);
            ctx.shadowColor = b.color;
            ctx.shadowBlur = 12;
            ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
            ctx.strokeStyle = b.color;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(0, 0, b.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.font = 'bold 14px sans-serif';
            ctx.fillStyle = b.color;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(b.char || '♪', 0, 0);
            ctx.restore();
          } else if (b.type === 'rock_shrapnel') {
            // 爆裂花崗岩碎塊
            ctx.save();
            ctx.translate(b.x, b.y);
            ctx.fillStyle = '#b45309';
            ctx.strokeStyle = '#fde047';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.rect(-b.radius, -b.radius, b.radius * 2, b.radius * 2);
            ctx.fill();
            ctx.stroke();
            ctx.restore();
          } else if (b.type === 'boomerang_axe') {
            // 雙迴旋戰斧
            ctx.save();
            ctx.translate(b.x, b.y);
            if (b.rot !== undefined) ctx.rotate(b.rot);
            ctx.shadowColor = '#ef4444';
            ctx.shadowBlur = 12;
            ctx.fillStyle = '#dc2626';
            ctx.strokeStyle = '#fca5a5';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(-8, -4, 9, -Math.PI / 2, Math.PI / 2);
            ctx.fill();
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(8, -4, 9, Math.PI / 2, -Math.PI / 2);
            ctx.fill();
            ctx.stroke();
            ctx.restore();
          } else if (b.type === 'prism_laser') {
            // 稜鏡三向折射雷射
            b.beamProgress = (b.beamProgress || 0) + 1;
            const isFiring = b.beamProgress > 18;
            ctx.save();
            if (!isFiring) {
              ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
              ctx.lineWidth = 2;
              ctx.setLineDash([4, 4]);
              ctx.beginPath();
              ctx.moveTo(b.x, by);
              ctx.lineTo(b.x, by + bh);
              ctx.stroke();
              ctx.setLineDash([]);
            } else {
              ctx.fillStyle = '#38bdf8';
              ctx.shadowColor = '#38bdf8';
              ctx.shadowBlur = 12;
              ctx.fillRect(b.x - 8, by, 16, bh);
              // Split angled beams at bottom
              ctx.strokeStyle = 'rgba(56, 189, 248, 0.85)';
              ctx.lineWidth = 8;
              ctx.beginPath();
              ctx.moveTo(b.x, by + bh * 0.6);
              ctx.lineTo(b.x - 70, by + bh);
              ctx.moveTo(b.x, by + bh * 0.6);
              ctx.lineTo(b.x + 70, by + bh);
              ctx.stroke();
            }
            ctx.restore();
          } else if (b.type === 'twilight_cleave') {
            // 暮光神劍天降滅世斬
            b.beamProgress = (b.beamProgress || 0) + 1;
            const isFiring = b.beamProgress > 16;
            ctx.save();
            if (!isFiring) {
              const wAlpha = Math.sin(b.beamProgress * 0.5) * 0.35 + 0.65;
              ctx.strokeStyle = `rgba(239, 68, 68, ${wAlpha})`;
              ctx.lineWidth = 3;
              ctx.beginPath();
              ctx.moveTo(bx + 10, b.y);
              ctx.lineTo(bx + bw - 10, b.y);
              ctx.stroke();
              ctx.font = 'bold 12px serif';
              ctx.fillStyle = '#fbbf24';
              ctx.textAlign = 'center';
              ctx.fillText('🗡️ 暮光神劍滅世斬預警！', bx + bw / 2, b.y - 8);
            } else {
              ctx.fillStyle = 'rgba(239, 68, 68, 0.85)';
              ctx.shadowColor = '#f97316';
              ctx.shadowBlur = 18;
              ctx.fillRect(bx, b.y - 16, bw, 32);
              ctx.fillStyle = '#ffffff';
              ctx.fillRect(bx, b.y - 4, bw, 8);
            }
            ctx.restore();
          } else if (b.type === 'meteor_magma') {
            // 穆斯貝爾海姆熔岩巨隕
            ctx.save();
            ctx.translate(b.x, b.y);
            const mGrad = ctx.createRadialGradient(0, 0, 2, 0, 0, b.radius);
            mGrad.addColorStop(0, '#ffffff');
            mGrad.addColorStop(0.4, '#fde047');
            mGrad.addColorStop(0.8, '#ea580c');
            mGrad.addColorStop(1, '#7f1d1d');
            ctx.fillStyle = mGrad;
            ctx.shadowColor = '#f97316';
            ctx.shadowBlur = 14;
            ctx.beginPath();
            ctx.arc(0, 0, b.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          } else if (b.type === 'radar_ping') {
            // 藍牙雷達聲納脈衝環
            b.beamProgress = (b.beamProgress || 0) + 1;
            const curRad = b.beamProgress * 3.4;
            ctx.save();
            ctx.strokeStyle = b.color;
            ctx.lineWidth = 2.4;
            ctx.shadowColor = b.color;
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.arc(b.x, b.y, curRad, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
          } else {
            // Molten Magma Boulder with Obsidian Crust & Lava Trail
            ctx.save();
            if (b.trail && b.trail.length > 1) {
              b.trail.forEach((pt, idx) => {
                ctx.fillStyle = idx % 2 === 0 ? 'rgba(249, 115, 22, 0.35)' : 'rgba(250, 204, 21, 0.35)';
                ctx.beginPath();
                ctx.arc(pt.x, pt.y, (idx + 1) * 1.1, 0, Math.PI * 2);
                ctx.fill();
              });
            }
            const magGrad = ctx.createRadialGradient(b.x, b.y, 2, b.x, b.y, b.radius);
            magGrad.addColorStop(0, '#ffffff');
            magGrad.addColorStop(0.3, '#fde047');
            magGrad.addColorStop(0.7, '#ea580c');
            magGrad.addColorStop(1, '#7f1d1d');
            ctx.fillStyle = magGrad;
            ctx.shadowColor = '#f97316';
            ctx.shadowBlur = 12;
            ctx.beginPath();
            ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#18181b';
            ctx.beginPath();
            ctx.arc(b.x - 3, b.y - 2, b.radius * 0.35, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }

          // Check Collision with Soul (❤️) & Graze
          let hasCollided = false;
          let distToSoul = 999;

          if (b.type === 'aurora_beam') {
            const beamW = b.width || 32;
            const isFiring = b.beamProgress ? b.beamProgress > (b.isPhase2 ? 18 : 22) : false;
            distToSoul = Math.abs(soul.x - b.x);
            if (isFiring && distToSoul < beamW / 2 + 5) {
              hasCollided = true;
            }
          } else if (b.type === 'laser_cross') {
            const isFiring = (b.beamProgress || 0) > 18;
            distToSoul = Math.min(Math.abs(soul.x - b.x), Math.abs(soul.y - b.y));
            if (isFiring && (Math.abs(soul.x - b.x) < 13 || Math.abs(soul.y - b.y) < 13)) {
              hasCollided = true;
            }
          } else if (b.type === 'twilight_cleave') {
            const isFiring = (b.beamProgress || 0) > 16;
            distToSoul = Math.abs(soul.y - b.y);
            if (isFiring && distToSoul < 16) {
              hasCollided = true;
            }
          } else if (b.type === 'prism_laser') {
            const isFiring = (b.beamProgress || 0) > 18;
            distToSoul = Math.abs(soul.x - b.x);
            if (isFiring && distToSoul < 14) {
              hasCollided = true;
            }
          } else if (b.type === 'radar_ping') {
            const ringR = (b.beamProgress || 0) * 3.4;
            const d = Math.hypot(soul.x - b.x, soul.y - b.y);
            distToSoul = Math.abs(d - ringR);
            if (distToSoul < 9) {
              hasCollided = true;
            }
          } else {
            distToSoul = Math.hypot(soul.x - b.x, soul.y - b.y);
            if (distToSoul < b.radius + 6) {
              hasCollided = true;
            }
          }

          // Direct Hit handling with Valhalla Aegis (英靈殿金盾抵消) & Shatter on Impact
          if (hasCollided && soul.iFrames <= 0) {
            spawnBulletShatterFragments(b.x, b.y, b.color, '#ffffff', 'rune_frag', 12, b.char);
            if (aegisChargesRef.current > 0) {
              aegisChargesRef.current--;
              playRetroSound('aegis');
              soul.iFrames = 30;
              screenShakeRef.current = 8;
              grazeIndicatorRef.current = {
                x: soul.x,
                y: soul.y - 18,
                text: `🛡️ 英靈殿神盾抵消！(剩餘 ${aegisChargesRef.current} 次)`,
                alpha: 1.0,
              };
              bulletsRef.current = bulletsRef.current.filter((otherB) => Math.hypot(otherB.x - soul.x, otherB.y - soul.y) > 75);
            } else {
              playRetroSound('hit');
              screenShakeRef.current = isPhase2 ? 18 : 14;
              soul.iFrames = 30 + (courageBuff.extraIFrames || 0);
              // Reset Combo on direct hit
              comboCountRef.current = 0;
              setComboCount(0);
              const dmg = isBerserkMode ? 20 : isPhase2 ? 18 : 15;
              setPlayerState((p) => {
                const nextHp = Math.max(0, p.hp - dmg);
                if (nextHp <= 0) {
                  setBattlePhase('defeat');
                }
                return { ...p, hp: nextHp };
              });
            }
          } else if (!hasCollided && soul.iFrames <= 0) {
            // Extreme Dodge (極限躲避) & Graze Detection -> Builds Combo & Opens Timed Click Counter Window!
            const grazeThreshold = b.radius + 17;
            if (distToSoul < grazeThreshold && distToSoul >= b.radius + 6) {
              if (bTick - grazeAudioCooldownRef.current > 10) {
                playRetroSound('graze');
                grazeAudioCooldownRef.current = bTick;
                grazeCountRef.current++;
                extremeDodgeCountRef.current++;
                setExtremeDodgeCount(extremeDodgeCountRef.current);
                comboCountRef.current++;
                setComboCount(comboCountRef.current);
                if (comboCountRef.current > maxComboRef.current) {
                  maxComboRef.current = comboCountRef.current;
                  setMaxCombo(maxComboRef.current);
                }
                // Activate Timed Click Counter Window on Extreme Dodge!
                if (counterCooldownRef.current === 0) {
                  counterWindowTimerRef.current = 90;
                  setCounterWindowActive(true);
                }
                grazeIndicatorRef.current = {
                  x: soul.x + (Math.random() - 0.5) * 12,
                  y: soul.y - 16,
                  text: `⚡ 極限躲避! ${comboCountRef.current} COMBO · 點擊反擊!`,
                  alpha: 1.0,
                };
              }
              for (let sp = 0; sp < 2; sp++) {
                const spAng = Math.random() * Math.PI * 2;
                const spSpd = 1.6 + Math.random() * 2;
                grazeSparksRef.current.push({
                  x: soul.x,
                  y: soul.y,
                  vx: Math.cos(spAng) * spSpd,
                  vy: Math.sin(spAng) * spSpd,
                  life: 1.0,
                  color: isPhase2 ? '#f43f5e' : '#fde047',
                });
              }
            }
          }

          if (b.type === 'aurora_beam') {
            if ((b.beamProgress || 0) < (b.isPhase2 ? 48 : 55)) {
              nextBullets.push(b);
            } else {
              spawnBulletShatterFragments(b.x, by + bh / 2, b.color, '#67e8f9', 'ice_crystal', 8);
            }
          } else if (b.type === 'orbit_rune') {
            if ((b.orbitRadius || 0) < 175) {
              nextBullets.push(b);
            }
          } else if (b.x >= bx - 35 && b.x <= bx + bw + 35 && b.y >= by - 35 && b.y <= by + bh + 35) {
            nextBullets.push(b);
          }
        }
        bulletsRef.current = nextBullets;

        // Render Shatter Shockwave Rings & 16-Bit Pixel Shatter Fragments (渲染彈幕撞擊碎裂像素碎片)
        shatterRingsRef.current.forEach((sr) => {
          sr.radius += (sr.maxRadius - sr.radius) * 0.22;
          sr.alpha -= 0.07;
          ctx.save();
          ctx.globalAlpha = Math.max(0, sr.alpha);
          ctx.strokeStyle = sr.color;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(sr.x, sr.y, sr.radius, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        });
        shatterRingsRef.current = shatterRingsRef.current.filter((sr) => sr.alpha > 0.05);

        danmakuShardsRef.current.forEach((sh) => {
          sh.x += sh.vx;
          sh.y += sh.vy;
          sh.vy += sh.gravity;
          sh.rot += sh.vRot;
          sh.alpha -= 0.032;

          // Bounce pixel fragments off battle box floor
          if (sh.y > by + bh - 4 && sh.vy > 0) {
            sh.y = by + bh - 4;
            sh.vy = -sh.vy * 0.55;
          }

          ctx.save();
          ctx.globalAlpha = Math.max(0, sh.alpha);
          ctx.translate(sh.x, sh.y);
          ctx.rotate(sh.rot);
          ctx.fillStyle = sh.color;
          ctx.shadowColor = sh.color;
          ctx.shadowBlur = 8;

          if (sh.char) {
            ctx.font = 'bold 9px monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(sh.char, 0, 0);
          } else if (sh.kind === 'ice_crystal' || sh.kind === 'gold_spark') {
            ctx.beginPath();
            ctx.moveTo(0, -sh.size);
            ctx.lineTo(sh.size * 0.7, 0);
            ctx.lineTo(0, sh.size);
            ctx.lineTo(-sh.size * 0.7, 0);
            ctx.closePath();
            ctx.fill();
          } else {
            // Crisp 16-bit pixel block shard
            ctx.fillRect(-sh.size / 2, -sh.size / 2, sh.size, sh.size);
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(-sh.size / 4, -sh.size / 4, sh.size / 2, sh.size / 2);
          }
          ctx.restore();
        });
        danmakuShardsRef.current = danmakuShardsRef.current.filter((sh) => sh.alpha > 0.04);

        // Render Flashy 16-Bit Pixel Counter-Attack Beams & Rune Slashes (華麗像素特效反擊動畫)
        pixelCounterAnimsRef.current.forEach((ca) => {
          const prog = 1 - ca.life;
          ctx.save();
          // 1. Multi-layer Pixel Laser Beam from Soul to Boss
          ctx.strokeStyle = ca.primaryColor;
          ctx.lineWidth = 10 * ca.life;
          ctx.shadowColor = ca.primaryColor;
          ctx.shadowBlur = 20;
          ctx.beginPath();
          ctx.moveTo(ca.fromX, ca.fromY);
          ctx.lineTo(ca.toX, ca.toY);
          ctx.stroke();

          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 4 * ca.life;
          ctx.beginPath();
          ctx.moveTo(ca.fromX, ca.fromY);
          ctx.lineTo(ca.toX, ca.toY);
          ctx.stroke();

          // 2. Giant Expanding Pixel Rune Crest & Cross-Slash on Boss
          const slashR = 45 + prog * 55;
          ctx.strokeStyle = ca.secondaryColor;
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(ca.toX - slashR, ca.toY - slashR * 0.6);
          ctx.lineTo(ca.toX + slashR, ca.toY + slashR * 0.6);
          ctx.moveTo(ca.toX + slashR, ca.toY - slashR * 0.6);
          ctx.lineTo(ca.toX - slashR, ca.toY + slashR * 0.6);
          ctx.stroke();

          // 3. Skill Callout & Counter Damage Banner
          ctx.font = 'bold 16px monospace';
          ctx.fillStyle = '#fde047';
          ctx.textAlign = 'center';
          ctx.shadowColor = '#000000';
          ctx.shadowBlur = 8;
          ctx.fillText(`${ca.runeSymbol} ${ca.skillName}! -${ca.damage} (${ca.combo} COMBO!)`, ca.toX, ca.toY - 40 - prog * 24);
          ctx.restore();
          ca.life -= 0.045;
        });
        pixelCounterAnimsRef.current = pixelCounterAnimsRef.current.filter((ca) => ca.life > 0);
      }

      // ==========================================
      // FOURTH WALL FULLSCREEN OVERLAYS & GLITCHES
      // ==========================================

      // 1. Harald Bluetooth: CRT Scanlines & Terminal Notification
      if (bluetoothGlitchRef.current) {
        ctx.fillStyle = 'rgba(56, 189, 248, 0.06)';
        for (let l = 0; l < height; l += 4) {
          ctx.fillRect(0, l, width, 1.5);
        }
        ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.5;
        ctx.fillRect(width - 270, 10, 260, 28);
        ctx.strokeRect(width - 270, 10, 260, 28);
        ctx.font = 'bold 10px monospace';
        ctx.fillStyle = '#38bdf8';
        ctx.textAlign = 'left';
        ctx.fillText('📶 [RADIO HIJACK] HARALD_965_V1KING', width - 260, 28);
      }

      // 2. Harald Hardrada: Screen Shatter Procedural Glass Cracks
      if (glassCracksRef.current.length > 0) {
        glassCracksRef.current.forEach((crack) => {
          ctx.save();
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
          ctx.lineWidth = 1.6;
          ctx.shadowColor = '#38bdf8';
          ctx.shadowBlur = 6;
          ctx.beginPath();
          crack.lines.forEach((l) => {
            ctx.moveTo(crack.x, crack.y);
            ctx.lineTo(crack.x + l.dx, crack.y + l.dy);
          });
          ctx.stroke();

          ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
          ctx.beginPath();
          ctx.arc(crack.x, crack.y, 14, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        });
      }

      // 3. Surtr: GPU Thermal Meltdown Overheat Banner
      if (currentChapter.boss.bossType === 'surtr' && battlePhase === 'dodge') {
        ctx.fillStyle = 'rgba(239, 68, 68, 0.85)';
        ctx.fillRect(width / 2 - 130, 4, 260, 20);
        ctx.font = 'bold 10px monospace';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText(`🔥 CORE TEMP: ${coreTempRef.current}°C - THERMAL MELTDOWN`, width / 2, 18);
      }

      ctx.restore();
      battleAnimFrameRef.current = requestAnimationFrame(renderUndertaleBattle);
    };

    battleAnimFrameRef.current = requestAnimationFrame(renderUndertaleBattle);

    return () => {
      if (battleAnimFrameRef.current) cancelAnimationFrame(battleAnimFrameRef.current);
    };
  }, [isOpen, activeTab, battlePhase, cutsceneStep, currentChapterIdx, bossSpeech]);

  // Undertale Dodge Timer countdown -> Transitions smoothly into Runic Counter-Strike Bar!
  useEffect(() => {
    if (battlePhase !== 'dodge') {
      setIsChaosSaberCssWaveActive(false);
      setActiveCssWeaponSide('none');
      return;
    }
    battleTickRef.current = 0;

    const interval = setInterval(() => {
      setDodgeTimer((prev) => {
        if (prev <= 0.2) {
          clearInterval(interval);
          bulletsRef.current = [];
          sideWeaponsRef.current = [];
          flappyPillarsRef.current = [];
          setIsChaosSaberCssWaveActive(false);
          setActiveCssWeaponSide('none');
          setBossSpeech(currentChapter.boss.taunts.postDodge);
          // Do NOT advance stage here — Boss only enters the next stage AFTER the player attacks!
          // Automatically charge Runic Counter-Slash after surviving the current Boss Attack Stage!
          strikePosRef.current = 10;
          strikeSpeedRef.current = 6.2;
          strikeDoneRef.current = false;
          strikeResultRef.current = null;
          setBattlePhase('strike_bar');
          return 0;
        }
        return prev - 0.2;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [battlePhase, currentChapter]);

  // Undertale Player Action: Fight / Act / Item / Mercy
  const getBossHistoricalAttackQuote = (bossType: string, isPhase2: boolean = false) => {
    if (bossType === 'harald_bluetooth') {
      return isPhase2
        ? '【Phase 2·血誓暴怒】藍牙王耶靈石碑古血覺醒！藍色盧恩環繞陣與雙向波紋全面爆發！'
        : '【地標彈幕·耶靈石碑與新港】：西元965年丹麥藍牙王釋放藍色符文環繞波動（ᛒᚱᚠᛏ）與新港彩屋！';
    }
    if (bossType === 'captain_vasa') {
      return isPhase2
        ? '【Phase 2·幽冥綠焰狂瀾】瓦薩號沉睡333年怨念爆發！90cm窄巷內歷史遺物重砲與幽冥巨錨橫掃！'
        : '【地標彈幕·瓦薩號與老城窄巷】：1628年瓦薩號發射歷史遺物青銅重砲與1520大廣場滾動鵝卵石！';
    }
    if (bossType === 'sami_shaman') {
      return isPhase2
        ? '【Phase 2·太陽風暴極光狂潮】拉普蘭火狐之尾燃起紫紅烈焰！極光光束與66°33\'極圈切割刃雙向掃蕩！'
        : '【地標彈幕·北緯66°33\'極圈界線】：薩米巫師敲響神鼓，召喚拉普蘭極光光束與極圈軌道切割！';
    }
    if (bossType === 'vainamoinen') {
      return isPhase2
        ? '【Phase 2·卡勒瓦拉終章合唱】萬奈摩寧撥動天地神琴！康特勒琴五弦諧波音符軌跡與岩石教堂巨石齊發！'
        : '【地標彈幕·岩石教堂與康特勒琴】：萬奈摩寧彈奏芬蘭琴發出金色音符軌跡，伴隨桑拿蒸汽升騰！';
    }
    if (bossType === 'harald_hardrada') {
      return isPhase2
        ? '【Phase 2·斯坦福橋最後狂戰】最後的維京國王狂暴怒火沸騰！四方迴旋戰斧與北極聖殿冰晶雷射絞殺！'
        : '【地標彈幕·北極大教堂與瓦蘭吉雙斧】：無情者哈拉爾揮舞雙刃戰斧，引動特羅姆瑟極夜冰晶光束！';
    }
    return isPhase2
      ? '【Phase 2·諸神黃昏世界終焉】史爾特爾炎之魔劍烈焰滔天！火山拋物線岩漿彈幕與間歇泉全面噴發！'
      : '【地標彈幕·冰島火山與間歇泉】：火焰巨人史爾特爾揮動暮光之劍，噴發滾燙火山岩漿彈幕與跨年煙火！';
  };

  // 觸發各區域 BOSS 專屬第四面牆突襲事件
  const triggerBossFourthWallEvent = (bossType: string) => {
    const { x: bx, y: by, w: bw, h: bh } = boxBounds;

    if (bossType === 'harald_bluetooth') {
      bluetoothGlitchRef.current = true;
      playRetroSound('glitch');
      setTimeout(() => {
        bluetoothGlitchRef.current = false;
      }, 5000);
    } else if (bossType === 'captain_vasa') {
      waterHeightRef.current = 20;
      boxTiltRef.current = (Math.random() > 0.5 ? 1 : -1) * 0.08;
      playRetroSound('water_splash');
      interactivePropsRef.current = [
        {
          type: 'driftwood',
          x: bx + 115 + Math.random() * (bw - 230),
          y: by + bh - 35,
          radius: 14,
          life: 1.0,
        },
      ];
    } else if (bossType === 'sami_shaman') {
      isInvertedControlsRef.current = true;
      playRetroSound('magic');
      interactivePropsRef.current = [
        {
          type: 'sami_drum',
          x: bx + bw / 2 + (Math.random() - 0.5) * 80,
          y: by + bh / 2 + (Math.random() - 0.5) * 40,
          radius: 15,
          life: 1.0,
        },
      ];
      setTimeout(() => {
        isInvertedControlsRef.current = false;
      }, 4200);
    } else if (bossType === 'vainamoinen') {
      playRetroSound('magic');
      interactivePropsRef.current = [
        {
          type: 'rest_note',
          x: bx + 60 + Math.random() * (bw - 120),
          y: by + 30 + Math.random() * (bh - 60),
          radius: 14,
          life: 1.0,
        },
      ];
    } else if (bossType === 'harald_hardrada') {
      playRetroSound('glass_shatter');
      screenShakeRef.current = 18;
      const crackX = bx + bw / 2 + (Math.random() - 0.5) * 50;
      const crackY = by + bh / 2 + (Math.random() - 0.5) * 40;
      const lines = [];
      for (let c = 0; c < 8; c++) {
        const ang = (c / 8) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
        const len = 35 + Math.random() * 55;
        lines.push({ dx: Math.cos(ang) * len, dy: Math.sin(ang) * len });
      }
      glassCracksRef.current.push({ x: crackX, y: crackY, lines });
      if (glassCracksRef.current.length > 3) glassCracksRef.current.shift();
      interactivePropsRef.current = [
        {
          type: 'rage_shard',
          x: crackX + (Math.random() - 0.5) * 20,
          y: crackY + 20,
          radius: 10,
          life: 1.0,
        },
      ];
    } else {
      coreTempRef.current = 999;
      playRetroSound('roar');
      screenShakeRef.current = 14;
      interactivePropsRef.current = [
        {
          type: 'steam_vent',
          x: bx + 40 + Math.random() * (bw - 80),
          y: by + bh - 16,
          radius: 16,
          life: 1.0,
        },
      ];
    }
  };

  const handleClearBluetoothGlitch = () => {
    if (!bluetoothGlitchRef.current) return;
    bluetoothGlitchRef.current = false;
    playRetroSound('magic');
    bulletsRef.current.forEach((b) => {
      b.vx *= 0.6;
      b.vy *= 0.6;
    });
    setPlayerState((p) => {
      const nextCourage = p.courage + 2;
      const updated = { ...p, courage: nextCourage };
      saveGame(updated);
      return updated;
    });
    setCourageFeedback({ delta: 2, text: '📶 成功破解藍牙終端干擾！彈幕減速！' });
  };

  // 施放勇氣值解鎖的輔助戰鬥技能
  const handleUseSkill = (skillId: 'warcry' | 'blessing' | 'aegis') => {
    if (skillCooldowns[skillId] > 0) return;

    const skill = COMBAT_SKILLS.find((s) => s.id === skillId);
    if (!skill || playerState.courage < skill.minCourage) return;

    if (skillId === 'warcry') {
      playRetroSound('warcry');
      warcryActiveTurnsRef.current = 2;
      screenShakeRef.current = 12;
      setSkillCooldowns((prev) => ({ ...prev, warcry: skill.cooldownTurns }));
      setBossSpeech('「這股狂暴的維京戰嚎……是瓦爾哈拉狂戰士的嗜血戰意？！」');
    } else if (skillId === 'blessing') {
      playRetroSound('blessing');
      blessingRegenTurnsRef.current = 2;
      setSkillCooldowns((prev) => ({ ...prev, blessing: skill.cooldownTurns }));
      setPlayerState((p) => ({
        ...p,
        hp: Math.min(p.maxHp, p.hp + 50),
      }));
      setBossSpeech('「北緯66°拉普蘭的極光火狐……正在神聖癒合你的創口？！」');
    } else if (skillId === 'aegis') {
      playRetroSound('aegis');
      aegisChargesRef.current = 2;
      setSkillCooldowns((prev) => ({ ...prev, aegis: skill.cooldownTurns }));
      setBossSpeech('「女武神之盾……休想輕易抵禦我的破滅彈幕！」');
    }
  };

  // 進階『連擊 / 極限躲避』特定時間點點擊螢幕觸發華麗像素特效反擊 (Timed Screen Click Extreme Dodge Pixel Counter-Attack)
  const handleTriggerExtremeCounter = () => {
    if (battlePhase !== 'dodge') return;
    if (extremeDodgeWindowRef.current <= 0) return;

    const sPos = soulPosRef.current;
    let closestBulletIdx = -1;
    let minGap = 999;
    bulletsRef.current.forEach((b, idx) => {
      const d = Math.hypot(b.x - sPos.x, b.y - sPos.y) - b.radius;
      if (d < minGap) {
        minGap = d;
        closestBulletIdx = idx;
      }
    });

    if (minGap > 42 && !extremeCounterReady) return;

    const bossType = currentChapter.boss.bossType;
    const counterSkill = BOSS_COUNTER_SKILLS[bossType];

    // Consume current window & grant brief invincibility frames
    extremeDodgeWindowRef.current = 0;
    setExtremeCounterReady(false);
    soulPosRef.current.iFrames = Math.max(soulPosRef.current.iFrames, 28);

    // Increment Combo & Counter Stats
    const nextCombo = dodgeComboRef.current + 1;
    dodgeComboRef.current = nextCombo;
    if (nextCombo > maxComboRef.current) maxComboRef.current = nextCombo;
    setDodgeCombo(nextCombo);
    extremeCounterCountRef.current += 1;

    // Shatter nearby bullets within 85px into 16-bit pixel fragments!
    const survivingBullets: UndertaleBullet[] = [];
    bulletsRef.current.forEach((b, idx) => {
      const distToSoul = Math.hypot(b.x - sPos.x, b.y - sPos.y);
      if (distToSoul < 85 || idx === closestBulletIdx) {
        spawnBulletShatterFragments(b.x, b.y, b.color, '#ffffff', 'rune_frag', 11, b.char);
      } else {
        survivingBullets.push(b);
      }
    });
    bulletsRef.current = survivingBullets;

    // Calculate Combo-Scaled Counter Damage
    const comboBonus = 1 + Math.min(1.5, nextCombo * 0.12);
    const counterDmg = Math.round(counterSkill.baseDamage * comboBonus);
    const nextBossHp = Math.max(0, battleBossHpRef.current - counterDmg);
    battleBossHpRef.current = nextBossHp;
    setBattleBossHp(nextBossHp);

    // Trigger 16-Bit Pixel Counter-Attack Animation & Boss Hit Shake/Flash
    counterSlashAnimRef.current = {
      active: true,
      life: 1.0,
      skillName: counterSkill.name,
      damage: counterDmg,
      combo: nextCombo,
      color: counterSkill.primaryColor,
      secondaryColor: counterSkill.secondaryColor,
      targetX: 430 + bossPatrolRef.current.x,
      targetY: 68 + bossPatrolRef.current.y,
      soulX: sPos.x,
      soulY: sPos.y,
    };

    bossHitFlashRef.current = 24;
    bossShakeRef.current = 30;
    screenShakeRef.current = 18;
    playRetroSound('strike_perfect');

    // Spawn 28 pixel-art counter sparks at Boss position
    for (let i = 0; i < 28; i++) {
      const ang = Math.random() * Math.PI * 2;
      const spd = 2.8 + Math.random() * 6.5;
      impactParticlesRef.current.push({
        x: 430 + bossPatrolRef.current.x,
        y: 68 + bossPatrolRef.current.y,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd,
        life: 1.0,
        color: i % 2 === 0 ? counterSkill.primaryColor : counterSkill.secondaryColor,
        size: 3.5 + Math.random() * 3,
      });
    }

    // Grant MP bonus
    setPlayerState((p) => ({
      ...p,
      mp: Math.min(p.maxMp, p.mp + 12),
    }));

    setBossSpeech(`⚡【${counterSkill.name}】${nextCombo}連擊極限反擊！造成 ${counterDmg} 點破擊傷害！`);

    // Check if Boss is defeated by Extreme Counter!
    if (nextBossHp <= 0) {
      rpgBgmEngine.setTempoMultiplier(1.0);
      playRetroSound('fanfare');
      setBattlePhase('victory');
      setBossSpeech(currentChapter.boss.winQuote);
      setShowVictoryEpilogueModal(true);

      setPlayerState((prev) => {
        if (prev.clearedBosses.includes(currentChapter.boss.id)) return prev;
        const updated = {
          ...prev,
          level: prev.level + 1,
          exp: prev.exp + 260,
          gold: prev.gold + 400,
          clearedBosses: [...prev.clearedBosses, currentChapter.boss.id],
        };
        saveGame(updated);
        return updated;
      });
    }
  };

  // 經典 Undertale 攻擊條 (QTE Strike Bar) 斬擊判定結算
  const handleConfirmStrike = () => {
    if (battlePhase !== 'strike_bar' || strikeDoneRef.current) return;
    strikeDoneRef.current = true;

    const barW = 280;
    const targetCenter = barW / 2; // 140
    const curPos = strikePosRef.current;
    const dist = Math.abs(curPos - targetCenter);

    const courageBuff = getCourageCombatBuff(playerState.courage);
    const courageTolerance = Math.min(22, Math.floor(playerState.courage / 3.5));
    const isWarcryActive = warcryActiveTurnsRef.current > 0;

    let rating: 'PERFECT' | 'GREAT' | 'GOOD' | 'MISS' = 'GOOD';
    let multiplier = 1.0;
    let isCrit = isWarcryActive || Math.random() < (courageBuff.critChance || 0.1);

    if (dist <= 12 + courageTolerance) {
      rating = 'PERFECT';
      multiplier = 2.0;
      isCrit = true;
      playRetroSound('strike_perfect');
      screenShakeRef.current = 22;
    } else if (dist <= 36 + courageTolerance) {
      rating = 'GREAT';
      multiplier = 1.45;
      playRetroSound('strike_good');
      screenShakeRef.current = 14;
    } else if (dist <= 85) {
      rating = 'GOOD';
      multiplier = 1.0;
      playRetroSound('slash');
      screenShakeRef.current = 9;
    } else {
      rating = 'MISS';
      multiplier = 0.35;
      isCrit = false;
      playRetroSound('strike_miss');
    }

    if (isWarcryActive) {
      multiplier *= 1.6;
      warcryActiveTurnsRef.current--;
    }

    const baseDmg = 65 + Math.random() * 25;
    const dmg = Math.floor(baseDmg * (courageBuff.atkMultiplier || 1.0) * multiplier * (isCrit ? 1.5 : 1.0));
    const nextHp = Math.max(0, battleBossHp - dmg);

    strikeResultRef.current = { rating, damage: dmg, isCrit };
    slashAnimRef.current = { life: 1.0, damage: dmg, isCrit };
    bossHitFlashRef.current = 22;
    bossShakeRef.current = isCrit ? 32 : 20;

    // Spawn high-impact explosive particles at Boss (BOSS 受傷爆破火花與打擊感反饋)
    for (let i = 0; i < (isCrit ? 32 : 18); i++) {
      const ang = Math.random() * Math.PI * 2;
      const spd = 2.5 + Math.random() * 6.5;
      impactParticlesRef.current.push({
        x: 430 + bossPatrolRef.current.x,
        y: 68 + bossPatrolRef.current.y,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd,
        life: 1.0,
        color: isCrit ? (i % 2 === 0 ? '#fbbf24' : '#ef4444') : (i % 2 === 0 ? '#38bdf8' : '#ffffff'),
        size: 3 + Math.random() * 3.5,
      });
    }

    setTimeout(() => {
      setBattleBossHp(nextHp);

      if (nextHp <= 0) {
        rpgBgmEngine.setTempoMultiplier(1.0);
        playRetroSound('fanfare');
        setBattlePhase('victory');
        setBossSpeech(currentChapter.boss.winQuote);
        setShowVictoryEpilogueModal(true);

        setPlayerState((prev) => {
          if (prev.clearedBosses.includes(currentChapter.boss.id)) return prev;
          const updated = {
            ...prev,
            level: prev.level + 1,
            exp: prev.exp + 220,
            gold: prev.gold + 350,
            clearedBosses: [...prev.clearedBosses, currentChapter.boss.id],
          };
          saveGame(updated);
          return updated;
        });
        return;
      }

      // 觸發 BOSS 第四面牆專屬事件
      triggerBossFourthWallEvent(currentChapter.boss.bossType);

      // 被動回復結算
      let regenHp = courageBuff.regenPerTurn || 0;
      if (blessingRegenTurnsRef.current > 0) {
        regenHp += 15;
        blessingRegenTurnsRef.current--;
      }
      if (regenHp > 0) {
        setPlayerState((p) => ({
          ...p,
          hp: Math.min(p.maxHp, p.hp + regenHp),
        }));
      }

      // 遞減技能冷卻回合數
      setSkillCooldowns((prev) => ({
        warcry: Math.max(0, prev.warcry - 1),
        blessing: Math.max(0, prev.blessing - 1),
        aegis: Math.max(0, prev.aegis - 1),
      }));

      // 每次玩家攻擊後，BOSS 才會進入下個階段（第一階段 ➡️ 第二階段 ➡️ 第三階段循環），且每一階段時間增長！
      const nextStageAfterAttackMap: Record<
        'stage1_danmaku' | 'stage2_flappy' | 'stage3_laser',
        'stage1_danmaku' | 'stage2_flappy' | 'stage3_laser'
      > = {
        stage1_danmaku: 'stage2_flappy',
        stage2_flappy: 'stage3_laser',
        stage3_laser: 'stage1_danmaku',
      };
      const nextBossStage = nextStageAfterAttackMap[bossAttackStageRef.current];
      bossAttackStageRef.current = nextBossStage;
      setBossAttackStage(nextBossStage);

      // 每一階段皆為 7.0 秒（每次玩家攻擊後進入下一階段）
      const nextStageDuration = 7.0;

      const willBeP2 = nextHp < currentChapter.boss.maxHp * 0.5;
      setDodgeTimer(nextStageDuration);
      soulPosRef.current = { x: 430, y: 220, iFrames: 0 };
      bulletsRef.current = [];
      flappyPillarsRef.current = [];
      sideWeaponsRef.current = [];
      setBossSpeech(getBossHistoricalAttackQuote(currentChapter.boss.bossType, willBeP2));
      setBattlePhase('dodge');
    }, 900);
  };

  const handleUndertaleAction = (action: 'fight' | 'act_talk' | 'act_check' | 'act_chant' | 'item' | 'mercy') => {
    if (battlePhase !== 'menu' && battlePhase !== 'act_menu' && battlePhase !== 'item_menu' && battlePhase !== 'dodge') return;

    const isCurrentP2 = battleBossHp < currentChapter.boss.maxHp * 0.5;

    if (action === 'fight') {
      setBattlePhase('strike_bar');
      strikePosRef.current = 10;
      strikeSpeedRef.current = 6.2;
      strikeDoneRef.current = false;
      strikeResultRef.current = null;
      playRetroSound('blip');
      return;
    } else if (action === 'act_talk') {
      playRetroSound('blip');
      setBossSpeech(currentChapter.boss.taunts.actLoreResponse);
      setTimeout(() => {
        setDodgeTimer(5.0);
        soulPosRef.current = { x: 430, y: 220, iFrames: 0 };
        bulletsRef.current = [];
        setBattlePhase('dodge');
      }, 1200);
    } else if (action === 'act_check') {
      playRetroSound('blip');
      setBossSpeech(`【地標共鳴】${currentChapter.boss.name} — ${currentChapter.boss.title}。${isCurrentP2 ? '⚠️ 狂暴相位已啟動！' : '操控 ❤️ 穿梭於北歐地標彈幕之間！'}`);
    } else if (action === 'act_chant') {
      playRetroSound('magic');
      setBossSpeech('「歐若拉的歌聲……正在擾亂我的彈幕軌跡！」');
      setTimeout(() => {
        setDodgeTimer(4.5);
        soulPosRef.current = { x: 430, y: 220, iFrames: 0 };
        bulletsRef.current = [];
        setBattlePhase('dodge');
      }, 1000);
    } else if (action === 'item') {
      playRetroSound('heal');
      const buff = currentChapter.michelinBuff;
      setPlayerState((p) => ({
        ...p,
        activeBuff: buff.name,
        hp: Math.min(p.maxHp, p.hp + 70),
        mp: Math.min(p.maxMp, p.mp + 50),
      }));
      setBossSpeech(`「星級饗宴【${buff.name}】的極地暖流充盈全身！」`);
      if (battlePhase !== 'dodge') {
        setTimeout(() => {
          setDodgeTimer(5.5);
          soulPosRef.current = { x: 430, y: 220, iFrames: 0 };
          bulletsRef.current = [];
          setBattlePhase('dodge');
        }, 1000);
      }
    } else if (action === 'mercy') {
      playRetroSound('blip');
      setBossSpeech(getBossHistoricalAttackQuote(currentChapter.boss.bossType, isCurrentP2));
      setTimeout(() => {
        setDodgeTimer(5.0);
        soulPosRef.current = { x: 430, y: 220, iFrames: 0 };
        bulletsRef.current = [];
        setBattlePhase('dodge');
      }, 900);
    }
  };

  // Advance or finish the Pre-Battle Theatrical Cutscene (BOSS 開打前說話演出推進)
  const handleAdvanceBossCutscene = () => {
    const script = getBossCutsceneScript(currentChapter.boss.bossType);
    const currentCue = script.lines[cutsceneStep] || script.lines[0];
    const fullText = currentCue?.text || '';

    // If typewriter is still typing out the line, complete the full line first
    if (cutsceneCharIdxRef.current < fullText.length) {
      cutsceneCharIdxRef.current = fullText.length;
      setCutsceneCharIdx(fullText.length);
      playBossVoiceBlip(currentChapter.boss.bossType, fullText.length);
      return;
    }

    if (cutsceneStep < script.lines.length - 1) {
      const nextStep = cutsceneStep + 1;
      const nextCue = script.lines[nextStep];
      setCutsceneStep(nextStep);
      cutsceneCharIdxRef.current = 0;
      setCutsceneCharIdx(0);
      setBossSpeech(nextCue?.text || '');
      playRetroSound(nextCue?.sfx || (nextStep === script.lines.length - 1 ? 'roar' : 'blip'));
      screenShakeRef.current = nextStep === script.lines.length - 1 ? 10 : 5;
    } else {
      // Cutscene finishes -> Launch into Stage 1 (Danmaku Shooting, 7.0s); Boss advances to Stage 2 after player's first attack!
      playRetroSound('magic');
      screenShakeRef.current = 12;
      bossAttackStageRef.current = 'stage1_danmaku';
      setBossAttackStage('stage1_danmaku');
      setDodgeTimer(7.0);
      soulPosRef.current = { x: 430, y: 220, iFrames: 0 };
      bulletsRef.current = [];
      flappyPillarsRef.current = [];
      sideWeaponsRef.current = [];
      setBossSpeech(getBossHistoricalAttackQuote(currentChapter.boss.bossType, false));
      setBattlePhase('dodge');
    }
  };

  // Start Undertale Boss Battle with Pre-Battle Theatrical Cutscene & Per-Boss BGM
  const startUndertaleBossBattle = (customDiff?: BattleDifficulty, chapterOverride?: RpgChapter) => {
    const targetChap = chapterOverride || currentChapter;
    const diff = customDiff || battleDifficulty;
    battleDifficultyRef.current = diff;
    const diffConfig = DIFFICULTY_CONFIGS[diff];
    const scaledMaxHp = Math.round(targetChap.boss.maxHp * diffConfig.hpMult);
    const script = getBossCutsceneScript(targetChap.boss.bossType);

    setBattleBossHp(scaledMaxHp);
    battleBossHpRef.current = scaledMaxHp;
    setInBattle(true);
    inBattleRef.current = true;
    setActiveTab('battle');
    setCutsceneStep(0);
    cutsceneCharIdxRef.current = 0;
    setCutsceneCharIdx(0);
    setBattlePhase('intro_cutscene');
    setBossAttackStage('stage1_danmaku');
    bossAttackStageRef.current = 'stage1_danmaku';
    setBossSpeech(script.lines[0]?.text || targetChap.boss.taunts.start);
    bulletsRef.current = [];
    sideWeaponsRef.current = [];
    flappyPillarsRef.current = [];
    danmakuShardsRef.current = [];
    shatterRingsRef.current = [];
    interactivePropsRef.current = [];
    bluetoothGlitchRef.current = false;
    isInvertedControlsRef.current = false;
    strikeDoneRef.current = false;
    strikeResultRef.current = null;
    bossShakeRef.current = 0;
    bossPatrolRef.current = { x: 0, y: 0, vx: 1.15 };
    impactParticlesRef.current = [];
    dodgeComboRef.current = 0;
    maxComboRef.current = 0;
    extremeCounterCountRef.current = 0;
    extremeDodgeWindowRef.current = 0;
    boxMotionRef.current = { x: 270, y: 130, w: 320, h: 180, tilt: 0 };
    lastAnnouncedFormRef.current[targetChap.boss.id] = 1;
    formTransitionBannerRef.current = null;
    setShowVictoryEpilogueModal(false);
    rpgBgmEngine.setTempoMultiplier(1.0);
    playRetroSound('roar');

    const bossTrack: BgmTrackId = diff === 'lunatic' ? 'boss_ragnarok_lunatic' : getBossBgmTrack(targetChap.boss.bossType);
    rpgBgmEngine.startTrack(bossTrack);
    setCurrentBgmTrack(bossTrack);
  };

  // ==========================================
  // 6. 2D WORLD EXPLORATION MAP CANVAS ENGINE (PHOTO-REALISTIC PIXEL ART)
  // ==========================================
  useEffect(() => {
    if (!isOpen || activeTab !== 'world') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let tick = 0;

    const renderWorldMap = () => {
      tick++;
      const width = canvas.width;
      const height = canvas.height;

      // Player Movement Physics
      const speed = playerState.transportMode === 'reindeer' ? 5.5 : 3.8;
      let dx = 0;
      let dy = 0;

      if (keysDownRef.current['arrowleft'] || keysDownRef.current['a']) dx -= speed;
      if (keysDownRef.current['arrowright'] || keysDownRef.current['d']) dx += speed;
      if (keysDownRef.current['arrowup'] || keysDownRef.current['w']) dy -= speed;
      if (keysDownRef.current['arrowdown'] || keysDownRef.current['s']) dy += speed;

      if (dx !== 0 || dy !== 0) {
        playerPosRef.current.x = Math.max(50, Math.min(width - 50, playerPosRef.current.x + dx));
        playerPosRef.current.y = Math.max(70, Math.min(height - 70, playerPosRef.current.y + dy));
        playerPosRef.current.dir = dx > 0 ? 'right' : dx < 0 ? 'left' : dy > 0 ? 'down' : 'up';

        // Record footsteps every 6 ticks for rich map texture immersion
        if (tick % 6 === 0) {
          playerFootprintsRef.current.push({
            x: playerPosRef.current.x,
            y: playerPosRef.current.y + 12,
            life: 1.0,
            dir: playerPosRef.current.dir,
          });
          if (playerFootprintsRef.current.length > 36) {
            playerFootprintsRef.current.shift();
          }
        }

        // Check Proximity to Chapter Story NPCs
        const chapterNpcs = PRIMARY_STORY_NPCS.filter((n) => n.chapterId === currentChapter.id);
        chapterNpcs.forEach((npc) => {
          const distToNpc = Math.hypot(playerPosRef.current.x - npc.x, playerPosRef.current.y - npc.y);
          if (distToNpc < 38 && !activeStoryNpc) {
            if (
              (!playerState.learnedStories.includes(currentChapter.id) && npc.id === currentChapter.primaryStoryNpcId) ||
              keysDownRef.current['e'] ||
              keysDownRef.current['enter'] ||
              keysDownRef.current[' ']
            ) {
              setActiveStoryNpc(npc);
              setDialogueNodeKey('start');
              playRetroSound('blip');
            }
          }
        });

        // Check Landmark Discoveries (Trigger ONCE)
        currentChapter.landmarks.forEach((lm) => {
          const dLm = Math.hypot(playerPosRef.current.x - lm.x, playerPosRef.current.y - lm.y);
          if (dLm < 38 && !playerState.unlockedLandmarks.includes(lm.id)) {
            setPlayerState((prev) => {
              if (prev.unlockedLandmarks.includes(lm.id)) return prev;
              const updated = {
                ...prev,
                unlockedLandmarks: [...prev.unlockedLandmarks, lm.id],
                exp: prev.exp + 60,
                gold: prev.gold + 80,
              };
              saveGame(updated);
              return updated;
            });
            playRetroSound('blip');
            setActiveEvent({
              title: `🌟 探索打卡！${lm.name}`,
              description: `📖 【小故事】：${lm.historicalLore}\n\n💡 【小知識】：${lm.trivia}${lm.mustDo && lm.mustDo.length ? '\n\n✅ 【必做的事】：\n• ' + lm.mustDo.join('\n• ') : ''}\n\n✨ 獎勵已發放（僅限首次）：+60 EXP / +80 G`,
              icon: lm.emoji,
              actionLabel: '記錄至旅者手帳',
              onAction: () => setActiveTab('logbook'),
            });
          }
        });

        // Check Location-based Quests (Trigger ONCE)
        currentChapter.quests.forEach((q) => {
          if (!playerState.completedQuests.includes(q.id)) {
            const targetLm = currentChapter.landmarks.find((l) => l.id === q.targetLandmarkId);
            if (targetLm) {
              const dQuest = Math.hypot(playerPosRef.current.x - targetLm.x, playerPosRef.current.y - targetLm.y);
              if (dQuest < 42) {
                setPlayerState((prev) => {
                  if (prev.completedQuests.includes(q.id)) return prev;
                  const updated = {
                    ...prev,
                    completedQuests: [...prev.completedQuests, q.id],
                    exp: prev.exp + q.rewardExp,
                    gold: prev.gold + q.rewardGold,
                  };
                  saveGame(updated);
                  return updated;
                });
                playRetroSound('fanfare');
                setActiveEvent({
                  title: `🎯 任務達成！${q.title}`,
                  description: `${q.desc}\n\n恭喜獲得獎勵（一次性）：\n✨ 經驗值 +${q.rewardExp} EXP\n🪙 金幣 +${q.rewardGold} G`,
                  icon: '🏆',
                  actionLabel: '查看任務列表',
                  onAction: () => setActiveTab('quests'),
                });
              }
            }
          }
        });
      }

      ctx.imageSmoothingEnabled = false;

      // 1. Draw Chapter-Specific 16-Bit Photo-Realistic Pixel Art World Map
      if (currentChapterIdx === 0) {
        drawCopenhagenWorldMap(ctx, width, height, tick);
      } else if (currentChapterIdx === 1) {
        drawStockholmWorldMap(ctx, width, height, tick);
      } else if (currentChapterIdx === 2) {
        drawLaplandWorldMap(ctx, width, height, tick);
      } else if (currentChapterIdx === 3) {
        drawHelsinkiWorldMap(ctx, width, height, tick);
      } else if (currentChapterIdx === 4) {
        drawTromsoWorldMap(ctx, width, height, tick);
      } else {
        drawIcelandWorldMap(ctx, width, height, tick);
      }

      // 1.5 Draw Rich Town Atmosphere Decorations (路燈、松樹、石砌營火、雪人)
      drawTownAtmosphereDecorations(ctx, currentChapterIdx, width, height, tick);

      // 1.6 Draw Interactive Town Buildings (各國城鎮特色建築 + 地圖特殊建築物)
      drawInteractiveTownBuildings(ctx, currentChapter.id, tick, playerPosRef.current);

      // 1.7 Draw Interactive Nordic Animals (各國可互動式動物靈獸)
      drawInteractiveNordicAnimals(ctx, currentChapter.id, tick, playerPosRef.current, interactedAnimals);

      // 1.8 Draw Interactive Regional Nordic Shop (特色城鎮商鋪)
      const currentShop = NORDIC_SHOPS_CONFIG[currentChapter.id];
      const isPlayerNearShop = currentShop
        ? Math.hypot(playerPosRef.current.x - currentShop.x, playerPosRef.current.y - currentShop.y) < 65
        : false;
      drawNordicShopStation(ctx, currentShop, tick, isPlayerNearShop);

      // 2. Draw Landmarks with Radar Rings
      currentChapter.landmarks.forEach((lm) => {
        const isUnlocked = playerState.unlockedLandmarks.includes(lm.id);

        ctx.fillStyle = isUnlocked ? 'rgba(52, 211, 153, 0.25)' : 'rgba(245, 158, 11, 0.35)';
        ctx.beginPath();
        ctx.arc(lm.x, lm.y, 22, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#0f172a';
        ctx.strokeStyle = isUnlocked ? '#10b981' : '#f59e0b';
        ctx.lineWidth = 2;
        ctx.fillRect(lm.x - 16, lm.y - 16, 32, 32);
        ctx.strokeRect(lm.x - 16, lm.y - 16, 32, 32);

        ctx.font = '16px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(lm.emoji, lm.x, lm.y);

        ctx.font = 'bold 11px monospace';
        ctx.fillStyle = '#f8fafc';
        ctx.fillText(lm.name.split(' ')[0], lm.x, lm.y + 26);
      });

      // 3. Draw All Story Quest-Giver NPCs for the current chapter
      const currentChapterNpcs = PRIMARY_STORY_NPCS.filter((n) => n.chapterId === currentChapter.id);
      currentChapterNpcs.forEach((npc) => {
        const isNpcDone = playerState.claimedNpcRewards.includes(npc.id) || (npc.id === currentChapter.primaryStoryNpcId && isCurrentStoryLearned);
        drawPrimaryStoryNpc(ctx, npc, tick, isNpcDone, playerState.courage);

        // Near-player Interaction prompt badge & animated floating dialogue teaser bubble
        const dNpc = Math.hypot(playerPosRef.current.x - npc.x, playerPosRef.current.y - npc.y);
        if (dNpc < 68) {
          // 1. Ground radar interaction pulse
          const radarPhase = (tick * 0.05) % 1;
          ctx.save();
          ctx.strokeStyle = isNpcDone ? 'rgba(52, 211, 153, 0.75)' : 'rgba(245, 158, 11, 0.85)';
          ctx.lineWidth = 1.8 - radarPhase * 0.8;
          ctx.beginPath();
          ctx.ellipse(npc.x, npc.y + 16, 24 + radarPhase * 14, 9 + radarPhase * 5, 0, 0, Math.PI * 2);
          ctx.stroke();

          // 2. Overhead floating dialogue preview speech bubble
          const speechBob = Math.sin((tick + npc.x) * 0.09) * 3;
          const bubbleX = npc.x;
          const bubbleY = npc.y - 70 + speechBob;
          const rawText = npc.dialogueTree.start?.text || '';
          const teaser = (rawText.startsWith('「') ? rawText.slice(1, 14) : rawText.slice(0, 13)) + '…';

          ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
          ctx.strokeStyle = isNpcDone ? '#10b981' : '#f59e0b';
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.roundRect(bubbleX - 68, bubbleY - 14, 136, 24, [8]);
          ctx.fill();
          ctx.stroke();

          // Speech bubble pointer tail
          ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
          ctx.beginPath();
          ctx.moveTo(bubbleX - 5, bubbleY + 10);
          ctx.lineTo(bubbleX, bubbleY + 16);
          ctx.lineTo(bubbleX + 5, bubbleY + 10);
          ctx.closePath();
          ctx.fill();

          ctx.fillStyle = isNpcDone ? '#a7f3d0' : '#fef08a';
          ctx.font = 'bold 9.5px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(`💬 ${teaser}`, bubbleX, bubbleY - 2);

          // Interactive [E / 點擊] prompt badge below teaser
          ctx.fillStyle = isNpcDone ? '#059669' : '#d97706';
          ctx.beginPath();
          ctx.roundRect(bubbleX - 38, bubbleY + 15, 76, 16, [6]);
          ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 9px sans-serif';
          ctx.fillText('💬 [E/點擊] 交談', bubbleX, bubbleY + 23);
          ctx.restore();
        }
      });

      // 3.5 Draw Roving Historical Moving NPCs (斯德哥爾摩老水手長/金廳學者、冰島大裂谷吟遊詩人/地熱地質學家)
      const currentRovingNpcs = ROVING_HISTORICAL_NPCS.filter((rn) => rn.chapterId === currentChapter.id);
      currentRovingNpcs.forEach((rNpc) => {
        // Autonomous Lifelike Organic Wander AI (非規則自然漫遊狀態機)
        if (!npcWanderStatesRef.current[rNpc.id]) {
          npcWanderStatesRef.current[rNpc.id] = {
            state: 'idle',
            timer: 60 + Math.floor(Math.random() * 80),
            targetX: rNpc.x,
            targetY: rNpc.y,
            baseY: rNpc.y,
            dir: rNpc.dir || 1,
            thoughtEmoji: '💭',
          };
        }
        const ai = npcWanderStatesRef.current[rNpc.id];
        ai.timer--;

        const distToPlayerForAi = Math.hypot(playerPosRef.current.x - rNpc.x, playerPosRef.current.y - rNpc.y);
        if (distToPlayerForAi < 70) {
          // 當玩家接近時：停步轉向玩家致意，不再機械往返
          rNpc.dir = playerPosRef.current.x >= rNpc.x ? 1 : -1;
          ai.state = 'idle';
          ai.thoughtEmoji = '👋';
        } else {
          if (ai.timer <= 0) {
            if (ai.state === 'idle') {
              ai.state = 'walk';
              ai.timer = 90 + Math.floor(Math.random() * 120);
              ai.targetX = rNpc.minX + Math.random() * (rNpc.maxX - rNpc.minX);
              ai.targetY = ai.baseY + (Math.random() - 0.5) * 20;
              ai.thoughtEmoji = ['🚶', '🎵', '❄️', '✨', '📜'][Math.floor(Math.random() * 5)];
            } else {
              ai.state = 'idle';
              ai.timer = 70 + Math.floor(Math.random() * 90);
              ai.thoughtEmoji = ['💭', '☕', '👀', '✨'][Math.floor(Math.random() * 4)];
            }
          }

          if (ai.state === 'walk') {
            const dxW = ai.targetX - rNpc.x;
            const dyW = ai.targetY - rNpc.y;
            const distW = Math.hypot(dxW, dyW);
            if (distW > 4) {
              const stepW = rNpc.speed * 0.75;
              rNpc.x += (dxW / distW) * stepW;
              rNpc.y += (dyW / distW) * (stepW * 0.4);
              rNpc.dir = dxW >= 0 ? 1 : -1;
            } else {
              ai.state = 'idle';
              ai.timer = 60 + Math.floor(Math.random() * 60);
            }
          }
        }

        drawRovingHistoricalNpc(ctx, rNpc, tick);

        const distToRoving = Math.hypot(playerPosRef.current.x - rNpc.x, playerPosRef.current.y - rNpc.y);
        if (distToRoving < 68) {
          // Ground cyan radar pulse
          const radarPhase = (tick * 0.05) % 1;
          ctx.save();
          ctx.strokeStyle = 'rgba(6, 182, 212, 0.85)';
          ctx.lineWidth = 1.8 - radarPhase * 0.8;
          ctx.beginPath();
          ctx.ellipse(rNpc.x, rNpc.y + 16, 24 + radarPhase * 14, 9 + radarPhase * 5, 0, 0, Math.PI * 2);
          ctx.stroke();

          // Overhead floating dialogue teaser bubble
          const speechBob = Math.sin((tick + rNpc.x) * 0.09) * 3;
          const bubbleX = rNpc.x;
          const bubbleY = rNpc.y - 74 + speechBob;
          const rawText = rNpc.dialogue || '';
          const teaser = (rawText.startsWith('「') ? rawText.slice(1, 14) : rawText.slice(0, 13)) + '…';

          ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.roundRect(bubbleX - 70, bubbleY - 14, 140, 24, [8]);
          ctx.fill();
          ctx.stroke();

          // Speech bubble pointer tail
          ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
          ctx.beginPath();
          ctx.moveTo(bubbleX - 5, bubbleY + 10);
          ctx.lineTo(bubbleX, bubbleY + 16);
          ctx.lineTo(bubbleX + 5, bubbleY + 10);
          ctx.closePath();
          ctx.fill();

          ctx.fillStyle = '#67e8f9';
          ctx.font = 'bold 9.5px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(`💬 ${teaser}`, bubbleX, bubbleY - 2);

          // Interactive prompt badge below teaser
          ctx.fillStyle = '#0284c7';
          ctx.beginPath();
          ctx.roundRect(bubbleX - 44, bubbleY + 15, 88, 16, [6]);
          ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 9px sans-serif';
          ctx.fillText('💬 [E/點擊] 歷史討教', bubbleX, bubbleY + 23);
          ctx.restore();

          if (keysDownRef.current['e'] || keysDownRef.current['enter'] || keysDownRef.current[' ']) {
            keysDownRef.current['e'] = false;
            keysDownRef.current['enter'] = false;
            keysDownRef.current[' '] = false;
            setActiveRovingNpc(rNpc);
            playRetroSound('blip');
          }
        }
      });

      // 9. Draw Boss Arena Stage & Mystical Rune Circle
      const bossX = width - 150;
      const bossY = height - 120;
      const isBossBeaten = playerState.clearedBosses.includes(currentChapter.boss.id);
      const distToBoss = Math.hypot(playerPosRef.current.x - bossX, playerPosRef.current.y - bossY);

      // Mystical Glowing Rune Circle on ground
      drawBossSummoningRuneCircle(
        ctx,
        bossX,
        bossY,
        currentChapter.boss.bossType,
        isBossBeaten,
        tick,
        DIFFICULTY_CONFIGS[battleDifficultyRef.current].badge
      );

      drawPixelBossModel(ctx, currentChapter.boss.bossType, bossX, bossY, tick, 0.9, false, 'dialogue');

      // Boss Opening Taunt Speech Bubble on World Map
      const bossMapBubbleW = 210;
      const bossMapBubbleH = 34;
      const bossMapBubbleX = bossX - bossMapBubbleW / 2;
      const bossMapBubbleY = bossY - 82 + Math.sin(tick * 0.08) * 2;
      ctx.save();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.strokeStyle = isBossBeaten ? '#10b981' : '#e11d48';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(bossMapBubbleX, bossMapBubbleY, bossMapBubbleW, bossMapBubbleH, [8]);
      ctx.fill();
      ctx.stroke();

      // Tail pointing down to Boss
      ctx.beginPath();
      ctx.moveTo(bossX - 6, bossMapBubbleY + bossMapBubbleH);
      ctx.lineTo(bossX, bossMapBubbleY + bossMapBubbleH + 8);
      ctx.lineTo(bossX + 6, bossMapBubbleY + bossMapBubbleH);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.font = 'bold 10px sans-serif';
      ctx.fillStyle = '#0f172a';
      ctx.textAlign = 'center';
      const mapTaunt = currentChapter.boss.taunts.start.replace(/[「」]/g, '');
      ctx.fillText(`💬 「${mapTaunt.slice(0, 16)}…」`, bossX, bossMapBubbleY + 14);
      ctx.font = 'bold 9px monospace';
      ctx.fillStyle = '#e11d48';
      ctx.fillText('🎭 點擊或按 [E] 觸發 BOSS 開場對話與決戰', bossX, bossMapBubbleY + 27);
      ctx.restore();

      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'center';
      ctx.fillStyle = isBossBeaten ? '#34d399' : '#fca5a5';
      ctx.fillText(
        isBossBeaten ? `🏆 ${currentChapter.boss.name} (已降伏 · 可重戰)` : `⚔️ 守護決戰: ${currentChapter.boss.name}`,
        bossX,
        bossY + 48
      );

      // Proximity & Interaction Prompt (修復無法觸發BOSS戰：允許重戰且按E/靠近/點擊均可進入)
      if (distToBoss < 85) {
        ctx.fillStyle = 'rgba(15, 23, 42, 0.94)';
        ctx.fillRect(bossX - 70, bossY - 65, 140, 26);
        ctx.strokeStyle = isBossBeaten ? '#10b981' : '#f43f5e';
        ctx.lineWidth = 1.8;
        ctx.strokeRect(bossX - 70, bossY - 65, 140, 26);
        ctx.font = 'bold 10px sans-serif';
        ctx.fillStyle = '#fef08a';
        ctx.fillText(isBossBeaten ? '⚔️ [E] 再次討伐 / 切磋' : '⚔️ [E] 踏入決鬥場開戰', bossX, bossY - 48);

        if (distToBoss < 48 || keysDownRef.current['e'] || keysDownRef.current['enter'] || keysDownRef.current[' ']) {
          keysDownRef.current['e'] = false;
          keysDownRef.current['enter'] = false;
          keysDownRef.current[' '] = false;
          startUndertaleBossBattle();
        }
      }

      // 10. Draw Chapter Boundary Portals with STRICT PROGRESSION LOCK & Smooth Navigation Beacons
      // Left border: Previous chapter
      const prevX = 70;
      const prevY = 405;
      const prevPulse = Math.sin(tick * 0.1) * 3;
      ctx.fillStyle = 'rgba(56, 189, 248, 0.25)';
      ctx.beginPath();
      ctx.arc(prevX, prevY, 26 + prevPulse, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.strokeRect(prevX - 16, prevY - 16, 32, 32);
      ctx.font = '16px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('⬅️', prevX, prevY + 5);

      // Animated Left Chevron Nav Guide
      if (playerPosRef.current.x < 150 && currentChapterIdx > 0) {
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 10px monospace';
        ctx.fillText('<<< 返回上一國度', prevX + 45, prevY - 26);
      }

      // Right border: Next chapter (STRICT LOCK: Must learn story AND beat boss!)
      const nextX = width - 70;
      const nextY = 405;
      const isPortalUnlocked = isCurrentStoryLearned && isCurrentBossBeaten;
      const nextPulse = Math.sin(tick * 0.12) * 3;

      ctx.fillStyle = isPortalUnlocked ? 'rgba(52, 211, 153, 0.35)' : 'rgba(239, 68, 68, 0.35)';
      ctx.beginPath();
      ctx.arc(nextX, nextY, 28 + nextPulse, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = isPortalUnlocked ? '#10b981' : '#ef4444';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(nextX - 18, nextY - 18, 36, 36);

      ctx.font = '16px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(isPortalUnlocked ? '➡️' : '🔒', nextX, nextY + 5);
      ctx.font = '10px monospace';
      ctx.fillStyle = isPortalUnlocked ? '#6ee7b7' : '#fca5a5';
      ctx.fillText(
        isPortalUnlocked
          ? currentChapterIdx === 5
            ? '世界終焉'
            : `${RPG_CHAPTERS[currentChapterIdx + 1]?.countryFlag} 邊界已通`
          : '結界封印中',
        nextX,
        nextY + 30
      );

      // Animated Right Chevron Nav Guide when approaching right border
      if (playerPosRef.current.x > width - 180 && currentChapterIdx < 5) {
        ctx.fillStyle = isPortalUnlocked ? '#34d399' : '#f87171';
        ctx.font = 'bold 10px monospace';
        ctx.fillText(
          isPortalUnlocked
            ? `前往 ${RPG_CHAPTERS[currentChapterIdx + 1]?.country} >>>`
            : '需探明劇情 + 擊敗 BOSS 🔒',
          nextX - 55,
          nextY - 26
        );
      }

      // Boundary Collision & Progression Enforcement (流暢邊界轉場)
      if (playerPosRef.current.x > width - 85 && currentChapterIdx < 5) {
        if (isPortalUnlocked) {
          setCurrentChapterIdx((prev) => prev + 1);
          playerPosRef.current.x = 130;
          playerPosRef.current.y = 380;
          playRetroSound('fanfare');
          setActiveEvent({
            title: `🌍 跨國穿越！抵達 ${RPG_CHAPTERS[currentChapterIdx + 1]?.country}`,
            description: `成功突破邊界結界，已抵達【${RPG_CHAPTERS[currentChapterIdx + 1]?.title}】！`,
            icon: RPG_CHAPTERS[currentChapterIdx + 1]?.countryFlag || '🌍',
          });
        } else {
          // Push player back slightly to safe zone
          playerPosRef.current.x = width - 105;
          playRetroSound('hit');
          setActiveEvent({
            title: '🚫 邊界封印尚未解除！',
            description: `無法前往下一國度【${RPG_CHAPTERS[currentChapterIdx + 1]?.title}】！\n\n通關條件清單：\n• 📖 探尋本區歷史劇情：${
              isCurrentStoryLearned ? '✅ 已向 NPC 探明' : `❌ 尚未向【${primaryNpc.name.split(' ')[0]}】探聽誓約真相`
            }\n• ⚔️ 守護 BOSS 討伐：${
              isCurrentBossBeaten ? '✅ 已擊潰' : `❌ 尚未降伏【${currentChapter.boss.name}】`
            }\n\n請先與地圖上的劇情 NPC 對話並在 Undertale 模式擊敗 BOSS！`,
            icon: '🔒',
          });
        }
      } else if (playerPosRef.current.x < 85 && currentChapterIdx > 0) {
        setCurrentChapterIdx((prev) => prev - 1);
        playerPosRef.current.x = width - 130;
        playerPosRef.current.y = 380;
        playRetroSound('blip');
      }

      // 10.5 Draw Dynamic Player Footprint Trails in Snow/Stone
      drawPlayerFootprintTrails(ctx, playerFootprintsRef.current);
      playerFootprintsRef.current.forEach((fp) => {
        fp.life -= 0.012;
      });
      playerFootprintsRef.current = playerFootprintsRef.current.filter((fp) => fp.life > 0);

      // 11. Draw Player Model
      drawPixelPlayerModel(
        ctx,
        playerPosRef.current.x,
        playerPosRef.current.y,
        playerPosRef.current.dir,
        tick,
        playerState.transportMode
      );

      // Player Name HUD
      ctx.font = 'bold 11px sans-serif';
      ctx.fillStyle = '#38bdf8';
      ctx.textAlign = 'center';
      ctx.fillText(`北境行者 LV.${playerState.level}`, playerPosRef.current.x, playerPosRef.current.y - 30);

      // 12. Soft Drifting Snow Flurries across entire canvas
      ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
      for (let sf = 0; sf < 45; sf++) {
        const sfx = (sf * 43 + tick * 0.8) % width;
        const sfy = (sf * 31 + tick * 1.5) % height;
        ctx.fillRect(sfx, sfy, 2, 2);
      }

      animFrameRef.current = requestAnimationFrame(renderWorldMap);
    };

    animFrameRef.current = requestAnimationFrame(renderWorldMap);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isOpen, activeTab, currentChapterIdx, isCurrentStoryLearned, isCurrentBossBeaten, primaryNpc, activeStoryNpc]);

  // Click on Canvas to Walk or Talk
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const clickY = ((e.clientY - rect.top) / rect.height) * canvas.height;

    // Click on Any Chapter Story NPC
    const currentChapterNpcs = PRIMARY_STORY_NPCS.filter((n) => n.chapterId === currentChapter.id);
    for (const npc of currentChapterNpcs) {
      if (Math.hypot(clickX - npc.x, clickY - npc.y) < 34) {
        setActiveStoryNpc(npc);
        setDialogueNodeKey('start');
        playRetroSound('blip');
        return;
      }
    }

    // Click on Town Interactive Building (點擊城鎮特色建築 / 特殊建築)
    const currentBuildings = NORDIC_BUILDINGS_CONFIG[currentChapter.id] || [];
    for (const bld of currentBuildings) {
      if (Math.hypot(clickX - bld.x, clickY - bld.y) < 46) {
        setActiveBuildingModal(bld);
        playRetroSound('blip');
        return;
      }
    }

    // Click on Interactive Nordic Animal (點擊地圖可互動式動物)
    const currentAnimals = NORDIC_INTERACTIVE_ANIMALS.filter((a) => a.chapterId === currentChapter.id);
    for (const an of currentAnimals) {
      if (Math.hypot(clickX - an.x, clickY - an.y) < 42) {
        setActiveAnimalModal(an);
        setAnimalToast(null);
        playRetroSound('blip');
        return;
      }
    }

    // Click on Town Shop Station (點擊城鎮商鋪進入商店)
    const currentShop = NORDIC_SHOPS_CONFIG[currentChapter.id];
    if (currentShop && Math.hypot(clickX - currentShop.x, clickY - currentShop.y) < 46) {
      setActiveShopModal(currentShop);
      playRetroSound('blip');
      return;
    }

    // Click on Roving Historical NPC (點擊移動歷史 NPC 進行交流)
    const currentRovingNpcs = ROVING_HISTORICAL_NPCS.filter((rn) => rn.chapterId === currentChapter.id);
    for (const rNpc of currentRovingNpcs) {
      if (Math.hypot(clickX - rNpc.x, clickY - rNpc.y) < 38) {
        setActiveRovingNpc(rNpc);
        playRetroSound('blip');
        return;
      }
    }

    // Click on Boss Altar (修復無法觸發BOSS戰：點擊BOSS直接開戰)
    const bossX = canvas.width - 150;
    const bossY = canvas.height - 120;
    if (Math.hypot(clickX - bossX, clickY - bossY) < 65) {
      startUndertaleBossBattle();
      return;
    }

    // Click on Next Chapter Portal Gate (點擊邊界傳送門)
    const nextX = canvas.width - 70;
    const nextY = 405;
    if (Math.hypot(clickX - nextX, clickY - nextY) < 42 && currentChapterIdx < 5) {
      if (isCurrentStoryLearned && isCurrentBossBeaten) {
        setCurrentChapterIdx((prev) => prev + 1);
        playerPosRef.current.x = 130;
        playerPosRef.current.y = 380;
        playRetroSound('fanfare');
      } else {
        playRetroSound('hit');
        setActiveEvent({
          title: '🚫 邊界封印尚未解除！',
          description: `無法前往下一國度【${RPG_CHAPTERS[currentChapterIdx + 1]?.title}】！\n\n通關條件清單：\n• 📖 探尋本區歷史劇情：${
            isCurrentStoryLearned ? '✅ 已向 NPC 探明' : '❌ 尚未探明'
          }\n• ⚔️ 守護 BOSS 討伐：${
            isCurrentBossBeaten ? '✅ 已擊潰' : '❌ 尚未降伏'
          }\n\n請先向 NPC 探聽誓約並在 Undertale 模式擊敗守護 BOSS！`,
          icon: '🔒',
        });
      }
      return;
    }

    playerPosRef.current.x = Math.max(50, Math.min(canvas.width - 50, clickX));
    playerPosRef.current.y = Math.max(70, Math.min(canvas.height - 70, clickY));
    playRetroSound('blip');
  };

  if (!isOpen) return null;

  return (
    <div
      className={
        isFullscreen
          ? 'fixed inset-0 z-[99999] w-screen h-screen max-w-none max-h-none rounded-none p-0 border-0 flex flex-col bg-slate-950 select-none animate-in fade-in'
          : 'fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200 select-none'
      }
    >
      <div
        className={
          isFullscreen
            ? 'w-full h-full flex flex-col bg-slate-900 overflow-hidden'
            : 'relative w-full max-w-6xl bg-slate-900 border-2 border-emerald-500/50 rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[96vh]'
        }
      >
        {/* Retro 16-Bit Top Navigation Bar */}
        <div className="px-4 py-2.5 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-emerald-500/30 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 font-mono text-base font-bold shadow-md">
              🎮
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-white font-serif tracking-wide flex items-center gap-1.5">
                  <span>《北境極光傳奇：五國神話紀元》</span>
                  <span className="text-[10px] font-mono font-bold text-emerald-300 px-1.5 py-0.5 rounded bg-emerald-950 border border-emerald-700">
                    NORDIC AURORA SAGA
                  </span>
                </h2>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                五國神話探索地圖 × 特殊建築與靈獸互動 × BOSS 攻擊召喚旁邊武器彈幕決戰
              </p>
            </div>
          </div>

          {/* Quick HUD Bar */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* HP Bar */}
            <div className="hidden sm:flex flex-col gap-0.5 min-w-[95px]">
              <div className="flex items-center justify-between text-[10px] font-mono text-rose-300">
                <span className="flex items-center gap-1">
                  <Heart className="w-2.5 h-2.5 fill-rose-500 text-rose-500" />
                  <span>決心</span>
                </span>
                <span>
                  {Math.round((playerState.hp / playerState.maxHp) * 100)}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-700">
                <div
                  className="h-full bg-rose-500 rounded-full transition-all duration-300"
                  style={{ width: `${(playerState.hp / playerState.maxHp) * 100}%` }}
                />
              </div>
            </div>

            {/* Level & Gold */}
            <div className="px-2 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-amber-300 hidden md:flex items-center gap-2">
              <span>LV.{playerState.level}</span>
              <span>🪙 {playerState.gold}</span>
            </div>

            {/* Difficulty Level Selector */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              <span className="text-[10px] text-slate-400 font-mono hidden lg:inline px-1">難度:</span>
              {(['easy', 'normal', 'hard', 'lunatic'] as BattleDifficulty[]).map((diffKey) => {
                const cfg = DIFFICULTY_CONFIGS[diffKey];
                const isActive = battleDifficulty === diffKey;
                return (
                  <button
                    key={diffKey}
                    onClick={() => updateDifficulty(diffKey)}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-bold font-mono transition-all cursor-pointer ${
                      isActive
                        ? `${cfg.colorTheme} border font-black shadow-sm`
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`}
                    title={`${cfg.name} - ${cfg.desc}`}
                  >
                    {cfg.badge}
                  </button>
                );
              })}
            </div>

            {/* BGM 8-Bit Chiptune Audio Bar */}
            <div className="hidden sm:flex items-center gap-1.5 bg-slate-950 px-2 py-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={toggleBgmEnabled}
                className="p-1 rounded text-cyan-300 hover:text-white transition-colors cursor-pointer"
                title={bgmEnabled ? '暫停 8-bit BGM' : '播放 8-bit BGM'}
              >
                {bgmEnabled ? <Music className="w-3.5 h-3.5 text-cyan-400 animate-pulse" /> : <Music className="w-3.5 h-3.5 text-slate-500 opacity-60" />}
              </button>
              <select
                value={currentBgmTrack || 'nordic_explore'}
                onChange={(e) => {
                  const tId = e.target.value as BgmTrackId;
                  setCurrentBgmTrack(tId);
                  rpgBgmEngine.startTrack(tId);
                }}
                className="bg-slate-900 border border-slate-700 text-cyan-300 text-[10px] rounded px-1.5 py-0.5 font-mono cursor-pointer hidden xl:block"
                title="即時切換各 BOSS 專屬 8-Bit BGM 曲目"
              >
                <option value="nordic_explore">🎵 北境漫步 (探索)</option>
                <option value="boss_bluetooth">ᛒ 藍牙王·盧恩周波</option>
                <option value="boss_vasa">⚓ 瓦薩船長·深海沉艦</option>
                <option value="boss_sami">🥁 薩米巫師·極光神鼓</option>
                <option value="boss_kantele">🎶 萬奈摩寧·神琴共鳴</option>
                <option value="boss_hardrada">🪓 無情哈拉爾·瓦蘭吉狂戰</option>
                <option value="boss_surtr">🔥 史爾特爾·熔岩終焉</option>
                <option value="boss_ragnarok_lunatic">⚡ 諸神黃昏 (Lunatic)</option>
                <option value="victory_fanfare">🏆 凱旋之歌</option>
              </select>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={bgmVolume}
                onChange={(e) => updateBgmVolume(parseFloat(e.target.value))}
                className="w-14 accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                title={`BGM 音量: ${Math.round(bgmVolume * 100)}%`}
              />
              <span className="text-[9px] font-mono text-cyan-400 w-6">{Math.round(bgmVolume * 100)}%</span>
            </div>

            {/* Fullscreen Toggle Button */}
            <button
              onClick={toggleFullscreen}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors flex items-center gap-1 text-xs"
              title={isFullscreen ? '視窗化 (F)' : '全螢幕 (F)'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4 text-emerald-400" /> : <Maximize2 className="w-4 h-4 text-emerald-400" />}
              <span className="hidden md:inline font-mono text-[11px]">{isFullscreen ? '視窗' : '全螢幕'}</span>
            </button>

            {/* Audio Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title={soundEnabled ? '靜音 8-bit 音效' : '開啟 8-bit 音效'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/60 text-slate-300 hover:text-white transition-colors"
              title="關閉"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Chapter Quick Tabs & Progression Status */}
        <div className="px-4 py-2 bg-slate-950/70 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {RPG_CHAPTERS.map((chap, idx) => {
              const isStoryKnown = playerState.learnedStories.includes(chap.id);
              const isBossCleared = playerState.clearedBosses.includes(chap.boss.id);

              return (
                <button
                  key={chap.id}
                  onClick={() => {
                    // Check if player is allowed to navigate to idx
                    let isLocked = false;
                    for (let c = 0; c < idx; c++) {
                      if (
                        !playerState.learnedStories.includes(RPG_CHAPTERS[c].id) ||
                        !playerState.clearedBosses.includes(RPG_CHAPTERS[c].boss.id)
                      ) {
                        isLocked = true;
                        break;
                      }
                    }
                    if (isLocked) {
                      playRetroSound('hit');
                      setActiveEvent({
                        title: `🔒 國度邊界封印中！`,
                        description: `無法直接跳轉至【${chap.title}】！\n\n根據北歐古老誓約規則：\n必須依序向上一國度的守護 NPC 探明歷史誓約，並在 Undertale 模式彈幕決鬥中戰勝守護 BOSS，方可穿越邊界！`,
                        icon: '🔒',
                      });
                      return;
                    }
                    setCurrentChapterIdx(idx);
                    if (activeTab === 'battle') {
                      startUndertaleBossBattle(undefined, RPG_CHAPTERS[idx]);
                    } else {
                      playRetroSound('blip');
                    }
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                    currentChapterIdx === idx
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/60 font-bold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <span>{chap.countryFlag}</span>
                  <span>{chap.title.split('：')[0]}</span>
                  {isBossCleared ? (
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Lock className="w-3 h-3 text-slate-500" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Mode Switch Tabs */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => {
                setActiveTab('world');
                playRetroSound('blip');
              }}
              className={`px-2.5 py-1 rounded-lg text-xs flex items-center gap-1 transition-colors ${
                activeTab === 'world' ? 'bg-slate-800 text-emerald-300 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Compass className="w-3 h-3" />
              <span>港灣大地圖</span>
            </button>
            <button
              onClick={() => {
                startUndertaleBossBattle();
              }}
              className={`px-2.5 py-1 rounded-lg text-xs flex items-center gap-1 transition-colors ${
                activeTab === 'battle' ? 'bg-slate-800 text-rose-300 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Swords className="w-3 h-3" />
              <span>彈幕 BOSS 決戰</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('quests');
                playRetroSound('blip');
              }}
              className={`px-2.5 py-1 rounded-lg text-xs flex items-center gap-1 transition-colors ${
                activeTab === 'quests' ? 'bg-slate-800 text-amber-300 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Target className="w-3 h-3" />
              <span>任務手冊</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('logbook');
                playRetroSound('blip');
              }}
              className={`px-2.5 py-1 rounded-lg text-xs flex items-center gap-1 transition-colors ${
                activeTab === 'logbook' ? 'bg-slate-800 text-indigo-300 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-3 h-3" />
              <span>景點圖鑑</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('buffs');
                playRetroSound('blip');
              }}
              className={`px-2.5 py-1 rounded-lg text-xs flex items-center gap-1 transition-colors ${
                activeTab === 'buffs' ? 'bg-slate-800 text-cyan-300 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Coffee className="w-3 h-3" />
              <span>星級料理</span>
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="relative flex-1 overflow-y-auto min-h-[420px] bg-slate-950 flex flex-col">
          {/* TAB 1: 2D PHOTO-REALISTIC PIXEL WORLD MAP */}
          {activeTab === 'world' && (
            <div className="relative w-full h-full flex flex-col items-center justify-center p-3">
              <div
                className={`relative w-full ${
                  isFullscreen ? 'h-full max-h-[82vh]' : 'max-w-5xl aspect-[16/9] max-h-[560px]'
                } rounded-2xl overflow-hidden border-2 border-slate-800 shadow-2xl bg-black`}
              >
                <canvas
                  ref={canvasRef}
                  width={1200}
                  height={700}
                  onClick={handleCanvasClick}
                  className="w-full h-full object-contain cursor-crosshair"
                />

                {/* Overlaid Progression Checklist Badge (劇情+BOSS限制) */}
                <div className="absolute top-3 left-3 bg-slate-950/90 backdrop-blur-md border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-left shadow-lg pointer-events-none">
                  <div className="flex items-center gap-2 text-xs font-bold text-white font-serif">
                    <span className="text-base">{currentChapter.countryFlag}</span>
                    <span>{currentChapter.title}</span>
                  </div>
                  <div className="mt-1.5 space-y-1 text-[11px] font-mono">
                    <div className="flex items-center gap-1.5">
                      <span>{isCurrentStoryLearned ? '✅' : '❌'}</span>
                      <span className={isCurrentStoryLearned ? 'text-emerald-300' : 'text-amber-300'}>
                        劇情探尋：{primaryNpc.name.split(' ')[0]} ({isCurrentStoryLearned ? '已解鎖' : '尚未對話'})
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span>{isCurrentBossBeaten ? '✅' : '❌'}</span>
                      <span className={isCurrentBossBeaten ? 'text-emerald-300' : 'text-rose-300'}>
                        守護 BOSS：{currentChapter.boss.name} ({isCurrentBossBeaten ? '已討伐' : '未降伏'})
                      </span>
                    </div>
                  </div>
                </div>

                {/* Exploration Hint */}
                <div className="absolute top-3 right-3 hidden sm:flex items-center gap-2 bg-slate-950/85 backdrop-blur-md border border-slate-800 px-3 py-1.5 rounded-xl text-xs text-slate-300">
                  <Navigation className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                  <span>點擊【{primaryNpc.name.split(' ')[0]}】開啟劇情 · 擊破 BOSS 才能前往下一國度</span>
                </div>
                {/* Direct Boss Battle Trigger Banner */}
                <div className="absolute bottom-3 right-3 flex items-center gap-2">
                  <button
                    onClick={() => startUndertaleBossBattle()}
                    className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-rose-600 via-amber-600 to-rose-600 hover:from-rose-500 hover:to-amber-500 text-white font-bold text-xs shadow-xl border border-rose-400 flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all animate-pulse"
                  >
                    <Swords className="w-4 h-4" />
                    <span>⚔️ 討伐區域 BOSS【{currentChapter.boss.name}】</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/40 text-amber-300 font-mono">
                      {DIFFICULTY_CONFIGS[battleDifficulty].badge}
                    </span>
                  </button>
                </div>
              </div>

              {/* Exploration Hint Footer */}
              <div className="w-full max-w-5xl mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400 px-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-emerald-400">⌨️ 鍵盤控制：</span>
                  <span>WASD 或 方向鍵漫步 · 靠近 NPC 自動觸發劇情 · 按 E 鍵進入 BOSS 戰</span>
                </div>
                <div className="flex items-center gap-3">
                  <span>💬 劇情 NPC 解鎖主線</span>
                  <span>⚔️ 討伐 BOSS 解鎖跨國航線</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: UNDERTALE BULLET DODGE BOSS BATTLE SYSTEM */}
          {activeTab === 'battle' && (
            <div className="p-4 max-w-5xl mx-auto space-y-4 w-full flex flex-col items-center">
              {!inBattle ? (
                /* BOSS PREPARATION & DIFFICULTY SELECTION CHAMBER */
                <div className="w-full bg-slate-900 border-2 border-rose-500/50 rounded-2xl p-5 sm:p-6 space-y-5 text-left shadow-2xl animate-in fade-in">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{currentChapter.countryFlag}</span>
                        <h3 className="text-base sm:text-lg font-bold text-white font-serif">
                          【{currentChapter.country}·守護決戰】{currentChapter.boss.name}
                        </h3>
                        <span className="text-xs px-2 py-0.5 rounded bg-rose-950/80 border border-rose-500 text-rose-300 font-mono font-bold">
                          {currentChapter.boss.title}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        探索歷史誓約，在 Undertale 彈幕戰中展現決心與勇氣！
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-slate-400">難度模式:</span>
                      <span className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold border ${DIFFICULTY_CONFIGS[battleDifficulty].colorTheme}`}>
                        {DIFFICULTY_CONFIGS[battleDifficulty].badge} · {DIFFICULTY_CONFIGS[battleDifficulty].subtitle}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Left: Boss Profile & Historical Lore */}
                    <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-16 rounded-xl bg-rose-950/50 border border-rose-500/40 flex items-center justify-center text-3xl shrink-0 shadow-lg">
                          ⚔️
                        </div>
                      <div>
                        <h4 className="text-sm font-bold text-white font-mono">{currentChapter.boss.name}</h4>
                        <div className="text-xs text-rose-400 font-mono mt-0.5">
                          守護結界強度: {Math.round(DIFFICULTY_CONFIGS[battleDifficulty].hpMult * 100)}% · 專屬 BGM: {rpgBgmEngine.getTrackMeta(getBossBgmTrack(currentChapter.boss.bossType)).title.split(' (')[0]}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          專屬地標彈幕：{currentChapter.boss.skills[0]?.name || '北歐地標敘事彈幕'}
                        </div>
                      </div>
                      </div>

                      <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 font-serif leading-relaxed">
                        「{currentChapter.boss.taunts.start}」
                      </div>

                      <div className="flex items-center justify-between text-xs font-mono pt-1">
                        <span className="text-slate-400">討伐狀態：</span>
                        <span className={isCurrentBossBeaten ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                          {isCurrentBossBeaten ? '✅ 已降伏 (可隨時切磋重戰)' : '⏳ 尚未討伐 (通關跨國航線必備)'}
                        </span>
                      </div>
                    </div>

                    {/* Right: Difficulty Selection Grid */}
                    <div className="space-y-2">
                      <div className="text-xs font-bold text-slate-300 font-mono flex items-center justify-between">
                        <span>🎯 選擇挑戰難度 (DIFFICULTY)</span>
                        <span className="text-[10px] text-slate-400 font-normal">點擊即時切換</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        {(['easy', 'normal', 'hard', 'lunatic'] as BattleDifficulty[]).map((dKey) => {
                          const dCfg = DIFFICULTY_CONFIGS[dKey];
                          const isSel = battleDifficulty === dKey;
                          return (
                            <button
                              key={dKey}
                              onClick={() => updateDifficulty(dKey)}
                              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                                isSel
                                  ? `${dCfg.colorTheme} shadow-lg ring-1 ring-white/20`
                                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/40'
                              }`}
                            >
                              <div className="flex items-center justify-between font-bold text-xs">
                                <span>{dCfg.badge}</span>
                                <span className="text-[10px] font-mono opacity-80">{dCfg.subtitle}</span>
                              </div>
                              <p className="text-[10px] text-slate-400 mt-1 leading-tight line-clamp-2">
                                {dCfg.desc}
                              </p>
                              <div className="text-[10px] font-mono text-amber-300 mt-1.5 flex justify-between">
                                <span>結界: {Math.round(dCfg.hpMult * 100)}%</span>
                                <span>獎勵: {Math.round(dCfg.expMult * 100)}%</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Player Status & Ready Launch Button */}
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3 text-xs">
                      <span className="px-2.5 py-1 rounded-lg bg-amber-950 border border-amber-600 text-amber-300 font-mono font-bold">
                        🔥 勇氣值：{playerState.courage}
                      </span>
                      <span className="text-slate-300">
                        {getCourageCombatBuff(playerState.courage).title}
                      </span>
                    </div>

                    <button
                      onClick={() => startUndertaleBossBattle()}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 via-amber-600 to-rose-600 hover:from-rose-500 hover:to-amber-500 text-white font-bold text-sm shadow-xl transition-all cursor-pointer active:scale-95 flex items-center gap-2 border border-rose-400/80 animate-pulse"
                    >
                      <Swords className="w-4 h-4" />
                      <span>🎭 踏入決鬥場 · 開啟 BOSS 演出與決戰！</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* ACTIVE UNDERTALE NORDIC LANDMARK DANMAKU ARENA (PURE VISUAL STAGE LIKE SCREENSHOT) */
                <div className="w-full space-y-3">
                  {/* Undertale 16-Bit Pixel Stage Canvas */}
                  <div className="relative w-full rounded-2xl overflow-hidden border-2 border-cyan-500/60 shadow-2xl bg-black">
                    <canvas
                      ref={battleCanvasRef}
                      width={860}
                      height={340}
                      onClick={() => {
                        if (battlePhase === 'intro_cutscene') {
                          handleAdvanceBossCutscene();
                        } else if (battlePhase === 'dodge') {
                          flappyVyRef.current = -3.7;
                          flappyFlapCooldownRef.current = 8;
                          if (counterWindowTimerRef.current > 0) {
                            handleTriggerExtremeCounter();
                          }
                        } else if (battlePhase === 'strike_bar') {
                          handleConfirmStrike();
                        } else if (battlePhase === 'menu') {
                          handleUndertaleAction('fight');
                        }
                      }}
                      className="w-full h-auto max-h-[360px] object-cover cursor-pointer"
                    />

                    {/* ⚔️ 各 BOSS 專屬神兵 & 混沌雙刃聖劍：單次單側從框外飛入的 CSS 關鍵影格運動模糊動畫與入框位移軌跡 */}
                    {battlePhase === 'dodge' && isChaosSaberCssWaveActive && activeCssWeaponSide !== 'none' && (() => {
                      const bType = currentChapter.boss.bossType;
                      const cssThemeMap: Record<string, {
                        icon: string;
                        label: string;
                        gradClass: string;
                        glowHex: string;
                        strokeHex: string;
                      }> = {
                        harald_bluetooth: {
                          icon: '🔨',
                          label: '🔨 Mjölnir 雷神戰鎚',
                          gradClass: 'from-sky-400 via-white to-amber-300',
                          glowHex: '#38bdf8',
                          strokeHex: '#38bdf8',
                        },
                        captain_vasa: {
                          icon: '⚓',
                          label: '⚓ Vasa 瓦薩深海巨錨',
                          gradClass: 'from-teal-400 via-emerald-200 to-amber-300',
                          glowHex: '#2dd4bf',
                          strokeHex: '#2dd4bf',
                        },
                        sami_shaman: {
                          icon: '⚔️',
                          label: '⚔️ Chaos Saber 混沌雙刃聖劍',
                          gradClass: 'from-fuchsia-400 via-white to-cyan-300',
                          glowHex: '#e879f9',
                          strokeHex: '#e879f9',
                        },
                        vainamoinen: {
                          icon: '🪕',
                          label: '🪕 Kantele 黃金五弦神琴',
                          gradClass: 'from-amber-300 via-yellow-100 to-purple-300',
                          glowHex: '#facc15',
                          strokeHex: '#facc15',
                        },
                        harald_hardrada: {
                          icon: '🪓',
                          label: '🪓 Blood-Eagle 瓦蘭吉巨斧',
                          gradClass: 'from-rose-500 via-white to-cyan-200',
                          glowHex: '#f43f5e',
                          strokeHex: '#f43f5e',
                        },
                        surtr: {
                          icon: '🗡️',
                          label: '🗡️ Laevateinn 暮光滅世炎魔劍',
                          gradClass: 'from-orange-500 via-amber-200 to-red-500',
                          glowHex: '#f97316',
                          strokeHex: '#f97316',
                        },
                      };
                      const wTheme = cssThemeMap[bType] || cssThemeMap.sami_shaman;

                      return (
                        <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
                          {/* 單側入框位移軌跡弧線 (Only render the currently active side so screen is never crowded!) */}
                          <svg
                            viewBox="0 0 860 340"
                            className="w-full h-full absolute inset-0 opacity-85"
                            preserveAspectRatio="none"
                          >
                            {activeCssWeaponSide === 'left' || activeCssWeaponSide === 'top' ? (
                              <path
                                d="M 95 140 Q 245 170 385 225"
                                fill="none"
                                stroke={wTheme.strokeHex}
                                strokeWidth="3.5"
                                strokeLinecap="round"
                                className="chaos-saber-trajectory-line"
                              />
                            ) : (
                              <path
                                d="M 765 140 Q 615 170 475 225"
                                fill="none"
                                stroke={wTheme.strokeHex}
                                strokeWidth="3.5"
                                strokeLinecap="round"
                                className="chaos-saber-trajectory-line"
                              />
                            )}
                          </svg>

                          {/* 單側框外飛入：BOSS 專屬神兵 + 雙層 CSS 運動模糊殘影 (Motion Blur Ghosts) */}
                          {(activeCssWeaponSide === 'left' || activeCssWeaponSide === 'top') && (
                            <div className="absolute left-[14%] top-[45%]">
                              <div className="chaos-saber-fly-left-ghost-2 absolute top-0 left-0 select-none">
                                <div className={`w-32 h-3.5 rounded-r-full bg-gradient-to-r ${wTheme.gradClass}`} />
                              </div>
                              <div className="chaos-saber-fly-left-ghost-1 absolute top-0 left-0 select-none">
                                <div className={`w-32 h-3.5 rounded-r-full bg-gradient-to-r ${wTheme.gradClass}`} />
                              </div>
                              <div className="chaos-saber-fly-left relative flex items-center select-none">
                                <span className="text-lg mr-1 drop-shadow">{wTheme.icon}</span>
                                <div
                                  className={`w-28 h-3 bg-gradient-to-r ${wTheme.gradClass} rounded-r-full border border-white`}
                                />
                              </div>
                            </div>
                          )}

                          {activeCssWeaponSide === 'right' && (
                            <div className="absolute right-[14%] top-[47%]">
                              <div className="chaos-saber-fly-right-ghost-2 absolute top-0 right-0 select-none">
                                <div className={`w-32 h-3.5 rounded-l-full bg-gradient-to-l ${wTheme.gradClass}`} />
                              </div>
                              <div className="chaos-saber-fly-right-ghost-1 absolute top-0 right-0 select-none">
                                <div className={`w-32 h-3.5 rounded-l-full bg-gradient-to-l ${wTheme.gradClass}`} />
                              </div>
                              <div className="chaos-saber-fly-right relative flex items-center select-none">
                                <div
                                  className={`w-28 h-3 bg-gradient-to-l ${wTheme.gradClass} rounded-l-full border border-white`}
                                />
                                <span className="text-lg ml-1 drop-shadow">{wTheme.icon}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })()}

                    {/* Pure Visual Nordic Boss Crest & Stage BGM Badge with Dynamic Form & Moving Arena HUD */}
                    {(() => {
                      const scaledHp = Math.round(currentChapter.boss.maxHp * (DIFFICULTY_CONFIGS[battleDifficulty]?.hpMult || 1.0));
                      const curForm = getBossForm(battleBossHp, scaledHp);
                      const curFormCfg = (BOSS_FORMS_CONFIG[currentChapter.boss.bossType] || BOSS_FORMS_CONFIG.harald_bluetooth)[curForm];
                      return (
                        <div className="absolute top-3 left-3 flex items-center gap-2 bg-slate-950/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800/90 pointer-events-none shadow-xl">
                          <span className="text-base">{currentChapter.countryFlag}</span>
                          <div className="text-left">
                            <div className="text-xs font-bold text-white font-serif flex items-center gap-1.5 flex-wrap">
                              <span>{currentChapter.boss.name}</span>
                              <span className={`text-[9px] px-1.5 py-0.2 rounded border font-mono ${DIFFICULTY_CONFIGS[battleDifficulty].colorTheme}`}>
                                {DIFFICULTY_CONFIGS[battleDifficulty].badge}
                              </span>
                              <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold border ${
                                curForm === 3
                                  ? 'bg-rose-950 text-rose-300 border-rose-500 animate-pulse'
                                  : curForm === 2
                                  ? 'bg-amber-950 text-amber-300 border-amber-500'
                                  : 'bg-cyan-950 text-cyan-300 border-cyan-500'
                              }`}>
                                {curFormCfg.formBadge}
                              </span>
                            </div>
                            <div className="text-[10px] text-cyan-300 font-mono flex items-center gap-2 mt-0.5">
                              <span className="flex items-center gap-1">
                                <Music className="w-3 h-3 text-cyan-400 animate-pulse" />
                                <span>{rpgBgmEngine.getTrackMeta(currentBgmTrack || getBossBgmTrack(currentChapter.boss.bossType)).title.split(' (')[0]}</span>
                              </span>
                              <span className="text-amber-400/90">
                                🌀 彈幕框：{curFormCfg.boxDynamicPattern}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })()}

                    {/* Visual Soul Vessels Indicator (Pure Heart Runes — No raw HP numbers) */}
                    <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-rose-500/40 pointer-events-none">
                      <div className="flex items-center gap-0.5 text-sm">
                        {Array.from({ length: 6 }).map((_, idx) => {
                          const vesselActive = (playerState.hp / playerState.maxHp) * 6 > idx;
                          return (
                            <span
                              key={idx}
                              className={`transition-all duration-300 ${
                                vesselActive ? 'opacity-100 scale-100 drop-shadow-[0_0_6px_rgba(244,63,94,0.8)]' : 'opacity-20 scale-75 grayscale'
                              }`}
                            >
                              ❤️
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Nordic Narrative Danmaku & Pre-Battle Performance Deck (Removed legacy HP/Fight/Act/Item/Mercy buttons) */}
                  <div className="w-full bg-slate-900/95 border border-slate-800 rounded-2xl p-4 space-y-3 text-left">
                    {/* Audio & Stage Phase Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="text-cyan-400 font-bold font-mono text-xs flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4" />
                          <span>NORDIC LANDMARK DANMAKU STAGE</span>
                        </span>
                        <span className="text-xs">
                          {battlePhase === 'intro_cutscene' ? (
                            <span className="text-amber-300 font-bold font-mono animate-pulse">
                              🎭 BOSS 開戰前劇場演出中（第 {cutsceneStep + 1} / 3 幕）
                            </span>
                          ) : battlePhase === 'strike_bar' ? (
                            <span className="text-amber-400 font-bold font-mono animate-pulse">
                              ⚡ 北歐盧恩反擊波段！對準紅心釋放破擊！
                            </span>
                          ) : battlePhase === 'dodge' ? (
                            <span className="text-rose-400 font-bold font-mono animate-pulse">
                              🔴 地標敘事彈幕展開中！方向鍵 / WASD 操控 ❤️ 穿梭閃避！
                            </span>
                          ) : (
                            <span className="text-emerald-400 font-bold font-mono">🟢 聖物共鳴蓄力完成</span>
                          )}
                        </span>
                      </div>

                      {/* 8-Bit Audio Manager Toolbar */}
                      <div className="flex items-center gap-2 bg-slate-950 px-2.5 py-1 rounded-xl border border-slate-800 text-xs">
                        <button
                          onClick={toggleBgmEnabled}
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold font-mono transition-colors cursor-pointer ${
                            bgmEnabled
                              ? 'bg-cyan-950 text-cyan-300 border border-cyan-700'
                              : 'bg-slate-800 text-slate-500'
                          }`}
                        >
                          {bgmEnabled ? '🎵BGM開' : '🔇BGM關'}
                        </button>

                        <button
                          onClick={() => {
                            setSoundEnabled(!soundEnabled);
                            if (!soundEnabled) playRetroSound('blip');
                          }}
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold font-mono transition-colors cursor-pointer ${
                            soundEnabled
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-600'
                              : 'bg-rose-950 text-rose-300 border border-rose-600'
                          }`}
                        >
                          {soundEnabled ? '🔊音效' : '🔇靜音'}
                        </button>

                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.05"
                          value={soundVolume}
                          onChange={(e) => updateSoundVolume(parseFloat(e.target.value))}
                          className="w-14 accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                        />
                      </div>
                    </div>

                    {/* Fourth Wall Breaking Interactive Event Banners */}
                    {bluetoothGlitchRef.current && (
                      <div className="p-2.5 rounded-xl bg-gradient-to-r from-sky-950 via-slate-900 to-sky-950 border border-sky-400 flex items-center justify-between text-xs animate-pulse">
                        <div className="flex items-center gap-2 text-sky-200">
                          <span className="text-base">📶</span>
                          <span>【第四面牆·藍牙通訊劫持】丹麥古盧恩代碼干擾終端！按 Q 鍵解除並使符文彈幕減速！</span>
                        </div>
                        <button
                          onClick={handleClearBluetoothGlitch}
                          className="px-3 py-1 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold font-mono text-[11px] cursor-pointer shrink-0"
                        >
                          解除干擾 (Q)
                        </button>
                      </div>
                    )}

                    {isInvertedControlsRef.current && (
                      <div className="p-2.5 rounded-xl bg-fuchsia-950/80 border border-fuchsia-500 text-xs text-fuchsia-200 flex items-center gap-2 animate-pulse">
                        <span className="text-base">🪞</span>
                        <span>【第四面牆·極光折射】鏡面維度操作反轉中！碰觸框內 🥁 薩米神鼓破除！</span>
                      </div>
                    )}

                    {/* Pre-Battle Cutscene Interactive Controls */}
                    {battlePhase === 'intro_cutscene' && (
                      <div className="p-3.5 rounded-xl bg-gradient-to-r from-slate-950 via-indigo-950/50 to-slate-950 border border-amber-500/60 flex flex-wrap items-center justify-between gap-3 animate-in fade-in">
                        <div className="space-y-0.5">
                          <div className="text-xs font-bold text-amber-300 font-serif flex items-center gap-2">
                            <span>🎭 【{currentChapter.boss.name}】開戰前劇場獨白演出</span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/80 border border-amber-500/50 text-amber-200">
                              16-Bit 像素表情與肢體動態
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-300">
                            點擊上方舞台畫面或按【空白鍵 SPACE】推進 BOSS 開場台詞，演出結束後立即進入專屬北歐地標彈幕！
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={handleAdvanceBossCutscene}
                            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all cursor-pointer active:scale-95 flex items-center gap-1.5 shadow-lg"
                          >
                            <span>{cutsceneStep < 2 ? '💬 下一句演出 (SPACE)' : '⚔️ 結束演出 · 展開彈幕！'}</span>
                          </button>
                          {cutsceneStep < 2 && (
                            <button
                              onClick={() => {
                                playRetroSound('magic');
                                bossAttackStageRef.current = 'stage1_danmaku';
                                setBossAttackStage('stage1_danmaku');
                                setDodgeTimer(7.0);
                                soulPosRef.current = { x: 430, y: 220, iFrames: 0 };
                                bulletsRef.current = [];
                                flappyPillarsRef.current = [];
                                sideWeaponsRef.current = [];
                                setBossSpeech(getBossHistoricalAttackQuote(currentChapter.boss.bossType, false));
                                setBattlePhase('dodge');
                              }}
                              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono cursor-pointer"
                            >
                              略過演出 ⏭️
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Strike Bar QTE Interactive Prompt */}
                    {battlePhase === 'strike_bar' && (
                      <div className="p-3 bg-amber-950/40 border-2 border-amber-500 rounded-xl space-y-2 text-center animate-in fade-in">
                        <div className="text-xs font-mono text-amber-300 font-bold flex items-center justify-center gap-2">
                          <span className="animate-spin text-sm">⚡</span>
                          <span>游標橫移擺動中！對準中央黃金紅心【CRITICAL】瞬間釋放盧恩破擊！</span>
                        </div>
                        <button
                          onClick={handleConfirmStrike}
                          disabled={strikeDoneRef.current}
                          className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-rose-500 to-amber-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 font-black text-sm shadow-xl transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-2"
                        >
                          <span>💥 釋放盧恩破擊！(SPACE)</span>
                        </button>
                      </div>
                    )}

                    {battlePhase === 'victory' ? (
                      <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500 text-center space-y-2 animate-in zoom-in-95">
                        <div className="text-3xl">🏆</div>
                        <h4 className="text-base font-bold text-emerald-300">歷史大捷！成功降伏守護 BOSS！</h4>
                        <p className="text-xs text-slate-300">
                          獲得傳奇誓約信物：【{currentChapter.boss.rewardItem}】！跨國邊界通道已解除封印！
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                          <button
                            onClick={() => {
                              setInBattle(false);
                              setActiveTab('world');
                            }}
                            className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
                          >
                            返回大地圖前往下一國度
                          </button>
                          <button
                            onClick={() => startUndertaleBossBattle()}
                            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                            <span>再次觀賞演出並重戰</span>
                          </button>
                        </div>
                      </div>
                    ) : battlePhase === 'defeat' ? (
                      <div className="p-4 rounded-xl bg-rose-950/80 border border-rose-500 text-center space-y-2 animate-in zoom-in-95">
                        <div className="text-3xl">💀</div>
                        <h4 className="text-base font-bold text-rose-300">你的靈魂決心碎裂了……</h4>
                        <p className="text-xs text-slate-300">
                          別放棄！保持北境旅者的決心，隨時可以再次挑戰！
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                          <button
                            onClick={() => {
                              setPlayerState((p) => ({ ...p, hp: p.maxHp }));
                              startUndertaleBossBattle();
                            }}
                            className="px-5 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs transition-colors cursor-pointer"
                          >
                            💀 重燃決心再次挑戰
                          </button>
                          <button
                            onClick={() => {
                              updateDifficulty('easy');
                              setPlayerState((p) => ({ ...p, hp: p.maxHp }));
                              startUndertaleBossBattle('easy');
                            }}
                            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 font-bold text-xs transition-colors cursor-pointer border border-emerald-600/60"
                          >
                            🌱 切換為極光漫遊模式重試
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Undertale Iconic 4-Action Grid */
                      <div className="space-y-3">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {/* 1. FIGHT */}
                        <button
                          onClick={() => handleUndertaleAction('fight')}
                          disabled={battlePhase === 'intro_cutscene' || battlePhase === 'strike_bar'}
                          className="p-2.5 rounded-xl bg-slate-950 hover:bg-amber-950/40 disabled:opacity-40 border-2 border-amber-500/70 hover:border-amber-400 text-left transition-all cursor-pointer flex items-center gap-2.5 shadow-lg group"
                        >
                          <span className="text-2xl group-hover:scale-110 transition-transform">⚔️</span>
                          <div>
                            <div className="text-xs font-bold text-amber-300 font-mono tracking-wider">【FIGHT 破擊】</div>
                            <p className="text-[9.5px] text-slate-400 mt-0.5 leading-tight">盧恩精準斬擊</p>
                          </div>
                        </button>

                        {/* 2. ACT 史詩詠唱 (透過與 BOSS 溝通，選對選項有機會直接通關！) */}
                        <button
                          onClick={() => {
                            setIsEpicChantMenuOpen(true);
                            setEpicChantRoundIdx(0);
                            setEpicChantFeedback(null);
                            playRetroSound('blip');
                          }}
                          disabled={battlePhase === 'intro_cutscene' || battlePhase === 'strike_bar'}
                          className="p-2.5 rounded-xl bg-slate-950 hover:bg-cyan-950/40 disabled:opacity-40 border-2 border-cyan-500/70 hover:border-cyan-400 text-left transition-all cursor-pointer flex items-center gap-2.5 shadow-lg group"
                        >
                          <span className="text-2xl group-hover:scale-110 transition-transform">📜</span>
                          <div>
                            <div className="text-xs font-bold text-cyan-300 font-mono tracking-wider flex items-center gap-1">
                              <span>【ACT 詠唱】</span>
                              <span className="text-[8.5px] px-1 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/50">和解通關</span>
                            </div>
                            <p className="text-[9.5px] text-slate-400 mt-0.5 leading-tight">靈魂哲思共鳴溝通</p>
                          </div>
                        </button>

                        {/* 3. ITEM 商店食物 (右下：必須在商店購買食物才能使用！) */}
                        <button
                          onClick={() => {
                            setIsItemMenuOpen(true);
                            playRetroSound('blip');
                          }}
                          disabled={battlePhase === 'intro_cutscene' || battlePhase === 'strike_bar'}
                          className={`p-2.5 rounded-xl bg-slate-950 hover:bg-emerald-950/40 disabled:opacity-40 border-2 text-left transition-all cursor-pointer flex items-center gap-2.5 shadow-lg group relative ${
                            (playerState.inventory || []).filter((i) => i.count > 0).length === 0
                              ? 'border-emerald-600/40 border-dashed hover:border-emerald-500'
                              : 'border-emerald-500/80 hover:border-emerald-400'
                          }`}
                        >
                          <span className="text-2xl group-hover:scale-110 transition-transform">🍲</span>
                          <div>
                            <div className="text-xs font-bold text-emerald-300 font-mono tracking-wider flex items-center gap-1">
                              <span>【ITEM 食物】</span>
                              <span className="text-[8.5px] px-1 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/50 font-mono">
                                {(playerState.inventory || []).filter((i) => i.count > 0).reduce((sum, i) => sum + i.count, 0)} 份
                              </span>
                            </div>
                            <p className="text-[9.5px] text-slate-400 mt-0.5 leading-tight">
                              {(playerState.inventory || []).filter((i) => i.count > 0).length === 0
                                ? '需商店購買料理'
                                : '享用料理修復生命'}
                            </p>
                          </div>
                        </button>

                        {/* 4. MERCY 仁慈寬恕 */}
                        <button
                          onClick={() => handleUndertaleAction('mercy')}
                          disabled={battlePhase === 'intro_cutscene' || battlePhase === 'strike_bar'}
                          className="p-2.5 rounded-xl bg-slate-950 hover:bg-rose-950/40 disabled:opacity-40 border-2 border-rose-500/70 hover:border-rose-400 text-left transition-all cursor-pointer flex items-center gap-2.5 shadow-lg group"
                        >
                          <span className="text-2xl group-hover:scale-110 transition-transform">🕊️</span>
                          <div>
                            <div className="text-xs font-bold text-rose-300 font-mono tracking-wider">【MERCY 寬恕】</div>
                            <p className="text-[9.5px] text-slate-400 mt-0.5 leading-tight">放下兵刃和平交涉</p>
                          </div>
                        </button>
                      </div>
                      </div>
                    )}

                    {/* Courage Auxiliary Relic Seals */}
                    <div className="pt-1 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
                      <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                        <span>🔥 勇氣聖印 ({playerState.courage})：</span>
                        {warcryActiveTurnsRef.current > 0 && <span className="text-amber-400 font-bold">🪓 戰吼加持({warcryActiveTurnsRef.current})</span>}
                        {blessingRegenTurnsRef.current > 0 && <span className="text-cyan-400 font-bold">❄️ 極光癒合({blessingRegenTurnsRef.current})</span>}
                        {aegisChargesRef.current > 0 && <span className="text-emerald-400 font-bold">🛡️ 英靈神盾({aegisChargesRef.current})</span>}
                      </span>
                      <div className="flex flex-wrap items-center gap-2">
                        {COMBAT_SKILLS.map((sk) => {
                          const isUnlocked = playerState.courage >= sk.minCourage;
                          const cd = skillCooldowns[sk.id];
                          const isReady = isUnlocked && cd === 0;
                          return (
                            <button
                              key={sk.id}
                              onClick={() => handleUseSkill(sk.id)}
                              disabled={!isReady}
                              className={`px-2.5 py-1 rounded-lg border text-[11px] font-mono transition-all flex items-center gap-1 ${
                                !isUnlocked
                                  ? 'bg-slate-950 border-slate-800 text-slate-600 cursor-not-allowed'
                                  : !isReady
                                  ? 'bg-slate-900 border-slate-700 text-slate-400 cursor-not-allowed'
                                  : `${sk.badgeColor} cursor-pointer hover:scale-105`
                              }`}
                            >
                              <span>{sk.icon}</span>
                              <span>{sk.name.split(' ')[0]}</span>
                              {!isUnlocked ? (
                                <span className="text-[9px] opacity-75">🔒{sk.minCourage}</span>
                              ) : cd > 0 ? (
                                <span className="text-[9px] text-rose-300">({cd})</span>
                              ) : null}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: QUESTS */}
          {activeTab === 'quests' && (
            <div className="p-5 max-w-5xl mx-auto space-y-4 text-left w-full">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white font-serif flex items-center gap-2">
                    <Target className="w-5 h-5 text-amber-400" />
                    <span>極光探險任務手冊 (一次性獎勵)</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    向核心 NPC 對話解鎖主線，造訪地標自動領取獎勵，獎勵僅限領取一次！
                  </p>
                </div>
                <div className="text-xs font-mono text-amber-300 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800">
                  總完成數：{playerState.completedQuests.length} / {currentChapter.quests.length * 6}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                {currentChapter.quests.map((q) => {
                  const isDone = playerState.completedQuests.includes(q.id);

                  return (
                    <div
                      key={q.id}
                      className={`p-4 rounded-xl border transition-all ${
                        isDone
                          ? 'bg-emerald-950/30 border-emerald-600/50 text-slate-300'
                          : 'bg-slate-900 border-slate-800 text-slate-200'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm font-bold text-white">{q.title}</h4>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                            isDone ? 'bg-emerald-900 text-emerald-300' : 'bg-amber-950 text-amber-300'
                          }`}
                        >
                          {isDone ? '已領取獎勵' : '進行中'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-2 leading-relaxed">{q.desc}</p>
                      <div className="mt-3 pt-2 border-t border-slate-800 text-[11px] font-mono text-amber-400">
                        獎勵：+{q.rewardExp} EXP / +{q.rewardGold} G (單次)
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: LOGBOOK */}
          {activeTab === 'logbook' && (
            <div className="p-5 max-w-5xl mx-auto space-y-4 text-left w-full">
              <div>
                <h3 className="text-base font-bold text-white font-serif flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-emerald-400" />
                  <span>旅者手帳 · 景點歷史圖鑑</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  已探索：{playerState.unlockedLandmarks.length} / 19 處景點
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {currentChapter.landmarks.map((lm) => {
                  const isUnlocked = playerState.unlockedLandmarks.includes(lm.id);

                  return (
                    <div
                      key={lm.id}
                      className={`p-4 rounded-xl border ${
                        isUnlocked
                          ? 'bg-slate-900 border-emerald-500/40 text-slate-200'
                          : 'bg-slate-950/60 border-slate-800 text-slate-500 opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl">{isUnlocked ? lm.emoji : '🔒'}</span>
                        <h4 className="text-sm font-bold text-white">
                          {isUnlocked ? lm.name : '未涉足之秘境'}
                        </h4>
                      </div>
                      {isUnlocked && (
                        <div className="mt-2.5 text-xs text-slate-300 space-y-2">
                          <div className="p-2.5 rounded-lg bg-amber-950/25 border border-amber-500/30">
                            <span className="font-bold text-amber-300 block mb-0.5">📖 地點小故事</span>
                            <p className="text-amber-100/90 leading-relaxed">{lm.historicalLore}</p>
                          </div>
                          <div className="p-2.5 rounded-lg bg-cyan-950/25 border border-cyan-500/30">
                            <span className="font-bold text-cyan-300 block mb-0.5">💡 趣味小知識</span>
                            <p className="text-cyan-100/90 leading-relaxed">{lm.trivia}</p>
                          </div>
                          {lm.mustDo && lm.mustDo.length > 0 && (
                            <div className="p-2.5 rounded-lg bg-emerald-950/25 border border-emerald-500/30">
                              <span className="font-bold text-emerald-300 block mb-1">✅ 必做的事</span>
                              <ul className="list-disc list-inside space-y-0.5 text-emerald-100/90">
                                {lm.mustDo.map((md, mIdx) => (
                                  <li key={mIdx}>{md}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 5: BUFFS & HOTEL */}
          {activeTab === 'buffs' && (
            <div className="p-5 max-w-5xl mx-auto space-y-5 text-left w-full">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>🍲</span>
                  <span>{currentChapter.michelinBuff.name}</span>
                </h4>
                <p className="text-xs text-slate-300">{currentChapter.michelinBuff.description}</p>
                <button
                  onClick={() => {
                    const buff = currentChapter.michelinBuff;
                    playRetroSound('heal');
                    setPlayerState((p) => {
                      const updated = {
                        ...p,
                        activeBuff: buff.name,
                        hp: Math.min(p.maxHp, p.hp + 70),
                        mp: Math.min(p.maxMp, p.mp + 50),
                      };
                      saveGame(updated);
                      return updated;
                    });
                    setActiveEvent({
                      title: `🍽️ 享用美饌：${buff.name}`,
                      description: `${buff.description}\n\n已充滿力量，可在 Undertale 決鬥中展現威能！`,
                      icon: '🍲',
                    });
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors"
                >
                  享用美饌
                </button>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Bed className="w-4 h-4 text-indigo-400" />
                  <span>{currentChapter.hotelSavePoint.name}</span>
                </h4>
                <p className="text-xs text-slate-300">{currentChapter.hotelSavePoint.description}</p>
                <button
                  onClick={() => {
                    playRetroSound('heal');
                    setPlayerState((p) => {
                      const updated = {
                        ...p,
                        hp: p.maxHp,
                        mp: p.maxMp,
                        savePointHotel: currentChapter.hotelSavePoint.name,
                      };
                      saveGame(updated);
                      return updated;
                    });
                    setActiveEvent({
                      title: `🛌 於 ${currentChapter.hotelSavePoint.name} 安歇`,
                      description: '窗外極光照亮雪原，全隊 HP & MP 已完全回滿！',
                      icon: '✨',
                    });
                  }}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors"
                >
                  辦理入住並全回復
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Primary Story NPC Interactive Dialogue Tree Modal */}
        {activeStoryNpc && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in select-none">
            <div className="w-full max-w-lg bg-slate-900 border-2 border-amber-500/80 rounded-2xl p-5 shadow-2xl space-y-4 text-left relative overflow-hidden">
              {/* Nordic Runic Corner Ornaments */}
              <div className="absolute top-0 left-0 w-3.5 h-3.5 border-t-2 border-l-2 border-amber-400 pointer-events-none" />
              <div className="absolute top-0 right-0 w-3.5 h-3.5 border-t-2 border-r-2 border-amber-400 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-3.5 h-3.5 border-b-2 border-l-2 border-amber-400 pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-3.5 h-3.5 border-b-2 border-r-2 border-amber-400 pointer-events-none" />

              {/* NPC Header with Identity, Animated Avatar, Speed Selector and History */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  {/* Animated Talking Avatar Frame */}
                  <div className={`w-13 h-13 rounded-xl bg-amber-950/85 border-2 border-amber-500 flex items-center justify-center text-2xl relative shadow-lg ${isStoryDialogueTyping ? 'npc-talking-active' : ''}`}>
                    <span>{activeStoryNpc.avatar}</span>
                    {/* Floating Speech Emoji when actively speaking */}
                    {isStoryDialogueTyping && (
                      <span className="absolute -top-1.5 -left-1.5 text-[10px] bg-amber-500 text-slate-950 rounded-full px-1 py-0.5 shadow font-bold animate-bounce">
                        💬
                      </span>
                    )}
                    {/* Emotion Face Badge */}
                    <span className="absolute -bottom-1.5 -right-1.5 text-xs bg-slate-950 border border-amber-400 rounded-full px-1 shadow">
                      {getNpcEmotion(playerState.courage).emoji}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white font-serif">{activeStoryNpc.name}</h4>
                    <span className="text-[11px] text-amber-400 font-mono">{activeStoryNpc.title}</span>
                  </div>
                </div>

                {/* Header Action Controls */}
                <div className="flex items-center gap-1.5">
                  {/* Speed Selector Toggle */}
                  <button
                    onClick={() => {
                      playRetroSound('blip');
                      const next = dialogueTextSpeed === 'normal' ? 'fast' : dialogueTextSpeed === 'fast' ? 'instant' : 'normal';
                      setDialogueTextSpeed(next);
                      try {
                        localStorage.setItem('aurora_dialogue_speed_v1', next);
                      } catch {
                        // ignore
                      }
                    }}
                    className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-amber-500/40 text-[10px] font-mono text-amber-300 flex items-center gap-1 transition-all cursor-pointer"
                    title="切換打字語速 (正常 / 快速 / 瞬間)"
                  >
                    <FastForward className="w-3 h-3 text-amber-400" />
                    <span>{dialogueTextSpeed === 'normal' ? '正常' : dialogueTextSpeed === 'fast' ? '快速' : '瞬間'}</span>
                  </button>

                  {/* Backlog / Dialogue History Button */}
                  <button
                    onClick={() => {
                      playRetroSound('blip');
                      setIsDialogueHistoryOpen(true);
                    }}
                    className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-cyan-500/40 text-[10px] font-mono text-cyan-300 flex items-center gap-1 transition-all cursor-pointer"
                    title="查看對話手帳紀錄 (按 H 鍵)"
                  >
                    <History className="w-3 h-3 text-cyan-400" />
                    <span className="hidden sm:inline">紀錄(H)</span>
                  </button>

                  {/* Close Dialog Button */}
                  <button
                    onClick={() => {
                      setActiveStoryNpc(null);
                      setCourageFeedback(null);
                    }}
                    className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                    title="關閉對話 (Esc)"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* NPC Emotion & Player Courage State HUD */}
              {(() => {
                const emotion = getNpcEmotion(playerState.courage);
                return (
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{emotion.emoji}</span>
                      <div>
                        <div className="font-bold text-slate-200 flex items-center gap-1.5">
                          <span>NPC 心理狀態：</span>
                          <span style={{ color: emotion.badgeColor }}>{emotion.label}</span>
                          <span className="font-mono text-[10px] text-slate-400">[{emotion.pixelExpression}]</span>
                        </div>
                        <div className="text-[10px] text-slate-400 italic mt-0.5">{emotion.attitude}</div>
                      </div>
                    </div>
                    <div className="px-2.5 py-1 rounded-lg bg-amber-950/70 border border-amber-500/50 font-mono font-bold text-amber-300 shrink-0 text-center">
                      <div className="text-[10px] text-amber-400/80">目前勇氣值</div>
                      <div className="text-sm font-extrabold text-amber-200">🔥 {playerState.courage}</div>
                    </div>
                  </div>
                );
              })()}

              {/* Courage Delta Floating Notification */}
              {courageFeedback && (
                <div className="p-2.5 rounded-xl bg-gradient-to-r from-amber-950 via-slate-900 to-amber-950 border border-amber-500 text-xs text-amber-200 flex items-center justify-between animate-in fade-in">
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded bg-amber-500 text-slate-950 font-extrabold font-mono text-[11px]">
                      +{courageFeedback.delta} 勇氣
                    </span>
                    <span className="font-serif">{courageFeedback.text}</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono font-bold">戰意已激發</span>
                </div>
              )}

              {/* Hidden Quest Trigger Banner */}
              {activeStoryNpc.hiddenQuest &&
                playerState.courage >= activeStoryNpc.hiddenQuest.minCourage &&
                !playerState.unlockedHiddenQuests.includes(activeStoryNpc.hiddenQuest.id) && (
                  <div className="p-3 rounded-xl bg-gradient-to-r from-amber-950 via-slate-900 to-amber-950 border-2 border-amber-400 text-left space-y-2 animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                        <span className="text-base">👑</span>
                        <span>【隱藏任務解鎖】{activeStoryNpc.hiddenQuest.title}</span>
                      </span>
                      <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500 text-emerald-300 font-mono font-bold text-[10px]">
                        勇氣共鳴達成 ({playerState.courage} / {activeStoryNpc.hiddenQuest.minCourage})
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      {activeStoryNpc.hiddenQuest.desc}
                    </p>
                    <button
                      onClick={() => {
                        playRetroSound('fanfare');
                        const hq = activeStoryNpc.hiddenQuest!;
                        setPlayerState((prev) => {
                          if (prev.unlockedHiddenQuests.includes(hq.id)) return prev;
                          const updated = {
                            ...prev,
                            unlockedHiddenQuests: [...prev.unlockedHiddenQuests, hq.id],
                            exp: prev.exp + hq.rewardExp,
                            gold: prev.gold + hq.rewardGold,
                            activeBuff: hq.rewardBuff,
                          };
                          saveGame(updated);
                          return updated;
                        });
                        setActiveStoryNpc(null);
                        setCourageFeedback(null);
                        setActiveEvent({
                          title: `👑 隱藏任務達成：${hq.title}`,
                          description: `你的英勇之心深深震撼了【${activeStoryNpc.name.split(' ')[0]}】！\n\n獲得專屬傳奇獎勵：\n✨ 經驗值 +${hq.rewardExp} EXP\n🪙 金幣 +${hq.rewardGold} G\n🌟 獲得神聖戰鬥 Buff：【${hq.rewardBuff}】！\n\n在 Undertale 決鬥中將獲得更強大的威力！`,
                          icon: '👑',
                        });
                      }}
                      className="w-full py-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <span>🔥 接下隱藏任務並領取專屬戰意 Buff</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

              {/* Animated Typewriter NPC Speech Text Box */}
              <div
                onClick={skipStoryDialogueTypewriter}
                className="p-4 bg-slate-950/95 rounded-xl border border-amber-500/40 text-xs leading-relaxed text-slate-200 relative group cursor-pointer hover:border-amber-400 transition-all select-none shadow-inner"
                title="點擊此處或按 [空白鍵 / Enter] 跳過打字動畫"
              >
                <p className="font-serif text-sm text-amber-200 whitespace-pre-wrap leading-relaxed">
                  {storyDialogueTypedChars || (activeStoryNpc.dialogueTree[dialogueNodeKey]?.text || activeStoryNpc.dialogueTree.start.text)}
                  {isStoryDialogueTyping && (
                    <span className="inline-block text-amber-400 ml-0.5 animate-pulse font-mono font-bold">▌</span>
                  )}
                  {!isStoryDialogueTyping && (
                    <span className="inline-block text-amber-400 ml-1.5 font-mono text-xs dialog-caret-blink animate-bounce">
                      ▼
                    </span>
                  )}
                </p>

                {/* Animated Bottom Status Cue */}
                <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span className="flex items-center gap-1 text-amber-400/90">
                    {isStoryDialogueTyping ? (
                      <>
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                        <span>逐字陳述中…（點擊或按空白鍵快速顯示）</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3 h-3 text-emerald-400 inline" />
                        <span className="text-emerald-300">陳述完畢 · 可按 [1~{Math.max(1, (activeStoryNpc.dialogueTree[dialogueNodeKey]?.options || []).length)}] 或方向鍵選擇回應</span>
                      </>
                    )}
                  </span>
                  <span className="text-slate-500">
                    {storyDialogueTypedChars.length} / {(activeStoryNpc.dialogueTree[dialogueNodeKey]?.text || activeStoryNpc.dialogueTree.start.text || '').length} 字
                  </span>
                </div>
              </div>

              {/* Interactive Player Choices with Staggered Entrance Animation & Keyboard Shortcuts */}
              <div className="space-y-2">
                <div className="text-[11px] text-slate-400 font-mono flex items-center justify-between">
                  <span>請選擇回應選項（影響勇氣值與劇情走向）：</span>
                  <span className="text-slate-500 text-[10px]">支援快捷鍵 [1~4] · [↑/↓] · Enter</span>
                </div>
                {(activeStoryNpc.dialogueTree[dialogueNodeKey]?.options || []).map((opt, i) => {
                  const isSelected = selectedOptionIndex === i;
                  return (
                    <button
                      key={i}
                      style={{ animationDelay: `${i * 60}ms` }}
                      onMouseEnter={() => {
                        setSelectedOptionIndex(i);
                        playRetroSound('blip');
                      }}
                      onClick={() => executeDialogueOption(opt)}
                      className={`w-full p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer flex items-center justify-between choice-slide-in ${
                        isSelected
                          ? 'bg-slate-800 border-amber-400 text-white shadow-lg ring-1 ring-amber-400/80 scale-[1.01]'
                          : 'bg-slate-800/80 hover:bg-slate-800 hover:border-amber-500/60 border-slate-700 text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {/* Number Key Badge */}
                        <span className={`px-1.5 py-0.5 rounded font-mono text-[10px] font-bold shrink-0 ${
                          isSelected ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 border border-slate-700 text-amber-300'
                        }`}>
                          [{i + 1}]
                        </span>
                        <span className="leading-snug">{opt.label}</span>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 ml-2">
                        {opt.courageDelta ? (
                          <span className="px-1.5 py-0.5 rounded bg-amber-950/80 border border-amber-500/60 text-[10px] text-amber-300 font-mono font-bold">
                            +{opt.courageDelta} 勇氣
                          </span>
                        ) : null}
                        {opt.action === 'learn_story_and_quest' && (
                          <span className="px-1.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/60 text-[10px] text-emerald-300 font-mono font-bold">
                            📜 誓約
                          </span>
                        )}
                        <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isSelected ? 'text-amber-300 translate-x-0.5' : 'text-slate-500'}`} />
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Dialogue History Modal (對話手帳紀錄抽屜) */}
              {isDialogueHistoryOpen && (
                <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md z-20 flex flex-col p-4 animate-in fade-in text-left">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                    <div className="flex items-center gap-2">
                      <History className="w-4 h-4 text-cyan-400" />
                      <h4 className="text-sm font-bold text-white font-serif">📜 冒險旅者對話手帳紀錄 (Saga Backlog)</h4>
                    </div>
                    <button
                      onClick={() => setIsDialogueHistoryOpen(false)}
                      className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-3.5 my-3 pr-1">
                    {dialogueHistory.length === 0 ? (
                      <div className="text-center py-10 text-slate-500 text-xs">
                        尚無歷史對話紀錄
                      </div>
                    ) : (
                      dialogueHistory.map((item, idx) => (
                        <div key={item.id || idx} className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                          <div className="flex items-center gap-2">
                            <span className="text-base">{item.avatar}</span>
                            <span className="font-bold text-xs text-amber-300 font-serif">{item.speaker}</span>
                            <span className="text-[10px] text-slate-400 font-mono">#{idx + 1}</span>
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed font-serif pl-6 whitespace-pre-wrap">
                            {item.text}
                          </p>
                          {item.playerChoice && (
                            <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-emerald-300 pl-6">
                              <span>💬 你的抉擇：{item.playerChoice}</span>
                              {item.courageDelta && (
                                <span className="font-mono text-[10px] text-amber-300 font-bold">+{item.courageDelta} 勇氣</span>
                              )}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex justify-end">
                    <button
                      onClick={() => setIsDialogueHistoryOpen(false)}
                      className="px-4 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition-colors cursor-pointer"
                    >
                      返回對話 (Esc / H)
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Roving Historical NPC Dialogue Modal (移動歷史人物交互) */}
        {activeRovingNpc && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in select-none">
            <div className="w-full max-w-lg bg-slate-900 border-2 border-cyan-400/80 rounded-2xl p-5 shadow-2xl space-y-4 text-left relative overflow-hidden">
              {/* Nordic Cyan Corner Ornaments */}
              <div className="absolute top-0 left-0 w-3.5 h-3.5 border-t-2 border-l-2 border-cyan-400 pointer-events-none" />
              <div className="absolute top-0 right-0 w-3.5 h-3.5 border-t-2 border-r-2 border-cyan-400 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-3.5 h-3.5 border-b-2 border-l-2 border-cyan-400 pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-3.5 h-3.5 border-b-2 border-r-2 border-cyan-400 pointer-events-none" />

              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl bg-cyan-950/80 border-2 border-cyan-400 flex items-center justify-center text-2xl relative shadow-lg ${isRovingDialogueTyping ? 'npc-talking-active' : ''}`}>
                    {activeRovingNpc.avatar}
                    {isRovingDialogueTyping && (
                      <span className="absolute -top-1.5 -left-1.5 text-[10px] bg-cyan-500 text-slate-950 rounded-full px-1 py-0.5 shadow font-bold animate-bounce">
                        💬
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white font-serif">{activeRovingNpc.name}</h4>
                    <span className="text-[11px] text-cyan-300 font-mono">{activeRovingNpc.title}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Speed Selector Toggle */}
                  <button
                    onClick={() => {
                      playRetroSound('blip');
                      const next = dialogueTextSpeed === 'normal' ? 'fast' : dialogueTextSpeed === 'fast' ? 'instant' : 'normal';
                      setDialogueTextSpeed(next);
                      try {
                        localStorage.setItem('aurora_dialogue_speed_v1', next);
                      } catch {
                        // ignore
                      }
                    }}
                    className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-cyan-500/40 text-[10px] font-mono text-cyan-300 flex items-center gap-1 transition-all cursor-pointer"
                    title="切換打字語速"
                  >
                    <FastForward className="w-3 h-3 text-cyan-400" />
                    <span>{dialogueTextSpeed === 'normal' ? '正常' : dialogueTextSpeed === 'fast' ? '快速' : '瞬間'}</span>
                  </button>

                  <button
                    onClick={() => setActiveRovingNpc(null)}
                    className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                    title="關閉 (Esc)"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Animated Dialogue Text */}
              <div
                onClick={skipRovingDialogueTypewriter}
                className="p-3.5 bg-slate-950 rounded-xl border border-cyan-500/30 text-xs text-slate-200 leading-relaxed font-serif relative cursor-pointer hover:border-cyan-400 transition-all select-none shadow-inner"
                title="點擊跳過打字動畫"
              >
                <p className="whitespace-pre-wrap">
                  {rovingDialogueTypedChars || activeRovingNpc.dialogue}
                  {isRovingDialogueTyping && (
                    <span className="inline-block text-cyan-400 ml-0.5 animate-pulse font-mono font-bold">▌</span>
                  )}
                  {!isRovingDialogueTyping && (
                    <span className="inline-block text-cyan-400 ml-1.5 font-mono text-xs dialog-caret-blink animate-bounce">
                      ▼
                    </span>
                  )}
                </p>
                <div className="mt-2 pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-cyan-400/80 font-mono">
                  <span>{isRovingDialogueTyping ? '正在傳述歷史回憶…（點擊跳過）' : '陳述完畢 · 可點擊下方領取賜福'}</span>
                  <span className="text-slate-500">{rovingDialogueTypedChars.length} / {activeRovingNpc.dialogue.length} 字</span>
                </div>
              </div>

              {/* Historical Trivia Lore Box */}
              <div className="p-3 bg-cyan-950/40 rounded-xl border border-cyan-800/60 text-xs text-cyan-200 leading-relaxed space-y-1">
                <div className="font-bold text-cyan-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>📜 深度歷史考據</span>
                </div>
                <p className="text-[11px] text-slate-300">{activeRovingNpc.triviaLore}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 border-t border-slate-800">
                <div className="text-[11px] font-mono text-amber-300">
                  <span>✨ 典故加護：</span>
                  <span className="text-slate-200">{activeRovingNpc.giftBuff}</span>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => {
                      const rNpc = activeRovingNpc;
                      const isFirst = !playerState.claimedNpcRewards.includes(rNpc.id);
                      if (isFirst) {
                        playRetroSound('fanfare');
                        setPlayerState((prev) => {
                          const updated = {
                            ...prev,
                            courage: prev.courage + rNpc.giftCourage,
                            gold: prev.gold + rNpc.giftGold,
                            claimedNpcRewards: [...prev.claimedNpcRewards, rNpc.id],
                            activeBuff: rNpc.giftBuff,
                          };
                          saveGame(updated);
                          return updated;
                        });
                        setActiveEvent({
                          title: `🌟 獲得【${rNpc.name.split(' ')[0]}】歷史誓約賜福！`,
                          description: `${rNpc.triviaLore}\n\n獲得初次交流禮遇（僅限領取一次）：\n🔥 勇氣值 +${rNpc.giftCourage}\n🪙 金幣 +${rNpc.giftGold} G\n🛡️ 特殊加護：${rNpc.giftBuff}`,
                          icon: rNpc.avatar,
                        });
                      } else {
                        playRetroSound('blip');
                        setActiveEvent({
                          title: `🌟 【${rNpc.name.split(' ')[0]}】向你致意`,
                          description: `「旅者，願北歐的歷史之光永遠伴你前行！」\n\n（此前已獲贈過典故禮遇，特殊加護常駐生效中）`,
                          icon: rNpc.avatar,
                        });
                      }
                      setActiveRovingNpc(null);
                    }}
                    className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-lg"
                  >
                    <span>📜 領取歷史典故賜福 (+{activeRovingNpc.giftCourage} 勇氣)</span>
                  </button>
                  <button
                    onClick={() => setActiveRovingNpc(null)}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors cursor-pointer"
                  >
                    告辭
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}


        {/* Interactive Nordic Regional Building Modal (城鎮特色互動建築系統) */}
        {activeBuildingModal && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 animate-in fade-in select-none">
            <div className="w-full max-w-lg bg-slate-900 border-2 border-cyan-500/80 rounded-2xl p-5 shadow-2xl space-y-4 text-left relative overflow-hidden">
              {/* Corner runes */}
              <div className="absolute top-0 left-0 w-3.5 h-3.5 border-t-2 border-l-2 border-cyan-400 pointer-events-none" />
              <div className="absolute top-0 right-0 w-3.5 h-3.5 border-t-2 border-r-2 border-cyan-400 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-3.5 h-3.5 border-b-2 border-l-2 border-cyan-400 pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-3.5 h-3.5 border-b-2 border-r-2 border-cyan-400 pointer-events-none" />

              {/* Building Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-cyan-950/80 border-2 border-cyan-500 flex items-center justify-center text-2xl shadow-lg">
                    {activeBuildingModal.icon}
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white font-serif flex items-center gap-2">
                      <span>{activeBuildingModal.name}</span>
                    </h4>
                    <span className="text-[11px] text-cyan-300 font-mono">
                      {activeBuildingModal.subtitle}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setActiveBuildingModal(null);
                    setBuildingToast(null);
                  }}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Atmosphere / Greeting */}
              <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800 text-xs text-slate-300 leading-relaxed font-serif">
                <p className="text-amber-200/90 font-medium">{activeBuildingModal.greeting}</p>
                <p className="text-slate-400 text-[11px] mt-2 leading-normal">{activeBuildingModal.description}</p>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <button
                  onClick={() => {
                    playRetroSound('fanfare');
                    if (activeBuildingModal.rewardType === 'full_heal') {
                      setPlayerState((p) => ({ ...p, hp: p.maxHp, mp: p.maxMp }));
                    } else if (activeBuildingModal.rewardType === 'attack_boost') {
                      setPlayerState((p) => ({ ...p, attackPower: (p.attackPower || 0) + 15 }));
                    } else if (activeBuildingModal.rewardType === 'courage_lore') {
                      setPlayerState((p) => ({
                        ...p,
                        courage: p.courage + 15,
                        learnedStories: Array.from(new Set([...p.learnedStories, currentChapter.id])),
                      }));
                    } else if (activeBuildingModal.rewardType === 'valkyrie_shield') {
                      aegisChargesRef.current = (aegisChargesRef.current || 0) + 1;
                    } else if (activeBuildingModal.rewardType === 'aurora_show') {
                      auroraSurgeTicksRef.current = 360;
                      setPlayerState((p) => ({ ...p, courage: p.courage + 10 }));
                    } else if (activeBuildingModal.rewardType === 'special_blessing') {
                      aegisChargesRef.current = (aegisChargesRef.current || 0) + 2;
                      setPlayerState((p) => ({
                        ...p,
                        hp: p.maxHp,
                        mp: p.maxMp,
                        courage: p.courage + 20,
                        attackPower: (p.attackPower || 0) + 20,
                        activeBuff: activeBuildingModal.name.split(' (')[0],
                      }));
                    }
                    setBuildingToast(activeBuildingModal.rewardLabel);
                    setTimeout(() => setBuildingToast(null), 3500);
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>{activeBuildingModal.actionButtonText}</span>
                  <span className="text-amber-300">({activeBuildingModal.rewardLabel})</span>
                </button>
              </div>

              {buildingToast && (
                <div className="p-2 rounded-xl bg-emerald-950/80 border border-emerald-500/60 text-xs text-emerald-300 font-mono text-center animate-in fade-in">
                  {buildingToast}
                </div>
              )}
            </div>
          </div>
        )}


        {/* Interactive Nordic Animal Modal (地圖可互動式動物視窗) */}
        {activeAnimalModal && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 animate-in fade-in select-none">
            <div className="w-full max-w-lg bg-slate-900 border-2 border-emerald-400/80 rounded-2xl p-5 shadow-2xl space-y-4 text-left relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-13 h-13 rounded-2xl bg-emerald-950/90 border-2 border-emerald-400 flex items-center justify-center text-3xl shadow-lg animate-bounce">
                    {activeAnimalModal.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-bold text-white font-serif">{activeAnimalModal.name}</h4>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono border border-emerald-500/40">
                        🐾 可互動靈獸
                      </span>
                    </div>
                    <p className="text-[11px] text-emerald-300 font-mono mt-0.5">{activeAnimalModal.species}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setActiveAnimalModal(null);
                    setAnimalToast(null);
                  }}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Animal Cry */}
              <div className="p-3 rounded-xl bg-slate-950 border border-emerald-500/40 text-xs text-emerald-200 font-serif italic">
                {activeAnimalModal.cryText}
              </div>

              {/* Animal Story & Trivia */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                <div className="p-3 rounded-xl bg-amber-950/25 border border-amber-500/30 space-y-1">
                  <div className="font-bold text-amber-300">📖 靈獸小故事</div>
                  <p className="text-amber-100/90 leading-relaxed text-[11px]">{activeAnimalModal.story}</p>
                </div>
                <div className="p-3 rounded-xl bg-cyan-950/25 border border-cyan-500/30 space-y-1">
                  <div className="font-bold text-cyan-300">💡 生態小知識</div>
                  <p className="text-cyan-100/90 leading-relaxed text-[11px]">{activeAnimalModal.trivia}</p>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950/90 border border-slate-800 text-[11px] font-mono text-slate-300 flex items-center justify-between">
                <span>🍎 最愛特產：{activeAnimalModal.favoriteTreat}</span>
                <span className="text-amber-300">✨ 賜福：{activeAnimalModal.blessingName}</span>
              </div>

              {/* Two Interactive Buttons: Pet & Feed */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                <button
                  onClick={() => {
                    playRetroSound('heal');
                    const isFirst = !interactedAnimals.includes(activeAnimalModal.id);
                    if (isFirst) {
                      setInteractedAnimals((prev) => [...prev, activeAnimalModal.id]);
                    }
                    setPlayerState((p) => {
                      const updated = {
                        ...p,
                        hp: Math.min(p.maxHp, p.hp + 45),
                        courage: p.courage + (isFirst ? activeAnimalModal.rewardCourage : 3),
                        activeBuff: activeAnimalModal.blessingName,
                      };
                      saveGame(updated);
                      return updated;
                    });
                    setAnimalToast(`🤚 你溫柔地撫摸了【${activeAnimalModal.name.split(' (')[0]}】！獲得 ${activeAnimalModal.blessingName}！`);
                  }}
                  className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>🤚 溫柔撫摸靈獸 (+HP & 祝福)</span>
                </button>
                <button
                  onClick={() => {
                    playRetroSound('fanfare');
                    const isFirst = !interactedAnimals.includes(activeAnimalModal.id);
                    if (isFirst) {
                      setInteractedAnimals((prev) => [...prev, activeAnimalModal.id]);
                    }
                    setPlayerState((p) => {
                      const updated = {
                        ...p,
                        hp: p.maxHp,
                        mp: p.maxMp,
                        gold: p.gold + (isFirst ? activeAnimalModal.rewardGold : 15),
                        courage: p.courage + (isFirst ? activeAnimalModal.rewardCourage : 4),
                        attackPower: (p.attackPower || 0) + (isFirst ? 12 : 2),
                        activeBuff: activeAnimalModal.blessingName,
                      };
                      saveGame(updated);
                      return updated;
                    });
                    setAnimalToast(`🍎 投餵【${activeAnimalModal.favoriteTreat}】成功！靈獸開心跳躍，全狀態回滿並贈予金幣與勇氣！`);
                  }}
                  className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs shadow-lg cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>🍎 投餵最愛特產 (+{activeAnimalModal.rewardGold}G & 勇氣)</span>
                </button>
              </div>

              {animalToast && (
                <div className="p-2.5 rounded-xl bg-emerald-950/90 border border-emerald-400 text-xs text-emerald-200 font-mono text-center animate-in fade-in">
                  {animalToast}
                </div>
              )}
            </div>
          </div>
        )}

        {/* In-Battle Food Inventory Modal (右下食物：必須在商店購買才能在戰鬥中使用！) */}
        {isItemMenuOpen && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 animate-in fade-in select-none">
            <div className="w-full max-w-lg bg-slate-900 border-2 border-emerald-500/80 rounded-2xl p-5 shadow-2xl space-y-4 text-left relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-500 flex items-center justify-center text-xl shadow-lg">
                    🍲
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white font-serif flex items-center gap-2">
                      <span>戰鬥料理食物背包 (ITEM)</span>
                    </h4>
                    <span className="text-[11px] text-emerald-400 font-mono">
                      ※ 僅可使用在城鎮商店購買的北歐料理美食
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setIsItemMenuOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Items List or Empty Prompt */}
              {(() => {
                const availableFoods = (playerState.inventory || []).filter((i) => i.count > 0);
                if (availableFoods.length === 0) {
                  return (
                    <div className="p-5 rounded-xl bg-slate-950/90 border border-amber-500/40 text-center space-y-3">
                      <div className="text-3xl">🧺</div>
                      <div className="text-sm font-bold text-amber-300 font-serif">背包中沒有任何料理食物！</div>
                      <p className="text-xs text-slate-300 leading-relaxed max-w-sm mx-auto">
                        戰鬥食物必須先在各國【城鎮商店】向店主購買（例如：丹麥新港香料熱紅酒、芬蘭傳統肉桂捲、拉普蘭野生蔓越莓果醬等），方可在 BOSS 戰中使用修復靈魂！
                      </p>
                      <button
                        onClick={() => setIsItemMenuOpen(false)}
                        className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all cursor-pointer"
                      >
                        我知道了，返回戰鬥
                      </button>
                    </div>
                  );
                }

                return (
                  <div className="space-y-2.5 max-h-[280px] overflow-y-auto pr-1">
                    {availableFoods.map((food) => (
                      <div
                        key={food.id}
                        className="p-3 rounded-xl bg-slate-950/90 border border-slate-800 hover:border-emerald-500/60 transition-all flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{food.icon}</span>
                          <div>
                            <div className="text-xs font-bold text-white flex items-center gap-2">
                              <span>{food.name}</span>
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-mono">
                                剩餘: {food.count} 份
                              </span>
                            </div>
                            <p className="text-[10.5px] text-slate-400 mt-0.5">{food.description}</p>
                            <span className="text-[10px] text-cyan-300 font-mono">{food.effectLabel}</span>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            playRetroSound('heal');
                            // Deduct 1 food
                            setPlayerState((p) => {
                              const updatedInv = (p.inventory || []).map((it) =>
                                it.id === food.id ? { ...it, count: it.count - 1 } : it
                              ).filter((it) => it.count > 0);
                              const healHp = food.healAmount || 75;
                              return {
                                ...p,
                                hp: Math.min(p.maxHp, p.hp + healHp),
                                inventory: updatedInv,
                                activeBuff: food.name,
                              };
                            });
                            setBossSpeech(`「……聞到了【${food.name}】的極地濃郁香氣！你的生命容器已全面修復！」`);
                            setIsItemMenuOpen(false);
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold font-mono transition-all cursor-pointer shrink-0 shadow-lg"
                        >
                          享用料理
                        </button>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* Epic Chant Dialogue Communication Modal (史詩詠唱·靈魂溝通共鳴 · 選對選項可直接和平通關！) */}
        {isEpicChantMenuOpen && (() => {
          const bossKey = currentChapter.boss.bossType;
          const chantConfig = BOSS_EPIC_CHANT_DATA[bossKey] || BOSS_EPIC_CHANT_DATA.harald_bluetooth;
          const curRound = chantConfig.rounds[epicChantRoundIdx] || chantConfig.rounds[0];

          return (
            <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 animate-in fade-in select-none">
              <div className="w-full max-w-xl bg-slate-900 border-2 border-cyan-400/90 rounded-2xl p-5 shadow-2xl space-y-4 text-left relative overflow-hidden">
                {/* Runic Corners */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-300 pointer-events-none" />
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-300 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-300 pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-300 pointer-events-none" />

                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-cyan-950/80 border-2 border-cyan-400 flex items-center justify-center text-2xl shadow-lg">
                      {chantConfig.bossAvatar}
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white font-serif flex items-center gap-2">
                        <span>【史詩詠唱 · 靈魂溝通】</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono border border-cyan-500/40">
                          階段 {epicChantRoundIdx + 1} / {chantConfig.rounds.length}
                        </span>
                      </h4>
                      <span className="text-[11px] text-cyan-300 font-mono">
                        {chantConfig.bossName} · {chantConfig.bossTitle}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsEpicChantMenuOpen(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Boss Philosophical Dilemma Speech */}
                <div className="p-4 rounded-xl bg-slate-950/95 border border-cyan-500/40 space-y-2">
                  <div className="text-[11px] text-cyan-400 font-mono flex items-center justify-between">
                    <span>👑 BOSS 靈魂之聲：</span>
                    <span className="text-[10px] text-slate-400">請審慎理解其歷史與內心執念</span>
                  </div>
                  <p className="text-sm font-serif text-amber-200/95 leading-relaxed font-medium">
                    {curRound.prompt}
                  </p>
                </div>

                {/* Intermediate Feedback Banner if player just answered */}
                {epicChantFeedback ? (
                  <div className={`p-4 rounded-xl border text-xs leading-relaxed space-y-3 ${
                    epicChantFeedback.isCorrect
                      ? 'bg-cyan-950/60 border-cyan-400 text-cyan-200'
                      : 'bg-rose-950/60 border-rose-500 text-rose-200'
                  }`}>
                    <div className="font-bold flex items-center gap-2 text-sm">
                      <span>{epicChantFeedback.isCorrect ? '✨ 靈魂共鳴撼動心靈！' : '💢 BOSS 勃然大怒！'}</span>
                    </div>
                    <p className="font-serif italic text-white/90">
                      {epicChantFeedback.quote}
                    </p>
                    <div className="pt-1 flex justify-end">
                      <button
                        onClick={() => {
                          if (epicChantFeedback.isCorrect) {
                            // Advance to next round or direct win
                            if (epicChantRoundIdx < chantConfig.rounds.length - 1) {
                              setEpicChantRoundIdx((prev) => prev + 1);
                              setEpicChantFeedback(null);
                            } else {
                              // Direct PACIFIST CLEAR!
                              playRetroSound('fanfare');
                              setBossSpeech(chantConfig.pacifistClearSpeech);
                              setIsEpicChantMenuOpen(false);
                              setBattlePhase('victory');
                              setPlayerState((p) => ({
                                ...p,
                                gold: p.gold + 180,
                                courage: p.courage + 25,
                                clearedBosses: Array.from(new Set([...p.clearedBosses, currentChapter.boss.id])),
                                learnedStories: Array.from(new Set([...p.learnedStories, currentChapter.id])),
                              }));
                            }
                          } else {
                            // Wrong choice -> Enraged dodge phase!
                            setIsEpicChantMenuOpen(false);
                            setDodgeTimer(6.0);
                            soulPosRef.current = { x: 430, y: 220, iFrames: 0 };
                            bulletsRef.current = [];
                            setBossSpeech('「無知凡人！感受狂暴彈幕的怒火！」');
                            setBattlePhase('dodge');
                          }
                        }}
                        className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer shadow-lg ${
                          epicChantFeedback.isCorrect
                            ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950'
                            : 'bg-rose-600 hover:bg-rose-500 text-white'
                        }`}
                      >
                        {epicChantFeedback.isCorrect
                          ? epicChantRoundIdx < chantConfig.rounds.length - 1
                            ? '🌟 繼續深層共鳴 →'
                            : '🕊️ 達成和平和解通關！'
                          : '⚡ 迎戰狂暴彈幕'}
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Choices list */
                  <div className="space-y-2">
                    <div className="text-[11px] text-slate-400 font-mono">
                      請選擇史詩回應選項（選對深層同理選項可直接通關）：
                    </div>
                    {curRound.choices.map((choice, cIdx) => (
                      <button
                        key={cIdx}
                        onClick={() => {
                          if (choice.isCorrect) {
                            playRetroSound('magic');
                            setEpicChantFeedback({ quote: choice.reaction, isCorrect: true });
                          } else {
                            playRetroSound('hit');
                            setEpicChantFeedback({ quote: choice.reaction, isCorrect: false });
                          }
                        }}
                        className="w-full p-3 rounded-xl bg-slate-950/90 border border-slate-800 hover:border-cyan-400/80 hover:bg-slate-800/80 text-left transition-all cursor-pointer group flex items-start gap-2.5"
                      >
                        <span className="text-cyan-400 font-mono font-bold text-xs mt-0.5 group-hover:scale-125 transition-transform">
                          {cIdx + 1}.
                        </span>
                        <span className="text-xs text-slate-200 group-hover:text-white leading-relaxed font-serif">
                          {choice.text}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })()}

        
        {/* Interactive Nordic Regional Shop Modal (北歐特色商店系統) */}
        {activeShopModal && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 animate-in fade-in select-none">
            <div className="w-full max-w-xl bg-slate-900 border-2 border-amber-500/80 rounded-2xl p-5 shadow-2xl space-y-4 text-left relative overflow-hidden">
              {/* Nordic Runic Corners */}
              <div className="absolute top-0 left-0 w-3.5 h-3.5 border-t-2 border-l-2 border-amber-400 pointer-events-none" />
              <div className="absolute top-0 right-0 w-3.5 h-3.5 border-t-2 border-r-2 border-amber-400 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-3.5 h-3.5 border-b-2 border-l-2 border-amber-400 pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-3.5 h-3.5 border-b-2 border-r-2 border-amber-400 pointer-events-none" />

              {/* Shop Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-950/80 border-2 border-amber-500 flex items-center justify-center text-2xl shadow-lg">
                    {activeShopModal.shopkeeperAvatar}
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white font-serif flex items-center gap-2">
                      <span>{activeShopModal.title}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono border border-amber-500/30">
                        {activeShopModal.subtitle}
                      </span>
                    </h4>
                    <span className="text-[11px] text-amber-400 font-mono">
                      {activeShopModal.shopkeeperName} · {activeShopModal.shopkeeperTitle}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setActiveShopModal(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                  title="離開商店 (Esc)"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Currency & Player Combat Stats Bar */}
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5 font-bold text-amber-400 font-mono">
                    <span>🪙</span>
                    <span>{playerState.gold} G</span>
                  </span>
                  <span className="flex items-center gap-1.5 font-bold text-cyan-400 font-mono">
                    <span>🦁</span>
                    <span>勇氣 {playerState.courage}</span>
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
                  <span className="text-rose-400">❤️ HP: {playerState.hp} / {playerState.maxHp}</span>
                  {playerState.activeBuff && (
                    <span className="text-emerald-400 hidden sm:inline">🛡️ {playerState.activeBuff.slice(0, 10)}…</span>
                  )}
                </div>
              </div>

              {/* Shopkeeper Greeting Bubble */}
              <div className="p-3 bg-amber-950/30 rounded-xl border border-amber-800/40 text-xs text-amber-200 leading-relaxed font-serif">
                <p>{activeShopModal.greeting}</p>
              </div>

              {/* Toast Message */}
              {shopToast && (
                <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/60 text-xs text-emerald-300 font-mono animate-in fade-in flex items-center justify-between">
                  <span>{shopToast.message}</span>
                  <button onClick={() => setShopToast(null)} className="text-emerald-400 hover:text-white cursor-pointer ml-2">
                    ✕
                  </button>
                </div>
              )}

              {/* Catalog Items Grid */}
              <div className="space-y-2.5 max-h-[260px] overflow-y-auto pr-1">
                {activeShopModal.items.map((item) => {
                  const canAfford = playerState.gold >= item.cost;
                  const courageOk = playerState.courage >= item.courageRequired;
                  const isAvailable = canAfford && courageOk;

                  return (
                    <div
                      key={item.id}
                      className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-amber-500/50 transition-all flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-amber-900/30 border border-amber-500/40 flex items-center justify-center text-xl shrink-0">
                          {item.icon}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white font-serif">{item.name}</span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-mono">
                              {item.effectLabel}
                            </span>
                          </div>
                          <p className="text-[10.5px] text-slate-400 leading-tight mt-0.5">{item.description}</p>
                          {item.courageRequired > 0 && (
                            <span className={`text-[10px] font-mono mt-0.5 inline-block ${courageOk ? 'text-cyan-400' : 'text-rose-400'}`}>
                              🦁 需勇氣值 ≥ {item.courageRequired} ({courageOk ? '已達成' : '不足'})
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="shrink-0 flex flex-col items-end gap-1">
                        <span className="text-xs font-bold font-mono text-amber-300">🪙 {item.cost} G</span>
                        <button
                          disabled={!isAvailable}
                          onClick={() => {
                            if (!isAvailable) return;
                            playRetroSound('fanfare');
                            setPlayerState((prev) => {
                              const newGold = prev.gold - item.cost;
                              let newHp = prev.hp;
                              let newMaxHp = prev.maxHp;
                              let newActiveBuff = prev.activeBuff;

                              if (item.buffType === 'heal') {
                                newHp = Math.min(newMaxHp, newHp + item.buffValue);
                              } else if (item.buffType === 'maxHp') {
                                newMaxHp += item.buffValue;
                                newHp += item.buffValue;
                              } else if (item.buffType === 'aegis') {
                                aegisChargesRef.current = (aegisChargesRef.current || 0) + item.buffValue;
                              }
                              newActiveBuff = `${item.name} (${item.effectLabel})`;

                              const curInv = [...(prev.inventory || [])];
                              const existIdx = curInv.findIndex((i) => i.id === item.id);
                              if (existIdx >= 0) {
                                curInv[existIdx] = {
                                  ...curInv[existIdx],
                                  count: curInv[existIdx].count + 1,
                                };
                              } else {
                                curInv.push({
                                  id: item.id,
                                  name: item.name,
                                  icon: item.icon,
                                  count: 1,
                                  healAmount: item.buffValue,
                                  description: item.description,
                                  effectLabel: item.effectLabel,
                                });
                              }

                              const updated = {
                                ...prev,
                                gold: newGold,
                                hp: newHp,
                                maxHp: newMaxHp,
                                activeBuff: newActiveBuff,
                                inventory: curInv,
                              };
                              saveGame(updated);
                              return updated;
                            });

                            setShopToast({
                              message: `🎉 成功購買【${item.name}】！${item.effectLabel}`,
                              type: 'success',
                            });
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all cursor-pointer ${
                            isAvailable
                              ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-md'
                              : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                          }`}
                        >
                          {canAfford ? (courageOk ? '購買' : '勇氣不足') : '金幣不足'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Modal Footer */}
              <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400 font-mono">
                <span>提示：城鎮特產加護會在 Undertale BOSS 戰中常駐生效！</span>
                <button
                  onClick={() => setActiveShopModal(null)}
                  className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  離開
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Global Event Notification Popup */}
        {activeEvent && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in select-none">
            <div className="w-full max-w-md bg-slate-900 border-2 border-emerald-400 rounded-2xl p-5 shadow-2xl space-y-4 text-left">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-950 border border-emerald-500 flex items-center justify-center text-2xl shrink-0">
                  {activeEvent.icon}
                </div>
                <div>
                  <h4 className="text-base font-bold text-white font-serif">{activeEvent.title}</h4>
                  <span className="text-[10px] text-emerald-400 font-mono">SAGA NOTICE</span>
                </div>
              </div>

              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 whitespace-pre-line leading-relaxed max-h-48 overflow-y-auto">
                {activeEvent.description}
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                {activeEvent.actionLabel && activeEvent.onAction && (
                  <button
                    onClick={() => {
                      activeEvent.onAction?.();
                      setActiveEvent(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors"
                  >
                    {activeEvent.actionLabel}
                  </button>
                )}
                <button
                  onClick={() => setActiveEvent(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs transition-colors"
                >
                  確認
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
