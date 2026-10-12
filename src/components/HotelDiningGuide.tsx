import React, { useState } from 'react';
import { Bed, UtensilsCrossed, MapPin, Star, ExternalLink, Sparkles, Filter } from 'lucide-react';

interface HotelItem {
  id: string;
  name: string;
  originalName: string;
  city: string;
  country: string;
  flag: string;
  stars: number;
  highlight: string;
  description: string;
  address: string;
  imageUrl: string;
  images?: string[];
  story?: string;
  trivia?: string;
  mustDo?: string[];
  dayOccurrences: number[];
}

interface DiningItem {
  id: string;
  name: string;
  originalName: string;
  city: string;
  country: string;
  flag: string;
  type: string;
  highlight: string;
  signatureDish: string;
  description: string;
  address: string;
  imageUrl: string;
  images?: string[];
  story?: string;
  trivia?: string;
  mustDo?: string[];
  dayOccurrences: number[];
}

export const LUXURY_HOTELS: HotelItem[] = [
  {
    id: 'h-dangleterre',
    name: "Hotel d'Angleterre 英國飯店",
    originalName: "Hotel d'Angleterre Copenhagen",
    city: '哥本哈根',
    country: '丹麥',
    flag: '🇩🇰',
    stars: 5,
    highlight: '二百年傳奇皇家五星 · 全城最震撼聖誕童話外牆燈飾',
    description:
      '建於1755年，為全球歷史最悠久的奢華飯店之一。每年聖誕節外牆皆會由丹麥頂級設計師打造整棟建築的巨幅主題燈海童話，是全哥本哈根市民與旅人競相朝聖的年度盛景。內部設有米其林一星 Marchal 餐廳與奢華水療中心。',
    address: 'Kongens Nytorv 34, 1050 København, Denmark',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/29/Hotel-d-angleterre-2004.jpg',
    images: ["https://upload.wikimedia.org/wikipedia/commons/2/29/Hotel-d-angleterre-2004.jpg","https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Hotel_dAngleterre_-_the_grand_olde_lady_of_Copenhagen_hotels_%282511026670%29.jpg/1280px-Hotel_dAngleterre_-_the_grand_olde_lady_of_Copenhagen_hotels_%282511026670%29.jpg","https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Kopenhagen_Hotel_%27D%27Angleterre_Mai_2009_PD_063.jpg/1280px-Kopenhagen_Hotel_%27D%27Angleterre_Mai_2009_PD_063.jpg","https://upload.wikimedia.org/wikipedia/commons/4/48/Franz_Sediv%C3%BD_-_Hotel_d-Angleterre.jpg"],
    story: "創立於1755年，源於法國青年廚師 Jean Marchal 與皇家花匠女兒 Maria 的浪漫愛情故事，兩百多年來接待過安徒生、邱吉爾與歐洲王室，是丹麥歷史最悠久的傳奇白宮酒店。",
    trivia: "每年11月中旬酒店外牆點亮耗時半年設計的聖誕主題燈海，被哥本哈根市民公認為「丹麥聖誕節正式揭幕」的象徵！",
    mustDo: ["在酒店正門胡桃鉗衛兵與巨型聖誕花環前合影","於 Balthazar 香檳吧小酌一杯皇室特調香檳","在米其林一星 Marchal 餐廳享用經典丹麥龍蝦早餐"],
    dayOccurrences: [1, 2],
  },
  {
    id: 'h-grand-hotel',
    name: 'Grand Hôtel Stockholm 斯德哥爾摩大飯店',
    originalName: 'Grand Hôtel Stockholm',
    city: '斯德哥爾摩',
    country: '瑞典',
    flag: '🇸🇪',
    stars: 5,
    highlight: '瑞典國寶級飯店 · 直面王宮水岸 · 歷屆諾貝爾獎得主下榻首選',
    description:
      '自1874年開幕以來，始終是瑞典乃至斯堪地那維亞尊榮的代表。面向斯德哥爾摩王宮與水岸，每年的諾貝爾獎得主及隨行家屬皆固定下榻於此。附設著名的 Cadier Bar 與歷史悠久的 Verandan 傳統瑞典盛宴。',
    address: 'Södra Blasieholmshamnen 8, 103 27 Stockholm, Sweden',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Grand_hotel_November_2011.jpg/1280px-Grand_hotel_November_2011.jpg',
    images: ["https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Grand_hotel_November_2011.jpg/1280px-Grand_hotel_November_2011.jpg","https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Blasieholmen_February_2013.jpg/1280px-Blasieholmen_February_2013.jpg","https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Pano_Grand-Hotel_Nationalmuseum_Stockholm_DSC_0003w.jpg/1280px-Pano_Grand-Hotel_Nationalmuseum_Stockholm_DSC_0003w.jpg","https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Grand_Hotel_September_2014.jpg/1280px-Grand_Hotel_September_2014.jpg"],
    story: "1874年由法國名廚 Régis Cadier 創立，與瑞典皇宮隔水相望；自1901年首屆諾貝爾獎頒發以來，每年所有諾貝爾獎得主與家屬皆指定下榻於此。",
    trivia: "每年12月13日聖露西亞節清晨，飯店會派白衣頭戴蠟燭冠的合唱團到每位諾貝爾獎得主房門前獻唱喚醒他們！",
    mustDo: ["在 Verandan 玻璃長廊享用正統瑞典皇家自助餐 Smörgåsbord","造訪飯店內的米其林星級餐廳 Mathias Dahlgren Matbaren","在飯店正門水岸步道拍攝對岸瑞典皇宮與老城夕照"],
    dayOccurrences: [3, 4],
  },
  {
    id: 'h-kakslauttanen',
    name: 'Kakslauttanen Arctic Resort 極光玻璃屋度假村',
    originalName: 'Kakslauttanen Arctic Resort - Glass Igloos',
    city: '薩利色爾卡 / 拉普蘭',
    country: '芬蘭',
    flag: '🇫🇮',
    stars: 5,
    highlight: '全球玻璃冰屋開山鼻祖 · 躺在溫暖床上仰望極地星空與極光',
    description:
      '享譽全球的芬蘭拉普蘭極地度假村。經典的 Kelo-Glass Igloo 結合了原木木屋的柴火壁爐、私人傳統桑拿室，以及採用特殊防霜隔熱玻璃建造的圓頂星空極光臥室，配備極光偵測自動輕柔提醒鈴。',
    address: 'Kiilopääntie 9, 99830 Saariselkä, Finland',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Wood_and_flowers.jpg/1280px-Wood_and_flowers.jpg',
    images: ["https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Wood_and_flowers.jpg/1280px-Wood_and_flowers.jpg","https://upload.wikimedia.org/wikipedia/commons/7/7b/Kakslauttanen_Igloo_village.jpg","https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Husky_Dogs_%28301004607%29.jpg/1280px-Husky_Dogs_%28301004607%29.jpg","https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Siberian_Tit_%28Poecile_cinctus%29_in_Sodankyl%C3%A4%2C_Finland.jpg/1280px-Siberian_Tit_%28Poecile_cinctus%29_in_Sodankyl%C3%A4%2C_Finland.jpg"],
    story: "1973年創辦人 Jussi Eiramo 在薩利色爾卡荒野拋錨露宿時愛上這片極地，後首創採用「航太級導熱防霜玻璃」打造的圓頂玻璃屋，開創全球躺床賞極光風潮。",
    trivia: "Kelo-Glass Igloo 所使用的「Kelo 銀松原木」是拉普蘭森林中自然直立風乾超過三百年的極地老松木，散發天然松脂清香！",
    mustDo: ["開啟房內的「極光警報鈴」，極光出現即刻在溫暖被窩仰望","體驗私人木屋桑拿後到雪地露台呼吸北極圈純淨空氣","跨過度假村木橋拍攝整排發光玻璃屋雪夜全景"],
    dayOccurrences: [5, 6, 7],
  },
  {
    id: 'h-kamp',
    name: 'Hotel Kämp 肯普飯店',
    originalName: 'Hotel Kämp Helsinki',
    city: '赫爾辛基',
    country: '芬蘭',
    flag: '🇫🇮',
    stars: 5,
    highlight: '自1887年營運至今 · 芬蘭歷史文化頂峰奢華地標',
    description:
      '新古典主義優雅建築，坐落於赫爾辛基市中心著名的 Esplanadi 林蔭大道第一排。音樂巨匠西貝流士、芬蘭歷代總統均曾在此流連。客房揉合十九世紀歐洲宮廷貴族風韻與當代北歐奢華科技。',
    address: 'Pohjoisesplanadi 29, 00100 Helsinki, Finland',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/K%C3%A4mp_room.jpg/1280px-K%C3%A4mp_room.jpg',
    images: ["https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/K%C3%A4mp_room.jpg/1280px-K%C3%A4mp_room.jpg","https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Hotel_K%C3%A4mp_%2898943%29.jpg/1280px-Hotel_K%C3%A4mp_%2898943%29.jpg","https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/K%C3%A4mp_Galleria_%26_Hotel_K%C3%A5mp.jpg/1280px-K%C3%A4mp_Galleria_%26_Hotel_K%C3%A5mp.jpg","https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Hotel_K%C3%A4mp_%2847037%29.jpg/1280px-Hotel_K%C3%A4mp_%2847037%29.jpg"],
    story: "1887年由 Carl Kämp 創立於赫爾辛基 Esplanadi 公園第一排，芬蘭國寶作曲家西貝流士（Jean Sibelius）與詩人 Eino Leino 曾長年在此聚會創作，見證芬蘭獨立歷史。",
    trivia: "二戰冬季戰爭期間，Hotel Kämp 曾是國際戰地記者總部；如今二樓鏡廳仍完整保留1887年的原始水晶吊燈與古典灰泥雕花！",
    mustDo: ["在大廳古典大理石階梯與歐式水晶燈下拍攝貴族風照片","在 Kämp Bar 點一杯紀念西貝流士的北歐漿果調酒","清晨推開窗戶欣賞 Esplanadi 林蔭大道的聖誕燈海"],
    dayOccurrences: [8, 9],
  },
  {
    id: 'h-the-thief',
    name: 'The Thief 賊之島現代藝術飯店',
    originalName: 'The Thief Oslo',
    city: '奧斯陸',
    country: '挪威',
    flag: '🇳🇴',
    stars: 5,
    highlight: '坐落現代藝廊特區 Tjuvholmen · 客房陳列現代名家真跡藝術',
    description:
      '「偷走你靈魂與時間的精品奢華酒店」。座落於奧斯陸峽灣畔的運河藝術島，由國際設計大師 Patricia Urquiola 策展，飯店內隨處可見沃荷（Andy Warhol）等名家原版作品，頂樓露台享有峽灣落日全景。',
    address: 'Landgangen 1, 0252 Oslo, Norway',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Tjuvholmen_all%C3%A9_seen_from_Olav_Selvaags_plass.JPG/1280px-Tjuvholmen_all%C3%A9_seen_from_Olav_Selvaags_plass.JPG',
    images: ["https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Tjuvholmen_all%C3%A9_seen_from_Olav_Selvaags_plass.JPG/1280px-Tjuvholmen_all%C3%A9_seen_from_Olav_Selvaags_plass.JPG","https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Odden_Tjuvholmen_seen_from_Holmen.JPG/1280px-Odden_Tjuvholmen_seen_from_Holmen.JPG","https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Tjuvholmen_Oslo_3.jpg/1280px-Tjuvholmen_Oslo_3.jpg","https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Pipervika_Aker_brygge_Tjuvholmen_Oslo_Oslofjorden_Norway_%282022.03.22%29.jpg/1280px-Pipervika_Aker_brygge_Tjuvholmen_Oslo_Oslofjorden_Norway_%282022.03.22%29.jpg"],
    story: "坐落於奧斯陸峽灣畔的 Tjuvholmen（古稱「賊之島」，18世紀曾是海盜與小偷流放地），如今蛻變為北歐最前衛的當代藝術半島，與阿스트魯普費恩利現代美術館隔橋相望。",
    trivia: "飯店老闆是挪威藝術收藏大亨，因此每間客房牆上掛的都是來自現代美術館館藏的「真跡原畫」，連房卡都是名家設計！",
    mustDo: ["持房卡免費進入隔壁由 Renzo Piano 設計的 Astrup Fearnley 現代美術館","在頂樓露台邊喝熱紅酒邊眺望奧斯陸峽灣冬日夕陽","體驗結合土耳其浴與芬蘭桑拿的 Thief Spa 海水療程"],
    dayOccurrences: [10],
  },
  {
    id: 'h-the-edge',
    name: 'Clarion Hotel The Edge 特羅姆瑟艾奇飯店',
    originalName: 'Clarion Hotel The Edge Tromsø',
    city: '特羅姆瑟',
    country: '挪威',
    flag: '🇳🇴',
    stars: 4,
    highlight: '極地水岸第一排 · 擁有特羅姆瑟唯一的 Skybar 俯瞰峽灣雪山',
    description:
      '特羅姆瑟最引人注目的現代水岸建築。大面落地玻璃將深邃峽灣與對岸雪山連綿景致融於室內，夜晚頂樓酒吧是靜候極光穿透夜空的絕佳溫暖室內觀測點。',
    address: 'Kaigata 6, 9008 Tromsø, Norway',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Petter_Stordalen_2014-05-14_001.jpg/1280px-Petter_Stordalen_2014-05-14_001.jpg',
    images: ["https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Petter_Stordalen_2014-05-14_001.jpg/1280px-Petter_Stordalen_2014-05-14_001.jpg"],
    story: "由丹麥著名建築師 Niels Torp 設計，於2014年落成於特羅姆瑟港灣核心，幾何切角外牆猶如北極峽灣邊緣拔地而起的黑色玄武岩晶體。",
    trivia: "11樓的 Skybar 是整座特羅姆瑟島最高的室內全景觀景廳，不用在戶外吹冷風就能直接隔著落地窗看到北極大教堂上方的極光！",
    mustDo: ["夜晚登上 11 樓 Skybar 一面小酌北極琴酒一面欣賞跨海大橋與極光","在榮獲全挪威最佳早餐評選的 Kitchen & Table 享用現做極地魚子醬歐姆蛋","走出飯店大門僅 1 分鐘即可抵達極光雙體船登船碼頭"],
    dayOccurrences: [11],
  },
  {
    id: 'h-the-retreat',
    name: 'The Retreat at Blue Lagoon 冰島藍湖隱逸奢華套房',
    originalName: 'The Retreat at Blue Lagoon Iceland',
    city: '格林達維克 & 藍湖',
    country: '冰島',
    flag: '🇮🇸',
    stars: 5,
    highlight: '世界頂級奢華之巔 · 客房直通私人火山熔岩專屬潟湖',
    description:
      '隱身於800年黑色火山苔原中的建築奇蹟。住客專屬私人藍湖區域，完全避開大眾觀光人潮。套房內落地窗直面岩漿岩石，附設私人岩洞水療中心與天然白矽泥護膚儀式。',
    address: 'Norðurljósavegur 9, 240 Grindavík, Iceland',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Refleksjoner.jpg/1280px-Refleksjoner.jpg',
    images: ["https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Refleksjoner.jpg/1280px-Refleksjoner.jpg","https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/17-08-04-Blaue-Lagune-RalfR-DSC_2422.jpg/1280px-17-08-04-Blaue-Lagune-RalfR-DSC_2422.jpg","https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/17-08-04-Blaue-Lagune-RalfR-DSC_2442.jpg/1280px-17-08-04-Blaue-Lagune-RalfR-DSC_2442.jpg","https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Blue-Lagoon-Iceland-January2012.jpg/1280px-Blue-Lagoon-Iceland-January2012.jpg"],
    story: "歷時多年鑿開800年前形成的 Svartsengi 黑色火山熔岩層興建而成，將地熱礦物泉水直接引入每間底層套房窗外，榮獲《時代雜誌》全球百大必訪之地。",
    trivia: "住客專屬的「Retreat Lagoon」由多條隱密熔岩水道串聯，平均每位住客享有超過 100 平方公尺的私人乳藍溫泉空間！",
    mustDo: ["體驗地下熔岩洞穴中的「藍湖三寶儀式」（白矽泥、綠微藻、火山礦物鹽）","在無框落地窗前漂浮於 38°C 私人潟湖中欣賞熔岩苔原雪景","參加每日午後大廳免費舉辦的冰島地熱咖啡與傳統點心時光"],
    dayOccurrences: [12],
  },
  {
    id: 'h-the-edition',
    name: 'The Reykjavik EDITION 雷克雅維克艾迪遜酒店',
    originalName: 'The Reykjavik EDITION',
    city: '雷克雅維克',
    country: '冰島',
    flag: '🇮🇸',
    stars: 5,
    highlight: '冰島第一家五星潮奢品牌 · 緊鄰 Harpa 音樂廳與海港',
    description:
      '由伊恩·施拉格（Ian Schrager）與萬豪國際攜手打造。採用火山玄武岩石材、冰島再生木材與溫暖壁爐羊毛毯裝飾，融合前衛藝術與斯堪地那維亞舒適美學。頂樓景觀酒吧享有雷克雅維克跨年煙火與海灣極光無死角視野。',
    address: 'Austurbakki 2, 101 Reykjavík, Iceland',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Harpa_harpa_01.jpg/1280px-Harpa_harpa_01.jpg',
    images: ["https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Harpa_harpa_01.jpg/1280px-Harpa_harpa_01.jpg","https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Harpa_davidis_01.JPG/1280px-Harpa_davidis_01.JPG","https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/View_of_Reykjavik_with_Harpa_from_ferry_to_Vi%C3%B0ey_island_1.jpg/1280px-View_of_Reykjavik_with_Harpa_from_ferry_to_Vi%C3%B0ey_island_1.jpg","https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/View_of_Reykjavik_with_Harpa_from_ferry_to_Vi%C3%B0ey_island_2.jpg/1280px-View_of_Reykjavik_with_Harpa_from_ferry_to_Vi%C3%B0ey_island_2.jpg"],
    story: "由精品酒店教父 Ian Schrager 與萬豪集團攜手打造，2021年開幕成為雷克雅維克首間國際潮奢五星酒店，外牆採用燒杉木與冰島玄武岩呼應隔壁 Harpa 音樂廳。",
    trivia: "大廳中央擺放著一座以冰島黑曜石與火山岩構築的雕塑感柴火長桌，香氣則由法國百年香氛品牌 Le Labo 特調專屬紅茶木質香！",
    mustDo: ["跨年夜登上 7 樓 The Roof 全景露台，零死角直擊全城百萬煙火與海灣極光","在地下隱密酒吧 Tölt 品嚐以冰島樺木酒與火山煙燻鹽調製的創意雞尾酒","從飯店側門直接步入 Harpa 音樂廳與舊港海濱步道散步"],
    dayOccurrences: [13, 14],
  },
];

