
import { Book } from '@/types/book';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';

interface BookCardProps {
  book: Book;
  onEdit?: () => void;
  onDelete?: () => void;
  isOwner?: boolean;
}

const BookCard = ({ book, onEdit, onDelete, isOwner }: BookCardProps) => {
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
          <p className="text-lg font-bold">${book.price}</p>
        </div>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-muted-foreground truncate">{book.description}</p>
      </CardFooter>
    </Card>
  );
};

export default BookCard;
