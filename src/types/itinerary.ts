export type CountryName = '丹麥' | '瑞典' | '芬蘭' | '挪威' | '冰島';

export interface SpotImage {
  id?: string;
  url: string;
  caption?: string;
  author?: string;
  license?: string;
  sourceUrl?: string;
}

export interface Spot {
  id: string;
  day: number; // 1 to 15
  time?: string;
  name: string;
  originalName?: string;
  city: string;
  country: CountryName;
  lat: number;
  lng: number;
  category: 'attraction' | 'hotel' | 'dining' | 'nature' | 'transport' | 'activity';
  description: string;
  tips: string[];
  images: SpotImage[];
  hotelRecommendation?: {
    name: string;
    description: string;
  };
  diningRecommendation?: {
    name: string;
    description: string;
  };
  address?: string;
  isCustom?: boolean;
  story?: string;
  trivia?: string;
  mustDo?: string[];
}

export interface DayPlan {
  dayNumber: number;
  dateStr: string;
  weekday: string;
  title: string;
  city: string;
  country: CountryName;
  countryFlag: string;
  hotel: string;
  hotelDetail?: string;
  summary: string;
  color: string; // Hex color for markers and route
}

export interface NominatimResult {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  lat: string;
  lon: string;
  display_name: string;
  name?: string;
}
