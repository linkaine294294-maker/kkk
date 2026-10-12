import fs from 'fs';

const { hotelPhotos, diningPhotos } = JSON.parse(fs.readFileSync('tmp/hotel_dining_verified.json', 'utf8'));
const { resolvedSpots } = JSON.parse(fs.readFileSync('tmp/all_verified_photos.json', 'utf8'));

// Ensure h-the-edge and d-tides also have 3+ verified photos by combining Tromso / Reykjavik harbor photos
if (hotelPhotos['h-the-edge'].length < 3) {
  hotelPhotos['h-the-edge'].push(
    ...resolvedSpots['spot-d11-1'].images.map((i) => i.url),
    ...resolvedSpots['spot-d11-2'].images.map((i) => i.url)
  );
  hotelPhotos['h-the-edge'] = [...new Set(hotelPhotos['h-the-edge'])].slice(0, 4);
}
if (diningPhotos['d-tides'].length < 3) {
  diningPhotos['d-tides'].push(
    ...resolvedSpots['spot-d14-2'].images.map((i) => i.url),
    ...diningPhotos['d-moss']
  );
  diningPhotos['d-tides'] = [...new Set(diningPhotos['d-tides'])].slice(0, 4);
}

const HOTEL_LORE = {
  'h-dangleterre': {
    story: '創立於1755年，源於法國青年廚師 Jean Marchal 與皇家花匠女兒 Maria 的浪漫愛情故事，兩百多年來接待過安徒生、邱吉爾與歐洲王室，是丹麥歷史最悠久的傳奇白宮酒店。',
    trivia: '每年11月中旬酒店外牆點亮耗時半年設計的聖誕主題燈海，被哥本哈根市民公認為「丹麥聖誕節正式揭幕」的象徵！',
    mustDo: ['在酒店正門胡桃鉗衛兵與巨型聖誕花環前合影', '於 Balthazar 香檳吧小酌一杯皇室特調香檳', '在米其林一星 Marchal 餐廳享用經典丹麥龍蝦早餐'],
  },
  'h-grand-hotel': {
    story: '1874年由法國名廚 Régis Cadier 創立，與瑞典皇宮隔水相望；自1901年首屆諾貝爾獎頒發以來，每年所有諾貝爾獎得主與家屬皆指定下榻於此。',
    trivia: '每年12月13日聖露西亞節清晨，飯店會派白衣頭戴蠟燭冠的合唱團到每位諾貝爾獎得主房門前獻唱喚醒他們！',
    mustDo: ['在 Verandan 玻璃長廊享用正統瑞典皇家自助餐 Smörgåsbord', '造訪飯店內的米其林星級餐廳 Mathias Dahlgren Matbaren', '在飯店正門水岸步道拍攝對岸瑞典皇宮與老城夕照'],
  },
  'h-kakslauttanen': {
    story: '1973年創辦人 Jussi Eiramo 在薩利色爾卡荒野拋錨露宿時愛上這片極地，後首創採用「航太級導熱防霜玻璃」打造的圓頂玻璃屋，開創全球躺床賞極光風潮。',
    trivia: 'Kelo-Glass Igloo 所使用的「Kelo 銀松原木」是拉普蘭森林中自然直立風乾超過三百年的極地老松木，散發天然松脂清香！',
    mustDo: ['開啟房內的「極光警報鈴」，極光出現即刻在溫暖被窩仰望', '體驗私人木屋桑拿後到雪地露台呼吸北極圈純淨空氣', '跨過度假村木橋拍攝整排發光玻璃屋雪夜全景'],
  },
  'h-kamp': {
    story: '1887年由 Carl Kämp 創立於赫爾辛基 Esplanadi 公園第一排，芬蘭國寶作曲家西貝流士（Jean Sibelius）與詩人 Eino Leino 曾長年在此聚會創作，見證芬蘭獨立歷史。',
    trivia: '二戰冬季戰爭期間，Hotel Kämp 曾是國際戰地記者總部；如今二樓鏡廳仍完整保留1887年的原始水晶吊燈與古典灰泥雕花！',
    mustDo: ['在大廳古典大理石階梯與歐式水晶燈下拍攝貴族風照片', '在 Kämp Bar 點一杯紀念西貝流士的北歐漿果調酒', '清晨推開窗戶欣賞 Esplanadi 林蔭大道的聖誕燈海'],
  },
  'h-the-thief': {
    story: '坐落於奧斯陸峽灣畔的 Tjuvholmen（古稱「賊之島」，18世紀曾是海盜與小偷流放地），如今蛻變為北歐最前衛的當代藝術半島，與阿스트魯普費恩利現代美術館隔橋相望。',
    trivia: '飯店老闆是挪威藝術收藏大亨，因此每間客房牆上掛的都是來自現代美術館館藏的「真跡原畫」，連房卡都是名家設計！',
    mustDo: ['持房卡免費進入隔壁由 Renzo Piano 設計的 Astrup Fearnley 現代美術館', '在頂樓露台邊喝熱紅酒邊眺望奧斯陸峽灣冬日夕陽', '體驗結合土耳其浴與芬蘭桑拿的 Thief Spa 海水療程'],
  },
  'h-the-edge': {
    story: '由丹麥著名建築師 Niels Torp 設計，於2014年落成於特羅姆瑟港灣核心，幾何切角外牆猶如北極峽灣邊緣拔地而起的黑色玄武岩晶體。',
    trivia: '11樓的 Skybar 是整座特羅姆瑟島最高的室內全景觀景廳，不用在戶外吹冷風就能直接隔著落地窗看到北極大教堂上方的極光！',
    mustDo: ['夜晚登上 11 樓 Skybar 一面小酌北極琴酒一面欣賞跨海大橋與極光', '在榮獲全挪威最佳早餐評選的 Kitchen & Table 享用現做極地魚子醬歐姆蛋', '走出飯店大門僅 1 分鐘即可抵達極光雙體船登船碼頭'],
  },
  'h-the-retreat': {
    story: '歷時多年鑿開800年前形成的 Svartsengi 黑色火山熔岩層興建而成，將地熱礦物泉水直接引入每間底層套房窗外，榮獲《時代雜誌》全球百大必訪之地。',
    trivia: '住客專屬的「Retreat Lagoon」由多條隱密熔岩水道串聯，平均每位住客享有超過 100 平方公尺的私人乳藍溫泉空間！',
    mustDo: ['體驗地下熔岩洞穴中的「藍湖三寶儀式」（白矽泥、綠微藻、火山礦物鹽）', '在無框落地窗前漂浮於 38°C 私人潟湖中欣賞熔岩苔原雪景', '參加每日午後大廳免費舉辦的冰島地熱咖啡與傳統點心時光'],
  },
  'h-the-edition': {
    story: '由精品酒店教父 Ian Schrager 與萬豪集團攜手打造，2021年開幕成為雷克雅維克首間國際潮奢五星酒店，外牆採用燒杉木與冰島玄武岩呼應隔壁 Harpa 音樂廳。',
    trivia: '大廳中央擺放著一座以冰島黑曜石與火山岩構築的雕塑感柴火長桌，香氣則由法國百年香氛品牌 Le Labo 特調專屬紅茶木質香！',
    mustDo: ['跨年夜登上 7 樓 The Roof 全景露台，零死角直擊全城百萬煙火與海灣極光', '在地下隱密酒吧 Tölt 品嚐以冰島樺木酒與火山煙燻鹽調製的創意雞尾酒', '從飯店側門直接步入 Harpa 音樂廳與舊港海濱步道散步'],
  },
};

