export interface BudgetCategory {
  id: string;
  name: string;
  amountPerPerson: number;
  classTotal: number;
  percentage: number;
  color: string;
  icon: string;
  description: string;
  items: {
    name: string;
    note: string;
    perPerson: number;
    classTotal?: number;
  }[];
}

export interface DailyBudgetExpense {
  day: number;
  date: string;
  city: string;
  country: string;
  hotelName: string;
  hotelCost: number;
  lunchCost: number;
  dinnerCost: number;
  mealNote: string;
  transportCost: number;
  activityCost: number;
  dailyTotal: number;
  cumulativeTotal: number;
}

export const CLASS_SIZE = 33;
export const TOTAL_BUDGET_PER_PERSON = 552754;
export const TOTAL_BUDGET_CLASS = 18240882;

export const BUDGET_CATEGORIES: BudgetCategory[] = [
  {
    id: 'accommodation',
    name: '住宿費用',
    amountPerPerson: 250120,
    classTotal: 8253993,
    percentage: 45.2,
    color: '#8b5cf6', // purple
    icon: '🏨',
    description: '以 17 間雙人奢華套房計算，涵蓋歷史地標五星宮殿、極光玻璃穹頂木屋與藍湖溫泉奢華度假村。',
    items: [
      {
        name: "Hotel d'Angleterre (哥本哈根)",
        note: '2 晚 · 每間每晚 NT$ 35,250 · 丹麥皇家歷史五星級宮殿',
        perPerson: 36318,
        classTotal: 1198500,
      },
      {
        name: 'Grand Hôtel Stockholm (斯德哥爾摩)',
        note: '2 晚 · 每間每晚 NT$ 17,600 · 諾貝爾晚宴官方指定傳奇水岸飯店',
        perPerson: 18133,
        classTotal: 598400,
      },
      {
        name: 'Kakslauttanen Arctic Resort (拉普蘭)',
        note: '3 晚 · 每間每晚 NT$ 52,500 · 芬蘭世界知名全景極光玻璃屋木屋',
        perPerson: 81136,
        classTotal: 2677500,
      },
      {
        name: 'Hotel Kämp (赫爾辛基)',
        note: '2 晚 · 每間每晚 NT$ 14,000 · 芬蘭歷史地標級奢華酒店',
        perPerson: 14424,
        classTotal: 476000,
      },
      {
        name: 'The Thief (奧斯陸)',
        note: '1 晚 · 每間 NT$ 12,679 · 挪威當代奢華海濱設計酒店',
        perPerson: 6532,
        classTotal: 215543,
      },
      {
        name: 'Clarion Hotel The Edge (特羅姆瑟)',
        note: '1 晚 · 每間 NT$ 9,600 · 特羅姆瑟峽灣水岸頂級全景酒店',
        perPerson: 4945,
        classTotal: 163200,
      },
      {
        name: 'The Retreat at Blue Lagoon (冰島)',
        note: '3 晚 · 每間每晚 NT$ 57,350 · 包含私人藍湖溫泉 Spa 秘境奢華套房',
        perPerson: 88632,
        classTotal: 2924850,
      },
    ],
  },
  {
    id: 'transport',
    name: '交通運輸',
    amountPerPerson: 131141,
    classTotal: 4327653,
    percentage: 23.7,
    color: '#06b6d4', // cyan
    icon: '✈️',
    description: '包含去回程跨歐長程機票、北歐五國內陸各航段、極地包車接送與市區交通。',
    items: [
      {
        name: '長程國際機票（桃園 ⇄ 北歐不同點進出）',
        note: '桃園 → 哥本哈根 ＋ 雷克雅維克 → 桃園（經濟艙，聖誕跨年旺季團體票估算）',
        perPerson: 62000,
        classTotal: 2046000,
      },
      {
        name: '哥本哈根 → 斯德哥爾摩',
        note: '約 130 EUR（高速景觀火車/內陸機票）',
        perPerson: 4550,
        classTotal: 150150,
      },
      {
        name: '斯德哥爾摩 → 赫爾辛基 → 伊瓦洛',
        note: '約 300 EUR（飛往北極圈伊瓦洛轉機段）',
        perPerson: 10500,
        classTotal: 346500,
      },
      {
        name: '伊瓦洛 → 赫爾辛基',
        note: '約 200 EUR（節禮日 Boxing Day 班次少）',
        perPerson: 7000,
        classTotal: 231000,
      },
      {
        name: '赫爾辛基 → 奧斯陸',
        note: '約 210 EUR（北歐跨國線）',
        perPerson: 7350,
        classTotal: 242550,
      },
      {
        name: '奧斯陸 → 特羅姆瑟',
        note: '約 190 EUR（直飛北極首都）',
        perPerson: 6650,
        classTotal: 219450,
      },
      {
        name: '特羅姆瑟 → 奧斯陸 → 雷克雅維克',
        note: '約 400 EUR（飛往冰島轉機段）',
        perPerson: 14000,
        classTotal: 462000,
      },
      {
        name: '託運行李費（北歐內線多為每段另計）',
        note: '包含冬季厚重雪衣、三腳架與攝影器材加購託運',
        perPerson: 6000,
        classTotal: 198000,
      },
      {
        name: '當地包車、機場接送、市區大眾運輸',
        note: '團體包車約 1,000 EUR/日 × 約10日 ÷ 33人，另加各城接送與地鐵票',
        perPerson: 13091,
        classTotal: 432003,
      },
    ],
  },
  {
    id: 'meals',
    name: '餐食美饌',
    amountPerPerson: 78750,
    classTotal: 2598750,
    percentage: 14.2,
    color: '#f59e0b', // amber
    icon: '🍽️',
    description: '飯店早餐含於房價內，精選包含平安夜盛宴、米其林星級饗宴與 Moss 藍湖跨年晚宴。',
    items: [
      { name: 'Day 1 飯店晚餐（機上用餐）', note: '午 0 / 晚 2,500', perPerson: 2500 },
      { name: 'Day 2 哥本哈根星級晚餐（包場/分桌）', note: '午 1,200 / 晚 8,000', perPerson: 9200 },
      { name: 'Day 3 老城餐廳風味餐', note: '午 1,200 / 晚 2,500', perPerson: 3700 },
      { name: 'Day 4 Grand Hôtel 內頂級餐廳', note: '午 1,200 / 晚 4,000', perPerson: 5200 },
      { name: 'Day 5 Kakslauttanen 度假村特色晚餐', note: '午 1,200 / 晚 2,500', perPerson: 3700 },
      { name: 'Day 6 平安夜盛宴 (約 150 EUR)', note: '午 1,200 / 晚 5,250', perPerson: 6450 },
      { name: 'Day 7 聖誕節度假村晚宴', note: '午 1,200 / 晚 2,500', perPerson: 3700 },
      { name: 'Day 8 À La Kämp 精緻料理', note: '午 1,200 / 晚 2,500', perPerson: 3700 },
      { name: 'Day 9 Boreal 經典北歐珍饈', note: '午 1,200 / 晚 6,000', perPerson: 7200 },
      { name: 'Day 10 Credo (約 1,800 NOK)', note: '午 1,200 / 晚 5,400', perPerson: 6600 },
      { name: 'Day 11 極光船出發前特羅姆瑟晚餐', note: '午 1,200 / 晚 2,500', perPerson: 3700 },
      { name: 'Day 12 Retreat 藍湖地熱美饌', note: '午 1,200 / 晚 4,000', perPerson: 5200 },
      { name: 'Day 13 Moss 頂級跨年套餐 (約 280 USD)', note: '午 2,000 / 晚 8,700', perPerson: 10700 },
      { name: 'Day 14 Retreat 新年元旦精選用餐', note: '午 2,000 / 晚 4,000', perPerson: 6000 },
      { name: 'Day 15 機場午餐（機上用餐）', note: '午 1,200 / 晚 0', perPerson: 1200 },
    ],
  },
  {
    id: 'activities',
    name: '門票與活動',
    amountPerPerson: 37900,
    classTotal: 1250700,
    percentage: 6.9,
    color: '#10b981', // emerald
    icon: '🎟️',
    description: '涵蓋拉普蘭極地馴鹿與哈士奇雪橇、北極極光破冰船、溫泉與黃金圈探險。',
    items: [
      {
        name: '丹麥：蒂沃利花園入園等',
        note: 'Tivoli 聖誕限定入園門票與設施',
        perPerson: 800,
      },
      {
        name: '瑞典：瓦薩博物館、市政廳導覽、Fotografiska',
        note: '老城與斯德哥爾摩經典文博套票',
        perPerson: 2000,
      },
      {
        name: '芬蘭拉普蘭：馴鹿雪橇、哈士奇雪橇、極光獵尋、雪地活動',
        note: '極圈核心冬季深度探險',
        perPerson: 17500,
      },
      {
        name: '赫爾辛基：岩石教堂、Löyly 桑拿',
        note: '經典海邊柴燒桑拿與現代建築巡禮',
        perPerson: 1000,
      },
      {
        name: '奧斯陸：市區交通與雜支',
        note: '維格朗雕塑公園等市區參觀',
        perPerson: 500,
      },
      {
        name: '特羅姆瑟：極光船（約 4 小時）、Fjellheisen 纜車',
        note: '夜巡峽灣靜謐極光海峽與全景俯瞰',
        perPerson: 6800,
      },
      {
        name: '冰島：黃金圈一日遊、元旦極光團',
        note: '間歇泉/瀑布一日巡禮（藍湖 Spa 已含於 Retreat 房價中）',
        perPerson: 9300,
      },
    ],
  },
  {
    id: 'insurance',
    name: '醫療與旅行保險',
    amountPerPerson: 13500,
    classTotal: 445500,
    percentage: 2.4,
    color: '#3b82f6', // blue
    icon: '🛡️',
    description: '符合歐盟申根規定、含高額雪上活動緊急救援與不可退訂金取消保障。',
    items: [
      {
        name: '海外醫療＋旅遊平安險（符合申根規範，保額≥3萬歐元，含雪上活動15天）',
        note: '保險期間完整涵蓋 15 天極地活動與緊急醫療專機條款',
        perPerson: 4500,
      },
      {
        name: '旅遊不便險（班機延誤／取消、行李遺失）',
        note: '因應冬季北歐極地天候班機延遲保障',
        perPerson: 2000,
      },
      {
        name: '旅程取消險（訂金不可退，建議投保）',
        note: '高單價奢華飯店與極地訂金不可退條款保障',
        perPerson: 7000,
      },
    ],
  },
  {
    id: 'misc',
    name: '雜支與 ETIAS',
    amountPerPerson: 15021,
    classTotal: 495693,
    percentage: 2.7,
    color: '#ec4899', // pink
    icon: '📱',
    description: '包含高速 eSIM 跨國上網、小費、紀念品補貼與導師 ETIAS 申根許可。',
    items: [
      {
        name: '雜支（跨國高速 eSIM、小費、紀念品、零用）',
        note: '北歐五國通用吃到飽 eSIM 與司機領隊公費小費',
        perPerson: 15000,
      },
      {
        name: 'ETIAS 歐洲旅行授權許可（僅導師 1 人 20 歐元，學生免費）',
        note: '全班 700 元，平均約每人 NT$ 21',
        perPerson: 21,
      },
    ],
  },
  {
    id: 'contingency',
    name: '緊急預備金 (5%)',
    amountPerPerson: 26322,
    classTotal: 868626,
    percentage: 4.8,
    color: '#eab308', // yellow
    icon: '🪙',
    description: '應對暴風雪天氣異動、額外極地防寒裝備、匯率波動或緊急彈性調度。',
    items: [
      {
        name: '5% 團體應急彈性預備金',
        note: '未支用金額將於返台後全數均分退還同學',
        perPerson: 26322,
      },
    ],
  },
];

