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
  book: Book & { discountPercent?: number; originalPrice?: number };
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
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ sender: string; text: string; timestamp: string }[]>([]);

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

  const sendMessage = async () => {
    if (!message.trim()) return;
    // Optionally, send to backend here
    setMessages([
      ...messages,
      { sender: user?.name || "You", text: message, timestamp: new Date().toISOString() }
    ]);
    setMessage('');
  };

  const hasDiscount = !!book.discountPercent && !!book.originalPrice;

  return (
    <>
      <Card className="flex flex-col w-64 h-96 p-4 border shadow-sm rounded-xl bg-white">
        <CardHeader className="pb-1">
          <CardTitle className="flex justify-between items-center gap-2 text-base font-semibold truncate">
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
        <CardContent className="flex-1 flex flex-col items-center gap-y-2">
          <img
            src={book.imageUrl}
            alt={book.title}
            className="w-full h-40 aspect-[2/3] object-contain rounded-md mb-1"
          />
          <div className="w-full text-center flex flex-col gap-y-1 max-h-20 overflow-hidden">
            <div className="text-sm font-medium truncate">{book.author}</div>
            <div className="text-xs text-muted-foreground truncate">{book.genre}</div>
            <div className="text-xs truncate">Condition: {book.condition}</div>
            <div className="text-lg font-bold truncate">
              ${book.price.toFixed(2)}
              {hasDiscount && (
                <span className="text-xs text-gray-400 line-through ml-2">
                  ${book.originalPrice?.toFixed(2)}
                </span>
              )}
            </div>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2 w-full">{book.description}</p>
        </CardContent>
        <CardFooter className="mt-auto flex flex-col w-full">
          <Button
            variant="outline"
            size="sm"
            className="w-full rounded-lg hover:bg-blue-50 transition"
            onClick={() => setOpen(true)}
          >
            View
          </Button>
        </CardFooter>
      </Card>

      {/* Modal/Dialog for details and buttons */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{book.title}</DialogTitle>
            <DialogDescription>
              <img
                src={book.imageUrl}
                alt={book.title}
                className="w-full h-40 aspect-[2/3] object-contain rounded-md mb-2"
              />
              <div className="text-sm font-medium">{book.author}</div>
              <div className="text-xs text-muted-foreground">{book.genre}</div>
              <div className="text-xs">Condition: {book.condition}</div>
              <div className="text-lg font-bold">
                ${book.price.toFixed(2)}
                {hasDiscount && (
                  <span className="text-xs text-gray-400 line-through ml-2">
                    ${book.originalPrice?.toFixed(2)}
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-2">{book.description}</p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col gap-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full rounded-lg hover:bg-blue-50 transition"
              onClick={() => {
                setOpen(false);
                handleViewOwner();
              }}
            >
              View Owner
            </Button>
            {user && user.id !== book.userId && (
              <Button
                size="sm"
                className="w-full bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                onClick={() => {
                  setOpen(false);
                  setIsExchangeOpen(true);
                }}
              >
                <Send className="h-4 w-4 mr-2" />
                Request Exchange
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Exchange Request Dialog */}
      <Dialog open={isExchangeOpen} onOpenChange={setIsExchangeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chat with Owner</DialogTitle>
            <DialogDescription>
              Exchange messages about "{book.title}".
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2 max-h-64 overflow-y-auto bg-gray-50 rounded p-2 mb-2">
            {messages.map((msg, idx) => (
              <div key={idx} className={`text-sm ${msg.sender === (user?.name || "You") ? "text-right" : "text-left"}`}>
                <span className="font-semibold">{msg.sender}: </span>
                <span>{msg.text}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Textarea
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={2}
              className="flex-1"
            />
            <Button onClick={sendMessage} disabled={isLoading || !message.trim()}>
              Send
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BookCard;
