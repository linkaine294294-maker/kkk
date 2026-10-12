/**
 * 8-Bit Chiptune Background Music (BGM) Synthesizer Engine
 * Pure Web Audio API implementation with 4 authentic retro sound channels:
 * - Pulse 1: Lead Melody with vibrato and envelope
 * - Pulse 2: Arpeggio / Harmony counterpoint
 * - Triangle: Bassline
 * - Noise: Retro Chiptune Percussion (Kick, Snare, Hi-hat)
 */

export type BgmTrackId =
  | 'nordic_explore'
  | 'boss_clash'
  | 'boss_enrage_p2'
  | 'boss_bluetooth'
  | 'boss_vasa'
  | 'boss_sami'
  | 'boss_kantele'
  | 'boss_hardrada'
  | 'boss_surtr'
  | 'boss_ragnarok_lunatic'
  | 'victory_fanfare'
  | 'polar_express_finale';

export interface BgmTrackMeta {
  id: BgmTrackId;
  title: string;
  composer: string;
  bpm: number;
  tag: string;
}

export const BGM_TRACKS_INFO: Record<BgmTrackId, BgmTrackMeta> = {
  nordic_explore: {
    id: 'nordic_explore',
    title: '北境行者 · 極光荒原漫步',
    composer: '16-Bit Chiptune Nordic Folk',
    bpm: 114,
    tag: '大地圖探索',
  },
  boss_clash: {
    id: 'boss_clash',
    title: '誓約守護者 · 彈幕交鋒曲',
    composer: 'Undertale-style 16-Bit Battle',
    bpm: 144,
    tag: 'BOSS戰 通用',
  },
  boss_enrage_p2: {
    id: 'boss_enrage_p2',
    title: '諸神狂怒 · 極限絕境 (Phase 2)',
    composer: 'Frenetic Chiptune Metal',
    bpm: 168,
    tag: 'BOSS狂暴 Phase 2',
  },
  boss_bluetooth: {
    id: 'boss_bluetooth',
    title: '藍牙王哈拉爾 · 耶靈盧恩皇家進行曲',
    composer: 'Danish Royal Viking Runic March',
    bpm: 138,
    tag: '丹麥 BOSS 專屬',
  },
  boss_vasa: {
    id: 'boss_vasa',
    title: '瓦薩號幽靈艦長 · 1628 深海沉船號子',
    composer: '17th-Century Ghost Warship Shanty',
    bpm: 146,
    tag: '瑞典 BOSS 專屬',
  },
  boss_sami: {
    id: 'boss_sami',
    title: '薩米巫師與極光狼 · 北緯66°神鼓尤伊克',
    composer: 'Lapland Shamanic Drum & Aurora Pulse',
    bpm: 136,
    tag: '拉普蘭 BOSS 專屬',
  },
  boss_kantele: {
    id: 'boss_kantele',
    title: '賢者萬奈摩寧 · 卡勒瓦拉五弦神琴曲',
    composer: 'Finnish Kalevala Runo Harp Chiptune',
    bpm: 142,
    tag: '赫爾辛基 BOSS 專屬',
  },
  boss_hardrada: {
    id: 'boss_hardrada',
    title: '無情者哈拉爾 · 峽灣狂戰雙斧風暴',
    composer: 'Norwegian Varangian Berserker Metal',
    bpm: 156,
    tag: '挪威 BOSS 專屬',
  },
  boss_surtr: {
    id: 'boss_surtr',
    title: '史爾特爾 · 穆斯貝爾海姆諸神黃昏破滅曲',
    composer: 'Icelandic Volcanic Inferno Chiptune',
    bpm: 168,
    tag: '冰島 Final BOSS 專屬',
  },
  boss_ragnarok_lunatic: {
    id: 'boss_ragnarok_lunatic',
    title: '諸神黃昏 · 終焉極限狂想曲',
    composer: 'Neo-Classical Speed Metal Chiptune',
    bpm: 188,
    tag: '諸神黃昏地獄難度',
  },
  victory_fanfare: {
    id: 'victory_fanfare',
    title: '瓦爾哈拉榮光 · 凱旋讚歌',
    composer: 'Heroic 16-Bit Fanfare',
    bpm: 130,
    tag: '大捷凱旋',
  },
  polar_express_finale: {
    id: 'polar_express_finale',
    title: '極地特快車 · 終章極光大誓約',
    composer: 'Grand Polar Express Victory Symphony',
    bpm: 126,
    tag: '圓滿通關大結局',
  },
};