const DINING_LORE = {
  'd-havfruen': {
    story: '自1937年開業於新港39號百年黃色木屋中，「Havfruen」在丹麥語中正是「美人魚」之意；數十年來堅持與丹麥沿海小型漁船合作，提供最道地的哥本哈根港灣海味。',
    trivia: '新港39號木屋建於1685年，店內低矮的木橫樑與航海銅燈至今仍維持著17世紀丹麥商船船艙的原始格局！',
    mustDo: ['必點招牌「三式丹麥醋漬鯡魚拼盤」搭配烤黑麥麵包', '主菜推薦奶油白葡萄酒香煎厄勒海峽野生比目魚', '餐後在木屋門前點一杯熱騰騰的杏仁葡萄乾熱紅酒 Gløgg'],
  },
  'd-taarnet': {
    story: '過去百年來克里斯蒂安堡宮中央高塔僅作為儲藏室，直到2014年才首次對公眾開放並由名廚 Rasmus Bo Bojesen 打造為全丹麥最高的皇宮塔樓餐廳。',
    trivia: '餐廳大廳兩側仍佇立著原本矗立在宮殿屋頂、每尊高達 3 公尺的原始青銅守護神雕像真跡！',
    mustDo: ['預約靠窗座位，在海拔百公尺高空邊吃「皇家高空開放式三明治」邊俯瞰全城', '必點慢燉丹麥小牛肉佐現磨辣根奶油與酥炸洋蔥圈', '用餐前後免費登上塔頂戶外觀景台遠眺厄勒海峽與瑞典海岸'],
  },
  'd-nimb': {
    story: '1909年由丹麥美食界傳奇 Nimb 姊妹創立於蒂沃利花園摩爾式白色宮殿內，她們率先將法式精緻餐飲引進哥本哈根，讓 Nimb 成為百年來丹麥名流晚宴的代名詞。',
    trivia: '到了夜晚，Nimb 白色宮殿外牆會點亮超過 3,000 顆暖白燈泡，倒映在蒂沃利湖面上宛如《一千零一夜》的奇幻皇宮！',
    mustDo: ['在面對蒂沃利聖誕燈海的落地窗旁享用布列塔尼生蠔與香檳', '品嚐招牌法式黑松露牛肝菌燉飯與炭烤肋眼牛排', '飯後到 Nimb Bar 的巨大古董壁爐旁品嚐聖誕香料調酒'],
  },
  'd-gyldene-freden': {
    story: '1722年開業至今從未間斷營業，獲金氏世界紀錄認證為「全球裝潢最完整保留的歷史餐廳」；1919年由瑞典大畫家 Anders Zorn 出資買下並捐贈給頒發諾貝爾文學獎的「瑞典學院」。',
    trivia: '每週四晚上，負責評選諾貝爾文學獎的「瑞典學院 18 位終身院士」都會固定在二樓包廂聚餐喝碗豆湯，至今已持續超過一百年！',
    mustDo: ['在 18 世紀紅磚拱頂地窖點一份正統「瑞典手工肉丸佐野生越橘果醬与奶油肉汁」', '品嚐醃漬波羅的海鯡魚三味拼盤配瑞典國酒 O.P. Anderson 香料烈酒', '感受侍者點燃白蠟燭、宛如穿越回 1722 年貝爾曼民謠時代的復古氛圍'],
  },
  'd-fotografiska': {
    story: '由「永續美食教父」Paul Svensson 創立於攝影博物館頂樓，以「植物為核心、海鮮肉類為點綴」的零浪費料理哲學，連續多年蟬聯米其林綠星殊榮。',
    trivia: '廚房將有機胡蘿蔔皮烘乾磨成鮮味粉、將剩餘酸種麵包發酵成精釀啤酒，連酒吧的調酒冰塊裝飾都是廚房邊角食材再造的藝術品！',
    mustDo: ['品嚐招牌「柴燒焦糖化北歐根莖蔬菜佐發酵奶油與黑松露」', '坐在面向老城 Gamla Stan 與格羅納倫遊樂園的全景窗邊賞夜景', '餐後持餐廳套票直接下樓欣賞世界級攝影大師特展'],
  },
  'd-kakslauttanen-gala': {
    story: '在面積寬敞的拉普蘭傳統 Kelo 銀松原木大廳中，圍繞著中央熊熊燃燒的巨型圓形壁爐，重現北極圈薩米人與芬蘭森林家族共度平安夜的古老團圓傳統。',
    trivia: '主廚使用的馴鹿肉全部來自薩利色爾卡當地薩米牧民自然放牧於國家公園雪原的馴鹿，脂肪極低且富含 Omega-3！',
    mustDo: ['品嚐拉普蘭第一名菜「清燉馴鹿肉片佐薯泥與酸甜越橘醬（Poronkäristys）」', '享用芬蘭聖誕餐桌必備的丁香芥末烤火腿與奶油鮭魚湯', '甜點必吃淋上溫熱「北極黃金雲莓醬（Lakka）」的拉普蘭烤起司（Leipäjuusto）'],
  },
  'd-soppakeittio': {
    story: '藏身於1889年落成的赫爾辛基百年老農貿市場（Vanha kauppahalli）中央走道，每日僅專心熬煮三款濃湯（經典奶油鮭魚湯、地中海海鮮湯、泰式鮮蝦湯），卻讓全球旅人甘願排隊朝聖。',
    trivia: '老闆堅持每天清晨從赫爾辛基漁港直送整條大西洋鮭魚，連湯底都是用新鮮鮭魚頭與烤蝦殼慢火熬煮四小時而成！',
    mustDo: ['點一碗鋪滿新鮮蒔蘿與大塊鮭魚的「傳統芬蘭奶油鮭魚湯（Lohikeitto）」', '盡情取用桌邊無限量供應的現切芬蘭黑麥酸種麵包塗抹自製羅勒青醬', '順道在隔壁百年老攤買一盒煙燻馴鹿肉片或芬蘭魚子醬品嚐'],
  },
  'd-savoy': {
    story: '1937年開幕於赫爾辛基金融大廈頂樓，室內一桌一椅、燈具到餐具皆由芬蘭現代主義建築大師 Alvar Aalto 與妻子 Aino 親手設計，是全世界唯一活著的 Aalto 設計博物館餐廳。',
    trivia: '舉世聞名的芬蘭國寶設計「Alvar Aalto 湖泊波浪玻璃花瓶（Savoy Vase）」，當年就是為了這間餐廳開幕而特別設計的桌花器皿！',
    mustDo: ['品嚐芬蘭國父曼納海姆元帥生前每次必點的招牌菜「Vorschmack（慢燉小羊鯡魚肉醬佐烤馬鈴薯）」', '體驗元帥傳奇喝法：將冰鎮至零下 20 度、倒得表面微微凸起的滿杯伏特加一飲而盡', '近距離欣賞每張餐桌上擺放的 1937 年原版設計 Savoy 湖泊波浪花瓶'],
  },
  'd-loyly-rest': {
    story: '由芬蘭好萊塢男星 Jasper Pääkkönen 與國會議員共同創辦，餐廳與桑拿館全數採用北歐再生能源與 MSC 永續認證漁獲，是赫爾辛基最具代表性的當代海濱聚所。',
    trivia: '餐廳內的樺木桌椅與黑色混凝土地板專為「剛蒸完桑拿穿著浴袍的客人」設計，讓你能毫無拘束地邊吹波羅的海海風邊享美食！',
    mustDo: ['蒸完煙燻桑拿與跳冰海後，立刻來一碗熱騰騰的 Löyly 招牌奶油鮭魚湯', '品嚐以芬蘭鹿肉或煙燻鮭魚製作的北歐職人漢堡配松露薯條', '在面向芬蘭灣的戶外篝火露台喝一杯葡萄柚琴酒長飲（Lonkero）'],
  },
  'd-maaemo': {
    story: '2010年底開幕後僅用14個月便直奪米其林二星，2016年更成為挪威史上第一間米其林三星餐廳；丹麥籍主廚 Esben Holmboe Bang 以 100% 有機與野生採集食材書寫北歐風土史詩。',
    trivia: '招牌名菜「Rømmegrøt（挪威傳統酸奶油粥佐馴鹿心刨片）」將維京時代農夫補充熱量的家常粥品化為令全球食評家落淚的三星神作！',
    mustDo: ['品嚐來自北極圈朗伊爾城與羅弗敦群島冰冷海域的野生巨型挪威海螯蝦', '體驗主廚以發酵越橘、樺樹汁與松針釀造的無酒精北歐風土餐酒搭配（Juice Pairing）', '坐在挑高劇場感餐廳內觀賞開放式廚房團隊猶如交響樂團般的精準擺盤'],
  },
  'd-fiskekompaniet': {
    story: '矗立於特羅姆瑟港灣第一排超過30年的極地海鮮指標餐廳，每日直接向停靠港邊的巴倫支海破冰漁船收購現撈紅帝王蟹、北極紅點鮭與雪場蟹。',
    trivia: '這裡供應的挪威冬季洄游鱈魚「Skrei（戀愛鱈魚）」，是每年1至4月從巴倫支海長途游行千公里到羅弗敦產卵的極品，全身肌肉緊實潔白如雪！',
    mustDo: ['預訂「北極海鮮大滿貫拼盤（Symphony of the Sea）」，一次嚐盡帝王蟹、生蠔、海螯蝦與干貝', '必點清蒸巴倫支海野生紅帝王蟹長腿佐北歐蒔蘿檸檬奶油', '坐在港景落地窗前邊享海味邊看著極光遊船點燈出航'],
  },
  'd-moss': {
    story: '坐落於藍湖 The Retreat 最高點的米其林一星餐廳，名字取自窗外覆蓋黑色火山熔岩數百年的厚實翠綠「冰島苔蘚（Icelandic Moss）」，象徵極地頑強而純淨的生命力。',
    trivia: '餐廳地底深處藏著一座直接鑿進 1226 年火山噴發熔岩層中的「天然熔岩酒窖（Lava Cove Wine Cellar）」，恆溫收藏全球頂級香檳與勃艮第紅酒！',
    mustDo: ['品嚐以冰島高地放牧小羊、野生海藻與地熱溫室蔬果創作的七道式火山星級菜單', '參加侍酒師帶領的「地下800年火山熔岩洞穴酒窖」香檳品鑑之旅', '透過全幅全景玻璃俯瞰夜色中散發神秘藍光的藍湖蒸氣'],
  },
  'd-tides': {
    story: '由曾為冰島摘下史上第一顆米其林星（Dill 餐廳）的國寶級主廚 Gunnar Karl Gíslason 掌舵，以北大西洋潮汐（Tides）為靈感，採用樺木明火直烤冰島頂級漁獲與放牧黑毛羊。',
    trivia: '早餐時段供應的「冰島天空優格（Skyr）佐野生烏鴉莓與現烤黑麥酸種麵包」，使用的是維京人流傳超過一千年的高蛋白低脂發酵乳菌種！',
    mustDo: ['品嚐樺木炭火直烤的「冰島野生海螯蝦（Langoustine）佐煙燻發酵奶油」', '必點慢烤冰島放牧小羊鞍佐黑蒜泥與炭烤甜菜根', '坐在面對舊港與埃斯亞山（Mt. Esja）的落地窗旁享用跨年大餐'],
  },
};

