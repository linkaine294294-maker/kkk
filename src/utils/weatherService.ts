export interface CityWeather {
  cityKey: string;
  cityName: string;
  country: string;
  countryFlag: string;
  temp: number;
  feelsLike: number;
  conditionText: string;
  conditionIcon: string;
  tempMax: number;
  tempMin: number;
  windSpeed: number;
  humidity: number;
  auroraChance: '極高 (90%)' | '高 (75%)' | '中等 (45%)' | '低 (15%)';
  auroraKp: string;
  daylightHours: string;
  clothingTip: string;
  isPolarNight?: boolean;
}

export const NORDIC_CITIES = [
  { key: 'copenhagen', name: '哥本哈根 Copenhagen', country: '丹麥', flag: '🇩🇰', lat: 55.6761, lng: 12.5683, aurora: '低 (15%)', kp: 'Kp 1-2', daylight: '約 7 小時 (08:35-15:40)' },
  { key: 'stockholm', name: '斯德哥爾摩 Stockholm', country: '瑞典', flag: '🇸🇪', lat: 59.3293, lng: 18.0686, aurora: '中等 (45%)', kp: 'Kp 2-3', daylight: '約 6 小時 (08:45-14:50)' },
  { key: 'lapland', name: '拉普蘭 / 伊瓦洛 Saariselkä', country: '芬蘭', flag: '🇫🇮', lat: 68.4194, lng: 27.4100, aurora: '極高 (90%)', kp: 'Kp 4-5 ★', daylight: '極夜幽藍晨昏約 3 小時 (10:30-13:30)' },
  { key: 'helsinki', name: '赫爾辛基 Helsinki', country: '芬蘭', flag: '🇫🇮', lat: 60.1699, lng: 24.9384, aurora: '中等 (45%)', kp: 'Kp 2-3', daylight: '約 5.5 小時 (09:20-15:15)' },
  { key: 'oslo', name: '奧斯陸 Oslo', country: '挪威', flag: '🇳🇴', lat: 59.9139, lng: 10.7522, aurora: '中等 (45%)', kp: 'Kp 2-3', daylight: '約 6 小時 (09:15-15:15)' },
  { key: 'tromso', name: '特羅姆瑟 Tromsø', country: '挪威', flag: '🇳🇴', lat: 69.6492, lng: 18.9553, aurora: '極高 (90%)', kp: 'Kp 4-6 ★', daylight: '極夜期間無日出 (幽藍暮光約 3 小時)' },
  { key: 'reykjavik', name: '雷克雅維克 Reykjavik', country: '冰島', flag: '🇮🇸', lat: 64.1466, lng: -21.9426, aurora: '極高 (90%)', kp: 'Kp 4-5 ★', daylight: '約 4 小時 (11:20-15:30)' },
];

function decodeWeatherCode(code: number): { text: string; icon: string } {
  if (code === 0) return { text: '晴朗極致冬景', icon: '☀️' };
  if (code === 1 || code === 2) return { text: '晴時多雲', icon: '🌤️' };
  if (code === 3) return { text: '極地陰天', icon: '☁️' };
  if (code === 45 || code === 48) return { text: '晨曦霧淞與濃霧', icon: '🌫️' };
  if (code >= 51 && code <= 55) return { text: '細雪飄飄', icon: '🌨️' };
  if (code >= 61 && code <= 65) return { text: '冬季降雨', icon: '🌧️' };
  if (code >= 71 && code <= 77) return { text: '皚皚厚白粉雪', icon: '❄️' };
  if (code >= 80 && code <= 82) return { text: '陣雨雪', icon: '🌦️' };
  if (code >= 85 && code <= 86) return { text: '壯觀極地暴雪', icon: '🌨️' };
  return { text: '多雲微寒', icon: '☁️' };
}

function getClothingTip(temp: number, feelsLike: number): string {
  const t = Math.min(temp, feelsLike);
  if (t <= -15) {
    return '極度酷寒：穿著重裝極地羽絨大衣、羊毛排汗底層、加厚雪褲、防凍雪靴與雙層羊毛手套。';
  } else if (t <= -5) {
    return '嚴寒冰雪：三層穿法（排汗底層 + 保暖抓絨/羊毛中層 + 防風防水外套），必戴毛帽遮住雙耳。';
  } else if (t <= 2) {
    return '冬日微寒：保暖長版防風外套、羊毛圍巾、手套與防滑保暖短靴即可舒適探索。';
  } else {
    return '涼爽多雲：防風大衣搭配針織毛衣與長褲，隨身攜帶輕量圍巾。';
  }
}

