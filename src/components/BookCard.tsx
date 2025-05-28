import { useState } from 'react';
import { Book } from '@/types/book';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Edit, Trash2, Send } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { createExchangeRequest } from '@/services/exchangeService';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import BookRecommendations from './BookRecommendations';

interface BookCardProps {
  book: Book;
  onEdit?: () => void;
  onDelete?: () => void;
  isOwner?: boolean;
}

const BookCard = ({ book, onEdit, onDelete, isOwner = false }: BookCardProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isExchangeOpen, setIsExchangeOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRequestExchange = async () => {
    if (!user) {
      toast.error('You must be logged in to request an exchange');
      return navigate('/login');
    }

    if (user.id === book.userId) {
      toast.error('You cannot request your own book');
      return;
    }

    setIsLoading(true);
    try {
      await createExchangeRequest(user.id, book.userId, book.id, message);
      toast.success('Exchange request sent successfully');
      setIsExchangeOpen(false);
      setMessage('');
    } catch (error) {
      console.error('Error sending exchange request:', error);
      toast.error('Failed to send exchange request');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewOwner = () => {
    navigate(`/profile/${book.userId}`);
  };

  return (
    <Card className="h-full flex flex-col shadow-md transition hover:shadow-lg rounded-2xl">
      <CardHeader>
        <CardTitle className="flex justify-between items-center text-lg">
          <span className="truncate">{book.title}</span>
          {isOwner && (
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={onEdit}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={onDelete}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Book Image */}
        <img
          src={book.imageUrl}
          alt={book.title}
          className="w-full h-48 object-cover rounded-md"
        />

        {/* Book Details */}
        <div className="space-y-1">
          <p className="text-sm font-medium">By {book.author}</p>
          <p className="text-sm text-muted-foreground">{book.genre}</p>
          <p className="text-sm">Condition: <span className="font-medium">{book.condition}</span></p>
          <p className="text-lg font-bold text-green-700">${book.price.toFixed(2)}</p>
        </div>

        {/* Recommendations */}
        {!isOwner && <BookRecommendations currentBook={book} />}
      </CardContent>

      <CardFooter className="flex flex-col gap-2 mt-auto">
        <p className="text-sm text-muted-foreground truncate">{book.description}</p>

        <div className="flex justify-between gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleViewOwner}
            className="w-1/2"
          >
            View Owner
          </Button>

          {user && user.id !== book.userId && (
            <Dialog open={isExchangeOpen} onOpenChange={setIsExchangeOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="w-1/2">
                  <Send className="h-4 w-4 mr-2" />
                  Request
                </Button>
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Request Exchange</DialogTitle>
                  <DialogDescription>
                    Send a message to the owner of "{book.title}" to request an exchange.
                  </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                  <Textarea
                    placeholder="Write a message to the owner..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                  />
                </div>

                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsExchangeOpen(false)}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleRequestExchange} disabled={isLoading}>
                    Send Request
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default BookCard;
