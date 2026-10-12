import fs from 'fs';

let code = fs.readFileSync('src/components/PolarExpressReindeerRpgModal.tsx', 'utf8');

// ============================================================================
// 1. ADD mustDo?: string[] TO RpgLandmark AND NEW TYPES FOR ANIMALS & SUMMONED WEAPONS
// ============================================================================
code = code.replace(
  `export interface RpgLandmark {
  id: string;
  name: string;
  x: number;
  y: number;
  historicalLore: string;
  trivia: string;
  emoji: string;
  dayNum: number;
}`,
  `export interface RpgLandmark {
  id: string;
  name: string;
  x: number;
  y: number;
  historicalLore: string;
  trivia: string;
  mustDo?: string[];
  emoji: string;
  dayNum: number;
}`
);

// Upgrade BossSideWeapon union type to include star_cannon and crimson_trident
code = code.replace(
  `    | 'gaster_blaster'   // Sans 蒼龍噬魂龍顱砲環 (Screenshot 2)
    | 'chaos_saber';     // Asriel 混沌綠光聖劍 (Screenshot 1)`,
  `    | 'gaster_blaster'   // Sans 蒼龍噬魂龍顱砲環 (Screenshot 2)
    | 'chaos_saber'      // Asriel 混沌雙刃聖劍 (Screenshot 1)
    | 'star_cannon'      // 對角星隕巨砲 (Screenshot 3)
    | 'crimson_trident'; // Asgore 鮮紅王權三叉戟 (Screenshot 4)`
);

// Upgrade InteractiveBuildingData type to support 'special_monument' and 'special_blessing'
code = code.replace(
  `export interface InteractiveBuildingData {
  id: string;
  type: 'inn' | 'forge' | 'library' | 'cathedral' | 'observatory';
  name: string;
  subtitle: string;
  icon: string;
  x: number;
  y: number;
  description: string;
  greeting: string;
  actionButtonText: string;
  rewardType: 'full_heal' | 'attack_boost' | 'courage_lore' | 'valkyrie_shield' | 'aurora_show';
  rewardLabel: string;
}`,
  `export interface InteractiveBuildingData {
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
}`
);

// ============================================================================
// 2. SPREAD OUT PRIMARY_STORY_NPCS SO THEY NEVER OVERLAP WITH BUILDINGS OR SHOPS
// ============================================================================
// Primary NPCs -> x: 210, y: 365
// Secondary NPCs -> x: 850, y: 365
const npcPositionMap = {
  npc_elder_erik: { x: 210, y: 365 },
  npc_hans_andersen: { x: 850, y: 365 },
  npc_shipwright_jacob: { x: 210, y: 365 },
  npc_archivist_elena: { x: 850, y: 365 },
  npc_lapland_nilas: { x: 210, y: 365 },
  npc_elf_toppu: { x: 850, y: 365 },
  npc_bard_urho: { x: 210, y: 365 },
  npc_sauna_martta: { x: 850, y: 365 },
  npc_captain_aslak: { x: 210, y: 365 },
  npc_priestess_ingrid: { x: 850, y: 365 },
  npc_saga_thor: { x: 210, y: 365 },
  npc_witch_freyja: { x: 850, y: 365 },
};

for (const [npcId, pos] of Object.entries(npcPositionMap)) {
  const regex = new RegExp(`(id:\\s*'${npcId}'[\\s\\S]*?chapterId:\\s*'chapter\\d+',\\s*x:\\s*)\\d+(,\\s*y:\\s*)\\d+`, 'g');
  code = code.replace(regex, `$1${pos.x}$2${pos.y}`);
}

// ============================================================================
// 3. SPREAD OUT NORDIC_BUILDINGS_CONFIG AND ADD 6TH SPECIAL BUILDING PER CHAPTER
//    AND ADD NORDIC_INTERACTIVE_ANIMALS (18 ANIMALS ACROSS 6 CHAPTERS)
// ============================================================================
// Building layout on 1200x700 canvas:
// inn:         (155, 195)
// observatory: (405, 175)
// library:     (665, 175)
// cathedral:   (935, 195)
// forge:       (175, 535)
// special_monument: (530, 560)
const buildingCoordsByType = {
  inn: { x: 155, y: 195 },
  observatory: { x: 405, y: 175 },
  library: { x: 665, y: 175 },
  cathedral: { x: 935, y: 195 },
  forge: { x: 175, y: 535 },
};

for (const [bType, pos] of Object.entries(buildingCoordsByType)) {
  const regex = new RegExp(`(type:\\s*'${bType}',[\\s\\S]*?x:\\s*)\\d+(,\\s*y:\\s*)\\d+`, 'g');
  code = code.replace(regex, `$1${pos.x}$2${pos.y}`);
}

// Add 6th Special Monument Building to each chapter in NORDIC_BUILDINGS_CONFIG
const specialBuildingsByChapter = {
  chapter0: `    {
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
    },`,
  chapter1: `    {
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
    },`,
  chapter2: `    {
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
    },`,
  chapter3: `    {
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
    },`,
  chapter4: `    {
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
    },`,
  chapter5: `    {
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
    },`,
};

for (const [chapKey, specialObjStr] of Object.entries(specialBuildingsByChapter)) {
  const targetPattern = new RegExp(`(${chapKey}:\\s*\\[[\\s\\S]*?rewardLabel:\\s*'🌌 觸發絢爛星空極光演出！',\\s*\\},)`);
  code = code.replace(targetPattern, `$1\n${specialObjStr}`);
}

// Also move all shops in NORDIC_SHOPS_CONFIG to central plaza (x: 520, y: 350) so they never overlap with NPCs (210, 365) or buildings!
code = code.replace(
  /(shopkeeperAvatar:\s*'[^']+',\s*greeting:\s*'[^']+',\s*x:\s*)\d+(,\s*y:\s*)\d+/g,
  `$1520$2350`
);

// Inject NORDIC_INTERACTIVE_ANIMALS right after NORDIC_BUILDINGS_CONFIG
const interactiveAnimalsCode = `
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
`;

code = code.replace(
  `export const NORDIC_SHOPS_CONFIG: Record<string, NordicShopData> = {`,
  `${interactiveAnimalsCode}\nexport const NORDIC_SHOPS_CONFIG: Record<string, NordicShopData> = {`
);

