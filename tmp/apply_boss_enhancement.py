#!/usr/bin/env python3
import re
import sys

target_path = 'src/components/PolarExpressReindeerRpgModal.tsx'

with open(target_path, 'r', encoding='utf-8') as f:
    content = f.read()

print(f"Original content size: {len(content)} bytes")

# 1. Check if already applied
if 'BOSS_FORMS_CONFIG' in content:
    print("BOSS_FORMS_CONFIG already exists")
    sys.exit(0)

# 2. Add new bullet types to UndertaleBullet
bullet_type_needle = "| 'pixel_shard';"
new_bullet_types = """| 'pixel_shard'
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
    | 'radar_ping';"""

if bullet_type_needle not in content:
    print(f"Error: could not find {bullet_type_needle}")
    sys.exit(1)

content = content.replace(bullet_type_needle, new_bullet_types, 1)

# 3. Insert Boss Form Definitions
boss_form_defs = '''
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
      transformQuote: '「北緯66°33\'的極夜風雪，由古老薩米神鼓永恆守望。」',
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
'''

danmaku_shard_needle = "export interface DanmakuShatterShard {"
if danmaku_shard_needle in content:
    content = content.replace(danmaku_shard_needle, boss_form_defs + "\n" + danmaku_shard_needle, 1)
else:
    print(f"Error: {danmaku_shard_needle} not found")
    sys.exit(1)

with open(target_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Step 1 done: bullet types & boss forms added")
