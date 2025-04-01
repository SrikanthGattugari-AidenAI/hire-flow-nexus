
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Search, Send, Paperclip, MoreHorizontal, Clock } from "lucide-react";
import { messages, candidates, users } from "@/data/mockData";
import { format } from "date-fns";

const Messages = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedConversation, setSelectedConversation] = useState(messages[0]);
  const [newMessage, setNewMessage] = useState("");
  
  // Filter conversations based on search query
  const filteredConversations = messages.filter((conversation) => {
    const candidate = candidates.find((c) => c.id === conversation.candidateId);
    return (
      candidate &&
      candidate.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });
  
  // Get candidate info for the selected conversation
  const selectedCandidate = candidates.find(
    (c) => c.id === selectedConversation?.candidateId
  );
  
  // Handle sending a new message
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    // Create a new message
    const newMessageObj = {
      id: selectedConversation.messages.length + 1,
      sender: "user",
      userId: users[0].id,
      content: newMessage,
      timestamp: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
    };
    
    // Add the message to the conversation
    selectedConversation.messages.push(newMessageObj);
    
    // Clear the input
    setNewMessage("");
  };
  
  // Handle pressing Enter to send a message
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="page-container h-[calc(100vh-136px)]">
      <h1 className="text-3xl font-bold mb-6">Messages</h1>
      
      <div className="flex h-full gap-6">
        {/* Conversation Sidebar */}
        <Card className="w-full max-w-xs flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle>Conversations</CardTitle>
            <CardDescription>{filteredConversations.length} conversations</CardDescription>
            
            <div className="relative mt-2">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>
          
          <CardContent className="flex-1 overflow-y-auto p-0">
            <ul className="divide-y">
              {filteredConversations.map((conversation) => {
                const candidate = candidates.find((c) => c.id === conversation.candidateId);
                if (!candidate) return null;
                
                const lastMessage = conversation.messages[conversation.messages.length - 1];
                
                return (
                  <li key={conversation.id}>
                    <button
                      className={`w-full p-3 text-left transition-colors hover:bg-muted/50 ${
                        selectedConversation.id === conversation.id ? "bg-muted" : ""
                      }`}
                      onClick={() => setSelectedConversation(conversation)}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={candidate.photo} alt={candidate.name} />
                          <AvatarFallback>{candidate.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-medium truncate">{candidate.name}</p>
                            <span className="text-xs text-muted-foreground">
                              {lastMessage ? lastMessage.timestamp.split(" ")[0] : ""}
                            </span>
                          </div>
                          
                          <p className="text-sm text-muted-foreground truncate">
                            {lastMessage ? (
                              <>
                                {lastMessage.sender === "system" ? "" : 
                                 lastMessage.sender === "user" ? "You: " : ""}
                                {lastMessage.content}
                              </>
                            ) : "No messages"}
                          </p>
                        </div>
                      </div>
                    </button>
                  </li>
                );
              })}
              
              {filteredConversations.length === 0 && (
                <li className="p-4 text-center text-muted-foreground">
                  No conversations found.
                </li>
              )}
            </ul>
          </CardContent>
          
          <CardFooter className="border-t">
            <Button variant="outline" className="w-full">
              New Conversation
            </Button>
          </CardFooter>
        </Card>
        
        {/* Conversation Area */}
        <Card className="flex-1 flex flex-col">
          {selectedConversation && selectedCandidate ? (
            <>
              <CardHeader className="flex-row items-center justify-between py-4">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={selectedCandidate.photo} alt={selectedCandidate.name} />
                    <AvatarFallback>{selectedCandidate.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <CardTitle>{selectedCandidate.name}</CardTitle>
                    <CardDescription>{selectedCandidate.email}</CardDescription>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon">
                    <Clock className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-5 w-5" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="flex-1 overflow-y-auto p-4 border-t border-b">
                <div className="space-y-4">
                  {selectedConversation.messages.map((message) => {
                    // System message
                    if (message.sender === "system") {
                      return (
                        <div
                          key={message.id}
                          className="text-center text-xs text-muted-foreground py-2"
                        >
                          {message.content}
                        </div>
                      );
                    }
                    
                    // User message
                    if (message.sender === "user") {
                      const user = users.find((u) => u.id === message.userId);
                      
                      return (
                        <div key={message.id} className="flex justify-end">
                          <div className="flex items-end gap-2">
                            <div className="text-xs text-right text-muted-foreground">
                              {message.timestamp.split(" ")[1].substring(0, 5)}
                            </div>
                            <div className="bg-primary text-primary-foreground p-3 rounded-lg max-w-md break-words">
                              <p>{message.content}</p>
                            </div>
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={user?.avatar} alt={user?.name} />
                              <AvatarFallback>
                                {user?.name?.substring(0, 2) || "U"}
                              </AvatarFallback>
                            </Avatar>
                          </div>
                        </div>
                      );
                    }
                    
                    // Candidate message
                    return (
                      <div key={message.id} className="flex">
                        <div className="flex items-end gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={selectedCandidate.photo} alt={selectedCandidate.name} />
                            <AvatarFallback>
                              {selectedCandidate.name.substring(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="bg-muted p-3 rounded-lg max-w-md break-words">
                            <p>{message.content}</p>
                          </div>
                          <div className="text-xs text-left text-muted-foreground">
                            {message.timestamp.split(" ")[1].substring(0, 5)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
              
              <CardFooter className="p-4">
                <div className="flex items-end gap-2 w-full">
                  <Button variant="outline" size="icon">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  
                  <Textarea
                    placeholder="Type a message..."
                    className="flex-1 min-h-[60px] max-h-[150px]"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                  
                  <Button 
                    size="icon" 
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <div className="mb-4 p-4 rounded-full bg-muted">
                <Send className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-medium mb-2">No conversation selected</h3>
              <p className="text-muted-foreground">
                Select a conversation to start messaging.
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Messages;
