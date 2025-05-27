
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { BookOpen, Heart, Users, Target, Mail, ArrowLeft } from "lucide-react";

const About = () => {
  const navigate = useNavigate();

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
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="text-blue-600 hover:text-blue-700"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">About BookXchange</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Connecting students and book lovers through the simple joy of sharing knowledge.
          </p>
        </div>

        {/* Mission Section */}
        <Card className="mb-12 border-2 border-blue-100 bg-blue-50/50">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="h-8 w-8 text-blue-500" />
            </div>
            <CardTitle className="text-3xl text-gray-900">Our Mission</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-lg text-gray-700 leading-relaxed">
              We believe that knowledge should be accessible and affordable. BookXchange was created 
              to solve the problem of expensive textbooks and unused books sitting on shelves. 
              Our platform empowers students and readers to buy, sell, and exchange books easily, 
              creating a sustainable ecosystem where everyone benefits.
            </p>
          </CardContent>
        </Card>

        {/* Story Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">The Story Behind BookXchange</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-2 border-green-100 bg-green-50/50">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                  <Heart className="h-6 w-6 text-green-500" />
                </div>
                <CardTitle className="text-xl text-gray-900">The Problem</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  College textbooks cost students hundreds of dollars each semester. Many books are 
                  used for just one course and then collect dust. Meanwhile, other students struggle 
                  to afford the same books they desperately need.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-100 bg-purple-50/50">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3">
                  <Users className="h-6 w-6 text-purple-500" />
                </div>
                <CardTitle className="text-xl text-gray-900">The Solution</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  BookXchange creates a direct connection between students. Whether you want to sell 
                  books for cash or exchange them for other titles, our platform makes it simple, 
                  safe, and affordable for everyone involved.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-blue-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Accessibility</h3>
              <p className="text-gray-600">Making books affordable and accessible to all students.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Community</h3>
              <p className="text-gray-600">Building connections between students and book lovers.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-purple-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Sustainability</h3>
              <p className="text-gray-600">Giving books a second life instead of letting them go to waste.</p>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <Card className="border-2 border-blue-100 bg-blue-50/50">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="h-8 w-8 text-blue-500" />
            </div>
            <CardTitle className="text-2xl text-gray-900">Get in Touch</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-700 mb-6">
              Have questions, feedback, or need support? We'd love to hear from you!
            </p>
            <div className="space-y-2 text-gray-600">
              <p>Email: support@bookxchange.com</p>
              <p>Community: Join our Discord server</p>
              <p>Social: Follow us @BookXchange</p>
            </div>
            <div className="mt-6">
              <Button 
                onClick={() => navigate('/contact')}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                Contact Support
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Start Trading?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of students already saving money on books.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              onClick={() => navigate('/signup')}
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3"
            >
              Sign Up Now
            </Button>
            <Button 
              size="lg"
              variant="outline"
              onClick={() => navigate('/books')}
              className="border-2 border-blue-200 text-blue-600 hover:bg-blue-50 px-8 py-3"
            >
              Browse Books
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
