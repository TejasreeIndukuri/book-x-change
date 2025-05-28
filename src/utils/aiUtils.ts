
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

export const calculatePriceSuggestion = (books: any[], genre: string, condition: BookCondition) => {
  // Filter books by genre and condition
  const similarBooks = books.filter(book => 
    book.genre === genre && book.condition === condition
  );

  if (similarBooks.length === 0) {
    // Fallback to suggested price
    const suggested = suggestPrice(genre, condition);
    return {
      minPrice: Math.round((suggested * 0.8) * 100) / 100,
      averagePrice: suggested,
      maxPrice: Math.round((suggested * 1.2) * 100) / 100,
    };
  }

  const prices = similarBooks.map(book => book.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const averagePrice = Math.round((prices.reduce((sum, price) => sum + price, 0) / prices.length) * 100) / 100;

  return {
    minPrice,
    maxPrice,
    averagePrice,
  };
};

export const generateBookRecommendations = (userBooks: any[], allBooks: any[]) => {
  // Simple recommendation logic based on genres
  const userGenres = [...new Set(userBooks.map(book => book.genre))];
  
  return allBooks
    .filter(book => userGenres.includes(book.genre))
    .slice(0, 6);
};

export const getBookRecommendations = (allBooks: any[], currentBook: any) => {
  // Find books with similar genre
  const similarBooks = allBooks
    .filter(book => 
      book.id !== currentBook.id && 
      book.genre === currentBook.genre
    )
    .slice(0, 5);

  // Convert to recommendation format
  return similarBooks.map(book => ({
    id: book.id,
    title: book.title,
    genre: book.genre,
    similarity: Math.floor(Math.random() * 20) + 80, // Random similarity between 80-100%
  }));
};
