"use client";

import { useState, useRef, useEffect } from "react";
import { useSocket } from "@/hooks/useSocket";
import { apiClient } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Send,
  User,
  Bot,
  Sparkles,
  MessageSquarePlus,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface ChatResponse {
  conversationId?: string;
  response: string;
}

export default function AiCareerAssistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { connected } = useSocket();

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      // Simulate real-time streaming feel by adding a placeholder
      const data = await apiClient<ChatResponse>("/ai/chat", {
        method: "POST",
        body: JSON.stringify({
          message: userMsg.content,
          conversationId
        }),
      });

      if (data.conversationId) setConversationId(data.conversationId);

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response,
        timestamp: new Date().toISOString(),
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-5xl mx-auto space-y-4">
      <div className="flex justify-between items-center px-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
            <Bot className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">AI Career Assistant</h1>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider">
                {connected ? "Real-time Online" : "Connecting..."}
              </span>
            </div>
          </div>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => {
            setMessages([]);
            setConversationId(null);
          }}
          className="hidden sm:flex"
        >
          <MessageSquarePlus className="h-4 w-4 mr-2" /> New Session
        </Button>
      </div>

      <Card className="flex-1 overflow-hidden flex flex-col border-2 shadow-2xl bg-card/50 backdrop-blur-xl relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none" />
        
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-8 max-w-md mx-auto">
              <div className="relative">
                <div className="absolute -inset-4 bg-primary/20 blur-2xl rounded-full" />
                <Bot className="h-16 w-16 text-primary relative" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">How can I assist your career today?</h2>
                <p className="text-muted-foreground">
                  Ask me about exam preparation, college selection, resume building, or industry trends in India.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-2 w-full">
                {[
                  "What are the best colleges for Computer Science in Delhi?",
                  "How to prepare for JEE Mains in 3 months?",
                  "Explain the current job market for AI in Bangalore."
                ].map((hint, i) => (
                  <Button 
                    key={i} 
                    variant="secondary" 
                    className="justify-start h-auto py-3 px-4 text-left font-normal"
                    onClick={() => {
                      setInput(hint);
                    }}
                  >
                    <Sparkles className="h-4 w-4 mr-3 text-primary shrink-0" />
                    <span className="truncate">{hint}</span>
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6 pb-4">
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "flex gap-4",
                      msg.role === "user" ? "flex-row-reverse" : "flex-row"
                    )}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border",
                      msg.role === "user" ? "bg-muted" : "bg-primary/10 border-primary/20"
                    )}>
                      {msg.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4 text-primary" />}
                    </div>
                    <div className={cn(
                      "max-w-[80%] rounded-2xl p-4 shadow-sm",
                      msg.role === "user" 
                        ? "bg-primary text-primary-foreground rounded-tr-none" 
                        : "bg-muted rounded-tl-none"
                    )}>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                      <p className={cn(
                        "text-[10px] mt-2 opacity-50",
                        msg.role === "user" ? "text-right" : "text-left"
                      )}>
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {loading && (
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                  <div className="bg-muted rounded-2xl rounded-tl-none p-4 flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        <div className="p-4 bg-background/50 border-t backdrop-blur-md">
          <form onSubmit={handleSend} className="flex gap-2 max-w-4xl mx-auto">
            <div className="relative flex-1">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask your career assistant anything..."
                className="h-12 pl-4 pr-12 rounded-xl border-2 focus-visible:ring-primary shadow-inner"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-muted-foreground pointer-events-none hidden sm:block">
                ⌘ Enter
              </div>
            </div>
            <Button 
              type="submit" 
              size="icon" 
              className="h-12 w-12 rounded-xl shadow-lg transition-all hover:scale-105"
              disabled={!input.trim() || loading}
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
            </Button>
          </form>
          <p className="text-[10px] text-center text-muted-foreground mt-2 uppercase tracking-tighter">
            Powered by USG AI Engine • Response times may vary
          </p>
        </div>
      </Card>
    </div>
  );
}