// Note frequencies in Hz
const NOTE_FREQS: Record<string, number> = {
  // Octave 2
  C2: 65.41, D2: 73.42, E2: 82.41, F2: 87.31, G2: 98.0, A2: 110.0, B2: 123.47,
  // Octave 3
  C3: 130.81, 'C#3': 138.59, D3: 146.83, 'D#3': 155.56, E3: 164.81, F3: 174.61, 'F#3': 185.0, G3: 196.0, 'G#3': 207.65, A3: 220.0, 'A#3': 233.08, B3: 246.94,
  // Octave 4
  C4: 261.63, 'C#4': 277.18, D4: 293.66, 'D#4': 311.13, E4: 329.63, F4: 349.23, 'F#4': 369.99, G4: 392.0, 'G#4': 415.3, A4: 440.0, 'A#4': 466.16, B4: 493.88,
  // Octave 5
  C5: 523.25, 'C#5': 554.37, D5: 587.33, 'D#5': 622.25, E5: 659.25, F5: 698.46, 'F#5': 739.99, G5: 783.99, 'G#5': 830.61, A5: 880.0, 'A#5': 932.33, B5: 987.77,
  // Octave 6
  C6: 1046.5, D6: 1174.66, E6: 1318.51, G6: 1567.98,
  // Rest
  R: 0,
};

type NoteStep = [string, number]; // [Note, 16th-note duration count]

// 1. Nordic Overworld Track (Gentle, nostalgic Scandinavian Dorian exploration)
const TRACK_NORDIC_LEAD: NoteStep[] = [
  ['A4', 4], ['C5', 4], ['B4', 2], ['A4', 2], ['G4', 4],
  ['E4', 4], ['G4', 4], ['A4', 8],
  ['C5', 4], ['D5', 4], ['E5', 6], ['D5', 2],
  ['C5', 4], ['B4', 4], ['A4', 8],
  ['F4', 4], ['A4', 4], ['G4', 4], ['E4', 4],
  ['D4', 4], ['F4', 4], ['E4', 8],
  ['A4', 2], ['B4', 2], ['C5', 4], ['B4', 2], ['G4', 2], ['A4', 4],
  ['E4', 4], ['G4', 4], ['A4', 8],
];

const TRACK_NORDIC_BASS: NoteStep[] = [
  ['A2', 4], ['A3', 4], ['E3', 4], ['A3', 4],
  ['C3', 4], ['C4', 4], ['G2', 4], ['G3', 4],
  ['A2', 4], ['A3', 4], ['F2', 4], ['F3', 4],
  ['D3', 4], ['D4', 4], ['E2', 4], ['E3', 4],
  ['F2', 4], ['F3', 4], ['C3', 4], ['C4', 4],
  ['D3', 4], ['D4', 4], ['E2', 4], ['E3', 4],
  ['A2', 4], ['A3', 4], ['G2', 4], ['G3', 4],
  ['A2', 4], ['E3', 4], ['A2', 8],
];

// 2. Boss Battle Track (Undertale / Megalovania style fast drive in D Minor)
const TRACK_BOSS_LEAD: NoteStep[] = [
  ['D4', 2], ['D4', 2], ['D5', 4], ['A4', 4], ['G#4', 2], ['G4', 2],
  ['F4', 4], ['D4', 2], ['F4', 2], ['G4', 4], ['C4', 4],
  ['D4', 2], ['D4', 2], ['D5', 4], ['A4', 4], ['C5', 2], ['D5', 2],
  ['F5', 4], ['E5', 4], ['D5', 4], ['A4', 4],
  ['A#4', 2], ['A#4', 2], ['D5', 4], ['A4', 4], ['G4', 4],
  ['F4', 4], ['G4', 4], ['A4', 4], ['D4', 4],
  ['F4', 2], ['G4', 2], ['A4', 4], ['G4', 2], ['F4', 2], ['E4', 4],
  ['D4', 4], ['F4', 4], ['D4', 8],
];

const TRACK_BOSS_BASS: NoteStep[] = [
  ['D3', 2], ['D3', 2], ['D3', 2], ['D3', 2], ['D3', 2], ['D3', 2], ['D3', 2], ['D3', 2],
  ['C3', 2], ['C3', 2], ['C3', 2], ['C3', 2], ['B2', 2], ['B2', 2], ['B2', 2], ['B2', 2],
  ['A#2', 2], ['A#2', 2], ['A#2', 2], ['A#2', 2], ['A2', 2], ['A2', 2], ['A2', 2], ['A2', 2],
  ['G2', 2], ['G2', 2], ['A2', 2], ['A2', 2], ['D3', 4], ['D2', 4],
  ['D3', 2], ['D3', 2], ['D3', 2], ['D3', 2], ['D3', 2], ['D3', 2], ['D3', 2], ['D3', 2],
  ['C3', 2], ['C3', 2], ['C3', 2], ['C3', 2], ['B2', 2], ['B2', 2], ['B2', 2], ['B2', 2],
  ['A#2', 2], ['A#2', 2], ['A#2', 2], ['A#2', 2], ['A2', 2], ['A2', 2], ['A2', 2], ['A2', 2],
  ['D3', 2], ['A2', 2], ['D3', 4], ['D2', 8],
];

