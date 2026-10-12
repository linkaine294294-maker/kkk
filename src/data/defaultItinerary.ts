import { DayPlan, Spot } from '../types/itinerary';

export const DAY_PLANS: DayPlan[] = [
  {
    dayNumber: 1,
    dateStr: '12/19',
    weekday: '週五',
    title: '桃園啟程 · 抵達哥本哈根童話新港',
    city: '哥本哈根 Copenhagen',
    country: '丹麥',
    countryFlag: '🇩🇰',
    hotel: "Hotel d'Angleterre",
    hotelDetail: '丹麥傳奇二百年五星頂級奢華飯店，每年聖誕外牆巨幅童話燈飾全城矚目',
    summary: '漫步運河畔色彩繽紛的山形磚屋，感受冬夜溫馨的熱紅酒香氣與北歐聖誕初體驗。',
    color: '#0284c7', // Sky Blue
  },
  {
    dayNumber: 2,
    dateStr: '12/20',
    weekday: '週六',
    title: '哥本哈根王室風華 · 蒂沃利聖誕童話奇遇',
    city: '哥本哈根 Copenhagen',
    country: '丹麥',
    countryFlag: '🇩🇰',
    hotel: "Hotel d'Angleterre",
    hotelDetail: '坐落國王新廣場，步行即可輕鬆探索市中心各大景點與精品徒步街',
    summary: '走訪宏偉克里斯蒂安堡宮與阿馬林堡宮衛兵交接，傍晚沉浸蒂沃利花園百萬燈海市集。',
    color: '#0ea5e9', // Light Blue
  },
  {
    dayNumber: 3,
    dateStr: '12/21',
    weekday: '週日',
    title: '飛往水上之都 · 斯德哥爾摩老城雪境',
    city: '斯德哥爾摩 Stockholm',
    country: '瑞典',
    countryFlag: '🇸🇪',
    hotel: 'Grand Hôtel Stockholm',
    hotelDetail: '1874年創立的瑞典國寶級飯店，歷屆諾貝爾獎得主下榻之所，直面王宮水岸',
    summary: '踏上十四座島嶼交織的水上之都，穿梭 Gamla Stan 中世紀鵝卵石窄巷與大廣場聖誕市集。',
    color: '#3b82f6', // Royal Blue
  },
  {
    dayNumber: 4,
    dateStr: '12/22',
    weekday: '週一',
    title: '瓦薩戰艦傳奇 · 藍廳榮耀與水岸攝影藝術',
    city: '斯德哥爾摩 Stockholm',
    country: '瑞典',
    countryFlag: '🇸🇪',
    hotel: 'Grand Hôtel Stockholm',
    hotelDetail: '傍晚於飯店著名的 Cadier Bar 享用頂級香檳與精緻下午茶，俯瞰點點燈火的水道',
    summary: '探索沉睡海底333年重見天日的瓦薩戰艦，仰望市政廳諾貝爾晚宴藍廳，沉醉當代攝影視覺盛宴。',
    color: '#6366f1', // Indigo
  },
  {
    dayNumber: 5,
    dateStr: '12/23',
    weekday: '週二',
    title: '深入北極圈 · 夢幻極光玻璃冰屋',
    city: '伊瓦洛 / 薩利色爾卡 Ivalo & Saariselkä',
    country: '芬蘭',
    countryFlag: '🇫🇮',
    hotel: 'Kakslauttanen Arctic Resort',
    hotelDetail: '世界知名玻璃穹頂冰屋（Glass Igloo），躺在恆溫床上即可仰望極地星空與極光',
    summary: '飛越北極圈銀白雪原，入住全球旅人夢寐以求的極光玻璃屋，感受極夜寧靜幽藍時光。',
    color: '#10b981', // Aurora Emerald
  },
  {
    dayNumber: 6,
    dateStr: '12/24',
    weekday: '週三',
    title: '平安夜 · 馴鹿雪橇林間漫行與傳統極地桑拿',
    city: '薩利色爾卡 Saariselkä',
    country: '芬蘭',
    countryFlag: '🇫🇮',
    hotel: 'Kakslauttanen Arctic Resort',
    hotelDetail: '包含私人木屋壁爐、傳統芬蘭桑拿與聖誕限定極地盛宴',
    summary: '坐上薩米族馴鹿雪橇穿梭寂靜針葉雪林，體驗道地傳統煙燻桑拿，共度一生難忘的純白平安夜。',
    color: '#059669', // Deep Forest Aurora
  },
  {
    dayNumber: 7,
    dateStr: '12/25',
    weekday: '週四',
    title: '聖誕節 · 哈士奇狂飆雪原與極光深夜巡獵',
    city: '薩利色爾卡 Saariselkä',
    country: '芬蘭',
    countryFlag: '🇫🇮',
    hotel: 'Kakslauttanen Arctic Resort',
    hotelDetail: '享受極地溫馨火爐與度假村專屬極光預警喚醒服務',
    summary: '親手駕馭精力充沛的哈士奇雪橇隊風馳電掣，夜幕降臨跟隨極光嚮導尋覓天際漫天綠光奇蹟。',
    color: '#14b8a6', // Teal Aurora
  },
  {
    dayNumber: 8,
    dateStr: '12/26',
    weekday: '週五',
    title: '南下波羅的海少女 · 赫爾辛基白教堂雪景',
    city: '赫爾辛基 Helsinki',
    country: '芬蘭',
    countryFlag: '🇫🇮',
    hotel: 'Hotel Kämp',
    hotelDetail: '自1887年營運至今的芬蘭奢華飯店地標，兼具新古典主義優雅與當代奢華極致',
    summary: '告別極北雪原飛抵赫爾辛基，仰望巍峨壯麗的白色大教堂與石板參議院廣場，品嚐道地肉桂捲。',
    color: '#06b6d4', // Cyan
  },
  {
    dayNumber: 9,
    dateStr: '12/27',
    weekday: '週六',
    title: '花崗岩奇蹟 · 設計街區與波羅的海海邊桑拿',
    city: '赫爾辛基 Helsinki',
    country: '芬蘭',
    countryFlag: '🇫🇮',
    hotel: 'Hotel Kämp',
    hotelDetail: '步行五分鐘即至 Esplanadi 林蔭大道與頂級北歐設計名品店',
    summary: '震撼於天然岩石鑿建的岩石教堂，漫步北歐前衛設計街區，於 Löyly 體驗跳入冰海的冰火桑拿。',
    color: '#0284c7', // Ocean Blue
  },
  {
    dayNumber: 10,
    dateStr: '12/28',
    weekday: '週日',
    title: '挪威峽灣之都 · 歌劇院冰山屋頂與生命雕塑',
    city: '奧斯陸 Oslo',
    country: '挪威',
    countryFlag: '🇳🇴',
    hotel: 'The Thief',
    hotelDetail: '坐落奧斯陸現代藝廊特區 Tjuvholmen，坐擁峽灣壯麗水景的當代前衛設計精品酒店',
    summary: '踏上宛如冰山浮出水面的奧斯陸歌劇院斜坡屋頂，探訪維格蘭公園刻畫人生喜怒哀樂的巨石雕塑群。',
    color: '#2563eb', // Vivid Blue
  },
  {
    dayNumber: 11,
    dateStr: '12/29',
    weekday: '週一',
    title: '北極門戶特羅姆瑟 · 峽灣高空纜車與靜謐追光船',
    city: '特羅姆瑟 Tromsø',
    country: '挪威',
    countryFlag: '🇳🇴',
    hotel: 'Clarion Hotel The Edge',
    hotelDetail: '市中心水岸第一排，透明玻璃帷幕將特羅姆瑟峽灣與遠方雪山盡收眼底',
    summary: '搭乘 Fjellheisen 登山纜車居高臨下俯瞰極圈之島璀璨燈火，搭乘零排放電動雙體船穿梭峽灣追逐極光。',
    color: '#7c3aed', // Nordic Purple
  },
  {
    dayNumber: 12,
    dateStr: '12/30',
    weekday: '週二',
    title: '火山與冰川之國 · 藍湖奢華水療地熱仙境',
    city: '格林達維克 & 藍湖 Grindavík & Blue Lagoon',
    country: '冰島',
    countryFlag: '🇮🇸',
    hotel: 'The Retreat at Blue Lagoon Iceland',
    hotelDetail: '世界頂級奢華溫泉渡假村，坐擁私人岩漿地熱潟湖與純天然火山矽泥水療專屬領域',
    summary: '飛抵外星般的冰島熔岩原，浸泡在宛如夢幻牛奶藍的藍湖地熱溫泉中，敷上火山白矽泥徹底放鬆。',
    color: '#0ea5e9', // Ice Aqua
  },
  {
    dayNumber: 13,
    dateStr: '12/31',
    weekday: '週三',
    title: '壯麗金圈探奇 · 全城跨年百萬煙火狂歡',
    city: '金圈 & 雷克雅維克 Golden Circle & Reykjavik',
    country: '冰島',
    countryFlag: '🇮🇸',
    hotel: 'The Reykjavik EDITION',
    hotelDetail: '萬豪集團頂級設計奢華地標，緊鄰 Harpa 音樂廳與舊港，坐擁海港與雪山無敵視野',
    summary: '震撼於間歇泉噴湧直衝天際、黃金瀑布冰柱奔騰；午夜時分見證全冰島人自發施放長達兩小時的壯麗煙火！',
    color: '#f59e0b', // Celebration Gold
  },
  {
    dayNumber: 14,
    dateStr: '1/1',
    weekday: '週四',
    title: '元旦新曙光 · 熔岩 Spa 與北大西洋極光落幕',
    city: '雷克雅維克 Reykjavik',
    country: '冰島',
    countryFlag: '🇮🇸',
    hotel: 'The Reykjavik EDITION',
    hotelDetail: '頂樓景觀酒吧是欣賞雷克雅維克海灣第一道新年極光的絕美聖地',
    summary: '以溫暖愜意的藍湖水療迎接新年第一天，漫步彩虹街與 Harpa 音樂廳璀璨玄武岩玻璃外牆，靜候夜空最後舞動的極光。',
    color: '#10b981', // Aurora Green
  },
  {
    dayNumber: 15,
    dateStr: '1/2',
    weekday: '週五',
    title: '珍重北歐 · 滿載十五日極光記憶凱旋啟程',
    city: '凱夫拉維克 & 返程 Keflavík to Taipei',
    country: '冰島',
    countryFlag: '🇮🇸',
    hotel: '國際航班商務艙 / 旅程溫暖賦歸',
    hotelDetail: '帶著五國極地雪景、聖誕鐘聲與極光記憶，踏上返回溫暖家鄉的航程',
    summary: '在凱夫拉維克機場精選冰島火山岩鹽、66°North 羊毛逸品與北歐設計伴手禮，為十五天童話旅程畫下完美句點。',
    color: '#64748b', // Slate
  },
];