export const GOURMET_DINING: DiningItem[] = [
  {
    id: 'd-havfruen',
    name: 'Restaurant Havfruen 新港美人魚海鮮館',
    originalName: 'Restaurant Havfruen Nyhavn',
    city: '哥本哈根',
    country: '丹麥',
    flag: '🇩🇰',
    type: '經典北歐海鮮',
    highlight: '運河畔彩色木屋第一排 · 傳統丹麥醃漬鯡魚與奶油香煎鰈魚',
    signatureDish: '經典丹麥三品海鮮拼盤佐新鮮蒔蘿黑麥麵包、野生海鱸魚佐白酒奶油醬',
    description:
      '坐落於新港最具代表性的鮮黃色木屋中，創立於1937年。主廚每日清晨挑選厄勒海峽直送的漁獲，搭配手工熬煮香料熱紅酒（Gløgg），是冬夜新港最溫暖的美味駐足地。',
    address: 'Nyhavn 39, 1051 København, Denmark',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Nyhavn_35-41_-_Hafen_3.jpg/1280px-Nyhavn_35-41_-_Hafen_3.jpg',
    images: ["https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Nyhavn_35-41_-_Hafen_3.jpg/1280px-Nyhavn_35-41_-_Hafen_3.jpg","https://upload.wikimedia.org/wikipedia/commons/c/c0/Nyhavn_33-39%2C_Copenhagen_1.jpg","https://upload.wikimedia.org/wikipedia/commons/d/d0/Havfruen_-_Nyhavn_39.jpg","https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Nyhavn_17_Copenhagen_Denmark.jpg/1280px-Nyhavn_17_Copenhagen_Denmark.jpg"],
    story: "自1937年開業於新港39號百年黃色木屋中，「Havfruen」在丹麥語中正是「美人魚」之意；數十年來堅持與丹麥沿海小型漁船合作，提供最道地的哥本哈根港灣海味。",
    trivia: "新港39號木屋建於1685年，店內低矮的木橫樑與航海銅燈至今仍維持著17世紀丹麥商船船艙的原始格局！",
    mustDo: ["必點招牌「三式丹麥醋漬鯡魚拼盤」搭配烤黑麥麵包","主菜推薦奶油白葡萄酒香煎厄勒海峽野生比目魚","餐後在木屋門前點一杯熱騰騰的杏仁葡萄乾熱紅酒 Gløgg"],
    dayOccurrences: [1],
  },
  {
    id: 'd-taarnet',
    name: 'Restaurant Tårnet 塔樓景觀餐廳',
    originalName: 'Restaurant Tårnet Christiansborg',
    city: '哥本哈根',
    country: '丹麥',
    flag: '🇩🇰',
    type: '現代王家丹麥三明治',
    highlight: '位於克里斯蒂安堡宮中央塔樓內部 · 俯瞰哥本哈根全景天際線',
    signatureDish: '現代解構式 Smørrebrød（慢燉牛小排佐辣根醬、煙燻鮭魚佐魚子醬）',
    description:
      '隱身於丹麥議會宮殿正中心的高塔內，高達十餘公尺的宏偉拱頂。在此品嚐全城最講究的丹麥傳統開放式三明治，邊啜飲丹麥精釀啤酒邊欣賞冬日哥本哈根紅瓦白雪屋頂。',
    address: 'Christiansborg Slotsplads, 1218 København, Denmark',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Christiansborg_Slot_Copenhagen_2014_01.jpg/1280px-Christiansborg_Slot_Copenhagen_2014_01.jpg',
    images: ["https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Christiansborg_Slot_Copenhagen_2014_01.jpg/1280px-Christiansborg_Slot_Copenhagen_2014_01.jpg","https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Christiansborg_Palace%2C_Copenhagen_%28by_Pudelek%29.JPG/1280px-Christiansborg_Palace%2C_Copenhagen_%28by_Pudelek%29.JPG","https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Christiansborg_Slot_spire_Copenhagen_Denmark.jpg/1280px-Christiansborg_Slot_spire_Copenhagen_Denmark.jpg","https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Christiansborg_Palace_2017-08-16.jpg/1280px-Christiansborg_Palace_2017-08-16.jpg"],
    story: "過去百年來克里斯蒂安堡宮中央高塔僅作為儲藏室，直到2014年才首次對公眾開放並由名廚 Rasmus Bo Bojesen 打造為全丹麥最高的皇宮塔樓餐廳。",
    trivia: "餐廳大廳兩側仍佇立著原本矗立在宮殿屋頂、每尊高達 3 公尺的原始青銅守護神雕像真跡！",
    mustDo: ["預約靠窗座位，在海拔百公尺高空邊吃「皇家高空開放式三明治」邊俯瞰全城","必點慢燉丹麥小牛肉佐現磨辣根奶油與酥炸洋蔥圈","用餐前後免費登上塔頂戶外觀景台遠眺厄勒海峽與瑞典海岸"],
    dayOccurrences: [2],
  },
  {
    id: 'd-nimb',
    name: 'Nimb Brasserie 蒂沃利摩爾宮小館',
    originalName: 'Nimb Brasserie Tivoli',
    city: '哥本哈根',
    country: '丹麥',
    flag: '🇩🇰',
    type: '法式北歐奢華餐酒館',
    highlight: '坐落蒂沃利花園摩爾式白色宮殿 · 百萬璀璨聖誕燈海窗景',
    signatureDish: '頂級安格斯黑牛肋眼佐冬季黑松露洋芋泥、布列塔尼生蠔拼盤',
    description:
      '蒂沃利花園地標性宮殿餐廳。在金碧輝煌的挑高水晶燈空間下，落地窗正對著蒂沃利花園聖誕童話燈海，一邊享受香檳一邊聆聽園區聖誕管弦樂團的優美樂章。',
    address: 'Bernstorffsgade 5, 1577 København, Denmark',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/00/Nimb_Tivoli_2009.jpg',
    images: ["https://upload.wikimedia.org/wikipedia/commons/0/00/Nimb_Tivoli_2009.jpg","https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Nimb_-_Tivoli_Gardens.jpg/1280px-Nimb_-_Tivoli_Gardens.jpg","https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Copenhagen_tivoli_IMG_0187.jpg/1280px-Copenhagen_tivoli_IMG_0187.jpg","https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Nimb_%28Tivoli_Gardens%29.jpg/1280px-Nimb_%28Tivoli_Gardens%29.jpg"],
    story: "1909年由丹麥美食界傳奇 Nimb 姊妹創立於蒂沃利花園摩爾式白色宮殿內，她們率先將法式精緻餐飲引進哥本哈根，讓 Nimb 成為百年來丹麥名流晚宴的代名詞。",
    trivia: "到了夜晚，Nimb 白色宮殿外牆會點亮超過 3,000 顆暖白燈泡，倒映在蒂沃利湖面上宛如《一千零一夜》的奇幻皇宮！",
    mustDo: ["在面對蒂沃利聖誕燈海的落地窗旁享用布列塔尼生蠔與香檳","品嚐招牌法式黑松露牛肝菌燉飯與炭烤肋眼牛排","飯後到 Nimb Bar 的巨大古董壁爐旁品嚐聖誕香料調酒"],
    dayOccurrences: [2],
  },
  {
    id: 'd-gyldene-freden',
    name: 'Den Gyldene Freden 黃金和平餐廳',
    originalName: 'Den Gyldene Freden Stockholm',
    city: '斯德哥爾摩',
    country: '瑞典',
    flag: '🇸🇪',
    type: '三百餘年金氏紀錄傳統老店',
    highlight: '自1722年連續營業至今 · 瑞典學院諾貝爾文學獎評委聚餐聖地',
    signatureDish: '瑞典傳統特級肉丸佐奶油肉汁、新鮮野生越橘果醬與醃黃瓜',
    description:
      '老城 Gamla Stan 鵝卵石小徑旁的地底紅磚拱頂建築。燭光在古老磚壁上搖曳，空氣中飄散著肉桂與烘烤肉丸的誘人香氣，是全斯德哥爾摩體驗瑞典家傳菜系最神聖不可錯過的名殿。',
    address: 'Österlånggatan 51, 111 31 Stockholm, Sweden',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Den_Gyllene_Freden_skylt.jpg/1280px-Den_Gyllene_Freden_skylt.jpg',
    images: ["https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Den_Gyllene_Freden_skylt.jpg/1280px-Den_Gyllene_Freden_skylt.jpg","https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Den_Gyldene_Freden_2013a.jpg/1280px-Den_Gyldene_Freden_2013a.jpg","https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Den_Gyldene_Freden_2013e.jpg/1280px-Den_Gyldene_Freden_2013e.jpg","https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Den_Gyldene_Freden_2013c.jpg/1280px-Den_Gyldene_Freden_2013c.jpg"],
    story: "1722年開業至今從未間斷營業，獲金氏世界紀錄認證為「全球裝潢最完整保留的歷史餐廳」；1919年由瑞典大畫家 Anders Zorn 出資買下並捐贈給頒發諾貝爾文學獎的「瑞典學院」。",
    trivia: "每週四晚上，負責評選諾貝爾文學獎的「瑞典學院 18 位終身院士」都會固定在二樓包廂聚餐喝碗豆湯，至今已持續超過一百年！",
    mustDo: ["在 18 世紀紅磚拱頂地窖點一份正統「瑞典手工肉丸佐野生越橘果醬与奶油肉汁」","品嚐醃漬波羅的海鯡魚三味拼盤配瑞典國酒 O.P. Anderson 香料烈酒","感受侍者點燃白蠟燭、宛如穿越回 1722 年貝爾曼民謠時代的復古氛圍"],
    dayOccurrences: [3],
  },
  {
    id: 'd-fotografiska',
    name: 'Fotografiska Restaurant 當代攝影美學餐館',
    originalName: 'Fotografiska Restaurant',
    city: '斯德哥爾摩',
    country: '瑞典',
    flag: '🇸🇪',
    type: '米其林綠星當代永續美饌',
    highlight: '全景玻璃俯瞰群島冬季落日 · 極致發酵與根莖當令蔬食哲學',
    signatureDish: '柴燒焦糖化防風草根佐榛果牛油、波羅的海海草慢火煙燻鯡魚',
    description:
      '榮獲米其林綠星殊榮，由名廚 Paul Svensson 創辦。堅持「零浪費」理念，將北歐當季根莖、野菇與發酵技法發揮得淋漓盡致。巨幅落地窗直接面對梅拉倫湖水岸與騎士島天際線。',
    address: 'Stadsgårdshamnen 22, 116 45 Stockholm, Sweden',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Fotografiska_2010a.jpg/1280px-Fotografiska_2010a.jpg',
    images: ["https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Fotografiska_2010a.jpg/1280px-Fotografiska_2010a.jpg","https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Museum_Fotografiska%2C_Stockholm.jpg/1280px-Museum_Fotografiska%2C_Stockholm.jpg","https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Fotografiska_museet_Stockholm_2016_01.jpg/1280px-Fotografiska_museet_Stockholm_2016_01.jpg","https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Fotografiska_i_Stockholm_02.jpg/1280px-Fotografiska_i_Stockholm_02.jpg"],
    story: "由「永續美食教父」Paul Svensson 創立於攝影博物館頂樓，以「植物為核心、海鮮肉類為點綴」的零浪費料理哲學，連續多年蟬聯米其林綠星殊榮。",
    trivia: "廚房將有機胡蘿蔔皮烘乾磨成鮮味粉、將剩餘酸種麵包發酵成精釀啤酒，連酒吧的調酒冰塊裝飾都是廚房邊角食材再造的藝術品！",
    mustDo: ["品嚐招牌「柴燒焦糖化北歐根莖蔬菜佐發酵奶油與黑松露」","坐在面向老城 Gamla Stan 與格羅納倫遊樂園的全景窗邊賞夜景","餐後持餐廳套票直接下樓欣賞世界級攝影大師特展"],
    dayOccurrences: [4],
  },
  {
    id: 'd-kakslauttanen-gala',
    name: 'Kakslauttanen 極地平安夜盛宴',
    originalName: 'Kakslauttanen Christmas Eve Arctic Gala',
    city: '拉普蘭',
    country: '芬蘭',
    flag: '🇫🇮',
    type: '拉普蘭傳統聖誕御宴',
    highlight: '原木壁爐篝火 · 傳統芬蘭聖誕烤火腿與香煎北極紅點鮭',
    signatureDish: '慢烤丁香芥末聖誕火腿、傳統甜菜根蘋果沙拉 Rosolli、熱藍莓杜松子甘露',
    description:
      '平安夜當晚在巨大針葉松木主餐廳隆重登場。伴隨著柴火劈啪作響與聖誕老人的驚喜造訪，大家圍坐共享豐盛道地的北極圈盛宴，窗外則是無邊無際的純白極夜雪原。',
    address: 'Kakslauttanen Main Lodge, 99830 Saariselkä, Finland',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d6/Poronk%C3%A4ristys.jpg',
    images: ["https://upload.wikimedia.org/wikipedia/commons/d/d6/Poronk%C3%A4ristys.jpg","https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Finnbiff.JPG/1280px-Finnbiff.JPG","https://upload.wikimedia.org/wikipedia/commons/5/51/Yumyum.JPG","https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Kotipizza_Poronk%C3%A4ristys.jpg/1280px-Kotipizza_Poronk%C3%A4ristys.jpg"],
    story: "在面積寬敞的拉普蘭傳統 Kelo 銀松原木大廳中，圍繞著中央熊熊燃燒的巨型圓形壁爐，重現北極圈薩米人與芬蘭森林家族共度平安夜的古老團圓傳統。",
    trivia: "主廚使用的馴鹿肉全部來自薩利色爾卡當地薩米牧民自然放牧於國家公園雪原的馴鹿，脂肪極低且富含 Omega-3！",
    mustDo: ["品嚐拉普蘭第一名菜「清燉馴鹿肉片佐薯泥與酸甜越橘醬（Poronkäristys）」","享用芬蘭聖誕餐桌必備的丁香芥末烤火腿與奶油鮭魚湯","甜點必吃淋上溫熱「北極黃金雲莓醬（Lakka）」的拉普蘭烤起司（Leipäjuusto）"],
    dayOccurrences: [6],
  },
  {
    id: 'd-soppakeittio',
    name: 'Soppakeittiö 赫爾辛基老市場鮭魚湯',
    originalName: 'Soppakeittiö Hakaniemi & Vanha Kauppahalli',
    city: '赫爾辛基',
    country: '芬蘭',
    flag: '🇫🇮',
    type: '百年老市場國民湯品',
    highlight: '全芬蘭最好喝的香濃奶油鮭魚湯 · 無限量提供黑麥酸麵包與羅勒青醬',
    signatureDish: '傳統芬蘭奶油蒔蘿鮭魚湯（Lohikeitto）',
    description:
      '建於1889年的赫爾辛基老農貿市場中最受歡迎的排隊小鋪。大塊厚實的野生鮭魚肉、軟嫩馬鈴薯丁在鮮奶油與魚骨高湯中慢熬，表面撒上厚厚一層翠綠新鮮蒔蘿，寒冬喝下一碗瞬間驅散全身寒意。',
    address: 'Eteläranta, 00130 Helsinki, Finland',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Antiguo_Mercado_de_Helsinki%2C_Finlandia%2C_2012-08-14%2C_DD_01.JPG/1280px-Antiguo_Mercado_de_Helsinki%2C_Finlandia%2C_2012-08-14%2C_DD_01.JPG',
    images: ["https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Antiguo_Mercado_de_Helsinki%2C_Finlandia%2C_2012-08-14%2C_DD_01.JPG/1280px-Antiguo_Mercado_de_Helsinki%2C_Finlandia%2C_2012-08-14%2C_DD_01.JPG","https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Antiguo_Mercado_de_Helsinki%2C_Finlandia%2C_2012-08-14%2C_DD_05.JPG/1280px-Antiguo_Mercado_de_Helsinki%2C_Finlandia%2C_2012-08-14%2C_DD_05.JPG","https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Suomi100_Helsinki_old_market_hall_1.jpg/1280px-Suomi100_Helsinki_old_market_hall_1.jpg","https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Suomi100_Helsinki_old_market_hall_3.jpg/1280px-Suomi100_Helsinki_old_market_hall_3.jpg"],
    story: "藏身於1889年落成的赫爾辛基百年老農貿市場（Vanha kauppahalli）中央走道，每日僅專心熬煮三款濃湯（經典奶油鮭魚湯、地中海海鮮湯、泰式鮮蝦湯），卻讓全球旅人甘願排隊朝聖。",
    trivia: "老闆堅持每天清晨從赫爾辛基漁港直送整條大西洋鮭魚，連湯底都是用新鮮鮭魚頭與烤蝦殼慢火熬煮四小時而成！",
    mustDo: ["點一碗鋪滿新鮮蒔蘿與大塊鮭魚的「傳統芬蘭奶油鮭魚湯（Lohikeitto）」","盡情取用桌邊無限量供應的現切芬蘭黑麥酸種麵包塗抹自製羅勒青醬","順道在隔壁百年老攤買一盒煙燻馴鹿肉片或芬蘭魚子醬品嚐"],
    dayOccurrences: [8],
  },
  {
    id: 'd-savoy',
    name: 'Ravintola Savoy 薩沃伊傳奇餐廳',
    originalName: 'Ravintola Savoy Helsinki',
    city: '赫爾辛基',
    country: '芬蘭',
    flag: '🇫🇮',
    type: '米其林星級北歐現代經典',
    highlight: '芬蘭建築巨擘 Alvar Aalto 親手設計室內空間與經典 Savoy 花瓶誕生地',
    signatureDish: '曼納海姆元帥招牌燴羊肉末佐醃黃瓜與甜菜根（Vorschmack）',
    description:
      '1937年開業至今，為芬蘭政商名流與文藝名家最頂級聚會所。八樓露台可俯瞰整個 Esplanadi 花園與赫爾辛基市景，菜色融合法式精細工藝與純淨北歐自然風味。',
    address: 'Eteläesplanadi 14, 00130 Helsinki, Finland',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Statue_Eugenio_of_Savoy_Heldenplatz_Vienna_Austria.jpg/1280px-Statue_Eugenio_of_Savoy_Heldenplatz_Vienna_Austria.jpg',
    images: ["https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Statue_Eugenio_of_Savoy_Heldenplatz_Vienna_Austria.jpg/1280px-Statue_Eugenio_of_Savoy_Heldenplatz_Vienna_Austria.jpg","https://upload.wikimedia.org/wikipedia/commons/3/3d/Savoy_RGB_69.jpg","https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Restaurant_Savoy_%28Helsinki%29_-_DSC05579.JPG/1280px-Restaurant_Savoy_%28Helsinki%29_-_DSC05579.JPG","https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Savoy_teatteri.jpg/1280px-Savoy_teatteri.jpg"],
    story: "1937年開幕於赫爾辛基金融大廈頂樓，室內一桌一椅、燈具到餐具皆由芬蘭現代主義建築大師 Alvar Aalto 與妻子 Aino 親手設計，是全世界唯一活著的 Aalto 設計博物館餐廳。",
    trivia: "舉世聞名的芬蘭國寶設計「Alvar Aalto 湖泊波浪玻璃花瓶（Savoy Vase）」，當年就是為了這間餐廳開幕而特別設計的桌花器皿！",
    mustDo: ["品嚐芬蘭國父曼納海姆元帥生前每次必點的招牌菜「Vorschmack（慢燉小羊鯡魚肉醬佐烤馬鈴薯）」","體驗元帥傳奇喝法：將冰鎮至零下 20 度、倒得表面微微凸起的滿杯伏特加一飲而盡","近距離欣賞每張餐桌上擺放的 1937 年原版設計 Savoy 湖泊波浪花瓶"],
    dayOccurrences: [8, 9],
  },
  {
    id: 'd-loyly-rest',
    name: 'Löyly Restaurant 海濱桑拿柴火餐館',
    originalName: 'Löyly Helsinki Restaurant',
    city: '赫爾辛基',
    country: '芬蘭',
    flag: '🇫🇮',
    type: '海濱碳烤與慢燉野味',
    highlight: '桑拿跳海後的極致享受 · 柴火烤爐慢燉芬蘭農場鹿肉',
    signatureDish: '慢燉馴鹿肉佐防風草根泥與越橘醬、碳烤波羅的海鮮魚',
    description:
      '位於多角形木質幾何桑拿建築內。在戶外冰海桑拿徹底釋放身體疲憊後，坐進擁有全景海灣大壁爐的溫馨餐廳，大口品嚐香氣四溢的烤鹿肉與冰涼芬蘭精釀白啤酒。',
    address: 'Hernesaarenranta 4, 00150 Helsinki, Finland',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/L%C3%B6yly_Helsinki_2.jpg/1280px-L%C3%B6yly_Helsinki_2.jpg',
    images: ["https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/L%C3%B6yly_Helsinki_2.jpg/1280px-L%C3%B6yly_Helsinki_2.jpg","https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/L%C3%B6yly_Helsinki.jpg/1280px-L%C3%B6yly_Helsinki.jpg","https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/L%C3%B6yly_-saunan_ravintola_01.jpg/1280px-L%C3%B6yly_-saunan_ravintola_01.jpg","https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/L%C3%B6yly_-saunan_terassi.jpg/1280px-L%C3%B6yly_-saunan_terassi.jpg"],
    story: "由芬蘭好萊塢男星 Jasper Pääkkönen 與國會議員共同創辦，餐廳與桑拿館全數採用北歐再生能源與 MSC 永續認證漁獲，是赫爾辛基最具代表性的當代海濱聚所。",
    trivia: "餐廳內的樺木桌椅與黑色混凝土地板專為「剛蒸完桑拿穿著浴袍的客人」設計，讓你能毫無拘束地邊吹波羅的海海風邊享美食！",
    mustDo: ["蒸完煙燻桑拿與跳冰海後，立刻來一碗熱騰騰的 Löyly 招牌奶油鮭魚湯","品嚐以芬蘭鹿肉或煙燻鮭魚製作的北歐職人漢堡配松露薯條","在面向芬蘭灣的戶外篝火露台喝一杯葡萄柚琴酒長飲（Lonkero）"],
    dayOccurrences: [9],
  },
  {
    id: 'd-maaemo',
    name: 'Maaemo 奧斯陸傳奇米其林三星',
    originalName: 'Maaemo Oslo',
    city: '奧斯陸',
    country: '挪威',
    flag: '🇳🇴',
    type: '米其林三星北歐新料理殿堂',
    highlight: '挪威首間米其林三星神話 · 主廚 Esben Holmboe Bang 心靈饗宴',
    signatureDish: '冰冷海域野生挪威螯蝦裹黑麥麵包碎、松葉冷杉香氣慢火乳鴿',
    description:
      'Maaemo 在古諾爾斯語中意為「萬物大地之母」。每一道菜皆是向挪威純淨峽灣、原始森林與冰雪大地致敬的極致藝術品。長達十六道式的品味菜單，被全球老饕奉為畢生必訪殿堂。',
    address: 'Dronning Eufemias gate 23, 0194 Oslo, Norway',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Opera_house_in_Bj%C3%B8rvika%2C_Oslo_under_construction_7jun2005.jpg/1280px-Opera_house_in_Bj%C3%B8rvika%2C_Oslo_under_construction_7jun2005.jpg',
    images: ["https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Opera_house_in_Bj%C3%B8rvika%2C_Oslo_under_construction_7jun2005.jpg/1280px-Opera_house_in_Bj%C3%B8rvika%2C_Oslo_under_construction_7jun2005.jpg","https://upload.wikimedia.org/wikipedia/commons/0/08/Opera_house_in_Bj%C3%B8rvika%2C_Oslo_under_construction-20070203.jpg","https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Roundabout_Bispelokket_in_Bj%C3%B8rvika%2C_Oslo.JPG/1280px-Roundabout_Bispelokket_in_Bj%C3%B8rvika%2C_Oslo.JPG","https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Oslo_Opera_house_%282015%29%282%29.jpg/1280px-Oslo_Opera_house_%282015%29%282%29.jpg"],
    story: "2010年底開幕後僅用14個月便直奪米其林二星，2016年更成為挪威史上第一間米其林三星餐廳；丹麥籍主廚 Esben Holmboe Bang 以 100% 有機與野生採集食材書寫北歐風土史詩。",
    trivia: "招牌名菜「Rømmegrøt（挪威傳統酸奶油粥佐馴鹿心刨片）」將維京時代農夫補充熱量的家常粥品化為令全球食評家落淚的三星神作！",
    mustDo: ["品嚐來自北極圈朗伊爾城與羅弗敦群島冰冷海域的野生巨型挪威海螯蝦","體驗主廚以發酵越橘、樺樹汁與松針釀造的無酒精北歐風土餐酒搭配（Juice Pairing）","坐在挑高劇場感餐廳內觀賞開放式廚房團隊猶如交響樂團般的精準擺盤"],
    dayOccurrences: [10],
  },
  {
    id: 'd-fiskekompaniet',
    name: 'Fiskekompaniet 挪威極地海鮮名店',
    originalName: 'Fiskekompaniet Sjøsiden Tromsø',
    city: '特羅姆瑟',
    country: '挪威',
    flag: '🇳🇴',
    type: '挪威現捕野生帝王蟹與深海冷水魚',
    highlight: '海港浮橋水岸邊 · 新鮮捕撈巨大挪威帝王蟹（King Crab）現煮',
    signatureDish: '清蒸極地野生帝王蟹螯佐檸檬蒜蓉香草牛油、香煎大西洋真鱈',
    description:
      '特羅姆瑟最享有盛譽的海鮮餐廳。座落於海灣木棧道上，窗外便是停泊的極光遊船與白雪皚皚的山脈。剛從冰冷深海捕撈的帝王蟹肉質清甜彈牙無比，回味悠長。',
    address: 'Killengreens gate 2, 9008 Tromsø, Norway',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Paralithodes_camtschaticus%2C_1.jpg/1280px-Paralithodes_camtschaticus%2C_1.jpg',
    images: ["https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Paralithodes_camtschaticus%2C_1.jpg/1280px-Paralithodes_camtschaticus%2C_1.jpg","https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Ivrig_fiskehandel_%285634235889%29.jpg/1280px-Ivrig_fiskehandel_%285634235889%29.jpg","https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/HUS%C3%98Y_Hus%C3%B8ya_%C3%98yfjorden_Senja_%28former_Lenvik%29_NORWAY_2022-05-30_Fiskev%C3%A6r_Fishing_village_on_small_island_in_fjord_by_ocean_Havn_harbour_Fiskeb%C3%A5ter_ships_boats_molo_breakwater_Br._Karlsen_seafood_company_Hus%C3%B8ysundet_Snowy_mountains.jpg/1280px-thumbnail.jpg","https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/HUS%C3%98Y_Hus%C3%B8ya_%C3%98yfjorden_Senja_%28former_Lenvik%29_NORWAY_2022-05-30_Fiskev%C3%A6r_Fishing_village_on_small_island_in_fjord_by_ocean_Havn_harbour_Fiskeb%C3%A5ter_ships_boats_Br._Karlsen_seafood_company_Hus%C3%B8ysundet_Molo_breakwater_Snowy_mountains.jpg/1280px-thumbnail.jpg"],
    story: "矗立於特羅姆瑟港灣第一排超過30年的極地海鮮指標餐廳，每日直接向停靠港邊的巴倫支海破冰漁船收購現撈紅帝王蟹、北極紅點鮭與雪場蟹。",
    trivia: "這裡供應的挪威冬季洄游鱈魚「Skrei（戀愛鱈魚）」，是每年1至4月從巴倫支海長途游行千公里到羅弗敦產卵的極品，全身肌肉緊實潔白如雪！",
    mustDo: ["預訂「北極海鮮大滿貫拼盤（Symphony of the Sea）」，一次嚐盡帝王蟹、生蠔、海螯蝦與干貝","必點清蒸巴倫支海野生紅帝王蟹長腿佐北歐蒔蘿檸檬奶油","坐在港景落地窗前邊享海味邊看著極光遊船點燈出航"],
    dayOccurrences: [11],
  },
  {
    id: 'd-moss',
    name: 'Moss Restaurant 藍湖米其林一星火山饗宴',
    originalName: 'Moss Restaurant at The Retreat',
    city: '格林達維克 & 藍湖',
    country: '冰島',
    flag: '🇮🇸',
    type: '米其林一星火山熔原盛宴',
    highlight: '坐落火山岩漿原中央 · 七道式探索冰島自然風味',
    signatureDish: '火山岩慢烤冰島初生小羊排佐野當歸、炭烤北極紅點鮭魚佐白海藻湯',
    description:
      '位於藍湖 The Retreat 奢華度假村核心位置，曾獲米其林一星肯定。餐廳環繞著大片原始熔岩地貌，廚師團隊走訪冰島農夫與漁民，將純天然地熱溫泉食材化為驚艷味蕾的極光盛宴。',
    address: 'Norðurljósavegur 9, 240 Grindavík, Iceland',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/The_blue_Lagoon%2C_Iceland_%285454151998%29.jpg/1280px-The_blue_Lagoon%2C_Iceland_%285454151998%29.jpg',
    images: ["https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/The_blue_Lagoon%2C_Iceland_%285454151998%29.jpg/1280px-The_blue_Lagoon%2C_Iceland_%285454151998%29.jpg","https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/The_blue_Lagoon%2C_Iceland_%285454149170%29.jpg/1280px-The_blue_Lagoon%2C_Iceland_%285454149170%29.jpg","https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Blue_Lagoon_Geothermal_pool_08.jpg/1280px-Blue_Lagoon_Geothermal_pool_08.jpg","https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Blue_Lagoon_Geothermal_pool_15.jpg/1280px-Blue_Lagoon_Geothermal_pool_15.jpg"],
    story: "坐落於藍湖 The Retreat 最高點的米其林一星餐廳，名字取自窗外覆蓋黑色火山熔岩數百年的厚實翠綠「冰島苔蘚（Icelandic Moss）」，象徵極地頑強而純淨的生命力。",
    trivia: "餐廳地底深處藏著一座直接鑿進 1226 年火山噴發熔岩層中的「天然熔岩酒窖（Lava Cove Wine Cellar）」，恆溫收藏全球頂級香檳與勃艮第紅酒！",
    mustDo: ["品嚐以冰島高地放牧小羊、野生海藻與地熱溫室蔬果創作的七道式火山星級菜單","參加侍酒師帶領的「地下800年火山熔岩洞穴酒窖」香檳品鑑之旅","透過全幅全景玻璃俯瞰夜色中散發神秘藍光的藍湖蒸氣"],
    dayOccurrences: [12],
  },
  {
    id: 'd-tides',
    name: 'Tides by Gunnar Karl Gíslason',
    originalName: 'Tides at The Reykjavik EDITION',
    city: '雷克雅維克',
    country: '冰島',
    flag: '🇮🇸',
    type: '現代冰島火烤海鮮與野味',
    highlight: '冰島第一位米其林星廚主理 · 現代潮奢氛圍開放式廚房',
    signatureDish: '冰島海螯蝦佐煙燻奶油、明火炭燒冰島特級羊肋排佐黑蒜泥',
    description:
      '坐落於 EDITION 飯店一樓。主廚 Gunnar Karl Gíslason 曾帶領冰島餐廳首度拿下米其林星級。餐廳以特製明火烤爐為核心，將剛上岸的北大西洋海產注入焦香炭烤風味。',
    address: 'Austurbakki 2, 101 Reykjavík, Iceland',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Things_to_do_in_Iceland_%289280871227%29.jpg/1280px-Things_to_do_in_Iceland_%289280871227%29.jpg',
    images: ["https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Things_to_do_in_Iceland_%289280871227%29.jpg/1280px-Things_to_do_in_Iceland_%289280871227%29.jpg","https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/The_grand_tour_%287985879663%29.jpg/1280px-The_grand_tour_%287985879663%29.jpg","https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Harpa_Tours_and_Packages-_Exciting_options_on_offer_%285719869007%29.jpg/1280px-Harpa_Tours_and_Packages-_Exciting_options_on_offer_%285719869007%29.jpg","https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/The_blue_Lagoon%2C_Iceland_%285454151998%29.jpg/1280px-The_blue_Lagoon%2C_Iceland_%285454151998%29.jpg"],
    story: "由曾為冰島摘下史上第一顆米其林星（Dill 餐廳）的國寶級主廚 Gunnar Karl Gíslason 掌舵，以北大西洋潮汐（Tides）為靈感，採用樺木明火直烤冰島頂級漁獲與放牧黑毛羊。",
    trivia: "早餐時段供應的「冰島天空優格（Skyr）佐野生烏鴉莓與現烤黑麥酸種麵包」，使用的是維京人流傳超過一千年的高蛋白低脂發酵乳菌種！",
    mustDo: ["品嚐樺木炭火直烤的「冰島野生海螯蝦（Langoustine）佐煙燻發酵奶油」","必點慢烤冰島放牧小羊鞍佐黑蒜泥與炭烤甜菜根","坐在面對舊港與埃斯亞山（Mt. Esja）的落地窗旁享用跨年大餐"],
    dayOccurrences: [13, 14],
  },
];

