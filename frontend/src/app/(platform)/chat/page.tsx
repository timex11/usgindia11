'use client';

import { useState } from 'react';
import { WorkspaceSidebar } from '@/components/chat/WorkspaceSidebar';
import { ChannelList } from '@/components/chat/ChannelList';
import { WorkspaceChatArea } from '@/components/chat/WorkspaceChatArea';

const MOCK_WORKSPACES = [
  { id: '1', name: 'Engineering', iconUrl: '' },
  { id: '2', name: 'Design', iconUrl: '' },
  { id: '3', name: 'Marketing', iconUrl: '' },
];

const MOCK_CHANNELS = {
  '1': [
    { id: 'c1', name: 'general', type: 'text' as const },
    { id: 'c2', name: 'frontend-dev', type: 'text' as const },
    { id: 'c3', name: 'backend-dev', type: 'text' as const },
    { id: 'v1', name: 'Standup Room', type: 'voice' as const },
  ],
  '2': [
    { id: 'c4', name: 'general', type: 'text' as const },
    { id: 'c5', name: 'ui-ux', type: 'text' as const },
  ],
  '3': [
    { id: 'c6', name: 'general', type: 'text' as const },
    { id: 'c7', name: 'campaigns', type: 'text' as const },
  ]
};

export default function ChatPage() {
  const [activeWorkspaceId, setActiveWorkspaceId] = useState('1');
  const [activeChannelId, setActiveChannelId] = useState('c1');

  const handleSelectWorkspace = (id: string) => {
    setActiveWorkspaceId(id);
    if (id !== 'dms' && MOCK_CHANNELS[id as keyof typeof MOCK_CHANNELS]) {
      setActiveChannelId(MOCK_CHANNELS[id as keyof typeof MOCK_CHANNELS][0].id);
    }
  };

  const currentWorkspace = MOCK_WORKSPACES.find(w => w.id === activeWorkspaceId);
  const currentChannels = MOCK_CHANNELS[activeWorkspaceId as keyof typeof MOCK_CHANNELS] || [];
  const currentChannel = currentChannels.find(c => c.id === activeChannelId) || { id: 'dms', name: 'Direct Messages', type: 'text' };

  return (
    <div className="flex h-[calc(100vh-8rem)] -mt-6 -mx-6 overflow-hidden bg-white dark:bg-[#313338] rounded-xl shadow-lg border border-slate-200/50 dark:border-slate-800/50">
      <WorkspaceSidebar 
        workspaces={MOCK_WORKSPACES} 
        activeWorkspaceId={activeWorkspaceId} 
        onSelectWorkspace={handleSelectWorkspace} 
      />
      
      {activeWorkspaceId !== 'dms' && currentWorkspace && (
        <ChannelList 
          workspace={{ name: currentWorkspace.name, channels: currentChannels }} 
          activeChannelId={activeChannelId}
          onSelectChannel={setActiveChannelId}
        />
      )}
      
      <WorkspaceChatArea channel={currentChannel} />
    </div>
  );
}
