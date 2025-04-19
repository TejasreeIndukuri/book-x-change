
import { Book, BookCondition } from "@/types/book";
import { PriceSuggestion, BookRecommendation } from "@/types/ai";

// Simple condition-based multiplier for price calculations
const conditionMultipliers: Record<BookCondition, number> = {
  'new': 1.0,
  'like-new': 0.9,
  'good': 0.7,
  'fair': 0.5,
  'poor': 0.3
};

export const calculatePriceSuggestion = (books: Book[], genre: string, condition: BookCondition): PriceSuggestion => {
  // Filter books by genre
  const genreBooks = books.filter(book => book.genre.toLowerCase() === genre.toLowerCase());
  
  if (genreBooks.length === 0) {
    // Provide default suggestions if no books in genre
    return {
      minPrice: 5,
      maxPrice: 30,
      averagePrice: 15
    };
  }

  // Calculate base prices from similar books
  const prices = genreBooks.map(book => book.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;

  // Apply condition multiplier
  const multiplier = conditionMultipliers[condition];
  
  return {
    minPrice: Math.round(minPrice * multiplier),
    maxPrice: Math.round(maxPrice * multiplier),
    averagePrice: Math.round(avgPrice * multiplier)
  };
};

// Simple genre-based similarity scoring
export const getBookRecommendations = (books: Book[], currentBook: Book): BookRecommendation[] => {
  // Filter out the current book and get books in same genre
  const recommendations = books
    .filter(book => book.id !== currentBook.id)
    .map(book => {
      // Calculate simple similarity score
      let similarity = 0;
      
      // Genre match (50% weight)
      if (book.genre.toLowerCase() === currentBook.genre.toLowerCase()) {
        similarity += 0.5;
      }
      
      // Price range similarity (25% weight)
      const priceDiff = Math.abs(book.price - currentBook.price) / currentBook.price;
      similarity += (1 - Math.min(priceDiff, 1)) * 0.25;
      
      // Condition similarity (25% weight)
      if (book.condition === currentBook.condition) {
        similarity += 0.25;
      }

      return {
        id: book.id,
        title: book.title,
        similarity: Math.round(similarity * 100),
        genre: book.genre
      };
    })
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 3); // Get top 3 recommendations

  return recommendations;
};
