
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';
import { BookOpen, ArrowLeft, Users } from 'lucide-react';

const Signup = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          }
        }
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Welcome to BookXchange! Please check your email to verify your account.');
        navigate('/login');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });

      if (error) {
        toast.error(error.message);
      }
    } catch (error) {
      toast.error('Failed to sign up with Google');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-mint-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
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

        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl text-gray-900">Join BookXchange</CardTitle>
            <p className="text-gray-600 mt-2">Start your book trading journey today</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Google Signup */}
            <Button
              type="button"
              variant="outline"
              className="w-full py-3 border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50"
              onClick={handleGoogleSignup}
              disabled={loading}
            >
              <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">Or create account with email</span>
              </div>
            </div>

            {/* Email Signup Form */}
            <form onSubmit={handleEmailSignup} className="space-y-4">
              <div>
                <Input
                  type="text"
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  disabled={loading}
                  className="py-3 border-2 border-gray-200 focus:border-blue-400 rounded-lg"
                />
              </div>
              <div>
                <Input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  className="py-3 border-2 border-gray-200 focus:border-blue-400 rounded-lg"
                />
              </div>
              <div>
                <Input
                  type="password"
                  placeholder="Create Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  minLength={6}
                  className="py-3 border-2 border-gray-200 focus:border-blue-400 rounded-lg"
                />
                <p className="text-xs text-gray-500 mt-1">Password must be at least 6 characters</p>
              </div>
              <Button 
                type="submit" 
                className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium" 
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>

            <div className="text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <button 
                  onClick={() => navigate('/login')}
                  className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
                >
                  Sign in here
                </button>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Illustration */}
        <div className="text-center mt-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full">
            <Users className="h-12 w-12 text-green-500" />
          </div>
          <p className="text-gray-500 mt-2 text-sm">Join our community of book lovers</p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