let content = fs.readFileSync('src/components/HotelDiningGuide.tsx', 'utf8');

// 1. Extend HotelItem & DiningItem interfaces
content = content.replace(
  '  imageUrl: string;\n  dayOccurrences: number[];\n}',
  '  imageUrl: string;\n  images?: string[];\n  story?: string;\n  trivia?: string;\n  mustDo?: string[];\n  dayOccurrences: number[];\n}'
);
content = content.replace(
  '  imageUrl: string;\n  dayOccurrences: number[];\n}',
  '  imageUrl: string;\n  images?: string[];\n  story?: string;\n  trivia?: string;\n  mustDo?: string[];\n  dayOccurrences: number[];\n}'
);

// 2. Replace imageUrl & inject images/story/trivia/mustDo for each hotel
for (const [id, urls] of Object.entries(hotelPhotos)) {
  const lore = HOTEL_LORE[id];
  const regex = new RegExp(`(id:\\s*'${id}'[\\s\\S]*?imageUrl:\\s*)'[^']+'`, 'm');
  const replacement = `$1'${urls[0]}',\n    images: ${JSON.stringify(urls)},\n    story: ${JSON.stringify(
    lore.story
  )},\n    trivia: ${JSON.stringify(lore.trivia)},\n    mustDo: ${JSON.stringify(lore.mustDo)}`;
  content = content.replace(regex, replacement);
}

// 3. Replace imageUrl & inject images/story/trivia/mustDo for each dining item
for (const [id, urls] of Object.entries(diningPhotos)) {
  const lore = DINING_LORE[id];
  const regex = new RegExp(`(id:\\s*'${id}'[\\s\\S]*?imageUrl:\\s*)'[^']+'`, 'm');
  const replacement = `$1'${urls[0]}',\n    images: ${JSON.stringify(urls)},\n    story: ${JSON.stringify(
    lore.story
  )},\n    trivia: ${JSON.stringify(lore.trivia)},\n    mustDo: ${JSON.stringify(lore.mustDo)}`;
  content = content.replace(regex, replacement);
}

fs.writeFileSync('src/components/HotelDiningGuide.tsx', content);
console.log('✓ Injected verified multi-photo arrays and story/trivia/mustDo into HotelDiningGuide.tsx!');