export const DAILY_BUDGET_DATA: DailyBudgetExpense[] = [
  {
    day: 1,
    date: '12/19',
    city: '哥本哈根',
    country: '丹麥',
    hotelName: "Hotel d'Angleterre",
    hotelCost: 18159,
    lunchCost: 0,
    dinnerCost: 2500,
    mealNote: '飯店晚餐（機上用餐）',
    transportCost: 32309, // 去程長程機票半額 + 接送
    activityCost: 0,
    dailyTotal: 52968,
    cumulativeTotal: 52968,
  },
  {
    day: 2,
    date: '12/20',
    city: '哥本哈根',
    country: '丹麥',
    hotelName: "Hotel d'Angleterre",
    hotelCost: 18159,
    lunchCost: 1200,
    dinnerCost: 8000,
    mealNote: '哥本哈根星級晚餐（包場/分桌）',
    transportCost: 1309,
    activityCost: 800, // Tivoli 花園入園
    dailyTotal: 29468,
    cumulativeTotal: 82436,
  },
  {
    day: 3,
    date: '12/21',
    city: '斯德哥爾摩',
    country: '瑞典',
    hotelName: 'Grand Hôtel Stockholm',
    hotelCost: 9067,
    lunchCost: 1200,
    dinnerCost: 2500,
    mealNote: '老城餐廳風味餐',
    transportCost: 6459, // 哥本哈根→斯德哥爾摩 130 EUR + 行李
    activityCost: 2000, // 瓦薩/市政廳/Fotografiska
    dailyTotal: 21226,
    cumulativeTotal: 103662,
  },
  {
    day: 4,
    date: '12/22',
    city: '斯德哥爾摩',
    country: '瑞典',
    hotelName: 'Grand Hôtel Stockholm',
    hotelCost: 9066,
    lunchCost: 1200,
    dinnerCost: 4000,
    mealNote: 'Grand Hôtel 內經典餐廳',
    transportCost: 1309,
    activityCost: 0,
    dailyTotal: 15575,
    cumulativeTotal: 119237,
  },
  {
    day: 5,
    date: '12/23',
    city: '拉普蘭 / 伊瓦洛',
    country: '芬蘭',
    hotelName: 'Kakslauttanen Arctic Resort',
    hotelCost: 27045,
    lunchCost: 1200,
    dinnerCost: 2500,
    mealNote: '度假村特色晚餐',
    transportCost: 12500, // 斯德哥爾摩→伊瓦洛轉機 300 EUR
    activityCost: 8750, // 芬蘭拉普蘭活動部分 (雪橇/極光獵尋)
    dailyTotal: 51995,
    cumulativeTotal: 171232,
  },
  {
    day: 6,
    date: '12/24',
    city: '拉普蘭 玻璃屋',
    country: '芬蘭',
    hotelName: 'Kakslauttanen Arctic Resort',
    hotelCost: 27045,
    lunchCost: 1200,
    dinnerCost: 5250,
    mealNote: '平安夜聖誕盛宴（約 150 EUR）',
    transportCost: 1309,
    activityCost: 8750, // 馴鹿雪橇/哈士奇雪橇
    dailyTotal: 43554,
    cumulativeTotal: 214786,
  },
  {
    day: 7,
    date: '12/25',
    city: '拉普蘭 玻璃屋',
    country: '芬蘭',
    hotelName: 'Kakslauttanen Arctic Resort',
    hotelCost: 27046,
    lunchCost: 1200,
    dinnerCost: 2500,
    mealNote: '聖誕節度假村晚餐',
    transportCost: 1309,
    activityCost: 0,
    dailyTotal: 32055,
    cumulativeTotal: 246841,
  },
  {
    day: 8,
    date: '12/26',
    city: '赫爾辛基',
    country: '芬蘭',
    hotelName: 'Hotel Kämp',
    hotelCost: 7212,
    lunchCost: 1200,
    dinnerCost: 2500,
    mealNote: 'À La Kämp 特色料理',
    transportCost: 8809, // 伊瓦洛→赫爾辛基 200 EUR + 行李
    activityCost: 0,
    dailyTotal: 19721,
    cumulativeTotal: 266562,
  },
  {
    day: 9,
    date: '12/27',
    city: '奧斯陸',
    country: '挪威',
    hotelName: 'Hotel Kämp (轉奧斯陸)',
    hotelCost: 7212,
    lunchCost: 1200,
    dinnerCost: 6000,
    mealNote: 'Boreal 經典北歐珍饈',
    transportCost: 9159, // 赫爾辛基→奧斯陸 210 EUR
    activityCost: 1000, // 岩石教堂 + Löyly 桑拿
    dailyTotal: 24571,
    cumulativeTotal: 291133,
  },
  {
    day: 10,
    date: '12/28',
    city: '特羅姆瑟',
    country: '挪威',
    hotelName: 'The Thief',
    hotelCost: 6532,
    lunchCost: 1200,
    dinnerCost: 5400,
    mealNote: 'Credo (約 1,800 NOK)',
    transportCost: 8459, // 奧斯陸→特羅姆瑟 190 EUR
    activityCost: 500, // 奧斯陸市區交通與雜支
    dailyTotal: 22091,
    cumulativeTotal: 313224,
  },
  {
    day: 11,
    date: '12/29',
    city: '特羅姆瑟',
    country: '挪威',
    hotelName: 'Clarion Hotel The Edge',
    hotelCost: 4945,
    lunchCost: 1200,
    dinnerCost: 2500,
    mealNote: '極光船出發前特羅姆瑟晚餐',
    transportCost: 1309,
    activityCost: 6800, // 特羅姆瑟極光船 4 小時 + Fjellheisen 纜車
    dailyTotal: 16754,
    cumulativeTotal: 329978,
  },
  {
    day: 12,
    date: '12/30',
    city: '冰島 藍湖',
    country: '冰島',
    hotelName: 'The Retreat at Blue Lagoon',
    hotelCost: 29544,
    lunchCost: 1200,
    dinnerCost: 4000,
    mealNote: 'Retreat 內地熱美饌',
    transportCost: 16209, // 特羅姆瑟→冰島轉機 400 EUR + 接送
    activityCost: 0,
    dailyTotal: 50953,
    cumulativeTotal: 380931,
  },
  {
    day: 13,
    date: '12/31',
    city: '冰島 藍湖 / 跨年',
    country: '冰島',
    hotelName: 'The Retreat at Blue Lagoon',
    hotelCost: 29544,
    lunchCost: 2000,
    dinnerCost: 8700,
    mealNote: 'Moss 跨年盛宴套餐（約 280 USD）',
    transportCost: 1309,
    activityCost: 0,
    dailyTotal: 41553,
    cumulativeTotal: 422484,
  },
  {
    day: 14,
    date: '1/1',
    city: '冰島 黃金圈',
    country: '冰島',
    hotelName: 'The Retreat at Blue Lagoon',
    hotelCost: 29544,
    lunchCost: 2000,
    dinnerCost: 4000,
    mealNote: 'Retreat 內新年用餐',
    transportCost: 1309,
    activityCost: 9300, // 黃金圈一日遊 + 元旦極光團
    dailyTotal: 46153,
    cumulativeTotal: 468637,
  },
  {
    day: 15,
    date: '1/2',
    city: '雷克雅維克 → 桃園',
    country: '返程',
    hotelName: '機上 (航程返台)',
    hotelCost: 0,
    lunchCost: 1200,
    dinnerCost: 0,
    mealNote: '機場午餐（機上用餐）',
    transportCost: 32309, // 回程國際機票半額 + 接駁
    activityCost: 0,
    dailyTotal: 33509,
    cumulativeTotal: 502146,
  },
];
