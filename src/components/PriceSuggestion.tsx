
import { useEffect, useState } from 'react';
import { Book, BookCondition } from '@/types/book';
import { PriceSuggestion as PriceSuggestionType } from '@/types/ai';
import { calculatePriceSuggestion } from '@/utils/aiUtils';
import { getAllBooks } from '@/services/bookService';
import { Card, CardContent } from './ui/card';

interface PriceSuggestionProps {
  genre: string;
  condition: BookCondition;
}

const PriceSuggestion = ({ genre, condition }: PriceSuggestionProps) => {
  const [suggestion, setSuggestion] = useState<PriceSuggestionType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSuggestion = async () => {
      try {
        const books = await getAllBooks();
        const priceSuggestion = calculatePriceSuggestion(books, genre, condition);
        setSuggestion(priceSuggestion);
      } catch (error) {
        console.error('Error loading price suggestion:', error);
      } finally {
        setLoading(false);
      }
    };

    if (genre && condition) {
      loadSuggestion();
    }
  }, [genre, condition]);

  if (!genre || !condition || loading) {
    return null;
  }

  return (
    <Card className="mt-2">
      <CardContent className="pt-4">
        <p className="text-sm text-muted-foreground mb-2">Suggested price range:</p>
        <div className="flex justify-between text-sm">
          <span>Min: ${suggestion?.minPrice}</span>
          <span>Avg: ${suggestion?.averagePrice}</span>
          <span>Max: ${suggestion?.maxPrice}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default PriceSuggestion;
