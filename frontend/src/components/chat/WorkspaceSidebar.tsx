import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Plus } from 'lucide-react';
import Image from 'next/image';

interface Workspace {
  id: string;
  name: string;
  iconUrl?: string;
}

interface WorkspaceSidebarProps {
  workspaces: Workspace[];
  activeWorkspaceId: string;
  onSelectWorkspace: (id: string) => void;
}

export function WorkspaceSidebar({ workspaces, activeWorkspaceId, onSelectWorkspace }: WorkspaceSidebarProps) {
  return (
    <div className="w-[72px] bg-slate-900 flex flex-col items-center py-3 gap-2 z-20 shrink-0">
      <TooltipProvider>
        {/* Home / DMs */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button 
              onClick={() => onSelectWorkspace('dms')}
              className={`w-12 h-12 rounded-[24px] hover:rounded-[16px] transition-all duration-200 flex items-center justify-center overflow-hidden group relative ${
                activeWorkspaceId === 'dms' ? 'bg-brand-primary rounded-[16px]' : 'bg-slate-800 hover:bg-brand-primary text-slate-100'
              }`}
            >
              <div className="absolute left-0 w-1 bg-white rounded-r-md transition-all duration-200 opacity-0 group-hover:opacity-100 group-hover:h-5 -ml-1"></div>
              {activeWorkspaceId === 'dms' && <div className="absolute left-0 w-1 h-10 bg-white rounded-r-md -ml-1"></div>}
              
              <Image src="/logo.png" alt="Home" width={28} height={28} className="object-contain" />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-0 bg-transparent">
                {!document.querySelector('img[src="/logo.png"]') && <span className="font-bold">Home</span>}
              </div>
            </button>
          </TooltipTrigger>
          <TooltipContent side="right">Home</TooltipContent>
        </Tooltip>

        <div className="w-8 h-[2px] bg-slate-800 rounded-full my-1" />

        {/* Workspaces List */}
        {workspaces.map((workspace) => (
          <Tooltip key={workspace.id}>
            <TooltipTrigger asChild>
              <button
                onClick={() => onSelectWorkspace(workspace.id)}
                className={`w-12 h-12 rounded-[24px] hover:rounded-[16px] transition-all duration-200 flex items-center justify-center overflow-hidden group relative ${
                  activeWorkspaceId === workspace.id ? 'bg-brand-primary rounded-[16px]' : 'bg-slate-800 hover:bg-brand-primary text-slate-100'
                }`}
              >
                <div className="absolute left-0 w-1 bg-white rounded-r-md transition-all duration-200 opacity-0 group-hover:opacity-100 group-hover:h-5 -ml-1"></div>
                {activeWorkspaceId === workspace.id && <div className="absolute left-0 w-1 h-10 bg-white rounded-r-md -ml-1"></div>}
                
                {workspace.iconUrl ? (
                  <Image src={workspace.iconUrl} alt={workspace.name} width={48} height={48} className="w-full h-full object-cover" />
                ) : (
                  <span className="font-semibold text-lg">{workspace.name.substring(0, 2).toUpperCase()}</span>
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">{workspace.name}</TooltipContent>
          </Tooltip>
        ))}

        {/* Add Workspace */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="w-12 h-12 rounded-[24px] hover:rounded-[16px] transition-all duration-200 bg-slate-800 hover:bg-green-500 text-green-500 hover:text-white flex items-center justify-center group mt-2">
              <Plus className="w-6 h-6 group-hover:scale-110 transition-transform" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right">Add a Workspace</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
