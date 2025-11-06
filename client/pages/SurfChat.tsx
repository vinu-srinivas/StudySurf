import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Send, MessageCircle } from "lucide-react";
import apiClient from "@/apiClient";
import { useRef } from "react";

interface ChatMessage {
  id: string;
  user: string;
  message: string;
  timestamp: string;
}

export default function SurfChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");

  const chatContainerRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    try {
      const response = await apiClient.get<ChatMessage[]>("/chat/messages/");
      setMessages(response.data.reverse());
      setError("");
    }
    catch (err) {
      console.error("Failed to fetch messages: ", err);
      setError("Failed to load messages. Please try refreshing.");
    }
  }

  const scrollToBottom = (behavior: "smooth" | "auto" = "auto")=>{
    if (chatContainerRef.current) {
      const { scrollHeight } = chatContainerRef.current;
      if (behavior === "smooth") {
        chatContainerRef.current.scrollTo({ top: scrollHeight, behavior: "smooth" });
      } else {
        // Instantly set the scroll position to the bottom
        chatContainerRef.current.scrollTop = scrollHeight;
      }
    }
  };

  useEffect(() => {
    fetchMessages();
    const intervalId = setInterval(fetchMessages, 5000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    scrollToBottom("auto")
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    setIsSending(true);
    setError("");
    try {
      await apiClient.post("/chat/messages/", { message: inputMessage });
      setInputMessage("")
      await fetchMessages();
    }
    catch (err) {
      console.error("Failed to send message:", err);
      setError("Failed to send message. Please try again.");
    }
    finally {
      setIsSending(false);
    }
  };

  const formatTime = (dateString: string) => {
    const date=new Date(dateString)
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="relative min-h-dvh flex items-center justify-center py-12">
      <div className="container max-w-4xl mx-auto px-4 h-[650px] flex flex-col">
        <div className="text-center mb-8 space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <MessageCircle className="h-10 w-10 text-blue-400" />
            <h1 className="text-4xl font-extrabold tracking-tight">SurfChat</h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A community hub where students share and discover the best learning resources
          </p>
        </div>

        <div className="w-full flex flex-col p-8 bg-white/5 border border-white/10 rounded-[20px] flex-1 min-h-0">
          <div className="flex-1 overflow-y-auto space-y-5 pr-3 mb-6 min-h-0">
            {messages.map((msg) => (
              <div key={msg.id} className="flex gap-4 animate-in fade-in slide-in-from-bottom">
                <div className="flex-shrink-0 text-3xl">👨‍🎓</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-3 flex-wrap">
                    <span className="font-semibold text-white text-base">{msg.user}</span>
                    <span className="text-sm text-white/50">{formatTime(msg.timestamp)}</span>
                  </div>
                  <p className="text-white/90 text-base mt-2 break-words leading-relaxed">{msg.message}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-white/10 mb-6" />

          <form onSubmit={handleSendMessage} className="space-y-4 flex-shrink-0">
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Share a resource or thought..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                disabled={isSending}
              />
              <Button
                type="submit"
                size="icon"
                className="h-11 w-11 flex-shrink-0"
                disabled={!inputMessage.trim() || isSending}
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          </form>
        </div>

        <div className="text-center mt-6">
          <Link to="/" className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors">
            <span>←</span>
            <span>Back to home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