// ============================================================================
// 4. SPREAD OUT RPG_CHAPTERS LANDMARKS & ADD mustDo TO EVERY LANDMARK
// ============================================================================
const landmarkUpgrades = {
  cph_nyhavn: { x: 320, y: 290, mustDo: ['在彩色木屋與古帆船前合影', '尋找安徒生故居 20 號與 67 號門牌', '品嚐運河市集熱紅酒 Gløgg'] },
  cph_stroget: { x: 640, y: 285, mustDo: ['參觀皇家哥本哈根手繪瓷器旗艦店', '在老廣場噴泉旁欣賞街頭管樂演出'] },
  cph_mermaid: { x: 960, y: 310, mustDo: ['在長堤公園海濱與百年青銅小美人魚合影', '遠眺哥本哈根歌劇院與海港風光'] },
  cph_christiansborg: { x: 740, y: 495, mustDo: ['免費登頂 106 公尺高皇宮塔樓俯瞰全城', '探訪皇家接待廳與女王現代掛毯'] },
  cph_tivoli: { x: 360, y: 505, mustDo: ['漫步百萬盞聖誕燈飾點亮的童話小徑', '體驗 1914 年百年木製雲霄飛車'] },

  stk_gamlastan: { x: 320, y: 290, mustDo: ['挑戰側身穿過 90 公分寬的莫滕特羅齊格窄巷', '在大廣場彩色山牆建築前品嚐瑞典肉桂捲 Fika'] },
  stk_vasa: { x: 780, y: 285, mustDo: ['近距離仰望 1628 年 64 門青銅砲巨艦真跡', '觀賞船尾超過 700 尊巴洛克皇家木雕'] },
  stk_cityhall: { x: 380, y: 500, mustDo: ['走進鑲嵌 1800 萬塊金箔馬賽克的金廳', '拾級走下諾貝爾獎得主專屬的藍廳晚宴階梯'] },
  stk_nobel: { x: 740, y: 495, mustDo: ['在館內咖啡廳翻看椅背底部的諾貝爾得主親筆簽名', '品嚐諾貝爾晚宴同款皇家冰淇淋與金幣巧克力'] },

  lap_santavillage: { x: 760, y: 285, mustDo: ['與官方認證聖誕老人面對面合影', '從聖誕總郵局寄出加蓋北極圈郵戳的明信片'] },
  lap_glassigloo: { x: 340, y: 290, mustDo: ['躺在防霜電熱玻璃穹頂下 360 度仰望極光', '開啟房內極光警報器不錯過午夜歐若拉爆發'] },
  lap_reindeersled: { x: 360, y: 500, mustDo: ['披上溫暖馴鹿皮搭乘木製雪橇穿越雪白針葉林', '在薩米帳篷篝火旁喝熱漿果茶聽牧鹿傳說'] },
  lap_arcticcircle: { x: 730, y: 495, mustDo: ['雙腳跨越北緯 66°33′07″ 發光極圈標誌線拍照', '領取官方簽發的跨越北極圈榮譽證書'] },

  hel_rockchurch: { x: 330, y: 290, mustDo: ['仰望 22 公里紫銅線盤繞而成的巨型穹頂', '在十億年天然花崗岩壁環繞下聆聽管風琴共鳴'] },
  hel_senatesquare: { x: 740, y: 285, mustDo: ['登上赫爾辛基大教堂雪白長階俯瞰廣場全景', '欣賞綠色大圓頂與十二使徒鋅製雕像'] },
  hel_loylysauna: { x: 760, y: 495, mustDo: ['體驗傳統柴燒煙燻桑拿的白樺木蒸氣 Löyly', '鼓起勇氣從海濱木階梯走進波羅的海冰洞冬泳'] },
  hel_design: { x: 370, y: 500, mustDo: ['選購 Iittala 極光玻璃與 Marimekko 印花設計精品', '造訪頌歌中央圖書館 Oodi 雲杉木波浪大廳'] },

  oslo_vigeland: { x: 310, y: 290, mustDo: ['仰望 14 公尺高單塊花崗岩雕刻的 121 人生命之柱', '尋找人氣最高的「憤怒的小男孩」青銅雕像'] },
  oslo_operahouse: { x: 540, y: 280, mustDo: ['沿著潔白大理石冰山斜坡屋頂漫步登頂', '俯瞰奧斯陸峽灣與水面上漂浮的玻璃冰山雕塑'] },
  trom_arcticcathedral: { x: 780, y: 295, mustDo: ['在極夜藍調下拍攝純白三角形冰山建築剪影', '欣賞東側 23 公尺高巨幅馬賽克彩繪玻璃窗'] },
  trom_fjellheisen: { x: 370, y: 500, mustDo: ['搭乘纜車登上 421 公尺山頂觀景台俯瞰全島燈火', '在無光害雪峰山巔守候綠色極光弧線躍動'] },
  trom_auroraship: { x: 730, y: 495, mustDo: ['乘靜音雙體船深入北冰洋無光害峽灣追尋極光', '拍攝漫天極光與漆黑峽灣海面雙重倒影'] },

  ice_thingvellir: { x: 310, y: 285, mustDo: ['漫步歐亞板塊與北美板塊撕裂形成的阿爾曼納陡崖', '探訪西元 930 年世界最早民主議會法律石遺址'] },
  ice_geysir: { x: 560, y: 275, mustDo: ['站在上風處抓拍間歇泉噴發前瞬間形成的藍色水泡', '見證沸騰水柱衝上 30 公尺高空的震撼瞬間'] },
  ice_gullfoss: { x: 810, y: 290, mustDo: ['沿步道近距離感受雙層斷層黃金瀑布的磅礴水霧', '聆聽冰島環保先驅西格麗德守護瀑布的傳奇故事'] },
  ice_fireworks: { x: 370, y: 505, mustDo: ['跨年夜先參與雷克雅維克社區傳統篝火晚會 Brenna', '午夜在哈爾格林姆教堂前見證全城 360 度煙火海'] },
  ice_bluelagoon: { x: 740, y: 500, mustDo: ['浸泡在 38°C 夢幻乳藍色地熱溫泉中敷白矽泥面膜', '在溫泉水吧享用冰島特色藍莓果昔或氣泡香檳'] },
};

for (const [lmId, lmData] of Object.entries(landmarkUpgrades)) {
  const regex = new RegExp(
    `(id:\\s*'${lmId}',\\s*name:\\s*'[^']+',\\s*x:\\s*)\\d+(,\\s*y:\\s*)\\d+(,\\s*historicalLore:\\s*'[^']+',\\s*trivia:\\s*'[^']+',)`,
    'g'
  );
  code = code.replace(
    regex,
    `$1${lmData.x}$2${lmData.y}$3\n        mustDo: ${JSON.stringify(lmData.mustDo)},`
  );
}

// ============================================================================
// 5. UPGRADE drawInteractiveTownBuildings TO RENDER SPECIAL MONUMENT BUILDINGS
//    AND ADD drawInteractiveNordicAnimals FOR THE 18 INTERACTIVE ANIMALS
// ============================================================================
code = code.replace(
  `    const wallColor =
      b.type === 'inn'
        ? '#78350f'
        : b.type === 'forge'
        ? '#451a03'
        : b.type === 'library'
        ? '#1e293b'
        : b.type === 'cathedral'
        ? '#0f766e'
        : '#1e1b4b';`,
  `    const wallColor =
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
    }`
);

code = code.replace(
  `    // 5. Overhead Building Nameplate
    ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.roundRect(bx - 50, by - bH / 2 - 34, 100, 16, [4]);
    ctx.fill();
    ctx.stroke();

    ctx.font = 'bold 9px sans-serif';
    ctx.fillStyle = '#67e8f9';
    ctx.fillText(b.name.split(' (')[0].slice(0, 8), bx, by - bH / 2 - 26);`,
  `    // 5. Overhead Building Nameplate
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
    ctx.fillText(b.name.split(' (')[0].slice(0, 10), bx, by - bH / 2 - 26);`
);

const drawAnimalsHelperCode = `
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
    ctx.fillText(\`\${an.icon} \${shortName.slice(0, 7)}\`, ax, ay + 22);

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
`;

code = code.replace(
  `export function drawBossSideWeapons(`,
  `${drawAnimalsHelperCode}\nexport function drawBossSideWeapons(`
);

