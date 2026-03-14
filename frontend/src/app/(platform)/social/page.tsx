'use client';

import { Feed } from '@/components/social/Feed';
import { RightPanel } from '@/components/social/RightPanel';

export default function SocialPage() {
  return (
    <div className="flex flex-col lg:flex-row gap-6 max-w-5xl mx-auto h-full pb-8">
      <Feed />
      <RightPanel />
    </div>
  );
}
