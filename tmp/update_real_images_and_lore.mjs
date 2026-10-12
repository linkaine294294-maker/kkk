import fs from 'fs';

async function searchCommons(query, limit = 5) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrsearch=${encodeURIComponent(
    'filetype:bitmap ' + query
  )}&gsrlimit=${limit}&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=1280&format=json`;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': 'NordicExpeditionGuide/2.0 (https://example.org)' },
      });
      const data = await res.json();
      const pages = Object.values(data.query?.pages || {});
      const results = [];
      for (const p of pages) {
        const ii = p.imageinfo?.[0];
        if (!ii) continue;
        let imgUrl = (ii.thumburl || ii.url || '').split('?')[0];
        imgUrl = imgUrl.replace('https://thumb.wikimedia.org/', 'https://upload.wikimedia.org/');
        if (imgUrl && /\.(jpg|jpeg|png|webp)$/i.test(imgUrl)) {
          results.push({
            url: imgUrl,
            author: (ii.extmetadata?.Artist?.value || 'Wikimedia Commons Photographer').replace(/<[^>]+>/g, '').trim().slice(0, 60),
            license: (ii.extmetadata?.LicenseShortName?.value || 'CC BY-SA 4.0').replace(/<[^>]+>/g, '').trim(),
          });
        }
      }
      if (results.length > 0) return results;
    } catch (e) {
      // retry
    }
  }
  return [];
}

const SPOT_METADATA = {
  'd1-1': {
    query: 'Copenhagen Airport terminal',
    captions: ['哥本哈根凱斯楚普國際機場航廈實景', '北歐松木地板與極簡採光大廳', '哥本哈根機場抵達長廊與指示牌'],
    story: '1925年啟用的凱斯楚普機場是全球最早的民用機場之一，1998年落成的第三航廈由丹麥建築大師 Vilhelm Lauritzen 設計，以飛鳥展翼般的流線屋頂迎接世界各地旅人。',
    trivia: '機場內全面鋪設溫潤的北歐Dinesen花旗松實木地板，是全世界極少數全木質地板的國際機場！',
    mustDo: ['在第三航廈巨型玻璃帷幕與木地板長廊拍照打卡', '品嚐機場內丹麥百年烘培坊 Lagkagehuset 的肉桂捲', '搭乘全自動無人駕駛 Metro M2 線 15 分鐘直達國王新廣場'],
  },
  'd1-2': {
    query: 'Hotel d Angleterre Copenhagen Kongens Nytorv',
    captions: ['哥本哈根 d’Angleterre 白宮傳奇五星酒店外觀', '國王新廣場前的聖誕皇家燈飾', 'd’Angleterre 百年新古典主義大廳與水晶吊燈'],
    story: '創立於1755年的 Hotel d’Angleterre 源於皇室廚師 Jean Marchal 與花匠女兒 Maria 的浪漫聯姻，兩百多年來接待過安徒生、邱吉爾與歐洲各國王室。',
    trivia: '每年11月中旬酒店外牆點亮耗時數月設計的聖誕主題燈飾，被哥本哈根市民視為「聖誕節正式開始」的信號！',
    mustDo: ['在酒店正門胡桃鉗衛兵與巨型聖誕花環前合影', '於 Balthazar 香檳吧小酌一杯皇室特調香檳', '在米其林星級 Marchal 餐廳享用經典丹麥龍蝦早餐'],
  },
  'd1-3': {
    query: 'Nyhavn Copenhagen colorful houses canal boats',
    captions: ['哥本哈根新港彩色山牆木屋與古帆船實景', '新港運河畔安徒生故居與石板步道', '新港傍晚暖黃燈火倒映運河水面'],
    story: '1670年代由克里斯蒂安五世國王下令瑞典戰俘開鑿人工運河，昔日曾是水手與酒館雲集的繁華碼頭；童話大師安徒生曾先後在18號、20號與67號居住長達近20年。',
    trivia: '新港9號建於1681年，是整條運河上最古老且從未改建過的原始藍色山牆老屋！',
    mustDo: ['尋找新港 20 號（安徒生寫下《打火匣》與《豌豆公主》的故居）', '手捧一杯冒著熱氣的肉桂熱紅酒 Gløgg 沿著運河漫步', '在停泊百年的雙桅木造古帆船與彩色木屋倒影前拍全景照'],
  },
  'd1-4': {
    query: 'Tivoli Gardens Copenhagen Christmas lights',
    captions: ['哥本哈根蒂沃利花園璀璨夜色與童話建築', '蒂沃利花園百年歷史園區與湖畔倒影', '蒂沃利花園冬日聖誕燈海與旋轉木馬'],
    story: '1843年由創辦人 Georg Carstensen 向國王進言「當人民在娛樂時便不會空想政治」而獲准興建，安徒生曾在此找尋《夜鶯》靈感，華特迪士尼更親臨考察並以此啟發創立迪士尼樂園。',
    trivia: '園內的木造雲霄飛車 Rutschebanen 建於1914年，至今仍有一位專業煞車員坐在列車中央手動控制下坡速度！',
    mustDo: ['體驗 1914 年骨董木造雲霄飛車與高空天女散花旋轉椅', '在蒂沃利湖畔欣賞結合北歐交響樂的水舞雷射燈光秀', '品嚐丹麥聖誕限定傳統圓球鬆餅 Æbleskiver 配覆盆子果醬'],
  },
  'd2-1': {
    query: 'The Little Mermaid Copenhagen statue Langelinie',
    captions: ['長堤公園海濱的小美人魚百年青銅雕像實景', '小美人魚靜坐花崗岩石凝望厄勒海峽', '哥本哈根海濱長堤公園與小美人魚全景'],
    story: '1913年由嘉士伯啤酒第二代傳人 Carl Jacobsen 觀賞皇家芭蕾《小美人魚》後深受感動而捐贈。雕塑家 Edvard Eriksen 以首席芭蕾舞伶 Ellen Price 的臉龐與自己妻子 Eline 的身軀塑造而成。',
    trivia: '這座舉世聞名的雕像其實高僅 125 公分、重 175 公斤，比大多數遊客想像中更嬌小溫婉！',
    mustDo: ['站在長堤海岸步道以厄勒海峽為背景與小美人魚同框', '順道參觀旁邊氣勢磅礡的吉菲昂噴泉（Gefion Fountain）', '沿著星形卡斯特雷特要塞（Kastellet）紅牆護城河散步'],
  },
  'd2-2': {
    query: 'Amalienborg Palace Copenhagen square guard',
    captions: ['阿馬林堡宮八角廣場與腓特烈五世騎馬銅像', '丹麥皇家衛隊熊皮帽哨兵交接儀式', '阿馬林堡宮四座洛可可式宮殿與大理石教堂圓頂'],
    story: '原為四戶丹麥貴族於1750年代興建的洛可可宅邸，1794年克里斯蒂安堡宮遭大火焚毀後，王室緊急購入此處作為冬宮，並沿用至今成為丹麥君主正式居所。',
    trivia: '觀察宮殿屋頂是否升起丹麥國旗「丹尼布洛（Dannebrog）」，就能立刻知道國王或王后今天是否正在宮中！',
    mustDo: ['正午 12:00 準時觀賞頭戴黑熊皮高帽的皇家衛隊樂隊交接', '站在八角廣場中央軸線拍攝腓特烈大理石教堂壯麗圓頂', '參觀克里斯蒂安八世宮內的皇家歷史博物館書房'],
  },
  'd2-3': {
    query: 'Rosenborg Castle Copenhagen garden',
    captions: ['羅森堡宮荷蘭文藝復興式紅磚城堡與護城河', '國王花園內的羅森堡宮尖塔倒影', '丹麥皇室加冕王冠與寶石珍藏殿堂'],
    story: '1606年由丹麥傳奇國王克里斯蒂安四世親自參與設計的夏日離宮，地下金庫珍藏著鑲嵌藍寶石與鑽石的克里斯蒂安四世王冠及王室加冕權杖。',
    trivia: '宮殿三樓長廳入口守護著三尊真人大小的17世紀純銀獅子，每逢丹麥君主國葬時仍會被請出護衛靈柩！',
    mustDo: ['進入地下皇家寶庫近距離鑑賞克里斯蒂安四世純金琺瑯王冠', '在三樓騎士長廳尋找三尊17世紀皇家純銀雄獅與獨角鯨牙王座', '漫步國王花園林蔭大道拍攝城堡紅磚與青銅屋頂倒影'],
  },
  'd2-4': {
    query: 'Christiansborg Palace Copenhagen tower canal',
    captions: ['克里斯蒂安堡宮花崗岩外牆與106公尺高塔', '城堡島運河畔的克里斯蒂安堡宮全景', '克里斯蒂安堡宮皇家接待廳與巴洛克馬場'],
    story: '坐落於哥本哈根發源地「城堡島（Slotsholmen）」，曾兩度毀於祝融並三度重建；今日是全世界唯一同時容納國會、最高法院與首相辦公室（三權合一）及皇家接待廳的宮殿。',
    trivia: '宮殿地底仍完整保留著西元 1167 年阿布薩隆主教興建第一代哥本哈根城堡的古老石造遺址！',
    mustDo: ['免費搭乘電梯登上 106 公尺高的宮殿塔樓俯瞰全城紅瓦屋頂', '參觀女王會客廳內描繪丹麥千年歷史的 17 幅巨型現代掛毯', '造訪宮殿後方的皇家馬廄一睹純白皇家馬匹與黃金馬車'],
  },
  'd2-5': {
    query: 'Smørrebrød Danish open sandwich restaurant',
    captions: ['丹麥傳統高空開放式三明治 Smørrebrød 精緻擺盤', '哥本哈根百年皇家地窖餐廳餐桌風情', '煙燻鮭魚、酥炸比目魚與手剝甜蝦三明治配阿誇維特酒'],
    story: '開放式黑麥三明治 Smørrebrød 起源於19世紀丹麥農夫將前晚剩肉鋪在塗滿奶油的黑麥麵包上當午餐，後經哥本哈根名廚昇華為層次繁複的國宴級冷盤藝術。',
    trivia: '正統丹麥人吃 Smørrebrød 絕對不拿起來咬，而是必須優雅地使用刀叉，並依「先醃漬鯡魚、後海鮮、最後起司肉類」的順序品嚐！',
    mustDo: ['品嚐經典「酥炸比目魚佐檸檬瑞莫拉醬」與「醋漬鯡魚」口味', '舉杯體驗一口冰鎮小茴香烈酒 Akvavit 配一口丹麥精釀啤酒', '在歷史地窖餐廳高呼丹麥祝酒詞「Skål!（乾杯）」'],
  },
  'd3-1': {
    query: 'Öresund Bridge train Sweden Denmark',
    captions: ['橫跨厄勒海峽連接丹麥與瑞典的跨海大橋', '高速列車馳騁於厄勒海峽大橋與人工島佩伯霍姆', '斯堪地那維亞冬季森林與冰封湖泊鐵道風光'],
    story: '2000年通車的厄勒海峽大橋結合了8公里斜張橋、4公里人工島（Peberholm）與4公里海底隧道，讓哥本哈根與瑞典南部連為一體，也是北歐犯罪影集《The Bridge》的舞台。',
    trivia: '為了避免橋塔干擾哥本哈根機場航班起降，大橋在海中央的人工島直接「潛入海底」化為海底隧道！',
    mustDo: ['在列車跨越厄勒海峽大橋最高點時俯瞰波羅的海蔚藍海面', '在頭等車廂享用瑞典傳統肉桂捲配現煮黑咖啡（Fika）', '沿途欣賞南瑞典斯莫蘭（Småland）紅木屋與冰封湖泊雪景'],
  },
  'd3-2': {
    query: 'Grand Hotel Stockholm waterfront winter',
    captions: ['斯德哥爾摩大飯店（Grand Hôtel）水岸皇室建築外觀', '從皇宮對岸眺望斯德哥爾摩大飯店與遊船碼頭', 'Grand Hôtel 鏡廳與水晶燈奢華內裝'],
    story: '1874年由法國名廚 Régis Cadier 創立，與瑞典皇宮隔水相望；自1901年首屆諾貝爾獎頒發以來，每年所有諾貝爾獎得主與家屬皆指定下榻於此。',
    trivia: '每年12月13日聖露西亞節清晨，飯店會派白衣蠟燭合唱團到每位諾貝爾獎得主房門前獻唱喚醒他們！',
    mustDo: ['在飯店經典 Verandan 玻璃長廊享用正統瑞典皇家自助餐 Smörgåsbord', '造訪飯店內的米其林星級餐廳 Mathias Dahlgren Matbaren', '在飯店正門水岸步道拍攝對岸瑞典皇宮與老城夕照'],
  },
  'd3-3': {
    query: 'Stortorget Gamla stan Stockholm colorful buildings',
    captions: ['斯德哥爾摩老城大廣場（Stortorget）紅黃歷史山牆建築', '大廣場諾貝爾博物館與古井廣場實景', '老城中世紀鵝卵石窄巷與暖黃街燈'],
    story: '建立於1252年的老城 Gamla Stan 是斯德哥爾摩的發源地；大廣場紅樓92塊白色石磚相傳紀念1520年「斯德哥爾摩慘案」中遭丹麥國王克里斯蒂安二世處決的瑞典貴族。',
    trivia: '老城內的「莫滕·特羅齊格巷（Mårten Trotzigs Gränd）」最窄處僅有 90 公分寬，雙手張開就能同時摸到兩側牆壁！',
    mustDo: ['挑戰穿過僅 90 公分寬的莫滕·特羅齊格窄巷並拍照留念', '在諾貝爾博物館咖啡廳品嚐諾貝爾晚宴同款冰淇淋並翻看椅底得主簽名', '尋找藏在老城後院、全瑞典最小的「看月小男孩（Järnpojke）」鐵雕並摸頭許願'],
  },
  'd4-1': {
    query: 'Stockholm City Hall Stadshuset Golden Hall',
    captions: ['斯德哥爾摩市政廳（Stadshuset）梅拉倫湖畔紅磚高塔', '市政廳金廳（Gyllene Salen）1800萬塊純金馬賽克壁畫', '諾貝爾獎晚宴舉辦地「藍廳（Blå hallen）」壯闊階梯'],
    story: '由建築師 Ragnar Östberg 耗時12年、使用800萬塊紅磚興建，於1923年瑞典國慶日落成；每年12月10日諾貝爾晚宴在藍廳舉行，隨後於金廳舉辦盛大皇家舞會。',
    trivia: '「藍廳」其實是紅磚牆！當年建築師原本打算將紅磚塗成藍色，但砌好後發現手打紅磚質感太美，決定保留原色卻沿用了「藍廳」之名！',
    mustDo: ['站在藍廳雲石大階梯中央體驗諾貝爾獎得主緩步而下的視角', '仰望金廳北牆高達數公尺的「梅拉倫湖女王」純金馬賽克壁畫', '走到市政廳臨水拱廊拍攝騎士島教堂尖塔與梅拉倫湖全景'],
  },
  'd4-2': {
    query: 'Vasa Museum Stockholm ship 1628',
    captions: ['瓦薩沉船博物館 1628 年皇家戰艦全貌實景', '瓦薩號戰艦船尾精雕細琢的皇室木雕群像', '瓦薩號雙層 64 門青銅火砲甲板細節'],
    story: '1628年8月10日，瑞典國王古斯塔夫二世下令建造的64門巨砲旗艦「瓦薩號」展開首航，卻因船身過高、壓艙石不足，出港僅1,300公尺便遇陣風翻覆沉入波羅的海，直到333年後的1961年才被打撈重見天日。',
    trivia: '受惠於波羅的海低鹽度與缺氧冰冷海水，船木沒有被食船蛆侵蝕，整艘船高達 98% 都是 1628 年的原始部件！',
    mustDo: ['繞行六層觀景台從船底龍骨一路仰望至高達 52 公尺的主桅杆', '細看船尾超過 700 尊象徵瑞典王權與古羅馬英雄的木雕像', '觀看博物館內的《瓦薩號首航與打撈》多語系歷史紀錄片'],
  },
  'd4-3': {
    query: 'Kungsträdgården Stockholm ice skating winter',
    captions: ['斯德哥爾摩國王花園冬季戶外溜冰場與燈飾', '皇家歌劇院與卡爾十二世雕像雪景', '斯德哥爾摩市中心冬日冰場歡樂氛圍'],
    story: '昔日曾是15世紀瑞典王室專用的封閉皇家菜園與法式宮廷花園，如今則是斯德哥爾摩市民冬季最愛的戶外圓形溜冰場與慶典廣場。',
    trivia: '地鐵「國王花園站（Kungsträdgården）」月台深處藏著舊馬卡洛斯宮（Makalös Palace）火災留下的真實巴洛克石雕遺蹟！',
    mustDo: ['換上冰刀鞋在圓形燈海溜冰場伴隨北歐流行樂滑行一圈', '走進地下 34 公尺深的國王花園地鐵站欣賞地下考古花園洞穴', '在冰場邊木屋攤位來一份熱騰騰的瑞典烤鹿肉捲餅'],
  },
  'd5-1': {
    query: 'Santa Claus Village Rovaniemi winter Arctic Circle',
    captions: ['芬蘭羅瓦涅米聖誕老人村冬日雪景與尖頂主樓', '跨越北緯 66°33′ 北極圈標線燈柱', '聖誕老人官方郵局與雪地木屋聚落'],
    story: '1950年美國前第一夫人艾莉諾·羅斯福到訪因二戰摧毀的羅瓦涅米，當地在北極圈線上在短短兩週內趕工建起一座小木屋接待她，成為今日聖誕老人村的起源。',
    trivia: '聖誕老人官方郵局每年收到來自全球近 200 個國家超過 50 萬封信，郵局精靈全部穿著傳統服裝親手分揀！',
    mustDo: ['雙腳跨過北緯 66°33′ 北極圈線拍照並領取官方跨越北極圈證書', '走進聖誕老人辦公室與會說中文問候的聖誕老人本尊合照', '在聖誕郵局將明信片投入「紅色郵筒」預約明年聖誕節寄達'],
  },
  'd5-2': {
    query: 'Reindeer sleigh Lapland Finland snow forest',
    captions: ['芬蘭拉普蘭雪原馴鹿雪橇穿越霧凇森林', '薩米族傳統木雪橇與溫馴北極馴鹿', '薩米木帳篷 Kota 營火與熱藍莓汁體驗'],
    story: '在芬蘭拉普蘭，馴鹿的數量比當地居民還多！千百年來原住民薩米人（Sámi）隨馴鹿遷徙放牧，馴鹿雪橇是極夜雪原中最安靜、最神聖的古老交通工具。',
    trivia: '馴鹿的眼睛會隨季節變色！夏天呈現璀璨金色，到了漫長極夜的冬天則會變成深邃藍色，以提升近千倍的夜視感光能力！',
    mustDo: ['裹著溫暖馴鹿皮毛毯乘坐木雪橇穿越掛滿厚雪的泰加針葉林', '親手餵食馴鹿最喜愛的北極白地衣（鹿苔）並近距離合影', '圍坐在薩米傳統木帳篷 Kota 火爐旁喝熱藍莓汁聽牧鹿人唱 Joik 古調'],
  },
  'd5-3': {
    query: 'Kakslauttanen glass igloo aurora Lapland Finland',
    captions: ['芬蘭拉普蘭極光玻璃圓頂冰屋與雪林夜色', '從防霜熱能玻璃穹頂仰望漫天綠極光', '極圈針葉林間的浪漫玻璃屋聚落'],
    story: '1973年創辦人 Jussi Eiramo 在薩利色爾卡荒野拋錨露宿時愛上這片極地，後首創採用「航太級導熱防霜玻璃」打造的圓頂玻璃屋，讓旅人不必在零下30度受凍也能躺在床上看極光。',
    trivia: '芬蘭語將北極光稱為「Revontulet（狐狸之火）」，相傳是北極火狐在雪原奔跑時，尾巴掃起雪花摩擦夜空激起的火花！',
    mustDo: ['開啟房內的「極光警報鈴（Aurora Alarm）」，極光出現即刻提醒', '躺在電動調整角度的溫暖大床上 360 度仰望極光女神舞動', '體驗芬蘭傳統煙燻桑拿後跳入冰湖破冰洞的冰火交融快感'],
  },
  'd6-1': {
    query: 'Husky safari Lapland Finland sled dogs snow',
    captions: ['阿拉斯加與西伯利亞哈士奇雪橇犬隊奔馳拉普蘭雪原', '活力十足的極地雪橇犬與晨曦粉紅天空', '體驗一人掌舵一人乘坐的極地狗拉雪橇'],
    story: '西伯利亞與阿拉斯加哈士奇擁有雙層禦寒毛皮與驚人耐力，能在零下 40 度極寒中每日奔跑上百公里；牠們天生熱愛奔跑，出發前總會興奮地齊聲長嚎，一旦起跑卻瞬間安靜專注。',
    trivia: '哈士奇的腳掌肉墊具有特殊的血液逆流熱交換循環系統，即使長時間踩在冰面上也絕對不會凍傷！',
    mustDo: ['輪流體驗站在雪橇後方「踩煞車掌舵（Musher）」與坐在前座拍照', '奔馳後走進犬舍摸摸功臣哈士奇並與藍眼幼犬溫馨互動', '在營火木屋烤芬蘭肉腸（Makkara）配薑餅補充熱量'],
  },
  'd6-2': {
    query: 'Arktikum Rovaniemi glass corridor museum',
    captions: ['羅瓦涅米極地博物館（Arktikum）172公尺長玻璃穹頂長廊', '指北針般指向北極的現代極地建築奇蹟', '極地博物館內拉普蘭生態與北極光科學展廳'],
    story: '1992年芬蘭獨立75週年時落成，由丹麥建築團隊 Birch-Bonderup & Thorup-Waade 設計；長達172公尺的半圓形玻璃長廊被稱為「北極之門」，筆直指向正北方，展廳則藏於地下如同北極動物冬眠洞穴。',
    trivia: '館內建材全部取自拉普蘭在地自然資源：地板是能抵禦冰爪刮傷的佩洛（Pello）花崗岩，座椅則覆蓋天然馴鹿皮與松木！',
    mustDo: ['在 172 公尺長的弧形玻璃穹頂長廊中央拍出極具幾何延伸感的大片', '躺在「極光劇場」軟墊上觀賞 360 度北極光成因與薩米神話投影', '在博物館咖啡廳享用新鮮北極紅點鮭（Arctic Char）自助午餐'],
  },
  'd6-3': {
    query: 'Santa Claus Express VR night train Finland Oulu Rovaniemi',
    captions: ['芬蘭國鐵 VR「北極特快車」雙層極地臥鋪列車', '停靠在羅瓦涅米白雪月台上的藍白相間雙層火車', '上層附設獨立衛浴的溫馨北歐風雙人臥鋪包廂'],
    story: '被譽為現實版《北極特快車》的芬蘭 VR 夜車（Santa Claus Express），每晚從北極圈羅瓦涅米緩緩南下穿越千湖之國的冰封森林，翌晨抵達首都赫爾辛基。',
    trivia: '芬蘭鐵路採用比歐洲標準軌更寬的 1524mm 寬軌距，因此雙層車廂格外寬敞平穩，上層臥鋪甚至擁有獨立淋浴間！',
    mustDo: ['預訂上層 Deluxe 豪華附衛浴雙人包廂，關燈欣賞窗外雪林星空', '前往餐車廂（Ravintolavaunu）點一杯芬蘭拉普蘭金牌啤酒（Lapin Kulta）', '與車廂外彩繪的北極熊與馴鹿塗裝合影留念'],
  },
  'd7-1': {
    query: 'Helsinki Cathedral Senate Square winter',
    captions: ['赫爾辛基大教堂（Tuomiokirkko）純白新古典主義建築與綠色圓頂', '參議院廣場亞歷山大二世銅像與大教堂高聳階梯', '雪夜裡發光的赫爾辛基白教堂全景'],
    story: '1852年落成的赫爾辛基大教堂由德國建築師 Carl Ludvig Engel 設計，原名「聖尼古拉教堂」以紀念俄國沙皇尼古拉一世；純白廊柱與綠色銅頂在波羅的海航道上遠在數海里外即可望見。',
    trivia: '教堂屋頂邊緣佇立著 12 尊巨大的鋅製十二使徒雕像，這是全世界規模最大的獨立鋅雕群！',
    mustDo: ['像當地人一樣坐在大教堂前 45 級寬廣花崗岩階梯上曬冬日暖陽拍照', '走進極簡純白的八角形路德宗大廳仰望管風琴與穹頂', '逛逛教堂正前方參議院廣場的赫爾辛基聖誕市集（Tuomaan Markkinat）'],
  },
  'd7-2': {
    query: 'Temppeliaukio Church Helsinki rock interior dome',
    captions: ['赫爾辛基岩石教堂（Temppeliaukio）天然花崗岩壁與紫銅穹頂', '由 22 公里長銅條盤繞而成的飛碟狀天頂與環形天窗', '陽光穿透 180 扇天窗灑落在古老冰河岩壁上'],
    story: '1969年由建築師兄弟 Timo 與 Tuomo Suomalainen 設計，直接將一整座天然前寒武紀花崗岩山丘從頂部炸開掏空，上方覆蓋巨型紫銅線圈圓頂，被譽為現代有機建築的巔峰。',
    trivia: '未經修飾的粗糙花崗岩壁擁有世界頂級的天然殘響音效，連鑲嵌在岩縫中的 3001 根管風琴音管都不設琴箱！',
    mustDo: ['抬頭細看由長達 22 公里的紫銅線圈一圈圈纏繞而成的飛碟穹頂', '尋找岩壁下方流淌的天然融雪地下水痕與冰河刮痕', '若遇上現場管風琴或大提琴演奏，務必靜坐聆聽天籟般的岩洞共鳴'],
  },
  'd7-3': {
    query: 'Löyly Helsinki sauna architecture waterfront',
    captions: ['赫爾辛基 Löyly 現代木構造海濱桑拿館外觀', '波羅的海冰封海岸線與 Löyly 幾何松木露台', '傳統芬蘭木柴煙燻桑拿與海景休憩廳'],
    story: '在人口550萬的芬蘭擁有超過330萬間桑拿房，「桑拿（Sauna）」更是唯一通行全球的芬蘭語詞彙！2016年開幕的 Löyly 由 Avanto 建築事務所打造，以4000塊FSC認證熱處理松木構築出宛如海岸岩石的現代雕塑。',
    trivia: 'Löyly 在芬蘭語中指的是「將水潑在滾燙桑拿石上瞬間蒸騰而起的熱蒸氣與靈魂氣息」，芬蘭桑拿文化已被列入聯合國非物質文化遺產！',
    mustDo: ['體驗赫爾辛基罕見的正統「黑煙燻桑拿（Savusauna）」溫潤木香', '蒸到全身發熱後順著木階梯直接跳進零度的波羅的海冰水泳池！', '在海景壁爐餐廳享用芬蘭國湯——奶油蒔蘿鮭魚湯（Lohikeitto）'],
  },
  'd8-1': {
    query: 'Oslo Opera House marble roof waterfront winter',
    captions: ['奧斯陸歌劇院（Operahuset）純白卡拉拉大理石斜坡屋頂', '深入奧斯陸峽灣的冰山造型歌劇院與水上玻璃雕塑', '歌劇院內部溫潤橡木波浪牆與全景落地窗'],
    story: '2008年落成的奧斯陸歌劇院由挪威國寶級建築事務所 Snøhetta 設計，耗資5億歐元，外牆鋪設36,000塊義大利卡拉拉白色大理石，宛如一座從奧斯陸峽灣緩緩升起的巨大純白冰川。',
    trivia: '這是全世界第一座「鼓勵全市民直接踩上屋頂散步」的國家歌劇院，每塊大理石磚表面都經過特殊防滑紋理雕刻！',
    mustDo: ['沿著白色大理石緩坡一路步行登上歌劇院最高處俯瞰奧斯陸峽灣', '拍攝海面上隨潮汐與風向旋轉的巨型玻璃雕塑《She Lies》', '走進大廳欣賞由挪威造船工匠打造的巨大螺旋波浪橡木牆'],
  },
  'd8-2': {
    query: 'Karl Johans gate Oslo Royal Palace winter',
    captions: ['奧斯陸卡爾約翰大道筆直通往皇宮山丘的壯麗街景', '挪威國會大廈與冬日聖誕點燈大道', '奧斯陸皇宮廣場與雪地林蔭步道'],
    story: '以瑞典暨挪威國王卡爾十四世·約翰命名的大道貫穿奧斯陸心臟，串聯中央車站、國會大廈、國家劇院、奧斯陸大學（舊諾貝爾和平獎頒獎地）一路直達皇宮。',
    trivia: '挪威皇宮前完全沒有圍牆或鐵欄杆！市民與遊客可以自由穿過皇宮花園，體現挪威王室極度親民的北歐作風。',
    mustDo: ['在百年的 Grand Café 點一杯熱巧克力，尋找劇作家易卜生每天必坐的專屬座位', '逛逛 Spikersuppa 溜冰場旁的奧斯陸聖誕童話市集（Jul i Vinterland）', '漫步至奧斯陸市政廳（每年諾貝爾和平獎正式頒獎殿堂）參觀巨型壁畫'],
  },
  'd9-1': {
    query: 'Flåmsbana train Norway winter snow mountain',
    captions: ['挪威縮影高山火車穿越白雪覆蓋的峽谷與冰瀑', '弗洛姆鐵路（Flåmsbana）陡峭山壁與米達爾高原雪景', '火車停靠在冰封的肖斯瀑布（Kjosfossen）觀景台'],
    story: '被《孤獨星球》評為全球最美鐵道之旅的弗洛姆高山鐵路（Flåmsbana），耗時20年全靠人工開鑿20條隧道，在短短20公里內從海拔866公尺的米達爾高原急速下降至海平面0公尺的松恩峽灣！',
    trivia: '這條鐵路坡度高達 1:18（每前進18公尺就下降1公尺），是全世界最陡峭的無齒軌標準軌距鐵路，每節車廂都配有五套獨立煞車系統！',
    mustDo: ['坐在車廂右側靠窗位置飽覽萬丈深淵般的懸崖與冰封瀑布', '在 Kjosfossen 瀑布站下車拍攝高達 225 公尺的壯麗冰瀑與紅衣精靈傳說', '在弗洛姆小鎮品嚐以冰河水釀造的 Ægir 維京精釀啤酒'],
  },
  'd9-2': {
    query: 'Nærøyfjord Aurlandsfjord cruise winter fjord Norway',
    captions: ['松恩峽灣與納柔依峽灣（Nærøyfjord）兩岸千尺雪峰倒影', '全電力靜音觀光雙體船航行於世界自然遺產峽灣', '峽灣深處與世隔絕的彩色小木屋村落 Undredal'],
    story: '松恩峽灣全長204公里、最深達1,308公尺，為全球最長最深的峽灣；其分支「納柔依峽灣」最窄處僅250公尺，兩側卻聳立著1,700公尺高的垂直雪山，獲選為聯合國世界自然遺產。',
    trivia: '航行於此的「Future of The Fjords」游船是全球首艘全碳纖維純電動零排放觀光船，航行時完全沒有引擎噪音，只能聽見破冰與海鷗鳴叫！',
    mustDo: ['走上全電動船的「之字形山路坡道甲板」拍攝 360 度無死角峽灣雪峰', '經過人口僅百人卻有 500 隻山羊的 Undredal 小鎮時尋找挪威棕色山羊起司（Brunost）', '在靜謐如鏡的峽灣水面上聆聽冰川融水滑落岩壁的回音'],
  },
  'd9-3': {
    query: 'Bryggen Bergen Norway colorful wooden houses wharf',
    captions: ['卑爾根布呂根（Bryggen）世界文化遺產彩色木屋碼頭', '漢薩同盟百年傾斜木造商行與港灣倒影', '走進布呂根木屋群深處狹窄幽古的木板通道'],
    story: '自1360年起，布呂根（意為碼頭）便是德意志「漢薩同盟」最重要的海外貿易據點，壟斷北歐鱈魚乾與穀物貿易近400年；1702年大火後完全依照中世紀原始木結構重建，被列入世界文化遺產。',
    trivia: '仔細看布呂根的彩色木屋都有些微傾斜！因為地基是數百年前埋在海泥裡的原木樁，整排房屋互相倚靠支撐才得以屹立三百年不倒！',
    mustDo: ['鑽進兩排彩色木屋之間狹窄的古老木造暗巷，尋找牆上的漢薩鱈魚乾徽章', '搭乘佛洛伊恩山纜車（Fløibanen）6 分鐘登頂俯瞰卑爾根七山與峽灣夜景', '在港邊魚市場（Fisketorget）品嚐現烤挪威帝王蟹腿與煙燻鯨魚肉'],
  },
  'd10-1': {
    query: 'Tromsø winter harbor mountains bridge Norway',
    captions: ['北極圈門戶特羅姆瑟（Tromsø）跨海大橋與雪山港灣全景', '極夜藍色時刻（Blue Hour）點亮萬家燈火的特羅姆瑟島', '特羅姆瑟市中心百年木造建築與極地碼頭'],
    story: '位於北緯69度、深入北極圈350公里的特羅姆瑟，在19世紀因作為阿蒙森（Roald Amundsen）等極地探險家進軍北極的基地與法式優雅風情，贏得「北極門戶」與「北方巴黎」美譽。',
    trivia: '雖然位於北緯69度，但受惠於北大西洋暖流調節，特羅姆瑟冬季氣溫通常維持在舒適的 -4°C 左右，是全世界最溫暖的極光觀測首都！',
    mustDo: ['在午後 1 點的「極夜藍調時刻（Polar Night Blue Hour）」漫步特羅姆瑟港灣拍照', '造訪全球最北端的百年啤酒館 Ølhallen 品嚐 72 種挪威精釀生啤', '參觀形似倒塌冰塊的 Polaria 北極水族館觀賞髯海豹餵食秀'],
  },
  'd10-2': {
    query: 'Fjellheisen Tromsø cable car view aurora winter',
    captions: ['從斯托斯坦恩山（Storsteinen）纜車觀景台俯瞰特羅姆瑟峽灣與跨海大橋', '特羅姆瑟高空雪山平台與漫天極光大爆發', 'Fjellheisen 山頂觀景台極夜璀璨萬家燈火'],
    story: '1961年由特羅姆瑟航運公司興建的 Fjellheisen 高空纜車，僅需4分鐘便能將旅人從海平面送上海拔421公尺的斯托斯坦恩山（Storsteinen）懸崖平台，將整座特羅姆瑟島、跨海大橋與周圍連綿雪峰盡收眼底。',
    trivia: '山頂纜車站外牆鑲嵌著一面巨大的北極熊金屬徽章，這是所有抵達北極圈69度旅人必拍的極地認證標誌！',
    mustDo: ['攜帶腳架在山頂觀景台拍攝「翡翠極光 + 特羅姆瑟跨海大橋 + 峽灣燈火」同框神作', '在山頂 Fjellstua 景觀餐廳一面喝熱騰騰的馴鹿肉湯一面守候極光', '勇敢走到戶外懸崖延伸步道感受北極圈高空凜冽卻純淨的夜風'],
  },
  'd11-1': {
    query: 'Arctic Cathedral Ishavskatedralen Tromsø winter',
    captions: ['特羅姆瑟北極大教堂（Ishavskatedralen）11座白色三角形冰山造型外觀', '雪夜裡發光的北極大教堂與跨海大橋同框', '教堂內高達23公尺的《基督復臨》巨型彩繪玻璃馬賽克窗'],
    story: '1965年落成的北極大教堂由建築師 Jan Inge Hovig 設計，以11片塗覆鋁板的巨型三角形混凝土結構交疊而成，象徵北極浮冰與薩米人傳統帳篷 Lavvu，被譽為挪威最偉大的現代主義教堂。',
    trivia: '東側高達23公尺、重達6噸的《基督復臨》彩繪玻璃窗，是由藝術家 Victor Sparre 以厚達3公分的法國水晶玻璃塊鑲嵌而成！',
    mustDo: ['在跨海大橋步道回望北極大教堂與背後高聳的 Tromsdalstinden 雪峰', '走進教堂仰望巨型冰柱水晶吊燈與 2940 根音管的帆船造型管風琴', '預約聆聽一場大教堂午夜極光燭光音樂會（Midnight Sun / Northern Lights Concert）'],
  },
  'd11-2': {
    query: 'Red king crab Norway Arctic seafood',
    captions: ['鮮甜飽滿的挪威巴倫支海現撈紅帝王蟹（Red King Crab）', '極地船長展示展開超過一公尺的巨大帝王蟹', '現蒸帝王蟹長腿佐北歐檸檬奶油'],
    story: '1960年代蘇聯科學家為增加北極漁獲，將堪察加半島的紅帝王蟹引進摩爾曼斯克海域；沒想到帝王蟹順著洋流繁衍至挪威北極峽灣，造就今日全球老饕趨之若鶩的頂級極地海味。',
    trivia: '成年挪威紅帝王蟹雙腿展開可達 1.8 公尺、重達 10 公斤以上，且因生長在零度以下的純淨冰海，蟹肉格外緊實甘甜！',
    mustDo: ['雙手捧起巨型活體帝王蟹穿上防寒衣拍一張霸氣極地認證照', '用剪刀豪邁剪開剛出爐的帝王蟹長腿，整條抽出飽滿雪白蟹肉大口品嚐', '搭配北歐野生蒔蘿、融化發酵奶油與烤酸種麵包無限續盤'],
  },
  'd11-3': {
    query: 'Aurora Borealis Tromsø fjord Norway winter',
    captions: ['特羅姆瑟近郊峽灣翡翠綠與紫紅極光大爆發實景', '挪威北極海岸線雪山與星空極光倒影', '極光獵人營火旁仰望橫跨天際的歐若拉光帶'],
    story: '特羅姆瑟正好位於地球「極光橢圓帶（Auroral Oval）」正中央，只要向西前往白雪皚皚的卡爾島（Kvaløya）海濱或向東穿越芬蘭邊境山谷避開雲層，就能大幅提高親眼目睹極光冕（Corona）的機率。',
    trivia: '肉眼看到的微弱極光常呈灰白色，但當太陽風暴（KP值≥4）撞擊高空100公里處的氧原子時，肉眼就能直接看見翠綠甚至紫紅色的劇烈舞動！',
    mustDo: ['跟隨專業極光攝影師學習設定相機（ISO 1600-3200、快門 4-8 秒）拍下人生極光照', '躺在卡爾島零光害的雪地上仰望頭頂 360 度炸開的「極光冕（Aurora Corona）」', '圍著雪地營火烘烤棉花糖、喝挪威熱香料甜酒享受極夜浪漫'],
  },
  'd12-1': {
    query: 'Blue Lagoon Iceland geothermal spa winter',
    captions: ['冰島藍湖溫泉（Blue Lagoon）乳藍色地熱泉水與黑色火山熔岩', '浸泡在 38°C 富含白矽泥與礦物質的夢幻地熱潟湖中', '藍湖 The Retreat 奢華火山熔岩水療與水吧'],
    story: '藍湖並非天然形成，而是1976年鄰近的 Svartsengi 地熱發電廠將地下2,000公尺深處富含礦物質的熱海水排入周圍800年前形成的黑色熔岩原，於1981年被當地居民發現具有神奇護膚療效而成為世界奇景。',
    trivia: '泉水之所以呈現夢幻的蒂芬妮乳藍色，是因為水中豐富的「二氧化矽（Silica）」顆粒在陽光下只折射藍色光波，水本身其實是透明白色的！',
    mustDo: ['到湖中央的原木矽泥吧（Silica Mud Bar）挖取天然白矽泥敷滿全臉拍照', '憑手環在池中水吧點一杯冰島 Gull 啤酒或野莓果昔邊泡湯邊暢飲', '下水前務必在頭髮抹滿大量「免沖洗護髮素」防止高濃度矽質讓頭髮打結'],
  },
  'd12-2': {
    query: 'Hallgrimskirkja Reykjavik Iceland winter',
    captions: ['雷克雅維克地標哈爾格林姆大教堂（Hallgrímskirkja）74.5公尺玄武岩柱外觀', '教堂前探險家萊夫·埃里克松（Leif Erikson）銅像與冬雪', '從大教堂鐘樓頂端俯瞰雷克雅維克彩色鐵皮屋頂與大西洋海灣'],
    story: '由冰島國家建築師 Guðjón Samúelsson 於1937年設計、耗時41年才於1986年完工；外觀靈感源自冰島火山熔岩冷卻凝固成的六角形玄武岩柱（如黑沙灘與斯瓦蒂瀑布），並以17世紀冰島聖詩詩人 Hallgrímur Pétursson 命名。',
    trivia: '教堂前方的維京探險家萊夫·埃里克松雕像，是1930年美國為慶祝冰島議會（Alþingi）成立一千年所贈送，因為他比哥倫布早 500 年就踏上了北美大陸！',
    mustDo: ['搭乘電梯登上 74.5 公尺高的鐘樓觀景台，拍下舉世聞名的雷克雅維克彩色屋頂全景', '走進教堂內仰望高達 15 公尺、重 25 噸、擁有 5,275 根音管的德國巨型管風琴', '從教堂正前方的彩虹街（Skólavörðustígur）一路漫步拍回教堂正立面'],
  },
  'd12-3': {
    query: 'Harpa Concert Hall Reykjavik glass facade',
    captions: ['雷克雅維克哈帕音樂廳（Harpa）靈感源自玄武岩的立體幾何玻璃帷幕', '丹麥冰島藝術家 Olafur Eliasson 設計的萬花筒蜂巢玻璃磚內景', '哈帕音樂廳倒映在雷克雅維克舊港海面上的璀璨光影'],
    story: '2008年冰島金融海嘯爆發時一度停工，但冰島政府決定傾力續建，作為國民重振信心的象徵，並於2011年落成、榮獲歐盟密斯·凡·德羅當代建築首獎。',
    trivia: '外牆由超過 1,000 個被稱為「準磚（Quasi-bricks）」的十二面體立體鋼構玻璃組成，內含雙色玻璃，隨太陽角度與海浪反光變幻出極光般的色彩！',
    mustDo: ['走進音樂廳大廳站在巨型蜂巢玄武岩玻璃窗下拍攝奇幻光影人像', '參觀鮮紅色的主演奏廳 Eldborg（意為火焰城堡），感受火山熔岩般的視覺震撼', '走出音樂廳沿著海濱步道前往太陽航海者（Sólfarið）維京船骨雕像看夕陽'],
  },
  'd13-1': {
    query: 'Þingvellir National Park Iceland winter rift valley',
    captions: ['辛格維利爾國家公園（Þingvellir）歐亞板塊與北美板塊大裂谷雪景', '西元 930 年世界最古老民主議會 Alþingi 遺址與法律岩', '清澈見底的絲浮拉裂縫（Silfra）與白雪覆蓋的火山苔原'],
    story: '西元930年，冰島全境的維京氏族首領齊聚於此創立了世界上最古老的民主議會「阿爾庭（Alþingi）」，法律宣講人站在火山裂谷石壁前背誦法律，開啟了人類千年議會民主史。',
    trivia: '這裡是地球上極少數能在陸地上直接行走於「北美板塊」與「歐亞板塊」交界處的地方，兩大板塊每年仍以 2 公分的速度持續撕裂分離！',
    mustDo: ['漫步在兩大洲大陸板塊撕裂而成的 Almannagjá 火山玄武岩大裂谷步道', '站在觀景台俯瞰能見度超過 100 公尺、灌滿朗格冰川融水的絲浮拉裂縫（Silfra）', '在法律岩（Lögberg）旗桿下感受冰島於 1944 年正式宣布獨立建國的歷史現場'],
  },
  'd13-2': {
    query: 'Strokkur Geysir eruption Iceland winter',
    captions: ['蓋歇爾地熱區史托克間歇泉（Strokkur）衝天噴發高達30公尺瞬間', '間歇泉噴發前一秒形成的絕美蒂芬妮藍沸水圓拱氣泡', '白雪皚皚的地熱谷中冒著滾燙白色蒸氣的沸騰溫泉孔'],
    story: '英語中「間歇泉（Geyser）」一詞正是源自此處的大蓋歇爾泉（Geysir，冰島語意為狂暴噴湧）！旁邊活躍的史托克間歇泉（Strokkur）每隔 5 至 8 分鐘便會轟然將沸水噴向 20 至 35 公尺高空。',
    trivia: '要拍到最震撼的照片，秘訣是盯緊泉眼中央：當沸水瞬間隆起成一顆巨大的「土耳其藍水晶球氣泡」時按下連拍，下一秒就是衝天水柱！',
    mustDo: ['站在上風處開啟手機高速連拍，捕捉間歇泉隆起藍色水泡並炸裂衝天的瞬間', '觀察地熱步道旁呈現藍綠與赭紅色的Blesi雙色雙生溫泉池', '在遊客中心品嚐用地下 100°C 地熱蒸氣埋土慢烤 24 小時的冰島黑麥火山麵包（Rúgbrauð）'],
  },
  'd13-3': {
    query: 'Gullfoss waterfall Iceland winter ice snow',
    captions: ['冰島黃金瀑布（Gullfoss）雙層斷層巨瀑與冬季冰封奇景', 'Hvítá 白河冰川融水以萬馬奔騰之勢跌入32公尺深峽谷', '冬日陽光下橫跨黃金瀑布水霧的璀璨彩虹'],
    story: '20世紀初外國財團曾企圖租下黃金瀑布興建水力發電廠，當時農場主人的女兒 Sigríður Tómasdóttir 徒步百公里前往雷克雅維克抗爭，甚至以投瀑相諫，最終成功保住這座自然奇景，她也成為冰島第一位環保英雄。',
    trivia: '瀑布分為上下兩層（11公尺與21公尺）並呈 90 度垂直轉折直接跌入深達 70 公尺的狹窄火山斷層峽谷，遠看宛如河水突然消失在大地裂縫中！',
    mustDo: ['站在上層觀景台俯瞰結滿巨大冰柱的雙層瀑布與峽谷激流', '尋找瀑布旁紀念環保女英雄 Sigríður Tómasdóttir 的石碑浮雕', '在黃金瀑布景觀餐廳必喝一碗料多濃郁、可免費續湯的「冰島傳統羊肉蔬菜湯（Kjötsúpa）」'],
  },
  'd13-4': {
    query: 'Reykjavik New Year Eve fireworks Hallgrimskirkja',
    captions: ['雷克雅維克跨年夜哈爾格林姆大教堂前萬人自發煙火齊放', '360 度環繞全城天際線的冰島跨年璀璨煙火海', '冰島跨年傳統社區大型篝火晚會（Áramótabrenna）'],
    story: '冰島沒有官方跨年煙火秀，但全雷克雅維克 20 多萬市民會在跨年夜當晚全員出動，在自家門口與哈爾格林姆教堂廣場同時點燃超過 500 噸煙火，造就地球上最狂熱的 360 度全民煙火奇觀！',
    trivia: '冰島人買煙火其實是在做公益！全冰島的跨年煙火皆由「冰島搜救隊（ICE-SAR）」獨家專賣，市民狂買煙火正是為了資助這群全年無償拯救旅人的極地英雄！',
    mustDo: ['傍晚先參加當地社區的跨年巨型篝火晚會（Áramótabrenna），與冰島人一起唱歌燒走舊年厄運', '23:30 前抵達哈爾格林姆大教堂廣場，戴上護目鏡沉浸在 360 度無死角震撼煙火雨中', '午夜 00:00 敲響時開啟香檳，與身旁來自世界各地的旅人擁抱高喊「Gleðilegt nýtt ár!（新年快樂）」'],
  },
  'd14-1': {
    query: 'Laugavegur Reykjavik street colorful houses winter',
    captions: ['雷克雅維克購物主街 Laugavegur 與彩虹街彩色鐵皮木屋', '冰島街頭藝術壁畫與北歐極地戶外品牌街區', '冬日積雪與聖誕燈串點綴的雷克雅維克老城區'],
    story: 'Laugavegur 在冰島語中意為「溫泉洗滌之路」，因為百年前雷克雅維克婦女都是沿著這條小徑背著衣物前往城外的 Laugardalur 地熱溫泉洗衣，如今已蛻變為全冰島最繁華的文創設計大道。',
    trivia: '由於冰島森林稀少，19世紀居民改用「英國進口波浪鐵皮」包覆木屋以抵禦北大西洋強風暴雨，並塗上鮮豔色彩對抗漫長冬夜，成為雷克雅維克最可愛的建築特色！',
    mustDo: ['造訪 1937 年開業、連美國前總統柯林頓都盛讚的「Bæjarins Beztu Pylsur」吃一根加滿脆炸洋蔥與甜芥末的冰島羊肉熱狗', '在冰島羊毛衣協會（Handknitting Association）挑選一件冰島奶奶親手編織的防水圓領毛衣 Lopapeysa', '走進 Brauð & Co. 彩繪塗鴉烘焙坊買一顆剛出爐的酸種肉桂捲'],
  },
  'd14-2': {
    query: 'Sun Voyager Solfarid Reykjavik sculpture winter',
    captions: ['雷克雅維克海濱「太陽航海者（Sólfarið）」不鏽鋼維京船骨雕塑', '太陽航海者隔著法赫薩灣遙望白雪覆蓋的埃斯亞山（Mt. Esja）', '極地夕陽與粉紫霞光映照在光亮的不鏽鋼船身線條上'],
    story: '1990年為慶祝雷克雅維克建城200週年，由冰島雕塑家 Jón Gunnar Árnason 創作；當時身患白血病的藝術家將這艘面向北方的夢想之船視為「獻給太陽的頌歌」，象徵對光明、希望與未知新領域的永恆追尋。',
    trivia: '雕塑家本人曾特別澄清：太陽航海者並不是歷史上的維京戰船，而是一艘存在於夢境中、載著人類靈魂航向太陽的「夢想之船」！',
    mustDo: ['站在船頭正前方以對岸白雪皚皚的埃斯亞山（Mt. Esja）為背景拍攝剪影照', '在冬日午後 2 點至 3 點的粉紫色極地日落時分造訪，捕捉不鏽鋼船身反射的金紅霞光', '沿著雕塑所處的 Sæbraut 海濱步道吹著北大西洋海風散步至哈帕音樂廳'],
  },
  'd15-1': {
    query: 'Keflavik Airport Iceland winter',
    captions: ['冰島凱夫拉維克國際機場（KEF）極地玄武岩與木質航廈', '從機艙舷窗俯瞰冰島火山冰川與格陵蘭冰原壯麗航路', '機場門前的巨型「海雀破蛋（Jet Nest）」不鏽鋼地標雕塑'],
    story: '二戰期間由美軍興建於雷克雅尼斯半島黑色熔岩原上的凱夫拉維克機場，是連接北美與歐洲的北大西洋航空樞紐，航廈外矗立著藝術家 Magnús Tómasson 創作的巨型鋼雕《Jet Nest》，象徵飛向天際的夢想。',
    trivia: '冰島凱夫拉維克機場免稅店因為免除高達 24% 的冰島加值稅，買 Blue Lagoon 藍湖白矽泥面膜與冰島火山鹽比在市區購買還要便宜將近三成！',
    mustDo: ['在退稅櫃檯辦妥冰島購物退稅後，於免稅店掃貨 Blue Lagoon 矽泥面膜與 Omnom 冰島手工巧克力', '登機選擇靠窗座位，起飛時俯瞰雷克雅尼斯半島冒煙的地熱火山原與大西洋海岸線', '整理 15 天橫跨北歐五國的極光、聖誕與跨年相簿，帶著滿滿感動返航'],
  },
};

const HOTEL_GALLERY_QUERIES = {
  'hotel-angleterre': {
    queries: ['Hotel d Angleterre Copenhagen', 'Kongens Nytorv Copenhagen hotel', 'Copenhagen luxury hotel facade'],
    captions: ['哥本哈根 d’Angleterre 五星皇室傳奇酒店正立面', '國王新廣場與 d’Angleterre 聖誕點燈全景', '新古典主義拱窗與皇家廣場地標景觀'],
  },
  'hotel-grand-stockholm': {
    queries: ['Grand Hotel Stockholm building', 'Grand Hotel Stockholm night waterfront', 'Blasieholmen Grand Hotel Stockholm'],
    captions: ['斯德哥爾摩大飯店（Grand Hôtel）水岸皇室建築全貌', '夜色中倒映在波羅的海水面的 Grand Hôtel', '與瑞典皇宮隔水相望的諾貝爾獎得主下榻名邸'],
  },
  'hotel-kakslauttanen': {
    queries: ['Glass igloo Lapland Finland snow', 'Kakslauttanen igloo winter', 'Aurora Borealis Lapland cabin Finland'],
    captions: ['芬蘭拉普蘭極光圓頂玻璃冰屋雪林實景', '覆蓋皑皑白雪的極圈松木與防霜玻璃穹頂', '拉普蘭極夜星空與翠綠極光下的夢幻冰屋'],
  },
  'hotel-kamp-helsinki': {
    queries: ['Hotel Kämp Helsinki Pohjoisesplanadi', 'Esplanadi Helsinki historic building', 'Hotel Kamp Helsinki facade'],
    captions: ['赫爾辛基坎普大酒店（Hotel Kämp）1887年新古典主義外牆', '毗鄰埃斯普拉納迪公園的芬蘭傳奇國賓酒店', '見證西貝流士與芬蘭百年文藝復興的典雅殿堂'],
  },
  'hotel-edge-tromso': {
    queries: ['Clarion Hotel The Edge Tromsø harbor', 'Tromsø harbor winter architecture', 'Tromsø waterfront night snow'],
    captions: ['特羅姆瑟峽灣地標 Clarion Hotel The Edge 現代水岸建築', '佇立於北極圈港灣第一排的極光觀景酒店', '從酒店高空天台眺望北極大教堂與峽灣雪山'],
  },
  'hotel-retreat-bluelagoon': {
    queries: ['Blue Lagoon Iceland lava spa', 'Blue Lagoon geothermal water Iceland', 'Grindavik Blue Lagoon winter'],
    captions: ['嵌入800年火山熔岩原的藍湖溫泉奢華水療秘境', '私享乳藍色地熱礦物泉與黑曜石熔岩地景', '蒸氣氤氳的冰島藍湖地熱泉全景'],
  },
  'hotel-edition-reykjavik': {
    queries: ['Harpa Reykjavik harbor waterfront', 'Reykjavik Old Harbour winter mountain', 'Mount Esja from Reykjavik harbor'],
    captions: ['緊鄰哈帕音樂廳與舊港的雷克雅維克海濱奢華地段', '面向法赫薩灣與埃斯亞山（Mt. Esja）的壯闊港景', '雷克雅維克跨年煙火與極光海景第一排視野'],
  },
};

const DINING_GALLERY_QUERIES = {
  'dining-marchal': {
    queries: ['Michelin French Nordic fine dining plate', 'Lobster gourmet dish restaurant', 'Copenhagen fine dining restaurant'],
    captions: ['哥本哈根米其林一星 Marchal 法式北歐海鮮料理', '嚴選丹麥海域龍蝦與魚子醬主廚精緻擺盤', '國王新廣場皇室拱廊餐廳典雅用餐氛圍'],
  },
  'dining-schonnemann': {
    queries: ['Smørrebrød Danish open sandwich herring', 'Danish Smorrebrod shrimp salmon', 'Traditional Danish lunch platter'],
    captions: ['創立於1877年的丹麥傳奇開放式三明治 Smørrebrød', '手作醋漬鯡魚、北極甜蝦與酥炸比目魚黑麥麵包', '搭配冰鎮小茴香烈酒 Akvavit 的道地丹麥午宴'],
  },
  'dining-gyldene-freden': {
    queries: ['Swedish meatballs lingonberry mash', 'Gamla stan historic tavern Stockholm', 'Traditional Swedish Husmanskost dish'],
    captions: ['1722年開業至今的金氏世界紀錄古董地窖餐廳招牌瑞典肉丸', '手工瑞典肉丸佐野生越橘果醬、奶油肉汁與醃黃瓜', '斯德哥爾摩老城中世紀拱頂燭光酒館氛圍'],
  },
  'dining-verandan': {
    queries: ['Swedish Smorgasbord seafood buffet salmon', 'Gravlax cured salmon dill mustard', 'Grand Hotel Stockholm waterfront dining'],
    captions: ['斯德哥爾摩大飯店 Verandan 正統瑞典皇家海鮮百匯', '北歐蒔蘿醃鮭魚（Gravlax）與波羅的海冷燻魚鮮', '坐擁皇宮水岸美景的百年皇家玻璃長廊餐廳'],
  },
  'dining-niskala': {
    queries: ['Finnish salmon soup Lohikeitto rye bread', 'Reindeer steak lingonberry Lapland', 'Lapland Kota campfire grilled salmon'],
    captions: ['拉普蘭薩米木帳篷營火慢烤北極鮭魚與奶油鮭魚湯', '精選拉普蘭放牧鹿肉佐北極雲莓與野生越橘醬', '北極圈傳統木屋溫暖燭光與極地料理'],
  },
  'dining-savoy-helsinki': {
    queries: ['Alvar Aalto Savoy vase restaurant Helsinki', 'Finnish fine dining fish dish', 'Esplanadi rooftop view Helsinki'],
    captions: ['由芬蘭設計大師 Alvar Aalto 親手設計的 Savoy 傳奇餐廳與湖泊花瓶', '馬納海姆元帥最愛的經典芬蘭魚子與伏特加前菜', '俯瞰赫爾辛基埃斯普拉納迪公園的頂樓藝術殿堂'],
  },
  'dining-emmaus-tromso': {
    queries: ['Red king crab legs seafood platter Norway', 'Arctic char fish fillet fine dining', 'Tromsø seafood restaurant harbor'],
    captions: ['巴倫支海現撈極地紅帝王蟹與北極雪場蟹盛宴', '香煎北極紅點鮭（Arctic Char）佐挪威峽灣香草奶油', '特羅姆瑟極夜港灣百年木屋燭光海味'],
  },
  'dining-lava-moss': {
    queries: ['Icelandic lamb rack fine dining plate', 'Langoustine soup Iceland restaurant', 'Blue Lagoon Lava restaurant Iceland'],
    captions: ['鑲嵌於天然火山熔岩壁中的冰島高地放牧小羊排料理', '冰島南岸小龍蝦濃湯與極地海螯蝦佳餚', '佐以天然火山岩鹽與地熱黑麥麵包的米其林星級饗宴'],
  },
};

async function main() {
  console.log('Fetching verified real photos from Wikimedia Commons...');
  const spotImagesMap = {};
  for (const [id, info] of Object.entries(SPOT_METADATA)) {
    const imgs = await searchCommons(info.query, 5);
    spotImagesMap[id] = imgs.slice(0, 3).map((im, idx) => ({
      url: im.url,
      caption: info.captions[idx] || info.captions[0],
      author: im.author,
      license: im.license,
    }));
    console.log(`Spot ${id}: found ${spotImagesMap[id].length} images`);
  }

  const hotelGalleryMap = {};
  for (const [id, info] of Object.entries(HOTEL_GALLERY_QUERIES)) {
    const collected = [];
    for (const q of info.queries) {
      const res = await searchCommons(q, 3);
      for (const r of res) {
        if (!collected.some((c) => c.url === r.url)) {
          collected.push(r);
        }
      }
      if (collected.length >= 4) break;
    }
    hotelGalleryMap[id] = collected.slice(0, 3).map((im, idx) => ({
      url: im.url,
      caption: info.captions[idx] || info.captions[0],
    }));
    console.log(`Hotel ${id}: found ${hotelGalleryMap[id].length} images`);
  }

  const diningGalleryMap = {};
  for (const [id, info] of Object.entries(DINING_GALLERY_QUERIES)) {
    const collected = [];
    for (const q of info.queries) {
      const res = await searchCommons(q, 3);
      for (const r of res) {
        if (!collected.some((c) => c.url === r.url)) {
          collected.push(r);
        }
      }
      if (collected.length >= 4) break;
    }
    diningGalleryMap[id] = collected.slice(0, 3).map((im, idx) => ({
      url: im.url,
      caption: info.captions[idx] || info.captions[0],
    }));
    console.log(`Dining ${id}: found ${diningGalleryMap[id].length} images`);
  }

  fs.writeFileSync(
    'tmp/verified_wikimedia_assets.json',
    JSON.stringify({ spotImagesMap, hotelGalleryMap, diningGalleryMap }, null, 2)
  );
  console.log('Saved tmp/verified_wikimedia_assets.json!');
}

main();
