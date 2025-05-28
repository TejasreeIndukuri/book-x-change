import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { BookOpen, Search, Filter, Heart, ShoppingCart, User, Home, Star } from "lucide-react";
import { getAllBooks } from "@/services/bookService";
import { Book } from "@/types/book";
import { toast } from "sonner";
import BookCard from "@/components/BookCard";

const Books = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("relevance");

  const conditions = ["New", "Like New", "Very Good", "Good", "Acceptable"];
  const genres = [
    "Fiction", "Non-Fiction", "Mystery", "Fantasy", "Romance", "Science Fiction", 
    "Biography", "History", "Self-Help", "Business", "Technology", "Health", 
    "Travel", "Cooking", "Art", "Music", "Sports", "Children's", "Young Adult"
  ];

  useEffect(() => {
    loadBooks();
  }, []);

  useEffect(() => {
    filterBooks();
  }, [books, searchTerm, priceRange, selectedConditions, selectedGenres, sortBy]);

  const loadBooks = async () => {
    try {
      const allBooks = await getAllBooks();
      setBooks(allBooks);
    } catch (error) {
      toast.error("Failed to load books");
    } finally {
      setLoading(false);
    }
  };

  const filterBooks = () => {
    let filtered = books.filter(book => {
      const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           book.author.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPrice = book.price >= priceRange[0] && book.price <= priceRange[1];
      const matchesCondition = selectedConditions.length === 0 || selectedConditions.includes(book.condition);
      const matchesGenre = selectedGenres.length === 0 || selectedGenres.includes(book.genre);
      
      return matchesSearch && matchesPrice && matchesCondition && matchesGenre;
    });

    // Sort books
    if (sortBy === "price-low") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === "title") {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    }

    setFilteredBooks(filtered);
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "New": return "bg-green-500";
      case "Like New": return "bg-blue-500";
      case "Very Good": return "bg-purple-500";
      case "Good": return "bg-orange-500";
      default: return "bg-gray-500";
    }
  };

  const featuredGenres = [
    { name: "Fiction", icon: "📚", color: "bg-blue-100 text-blue-800" },
    { name: "Non-Fiction", icon: "📖", color: "bg-green-100 text-green-800" },
    { name: "Mystery", icon: "🔍", color: "bg-purple-100 text-purple-800" },
    { name: "Fantasy", icon: "🐉", color: "bg-pink-100 text-pink-800" },
    { name: "Romance", icon: "💕", color: "bg-red-100 text-red-800" },
    { name: "Science Fiction", icon: "🚀", color: "bg-indigo-100 text-indigo-800" },
    { name: "Biography", icon: "👤", color: "bg-yellow-100 text-yellow-800" },
    { name: "History", icon: "🏛️", color: "bg-amber-100 text-amber-800" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-mint-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-blue-500" />
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">BookXchange</h1>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Button variant="ghost" onClick={() => navigate('/')}>
                <Home className="mr-2 h-4 w-4" />
                Home
              </Button>
              <Button variant="ghost" className="text-blue-600 font-medium">
                Browse
              </Button>
              <Button variant="ghost" onClick={() => navigate('/about')}>
                About
              </Button>
            </nav>
            <div className="flex items-center space-x-3">
              {user ? (
                <>
                  <Button variant="ghost" onClick={() => navigate('/dashboard')} className="hidden sm:flex">
                    Dashboard
                  </Button>
                  <Button variant="ghost" onClick={() => navigate('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Profile</span>
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" onClick={() => navigate('/login')}>
                    Login
                  </Button>
                  <Button onClick={() => navigate('/signup')} className="bg-blue-500 hover:bg-blue-600">
                    Sign Up
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="max-w-2xl mx-auto relative">
            <Input
              placeholder="Search by title, author, or ISBN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-4 text-lg rounded-full border-2 border-blue-200 focus:border-blue-400"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
          </div>
        </div>

        {/* Genre Categories */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Browse by Genre</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {featuredGenres.map((genre) => (
              <Card 
                key={genre.name}
                className="cursor-pointer hover:shadow-lg transition-shadow bg-white/80 backdrop-blur-sm border-0"
                onClick={() => {
                  if (selectedGenres.includes(genre.name)) {
                    setSelectedGenres(selectedGenres.filter(g => g !== genre.name));
                  } else {
                    setSelectedGenres([...selectedGenres, genre.name]);
                  }
                }}
              >
                <CardContent className="p-4 text-center">
                  <div className="text-2xl mb-2">{genre.icon}</div>
                  <Badge variant="secondary" className={`${genre.color} text-xs font-medium`}>
                    {genre.name}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar - Hide on mobile by default */}
          <div className="w-full lg:w-80 space-y-6">
            <Card className="border-0 shadow-lg bg-white/80">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Price Range */}
                <div>
                  <h3 className="font-medium mb-3">Price Range</h3>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={100}
                    step={5}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>

                {/* Book Condition */}
                <div>
                  <h3 className="font-medium mb-3">Book Condition</h3>
                  <div className="space-y-2">
                    {conditions.map((condition) => (
                      <div key={condition} className="flex items-center space-x-2">
                        <Checkbox
                          id={condition}
                          checked={selectedConditions.includes(condition)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedConditions([...selectedConditions, condition]);
                            } else {
                              setSelectedConditions(selectedConditions.filter(c => c !== condition));
                            }
                          }}
                        />
                        <label htmlFor={condition} className="text-sm">{condition}</label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* All Genres */}
                <div>
                  <h3 className="font-medium mb-3">All Genres</h3>
                  <div className="max-h-48 overflow-y-auto space-y-2">
                    {genres.map((genre) => (
                      <div key={genre} className="flex items-center space-x-2">
                        <Checkbox
                          id={genre}
                          checked={selectedGenres.includes(genre)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedGenres([...selectedGenres, genre]);
                            } else {
                              setSelectedGenres(selectedGenres.filter(g => g !== genre));
                            }
                          }}
                        />
                        <label htmlFor={genre} className="text-sm">{genre}</label>
                      </div>
                    ))}
                  </div>
                </div>

                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    setSelectedConditions([]);
                    setSelectedGenres([]);
                    setPriceRange([0, 100]);
                    setSearchTerm("");
                  }}
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Books Grid */}
          <div className="flex-1">
            {/* Sort and Results */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <p className="text-gray-600">{filteredBooks.length} books found</p>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="title">Title A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-0">
                      <div className="h-64 bg-gray-200 rounded-t-lg"></div>
                      <div className="p-4 space-y-2">
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="overflow-y-auto h-full p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-8">
                  {filteredBooks.map((book) => (
                    <BookCard key={book.id} book={book} />
                  ))}
                </div>
              </div>
            )}

            {!loading && filteredBooks.length === 0 && (
              <Card className="border-0 shadow-lg bg-white/80">
                <CardContent className="py-16 text-center">
                  <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No books found</h3>
                  <p className="text-gray-600 mb-4">Try adjusting your filters or search terms.</p>
                  <Button 
                    onClick={() => {
                      setSelectedConditions([]);
                      setSelectedGenres([]);
                      setPriceRange([0, 100]);
                      setSearchTerm("");
                    }}
                  >
                    Clear all filters
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Books;

