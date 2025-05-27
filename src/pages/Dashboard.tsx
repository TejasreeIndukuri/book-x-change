
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import BookForm from "@/components/BookForm";
import BookCard from "@/components/BookCard";
import { Book, BookFormData } from "@/types/book";
import { uploadBook, getUserBooks, deleteBook, updateBook } from "@/services/bookService";
import { countPendingExchangeRequests } from "@/services/exchangeService";
import { 
  User, 
  Plus, 
  BookOpen, 
  TrendingUp, 
  MessageCircle, 
  Star,
  Home,
  Search,
  Bell,
  Settings
} from "lucide-react";

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
      const userBooks = await getUserBooks(user.id);
      setBooks(userBooks);
    } catch (error) {
      toast.error('Failed to load books');
    }
  };

  const loadPendingRequests = async () => {
    if (!user) return;
    try {
      const count = await countPendingExchangeRequests(user.id);
      setPendingRequests(count);
    } catch (error) {
      console.error('Failed to load pending requests count:', error);
    }
  };

  const handleAddBook = async (data: BookFormData, imageFile: File | null) => {
    if (!user || !imageFile) return;
    try {
      await uploadBook(user.id, data, imageFile);
      setIsAddingBook(false);
      loadUserBooks();
      toast.success('Book added successfully!');
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
        editingBook.imageUrl,
        imageFile || undefined
      );
      setEditingBook(null);
      loadUserBooks();
      toast.success('Book updated successfully!');
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

  const stats = [
    { label: 'Books Listed', value: books.length, icon: BookOpen, color: 'bg-blue-500' },
    { label: 'Total Views', value: '156', icon: TrendingUp, color: 'bg-green-500' },
    { label: 'Messages', value: '12', icon: MessageCircle, color: 'bg-purple-500' },
    { label: 'Rating', value: '4.8', icon: Star, color: 'bg-yellow-500' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-mint-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-blue-500" />
              <h1 className="text-2xl font-bold text-gray-900">BookXchange</h1>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Button variant="ghost" onClick={() => navigate('/')}>
                <Home className="mr-2 h-4 w-4" />
                Home
              </Button>
              <Button variant="ghost" onClick={() => navigate('/books')}>
                <Search className="mr-2 h-4 w-4" />
                Browse
              </Button>
            </nav>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
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
              <Button onClick={handleSignOut} variant="outline">
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <Card className="border-0 shadow-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-3xl mb-2">Welcome back, {user?.email?.split('@')[0]}!</CardTitle>
                  <CardDescription className="text-blue-100 text-lg">
                    Ready to discover your next great read?
                  </CardDescription>
                </div>
                <div className="text-right">
                  <p className="text-blue-100 text-sm">Member since</p>
                  <p className="text-white font-semibold">Jan 2024</p>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.color}`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Books Section */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-2xl">My Books</CardTitle>
                  {!isAddingBook && !editingBook && (
                    <Button onClick={() => setIsAddingBook(true)} className="bg-blue-500 hover:bg-blue-600">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Book
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {isAddingBook && (
                  <div className="mb-8 p-6 bg-blue-50 rounded-lg border-2 border-blue-200">
                    <h3 className="text-xl font-bold mb-4 text-blue-900">Add New Book</h3>
                    <BookForm 
                      onSubmit={handleAddBook}
                      buttonText="Add Book"
                    />
                    <Button 
                      variant="outline" 
                      onClick={() => setIsAddingBook(false)}
                      className="mt-4"
                    >
                      Cancel
                    </Button>
                  </div>
                )}

                {editingBook && (
                  <div className="mb-8 p-6 bg-green-50 rounded-lg border-2 border-green-200">
                    <h3 className="text-xl font-bold mb-4 text-green-900">Edit Book</h3>
                    <BookForm 
                      initialData={editingBook}
                      onSubmit={handleUpdateBook}
                      buttonText="Update Book"
                    />
                    <Button 
                      variant="outline" 
                      onClick={() => setEditingBook(null)}
                      className="mt-4"
                    >
                      Cancel
                    </Button>
                  </div>
                )}

                {!isAddingBook && !editingBook && (
                  <>
                    {books.length === 0 ? (
                      <div className="text-center py-12">
                        <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No books yet</h3>
                        <p className="text-gray-600 mb-6">Start building your collection by adding your first book!</p>
                        <Button onClick={() => setIsAddingBook(true)} className="bg-blue-500 hover:bg-blue-600">
                          <Plus className="mr-2 h-4 w-4" />
                          Add Your First Book
                        </Button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/books')}
                >
                  <Search className="mr-2 h-4 w-4" />
                  Browse Books
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/profile')}
                >
                  <User className="mr-2 h-4 w-4" />
                  View Profile
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Messages
                  {pendingRequests > 0 && (
                    <Badge variant="destructive" className="ml-auto">
                      {pendingRequests}
                    </Badge>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <p className="text-sm text-gray-600">Book "1984" viewed 3 times today</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <p className="text-sm text-gray-600">New message from buyer</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <p className="text-sm text-gray-600">Price suggestion for "Gatsby"</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
