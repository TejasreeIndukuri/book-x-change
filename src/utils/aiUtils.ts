
import { BookCondition } from '@/types/book';

// Base pricing by condition
const basePricing: Record<BookCondition, number> = {
  'New': 0.8,
  'Like New': 0.7,
  'Very Good': 0.6,
  'Good': 0.5,
  'Acceptable': 0.3,
};

// Genre multipliers (estimated retail price factors)
const genreMultipliers: Record<string, number> = {
  'Fiction': 15,
  'Non-Fiction': 20,
  'Mystery': 14,
  'Fantasy': 16,
  'Romance': 12,
  'Science Fiction': 16,
  'Biography': 18,
  'History': 22,
  'Self-Help': 18,
  'Business': 25,
  'Technology': 30,
  'Health': 20,
  'Travel': 18,
  'Cooking': 16,
  'Art': 25,
  'Music': 18,
  'Sports': 15,
  "Children's": 10,
  'Young Adult': 12,
};

export const suggestPrice = (genre: string, condition: BookCondition): number => {
  const basePrice = genreMultipliers[genre] || 15;
  const conditionMultiplier = basePricing[condition];
  return Math.round(basePrice * conditionMultiplier * 100) / 100;
};

export const generateBookRecommendations = (userBooks: any[], allBooks: any[]) => {
  // Simple recommendation logic based on genres
  const userGenres = [...new Set(userBooks.map(book => book.genre))];
  
  return allBooks
    .filter(book => userGenres.includes(book.genre))
    .slice(0, 6);
};
