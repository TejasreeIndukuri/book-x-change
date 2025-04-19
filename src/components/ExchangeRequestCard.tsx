
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { ExchangeRequest } from "@/types/exchange";
import { updateExchangeStatus, deleteExchangeRequest } from "@/services/exchangeService";
import { getUserProfile } from "@/services/userService";

interface ExchangeRequestCardProps {
  request: ExchangeRequest;
  type: "sent" | "received";
  onRefresh: () => void;
}

const ExchangeRequestCard = ({ request, type, onRefresh }: ExchangeRequestCardProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [otherUserName, setOtherUserName] = useState<string | null>(null);
  
  // Get the other user's name based on the request type
  useState(() => {
    const loadUserName = async () => {
      try {
        const userId = type === "sent" ? request.receiverId : request.senderId;
        const profile = await getUserProfile(userId);
        setOtherUserName(profile?.displayName || "User");
      } catch (error) {
        console.error("Error loading user profile:", error);
      }
    };
    
    loadUserName();
  });
  
  const handleStatusUpdate = async (status: "accepted" | "rejected") => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      await updateExchangeStatus(request.id, status);
      toast.success(`Request ${status === "accepted" ? "accepted" : "rejected"}`);
      onRefresh();
    } catch (error) {
      console.error(`Error ${status} request:`, error);
      toast.error(`Failed to ${status} request`);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCancel = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      await deleteExchangeRequest(request.id);
      toast.success("Request cancelled");
      onRefresh();
    } catch (error) {
      console.error("Error cancelling request:", error);
      toast.error("Failed to cancel request");
    } finally {
      setIsLoading(false);
    }
  };
  
  const renderStatusBadge = () => {
    switch (request.status) {
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case "accepted":
        return <Badge className="bg-green-500">Accepted</Badge>;
      case "rejected":
        return <Badge className="bg-red-500">Rejected</Badge>;
      default:
        return null;
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center gap-2">
            {type === "sent" ? "To:" : "From:"} {otherUserName || "User"}
            {renderStatusBadge()}
          </CardTitle>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4">
          {request.bookImageUrl && (
            <img 
              src={request.bookImageUrl} 
              alt={request.bookTitle || "Book"} 
              className="w-24 h-32 object-cover rounded-md"
            />
          )}
          
          <div>
            <h3 className="font-semibold text-lg">{request.bookTitle || "Book"}</h3>
            {request.message && (
              <div className="mt-2">
                <p className="text-sm text-gray-600">Message:</p>
                <p className="text-sm italic">"{request.message}"</p>
              </div>
            )}
            <p className="text-xs text-gray-500 mt-2">
              {new Date(request.createdAt.seconds * 1000).toLocaleDateString()}
            </p>
          </div>
        </div>
      </CardContent>
      
      <CardFooter>
        <div className="flex gap-2 w-full justify-end">
          {type === "received" && request.status === "pending" && (
            <>
              <Button 
                variant="outline" 
                onClick={() => handleStatusUpdate("rejected")}
                disabled={isLoading}
              >
                Reject
              </Button>
              <Button 
                onClick={() => handleStatusUpdate("accepted")}
                disabled={isLoading}
              >
                Accept
              </Button>
            </>
          )}
          
          {type === "sent" && request.status === "pending" && (
            <Button 
              variant="outline" 
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancel Request
            </Button>
          )}
          
          <Button 
            variant="outline" 
            onClick={() => navigate(`/profile/${type === "sent" ? request.receiverId : request.senderId}`)}
          >
            View {type === "sent" ? "Recipient" : "Sender"}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ExchangeRequestCard;
