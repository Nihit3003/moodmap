export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface PlaceSource {
  title: string;
  uri: string;
}

export interface GroundingChunk {
  maps?: {
    source: PlaceSource;
    title: string;
    uri: string;
    placeId?: string;
  };
}

export interface RecommendationResponse {
  text: string;
  places: GroundingChunk[];
}

export enum MoodType {
  WORK = 'Productive Work',
  DATE = 'Romantic Date',
  QUICK = 'Quick Bite',
  BUDGET = 'Budget Friendly',
  COFFEE = 'Great Coffee',
  FANCY = 'Fine Dining',
  QUIET = 'Quiet & Cozy',
  OUTDOORS = 'Outdoorsy'
}

export interface PlaceCardProps {
  place: GroundingChunk;
  index: number;
}

export type SortOption = 'relevance' | 'rating' | 'distance';
export type PriceLevel = 'any' | 'budget' | 'moderate' | 'expensive';

export interface FilterState {
  openNow: boolean;
  topRated: boolean; // 4.5+
  priceLevel: PriceLevel;
}