export const DEFAULT_SPOTS: Spot[] = [
  // Day 1: 哥本哈根
  {
    id: 'spot-d1-1',
    day: 1,
    time: '15:30',
    name: '哥本哈根凱斯楚普機場抵達',
    originalName: 'Copenhagen Airport (CPH)',
    city: '哥本哈根',
    country: '丹麥',
    lat: 55.618,
    lng: 12.6508,
    category: 'transport',
    description:
      '班機降落斯堪地那維亞最大的空中門戶。機場內部充滿溫潤的木質地板與簡約的北歐採光設計。搭乘專車約二十分鐘即可直達哥本哈根市中心國王新廣場。',
    tips: ['入境大廳有便利的地鐵與專車接送區', '冬季室內外溫差大，出機場前記得套上羽絨外套與保暖毛帽'],
    images: [
          {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/K%C3%B8benhavn_terminal_3.jpg/1280px-K%C3%B8benhavn_terminal_3.jpg",
                "caption": "哥本哈根凱斯楚普國際機場第三航廈實景",
                "author": "Photographer: Thorfinn Stainforth",
                "license": "CC BY-SA 3.0"
          },
          {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Copenhagen_Airport_Mai_2009_PD_006.JPG/1280px-Copenhagen_Airport_Mai_2009_PD_006.JPG",
                "caption": "北歐花旗松實木地板與極簡採光航廈",
                "author": "Dornum72",
                "license": "CC BY-SA 3.0"
          },
          {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Copenhagen_Airport_Mai_2009_PD_032.JPG/1280px-Copenhagen_Airport_Mai_2009_PD_032.JPG",
                "caption": "哥本哈根機場抵達大廳與玻璃帷幕",
                "author": "Dornum72",
                "license": "CC BY-SA 3.0"
          }
    ],
    story: "1925年啟用的凱斯楚普機場是全球最早的民用機場之一；1998年落成的第三航廈由丹麥建築大師 Vilhelm Lauritzen 設計，以飛鳥展翼般的流線屋頂迎接全球旅人。",
    trivia: "機場內全面鋪設溫潤的北歐花旗松實木地板，是全世界極少數全木質地板的國際機場！",
    mustDo: ["在第三航廈巨型玻璃帷幕與木地板長廊拍照打卡","品嚐機場內丹麥百年烘培坊 Lagkagehuset 的肉桂捲","搭乘全自動無人駕駛 Metro M2 線 15 分鐘直達國王新廣場"],
    hotelRecommendation: {
      name: "Hotel d'Angleterre",
      description: '建於1755年，為世界歷史最悠久的奢華五星飯店之一，位於市中心國王新廣場。',
    },
    address: 'Lufthavnsboulevarden 6, 2770 Kastrup, Denmark',
  },
  {
    id: 'spot-d1-2',
    day: 1,
    time: '17:30',
    name: '新港運河漫步與熱紅酒',
    originalName: 'Nyhavn',
    city: '哥本哈根',
    country: '丹麥',
    lat: 55.6795,
    lng: 12.5898,
    category: 'attraction',
    description:
      '哥本哈根最著名的明信片地標。17世紀開鑿的人工運河兩側排列著鮮豔明亮的鵝黃、磚紅與磚藍色山形木屋。安徒生大師曾在此度過大半生寫下經典童話。12月的新港在聖誕燈串映照下倒映水面，木造小船停泊運河中，空氣飄散著肉桂與丁香熬煮的丹麥傳統香料熱紅酒（Gløgg）芳香。',
    tips: [
      '推薦在運河木屋小攤買一杯熱騰騰的丹麥熱紅酒（Gløgg），內含杏仁角與葡萄乾',
      '傍晚藍調時刻（Blue Hour，約16:00-16:45）天空呈現深邃海軍藍，是拍攝彩色木屋的最佳時機',
    ],
    images: [
          {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Kopenhagen_%28DK%29%2C_Nyhavn_--_2017_--_1711.jpg/1280px-Kopenhagen_%28DK%29%2C_Nyhavn_--_2017_--_1711.jpg",
                "caption": "哥本哈根新港彩色山牆木屋與百年古帆船實景",
                "author": "Dietmar Rabich",
                "license": "CC BY-SA 4.0"
          },
          {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/2018_-_Nyhavn_on_sunset.jpg/1280px-2018_-_Nyhavn_on_sunset.jpg",
                "caption": "新港運河畔安徒生故居與石板步道",
                "author": "Moahim",
                "license": "CC BY-SA 4.0"
          },
          {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Boats_at_Nyhavn%2C_Copenhagen%2C_20220616_1937_6628.jpg/1280px-Boats_at_Nyhavn%2C_Copenhagen%2C_20220616_1937_6628.jpg",
                "caption": "新港傍晚暖黃燈火倒映運河水面",
                "author": "Jakub Hałun",
                "license": "CC BY-SA 4.0"
          }
    ],
    story: "1670年代由克里斯蒂安五世國王下令瑞典戰俘開鑿人工運河，昔日曾是水手與酒館雲集的繁華碼頭；童話大師安徒生曾先後在18號、20號與67號居住長達近20年。",
    trivia: "新港9號建於1681年，是整條運河上最古老且從未改建過的原始藍色山牆老屋！",
    mustDo: ["尋找新港 20 號（安徒生寫下《打火匣》與《豌豆公主》的故居）","手捧一杯冒著熱氣的肉桂熱紅酒 Gløgg 沿著運河漫步","在停泊百年的雙桅木造古帆船與彩色木屋倒影前拍全景照"],
    diningRecommendation: {
      name: 'Restaurant Havfruen',
      description: '新港岸邊的精緻海鮮餐館，招牌丹麥醃漬鯡魚拼盤與香煎奶油海鱸魚佐新鮮蒔蘿。',
    },
    address: 'Nyhavn 1-71, 1051 København K, Denmark',
  },

  // Day 2: 哥本哈根
  {
    id: 'spot-d2-1',
    day: 2,
    time: '09:30',
    name: '克里斯蒂安堡宮',
    originalName: 'Christiansborg Slot',
    city: '哥本哈根',
    country: '丹麥',
    lat: 55.6761,
    lng: 12.5805,
    category: 'attraction',
    description:
      '丹麥權力心臟，亦是全世界唯一同時容納丹麥議會、總理辦公室以及最高法院的宏偉宮殿。王室接待廳（The Royal Reception Rooms）內懸掛著當代藝術家 Bjørn Nørgaard 設計的十七幅巨型丹麥歷史羊毛掛毯，皇家馬廄與地下八百年中世紀主教城堡遺跡極具歷史厚度。',
    tips: [
      '王室大廳金碧輝煌，參觀前需套上鞋套以保護珍貴拼花木地板',
      '登上位在宮殿正中央的塔樓（Tårnet），可免費俯瞰哥本哈根全景天際線',
    ],
    images: [
          {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Christiansborg_Slot_Copenhagen_2014_01.jpg/1280px-Christiansborg_Slot_Copenhagen_2014_01.jpg",
                "caption": "克里斯蒂安堡宮花崗岩外牆與106公尺高塔實景",
                "author": "Julian Herzog (Website)",
                "license": "CC BY 4.0"
          },
          {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/Sentry_box_shadow_lamp_Christiansborg_Copenhagen_Denmark.jpg/1280px-Sentry_box_shadow_lamp_Christiansborg_Copenhagen_Denmark.jpg",
                "caption": "城堡島運河畔的克里斯蒂安堡宮全景",
                "author": "Jebulon",
                "license": "CC0"
          },
          {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Kopenhagen_%28DK%29%2C_Christiansborg_--_2017_--_1483.jpg/1280px-Kopenhagen_%28DK%29%2C_Christiansborg_--_2017_--_1483.jpg",
                "caption": "克里斯蒂安堡宮皇家接待廳與巴洛克馬廄",
                "author": "Dietmar Rabich",
                "license": "CC BY-SA 4.0"
          }
    ],
    story: "坐落於哥本哈根發源地「城堡島（Slotsholmen）」，曾兩度毀於祝融並三度重建；今日是全世界唯一同時容納國會、最高法院與首相辦公室（三權合一）及皇家接待廳的宮殿。",
    trivia: "宮殿地底仍完整保留著西元 1167 年阿布薩隆主教興建第一代哥本哈根城堡的古老石造遺址！",
    mustDo: ["免費搭乘電梯登上 106 公尺高的宮殿塔樓俯瞰全城紅瓦屋頂","參觀女王會客廳內描繪丹麥千年歷史的 17 幅巨型現代掛毯","造訪宮殿後方的皇家馬廄一睹純白皇家馬匹與黃金馬車"],
    diningRecommendation: {
      name: 'Restaurant Tårnet',
      description: '坐落於克里斯蒂安堡宮塔樓內，提供高空景緻與頂級現代北歐料理（Smørrebrød 開放式三明治）。',
    },
    address: 'Prins Jørgens Gård 1, 1218 København, Denmark',
  },
  {
    id: 'spot-d2-2',
    day: 2,
    time: '11:30',
    name: '斯楚格徒步街慢活探索',
    originalName: 'Strøget',
    city: '哥本哈根',
    country: '丹麥',
    lat: 55.6788,
    lng: 12.5768,
    category: 'attraction',
    description:
      '歐洲最長的步行購物街之一，貫穿市政廳廣場至國王新廣場。聚集皇家哥本哈根瓷器（Royal Copenhagen）、喬治傑生銀飾（Georg Jensen）、HAY 設計旗艦店與丹麥頂級樂高旗艦店。聖誕期間街道上方懸掛著巨大的聖誕心型與璀璨星芒燈飾。',
    tips: [
      '皇家哥本哈根旗艦店二樓每年聖誕節皆會由名流設計專屬「皇家聖誕餐桌」，極具觀賞價值',
      '沿途巷弄藏著諸多北歐獨立咖啡館，品嚐香醇平白咖啡搭配肉桂肉捲（Kanelsnegl）',
    ],
    images: [
          {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Bus_cavalcade_on_Str%C3%B8get_12.JPG/1280px-Bus_cavalcade_on_Str%C3%B8get_12.JPG",
                "caption": "哥本哈根斯楚格（Strøget）百年行人徒步街實景",
                "author": "Leif Jørgensen",
                "license": "CC BY-SA 4.0"
          },
          {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Bus_cavalcade_on_Str%C3%B8get_22.JPG/1280px-Bus_cavalcade_on_Str%C3%B8get_22.JPG",
                "caption": "阿瑪廣場（Amagertorv）仙鶴噴泉與皇家哥本哈根瓷器旗艦店",
                "author": "Leif Jørgensen",
                "license": "CC BY-SA 4.0"
          },
          {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Bus_cavalcade_on_Str%C3%B8get_36.JPG/1280px-Bus_cavalcade_on_Str%C3%B8get_36.JPG",
                "caption": "冬日懸掛聖誕星燈的斯楚格購物大道",
                "author": "Leif Jørgensen",
                "license": "CC BY-SA 4.0"
          }
    ],
    story: "全長1.1公里的斯楚格街於1962年正式改為無車行人專用區，是全世界歷史最悠久、最長的戶外徒步購物大道，串聯市政廳廣場與國王新廣場。",
    trivia: "1962年剛提出封街禁車時曾遭到商家強烈反對，認為沒有汽車就沒有客人，結果啟用首年生意反而暴增三成，成為全球城市規劃典範！",
    mustDo: ["造訪創建於 1616 年的文藝復興建築內的 Royal Copenhagen 皇家哥本哈根手繪瓷器總店","在 LEGO 樂高旗艦店與巨型樂高新港模型合影並自製專屬小人偶","到百年老店 La Glace 品嚐丹麥最古老的傳奇「運動蛋糕（Sportskage）」"],
    address: 'Strøget, 1160 København, Denmark',
  },
  {
    id: 'spot-d2-3',
    day: 2,
    time: '13:30',
    name: '阿馬林堡宮與皇家衛兵交接',
    originalName: 'Amalienborg',
    city: '哥本哈根',
    country: '丹麥',
    lat: 55.6841,
    lng: 12.593,
    category: 'attraction',
    description:
      '丹麥王室當前主要住所，由四座圍繞著八角形廣場的洛可可風格古典宮殿組成。正對著遠方氣勢非凡的腓特烈大理石教堂。每天中午12點，身穿深藍軍裝、頭戴高聳熊皮帽的丹麥皇家禁衛軍會舉行莊嚴肅穆又精彩的衛兵交接儀式。',
    tips: [
      '建議於上午 11:45 前抵達八角廣場中央腓特烈五世銅像旁卡位',
      '若宮殿頂端升起丹麥國旗，代表女王或國王陛下當日身在宮中',
    ],
    images: [
          {
                "url": "https://upload.wikimedia.org/wikipedia/commons/c/cb/Amalienborg_Palace_Denmark.jpg",
                "caption": "阿馬林堡宮八角廣場與腓特烈五世騎馬銅像",
                "author": "lars inselmann from Cologne, Germany",
                "license": "CC BY-SA 2.0"
          },
          {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Frederik_V_statue_in_Amalienborg_Palace_-_DSC07144.JPG/1280px-Frederik_V_statue_in_Amalienborg_Palace_-_DSC07144.JPG",
                "caption": "丹麥皇家衛隊熊皮帽哨兵交接儀式",
                "author": "Daderot",
                "license": "CC0"
          },
          {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Frederik_V_statue_in_Amalienborg_Palace_Copenhagen_2014_01.jpg/1280px-Frederik_V_statue_in_Amalienborg_Palace_Copenhagen_2014_01.jpg",
                "caption": "阿馬林堡宮洛可可式宮殿與大理石教堂圓頂",
                "author": "Julian Herzog (Website)",
                "license": "CC BY 4.0"
          }
    ],
    story: "原為四戶丹麥貴族於1750年代興建的洛可可宅邸，1794年克里斯蒂安堡宮遭大火焚毀後，王室緊急購入此處作為冬宮，並沿用至今成為丹麥君主正式居所。",
    trivia: "觀察宮殿屋頂是否升起丹麥國旗「丹尼布洛（Dannebrog）」，就能立刻知道國王或王后今天是否正在宮中！",
    mustDo: ["正午 12:00 準時觀賞頭戴黑熊皮高帽的皇家衛隊樂隊交接","站在八角廣場中央軸線拍攝腓特烈大理石教堂壯麗圓頂","參觀克里斯蒂安八世宮內的皇家歷史博物館書房"],
    address: 'Amalienborg Slotsplads 5, 1257 København K, Denmark',
  },
  {
    id: 'spot-d2-4',
    day: 2,
    time: '15:00',
    name: '小美人魚像',
    originalName: 'Den Lille Havfrue',
    city: '哥本哈根',
    country: '丹麥',
    lat: 55.6929,
    lng: 12.5993,
    category: 'attraction',
    description:
      '根據安徒生經典童話《海的女兒》雕琢的青銅雕像，靜靜凝坐在長堤公園（Langelinie）花崗岩石巨石上，望向海平線等待心愛的王子。這尊雕像自1913年設立至今，已是哥本哈根與全丹麥象徵性的精神符號。',
    tips: ['海邊海風強勁，請備好防風圍巾與手套', '可順路散步穿過旁邊美麗的星形軍事要塞卡斯特雷特（Kastellet）'],
    images: [
          {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Petite_sir%C3%A8ne_de_Copenhague_%28conforme_%C3%A0_la_loi_danoise%29.JPG/1280px-Petite_sir%C3%A8ne_de_Copenhague_%28conforme_%C3%A0_la_loi_danoise%29.JPG",
                "caption": "長堤公園海濱的小美人魚百年青銅雕像實景",
                "author": "Benoît Prieur",
                "license": "CC0"
          },
          {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Expo_2010_Denmark_Pavilion-_Little_Mermaid_Statue_from_Copenhagen_Harbor_02.jpg/1280px-Expo_2010_Denmark_Pavilion-_Little_Mermaid_Statue_from_Copenhagen_Harbor_02.jpg",
                "caption": "小美人魚靜坐花崗岩石凝望厄勒海峽",
                "author": "Gary Lee Todd, Ph.D.",
                "license": "CC0"
          },
          {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Expo_2010_Denmark_Pavilion-_Little_Mermaid_Statue_from_Copenhagen_Harbor_03.jpg/1280px-Expo_2010_Denmark_Pavilion-_Little_Mermaid_Statue_from_Copenhagen_Harbor_03.jpg",
                "caption": "哥本哈根海濱長堤公園與小美人魚全景",
                "author": "Gary Lee Todd, Ph.D.",
                "license": "CC0"
          }
    ],
    story: "1913年由嘉士伯啤酒第二代傳人 Carl Jacobsen 觀賞皇家芭蕾《小美人魚》後深受感動而捐贈。雕塑家 Edvard Eriksen 以首席芭蕾舞伶 Ellen Price 的臉龐與自己妻子 Eline 的身軀塑造而成。",
    trivia: "這座舉世聞名的雕像其實高僅 125 公分、重 175 公斤，比大多數遊客想像中更嬌小溫婉！",
    mustDo: ["站在長堤海岸步道以厄勒海峽為背景與小美人魚同框","順道參觀旁邊氣勢磅礡的吉菲昂噴泉（Gefion Fountain）","沿著星形卡斯特雷特要塞（Kastellet）紅牆護城河散步"],
    address: 'Langelinie, 2100 København Ø, Denmark',
  },
  {
    id: 'spot-d2-5',
    day: 2,
    time: '17:00',
    name: '蒂沃利花園聖誕童話市集',
    originalName: 'Tivoli Gardens',
    city: '哥本哈根',
    country: '丹麥',
    lat: 55.6737,
    lng: 12.5683,
    category: 'attraction',
    description:
      '建於1843年，是全世界現存第二古老且最具魅力的主題樂園，華特·迪士尼當初正是汲取此地靈感創造了迪士尼樂園。每年12月，蒂沃利園區化身為北歐最盛大的聖誕童話村：超過一百萬盞璀璨彩燈點綴百年古木，人造積雪覆蓋木屋屋頂，七十多座聖誕工藝品小鋪與經典旋轉木馬營造出不可思議的浪漫氛圍。',
    tips: [
      '聖誕檔期人潮熱絡，建議預先持有電子門票快速通關',
      '園區內熱氣騰騰的蘋果麵團小圓球（Æbleskiver）佐覆盆子果醬是必嚐的傳統聖誕點心',
    ],
    images: [
          {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Georg_Carstensen_memorial_-_Tivoli_Gardens%2C_Copenhagen_-_DSC08367.JPG/1280px-Georg_Carstensen_memorial_-_Tivoli_Gardens%2C_Copenhagen_-_DSC08367.JPG",
                "caption": "哥本哈根蒂沃利花園璀璨夜色與童話建築",
                "author": "Daderot",
                "license": "CC0"
          },
          {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Tivoli_Gardens%2C_Copenhagen%2C_Denmark.jpg/1280px-Tivoli_Gardens%2C_Copenhagen%2C_Denmark.jpg",
                "caption": "蒂沃利花園百年歷史園區與湖畔倒影",
                "author": "Junielib",
                "license": "CC BY-SA 4.0"
          },
          {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Tivoli_Gardens_20180721-2.jpg/1280px-Tivoli_Gardens_20180721-2.jpg",
                "caption": "蒂沃利花園冬日聖誕燈海與摩天輪",
                "author": "Suicasmo",
                "license": "CC BY-SA 4.0"
          }
    ],
    story: "1843年由創辦人 Georg Carstensen 向國王進言「當人民在娛樂時便不會空想政治」而獲准興建，安徒生曾在此找尋《夜鶯》靈感，華特迪士尼更親臨考察並以此啟發創立迪士尼樂園。",
    trivia: "園內的木造雲霄飛車 Rutschebanen 建於1914年，至今仍有一位專業煞車員坐在列車中央手動控制下坡速度！",
    mustDo: ["體驗 1914 年骨董木造雲霄飛車與高空天女散花旋轉椅","在蒂沃利湖畔欣賞結合北歐交響樂的水舞雷射燈光秀","品嚐丹麥聖誕限定傳統圓球鬆餅 Æbleskiver 配覆盆子果醬"],
    diningRecommendation: {
      name: 'Nimb Brasserie',
      description: '坐落蒂沃利摩爾式宮殿建築內的法式頂級小館，享用特級肋眼牛排與松露薯條。',
    },
    address: 'Vesterbrogade 3, 1630 København V, Denmark',
  },

  // Day 3: 斯德哥爾摩
  {
    id: 'spot-d3-1',
    day: 3,
    time: '14:00',
    name: 'Gamla Stan 老城中世紀步道',
    originalName: 'Gamla Stan',
    city: '斯德哥爾摩',
    country: '瑞典',
    lat: 59.3257,
    lng: 18.0706,
    category: 'attraction',
    description:
      '歐洲保存最完整的中世紀城區之一。整座島嶼充滿13世紀鋪設的鵝卵石小徑、暖赭石色與藏紅花色的巴洛克建築，以及最窄僅有90公分的莫滕特羅齊格巷（Mårten Trotzigs gränd）。雪花紛飛的冬日，兩側櫥窗燃著溫暖燭火，如同走進安徒生童話裡的魔法時空。',
    tips: ['老城區皆為古老鵝卵石路面，請務必穿著防滑保暖的平底靴', '老城隱藏著許多瑞典傳統水晶工藝與手工蠟燭小工坊'],
    images: [
          {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Slussen_Stan_May_2015.jpg/1280px-Slussen_Stan_May_2015.jpg",
                "caption": "斯德哥爾摩老城 Gamla Stan 中世紀鵝卵石街巷實景",
                "author": "Arild Vågen",
                "license": "CC BY-SA 4.0"
          },
          {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Storkyrkan_and_Kungliga_slottet_Stockholm_2016_01.jpg/1280px-Storkyrkan_and_Kungliga_slottet_Stockholm_2016_01.jpg",
                "caption": "老城暖橘與金黃色歷史建築立面",
                "author": "Julian Herzog (Website)",
                "license": "CC BY 4.0"
          },
          {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Skeppsbrokajen_Gamla_Stan_from_Skeppsholmen_Stockholm_2016_01.jpg/1280px-Skeppsbrokajen_Gamla_Stan_from_Skeppsholmen_Stockholm_2016_01.jpg",
                "caption": "僅90公分寬的莫滕·特羅齊格窄巷（Mårten Trotzigs Gränd）",
                "author": "Julian Herzog (Website)",
                "license": "CC BY 4.0"
          }
    ],
    story: "建立於1252年的老城 Gamla Stan 是斯德哥爾摩的發源地，由比爾格伯爵（Birger Jarl）築城防禦波羅的海海盜，完整保留了13至17世紀北日耳曼山牆建築與蜿蜒石板巷弄。",
    trivia: "老城內的「莫滕·特羅齊格巷（Mårten Trotzigs Gränd）」僅有 36 階石梯、最窄處只有 90 公分寬，雙手張開就能同時摸到兩側牆壁！",
    mustDo: ["挑戰穿過僅 90 公分寬的莫滕·特羅齊格窄巷並拍照留念","尋找藏在芬蘭教堂後院、全瑞典最小的「看月小男孩（Järnpojke）」鐵雕並摸頭許願","觀察老城外牆上數百年歷史的「錨形鐵壁虎（Ankarslut）」，數字代表建築年份"],
    hotelRecommendation: {
      name: 'Grand Hôtel Stockholm',
      description: '面對斯德哥爾摩王宮的瑞典五星傳奇旗艦飯店，建於1874年。',
    },
    address: 'Gamla Stan, 111 29 Stockholm, Sweden',
  },
  {
    id: 'spot-d3-2',
    day: 3,
    time: '16:00',
    name: '大廣場聖誕市集與諾貝爾博物館',
    originalName: 'Stortorget & Nobel Prize Museum',
    city: '斯德哥爾摩',
    country: '瑞典',
    lat: 59.325,
    lng: 18.0708,
    category: 'attraction',
    description:
      '大廣場是斯德哥爾摩歷史最悠久的公共廣場，環繞著著名的紅色與黃色山牆建築。12月的大廣場聚集了全瑞典最道地的傳統聖誕市集：販售鹿肉香腸、瑞典傳統薑餅（Pepparkakor）、手工羊毛氈手套與傳統格洛格香料酒。廣場正前方的老證券交易所即是諾貝爾獎博物館。',
    tips: ['諾貝爾博物館咖啡館有供應印有諾貝爾獎牌的專屬金幣巧克力與特製冰淇淋'],
    images: [
          {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Stortorget_2006.jpg/1280px-Stortorget_2006.jpg",
                "caption": "斯德哥爾摩老城大廣場（Stortorget）紅黃歷史山牆建築與諾貝爾博物館",
                "author": "Holger Ellgaard",
                "license": "CC BY-SA 3.0"
          },
          {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Stortorget_i_Gamla_Stan_i_Stockholm-2.JPG/1280px-Stortorget_i_Gamla_Stan_i_Stockholm-2.JPG",
                "caption": "大廣場古井與百年傳統聖誕市集木屋攤位",
                "author": "Øyvind Holmstad",
                "license": "CC BY-SA 3.0"
          },
          {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Stockholm_Stortorget_1.JPG/1280px-Stockholm_Stortorget_1.JPG",
                "caption": "大廣場紅樓 Schantzska huset 的92塊白色紀念石磚",
                "author": "Zairon",
                "license": "CC BY-SA 3.0"
          }
    ],
    story: "大廣場是斯德哥爾摩最古老的廣場；廣場旁紅樓外牆鑲嵌著92塊白色石磚，相傳紀念1520年「斯德哥爾摩慘案」中遭丹麥國王克里斯蒂安二世處決的92位瑞典貴族。",
    trivia: "民間傳說若有人能數清紅樓上所有白石磚，其中一塊就會掉落！而在諾貝爾博物館咖啡廳，把椅子翻過來就能看到歷屆諾貝爾獎得主的親筆簽名！",
    mustDo: ["在諾貝爾博物館 Bistro Nobel 品嚐諾貝爾晚宴同款獎章巧克力與冰淇淋","翻開咖啡廳椅子底部尋找愛因斯坦或文學獎得主的親筆簽名","在自 1837 年延續至今的大廣場聖誕市集喝熱紅酒 Glögg 配薑餅"],
    diningRecommendation: {
      name: 'Den Gyldene Freden',
      description: '自1722年連續營業至今的百年名店，金氏世界紀錄最古老餐廳之一，瑞典傳統肉丸與野莓醬極具盛名。',
    },
    address: 'Stortorget 2, 111 29 Stockholm, Sweden',
  },

  // Day 4: 斯德哥爾摩
  {
    id: 'spot-d4-1',
    day: 4,
    time: '10:00',
    name: '瓦薩沉船博物館',
    originalName: 'Vasa Museum (Vasamuseet)',
    city: '斯德哥爾摩',
    country: '瑞典',
    lat: 59.328,
    lng: 18.0914,
    category: 'attraction',
    description:
      '全世界唯一完好保存的17世紀戰艦。1628年首航即在斯德哥爾摩港內沉沒，由於波羅的海特有的低鹽度水質與低溫環境，船體奇蹟般避免了蛀蟲侵蝕。1961年打撈上岸後，保留了原船98%的真實木質構件與數百尊精雕細琢的巴洛克神獸雕像，震撼力十足。',
    tips: ['館內展覽館常年保持恆溫18度以保護木料，參觀非常舒適', '整點有提供英文導覽與震撼的沉船打撈紀錄片播放'],
    images: [
          {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/SS_Sankt_Erik_icebreaker_museum_ship_Stockholm_2016_02.jpg/1280px-SS_Sankt_Erik_icebreaker_museum_ship_Stockholm_2016_02.jpg",
                "caption": "瓦薩沉船博物館 1628 年皇家戰艦全貌實景",
                "author": "Julian Herzog (Website)",
                "license": "CC BY 4.0"
          },
          {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Stockholm_August_2020_-_Kastellet%2C_Vasa_Museum%2C_and_Nordic_Museum.jpg/1280px-Stockholm_August_2020_-_Kastellet%2C_Vasa_Museum%2C_and_Nordic_Museum.jpg",
                "caption": "瓦薩號戰艦船尾精雕細琢的皇室木雕群像",
                "author": "Martin Falbisoner",
                "license": "CC BY-SA 4.0"
          },
          {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Shrouds_on_the_Vasa_ship%2C_Vasa_Museum%2C_Stockholm%2C_Sweden_julesvernex2.jpg/1280px-Shrouds_on_the_Vasa_ship%2C_Vasa_Museum%2C_Stockholm%2C_Sweden_julesvernex2.jpg",
                "caption": "瓦薩號雙層 64 門青銅火砲甲板細節",
                "author": "Jules Verne Times Two",
                "license": "CC BY-SA 4.0"
          }
    ],
    story: "1628年8月10日，瑞典國王古斯塔夫二世下令建造的64門巨砲旗艦「瓦薩號」展開首航，卻因船身過高、壓艙石不足，出港僅1,300公尺便遇陣風翻覆沉入波羅的海，直到333年後的1961年才被打撈重見天日。",
    trivia: "受惠於波羅的海低鹽度與缺氧冰冷海水，船木沒有被食船蛆侵蝕，整艘船高達 98% 都是 1628 年的原始部件！",
    mustDo: ["繞行六層觀景台從船底龍骨一路仰望至高達 52 公尺的主桅杆","細看船尾超過 700 尊象徵瑞典王權與古羅馬英雄的木雕像","觀看博物館內的《瓦薩號首航與打撈》多語系歷史紀錄片"],
    address: 'Galärvarvsvägen 14, 115 21 Stockholm, Sweden',
  },
  {
    id: 'spot-d4-2',
    day: 4,
    time: '13:30',
    name: '斯德哥爾摩市政廳與諾貝爾藍廳',
    originalName: 'Stockholm City Hall (Stadshuset)',
    city: '斯德哥爾摩',
    country: '瑞典',
    lat: 59.3275,
    lng: 18.0543,
    category: 'attraction',
    description:
      '臨梅拉倫湖而建的民族浪漫主義建築傑作，由八百萬塊紅磚砌成。每年12月10日諾貝爾獎頒獎晚宴即在此處的「藍廳」（Blue Hall）隆重舉行。二樓的「金廳」（Golden Hall）則由一千八百萬片金色馬賽克金箔拼貼出梅拉倫湖女王的雄渾壁畫。',
    tips: ['市政廳內部必須參加專人導覽團方可入內參觀', '走出市政廳後方的庭園可拍攝水岸對望騎士島的經典全景'],
    images: [
          {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Stockholms_stadshus_september_2011.jpg/1280px-Stockholms_stadshus_september_2011.jpg",
                "caption": "斯德哥爾摩市政廳（Stadshuset）梅拉倫湖畔紅磚高塔",
                "author": "Arild Vågen",
                "license": "CC BY-SA 3.0"
          },
          {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Stockholm_City_Hall_February_2014_02.jpg/1280px-Stockholm_City_Hall_February_2014_02.jpg",
                "caption": "市政廳金廳（Gyllene Salen）1800萬塊純金馬賽克壁畫",
                "author": "Arild Vågen",
                "license": "CC BY-SA 3.0"
          },
          {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Stockholm_Sweden_Radsalen-of-Stockholm-City-Hall-01.jpg/1280px-Stockholm_Sweden_Radsalen-of-Stockholm-City-Hall-01.jpg",
                "caption": "諾貝爾獎晚宴舉辦地「藍廳（Blå hallen）」壯闊階梯",
                "author": "CEphoto, Uwe Aranas",
                "license": "CC BY-SA 3.0"
          }
    ],
    story: "由建築師 Ragnar Östberg 耗時12年、使用800萬塊紅磚興建，於1923年瑞典國慶日落成；每年12月10日諾貝爾晚宴在藍廳舉行，隨後於金廳舉辦盛大皇家舞會。",
    trivia: "「藍廳」其實是紅磚牆！當年建築師原本打算將紅磚塗成藍色，但砌好後發現手打紅磚質感太美，決定保留原色卻沿用了「藍廳」之名！",
    mustDo: ["站在藍廳雲石大階梯中央體驗諾貝爾獎得主緩步而下的視角","仰望金廳北牆高達數公尺的「梅拉倫湖女王」純金馬賽克壁畫","走到市政廳臨水拱廊拍攝騎士島教堂尖塔與梅拉倫湖全景"],
    address: 'Hantverkargatan 1, 111 52 Stockholm, Sweden',
  },
  {
    id: 'spot-d4-3',
    day: 4,
    time: '16:00',
    name: 'Fotografiska 當代攝影藝術館',
    originalName: 'Fotografiska Stockholm',
    city: '斯德哥爾摩',
    country: '瑞典',
    lat: 59.3178,
    lng: 18.086,
    category: 'attraction',
    description:
      '坐落於索德馬姆島水岸的百年海關紅磚倉庫內，是全球頂尖的當代攝影文化殿堂。展出 Annie Leibovitz、Helmut Newton 等名家傑作。頂樓景觀餐廳榮獲米其林綠星肯定，擁有俯瞰整座斯德哥爾摩群島冬季落日的巨幅全景玻璃落地窗。',
    tips: ['營業時間延長至深夜，是欣賞斯德哥爾摩璀璨水岸夜景的最佳室內去處'],
    images: [
          {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Fotografiska_2010a.jpg/1280px-Fotografiska_2010a.jpg",
                "caption": "斯德哥爾摩 Fotografiska 當代攝影博物館 1906 年新藝術風格紅磚建築",
                "author": "Holger.Ellgaard",
                "license": "CC BY-SA 3.0"
          },
          {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Museum_Fotografiska%2C_Stockholm.jpg/1280px-Museum_Fotografiska%2C_Stockholm.jpg",
                "caption": "從頂樓景觀餐廳遠眺斯德哥爾摩老城與皇宮水岸夜景",
                "author": "DXR",
                "license": "CC BY-SA 4.0"
          },
          {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Fotografiska_museet_Stockholm_2016_01.jpg/1280px-Fotografiska_museet_Stockholm_2016_01.jpg",
                "caption": "南島（Södermalm）港灣第一排工業遺產與現代藝術展廳",
                "author": "Julian Herzog (Website)",
                "license": "CC BY 4.0"
          }
    ],
    story: "前身為建於1906年、由建築師 Ferdinand Boberg 設計的新藝術風格（Art Nouveau）皇家海關大樓，2010年改建為全球最具影響力的當代攝影藝術殿堂。",
    trivia: "頂樓餐廳曾榮獲米其林綠星（Michelin Green Star）與「全球最佳博物館餐廳」大獎，堅持零浪費永續北歐料理哲學！",
    mustDo: ["夜間參觀大師級當代攝影特展（營業至深夜 23:00，避開白天人潮）","在三樓全景落地窗酒吧點一杯北歐琴酒調酒俯瞰對岸格羅納倫遊樂園燈火","沿著南島 Fjällgatan 懸崖木棧道散步拍攝斯德哥爾摩群島明信片視角"],
    diningRecommendation: {
      name: 'Fotografiska Restaurant',
      description: '米其林綠星永續概念餐廳，主廚善用北歐根莖蔬食、發酵食材與新鮮漁產。',
    },
    address: 'Stadsgårdshamnen 22, 116 45 Stockholm, Sweden',
  },

  // Day 5: 拉普蘭 伊瓦洛
  {
    id: 'spot-d5-1',
    day: 5,
    time: '14:30',
    name: '伊瓦洛極圈機場抵達',
    originalName: 'Ivalo Airport (IVL)',
    city: '伊瓦洛',
    country: '芬蘭',
    lat: 68.6073,
    lng: 27.4053,
    category: 'transport',
    description:
      '芬蘭也是全歐盟最北端的民航機場，位處北極圈以北約250公里。踏出機艙那一刻，清冷純淨的極地空氣迎面撲來，四周皆是覆蓋著厚厚積雪的林海雪原。渡假村專屬暖氣四驅接駁車已在航廈門口等候。',
    tips: ['此時拉普蘭正值「極夜（Kaamos）」，日照雖弱但正午前後有約四小時如夢似幻的粉紫幽藍暮光'],
    images: [
          {
                "url": "https://upload.wikimedia.org/wikipedia/commons/3/38/Ivalon_lentoasema_kes%C3%A4ll%C3%A4.jpg",
                "caption": "芬蘭最北端伊瓦洛極圈機場（Ivalo Airport）白雪跑道實景",
                "author": "J-P Kärnä",
                "license": "CC BY-SA 3.0"
          },
          {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Ivalo_Airport_Gates_20170205.jpg/1280px-Ivalo_Airport_Gates_20170205.jpg",
                "caption": "深入北極圈 250 公里的拉普蘭原野雪林航廈",
                "author": "Tyg728",
                "license": "CC BY-SA 4.0"
          },
          {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Ivalo_Airport_Departure_hall_20170205.jpg/1280px-Ivalo_Airport_Departure_hall_20170205.jpg",
                "caption": "芬蘭航空客機降落於銀白泰加針葉林雪原",
                "author": "Tyg728",
                "license": "CC BY-SA 4.0"
          }
    ],
    story: "位於北緯68度的伊瓦洛機場是歐盟最北端的民用機場，1943年二戰期間初建，如今則是全球極光獵人進入薩利色爾卡（Saariselkä）與伊納里湖荒野的極北門戶。",
    trivia: "機場跑道緊鄰廣袤的拉普蘭原野，冬季除雪車隊能在暴風雪中於 12 分鐘內清理完畢整條跑道，展現芬蘭世界第一的極地除雪黑科技！",
    mustDo: ["走出機艙踏上厚實白雪跑道，與印有「IVALO ARCTIC AIRPORT」的木屋航廈合影","在機場大廳欣賞拉普蘭極光與薩米文化攝影裝置","搭乘專屬極地接駁車沿著霧凇雪林公路直奔薩利色爾卡玻璃屋"],
    address: 'Lentokentäntie 75, 99800 Ivalo, Finland',
  },
  {
    id: 'spot-d5-2',
    day: 5,
    time: '16:00',
    name: 'Kakslauttanen 極光玻璃冰屋',
    originalName: 'Kakslauttanen Arctic Resort - Glass Igloos',
    city: '薩利色爾卡',
    country: '芬蘭',
    lat: 68.333,
    lng: 27.3364,
    category: 'hotel',
    description:
      '全世界極光玻璃屋的開山鼻祖。採用特殊隔熱除霧防霜玻璃穹頂，即便室外零下30度，室內依然維持溫暖舒適。躺在電動調節的奢華大床上，即可毫無死角地仰望璀璨北極星、銀河與隨時可能漫天綻放的歐若拉（Aurora Borealis）綠色極光光幔。',
    tips: [
      '房內備有極光警報蜂鳴器，一旦天空出現極光會輕柔響鈴喚醒',
      '相機請架設腳架，調至手動曝光（ISO 1600-3200、f/2.8、曝光3-6秒）',
    ],
    images: [
          {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Wood_and_flowers.jpg/1280px-Wood_and_flowers.jpg",
                "caption": "芬蘭拉普蘭極光玻璃圓頂冰屋與雪林夜色",
                "author": "ezioman",
                "license": "CC BY 2.0"
          },
          {
                "url": "https://upload.wikimedia.org/wikipedia/commons/7/7b/Kakslauttanen_Igloo_village.jpg",
                "caption": "從防霜熱能玻璃穹頂仰望漫天綠極光",
                "author": "Tarja Mitrovic",
                "license": "CC BY 2.0"
          },
          {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Husky_Dogs_%28301004607%29.jpg/1280px-Husky_Dogs_%28301004607%29.jpg",
                "caption": "極圈針葉林間的浪漫玻璃屋與原木小木屋聚落",
                "author": "Timo Newton-Syms from Helsinki, Finland &amp; Maidenhead, Be",
                "license": "CC BY-SA 2.0"
          }
    ],
    story: "1973年創辦人 Jussi Eiramo 在薩利色爾卡荒野拋錨露宿時愛上這片極地，後首創採用「航太級導熱防霜玻璃」打造的圓頂玻璃屋，讓旅人不必在零下30度受凍也能躺在床上看極光。",
    trivia: "芬蘭語將北極光稱為「Revontulet（狐狸之火）」，相傳是北極火狐在雪原奔跑時，尾巴掃起雪花摩擦夜空激起的火花！",
    mustDo: ["開啟房內的「極光警報鈴（Aurora Alarm）」，極光出現即刻提醒","躺在電動調整角度的溫暖大床上 360 度仰望極光女神舞動","在度假村跨越覆蓋厚雪的木橋拍攝整排發光玻璃屋如同外星基地般的奇景"],
    hotelRecommendation: {
      name: 'Kakslauttanen Arctic Resort (Kelo-Glass Igloo)',
      description: '結合拉普蘭原木木屋的私人桑拿、壁爐與玻璃極光臥房的最高規格房型。',
    },
    address: 'Kiilopääntie 9, 99830 Saariselkä, Finland',
  },

  // Day 6: 平安夜 拉普蘭
  {
    id: 'spot-d6-1',
    day: 6,
    time: '10:00',
    name: '傳統薩米馴鹿雪橇雪林漫行',
    originalName: 'Traditional Reindeer Sleigh Safari',
    city: '薩利色爾卡',
    country: '芬蘭',
    lat: 68.3512,
    lng: 27.382,
    category: 'activity',
    description:
      '馴鹿是拉普蘭原住民薩米人（Sámi）數千年來最忠誠的夥伴。穿上保暖的極地防寒連身衣，裹著溫暖的馴鹿毛皮坐在傳統木製雪橇上，由馴鹿隊緩步引領穿過寂靜無聲的白雪松林。沿途只有雪橇壓過粉雪的細微沙沙聲，宛如走入活生生的冰雪奇緣童話。',
    tips: ['漫行後圍坐在薩米傳統圓錐帳篷（Kota）內的營火旁，品嚐熱藍莓汁並聆聽薩米人吟唱傳統民謠（Joik）'],
    images: [
          {
                "url": "https://upload.wikimedia.org/wikipedia/commons/0/05/Passengers_being_transported_over_ice_to_shore_by_dogsled_from_steam_ship%2C_Nome%2C_June_14%2C_1920_%28AL%2BCA_253%29.jpg",
                "caption": "芬蘭拉普蘭雪原馴鹿雪橇穿越霧凇森林",
                "author": "Almer Rydeen",
                "license": "Public domain"
          },
          {
                "url": "https://upload.wikimedia.org/wikipedia/commons/2/20/Poropartio.jpg",
                "caption": "薩米族傳統木雪橇與溫馴北極馴鹿",
                "author": "SA-kuva.",
                "license": "Public domain"
          },
          {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Kattaj%C3%A4rvi_Inari_Suomi_-_Finland_2013-03_019_reindeer_track.jpg/1280px-Kattaj%C3%A4rvi_Inari_Suomi_-_Finland_2013-03_019_reindeer_track.jpg",
                "caption": "薩米木帳篷 Kota 營火與熱藍莓汁體驗",
                "author": "Manfred Werner - Tsui",
                "license": "CC BY-SA 3.0"
          }
    ],
    story: "在芬蘭拉普蘭，馴鹿的數量比當地居民還多！千百年來原住民薩米人（Sámi）隨馴鹿遷徙放牧，馴鹿雪橇是極夜雪原中最安靜、最神聖的古老交通工具。",
    trivia: "馴鹿的眼睛會隨季節變色！夏天呈現璀璨金色，到了漫長極夜的冬天則會變成深邃藍色，以提升近千倍的夜視感光能力！",
    mustDo: ["裹著溫暖馴鹿皮毛毯乘坐木雪橇穿越掛滿厚雪的泰加針葉林","親手餵食馴鹿最喜愛的北極白地衣（鹿苔）並近距離合影","圍坐在薩米傳統木帳篷 Kota 火爐旁喝熱藍莓汁聽牧鹿人唱 Joik 古調"],
    address: 'Saariselkä Forest Trail, 99830 Inari, Finland',
  },
  {
    id: 'spot-d6-2',
    day: 6,
    time: '15:30',
    name: '度假村傳統煙燻桑拿與冰水跳水',
    originalName: 'Traditional Smoke Sauna & Ice Dipping',
    city: '薩利色爾卡',
    country: '芬蘭',
    lat: 68.334,
    lng: 27.337,
    category: 'activity',
    description:
      '桑拿（Sauna）是芬蘭文化的靈魂所在。體驗以樺木柴火慢燒數小時的傳統煙燻桑拿（Savusauna），將水澆淋在滾燙的桑拿石上釋放柔和蒸氣（Löyly）。鼓起勇氣走出蒸氣室，跳入冰封河流中鑿出的冰水洞中，全身血液瞬間循環沸騰，身心煥然一新！',
    tips: ['心臟血管疾病者請依自身狀況體驗，冰水浸泡數秒即可返回溫暖桑拿室'],
    images: [
          {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Finnish_Sauna_in_Korpilahti.jpg/1280px-Finnish_Sauna_in_Korpilahti.jpg",
                "caption": "芬蘭拉普蘭傳統原木煙燻桑拿房（Savusauna）雪景",
                "author": "Matias Arje",
                "license": "CC BY-SA 3.0"
          },
          {
                "url": "https://upload.wikimedia.org/wikipedia/commons/3/39/Mobile_sauna_umgebauter_vw_bus_helsinki.jpg",
                "caption": "蒸氣滾燙的芬蘭桑拿木屋與白樺樹枝（Vihta）",
                "author": "rupp.de",
                "license": "CC BY-SA 3.0"
          },
          {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Sauna-pool.JPG/1280px-Sauna-pool.JPG",
                "caption": "冒著寒氣的冰封河面破冰泳池（Avanto）",
                "author": "The original uploader was Math at Hungarian Wikipedia.",
                "license": "CC BY-SA 2.5"
          }
    ],
    story: "煙燻桑拿（Savusauna）是芬蘭最古老的桑拿形式：沒有煙囪，先用樺木燃燒數小時加熱巨石，待排盡濃煙後進入，空氣中瀰漫著獨特的木質冷燻清香。",
    trivia: "芬蘭人相信「如果桑拿、焦油和烈酒都治不好你的病，那這病就沒救了！」冰火交替能瞬間促使腦內啡與多巴胺飆升三倍！",
    mustDo: ["用溫水浸軟的芬蘭白樺樹枝束（Vihta）輕拍肩膀促進血液循環","在 85°C 煙燻桑拿蒸透後，鼓起勇氣走下木梯浸泡 0°C 冰洞 5 秒鐘！","包著浴巾在雪地露台喝一杯冰鎮芬蘭長飲（Hartwall Original Long Drink）"],
    address: 'Kakslauttanen Riverfront, Saariselkä, Finland',
  },
  {
    id: 'spot-d6-3',
    day: 6,
    time: '19:00',
    name: '拉普蘭平安夜奢華晚宴',
    originalName: 'Christmas Eve Arctic Gala Dinner',
    city: '薩利色爾卡',
    country: '芬蘭',
    lat: 68.333,
    lng: 27.3364,
    category: 'dining',
    description:
      '在裝飾著巨大雲杉聖誕樹的木雕主餐廳，享用芬蘭傳統平安夜盛宴：慢烤聖誕火腿佐甜芥末醬、經典甜菜根蘋果沙拉（Rosolli）、奶油焗烤蕪菁，以及香烤北極紅點鮭魚佐白松露醬，搭配頂級香檳共同慶祝聖誕平安夜。',
    tips: ['當晚神秘嘉賓「正宗拉普蘭聖誕老人」將親自造訪餐廳分發專屬聖誕小禮！'],
    images: [
          {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Lohikeitto.jpg/1280px-Lohikeitto.jpg",
                "caption": "拉普蘭原木餐廳營火慢烤北極鮭魚與平安夜饗宴",
                "author": "Tuijasal",
                "license": "CC BY-SA 3.0"
          },
          {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Salmon_soup_-_Lohikeitto_-_Laxsoppa_IMG_5602_C.JPG/1280px-Salmon_soup_-_Lohikeitto_-_Laxsoppa_IMG_5602_C.JPG",
                "caption": "熱騰騰的芬蘭傳統奶油蒔蘿鮭魚湯（Lohikeitto）",
                "author": "Anneli Salo",
                "license": "CC BY-SA 3.0"
          },
          {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Lohikeitto_dish.jpg/1280px-Lohikeitto_dish.jpg",
                "caption": "清燉拉普蘭馴鹿肉佐馬鈴薯泥與野生越橘果醬（Poronkäristys）",
                "author": "Nonepse",
                "license": "CC BY-SA 4.0"
          }
    ],
    story: "芬蘭人的平安夜（Jouluaatto）是一年中最神聖的夜晚，正午12點全芬蘭會聆聽圖爾庫宣讀延續自13世紀的《聖誕和平宣言》，隨後全家共享聖誕火腿、鮭魚與清燉鹿肉晚宴。",
    trivia: "芬蘭平安夜晚宴會在米布丁裡藏一顆完整的杏仁，誰吃到那顆杏仁就代表來年將擁有整年的好運與幸福！",
    mustDo: ["品嚐以樺木明火慢烤 2 小時、外皮酥脆多汁的北極圈釘木烤鮭魚（Loimulohi）","品嚐拉普蘭國菜「清燉鹿肉佐越橘醬（Poronkäristys）」與北極黃金雲莓甜點","在溫暖的松木壁爐旁與聖誕老人驚喜見面並領取平安夜紀念禮"],
    address: 'Main Lodge, Kakslauttanen Arctic Resort, Finland',
  },

  // Day 7: 聖誕節 拉普蘭
  {
    id: 'spot-d7-1',
    day: 7,
    time: '10:30',
    name: '哈士奇雪橇原野狂飆狂歡',
    originalName: 'Husky Safari in Arctic Wilderness',
    city: '薩利色爾卡',
    country: '芬蘭',
    lat: 68.375,
    lng: 27.41,
    category: 'activity',
    description:
      '拜訪熱情如火的阿拉斯加雪橇犬犬舍。每輛雪橇由五至六隻健步如飛的哈士奇全力拉馳，雙人一組輪流親自擔任雪橇車手（Musher）。在白茫茫的廣袤冰原丘陵上風馳電掣，感受零下氣溫下無與倫比的速度感與自由奔放。',
    tips: ['手握煞車桿需保持專注，與前車保持至少10公尺安全車距', '行程結束後可與乖巧的哈士奇幼犬近距離合照擁抱'],
    images: [
          {
                "url": "https://upload.wikimedia.org/wikipedia/commons/5/52/Greenland_reflections..._%285190992925%29.jpg",
                "caption": "阿拉斯加與西伯利亞哈士奇雪橇犬隊奔馳拉普蘭雪原",
                "author": "Christine Zenino from Chicago, US",
                "license": "CC BY 2.0"
          },
          {
                "url": "https://upload.wikimedia.org/wikipedia/commons/7/7a/Husky_Puppies%21_%285190992401%29.jpg",
                "caption": "活力十足的極地雪橇犬與晨曦粉紅天空",
                "author": "Christine Zenino from Chicago, US",
                "license": "CC BY 2.0"
          },
          {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Dog_sledding_in_Rovaniemi_%28Unsplash%29.jpg/1280px-Dog_sledding_in_Rovaniemi_%28Unsplash%29.jpg",
                "caption": "體驗一人掌舵一人乘坐的極地狗拉雪橇",
                "author": "🔮🌊💜✨ darkroomsg",
                "license": "CC0"
          }
    ],
    story: "西伯利亞與阿拉斯加哈士奇擁有雙層禦寒毛皮與驚人耐力，能在零下 40 度極寒中每日奔跑上百公里；牠們天生熱愛奔跑，出發前總會興奮地齊聲長嚎，一旦起跑卻瞬間安靜專注。",
    trivia: "哈士奇的腳掌肉墊具有特殊的血液逆流熱交換循環系統，即使長時間踩在冰面上也絕對不會凍傷！",
    mustDo: ["輪流體驗站在雪橇後方「踩煞車掌舵（Musher）」與坐在前座拍照","奔馳後走進犬舍摸摸功臣哈士奇並與藍眼幼犬溫馨互動","在營火木屋烤芬蘭肉腸（Makkara）配薑餅補充熱量"],
    address: 'Husky Park Saariselkä, Finland',
  },
  {
    id: 'spot-d7-2',
    day: 7,
    time: '20:30',
    name: '烏爾霍凱科寧國家公園極光獵尋',
    originalName: 'Urho Kekkonen National Park Aurora Hunt',
    city: '薩利色爾卡',
    country: '芬蘭',
    lat: 68.3188,
    lng: 27.4589,
    category: 'nature',
    description:
      '深入芬蘭第二大國家公園的高地荒原。遠離任何人為光源污染，視野遼闊無垠。在滿天如鑽石般密集的繁星下，綠色、紫色與粉紅色的極光如絲綢綢緞般在夜空中翻滾起伏，是大自然贈予聖誕節最神聖的禮物。',
    tips: [
      '高地風勢強勁，務必穿著羊毛排汗底層衣、羽絨中層與防風保暖雪褲',
      '備妥暖暖包貼在相機電池周圍，低溫下電池耗電速度極快',
    ],
    images: [
          {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Rock_cairns_on_Kuikkap%C3%A4%C3%A4_in_Urho_Kekkonen_national_park%2C_Sodankyl%C3%A4_%28July_2018%29.jpg/1280px-Rock_cairns_on_Kuikkap%C3%A4%C3%A4_in_Urho_Kekkonen_national_park%2C_Sodankyl%C3%A4_%28July_2018%29.jpg",
                "caption": "烏爾霍凱科寧國家公園（Urho Kekkonen）極光覆蓋的冰封樹掛（Tykky）",
                "author": "Markus Säynevirta",
                "license": "CC BY-SA 4.0"
          },
          {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Muorravaarakan_ruoktu_wilderness_hut_in_Urho_Kekkonen_National_Park%2C_Sodankyl%C3%A4_%28July_2018%29.jpg/1280px-Muorravaarakan_ruoktu_wilderness_hut_in_Urho_Kekkonen_National_Park%2C_Sodankyl%C3%A4_%28July_2018%29.jpg",
                "caption": "北極荒野雪山與漫天綠紫極光光幕",
                "author": "Markus Säynevirta",
                "license": "CC BY-SA 4.0"
          },
          {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Aurora_borealis_over_Saana_fell.jpg/1280px-Aurora_borealis_over_Saana_fell.jpg",
                "caption": "穿著極地雪鞋穿越零光害的拉普蘭原始森林",
                "author": "WikiLucas00",
                "license": "CC BY-SA 4.0"
          }
    ],
    story: "成立於1983年、面積廣達2,550平方公里的烏爾霍凱科寧國家公園是芬蘭第二大國家公園，以芬蘭傳奇總統命名，完整保留了冰河時期以來的極圈丘陵（Fells）與泰加林荒野。",
    trivia: "冬季山頭的雲杉被厚重凍霧包覆，形成宛如白色奶油怪獸般的奇幻「樹掛（Tykky）」，在極光綠芒照耀下猶如魔戒奇幻世界！",
    mustDo: ["穿上極地寬底雪鞋（Snowshoes）或搭乘雪地摩托車深入零光害高地守候極光","在冰封的巨型白色樹掛（Tykky）森林間拍下奇幻剪影","抬頭辨認北極星、仙后座與橫跨天頂的北極光弧線"],
    address: 'Urho Kekkonen National Park, Saariselkä, Finland',
  },

  // Day 8: 赫爾辛基
  {
    id: 'spot-d8-1',
    day: 8,
    time: '14:30',
    name: '赫爾辛基參議院廣場與白教堂',
    originalName: 'Senate Square & Helsinki Cathedral',
    city: '赫爾辛基',
    country: '芬蘭',
    lat: 60.1695,
    lng: 24.9523,
    category: 'attraction',
    description:
      '卡爾·路德維格·恩格爾（Carl Ludvig Engel）設計的新古典主義建築典範。純白色外牆搭配綠色圓頂的赫爾辛基主教座堂巍然聳立在高聳的階梯之巔，俯瞰著鋪滿花崗岩石的參議院廣場與中央亞歷山大二世沙皇銅像。冬日白雪皚皚，整座廣場更顯聖潔高雅。',
    tips: ['爬上教堂正前方階梯頂端，可遠眺芬蘭灣海港與市區街景', '白教堂地下室設有精緻的展覽空間與安靜的紀念品咖啡小鋪'],
    images: [
          {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Lutheran_Cathedral_Helsinki.jpg/1280px-Lutheran_Cathedral_Helsinki.jpg",
                "caption": "赫爾辛基大教堂（Tuomiokirkko）純白新古典主義建築與綠色圓頂",
                "author": "Hans Hillewaert",
                "license": "CC BY-SA 3.0"
          },
          {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Lutheran_Cathedral_Helsinki_edit.jpg/1280px-Lutheran_Cathedral_Helsinki_edit.jpg",
                "caption": "參議院廣場亞歷山大二世銅像與大教堂高聳階梯",
                "author": "Hans Hillewaert",
                "license": "CC BY-SA 4.0"
          },
          {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Catedral_Luterana_de_Helsinki%2C_Finlandia%2C_2012-08-14%2C_DD_14.JPG/1280px-Catedral_Luterana_de_Helsinki%2C_Finlandia%2C_2012-08-14%2C_DD_14.JPG",
                "caption": "雪夜裡發光的赫爾辛基白教堂全景",
                "author": "Diego Delso",
                "license": "CC BY-SA 3.0"
          }
    ],
    story: "1852年落成的赫爾辛基大教堂由德國建築師 Carl Ludvig Engel 設計，原名「聖尼古拉教堂」以紀念俄國沙皇尼古拉一世；純白廊柱與綠色銅頂在波羅的海航道上遠在數海里外即可望見。",
    trivia: "教堂屋頂邊緣佇立著 12 尊巨大的鋅製十二使徒雕像，這是全世界規模最大的獨立鋅雕群！",
    mustDo: ["像當地人一樣坐在大教堂前 45 級寬廣花崗岩階梯上曬冬日暖陽拍照","走進極簡純白的八角形路德宗大廳仰望管風琴與穹頂","逛逛教堂正前方參議院廣場的赫爾辛基聖誕市集（Tuomaan Markkinat）"],
    hotelRecommendation: {
      name: 'Hotel Kämp',
      description: '芬蘭歷史最悠久的頂級奢華飯店，始於1887年，許多各國元首與音樂大師西貝流士曾是座上客。',
    },
    address: 'Unioninkatu 29, 00170 Helsinki, Finland',
  },
  {
    id: 'spot-d8-2',
    day: 8,
    time: '16:30',
    name: '集市廣場與老農貿市場',
    originalName: 'Market Square & Old Market Hall (Vanha Kauppahalli)',
    city: '赫爾辛基',
    country: '芬蘭',
    lat: 60.1675,
    lng: 24.9537,
    category: 'dining',
    description:
      '建於1889年的老農貿市場外觀為經典紅黃相間磚造建築。市場內部整潔溫暖，匯聚了芬蘭最頂級的傳統食材：新鮮煙燻鮭魚、白身魚魚子醬、傳統黑麥酸麵包以及香氣四溢的奶油鮭魚湯（Lohikeitto）。',
    tips: ['推薦品嚐 Soppakeittiö 的招牌芬蘭奶油鮭魚湯，附贈無限量享用的黑麥麵包與羅勒青醬橄欖油'],
    images: [
          {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Antiguo_Mercado_de_Helsinki%2C_Finlandia%2C_2012-08-14%2C_DD_01.JPG/1280px-Antiguo_Mercado_de_Helsinki%2C_Finlandia%2C_2012-08-14%2C_DD_01.JPG",
                "caption": "赫爾辛基百年老農貿市場（Vanha kauppahalli）紅磚濱海建築",
                "author": "Diego Delso",
                "license": "CC BY-SA 3.0"
          },
          {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Antiguo_Mercado_de_Helsinki%2C_Finlandia%2C_2012-08-14%2C_DD_05.JPG/1280px-Antiguo_Mercado_de_Helsinki%2C_Finlandia%2C_2012-08-14%2C_DD_05.JPG",
                "caption": "市場內琳瑯滿目的煙燻鮭魚、魚子醬與北歐熟食木攤位",
                "author": "Diego Delso",
                "license": "CC BY-SA 3.0"
          },
          {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Suomi100_Helsinki_old_market_hall_1.jpg/1280px-Suomi100_Helsinki_old_market_hall_1.jpg",
                "caption": "港邊集市廣場（Kauppatori）與波羅的海破冰渡輪",
                "author": "Htm",
                "license": "CC BY-SA 3.0"
          }
    ],
    story: "1889年開幕的赫爾辛基老農貿市場由建築師 Gustaf Nyström 設計，坐落於南港岸邊，百餘年來一直是赫爾辛基市民採買煙燻馴鹿肉、熊肉罐頭與新鮮波羅的海魚獲的美食殿堂。",
    trivia: "市場內的 Story Café 與 Soppakeittiö 湯屋每天熬煮的奶油海鮮濃湯，曾多次被評選為全歐洲最美味的市場平民美食！",
    mustDo: ["在 Soppakeittiö 點一碗滿滿鮭魚與鮮蝦的傳統濃湯配無限續加的烤麵包","品嚐芬蘭傳統「卡累利阿派（Karjalanpiirakka）」塗抹蛋奶油（Munavoi）","在港邊搭乘 15 分鐘破冰渡輪遠眺世界文化遺產芬蘭堡（Suomenlinna）"],
    diningRecommendation: {
      name: 'Ravintola Savoy',
      description: '芬蘭設計巨匠 Alvar Aalto 親手設計室內裝潢的傳奇米其林星級餐廳，坐擁赫爾辛基市景。',
    },
    address: 'Eteläranta, 00130 Helsinki, Finland',
  },

  // Day 9: 赫爾辛基
  {
    id: 'spot-d9-1',
    day: 9,
    time: '10:00',
    name: '岩石教堂',
    originalName: 'Temppeliaukio Church (Rock Church)',
    city: '赫爾辛基',
    country: '芬蘭',
    lat: 60.173,
    lng: 24.9252,
    category: 'attraction',
    description:
      '由蘇馬萊寧兄弟建築師於1969年設計完成，直接在天然花崗岩巨石塊中向下開鑿炸出。上方覆蓋著直徑24公尺的巨大紫銅圓頂，由180塊天窗玻璃輻射狀支撐，自然日光傾瀉而下。天然裸露粗獷的花崗岩壁帶來驚人的絕佳聲學回音效果。',
    tips: ['若適逢管風琴演奏或排練，坐在原木長椅上靜靜聆聽是一種心靈洗滌', '二樓銅質看台是俯瞰整個圓形教堂與祭壇的最佳攝影角度'],
    images: [
          {
                "url": "https://upload.wikimedia.org/wikipedia/commons/6/62/Temppeliaukio_Church_3.jpg",
                "caption": "赫爾辛基岩石教堂（Temppeliaukio）天然花崗岩壁與紫銅穹頂",
                "author": "Pertsaboy",
                "license": "CC BY-SA 3.0"
          },
          {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Temppeliaukio_Church_%28sis%C3%A4puolelta%29.jpg/1280px-Temppeliaukio_Church_%28sis%C3%A4puolelta%29.jpg",
                "caption": "由 22 公里長銅條盤繞而成的飛碟狀天頂與環形天窗",
                "author": "Old Pionear",
                "license": "CC BY-SA 4.0"
          },
          {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Temppeliaukio_Church_on_28th_September_2014_1.jpg/1280px-Temppeliaukio_Church_on_28th_September_2014_1.jpg",
                "caption": "陽光穿透 180 扇天窗灑落在古老冰河岩壁上",
                "author": "Lauren Stevens",
                "license": "CC BY-SA 4.0"
          }
    ],
    story: "1969年由建築師兄弟 Timo 與 Tuomo Suomalainen 設計，直接將一整座天然前寒武紀花崗岩山丘從頂部炸開掏空，上方覆蓋巨型紫銅線圈圓頂，被譽為現代有機建築的巔峰。",
    trivia: "未經修飾的粗糙花崗岩壁擁有世界頂級的天然殘響音效，連鑲嵌在岩縫中的 3001 根管風琴音管都不設琴箱！",
    mustDo: ["抬頭細看由長達 22 公里的紫銅線圈一圈圈纏繞而成的飛碟穹頂","尋找岩壁下方流淌的天然融雪地下水痕與冰河刮痕","若遇上現場管風琴或大提琴演奏，務必靜坐聆聽天籟般的岩洞共鳴"],
    address: 'Lutherinkatu 3, 00100 Helsinki, Finland',
  },
  {
    id: 'spot-d9-2',
    day: 9,
    time: '13:00',
    name: '赫爾辛基設計街區與頌歌中央圖書館',
    originalName: 'Design District & Oodi Central Library',
    city: '赫爾辛基',
    country: '芬蘭',
    lat: 60.1633,
    lng: 24.9405,
    category: 'attraction',
    description:
      '赫爾辛基作為世界設計之都的核心地帶。涵蓋25條街區，聚集了200多家頂級北歐家居（Marimekko、Iittala、Artek）、藝廊與古董工藝店。隨後造訪被譽為「世界上最美圖書館」的 Oodi 頌歌中央圖書館，體驗由雲杉木流線曲面構成的現代公共美學奇蹟。',
    tips: ['Oodi 三樓設有「書籍天堂」，採光柔和且擁有全景視野咖啡館，非常適合慢節奏放鬆'],
    images: [
          {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Central_Library_Oodi_in_Helsinki_02.jpg/1280px-Central_Library_Oodi_in_Helsinki_02.jpg",
                "caption": "赫爾辛基頌歌中央圖書館（Oodi）波浪雲杉木立面與玻璃帷幕",
                "author": "Ninaras",
                "license": "CC BY 4.0"
          },
          {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Helsinki_Central_Library_Oodi_20190602_203034.jpg/1280px-Helsinki_Central_Library_Oodi_20190602_203034.jpg",
                "caption": "三樓「書之天堂（Book Heaven）」白色波浪天頂與全城落地窗",
                "author": "Sino Yu",
                "license": "CC0"
          },
          {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Outside_of_Helsinki-then-and-now_in_Brygga%2C_Oodi%2C_Helsinki_2019-11-12.jpg/1280px-Outside_of_Helsinki-then-and-now_in_Brygga%2C_Oodi%2C_Helsinki_2019-11-12.jpg",
                "caption": "赫爾辛基設計街區與芬蘭當代建築美學",
                "author": "Zache",
                "license": "CC BY-SA 4.0"
          }
    ],
    story: "2018年為慶祝芬蘭獨立百年而落成的「Oodi（頌歌）」中央圖書館，由 ALA 建築事務所設計，耗資9,800萬歐元，以芬蘭雲杉木構築出巨大拱橋般的波浪曲線，被評為「全球最佳公共圖書館」。",
    trivia: "這座圖書館裡「書本只佔三分之一空間」！二樓免費提供市民 3D 列印機、雷射切割機、錄音室、電競房甚至縫紉機！",
    mustDo: ["搭手扶梯穿過圓形天窗直達三樓「書之天堂」，在室內白樺樹下閱讀拍照","觀察館內會自己搭電梯、避開行人的可愛自動還書機器人","走上三樓戶外市民大陽台，平視對面莊嚴的芬蘭國會大廈（Eduskuntatalo）"],
    address: 'Töölönlahdenkatu 4, 00100 Helsinki, Finland',
  },
  {
    id: 'spot-d9-3',
    day: 9,
    time: '16:30',
    name: 'Löyly 海濱當代桑拿',
    originalName: 'Löyly Helsinki',
    city: '赫爾辛基',
    country: '芬蘭',
    lat: 60.1527,
    lng: 24.9304,
    category: 'activity',
    description:
      '由芬蘭 Avanto Architects 建築事務所設計的現代建築雕塑，坐落在波羅的海海岸。建築外覆多角形松木板條遮陽層。在此享受柴火桑拿後，沿著私人木梯直接踏入冬季結冰的波羅的海海水游泳池，隨後在海景壁爐露台享用一杯香檳。',
    tips: ['Löyly 採全預約制，入場包含毛巾、置物櫃鑰匙與座墊', '桑拿後推薦在附設景觀餐廳品嚐招牌香煎肉丸佐越橘醬'],
    images: [
          {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/L%C3%B6yly_Helsinki_2.jpg/1280px-L%C3%B6yly_Helsinki_2.jpg",
                "caption": "赫爾辛基 Löyly 現代木構造海濱桑拿館外觀",
                "author": "Lasse Keskinen",
                "license": "CC BY-SA 4.0"
          },
          {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/L%C3%B6yly_Helsinki.jpg/1280px-L%C3%B6yly_Helsinki.jpg",
                "caption": "波羅的海冰封海岸線與 Löyly 幾何松木露台",
                "author": "Lasse Keskinen",
                "license": "CC BY-SA 4.0"
          },
          {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/L%C3%B6yly_-saunan_ravintola_01.jpg/1280px-L%C3%B6yly_-saunan_ravintola_01.jpg",
                "caption": "傳統芬蘭木柴煙燻桑拿與海景休憩廳",
                "author": "Lasse Keskinen",
                "license": "CC BY-SA 4.0"
          }
    ],
    story: "在人口550萬的芬蘭擁有超過330萬間桑拿房，「桑拿（Sauna）」更是唯一通行全球的芬蘭語詞彙！2016年開幕的 Löyly 由 Avanto 建築事務所打造，以4000塊FSC認證熱處理松木構築出宛如海岸岩石的現代雕塑。",
    trivia: "Löyly 在芬蘭語中指的是「將水潑在滾燙桑拿石上瞬間蒸騰而起的熱蒸氣與靈魂氣息」，芬蘭桑拿文化已被列入聯合國非物質文化遺產！",
    mustDo: ["體驗赫爾辛基罕見的正統「黑煙燻桑拿（Savusauna）」溫潤木香","蒸到全身發熱後順著木階梯直接跳進零度的波羅的海冰水泳池！","在海景壁爐餐廳享用芬蘭國湯——奶油蒔蘿鮭魚湯（Lohikeitto）"],
    diningRecommendation: {
      name: 'Löyly Restaurant',
      description: '北歐海鮮烤物小館，提供新鮮碳烤波羅的海鯡魚與芬蘭農場慢燉燉鹿肉。',
    },
    address: 'Hernesaarenranta 4, 00150 Helsinki, Finland',
  },

  // Day 10: 奧斯陸
  {
    id: 'spot-d10-1',
    day: 10,
    time: '14:00',
    name: '奧斯陸歌劇院斜坡漫步',
    originalName: 'Oslo Opera House (Operahuset)',
    city: '奧斯陸',
    country: '挪威',
    lat: 59.9075,
    lng: 10.7531,
    category: 'attraction',
    description:
      '由國際知名建築事務所 Snøhetta 設計，外觀由三萬六千塊義大利卡拉拉白大理石與白色花崗岩拼接而成。建築宛如一座巨大白色冰山從奧斯陸峽灣中拔地而起。最獨特之處在於公眾可以自由沿著大理石斜坡屋頂一路步行漫步到屋頂最高點，360度飽覽峽灣風光與城市天際線。',
    tips: ['冬季大理石斜面偶有薄冰，走道設有加熱融雪防滑步道，請沿指標慢行', '大廳內部的波浪形橡木帷幕牆暖意盎然，與戶外冷冽冰雪形成鮮明對比'],
    images: [
          {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/New_Opera_in_Oslo.jpg/1280px-New_Opera_in_Oslo.jpg",
                "caption": "奧斯陸歌劇院（Operahuset）純白卡拉拉大理石斜坡屋頂",
                "author": "Pudelek (Marcin Szala)",
                "license": "CC BY-SA 4.0"
          },
          {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Oper_Oslo_3.jpg/1280px-Oper_Oslo_3.jpg",
                "caption": "深入奧斯陸峽灣的冰山造型歌劇院與水上玻璃雕塑",
                "author": "Maclovely",
                "license": "CC BY-SA 3.0 no"
          },
          {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Oslo_Opera_house_%282015%29%282%29.jpg/1280px-Oslo_Opera_house_%282015%29%282%29.jpg",
                "caption": "歌劇院內部溫潤橡木波浪牆與全景落地窗",
                "author": "Beata May",
                "license": "CC BY-SA 4.0"
          }
    ],
    story: "2008年落成的奧斯陸歌劇院由挪威國寶級建築事務所 Snøhetta 設計，耗資5億歐元，外牆鋪設36,000塊義大利卡拉拉白色大理石，宛如一座從奧斯陸峽灣緩緩升起的巨大純白冰川。",
    trivia: "這是全世界第一座「鼓勵全市民直接踩上屋頂散步」的國家歌劇院，每塊大理石磚表面都經過特殊防滑紋理雕刻！",
    mustDo: ["沿著白色大理石緩坡一路步行登上歌劇院最高處俯瞰奧斯陸峽灣","拍攝海面上隨潮汐與風向旋轉的巨型玻璃雕塑《She Lies》","順道參觀隔壁 2021 年落成的孟克美術館（MUNCH）真跡《吶喊》"],
    hotelRecommendation: {
      name: 'The Thief',
      description: '奧斯陸當代藝術精品飯店，位於 Tjuvholmen 運河藝術半島，客房配置當代名家藝術真跡。',
    },
    address: 'Kirsten Flagstads Plass 1, 0150 Oslo, Norway',
  },
  {
    id: 'spot-d10-2',
    day: 10,
    time: '16:00',
    name: '維格蘭雕塑公園',
    originalName: 'Vigeland Park (Vigelandsparken)',
    city: '奧斯陸',
    country: '挪威',
    lat: 59.927,
    lng: 10.7008,
    category: 'attraction',
    description:
      '世界上最大的單一藝術家雕塑公園。挪威雕塑大師古斯塔夫·維格蘭（Gustav Vigeland）歷時二十餘年，創作出212尊青銅與花崗岩雕塑，涵蓋600多個人物姿態。核心「生命之柱（Monolitten）」高達14公尺，由整塊巨大的花崗岩雕刻出121個緊密攀附、奮力向天伸展的人體雕像。',
    tips: ['橋樑兩側的58尊青銅雕塑中最知名的是跺腳號哭的「憤怒的小男孩（Sinnataggen）」'],
    images: [
          {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Other_view_of_Frogner_Park_-_Vigeland_Park%2C_Oslo.jpg/1280px-Other_view_of_Frogner_Park_-_Vigeland_Park%2C_Oslo.jpg",
                "caption": "奧斯陸維格蘭雕塑公園高達17公尺的《人生柱（Monolitten）》",
                "author": "Ignaz Wiradi",
                "license": "CC BY-SA 3.0 no"
          },
          {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/NOR-2016-Frogner_Park-Vigeland_Installation-View_from_the_monolith.jpg/1280px-NOR-2016-Frogner_Park-Vigeland_Installation-View_from_the_monolith.jpg",
                "caption": "生命之橋上的青銅雕塑群與著名《憤怒的小男孩（Sinnataggen）》",
                "author": "Godot13",
                "license": "CC BY-SA 4.0"
          },
          {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Norway_-_Oslo_-_Frogner_Park_-_Vigeland_sculpture.jpg/1280px-Norway_-_Oslo_-_Frogner_Park_-_Vigeland_sculpture.jpg",
                "caption": "冬雪覆蓋下的維格蘭公園生命之泉與中軸線",
                "author": "5snake5",
                "license": "CC0"
          }
    ],
    story: "挪威雕塑大師古斯塔夫·維格蘭（Gustav Vigeland）傾盡畢生40年心血，獨立完成園內212座青銅與花崗岩雕塑（共超過600個人物），不設任何宗教或政治神話，純粹刻畫人類從誕生、相愛、掙扎到死亡的生命輪迴。",
    trivia: "鎮園之寶《人生柱》是由一整塊重達 270 噸的巨型花崗岩原石，由 3 名石匠按照維格蘭的泥塑模型耗時整整 14 年才手工雕琢完成，上頭交纏著 121 個人體！",
    mustDo: ["在生命之橋左側欄杆找到跺腳大哭的《憤怒的小男孩》，握握他被摸得金亮的小手祈福","登上最高處階梯近距離仰望 121 個人體螺旋向天攀升的《人生柱》","站在公園最深處透過《生命之輪（Livshjulet）》圓環拍向整條雕塑中軸線"],
    diningRecommendation: {
      name: 'Maaemo',
      description: '奧斯陸傳奇米其林三星餐廳，北歐新式料理的最高殿堂（需數月前預訂）。',
    },
    address: 'Nobels gate 32, 0268 Oslo, Norway',
  },
  {
    id: 'spot-d10-3',
    day: 10,
    time: '18:30',
    name: '卑爾根布呂根漢薩同盟彩色木屋群',
    originalName: 'Bryggen UNESCO World Heritage Wharf',
    city: '卑爾根 / 峽灣門戶',
    country: '挪威',
    lat: 60.3976,
    lng: 5.3244,
    category: 'attraction',
    description:
      '聯合國教科文組織世界文化遺產。14至16世紀漢薩同盟在挪威最重要的貿易樞紐，一排排鮮豔的山形木構房屋並列在卑爾根古老港灣邊。冬夜降臨，覆雪的弗勒伊恩山（Fløyen）為背景，暖黃路燈映照在石板街巷與倒映在冷冽水波中，充滿濃郁北歐海港風情。',
    tips: [
      '穿行於木屋之間的狹窄木棧道，可探尋工藝品小店、傳統鹿皮作坊與特色酒吧',
      '港邊露天海鮮市集可品嚐現烤挪威帝王蟹腳與煙燻鯨魚肉',
    ],
    images: [
          {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Bryggen%2C_Bergen3.JPG/1280px-Bryggen%2C_Bergen3.JPG",
                "caption": "卑爾根布呂根（Bryggen）世界文化遺產彩色木屋碼頭",
                "author": "Wikimedia Commons Photographer",
                "license": "CC BY-SA 2.5"
          },
          {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Bryggen_panorama.JPG/1280px-Bryggen_panorama.JPG",
                "caption": "漢薩同盟百年傾斜木造商行與港灣倒影",
                "author": "User:Sveter (Please credit as \"Petr Šmerkl, Wikipedia\" in ca",
                "license": "CC BY-SA 3.0"
          },
          {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Bergen_Bryggen_2986.jpg/1280px-Bergen_Bryggen_2986.jpg",
                "caption": "走進布呂根木屋群深處狹窄幽古的木板通道",
                "author": "Anna Anichkova",
                "license": "CC BY-SA 3.0"
          }
    ],
    story: "自1360年起，布呂根（意為碼頭）便是德意志「漢薩同盟」最重要的海外貿易據點，壟斷北歐鱈魚乾與穀物貿易近400年；1702年大火後完全依照中世紀原始木結構重建，被列入世界文化遺產。",
    trivia: "仔細看布呂根的彩色木屋都有些微傾斜！因為地基是數百年前埋在海泥裡的原木樁，整排房屋互相倚靠支撐才得以屹立三百年不倒！",
    mustDo: ["鑽進兩排彩色木屋之間狹窄的古老木造暗巷，尋找牆上的漢薩鱈魚乾徽章","搭乘佛洛伊恩山纜車（Fløibanen）6 分鐘登頂俯瞰卑爾根七山與峽灣夜景","在港邊魚市場（Fisketorget）品嚐現烤挪威帝王蟹腿與鮮魚湯"],
    diningRecommendation: {
      name: 'Enhjørningen (Unicorn) Fish Restaurant',
      description: '坐落於布呂根木屋深處的百年海鮮名店，保留18世紀木質船艙裝潢與傳統醃鮭魚。',
    },
    address: 'Bryggen, 5003 Bergen, Norway',
  },

  // Day 11: 特羅姆瑟
  {
    id: 'spot-d11-1',
    day: 11,
    time: '14:30',
    name: '北極大教堂',
    originalName: 'Arctic Cathedral (Ishavskatedralen)',
    city: '特羅姆瑟',
    country: '挪威',
    lat: 69.6481,
    lng: 18.9875,
    category: 'attraction',
    description:
      '建於1965年，以11片白色鋁合金三角板層疊架構而成，外型靈感取自極地冰山與冰河裂縫。東面巨大的彩色玻璃窗高達23公尺，描繪耶穌降臨的神聖光芒。夜晚燈光由內而外照亮，宛如一座指引極地船隻的發光冰晶堡壘。',
    tips: ['可從特羅姆瑟市區步行穿過跨海大橋（Tromsøbrua）前往，橋上是拍攝市容與大教堂全景的絕佳角度'],
    images: [
          {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Arctic_Cathedral.JPG/1280px-Arctic_Cathedral.JPG",
                "caption": "特羅姆瑟北極大教堂（Ishavskatedralen）11座白色三角形冰山造型外觀",
                "author": "Jma",
                "license": "CC BY-SA 4.0"
          },
          {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/NOR-2016-Troms%C3%B8-Arctic_Cathedral_%28Ishavskatedralen%29_01_front.jpg/1280px-NOR-2016-Troms%C3%B8-Arctic_Cathedral_%28Ishavskatedralen%29_01_front.jpg",
                "caption": "雪夜裡發光的北極大教堂與跨海大橋同框",
                "author": "Godot13",
                "license": "CC BY-SA 4.0"
          },
          {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Catedral_del_%C3%A1rtico%2C_Troms%C3%B8%2C_Noruega%2C_2019-09-04%2C_DD_33.jpg/1280px-Catedral_del_%C3%A1rtico%2C_Troms%C3%B8%2C_Noruega%2C_2019-09-04%2C_DD_33.jpg",
                "caption": "教堂內高達23公尺的《基督復臨》巨型彩繪玻璃馬賽克窗",
                "author": "Diego Delso",
                "license": "CC BY-SA 4.0"
          }
    ],
    story: "1965年落成的北極大教堂由建築師 Jan Inge Hovig 設計，以11片塗覆鋁板的巨型三角形混凝土結構交疊而成，象徵北極浮冰與薩米人傳統帳篷 Lavvu，被譽為挪威最偉大的現代主義教堂。",
    trivia: "東側高達23公尺、重達6噸的《基督復臨》彩繪玻璃窗，是由藝術家 Victor Sparre 以厚達3公分的法國水晶玻璃塊鑲嵌而成！",
    mustDo: ["在跨海大橋步道回望北極大教堂與背後高聳的 Tromsdalstinden 雪峰","走進教堂仰望巨型冰柱水晶吊燈與 2940 根音管的帆船造型管風琴","預約聆聽一場大教堂午夜極光燭光音樂會（Northern Lights Concert）"],
    hotelRecommendation: {
      name: 'Clarion Hotel The Edge',
      description: '特羅姆瑟水岸新地標飯店，頂樓擁有特羅姆瑟唯一的 Skybar 景觀酒吧。',
    },
    address: 'Hans Nilsens veg 41, 9020 Tromsdalen, Norway',
  },
  {
    id: 'spot-d11-2',
    day: 11,
    time: '16:30',
    name: 'Fjellheisen 登山纜車居高臨下',
    originalName: 'Fjellheisen Cable Car',
    city: '特羅姆瑟',
    country: '挪威',
    lat: 69.6417,
    lng: 18.9861,
    category: 'attraction',
    description:
      '僅需4分鐘即可將乘客送上海拔421公尺的斯托爾斯泰嫩山（Storsteinen）頂峰。從山頂景觀觀景台放眼望去，特羅姆瑟全島、彎曲的跨海大橋以及被險峻雪山環繞的峽灣水系一覽無遺。幸運的話，極光常在群山上方舞動蔓延。',
    tips: ['山頂戶外觀景台風力極大，請戴上防風護目鏡與厚羊毛圍巾', '山頂設有 Fjellstua 景觀咖啡廳，可點一杯熱巧克力配鬆餅暖身'],
    images: [
          {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Fjellheisen_starting_point.jpg/1280px-Fjellheisen_starting_point.jpg",
                "caption": "從斯托斯坦恩山（Storsteinen）纜車觀景台俯瞰特羅姆瑟峽灣與跨海大橋",
                "author": "Netha Hussain",
                "license": "CC BY-SA 4.0"
          },
          {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Fjellheisen%2C_Troms%C3%B8_2019.jpg/1280px-Fjellheisen%2C_Troms%C3%B8_2019.jpg",
                "caption": "特羅姆瑟高空雪山平台與漫天極光大爆發",
                "author": "Olivier Bruchez",
                "license": "CC BY-SA 2.0"
          },
          {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Troms%C3%B8_Cable_cars_Fjellheisen_01.jpg/1280px-Troms%C3%B8_Cable_cars_Fjellheisen_01.jpg",
                "caption": "Fjellheisen 山頂觀景台極夜璀璨萬家燈火",
                "author": "Ad Meskens You are free to use this picture for any purpose ",
                "license": "CC BY-SA 4.0"
          }
    ],
    story: "1961年由特羅姆瑟航運公司興建的 Fjellheisen 高空纜車，僅需4分鐘便能將旅人從海平面送上海拔421公尺的斯托斯坦恩山（Storsteinen）懸崖平台，將整座特羅姆瑟島、跨海大橋與周圍連綿雪峰盡收眼底。",
    trivia: "山頂纜車站外牆鑲嵌著一面巨大的北極熊金屬徽章，這是所有抵達北極圈69度旅人必拍的極地認證標誌！",
    mustDo: ["攜帶腳架在山頂觀景台拍攝「翡翠極光 + 特羅姆瑟跨海大橋 + 峽灣燈火」同框神作","在山頂 Fjellstua 景觀餐廳一面喝熱騰騰的馴鹿肉湯一面守候極光","勇敢走到戶外懸崖延伸步道感受北極圈高空凜冽卻純淨的夜風"],
    address: 'Sollivegen 12, 9020 Tromsdalen, Norway',
  },
  {
    id: 'spot-d11-3',
    day: 11,
    time: '20:00',
    name: '極光雙體船峽灣無聲夜巡',
    originalName: 'Silent Aurora Fjord Cruise (Brim Explorer)',
    city: '特羅姆瑟',
    country: '挪威',
    lat: 69.6496,
    lng: 18.957,
    category: 'activity',
    description:
      '登上先進的混合動力雙體遊船 Brim Explorer。當遊船駛離特羅姆瑟港口後切換至全電動推進模式，在水面悄然無聲前行，沒有引擎震動與噪音。船艙內擁有全景溫暖玻璃沙龍，甲板寬廣，在零光害的挪威深邃峽灣上仰望綠色極光曼舞。',
    tips: ['船上提供熱魚湯、點心與專業的極光攝影教學建議'],
    images: [
          {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Tromso_banner_Aurora_Borealis.jpg/1280px-Tromso_banner_Aurora_Borealis.jpg",
                "caption": "特羅姆瑟峽灣翡翠綠與紫紅極光大爆發實景",
                "author": "Arctic light - Frank Olsen",
                "license": "CC BY-SA 3.0"
          },
          {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Aurora_Borealis_Troms%C3%B8_Norway.jpg/1280px-Aurora_Borealis_Troms%C3%B8_Norway.jpg",
                "caption": "極光雙體船無聲航行於挪威北極峽灣雪山間",
                "author": "Andi Gentsch",
                "license": "CC BY-SA 2.0"
          },
          {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Northern_Lights_-_Aurora_Borealis_Ringvass%C3%B8ya_Troms%C3%B8_Norway.jpg/1280px-Northern_Lights_-_Aurora_Borealis_Ringvass%C3%B8ya_Troms%C3%B8_Norway.jpg",
                "caption": "極夜峽灣水面映照歐若拉光帶雙重倒影",
                "author": "Svein-Magne Tunli - tunliweb.no",
                "license": "CC BY-SA 4.0"
          }
    ],
    story: "特羅姆瑟正好位於地球「極光橢圓帶（Auroral Oval）」正中央；搭乘電力混合無聲雙體船駛離城市光害進入漆黑峽灣，能同時欣賞天空極光與海面極光倒影的雙重奇景。",
    trivia: "肉眼看到的微弱極光常呈灰白色，但當太陽風暴（KP值≥4）撞擊高空100公里處的氧原子時，肉眼就能直接看見翠綠甚至紫紅色的劇烈舞動！",
    mustDo: ["在雙體船全景加熱客艙與 360 度頂層甲板交替守候極光冕爆發","學習設定相機或手機夜間長曝光（快門 3-6 秒）拍下峽灣極光人像","在船上品嚐挪威傳統現烤心形鬆餅（Vafler）配棕色山羊起司（Brunost）"],
    diningRecommendation: {
      name: 'Fiskekompaniet',
      description: '特羅姆瑟海港邊的頂尖海鮮餐廳，每日現捕的帝王蟹、北極鱈魚與挪威海螯蝦極致鮮甜。',
    },
    address: 'Kaigata 6, 9008 Tromsø, Norway',
  },

  // Day 12: 冰島 藍湖
  {
    id: 'spot-d12-1',
    day: 12,
    time: '15:30',
    name: '藍湖溫泉仙境與 The Retreat 水療',
    originalName: 'Blue Lagoon & The Retreat Lagoon',
    city: '格林達維克',
    country: '冰島',
    lat: 63.8804,
    lng: -22.4495,
    category: 'hotel',
    description:
      '世界二十五大奇蹟之一。這片坐落於黑色火山苔原中的地熱潟湖，水溫長年維持在38至40°C。湖水富含高濃度的天然二氧化矽（Silica）、硫磺與多種活性礦物質，在陽光折射下呈現超現實的夢幻牛奶藍。敷上天然白矽泥面膜，浸泡在熱騰騰的泉水中，四周蒸騰霧氣裊裊，宛如置身外星球仙境。',
    tips: [
      '泉水中的二氧化矽會使頭髮乾澀，入水前請塗抹厚厚一層護髮乳並將頭髮盤起',
      '水中有水中酒吧，可直接使用防水手環感應兌換冰島啤酒或藍莓果昔',
    ],
    images: [
          {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Refleksjoner.jpg/1280px-Refleksjoner.jpg",
                "caption": "冰島藍湖溫泉（Blue Lagoon）乳藍色地熱泉水與黑色火山熔岩",
                "author": "Karin Beate Nøsterud",
                "license": "CC BY 2.5 dk"
          },
          {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/17-08-04-Blaue-Lagune-RalfR-DSC_2422.jpg/1280px-17-08-04-Blaue-Lagune-RalfR-DSC_2422.jpg",
                "caption": "浸泡在 38°C 富含白矽泥與礦物質的夢幻地熱潟湖中",
                "author": "Ralf Roletschek",
                "license": "GFDL 1.2"
          },
          {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/17-08-04-Blaue-Lagune-RalfR-DSC_2442.jpg/1280px-17-08-04-Blaue-Lagune-RalfR-DSC_2442.jpg",
                "caption": "藍湖 The Retreat 奢華火山熔岩水療與水吧",
                "author": "Ralf Roletschek",
                "license": "GFDL 1.2"
          }
    ],
    story: "藍湖並非天然形成，而是1976年鄰近的 Svartsengi 地熱發電廠將地下2,000公尺深處富含礦物質的熱海水排入周圍800年前形成的黑色熔岩原，於1981年被當地居民發現具有神奇護膚療效而成為世界奇景。",
    trivia: "泉水之所以呈現夢幻的蒂芬妮乳藍色，是因為水中豐富的「二氧化矽（Silica）」顆粒在陽光下只折射藍色光波，水本身其實是透明白色的！",
    mustDo: ["到湖中央的原木矽泥吧（Silica Mud Bar）挖取天然白矽泥敷滿全臉拍照","憑手環在池中水吧點一杯冰島 Gull 啤酒或野莓果昔邊泡湯邊暢飲","下水前務必在頭髮抹滿大量「免沖洗護髮素」防止高濃度矽質讓頭髮打結"],
    hotelRecommendation: {
      name: 'The Retreat at Blue Lagoon Iceland',
      description: '冰島奢華飯店的天花板，客房直通私人專屬火山熔岩地熱潟湖，私密性極致奢華。',
    },
    diningRecommendation: {
      name: 'Moss Restaurant',
      description: '藍湖內榮獲米其林一星肯定的頂級餐廳，坐擁火山熔岩景觀，七道式冰島當季野味珍饈。',
    },
    address: 'Norðurljósavegur 9, 240 Grindavík, Iceland',
  },

  // Day 13: 跨年夜 冰島金圈與雷克雅維克
  {
    id: 'spot-d13-1',
    day: 13,
    time: '09:30',
    name: '辛格韋德利國家公園',
    originalName: 'Thingvellir National Park (Þingvellir)',
    city: '金圈',
    country: '冰島',
    lat: 64.2559,
    lng: -21.1295,
    category: 'nature',
    description:
      '聯合國教科文組織世界遺產。這裡是歐亞板塊與北美洲板塊相互拉扯撕裂所形成的大裂谷，行走其間便是在兩大洲板塊的裂隙中穿行。西元930年世界上最早的露天議會亦在此誕生。冬季覆蓋著冰雪的阿爾曼納峽谷（Almannagjá）磅礴壯麗。',
    tips: ['Silfra 裂縫湖水清澈度達100公尺，是全球乾式防寒衣潛水聖地'],
    images: [
          {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Roca_de_la_Ley%2C_Parque_Nacional_de_%C3%9Eingvellir%2C_Su%C3%B0urland%2C_Islandia%2C_2014-08-16%2C_DD_017.JPG/1280px-Roca_de_la_Ley%2C_Parque_Nacional_de_%C3%9Eingvellir%2C_Su%C3%B0urland%2C_Islandia%2C_2014-08-16%2C_DD_017.JPG",
                "caption": "辛格韋德利國家公園（Þingvellir）歐亞板塊與北美板塊大裂谷雪景",
                "author": "Diego Delso",
                "license": "CC BY-SA 4.0"
          },
          {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Roca_de_la_Ley%2C_Parque_Nacional_de_%C3%9Eingvellir%2C_Su%C3%B0urland%2C_Islandia%2C_2014-08-16%2C_DD_022.JPG/1280px-Roca_de_la_Ley%2C_Parque_Nacional_de_%C3%9Eingvellir%2C_Su%C3%B0urland%2C_Islandia%2C_2014-08-16%2C_DD_022.JPG",
                "caption": "西元 930 年世界最古老民主議會 Alþingi 遺址與法律岩",
                "author": "Diego Delso",
                "license": "CC BY-SA 4.0"
          },
          {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/%C3%96xar%C3%A1rfoss%2C_Parque_Nacional_de_%C3%9Eingvellir%2C_Su%C3%B0urland%2C_Islandia%2C_2014-08-16%2C_DD_029.JPG/1280px-%C3%96xar%C3%A1rfoss%2C_Parque_Nacional_de_%C3%9Eingvellir%2C_Su%C3%B0urland%2C_Islandia%2C_2014-08-16%2C_DD_029.JPG",
                "caption": "清澈見底的絲浮拉裂縫（Silfra）與白雪覆蓋的火山苔原",
                "author": "Diego Delso",
                "license": "CC BY-SA 4.0"
          }
    ],
    story: "西元930年，冰島全境的維京氏族首領齊聚於此創立了世界上最古老的民主議會「阿爾庭（Alþingi）」，法律宣講人站在火山裂谷石壁前背誦法律，開啟了人類千年議會民主史。",
    trivia: "這裡是地球上極少數能在陸地上直接行走於「北美板塊」與「歐亞板塊」交界處的地方，兩大板塊每年仍以 2 公分的速度持續撕裂分離！",
    mustDo: ["漫步在兩大洲大陸板塊撕裂而成的 Almannagjá 火山玄武岩大裂谷步道","站在觀景台俯瞰能見度超過 100 公尺、灌滿朗格冰川融水的絲浮拉裂縫（Silfra）","在法律岩（Lögberg）旗桿下感受冰島於 1944 年正式宣布獨立建國的歷史現場"],
    address: 'Thingvellir, 801 Selfoss, Iceland',
  },
  {
    id: 'spot-d13-2',
    day: 13,
    time: '11:45',
    name: 'Strokkur 史托克間歇泉',
    originalName: 'Strokkur Geysir',
    city: '豪卡道魯爾',
    country: '冰島',
    lat: 64.3104,
    lng: -20.3024,
    category: 'nature',
    description:
      '全冰島最活躍的熱泉奇觀。每隔5至8分鐘便會猛烈噴發一次。噴發前泉口的水面會如同一顆巨大透明的藍色水泡般鼓起，隨後「砰」的一聲巨響，滾燙的沸水直衝天際高達20至30公尺，伴隨漫天白茫茫蒸氣，大自然的地心力量令人肅然起敬。',
    tips: ['拍攝時請站在上風處，避免滾燙的硫磺水氣與霧氣吹向相機與身上'],
    images: [
          {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Strokkur_geyser_eruption%2C_close-up_view.jpg/1280px-Strokkur_geyser_eruption%2C_close-up_view.jpg",
                "caption": "蓋歇爾地熱區史托克間歇泉（Strokkur）衝天噴發高達30公尺瞬間",
                "author": "Andreas Tille",
                "license": "CC BY-SA 3.0"
          },
          {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Strokkur%2C_%C3%81rea_geot%C3%A9rmica_de_Geysir%2C_Su%C3%B0urland%2C_Islandia%2C_2014-08-16%2C_DD_083.JPG/1280px-Strokkur%2C_%C3%81rea_geot%C3%A9rmica_de_Geysir%2C_Su%C3%B0urland%2C_Islandia%2C_2014-08-16%2C_DD_083.JPG",
                "caption": "間歇泉噴發前一秒形成的絕美蒂芬妮藍沸水圓拱氣泡",
                "author": "Diego Delso",
                "license": "CC BY-SA 4.0"
          },
          {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Strokkur%2C_%C3%81rea_geot%C3%A9rmica_de_Geysir%2C_Su%C3%B0urland%2C_Islandia%2C_2014-08-16%2C_DD_084.JPG/1280px-Strokkur%2C_%C3%81rea_geot%C3%A9rmica_de_Geysir%2C_Su%C3%B0urland%2C_Islandia%2C_2014-08-16%2C_DD_084.JPG",
                "caption": "白雪皚皚的地熱谷中冒著滾燙白色蒸氣的沸騰溫泉孔",
                "author": "Diego Delso",
                "license": "CC BY-SA 4.0"
          }
    ],
    story: "英語中「間歇泉（Geyser）」一詞正是源自此處的大蓋歇爾泉（Geysir，冰島語意為狂暴噴湧）！旁邊活躍的史托克間歇泉（Strokkur）每隔 5 至 8 分鐘便會轟然將沸水噴向 20 至 35 公尺高空。",
    trivia: "要拍到最震撼的照片，秘訣是盯緊泉眼中央：當沸水瞬間隆起成一顆巨大的「土耳其藍水晶球氣泡」時按下連拍，下一秒就是衝天水柱！",
    mustDo: ["站在上風處開啟手機高速連拍，捕捉間歇泉隆起藍色水泡並炸裂衝天的瞬間","觀察地熱步道旁呈現藍綠與赭紅色的 Blesi 雙色雙生溫泉池","在遊客中心品嚐用地下 100°C 地熱蒸氣埋土慢烤 24 小時的冰島黑麥火山麵包（Rúgbrauð）"],
    address: 'Haukadalur, 806 Selfoss, Iceland',
  },
  {
    id: 'spot-d13-3',
    day: 13,
    time: '13:15',
    name: '古佛斯黃金瀑布',
    originalName: 'Gullfoss Waterfall',
    city: '金圈',
    country: '冰島',
    lat: 64.3271,
    lng: -20.1199,
    category: 'nature',
    description:
      '冰島最壯觀的雙層階梯式巨型瀑布。源自朗格冰川（Langjökull）的白河（Hvítá）水流奔騰洶湧，分兩段階梯傾瀉入深達32公尺的峽谷中。深冬時分，瀑布兩側岩壁凝結成千萬根晶瑩剔透的藍色巨大冰柱，瀑布水霧隨風飄揚在冰面上閃耀金光。',
    tips: ['通往瀑布下方的木棧道冬季結冰時會封閉，請務必留在設有安全護欄的上層觀景台'],
    images: [
          {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Gullfoss%2C_Su%C3%B0urland%2C_Islandia%2C_2014-08-16%2C_DD_119.JPG/1280px-Gullfoss%2C_Su%C3%B0urland%2C_Islandia%2C_2014-08-16%2C_DD_119.JPG",
                "caption": "冰島古佛斯黃金瀑布（Gullfoss）雙層斷層巨瀑與冬季冰封奇景",
                "author": "Diego Delso",
                "license": "CC BY-SA 4.0"
          },
          {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Iceland_-_2017-02-22_-_Gullfoss_-_3684.jpg/1280px-Iceland_-_2017-02-22_-_Gullfoss_-_3684.jpg",
                "caption": "Hvítá 白河冰川融水以萬馬奔騰之勢跌入32公尺深峽谷",
                "author": "Pierre-Selim Huard",
                "license": "CC BY 4.0"
          },
          {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Gullfoss%2C_Iceland%2C_20230501_0945_3798.jpg/1280px-Gullfoss%2C_Iceland%2C_20230501_0945_3798.jpg",
                "caption": "冬日陽光下橫跨黃金瀑布水霧的璀璨彩虹",
                "author": "Jakub Hałun",
                "license": "CC BY-SA 4.0"
          }
    ],
    story: "20世紀初外國財團曾企圖租下黃金瀑布興建水力發電廠，當時農場主人的女兒 Sigríður Tómasdóttir 徒步百公里前往雷克雅維克抗爭，甚至以投瀑相諫，最終成功保住這座自然奇景，她也成為冰島第一位環保英雄。",
    trivia: "瀑布分為上下兩層（11公尺與21公尺）並呈 90 度垂直轉折直接跌入深達 70 公尺的狹窄火山斷層峽谷，遠看宛如河水突然消失在大地裂縫中！",
    mustDo: ["站在上層觀景台俯瞰結滿巨大冰柱的雙層瀑布與峽谷激流","尋找瀑布旁紀念環保女英雄 Sigríður Tómasdóttir 的石碑浮雕","在黃金瀑布景觀餐廳必喝一碗料多濃郁、可免費續湯的「冰島傳統羊肉蔬菜湯（Kjötsúpa）」"],
    address: 'Gullfoss, 801 Selfoss, Iceland',
  },
  {
    id: 'spot-d13-4',
    day: 13,
    time: '16:30',
    name: '哈爾格林姆教堂',
    originalName: 'Hallgrímskirkja',
    city: '雷克雅維克',
    country: '冰島',
    lat: 64.1417,
    lng: -21.9266,
    category: 'attraction',
    description:
      '雷克雅維克最著名的精神地標。建築師居德永·薩繆埃爾松（Guðjón Samúelsson）汲取冰島特有的六角玄武岩柱熔岩地形為靈感，歷時41年建造完成。塔高74.5公尺，搭乘電梯至鐘樓頂部可俯瞰雷克雅維克市區五彩斑斕的小鐵皮屋頂與遠方雪山。',
    tips: ['教堂正前方立有發現美洲新大陸的維京英雄萊夫·埃里克松（Leif Erikson）雕像'],
    images: [
          {
                "url": "https://upload.wikimedia.org/wikipedia/commons/d/da/Hallgr%C3%ADmskirkja.jpeg",
                "caption": "雷克雅維克地標哈爾格林姆大教堂（Hallgrímskirkja）74.5公尺玄武岩柱外觀",
                "author": "Andreas Tille",
                "license": "CC BY-SA 4.0"
          },
          {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Leifur_Eir%C3%ADksson_and_Hallgr%C3%ADmskirkja_%2814527191932%29.jpg/1280px-Leifur_Eir%C3%ADksson_and_Hallgr%C3%ADmskirkja_%2814527191932%29.jpg",
                "caption": "教堂前探險家萊夫·埃里克松（Leif Erikson）銅像與冬雪",
                "author": "Mitchel Jones from California, USA",
                "license": "CC BY-SA 2.0"
          },
          {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Hallgr%C3%ADmskirkja_1.jpg/1280px-Hallgr%C3%ADmskirkja_1.jpg",
                "caption": "從大教堂鐘樓頂端俯瞰雷克雅維克彩色鐵皮屋頂與大西洋海灣",
                "author": "Dmitry Brant",
                "license": "CC BY-SA 4.0"
          }
    ],
    story: "由冰島國家建築師 Guðjón Samúelsson 於1937年設計、耗時41年才於1986年完工；外觀靈感源自冰島火山熔岩冷卻凝固成的六角形玄武岩柱（如黑沙灘與斯瓦蒂瀑布），並以17世紀冰島聖詩詩人 Hallgrímur Pétursson 命名。",
    trivia: "教堂前方的維京探險家萊夫·埃里克松雕像，是1930年美國為慶祝冰島議會（Alþingi）成立一千年所贈送，因為他比哥倫布早 500 年就踏上了北美大陸！",
    mustDo: ["搭乘電梯登上 74.5 公尺高的鐘樓觀景台，拍下舉世聞名的雷克雅維克彩色屋頂全景","走進教堂內仰望高達 15 公尺、重 25 噸、擁有 5,275 根音管的德國巨型管風琴","從教堂正前方的彩虹街（Skólavörðustígur）一路漫步拍回教堂正立面"],
    address: 'Hallgrímstorg 1, 101 Reykjavík, Iceland',
  },
  {
    id: 'spot-d13-5',
    day: 13,
    time: '23:00',
    name: '雷克雅維克跨年夜壯觀萬家煙火',
    originalName: "Reykjavik New Year's Eve Fireworks",
    city: '雷克雅維克',
    country: '冰島',
    lat: 64.1504,
    lng: -21.9327,
    category: 'activity',
    description:
      '世界上最震撼狂歡的跨年夜！在冰島，跨年煙火不是官方統一施放，而是全雷克雅維克二十萬居民為了支持冰島志願搜救隊（ICE-SAR），家家戶戶自發購買數百公噸專業煙火！從晚間十一點開始，全城360度各個角落同時升空數以萬計的璀璨煙火，雷克雅維克夜空被照亮得宛如白晝，歡呼聲與香檳氣泡在空氣中沸騰！',
    tips: [
      '最佳觀賞點：哈爾格林姆教堂前廣場、Perlan 珍珠樓頂部平台，或海濱 Harpa 音樂廳戶外廣場',
      '請務必配戴護目鏡，並注意防風保暖！',
    ],
    images: [
          {
                "url": "https://upload.wikimedia.org/wikipedia/commons/2/26/NewYearFireworks-Reykjavik.jpg",
                "caption": "雷克雅維克跨年夜哈爾格林姆大教堂前萬人自發煙火齊放",
                "author": "Börkur Sigurbjörnsson from Barcelona",
                "license": "CC BY 2.0"
          },
          {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/ReykjavikNewYr.jpg/1280px-ReykjavikNewYr.jpg",
                "caption": "360 度環繞全城天際線的冰島跨年璀璨煙火海",
                "author": "Fancy-cats-are-happy-cats",
                "license": "Public domain"
          },
          {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Entertainment_%286079919222%29.jpg/1280px-Entertainment_%286079919222%29.jpg",
                "caption": "冰島跨年傳統社區大型篝火晚會（Áramótabrenna）",
                "author": "Helgi Halldórsson from Reykjavík, Iceland",
                "license": "CC BY-SA 2.0"
          }
    ],
    story: "冰島沒有官方跨年煙火秀，但全雷克雅維克 20 多萬市民會在跨年夜當晚全員出動，在自家門口與哈爾格林姆教堂廣場同時點燃超過 500 噸煙火，造就地球上最狂熱的 360 度全民煙火奇觀！",
    trivia: "冰島人買煙火其實是在做公益！全冰島的跨年煙火皆由「冰島搜救隊（ICE-SAR）」獨家專賣，市民狂買煙火正是為了資助這群全年無償拯救旅人的極地英雄！",
    mustDo: ["傍晚先參加當地社區的跨年巨型篝火晚會（Áramótabrenna），與冰島人一起唱歌燒走舊年厄運","23:30 前抵達哈爾格林姆大教堂廣場，戴上護目鏡沉浸在 360 度無死角震撼煙火雨中","午夜 00:00 敲響時開啟香檳，與身旁來自世界各地的旅人擁抱高喊「Gleðilegt nýtt ár!（新年快樂）」"],
    hotelRecommendation: {
      name: 'The Reykjavik EDITION',
      description: '萬豪集團在冰島打造的第一間五星級潮奢品牌，緊鄰海港與 Harpa 音樂廳。',
    },
    diningRecommendation: {
      name: 'Tides Restaurant (The Reykjavik EDITION)',
      description: '米其林星級主廚 Gunnar Karl Gíslason 主理的現代冰島海鮮料理。',
    },
    address: 'Austurbakki 2, 101 Reykjavík, Iceland',
  },

  // Day 14: 元旦 冰島
  {
    id: 'spot-d14-1',
    day: 14,
    time: '11:00',
    name: '藍湖岩洞 Spa 水療療程',
    originalName: 'The Retreat Spa Lava Cove Experience',
    city: '格林達維克',
    country: '冰島',
    lat: 63.881,
    lng: -22.451,
    category: 'activity',
    description:
      '在深邃的熔岩岩洞 Spa 空間中迎接新年首日。體驗 Retreat Ritual 三部曲：以天然火山礦物鹽為全身去角質、塗抹白矽泥深層淨化肌膚，最後敷上富含微藻精華的活膚油。隨後漂浮在私人溫熱地熱潟湖中，讓身心靈在純淨火山能量中重獲新生。',
    tips: ['水療包含奢華休息室，提供壁爐、懸吊式鳥巢吊床與草本熱茶'],
    images: [
          {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Blue_Lagoon_Bath.jpg/1280px-Blue_Lagoon_Bath.jpg",
                "caption": "冰島海濱地熱溫泉無邊際潟湖直面北大西洋海浪",
                "author": "Sindre Jacobsen",
                "license": "CC BY 2.0"
          },
          {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Refleksjoner.jpg/1280px-Refleksjoner.jpg",
                "caption": "嵌入黑色玄武岩崖壁的草皮屋（Turf House）傳統桑拿",
                "author": "Karin Beate Nøsterud",
                "license": "CC BY 2.5 dk"
          },
          {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/The_Blue_Lagoon_%284047477768%29.jpg/1280px-The_Blue_Lagoon_%284047477768%29.jpg",
                "caption": "夕陽與極光映照下的冰島海景地熱水療",
                "author": "allen watkin from London, UK",
                "license": "CC BY-SA 2.0"
          }
    ],
    story: "冰島人世代以地熱溫泉作為社交與療癒的核心場所（Sundlaugar）；結合古老冰島草皮屋建築與現代無邊際海景潟湖的水療儀式，讓旅人在北大西洋驚濤與溫暖泉水間獲得身心重生。",
    trivia: "冰島傳統水療必體驗「七步儀式（The Ritual）」：從溫水池、冷水池、全景景觀桑拿、冰霧空間、海鹽磨砂到蒸氣浴，最後以冰島烏鴉莓飲品收尾！",
    mustDo: ["趴在 75 公尺長的無邊際溫泉池邊緣，眺望北大西洋與遠方總統官邸半島","走進擁有整面巨型無框海景落地窗的懸崖桑拿房欣賞海浪拍岸","體驗富含礦物質的火山海鹽全身去角質磨砂療程"],
    address: 'Norðurljósavegur 9, 240 Grindavík, Iceland',
  },
  {
    id: 'spot-d14-2',
    day: 14,
    time: '15:30',
    name: 'Harpa 音樂廳與彩虹街',
    originalName: 'Harpa Concert Hall & Rainbow Street',
    city: '雷克雅維克',
    country: '冰島',
    lat: 64.1504,
    lng: -21.9327,
    category: 'attraction',
    description:
      'Harpa 音樂廳由著名藝術家 Olafur Eliasson 與 Henning Larsen 建築團隊聯手打造。幾何鋼結構鑲嵌著數千片多角形著色玻璃磚，白天吸收北大西洋的自然光線，入夜後玻璃內部 LED 隨音樂節奏折射出極光色調。隨後漫步至市中心地面漆有六色彩虹的 Rainbow Street，採購北歐保暖毛衣。',
    tips: ['走入 Harpa 內部中庭仰望幾何天井，是拍攝建築幾何張力構圖的最佳點'],
    images: [
          {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Harpa_harpa_01.jpg/1280px-Harpa_harpa_01.jpg",
                "caption": "雷克雅維克哈帕音樂廳（Harpa）靈感源自玄武岩的立體幾何玻璃帷幕",
                "author": "H. Zell",
                "license": "CC BY-SA 3.0"
          },
          {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Harpa_davidis_01.JPG/1280px-Harpa_davidis_01.JPG",
                "caption": "丹麥冰島藝術家 Olafur Eliasson 設計的萬花筒蜂巢玻璃磚內景",
                "author": "H. Zell",
                "license": "CC BY-SA 3.0"
          },
          {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/View_of_Reykjavik_with_Harpa_from_ferry_to_Vi%C3%B0ey_island_1.jpg/1280px-View_of_Reykjavik_with_Harpa_from_ferry_to_Vi%C3%B0ey_island_1.jpg",
                "caption": "雷克雅維克彩虹街（Skólavörðustígur）與北歐文創街區",
                "author": "Slawojar",
                "license": "CC BY-SA 4.0"
          }
    ],
    story: "2008年冰島金融海嘯爆發時一度停工，但冰島政府決定傾力續建，作為國民重振信心的象徵，並於2011年落成、榮獲歐盟密斯·凡·德羅當代建築首獎。",
    trivia: "外牆由超過 1,000 個被稱為「準磚（Quasi-bricks）」的十二面體立體鋼構玻璃組成，內含雙色玻璃，隨太陽角度與海浪反光變幻出極光般的色彩！",
    mustDo: ["走進音樂廳大廳站在巨型蜂巢玄武岩玻璃窗下拍攝奇幻光影人像","造訪 1937 年開業的「Bæjarins Beztu Pylsur」品嚐全冰島最著名的脆炸洋蔥羊肉熱狗","在彩虹街挑選一件冰島奶奶親手編織的傳統防水純羊毛毛衣（Lopapeysa）"],
    address: 'Austurbakki 2, 101 Reykjavík, Iceland',
  },
  {
    id: 'spot-d14-3',
    day: 14,
    time: '21:00',
    name: '冰島北大西洋極光跨年謝幕',
    originalName: 'Grand Finale Aurora Borealis by the Atlantic',
    city: '雷克雅維克近郊',
    country: '冰島',
    lat: 64.162,
    lng: -21.97,
    category: 'nature',
    description:
      '在元旦這天晚間，乘專車前往雷克雅維克西側的格羅塔燈塔（Grótta Lighthouse）或火山海岸。遠離市中心燈火，北大西洋海浪拍打玄武岩岸，夜空中舞動著旅程最後一次歐若拉極光綠芒，為整整十五天的北歐跨年奇遇譜下最浪漫莊嚴的終章。',
    tips: ['元旦夜極光出現時，大家會一起開香檳舉杯慶祝新年的到來'],
    images: [
          {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Grotta_2.jpg/1280px-Grotta_2.jpg",
                "caption": "雷克雅維克格羅塔燈塔（Grótta）北大西洋海岸極光謝幕實景",
                "author": "Christian Bickel",
                "license": "CC BY-SA 2.0 de"
          },
          {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Lighthouse_Gr%C3%B3tta_in_Iceland_-_panoramio.jpg/1280px-Lighthouse_Gr%C3%B3tta_in_Iceland_-_panoramio.jpg",
                "caption": "太陽航海者（Sólfarið）維京船骨雕塑與法赫薩灣雪山",
                "author": "Jon Gretarsson",
                "license": "CC BY-SA 3.0"
          },
          {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Gr%C3%B3tta_Lighthouse_after_Midnight_%2843688981881%29.jpg/1280px-Gr%C3%B3tta_Lighthouse_after_Midnight_%2843688981881%29.jpg",
                "caption": "在海濱地熱暖腳池（Kvika Footbath）邊泡腳邊仰望極光",
                "author": "Simaron from Lower Saxony, Germany",
                "license": "CC BY-SA 2.0"
          }
    ],
    story: "位於雷克雅維克最西端 Seltjarnarnes 半島尖端的格羅塔燈塔（Grótta）建於1897年，三面環繞北大西洋，是首都圈內光害最少、最受當地人喜愛的極光秘境。",
    trivia: "燈塔旁的岩石海岸藏著一口由藝術家 Ólöf Nordal 鑿出的迷你天然地熱溫泉池「Kvika」，旅人可以免費脫鞋泡著 39°C 溫泉水看極光！",
    mustDo: ["退潮時沿著鵝卵石沙洲走到純白格羅塔燈塔下拍攝極光倒影","找到海邊岩石上的「Kvika 天然地熱泡腳池」泡腳吹海風看星空","在太陽航海者（Sólfarið）不鏽鋼船骨雕塑前向北歐極光女神道別"],
    address: 'Seltjarnarnes Peninsula, Iceland',
  },

  // Day 15: 返程
  {
    id: 'spot-d15-1',
    day: 15,
    time: '11:00',
    name: '凱夫拉維克國際機場伴手禮與返程',
    originalName: 'Keflavík International Airport (KEF)',
    city: '凱夫拉維克',
    country: '冰島',
    lat: 63.985,
    lng: -22.6056,
    category: 'transport',
    description:
      '前往凱夫拉維克機場搭乘返程航班。免稅區匯聚了冰島國寶級戶外品牌 66°NORTH 保暖衣物、Omnom 手工巧克力、火山黑鹽以及藍湖頂級矽泥護膚品。帶著相機裡數千張珍貴的雪景、馴鹿、玻璃屋與極光影像，啟程返回溫暖家園。',
    tips: [
      '冰島退稅非常便利，在商店取得退稅單後可於機場專櫃或自助機台掃描辦理',
      '免稅店的 Omnom 聖誕限量版熱香料巧克力是最佳伴手禮',
    ],
    images: [
          {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/2006-05-27-082806_Iceland_Keflav%C3%ADk.jpg/1280px-2006-05-27-082806_Iceland_Keflav%C3%ADk.jpg",
                "caption": "冰島凱夫拉維克國際機場（KEF）極地玄武岩與木質航廈",
                "author": "Hansueli Krapf",
                "license": "CC BY-SA 3.0"
          },
          {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Keflavik_Airport_waiting_room.JPG/1280px-Keflavik_Airport_waiting_room.JPG",
                "caption": "機場門前的巨型「海雀破蛋（Jet Nest）」不鏽鋼地標雕塑",
                "author": "OhanaUnitedTalk page",
                "license": "CC BY-SA 3.0"
          },
          {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/SSJ100_Keflavik_runways_%285160518757%29.jpg/1280px-SSJ100_Keflavik_runways_%285160518757%29.jpg",
                "caption": "從機艙舷窗俯瞰冰島火山冰川與北大西洋壯麗航路",
                "author": "SuperJet International",
                "license": "CC BY-SA 2.0"
          }
    ],
    story: "二戰期間由美軍興建於雷克雅尼斯半島黑色熔岩原上的凱夫拉維克機場，是連接北美與歐洲的北大西洋航空樞紐，航廈外矗立著藝術家 Magnús Tómasson 創作的巨型鋼雕《Jet Nest》，象徵飛向天際的夢想。",
    trivia: "冰島凱夫拉維克機場免稅店因為免除高達 24% 的冰島加值稅，買 Blue Lagoon 藍湖白矽泥面膜與冰島火山鹽比在市區購買還要便宜將近三成！",
    mustDo: ["在退稅櫃檯辦妥冰島購物退稅後，於免稅店掃貨 Blue Lagoon 矽泥面膜與 Omnom 冰島手工巧克力","登機選擇靠窗座位，起飛時俯瞰雷克雅尼斯半島冒煙的地熱火山原與大西洋海岸線","整理 15 天橫跨北歐五國的極光、聖誕與跨年相簿，帶著滿滿感動返航"],
    address: 'Keflavíkurflugvöllur, 235 Keflavík, Iceland',
  },
];
