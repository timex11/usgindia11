import { Hash, Volume2, Plus, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Channel {
  id: string;
  name: string;
  type: 'text' | 'voice';
}

interface ChannelListProps {
  workspace: {
    name: string;
    channels: Channel[];
  };
  activeChannelId: string;
  onSelectChannel: (id: string) => void;
}

export function ChannelList({ workspace, activeChannelId, onSelectChannel }: ChannelListProps) {
  const textChannels = workspace.channels.filter(c => c.type === 'text');
  const voiceChannels = workspace.channels.filter(c => c.type === 'voice');

  return (
    <div className="w-60 bg-slate-50 dark:bg-[#1e1e24] flex flex-col h-full border-r border-slate-200/50 dark:border-slate-800/50 shrink-0">
      {/* Workspace Header */}
      <div className="h-14 px-4 flex items-center justify-between border-b border-slate-200/50 dark:border-slate-800/50 cursor-pointer hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors">
        <h2 className="font-bold text-[15px] truncate pr-2 text-slate-900 dark:text-slate-100">{workspace.name}</h2>
        <Settings className="w-4 h-4 text-slate-500" />
      </div>

      <ScrollArea className="flex-1 px-2 py-4">
        {/* Text Channels */}
        <div className="mb-6">
          <div className="flex items-center justify-between px-2 mb-1 group">
            <h3 className="text-xs font-semibold uppercase text-slate-500 hover:text-slate-300 transition-colors flex items-center cursor-pointer">
              <span className="mr-1">TEXT CHANNELS</span>
            </h3>
            <Plus className="w-4 h-4 text-slate-500 opacity-0 group-hover:opacity-100 cursor-pointer" />
          </div>
          <div className="space-y-[2px]">
            {textChannels.map(channel => (
              <button
                key={channel.id}
                onClick={() => onSelectChannel(channel.id)}
                className={`w-full flex items-center px-2 py-1.5 rounded-md group ${
                  activeChannelId === channel.id 
                  ? 'bg-slate-200/50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/30 dark:hover:bg-slate-800/30 hover:text-slate-800 dark:hover:text-slate-300'
                }`}
              >
                <Hash className="w-4 h-4 mr-1.5 opacity-70" />
                <span className="truncate">{channel.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Voice Channels */}
        <div>
          <div className="flex items-center justify-between px-2 mb-1 group">
            <h3 className="text-xs font-semibold uppercase text-slate-500 hover:text-slate-300 transition-colors flex items-center cursor-pointer">
              <span className="mr-1">VOICE CHANNELS</span>
            </h3>
            <Plus className="w-4 h-4 text-slate-500 opacity-0 group-hover:opacity-100 cursor-pointer" />
          </div>
          <div className="space-y-[2px]">
            {voiceChannels.map(channel => (
              <button
                key={channel.id}
                onClick={() => onSelectChannel(channel.id)}
                className={`w-full flex items-center px-2 py-1.5 rounded-md group ${
                  activeChannelId === channel.id 
                  ? 'bg-slate-200/50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/30 dark:hover:bg-slate-800/30 hover:text-slate-800 dark:hover:text-slate-300'
                }`}
              >
                <Volume2 className="w-4 h-4 mr-1.5 opacity-70" />
                <span className="truncate">{channel.name}</span>
              </button>
            ))}
          </div>
        </div>
      </ScrollArea>

      {/* User Panel */}
      <div className="h-[52px] bg-slate-100 dark:bg-[#18181b] px-2 py-1.5 flex items-center justify-between border-t border-slate-200/50 dark:border-slate-800/50 mt-auto">
        <div className="flex items-center hover:bg-slate-200/50 dark:hover:bg-white/10 p-1 rounded-md cursor-pointer transition-colors max-w-[130px] flex-1">
          <Avatar className="w-8 h-8 mr-2 relative">
            <AvatarImage src="" />
            <AvatarFallback className="bg-brand-primary text-white text-xs">US</AvatarFallback>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#18181b] rounded-full"></span>
          </Avatar>
          <div className="flex flex-col truncate">
            <span className="text-sm font-semibold truncate text-slate-900 dark:text-slate-100 leading-tight">Me</span>
            <span className="text-[11px] text-slate-500 truncate leading-tight">Online</span>
          </div>
        </div>
        <div className="flex text-slate-500 gap-1">
          <Button variant="ghost" size="icon" className="w-8 h-8 rounded-md hover:bg-slate-200/50 dark:hover:bg-white/10 hover:text-slate-800 dark:hover:text-slate-300">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
