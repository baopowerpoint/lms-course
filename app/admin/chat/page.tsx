"use client";

import { useState, useEffect } from "react";
import { Send, Search, Users, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import Link from "next/link";

type User = {
  id: string;
  name: string;
  email: string;
  unread: number;
  lastMessage?: {
    content: string;
    timestamp: Date;
  };
};

type Message = {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  senderName: string;
  timestamp: Date;
  isAdmin: boolean;
};

export default function AdminChatPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState({
    users: false,
    messages: false,
    send: false
  });
  const [searchQuery, setSearchQuery] = useState("");

  // Load users with chat history
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(prev => ({ ...prev, users: true }));
        
        // Fetch users who have sent messages
        const response = await fetch('/api/chat/users');
        const data = await response.json();
        
        if (response.ok) {
          setUsers(data.users || []);
        } else {
          console.error("Error loading chat users:", data.error);
        }
      } catch (error) {
        console.error("Failed to load users:", error);
      } finally {
        setLoading(prev => ({ ...prev, users: false }));
      }
    };
    
    loadUsers();
  }, []);

  // Load messages for selected user
  useEffect(() => {
    if (!selectedUserId) return;

    const loadMessages = async () => {
      try {
        setLoading(prev => ({ ...prev, messages: true }));

        // Fetch messages from the API
        const response = await fetch(`/api/chat/messages?userId=${selectedUserId}`);
        const data = await response.json();
        
        if (response.ok) {
          setMessages(data.messages || []);
          
          // Mark as read
          await fetch(`/api/chat/messages/read`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId: selectedUserId
            })
          });
          
          // Update unread count to zero
          setUsers(prevUsers => 
            prevUsers.map(user => 
              user.id === selectedUserId 
                ? { ...user, unread: 0 } 
                : user
            )
          );
        } else {
          console.error("Error loading messages:", data.error);
        }
      } catch (error) {
        console.error("Failed to load messages:", error);
      } finally {
        setLoading(prev => ({ ...prev, messages: false }));
      }
    };

    loadMessages();
    
    // Set up polling for new messages
    const interval = setInterval(loadMessages, 10000); // Poll every 10 seconds
    
    return () => clearInterval(interval);
  }, [selectedUserId]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedUserId) return;

    try {
      setLoading(prev => ({ ...prev, send: true }));
      
      // Optimistically add message to UI
      const tempMessage: Message = {
        id: Date.now().toString(),
        content: newMessage,
        senderId: "admin",
        receiverId: selectedUserId,
        senderName: "Admin",
        timestamp: new Date(),
        isAdmin: true
      };
      
      // Add message to UI
      setMessages(prev => [...prev, tempMessage]);
      setNewMessage("");
      
      // Update last message in user list
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === selectedUserId
            ? {
                ...user,
                lastMessage: {
                  content: newMessage,
                  timestamp: new Date()
                }
              }
            : user
        )
      );
      
      // Send to API
      const response = await fetch("/api/chat/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: newMessage,
          receiverId: selectedUserId,
          userId: "admin"
        })
      });
      
      if (!response.ok) {
        console.error("Failed to send message");
        // Revert optimistic update if failed
        setMessages(prev => prev.filter(msg => msg.id !== tempMessage.id));
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setLoading(prev => ({ ...prev, send: false }));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="py-4 px-6 bg-white border-b shadow-sm flex items-center justify-between">
        <h1 className="text-2xl font-bold">Quản lý tin nhắn</h1>
        <Link href="/admin" className="text-gray-600 hover:text-primary">
          Trở về Dashboard
        </Link>
      </div>
      
      <div className="container mx-auto py-6 px-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden border flex h-[75vh]">
          {/* Users sidebar */}
          <div className="w-full md:w-1/3 lg:w-1/4 border-r">
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm người dùng..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div className="overflow-y-auto h-[calc(75vh-73px)]">
              {loading.users ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-pulse text-gray-400">Đang tải...</div>
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-32 text-gray-500">
                  <Users className="h-8 w-8 mb-2" />
                  <p>Không tìm thấy người dùng</p>
                </div>
              ) : (
                filteredUsers.map(user => (
                  <button
                    key={user.id}
                    className={cn(
                      "w-full text-left p-4 border-b hover:bg-gray-50 flex items-start",
                      selectedUserId === user.id && "bg-primary/5"
                    )}
                    onClick={() => setSelectedUserId(user.id)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{user.name}</h3>
                        {user.lastMessage && (
                          <span className="text-xs text-gray-500">
                            {new Date(user.lastMessage.timestamp).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit"
                            })}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 truncate mb-1">
                        {user.email}
                      </p>
                      {user.lastMessage && (
                        <p className="text-sm text-gray-600 truncate">{user.lastMessage.content}</p>
                      )}
                    </div>
                    {user.unread > 0 && (
                      <div className="bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs ml-2">
                        {user.unread}
                      </div>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>
          
          {/* Chat area */}
          <div className="hidden md:flex md:w-2/3 lg:w-3/4 flex-col">
            {selectedUserId ? (
              <>
                {/* Chat header */}
                <div className="p-4 border-b flex items-center">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                    <span className="text-primary font-medium">
                      {users.find(u => u.id === selectedUserId)?.name.charAt(0).toUpperCase() || "U"}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-medium">
                      {users.find(u => u.id === selectedUserId)?.name || "Người dùng"}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {users.find(u => u.id === selectedUserId)?.email || ""}
                    </p>
                  </div>
                </div>
                
                {/* Messages */}
                <div className="flex-1 p-4 overflow-y-auto flex flex-col space-y-4">
                  {loading.messages ? (
                    <div className="flex items-center justify-center h-32">
                      <div className="animate-pulse text-gray-400">Đang tải tin nhắn...</div>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-32 text-gray-500">
                      <MessageSquare className="h-8 w-8 mb-2" />
                      <p>Không có tin nhắn</p>
                    </div>
                  ) : (
                    messages.map(message => (
                      <div
                        key={message.id}
                        className={cn(
                          "max-w-[80%] p-3 rounded-lg",
                          message.isAdmin
                            ? "bg-primary text-white ml-auto rounded-br-none"
                            : "bg-gray-100 text-gray-800 mr-auto rounded-bl-none"
                        )}
                      >
                        <p>{message.content}</p>
                        <div
                          className={cn(
                            "text-xs mt-1",
                            message.isAdmin ? "text-white/80" : "text-gray-500"
                          )}
                        >
                          {new Date(message.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </div>
                      </div>
                    ))
                  )}
                </div>
                
                {/* Input */}
                <div className="border-t p-4">
                  <div className="flex">
                    <Textarea
                      value={newMessage}
                      onChange={e => setNewMessage(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder="Nhập tin nhắn..."
                      className="flex-1 resize-none h-10 py-2"
                      disabled={loading.send}
                    />
                    <Button
                      size="icon"
                      className="ml-2"
                      onClick={sendMessage}
                      disabled={loading.send || !newMessage.trim()}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <MessageSquare className="h-12 w-12 mb-4" />
                <h3 className="text-lg font-medium mb-2">Chọn người dùng để bắt đầu trò chuyện</h3>
                <p className="text-sm">Chọn một người dùng từ danh sách bên trái để xem và gửi tin nhắn</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
