'use client';

import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/store/useAuthStore';
import { Send, User } from 'lucide-react';
import { useApi } from '@/hooks/useApi';
import { Spinner } from '@/components/ui/spinner';

interface ChatMessage {
  id: string;
  roomId: string;
  content: string;
  userId: string;
  createdAt: string;
  user: {
    id: string;
    fullName: string | null;
    avatarUrl: string | null;
  };
}

export function ChatInterface({ roomId = 'general' }: { roomId?: string }) {
  const { user, token } = useAuthStore();
  const { get } = useApi();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial fetch of messages
  useEffect(() => {
    if (!token) return;

    let isMounted = true;

    // Fetch history
    const fetchHistory = async () => {
      try {
        const data = await get<ChatMessage[]>(`/community/messages/${roomId}`);
        if (isMounted && Array.isArray(data)) {
          setMessages(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    
    fetchHistory();
    
    // Connect socket
    const socketUrl = process.env.NEXT_PUBLIC_API_URL 
        ? new URL(process.env.NEXT_PUBLIC_API_URL).origin 
        : 'http://localhost:3000';

    const newSocket = io(socketUrl, {
      auth: {
        token: token,
      },
    });

    newSocket.on('connect', () => {
      console.log('Connected to WebSocket');
      newSocket.emit('joinRoom', { roomId });
    });

    newSocket.on('newMessage', (message: ChatMessage) => {
      setMessages((prev) => [...prev, message]);
    });

    setSocket(newSocket);

    return () => {
      isMounted = false;
      newSocket.disconnect();
    };
  }, [roomId, token, get]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!socket || !inputValue.trim() || !user) return;

    socket.emit('sendMessage', {
      roomId,
      content: inputValue,
      userId: user.id,
    });

    setInputValue('');
  };

  return (
    <div className="flex flex-col h-full bg-[#050505] rounded-2xl border border-white/10 overflow-hidden shadow-2xl relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black pointer-events-none"></div>
      
      {/* Header */}
      <header className="h-14 border-b border-white/5 bg-black/60 backdrop-blur-md flex items-center px-6 z-20">
          <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                  <User size={16} className="text-blue-400" />
              </div>
              <div>
                  <h1 className="text-sm font-bold tracking-wider text-white">COMMUNITY <span className="text-blue-500">CHAT</span></h1>
                  <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]"></span>
                      <span className="text-[10px] text-slate-400 font-mono">LIVE</span>
                  </div>
              </div>
          </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto p-6 space-y-6 relative z-10 font-mono text-sm scrollbar-thin scrollbar-thumb-white/10">
         {loading ? (
             <div className="flex h-full items-center justify-center">
                 <Spinner size="lg" className="text-blue-500" />
             </div>
         ) : messages.length === 0 ? (
            <div className="flex h-full items-center justify-center flex-col text-slate-500">
                <p>No messages yet. Start the conversation!</p>
            </div>
         ) : (
            <>
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex ${msg.userId === user?.id ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
                    >
                        <div className={`flex flex-col max-w-[85%] ${msg.userId === user?.id ? 'items-end' : 'items-start'}`}>
                            {msg.userId !== user?.id && (
                                <span className="text-[10px] text-slate-500 mb-1 ml-1">
                                    {msg.user?.fullName || 'Anonymous'}
                                </span>
                            )}
                            <div className={`p-4 rounded-xl border ${
                                msg.userId === user?.id
                                ? 'bg-blue-600/90 text-white border-transparent'
                                : 'bg-[#0F0F12] border-blue-500/20 text-slate-300 shadow-xl'
                            }`}>
                                <div className="whitespace-pre-wrap leading-relaxed">
                                    {msg.content}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </>
         )}
      </main>

      {/* Input */}
      <footer className="p-4 bg-black/80 backdrop-blur border-t border-white/5 z-20">
          <div className="max-w-4xl mx-auto">
              <div className="relative flex items-center bg-[#0F0F12] border border-white/10 rounded-xl px-4 py-2 focus-within:border-blue-500/50 transition-all">
                  <span className="text-blue-500 mr-2 font-mono">{`>`}</span>
                  <input 
                    type="text" 
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 bg-transparent border-none text-slate-200 focus:ring-0 placeholder:text-slate-700 font-mono text-sm h-10"
                  />
                  <button 
                    onClick={handleSendMessage} 
                    disabled={!inputValue.trim()} 
                    className="p-2 text-blue-500 hover:text-blue-400 disabled:opacity-20 transition-colors"
                  >
                      <Send size={18} />
                  </button>
              </div>
          </div>
      </footer>
    </div>
  );
}
