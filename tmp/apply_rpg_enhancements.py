import sys
import re

file_path = "/src/components/PolarExpressReindeerRpgModal.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

print("Original file length:", len(content))

# 1. Add ROVING_HISTORICAL_NPCS right after PRIMARY_STORY_NPCS definition
roving_npcs_code = '''
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
  spriteType: 'sailor' | 'scholar_bellman' | 'skald_egill' | 'geologist_hildur';
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
];
'''

target_marker = 'export const RPG_CHAPTERS: RpgChapter[] ='
if target_marker in content and 'ROVING_HISTORICAL_NPCS' not in content:
    content = content.replace(target_marker, roving_npcs_code + '\n' + target_marker, 1)
    print("Added ROVING_HISTORICAL_NPCS successfully!")

# 2. Add drawRovingHistoricalNpc function
draw_roving_npc_func = '''
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
  } else {
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
'''

marker_draw_player = '// Draw Player Character Model\nexport function drawPixelPlayerModel'
if marker_draw_player in content and 'drawRovingHistoricalNpc' not in content:
    content = content.replace(marker_draw_player, draw_roving_npc_func + '\n' + marker_draw_player, 1)
    print("Added drawRovingHistoricalNpc function successfully!")

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Saved updated file!")
