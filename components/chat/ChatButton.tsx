"use client";

import { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useAuth } from "@clerk/nextjs";

type Message = {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  senderName: string;
  timestamp: Date;
  isAdmin: boolean;
};

type LoadingState = {
  load: boolean;
  send: boolean;
};

export const ChatButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState<LoadingState>({
    load: false,
    send: false
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { userId, isSignedIn } = useAuth();
  
  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  // Effect to scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Effect to poll for new messages every 5 seconds when chat is open
  useEffect(() => {
    if (isOpen && isSignedIn) {
      loadMessages();
      
      const interval = setInterval(() => {
        loadMessages();
      }, 5000); // Poll every 5 seconds
      
      return () => clearInterval(interval);
    }
  }, [isOpen, isSignedIn]);

  const toggleChat = () => {
    if (!isSignedIn && !isOpen) {
      // Redirect to login if user is not authenticated
      router.push("/sign-in");
      return;
    }
    
    setIsOpen(!isOpen);
    
    // Load messages when chat is opened
    if (!isOpen && userId) {
      loadMessages();
    }
  };
  
  // Add userId type check for TypeScript
  const getCurrentUserId = () => {
    return userId || "";
  };

  const loadMessages = async () => {
    const currentUserId = getCurrentUserId();
    if (!currentUserId) return;
    
    try {
      setLoading(state => ({ ...state, load: true }));
      const response = await fetch(`/api/chat/messages?userId=${currentUserId}`);
      const data = await response.json();
      
      if (response.ok) {
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error("Failed to load messages:", error);
    } finally {
      setLoading(state => ({ ...state, load: false }));
    }
  };

  const sendMessage = async () => {
    const currentUserId = getCurrentUserId();
    if (!newMessage.trim() || !currentUserId) return;
    
    try {
      setLoading(state => ({ ...state, send: true }));
      
      // Optimistically add message to UI
      const tempMessage: Message = {
        id: Date.now().toString(),
        content: newMessage,
        senderId: currentUserId,
        receiverId: "admin", // Admin is always the receiver for student messages
        senderName: "Bạn",
        timestamp: new Date(),
        isAdmin: false
      };
      
      setMessages(prev => [...prev, tempMessage]);
      setNewMessage("");
      
      // Send to server
      const response = await fetch("/api/chat/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          content: newMessage,
          receiverId: "admin",
          userId: currentUserId
        })
      });
      
      if (!response.ok) {
        console.error("Failed to send message");
        // If failed, revert the optimistic update
        setMessages(prev => prev.filter(msg => msg.id !== tempMessage.id));
      } else {
        // Reload messages to get the correct ID and timestamp
        loadMessages();
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setLoading(state => ({ ...state, send: false }));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={toggleChat}
        className={cn(
          "fixed bottom-4 right-4 z-50 w-12 h-12 rounded-full flex items-center justify-center shadow-lg",
          isOpen ? "bg-gray-600" : "bg-primary"
        )}
      >
        {isOpen ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <MessageSquare className="h-6 w-6 text-white" />
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 z-50 w-80 sm:w-96 h-96 bg-white rounded-xl shadow-xl flex flex-col border">
          {/* Chat Header */}
          <div className="p-3 border-b bg-primary text-white rounded-t-xl flex items-center">
            <div className="h-8 w-8 mr-2 rounded-full bg-white flex items-center justify-center overflow-hidden">
              <span className="font-bold text-primary text-sm">HV</span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">Hỗ trợ Havamath</h3>
              <p className="text-xs opacity-90">Thường trả lời trong vài phút</p>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-3 overflow-y-auto">
            {loading.load && messages.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <div className="animate-pulse text-gray-400">Đang tải tin nhắn...</div>
              </div>
            ) : messages.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <p className="mb-2">Chào mừng bạn đến với Havamath!</p>
                  <p className="text-sm">Hãy đặt câu hỏi, chúng tôi sẽ hỗ trợ bạn.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "max-w-[80%] p-3 rounded-lg",
                      message.isAdmin
                        ? "bg-gray-200 text-black mr-auto rounded-bl-none"
                        : "bg-primary text-white ml-auto rounded-br-none"
                    )}
                  >
                    <p>{message.content}</p>
                    <div
                      className={cn(
                        "text-xs mt-1",
                        message.isAdmin ? "text-gray-500" : "text-white/80"
                      )}
                    >
                      {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
                {loading.send && (
                  <div className="text-center">
                    <span className="inline-block px-3 py-1 text-xs text-gray-400 animate-pulse">Đang gửi...</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Chat Input */}
          <div className="p-3 border-t">
            <div className="flex">
              <Textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Nhập tin nhắn..."
                className="flex-1 resize-none h-10 py-2"
                disabled={loading.send || !isSignedIn}
              />
              <Button
                size="icon"
                className="ml-2"
                onClick={sendMessage}
                disabled={loading.send || !newMessage.trim() || !isSignedIn}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