// ============================================================================
// 6. UPGRADE drawBossSideWeapons TO MATCH THE 4 UNDERTALE SCREENSHOTS:
//    - Screenshot 1: Asriel Chaos Saber (雙側懸浮混沌巨劍 + 橫向斬擊預警線)
//    - Screenshot 2: Sans Gaster Blaster (四周骷髏龍顱巨砲 + 熾白極光雷射光柱)
//    - Screenshot 3: Diagonal Star Cannon (左上/右上對角巨砲 + 貫穿斜向光束 + 五角星彈幕)
//    - Screenshot 4: Asgore Crimson Trident (鮮紅三叉戟橫掃 + 漫天白焰彈幕)
// ============================================================================
const newDrawBossSideWeapons = `export function drawBossSideWeapons(
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

    // ------------------------------------------------------------------------
    // SCREENSHOT 2 STYLE: GASTER BLASTER (骷髏龍顱巨砲)
    // ------------------------------------------------------------------------
    if (w.type === 'gaster_blaster' || w.type === 'frost_totem' || w.type === 'bluetooth_pylon') {
      ctx.save();
      ctx.translate(wx, wy);
      const jawOpen = isFiring ? 10 + Math.sin(tick * 0.6) * 2 : chargePct * 5;
      // Outer Cyan/White Dragon Skull Aura
      ctx.shadowColor = w.color;
      ctx.shadowBlur = isFiring ? 22 : 10;

      // Horns (Left & Right curved pixel horns)
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(-20, -18, 7, 10);
      ctx.fillRect(13, -18, 7, 10);
      ctx.fillRect(-24, -22, 6, 6);
      ctx.fillRect(18, -22, 6, 6);

      // Upper Skull Cranium
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-15, -14 - jawOpen * 0.3, 30, 18);
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 2;
      ctx.strokeRect(-15, -14 - jawOpen * 0.3, 30, 18);

      // Glowing Eyes (Flashing Cyan / Gold like Sans Gaster Blaster)
      ctx.fillStyle = tick % 4 < 2 ? w.color : '#fde047';
      ctx.fillRect(-10, -7 - jawOpen * 0.3, 6, 6);
      ctx.fillRect(4, -7 - jawOpen * 0.3, 6, 6);

      // Lower Split Jaw & Sharp Teeth
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(-12, 4 + jawOpen * 0.6, 24, 8);
      // Energy core inside open mouth
      if (chargePct > 0.3 || isFiring) {
        ctx.fillStyle = isFiring ? '#ffffff' : w.color;
        ctx.beginPath();
        ctx.arc(0, 3 + jawOpen * 0.2, isFiring ? 8 : 5 * chargePct, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
    // ------------------------------------------------------------------------
    // SCREENSHOT 1 STYLE: ASRIEL CHAOS SABER (雙側懸浮混沌聖劍)
    // ------------------------------------------------------------------------
    else if (w.type === 'chaos_saber' || w.type === 'twilight_sword' || w.type === 'kantele_string') {
      ctx.save();
      ctx.translate(wx, wy);
      const isRight = w.side === 'right';
      const swingAngle = isFiring
        ? (isRight ? -0.35 : 0.35) + Math.sin(tick * 0.8) * 0.12
        : Math.sin(tick * 0.15) * 0.08;
      ctx.rotate(swingAngle);
      if (isRight) ctx.scale(-1, 1);

      ctx.shadowColor = w.color;
      ctx.shadowBlur = 16;

      // Ornate Winged Guard & Hilt
      ctx.fillStyle = '#facc15';
      ctx.fillRect(-18, -4, 8, 8);
      ctx.fillRect(-10, -14, 5, 28);

      // Giant White-Core Pixel Greatsword Blade pointing toward arena
      ctx.fillStyle = w.color;
      ctx.beginPath();
      ctx.moveTo(-5, -9);
      ctx.lineTo(34, -4);
      ctx.lineTo(44, 0);
      ctx.lineTo(34, 4);
      ctx.lineTo(-5, 9);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-4, -3, 36, 6);
      ctx.restore();
    }
    // ------------------------------------------------------------------------
    // SCREENSHOT 4 STYLE: ASGORE CRIMSON TRIDENT (鮮紅王權三叉戟)
    // ------------------------------------------------------------------------
    else if (w.type === 'crimson_trident' || w.type === 'viking_axe') {
      ctx.save();
      ctx.translate(wx, wy);
      ctx.shadowColor = '#f43f5e';
      ctx.shadowBlur = 18;

      // Long Crimson Polearm Shaft
      ctx.fillStyle = '#e11d48';
      ctx.fillRect(-22, -3, 44, 6);

      // Three-Pronged Royal Trident Head
      ctx.fillStyle = '#fb7185';
      // Center prong
      ctx.fillRect(18, -3, 18, 6);
      // Top prong
      ctx.fillRect(14, -14, 6, 12);
      ctx.fillRect(18, -14, 14, 5);
      // Bottom prong
      ctx.fillRect(14, 2, 6, 12);
      ctx.fillRect(18, 9, 14, 5);

      // White-hot rune core
      ctx.fillStyle = '#fff1f2';
      ctx.fillRect(16, -2, 14, 4);
      ctx.restore();
    }
    // ------------------------------------------------------------------------
    // SCREENSHOT 3 STYLE: STAR GALACTICA CANNON / FLINTLOCK (對角星隕巨砲)
    // ------------------------------------------------------------------------
    else {
      ctx.save();
      ctx.translate(wx, wy);
      const isRight = w.side === 'right';
      if (isRight) ctx.scale(-1, 1);

      ctx.shadowColor = w.color;
      ctx.shadowBlur = 15;

      // Heavy Pixel Buster Barrel
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(-16, -12, 34, 24);
      ctx.strokeStyle = w.color;
      ctx.lineWidth = 2;
      ctx.strokeRect(-16, -12, 34, 24);

      // Glowing Star Core & Muzzle Ring
      ctx.fillStyle = '#fde047';
      ctx.fillRect(16, -14, 7, 28);
      ctx.fillStyle = w.color;
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('★', 0, 0);
      ctx.restore();
    }

    // 2. While Charging: Draw Telegraph Aiming Laser Sight Guide Line across box
    if (w.state === 'charging') {
      const isBlink = Math.sin(tick * 0.35) > 0;

      ctx.save();
      ctx.strokeStyle = isBlink ? '#ef4444' : w.color;
      ctx.lineWidth = 2.0 + chargePct * 1.8;
      ctx.setLineDash([7, 4]);

      ctx.beginPath();
      if (w.side === 'left' || w.side === 'right') {
        ctx.moveTo(bx, w.targetCoord);
        ctx.lineTo(bx + bw, w.targetCoord);
      } else {
        ctx.moveTo(w.targetCoord, by);
        ctx.lineTo(w.targetCoord, by + bh);
      }
      ctx.stroke();
      ctx.setLineDash([]);

      // Warning Zone Translucent Corridor
      ctx.fillStyle = 'rgba(239, 68, 68, 0.15)';
      if (w.side === 'left' || w.side === 'right') {
        ctx.fillRect(bx, w.targetCoord - w.beamThickness / 2, bw, w.beamThickness);
      } else {
        ctx.fillRect(w.targetCoord - w.beamThickness / 2, by, w.beamThickness, bh);
      }

      // Flashing Warning Reticle Text
      ctx.font = 'bold 9.5px monospace';
      ctx.fillStyle = '#fca5a5';
      ctx.textAlign = 'center';
      if (w.side === 'left' || w.side === 'right') {
        ctx.fillText(\`⚠️ \${w.name} 鎖定 \${(chargePct * 100).toFixed(0)}%\`, bx + bw / 2, w.targetCoord - 6);
      } else {
        ctx.fillText(\`⚠️ \${w.name}\`, w.targetCoord, by + 15);
      }
      ctx.restore();
    }

    // 3. While Firing: Draw Blazing Piercing High-Energy Laser Beam / Slash Wave!
    if (w.state === 'firing') {
      const bThick = w.beamThickness + Math.sin(tick * 0.7) * 4;

      ctx.save();
      // Outer Glow Aura
      ctx.fillStyle = w.glowColor;
      if (w.side === 'left' || w.side === 'right') {
        ctx.fillRect(bx - 16, w.targetCoord - bThick / 2 - 8, bw + 32, bThick + 16);
      } else {
        ctx.fillRect(w.targetCoord - bThick / 2 - 8, by - 16, bThick + 16, bh + 32);
      }

      // Middle Beam Core
      ctx.fillStyle = w.color;
      if (w.side === 'left' || w.side === 'right') {
        ctx.fillRect(bx - 16, w.targetCoord - bThick / 2, bw + 32, bThick);
      } else {
        ctx.fillRect(w.targetCoord - bThick / 2, by - 16, bThick, bh + 32);
      }

      // Inner White-Hot Laser Center (Screenshot 2 & 3 style)
      ctx.fillStyle = '#ffffff';
      if (w.side === 'left' || w.side === 'right') {
        ctx.fillRect(bx - 16, w.targetCoord - bThick * 0.25, bw + 32, bThick * 0.5);
      } else {
        ctx.fillRect(w.targetCoord - bThick * 0.25, by - 16, bThick * 0.5, bh + 32);
      }

      // Muzzle Burst & Star/Fireball Particles along the beam
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(wx, wy, 15 + Math.sin(tick * 0.5) * 4, 0, Math.PI * 2);
      ctx.fill();

      for (let sp = 0; sp < 5; sp++) {
        const spOff = ((tick * 6 + sp * 32) % bw);
        const spX = w.side === 'left' || w.side === 'right' ? bx + spOff : w.targetCoord + (Math.random() - 0.5) * 14;
        const spY = w.side === 'left' || w.side === 'right' ? w.targetCoord + (Math.random() - 0.5) * 14 : by + (spOff % bh);
        ctx.fillStyle = sp % 2 === 0 ? '#fde047' : '#ffffff';
        ctx.fillRect(spX - 2, spY - 2, 4, 4);
      }
      ctx.restore();
    }

    ctx.restore();
  });
}`;

