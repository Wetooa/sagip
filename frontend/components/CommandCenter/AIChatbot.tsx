"use client";

import { useState, useRef, useEffect } from "react";
import {
  Send,
  Loader2,
  Sparkles,
  TrendingUp,
  AlertCircle,
  Users,
  MapPin,
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export default function AIChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hello! I'm your AI assistant for SAGIP Command Center. I can help you analyze emergency data, provide insights on hazard zones, track rescue operations, and answer questions about the current situation. How can I assist you?",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: generateAIResponse(input),
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const generateAIResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();

    if (
      lowerQuery.includes("hazard") ||
      lowerQuery.includes("flood") ||
      lowerQuery.includes("risk")
    ) {
      return "Based on current data analysis:\n\n• 24 critical hazard zones identified\n• Flood risk levels elevated in sectors A-12, B-5, and C-8\n• Storm surge warning active for coastal areas\n• Recommended action: Prioritize evacuation in Zone A-12\n\nWould you like detailed forecasts for specific areas?";
    }

    if (
      lowerQuery.includes("rescue") ||
      lowerQuery.includes("team") ||
      lowerQuery.includes("route")
    ) {
      return "Rescue Operations Summary:\n\n• 12 active rescue missions in progress\n• Average response time: 8.5 minutes\n• Team Alpha is closest to Zone A-12 (ETA 12 min)\n• Optimal route calculated avoiding flooded roads\n\nShall I dispatch additional units to high-priority zones?";
    }

    if (
      lowerQuery.includes("people") ||
      lowerQuery.includes("population") ||
      lowerQuery.includes("evacuate")
    ) {
      return "Population Tracking Analysis:\n\n• 1,247 people currently tracked\n• 156 in critical zones (requires immediate evacuation)\n• 289 in danger zones (monitor closely)\n• 802 in safe zones\n\nRecommendation: Focus evacuation efforts on critical zone residents first.";
    }

    if (
      lowerQuery.includes("sos") ||
      lowerQuery.includes("lora") ||
      lowerQuery.includes("alert")
    ) {
      return "SOS Alert System Status:\n\n• 3 active SOS signals detected\n• Zone A-12: Critical priority (2 min ago)\n• Sector B-5: High priority (5 min ago)\n• Area C-8: Medium priority (10 min ago)\n\nAll alerts have been acknowledged. Rescue teams dispatched.";
    }

    if (
      lowerQuery.includes("predict") ||
      lowerQuery.includes("forecast") ||
      lowerQuery.includes("ai")
    ) {
      return "AI Predictive Analysis:\n\n• Typhoon landfall predicted in 4-6 hours\n• Expected peak flood levels at 18:00-20:00\n• High-risk areas: Coastal regions, low-lying zones\n• Recommendation: Complete evacuations by 16:00\n\nML model confidence: 87%";
    }

    return "I can help you with:\n\n• Real-time hazard analysis\n• Rescue operation coordination\n• Population tracking insights\n• SOS alert management\n• Predictive forecasting\n\nPlease specify what information you need, and I'll provide detailed analysis.";
  };

  const quickActions = [
    { label: "Hazard Summary", query: "Give me a hazard summary" },
    { label: "Rescue Status", query: "What is the rescue operation status?" },
    { label: "Critical Zones", query: "Show me critical zones" },
    { label: "AI Predictions", query: "What are your predictions?" },
  ];

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === "user"
                  ? "bg-gradient-to-r from-[#8B0000] to-[#6B1515] text-white shadow-md"
                  : "bg-white/10 text-white border border-white/20 backdrop-blur-sm"
              }`}
            >
              {message.role === "assistant" && (
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-[#F4E4C1]" />
                  <span className="text-xs font-semibold text-[#F4E4C1]">
                    AI Assistant
                  </span>
                </div>
              )}
              <p className="text-sm whitespace-pre-line">{message.content}</p>
              <span className="text-xs opacity-60 mt-2 block">
                {new Date(message.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white/10 rounded-lg p-3 border border-white/20">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-[#F4E4C1]" />
                <span className="text-sm text-gray-300">AI is thinking...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      {messages.length === 1 && (
        <div className="px-4 pb-2">
          <div className="text-xs text-gray-400 mb-2">Quick Actions:</div>
          <div className="flex flex-wrap gap-2">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => {
                  setInput(action.query);
                  setTimeout(() => handleSend(), 100);
                }}
                className="text-xs bg-white/5 hover:bg-white/10 text-gray-300 px-3 py-1.5 rounded-full border border-white/10 transition-colors"
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-white/10">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask about hazards, rescue ops, or get AI insights..."
            className="flex-1 bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6B1515]"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="bg-gradient-to-r from-[#8B0000] to-[#6B1515] hover:shadow-lg hover:shadow-[#8B0000]/50 disabled:opacity-50 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-all"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
