import re

with open('src/components/PolarExpressReindeerRpgModal.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Check if BOSS_EPIC_CHANT_DATA is already present
if 'BOSS_EPIC_CHANT_DATA' not in code:
    epic_chant_block = '''
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
'''
    target = 'export const RPG_CHAPTERS: RpgChapter[] = ['
    code = code.replace(target, epic_chant_block + '\n' + target)
    print('Added BOSS_EPIC_CHANT_DATA')

# 2. Add React states for Epic Chant and Item Menu
state_target = '  const [activeShopModal, setActiveShopModal] = useState<NordicShopData | null>(null);'
new_states = '''  const [activeShopModal, setActiveShopModal] = useState<NordicShopData | null>(null);
  const [isEpicChantMenuOpen, setIsEpicChantMenuOpen] = useState<boolean>(false);
  const [epicChantRoundIdx, setEpicChantRoundIdx] = useState<number>(0);
  const [epicChantFeedback, setEpicChantFeedback] = useState<{ quote: string; isCorrect: boolean } | null>(null);
  const [isItemMenuOpen, setIsItemMenuOpen] = useState<boolean>(false);
  const [buildingToast, setBuildingToast] = useState<string | null>(null);'''

if 'isEpicChantMenuOpen' not in code:
    code = code.replace(state_target, new_states, 1)
    print('Added new React states')

# 3. Call drawInteractiveTownBuildings on world map
old_draw_line = 'drawTownAtmosphereDecorations(ctx, currentChapterIdx, width, height, tick);'
new_draw_line = '''drawTownAtmosphereDecorations(ctx, currentChapterIdx, width, height, tick);

      // 1.6 Draw Interactive Town Buildings (各國城鎮特色建築：客棧、鍛造坊、聖堂、圖書館、天文台等)
      drawInteractiveTownBuildings(ctx, currentChapter.id, tick, playerPosRef.current);'''

if 'drawInteractiveTownBuildings(ctx, currentChapter.id, tick, playerPosRef.current);' not in code:
    code = code.replace(old_draw_line, new_draw_line, 1)
    print('Added drawInteractiveTownBuildings call in world map')

# 4. In handleKeyDown: allow entering buildings with E / Enter / Space
old_key_npc = '''        const nearNpc = chapterNpcs.find((n) => Math.hypot(playerPosRef.current.x - n.x, playerPosRef.current.y - n.y) < 60);'''
new_key_npc = '''        // Check Town Interactive Buildings
        const townBuildings = NORDIC_BUILDINGS_CONFIG[currentChapter.id] || [];
        const nearBuilding = townBuildings.find((b) => Math.hypot(playerPosRef.current.x - b.x, playerPosRef.current.y - b.y) < 65);
        if (nearBuilding) {
          setActiveBuildingModal(nearBuilding);
          playRetroSound('blip');
          return;
        }

        const nearNpc = chapterNpcs.find((n) => Math.hypot(playerPosRef.current.x - n.x, playerPosRef.current.y - n.y) < 60);'''

if 'const townBuildings = NORDIC_BUILDINGS_CONFIG[currentChapter.id] || [];' not in code:
    code = code.replace(old_key_npc, new_key_npc, 1)
    print('Added handleKeyDown building check')

# 5. In handleCanvasClick: allow entering buildings by clicking on them
old_click_shop = '''    // Click on Town Shop Station (點擊城鎮商鋪進入商店)
    const currentShop = NORDIC_SHOPS_CONFIG[currentChapter.id];
    if (currentShop && Math.hypot(clickX - currentShop.x, clickY - currentShop.y) < 46) {
      setActiveShopModal(currentShop);
      playRetroSound('blip');
      return;
    }'''
new_click_shop = '''    // Click on Town Interactive Building (點擊城鎮特色建築)
    const currentBuildings = NORDIC_BUILDINGS_CONFIG[currentChapter.id] || [];
    for (const bld of currentBuildings) {
      if (Math.hypot(clickX - bld.x, clickY - bld.y) < 46) {
        setActiveBuildingModal(bld);
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
    }'''

if 'const currentBuildings = NORDIC_BUILDINGS_CONFIG[currentChapter.id] || [];' not in code:
    code = code.replace(old_click_shop, new_click_shop, 1)
    print('Added handleCanvasClick building check')

with open('src/components/PolarExpressReindeerRpgModal.tsx', 'w', encoding='utf-8') as f:
    f.write(code)

print('Base changes successfully written')