code = code.replace(
  /export function drawBossSideWeapons\([\s\S]*?\n\}\n\nexport type BossAnimState/,
  `${newDrawBossSideWeapons}\n\nexport type BossAnimState`
);

// ============================================================================
// 7. ADD STATE HOOKS & REFS FOR:
//    - Interactive Animals (activeAnimalModal, interactedAnimals, animalToast)
//    - Chant Trigger (chantInputText, chantTriggerFeedback, auroraSurgeTicksRef, playerSummonedWeaponsRef)
//    - Triggering Boss Hit Shake + Strobe Flash + Aurora Surge + Side-Weapon Summon!
// ============================================================================
const newStatesAndRefs = `  const [activeBuildingModal, setActiveBuildingModal] = useState<InteractiveBuildingData | null>(null);
  const [activeAnimalModal, setActiveAnimalModal] = useState<InteractiveAnimalData | null>(null);
  const [interactedAnimals, setInteractedAnimals] = useState<string[]>([]);
  const [animalToast, setAnimalToast] = useState<string | null>(null);

  // Boss Battle Chant Trigger (詠唱觸發器) & Aurora Overdrive & Player Summoned Side Weapons
  const [chantInputText, setChantInputText] = useState<string>('');
  const [chantTriggerBanner, setChantTriggerBanner] = useState<{
    keyword: string;
    weaponName: string;
    damage: number;
    isCrit: boolean;
  } | null>(null);
  const auroraSurgeTicksRef = useRef<number>(0);
  const playerSummonedWeaponsRef = useRef<Array<{
    id: string;
    archetype: 'gaster_blaster' | 'chaos_saber' | 'star_cannon' | 'crimson_trident';
    name: string;
    side: 'left' | 'right' | 'top_left' | 'top_right';
    ticks: number;
    maxTicks: number;
    color: string;
  }>>([]);`;

code = code.replace(
  `  const [activeBuildingModal, setActiveBuildingModal] = useState<InteractiveBuildingData | null>(null);`,
  newStatesAndRefs
);