export async function fetchCityWeather(cityKey: string): Promise<CityWeather> {
  const city = NORDIC_CITIES.find((c) => c.key === cityKey) || NORDIC_CITIES[0];

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset&timezone=auto`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      const current = data.current;
      const daily = data.daily;
      const condition = decodeWeatherCode(current.weather_code);

      return {
        cityKey: city.key,
        cityName: city.name,
        country: city.country,
        countryFlag: city.flag,
        temp: Math.round(current.temperature_2m),
        feelsLike: Math.round(current.apparent_temperature),
        conditionText: condition.text,
        conditionIcon: condition.icon,
        tempMax: Math.round(daily.temperature_2m_max?.[0] ?? current.temperature_2m + 2),
        tempMin: Math.round(daily.temperature_2m_min?.[0] ?? current.temperature_2m - 4),
        windSpeed: Math.round(current.wind_speed_10m),
        humidity: Math.round(current.relative_humidity_2m),
        auroraChance: city.aurora as any,
        auroraKp: city.kp,
        daylightHours: city.daylight,
        clothingTip: getClothingTip(current.temperature_2m, current.apparent_temperature),
        isPolarNight: city.key === 'tromso' || city.key === 'lapland',
      };
    }
  } catch (e) {
    console.warn('Weather API failed, fallback to seasonal estimate', e);
  }

  // Realistic seasonal winter fallback averages
  const fallbackTemps: Record<string, { t: number; fl: number; icon: string; text: string }> = {
    copenhagen: { t: 2, fl: -2, icon: '🌤️', text: '冬季晴朗' },
    stockholm: { t: -1, fl: -5, icon: '❄️', text: '老城飄微雪' },
    lapland: { t: -14, fl: -21, icon: '❄️', text: '極地粉雪覆蓋' },
    helsinki: { t: -3, fl: -8, icon: '☁️', text: '海灣寒風陰天' },
    oslo: { t: -2, fl: -6, icon: '🌤️', text: '峽灣清朗冷冽' },
    tromso: { t: -4, fl: -10, icon: '🌌', text: '極夜極光漫天' },
    reykjavik: { t: 0, fl: -6, icon: '🌨️', text: '火山熔原陣雪' },
  };

  const fb = fallbackTemps[city.key] || { t: -2, fl: -6, icon: '❄️', text: '北歐冬雪' };

  return {
    cityKey: city.key,
    cityName: city.name,
    country: city.country,
    countryFlag: city.flag,
    temp: fb.t,
    feelsLike: fb.fl,
    conditionText: fb.text,
    conditionIcon: fb.icon,
    tempMax: fb.t + 2,
    tempMin: fb.t - 4,
    windSpeed: 18,
    humidity: 82,
    auroraChance: city.aurora as any,
    auroraKp: city.kp,
    daylightHours: city.daylight,
    clothingTip: getClothingTip(fb.t, fb.fl),
    isPolarNight: city.key === 'tromso' || city.key === 'lapland',
  };
}

export function getCityKeyFromDayCity(cityStr: string): string {
  const lower = cityStr.toLowerCase();
  if (lower.includes('哥本哈根') || lower.includes('copenhagen')) return 'copenhagen';
  if (lower.includes('斯德哥爾摩') || lower.includes('stockholm')) return 'stockholm';
  if (lower.includes('伊瓦洛') || lower.includes('ivalo') || lower.includes('拉普蘭') || lower.includes('saariselkä')) return 'lapland';
  if (lower.includes('赫爾辛基') || lower.includes('helsinki')) return 'helsinki';
  if (lower.includes('奧斯陸') || lower.includes('oslo')) return 'oslo';
  if (lower.includes('特羅姆瑟') || lower.includes('tromsø') || lower.includes('tromso')) return 'tromso';
  if (lower.includes('雷克雅維克') || lower.includes('reykjavik') || lower.includes('冰島') || lower.includes('金圈') || lower.includes('格林達維克') || lower.includes('藍湖')) return 'reykjavik';
  return 'copenhagen';
}
