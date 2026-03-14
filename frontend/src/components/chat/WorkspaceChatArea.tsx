import { useState, useEffect, useRef } from 'react';
import { Hash, Search, Bell, Pin, Menu, PlusCircle, Smile, Image as ImageIcon, Gift, FileText, Users } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { useSocket } from '@/hooks/useSocket';
import { axiosInstance } from '@/lib/axios';
import { format } from 'date-fns';

interface MessageAuthor {
  id: string;
  fullName: string;
  avatarUrl: string;
}

interface MessageData {
  id: string;
  author: MessageAuthor;
  content: string;
  createdAt: string;
}

interface WorkspaceChatAreaProps {
  channel: {
    id: string;
    name: string;
    type: string;
  };
}

export function WorkspaceChatArea({ channel }: WorkspaceChatAreaProps) {
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [inputValue, setInputValue] = useState('');
  const { emit, on } = useSocket('/chat');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch initial messages when channel changes
    const fetchMessages = async () => {
      try {
        const res = await axiosInstance.get(`/chat/channels/${channel.id}/messages`);
        setMessages(res.data?.data || []);
      } catch (err) {
        console.error('Failed to load messages', err);
      }
    };
    
    fetchMessages();

    // Join channel
    emit('joinChannel', { channelId: channel.id });

    return () => {
      emit('leaveChannel', { channelId: channel.id });
    };
  }, [channel.id, emit]);

  useEffect(() => {
    // Listen for new messages
    const unsubscribe = on('newMessage', (data: unknown) => {
      const msg = data as MessageData;
      if (msg) {
        setMessages((prev) => {
          // Prevent duplicates
          if (prev.find((m) => m.id === msg.id)) return prev;
          return [...prev, msg];
        });
        
        // Auto scroll to bottom
        setTimeout(() => {
          scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [on]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    emit('sendMessage', { channelId: channel.id, content: inputValue });
    setInputValue('');
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white dark:bg-[#313338] min-w-0 border-l border-slate-200/50 dark:border-slate-800/50 relative">
      {/* Header */}
      <div className="h-14 px-4 border-b border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between shadow-sm shrink-0 bg-white/50 dark:bg-[#313338]/90 backdrop-blur-sm z-10 absolute top-0 w-full">
        <div className="flex items-center min-w-0">
          <Menu className="w-6 h-6 mr-4 lg:hidden text-slate-500 cursor-pointer" />
          <Hash className="w-6 h-6 mr-2 text-slate-500 dark:text-slate-400 shrink-0" />
          <h2 className="font-bold text-[15px] truncate text-slate-900 dark:text-slate-100">{channel.name}</h2>
          <div className="w-[1px] h-6 bg-slate-300 dark:bg-slate-700 mx-4 shrink-0 hidden sm:block" />
          <p className="text-sm text-slate-500 dark:text-slate-400 truncate hidden sm:block">
            General discussion for the workspace
          </p>
        </div>
        
        <div className="flex items-center space-x-4 text-slate-500 dark:text-slate-400 shrink-0">
          <Bell className="w-5 h-5 hidden sm:block cursor-pointer hover:text-slate-800 dark:hover:text-slate-200 transition-colors" />
          <Pin className="w-5 h-5 hidden sm:block cursor-pointer hover:text-slate-800 dark:hover:text-slate-200 transition-colors" />
          <Users className="w-5 h-5 hidden sm:block cursor-pointer hover:text-slate-800 dark:hover:text-slate-200 transition-colors" />
          <div className="relative hidden md:block">
            <Search className="w-4 h-4 absolute left-2 top-1/2 -translate-y-1/2" />
            <Input 
              placeholder="Search" 
              className="h-7 w-36 pl-8 bg-slate-100 dark:bg-[#1e1f22] border-none text-xs rounded-sm focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-500"
            />
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 px-4 mt-14 mb-24">
        <div className="py-6 flex flex-col justify-end min-h-full">
          {/* Welcome Message */}
          <div className="mb-6 mt-auto">
            <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-[#4e5058] flex items-center justify-center mb-4">
              <Hash className="w-10 h-10 text-slate-500 dark:text-slate-300" />
            </div>
            <h1 className="text-3xl font-bold mb-2 text-slate-900 dark:text-slate-100">Welcome to #{channel.name}!</h1>
            <p className="text-slate-500 dark:text-slate-400">This is the start of the #{channel.name} channel.</p>
          </div>

          <div className="w-full h-[1px] bg-slate-200 dark:bg-slate-700 my-4" />

          {/* Message List */}
          <div className="space-y-6">
            {messages.map((msg) => (
              <div key={msg.id} className="flex group hover:bg-slate-50 dark:hover:bg-[#2b2d31] -mx-4 px-4 py-1 rounded-sm transition-colors">
                <Avatar className="w-10 h-10 mr-4 mt-0.5 cursor-pointer">
                  <AvatarImage src={msg.author?.avatarUrl} />
                  <AvatarFallback className="bg-brand-primary text-white">{msg.author?.fullName?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-baseline space-x-2">
                    <span className="font-medium text-[15px] hover:underline cursor-pointer text-slate-900 dark:text-slate-100">{msg.author?.fullName || 'User'}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {msg.createdAt ? format(new Date(msg.createdAt), 'p') : ''}
                    </span>
                  </div>
                  <p className="text-[15px] leading-relaxed text-slate-800 dark:text-slate-300 mt-1 whitespace-pre-wrap break-words">
                    {msg.content}
                  </p>
                </div>
              </div>
            ))}
            <div ref={scrollRef} />
          </div>
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="absolute bottom-0 w-full px-4 pb-6 pt-2 bg-gradient-to-t from-white via-white to-transparent dark:from-[#313338] dark:via-[#313338] dark:to-transparent z-10">
        <div className="bg-slate-100 dark:bg-[#383a40] rounded-lg flex flex-col px-4 py-2 relative border border-slate-200/50 dark:border-slate-800/50 shadow-sm transition-all focus-within:ring-2 focus-within:ring-brand-primary/50">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700/50 shrink-0">
              <PlusCircle className="w-5 h-5" />
            </Button>
            
            <input
              type="text"
              placeholder={`Message #${channel.name}`}
              className="flex-1 bg-transparent border-none text-[15px] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-0 px-2 placeholder:text-slate-500"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            
            <div className="flex items-center space-x-1 text-slate-500 shrink-0">
              <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700/50 hidden sm:flex">
                <Gift className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700/50 hidden sm:flex">
                <ImageIcon className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700/50 hidden sm:flex">
                <FileText className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700/50">
                <Smile className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
