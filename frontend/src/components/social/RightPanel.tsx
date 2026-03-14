import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { TrendingUp, Users } from 'lucide-react';

export function RightPanel() {
  const suggestedUsers = [
    { id: '1', name: 'Dr. Sarah Connor', handle: 'sarah_c', role: 'AI Researcher' },
    { id: '2', name: 'John Doe', handle: 'johndoe', role: 'Software Engineer' },
    { id: '3', name: 'Alice Smith', handle: 'alice_s', role: 'Product Manager' },
  ];

  const trendingTopics = [
    { id: '1', topic: '#AIinHealthcare', posts: '1.2k' },
    { id: '2', topic: 'Quarterly Review', posts: '850' },
    { id: '3', topic: 'New Campus Opening', posts: '540' },
  ];

  return (
    <div className="hidden lg:block w-80 space-y-6">
      <Card className="shadow-sm border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-sm font-semibold text-slate-900 dark:text-slate-100">
            <TrendingUp className="w-4 h-4 mr-2 text-brand-primary" />
            Trending Internally
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {trendingTopics.map((item) => (
            <div key={item.id} className="cursor-pointer group">
              <p className="font-medium text-sm group-hover:text-brand-primary transition-colors text-slate-800 dark:text-slate-200">
                {item.topic}
              </p>
              <p className="text-xs text-slate-500">{item.posts} posts</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="shadow-sm border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-sm font-semibold text-slate-900 dark:text-slate-100">
            <Users className="w-4 h-4 mr-2 text-brand-primary" />
            Suggested Connections
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {suggestedUsers.map((user) => (
            <div key={user.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-3 overflow-hidden">
                <Avatar className="w-8 h-8">
                  <AvatarImage src="" />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="truncate">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate hover:underline cursor-pointer">{user.name}</p>
                  <p className="text-xs text-slate-500 truncate">{user.role}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="h-7 text-xs rounded-full ml-2">
                Follow
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
      
      <div className="text-xs text-slate-500 px-4 flex flex-wrap gap-2">
        <a href="#" className="hover:underline">Terms of Service</a>
        <a href="#" className="hover:underline">Privacy Policy</a>
        <a href="#" className="hover:underline">Cookie Policy</a>
        <span>© 2026 USGIndia</span>
      </div>
    </div>
  );
}
