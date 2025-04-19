
import { useEffect, useState } from 'react';
import { Book } from '@/types/book';
import { BookRecommendation } from '@/types/ai';
import { getBookRecommendations } from '@/utils/aiUtils';
import { getAllBooks } from '@/services/bookService';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

interface BookRecommendationsProps {
  currentBook: Book;
}

const BookRecommendations = ({ currentBook }: BookRecommendationsProps) => {
  const [recommendations, setRecommendations] = useState<BookRecommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRecommendations = async () => {
      try {
        const books = await getAllBooks();
        const bookRecs = getBookRecommendations(books, currentBook);
        setRecommendations(bookRecs);
      } catch (error) {
        console.error('Error loading recommendations:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRecommendations();
  }, [currentBook]);

  if (loading || recommendations.length === 0) {
    return null;
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-lg">Similar Books</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {recommendations.map((rec) => (
            <div key={rec.id} className="flex items-center justify-between">
              <div>
                <p className="font-medium">{rec.title}</p>
                <p className="text-sm text-muted-foreground">{rec.genre}</p>
              </div>
              <Badge variant="secondary">{rec.similarity}% match</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default BookRecommendations;