// 3. Boss Phase 2 Enrage Track (Relentless syncopated Viking fury at 168 BPM)
const TRACK_ENRAGE_LEAD: NoteStep[] = [
  ['D5', 2], ['F5', 2], ['D5', 2], ['A5', 4], ['G#5', 2], ['G5', 2], ['F5', 2],
  ['E5', 2], ['F5', 2], ['G5', 2], ['F5', 2], ['E5', 2], ['D5', 2], ['C#5', 4],
  ['D5', 2], ['A4', 2], ['D5', 2], ['F5', 2], ['A5', 4], ['D6', 4],
  ['C6', 2], ['A#5', 2], ['A5', 2], ['G5', 2], ['A5', 8],
  ['F5', 2], ['D5', 2], ['F5', 2], ['G#5', 4], ['G5', 2], ['F5', 2], ['D5', 2],
  ['F5', 2], ['G5', 2], ['A5', 2], ['A#5', 2], ['A5', 4], ['G5', 4],
  ['A5', 2], ['D5', 2], ['F5', 2], ['A5', 2], ['C#6', 4], ['D6', 4],
  ['D5', 4], ['A4', 4], ['D5', 8],
];

const TRACK_ENRAGE_BASS: NoteStep[] = [
  ['D2', 2], ['D3', 2], ['D2', 2], ['D3', 2], ['D2', 2], ['D3', 2], ['D2', 2], ['D3', 2],
  ['C#2', 2], ['C#3', 2], ['C#2', 2], ['C#3', 2], ['C#2', 2], ['C#3', 2], ['C#2', 2], ['C#3', 2],
  ['D2', 2], ['D3', 2], ['D2', 2], ['D3', 2], ['D2', 2], ['D3', 2], ['D2', 2], ['D3', 2],
  ['G2', 2], ['G3', 2], ['A2', 2], ['A3', 2], ['D2', 4], ['D3', 4],
  ['A#2', 2], ['A#3', 2], ['A#2', 2], ['A#3', 2], ['A2', 2], ['A3', 2], ['A2', 2], ['A3', 2],
  ['G2', 2], ['G3', 2], ['G2', 2], ['G3', 2], ['A2', 2], ['A3', 2], ['A2', 2], ['A3', 2],
  ['D2', 2], ['D3', 2], ['F2', 2], ['F3', 2], ['A2', 2], ['A3', 2], ['D3', 2], ['D4', 2],
  ['D2', 4], ['A2', 4], ['D3', 8],
];

// 4. Victory Fanfare (Triumphant resolution)
const TRACK_VICTORY_LEAD: NoteStep[] = [
  ['C4', 2], ['E4', 2], ['G4', 2], ['C5', 4], ['R', 2], ['G4', 2], ['C5', 6],
  ['D5', 2], ['E5', 2], ['F5', 2], ['E5', 2], ['D5', 2], ['C5', 6],
  ['G4', 2], ['A4', 2], ['B4', 2], ['C5', 4], ['D5', 4], ['E5', 4],
  ['C5', 8], ['R', 4],
];

const TRACK_VICTORY_BASS: NoteStep[] = [
  ['C3', 4], ['G3', 4], ['C3', 4], ['G3', 4],
  ['F3', 4], ['G3', 4], ['C3', 8],
  ['G2', 4], ['G3', 4], ['G2', 4], ['G3', 4],
  ['C3', 8], ['C2', 4],
];

// 5. Denmark Boss: Harald Bluetooth (Royal Viking Runic March in C Minor / Dorian, 138 BPM)
const TRACK_BLUETOOTH_LEAD: NoteStep[] = [
  ['C4', 4], ['G4', 4], ['D#4', 2], ['F4', 2], ['G4', 4],
  ['A#4', 4], ['A4', 2], ['G4', 2], ['F4', 4], ['D#4', 4],
  ['C4', 2], ['D4', 2], ['D#4', 4], ['G4', 4], ['C5', 4],
  ['B4', 2], ['C5', 2], ['D5', 4], ['G4', 8],
  ['C5', 4], ['A#4', 4], ['A4', 2], ['G4', 2], ['F4', 4],
  ['G4', 4], ['D#4', 4], ['D4', 4], ['G3', 4],
  ['C4', 2], ['D#4', 2], ['G4', 2], ['C5', 2], ['D5', 4], ['D#5', 4],
  ['D5', 4], ['B4', 4], ['C5', 8],
];

const TRACK_BLUETOOTH_BASS: NoteStep[] = [
  ['C2', 4], ['G2', 4], ['C3', 4], ['G2', 4],
  ['A#2', 4], ['F2', 4], ['A#2', 4], ['G2', 4],
  ['G#2', 4], ['D#2', 4], ['G#2', 4], ['F2', 4],
  ['G2', 4], ['D2', 4], ['G2', 4], ['G3', 4],
  ['C2', 4], ['G2', 4], ['F2', 4], ['C3', 4],
  ['D#2', 4], ['A#2', 4], ['G2', 4], ['D2', 4],
  ['G#2', 4], ['D#3', 4], ['F2', 4], ['C3', 4],
  ['G2', 4], ['G3', 4], ['C2', 8],
];