// Add triggerChantResonanceStrike helper right before renderUndertaleBattle or startUndertaleBossBattle
const chantTriggerHelperCode = `
  // =========================================================================
  // 🔮 詠唱觸發器 (CHANT TRIGGER) & 旁邊召喚武器攻擊 + 極光加劇 + BOSS受擊震動閃光
  // =========================================================================
  const CHAPTER_CHANT_KEYWORDS: Record<string, Array<{
    keyword: string;
    label: string;
    archetype: 'gaster_blaster' | 'chaos_saber' | 'star_cannon' | 'crimson_trident';
    weaponName: string;
    color: string;
    quote: string;
  }>> = {
    chapter0: [
      { keyword: '耶靈石碑', label: 'ᛒ 詠唱「耶靈石碑」· 召喚龍顱巨砲', archetype: 'gaster_blaster', weaponName: '耶靈盧恩龍顱巨砲 (Gaster Blaster)', color: '#38bdf8', quote: '「什……什麼？！耶靈古碑的盧恩龍顱砲竟從兩側夾擊孤王？！」' },
      { keyword: '安徒生童話', label: '⚔️ 詠唱「安徒生童話」· 召喚混沌雙刃', archetype: 'chaos_saber', weaponName: '新港童話混沌雙刃 (Chaos Saber)', color: '#a855f7', quote: '「嗚啊！童話星光化作雙側聖劍斬裂了我的防禦！」' },
      { keyword: '小美人魚', label: '🌟 詠唱「小美人魚」· 召喚對角星隕砲', archetype: 'star_cannon', weaponName: '海之誓約對角星隕砲 (Star Buster)', color: '#fde047', quote: '「這道貫穿夜空的星隕光束……連北海都被照亮了！」' },
      { keyword: '藍牙共鳴', label: '🔱 詠唱「藍牙共鳴」· 召喚鮮紅三叉戟', archetype: 'crimson_trident', weaponName: '丹麥王權鮮紅三叉戟 (Royal Trident)', color: '#f43f5e', quote: '「王權三叉戟的漫天白焰……孤王的結界正在劇烈震動！」' },
    ],
    chapter1: [
      { keyword: '1628首航', label: '💀 詠唱「1628首航」· 召喚龍顱巨砲', archetype: 'gaster_blaster', weaponName: '波羅的海深淵龍顱巨砲', color: '#38bdf8', quote: '「嗚哇！1628年的深海記憶化作雙側龍顱光柱轟擊艦體！」' },
      { keyword: '梅拉倫女王', label: '⚔️ 詠唱「梅拉倫女王」· 召喚混沌雙刃', archetype: 'chaos_saber', weaponName: '金廳1800萬金箔混沌雙聖劍', color: '#facc15', quote: '「金廳的耀眼雙劍從左右兩側同時劈開了幽靈迷霧！」' },
      { keyword: '諾貝爾之光', label: '🌟 詠唱「諾貝爾之光」· 召喚對角星隕砲', archetype: 'star_cannon', weaponName: '諾貝爾理性對角星隕巨砲', color: '#a855f7', quote: '「漫天星隕與極光同時爆發……好強烈的靈魂張力！」' },
      { keyword: '皇家榮耀', label: '🔱 詠唱「皇家榮耀」· 召喚鮮紅三叉戟', archetype: 'crimson_trident', weaponName: '瓦薩海神鮮紅三叉戟', color: '#f43f5e', quote: '「海神三叉戟與白焰彈幕……徹底壓制了本艦的64門火砲！」' },
    ],
    chapter2: [
      { keyword: '火狐極光', label: '💀 詠唱「火狐極光」· 召喚龍顱巨砲', archetype: 'gaster_blaster', weaponName: '北緯66°極光龍顱巨砲', color: '#34d399', quote: '「Revontulet！火狐極光竟然在夜空暴走，化為雙側龍顱光束！」' },
      { keyword: '悠伊克古調', label: '⚔️ 詠唱「悠伊克古調」· 召喚混沌雙刃', archetype: 'chaos_saber', weaponName: '薩米長生天混沌雙刃劍', color: '#38bdf8', quote: '「這股穿透風雪的雙劍斬擊……連芬里爾都為之震懾！」' },
      { keyword: '北極圈白線', label: '🌟 詠唱「北極圈白線」· 召喚對角星隕砲', archetype: 'star_cannon', weaponName: '極圈子午線對角星隕巨砲', color: '#fde047', quote: '「天幕的極光動畫徹底沸騰了！好耀眼的星隕光束！」' },
      { keyword: '平安夜祝福', label: '🔱 詠唱「平安夜祝福」· 召喚鮮紅三叉戟', archetype: 'crimson_trident', weaponName: '拉普蘭聖火鮮紅三叉戟', color: '#f43f5e', quote: '「溫暖卻強大的聖火三叉戟……融化了極夜的萬年冰霜！」' },
    ],
    chapter3: [
      { keyword: '卡勒瓦拉', label: '💀 詠唱「卡勒瓦拉」· 召喚龍顱巨砲', archetype: 'gaster_blaster', weaponName: '卡勒瓦拉創世龍顱音波砲', color: '#38bdf8', quote: '「創世史詩的真言？！雙側音波龍顱砲震碎了花崗岩壁！」' },
      { keyword: 'Sisu堅毅', label: '⚔️ 詠唱「Sisu堅毅」· 召喚混沌雙刃', archetype: 'chaos_saber', weaponName: '芬蘭Sisu不屈混沌雙聖劍', color: '#a855f7', quote: '「左右夾擊的Sisu聖劍……連我的五弦琴弦都被斬斷了！」' },
      { keyword: '岩石共鳴', label: '🌟 詠唱「岩石共鳴」· 召喚對角星隕砲', archetype: 'star_cannon', weaponName: '紫銅穹頂對角星隕巨砲', color: '#fde047', quote: '「22公里紫銅穹頂與漫天極光同步共鳴加劇了！」' },
      { keyword: '煙燻桑拿', label: '🔱 詠唱「煙燻桑拿」· 召喚鮮紅三叉戟', archetype: 'crimson_trident', weaponName: 'Löyly熾熱蒸氣三叉戟', color: '#f43f5e', quote: '「熾熱的白焰與三叉戟橫掃全場……真是驚人的氣魄！」' },
    ],
    chapter4: [
      { keyword: '瓦蘭吉榮光', label: '💀 詠唱「瓦蘭吉榮光」· 召喚龍顱巨砲', archetype: 'gaster_blaster', weaponName: '北冰洋破冰龍顱巨砲', color: '#38bdf8', quote: '「轟隆！雙側龍顱巨砲的光束竟將峽灣浮冰一舉轟碎！」' },
      { keyword: '英靈殿誓言', label: '⚔️ 詠唱「英靈殿誓言」· 召喚混沌雙刃', archetype: 'chaos_saber', weaponName: '女武神瓦爾基里混沌雙刃', color: '#facc15', quote: '「瓦爾哈拉的雙側光刃！孤王感受到了真正的戰神之力！」' },
      { keyword: '北極大教堂', label: '🌟 詠唱「北極大教堂」· 召喚對角星隕砲', archetype: 'star_cannon', weaponName: '極夜峽灣對角星隕巨砲', color: '#34d399', quote: '「看那背後的極光狂瀾！整座特羅姆瑟夜空都在沸騰！」' },
      { keyword: '維京不滅', label: '🔱 詠唱「維京不滅」· 召喚鮮紅三叉戟', archetype: 'crimson_trident', weaponName: '北海霸主鮮紅三叉戟', color: '#f43f5e', quote: '「鮮紅三叉戟與漫天白焰……好一場痛快淋漓的決戰！」' },
    ],
    chapter5: [
      { keyword: '女巫預言', label: '💀 詠唱「女巫預言」· 召喚龍顱巨砲', archetype: 'gaster_blaster', weaponName: '歐亞北美板塊龍顱巨砲', color: '#38bdf8', quote: '「Völuspá的新生預言？！雙側極光龍顱砲壓制了我的魔焰！」' },
      { keyword: '冰與火之歌', label: '⚔️ 詠唱「冰與火之歌」· 召喚混沌雙刃', archetype: 'chaos_saber', weaponName: '創世冰火混沌雙聖劍', color: '#a855f7', quote: '「左右懸浮的混沌雙刃……斬開了諸神黃昏的黑霧！」' },
      { keyword: '跨年煙火', label: '🌟 詠唱「跨年煙火」· 召喚對角星隕砲', archetype: 'star_cannon', weaponName: '雷克雅維克對角星隕巨砲', color: '#fde047', quote: '「漫天星隕與極光風暴交織……這是新紀元的破曉之光嗎？！」' },
      { keyword: '諸神黃昏重生', label: '🔱 詠唱「諸神黃昏重生」· 召喚鮮紅三叉戟', archetype: 'crimson_trident', weaponName: '穆斯貝爾海姆鮮紅三叉戟', color: '#f43f5e', quote: '「王權三叉戟的白焰風暴……令整座火山祭壇劇烈震動！」' },
    ],
  };

  const triggerChantResonanceStrike = (
    customKeyword?: string,
    forcedArchetype?: 'gaster_blaster' | 'chaos_saber' | 'star_cannon' | 'crimson_trident'
  ) => {
    const rawKw = (customKeyword ?? chantInputText).trim();
    const chapOptions = CHAPTER_CHANT_KEYWORDS[currentChapter.id] || CHAPTER_CHANT_KEYWORDS.chapter0;
    const matched =
      chapOptions.find(
        (o) =>
          (rawKw && (o.keyword.includes(rawKw) || rawKw.includes(o.keyword))) ||
          (forcedArchetype && o.archetype === forcedArchetype)
      ) || chapOptions[Math.floor(Math.random() * chapOptions.length)];

    const effectiveKeyword = rawKw || matched.keyword;
    const isExactMatch = chapOptions.some((o) => rawKw && (o.keyword.includes(rawKw) || rawKw.includes(o.keyword))) || !!forcedArchetype;

    // 1. Trigger intense Boss Hit Shake & Full-Stage Strobe Flash!
    bossShakeRef.current = 38;
    screenShakeRef.current = 30;
    bossHitFlashRef.current = 36;

    // 2. Synchronously Intensify Background Aurora Borealis Animation (極光動畫加劇 3.8x)!
    auroraSurgeTicksRef.current = 320;

    // 3. Summon Side Weapons on Both Sides of the Boss Stage (旁邊召喚武器攻擊 如截圖 1, 2, 3, 4)!
    playerSummonedWeaponsRef.current = [
      {
        id: 'summon_left_' + Date.now(),
        archetype: matched.archetype,
        name: matched.weaponName,
        side: 'left',
        ticks: 110,
        maxTicks: 110,
        color: matched.color,
      },
      {
        id: 'summon_right_' + Date.now(),
        archetype: matched.archetype === 'gaster_blaster' ? 'chaos_saber' : matched.archetype,
        name: matched.weaponName,
        side: 'right',
        ticks: 110,
        maxTicks: 110,
        color: '#fde047',
      },
      {
        id: 'summon_diag_' + Date.now(),
        archetype: 'star_cannon',
        name: '對角星隕巨砲',
        side: 'top_left',
        ticks: 110,
        maxTicks: 110,
        color: '#a855f7',
      },
    ];

    // 4. Spawn Burst of Impact Particles on Boss
    for (let i = 0; i < 34; i++) {
      const ang = (Math.PI * 2 * i) / 34;
      const spd = 2.5 + Math.random() * 6.5;
      impactParticlesRef.current.push({
        x: 430 + (Math.random() - 0.5) * 40,
        y: 72 + (Math.random() - 0.5) * 30,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd,
        size: 4 + Math.random() * 5,
        color: i % 3 === 0 ? '#fde047' : i % 3 === 1 ? '#38bdf8' : '#f43f5e',
        life: 1.0,
      });
    }

    // 5. Calculate & Apply Resonance Damage to Boss
    const baseDmg = isExactMatch ? 115 : 85;
    const bonusDmg = Math.round(baseDmg + (playerState.courage || 0) * 0.8 + (playerState.attackPower || 0));
    playRetroSound('laser');
    setTimeout(() => playRetroSound('fanfare'), 140);

    setBossSpeech(matched.quote);
    setChantTriggerBanner({
      keyword: effectiveKeyword,
      weaponName: matched.weaponName,
      damage: bonusDmg,
      isCrit: isExactMatch,
    });
    setChantInputText('');

    setBattleBossHp((prevHp) => {
      const nextHp = Math.max(0, prevHp - bonusDmg);
      if (nextHp <= 0) {
        setTimeout(() => {
          playRetroSound('fanfare');
          setBattlePhase('victory');
          setPlayerState((p) => {
            const updated = {
              ...p,
              exp: p.exp + 240,
              gold: p.gold + 300,
              courage: p.courage + 25,
              clearedBosses: Array.from(new Set([...p.clearedBosses, currentChapter.boss.id])),
              learnedStories: Array.from(new Set([...p.learnedStories, currentChapter.id])),
            };
            saveGame(updated);
            return updated;
          });
        }, 450);
      }
      return nextHp;
    });
  };
`;

