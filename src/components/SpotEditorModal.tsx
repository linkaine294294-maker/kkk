import React, { useState, useEffect } from 'react';
import { Spot, DayPlan, CountryName, NominatimResult } from '../types/itinerary';
import { searchNominatim } from '../utils/mapUtils';
import { saveImageToDB } from '../utils/db';
import {
  X,
  Search,
  MapPin,
  Upload,
  Sparkles,
  Clock,
  Building,
  Image as ImageIcon,
  Check,
  Loader2,
} from 'lucide-react';

interface SpotEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (spot: Spot) => void;
  editingSpot?: Spot | null;
  dayPlans: DayPlan[];
  initialDay?: number;
  initialCoord?: { lat: number; lng: number } | null;
}

export const SpotEditorModal: React.FC<SpotEditorModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingSpot,
  dayPlans,
  initialDay = 1,
  initialCoord,
}) => {
  const [day, setDay] = useState<number>(initialDay);
  const [name, setName] = useState('');
  const [originalName, setOriginalName] = useState('');
  const [city, setCity] = useState('哥本哈根');
  const [country, setCountry] = useState<CountryName>('丹麥');
  const [time, setTime] = useState('');
  const [category, setCategory] = useState<Spot['category']>('attraction');
  const [lat, setLat] = useState<number>(55.6761);
  const [lng, setLng] = useState<number>(12.5805);
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [tipsText, setTipsText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageAuthor, setImageAuthor] = useState('');
  const [imageLicense, setImageLicense] = useState('');
  const [uploadedPreview, setUploadedPreview] = useState<string | null>(null);

  // Nominatim Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<NominatimResult[]>([]);

  // Sync form when editingSpot or initial values change
  useEffect(() => {
    if (editingSpot) {
      setDay(editingSpot.day);
      setName(editingSpot.name);
      setOriginalName(editingSpot.originalName || '');
      setCity(editingSpot.city);
      setCountry(editingSpot.country);
      setTime(editingSpot.time || '');
      setCategory(editingSpot.category);
      setLat(editingSpot.lat);
      setLng(editingSpot.lng);
      setAddress(editingSpot.address || '');
      setDescription(editingSpot.description);
      setTipsText(editingSpot.tips ? editingSpot.tips.join('\n') : '');
      const firstImg = editingSpot.images?.[0];
      setImageUrl(firstImg?.url || '');
      setImageAuthor(firstImg?.author || '');
      setImageLicense(firstImg?.license || '');
      setUploadedPreview(firstImg?.url?.startsWith('data:') ? firstImg.url : null);
    } else {
      setDay(initialDay);
      setName('');
      setOriginalName('');
      const targetPlan = dayPlans.find((p) => p.dayNumber === initialDay);
      if (targetPlan) {
        setCity(targetPlan.city.split(' ')[0]);
        setCountry(targetPlan.country);
      }
      setTime('');
      setCategory('attraction');
      if (initialCoord) {
        setLat(Number(initialCoord.lat.toFixed(5)));
        setLng(Number(initialCoord.lng.toFixed(5)));
      }
      setAddress('');
      setDescription('');
      setTipsText('');
      setImageUrl('');
      setImageAuthor('');
      setImageLicense('');
      setUploadedPreview(null);
    }
  }, [editingSpot, initialDay, initialCoord, dayPlans]);

  // Update country/city defaults when day selector changes
  const handleDayChange = (newDay: number) => {
    setDay(newDay);
    const plan = dayPlans.find((p) => p.dayNumber === newDay);
    if (plan && !editingSpot) {
      setCountry(plan.country);
      setCity(plan.city.split(' ')[0]);
    }
  };

  // Perform Nominatim search
  const handleSearchLocation = async () => {
    if (!searchQuery.trim()) return;
    setSearching(true);
    const results = await searchNominatim(searchQuery);
    setSearchResults(results);
    setSearching(false);
  };

  // Select Nominatim Result
  const handleSelectResult = (res: NominatimResult) => {
    const latNum = parseFloat(res.lat);
    const lngNum = parseFloat(res.lon);
    setLat(Number(latNum.toFixed(5)));
    setLng(Number(lngNum.toFixed(5)));
    setAddress(res.display_name);

    if (!name && res.name) {
      setName(res.name);
    }
    if (!originalName && res.name) {
      setOriginalName(res.name);
    }

    setSearchResults([]);
    setSearchQuery('');
  };

  // Handle Photo Upload
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size < 10MB
    if (file.size > 10 * 1024 * 1024) {
      alert('請選擇 10MB 以下的相片檔案');
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      const imgKey = `user_img_${Date.now()}`;
      await saveImageToDB(imgKey, dataUrl);
      setUploadedPreview(dataUrl);
      setImageUrl(dataUrl);
      setImageAuthor('自訂拍攝相片');
      setImageLicense('個人私有');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('請填寫景點中文名稱');
      return;
    }

    const parsedTips = tipsText
      .split('\n')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const finalImage = imageUrl.trim() || 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Stortorget_2006.jpg/1280px-Stortorget_2006.jpg';

    const spotData: Spot = {
      id: editingSpot ? editingSpot.id : `custom-spot-${Date.now()}`,
      day,
      name: name.trim(),
      originalName: originalName.trim() || undefined,
      city: city.trim() || '哥本哈根',
      country,
      time: time.trim() || undefined,
      category,
      lat: Number(lat),
      lng: Number(lng),
      address: address.trim() || undefined,
      description: description.trim() || '專屬客製化精彩景點',
      tips: parsedTips.length > 0 ? parsedTips : ['保暖防風裝備不可或缺'],
      images: [
        {
          url: finalImage,
          caption: name.trim(),
          author: imageAuthor.trim() || '自訂相片',
          license: imageLicense.trim() || 'Personal',
        },
      ],
      isCustom: true,
    };

    onSave(spotData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                {editingSpot ? '編輯景點資訊' : '新增自訂景點至行程'}
              </h3>
              <p className="text-xs text-slate-400">
                可輸入地名地理搜尋，或在地圖上點選以取得精準座標
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 text-sm font-sans">
          {/* Nominatim Search Bar */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <label className="block text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1.5">
              🔍 OpenStreetMap Nominatim 地名地理編碼搜尋
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleSearchLocation())}
                placeholder="輸入地名或景點英文（例如：Tivoli, Gamla Stan, Hallgrimskirkja）"
                className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 placeholder:text-slate-500 text-xs focus:outline-hidden focus:border-emerald-500"
              />
              <button
                type="button"
                onClick={handleSearchLocation}
                disabled={searching}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                {searching ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                <span>搜尋</span>
              </button>
            </div>

            {/* Nominatim Results Dropdown */}
            {searchResults.length > 0 && (
              <div className="mt-2 divide-y divide-slate-800 bg-slate-900 rounded-lg border border-slate-700 max-h-48 overflow-y-auto">
                {searchResults.map((res) => (
                  <button
                    key={res.place_id}
                    type="button"
                    onClick={() => handleSelectResult(res)}
                    className="w-full text-left p-2.5 hover:bg-slate-800 transition-colors flex items-start gap-2"
                  >
                    <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-semibold text-white truncate">
                        {res.name || res.display_name.split(',')[0]}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate">
                        {res.display_name}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Day & Category row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                所屬天數 (Day 1 - 15) *
              </label>
              <select
                value={day}
                onChange={(e) => handleDayChange(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 text-xs focus:outline-hidden focus:border-emerald-500"
              >
                {dayPlans.map((dp) => (
                  <option key={dp.dayNumber} value={dp.dayNumber}>
                    Day {dp.dayNumber} ({dp.dateStr}) · {dp.city}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                預計時間
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  placeholder="例如：10:30 或 下午"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 text-xs focus:outline-hidden focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                景點類別
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Spot['category'])}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 text-xs focus:outline-hidden focus:border-emerald-500"
              >
                <option value="attraction">歷史與人文景點</option>
                <option value="nature">大自然與極光</option>
                <option value="activity">極地體驗與活動</option>
                <option value="hotel">住宿酒店</option>
                <option value="dining">在地美食與餐廳</option>
                <option value="transport">交通接駁</option>
              </select>
            </div>
          </div>

          {/* Names row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                中文景點名稱 *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="例如：新港彩色木屋"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 text-xs focus:outline-hidden focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                外文/英文原名
              </label>
              <input
                type="text"
                value={originalName}
                onChange={(e) => setOriginalName(e.target.value)}
                placeholder="例如：Nyhavn"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 text-xs focus:outline-hidden focus:border-emerald-500"
              />
            </div>
          </div>

          {/* City & Country & Coordinates */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                城市
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="例如：哥本哈根"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                國家
              </label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value as CountryName)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 text-xs"
              >
                <option value="丹麥">🇩🇰 丹麥</option>
                <option value="瑞典">🇸🇪 瑞典</option>
                <option value="芬蘭">🇫🇮 芬蘭</option>
                <option value="挪威">🇳🇴 挪威</option>
                <option value="冰島">🇮🇸 冰島</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                緯度 (Latitude) *
              </label>
              <input
                type="number"
                step="any"
                required
                value={lat}
                onChange={(e) => setLat(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                經度 (Longitude) *
              </label>
              <input
                type="number"
                step="any"
                required
                value={lng}
                onChange={(e) => setLng(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 text-xs font-mono"
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              完整地址或導航地標
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="例如：Nyhavn 1-71, 1051 København K, Denmark"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 text-xs"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              景點詳細介紹
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="描述該景點的歷史、亮點、特色與預計停留行程..."
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 text-xs leading-relaxed"
            />
          </div>

          {/* Tips */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              旅行小提醒 (每行一項)
            </label>
            <textarea
              rows={2}
              value={tipsText}
              onChange={(e) => setTipsText(e.target.value)}
              placeholder="例如：&#10;建議攜帶暖暖包與手套&#10;傍晚藍調時刻點燈最美"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 text-xs leading-relaxed"
            />
          </div>

          {/* Image Upload & URL Section */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-emerald-400" />
                <span>相片設置（支援網址、本機資料夾路徑或上傳）</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">
                  相片網址或本機路徑 (如 images/Day02_克里斯蒂安堡宮/pic.jpg)
                </label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => {
                    setImageUrl(e.target.value);
                    setUploadedPreview(null);
                  }}
                  placeholder="https://... 或本機檔案路徑"
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">
                  或直接上傳相片 (存於瀏覽器高容量 IndexedDB)
                </label>
                <label className="flex items-center justify-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 border-dashed rounded-lg cursor-pointer text-xs text-slate-300 hover:text-white transition-colors">
                  <Upload className="w-3.5 h-3.5 text-emerald-400" />
                  <span>瀏覽選擇相片 (JPG/PNG)</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Photo metadata */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <input
                  type="text"
                  value={imageAuthor}
                  onChange={(e) => setImageAuthor(e.target.value)}
                  placeholder="相片作者 / 拍攝者"
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 text-xs"
                />
              </div>
              <div>
                <input
                  type="text"
                  value={imageLicense}
                  onChange={(e) => setImageLicense(e.target.value)}
                  placeholder="授權資訊 (如 CC BY-SA 4.0 / 個人著作權)"
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 text-xs"
                />
              </div>
            </div>

            {/* Preview */}
            {(uploadedPreview || imageUrl) && (
              <div className="relative w-32 h-20 rounded-lg overflow-hidden border border-slate-700">
                <img
                  src={uploadedPreview || imageUrl}
                  alt="預覽"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold bg-emerald-400 hover:bg-emerald-300 text-slate-950 rounded-lg transition-colors shadow-lg shadow-emerald-500/20 flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{editingSpot ? '儲存變更' : '新增至行程'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
