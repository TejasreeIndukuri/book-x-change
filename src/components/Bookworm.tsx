
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Bot, X, Send, MessageCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
};

// Predefined responses for the chatbot
const chatResponses: Record<string, string[]> = {
  greeting: [
    "Hello! I'm Bookworm, your BookXchange assistant. How can I help you today?",
    "Hi there! Need help with BookXchange? Just ask me anything!",
    "Welcome to BookXchange! I'm Bookworm, ready to assist you."
  ],
  
  recommend: [
    "Based on popular exchanges, I'd recommend checking out 'The Silent Patient' by Alex Michaelides, 'Where the Crawdads Sing' by Delia Owens, or 'Atomic Habits' by James Clear.",
    "You might enjoy 'Project Hail Mary' by Andy Weir, 'The Midnight Library' by Matt Haig, or 'Educated' by Tara Westover.",
    "Some great books to consider are 'The Four Winds' by Kristin Hannah, 'The Thursday Murder Club' by Richard Osman, or 'Klara and the Sun' by Kazuo Ishiguro."
  ],
  
  upload: [
    "To upload a book: 1) Go to your Dashboard, 2) Click 'Add New Book', 3) Fill in the details and upload an image, 4) Click 'Add Book'. That's it!",
    "Adding a book is easy! Navigate to your Dashboard, click the 'Add New Book' button, complete the form with your book's details and an image, then submit.",
    "To share a book on BookXchange: Head to Dashboard → Add New Book → Enter all the details → Upload a clear image → Submit!"
  ],
  
  exchange: [
    "To exchange a book: 1) Find a book you like, 2) Click 'Request Exchange', 3) Write a message to the owner, 4) Wait for them to accept or reject your request.",
    "Book exchanges are simple! Browse books, click 'Request Exchange' on the one you want, send a message to the owner, and wait for their response.",
    "For exchanging: Find your desired book → Click 'Request Exchange' → Write why you want it → Send request → The owner will respond soon!"
  ],
  
  profile: [
    "To edit your profile, go to your Profile page and click 'Edit Profile'. You can update your display name, add a bio, and upload a profile picture.",
    "Managing your profile is easy! Visit your Profile page, click the 'Edit Profile' button, make your desired changes, and save.",
    "Customize your profile by going to Profile → Edit Profile → Update your details → Save changes."
  ],
  
  fallback: [
    "I'm not sure I understand. Could you try rephrasing that? You can ask about book recommendations, how to upload or exchange books, or editing your profile.",
    "I didn't quite catch that. Try asking about book recommendations, uploading books, exchanging books, or managing your profile.",
    "Hmm, I'm still learning. Can you try asking in a different way? I can help with book recommendations, uploading, exchanging, and profiles."
  ]
};

// Get a random response from a category
const getRandomResponse = (category: string): string => {
  const responses = chatResponses[category] || chatResponses.fallback;
  return responses[Math.floor(Math.random() * responses.length)];
};

// Simple intent recognition
const recognizeIntent = (message: string): string => {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.match(/^(hi|hello|hey)/)) {
    return 'greeting';
  }
  
  if (lowerMessage.match(/recommend|suggestion|good book/)) {
    return 'recommend';
  }
  
  if (lowerMessage.match(/how.*(upload|add|share|post|create).*(book)/)) {
    return 'upload';
  }
  
  if (lowerMessage.match(/how.*(exchange|swap|trade|request)/)) {
    return 'exchange';
  }
  
  if (lowerMessage.match(/how.*(profile|account|name|picture|photo|bio)/)) {
    return 'profile';
  }
  
  return 'fallback';
};

const Bookworm = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Initialize with a greeting message
  useEffect(() => {
    setMessages([
      {
        id: '1',
        text: getRandomResponse('greeting'),
        sender: 'bot',
        timestamp: new Date(),
      },
    ]);
  }, []);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSend = () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    
    // Recognize intent and prepare bot response
    const intent = recognizeIntent(input);
    
    // Simulate typing delay
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: getRandomResponse(intent),
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, botMessage]);
    }, 1000);
  };
  
  return (
    <>
      {/* Floating button */}
      <div className="fixed bottom-5 right-5 z-50">
        <Button 
          className="h-14 w-14 rounded-full shadow-lg"
          onClick={() => setIsOpen(true)}
        >
          <Bot size={24} />
        </Button>
      </div>
      
      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-24 right-5 z-50 w-80 md:w-96 shadow-xl">
          <Card className="h-96 flex flex-col">
            <CardHeader className="py-3 px-4 flex flex-row items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Bot size={18} />
                Bookworm
              </CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X size={18} />
              </Button>
            </CardHeader>
            
            <CardContent className="flex-1 overflow-auto p-4">
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.sender === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-3 py-2 ${
                        msg.sender === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <p className="text-sm">{msg.text}</p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </CardContent>
            
            <CardFooter className="p-2">
              <form
                className="flex w-full gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
              >
                <Input
                  placeholder="Ask me anything..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
                <Button type="submit" size="icon">
                  <Send size={18} />
                </Button>
              </form>
            </CardFooter>
          </Card>
        </div>
      )}
    </>
  );
};

export default Bookworm;
