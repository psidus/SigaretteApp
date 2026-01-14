export type PlaceCategory = 'bar' | 'club' | 'restaurant' | 'cafe' | 'pub' | 'lounge' | 'cigarettes' | 'other';

export interface Place {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  lat: number;
  lng: number;
  categories: PlaceCategory[];
  open_time: string;
  close_time: string;
  address: string | null;
  created_at: string;
  updated_at: string;
}

export const CATEGORY_CONFIG: Record<PlaceCategory, { icon: string; label: string }> = {
  bar: { icon: '🍺', label: 'Bar' },
  club: { icon: '🎉', label: 'Club' },
  restaurant: { icon: '🍽️', label: 'Ristorante' },
  cafe: { icon: '☕', label: 'Caffè' },
  pub: { icon: '🍻', label: 'Pub' },
  lounge: { icon: '🛋️', label: 'Lounge' },
  cigarettes: { icon: '🚬', label: 'Sigarette' },
  other: { icon: '📍', label: 'Altro' },
};