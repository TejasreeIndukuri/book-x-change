import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import BookCard from "@/components/BookCard";
import ExchangeRequestCard from "@/components/ExchangeRequestCard";
import { getUserProfile, upsertUserProfile } from "@/services/userService";
import { getUserBooks } from "@/services/bookService";
import { getSentExchangeRequests, getReceivedExchangeRequests } from "@/services/exchangeService";
import { Book } from "@/types/book";
import { UserProfile } from "@/types/user";
import { ExchangeRequest } from "@/types/exchange";

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
        setDisplayName(userProfile.displayName || "");
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
    return <div className="flex justify-center p-8">Loading profile...</div>;
  }
  
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <Card className="mb-6">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={profile?.photoURL || ""} alt={profile?.displayName || "User"} />
                  <AvatarFallback>
                    {profile?.displayName?.charAt(0) || user?.email?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                
                <div>
                  {isEditing ? (
                    <Input
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Display Name"
                      className="mb-2"
                    />
                  ) : (
                    <CardTitle>{profile?.displayName || "User"}</CardTitle>
                  )}
                  <CardDescription>{profile?.email}</CardDescription>
                </div>
              </div>
              
              {isOwnProfile && (
                <div className="mt-4 md:mt-0">
                  {isEditing ? (
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleUpdateProfile}>
                        Save Profile
                      </Button>
                    </div>
                  ) : (
                    <Button onClick={() => setIsEditing(true)}>
                      Edit Profile
                    </Button>
                  )}
                </div>
              )}
            </div>
          </CardHeader>
          
          <CardContent>
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Profile Image</label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setProfileImage(e.target.files?.[0] || null)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Bio</label>
                  <Textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about yourself..."
                    rows={4}
                  />
                </div>
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-medium mb-2">About</h3>
                <p className="text-gray-600">{profile?.bio || "No bio provided."}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Tabs defaultValue="books">
          <TabsList className="mb-4">
            <TabsTrigger value="books">Books ({books.length})</TabsTrigger>
            {isOwnProfile && (
              <>
                <TabsTrigger value="received">
                  Received Requests ({receivedRequests.length})
                  {receivedRequests.filter(r => r.status === 'pending').length > 0 && (
                    <Badge variant="destructive" className="ml-2">
                      {receivedRequests.filter(r => r.status === 'pending').length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="sent">
                  Sent Requests ({sentRequests.length})
                </TabsTrigger>
              </>
            )}
          </TabsList>
          
          <TabsContent value="books">
            {books.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-gray-500">No books uploaded yet.</p>
                  {isOwnProfile && (
                    <Button 
                      className="mt-4" 
                      onClick={() => navigate('/dashboard')}
                    >
                      Add Your First Book
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                  <Card>
                    <CardContent className="py-8 text-center">
                      <p className="text-gray-500">No requests received yet.</p>
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
                  <Card>
                    <CardContent className="py-8 text-center">
                      <p className="text-gray-500">No requests sent yet.</p>
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