export const HotelDiningGuide: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'hotel' | 'dining'>('all');
  const [activeCountry, setActiveCountry] = useState<string>('全部');
  const [photoIndexMap, setPhotoIndexMap] = useState<Record<string, number>>({});

  const filteredHotels = LUXURY_HOTELS.filter(
    (h) => activeCountry === '全部' || h.country === activeCountry
  );

  const filteredDining = GOURMET_DINING.filter(
    (d) => activeCountry === '全部' || d.country === activeCountry
  );

  const cyclePhoto = (id: string, total: number, delta: number) => {
    setPhotoIndexMap((prev) => ({
      ...prev,
      [id]: ((prev[id] || 0) + delta + total) % total,
    }));
  };

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>十五日行程特輯 · 奢華住宿與美饌真實圖鑑（附小故事、小知識與必做清單）</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-white tracking-tight">
            北歐五國奢華飯店與米其林美饌巡禮
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed font-sans">
            嚴選 8 家殿堂級五星精品住宿與 13 間傳奇餐館，每處皆收錄多張真實網路核實攝影照片、歷史小故事、趣味小知識與必做體驗清單。
          </p>
        </div>
      </div>

      {/* Filter Segmented Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        {/* Category Switcher */}
        <div className="flex bg-slate-900 border border-slate-800 rounded-2xl p-1 text-xs font-semibold">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            全部奢華推薦
          </button>
          <button
            onClick={() => setActiveCategory('hotel')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
              activeCategory === 'hotel'
                ? 'bg-indigo-500 text-white shadow-md font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Bed className="w-3.5 h-3.5" />
            <span>頂級飯店 ({LUXURY_HOTELS.length})</span>
          </button>
          <button
            onClick={() => setActiveCategory('dining')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
              activeCategory === 'dining'
                ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UtensilsCrossed className="w-3.5 h-3.5" />
            <span>美饌餐廳 ({GOURMET_DINING.length})</span>
          </button>
        </div>

        {/* Country Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {['全部', '丹麥', '瑞典', '芬蘭', '挪威', '冰島'].map((c) => (
            <button
              key={c}
              onClick={() => setActiveCountry(c)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                activeCountry === c
                  ? 'bg-slate-700 text-white font-bold'
                  : 'text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Luxury Hotels Section */}
      {(activeCategory === 'all' || activeCategory === 'hotel') && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
            <Bed className="w-5 h-5 text-indigo-400" />
            <h2 className="text-xl font-serif font-bold text-white">
              精選 8 大頂級奢華下榻飯店
            </h2>
            <span className="text-xs font-mono text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded-full border border-indigo-800/40">
              {filteredHotels.length} 間飯店 · 多圖實景切換
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredHotels.map((h) => {
              const gallery = h.images && h.images.length > 0 ? h.images : [h.imageUrl];
              const curIdx = (photoIndexMap[h.id] || 0) % gallery.length;
              const curUrl = gallery[curIdx];

              return (
                <div
                  key={h.id}
                  className="group rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 hover:border-indigo-500/40 transition-all shadow-xl hover:shadow-2xl flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-60 overflow-hidden bg-slate-950">
                      <img
                        src={curUrl}
                        alt={h.name}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Stortorget_2006.jpg/1280px-Stortorget_2006.jpg';
                        }}
                      />
                      <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950/85 backdrop-blur-md text-white text-xs font-semibold border border-slate-800">
                        <span>{h.flag}</span>
                        <span>
                          {h.country} · {h.city}
                        </span>
                      </div>

                      <div className="absolute top-3 right-3 flex items-center gap-1.5">
                        <span className="px-2 py-1 rounded-lg bg-slate-950/85 text-emerald-300 text-[10px] font-mono border border-emerald-500/40">
                          📷 {curIdx + 1}/{gallery.length}
                        </span>
                        <div className="flex items-center gap-0.5 px-2 py-1 rounded-lg bg-amber-500 text-slate-950 text-xs font-bold shadow-md">
                          {[...Array(h.stars)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-current" />
                          ))}
                        </div>
                      </div>

                      {gallery.length > 1 && (
                        <>
                          <button
                            onClick={() => cyclePhoto(h.id, gallery.length, -1)}
                            className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-950/75 hover:bg-slate-900 text-white flex items-center justify-center border border-slate-700 cursor-pointer"
                            title="上一張實景圖"
                          >
                            ‹
                          </button>
                          <button
                            onClick={() => cyclePhoto(h.id, gallery.length, 1)}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-950/75 hover:bg-slate-900 text-white flex items-center justify-center border border-slate-700 cursor-pointer"
                            title="下一張實景圖"
                          >
                            ›
                          </button>
                        </>
                      )}
                    </div>

                    {/* Thumbnail strip */}
                    {gallery.length > 1 && (
                      <div className="px-6 py-2 bg-slate-950 border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto">
                        {gallery.map((gUrl, gIdx) => (
                          <button
                            key={gIdx}
                            onClick={() =>
                              setPhotoIndexMap((prev) => ({ ...prev, [h.id]: gIdx }))
                            }
                            className={`w-14 h-9 rounded-md overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                              gIdx === curIdx
                                ? 'border-indigo-400 scale-105'
                                : 'border-slate-800 opacity-60 hover:opacity-100'
                            }`}
                          >
                            <img
                              src={gUrl}
                              alt={`${h.name} ${gIdx + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    )}

                    <div className="p-6 space-y-3">
                      <div className="text-xs font-mono font-medium text-emerald-400">
                        行程安排下榻：{h.dayOccurrences.map((d) => `Day ${d}`).join('、')}
                      </div>
                      <h3 className="text-xl font-serif font-bold text-white leading-snug">
                        {h.name}
                      </h3>
                      <p className="text-xs text-indigo-300 font-semibold">
                        ✦ {h.highlight}
                      </p>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                        {h.description}
                      </p>

                      {h.story && (
                        <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 text-xs space-y-1">
                          <div className="font-bold text-amber-300">📖 飯店傳奇小故事</div>
                          <p className="text-amber-100/90 leading-relaxed">{h.story}</p>
                        </div>
                      )}

                      {h.trivia && (
                        <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/30 text-xs space-y-1">
                          <div className="font-bold text-cyan-300">💡 趣味小知識</div>
                          <p className="text-cyan-100/90 leading-relaxed">{h.trivia}</p>
                        </div>
                      )}

                      {h.mustDo && h.mustDo.length > 0 && (
                        <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs space-y-1.5">
                          <div className="font-bold text-emerald-300">✅ 入住必做的事</div>
                          <ul className="space-y-1 text-emerald-100/90 list-disc list-inside">
                            {h.mustDo.map((m, mIdx) => (
                              <li key={mIdx}>{m}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-6 pt-3 border-t border-slate-800/80 mt-2 flex items-center justify-between text-xs text-slate-400">
                    <span className="truncate max-w-[220px] flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                      {h.address}
                    </span>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        h.originalName + ' ' + h.city
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-medium transition-colors flex items-center gap-1 shrink-0"
                    >
                      <span>地圖導航</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Gourmet Dining Section */}
      {(activeCategory === 'all' || activeCategory === 'dining') && (
        <div className="space-y-4 pt-6">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
            <UtensilsCrossed className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-serif font-bold text-white">
              精選 13 家傳奇米其林與特色美饌
            </h2>
            <span className="text-xs font-mono text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-800/40">
              {filteredDining.length} 間餐館 · 多圖實景切換
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredDining.map((d) => {
              const gallery = d.images && d.images.length > 0 ? d.images : [d.imageUrl];
              const curIdx = (photoIndexMap[d.id] || 0) % gallery.length;
              const curUrl = gallery[curIdx];

              return (
                <div
                  key={d.id}
                  className="group rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 hover:border-amber-500/40 transition-all shadow-xl hover:shadow-2xl flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-48 overflow-hidden bg-slate-950">
                      <img
                        src={curUrl}
                        alt={d.name}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Stortorget_i_Gamla_Stan_i_Stockholm-2.JPG/1280px-Stortorget_i_Gamla_Stan_i_Stockholm-2.JPG';
                        }}
                      />
                      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-slate-950/85 backdrop-blur-md text-white text-[11px] font-semibold border border-slate-800">
                        <span>{d.flag}</span>
                        <span>{d.city}</span>
                      </div>

                      <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-lg bg-slate-950/85 text-amber-300 text-[10px] font-mono border border-amber-500/40">
                        📷 {curIdx + 1}/{gallery.length}
                      </div>

                      <div className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded bg-amber-500/90 text-slate-950 text-[10px] font-bold">
                        {d.type}
                      </div>

                      {gallery.length > 1 && (
                        <>
                          <button
                            onClick={() => cyclePhoto(d.id, gallery.length, -1)}
                            className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-slate-950/75 hover:bg-slate-900 text-white flex items-center justify-center border border-slate-700 cursor-pointer"
                          >
                            ‹
                          </button>
                          <button
                            onClick={() => cyclePhoto(d.id, gallery.length, 1)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-slate-950/75 hover:bg-slate-900 text-white flex items-center justify-center border border-slate-700 cursor-pointer"
                          >
                            ›
                          </button>
                        </>
                      )}
                    </div>

                    {gallery.length > 1 && (
                      <div className="px-5 py-1.5 bg-slate-950 border-b border-slate-800/80 flex items-center gap-1.5 overflow-x-auto">
                        {gallery.map((gUrl, gIdx) => (
                          <button
                            key={gIdx}
                            onClick={() =>
                              setPhotoIndexMap((prev) => ({ ...prev, [d.id]: gIdx }))
                            }
                            className={`w-12 h-8 rounded overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                              gIdx === curIdx
                                ? 'border-amber-400 scale-105'
                                : 'border-slate-800 opacity-60 hover:opacity-100'
                            }`}
                          >
                            <img
                              src={gUrl}
                              alt={`${d.name} ${gIdx + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    )}

                    <div className="p-5 space-y-2.5">
                      <div className="text-[11px] font-mono font-medium text-emerald-400">
                        建議造訪：{d.dayOccurrences.map((day) => `Day ${day}`).join('、')}
                      </div>
                      <h3 className="text-base sm:text-lg font-serif font-bold text-white leading-snug">
                        {d.name}
                      </h3>
                      <div className="p-2.5 rounded-xl bg-slate-950 border border-amber-900/30 text-[11px] text-amber-300">
                        <span className="font-bold">招牌必點：</span>
                        <span>{d.signatureDish}</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed font-sans">
                        {d.description}
                      </p>

                      {d.story && (
                        <div className="p-2.5 rounded-xl bg-amber-950/20 border border-amber-500/30 text-[11px] space-y-0.5">
                          <div className="font-bold text-amber-300">📖 餐廳小故事</div>
                          <p className="text-amber-100/90 leading-relaxed">{d.story}</p>
                        </div>
                      )}

                      {d.trivia && (
                        <div className="p-2.5 rounded-xl bg-cyan-950/20 border border-cyan-500/30 text-[11px] space-y-0.5">
                          <div className="font-bold text-cyan-300">💡 美食小知識</div>
                          <p className="text-cyan-100/90 leading-relaxed">{d.trivia}</p>
                        </div>
                      )}

                      {d.mustDo && d.mustDo.length > 0 && (
                        <div className="p-2.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-[11px] space-y-1">
                          <div className="font-bold text-emerald-300">✅ 饕客必做的事</div>
                          <ul className="space-y-0.5 text-emerald-100/90 list-disc list-inside">
                            {d.mustDo.map((m, mIdx) => (
                              <li key={mIdx}>{m}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-5 pt-3 border-t border-slate-800/80 mt-2 flex items-center justify-between text-xs text-slate-400">
                    <span className="truncate max-w-[160px] text-[11px]">
                      📍 {d.address}
                    </span>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        d.originalName + ' ' + d.city
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[11px] font-medium transition-colors flex items-center gap-1 shrink-0"
                    >
                      <span>位置</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