// 6. Sweden Boss: Captain Vasa (1628 Ghost Ship Sea Shanty in E Minor, 146 BPM)
const TRACK_VASA_LEAD: NoteStep[] = [
  ['E4', 4], ['B4', 4], ['B4', 2], ['A4', 2], ['G4', 2], ['F#4', 2],
  ['E4', 4], ['G4', 4], ['F#4', 4], ['B3', 4],
  ['E4', 4], ['B4', 4], ['C5', 2], ['B4', 2], ['A4', 2], ['G4', 2],
  ['F#4', 4], ['A4', 4], ['B4', 8],
  ['E5', 4], ['D5', 2], ['C5', 2], ['B4', 4], ['G4', 4],
  ['A4', 4], ['G4', 2], ['F#4', 2], ['E4', 4], ['B4', 4],
  ['G4', 2], ['A4', 2], ['B4', 4], ['A4', 2], ['G4', 2], ['F#4', 4],
  ['E4', 4], ['B3', 4], ['E4', 8],
];

const TRACK_VASA_BASS: NoteStep[] = [
  ['E2', 2], ['E3', 2], ['B2', 4], ['E2', 2], ['E3', 2], ['B2', 4],
  ['C2', 4], ['G2', 4], ['B2', 4], ['F#2', 4],
  ['E2', 2], ['E3', 2], ['B2', 4], ['A2', 4], ['E3', 4],
  ['D2', 4], ['A2', 4], ['B2', 4], ['B3', 4],
  ['C3', 4], ['G2', 4], ['E2', 4], ['B2', 4],
  ['A2', 4], ['E2', 4], ['E3', 4], ['D3', 4],
  ['C3', 4], ['G2', 4], ['B2', 4], ['F#2', 4],
  ['E2', 4], ['B2', 4], ['E2', 8],
];

// 7. Lapland Boss: Sámi Shaman & Fenrir (Shamanic Drum & Joik Aurora Pulse in A Phrygian/Dorian, 136 BPM)
const TRACK_SAMI_LEAD: NoteStep[] = [
  ['A4', 2], ['E5', 4], ['D5', 2], ['C5', 4], ['B4', 2], ['A4', 2],
  ['G4', 4], ['A4', 2], ['C5', 2], ['E4', 8],
  ['A4', 2], ['E5', 4], ['F5', 2], ['E5', 4], ['D5', 2], ['C5', 2],
  ['B4', 4], ['G4', 4], ['A4', 8],
  ['A5', 4], ['G5', 2], ['E5', 2], ['D5', 4], ['C5', 4],
  ['D5', 2], ['E5', 2], ['C5', 4], ['A4', 4], ['E4', 4],
  ['F4', 2], ['G4', 2], ['A4', 4], ['C5', 2], ['B4', 2], ['G4', 4],
  ['A4', 4], ['E4', 4], ['A4', 8],
];

const TRACK_SAMI_BASS: NoteStep[] = [
  ['A2', 2], ['A2', 2], ['E3', 4], ['A2', 2], ['A2', 2], ['E3', 4],
  ['G2', 2], ['G2', 2], ['D3', 4], ['E2', 2], ['E2', 2], ['B2', 4],
  ['A2', 2], ['A2', 2], ['E3', 4], ['F2', 2], ['F2', 2], ['C3', 4],
  ['G2', 2], ['G2', 2], ['D3', 4], ['A2', 4], ['A3', 4],
  ['F2', 2], ['F2', 2], ['C3', 4], ['G2', 2], ['G2', 2], ['D3', 4],
  ['A2', 2], ['A2', 2], ['E3', 4], ['A2', 2], ['G2', 2], ['E2', 4],
  ['F2', 2], ['F2', 2], ['C3', 4], ['G2', 2], ['G2', 2], ['D3', 4],
  ['A2', 2], ['E3', 2], ['A2', 4], ['A2', 8],
];

// 8. Helsinki Boss: Väinämöinen (Kalevala 5-String Kantele Runo Harp in D Dorian, 142 BPM)
const TRACK_KANTELE_LEAD: NoteStep[] = [
  ['D5', 2], ['E5', 2], ['F5', 2], ['G5', 2], ['A5', 4], ['F5', 4],
  ['G5', 2], ['F5', 2], ['E5', 2], ['D5', 2], ['E5', 4], ['A4', 4],
  ['D5', 2], ['E5', 2], ['F5', 2], ['G5', 2], ['A5', 4], ['B5', 4],
  ['A5', 2], ['G5', 2], ['F5', 2], ['E5', 2], ['D5', 8],
  ['A5', 2], ['F5', 2], ['D5', 2], ['F5', 2], ['G5', 2], ['E5', 2], ['C5', 2], ['E5', 2],
  ['F5', 2], ['D5', 2], ['B4', 2], ['D5', 2], ['E5', 4], ['A4', 4],
  ['D5', 2], ['F5', 2], ['E5', 2], ['G5', 2], ['F5', 2], ['A5', 2], ['G5', 2], ['E5', 2],
  ['D5', 4], ['A4', 4], ['D5', 8],
];