code = code.replace(
  `  // Fullscreen Handler`,
  `${chantTriggerHelperCode}\n  // Fullscreen Handler`
);

// ============================================================================
// 8. ENHANCE BATTLE CANVAS RENDERING LOOP:
//    - Background Aurora Borealis that surges 3.8x when auroraSurgeTicksRef > 0
//    - Player Summoned Side-Weapons rendering beside Boss & firing beams/slashes/stars/tridents into Boss
//    - Boss Dodge Phase spawning the 4 screenshot weapons around the arena box right from cycleTick === 20 & 95!
// ============================================================================
const battleBackgroundAuroraAndWeaponsCode = `      // Starry background dust & subtle Nordic grid
      ctx.fillStyle = isBerserkMode ? 'rgba(253, 164, 175, 0.45)' : 'rgba(255, 255, 255, 0.35)';
      for (let s = 0; s < 30; s++) {
        ctx.fillRect((s * 31 + bTick * (isBerserkMode ? 0.65 : 0.3)) % width, (s * 23) % height, 1.5, 1.5);
      }

      // =====================================================================
      // 🌌 DYNAMIC BATTLESTAGE AURORA BOREALIS (詠唱成功時極光動畫劇烈加劇!)
      // =====================================================================
      const isAuroraSurging = auroraSurgeTicksRef.current > 0;
      if (auroraSurgeTicksRef.current > 0) {
        auroraSurgeTicksRef.current--;
      }
      const auroraSpeed = isAuroraSurging ? 0.14 : 0.035;
      const auroraAmp = isAuroraSurging ? 42 : 16;
      const auroraAlpha = isAuroraSurging ? 0.72 + Math.sin(bTick * 0.25) * 0.18 : 0.28 + Math.sin(bTick * 0.04) * 0.08;

      ctx.save();
      const ribbonCount = isAuroraSurging ? 4 : 2;
      for (let rb = 0; rb < ribbonCount; rb++) {
        const aurGrad = ctx.createLinearGradient(0, 0, width, 160 + rb * 25);
        if (rb % 2 === 0) {
          aurGrad.addColorStop(0, \`rgba(16, 185, 129, \${auroraAlpha})\`);
          aurGrad.addColorStop(0.35, \`rgba(56, 189, 248, \${auroraAlpha * 0.95})\`);
          aurGrad.addColorStop(0.7, \`rgba(168, 85, 247, \${auroraAlpha * 0.85})\`);
          aurGrad.addColorStop(1, \`rgba(250, 204, 21, \${isAuroraSurging ? auroraAlpha * 0.7 : 0})\`);
        } else {
          aurGrad.addColorStop(0, \`rgba(244, 63, 94, \${isAuroraSurging ? auroraAlpha * 0.65 : 0})\`);
          aurGrad.addColorStop(0.5, \`rgba(52, 211, 153, \${auroraAlpha * 0.9})\`);
          aurGrad.addColorStop(1, \`rgba(56, 189, 248, \${auroraAlpha * 0.6})\`);
        }
        ctx.fillStyle = aurGrad;
        ctx.beginPath();
        const baseRibY = 24 + rb * 28;
        ctx.moveTo(0, baseRibY);
        for (let ax = 0; ax <= width; ax += 40) {
          const wy = baseRibY + Math.sin(ax * 0.012 + bTick * auroraSpeed + rb * 1.4) * auroraAmp;
          ctx.lineTo(ax, wy);
        }
        ctx.lineTo(width, baseRibY + (isAuroraSurging ? 68 : 34));
        ctx.lineTo(0, baseRibY + (isAuroraSurging ? 68 : 34));
        ctx.closePath();
        ctx.fill();
      }

      // Vertical Aurora Pillar Rays when Chant Overdrive is active!
      if (isAuroraSurging) {
        for (let ray = 0; ray < 18; ray++) {
          const rx = ((ray * 53 + bTick * 3.2) % width);
          const rH = 75 + (ray % 4) * 32;
          const rayGrad = ctx.createLinearGradient(rx, 0, rx, rH);
          rayGrad.addColorStop(0, 'rgba(103, 232, 249, 0.55)');
          rayGrad.addColorStop(0.5, 'rgba(52, 211, 153, 0.35)');
          rayGrad.addColorStop(1, 'rgba(168, 85, 247, 0)');
          ctx.fillStyle = rayGrad;
          ctx.fillRect(rx, 0, 8, rH);
        }
        ctx.font = 'bold 10px monospace';
        ctx.fillStyle = '#6ee7b7';
        ctx.textAlign = 'right';
        ctx.fillText('🌌 極光共鳴劇烈加劇中 (AURORA OVERDRIVE x3.8)', width - 16, 56);
      }
      ctx.restore();`;

code = code.replace(
  `      // Starry background dust & subtle Nordic grid
      ctx.fillStyle = isBerserkMode ? 'rgba(253, 164, 175, 0.45)' : 'rgba(255, 255, 255, 0.35)';
      for (let s = 0; s < 30; s++) {
        ctx.fillRect((s * 31 + bTick * (isBerserkMode ? 0.65 : 0.3)) % width, (s * 23) % height, 1.5, 1.5);
      }`,
  battleBackgroundAuroraAndWeaponsCode
);

// Render Player-Summoned Side Weapons attacking the Boss right after drawPixelBossModel
const renderPlayerSummonedWeaponsCode = `      if (bossHitFlashRef.current > 0) bossHitFlashRef.current--;

      // =====================================================================
      // ⚔️ RENDER PLAYER/BOSS SUMMONED SIDE-WEAPONS BESIDE BOSS (如截圖 1~4)
      // =====================================================================
      if (playerSummonedWeaponsRef.current.length > 0) {
        playerSummonedWeaponsRef.current.forEach((sw) => {
          sw.ticks--;
          ctx.save();
          const isLeft = sw.side === 'left' || sw.side === 'top_left';
          const wx = sw.side === 'top_left' ? bossX - 185 : isLeft ? bossX - 125 : bossX + 125;
          const wy = sw.side === 'top_left' ? bossY - 28 : bossY + Math.sin(bTick * 0.2) * 8;

          // Draw high-energy beam / slash / star / fireball barrage from summoned side-weapon into Boss!
          if (sw.ticks < 95 && sw.ticks > 15) {
            // Outer beam glow
            ctx.strokeStyle = sw.color;
            ctx.lineWidth = 18 + Math.sin(bTick * 0.8) * 5;
            ctx.globalAlpha = 0.45;
            ctx.beginPath();
            ctx.moveTo(wx, wy);
            ctx.lineTo(bossX, bossY);
            ctx.stroke();

            // Inner white-hot core beam
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 7;
            ctx.globalAlpha = 0.95;
            ctx.beginPath();
            ctx.moveTo(wx, wy);
            ctx.lineTo(bossX, bossY);
            ctx.stroke();

            // Star & Fireball projectiles streaming along the beam (Screenshots 3 & 4)
            for (let p = 0; p < 4; p++) {
              const prog = ((bTick * 0.08 + p * 0.25) % 1);
              const px = wx + (bossX - wx) * prog;
              const py = wy + (bossY - wy) * prog + Math.sin(bTick * 0.4 + p) * 10;
              ctx.font = '14px sans-serif';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillText(sw.archetype === 'star_cannon' ? '⭐' : sw.archetype === 'crimson_trident' ? '🔥' : '✨', px, py);
            }
          }

          // Draw the summoned weapon sprite itself (Gaster Blaster skull / Chaos Saber / Star Cannon / Crimson Trident)
          ctx.globalAlpha = Math.min(1, sw.ticks / 20);
          drawBossSideWeapons(
            ctx,
            [
              {
                id: sw.id,
                type: sw.archetype,
                side: isLeft ? 'left' : 'right',
                x: wx,
                y: wy,
                targetCoord: bossY,
                state: 'cooldown',
                chargeTicks: 0,
                maxChargeTicks: 30,
                fireTicks: 0,
                beamThickness: 20,
                color: sw.color,
                glowColor: 'rgba(56, 189, 248, 0.5)',
                name: sw.name,
              },
            ],
            { x: bossX - 40, y: bossY - 30, w: 80, h: 60 },
            bTick
          );

          ctx.font = 'bold 9px monospace';
          ctx.fillStyle = '#fde047';
          ctx.textAlign = 'center';
          ctx.fillText(\`⚡ \${sw.name.slice(0, 9)}\`, wx, wy - 24);
          ctx.restore();
        });
        playerSummonedWeaponsRef.current = playerSummonedWeaponsRef.current.filter((sw) => sw.ticks > 0);
      }`;

