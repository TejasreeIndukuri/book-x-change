
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { BookOpen, Home, Search, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-mint-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <BookOpen className="h-8 w-8 text-blue-500" />
            <h1 className="text-2xl font-bold text-gray-900">BookXchange</h1>
          </div>
        </div>

        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="h-12 w-12 text-blue-500" />
            </div>
            <CardTitle className="text-3xl text-gray-900 mb-2">Lost in the Library?</CardTitle>
            <div className="text-6xl font-bold text-blue-500 mb-4">404</div>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <p className="text-gray-600 text-lg">
              Oops! The page you're looking for seems to have been checked out by someone else.
            </p>
            <p className="text-gray-500">
              Don't worry, we'll help you find your way back to the good books!
            </p>
            
            <div className="space-y-3">
              <Button 
                onClick={() => navigate('/')}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3"
              >
                <Home className="mr-2 h-5 w-5" />
                Back to Home
              </Button>
              
              <Button 
                onClick={() => navigate('/books')}
                variant="outline"
                className="w-full border-2 border-blue-200 text-blue-600 hover:bg-blue-50 py-3"
              >
                <Search className="mr-2 h-5 w-5" />
                Browse Books
              </Button>
              
              <Button 
                onClick={() => navigate(-1)}
                variant="ghost"
                className="w-full text-gray-600 hover:text-gray-800 py-3"
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Fun illustration */}
        <div className="text-center mt-8">
          <div className="inline-flex items-center space-x-2 text-gray-400">
            <BookOpen className="h-5 w-5" />
            <span className="text-sm">Page not found in our catalog</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