const TRACK_KANTELE_BASS: NoteStep[] = [
  ['D3', 4], ['A3', 4], ['D3', 4], ['A3', 4],
  ['C3', 4], ['G3', 4], ['A2', 4], ['E3', 4],
  ['D3', 4], ['A3', 4], ['G2', 4], ['D3', 4],
  ['A2', 4], ['E3', 4], ['D3', 4], ['D2', 4],
  ['F2', 4], ['C3', 4], ['C3', 4], ['G3', 4],
  ['G2', 4], ['D3', 4], ['A2', 4], ['E3', 4],
  ['D3', 4], ['F3', 4], ['G3', 4], ['A3', 4],
  ['D3', 4], ['A2', 4], ['D2', 8],
];

// 9. Norway Boss: Harald Hardrada (Varangian Berserker Fjord Storm in F# Minor, 156 BPM)
const TRACK_HARDRADA_LEAD: NoteStep[] = [
  ['F#4', 2], ['F#4', 2], ['C#5', 4], ['B4', 2], ['A4', 2], ['G#4', 2], ['A4', 2],
  ['B4', 4], ['F#4', 4], ['E4', 4], ['C#4', 4],
  ['F#4', 2], ['G#4', 2], ['A4', 2], ['B4', 2], ['C#5', 4], ['F#5', 4],
  ['E5', 2], ['D5', 2], ['C#5', 4], ['B4', 8],
  ['D5', 4], ['C#5', 2], ['B4', 2], ['A4', 4], ['F#4', 4],
  ['G#4', 2], ['A4', 2], ['B4', 4], ['C#5', 4], ['E5', 4],
  ['F#5', 2], ['E5', 2], ['D5', 2], ['C#5', 2], ['B4', 2], ['A4', 2], ['G#4', 4],
  ['F#4', 4], ['C#5', 4], ['F#4', 8],
];

const TRACK_HARDRADA_BASS: NoteStep[] = [
  ['F#2', 2], ['F#3', 2], ['F#2', 2], ['F#3', 2], ['D2', 2], ['D3', 2], ['D2', 2], ['D3', 2],
  ['E2', 2], ['E3', 2], ['E2', 2], ['E3', 2], ['C#2', 2], ['C#3', 2], ['C#2', 2], ['C#3', 2],
  ['F#2', 2], ['F#3', 2], ['F#2', 2], ['F#3', 2], ['B2', 2], ['B3', 2], ['B2', 2], ['B3', 2],
  ['C#2', 2], ['C#3', 2], ['C#2', 2], ['C#3', 2], ['F#2', 4], ['C#2', 4],
  ['D2', 2], ['D3', 2], ['D2', 2], ['D3', 2], ['F#2', 2], ['F#3', 2], ['F#2', 2], ['F#3', 2],
  ['E2', 2], ['E3', 2], ['E2', 2], ['E3', 2], ['A2', 2], ['A3', 2], ['C#2', 2], ['C#3', 2],
  ['D2', 2], ['D3', 2], ['B2', 2], ['B3', 2], ['C#2', 2], ['C#3', 2], ['C#2', 2], ['C#3', 2],
  ['F#2', 4], ['C#2', 4], ['F#2', 8],
];

// 10. Iceland Final Boss: Surtr of Muspelheim (Volcanic Inferno Doom Metal in E Phrygian Dominant, 168 BPM)
const TRACK_SURTR_LEAD: NoteStep[] = [
  ['E4', 2], ['F4', 2], ['G#4', 2], ['A4', 2], ['B4', 4], ['C5', 2], ['B4', 2],
  ['A4', 2], ['G#4', 2], ['F4', 2], ['G#4', 2], ['E4', 8],
  ['E4', 2], ['G#4', 2], ['B4', 2], ['D5', 2], ['F5', 4], ['E5', 4],
  ['D5', 2], ['C5', 2], ['B4', 2], ['A4', 2], ['G#4', 8],
  ['E5', 2], ['F5', 2], ['E5', 2], ['D5', 2], ['C5', 4], ['B4', 4],
  ['A4', 2], ['B4', 2], ['C5', 2], ['A4', 2], ['G#4', 4], ['E4', 4],
  ['F4', 2], ['G#4', 2], ['A4', 2], ['B4', 2], ['C5', 2], ['D5', 2], ['F5', 4],
  ['E5', 4], ['B4', 4], ['E5', 8],
];

