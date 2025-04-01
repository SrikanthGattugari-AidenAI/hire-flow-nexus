
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare, X, Minimize, Maximize } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface Message {
  id: number;
  text: string;
  sender: "user" | "support" | "ai";
  time: string;
}

export function ChatButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hi there! How can I help you today?",
      sender: "support",
      time: "Just now"
    },
  ]);
  
  const isMobile = useIsMobile();

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (isMinimized) setIsMinimized(false);
  };

  const toggleMinimize = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMinimized(!isMinimized);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Add user message
    const newUserMessage: Message = {
      id: messages.length + 1,
      text: message,
      sender: "user",
      time: "Just now"
    };
    
    setMessages([...messages, newUserMessage]);
    setMessage("");

    // Simulate response after a short delay
    setTimeout(() => {
      let responseText = "Thanks for your message! A team member will get back to you soon.";
      
      // Some canned responses based on message content
      if (message.toLowerCase().includes("job") || message.toLowerCase().includes("position")) {
        responseText = "Great! Are you interested in a specific job posting? You can view all open positions on our Jobs page.";
      } else if (message.toLowerCase().includes("interview")) {
        responseText = "For interview scheduling, please check your email for the invitation link or contact your recruiter directly.";
      } else if (message.toLowerCase().includes("status") || message.toLowerCase().includes("application")) {
        responseText = "You can check your application status in the Candidates section after logging in.";
      }
      
      const aiResponse: Message = {
        id: messages.length + 2,
        text: responseText,
        sender: "ai",
        time: "Just now"
      };
      
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  return (
    <>
      {/* Floating chat button */}
      <div className={cn(
        "fixed bottom-4 right-4 z-50 transition-all duration-300",
        isOpen ? "translate-y-0" : "translate-y-0"
      )}>
        <Button
          onClick={toggleChat}
          variant="default"
          size="icon"
          className={cn(
            "h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 transition-all duration-300 hover:scale-105",
            isOpen && "hidden"
          )}
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
        
        {isOpen && (
          <Card className={cn(
            "w-[350px] shadow-xl animate-fade-in border-none overflow-hidden",
            isMobile && "w-[90vw]",
            isMinimized ? "h-14" : "h-[450px]"
          )}>
            <CardHeader className={cn(
              "bg-gradient-to-r from-primary-600 to-primary-800 text-white p-3 flex flex-row items-center justify-between cursor-pointer",
            )} 
            onClick={isMinimized ? toggleChat : toggleMinimize}
            >
              <CardTitle className="text-sm font-medium flex items-center">
                <Avatar className="h-6 w-6 mr-2">
                  <AvatarImage src="/placeholder.svg" alt="Support" />
                  <AvatarFallback>S</AvatarFallback>
                </Avatar>
                Support Chat
              </CardTitle>
              <div className="flex items-center space-x-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 text-white hover:bg-primary-700 hover:text-white"
                  onClick={toggleMinimize}
                >
                  {isMinimized ? <Maximize className="h-4 w-4" /> : <Minimize className="h-4 w-4" />}
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 text-white hover:bg-primary-700 hover:text-white"
                  onClick={toggleChat}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            
            {!isMinimized && (
              <>
                <CardContent className="p-0 h-[350px] overflow-y-auto scrollbar-thin flex flex-col justify-start bg-gray-50">
                  <div className="flex flex-col p-4 space-y-4">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={cn(
                          "flex items-start space-x-2 max-w-[80%]",
                          msg.sender === "user" ? "ml-auto flex-row-reverse space-x-reverse" : ""
                        )}
                      >
                        {msg.sender !== "user" && (
                          <Avatar className="h-8 w-8 mt-0.5">
                            <AvatarImage 
                              src={msg.sender === "support" ? "/placeholder.svg" : "/placeholder.svg"} 
                              alt={msg.sender === "support" ? "Support" : "AI Assistant"} 
                            />
                            <AvatarFallback>
                              {msg.sender === "support" ? "S" : "AI"}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div className="flex flex-col">
                          <div
                            className={cn(
                              "rounded-lg px-4 py-2 text-sm",
                              msg.sender === "user"
                                ? "bg-primary text-primary-foreground"
                                : msg.sender === "ai"
                                ? "bg-green-100 text-green-800 border border-green-200"
                                : "bg-gray-200 text-gray-800"
                            )}
                          >
                            {msg.text}
                          </div>
                          <span className="text-xs text-gray-500 mt-1 px-1">
                            {msg.time}
                          </span>
                        </div>
                        {msg.sender === "user" && (
                          <Avatar className="h-8 w-8 mt-0.5">
                            <AvatarImage src="/placeholder.svg" alt="You" />
                            <AvatarFallback>You</AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
                <form 
                  onSubmit={handleSendMessage}
                  className="border-t p-2 bg-white flex items-center space-x-2"
                >
                  <Input
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    type="submit" 
                    size="sm"
                    disabled={!message.trim()}
                  >
                    Send
                  </Button>
                </form>
              </>
            )}
          </Card>
        )}
      </div>
    </>
  );
}
