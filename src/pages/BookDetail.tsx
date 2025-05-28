
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, ArrowLeft, User, Send } from "lucide-react";
import { Book } from "@/types/book";
import { getBookById } from "@/services/bookService";
import { toast } from "sonner";

const BookDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [similarBooks, setSimilarBooks] = useState<Book[]>([]);

  useEffect(() => {
    if (id) {
      loadBook(id);
    }
  }, [id]);

  const loadBook = async (bookId: string) => {
    try {
      const bookData = await getBookById(bookId);
      setBook(bookData);
      // Mock similar books for now
      setSimilarBooks([
        { id: "1", title: "To Kill a Mockingbird", author: "Harper Lee", genre: "Fiction", condition: "Very Good", price: 12.99, description: "", image_url: "", user_id: "", created_at: "", updated_at: "" },
        { id: "2", title: "The Great Gatsby", author: "F. Scott Fitzgerald", genre: "Fiction", condition: "Like New", price: 14.99, description: "", image_url: "", user_id: "", created_at: "", updated_at: "" },
        { id: "3", title: "The Catcher in the Rye", author: "J.D. Salinger", genre: "Fiction", condition: "Good", price: 8.50, description: "", image_url: "", user_id: "", created_at: "", updated_at: "" },
        { id: "4", title: "The Alchemist", author: "Paulo Coelho", genre: "Fiction", condition: "Good", price: 12.00, description: "", image_url: "", user_id: "", created_at: "", updated_at: "" }
      ]);
    } catch (error) {
      toast.error("Failed to load book details");
      navigate('/books');
    } finally {
      setLoading(false);
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "New": return "bg-green-500 text-white";
      case "Like New": return "bg-blue-500 text-white";
      case "Very Good": return "bg-purple-500 text-white";
      case "Good": return "bg-orange-500 text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  const getMatchPercentage = (bookTitle: string) => {
    const percentages = [83, 98, 83, 94];
    const index = similarBooks.findIndex(b => b.title === bookTitle);
    return percentages[index] || 85;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Book not found</h2>
          <Button onClick={() => navigate('/books')}>Back to Books</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/books')}
              className="text-gray-600"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <div className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-blue-500" />
              <span className="font-semibold text-gray-900">BookXchange</span>
            </div>
          </div>
        </div>
      </header>

      <div className="px-4 py-6 space-y-6">
        {/* Book Details Card */}
        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <h1 className="text-2xl font-bold text-gray-900">{book.title}</h1>
              
              {book.image_url && (
                <div className="mx-auto w-48 h-64 bg-gray-100 rounded-lg overflow-hidden">
                  <img 
                    src={book.image_url} 
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="space-y-2">
                <p className="text-lg text-gray-700">By {book.author}</p>
                <Badge variant="secondary" className="text-sm">
                  {book.genre}
                </Badge>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-sm text-gray-600">Condition:</span>
                  <Badge className={getConditionColor(book.condition)}>
                    {book.condition}
                  </Badge>
                </div>
                <p className="text-3xl font-bold text-green-600">${book.price}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Similar Books */}
        <Card className="bg-white shadow-sm">
          <CardHeader>
            <h2 className="text-xl font-bold text-gray-900">Similar Books</h2>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="space-y-4">
              {similarBooks.map((similarBook) => (
                <div key={similarBook.id} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{similarBook.title}</h3>
                    <p className="text-sm text-gray-600">{similarBook.genre}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium text-blue-600">
                      {getMatchPercentage(similarBook.title)}% match
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Description */}
        {book.description && (
          <Card className="bg-white shadow-sm">
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Description</h3>
              <p className="text-gray-700 leading-relaxed">{book.description}</p>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col space-y-3 pb-6">
          <Button 
            variant="outline" 
            className="w-full py-3"
            onClick={() => navigate(`/profile/${book.user_id}`)}
          >
            <User className="mr-2 h-4 w-4" />
            View Owner
          </Button>
          <Button 
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => {
              if (!user) {
                toast.error("Please login to request an exchange");
                navigate('/login');
                return;
              }
              toast.success("Exchange request sent!");
            }}
          >
            <Send className="mr-2 h-4 w-4" />
            Request Exchange
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