const TRACK_SURTR_BASS: NoteStep[] = [
  ['E2', 2], ['E2', 2], ['F2', 2], ['E2', 2], ['G#2', 2], ['E2', 2], ['A2', 2], ['F2', 2],
  ['E2', 2], ['E2', 2], ['D2', 2], ['E2', 2], ['F2', 4], ['E2', 4],
  ['E2', 2], ['E2', 2], ['G#2', 2], ['B2', 2], ['D3', 4], ['C3', 4],
  ['B2', 2], ['A2', 2], ['G#2', 2], ['F2', 2], ['E2', 4], ['B2', 4],
  ['C2', 2], ['C3', 2], ['C2', 2], ['C3', 2], ['G#2', 2], ['G#3', 2], ['E2', 2], ['E3', 2],
  ['A2', 2], ['A3', 2], ['F2', 2], ['F3', 2], ['E2', 4], ['E3', 4],
  ['F2', 2], ['F3', 2], ['G#2', 2], ['G#3', 2], ['A2', 2], ['A3', 2], ['B2', 2], ['B3', 2],
  ['E2', 4], ['B2', 4], ['E2', 8],
];

class RpgBgmEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isPlaying = false;
  private currentTrackId: BgmTrackId | null = null;
  private volume = 0.6;
  private enabled = true;
  private timerId: number | null = null;
  private nextStartTime = 0;
  private activeNodes: (AudioNode | OscillatorNode)[] = [];
  private noiseBuffer: AudioBuffer | null = null;
  private tempoMultiplier = 1.0;

  constructor() {
    try {
      const savedVol = localStorage.getItem('rpg_bgm_volume_v1');
      if (savedVol !== null) this.volume = Math.max(0, Math.min(1, parseFloat(savedVol)));
      const savedEn = localStorage.getItem('rpg_bgm_enabled_v1');
      if (savedEn !== null) this.enabled = savedEn === 'true';
    } catch {
      // ignore
    }
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    if (!this.masterGain && this.ctx) {
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.enabled ? this.volume * 0.28 : 0, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (!this.noiseBuffer && this.ctx) {
      // 1-second white noise buffer for chiptune percussion
      const bufferSize = this.ctx.sampleRate;
      this.noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = this.noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    try {
      localStorage.setItem('rpg_bgm_volume_v1', this.volume.toString());
    } catch {
      // ignore
    }
    if (this.masterGain && this.ctx) {
      const targetGain = this.enabled ? this.volume * 0.28 : 0;
      this.masterGain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.05);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public setEnabled(en: boolean) {
    this.enabled = en;
    try {
      localStorage.setItem('rpg_bgm_enabled_v1', en.toString());
    } catch {
      // ignore
    }
    if (this.masterGain && this.ctx) {
      const targetGain = this.enabled ? this.volume * 0.28 : 0;
      this.masterGain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.05);
    }
    if (en && !this.isPlaying && this.currentTrackId) {
      this.startTrack(this.currentTrackId);
    }
  }

  public isSoundEnabled(): boolean {
    return this.enabled;
  }

  public getCurrentTrack(): BgmTrackId | null {
    return this.currentTrackId;
  }

  public getTrackMeta(trackId?: BgmTrackId): BgmTrackMeta {
    const tid = trackId || this.currentTrackId || 'nordic_explore';
    return BGM_TRACKS_INFO[tid] || BGM_TRACKS_INFO.nordic_explore;
  }

  public setTempoMultiplier(mult: number) {
    const clamped = Math.max(0.5, Math.min(2.2, mult));
    if (Math.abs(this.tempoMultiplier - clamped) < 0.01) return;
    this.tempoMultiplier = clamped;
    if (this.isPlaying && this.currentTrackId && this.ctx) {
      const current = this.currentTrackId;
      this.stop(false);
      this.currentTrackId = current;
      this.isPlaying = true;
      this.nextStartTime = this.ctx.currentTime + 0.04;
      this.scheduleLoop();
    }
  }

  public getTempoMultiplier(): number {
    return this.tempoMultiplier;
  }

  public startTrack(trackId: BgmTrackId) {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    if (this.currentTrackId === trackId && this.isPlaying) {
      return; // Already playing this track
    }

    this.stop(false); // Stop current scheduling
    this.currentTrackId = trackId;
    this.isPlaying = true;
    this.nextStartTime = this.ctx.currentTime + 0.08;

    this.scheduleLoop();
  }

  public stop(clearCurrent = true) {
    this.isPlaying = false;
    if (clearCurrent) {
      this.currentTrackId = null;
    }
    if (this.timerId !== null) {
      window.clearTimeout(this.timerId);
      this.timerId = null;
    }
    // Stop all active scheduled nodes
    this.activeNodes.forEach((node) => {
      try {
        if ('stop' in node && typeof (node as OscillatorNode).stop === 'function') {
          (node as OscillatorNode).stop();
        }
        node.disconnect();
      } catch {
        // ignore
      }
    });
    this.activeNodes = [];
  }

  private scheduleLoop() {
    if (!this.isPlaying || !this.ctx || !this.masterGain || !this.currentTrackId) return;

    const trackId = this.currentTrackId;
    let leadNotes: NoteStep[] = TRACK_NORDIC_LEAD;
    let bassNotes: NoteStep[] = TRACK_NORDIC_BASS;
    let bpm = 114;
    let leadWave: OscillatorType = 'square';
    let bassWave: OscillatorType = 'triangle';

    if (trackId === 'boss_clash') {
      leadNotes = TRACK_BOSS_LEAD;
      bassNotes = TRACK_BOSS_BASS;
      bpm = 144;
      leadWave = 'square';
      bassWave = 'sawtooth';
    } else if (trackId === 'boss_enrage_p2') {
      leadNotes = TRACK_ENRAGE_LEAD;
      bassNotes = TRACK_ENRAGE_BASS;
      bpm = 168;
      leadWave = 'sawtooth';
      bassWave = 'sawtooth';
    } else if (trackId === 'boss_bluetooth') {
      leadNotes = TRACK_BLUETOOTH_LEAD;
      bassNotes = TRACK_BLUETOOTH_BASS;
      bpm = 138;
      leadWave = 'square';
      bassWave = 'triangle';
    } else if (trackId === 'boss_vasa') {
      leadNotes = TRACK_VASA_LEAD;
      bassNotes = TRACK_VASA_BASS;
      bpm = 146;
      leadWave = 'sawtooth';
      bassWave = 'triangle';
    } else if (trackId === 'boss_sami') {
      leadNotes = TRACK_SAMI_LEAD;
      bassNotes = TRACK_SAMI_BASS;
      bpm = 136;
      leadWave = 'triangle';
      bassWave = 'sawtooth';
    } else if (trackId === 'boss_kantele') {
      leadNotes = TRACK_KANTELE_LEAD;
      bassNotes = TRACK_KANTELE_BASS;
      bpm = 142;
      leadWave = 'triangle';
      bassWave = 'triangle';
    } else if (trackId === 'boss_hardrada') {
      leadNotes = TRACK_HARDRADA_LEAD;
      bassNotes = TRACK_HARDRADA_BASS;
      bpm = 156;
      leadWave = 'sawtooth';
      bassWave = 'sawtooth';
    } else if (trackId === 'boss_surtr') {
      leadNotes = TRACK_SURTR_LEAD;
      bassNotes = TRACK_SURTR_BASS;
      bpm = 168;
      leadWave = 'sawtooth';
      bassWave = 'sawtooth';
    } else if (trackId === 'boss_ragnarok_lunatic') {
      leadNotes = TRACK_ENRAGE_LEAD;
      bassNotes = TRACK_SURTR_BASS;
      bpm = 188;
      leadWave = 'sawtooth';
      bassWave = 'sawtooth';
    } else if (trackId === 'victory_fanfare' || trackId === 'polar_express_finale') {
      leadNotes = TRACK_VICTORY_LEAD;
      bassNotes = TRACK_VICTORY_BASS;
      bpm = 130;
      leadWave = 'square';
      bassWave = 'triangle';
    }

    const effectiveBpm = bpm * (trackId.startsWith('boss_') ? this.tempoMultiplier : 1.0);
    const sixteenthDuration = 60 / effectiveBpm / 4; // Length of a 16th note in seconds

    // Calculate total loop duration in 16th notes from lead
    const totalSixteenths = leadNotes.reduce((acc, step) => acc + step[1], 0);
    const loopDurationSec = totalSixteenths * sixteenthDuration;

    const loopStart = Math.max(this.ctx.currentTime + 0.04, this.nextStartTime);

    // 1. Play Lead Channel (with vibrato & subtle harmony fifths on boss tracks)
    let leadOffset = 0;
    leadNotes.forEach(([noteName, durationUnits], idx) => {
      const noteDuration = durationUnits * sixteenthDuration;
      const noteTime = loopStart + leadOffset;
      const freq = NOTE_FREQS[noteName] || 0;

      if (freq > 0) {
        this.playPulseTone(freq, noteTime, noteDuration * 0.88, leadWave, 0.22, true);
        // Pulse 2 Harmony Counterpoint on accented notes
        if (trackId.startsWith('boss_') && idx % 2 === 0) {
          this.playPulseTone(freq * 0.75, noteTime, noteDuration * 0.75, 'square', 0.09, false);
        }
      }
      leadOffset += noteDuration;
    });

    // 2. Play Bass Channel (Triangle / Sawtooth Octaves)
    let bassOffset = 0;
    bassNotes.forEach(([noteName, durationUnits]) => {
      const noteDuration = durationUnits * sixteenthDuration;
      const noteTime = loopStart + bassOffset;
      const freq = NOTE_FREQS[noteName] || 0;

      if (freq > 0) {
        this.playPulseTone(freq, noteTime, noteDuration * 0.85, bassWave, 0.26, false);
      }
      bassOffset += noteDuration;
    });

    // 3. Play Chiptune Rhythm Channel (Noise Drums)
    if (trackId !== 'victory_fanfare') {
      const isBattle = trackId.startsWith('boss_');
      const isShamanDrum = trackId === 'boss_sami';
      for (let s = 0; s < totalSixteenths; s++) {
        const drumTime = loopStart + s * sixteenthDuration;
        if (isShamanDrum) {
          // Shamanic Kannus Drum heartbeat pattern
          if (s % 4 === 0 || s % 8 === 3) {
            this.playRetroKick(drumTime);
          }
          if (s % 8 === 6) {
            this.playRetroSnare(drumTime);
          }
        } else {
          // Kick on beat 0, 8 (or 0, 4, 8, 12 in fast battle)
          if (s % 8 === 0 || (isBattle && s % 4 === 0 && s % 8 !== 4)) {
            this.playRetroKick(drumTime);
          }
          // Snare on beat 4, 12
          if (s % 8 === 4) {
            this.playRetroSnare(drumTime);
          }
          // Hi-hat tick on even 16th notes
          if (s % 2 === 0) {
            this.playRetroHihat(drumTime, s % 4 === 2);
          }
        }
      }
    }

    // Set next loop start
    this.nextStartTime = loopStart + loopDurationSec;

    // Victory fanfare does not loop infinitely
    if (trackId === 'victory_fanfare') {
      this.timerId = window.setTimeout(() => {
        this.startTrack('nordic_explore');
      }, (loopDurationSec + 0.5) * 1000);
      return;
    }

    // Schedule next iteration 200ms before current loop finishes
    const delayMs = Math.max(50, (loopDurationSec - 0.25) * 1000);
    this.timerId = window.setTimeout(() => {
      this.scheduleLoop();
    }, delayMs);
  }

  private playPulseTone(
    freq: number,
    startTime: number,
    duration: number,
    type: OscillatorType,
    gainVal: number,
    vibrato = false
  ) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);

    if (vibrato && duration > 0.18) {
      // Mild vibrato LFO
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.setValueAtTime(6.0, startTime); // 6 Hz vibrato
      lfoGain.gain.setValueAtTime(freq * 0.015, startTime);
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      lfo.start(startTime);
      lfo.stop(startTime + duration);
      this.activeNodes.push(lfo, lfoGain);
    }

    // 8-bit snappy ADSR Envelope
    gain.gain.setValueAtTime(0.001, startTime);
    gain.gain.linearRampToValueAtTime(gainVal, startTime + 0.012);
    gain.gain.setValueAtTime(gainVal * 0.85, startTime + duration * 0.5);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(startTime);
    osc.stop(startTime + duration + 0.05);

    this.activeNodes.push(osc, gain);
  }

  private playRetroKick(startTime: number) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140, startTime);
    osc.frequency.exponentialRampToValueAtTime(32, startTime + 0.1);

    gain.gain.setValueAtTime(0.32, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.11);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(startTime);
    osc.stop(startTime + 0.12);
    this.activeNodes.push(osc, gain);
  }

  private playRetroSnare(startTime: number) {
    if (!this.ctx || !this.masterGain || !this.noiseBuffer) return;

    // Noise burst
    const noise = this.ctx.createBufferSource();
    noise.buffer = this.noiseBuffer;
    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'highpass';
    noiseFilter.frequency.setValueAtTime(800, startTime);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.2, startTime);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.14);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.masterGain);

    noise.start(startTime);
    noise.stop(startTime + 0.15);

    // Subtle pitch pop underneath
    const tone = this.ctx.createOscillator();
    const toneGain = this.ctx.createGain();
    tone.type = 'triangle';
    tone.frequency.setValueAtTime(180, startTime);
    tone.frequency.exponentialRampToValueAtTime(60, startTime + 0.08);

    toneGain.gain.setValueAtTime(0.18, startTime);
    toneGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.09);

    tone.connect(toneGain);
    toneGain.connect(this.masterGain);

    tone.start(startTime);
    tone.stop(startTime + 0.1);

    this.activeNodes.push(noise, noiseGain, tone, toneGain);
  }

  private playRetroHihat(startTime: number, isAccent = false) {
    if (!this.ctx || !this.masterGain || !this.noiseBuffer) return;
    const noise = this.ctx.createBufferSource();
    noise.buffer = this.noiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(4500, startTime);

    const gain = this.ctx.createGain();
    const vol = isAccent ? 0.09 : 0.04;
    gain.gain.setValueAtTime(vol, startTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.04);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start(startTime);
    noise.stop(startTime + 0.05);

    this.activeNodes.push(noise, gain);
  }
}

export const rpgBgmEngine = new RpgBgmEngine();