code = code.replace(
  `      if (bossHitFlashRef.current > 0) bossHitFlashRef.current--;`,
  renderPlayerSummonedWeaponsCode
);

// Also enhance Boss dodge phase so side weapons spawn earlier (tick 25 AND tick 105) and include Gaster Blasters, Chaos Sabers, Star Cannons, and Crimson Tridents with star/fireball bullets!
code = code.replace(
  `        // Tick 80: Spawn Signature Side Weapons outside arena box
        if (cycleTick === 80) {`,
  `        // Tick 25 & Tick 105: Spawn Undertale Screenshot-Style Side Weapons outside arena box (龍顱巨砲 / 混沌雙刃 / 對角星隕砲 / 鮮紅三叉戟)
        if (cycleTick === 25) {
          const targetY = Math.max(by + 28, Math.min(by + bh - 28, soulPosRef.current.y));
          const targetX = Math.max(bx + 32, Math.min(bx + bw - 32, soulPosRef.current.x));
          sideWeaponsRef.current = [
            {
              id: 'ut_blaster_left',
              type: 'gaster_blaster',
              side: 'left',
              x: bx - 42,
              y: targetY,
              targetCoord: targetY,
              state: 'charging',
              chargeTicks: 34,
              maxChargeTicks: 34,
              fireTicks: 24,
              beamThickness: 26,
              color: '#38bdf8',
              glowColor: 'rgba(56, 189, 248, 0.5)',
              name: '極光龍顱巨砲',
            },
            {
              id: 'ut_saber_right',
              type: 'chaos_saber',
              side: 'right',
              x: bx + bw + 42,
              y: by + bh - (targetY - by),
              targetCoord: by + bh - (targetY - by),
              state: 'charging',
              chargeTicks: 40,
              maxChargeTicks: 40,
              fireTicks: 24,
              beamThickness: 24,
              color: '#a855f7',
              glowColor: 'rgba(168, 85, 247, 0.5)',
              name: '混沌雙刃聖劍',
            },
            {
              id: 'ut_trident_top',
              type: 'crimson_trident',
              side: 'top',
              x: targetX,
              y: by - 38,
              targetCoord: targetX,
              state: 'charging',
              chargeTicks: 44,
              maxChargeTicks: 44,
              fireTicks: 24,
              beamThickness: 24,
              color: '#f43f5e',
              glowColor: 'rgba(244, 63, 94, 0.5)',
              name: '王權鮮紅三叉戟',
            },
          ];
        }
        if (cycleTick === 100) {`
);

code = code.replace(
  `        if (cycleTick >= 165 || cycleTick < 80) {
          sideWeaponsRef.current = [];
        }`,
  `        if (cycleTick >= 185 || (cycleTick >= 88 && cycleTick < 100) || cycleTick < 25) {
          sideWeaponsRef.current = [];
        }`
);

// ============================================================================
// 9. HOOK UP INTERACTIVE ANIMALS ON WORLD MAP CANVAS & KEYBOARD/CLICK HANDLERS
// ============================================================================
// In keyboard handler (around line 8945): check proximity to NORDIC_INTERACTIVE_ANIMALS
code = code.replace(
  `        // Check Town Interactive Buildings
        const townBuildings = NORDIC_BUILDINGS_CONFIG[currentChapter.id] || [];
        const nearBuilding = townBuildings.find((b) => Math.hypot(playerPosRef.current.x - b.x, playerPosRef.current.y - b.y) < 65);
        if (nearBuilding) {
          setActiveBuildingModal(nearBuilding);
          playRetroSound('blip');
          return;
        }`,
  `        // Check Town Interactive Buildings
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
        }`
);

// In renderWorldMap (around line 13180): call drawInteractiveNordicAnimals
code = code.replace(
  `      // 1.6 Draw Interactive Town Buildings (各國城鎮特色建築：客棧、鍛造坊、聖堂、圖書館、天文台等)
      drawInteractiveTownBuildings(ctx, currentChapter.id, tick, playerPosRef.current);`,
  `      // 1.6 Draw Interactive Town Buildings (各國城鎮特色建築 + 地圖特殊建築物)
      drawInteractiveTownBuildings(ctx, currentChapter.id, tick, playerPosRef.current);

      // 1.7 Draw Interactive Nordic Animals (各國可互動式動物靈獸)
      drawInteractiveNordicAnimals(ctx, currentChapter.id, tick, playerPosRef.current, interactedAnimals);`
);

// In handleCanvasClick (around line 13635): check click on NORDIC_INTERACTIVE_ANIMALS
code = code.replace(
  `    // Click on Town Interactive Building (點擊城鎮特色建築)
    const currentBuildings = NORDIC_BUILDINGS_CONFIG[currentChapter.id] || [];
    for (const bld of currentBuildings) {
      if (Math.hypot(clickX - bld.x, clickY - bld.y) < 46) {
        setActiveBuildingModal(bld);
        playRetroSound('blip');
        return;
      }
    }`,
  `    // Click on Town Interactive Building (點擊城鎮特色建築 / 特殊建築)
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
    }`
);

// Update landmark discovery popup to also show mustDo!
code = code.replace(
  `            setActiveEvent({
              title: \`🌟 探索打卡！\${lm.name}\`,
              description: \`\${lm.historicalLore}\\n\\n【歷史考據】：\${lm.trivia}\\n\\n✨ 獎勵已發放（僅限首次）：+60 EXP / +80 G\`,
              icon: lm.emoji,
              actionLabel: '記錄至旅者手帳',
              onAction: () => setActiveTab('logbook'),
            });`,
  `            setActiveEvent({
              title: \`🌟 探索打卡！\${lm.name}\`,
              description: \`📖 【小故事】：\${lm.historicalLore}\\n\\n💡 【小知識】：\${lm.trivia}\${lm.mustDo && lm.mustDo.length ? '\\n\\n✅ 【必做的事】：\\n• ' + lm.mustDo.join('\\n• ') : ''}\\n\\n✨ 獎勵已發放（僅限首次）：+60 EXP / +80 G\`,
              icon: lm.emoji,
              actionLabel: '記錄至旅者手帳',
              onAction: () => setActiveTab('logbook'),
            });`
);

