
import { useState } from 'react';
import { Book } from '@/types/book';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Edit, Trash2, Send } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { createExchangeRequest } from '@/services/exchangeService';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

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

    if (user.uid === book.userId) {
      toast.error('You cannot request your own book');
      return;
    }

    setIsLoading(true);
    try {
      await createExchangeRequest(user.uid, book.userId, book.id, message);
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
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
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
      <CardContent className="space-y-2">
        <img 
          src={book.imageUrl} 
          alt={book.title} 
          className="w-full h-48 object-cover rounded-md"
        />
        <div className="space-y-1">
          <p className="text-sm font-medium">By {book.author}</p>
          <p className="text-sm text-muted-foreground">{book.genre}</p>
          <p className="text-sm">Condition: {book.condition}</p>
          <p className="text-lg font-bold">${book.price.toFixed(2)}</p>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-stretch gap-2">
        <p className="text-sm text-muted-foreground truncate">{book.description}</p>
        
        <div className="flex gap-2 justify-between mt-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleViewOwner}
          >
            View Owner
          </Button>
          
          {user && user.uid !== book.userId && (
            <Dialog open={isExchangeOpen} onOpenChange={setIsExchangeOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Send className="h-4 w-4 mr-2" />
                  Request Exchange
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
                  <Button 
                    onClick={handleRequestExchange}
                    disabled={isLoading}
                  >
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
