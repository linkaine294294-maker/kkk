import React, { useState } from 'react';
import {
  Gift,
  ShoppingBag,
  Sparkles,
  X,
  MapPin,
  ExternalLink,
  Tag,
  CheckCircle2,
  DollarSign,
  Compass,
  Star,
} from 'lucide-react';
import { SafeImage } from './SafeImage';

interface SouvenirItem {
  id: string;
  name: string;
  originalName: string;
  country: '丹麥' | '瑞典' | '芬蘭' | '挪威' | '冰島';
  flag: string;
  category: '設計工藝' | '保暖服飾' | '特色美食' | '美妝護膚' | '生活居家';
  priceRange: '平價親民 (<NT$1,000)' | '中高質感 (NT$1,000-5,000)' | '頂級典藏 (NT$5,000+)';
  description: string;
  whyBuy: string;
  recommendedBrands: string[];
  buyingLocation: string;
  imageUrl: string;
}

const NORDIC_SOUVENIRS: SouvenirItem[] = [
  // 丹麥
  {
    id: 'souv-royal-copenhagen',
    name: '皇家哥本哈根手繪名瓷 (Royal Copenhagen)',
    originalName: 'Royal Copenhagen Porcelain',
    country: '丹麥',
    flag: '🇩🇰',
    category: '設計工藝',
    priceRange: '頂級典藏 (NT$5,000+)',
    description:
      '創立於1775年丹麥皇室御用瓷器，每一只經典唐草（Blue Fluted）瓷盤或聖誕紀念盤均由資深畫師親手繪製並留有底款畫師簽名。',
    whyBuy: '丹麥最高工藝代表，聖誕年度紀念盤極具收藏增值價值。',
    recommendedBrands: ['Royal Copenhagen Flagship (Strøget步行街)'],
    buyingLocation: '哥本哈根 Strøget 步行街旗艦店、Illum 百貨',
    imageUrl: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'souv-danish-butter-cookies',
    name: '丹麥頂級手工奶油曲奇與甘草糖',
    originalName: 'Danish Butter Cookies & Lakrids by Bülow',
    country: '丹麥',
    flag: '🇩🇰',
    category: '特色美食',
    priceRange: '平價親民 (<NT$1,000)',
    description:
      '嚴選優質純奶油烘焙的金黃酥脆曲奇，以及顛覆味蕾的精品巧克力甘草糖 Lakrids by Bülow（聖誕金粉限定版）。',
    whyBuy: '辦公室與親友分享首選伴手禮，經典皇家鐵盒包裝。',
    recommendedBrands: ['Lakrids by Bülow', 'Kelsen Royal Dansk', 'Summerbird Organic'],
    buyingLocation: '哥本哈根各大超市、Magasin du Nord 百貨',
    imageUrl: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=800&q=80',
  },

  // 瑞典
  {
    id: 'souv-dala-horse',
    name: '瑞典達拉木馬 (Dalahäst)',
    originalName: 'Swedish Dala Horse',
    country: '瑞典',
    flag: '🇸🇪',
    category: '設計工藝',
    priceRange: '中高質感 (NT$1,000-5,000)',
    description:
      '瑞典象徵力量、勇氣與家庭溫暖的守護神。傳統由達拉納地區工匠純手工斧頭雕刻，並繪以明豔的 Kurbits 花草彩繪。',
    whyBuy: '瑞典最經典的國家圖騰象徵，每隻紋理與手繪筆觸獨一無二。',
    recommendedBrands: ['Grannas A. Olsson', 'Nils Olsson'],
    buyingLocation: '斯德哥爾摩老城區 Gamla Stan、NK 百貨',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Dalecarlian_horse.jpg/1280px-Dalecarlian_horse.jpg',
  },
  {
    id: 'souv-cloudberry-jam',
    name: '北極黃金野雲莓果醬 (Hjortronsylt)',
    originalName: 'Arctic Cloudberry Jam (Hjortron)',
    country: '瑞典',
    flag: '🇸🇪',
    category: '特色美食',
    priceRange: '平價親民 (<NT$1,000)',
    description:
      '生長於北極圈泥炭濕地的珍稀野果，富含維生素C與琥珀金黃色澤，被譽為「北歐森林中的黃金」，搭配烤布里乳酪（Brie）或鬆餅極致奢華。',
    whyBuy: '人工無法溫室栽種，全靠拉普蘭原住民夏季手工採摘。',
    recommendedBrands: ['Torfolk Gård', 'Felix Cloudberry', 'Önos'],
    buyingLocation: '斯德哥爾摩 Östermalms Saluhall 美食市集、ICA 超市',
    imageUrl: 'https://images.unsplash.com/photo-1589733955941-5eeaf752f6dd?auto=format&fit=crop&w=800&q=80',
  },

  // 芬蘭
  {
    id: 'souv-moomin-iittala',
    name: '嚕嚕米聯名陶瓷馬克杯 & Iittala 玻璃工藝',
    originalName: 'Moomin Arabia Mugs & Iittala Glassware',
    country: '芬蘭',
    flag: '🇫🇮',
    category: '生活居家',
    priceRange: '平價親民 (<NT$1,000)',
    description:
      '芬蘭國寶作家朵貝·楊笙創作的童話角色 Moomin，由百年瓷廠 Arabia 每年推出限量冬季主題杯；搭配 Iittala 水波紋玻璃器皿。',
    whyBuy: '高實用性且療癒度破表，冬季限定款每年必搶。',
    recommendedBrands: ['Arabia Finland', 'Iittala', 'Moomin Shop Official'],
    buyingLocation: '赫爾辛基 Esplanadi 旗艦店、嚕嚕米專賣店、Stockmann 百貨',
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'souv-marimekko-fabrics',
    name: 'Marimekko 經典罌粟花印花帆布包與服飾',
    originalName: 'Marimekko Unikko Design',
    country: '芬蘭',
    flag: '🇫🇮',
    category: '設計工藝',
    priceRange: '中高質感 (NT$1,000-5,000)',
    description:
      '象徵芬蘭大膽、自信與快樂美學的經典 Unikko（罌粟花）印花，以天然棉麻與環保染料製作手提包、雨傘及家居織品。',
    whyBuy: '北歐設計界殿堂級標誌，赫爾辛基專門店退稅後價格極具吸引力。',
    recommendedBrands: ['Marimekko Flagship Helsinki'],
    buyingLocation: '赫爾辛基 Mikonkatu 旗艦店、Outlet Herttoniemi',
    imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'souv-fazer-geisha',
    name: 'Fazer 經典藍牌與 Geisha 榛果巧克力',
    originalName: 'Fazer Blue & Geisha Chocolates',
    country: '芬蘭',
    flag: '🇫🇮',
    category: '特色美食',
    priceRange: '平價親民 (<NT$1,000)',
    description:
      '芬蘭自1922年傳承至今的國寶巧克力，堅持使用新鮮液態牛奶而非奶粉製作，口感極度絲滑濃郁，粉紅色 Geisha 則裹滿香脆榛果蓉。',
    whyBuy: '芬蘭人自豪的國民甜蜜回憶，聖誕特別版大禮盒超大方。',
    recommendedBrands: ['Karl Fazer Official'],
    buyingLocation: '赫爾辛基 Kluuvikatu 3 百年咖啡旗艦店、機場免稅店',
    imageUrl: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=800&q=80',
  },

  // 挪威
  {
    id: 'souv-dale-of-norway',
    name: 'Dale of Norway 百年純羊毛針織毛衣',
    originalName: 'Dale of Norway Pure Wool Sweaters',
    country: '挪威',
    flag: '🇳🇴',
    category: '保暖服飾',
    priceRange: '頂級典藏 (NT$5,000+)',
    description:
      '創立於1879年挪威西海岸 Dale 村莊，每一件毛衣皆使用 100% 頂級挪威羊毛與傳統八瓣玫瑰圖騰編織，防風抗寒、耐穿數十年。',
    whyBuy: '挪威奧運滑雪國家隊御用品牌，保暖抗寒性能頂級。',
    recommendedBrands: ['Dale of Norway Flagship (Oslo Karl Johan)'],
    buyingLocation: '奧斯陸 Karl Johans gate 旗艦店、卑爾根布呂根碼頭專賣店',
    imageUrl: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'souv-norwegian-brunost',
    name: '挪威特產焦糖棕起司 (Brunost / Gudbrandsdalsost)',
    originalName: 'Norwegian Brown Cheese (Brunost)',
    country: '挪威',
    flag: '🇳🇴',
    category: '特色美食',
    priceRange: '平價親民 (<NT$1,000)',
    description:
      '將乳清慢火熬煮數小時讓乳糖焦糖化，呈現微甜帶有太妃糖、花生醬般滑順口感的獨特起司，搭配特製起司刨刀（Ostehøvel）刨薄片夾麵包。',
    whyBuy: '全地球僅挪威獨有的神奇乳酪口感，起司控絕對驚艷。',
    recommendedBrands: ['TINE Gudbrandsdalsost'],
    buyingLocation: '奧斯陸各大超市（Meny、Rema 1000）、Mathallen 美食廣場',
    imageUrl: 'https://images.unsplash.com/photo-1452195100486-9cc805987862?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'souv-salmon-roe-tubes',
    name: 'Mills 挪威煙燻鱈魚子/鮭魚子擠壓醬 (Kaviar)',
    originalName: 'Mills Ekte Kaviar Tubes',
    country: '挪威',
    flag: '🇳🇴',
    category: '特色美食',
    priceRange: '平價親民 (<NT$1,000)',
    description:
      '挪威早餐靈魂！牙膏型鋁管包裝，內裝嚴選挪威海域煙燻鱈魚子，鹹香鮮甜，擠在水煮蛋或脆餅（Knekkebrød）上滋味絕倫。',
    whyBuy: '超輕巧便攜、保存方便，送禮極具北歐日常生活感。',
    recommendedBrands: ['Mills Kaviar', 'Stabburet'],
    buyingLocation: '挪威全境連鎖超市',
    imageUrl: 'https://images.unsplash.com/photo-1534482421-64566f976cfa?auto=format&fit=crop&w=800&q=80',
  },

  // 冰島
  {
    id: 'souv-blue-lagoon-silica',
    name: '冰島藍湖地熱白矽泥火山泥面膜 (Silica Mud Mask)',
    originalName: 'Blue Lagoon Iceland Silica Mud Mask',
    country: '冰島',
    flag: '🇮🇸',
    category: '美妝護膚',
    priceRange: '中高質感 (NT$1,000-5,000)',
    description:
      '萃取自藍湖千米深處純淨地熱海水與白矽泥礦物，能深度潔淨毛孔、平衡油脂並強韌肌膚屏障，全球各大美妝雜誌評選第一。',
    whyBuy: '第12天藍湖行程現場必買！火山礦物成分無可取代。',
    recommendedBrands: ['Blue Lagoon Skincare Official'],
    buyingLocation: '藍湖現場商店、雷克雅維克 Laugavegur 專賣店、Keflavik 機場免稅',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Refleksjoner.jpg/1280px-Refleksjoner.jpg',
  },
  {
    id: 'souv-icelandic-lopapeysa',
    name: '冰島純種火山羊毛衣 (Lopapeysa) & 66°North',
    originalName: 'Handmade Icelandic Lopapeysa Wool & 66°North',
    country: '冰島',
    flag: '🇮🇸',
    category: '保暖服飾',
    priceRange: '頂級典藏 (NT$5,000+)',
    description:
      '使用純種冰島羊獨有的雙層羊毛（Lopi），外層防水防風、內層保暖蓬鬆，頸部帶有圓形火山口圖騰；搭配冰島百年機能潮牌 66°North。',
    whyBuy: '每一件皆由冰島當地媽媽毛織手作協會（Handknitting Association）親手編織。',
    recommendedBrands: ['The Handknitting Association of Iceland', '66°North'],
    buyingLocation: '雷克雅維克 Skólavörðustígur 19 冰島手織協會',
    imageUrl: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'souv-lava-salt-omnom',
    name: 'Saltverk 火山黑熔岩海鹽 & Omnom 手工精品巧克力',
    originalName: 'Saltverk Lava Salt & Omnom Craft Chocolate',
    country: '冰島',
    flag: '🇮🇸',
    category: '特色美食',
    priceRange: '平價親民 (<NT$1,000)',
    description:
      '使用西峽灣地熱蒸氣萃取的手工金字塔型海鹽，揉合活性火山炭（Lava Salt）；搭配包裝如藝術插畫、獲獎無數的 Omnom 焦糖甘草黑巧克力。',
    whyBuy: '米其林主廚指定用鹽，伴手禮包裝精緻度滿分。',
    recommendedBrands: ['Saltverk Iceland', 'Omnom Chocolate'],
    buyingLocation: '雷克雅維克 Bónus 小豬超市、Grandagarður 港區 Omnom 工廠',
    imageUrl: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=800&q=80',
  },
];

