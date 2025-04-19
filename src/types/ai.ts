
export interface PriceSuggestion {
  minPrice: number;
  maxPrice: number;
  averagePrice: number;
}

export interface BookRecommendation {
  id: string;
  title: string;
  similarity: number;
  genre: string;
}