// ============================================================================
// 10. RENAME GAME HEADER & ADD CHANT TRIGGER BAR IN BOSS BATTLE UI & LOGBOOK MUST-DO
// ============================================================================
code = code.replace(
  `                  <span>《極光與誓約：北境歷險記》</span>
                  <span className="text-[10px] font-mono font-bold text-emerald-300 px-1.5 py-0.5 rounded bg-emerald-950 border border-emerald-700">
                    UNDERTALE EDITION
                  </span>
                </h2>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                木棧道雪港地圖 × 劇情NPC分支對話 × 彈幕躲避BOSS戰 × 嚴格通關解鎖
              </p>`,
  `                  <span>《北境極光傳奇：五國神話紀元》</span>
                  <span className="text-[10px] font-mono font-bold text-emerald-300 px-1.5 py-0.5 rounded bg-emerald-950 border border-emerald-700">
                    NORDIC AURORA SAGA
                  </span>
                </h2>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                五國神話探索地圖 × 特殊建築與靈獸互動 × 詠唱觸發器極光加劇 × 旁邊召喚武器彈幕BOSS戰
              </p>`
);

// Inject the Interactive 「🔮 詠唱觸發器 (Chant Trigger) & 旁邊召喚武器系統」 UI Deck right above the 4-Action Grid in Boss Battle!
const chantTriggerUiDeck = `                      /* Undertale Iconic 4-Action Grid + 🔮 詠唱觸發器 (Chant Trigger & Side-Weapon Summoner) */
                      <div className="space-y-3">
                        {/* 🔮 詠唱觸發器 (CHANT TRIGGER & SIDE-WEAPON SUMMONER) */}
                        <div className="p-3.5 rounded-xl bg-gradient-to-r from-slate-950 via-cyan-950/40 to-indigo-950/40 border-2 border-cyan-500/60 space-y-2.5 shadow-xl">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="text-base animate-pulse">🔮</span>
                              <span className="text-xs font-bold text-cyan-300 font-serif">
                                【詠唱觸發器 · 召喚旁邊武器援護】
                              </span>
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/90 text-emerald-300 border border-emerald-500/50">
                                輸入關鍵詞或點擊選項 → 觸發BOSS受擊震動閃光 + 極光動畫加劇 + 雙側武器齊射！
                              </span>
                            </div>
                            {chantTriggerBanner && (
                              <span className="text-[11px] font-mono font-bold text-amber-300 animate-bounce">
                                💥 詠唱「{chantTriggerBanner.keyword}」召喚【{chantTriggerBanner.weaponName}】造成 -{chantTriggerBanner.damage} 傷害！
                              </span>
                            )}
                          </div>

                          {/* Keyword Input & Instant Trigger Button */}
                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                            <input
                              type="text"
                              value={chantInputText}
                              onChange={(e) => setChantInputText(e.target.value)}
                              onKeyDown={(e) => {
                                e.stopPropagation();
                                if (e.key === 'Enter') {
                                  triggerChantResonanceStrike();
                                }
                              }}
                              placeholder={\`輸入本章詠唱關鍵詞（如：\${(CHAPTER_CHANT_KEYWORDS[currentChapter.id] || CHAPTER_CHANT_KEYWORDS.chapter0).map((k) => k.keyword).join(' / ')}）...\`}
                              className="flex-1 px-3 py-1.5 rounded-xl bg-slate-950 border border-cyan-500/50 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-300 font-mono"
                            />
                            <button
                              onClick={() => triggerChantResonanceStrike()}
                              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 via-emerald-500 to-teal-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-black text-xs shadow-lg cursor-pointer active:scale-95 transition-all shrink-0"
                            >
                              ⚡ 詠唱發動 · 召喚武器轟擊
                            </button>
                          </div>

                          {/* Quick-Select Chant & Side-Weapon Summon Chips (如截圖 1~4 四大召喚武器) */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1.5">
                            {(CHAPTER_CHANT_KEYWORDS[currentChapter.id] || CHAPTER_CHANT_KEYWORDS.chapter0).map((item, idx) => (
                              <button
                                key={idx}
                                onClick={() => triggerChantResonanceStrike(item.keyword, item.archetype)}
                                className="px-2.5 py-1.5 rounded-lg bg-slate-950/90 hover:bg-cyan-950/80 border border-slate-700 hover:border-cyan-400 text-left text-[11px] text-cyan-200 hover:text-white transition-all cursor-pointer flex items-center justify-between gap-1 group"
                              >
                                <span className="truncate font-mono">{item.label}</span>
                                <span className="text-[9px] text-amber-300 font-mono shrink-0 group-hover:translate-x-0.5 transition-transform">
                                  發動 →
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">`;

code = code.replace(
  `                      /* Undertale Iconic 4-Action Grid: FIGHT, ACT (史詩詠唱), ITEM (商店料理), MERCY (仁慈寬恕) */
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">`,
  chantTriggerUiDeck
);

// Close the extra wrapper div after the 4-action grid
code = code.replace(
  `                          <div>
                            <div className="text-xs font-bold text-rose-300 font-mono tracking-wider">【MERCY 寬恕】</div>
                            <p className="text-[9.5px] text-slate-400 mt-0.5 leading-tight">放下兵刃和平交涉</p>
                          </div>
                        </button>
                      </div>
                    )}`,
  `                          <div>
                            <div className="text-xs font-bold text-rose-300 font-mono tracking-wider">【MERCY 寬恕】</div>
                            <p className="text-[9.5px] text-slate-400 mt-0.5 leading-tight">放下兵刃和平交涉</p>
                          </div>
                        </button>
                      </div>
                      </div>
                    )}`
);

// Also in Epic Chant Modal (isEpicChantMenuOpen): when selecting a correct choice, ALSO trigger Boss shake + flash + Aurora Overdrive + Side Weapons!
code = code.replace(
  `                          if (choice.isCorrect) {
                            playRetroSound('magic');
                            setEpicChantFeedback({ quote: choice.reaction, isCorrect: true });
                          }`,
  `                          if (choice.isCorrect) {
                            playRetroSound('magic');
                            triggerChantResonanceStrike(choice.text.slice(0, 8));
                            setEpicChantFeedback({ quote: choice.reaction, isCorrect: true });
                          }`
);

// Update Logbook (TAB 4) to show 小故事, 小知識, and 必做的事!
code = code.replace(
  `                      {isUnlocked && (
                        <div className="mt-2 text-xs text-slate-300 space-y-1">
                          <p>{lm.historicalLore}</p>
                          <p className="text-amber-300 font-serif text-[11px]">💡 【考據】：{lm.trivia}</p>
                        </div>
                      )}`,
  `                      {isUnlocked && (
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
                      )}`
);

// Update activeBuildingModal handler to also handle 'special_blessing' and 'aurora_show'
code = code.replace(
  `                    } else if (activeBuildingModal.rewardType === 'valkyrie_shield') {
                      aegisChargesRef.current = (aegisChargesRef.current || 0) + 1;
                    }`,
  `                    } else if (activeBuildingModal.rewardType === 'valkyrie_shield') {
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
                    }`
);

// Add Interactive Animal Modal right after activeBuildingModal!
const animalModalJsx = `
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
                    setAnimalToast(\`🤚 你溫柔地撫摸了【\${activeAnimalModal.name.split(' (')[0]}】！獲得 \${activeAnimalModal.blessingName}！\`);
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
                    setAnimalToast(\`🍎 投餵【\${activeAnimalModal.favoriteTreat}】成功！靈獸開心跳躍，全狀態回滿並贈予金幣與勇氣！\`);
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
`;

code = code.replace(
  `        {/* In-Battle Food Inventory Modal (右下食物：必須在商店購買才能在戰鬥中使用！) */}`,
  `${animalModalJsx}\n        {/* In-Battle Food Inventory Modal (右下食物：必須在商店購買才能在戰鬥中使用！) */}`
);

fs.writeFileSync('src/components/PolarExpressReindeerRpgModal.tsx', code, 'utf8');
console.log('Successfully upgraded PolarExpressReindeerRpgModal.tsx!');
