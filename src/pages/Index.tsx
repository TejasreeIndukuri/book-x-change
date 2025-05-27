
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Search, BookOpen, Users, MessageCircle, Star, ChevronRight } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

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
              <a href="#how-it-works" className="text-gray-600 hover:text-blue-600 transition-colors">How it Works</a>
              <a href="#testimonials" className="text-gray-600 hover:text-blue-600 transition-colors">Testimonials</a>
              <a href="/about" className="text-gray-600 hover:text-blue-600 transition-colors">About</a>
            </nav>
            <div className="flex items-center space-x-3">
              {user ? (
                <Button onClick={() => navigate('/dashboard')} className="bg-blue-500 hover:bg-blue-600">
                  Dashboard
                </Button>
              ) : (
                <>
                  <Button variant="ghost" onClick={() => navigate('/login')} className="text-blue-600">
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

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6">
              Buy, Sell & Exchange
              <span className="block text-blue-500">Books Easily</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of students and readers sharing knowledge through books. 
              Find your next great read or turn your old books into cash.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-md mx-auto mb-8">
              <div className="relative">
                <Input
                  placeholder="Search for books, authors, or subjects..."
                  className="pl-12 pr-4 py-3 text-lg rounded-full border-2 border-blue-200 focus:border-blue-400"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => navigate(user ? '/dashboard' : '/signup')}
                className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-full text-lg"
              >
                Get Started
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate('/books')}
                className="border-2 border-blue-200 text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-full text-lg"
              >
                Browse Books
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How BookXchange Works</h2>
            <p className="text-xl text-gray-600">Simple steps to start trading books today</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center border-2 border-blue-100 hover:border-blue-200 transition-colors">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-8 w-8 text-blue-500" />
                </div>
                <CardTitle className="text-2xl text-gray-900">List Your Books</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Upload photos and details of books you want to sell or exchange. 
                  Set your price or mark them for trade.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-2 border-green-100 hover:border-green-200 transition-colors">
              <CardHeader>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-green-500" />
                </div>
                <CardTitle className="text-2xl text-gray-900">Find Books</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Search through thousands of books by title, author, subject, or location. 
                  Filter by price and condition.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-2 border-purple-100 hover:border-purple-200 transition-colors">
              <CardHeader>
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="h-8 w-8 text-purple-500" />
                </div>
                <CardTitle className="text-2xl text-gray-900">Connect & Trade</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Chat with sellers and buyers. Arrange meetups or exchanges. 
                  Build connections with fellow book lovers.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Students Say</h2>
            <p className="text-xl text-gray-600">Real experiences from our community</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "Saved over $200 on textbooks this semester! The exchange feature is amazing."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold">S</span>
                  </div>
                  <div className="ml-3">
                    <p className="font-semibold text-gray-900">Sarah M.</p>
                    <p className="text-sm text-gray-500">Psychology Major</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "Found rare books I couldn't get anywhere else. The community is so helpful!"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-bold">M</span>
                  </div>
                  <div className="ml-3">
                    <p className="font-semibold text-gray-900">Mike L.</p>
                    <p className="text-sm text-gray-500">Literature Student</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "Made money selling books I no longer needed. So much better than selling back to bookstores!"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 font-bold">A</span>
                  </div>
                  <div className="ml-3">
                    <p className="font-semibold text-gray-900">Alex K.</p>
                    <p className="text-sm text-gray-500">Engineering Student</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <BookOpen className="h-6 w-6 text-blue-400" />
                <h3 className="text-xl font-bold">BookXchange</h3>
              </div>
              <p className="text-gray-400">
                Connecting students and readers through the power of books.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/books" className="hover:text-white transition-colors">Browse Books</a></li>
                <li><a href="/dashboard" className="hover:text-white transition-colors">Dashboard</a></li>
                <li><a href="/profile" className="hover:text-white transition-colors">Profile</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/about" className="hover:text-white transition-colors">About</a></li>
                <li><a href="/contact" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="/support" className="hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="/terms" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 BookXchange. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
