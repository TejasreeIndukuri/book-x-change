
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import BookForm from "@/components/BookForm";
import BookCard from "@/components/BookCard";
import { Book, BookFormData } from "@/types/book";
import { uploadBook, getUserBooks, deleteBook, updateBook } from "@/services/bookService";
import { countPendingExchangeRequests } from "@/services/exchangeService";
import { Badge } from "@/components/ui/badge";
import { User } from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [books, setBooks] = useState<Book[]>([]);
  const [isAddingBook, setIsAddingBook] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [pendingRequests, setPendingRequests] = useState(0);

  useEffect(() => {
    if (user) {
      loadUserBooks();
      loadPendingRequests();
    }
  }, [user]);

  const loadUserBooks = async () => {
    if (!user) return;
    try {
      const userBooks = await getUserBooks(user.uid);
      setBooks(userBooks);
    } catch (error) {
      toast.error('Failed to load books');
    }
  };

  const loadPendingRequests = async () => {
    if (!user) return;
    try {
      const count = await countPendingExchangeRequests(user.uid);
      setPendingRequests(count);
    } catch (error) {
      console.error('Failed to load pending requests count:', error);
    }
  };

  const handleAddBook = async (data: BookFormData, imageFile: File | null) => {
    if (!user || !imageFile) return;
    try {
      await uploadBook(user.uid, data, imageFile);
      setIsAddingBook(false);
      loadUserBooks();
    } catch (error) {
      toast.error('Failed to add book');
    }
  };

  const handleUpdateBook = async (data: BookFormData, imageFile: File | null) => {
    if (!editingBook) return;
    try {
      await updateBook(
        editingBook.id, 
        data, 
        editingBook.imageUrl, // Pass the existing imageUrl
        imageFile || undefined // Pass the new image file if it exists
      );
      setEditingBook(null);
      loadUserBooks();
    } catch (error) {
      toast.error('Failed to update book');
    }
  };

  const handleDeleteBook = async (book: Book) => {
    try {
      await deleteBook(book.id, book.imageUrl);
      loadUserBooks();
      toast.success('Book deleted successfully');
    } catch (error) {
      toast.error('Failed to delete book');
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error('Failed to sign out');
      } else {
        navigate('/login');
      }
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Welcome to Your Dashboard</h1>
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={() => navigate('/profile')}
              >
                <User size={16} />
                Profile
                {pendingRequests > 0 && (
                  <Badge variant="destructive">{pendingRequests}</Badge>
                )}
              </Button>
              <Button onClick={handleSignOut}>Sign Out</Button>
            </div>
          </div>

          <div className="mb-6">
            {!isAddingBook && !editingBook && (
              <Button onClick={() => setIsAddingBook(true)}>Add New Book</Button>
            )}

            {isAddingBook && (
              <div className="max-w-md mx-auto">
                <h2 className="text-xl font-bold mb-4">Add New Book</h2>
                <BookForm 
                  onSubmit={handleAddBook}
                  buttonText="Add Book"
                />
                <Button 
                  variant="outline" 
                  onClick={() => setIsAddingBook(false)}
                  className="mt-2"
                >
                  Cancel
                </Button>
              </div>
            )}

            {editingBook && (
              <div className="max-w-md mx-auto">
                <h2 className="text-xl font-bold mb-4">Edit Book</h2>
                <BookForm 
                  initialData={editingBook}
                  onSubmit={handleUpdateBook}
                  buttonText="Update Book"
                />
                <Button 
                  variant="outline" 
                  onClick={() => setEditingBook(null)}
                  className="mt-2"
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {books.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                isOwner={true}
                onEdit={() => setEditingBook(book)}
                onDelete={() => handleDeleteBook(book)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