interface NordicSouvenirsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NordicSouvenirsModal: React.FC<NordicSouvenirsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedCountry, setSelectedCountry] = useState<string>('全部');
  const [selectedCategory, setSelectedCategory] = useState<string>('全部');
  const [activeItem, setActiveItem] = useState<SouvenirItem | null>(null);

  if (!isOpen) return null;

  const filteredItems = NORDIC_SOUVENIRS.filter((item) => {
    const matchCountry = selectedCountry === '全部' || item.country === selectedCountry;
    const matchCategory = selectedCategory === '全部' || item.category === selectedCategory;
    return matchCountry && matchCategory;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl my-auto bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Festive Garland Bar */}
        <div className="h-1 bg-gradient-to-r from-amber-400 via-rose-500 via-emerald-400 to-sky-400" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-slate-950/80 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white rounded-full transition-colors"
          aria-label="關閉"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Hero */}
        <div className="p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-indigo-950/50 to-slate-900 border-b border-slate-800">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest mb-2">
            <Gift className="w-4 h-4 text-amber-400" />
            <span>Nordic Souvenirs & Specialty Shopping Guide</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-serif font-black text-white tracking-tight flex items-center gap-2.5">
            <span>北歐五國必買紀念品與特產指南</span>
            <ShoppingBag className="w-6 h-6 text-emerald-400" />
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
            為同學與旅伴精心彙整：丹麥皇家瓷器、瑞典達拉木馬、芬蘭嚕嚕米與Marimekko、挪威純羊毛衣與焦糖棕起司、冰島火山黑鹽與藍湖白矽泥！含退稅與專門店資訊。
          </p>

          {/* Filter Ribbons */}
          <div className="flex flex-wrap items-center gap-2 mt-5">
            {/* Country Filters */}
            <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs overflow-x-auto">
              {['全部', '丹麥', '瑞典', '芬蘭', '挪威', '冰島'].map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedCountry(c)}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap ${
                    selectedCountry === c
                      ? 'bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {c === '全部' ? '全部國家' : c}
                </button>
              ))}
            </div>

            {/* Category Filters */}
            <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs overflow-x-auto">
              {['全部', '設計工藝', '保暖服飾', '特色美食', '美妝護膚', '生活居家'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Scrollable Souvenir Grid */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto no-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-slate-950/70 border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden flex flex-col justify-between shadow-xl transition-all group"
              >
                <div>
                  {/* Image Banner */}
                  <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-slate-900">
                    <SafeImage
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md text-white text-xs font-semibold shadow-md">
                        <span>{item.flag}</span>
                        <span>{item.country}</span>
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-xs font-semibold backdrop-blur-md">
                        {item.category}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-bold shadow-md">
                      {item.priceRange}
                    </div>

                    <div className="absolute bottom-3 left-3 right-3">
                      <h4 className="text-base sm:text-lg font-serif font-bold text-white drop-shadow-md">
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-slate-300 font-mono drop-shadow">
                        {item.originalName}
                      </p>
                    </div>
                  </div>

                  {/* Content Info */}
                  <div className="p-4 sm:p-5 space-y-3">
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {item.description}
                    </p>

                    <div className="p-2.5 rounded-xl bg-amber-400/10 border border-amber-400/20 text-xs text-amber-200">
                      <span className="font-bold block mb-0.5 text-amber-300">💡 必買推薦理由：</span>
                      <span>{item.whyBuy}</span>
                    </div>

                    <div className="space-y-1 text-xs text-slate-400 pt-1">
                      <div className="flex items-start gap-1.5">
                        <Star className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span><strong>推薦品牌/系列：</strong>{item.recommendedBrands.join('、')}</span>
                      </div>
                      <div className="flex items-start gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span><strong>推薦購買地點：</strong>{item.buyingLocation}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 sm:p-5 pt-0 mt-auto">
                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-[11px] text-emerald-400 font-semibold">
                      ✓ 享北歐 12%～19% 觀光退稅
                    </span>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.buyingLocation + ' ' + item.country)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-white hover:text-emerald-300 flex items-center gap-1"
                    >
                      <span>在 Google 地圖尋找</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* VAT Tax Refund Practical Guide Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-950 border border-indigo-500/30 space-y-3">
            <h3 className="text-sm sm:text-base font-serif font-bold text-white flex items-center gap-2">
              <Tag className="w-4 h-4 text-emerald-400" />
              <span>北歐五國購物退稅（Tax-Free / Global Blue / Planet）超實用指南</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="font-bold text-amber-400 block mb-1">1. 單店結帳門檻</span>
                <span>丹麥約 DKK 300、瑞典 SEK 200、芬蘭 €40、挪威 NOK 315、冰島 ISK 6,000，記得向店員索取「Tax Free Form」。</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="font-bold text-emerald-400 block mb-1">2. 海關蓋章與機場退稅</span>
                <span>離開歐盟最後一站（如冰島雷克雅維克機場或赫爾辛基轉機機場）至海關 Customs 櫃台蓋章或掃描電子退稅機台。</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="font-bold text-sky-400 block mb-1">3. 信用卡或現金退款</span>
                <span>推薦選擇退回信用卡帳戶（約 3-7 個工作天入帳），省去排隊兌換外幣現金之手續費。</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            共精選 {filteredItems.length} 項北歐代表性特產
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-xs transition-colors"
          >
            關閉指南
          </button>
        </div>
      </div>
    </div>
  );
};
