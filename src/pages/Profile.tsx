import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import BookCard from "@/components/BookCard";
import ExchangeRequestCard from "@/components/ExchangeRequestCard";
import { getUserProfile, upsertUserProfile } from "@/services/userService";
import { getUserBooks } from "@/services/bookService";
import { getSentExchangeRequests, getReceivedExchangeRequests } from "@/services/exchangeService";
import { Book } from "@/types/book";
import { UserProfile } from "@/services/userService";
import { ExchangeRequest } from "@/types/exchange";
import { 
  User, 
  Edit3, 
  BookOpen, 
  MessageCircle, 
  Star, 
  Calendar,
  MapPin,
  Mail,
  Phone,
  Home,
  Settings,
  Camera
} from "lucide-react";

const Profile = () => {
  const { user } = useAuth();
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [sentRequests, setSentRequests] = useState<ExchangeRequest[]>([]);
  const [receivedRequests, setReceivedRequests] = useState<ExchangeRequest[]>([]);
  
  // Form state
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  
  // Check if viewing own profile
  const isOwnProfile = user?.id === (userId || user?.id);
  const profileId = userId || (user?.id || "");
  
  useEffect(() => {
    loadProfileData();
  }, [profileId]);
  
  const loadProfileData = async () => {
    setIsLoading(true);
    try {
      // Load user profile
      const userProfile = await getUserProfile(profileId);
      setProfile(userProfile);
      
      if (userProfile) {
        setDisplayName(userProfile.display_name || "");
        setBio(userProfile.bio || "");
      }
      
      // Load user's books
      const userBooks = await getUserBooks(profileId);
      setBooks(userBooks);
      
      // If viewing own profile, load exchange requests
      if (isOwnProfile) {
        const sent = await getSentExchangeRequests(profileId);
        const received = await getReceivedExchangeRequests(profileId);
        setSentRequests(sent);
        setReceivedRequests(received);
      }
    } catch (error) {
      console.error("Error loading profile data:", error);
      toast.error("Failed to load profile data");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleUpdateProfile = async () => {
    if (!user) return;
    
    try {
      await upsertUserProfile(
        user.id,
        {
          displayName,
          bio,
        },
        profileImage
      );
      
      setIsEditing(false);
      loadProfileData();
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-mint-50 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-12 w-12 text-blue-500 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }
  
  const stats = [
    { label: 'Books Listed', value: books.length, icon: BookOpen },
    { label: 'Successful Trades', value: '23', icon: Star },
    { label: 'Member Since', value: 'Jan 2024', icon: Calendar },
    { label: 'Response Rate', value: '98%', icon: MessageCircle },
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
                Browse
              </Button>
              <Button variant="ghost" onClick={() => navigate('/dashboard')}>
                Dashboard
              </Button>
            </nav>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <Card className="mb-8 border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600"></div>
          <CardContent className="relative pb-6">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between -mt-16 mb-6">
              <div className="flex items-end space-x-6">
                <div className="relative">
                  <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
                    <AvatarImage src={profile?.photo_url || ""} alt={profile?.display_name || "User"} />
                    <AvatarFallback className="text-2xl bg-blue-100 text-blue-600">
                      {profile?.display_name?.charAt(0) || user?.email?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  {isOwnProfile && isEditing && (
                    <Button size="icon" className="absolute bottom-0 right-0 rounded-full bg-blue-500 hover:bg-blue-600">
                      <Camera className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                <div className="mb-4">
                  {isEditing ? (
                    <Input
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Display Name"
                      className="text-2xl font-bold border-0 bg-transparent p-0 h-auto focus:ring-0"
                    />
                  ) : (
                    <h1 className="text-3xl font-bold text-gray-900">
                      {profile?.display_name || "User"}
                    </h1>
                  )}
                  <div className="flex items-center space-x-4 mt-2 text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Mail className="h-4 w-4" />
                      <span>{profile?.email}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>San Francisco, CA</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {isOwnProfile && (
                <div className="mt-4 md:mt-0">
                  {isEditing ? (
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleUpdateProfile} className="bg-blue-500 hover:bg-blue-600">
                        Save Profile
                      </Button>
                    </div>
                  ) : (
                    <Button onClick={() => setIsEditing(true)} className="bg-blue-500 hover:bg-blue-600">
                      <Edit3 className="mr-2 h-4 w-4" />
                      Edit Profile
                    </Button>
                  )}
                </div>
              )}
            </div>

            {/* Profile Description */}
            <div className="mb-6">
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Profile Image</label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setProfileImage(e.target.files?.[0] || null)}
                      className="bg-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">About Me</label>
                    <Textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Tell us about yourself, your favorite books, reading preferences..."
                      rows={4}
                      className="bg-white"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-900">About</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {profile?.bio || "Book lover and avid reader. Always looking for great stories to dive into and share with fellow bibliophiles."}
                  </p>
                </div>
              )}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <div key={index} className="text-center p-4 bg-blue-50 rounded-lg">
                  <stat.icon className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Content Tabs */}
        <Tabs defaultValue="books" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto bg-white shadow-lg border-0">
            <TabsTrigger 
              value="books" 
              className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
            >
              Books ({books.length})
            </TabsTrigger>
            {isOwnProfile && (
              <>
                <TabsTrigger 
                  value="received"
                  className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                >
                  Received Requests ({receivedRequests.length})
                  {receivedRequests.filter(r => r.status === 'pending').length > 0 && (
                    <Badge variant="destructive" className="ml-2">
                      {receivedRequests.filter(r => r.status === 'pending').length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger 
                  value="sent"
                  className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                >
                  Sent Requests ({sentRequests.length})
                </TabsTrigger>
              </>
            )}
          </TabsList>
          
          <TabsContent value="books">
            {books.length === 0 ? (
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardContent className="py-16 text-center">
                  <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No books uploaded yet</h3>
                  <p className="text-gray-600 mb-4">
                    {isOwnProfile 
                      ? "Start sharing your collection with the community!" 
                      : "This user hasn't shared any books yet."
                    }
                  </p>
                  {isOwnProfile && (
                    <Button 
                      className="bg-blue-500 hover:bg-blue-600" 
                      onClick={() => navigate('/dashboard')}
                    >
                      Add Your First Book
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {books.map((book) => (
                  <BookCard
                    key={book.id}
                    book={book}
                    isOwner={isOwnProfile}
                    onEdit={() => navigate(`/dashboard?edit=${book.id}`)}
                    onDelete={() => {}}
                  />
                ))}
              </div>
            )}
          </TabsContent>
          
          {isOwnProfile && (
            <>
              <TabsContent value="received">
                {receivedRequests.length === 0 ? (
                  <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                    <CardContent className="py-16 text-center">
                      <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">No requests received yet</h3>
                      <p className="text-gray-600">
                        When others are interested in your books, their requests will appear here.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {receivedRequests.map((request) => (
                      <ExchangeRequestCard 
                        key={request.id} 
                        request={request} 
                        type="received"
                        onRefresh={loadProfileData}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="sent">
                {sentRequests.length === 0 ? (
                  <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                    <CardContent className="py-16 text-center">
                      <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">No requests sent yet</h3>
                      <p className="text-gray-600">
                        Start browsing books and send requests to connect with other readers!
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {sentRequests.map((request) => (
                      <ExchangeRequestCard 
                        key={request.id} 
                        request={request} 
                        type="sent" 
                        onRefresh={loadProfileData}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
