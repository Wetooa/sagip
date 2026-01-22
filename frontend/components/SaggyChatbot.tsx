"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, Send, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  actions?: string[];
  followUpQuestion?: string;
}

interface ChatResponse {
  type: "text" | "tool" | "error";
  message?: string;
  actions?: Array<{
    text: string;
    tool_call?: {
      name?: string;
      arguments?: Record<string, any>;
    };
  }>;
  follow_up_question?: string;
  data?: Record<string, any>;
  meta?: {
    confidence?: number;
    source?: string[];
  };
}

export function SaggyChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm Saggy, your disaster management assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // API base URL - adjust if needed
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: currentInput,
          user_context: {}, // TODO: Add user context from auth/session
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ChatResponse = await response.json();

      // Extract message, actions, and follow-up question separately
      const messageText = data.message || "";
      const actions = data.actions?.map((a) => a.text).filter(Boolean) || [];
      const followUpQuestion = data.follow_up_question;

      // If no content at all, show a default message
      const displayText = messageText || 
        (actions.length > 0 ? "" : "I'm processing your request. Please wait a moment.");

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: displayText,
        sender: "bot",
        timestamp: new Date(),
        actions: actions.length > 0 ? actions : undefined,
        followUpQuestion: followUpQuestion || undefined,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error calling chatbot API:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I encountered an error. Please try again later.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-[#6B1515] hover:bg-[#6B1515]/90 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
        size="icon"
        aria-label="Open Saggy chatbot"
      >
        <Bot className="h-6 w-6 text-white" />
      </Button>

      {/* Chat Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="flex flex-col p-0 sm:max-w-lg sm:max-h-[85vh] h-[calc(100vh-4rem)] sm:h-[600px]">
          <DialogHeader className="px-6 py-4 border-b">
            <DialogTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-[#6B1515]" />
              <span>Saggy</span>
            </DialogTitle>
          </DialogHeader>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.sender === "user"
                      ? "bg-[#6B1515] text-white"
                      : "bg-gray-200 text-gray-900"
                  }`}
                >
                  {/* Main message text */}
                  {message.text && (
                    <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                  )}
                  
                  {/* Actions as separate items */}
                  {message.actions && message.actions.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {message.actions.map((action, idx) => (
                        <div
                          key={idx}
                          className="text-sm bg-white/50 dark:bg-gray-800/50 rounded px-2 py-1 mt-1"
                        >
                          <span className="text-xs text-gray-600 dark:text-gray-400">→ </span>
                          {action}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Follow-up question */}
                  {message.followUpQuestion && (
                    <div className="mt-2 pt-2 border-t border-gray-300 dark:border-gray-600">
                      <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        💡 Follow-up:
                      </p>
                      <p className="text-sm italic text-gray-600 dark:text-gray-400">
                        {message.followUpQuestion}
                      </p>
                    </div>
                  )}
                  
                  <p
                    className={`text-xs mt-2 ${
                      message.sender === "user"
                        ? "text-white/70"
                        : "text-gray-600"
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-200 text-gray-900 rounded-lg px-4 py-2 max-w-[80%]">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <p className="text-sm">Saggy is thinking...</p>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t px-4 py-4">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1"
                disabled={isLoading}
              />
              <Button
                onClick={handleSend}
                disabled={!inputValue.trim() || isLoading}
                className="bg-[#6B1515] hover:bg-[#6B1515]/90"
                size="icon"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
